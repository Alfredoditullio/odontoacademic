'use server';

/**
 * Server Actions de la comunidad: writes desde formularios y client islands.
 *
 * Diseño escalable:
 *  - Toda la validación y autorización vive acá. RLS de Supabase es la última
 *    barrera, no la primera.
 *  - Devolvemos un shape `{ ok: true, data } | { ok: false, error }` consistente
 *    para que los client components manejen errores sin tirar excepciones que
 *    crashean componentes en streaming.
 *  - revalidatePath quirúrgico: solo invalida la ruta afectada, no todo el sitio.
 */

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

const MAX_TITLE   = 200;
const MAX_BODY    = 10_000;
const MAX_COMMENT = 2_000;

/* ─────────────── Crear post ─────────────── */

export interface CreatePostInput {
  categorySlug: string;
  title: string;
  body: string;
  postType?: 'help' | 'resolved' | 'debate' | 'general' | null;
  attachmentUrls?: string[];
  metadata?: Record<string, unknown>;
  /** Poll opcional. Si presente, se crea junto con el post. */
  poll?: {
    question: string;
    options: string[];      // 2-6 opciones
    multipleChoice?: boolean;
  };
}

export async function createPost(input: CreatePostInput): Promise<ActionResult<{ id: string }>> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'No autenticado' };

  const title = input.title.trim();
  const body  = input.body.trim();
  if (title.length < 5)              return { ok: false, error: 'El título es muy corto (mínimo 5 caracteres)' };
  if (title.length > MAX_TITLE)      return { ok: false, error: `Título muy largo (máx ${MAX_TITLE})` };
  if (body.length  < 10)             return { ok: false, error: 'El contenido es muy corto (mínimo 10 caracteres)' };
  if (body.length  > MAX_BODY)       return { ok: false, error: `Contenido muy largo (máx ${MAX_BODY})` };

  // Validación del poll (si vino)
  if (input.poll) {
    const opts = input.poll.options.map((o) => o.trim()).filter(Boolean);
    if (opts.length < 2 || opts.length > 6) {
      return { ok: false, error: 'Una encuesta requiere entre 2 y 6 opciones' };
    }
    if (input.poll.question.trim().length < 5) {
      return { ok: false, error: 'La pregunta de la encuesta es muy corta' };
    }
  }

  const { data, error } = await supabase
    .from('posts')
    .insert({
      author_id:        user.id,
      category_slug:    input.categorySlug,
      title,
      body,
      post_type:        input.postType ?? null,
      attachment_urls:  input.attachmentUrls ?? [],
      metadata:         input.metadata ?? {},
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error('[createPost]', error);
    return { ok: false, error: error?.message ?? 'No se pudo crear el post' };
  }

  // Si hay poll, lo creamos referenciando el post recién creado.
  if (input.poll) {
    const opts = input.poll.options.map((o) => o.trim()).filter(Boolean);
    const { error: pollErr } = await supabase
      .from('polls')
      .insert({
        post_id: data.id,
        question: input.poll.question.trim(),
        options: opts,
        multiple_choice: input.poll.multipleChoice ?? false,
      });
    if (pollErr) {
      console.error('[createPost.poll]', pollErr);
      // No revertimos el post; el poll es opcional. Logueamos y seguimos.
    }
  }

  // Invalidar el feed y la categoría
  revalidatePath('/comunidad');
  revalidatePath(`/comunidad/c/${input.categorySlug}`);

  return { ok: true, data: { id: data.id } };
}

/* ─────────────── Toggle like ─────────────── */

export async function toggleLike(postId: string): Promise<ActionResult<{ liked: boolean }>> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'No autenticado' };

  // ¿Ya dio like?
  const { data: existing } = await supabase
    .from('likes')
    .select('post_id')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', user.id)
      .eq('post_id', postId);
    if (error) return { ok: false, error: error.message };
    revalidatePath(`/comunidad/p/${postId}`);
    return { ok: true, data: { liked: false } };
  }

  const { error } = await supabase
    .from('likes')
    .insert({ user_id: user.id, post_id: postId });
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/comunidad/p/${postId}`);
  return { ok: true, data: { liked: true } };
}

/* ─────────────── Crear comentario ─────────────── */

export async function createComment(
  postId: string,
  body: string,
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'No autenticado' };

  const trimmed = body.trim();
  if (trimmed.length < 1)              return { ok: false, error: 'El comentario está vacío' };
  if (trimmed.length > MAX_COMMENT)    return { ok: false, error: `Comentario muy largo (máx ${MAX_COMMENT})` };

  const { data, error } = await supabase
    .from('comments')
    .insert({ post_id: postId, author_id: user.id, body: trimmed })
    .select('id')
    .single();

  if (error || !data) {
    console.error('[createComment]', error);
    return { ok: false, error: error?.message ?? 'No se pudo comentar' };
  }

  // No revalidamos aquí porque el realtime se encarga de propagar a otros viewers.
  // El cliente local hace optimistic update. Pero igual revalidamos por SEO/visitors anónimos.
  revalidatePath(`/comunidad/p/${postId}`);
  return { ok: true, data: { id: data.id } };
}

/* ─────────────── Marcar notificaciones como leídas ─────────────── */

export async function markAllNotificationsRead(): Promise<ActionResult<{ updated: number }>> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'No autenticado' };

  const { data, error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .is('read_at', null)
    .select('id');

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: { updated: data?.length ?? 0 } };
}
