/**
 * Eventos: listado real desde Supabase, con filtros via URL params.
 */

import Link from 'next/link';
import { getEvents } from '@/lib/queries/events-jobs';

export const metadata = { title: 'Eventos' };
export const revalidate = 60;

const REGIONS     = ['Online', 'LATAM', 'España', 'Europa', 'Norteamérica', 'Asia'];
const EVENT_TYPES = [
  { value: 'webinar',  label: 'Webinar' },
  { value: 'congress', label: 'Congreso' },
  { value: 'course',   label: 'Curso' },
  { value: 'workshop', label: 'Taller' },
  { value: 'meetup',   label: 'Meetup' },
  { value: 'fair',     label: 'Feria' },
];

const TYPE_BADGE: Record<string, { label: string; color: string }> = {
  webinar:  { label: 'Webinar',  color: 'bg-violet-100 text-violet-700' },
  congress: { label: 'Congreso', color: 'bg-rose-100 text-rose-700' },
  course:   { label: 'Curso',    color: 'bg-sky-100 text-sky-700' },
  workshop: { label: 'Taller',   color: 'bg-amber-100 text-amber-700' },
  meetup:   { label: 'Meetup',   color: 'bg-emerald-100 text-emerald-700' },
  fair:     { label: 'Feria',    color: 'bg-cyan-100 text-cyan-700' },
};

interface SearchParams {
  region?: string;
  eventType?: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export default async function EventosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const events = await getEvents({
    region:    sp.region    || undefined,
    eventType: sp.eventType || undefined,
    upcomingOnly: true,
  });

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="material-symbols-outlined text-primary text-[28px]">event</span>
            <div className="min-w-0">
              <h1 className="text-xl font-black text-slate-900">Eventos dentales</h1>
              <p className="text-sm text-slate-500">Webinars, congresos, cursos y workshops de toda LATAM y el mundo.</p>
            </div>
          </div>
          <Link
            href="/comunidad/eventos/nuevo"
            className="shrink-0 inline-flex items-center gap-2 bg-primary text-white font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-primary/90 transition shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span className="hidden sm:inline">Publicar evento</span>
          </Link>
        </div>

        <form className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3" action="/comunidad/eventos" method="get">
          <select name="region" defaultValue={sp.region ?? ''} className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm">
            <option value="">Todas las regiones</option>
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select name="eventType" defaultValue={sp.eventType ?? ''} className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm">
            <option value="">Todos los tipos</option>
            {EVENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <button type="submit" className="bg-primary text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-primary/90 transition">
            Filtrar
          </button>
        </form>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <span className="material-symbols-outlined text-[40px] text-slate-300">event_busy</span>
          <p className="text-slate-500 mt-2">No hay eventos próximos con esos filtros.</p>
          <Link href="/comunidad/eventos/nuevo" className="text-primary font-semibold text-sm hover:underline mt-2 inline-block">
            Publicar el primero
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {events.map((ev) => {
            const badge = TYPE_BADGE[ev.event_type] ?? { label: ev.event_type, color: 'bg-slate-100 text-slate-700' };
            return (
              <Link
                key={ev.id}
                href={`/comunidad/eventos/${ev.id}`}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition group"
              >
                <div className="flex items-start gap-3">
                  <div className="size-12 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex flex-col items-center justify-center text-white shrink-0">
                    <span className="text-[10px] font-bold uppercase">{new Date(ev.starts_at).toLocaleDateString('es-AR', { month: 'short' })}</span>
                    <span className="text-lg font-black leading-none">{new Date(ev.starts_at).getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${badge.color}`}>{badge.label}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{ev.region}</span>
                      {ev.is_free && <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Gratis</span>}
                    </div>
                    <h3 className="font-bold text-slate-900 line-clamp-2 group-hover:text-primary transition">{ev.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatDate(ev.starts_at)}
                      {ev.country && <span> · {ev.city ? `${ev.city}, ${ev.country}` : ev.country}</span>}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
