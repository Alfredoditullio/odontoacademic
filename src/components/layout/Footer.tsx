'use client';

import Link from 'next/link';

const FOOTER_LINKS = {
  'Plataforma': [
    { href: '/', label: 'Inicio' },
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/blog', label: 'Blog' },
    { href: '/tienda', label: 'Tienda' },
  ],
  'Recursos': [
    { href: '/recursos/bibliografia', label: 'Bibliografía' },
    { href: '/recursos/atlas', label: 'Atlas de Patología Oral' },
    { href: '/recursos/educacion', label: 'Educación Continua' },
  ],
  'Comunidad': [
    { href: '/comunidad', label: 'Feed' },
    { href: '/comunidad/directorio', label: 'Directorio' },
    { href: '/comunidad/eventos', label: 'Eventos' },
    { href: '/comunidad', label: 'Unirse' },
  ],
};

const SOCIAL_LINKS = [
  { icon: 'open_in_new', label: 'Facebook', href: '#' },
  { icon: 'open_in_new', label: 'Instagram', href: '#' },
  { icon: 'open_in_new', label: 'YouTube', href: '#' },
  { icon: 'open_in_new', label: 'LinkedIn', href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand + Newsletter */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="size-10 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[22px]">public</span>
              </div>
              <span className="text-lg font-extrabold tracking-tight">OdontoLatam</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              La comunidad de odontólogos más grande de Latinoamérica. Casos clínicos, recursos académicos y networking profesional para potenciar tu práctica.
            </p>

            {/* Newsletter form */}
            <div>
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-teal-400">mail</span>
                Suscribite al Newsletter
              </h3>
              <p className="text-xs text-slate-400 mb-3">Recibí las últimas noticias del mundo dental.</p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-sky-600 to-teal-600 px-4 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition whitespace-nowrap"
                >
                  Suscribirse
                </button>
              </form>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-bold mb-4 text-slate-300">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} OdontoLatam. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="text-slate-500 hover:text-white transition"
                title={social.label}
              >
                <span className="text-xs font-semibold">{social.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
