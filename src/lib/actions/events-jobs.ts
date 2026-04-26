'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

/* ─────────────── Events ─────────────── */

export interface CreateEventInput {
  title: string;
  description?: string | null;
  event_type: 'webinar' | 'congress' | 'course' | 'meetup' | 'workshop' | 'fair';
  region: 'Online' | 'LATAM' | 'España' | 'Europa' | 'Norteamérica' | 'Asia';
  country?: string | null;
  city?: string | null;
  specialty?: string | null;
  starts_at: string;
  ends_at?: string | null;
  event_url?: string | null;
  registration_url?: string | null;
  is_free: boolean;
  price?: string | null;
  image_url?: string | null;
}

export async function createEvent(input: CreateEventInput): Promise<ActionResult<{ id: string }>> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'No autenticado' };

  const t = input.title.trim();
  if (t.length < 5) return { ok: false, error: 'Título muy corto' };
  if (!input.starts_at) return { ok: false, error: 'Fecha requerida' };

  const { data, error } = await supabase
    .from('events')
    .insert({ ...input, title: t, author_id: user.id })
    .select('id')
    .single();

  if (error || !data) return { ok: false, error: error?.message ?? 'No se pudo crear el evento' };

  revalidatePath('/comunidad/eventos');
  return { ok: true, data: { id: data.id } };
}

/* ─────────────── Jobs ─────────────── */

export interface CreateJobInput {
  title: string;
  clinic?: string | null;
  job_type: 'empleado' | 'socio' | 'guardia' | 'reemplazo' | 'docente' | 'investigacion';
  modality: 'presencial' | 'hibrido' | 'remoto';
  specialty?: string | null;
  city: string;
  country: string;
  description: string;
  requirements?: string[];
  contact: string;
  is_paid: boolean;
  salary_range?: string | null;
}

export async function createJob(input: CreateJobInput): Promise<ActionResult<{ id: string }>> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'No autenticado' };

  const t = input.title.trim();
  const d = input.description.trim();
  if (t.length < 5)   return { ok: false, error: 'Título muy corto' };
  if (d.length < 20)  return { ok: false, error: 'Descripción muy corta (mínimo 20 caracteres)' };
  if (!input.contact.trim()) return { ok: false, error: 'Contacto requerido' };

  const { data, error } = await supabase
    .from('jobs')
    .insert({
      ...input,
      title: t,
      description: d,
      requirements: input.requirements ?? [],
      author_id: user.id,
    })
    .select('id')
    .single();

  if (error || !data) return { ok: false, error: error?.message ?? 'No se pudo crear la oferta' };

  revalidatePath('/comunidad/trabajo');
  return { ok: true, data: { id: data.id } };
}
