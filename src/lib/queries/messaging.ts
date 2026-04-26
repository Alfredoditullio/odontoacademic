/**
 * Server-side queries de mensajería.
 *
 * Diseño escalable:
 *  - `getMyConversations` hace UN SOLO select indexado a `conversations`
 *    + embed del otro participante. La lista con badges de unread es O(N)
 *    sobre el número de conversaciones del usuario, no del universo.
 *  - `getConversationByHandle` resuelve handle → user_id → conversation_id
 *    (y la crea si hace falta) en una server action separada.
 *  - `getMessages` paginado con cursor `before` (timestamp). Para el chat
 *    siempre traemos los últimos N (default 50) y vamos hacia atrás.
 */

import { createSupabaseServerClient } from '@/lib/supabase-server';
import type { Profile } from '@/lib/types';

/* ─────────────── Conversations ─────────────── */

export interface ConversationListItem {
  id: string;
  other: {
    user_id: string;
    handle: string;
    display_name: string;
    avatar_url: string | null;
    avatar_color: string | null;
    specialty: string | null;
    country: string | null;
  };
  last_message_at: string | null;
  last_message_preview: string | null;
  last_sender_is_me: boolean;
  unread: number;
}

interface RawProfileEmbed {
  id: string;
  handle: string | null;
  display_name: string;
  avatar_url: string | null;
  avatar_color: string | null;
  specialty: string | null;
  country: string | null;
}

interface RawConversationRow {
  id: string;
  user_a: string;
  user_b: string;
  last_message_at: string | null;
  last_message_preview: string | null;
  last_sender_id: string | null;
  unread_for_a: number;
  unread_for_b: number;
  user_a_profile: RawProfileEmbed | RawProfileEmbed[] | null;
  user_b_profile: RawProfileEmbed | RawProfileEmbed[] | null;
}

function pickOne<T>(value: T | T[] | null): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value;
}

export async function getMyConversations(): Promise<ConversationListItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('conversations')
    .select(`
      id, user_a, user_b,
      last_message_at, last_message_preview, last_sender_id,
      unread_for_a, unread_for_b,
      user_a_profile:profiles!conversations_user_a_fkey (
        id, handle, display_name, avatar_url, avatar_color, specialty, country
      ),
      user_b_profile:profiles!conversations_user_b_fkey (
        id, handle, display_name, avatar_url, avatar_color, specialty, country
      )
    `)
    .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
    .order('last_message_at', { ascending: false, nullsFirst: false })
    .limit(100);

  if (error) {
    console.error('[getMyConversations]', error);
    return [];
  }

  return (data as unknown as RawConversationRow[])
    .map((row): ConversationListItem | null => {
      const meIsA = row.user_a === user.id;
      const otherEmbed = pickOne(meIsA ? row.user_b_profile : row.user_a_profile);
      if (!otherEmbed) return null;
      return {
        id: row.id,
        other: {
          user_id: otherEmbed.id,
          handle: otherEmbed.handle ?? '',
          display_name: otherEmbed.display_name,
          avatar_url: otherEmbed.avatar_url,
          avatar_color: otherEmbed.avatar_color,
          specialty: otherEmbed.specialty,
          country: otherEmbed.country,
        },
        last_message_at: row.last_message_at,
        last_message_preview: row.last_message_preview,
        last_sender_is_me: row.last_sender_id === user.id,
        unread: meIsA ? row.unread_for_a : row.unread_for_b,
      };
    })
    .filter((c): c is ConversationListItem => c !== null);
}

/**
 * Resuelve un handle a la conversación (no la crea acá; eso es server action).
 * Devuelve también el perfil del otro user para el header del chat.
 */
export async function getConversationContextByHandle(handle: string): Promise<{
  other: Profile | null;
  conversationId: string | null;
}> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { other: null, conversationId: null };

  // 1. Buscar el otro perfil por handle
  const { data: otherRow } = await supabase
    .from('profiles')
    .select(`
      id, handle, display_name, avatar_url, avatar_color, bio, specialty,
      country, city, role, study_year, university, accepts_referrals,
      reputation_points, follower_count, following_count,
      created_at, updated_at
    `)
    .eq('handle', handle)
    .maybeSingle();

  if (!otherRow) return { other: null, conversationId: null };

  const other: Profile = {
    user_id: otherRow.id,
    handle: otherRow.handle ?? '',
    display_name: otherRow.display_name,
    avatar_url: otherRow.avatar_url,
    bio: otherRow.bio,
    specialty: otherRow.specialty,
    country: otherRow.country,
    city: otherRow.city,
    phone: null, website: null,
    accepts_referrals: otherRow.accepts_referrals ?? false,
    reputation_points: otherRow.reputation_points ?? 0,
    follower_count: otherRow.follower_count ?? 0,
    following_count: otherRow.following_count ?? 0,
    rules_accepted_at: null,
    role: (otherRow.role === 'professional' ? 'member' : otherRow.role) as Profile['role'],
    study_year: otherRow.study_year ?? null,
    university: otherRow.university ?? null,
    created_at: otherRow.created_at,
    updated_at: otherRow.updated_at,
  };

  // 2. Buscar conversación existente (si la hay) — orden canónico
  const [a, b] = user.id < other.user_id
    ? [user.id, other.user_id]
    : [other.user_id, user.id];

  const { data: conv } = await supabase
    .from('conversations')
    .select('id')
    .eq('user_a', a)
    .eq('user_b', b)
    .maybeSingle();

  return { other, conversationId: conv?.id ?? null };
}

/* ─────────────── Messages ─────────────── */

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  attachment_url: string | null;
  read_at: string | null;
  created_at: string;
}

export async function getMessages(
  conversationId: string,
  opts: { limit?: number; before?: string } = {},
): Promise<ChatMessage[]> {
  const supabase = await createSupabaseServerClient();
  const limit = Math.min(opts.limit ?? 50, 200);

  let q = supabase
    .from('messages')
    .select('id, conversation_id, sender_id, body, attachment_url, read_at, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (opts.before) q = q.lt('created_at', opts.before);

  const { data, error } = await q;
  if (error) {
    console.error('[getMessages]', error);
    return [];
  }

  // Devolvemos en orden cronológico (asc) para renderizar fácil
  return ((data ?? []) as ChatMessage[]).reverse();
}

/**
 * Suma de `unread_for_X` para todas mis conversations. Sirve para el
 * badge del TopNav. La query usa el índice por user_a / user_b.
 */
export async function getTotalUnreadMessages(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { data, error } = await supabase
    .from('conversations')
    .select('user_a, user_b, unread_for_a, unread_for_b')
    .or(`user_a.eq.${user.id},user_b.eq.${user.id}`);

  if (error) {
    console.error('[getTotalUnreadMessages]', error);
    return 0;
  }

  let total = 0;
  for (const row of data ?? []) {
    if (row.user_a === user.id) total += row.unread_for_a as number;
    else                        total += row.unread_for_b as number;
  }
  return total;
}
