'use client';

import { useState } from 'react';
import { ATLAS_ITEMS, ATLAS_CATEGORIES } from '@/data/mock-resources';
import type { AtlasItem } from '@/lib/types';

const MALIGNANT_BADGE = {
  none:      { label: 'Sin potencial maligno', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  low:       { label: 'Potencial maligno bajo', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  moderate:  { label: 'Potencial maligno moderado', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  high:      { label: 'Potencial maligno alto', color: 'bg-red-50 text-red-700 border-red-200' },
  malignant: { label: 'Lesión maligna', color: 'bg-red-100 text-red-800 border-red-300' },
};

const CATEGORY_COLOR: Record<string, string> = {
  'Lesiones de tejidos blandos':    'bg-sky-50 text-sky-700',
  'Lesiones potencialmente malignas':'bg-orange-50 text-orange-700',
  'Infecciosas y virales':          'bg-violet-50 text-violet-700',
  'Lesiones pigmentadas':           'bg-brown-50 text-amber-800',
  'Tumores':                        'bg-rose-50 text-rose-700',
  'Quistes':                        'bg-teal-50 text-teal-700',
  'Patología ósea':                 'bg-slate-100 text-slate-700',
};

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider mb-3">
        <span className="material-symbols-outlined text-[16px] text-rose-500">{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

function DetailView({ item, onBack }: { item: AtlasItem; onBack: () => void }) {
  const malignant = MALIGNANT_BADGE[item.malignantPotential ?? 'none'];
  const catColor = CATEGORY_COLOR[item.category] ?? 'bg-slate-100 text-slate-700';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Back bar */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Volver al atlas
        </button>
        <span className="text-slate-300">·</span>
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${catColor}`}>{item.category}</span>
      </div>

      <div className="p-6 lg:p-8">
        {/* Title block */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">{item.name}</h2>
            {item.latinName && (
              <p className="text-sm italic text-slate-400 mt-0.5">{item.latinName}</p>
            )}
          </div>
          {item.malignantPotential && (
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${malignant.color}`}>
              <span className="material-symbols-outlined text-[14px]">
                {item.malignantPotential === 'none' ? 'check_circle' :
                 item.malignantPotential === 'malignant' ? 'dangerous' : 'warning'}
              </span>
              {malignant.label}
            </span>
          )}
        </div>

        {/* Image + description */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          <div className="lg:col-span-2 aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt={item.name} className="size-full object-cover" />
          </div>
          <div className="lg:col-span-3 space-y-4">
            <p className="text-slate-700 leading-relaxed">{item.description}</p>
            {item.epidemiology && (
              <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">bar_chart</span>
                  Epidemiología
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">{item.epidemiology}</p>
              </div>
            )}
          </div>
        </div>

        {/* Main content grid */}
        <div className="space-y-6">
          {/* Etiología */}
          {item.etiology && (
            <Section title="Etiología y factores de riesgo" icon="science">
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100">{item.etiology}</p>
            </Section>
          )}

          {/* Características clínicas */}
          <Section title="Características clínicas" icon="visibility">
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100">{item.clinicalFeatures}</p>
          </Section>

          {/* Diagnóstico + DDx */}
          <div className="grid md:grid-cols-2 gap-6">
            {item.diagnosis && (
              <Section title="Diagnóstico" icon="labs">
                <p className="text-sm text-slate-700 leading-relaxed">{item.diagnosis}</p>
              </Section>
            )}

            {item.differentialDiagnosis && item.differentialDiagnosis.length > 0 && (
              <Section title="Diagnóstico diferencial" icon="compare">
                <ul className="space-y-1.5">
                  {item.differentialDiagnosis.map((dd, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="text-rose-400 mt-0.5 shrink-0">↔</span>
                      {dd}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </div>

          {/* Tratamiento */}
          <Section title="Tratamiento" icon="healing">
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
              <p className="text-sm text-slate-700 leading-relaxed">{item.treatment}</p>
            </div>
          </Section>

          {/* Pronóstico */}
          {item.prognosis && (
            <Section title="Pronóstico y seguimiento" icon="trending_up">
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-4">
                <p className="text-sm text-slate-700 leading-relaxed">{item.prognosis}</p>
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function AtlasCard({ item, onClick }: { item: AtlasItem; onClick: () => void }) {
  const catColor = CATEGORY_COLOR[item.category] ?? 'bg-slate-100 text-slate-700';
  const malignant = item.malignantPotential && item.malignantPotential !== 'none'
    ? MALIGNANT_BADGE[item.malignantPotential]
    : null;

  return (
    <button
      onClick={onClick}
      className="group bg-white rounded-xl border border-slate-200 overflow-hidden text-left hover:border-rose-300 hover:shadow-lg transition-all"
    >
      <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image} alt="" className="size-full object-cover group-hover:scale-105 transition-transform duration-300" />
        {malignant && (
          <div className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-1 rounded-full border backdrop-blur-sm ${malignant.color}`}>
            {item.malignantPotential === 'malignant' ? 'Maligno' :
             item.malignantPotential === 'high' ? '⚠ Alto riesgo' :
             item.malignantPotential === 'moderate' ? '⚠ Riesgo mod.' :
             '↑ Riesgo bajo'}
          </div>
        )}
      </div>
      <div className="p-4">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${catColor}`}>
          {item.category}
        </span>
        <h3 className="font-bold text-slate-900 mt-2 group-hover:text-rose-600 transition text-sm leading-snug">
          {item.name}
        </h3>
        {item.latinName && (
          <p className="text-[11px] italic text-slate-400 mt-0.5">{item.latinName}</p>
        )}
        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{item.description}</p>
        <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-rose-600 group-hover:gap-2 transition-all">
          Ver ficha completa
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </div>
      </div>
    </button>
  );
}

export default function AtlasPage() {
  const [category, setCategory] = useState('Todos');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = ATLAS_ITEMS.filter((a) => {
    if (category !== 'Todos' && a.category !== category) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        a.name.toLowerCase().includes(q) ||
        (a.latinName?.toLowerCase().includes(q) ?? false) ||
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selected = selectedId ? ATLAS_ITEMS.find((a) => a.id === selectedId) : null;

  // Count per category
  const countMap: Record<string, number> = {};
  ATLAS_ITEMS.forEach((a) => {
    countMap[a.category] = (countMap[a.category] ?? 0) + 1;
  });

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-600 via-pink-600 to-fuchsia-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-[36px]">biotech</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold">Atlas de Patología Oral</h1>
          </div>
          <p className="text-white/80 max-w-2xl mt-1">
            Fichas clínicas completas de las patologías más frecuentes de la cavidad oral: epidemiología, etiología, diagnóstico diferencial, tratamiento y pronóstico.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            {(['Lesiones de tejidos blandos', 'Lesiones potencialmente malignas', 'Tumores'] as const).map((c) => (
              <span key={c} className="text-xs bg-white/15 border border-white/25 px-3 py-1 rounded-full font-medium">
                {c}
              </span>
            ))}
            <span className="text-xs bg-white/15 border border-white/25 px-3 py-1 rounded-full font-medium">+ más categorías</span>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {selected ? (
            <DetailView item={selected} onBack={() => setSelectedId(null)} />
          ) : (
            <>
              {/* Search + filter */}
              <div className="space-y-4 mb-8">
                <div className="relative max-w-lg">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar lesión o nombre latino..."
                    className="w-full pl-11 pr-10 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 bg-white shadow-sm"
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {ATLAS_CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => { setCategory(c); setSearch(''); }}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                        category === c
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:border-rose-300 hover:text-rose-700'
                      }`}
                    >
                      {c}
                      {c !== 'Todos' && countMap[c] && (
                        <span className={`text-[10px] font-black ${category === c ? 'text-white/70' : 'text-slate-400'}`}>
                          {countMap[c]}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-400 font-bold mb-5">
                {filtered.length} {filtered.length === 1 ? 'lesión' : 'lesiones'}
                {category !== 'Todos' && <span className="text-rose-600"> · {category}</span>}
              </p>

              {filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                  <span className="material-symbols-outlined text-[48px] text-slate-300 mb-3 block">biotech</span>
                  <p className="text-slate-500">No se encontraron lesiones para "{search}"</p>
                  <button onClick={() => { setSearch(''); setCategory('Todos'); }} className="text-rose-600 font-semibold text-sm mt-3 hover:underline">
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filtered.map((a) => (
                    <AtlasCard key={a.id} item={a} onClick={() => setSelectedId(a.id)} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
