'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { MOCK_POSTS, MOCK_CATEGORIES } from '@/data/mock-community';
import { PostCard } from '@/components/comunidad/PostCard';
import { ClinicalPostModal } from '@/components/comunidad/ClinicalPostModal';
import { PresentationModal, type PresentationRecord } from '@/components/comunidad/PresentationModal';

const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 30 * 6;
const LS_KEY = 'ol_presentation';

function timeUntilRenewal(postedAt: string): string {
  const posted = new Date(postedAt).getTime();
  const renewsAt = posted + SIX_MONTHS_MS;
  const diff = renewsAt - Date.now();
  if (diff <= 0) return '';
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days > 60) return `en ${Math.ceil(days / 30)} meses`;
  if (days > 1)  return `en ${days} días`;
  return 'mañana';
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const category = MOCK_CATEGORIES.find((c) => c.slug === slug);
  const posts = MOCK_POSTS.filter((p) => p.category_slug === slug);

  const [showClinicalModal, setShowClinicalModal] = useState(false);
  const [showPresentationModal, setShowPresentationModal] = useState(false);

  // Presentation state (loaded from localStorage)
  const [presentation, setPresentation] = useState<PresentationRecord | null>(null);
  const [presentationLoaded, setPresentationLoaded] = useState(false);

  useEffect(() => {
    if (slug !== 'presentaciones') { setPresentationLoaded(true); return; }
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setPresentation(JSON.parse(raw) as PresentationRecord);
    } catch { /* ignore */ }
    setPresentationLoaded(true);
  }, [slug]);

  function handlePosted(record: PresentationRecord) {
    setPresentation(record);
    setShowPresentationModal(false);
  }

  if (!category) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-slate-500">Categoría no encontrada</p>
        <Link href="/comunidad" className="text-primary font-semibold mt-4 inline-block">Volver al feed</Link>
      </div>
    );
  }

  const isClinical       = slug === 'casos-clinicos';
  const isPresentation   = slug === 'presentaciones';

  // Presentation logic
  const alreadyPresented = !!presentation;
  const canRenew         = alreadyPresented && (Date.now() - new Date(presentation!.postedAt).getTime()) >= SIX_MONTHS_MS;
  const renewsIn         = alreadyPresented && !canRenew ? timeUntilRenewal(presentation!.postedAt) : '';
  const postedDate       = alreadyPresented
    ? new Date(presentation!.postedAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <>
      {showClinicalModal     && <ClinicalPostModal onClose={() => setShowClinicalModal(false)} />}
      {showPresentationModal && <PresentationModal onClose={() => setShowPresentationModal(false)} onPosted={handlePosted} />}

      <div className="space-y-4">

        {/* ── Category header ── */}
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

            {/* ── CTA: Casos Clínicos ── */}
            {isClinical && (
              <button
                onClick={() => setShowClinicalModal(true)}
                className="shrink-0 inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-emerald-50 transition shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span className="hidden sm:inline">Publicar caso</span>
                <span className="sm:hidden">Publicar</span>
              </button>
            )}

            {/* ── CTA: Presentaciones ── */}
            {isPresentation && presentationLoaded && (
              <>
                {!alreadyPresented && (
                  <button
                    onClick={() => setShowPresentationModal(true)}
                    className="shrink-0 inline-flex items-center gap-2 bg-white text-sky-700 font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-sky-50 transition shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">waving_hand</span>
                    <span className="hidden sm:inline">Presentarme</span>
                    <span className="sm:hidden">Presentarme</span>
                  </button>
                )}
                {alreadyPresented && canRenew && (
                  <button
                    onClick={() => setShowPresentationModal(true)}
                    className="shrink-0 inline-flex items-center gap-2 bg-white text-sky-700 font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-sky-50 transition shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">refresh</span>
                    <span className="hidden sm:inline">Actualizar presentación</span>
                    <span className="sm:hidden">Actualizar</span>
                  </button>
                )}
              </>
            )}
          </div>

          {/* Clinical stats bar */}
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

        {/* ── Presentation status banner ── */}
        {isPresentation && presentationLoaded && alreadyPresented && (
          <div className={`rounded-xl px-5 py-4 flex items-start gap-3 border ${canRenew ? 'bg-sky-50 border-sky-200' : 'bg-slate-50 border-slate-200'}`}>
            <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${canRenew ? 'bg-sky-100' : 'bg-slate-100'}`}>
              <span className={`material-symbols-outlined text-[20px] ${canRenew ? 'text-sky-500' : 'text-slate-400'}`}>
                {canRenew ? 'refresh' : 'check_circle'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              {canRenew ? (
                <>
                  <p className="text-sm font-bold text-sky-800">¡Ya podés actualizar tu presentación!</p>
                  <p className="text-xs text-sky-600 mt-0.5">
                    Han pasado más de 6 meses desde tu presentación del {postedDate}. Contale a la comunidad en qué estás ahora.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-bold text-slate-700">
                    Ya te presentaste el {postedDate}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Vas a poder actualizar tu presentación {renewsIn}.
                  </p>
                  {presentation && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-[11px] font-semibold bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full">
                        {presentation.specialty}
                      </span>
                      <span className="text-[11px] font-semibold bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">location_on</span>
                        {presentation.country}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Clinical hint */}
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
            <span className="material-symbols-outlined text-slate-300 text-[40px]">forum</span>
            <p className="font-semibold text-slate-700 mt-3">No hay posts en esta categoría todavía</p>
            {isClinical && (
              <button
                onClick={() => setShowClinicalModal(true)}
                className="mt-4 inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Ser el primero en publicar
              </button>
            )}
            {isPresentation && !alreadyPresented && (
              <button
                onClick={() => setShowPresentationModal(true)}
                className="mt-4 inline-flex items-center gap-2 bg-sky-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-sky-700 transition"
              >
                <span className="material-symbols-outlined text-[18px]">waving_hand</span>
                Ser el primero en presentarse
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
