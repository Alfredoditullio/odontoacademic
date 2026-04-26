/**
 * Server-side data layer para la comunidad.
 *
 * Diseño escalable:
 *  - Todo se ejecuta en Server Components (cero shipping de Supabase JS al
 *    bundle del feed/listing).
 *  - Las queries vienen con paginación obligatoria; el feed nunca devuelve
 *    "todos los posts".
 *  - El join de author/category se hace una sola vez via PostgREST embedding,
 *    en lugar de N+1 queries.
 *  - Los counters (like_count, comment_count) viven en la fila del post,
 *    mantenidos por trigger SQL — el cliente no calcula nada.
 */

import { createSupabaseServerClient } from '@/lib/supabase-server';
import type {
  PostWithAuthor,
  CommentWithAuthor,
  Category,
  Profile,
} from '@/lib/types';

/* ───────────── Helpers de embedding (PostgREST) ───────────── */

const POST_SELECT = `
  id, author_id, category_slug, title, body, attachment_urls,
  post_type, like_count, comment_count, metadata, is_pinned, is_deleted,
  created_at, updated_at,
  author:profiles!posts_author_id_fkey (
    id, handle, display_name, avatar_url, avatar_color,
    bio, specialty, country, city, phone, website, accepts_referrals,
    reputation_points, follower_count, following_count, rules_accepted_at,
    role, study_year, university, created_at, updated_at
  ),
  category:categories!posts_category_slug_fkey (
    slug, name, description, icon, color, sort_order, post_policy
  )
`.trim();

const COMMENT_SELECT = `
  id, post_id, author_id, body, is_deleted, created_at,
  author:profiles!comments_author_id_fkey (
    id, handle, display_name, avatar_url, avatar_color,
    specialty, country, city, role
  )
`.trim();

/**
 * Adaptador: el shape que devuelve PostgREST con embed (`author.id`)
 * difiere del shape `Profile` del frontend (`user_id`). Lo normalizamos
 * en un solo lugar para no contaminar todo el codebase.
 */
interface RawProfileRow {
  id: string;
  handle: string | null;
  display_name: string;
  avatar_url: string | null;
  avatar_color: string | null;
  bio?: string | null;
  specialty?: string | null;
  country?: string | null;
  city?: string | null;
  phone?: string | null;
  website?: string | null;
  accepts_referrals?: boolean;
  reputation_points?: number;
  follower_count?: number;
  following_count?: number;
  rules_accepted_at?: string | null;
  role: 'member' | 'moderator' | 'admin' | 'student' | 'professional';
  study_year?: number | null;
  university?: string | null;
  created_at?: string;
  updated_at?: string;
}

function toProfile(row: RawProfileRow): Profile {
  return {
    user_id: row.id,
    handle: row.handle ?? '',
    display_name: row.display_name,
    avatar_url: row.avatar_url,
    bio: row.bio ?? null,
    specialty: row.specialty ?? null,
    country: row.country ?? null,
    city: row.city ?? null,
    phone: row.phone ?? null,
    website: row.website ?? null,
    accepts_referrals: row.accepts_referrals ?? false,
    reputation_points: row.reputation_points ?? 0,
    follower_count: row.follower_count ?? 0,
    following_count: row.following_count ?? 0,
    rules_accepted_at: row.rules_accepted_at ?? null,
    role: (row.role === 'professional' ? 'member' : row.role) as Profile['role'],
    study_year: row.study_year ?? null,
    university: row.university ?? null,
    created_at: row.created_at ?? new Date(0).toISOString(),
    updated_at: row.updated_at ?? new Date(0).toISOString(),
  };
}

interface RawPostRow {
  id: string;
  author_id: string;
  category_slug: string;
  title: string;
  body: string;
  attachment_urls: string[];
  post_type: 'help' | 'resolved' | 'debate' | 'general' | null;
  like_count: number;
  comment_count: number;
  metadata: Record<string, unknown>;
  is_pinned: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  author: RawProfileRow | RawProfileRow[] | null;
  category: Category | Category[] | null;
}

/**
 * PostgREST devuelve los embeds como array si la FK es ambigua o como objeto
 * si es 1-to-1. Para nuestros joins (FK explícita unique-ish) viene como objeto,
 * pero el tipo generado a veces es array. Normalizamos.
 */
function pickOne<T>(value: T | T[] | null): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value;
}

function toPostWithAuthor(row: RawPostRow): PostWithAuthor | null {
  const authorRow = pickOne(row.author);
  const categoryRow = pickOne(row.category);
  if (!authorRow || !categoryRow) return null;

  return {
    id: row.id,
    author_id: row.author_id,
    category_slug: row.category_slug,
    title: row.title,
    body: row.body,
    attachment_urls: row.attachment_urls,
    post_type: row.post_type,
    like_count: row.like_count,
    comment_count: row.comment_count,
    metadata: row.metadata,
    is_pinned: row.is_pinned,
    is_deleted: row.is_deleted,
    created_at: row.created_at,
    updated_at: row.updated_at,
    author: toProfile(authorRow),
    category: categoryRow,
  };
}

/* ───────────── Queries públicas ───────────── */

export interface FeedOptions {
  /** Paginación: cuántos traer (default 20, máx 50). */
  limit?: number;
  /** Cursor: traer posts más viejos que este timestamp. */
  before?: string;
  /** Filtrar por categoría. */
  categorySlug?: string;
}

/**
 * Lista paginada del feed, ordenada por pinned primero y luego por created_at desc.
 * Pensada para el infinite scroll: pasale `before = lastPost.created_at` para la
 * próxima página.
 */
export async function getFeed(opts: FeedOptions = {}): Promise<PostWithAuthor[]> {
  const supabase = await createSupabaseServerClient();
  const limit = Math.min(opts.limit ?? 20, 50);

  let q = supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('is_deleted', false)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (opts.categorySlug) q = q.eq('category_slug', opts.categorySlug);
  if (opts.before)       q = q.lt('created_at', opts.before);

  const { data, error } = await q;
  if (error) {
    console.error('[community.getFeed]', error);
    return [];
  }
  return (data as unknown as RawPostRow[])
    .map(toPostWithAuthor)
    .filter((p): p is PostWithAuthor => p !== null);
}

export async function getPostById(id: string): Promise<PostWithAuthor | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('id', id)
    .eq('is_deleted', false)
    .maybeSingle();

  if (error) {
    console.error('[community.getPostById]', error);
    return null;
  }
  if (!data) return null;
  return toPostWithAuthor(data as unknown as RawPostRow);
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

function rowToComment(row: RawCommentRow): CommentWithAuthor | null {
  const authorRow = pickOne(row.author);
  if (!authorRow) return null;
  return {
    id: row.id,
    post_id: row.post_id,
    author_id: row.author_id,
    body: row.body,
    is_deleted: row.is_deleted,
    created_at: row.created_at,
    author: toProfile(authorRow),
  };
}

export async function getCommentsForPost(postId: string): Promise<CommentWithAuthor[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('comments')
    .select(COMMENT_SELECT)
    .eq('post_id', postId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: true })
    .limit(200);   // hard cap para no traer 10k comments en SSR

  if (error) {
    console.error('[community.getCommentsForPost]', error);
    return [];
  }

  return (data as unknown as RawCommentRow[])
    .map(rowToComment)
    .filter((c): c is CommentWithAuthor => c !== null);
}

/**
 * Trae los datos completos del perfil de un usuario por su handle, junto con:
 *  - is_following: si el usuario actual lo sigue
 *  - last_posts: últimos 5 posts del usuario
 */
export async function getProfileByHandle(handle: string): Promise<{
  profile: Profile | null;
  isFollowing: boolean;
  recentPosts: PostWithAuthor[];
}> {
  const supabase = await createSupabaseServerClient();

  const { data: profileRow, error } = await supabase
    .from('profiles')
    .select(`
      id, handle, display_name, avatar_url, avatar_color, bio,
      specialty, country, city, phone, website, accepts_referrals,
      reputation_points, follower_count, following_count, rules_accepted_at,
      role, study_year, university, created_at, updated_at
    `)
    .eq('handle', handle)
    .maybeSingle();

  if (error || !profileRow) {
    if (error) console.error('[getProfileByHandle]', error);
    return { profile: null, isFollowing: false, recentPosts: [] };
  }

  const profile = toProfile(profileRow as RawProfileRow);

  // ¿El user actual sigue a este perfil?
  const { data: { user } } = await supabase.auth.getUser();
  let isFollowing = false;
  if (user && user.id !== profile.user_id) {
    const { data: followRow } = await supabase
      .from('follows')
      .select('follower_id')
      .eq('follower_id', user.id)
      .eq('following_id', profile.user_id)
      .maybeSingle();
    isFollowing = !!followRow;
  }

  // Últimos 5 posts del autor
  const { data: postRows } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('author_id', profile.user_id)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .limit(5);

  const recentPosts = (postRows ?? []) as unknown as RawPostRow[];

  return {
    profile,
    isFollowing,
    recentPosts: recentPosts
      .map(toPostWithAuthor)
      .filter((p): p is PostWithAuthor => p !== null),
  };
}

export interface DirectoryFilters {
  search?: string;
  specialty?: string;
  country?: string;
  limit?: number;
  offset?: number;
}

export async function searchDirectory(opts: DirectoryFilters = {}): Promise<Profile[]> {
  const supabase = await createSupabaseServerClient();
  const limit = Math.min(opts.limit ?? 30, 60);
  const offset = Math.max(opts.offset ?? 0, 0);

  let q = supabase
    .from('profiles')
    .select(`
      id, handle, display_name, avatar_url, avatar_color, bio,
      specialty, country, city, phone, website, accepts_referrals,
      reputation_points, follower_count, following_count, rules_accepted_at,
      role, study_year, university, created_at, updated_at
    `)
    .order('reputation_points', { ascending: false })
    .order('follower_count',    { ascending: false })
    .range(offset, offset + limit - 1);

  if (opts.specialty) q = q.eq('specialty', opts.specialty);
  if (opts.country)   q = q.eq('country', opts.country);
  if (opts.search) {
    // ILIKE para búsqueda case-insensitive sobre nombre + handle
    const term = `%${opts.search.replace(/[%_]/g, '')}%`;
    q = q.or(`display_name.ilike.${term},handle.ilike.${term}`);
  }

  const { data, error } = await q;
  if (error) {
    console.error('[searchDirectory]', error);
    return [];
  }

  return (data as RawProfileRow[]).map(toProfile);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('categories')
    .select('slug, name, description, icon, color, sort_order, post_policy')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('[getCategoryBySlug]', error);
    return null;
  }
  return data as Category | null;
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('categories')
    .select('slug, name, description, icon, color, sort_order, post_policy')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[community.getCategories]', error);
    return [];
  }
  return (data ?? []) as Category[];
}

/**
 * Devuelve el set de post_ids en los que el usuario actual ya dio like.
 * Optimización: en vez de N queries para "¿el user likeó este post?", una sola
 * query que devuelve un Set; el feed la consulta una vez y los PostCard lo leen.
 */
export async function getLikedPostIdsForCurrentUser(postIds: string[]): Promise<Set<string>> {
  if (postIds.length === 0) return new Set();
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data, error } = await supabase
    .from('likes')
    .select('post_id')
    .eq('user_id', user.id)
    .in('post_id', postIds);

  if (error) {
    console.error('[community.getLikedPostIdsForCurrentUser]', error);
    return new Set();
  }
  return new Set((data ?? []).map((r) => r.post_id as string));
}

/**
 * Trae el poll de un post (si tiene), con el tally por opción y el índice
 * que el usuario actual ya votó (si vino logueado).
 */
export interface PollData {
  id: string;
  question: string;
  options: string[];
  multiple_choice: boolean;
  closes_at: string | null;
  totals: number[];
  /** Índices que el usuario actual ya votó (vacío si no votó / no logueado). */
  myVoteIndices: number[];
  totalVotes: number;
}

export async function getPollForPost(postId: string): Promise<PollData | null> {
  const supabase = await createSupabaseServerClient();

  const { data: pollRow } = await supabase
    .from('polls')
    .select('id, question, options, multiple_choice, closes_at')
    .eq('post_id', postId)
    .maybeSingle();

  if (!pollRow) return null;
  const options = pollRow.options as string[];

  // Tally agregado por option_index
  const { data: voteRows } = await supabase
    .from('poll_votes')
    .select('option_index, user_id')
    .eq('poll_id', pollRow.id);

  const totals = new Array(options.length).fill(0) as number[];
  for (const v of voteRows ?? []) totals[v.option_index as number] += 1;

  const { data: { user } } = await supabase.auth.getUser();
  const myVoteIndices = user
    ? (voteRows ?? []).filter((v) => v.user_id === user.id).map((v) => v.option_index as number)
    : [];

  return {
    id: pollRow.id,
    question: pollRow.question,
    options,
    multiple_choice: pollRow.multiple_choice,
    closes_at: pollRow.closes_at,
    totals,
    myVoteIndices,
    totalVotes: totals.reduce((a, b) => a + b, 0),
  };
}

/**
 * Conteo de notificaciones no leídas del usuario actual (para el badge en TopNav).
 * Cheap: usa el índice (user_id, read_at, created_at).
 */
export async function getUnreadNotificationCount(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .is('read_at', null);

  if (error) {
    console.error('[community.getUnreadNotificationCount]', error);
    return 0;
  }
  return count ?? 0;
}
