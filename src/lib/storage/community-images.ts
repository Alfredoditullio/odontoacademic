'use client';

/**
 * Upload de imágenes al bucket `community`.
 *
 * Diseño:
 *  - Path por usuario: `${user.id}/posts/${uuid}.ext` o `${user.id}/messages/${uuid}.ext`.
 *    La RLS del bucket exige que el primer segmento del path === auth.uid(),
 *    así un usuario no puede pisar ni borrar archivos de otro.
 *  - Bucket es público → la URL final es CDN-friendly, sin signed URL request
 *    en cada lectura. Bandwidth gratis hasta 250GB/mes en Pro.
 *  - El upload es directo desde el browser al edge de Supabase Storage,
 *    no pasa por nuestro Next.js. Eso descarga al server.
 */

import { supabase } from '@/lib/supabase';

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic'];

export type UploadResult =
  | { ok: true; url: string; path: string }
  | { ok: false; error: string };

interface UploadOptions {
  /** Subcarpeta dentro del user folder. Ej: 'posts', 'messages', 'avatars'. */
  folder: 'posts' | 'messages' | 'avatars';
}

export async function uploadCommunityImage(
  file: File,
  { folder }: UploadOptions,
): Promise<UploadResult> {
  if (file.size > MAX_BYTES) {
    return { ok: false, error: 'La imagen pesa más de 10 MB' };
  }
  if (!ALLOWED_MIME.includes(file.type)) {
    return { ok: false, error: 'Formato no soportado. Usá JPG, PNG, WebP, GIF o HEIC.' };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'No autenticado' };

  // UUID v4 random para evitar colisiones + preservar extensión
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const id  = crypto.randomUUID();
  const path = `${user.id}/${folder}/${id}.${ext}`;

  const { error } = await supabase.storage
    .from('community')
    .upload(path, file, {
      cacheControl: '31536000',   // 1 año, los archivos son inmutables (UUID en path)
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error('[uploadCommunityImage]', error);
    return { ok: false, error: error.message };
  }

  const { data: urlData } = supabase.storage.from('community').getPublicUrl(path);
  return { ok: true, url: urlData.publicUrl, path };
}

export async function deleteCommunityImage(path: string): Promise<boolean> {
  const { error } = await supabase.storage.from('community').remove([path]);
  if (error) {
    console.error('[deleteCommunityImage]', error);
    return false;
  }
  return true;
}
