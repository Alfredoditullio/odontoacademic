import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventById } from '@/lib/queries/events-jobs';

export const dynamic = 'force-dynamic';

const TYPE_LABELS: Record<string, string> = {
  webinar: 'Webinar', congress: 'Congreso', course: 'Curso',
  workshop: 'Taller', meetup: 'Meetup',     fair: 'Feria',
};

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ev = await getEventById(id);
  if (!ev) notFound();

  const startsDate = new Date(ev.starts_at);
  const dateStr = startsDate.toLocaleString('es-AR', { dateStyle: 'full', timeStyle: 'short' });

  return (
    <div className="space-y-4">
      <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {ev.image_url && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={ev.image_url} alt="" className="w-full aspect-[16/7] object-cover" />
        )}
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-violet-100 text-violet-700">{TYPE_LABELS[ev.event_type] ?? ev.event_type}</span>
            <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">{ev.region}</span>
            {ev.is_free
              ? <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">Gratis</span>
              : ev.price && <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">{ev.price}</span>
            }
          </div>

          <h1 className="text-2xl font-bold text-slate-900 leading-tight mb-3">{ev.title}</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700 mb-5">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-slate-400">schedule</span>
              <span>{dateStr}</span>
            </div>
            {ev.country && (
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-slate-400">location_on</span>
                <span>{ev.city ? `${ev.city}, ${ev.country}` : ev.country}</span>
              </div>
            )}
            {ev.specialty && (
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-slate-400">stethoscope</span>
                <span>{ev.specialty}</span>
              </div>
            )}
          </div>

          {ev.description && (
            <div className="text-slate-700 whitespace-pre-wrap leading-relaxed mb-5">{ev.description}</div>
          )}

          <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
            {ev.registration_url && (
              <a href={ev.registration_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition">
                <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                Inscribirse
              </a>
            )}
            {ev.event_url && (
              <a href={ev.event_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-slate-100 text-slate-800 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition border border-slate-200">
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                Más info
              </a>
            )}
          </div>
        </div>
      </article>

      <div className="text-center pb-4">
        <Link href="/comunidad/eventos" className="text-sm text-primary font-semibold hover:underline">
          ← Volver a eventos
        </Link>
      </div>
    </div>
  );
}
