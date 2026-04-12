import Link from 'next/link';
import { MOCK_POSTS, MOCK_COMMENTS } from '@/data/mock-community';
import { timeAgo, initials } from '@/lib/utils';
import type { MarketMeta } from '@/lib/types';

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = MOCK_POSTS.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-slate-500">Post no encontrado</p>
        <Link href="/comunidad" className="text-primary font-semibold mt-4 inline-block">Volver al feed</Link>
      </div>
    );
  }

  const comments = MOCK_COMMENTS.filter((c) => c.post_id === id);

  return (
    <div className="space-y-4">
      <article className="bg-white rounded-xl border border-slate-200 p-6">
        <header className="flex items-center gap-3 mb-4">
          <Link
            href={`/comunidad/u/${post.author.handle}`}
            className="size-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm"
          >
            {initials(post.author.display_name)}
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={`/comunidad/u/${post.author.handle}`} className="font-semibold text-slate-900 hover:underline">
              {post.author.display_name}
            </Link>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              {post.author.specialty && <span>{post.author.specialty}</span>}
              {post.author.country && <span>· {post.author.country}</span>}
              <span>·</span>
              <Link
                href={`/comunidad/c/${post.category.slug}`}
                className="inline-flex items-center gap-1 font-medium"
                style={{ color: post.category.color ?? undefined }}
              >
                <span className="material-symbols-outlined text-[14px]">{post.category.icon ?? 'tag'}</span>
                {post.category.name}
              </Link>
              <span>·</span>
              <span>{timeAgo(post.created_at)}</span>
            </div>
          </div>
        </header>

        <h1 className="text-2xl font-bold text-slate-900 leading-tight mb-4">{post.title}</h1>

        {/* Mercado info bar */}
        {post.category.slug === 'mercado' && post.metadata && (() => {
          const m = post.metadata as Partial<MarketMeta>;
          const listingLabels: Record<string, string> = { sell: 'Vendo', buy: 'Compro', trade: 'Permuto' };
          const condLabels: Record<string, string> = { new: 'Nuevo', like_new: 'Como nuevo', good: 'Buen estado', fair: 'Uso visible' };
          return (
            <div className="flex flex-wrap items-center gap-3 mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              {m.listing_type && (
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                  {listingLabels[m.listing_type] ?? m.listing_type}
                </span>
              )}
              {m.price ? (
                <span className="text-xl font-black text-emerald-700">{m.currency ?? 'USD'} {m.price}</span>
              ) : (
                <span className="text-sm font-bold text-slate-500">A convenir</span>
              )}
              {m.condition && (
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {condLabels[m.condition] ?? m.condition}
                </span>
              )}
              {m.location && (
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  {m.location}
                </span>
              )}
            </div>
          );
        })()}

        <div className="prose-post text-slate-700">{post.body}</div>

        <footer className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-4">
          <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-rose-600 transition">
            <span className="material-symbols-outlined text-[20px]">favorite</span>
            {post.like_count}
          </button>
          <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
            <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
            {post.comment_count} comentarios
          </span>
        </footer>
      </article>

      {/* Comments */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-900 mb-4">Comentarios</h2>

        {/* Comment form placeholder */}
        <textarea
          placeholder="Escribí un comentario..."
          rows={3}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y mb-2"
        />
        <div className="flex justify-end mb-4">
          <button className="bg-primary text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition">
            Comentar
          </button>
        </div>

        <div className="space-y-4 mt-6">
          {comments.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">Todavía no hay comentarios. Sé el primero.</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <Link
                  href={`/comunidad/u/${c.author.handle}`}
                  className="size-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs flex-shrink-0"
                >
                  {initials(c.author.display_name)}
                </Link>
                <div className="flex-1 min-w-0 bg-slate-50 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Link href={`/comunidad/u/${c.author.handle}`} className="font-semibold text-slate-900 hover:underline">
                      {c.author.display_name}
                    </Link>
                    <span className="text-slate-400">{timeAgo(c.created_at)}</span>
                  </div>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap mt-1">{c.body}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="text-center">
        <Link href="/comunidad" className="text-sm text-primary font-semibold hover:underline">
          ← Volver al feed
        </Link>
      </div>
    </div>
  );
}
