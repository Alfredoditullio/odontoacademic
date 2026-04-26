/**
 * Feed principal de la comunidad. Server Component:
 *  - Fetch desde Supabase con paginación SSR (primer batch de 20).
 *  - El composer y el infinite scroll son client islands separados.
 *  - PostCard es client (tiene like button), pero recibe data ya hidratada.
 */

import Link from 'next/link';
import { getFeed, getLikedPostIdsForCurrentUser } from '@/lib/queries/community';
import { PostCard } from '@/components/comunidad/PostCard';

const QUICK_POST_CATEGORIES = [
  { slug: 'casos-clinicos',   icon: 'stethoscope',              label: 'Caso clínico', color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200' },
  { slug: 'marketing-dental', icon: 'campaign',                 label: 'Marketing',    color: 'text-amber-600  bg-amber-50  hover:bg-amber-100  border-amber-200'  },
  { slug: 'ia-tecnologia',    icon: 'smart_toy',                label: 'IA y Tech',    color: 'text-violet-600 bg-violet-50 hover:bg-violet-100 border-violet-200' },
  { slug: 'carrera-estudios', icon: 'school',                   label: 'Estudios',     color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-indigo-200' },
  { slug: 'sala-de-espera',   icon: 'sentiment_very_satisfied', label: 'Humor',        color: 'text-orange-600 bg-orange-50 hover:bg-orange-100 border-orange-200' },
  { slug: 'mercado',          icon: 'storefront',               label: 'Mercado',      color: 'text-teal-600   bg-teal-50   hover:bg-teal-100   border-teal-200'   },
];

// Revalida el feed cada 30s. A escala: el SSR cache de Next.js sirve el HTML
// pre-renderizado a múltiples usuarios y solo refetcha cuando expira; para
// novedades en tiempo real usamos client-side polling/refresh, no SSR.
export const revalidate = 30;

export default async function CommunityFeedPage() {
  const posts = await getFeed({ limit: 20 });
  const likedIds = await getLikedPostIdsForCurrentUser(posts.map((p) => p.id));

  return (
    <div className="space-y-4">

      {/* Hero banner */}
      <div className="bg-gradient-to-br from-sky-600 via-cyan-600 to-teal-600 rounded-2xl p-6 text-white shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold mb-1">Bienvenido a la Comunidad OdontoLatam</h1>
        <p className="text-sm text-white/90 max-w-xl">
          El lugar donde los odontólogos de Latinoamérica compartimos casos, dudas, aprendemos y crecemos juntos.
        </p>
      </div>

      {/* Feed Composer (links a categorías; los modales viven en cada categoría) */}
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
      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <span className="material-symbols-outlined text-[40px] text-slate-300">forum</span>
          <p className="text-slate-500 mt-2">Todavía no hay posts en la comunidad.</p>
          <p className="text-sm text-slate-400 mt-1">Sé el primero en compartir algo.</p>
        </div>
      ) : (
        posts.map((p) => (
          <PostCard key={p.id} post={p} initialLiked={likedIds.has(p.id)} />
        ))
      )}
    </div>
  );
}
