'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MOCK_CATEGORIES } from '@/data/mock-community';

const POST_TYPES = [
  { value: 'help', label: 'Pido ayuda', icon: 'help', color: 'bg-amber-100 text-amber-700', desc: 'Busco opinión de colegas sobre un caso en curso' },
  { value: 'resolved', label: 'Caso resuelto', icon: 'check_circle', color: 'bg-emerald-100 text-emerald-700', desc: 'Comparto un caso terminado y el plan aplicado' },
  { value: 'debate', label: 'Debate / pregunta', icon: 'forum', color: 'bg-indigo-100 text-indigo-700', desc: 'Discusión teórica o pregunta abierta a la comunidad' },
];

export default function NewPostPage() {
  const categories = MOCK_CATEGORIES.filter((c) => c.post_policy === 'open');
  const [categorySlug, setCategorySlug] = useState(categories[0]?.slug ?? '');
  const [postType, setPostType] = useState('help');

  const isClinical = categorySlug === 'casos-clinicos';

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h1 className="text-xl font-bold text-slate-900 mb-6">Nuevo post</h1>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          {/* Category picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Categoría</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {categories.map((c) => (
                <button
                  type="button"
                  key={c.slug}
                  onClick={() => setCategorySlug(c.slug)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left transition ${
                    categorySlug === c.slug ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]" style={{ color: c.color ?? '#64748b' }}>
                    {c.icon ?? 'tag'}
                  </span>
                  <span className="text-sm font-semibold text-slate-800">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Clinical post type */}
          {isClinical && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Tipo de post</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {POST_TYPES.map((t) => (
                  <button
                    type="button"
                    key={t.value}
                    onClick={() => setPostType(t.value)}
                    className={`px-3 py-3 rounded-lg border text-left transition ${
                      postType === t.value ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`size-6 rounded-full flex items-center justify-center ${t.color}`}>
                        <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
                      </span>
                      <span className="text-sm font-bold text-slate-800">{t.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Título</label>
            <input
              type="text"
              placeholder="Un título claro y conciso"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Contenido</label>
            <textarea
              rows={10}
              placeholder="Contenido del post..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y"
            />
          </div>

          {/* Image upload area */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
              Imágenes <span className="font-normal text-slate-400">(opcional, hasta 6)</span>
            </label>
            <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition">
              <span className="material-symbols-outlined text-[36px] text-slate-400">cloud_upload</span>
              <p className="text-sm font-semibold text-slate-600 mt-1">Arrastrá imágenes o hacé click</p>
              <p className="text-xs text-slate-400">PNG, JPG, HEIC hasta 10MB cada una</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link href="/comunidad" className="px-4 py-2 text-sm text-slate-600 font-semibold hover:text-slate-900">
              Cancelar
            </Link>
            <button
              type="submit"
              className="bg-primary text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
            >
              Publicar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
