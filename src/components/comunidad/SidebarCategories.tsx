'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MOCK_CATEGORIES } from '@/data/mock-community';

const COMMUNITY_LINKS = [
  { href: '/comunidad/directorio', icon: 'group',       color: '#7c3aed', label: 'Directorio' },
  { href: '/comunidad/eventos',    icon: 'event',       color: '#0891b2', label: 'Eventos' },
  { href: '/comunidad/trabajo',    icon: 'work',        color: '#059669', label: 'Bolsa de trabajo' },
];

export function CommunitySidebar() {
  const pathname = usePathname();
  const isHome = pathname === '/comunidad';
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="flex flex-col h-full">

      {/* ── Scrollable nav ── */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-0.5">
        <Link
          href="/comunidad"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
            isHome ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">home</span>
          Inicio
        </Link>

        <div className="pt-3 pb-1 px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Categorías
        </div>
        {MOCK_CATEGORIES.map((c) => {
          const href = `/comunidad/c/${c.slug}`;
          const active = isActive(href);
          return (
            <Link
              key={c.slug}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                active ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
              style={active ? { boxShadow: `inset 3px 0 0 ${c.color ?? '#0284c7'}` } : undefined}
            >
              <span className="material-symbols-outlined text-[20px]" style={{ color: c.color ?? '#64748b' }}>
                {c.icon ?? 'tag'}
              </span>
              <span className="flex-1 truncate">{c.name}</span>
              {c.post_policy === 'admin_only' && (
                <span className="material-symbols-outlined text-[14px] text-slate-300" title="Solo admin postea">lock</span>
              )}
            </Link>
          );
        })}

        <div className="pt-3 pb-1 px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Comunidad
        </div>
        {COMMUNITY_LINKS.map((r) => {
          const active = isActive(r.href);
          return (
            <Link
              key={r.href}
              href={r.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                active ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
              style={active ? { boxShadow: `inset 3px 0 0 ${r.color}` } : undefined}
            >
              <span className="material-symbols-outlined text-[20px]" style={{ color: r.color }}>{r.icon}</span>
              {r.label}
            </Link>
          );
        })}
      </nav>

      {/* ── Configuración (pinned bottom) ── */}
      <div className="shrink-0 border-t border-slate-100 p-3">
        <Link
          href="/comunidad/configuracion"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
            isActive('/comunidad/configuracion')
              ? 'bg-slate-100 text-slate-900 font-semibold'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-[20px] text-slate-400">settings</span>
          Configuración
        </Link>
      </div>

    </div>
  );
}
