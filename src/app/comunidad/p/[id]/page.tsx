/**
 * Post detail. Server Component:
 *  - Fetch del post + comentarios + estado de like del usuario en SSR.
 *  - Render del header / body / metadata es estático (SSR).
 *  - <PostInteractions> es un client island con la lógica de likes/comments
 *    + suscripción Realtime al canal `post:${id}:comments`.
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getPostById,
  getCommentsForPost,
  getLikedPostIdsForCurrentUser,
  getPollForPost,
} from '@/lib/queries/community';
import { timeAgo, initials } from '@/lib/utils';
import { PostLikeFooter, PostCommentsSection } from '@/components/comunidad/PostInteractions';
import { PollCard } from '@/components/comunidad/PollCard';
import type { MarketMeta } from '@/lib/types';

// El post detail no se cachea agresivamente (puede tener comments en vivo).
export const dynamic = 'force-dynamic';

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [post, comments, likedSet, poll] = await Promise.all([
    getPostById(id),
    getCommentsForPost(id),
    getLikedPostIdsForCurrentUser([id]),
    getPollForPost(id),
  ]);

  if (!post) notFound();

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
            <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
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
          const condLabels:    Record<string, string> = { new: 'Nuevo', like_new: 'Como nuevo', good: 'Buen estado', fair: 'Uso visible' };
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

        <div className="prose-post text-slate-700 whitespace-pre-wrap leading-relaxed">{post.body}</div>

        {/* Encuesta (si el post tiene una asociada) */}
        {poll && <PollCard poll={poll} postId={post.id} />}

        {/* Attachments (imágenes subidas) */}
        {post.attachment_urls && post.attachment_urls.length > 0 && (
          <div className={`mt-5 grid gap-2 ${
            post.attachment_urls.length === 1 ? 'grid-cols-1'
              : post.attachment_urls.length === 2 ? 'grid-cols-2'
              : 'grid-cols-2 sm:grid-cols-3'
          }`}>
            {post.attachment_urls.map((url, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100 hover:opacity-90 transition">
                <img src={url} alt={`Adjunto ${i + 1}`} className="size-full object-cover" />
              </a>
            ))}
          </div>
        )}

        {/* Like footer (client island, optimistic) */}
        <PostLikeFooter
          postId={post.id}
          initialLikeCount={post.like_count}
          initialLiked={likedSet.has(post.id)}
          initialCommentCount={post.comment_count}
        />
      </article>

      {/* Sección de comentarios con realtime (client island con suscripción) */}
      <PostCommentsSection postId={post.id} initialComments={comments} />

      <div className="text-center pb-4">
        <Link href="/comunidad" className="text-sm text-primary font-semibold hover:underline">
          ← Volver al feed
        </Link>
      </div>
    </div>
  );
}
