'use client';

import { useState, useMemo } from 'react';
import { MOCK_EVENTS } from '@/data/mock-community';
import { CreateEventModal } from '@/components/comunidad/CreateEventModal';
import type { CommunityEvent, Profile } from '@/lib/types';

type EventWithAuthor = CommunityEvent & { author: Pick<Profile, 'display_name' | 'handle' | 'avatar_url'> };

const TYPE_CONFIG: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  webinar:  { icon: 'videocam',    color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',   label: 'Webinar' },
  congress: { icon: 'groups',      color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', label: 'Congreso' },
  course:   { icon: 'school',      color: 'text-emerald-700',bg: 'bg-emerald-50 border-emerald-200', label: 'Curso' },
  meetup:   { icon: 'handshake',   color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200',  label: 'Meetup' },
  workshop: { icon: 'construction',color: 'text-rose-700',   bg: 'bg-rose-50 border-rose-200',    label: 'Taller' },
  fair:     { icon: 'storefront',  color: 'text-teal-700',   bg: 'bg-teal-50 border-teal-200',    label: 'Feria' },
};

const REGION_FLAGS: Record<string, string> = {
  'Online':        '🌐',
  'LATAM':         '🌎',
  'España':        '🇪🇸',
  'Europa':        '🇪🇺',
  'Norteamérica':  '🇺🇸',
  'Asia':          '🌏',
};

const MONTHS_ES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

function formatDateRange(starts: string, ends: string | null) {
  const s = new Date(starts);
  const e = ends ? new Date(ends) : null;
  const day = s.getDate();
  const month = MONTHS_ES[s.getMonth()];
  if (!e || s.toDateString() === e.toDateString()) return `${day} ${month}`;
  if (s.getMonth() === e.getMonth()) return `${day}–${e.getDate()} ${month}`;
  return `${day} ${month} – ${e.getDate()} ${MONTHS_ES[e.getMonth()]}`;
}

function EventCard({ event: e }: { event: EventWithAuthor }) {
  const config = TYPE_CONFIG[e.event_type] ?? TYPE_CONFIG.webinar;
  const isPast = new Date(e.starts_at) < new Date();
  const s = new Date(e.starts_at);

  return (
    <article className={`bg-white rounded-xl border transition ${
      isPast
        ? 'border-slate-200 opacity-55'
        : 'border-slate-200 hover:border-primary/30 hover:shadow-sm'
    }`}>
      <div className="flex gap-0">
        {/* Date column */}
        <div className="shrink-0 w-[72px] flex flex-col items-center justify-center border-r border-slate-100 py-4 px-2 text-center">
          <div className="text-2xl font-black text-primary leading-none">{s.getDate()}</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{MONTHS_ES[s.getMonth()]}</div>
          <div className="text-[10px] text-slate-300 mt-0.5">{s.getFullYear()}</div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 p-4">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${config.bg} ${config.color}`}>
              <span className="material-symbols-outlined text-[11px]">{config.icon}</span>
              {config.label}
            </span>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
              {REGION_FLAGS[e.region]} {e.region}
            </span>
            {e.specialty && (
              <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">
                {e.specialty}
              </span>
            )}
            {e.is_free && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Gratis
              </span>
            )}
            {isPast && (
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                Finalizado
              </span>
            )}
          </div>

          <h3 className="font-bold text-slate-900 text-sm leading-snug">{e.title}</h3>

          {e.description && (
            <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{e.description}</p>
          )}

          {/* Footer info */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">calendar_today</span>
                {formatDateRange(e.starts_at, e.ends_at)}
              </span>
              {e.location && (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">location_on</span>
                  {e.location}{e.country ? `, ${e.country}` : ''}
                </span>
              )}
              {!e.location && e.region === 'Online' && (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">videocam</span>
                  Online — en vivo
                </span>
              )}
            </div>

            {(e.registration_url || e.event_url) && !isPast && (
              <a
                href={e.registration_url ?? e.event_url ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline shrink-0"
              >
                {e.is_free ? 'Inscribirme gratis' : 'Ver info / Inscripción'}
                <span className="material-symbols-outlined text-[13px]">open_in_new</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Filter chips ────────────────────────────────────────────────────────────
function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-bold transition border ${
        active
          ? 'bg-primary text-white border-primary shadow-sm'
          : 'bg-white text-slate-600 border-slate-200 hover:border-primary/40 hover:text-primary'
      }`}
    >
      {children}
    </button>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
const ALL_TYPES  = ['Todos', 'Congreso', 'Webinar', 'Feria', 'Taller', 'Curso'];
const ALL_REGIONS = ['Todas', 'Online', 'LATAM', 'España', 'Europa', 'Norteamérica'];
const TYPE_MAP: Record<string, CommunityEvent['event_type'][]> = {
  Congreso: ['congress'], Webinar: ['webinar'], Feria: ['fair'], Taller: ['workshop'], Curso: ['course'],
};

export default function EventosPage() {
  const [typeFilter, setTypeFilter]     = useState('Todos');
  const [regionFilter, setRegionFilter] = useState('Todas');
  const [search, setSearch]             = useState('');
  const [showPast, setShowPast]         = useState(false);
  const [showModal, setShowModal]       = useState(false);
  const [userEvents, setUserEvents]     = useState<EventWithAuthor[]>([]);

  const now = new Date();

  const sorted = useMemo(
    () => [...userEvents, ...MOCK_EVENTS].sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()),
    [userEvents],
  );

  const filtered = useMemo(() => {
    return sorted.filter((e) => {
      const upcoming = new Date(e.starts_at) >= now;
      if (!showPast && !upcoming) return false;
      if (typeFilter !== 'Todos') {
        const allowed = TYPE_MAP[typeFilter] ?? [];
        if (!allowed.includes(e.event_type)) return false;
      }
      if (regionFilter !== 'Todas' && e.region !== regionFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          e.title.toLowerCase().includes(q) ||
          (e.description ?? '').toLowerCase().includes(q) ||
          (e.location ?? '').toLowerCase().includes(q) ||
          (e.country ?? '').toLowerCase().includes(q) ||
          (e.specialty ?? '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorted, typeFilter, regionFilter, search, showPast]);

  const upcomingCount = sorted.filter((e) => new Date(e.starts_at) >= now).length;
  const pastCount     = sorted.filter((e) => new Date(e.starts_at) < now).length;

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="material-symbols-outlined text-primary text-[28px]">event</span>
              <h1 className="text-xl font-black text-slate-900">Eventos 2026</h1>
              <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                {upcomingCount} próximos
              </span>
            </div>
            <p className="text-sm text-slate-500 ml-[40px]">
              Congresos, ferias, webinars y talleres del mundo dental en 2026. Links directos a las páginas oficiales.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="shrink-0 inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Publicar evento
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, país, especialidad..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Type filter */}
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Tipo</p>
          <div className="flex flex-wrap gap-1.5">
            {ALL_TYPES.map((t) => (
              <Chip key={t} active={typeFilter === t} onClick={() => setTypeFilter(t)}>{t}</Chip>
            ))}
          </div>
        </div>

        {/* Region filter */}
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Región</p>
          <div className="flex flex-wrap gap-1.5">
            {ALL_REGIONS.map((r) => (
              <Chip key={r} active={regionFilter === r} onClick={() => setRegionFilter(r)}>
                {r !== 'Todas' && REGION_FLAGS[r]} {r}
              </Chip>
            ))}
          </div>
        </div>

        {/* Past toggle */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            {filtered.length} evento{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
            {pastCount > 0 && !showPast && (
              <span className="text-slate-300 ml-1">· {pastCount} finalizados ocultos</span>
            )}
          </p>
          <button
            onClick={() => setShowPast((v) => !v)}
            className="text-xs font-semibold text-slate-500 hover:text-primary flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">
              {showPast ? 'visibility_off' : 'history'}
            </span>
            {showPast ? 'Ocultar pasados' : `Ver finalizados (${pastCount})`}
          </button>
        </div>
      </div>

      {/* Event list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 text-center py-14">
          <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-2">event_busy</span>
          <p className="font-bold text-slate-600">Sin resultados</p>
          <p className="text-sm text-slate-400 mt-1">Probá con otros filtros</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-2 text-xs text-slate-500">
        <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5 text-slate-400">info</span>
        <p>Los eventos marcados con <strong>Ver info / Inscripción</strong> enlazan a las páginas oficiales de cada organización. OdontoLatam no organiza ni es responsable de estos eventos.</p>
      </div>

      {/* Create event modal */}
      {showModal && (
        <CreateEventModal
          onClose={() => setShowModal(false)}
          onCreated={(e) => {
            setUserEvents((prev) => [e, ...prev]);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
