import Link from 'next/link';
import Image from 'next/image';
import { BLOG_POSTS } from '@/data/mock-blog';

const FEATURES = [
  { icon: 'menu_book', title: 'Bibliografía', desc: 'Artículos científicos y revisiones sistemáticas actualizadas.', href: '/recursos/bibliografia', color: 'from-blue-500 to-indigo-500' },
  { icon: 'biotech', title: 'Atlas de Patología', desc: 'Atlas completo de patología oral con imágenes clínicas.', href: '/recursos/atlas', color: 'from-rose-500 to-pink-500' },
  { icon: 'school', title: 'Educación Continua', desc: 'Diplomados, cursos, talleres y webinars con certificación.', href: '/recursos/educacion', color: 'from-emerald-500 to-teal-500' },
  { icon: 'groups', title: 'Comunidad', desc: 'Red de odontólogos de Latinoamérica para compartir y aprender.', href: '/comunidad', color: 'from-sky-500 to-cyan-500' },
  { icon: 'newspaper', title: 'Blog', desc: 'Artículos, noticias y tendencias del mundo dental.', href: '/blog', color: 'from-violet-500 to-purple-500' },
  { icon: 'storefront', title: 'Tienda', desc: 'Instrumental y materiales dentales de las mejores marcas.', href: '/tienda', color: 'from-amber-500 to-orange-500' },
];

const TESTIMONIALS = [
  { name: 'Dr. Martín Rodríguez', specialty: 'Implantólogo — Buenos Aires', text: 'OdontoAcademic transformó la forma en que me mantengo actualizado. Los recursos bibliográficos y la comunidad son de primer nivel.' },
  { name: 'Dra. Lucía Fernández', specialty: 'Periodoncista — CDMX', text: 'La comunidad me permitió conectar con colegas de toda Latinoamérica. Los debates clínicos son increíblemente enriquecedores.' },
  { name: 'Dr. Carlos Méndez', specialty: 'Radiólogo — Bogotá', text: 'El atlas de patología oral es una herramienta indispensable en mi práctica diaria. Excelente calidad de contenido.' },
];

const STATS = [
  { value: '5,000+', label: 'Odontólogos activos', icon: 'group' },
  { value: '15', label: 'Países conectados', icon: 'public' },
  { value: '10,000+', label: 'Casos compartidos', icon: 'stethoscope' },
  { value: '500+', label: 'Artículos publicados', icon: 'menu_book' },
];

const SPONSORS = [
  { name: 'DentalCore', color: '#0284c7' },
  { name: '3M Oral Care', color: '#e11d48' },
  { name: 'Straumann', color: '#1e40af' },
  { name: 'Dentsply Sirona', color: '#0891b2' },
  { name: 'Ivoclar', color: '#7c3aed' },
  { name: 'GC Corporation', color: '#059669' },
  { name: 'Hu-Friedy', color: '#d97706' },
  { name: 'Ormco', color: '#dc2626' },
];

export default function HomePage() {
  const latestPosts = BLOG_POSTS.slice(0, 3);

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden min-h-[600px] lg:min-h-[700px]">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1920&h=1080&fit=crop&q=80"
            alt=""
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/40" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 size-3 rounded-full bg-teal-400/30 animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute top-40 left-1/4 size-2 rounded-full bg-sky-400/30 animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-32 left-1/3 size-4 rounded-full bg-cyan-400/20 animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/3 right-1/3 size-2 rounded-full bg-amber-400/20 animate-float" style={{ animationDelay: '0.5s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex items-center">
          <div className="flex-1 max-w-2xl">
            {/* Badge */}
            <div className="animate-fade-in-up inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-sm text-white/90 font-medium mb-8">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              +5,000 odontólogos conectados ahora
            </div>

            {/* Title */}
            <h1 className="animate-fade-in-up text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6" style={{ animationDelay: '0.15s' }}>
              La comunidad de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400">
                odontólogos
              </span>{' '}
              más grande de Latinoamérica
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-in-up text-lg sm:text-xl text-slate-300 leading-relaxed mb-10 max-w-xl" style={{ animationDelay: '0.3s' }}>
              Compartí casos clínicos, debatí con colegas, accedé a recursos exclusivos y crecé profesionalmente junto a miles de profesionales de toda la región.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up flex flex-wrap gap-4" style={{ animationDelay: '0.45s' }}>
              <Link
                href="/comunidad"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30 transition-all hover:-translate-y-0.5"
              >
                Unirme a la Comunidad
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
              <Link
                href="/recursos"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl text-base font-bold hover:bg-white/20 border border-white/20 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">explore</span>
                Explorar Recursos
              </Link>
            </div>

            {/* Social proof mini */}
            <div className="animate-fade-in-up mt-10 flex items-center gap-4" style={{ animationDelay: '0.6s' }}>
              <div className="flex -space-x-3">
                {['MR', 'LF', 'CM', 'AM', 'RA'].map((initials, i) => (
                  <div key={i} className="size-10 rounded-full bg-gradient-to-br from-sky-500 to-teal-500 border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-amber-400 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Calificada 4.9/5 por nuestros miembros</p>
              </div>
            </div>
          </div>

          {/* Mascot */}
          <div className="hidden lg:flex flex-1 justify-center items-end relative">
            <div className="animate-fade-in-up relative" style={{ animationDelay: '0.4s' }}>
              <div className="absolute -inset-8 bg-gradient-to-br from-sky-500/20 to-teal-500/20 rounded-full blur-3xl" />
              <Image
                src="/doctorcito.png"
                alt="OdontoAcademic mascota"
                width={380}
                height={380}
                className="relative animate-float drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="size-10 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">{stat.icon}</span>
                </div>
                <div className="text-3xl font-extrabold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SPONSORS / BRANDS MARQUEE ─── */}
      <section className="py-10 bg-slate-50 border-b border-slate-100 overflow-hidden">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
          Marcas que confían en nosotros
        </p>
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10" />
          {/* Marquee track */}
          <div className="flex animate-marquee w-max">
            {[...SPONSORS, ...SPONSORS].map((s, i) => (
              <div
                key={`${s.name}-${i}`}
                className="flex items-center gap-2.5 mx-8 shrink-0"
              >
                <div className="size-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.color + '12' }}>
                  <span className="material-symbols-outlined text-[20px]" style={{ color: s.color }}>verified</span>
                </div>
                <span className="text-base font-bold text-slate-500 tracking-tight whitespace-nowrap">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES FLIP CARDS ─── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Todo lo que necesitás en un solo lugar</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Recursos académicos, herramientas clínicas y una comunidad profesional para potenciar tu práctica.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <Link
                key={f.title}
                href={f.href}
                className="group block animate-fade-in-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {/* ── Mobile: normal card (no flip) ── */}
                <div className="sm:hidden bg-white rounded-2xl border border-slate-200 p-5 flex items-start gap-4 hover:shadow-lg transition-all active:scale-[0.98]">
                  <div className={`size-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center shrink-0`}>
                    <span className="material-symbols-outlined text-white text-[24px]">{f.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-slate-900 mb-1">{f.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 text-[20px] shrink-0 mt-1">arrow_forward</span>
                </div>

                {/* ── Desktop: flip card ── */}
                <div className="hidden sm:block [perspective:1000px]">
                  <div className="relative h-56 transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    {/* FRONT */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${f.color} p-6 flex flex-col items-center justify-center text-center text-white shadow-lg [backface-visibility:hidden]`}>
                      <div className="size-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-[36px]">{f.icon}</span>
                      </div>
                      <h3 className="text-xl font-extrabold">{f.title}</h3>
                      <p className="text-sm text-white/70 mt-2 font-medium">Hover para más info</p>
                    </div>
                    {/* BACK */}
                    <div className="absolute inset-0 rounded-2xl bg-white border border-slate-200 shadow-lg p-6 flex flex-col justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <div className={`size-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-3`}>
                        <span className="material-symbols-outlined text-white text-[22px]">{f.icon}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                      <span className="inline-flex items-center gap-1 text-primary text-sm font-bold mt-4">
                        Explorar
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMMUNITY SHOWCASE ─── */}
      <section className="py-20 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="material-symbols-outlined text-[16px]">groups</span>
              Comunidad
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
              Mucho más que un foro: una{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-500">comunidad completa</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Casos clínicos, marketplace, directorio profesional, eventos, mensajería privada y mucho más. Todo en un solo lugar.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1 - Casos Clínicos (large) */}
            <div className="lg:col-span-2 group relative bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 text-white overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[28px]">stethoscope</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Casos Clínicos</h3>
                    <p className="text-sm text-white/70">Compartí, debatí, aprendé</p>
                  </div>
                </div>
                <p className="text-white/80 leading-relaxed mb-6 max-w-lg">
                  Publicá tus casos con imágenes, pedí segunda opinión, mostrá casos resueltos o abrí un debate clínico. Cada post se clasifica para encontrar exactamente lo que necesitás.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Pido ayuda', 'Caso resuelto', 'Debate'].map((tag, i) => (
                    <span key={tag} className={`text-xs font-bold px-3 py-1 rounded-full ${
                      i === 0 ? 'bg-amber-400/20 text-amber-200' : i === 1 ? 'bg-emerald-400/20 text-emerald-200' : 'bg-indigo-400/20 text-indigo-200'
                    }`}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2 - Directorio */}
            <div className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              <div className="size-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-white text-[24px]">group</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Directorio Profesional</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">Encontrá colegas por especialidad, país o ciudad. Ideal para derivaciones y networking.</p>
              <div className="flex -space-x-2">
                {['MR', 'LF', 'CM', 'AM'].map((init, i) => (
                  <div key={i} className="size-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                    {init}
                  </div>
                ))}
                <div className="size-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-slate-400 text-[10px] font-bold">
                  +5k
                </div>
              </div>
            </div>

            {/* Card 3 - Marketplace */}
            <div className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              <div className="size-11 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-white text-[24px]">storefront</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Mercado</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-3">Comprá, vendé o permutá instrumental y materiales entre colegas verificados.</p>
              <div className="flex gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Vendo</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Compro</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Permuto</span>
              </div>
            </div>

            {/* Card 4 - Eventos */}
            <div className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              <div className="size-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-white text-[24px]">event</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Eventos</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-3">Webinars, congresos, cursos, talleres y meetups organizados por la comunidad.</p>
              <div className="flex gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Webinars</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Congresos</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">Talleres</span>
              </div>
            </div>

            {/* Card 5 - Mensajería (wide) */}
            <div className="lg:col-span-2 group relative bg-gradient-to-br from-sky-600 to-blue-700 rounded-2xl p-8 text-white overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
              <div className="relative flex flex-col sm:flex-row items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="size-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[28px]">chat</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Mensajería Privada</h3>
                      <p className="text-sm text-white/70">Conectá directo con colegas</p>
                    </div>
                  </div>
                  <p className="text-white/80 leading-relaxed">
                    Enviá mensajes privados a cualquier profesional del directorio. Consultá casos, coordiná derivaciones o simplemente hacé networking.
                  </p>
                </div>
                <div className="shrink-0 flex flex-col gap-2 w-full sm:w-auto">
                  {[
                    { name: 'Dra. Fernández', msg: 'Excelente caso, te consulto...', time: '2min' },
                    { name: 'Dr. Méndez', msg: 'Gracias por el dato del paper', time: '1h' },
                  ].map((c) => (
                    <div key={c.name} className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 flex items-center gap-3 min-w-[240px]">
                      <div className="size-8 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {c.name.split(' ').map(w => w[0]).join('').slice(0,2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold">{c.name}</div>
                        <div className="text-[11px] text-white/60 truncate">{c.msg}</div>
                      </div>
                      <span className="text-[10px] text-white/40">{c.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 6 - Encuestas & Polls */}
            <div className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              <div className="size-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-white text-[24px]">ballot</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Encuestas</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-3">Creá encuestas en tus posts para conocer la opinión de la comunidad sobre temas clínicos.</p>
              {/* Mini poll mockup */}
              <div className="space-y-1.5">
                {[
                  { label: 'EMD + xenoinjerto', pct: 45 },
                  { label: 'rh-PDGF + aloinjerto', pct: 30 },
                  { label: 'RTG con membrana', pct: 25 },
                ].map((o) => (
                  <div key={o.label} className="relative rounded-lg border border-slate-200 px-3 py-1.5 overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-50 rounded-lg" style={{ width: `${o.pct}%` }} />
                    <div className="relative flex justify-between text-[11px]">
                      <span className="text-slate-700 font-medium">{o.label}</span>
                      <span className="text-slate-400 font-bold">{o.pct}%</span>
                    </div>
                  </div>
                ))}
                <p className="text-[10px] text-slate-400 mt-1">127 votos</p>
              </div>
            </div>

            {/* Card 7 - Recursos integrados */}
            <div className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              <div className="size-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-white text-[24px]">library_books</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Recursos Integrados</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-3">Vademécum, atlas de patología oral y glosario dental accesibles desde la comunidad.</p>
              <div className="flex flex-col gap-1.5">
                {[
                  { icon: 'pill', label: 'Vademécum', color: '#dc2626' },
                  { icon: 'biotech', label: 'Atlas de patología', color: '#ea580c' },
                  { icon: 'menu_book', label: 'Glosario dental', color: '#0d9488' },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="material-symbols-outlined text-[16px]" style={{ color: r.color }}>{r.icon}</span>
                    <span className="font-medium">{r.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 8 - Reputación & Badges */}
            <div className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
              <div className="size-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-white text-[24px]">military_tech</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Reputación & Badges</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-3">Ganá puntos de reputación, desbloqueá insignias y destacate en el directorio profesional.</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { icon: 'star', name: 'Top Contributor', color: '#f59e0b' },
                  { icon: 'verified', name: 'Verificado', color: '#0284c7' },
                  { icon: 'favorite', name: 'Mentor', color: '#e11d48' },
                ].map((b) => (
                  <span key={b.name} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: b.color + '15', color: b.color }}>
                    <span className="material-symbols-outlined text-[12px]">{b.icon}</span>
                    {b.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link
              href="/comunidad"
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30 transition-all hover:-translate-y-0.5"
            >
              Explorar la Comunidad
              <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── LATEST BLOG ─── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Últimos artículos</h2>
              <p className="text-slate-500">Las noticias y tendencias más relevantes del mundo dental.</p>
            </div>
            <Link
              href="/blog"
              className="hidden sm:inline-flex items-center gap-1 text-primary font-semibold text-sm hover:underline"
            >
              Ver todos
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.coverImage}
                    alt=""
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">
                    {post.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2 mb-2 line-clamp-2 group-hover:text-primary transition">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
                    <span>{post.author.name}</span>
                    <span>·</span>
                    <span>{post.readTime} min lectura</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link href="/blog" className="text-primary font-semibold text-sm">
              Ver todos los artículos →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Lo que dicen nuestros miembros</h2>
            <p className="text-lg text-slate-500">Miles de odontólogos ya son parte de OdontoAcademic.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-amber-400 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                  <div className="text-xs text-slate-400">{t.specialty}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-10 sm:p-16 text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-sky-500/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-teal-500/20 to-transparent rounded-full blur-3xl" />

            <div className="relative flex flex-col lg:flex-row items-center gap-10">
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
                  Sumate a la comunidad dental más grande de LATAM
                </h2>
                <p className="text-lg text-slate-300 mb-8 max-w-xl">
                  Conectá con colegas, compartí tu experiencia, aprendé de los mejores y accedé a recursos exclusivos. Tu próximo colega está a un click.
                </p>
                <Link
                  href="/comunidad"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-sky-500/25 hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                  Crear mi cuenta gratis
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </Link>
              </div>
              <div className="hidden lg:block shrink-0">
                <Image
                  src="/doctorcito.png"
                  alt="OdontoAcademic"
                  width={220}
                  height={220}
                  className="animate-float drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
