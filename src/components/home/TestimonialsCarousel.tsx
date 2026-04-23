'use client';

import { useState, useEffect, useCallback } from 'react';

const TESTIMONIALS = [
  {
    name: 'Dr. Martín Rodríguez',
    specialty: 'Implantólogo',
    location: 'Buenos Aires, Argentina',
    initials: 'MR',
    gradient: 'from-sky-400 to-teal-500',
    text: 'OdontoLatam transformó la forma en que me mantengo actualizado. Los debates clínicos con colegas de otros países me abrieron perspectivas que no encontraba en ningún otro lado.',
  },
  {
    name: 'Dra. Lucía Fernández',
    specialty: 'Periodoncista',
    location: 'Ciudad de México, México',
    initials: 'LF',
    gradient: 'from-violet-400 to-purple-500',
    text: 'La comunidad me permitió conectar con especialistas de toda Latinoamérica. Publiqué un caso complejo, recibí 14 respuestas de colegas de 6 países distintos en menos de 24 horas.',
  },
  {
    name: 'Dr. Carlos Méndez',
    specialty: 'Radiólogo Oral',
    location: 'Bogotá, Colombia',
    initials: 'CM',
    gradient: 'from-emerald-400 to-teal-500',
    text: 'El atlas de patología oral es indispensable en mi práctica diaria. Excelente calidad de contenido, bien organizado y de acceso gratuito. Una herramienta que debería conocer todo odontólogo.',
  },
  {
    name: 'Dra. Ana Morales',
    specialty: 'Endodoncista',
    location: 'Santiago, Chile',
    initials: 'AM',
    gradient: 'from-rose-400 to-pink-500',
    text: 'Empecé a usar OdontoLatam por los recursos y me quedé por la comunidad. Cada semana aprendo algo nuevo de un colega que está resolviendo los mismos problemas que yo en otra parte del mundo.',
  },
  {
    name: 'Dr. Roberto Acuña',
    specialty: 'Cirujano Oral y Maxilofacial',
    location: 'Lima, Perú',
    initials: 'RA',
    gradient: 'from-amber-400 to-orange-500',
    text: 'Nunca pensé que una plataforma online pudiera reemplazar a un congreso para hacer networking real. Me contacté con tres especialistas de Argentina que me ayudaron a resolver un caso quirúrgico complejo.',
  },
];

export function TestimonialsCarousel() {
  const [current, setCurrent]   = useState(0);
  const [paused, setPaused]     = useState(false);
  const [animKey, setAnimKey]   = useState(0);

  const go = useCallback((index: number) => {
    setCurrent((index + TESTIMONIALS.length) % TESTIMONIALS.length);
    setAnimKey((k) => k + 1);
  }, []);

  const next = useCallback(() => go(current + 1), [current, go]);
  const prev = useCallback(() => go(current - 1), [current, go]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next]);

  const t = TESTIMONIALS[current];

  return (
    <section
      className="py-12 overflow-hidden relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-[13px]">star</span>
            Comunidad
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Lo que dicen nuestros miembros
          </h2>
        </div>

        {/* Card container */}
        <div className="relative">

          {/* Prev / Next arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-10 z-10 size-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-500 hover:text-slate-900 hover:shadow-lg transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-10 z-10 size-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-500 hover:text-slate-900 hover:shadow-lg transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>

          {/* Testimonial card — key forces re-mount → CSS animation plays */}
          <div
            key={animKey}
            className="bg-white rounded-2xl border border-slate-200 shadow-lg px-6 sm:px-10 py-8 text-center animate-testimonial"
          >
            {/* Stars */}
            <div className="flex items-center justify-center gap-0.5 mb-4">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-amber-400 text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              ))}
            </div>

            {/* Quote text */}
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium max-w-xl mx-auto mb-6">
              &ldquo;{t.text}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center justify-center gap-3">
              <div className={`size-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-xs font-extrabold shadow-md`}>
                {t.initials}
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                <p className="text-xs text-slate-500">{t.specialty} · {t.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation dots + progress */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? `w-5 h-2 bg-gradient-to-r ${t.gradient}`
                  : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-3 max-w-[160px] mx-auto h-0.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            key={`progress-${animKey}`}
            className="h-full bg-gradient-to-r from-sky-400 to-teal-500 rounded-full animate-progress"
          />
        </div>
      </div>
    </section>
  );
}
