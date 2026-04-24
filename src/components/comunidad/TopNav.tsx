'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

function initials(name: string) {
  return name.trim().split(' ').filter(Boolean).map((w) => w[0]).join('').toUpperCase().slice(0, 2) || 'OL';
}

export function CommunityTopNav() {
  const { profile, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const avatarLabel  = profile?.display_name ? initials(profile.display_name) : 'OL';
  const avatarColor  = profile?.avatar_color ?? 'from-sky-500 to-cyan-500';
  const avatarImg    = profile?.avatar_url ?? null;
  const displayName  = profile?.display_name ?? '';
  const handle       = profile?.handle ?? null;

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600 shadow-sm">
      <div className="w-full max-w-full px-4 sm:px-5 h-20 flex items-center gap-3">
        <Link href="/comunidad" className="flex items-center gap-3 text-white group min-w-0">
          <div className="size-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center ring-1 ring-white/20 group-hover:bg-white/25 transition">
            <span className="material-symbols-outlined text-[28px]">groups</span>
          </div>
          <div className="leading-tight min-w-0">
            <span className="block text-sm sm:text-lg font-extrabold tracking-tight truncate">Comunidad OdontoLatam</span>
            <span className="block text-[11px] text-white/75 font-medium truncate">La red de odontólogos de LATAM</span>
          </div>
        </Link>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Link
            href="/comunidad"
            className="relative size-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center hover:bg-white/25 transition"
            title="Notificaciones"
          >
            <span className="material-symbols-outlined text-[22px] text-white">notifications</span>
          </Link>

          {/* Messages */}
          <Link
            href="/comunidad/mensajes"
            className="relative size-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center hover:bg-white/25 transition"
            title="Mensajes"
          >
            <span className="material-symbols-outlined text-[22px] text-white">mail</span>
          </Link>

          {/* Avatar dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 group"
            >
              <div className={`size-10 rounded-full bg-gradient-to-br ${avatarColor} ring-2 ring-white/30 flex items-center justify-center font-bold text-white text-sm overflow-hidden`}>
                {avatarImg
                  ? <img src={avatarImg} alt="avatar" className="size-full object-cover" />
                  : avatarLabel
                }
              </div>
              <span className="material-symbols-outlined text-white/70 text-[18px] hidden sm:block group-hover:text-white transition">
                {dropdownOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-fade-in-up">
                {/* User info */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className={`size-9 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0`}>
                      {avatarImg
                        ? <img src={avatarImg} alt="avatar" className="size-full object-cover" />
                        : avatarLabel
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{displayName || 'Mi perfil'}</p>
                      <p className="text-xs text-slate-400">{handle ? `@${handle}` : 'Ver perfil público'}</p>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                {[
                  { href: '/comunidad/configuracion', icon: 'person',        label: 'Mi perfil' },
                  { href: '/comunidad/configuracion', icon: 'settings',      label: 'Configuración' },
                  { href: '/comunidad/configuracion', icon: 'notifications', label: 'Notificaciones' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                  >
                    <span className="material-symbols-outlined text-[18px] text-slate-400">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}

                <div className="border-t border-slate-100 mt-2 pt-2">
                  <button
                    onClick={() => { setDropdownOpen(false); signOut(); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
