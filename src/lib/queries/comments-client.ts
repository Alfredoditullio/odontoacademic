/**
 * Polling-friendly fetcher de comentarios para el client side.
 *
 * Diseño escalable:
 *  - Solo trae comments NUEVOS desde un cursor `since` (greater-than created_at).
 *    Cuando no hay novedades, devuelve [] sin payload — la query es sub-ms con
 *    el índice (post_id, created_at).
 *  - El client mantiene la lista localmente y appendea solo lo nuevo. No
 *    refetcheamos los 200 comments cada 10s.
 *  - Usa el browser client (cookies); RLS aplica.
 */

import { supabase } from '@/lib/supabase';
import type { CommentWithAuthor } from '@/lib/types';

const COMMENT_SELECT = `
  id, post_id, author_id, body, is_deleted, created_at,
  author:profiles!comments_author_id_fkey (
    id, handle, display_name, avatar_url, avatar_color,
    specialty, country, city, role, study_year, university
  )
`.trim();

interface RawProfileRow {
  id: string;
  handle: string | null;
  display_name: string;
  avatar_url: string | null;
  avatar_color: string | null;
  specialty: string | null;
  country: string | null;
  city: string | null;
  role: 'member' | 'moderator' | 'admin' | 'student' | 'professional';
  study_year: number | null;
  university: string | null;
}

interface RawCommentRow {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  is_deleted: boolean;
  created_at: string;
  author: RawProfileRow | RawProfileRow[] | null;
}

function pickOne<T>(value: T | T[] | null): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value;
}

function rowToComment(row: RawCommentRow): CommentWithAuthor | null {
  const author = pickOne(row.author);
  if (!author) return null;
  return {
    id: row.id,
    post_id: row.post_id,
    author_id: row.author_id,
    body: row.body,
    is_deleted: row.is_deleted,
    created_at: row.created_at,
    author: {
      user_id: author.id,
      handle: author.handle ?? '',
      display_name: author.display_name,
      avatar_url: author.avatar_url,
      bio: null,
      specialty: author.specialty,
      country: author.country,
      city: author.city,
      phone: null, website: null, accepts_referrals: false,
      reputation_points: 0, follower_count: 0, following_count: 0,
      rules_accepted_at: null,
      role: (author.role === 'professional' ? 'member' : author.role) as 'member' | 'moderator' | 'admin' | 'student',
      study_year: author.study_year,
      university: author.university,
      created_at: '', updated_at: '',
    },
  };
}

/**
 * Trae comentarios estrictamente posteriores a `since` (timestamp ISO).
 * Si `since` es null, no trae nada (asumimos que la lista inicial vino del SSR).
 */
export async function fetchNewCommentsSince(
  postId: string,
  since: string,
): Promise<CommentWithAuthor[]> {
  const { data, error } = await supabase
    .from('comments')
    .select(COMMENT_SELECT)
    .eq('post_id', postId)
    .eq('is_deleted', false)
    .gt('created_at', since)
    .order('created_at', { ascending: true })
    .limit(50); // batch cap por seguridad

  if (error) {
    console.error('[fetchNewCommentsSince]', error);
    return [];
  }

  return (data as unknown as RawCommentRow[])
    .map(rowToComment)
    .filter((c): c is CommentWithAuthor => c !== null);
}
