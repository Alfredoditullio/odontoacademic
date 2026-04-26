'use client';

/**
 * Dos client islands separados para el post detail:
 *
 *  <PostLikeFooter>      — footer del article: like button + contadores (REST + optimistic)
 *  <PostCommentsSection> — card aparte: form + lista con polling cada 10s
 *
 * Decisión arquitectónica para escala (miles de usuarios concurrentes):
 *  - NO usamos Realtime para comentarios. Cada usuario viendo el post abriría
 *    una conexión persistente; con 5000 usuarios viendo posts a la vez =
 *    5000 conn que pegan al límite del plan Pro (500) o cuestan ~$45/mes.
 *  - En lugar de eso, hacemos polling incremental cada 10s con el cursor del
 *    último comment conocido. Se PAUSA cuando la pestaña no está visible.
 *  - El usuario que comenta ve su comment instantáneo (optimistic UI), los
 *    demás lo ven a los ~10s. Aceptable para foro, no para chat.
 *  - El chat directo SÍ usará Realtime (Fase 2) — es la única feature donde
 *    la latencia importa.
 */

import { useState, useTransition, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import type { CommentWithAuthor } from '@/lib/types';
import { timeAgo, initials } from '@/lib/utils';
import { toggleLike, createComment } from '@/lib/actions/community';
import { fetchNewCommentsSince } from '@/lib/queries/comments-client';
import { usePollingWhenVisible } from '@/lib/hooks/usePollingWhenVisible';

/* ─────────────────── Like footer ─────────────────── */

interface LikeFooterProps {
  postId: string;
  initialLikeCount: number;
  initialLiked: boolean;
  initialCommentCount: number;
}

export function PostLikeFooter({
  postId,
  initialLikeCount,
  initialLiked,
  initialCommentCount,
}: LikeFooterProps) {
  const { user } = useAuth();
  const [liked, setLiked]         = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [pending, startTransition] = useTransition();

  function handleLike() {
    if (pending || !user) return;
    const prevLiked = liked;
    const prevCount = likeCount;
    setLiked(!prevLiked);
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);

    startTransition(async () => {
      const res = await toggleLike(postId);
      if (!res.ok) { setLiked(prevLiked); setLikeCount(prevCount); }
    });
  }

  return (
    <footer className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-4">
      <button
        onClick={handleLike}
        disabled={!user || pending}
        className={`inline-flex items-center gap-1.5 text-sm font-semibold transition disabled:opacity-50 ${
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
        {initialCommentCount} comentarios
      </span>
      <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
        en vivo
      </span>
    </footer>
  );
}

/* ─────────────────── Comments con realtime ─────────────────── */

interface CommentsProps {
  postId: string;
  initialComments: CommentWithAuthor[];
  /** Cada cuántos ms refetchear comments. Default 10s. */
  pollIntervalMs?: number;
}

export function PostCommentsSection({
  postId,
  initialComments,
  pollIntervalMs = 10_000,
}: CommentsProps) {
  const { user, profile } = useAuth();

  const [comments, setComments]       = useState<CommentWithAuthor[]>(initialComments);
  const [commentText, setCommentText] = useState('');
  const [pending, startTransition]    = useTransition();
  const [error, setError]             = useState<string | null>(null);

  const localCommentIds = useRef<Set<string>>(new Set());

  // Cursor: timestamp del último comment que ya tenemos. Cada poll trae
  // SOLO comments con created_at > cursor (incremental, no refetch full).
  const cursorRef = useRef<string>(
    initialComments.length > 0
      ? initialComments[initialComments.length - 1]!.created_at
      : new Date(0).toISOString(),
  );

  /* ── Polling incremental cada 10s, pausado si la pestaña está oculta ── */
  usePollingWhenVisible(
    async () => {
      const newOnes = await fetchNewCommentsSince(postId, cursorRef.current);
      if (newOnes.length === 0) return;

      // Filtramos los que ya están localmente (optimistic) o duplicados
      const filtered = newOnes.filter((c) => {
        if (localCommentIds.current.has(c.id)) {
          localCommentIds.current.delete(c.id);
          return false;
        }
        return true;
      });

      if (filtered.length === 0) {
        // Igual movemos el cursor para no re-traerlos
        cursorRef.current = newOnes[newOnes.length - 1]!.created_at;
        return;
      }

      setComments((prev) => {
        const seen = new Set(prev.map((c) => c.id));
        const merged = [...prev];
        for (const c of filtered) if (!seen.has(c.id)) merged.push(c);
        return merged;
      });
      cursorRef.current = newOnes[newOnes.length - 1]!.created_at;
    },
    { intervalMs: pollIntervalMs },
  );

  function handleSendComment() {
    const text = commentText.trim();
    if (!text || pending || !user || !profile) return;
    setError(null);

    const tempId = `temp-${Date.now()}`;
    const optimistic: CommentWithAuthor = {
      id: tempId,
      post_id: postId,
      author_id: user.id,
      body: text,
      is_deleted: false,
      created_at: new Date().toISOString(),
      author: {
        user_id: user.id,
        handle: profile.handle ?? '',
        display_name: profile.display_name,
        avatar_url: profile.avatar_url,
        bio: profile.bio, specialty: profile.specialty,
        country: profile.country, city: null,
        phone: null, website: null, accepts_referrals: false,
        reputation_points: 0, follower_count: 0, following_count: 0,
        rules_accepted_at: null, role: 'member',
        study_year: null, university: null,
        created_at: '', updated_at: '',
      },
    };
    setComments((prev) => [...prev, optimistic]);
    setCommentText('');

    startTransition(async () => {
      const res = await createComment(postId, text);
      if (!res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== tempId));
        setCommentText(text);
        setError(res.error);
        return;
      }
      localCommentIds.current.add(res.data.id);
      setComments((prev) =>
        prev.map((c) => (c.id === tempId ? { ...c, id: res.data.id } : c)),
      );
    });
  }

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="font-bold text-slate-900 mb-4">Comentarios</h2>

      {user && profile ? (
        <div className="flex gap-3 mb-6">
          <div className={`size-9 rounded-full bg-gradient-to-br ${profile.avatar_color ?? 'from-sky-500 to-cyan-500'} flex items-center justify-center font-bold text-white text-xs shrink-0`}>
            {initials(profile.display_name)}
          </div>
          <div className="flex-1">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSendComment(); }}
              placeholder="Escribí un comentario... (Cmd+Enter para enviar)"
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none placeholder:text-slate-300"
            />
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
            <div className="flex justify-end mt-2">
              <button
                onClick={handleSendComment}
                disabled={!commentText.trim() || pending}
                className="inline-flex items-center gap-1.5 bg-primary text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                {pending ? 'Enviando...' : 'Comentar'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Link
          href="/login"
          className="block bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-6 text-center text-sm text-slate-600 hover:bg-slate-100 transition"
        >
          <span className="font-semibold text-primary">Iniciá sesión</span> para comentar
        </Link>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">Todavía no hay comentarios. Sé el primero.</p>
        ) : (
          comments.map((c) => (
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
                  {c.author.specialty && <span className="text-slate-400">· {c.author.specialty}</span>}
                  <span className="text-slate-400">{timeAgo(c.created_at)}</span>
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{c.body}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
