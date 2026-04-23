'use client';

import Link from 'next/link';
import { MOCK_POSTS, MOCK_CATEGORIES } from '@/data/mock-community';
import { PostCard } from '@/components/comunidad/PostCard';

const QUICK_POST_CATEGORIES = [
  { slug: 'casos-clinicos',  icon: 'stethoscope',  label: 'Caso clínico', color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200' },
  { slug: 'marketing-dental', icon: 'campaign',    label: 'Marketing',    color: 'text-amber-600  bg-amber-50  hover:bg-amber-100  border-amber-200'  },
  { slug: 'ia-tecnologia',   icon: 'smart_toy',    label: 'IA y Tech',    color: 'text-violet-600 bg-violet-50 hover:bg-violet-100 border-violet-200' },
  { slug: 'carrera-estudios', icon: 'school',      label: 'Estudios',     color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-indigo-200' },
  { slug: 'sala-de-espera',  icon: 'sentiment_very_satisfied', label: 'Humor', color: 'text-orange-600 bg-orange-50 hover:bg-orange-100 border-orange-200' },
  { slug: 'mercado',         icon: 'storefront',   label: 'Mercado',      color: 'text-teal-600   bg-teal-50   hover:bg-teal-100   border-teal-200'   },
];

export default function CommunityFeedPage() {
  return (
    <div className="space-y-4">

      {/* Hero banner */}
      <div className="bg-gradient-to-br from-sky-600 via-cyan-600 to-teal-600 rounded-2xl p-6 text-white shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold mb-1">Bienvenido a la Comunidad OdontoLatam</h1>
        <p className="text-sm text-white/90 max-w-xl">
          El lugar donde los odontólogos de Latinoamérica compartimos casos, dudas, aprendemos y crecemos juntos.
        </p>
      </div>

      {/* Feed Composer */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">¿Qué querés compartir?</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {QUICK_POST_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/comunidad/c/${cat.slug}`}
              className={`inline-flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-bold transition ${cat.color}`}
            >
              <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Posts */}
      {MOCK_POSTS.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  );
}
