'use server';

/**
 * Server Actions de mensajería privada.
 *
 * Diseño escalable:
 *  - `getOrCreateConversation` se delega al RPC SQL `get_or_create_conversation`
 *    que es atómico (UPSERT con orden canónico user_a < user_b). Cero race
 *    conditions cuando 2 users abren chat al mismo tiempo.
 *  - `sendMessage` valida y mete una sola row; el trigger de SQL actualiza
 *    contadores y previews.
 *  - `markRead` delega al RPC `mark_conversation_read` que hace 2 UPDATEs
 *    server-side en una transacción. Esto evita que el cliente tenga que
 *    coordinar.
 */

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

const MAX_BODY = 4000;

/**
 * Devuelve la `conversation_id` con `otherUserId` (la crea si no existe).
 * Idempotente.
 */
export async function getOrCreateConversation(
  otherUserId: string,
): Promise<ActionResult<{ conversationId: string }>> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'No autenticado' };
  if (user.id === otherUserId) return { ok: false, error: 'No podés conversar con vos mismo' };

  const { data, error } = await supabase.rpc('get_or_create_conversation', {
    other_user_id: otherUserId,
  });

  if (error || !data) {
    console.error('[getOrCreateConversation]', error);
    return { ok: false, error: error?.message ?? 'No se pudo abrir la conversación' };
  }

  return { ok: true, data: { conversationId: data as string } };
}

/**
 * Inserta un mensaje en la conversación. Validación de longitud + sender
 * coherente con el usuario autenticado (RLS lo enforza también).
 */
export async function sendMessage(
  conversationId: string,
  body: string,
): Promise<ActionResult<{ id: string; createdAt: string }>> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'No autenticado' };

  const trimmed = body.trim();
  if (trimmed.length < 1)        return { ok: false, error: 'Mensaje vacío' };
  if (trimmed.length > MAX_BODY) return { ok: false, error: `Mensaje muy largo (máx ${MAX_BODY})` };

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id:       user.id,
      body:            trimmed,
    })
    .select('id, created_at')
    .single();

  if (error || !data) {
    console.error('[sendMessage]', error);
    return { ok: false, error: error?.message ?? 'No se pudo enviar' };
  }

  // No revalidamos la lista en el path porque el realtime + el trigger
  // SQL ya actualizaron la conversation. Sí revalidamos para visitantes
  // sin sesión activa.
  revalidatePath('/comunidad/mensajes');
  return { ok: true, data: { id: data.id, createdAt: data.created_at } };
}

/**
 * Marca la conversación como leída para el usuario actual: resetea su
 * contador y pone `read_at` a los mensajes que recibió.
 */
export async function markConversationRead(
  conversationId: string,
): Promise<ActionResult<void>> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'No autenticado' };

  const { error } = await supabase.rpc('mark_conversation_read', {
    conv_id: conversationId,
  });

  if (error) {
    console.error('[markConversationRead]', error);
    return { ok: false, error: error.message };
  }

  return { ok: true, data: undefined };
}
