'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { CommunityTopNav } from '@/components/comunidad/TopNav';
import { CommunitySidebar } from '@/components/comunidad/SidebarCategories';
import { CommunitySidebarRight } from '@/components/comunidad/SidebarRight';
import { MOCK_CATEGORIES } from '@/data/mock-community';

const QUICK_LINKS = [
  { href: '/comunidad/directorio', icon: 'group',  label: 'Directorio' },
  { href: '/comunidad/eventos',    icon: 'event',  label: 'Eventos' },
  { href: '/comunidad/trabajo',    icon: 'work',   label: 'Bolsa de Trabajo' },
];

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === '/comunidad';

  return (
    <>
      <CommunityTopNav />
      <div className="flex min-h-[calc(100vh-80px)] overflow-x-hidden">

        {/* ── Left nav ── */}
        <aside className="hidden lg:block w-56 shrink-0 border-r border-slate-200 bg-white">
          <div className="sticky top-20 flex flex-col h-[calc(100vh-80px)]">
            <CommunitySidebar />
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0 bg-slate-50 px-5 py-6 pb-16 lg:pb-0">
          {children}
        </div>

        {/* ── Right sidebar ── */}
        <CommunitySidebarRight />

      </div>

      {/* ── Mobile bottom nav bar ── */}
      <nav className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white border-t border-slate-200 flex">
        <Link
          href="/comunidad"
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold ${isHome ? 'text-primary' : 'text-slate-400'}`}
        >
          <span className="material-symbols-outlined text-[22px]">home</span>
          Inicio
        </Link>

        <button
          onClick={() => setDrawerOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold text-slate-400"
        >
          <span className="material-symbols-outlined text-[22px]">grid_view</span>
          Categorías
        </button>

        <Link
          href="/comunidad/mensajes"
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold relative ${pathname.startsWith('/comunidad/mensajes') ? 'text-primary' : 'text-slate-400'}`}
        >
          <span className="relative inline-block">
            <span className="material-symbols-outlined text-[22px]">mail</span>
            <span className="absolute -top-1 -right-1 size-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">2</span>
          </span>
          Mensajes
        </Link>

        <Link
          href="/comunidad/configuracion"
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold ${pathname.startsWith('/comunidad/configuracion') ? 'text-primary' : 'text-slate-400'}`}
        >
          <span className="material-symbols-outlined text-[22px]">person</span>
          Perfil
        </Link>
      </nav>

      {/* ── Category drawer (bottom sheet) ── */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Panel */}
          <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-white rounded-t-2xl shadow-2xl max-h-[80vh] flex flex-col animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
              <span className="text-base font-bold text-slate-900">Categorías</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="size-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition"
              >
                <span className="material-symbols-outlined text-[20px] text-slate-500">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto p-4 flex-1">
              {MOCK_CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/comunidad/c/${c.slug}`}
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition border-b border-slate-50 last:border-0"
                >
                  <span
                    className="material-symbols-outlined text-[22px] shrink-0"
                    style={{ color: c.color ?? '#64748b' }}
                  >
                    {c.icon ?? 'tag'}
                  </span>
                  <span className="font-semibold text-sm text-slate-800 flex-1">{c.name}</span>
                </Link>
              ))}

              {/* Quick links */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-3 mb-2">Accesos rápidos</p>
                {QUICK_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition border-b border-slate-50 last:border-0"
                  >
                    <span className="material-symbols-outlined text-[22px] text-slate-500 shrink-0">{l.icon}</span>
                    <span className="font-semibold text-sm text-slate-800">{l.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
