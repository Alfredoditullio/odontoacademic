'use server';

/**
 * Voto en encuesta. Delega al RPC `vote_poll` que es atómico:
 *  - single-choice: reemplaza voto previo del usuario
 *  - multiple-choice: toggle del option_index para este usuario
 */

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function votePoll(
  pollId: string,
  optionIndex: number,
  postId?: string,
): Promise<ActionResult<void>> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'No autenticado' };

  const { error } = await supabase.rpc('vote_poll', {
    p_poll_id: pollId,
    p_option_index: optionIndex,
  });

  if (error) {
    console.error('[votePoll]', error);
    return { ok: false, error: error.message };
  }

  if (postId) revalidatePath(`/comunidad/p/${postId}`);
  return { ok: true, data: undefined };
}
