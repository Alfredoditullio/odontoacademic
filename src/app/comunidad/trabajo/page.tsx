/**
 * Bolsa de trabajo: listado real desde Supabase.
 */

import Link from 'next/link';
import { getJobs } from '@/lib/queries/events-jobs';

export const metadata = { title: 'Bolsa de Trabajo' };
export const revalidate = 60;

const JOB_TYPES = [
  { value: 'empleado',      label: 'Empleado/a',      color: 'bg-sky-100 text-sky-700' },
  { value: 'socio',         label: 'Socio/a',         color: 'bg-violet-100 text-violet-700' },
  { value: 'guardia',       label: 'Guardia',         color: 'bg-rose-100 text-rose-700' },
  { value: 'reemplazo',     label: 'Reemplazo',       color: 'bg-amber-100 text-amber-700' },
  { value: 'docente',       label: 'Docente',         color: 'bg-emerald-100 text-emerald-700' },
  { value: 'investigacion', label: 'Investigación',   color: 'bg-indigo-100 text-indigo-700' },
];

const TYPE_BADGE = Object.fromEntries(JOB_TYPES.map((t) => [t.value, t]));

const COUNTRIES = ['Argentina', 'México', 'Colombia', 'Chile', 'Perú', 'Uruguay', 'España'];

interface SearchParams {
  jobType?: string;
  country?: string;
}

function timeAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days === 0) return 'hoy';
  if (days === 1) return 'ayer';
  if (days < 7) return `hace ${days} días`;
  return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
}

export default async function TrabajoPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const jobs = await getJobs({
    jobType: sp.jobType || undefined,
    country: sp.country || undefined,
  });

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="material-symbols-outlined text-primary text-[28px]">work</span>
            <div className="min-w-0">
              <h1 className="text-xl font-black text-slate-900">Bolsa de trabajo</h1>
              <p className="text-sm text-slate-500">Empleos, sociedades, guardias y reemplazos en LATAM.</p>
            </div>
          </div>
          <Link
            href="/comunidad/trabajo/nueva"
            className="shrink-0 inline-flex items-center gap-2 bg-primary text-white font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-primary/90 transition shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span className="hidden sm:inline">Publicar oferta</span>
          </Link>
        </div>

        <form className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3" action="/comunidad/trabajo" method="get">
          <select name="jobType" defaultValue={sp.jobType ?? ''} className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm">
            <option value="">Todos los tipos</option>
            {JOB_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <select name="country" defaultValue={sp.country ?? ''} className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm">
            <option value="">Todos los países</option>
            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button type="submit" className="bg-primary text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-primary/90 transition">Filtrar</button>
        </form>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <span className="material-symbols-outlined text-[40px] text-slate-300">work_off</span>
          <p className="text-slate-500 mt-2">No hay ofertas activas.</p>
          <Link href="/comunidad/trabajo/nueva" className="text-primary font-semibold text-sm hover:underline mt-2 inline-block">
            Publicar la primera
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((j) => {
            const badge = TYPE_BADGE[j.job_type] ?? { label: j.job_type, color: 'bg-slate-100 text-slate-700' };
            return (
              <Link
                key={j.id}
                href={`/comunidad/trabajo/${j.id}`}
                className="block bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${badge.color}`}>{badge.label}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{j.modality}</span>
                      {!j.is_paid && <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Ad-honorem</span>}
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-primary transition">{j.title}</h3>
                    {j.clinic && <p className="text-xs text-slate-600 mt-0.5">{j.clinic}</p>}
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">location_on</span>
                      {j.city}, {j.country}
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">{timeAgo(j.created_at)}</span>
                </div>
                {j.salary_range && (
                  <p className="text-xs text-emerald-700 font-bold mt-2">{j.salary_range}</p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
