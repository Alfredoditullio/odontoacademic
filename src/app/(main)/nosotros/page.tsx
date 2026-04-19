import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Nosotros' };

const VALUES = [
  { icon: 'school', title: 'Educación', desc: 'Contenido académico riguroso y actualizado basado en evidencia científica.', color: 'from-blue-500 to-indigo-500' },
  { icon: 'diversity_3', title: 'Comunidad', desc: 'Una red colaborativa de profesionales que comparten conocimiento.', color: 'from-sky-500 to-cyan-500' },
  { icon: 'verified', title: 'Excelencia', desc: 'Estándares de calidad en cada recurso, curso y herramienta.', color: 'from-emerald-500 to-teal-500' },
  { icon: 'public', title: 'Accesibilidad', desc: 'Educación dental de calidad accesible para toda Latinoamérica.', color: 'from-violet-500 to-purple-500' },
  { icon: 'psychology', title: 'Innovación', desc: 'Integramos tecnología e IA para mejorar la práctica clínica.', color: 'from-amber-500 to-orange-500' },
  { icon: 'handshake', title: 'Colaboración', desc: 'Fomentamos el intercambio entre profesionales de toda la región.', color: 'from-rose-500 to-pink-500' },
];

const TEAM = [
  {
    name: 'Alfredo Di Tullio',
    role: 'Fundador & CEO',
    specialty: 'IA y Tecnología',
    icon: 'rocket_launch',
    color: 'from-sky-500 to-blue-600',
    bio: 'Fundador de OdontoLatam. Odontólogo especialista en inteligencia artificial y tecnología aplicada a la práctica clínica. Lidera la visión estratégica y el desarrollo tecnológico de la plataforma.',
  },
  {
    name: 'Dra. Lucía Fernández',
    role: 'Editora en Jefe',
    specialty: 'Periodoncia',
    icon: 'edit_note',
    color: 'from-emerald-500 to-teal-600',
    bio: 'Periodoncista investigadora que lidera la curación de contenido académico, asegurando rigor científico en cada artículo y recurso de la plataforma.',
  },
  {
    name: 'Dra. Ana Morales',
    role: 'Coord. de Educación',
    specialty: 'Ortodoncia',
    icon: 'school',
    color: 'from-amber-500 to-orange-600',
    bio: 'Ortodoncista y docente universitaria. Coordina los programas de educación continua y la relación con instructores de toda Latinoamérica.',
  },
];

const MILESTONES = [
  { year: '2024', title: 'Nace la idea', desc: 'Fundación del proyecto con la visión de conectar odontólogos de LATAM.', icon: 'lightbulb' },
  { year: '2025', title: 'Lanzamiento Beta', desc: 'Primeros 1,000 profesionales se unen a la comunidad.', icon: 'rocket_launch' },
  { year: '2026', title: '+5,000 miembros', desc: 'Expansión a 15 países con recursos en todas las especialidades.', icon: 'trending_up' },
  { year: '2027', title: 'El futuro', desc: 'IA integrada, certificaciones oficiales y alianzas universitarias.', icon: 'auto_awesome' },
];

export default function NosotrosPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[400px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1920&h=600&fit=crop&q=80"
            alt=""
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-900/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center text-white">
          <div className="animate-fade-in-up inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-sm font-medium mb-6">
            <span className="material-symbols-outlined text-[16px]">info</span>
            Conocé al equipo detrás de la plataforma
          </div>
          <h1 className="animate-fade-in-up text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4" style={{ animationDelay: '0.15s' }}>
            Sobre{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-300">OdontoLatam</span>
          </h1>
          <p className="animate-fade-in-up text-lg text-white/80 max-w-2xl mx-auto" style={{ animationDelay: '0.3s' }}>
            Somos una plataforma dedicada a elevar el nivel de la odontología en Latinoamérica a través de educación continua, recursos académicos y comunidad profesional.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl hover:border-sky-200 hover:-translate-y-1 transition-all duration-500">
              <div className="size-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-white text-[28px]">flag</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Nuestra Misión</h2>
              <p className="text-slate-600 leading-relaxed">
                Democratizar el acceso a educación dental de calidad en Latinoamérica, proporcionando recursos académicos actualizados, herramientas clínicas innovadoras y una comunidad profesional colaborativa que impulse el crecimiento de cada odontólogo.
              </p>
            </div>
            <div className="group bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl hover:border-teal-200 hover:-translate-y-1 transition-all duration-500">
              <div className="size-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-white text-[28px]">visibility</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Nuestra Visión</h2>
              <p className="text-slate-600 leading-relaxed">
                Ser la plataforma de referencia en educación dental continua de habla hispana, reconocida por la excelencia de sus contenidos, la fortaleza de su comunidad y su contribución al avance de la profesión odontológica en la región.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Nuestros Valores</h2>
            <p className="text-lg text-slate-500">Los principios que guían todo lo que hacemos.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((v, i) => (
              <div
                key={v.title}
                className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`size-12 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <span className="material-symbols-outlined text-white text-[24px]">{v.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{v.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Nuestro Equipo</h2>
            <p className="text-lg text-slate-500">Profesionales apasionados por la odontología y la tecnología.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((m, i) => (
              <div
                key={m.name}
                className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                {/* Gradient header strip */}
                <div className={`h-24 bg-gradient-to-br ${m.color} relative`}>
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZG90cyIgeD0iMCIgeT0iMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48Y2lyY2xlIGN4PSIxIiBjeT0iMSIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2RvdHMpIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIvPjwvc3ZnPg==')] opacity-50" />
                </div>

                {/* Avatar */}
                <div className="flex justify-center -mt-10 relative z-10">
                  <div className={`size-20 rounded-full bg-gradient-to-br ${m.color} border-4 border-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                    <span className="material-symbols-outlined text-white text-[36px]">{m.icon}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 pt-3 text-center">
                  <h3 className="font-bold text-slate-900 text-base">{m.name}</h3>
                  <p className="text-sm font-semibold text-primary mt-0.5">{m.role}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                    <span className="material-symbols-outlined text-[12px]">stethoscope</span>
                    {m.specialty}
                  </span>

                  {/* Bio - appears on hover */}
                  <div className="mt-3 max-h-0 overflow-hidden opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-500">
                    <div className="pt-3 border-t border-slate-100">
                      <p className="text-xs text-slate-500 leading-relaxed">{m.bio}</p>
                    </div>
                  </div>
                </div>

                {/* Hover glow */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-b ${m.color} mix-blend-overlay`} style={{ opacity: 0 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Nuestra Historia</h2>
            <p className="text-lg text-slate-500">El camino que nos trajo hasta acá.</p>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-500 via-teal-500 to-emerald-500" />

            <div className="space-y-12">
              {MILESTONES.map((m, i) => (
                <div
                  key={m.year}
                  className={`relative flex items-center gap-6 animate-fade-in-up ${
                    i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  {/* Content card */}
                  <div className={`flex-1 ${i % 2 === 0 ? 'sm:text-right sm:pr-12' : 'sm:text-left sm:pl-12'} pl-16 sm:pl-0`}>
                    <div className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 inline-block text-left">
                      <span className="text-xs font-black text-primary uppercase tracking-wider">{m.year}</span>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">{m.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{m.desc}</p>
                    </div>
                  </div>

                  {/* Circle */}
                  <div className="absolute left-8 sm:left-1/2 -translate-x-1/2 size-10 rounded-full bg-white border-4 border-primary shadow-lg flex items-center justify-center z-10">
                    <span className="material-symbols-outlined text-primary text-[18px]">{m.icon}</span>
                  </div>

                  {/* Spacer for alternating */}
                  <div className="hidden sm:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-10 sm:p-16 text-white relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-sky-500/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-teal-500/20 to-transparent rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">¿Querés ser parte del equipo?</h2>
              <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto">
                Siempre buscamos profesionales apasionados. Si querés contribuir a la educación dental en LATAM, escribinos.
              </p>
              <Link
                href="/comunidad"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-sky-500/25 hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                Contactanos
                <span className="material-symbols-outlined text-[20px]">mail</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
