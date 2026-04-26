'use client';

/**
 * Botón Seguir / Siguiendo con optimistic UI.
 *
 *  - Si no estás logueado → link al /login
 *  - Si es tu propio perfil → no se renderiza (control en el padre)
 *  - Click → toggle optimista + server action; rollback en error.
 */

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { toggleFollow } from '@/lib/actions/follows';

interface Props {
  targetUserId: string;
  targetHandle: string;
  initialIsFollowing: boolean;
  initialFollowerCount: number;
  /** Si true, oculta el contador (usado en cards inline). */
  compact?: boolean;
  className?: string;
}

export function FollowButton({
  targetUserId,
  targetHandle,
  initialIsFollowing,
  initialFollowerCount,
  compact = false,
  className,
}: Props) {
  const { user } = useAuth();
  const [following, setFollowing]       = useState(initialIsFollowing);
  const [followerCount, setFollowerCount] = useState(initialFollowerCount);
  const [pending, startTransition]      = useTransition();

  if (!user) {
    return (
      <Link
        href="/login"
        className={className ?? 'inline-flex items-center gap-1.5 bg-primary text-white font-semibold px-4 py-2 rounded-xl text-sm hover:bg-primary/90 transition'}
      >
        <span className="material-symbols-outlined text-[16px]">person_add</span>
        Seguir
      </Link>
    );
  }

  if (user.id === targetUserId) return null;

  function handleClick() {
    if (pending) return;
    const prevFollowing = following;
    const prevCount     = followerCount;
    setFollowing(!prevFollowing);
    setFollowerCount(prevFollowing ? prevCount - 1 : prevCount + 1);

    startTransition(async () => {
      const res = await toggleFollow(targetUserId, targetHandle);
      if (!res.ok) {
        setFollowing(prevFollowing);
        setFollowerCount(prevCount);
        return;
      }
      // Re-sync con valores autoritativos del server
      setFollowing(res.data.isFollowing);
      setFollowerCount(res.data.followerCount);
    });
  }

  const baseClass = className
    ?? `inline-flex items-center gap-1.5 font-semibold px-4 py-2 rounded-xl text-sm transition disabled:opacity-50 ${
      following
        ? 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600 border border-slate-200'
        : 'bg-primary text-white hover:bg-primary/90'
    }`;

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className={baseClass}
    >
      <span className="material-symbols-outlined text-[16px]">
        {following ? 'check' : 'person_add'}
      </span>
      {following ? 'Siguiendo' : 'Seguir'}
      {!compact && <span className="text-[11px] opacity-70">· {followerCount}</span>}
    </button>
  );
}
