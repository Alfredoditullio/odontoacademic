'use client';

import { useState } from 'react';
import { VADEMECUM, VADEMECUM_CATEGORIES } from '@/data/mock-resources';
import type { VademecumItem } from '@/lib/types';

const ALERT_STYLES = {
  normal: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'check_circle', label: 'Uso habitual' },
  caution: { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'warning', label: 'Precaución' },
  warning: { bg: 'bg-red-50', text: 'text-red-700', icon: 'error', label: 'Usar con criterio' },
};

function DrugCard({ drug }: { drug: VademecumItem }) {
  const [open, setOpen] = useState(false);
  const alert = ALERT_STYLES[drug.alertLevel ?? 'normal'];

  return (
    <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-emerald-300 transition-colors">
      {/* Header — always visible */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-6 py-5 flex items-start gap-4 group"
      >
        <div className="size-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-white text-[22px]">medication</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <h3 className="text-base font-bold text-slate-900">{drug.name}</h3>
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full truncate max-w-[220px]">
              {drug.genericName}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {drug.category}
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${alert.bg} ${alert.text}`}>
              <span className="material-symbols-outlined text-[13px]">{alert.icon}</span>
              {alert.label}
            </span>
          </div>
          {/* Quick indications preview */}
          <p className="text-xs text-slate-500 mt-1.5 line-clamp-1">
            {drug.indications[0]}
            {drug.indications.length > 1 && <span className="text-slate-400"> +{drug.indications.length - 1} más</span>}
          </p>
        </div>
        <span className={`material-symbols-outlined text-slate-400 text-[22px] shrink-0 mt-1 transition-transform ${open ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="border-t border-slate-100 px-6 py-5 space-y-5 bg-slate-50/50">

          {/* Indicaciones */}
          <div>
            <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-emerald-600">assignment</span>
              Indicaciones en odontología
            </h4>
            <ul className="space-y-1">
              {drug.indications.map((ind, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                  {ind}
                </li>
              ))}
            </ul>
          </div>

          {/* Dosis */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-sky-500">person</span>
                Dosis adulto
              </p>
              <p className="text-sm text-slate-800 leading-relaxed">{drug.dose.adult}</p>
            </div>
            {drug.dose.pediatric && (
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-violet-500">child_care</span>
                  Dosis pediátrica
                </p>
                <p className="text-sm text-slate-800 leading-relaxed">{drug.dose.pediatric}</p>
              </div>
            )}
          </div>

          {/* Presentaciones */}
          <div>
            <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-sky-500">inventory_2</span>
              Presentaciones disponibles
            </h4>
            <div className="flex flex-wrap gap-2">
              {drug.presentations.map((p, i) => (
                <span key={i} className="text-xs bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-1 rounded-full font-medium">
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Contraindicaciones + Interacciones */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-red-500">block</span>
                Contraindicaciones
              </h4>
              <ul className="space-y-1.5">
                {drug.contraindications.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5">
                    <span className="text-red-400 shrink-0 mt-0.5">✕</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-amber-500">sync_alt</span>
                Interacciones importantes
              </h4>
              <ul className="space-y-1.5">
                {drug.interactions.map((inter, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-1.5">
                    <span className="text-amber-400 shrink-0 mt-0.5">⚠</span>
                    {inter}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Notas clínicas */}
          {drug.notes && (
            <div className="bg-white border border-emerald-200 rounded-xl p-4 flex gap-3">
              <span className="material-symbols-outlined text-[20px] text-emerald-600 shrink-0 mt-0.5">lightbulb</span>
              <div>
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider mb-1">Nota clínica</p>
                <p className="text-sm text-slate-700 leading-relaxed">{drug.notes}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default function VademecumPage() {
  const [category, setCategory] = useState('Todos');
  const [search, setSearch] = useState('');

  const filtered = VADEMECUM.filter((d) => {
    if (category !== 'Todos' && d.category !== category) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        d.genericName.toLowerCase().includes(q) ||
        d.indications.some((i) => i.toLowerCase().includes(q)) ||
        d.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-[36px]">medication</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold">Vademécum Odontológico</h1>
          </div>
          <p className="text-white/80 max-w-2xl mt-1">
            Medicamentos de uso frecuente en odontología: dosis, presentaciones, contraindicaciones e interacciones. Actualizado con evidencia actual.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5">
            <span className="material-symbols-outlined text-[18px] text-amber-300">info</span>
            <p className="text-xs text-white/90">
              <strong>Solo para uso profesional.</strong> Verificá siempre con el prospecto actualizado y ajustá según el paciente.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Search + Filter */}
          <div className="space-y-4 mb-8">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, principio activo o indicación..."
                className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white shadow-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {VADEMECUM_CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                    category === c
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-400 font-bold mb-5">
            {filtered.length} {filtered.length === 1 ? 'medicamento' : 'medicamentos'}
            {category !== 'Todos' && <span className="text-emerald-600"> · {category}</span>}
          </p>

          {/* Drug list */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <span className="material-symbols-outlined text-[48px] text-slate-300 mb-3 block">medication_liquid</span>
                <p className="text-slate-500">No se encontraron medicamentos para "{search}"</p>
                <button onClick={() => { setSearch(''); setCategory('Todos'); }} className="text-emerald-600 font-semibold text-sm mt-3 hover:underline">
                  Limpiar filtros
                </button>
              </div>
            ) : (
              filtered.map((drug) => <DrugCard key={drug.id} drug={drug} />)
            )}
          </div>

          {/* Disclaimer footer */}
          <div className="mt-10 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3">
            <span className="material-symbols-outlined text-[24px] text-amber-500 shrink-0 mt-0.5">gavel</span>
            <div>
              <p className="text-sm font-bold text-amber-800 mb-1">Aviso legal</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                Este vademécum es una herramienta de referencia rápida destinada exclusivamente a profesionales de la salud dental. Las dosis y recomendaciones son orientativas. Siempre verificar con el prospecto oficial del medicamento, ajustar según condición clínica del paciente, peso, función renal/hepática y medicación concomitante. OdontoLatam no se responsabiliza por el uso clínico de esta información.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
