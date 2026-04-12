import Link from 'next/link';
import { MOCK_EVENTS } from '@/data/mock-community';
import type { Profile, CommunityEvent } from '@/lib/types';

export const metadata = { title: 'Eventos' };

const TYPE_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  webinar: { icon: 'videocam', color: 'bg-blue-100 text-blue-700', label: 'Webinar' },
  congress: { icon: 'groups', color: 'bg-purple-100 text-purple-700', label: 'Congreso' },
  course: { icon: 'school', color: 'bg-emerald-100 text-emerald-700', label: 'Curso' },
  meetup: { icon: 'handshake', color: 'bg-amber-100 text-amber-700', label: 'Meetup' },
  workshop: { icon: 'construction', color: 'bg-rose-100 text-rose-700', label: 'Taller' },
};

function EventCard({ event: e }: { event: CommunityEvent & { author: Pick<Profile, 'display_name' | 'handle' | 'avatar_url'> } }) {
  const config = TYPE_CONFIG[e.event_type] || TYPE_CONFIG.webinar;
  const isPast = new Date(e.starts_at) < new Date();

  return (
    <article className={`bg-white rounded-xl border border-slate-200 p-5 transition ${isPast ? 'opacity-60' : 'hover:border-primary/30 hover:shadow-sm'}`}>
      <div className="flex gap-4">
        <div className="shrink-0 text-center w-16">
          <div className="bg-primary/10 rounded-xl p-2">
            <div className="text-2xl font-black text-primary">{new Date(e.starts_at).getDate()}</div>
            <div className="text-[10px] font-bold text-primary/70 uppercase">
              {new Date(e.starts_at).toLocaleDateString('es-AR', { month: 'short' })}
            </div>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 ${config.color}`}>
              <span className="material-symbols-outlined text-[12px]">{config.icon}</span>
              {config.label}
            </span>
            {e.is_free ? (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Gratis</span>
            ) : e.price ? (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">{e.price}</span>
            ) : null}
          </div>
          <h3 className="font-bold text-slate-900 text-lg">{e.title}</h3>
          {e.description && <p className="text-sm text-slate-600 mt-1 line-clamp-2">{e.description}</p>}
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
            {e.location && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">location_on</span>
                {e.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">person</span>
              {e.author?.display_name}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function EventosPage() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="material-symbols-outlined text-primary text-[28px]">event</span>
          <h1 className="text-xl font-black text-slate-900">Eventos</h1>
        </div>
        <p className="text-sm text-slate-500 ml-[40px]">
          Webinars, cursos, congresos y meetups de la comunidad.
        </p>
      </div>

      {MOCK_EVENTS.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 text-center py-16">
          <span className="material-symbols-outlined text-[48px] text-slate-300">event_busy</span>
          <h3 className="font-bold text-slate-700 mt-2">No hay eventos próximos</h3>
        </div>
      ) : (
        <div className="space-y-3">
          {MOCK_EVENTS.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      )}
    </div>
  );
}
