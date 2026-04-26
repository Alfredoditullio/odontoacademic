'use server';

/**
 * Server actions del perfil del usuario actual.
 *  - updateMyProfile: persiste a `public.profiles` (RLS asegura que solo
 *    actualizás tu propia fila).
 *  - El upload del avatar va directo desde el cliente al bucket `community`
 *    via supabase.storage; acá solo guardamos la URL.
 */

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export interface UpdateProfileInput {
  display_name?: string;
  handle?: string | null;
  bio?: string | null;
  specialty?: string | null;
  country?: string | null;
  city?: string | null;
  phone?: string | null;
  website?: string | null;
  accepts_referrals?: boolean;
  avatar_url?: string | null;
  avatar_color?: string | null;
  role?: 'professional' | 'student' | 'member';
  study_year?: number | null;
  university?: string | null;
}

export async function updateMyProfile(
  input: UpdateProfileInput,
): Promise<ActionResult<void>> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'No autenticado' };

  // Whitelist de campos. Cualquier propiedad fuera de esto se ignora.
  const allowed: (keyof UpdateProfileInput)[] = [
    'display_name', 'handle', 'bio', 'specialty', 'country', 'city',
    'phone', 'website', 'accepts_referrals', 'avatar_url', 'avatar_color',
    'role', 'study_year', 'university',
  ];

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (input[key] !== undefined) update[key] = input[key];
  }

  // Validaciones cheap antes del round-trip
  if (typeof update.display_name === 'string' && update.display_name.trim().length < 2) {
    return { ok: false, error: 'El nombre es muy corto' };
  }
  if (typeof update.handle === 'string' && update.handle.length > 0 && !/^[a-z0-9-]{3,30}$/.test(update.handle)) {
    return { ok: false, error: 'Handle inválido. Solo minúsculas, números y guiones (3–30 caracteres).' };
  }

  const { error } = await supabase
    .from('profiles')
    .update(update)
    .eq('id', user.id);

  if (error) {
    console.error('[updateMyProfile]', error);
    // Mensaje amigable para conflicto de handle único
    if (error.code === '23505') return { ok: false, error: 'Ese handle ya está ocupado.' };
    return { ok: false, error: error.message };
  }

  revalidatePath('/comunidad');
  if (typeof input.handle === 'string') {
    revalidatePath(`/comunidad/u/${input.handle}`);
  }
  return { ok: true, data: undefined };
}
