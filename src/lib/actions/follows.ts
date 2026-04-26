'use server';

/**
 * Server Action que delega al RPC `toggle_follow` (atómico, idempotente).
 * RPC se encarga de: validar (no follow a sí mismo, target existe), insertar
 * o borrar la fila en `follows`, y devolver el nuevo estado + counter.
 */

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function toggleFollow(
  targetUserId: string,
  targetHandle?: string,
): Promise<ActionResult<{ isFollowing: boolean; followerCount: number }>> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'No autenticado' };

  const { data, error } = await supabase.rpc('toggle_follow', {
    target_user_id: targetUserId,
  });

  if (error || !data) {
    console.error('[toggleFollow]', error);
    return { ok: false, error: error?.message ?? 'No se pudo seguir' };
  }

  // El RPC devuelve { is_following, follower_count }
  const payload = data as { is_following: boolean; follower_count: number };

  if (targetHandle) {
    revalidatePath(`/comunidad/u/${targetHandle}`);
  }

  return {
    ok: true,
    data: { isFollowing: payload.is_following, followerCount: payload.follower_count },
  };
}
