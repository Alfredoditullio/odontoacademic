import Link from 'next/link';
import { MOCK_POSTS, MOCK_CATEGORIES } from '@/data/mock-community';
import { PostCard } from '@/components/comunidad/PostCard';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = MOCK_CATEGORIES.find((c) => c.slug === slug);
  const posts = MOCK_POSTS.filter((p) => p.category_slug === slug);

  if (!category) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-slate-500">Categoría no encontrada</p>
        <Link href="/comunidad" className="text-primary font-semibold mt-4 inline-block">Volver al feed</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: `linear-gradient(135deg, ${category.color ?? '#0284c7'}, ${category.color ?? '#0284c7'}99)` }}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-[28px]">{category.icon ?? 'tag'}</span>
          <h1 className="text-xl sm:text-2xl font-bold">{category.name}</h1>
        </div>
        {category.description && <p className="text-sm text-white/80">{category.description}</p>}
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <span className="material-symbols-outlined text-slate-300 text-3xl">forum</span>
          <p className="font-semibold text-slate-700 mt-2">No hay posts en esta categoría</p>
        </div>
      ) : (
        posts.map((p) => <PostCard key={p.id} post={p} />)
      )}
    </div>
  );
}
