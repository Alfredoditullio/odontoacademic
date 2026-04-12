'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import { BIBLIOGRAPHY, BIBLIOGRAPHY_CATEGORIES } from '@/data/mock-resources';

export default function BibliografiaPage() {
  const [category, setCategory] = useState('Todos');
  const [search, setSearch] = useState('');

  const filtered = BIBLIOGRAPHY.filter((b) => {
    if (category !== 'Todos' && b.category !== category) return false;
    if (search && !b.title.toLowerCase().includes(search.toLowerCase()) && !b.authors.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <section className="bg-gradient-to-br from-blue-600 to-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-[32px]">menu_book</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold">Bibliografía</h1>
          </div>
          <p className="text-white/80 max-w-2xl">Artículos científicos y revisiones sistemáticas de las principales revistas de odontología.</p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por título o autor..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {BIBLIOGRAPHY_CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                    category === c ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-400 font-bold mb-4">{filtered.length} artículos</p>

          <div className="space-y-4">
            {filtered.map((b) => (
              <article key={b.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:border-primary/30 transition">
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-blue-600 text-[20px]">article</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{b.category}</span>
                    <h3 className="font-bold text-slate-900 mt-1 mb-1">{b.title}</h3>
                    <p className="text-sm text-slate-500">{b.authors}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                      <span>{b.journal}</span>
                      <span>·</span>
                      <span>{b.year}</span>
                      <span>·</span>
                      <span className="text-primary font-semibold">DOI: {b.doi}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-3 leading-relaxed">{b.abstract}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
