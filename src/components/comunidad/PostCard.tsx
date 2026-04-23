'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import type { PostWithAuthor } from '@/lib/types';
import { timeAgo, initials } from '@/lib/utils';
import { ReportModal } from './ReportModal';

const POST_TYPE_BADGE: Record<string, { label: string; icon: string; className: string }> = {
  help:     { label: 'Pido ayuda', icon: 'help',         className: 'bg-amber-100 text-amber-700'   },
  resolved: { label: 'Resuelto',   icon: 'check_circle', className: 'bg-emerald-100 text-emerald-700' },
  debate:   { label: 'Debate',     icon: 'forum',        className: 'bg-indigo-100 text-indigo-700'  },
};

interface PollOption { label: string; votes: number; }

function PollPreview({ options, total }: { options: PollOption[]; total: number }) {
  const top = Math.max(...options.map((o) => o.votes));
  return (
    <div className="mt-3 space-y-1.5">
      {options.slice(0, 4).map((o) => {
        const pct = total > 0 ? Math.round((o.votes / total) * 100) : 0;
        const isTop = o.votes === top;
        return (
          <div key={o.label} className="relative rounded-lg border border-slate-200 overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 ${isTop ? 'bg-violet-100' : 'bg-slate-100'}`}
              style={{ width: `${pct}%` }}
            />
            <div className="relative flex justify-between items-center px-3 py-1.5 text-xs">
              <span className={`font-semibold ${isTop ? 'text-violet-800' : 'text-slate-600'}`}>{o.label}</span>
              <span className={`font-black ml-2 shrink-0 ${isTop ? 'text-violet-700' : 'text-slate-400'}`}>{pct}%</span>
            </div>
          </div>
        );
      })}
      <p className="text-[10px] text-slate-400 font-semibold">{total.toLocaleString()} votos</p>
    </div>
  );
}

function OfficialBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
      <span className="material-symbols-outlined text-[11px]">verified</span>
      Creador Oficial
    </span>
  );
}

const STUDY_YEAR_LABEL: Record<number, string> = { 1: '1°', 2: '2°', 3: '3°', 4: '4°', 5: '5°', 6: '6°' };

function RoleBadge({ role, studyYear }: { role: string; studyYear?: number | null }) {
  if (role === 'student') {
    const year = studyYear ? `${STUDY_YEAR_LABEL[studyYear]} año` : 'Estudiante';
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-black bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
        <span className="material-symbols-outlined text-[11px]">school</span>
        {studyYear ? `Estudiante · ${year}` : 'Estudiante'}
      </span>
    );
  }
  if (role === 'moderator') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-black bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200">
        <span className="material-symbols-outlined text-[11px]">shield</span>
        Moderador
      </span>
    );
  }
  return null;
}

/* ─── Kebab menu ─── */
function PostMenu({ postTitle }: { postTitle: string }) {
  const [open, setOpen]         = useState(false);
  const [reporting, setReporting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  return (
    <>
      <div ref={ref} className="relative shrink-0">
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen((v) => !v); }}
          className="size-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          title="Opciones"
        >
          <span className="material-symbols-outlined text-[18px]">more_vert</span>
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-20">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(false);
                setReporting(true);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition font-semibold"
            >
              <span className="material-symbols-outlined text-[17px]">flag</span>
              Reportar
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigator.clipboard.writeText(window.location.origin + '/comunidad/p/' + postTitle);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition"
            >
              <span className="material-symbols-outlined text-[17px]">link</span>
              Copiar enlace
            </button>
          </div>
        )}
      </div>

      {reporting && (
        <ReportModal postTitle={postTitle} onClose={() => setReporting(false)} />
      )}
    </>
  );
}

export function PostCard({ post }: { post: PostWithAuthor }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.like_count);

  function handleLike(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLiked((prev) => !prev);
    setLikeCount((prev) => liked ? prev - 1 : prev + 1);
  }

  const typeBadge = post.post_type ? POST_TYPE_BADGE[post.post_type] : null;
  const isSalaDeEspera = post.category.slug === 'sala-de-espera';
  const isCarrera = post.category.slug === 'carrera-estudios';
  const isOfficialCreator = (post.author.follower_count ?? 0) > 1000;
  const isStudent = post.author.role === 'student';

  // Poll data from metadata
  const pollOptions = (post.metadata as Record<string, unknown>)?.poll_options as PollOption[] | undefined;
  const pollTotal   = (post.metadata as Record<string, unknown>)?.poll_total as number | undefined;
  const hasPoll     = !!pollOptions && pollOptions.length > 0;

  return (
    <article className={`bg-white rounded-xl border transition p-5 ${
      isSalaDeEspera
        ? 'border-orange-200 hover:border-orange-300 hover:shadow-sm'
        : isCarrera
          ? 'border-indigo-100 hover:border-indigo-200 hover:shadow-sm'
          : 'border-slate-200 hover:border-slate-300'
    }`}>
      <header className="flex items-center gap-3 mb-3">
        <Link
          href={`/comunidad/u/${post.author.handle}`}
          className="size-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm flex-shrink-0 overflow-hidden"
        >
          {post.author.avatar_url
            ? <img src={post.author.avatar_url} alt="" className="size-full object-cover" />
            : initials(post.author.display_name)
          }
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/comunidad/u/${post.author.handle}`} className="font-semibold text-slate-900 hover:underline text-sm truncate">
              {post.author.display_name}
            </Link>
            {isOfficialCreator && isSalaDeEspera && <OfficialBadge />}
            {(isStudent || post.author.role === 'moderator') && (
              <RoleBadge role={post.author.role} studyYear={post.author.study_year} />
            )}
            {post.author.country && (
              <span className="text-xs text-slate-400">· {post.author.country}</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {isStudent && post.author.university && (
              <span className="text-indigo-400 font-medium">{post.author.university}</span>
            )}
            {isStudent && post.author.university && <span>·</span>}
            <Link
              href={`/comunidad/c/${post.category.slug}`}
              className="inline-flex items-center gap-1 font-medium hover:opacity-80 transition"
              style={{ color: post.category.color ?? undefined }}
            >
              <span className="material-symbols-outlined text-[14px]">{post.category.icon ?? 'tag'}</span>
              {post.category.name}
            </Link>
            <span>·</span>
            <span>{timeAgo(post.created_at)}</span>
          </div>
        </div>

        {/* Likes grandes para sala de espera */}
        {isSalaDeEspera && (
          <button onClick={handleLike} className={`shrink-0 flex flex-col items-center transition ${liked ? 'text-rose-500' : 'text-orange-400 hover:text-rose-400'}`}>
            <span className={`material-symbols-outlined text-[22px] ${liked ? 'filled' : ''}`} style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
            <span className="text-xs font-black">{likeCount}</span>
          </button>
        )}

        {/* 3-dot menu — always present */}
        <PostMenu postTitle={post.title} />
      </header>

      <Link href={`/comunidad/p/${post.id}`} className="block group">
        {typeBadge && !isSalaDeEspera && (
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mb-2 ${typeBadge.className}`}>
            <span className="material-symbols-outlined text-[14px]">{typeBadge.icon}</span>
            {typeBadge.label}
          </span>
        )}

        <h2 className={`font-bold leading-snug mb-2 group-hover:text-primary transition ${
          isSalaDeEspera ? 'text-base text-slate-800' : 'text-lg text-slate-900'
        }`}>
          {isSalaDeEspera && hasPoll && <span className="mr-1.5">📊</span>}
          {isSalaDeEspera && !hasPoll && <span className="mr-1.5">😄</span>}
          {post.title}
        </h2>

        <p className="text-sm text-slate-600 line-clamp-3 whitespace-pre-wrap leading-relaxed">
          {post.body}
        </p>

        {hasPoll && pollOptions && pollTotal && (
          <PollPreview options={pollOptions} total={pollTotal} />
        )}
      </Link>

      <footer className={`mt-4 pt-3 border-t flex items-center gap-4 text-sm text-slate-500 ${
        isSalaDeEspera ? 'border-orange-100' : 'border-slate-100'
      }`}>
        {!isSalaDeEspera && (
          <button onClick={handleLike} className={`inline-flex items-center gap-1 transition font-semibold ${liked ? 'text-rose-500' : 'hover:text-rose-500'}`}>
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
            {likeCount}
          </button>
        )}
        <Link href={`/comunidad/p/${post.id}`} className="inline-flex items-center gap-1 hover:text-primary transition">
          <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
          {post.comment_count} {isSalaDeEspera ? 'comentarios' : ''}
        </Link>
        {isSalaDeEspera && post.is_pinned && (
          <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            <span className="material-symbols-outlined text-[13px]">push_pin</span>
            Destacado
          </span>
        )}
      </footer>
    </article>
  );
}
