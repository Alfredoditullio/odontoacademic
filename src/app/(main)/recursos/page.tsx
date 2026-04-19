import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Recursos' };

const SECTIONS = [
  {
    href: '/recursos/vademecum',
    icon: 'medication',
    color: 'from-emerald-500 to-teal-600',
    title: 'Vademécum Odontológico',
    desc: 'Medicamentos de uso frecuente en odontología: dosis, presentaciones, contraindicaciones e interacciones farmacológicas.',
    count: '19 medicamentos',
  },
  {
    href: '/recursos/atlas',
    icon: 'biotech',
    color: 'from-rose-500 to-pink-500',
    title: 'Atlas de Patología Oral',
    desc: 'Atlas completo de patología oral con imágenes clínicas de alta calidad, características diagnósticas y guías de tratamiento.',
    count: '200+ patologías',
  },
  {
    href: '/recursos/educacion',
    icon: 'school',
    color: 'from-emerald-500 to-teal-500',
    title: 'Educación Continua',
    desc: 'Diplomados, cursos, talleres y webinars con los mejores especialistas de Latinoamérica. Certificación incluida.',
    count: '50+ programas',
  },
];

export default function RecursosPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-sky-600 via-cyan-600 to-teal-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Recursos Académicos</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Todo el conocimiento que necesitás para tu práctica clínica, actualizado y basado en evidencia.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {SECTIONS.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="group flex flex-col sm:flex-row items-start gap-6 bg-white rounded-2xl border border-slate-200 p-8 hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div className={`size-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-white text-[32px]">{s.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-primary transition">{s.title}</h2>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">{s.count}</span>
                  </div>
                  <p className="text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all text-[24px] hidden sm:block self-center">
                  arrow_forward
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
