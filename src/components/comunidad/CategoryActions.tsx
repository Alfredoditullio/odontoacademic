'use client';

/**
 * Botón "Publicar" + render del modal específico para cada categoría.
 *
 * Vive como client island dentro del header server-rendered de la página
 * de categoría. El estado de "qué modal está abierto" es local; el submit
 * de cada modal usa `useSubmitPostFromModal` que ya hace router.push al
 * detail del post creado.
 *
 * Para categorías sin modal específico (ej: novedades-odontolatam admin-only),
 * el componente cae al link genérico `/comunidad/new?categoria=…`.
 */

import { useState } from 'react';
import Link from 'next/link';
import { ClinicalPostModal }     from './ClinicalPostModal';
import { PresentationModal }     from './PresentationModal';
import { MarketModal }           from './MarketModal';
import { SalaDeEsperaModal }     from './SalaDeEsperaModal';
import { StudentPostModal }      from './StudentPostModal';
import { MarketingPostModal }    from './MarketingPostModal';
import { IATechPostModal }       from './IATechPostModal';

interface Props {
  categorySlug: string;
  categoryColor: string | null;
}

const MODAL_LABEL: Record<string, string> = {
  'casos-clinicos':     'Publicar caso',
  'presentaciones':     'Presentarme',
  'mercado':            'Publicar aviso',
  'sala-de-espera':     'Publicar',
  'carrera-estudios':   'Publicar',
  'marketing-dental':   'Publicar',
  'ia-tecnologia':      'Publicar',
};

export function CategoryActions({ categorySlug, categoryColor }: Props) {
  const [open, setOpen] = useState(false);

  const label = MODAL_LABEL[categorySlug] ?? 'Publicar';
  const fallbackHref = `/comunidad/new?categoria=${encodeURIComponent(categorySlug)}`;
  const knownSlug = categorySlug in MODAL_LABEL;

  if (!knownSlug) {
    // Categorías sin modal específico → link al form genérico
    return (
      <Link
        href={fallbackHref}
        className="shrink-0 inline-flex items-center gap-2 bg-white text-slate-800 font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-slate-50 transition shadow-sm"
        style={{ color: categoryColor ?? '#0284c7' }}
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        <span className="hidden sm:inline">Publicar</span>
      </Link>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="shrink-0 inline-flex items-center gap-2 bg-white font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-slate-50 transition shadow-sm"
        style={{ color: categoryColor ?? '#0284c7' }}
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        <span className="hidden sm:inline">{label}</span>
      </button>

      {open && categorySlug === 'casos-clinicos' && (
        <ClinicalPostModal onClose={() => setOpen(false)} />
      )}
      {open && categorySlug === 'presentaciones' && (
        <PresentationModal onClose={() => setOpen(false)} onPosted={() => setOpen(false)} />
      )}
      {open && categorySlug === 'mercado' && (
        <MarketModal onClose={() => setOpen(false)} />
      )}
      {open && categorySlug === 'sala-de-espera' && (
        <SalaDeEsperaModal onClose={() => setOpen(false)} />
      )}
      {open && categorySlug === 'carrera-estudios' && (
        <StudentPostModal onClose={() => setOpen(false)} />
      )}
      {open && categorySlug === 'marketing-dental' && (
        <MarketingPostModal onClose={() => setOpen(false)} />
      )}
      {open && categorySlug === 'ia-tecnologia' && (
        <IATechPostModal onClose={() => setOpen(false)} />
      )}
    </>
  );
}
