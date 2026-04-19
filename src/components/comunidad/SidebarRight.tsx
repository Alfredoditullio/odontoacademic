import Link from 'next/link';
import { MOCK_POSTS, MOCK_CATEGORIES } from '@/data/mock-community';

/* Top posts by engagement (likes + comments) */
const TOP_POSTS = [...MOCK_POSTS]
  .sort((a, b) => (b.like_count + b.comment_count * 2) - (a.like_count + a.comment_count * 2))
  .slice(0, 4);

const STATS = [
  { label: 'Miembros', value: '5.200+', icon: 'group' },
  { label: 'Países', value: '14', icon: 'public' },
  { label: 'Posts esta semana', value: '38', icon: 'edit_note' },
];

const UPCOMING_EVENT = {
  title: 'Webinar: Implantes en maxilar atrófico',
  date: 'Miérc 23 abr · 19:00 hs',
  host: 'Dr. Rodríguez · OdontoLatam',
  free: true,
  href: '/comunidad/eventos',
};

export function CommunitySidebarRight() {
  return (
    <aside className="hidden xl:block w-64 shrink-0 border-l border-slate-200 bg-white">
      <div className="sticky top-20 p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-80px)]">

        {/* ── Stats ── */}
        <div className="bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-100 rounded-xl p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-sky-500 mb-3">La comunidad</p>
          <div className="space-y-2.5">
            {STATS.map(({ label, value, icon }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-sky-400">{icon}</span>
                  <span className="text-xs text-slate-600">{label}</span>
                </div>
                <span className="text-sm font-extrabold text-slate-800">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Próximo evento ── */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5 px-1">Próximo evento</p>
          <Link href={UPCOMING_EVENT.href} className="block bg-white border border-slate-200 rounded-xl p-3.5 hover:border-sky-300 hover:shadow-sm transition group">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <p className="text-xs font-bold text-slate-800 leading-snug group-hover:text-sky-700 transition">
                {UPCOMING_EVENT.title}
              </p>
              {UPCOMING_EVENT.free && (
                <span className="shrink-0 text-[9px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full border border-emerald-200">
                  GRATIS
                </span>
              )}
            </div>
            <p className="text-[11px] text-sky-600 font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">event</span>
              {UPCOMING_EVENT.date}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">{UPCOMING_EVENT.host}</p>
          </Link>
        </div>

        {/* ── Posts más activos ── */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5 px-1">Más activos</p>
          <div className="space-y-1">
            {TOP_POSTS.map((post) => (
              <Link
                key={post.id}
                href={`/comunidad/p/${post.id}`}
                className="flex items-start gap-2.5 px-2 py-2.5 rounded-lg hover:bg-slate-50 transition group"
              >
                <span
                  className="material-symbols-outlined text-[15px] mt-0.5 shrink-0"
                  style={{ color: post.category.color ?? '#64748b' }}
                >
                  {post.category.icon ?? 'tag'}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-700 group-hover:text-sky-700 transition line-clamp-2 leading-snug">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[11px]">favorite</span>
                      {post.like_count}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[11px]">chat_bubble</span>
                      {post.comment_count}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Categorías rápidas ── */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5 px-1">Explorar</p>
          <div className="flex flex-wrap gap-1.5">
            {MOCK_CATEGORIES.filter((c) => c.post_policy === 'open').map((c) => (
              <Link
                key={c.slug}
                href={`/comunidad/c/${c.slug}`}
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition"
              >
                <span className="material-symbols-outlined text-[12px]" style={{ color: c.color ?? '#64748b' }}>
                  {c.icon ?? 'tag'}
                </span>
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        {/* ── DentalCore promo ── */}
        <Link
          href="/blog/dentalcore-software-dental-gestion-consultorio-odontologico"
          className="block bg-gradient-to-br from-sky-600 to-teal-600 rounded-xl p-4 hover:opacity-95 transition"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-white/70 mb-1">Software recomendado</p>
          <p className="text-sm font-extrabold text-white leading-snug mb-1">DentalCore</p>
          <p className="text-[11px] text-white/80 leading-relaxed">
            Gestión clínica completa para tu consultorio. Casos, agenda, presupuestos y más.
          </p>
          <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-white/90">
            Ver más <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
          </span>
        </Link>

        <p className="text-[10px] text-slate-300 text-center pb-2">OdontoLatam © 2026</p>
      </div>
    </aside>
  );
}
