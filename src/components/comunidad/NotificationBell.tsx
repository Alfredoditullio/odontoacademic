'use client';

/**
 * Campana de notificaciones con realtime.
 *
 * Diseño escalable:
 *  - Una sola conexión por sesión a `notifications:${userId}`. RLS asegura
 *    que el usuario solo recibe SUS notificaciones (postgres_changes filter
 *    es defensa en profundidad).
 *  - El dropdown carga la lista on-demand (no la hidratamos hasta abrir),
 *    así no hacemos un fetch en cada render del header.
 *  - El badge se incrementa por evento INSERT (cheap) sin necesidad de
 *    refetch.
 */

import { useEffect, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { markAllNotificationsRead } from '@/lib/actions/community';

interface NotificationRow {
  id: string;
  user_id: string;
  actor_id: string | null;
  type: 'comment_on_post' | 'like_on_post' | 'mention' | 'follow' | 'system';
  post_id: string | null;
  comment_id: string | null;
  metadata: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
}

interface NotificationWithActor extends NotificationRow {
  actor: { display_name: string; handle: string | null; avatar_color: string | null } | null;
}

interface Props {
  /** Si se conoce server-side, evita el round-trip cliente. Si no, fetcheamos en mount. */
  initialUnreadCount?: number;
}

const TYPE_ICON: Record<NotificationRow['type'], string> = {
  comment_on_post: 'chat_bubble',
  like_on_post:    'favorite',
  mention:         'alternate_email',
  follow:          'person_add',
  system:          'campaign',
};

const TYPE_TEXT: Record<NotificationRow['type'], (actor: string) => string> = {
  comment_on_post: (a) => `${a} comentó tu post`,
  like_on_post:    (a) => `A ${a} le gustó tu post`,
  mention:         (a) => `${a} te mencionó`,
  follow:          (a) => `${a} te empezó a seguir`,
  system:          () => 'Novedad de OdontoLatam',
};

export function NotificationBell({ initialUnreadCount = 0 }: Props) {
  const { user } = useAuth();
  const [unread, setUnread]               = useState(initialUnreadCount);
  const [open, setOpen]                   = useState(false);
  const [items, setItems]                 = useState<NotificationWithActor[]>([]);
  const [loading, setLoading]             = useState(false);
  const [, startMarkTransition]           = useTransition();
  const ref                               = useRef<HTMLDivElement>(null);

  /* ── Fetch inicial del unread count (si no vino server-side) ── */
  useEffect(() => {
    if (!user || initialUnreadCount > 0) return;
    let cancelled = false;
    (async () => {
      const { count } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .is('read_at', null);
      if (!cancelled && count !== null) setUnread(count);
    })();
    return () => { cancelled = true; };
  }, [user, initialUnreadCount]);

  /* ── Realtime: nuevos inserts en MIS notificaciones ── */
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event:  'INSERT',
          schema: 'public',
          table:  'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          setUnread((c) => c + 1);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  /* ── Click outside ── */
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  async function loadNotifications() {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('notifications')
      .select(`
        id, user_id, actor_id, type, post_id, comment_id, metadata, read_at, created_at,
        actor:profiles!notifications_actor_id_fkey ( display_name, handle, avatar_color )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    setItems(((data ?? []) as unknown as NotificationWithActor[]));
    setLoading(false);
  }

  function toggleOpen() {
    const next = !open;
    setOpen(next);
    if (next) {
      loadNotifications();
      // Marcar como leídas (lo hacemos en background; el badge baja inmediatamente)
      if (unread > 0) {
        const prev = unread;
        setUnread(0);
        startMarkTransition(async () => {
          const res = await markAllNotificationsRead();
          if (!res.ok) setUnread(prev);
        });
      }
    }
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="relative size-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center hover:bg-white/25 transition"
        title="Iniciar sesión para ver notificaciones"
      >
        <span className="material-symbols-outlined text-[22px] text-white">notifications</span>
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={toggleOpen}
        className="relative size-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center hover:bg-white/25 transition"
        title="Notificaciones"
      >
        <span className="material-symbols-outlined text-[22px] text-white">notifications</span>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 border-2 border-sky-600 text-white text-[10px] font-black flex items-center justify-center">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl py-1 z-50 animate-fade-in-up max-h-[480px] overflow-y-auto">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-900">Notificaciones</p>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              en vivo
            </span>
          </div>

          {loading ? (
            <p className="px-4 py-8 text-sm text-slate-400 text-center">Cargando...</p>
          ) : items.length === 0 ? (
            <p className="px-4 py-8 text-sm text-slate-400 text-center">Todavía no tenés notificaciones.</p>
          ) : (
            items.map((n) => {
              const actor = n.actor?.display_name ?? 'Alguien';
              const icon  = TYPE_ICON[n.type];
              const text  = TYPE_TEXT[n.type](actor);
              const href  = n.post_id ? `/comunidad/p/${n.post_id}` : '/comunidad';
              return (
                <Link
                  key={n.id}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50 transition ${
                    n.read_at ? '' : 'bg-sky-50/40'
                  }`}
                >
                  <div className={`size-8 rounded-full bg-gradient-to-br ${n.actor?.avatar_color ?? 'from-slate-400 to-slate-500'} flex items-center justify-center shrink-0`}>
                    <span className="material-symbols-outlined text-white text-[16px]">{icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 leading-snug">{text}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{relTime(n.created_at)}</p>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function relTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min  = Math.floor(diff / 60_000);
  if (min < 1)  return 'recién';
  if (min < 60) return `hace ${min}m`;
  const h = Math.floor(min / 60);
  if (h < 24)   return `hace ${h}h`;
  const d = Math.floor(h / 24);
  return `hace ${d}d`;
}
