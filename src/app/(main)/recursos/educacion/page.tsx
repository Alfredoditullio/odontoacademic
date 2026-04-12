'use client';

import { useState } from 'react';
import { EDUCATION_ITEMS, EDUCATION_TYPES } from '@/data/mock-resources';

const LEVEL_LABELS: Record<string, { label: string; color: string }> = {
  basico: { label: 'Básico', color: 'bg-emerald-100 text-emerald-700' },
  intermedio: { label: 'Intermedio', color: 'bg-amber-100 text-amber-700' },
  avanzado: { label: 'Avanzado', color: 'bg-red-100 text-red-700' },
};

const TYPE_ICONS: Record<string, string> = {
  diplomado: 'workspace_premium',
  curso: 'school',
  taller: 'construction',
  webinar: 'videocam',
};

export default function EducacionPage() {
  const [type, setType] = useState('Todos');

  const filtered = EDUCATION_ITEMS.filter((e) => type === 'Todos' || e.type === type.toLowerCase());

  return (
    <>
      <section className="bg-gradient-to-br from-emerald-600 to-teal-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-[32px]">school</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold">Educación Continua</h1>
          </div>
          <p className="text-white/80 max-w-2xl">Diplomados, cursos, talleres y webinars con los mejores especialistas de Latinoamérica.</p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-8">
            {EDUCATION_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                  type === t ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((e) => {
              const level = LEVEL_LABELS[e.level];
              return (
                <article key={e.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition group">
                  <div className="aspect-[16/9] bg-slate-100 overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={e.image} alt="" className="size-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-slate-700 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">{TYPE_ICONS[e.type]}</span>
                        {e.type.charAt(0).toUpperCase() + e.type.slice(1)}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${level.color}`}>
                        {level.label}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition line-clamp-2">{e.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">{e.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">person</span>
                          {e.instructor}
                        </span>
                        <span className="flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          {e.duration}
                        </span>
                      </div>
                      <span className="text-lg font-extrabold text-emerald-600">{e.price}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
