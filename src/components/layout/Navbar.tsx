'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/nosotros', label: 'Nosotros' },
  {
    href: '/recursos',
    label: 'Recursos',
    children: [
      { href: '/recursos/bibliografia', label: 'Bibliografía', icon: 'menu_book' },
      { href: '/recursos/atlas', label: 'Atlas', icon: 'biotech' },
      { href: '/recursos/educacion', label: 'Educación', icon: 'school' },
    ],
  },
  { href: '/blog', label: 'Blog' },
  { href: '/tienda', label: 'Tienda' },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setResourcesOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/60 backdrop-blur-xl shadow-lg shadow-slate-200/50 border-b border-white/40'
          : 'bg-white/80 backdrop-blur-md border-b border-slate-100/50'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="size-10 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-white text-[22px]">school</span>
            </div>
            <div className="leading-tight">
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">OdontoAcademic</span>
              <div className="text-[10px] text-slate-400 font-medium hidden sm:block">Educación dental continua</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.href} className="relative">
                  <button
                    onClick={() => setResourcesOpen(!resourcesOpen)}
                    onBlur={() => setTimeout(() => setResourcesOpen(false), 200)}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                      isActive(link.href)
                        ? 'text-primary bg-primary/5'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                    <span className={`material-symbols-outlined text-[18px] transition-transform ${resourcesOpen ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  {resourcesOpen && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl border border-slate-200 shadow-lg p-2 animate-fade-in-up">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                            isActive(child.href)
                              ? 'bg-primary/5 text-primary font-semibold'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[20px] text-primary/70">{child.icon}</span>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    isActive(link.href)
                      ? 'text-primary bg-primary/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href="/comunidad"
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 shadow-sm hover:shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">groups</span>
              Comunidad
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden size-10 rounded-lg flex items-center justify-center hover:bg-slate-100 transition"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 py-4 space-y-1 animate-fade-in-up">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.href} className="space-y-1">
                  <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {link.label}
                  </div>
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm ${
                        isActive(child.href)
                          ? 'bg-primary/5 text-primary font-semibold'
                          : 'text-slate-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{child.icon}</span>
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-semibold ${
                    isActive(link.href)
                      ? 'bg-primary/5 text-primary'
                      : 'text-slate-600'
                  }`}
                >
                  {link.label}
                </Link>
              ),
            )}
            <div className="pt-3 px-4">
              <Link
                href="/comunidad"
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-sky-600 to-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold"
              >
                <span className="material-symbols-outlined text-[18px]">groups</span>
                Comunidad
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
