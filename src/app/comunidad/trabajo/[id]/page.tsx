import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getJobById } from '@/lib/queries/events-jobs';

export const dynamic = 'force-dynamic';

const TYPE_LABELS: Record<string, string> = {
  empleado: 'Empleado/a', socio: 'Socio/a', guardia: 'Guardia',
  reemplazo: 'Reemplazo', docente: 'Docente', investigacion: 'Investigación',
};

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) notFound();

  return (
    <div className="space-y-4">
      <article className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-sky-100 text-sky-700">
            {TYPE_LABELS[job.job_type] ?? job.job_type}
          </span>
          <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {job.modality}
          </span>
          {!job.is_paid && (
            <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
              Ad-honorem
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold text-slate-900 leading-tight mb-1">{job.title}</h1>
        {job.clinic && <p className="text-slate-600 mb-3">{job.clinic}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700 mb-5">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] text-slate-400">location_on</span>
            <span>{job.city}, {job.country}</span>
          </div>
          {job.specialty && (
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-slate-400">stethoscope</span>
              <span>{job.specialty}</span>
            </div>
          )}
          {job.salary_range && (
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-500">payments</span>
              <span className="font-bold text-emerald-700">{job.salary_range}</span>
            </div>
          )}
        </div>

        <div className="text-slate-700 whitespace-pre-wrap leading-relaxed mb-5">{job.description}</div>

        {job.requirements.length > 0 && (
          <div className="mb-5">
            <h2 className="font-bold text-slate-900 mb-2">Requisitos</h2>
            <ul className="space-y-1">
              {job.requirements.map((r, i) => (
                <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-emerald-500 mt-0.5">check_circle</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100">
          <h2 className="font-bold text-slate-900 mb-2">Contacto</h2>
          <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 text-sm font-medium text-slate-800">
            {job.contact}
          </div>
        </div>
      </article>

      <div className="text-center pb-4">
        <Link href="/comunidad/trabajo" className="text-sm text-primary font-semibold hover:underline">
          ← Volver a la bolsa de trabajo
        </Link>
      </div>
    </div>
  );
}
