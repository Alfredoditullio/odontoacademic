'use client';

/**
 * Hook que encapsula el flow completo de submit desde cualquier modal especializado:
 *  1. Sube las imágenes a Storage en paralelo (si hay).
 *  2. Llama a createPost con la categoría + metadata específica.
 *  3. Redirige al detail del post creado y cierra el modal.
 *
 * Cada modal específico (Clinical, Market, etc.) le pasa su propia metadata.
 */

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { uploadCommunityImage } from '@/lib/storage/community-images';
import { createPost, type CreatePostInput } from '@/lib/actions/community';

export interface SubmitPostArgs {
  categorySlug: string;
  title: string;
  body: string;
  postType?: 'help' | 'resolved' | 'debate' | 'general' | null;
  /** Files locales que se suben antes de crear el post. */
  images?: File[];
  /** Metadata específica del bloque (mercado, presentación, marketing, etc.). */
  metadata?: Record<string, unknown>;
  /** Encuesta opcional. */
  poll?: CreatePostInput['poll'];
}

interface UseSubmitOptions {
  /** Callback opcional al crear con éxito (antes del redirect). */
  onPosted?: (postId: string) => void;
}

export function useSubmitPostFromModal(opts: UseSubmitOptions = {}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);

  function submit(args: SubmitPostArgs) {
    setError(null);
    setProgress(null);

    startTransition(async () => {
      // 1. Upload de imágenes (si hay)
      let attachmentUrls: string[] = [];
      if (args.images && args.images.length > 0) {
        setProgress(`Subiendo ${args.images.length} imagen${args.images.length > 1 ? 'es' : ''}...`);
        const results = await Promise.all(
          args.images.map((f) => uploadCommunityImage(f, { folder: 'posts' })),
        );
        const failed = results.find((r) => !r.ok);
        if (failed && !failed.ok) {
          setError(`No se pudo subir una imagen: ${failed.error}`);
          setProgress(null);
          return;
        }
        attachmentUrls = results
          .filter((r): r is Extract<typeof r, { ok: true }> => r.ok)
          .map((r) => r.url);
        setProgress(null);
      }

      // 2. Crear el post
      const res = await createPost({
        categorySlug:   args.categorySlug,
        title:          args.title,
        body:           args.body,
        postType:       args.postType ?? null,
        attachmentUrls,
        metadata:       args.metadata ?? {},
        poll:           args.poll,
      });

      if (!res.ok) {
        setError(res.error);
        return;
      }

      opts.onPosted?.(res.data.id);
      router.push(`/comunidad/p/${res.data.id}`);
    });
  }

  return { submit, pending, error, progress, setError };
}
