'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { MOCK_POSTS, MOCK_CATEGORIES } from '@/data/mock-community';
import { PostCard } from '@/components/comunidad/PostCard';
import { ClinicalPostModal } from '@/components/comunidad/ClinicalPostModal';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const category = MOCK_CATEGORIES.find((c) => c.slug === slug);
  const posts = MOCK_POSTS.filter((p) => p.category_slug === slug);
  const [showModal, setShowModal] = useState(false);

  const isClinical = slug === 'casos-clinicos';

  if (!category) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-slate-500">Categoría no encontrada</p>
        <Link href="/comunidad" className="text-primary font-semibold mt-4 inline-block">Volver al feed</Link>
      </div>
    );
  }

  return (
    <>
      {showModal && <ClinicalPostModal onClose={() => setShowModal(false)} />}

      <div className="space-y-4">
        {/* Category header */}
        <div
          className="rounded-2xl p-6 text-white shadow-sm"
          style={{ background: `linear-gradient(135deg, ${category.color ?? '#0284c7'}, ${category.color ?? '#0284c7'}99)` }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[28px]">{category.icon ?? 'tag'}</span>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">{category.name}</h1>
                {category.description && <p className="text-sm text-white/80 mt-0.5">{category.description}</p>}
              </div>
            </div>

            {/* CTA: solo en casos clínicos */}
            {isClinical && (
              <button
                onClick={() => setShowModal(true)}
                className="shrink-0 inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-emerald-50 transition shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span className="hidden sm:inline">Publicar caso</span>
                <span className="sm:hidden">Publicar</span>
              </button>
            )}
          </div>

          {/* Stats bar for clinical */}
          {isClinical && (
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/20 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-white/80">
                <span className="material-symbols-outlined text-[15px]">forum</span>
                {posts.length} casos publicados
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-white/80">
                <span className="material-symbols-outlined text-[15px]">group</span>
                5,000+ miembros activos
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-white/80">
                <span className="material-symbols-outlined text-[15px]">notifications_active</span>
                Especialistas reciben notificaciones
              </span>
            </div>
          )}
        </div>

        {/* How-to hint for clinical */}
        {isClinical && (
          <div className="bg-sky-50 border border-sky-200 rounded-xl px-4 py-3 flex items-start gap-3">
            <span className="material-symbols-outlined text-sky-500 text-[20px] shrink-0 mt-0.5">info</span>
            <p className="text-xs text-sky-700 leading-relaxed">
              <strong>¿Necesitás ayuda con un caso?</strong> Publicá y elegí la especialidad — los especialistas registrados en OdontoLatam reciben una notificación y pueden comentar. También podés compartir casos resueltos o abrir un debate con encuesta.
            </p>
          </div>
        )}

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <span className="material-symbols-outlined text-slate-300 text-3xl">forum</span>
            <p className="font-semibold text-slate-700 mt-2">No hay posts en esta categoría</p>
            {isClinical && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Ser el primero en publicar
              </button>
            )}
          </div>
        ) : (
          posts.map((p) => <PostCard key={p.id} post={p} />)
        )}
      </div>
    </>
  );
}
