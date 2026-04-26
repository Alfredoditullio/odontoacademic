/**
 * Queries server-side de eventos y bolsa de trabajo.
 * Paginación obligatoria. Filtros opcionales via search params.
 */

import { createSupabaseServerClient } from '@/lib/supabase-server';

/* ─────────────── Events ─────────────── */

export interface CommunityEventRow {
  id: string;
  author_id: string;
  title: string;
  description: string | null;
  event_type: 'webinar' | 'congress' | 'course' | 'meetup' | 'workshop' | 'fair';
  region: 'Online' | 'LATAM' | 'España' | 'Europa' | 'Norteamérica' | 'Asia';
  country: string | null;
  city: string | null;
  specialty: string | null;
  starts_at: string;
  ends_at: string | null;
  event_url: string | null;
  registration_url: string | null;
  is_free: boolean;
  price: string | null;
  image_url: string | null;
  created_at: string;
}

export interface EventsFilters {
  region?: string;
  eventType?: string;
  specialty?: string;
  upcomingOnly?: boolean;
  limit?: number;
}

export async function getEvents(opts: EventsFilters = {}): Promise<CommunityEventRow[]> {
  const supabase = await createSupabaseServerClient();
  const limit = Math.min(opts.limit ?? 30, 60);

  let q = supabase
    .from('events')
    .select('*')
    .eq('is_deleted', false)
    .order('starts_at', { ascending: true })
    .limit(limit);

  if (opts.region)    q = q.eq('region', opts.region);
  if (opts.eventType) q = q.eq('event_type', opts.eventType);
  if (opts.specialty) q = q.eq('specialty', opts.specialty);
  if (opts.upcomingOnly !== false) q = q.gte('starts_at', new Date().toISOString());

  const { data, error } = await q;
  if (error) {
    console.error('[getEvents]', error);
    return [];
  }
  return (data ?? []) as CommunityEventRow[];
}

export async function getEventById(id: string): Promise<CommunityEventRow | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .eq('is_deleted', false)
    .maybeSingle();
  if (error) console.error('[getEventById]', error);
  return (data as CommunityEventRow | null) ?? null;
}

/* ─────────────── Jobs ─────────────── */

export interface JobRow {
  id: string;
  author_id: string;
  title: string;
  clinic: string | null;
  job_type: 'empleado' | 'socio' | 'guardia' | 'reemplazo' | 'docente' | 'investigacion';
  modality: 'presencial' | 'hibrido' | 'remoto';
  specialty: string | null;
  city: string;
  country: string;
  description: string;
  requirements: string[];
  contact: string;
  is_paid: boolean;
  salary_range: string | null;
  is_filled: boolean;
  created_at: string;
}

export interface JobsFilters {
  jobType?: string;
  country?: string;
  specialty?: string;
  limit?: number;
}

export async function getJobs(opts: JobsFilters = {}): Promise<JobRow[]> {
  const supabase = await createSupabaseServerClient();
  const limit = Math.min(opts.limit ?? 30, 60);

  let q = supabase
    .from('jobs')
    .select('*')
    .eq('is_deleted', false)
    .eq('is_filled', false)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (opts.jobType)   q = q.eq('job_type', opts.jobType);
  if (opts.country)   q = q.eq('country', opts.country);
  if (opts.specialty) q = q.eq('specialty', opts.specialty);

  const { data, error } = await q;
  if (error) {
    console.error('[getJobs]', error);
    return [];
  }
  return (data ?? []) as JobRow[];
}

export async function getJobById(id: string): Promise<JobRow | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .eq('is_deleted', false)
    .maybeSingle();
  if (error) console.error('[getJobById]', error);
  return (data as JobRow | null) ?? null;
}
