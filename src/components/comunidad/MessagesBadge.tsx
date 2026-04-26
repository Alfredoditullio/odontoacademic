'use client';

/**
 * Badge "tenés N mensajes nuevos" en el TopNav.
 *
 * Diseño escalable:
 *  - NO usa Realtime. El conteo se obtiene con un select cheap a `conversations`
 *    sumando `unread_for_X`, una vez al montar y cada 30s con polling visible-aware.
 *  - 30s es aceptable para un badge global. Cuando entrás a /comunidad/mensajes
 *    o abrís un chat, el conteo se actualiza al recargar la lista.
 *  - Cero conexiones WebSocket por user logueado por este feature.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { usePollingWhenVisible } from '@/lib/hooks/usePollingWhenVisible';

export function MessagesBadge() {
  const { user } = useAuth();
  const [unread, setUnread] = useState(0);

  async function refresh() {
    if (!user) return;
    const { data, error } = await supabase
      .from('conversations')
      .select('user_a, unread_for_a, unread_for_b')
      .or(`user_a.eq.${user.id},user_b.eq.${user.id}`);
    if (error || !data) return;

    let total = 0;
    for (const row of data) {
      const isA = (row.user_a as string) === user.id;
      total += isA ? (row.unread_for_a as number) : (row.unread_for_b as number);
    }
    setUnread(total);
  }

  // Fetch inicial + reset al cambiar usuario
  useEffect(() => {
    if (!user) { setUnread(0); return; }
    void refresh();
    // refresh es estable dentro de este efecto; no la incluimos en deps para
    // evitar recreaciones espurias. Cambia solo cuando user cambia.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Polling cada 30s, pausado si pestaña oculta
  usePollingWhenVisible(refresh, { intervalMs: 30_000, enabled: !!user });

  if (!user) {
    return (
      <Link
        href="/login"
        className="relative size-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center hover:bg-white/25 transition"
        title="Mensajes"
      >
        <span className="material-symbols-outlined text-[22px] text-white">mail</span>
      </Link>
    );
  }

  return (
    <Link
      href="/comunidad/mensajes"
      className="relative size-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center hover:bg-white/25 transition"
      title="Mensajes"
    >
      <span className="material-symbols-outlined text-[22px] text-white">mail</span>
      {unread > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 border-2 border-sky-600 text-white text-[10px] font-black flex items-center justify-center">
          {unread > 99 ? '99+' : unread}
        </span>
      )}
    </Link>
  );
}
