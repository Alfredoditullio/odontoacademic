/**
 * Página de categoría. Server Component:
 *  - Resuelve el slug → categoría real desde DB.
 *  - Lista los posts de esa categoría con paginación inicial (20).
 *  - Botón "Nuevo post" linkea al form genérico con la categoría preseleccionada.
 *
 * NOTA: los modales especializados (ClinicalPostModal, MarketModal, etc.) que
 * existían en la versión mock se conectarán a `createPost` con metadata
 * específica en una próxima fase. Por ahora, todos los users crean posts
 * via el form unificado en `/comunidad/new`.
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getCategoryBySlug,
  getFeed,
  getLikedPostIdsForCurrentUser,
} from '@/lib/queries/community';
import { PostCard } from '@/components/comunidad/PostCard';

// Cache compartido por slug. Invalidación: revalidatePath cuando se crea/borra
// un post de esta categoría (lo hace `createPost` en server actions).
export const revalidate = 30;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const posts = await getFeed({ categorySlug: slug, limit: 20 });
  const likedIds = await getLikedPostIdsForCurrentUser(posts.map((p) => p.id));

  const newPostHref = `/comunidad/new?categoria=${encodeURIComponent(slug)}`;

  return (
    <div className="space-y-4">

      {/* Category header */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: `linear-gradient(135deg, ${category.color ?? '#0284c7'}, ${category.color ?? '#0284c7'}99)` }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="material-symbols-outlined text-[28px] shrink-0">{category.icon ?? 'tag'}</span>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold truncate">{category.name}</h1>
              {category.description && (
                <p className="text-sm text-white/80 mt-0.5 line-clamp-2">{category.description}</p>
              )}
            </div>
          </div>

          {category.post_policy === 'open' && (
            <Link
              href={newPostHref}
              className="shrink-0 inline-flex items-center gap-2 bg-white text-slate-800 font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-slate-50 transition shadow-sm"
              style={{ color: category.color ?? '#0284c7' }}
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span className="hidden sm:inline">Publicar</span>
            </Link>
          )}
        </div>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <span className="material-symbols-outlined text-[40px] text-slate-300">forum</span>
          <p className="text-slate-500 mt-2">Todavía no hay posts en esta categoría.</p>
          {category.post_policy === 'open' && (
            <Link
              href={newPostHref}
              className="inline-flex items-center gap-1.5 mt-4 text-primary font-semibold text-sm hover:underline"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Sé el primero en publicar
            </Link>
          )}
        </div>
      ) : (
        posts.map((p) => (
          <PostCard key={p.id} post={p} initialLiked={likedIds.has(p.id)} />
        ))
      )}
    </div>
  );
}
