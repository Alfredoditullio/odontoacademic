'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/admin',               icon: 'dashboard',    label: 'Dashboard' },
  { href: '/admin/suscriptores',  icon: 'group',        label: 'Suscriptores' },
  { href: '/admin/campaigns',     icon: 'mark_email_read', label: 'Campañas' },
];

function initials(name: string) {
  return name.trim().split(' ').filter(Boolean).map((w) => w[0]).join('').toUpperCase().slice(0, 2) || 'OL';
}

export function AdminSidebar({ displayName, avatarColor }: { displayName: string; avatarColor: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100 flex items-center gap-2.5">
        <div className="size-9 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-[18px]">admin_panel_settings</span>
        </div>
        <div className="leading-tight">
          <div className="text-sm font-extrabold text-slate-900">Admin</div>
          <div className="text-[10px] text-slate-400">OdontoLatam</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV.map((item) => {
          const active = item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                active
                  ? 'bg-gradient-to-r from-sky-50 to-teal-50 text-primary'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className={`material-symbols-outlined text-[18px] ${active ? 'text-primary' : 'text-slate-400'}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-slate-100 p-4 flex items-center gap-2.5">
        <div className={`size-8 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
          {initials(displayName || 'Admin')}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-slate-900 truncate">{displayName || 'Admin'}</p>
          <p className="text-[10px] text-slate-400">Administrador</p>
        </div>
        <Link href="/comunidad" className="size-7 flex items-center justify-center rounded-lg hover:bg-slate-100 transition" title="Ir a la comunidad">
          <span className="material-symbols-outlined text-[16px] text-slate-400">logout</span>
        </Link>
      </div>
    </aside>
  );
}
