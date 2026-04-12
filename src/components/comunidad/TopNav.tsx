'use client';

import Link from 'next/link';

export function CommunityTopNav() {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center gap-4">
        <Link href="/comunidad" className="flex items-center gap-3 text-white group">
          <div className="size-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center ring-1 ring-white/20 group-hover:bg-white/25 transition">
            <span className="material-symbols-outlined text-[28px]">groups</span>
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight">Comunidad OdontoAcademic</span>
              <span className="text-[10px] font-bold bg-amber-300 text-amber-900 px-1.5 py-0.5 rounded">BETA</span>
            </div>
            <div className="text-[11px] sm:text-xs text-white/80 font-medium hidden sm:block">
              La red de odontólogos de Latinoamérica
            </div>
          </div>
        </Link>

        <div className="flex-1" />

        {/* Mock notification and message buttons */}
        <div className="flex items-center gap-2">
          <Link
            href="/comunidad"
            className="relative size-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center hover:bg-white/25 transition"
            title="Notificaciones"
          >
            <span className="material-symbols-outlined text-[22px] text-white">notifications</span>
            <span className="absolute -top-1 -right-1 size-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-sky-600">
              3
            </span>
          </Link>

          <Link
            href="/comunidad/mensajes"
            className="relative size-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center hover:bg-white/25 transition"
            title="Mensajes"
          >
            <span className="material-symbols-outlined text-[22px] text-white">mail</span>
            <span className="absolute -top-1 -right-1 size-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-sky-600">
              2
            </span>
          </Link>

          <Link
            href="/comunidad/new"
            className="inline-flex items-center gap-1.5 bg-white text-sky-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-sky-50 shadow-sm transition"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span className="hidden sm:inline">Nuevo post</span>
          </Link>

          <div className="size-10 rounded-full bg-white/15 backdrop-blur ring-2 ring-white/30 flex items-center justify-center font-bold text-white text-sm">
            MR
          </div>
        </div>
      </div>
    </header>
  );
}
