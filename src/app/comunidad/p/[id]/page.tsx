'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { MOCK_POSTS, MOCK_COMMENTS } from '@/data/mock-community';
import { timeAgo, initials } from '@/lib/utils';
import type { MarketMeta, CommentWithAuthor } from '@/lib/types';

const ME = { user_id: 'me', handle: 'dr-rodriguez', display_name: 'Dr. Martín Rodríguez', role: 'member' as const };

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const post = MOCK_POSTS.find((p) => p.id === id);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.like_count ?? 0);
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState<CommentWithAuthor[]>(
    post ? MOCK_COMMENTS.filter((c) => c.post_id === id) : []
  );

  if (!post) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-slate-500">Post no encontrado</p>
        <Link href="/comunidad" className="text-primary font-semibold mt-4 inline-block">Volver al feed</Link>
      </div>
    );
  }

  function handleLike() {
    setLiked((prev) => !prev);
    setLikeCount((prev) => liked ? prev - 1 : prev + 1);
  }

  function handleComment() {
    const text = commentText.trim();
    if (!text) return;
    const newComment: CommentWithAuthor = {
      id: `c-local-${Date.now()}`,
      post_id: id,
      author_id: ME.user_id,
      body: text,
      is_deleted: false,
      created_at: new Date().toISOString(),
      author: {
        ...ME,
        avatar_url: null, bio: null, specialty: null, country: 'Argentina',
        city: null, phone: null, website: null, accepts_referrals: false,
        reputation_points: 450, follower_count: 128, following_count: 45,
        rules_accepted_at: new Date().toISOString(),
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      },
    };
    setLocalComments((prev) => [...prev, newComment]);
    setCommentText('');
  }

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

        <div className="prose-post text-slate-700 whitespace-pre-wrap leading-relaxed">{post.body}</div>

        <footer className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`inline-flex items-center gap-1.5 text-sm font-semibold transition ${
              liked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
            {likeCount}
          </button>
          <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
            <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
            {localComments.length} comentarios
          </span>
        </footer>
      </article>

      {/* Comments */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-900 mb-4">Comentarios</h2>

        {/* Comment form */}
        <div className="flex gap-3 mb-6">
          <div className="size-9 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center font-bold text-white text-xs shrink-0">
            MR
          </div>
          <div className="flex-1">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleComment(); }}
              placeholder="Escribí un comentario... (Cmd+Enter para enviar)"
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none placeholder:text-slate-300"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleComment}
                disabled={!commentText.trim()}
                className="inline-flex items-center gap-1.5 bg-primary text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                Comentar
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {localComments.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">Todavía no hay comentarios. Sé el primero.</p>
          ) : (
            localComments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <Link
                  href={`/comunidad/u/${c.author.handle}`}
                  className="size-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs flex-shrink-0 hover:bg-slate-300 transition"
                >
                  {initials(c.author.display_name)}
                </Link>
                <div className="flex-1 min-w-0 bg-slate-50 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2 text-xs mb-1">
                    <Link href={`/comunidad/u/${c.author.handle}`} className="font-bold text-slate-900 hover:underline">
                      {c.author.display_name}
                    </Link>
                    {c.author.specialty && (
                      <span className="text-slate-400">· {c.author.specialty}</span>
                    )}
                    <span className="text-slate-400">{timeAgo(c.created_at)}</span>
                  </div>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{c.body}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="text-center pb-4">
        <Link href="/comunidad" className="text-sm text-primary font-semibold hover:underline">
          ← Volver al feed
        </Link>
      </div>
    </div>
  );
}
