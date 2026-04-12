'use client';

import { useState } from 'react';
import { ATLAS_ITEMS, ATLAS_CATEGORIES } from '@/data/mock-resources';

export default function AtlasPage() {
  const [category, setCategory] = useState('Todos');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = ATLAS_ITEMS.filter((a) => category === 'Todos' || a.category === category);
  const detail = selected ? ATLAS_ITEMS.find((a) => a.id === selected) : null;

  return (
    <>
      <section className="bg-gradient-to-br from-rose-600 to-pink-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-[32px]">biotech</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold">Atlas de Patología Oral</h1>
          </div>
          <p className="text-white/80 max-w-2xl">Galería completa de patologías orales con imágenes clínicas, características diagnósticas y guías de tratamiento.</p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-8">
            {ATLAS_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => { setCategory(c); setSelected(null); }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                  category === c ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {detail ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-sm text-primary font-semibold mb-6 hover:underline">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Volver al atlas
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={detail.image} alt="" className="size-full object-cover" />
                </div>
                <div>
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">{detail.category}</span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-1 mb-4">{detail.name}</h2>
                  <p className="text-slate-600 leading-relaxed mb-6">{detail.description}</p>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-rose-500">visibility</span>
                        Características Clínicas
                      </h3>
                      <p className="text-sm text-slate-600">{detail.clinicalFeatures}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-emerald-500">healing</span>
                        Tratamiento
                      </h3>
                      <p className="text-sm text-slate-600">{detail.treatment}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelected(a.id)}
                  className="group bg-white rounded-xl border border-slate-200 overflow-hidden text-left hover:border-rose-300 hover:shadow-lg transition-all"
                >
                  <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.image} alt="" className="size-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">{a.category}</span>
                    <h3 className="font-bold text-slate-900 mt-1 group-hover:text-rose-600 transition">{a.name}</h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{a.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
