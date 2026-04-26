'use client';

/**
 * Vista de chat 1:1 con Realtime.
 *
 * Diseño escalable:
 *  - UNA conexión por chat abierto. Channel `messages:${conversationId}`,
 *    filtrado por `conversation_id=eq.${id}` → RLS + index lo hacen barato.
 *  - Optimistic UI: el mensaje aparece instantáneo (rol importante en chat).
 *  - markConversationRead() se llama al abrir el chat y cuando vuelve a la
 *    pestaña → el badge global del TopNav se actualiza en el próximo poll.
 *  - Auto-scroll al final cuando llegan nuevos mensajes.
 *  - Cleanup completo en unmount (channel + listeners).
 */

import { useEffect, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { Profile } from '@/lib/types';
import type { ChatMessage } from '@/lib/queries/messaging';
import { initials, timeAgo } from '@/lib/utils';
import { sendMessage, markConversationRead } from '@/lib/actions/messaging';

interface Props {
  conversationId: string;
  other: Profile;
  initialMessages: ChatMessage[];
}

interface RealtimeMessageRow {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  attachment_url: string | null;
  read_at: string | null;
  created_at: string;
}

export function ChatView({ conversationId, other, initialMessages }: Props) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [text, setText]         = useState('');
  const [pending, startTransition] = useTransition();
  const [error, setError]       = useState<string | null>(null);

  const localIds   = useRef<Set<string>>(new Set());
  const bottomRef  = useRef<HTMLDivElement>(null);

  /* ── Auto-scroll al fondo cuando llegan mensajes ── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  /* ── Marcar como leído al montar (y cuando volvés a la pestaña) ── */
  useEffect(() => {
    if (!user) return;
    void markConversationRead(conversationId);

    function onVisibility() {
      if (document.visibilityState === 'visible') {
        void markConversationRead(conversationId);
      }
    }
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [conversationId, user]);

  /* ── Realtime: nuevos mensajes en ESTA conversación ── */
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event:  'INSERT',
          schema: 'public',
          table:  'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const row = payload.new as RealtimeMessageRow;

          // Si lo mandamos nosotros (optimistic), ya está
          if (localIds.current.has(row.id)) {
            localIds.current.delete(row.id);
            return;
          }

          setMessages((prev) =>
            prev.some((m) => m.id === row.id)
              ? prev
              : [...prev, {
                  id: row.id,
                  conversation_id: row.conversation_id,
                  sender_id: row.sender_id,
                  body: row.body,
                  attachment_url: row.attachment_url,
                  read_at: row.read_at,
                  created_at: row.created_at,
                }],
          );

          // Si el mensaje vino del otro user y estamos viendo el chat, marcamos leído
          if (row.sender_id !== user.id && document.visibilityState === 'visible') {
            void markConversationRead(conversationId);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user]);

  function handleSend() {
    const body = text.trim();
    if (!body || pending || !user) return;
    setError(null);

    const tempId = `temp-${Date.now()}`;
    const optimistic: ChatMessage = {
      id: tempId,
      conversation_id: conversationId,
      sender_id: user.id,
      body,
      attachment_url: null,
      read_at: null,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setText('');

    startTransition(async () => {
      const res = await sendMessage(conversationId, body);
      if (!res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setText(body);
        setError(res.error);
        return;
      }
      localIds.current.add(res.data.id);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? { ...m, id: res.data.id, created_at: res.data.createdAt }
            : m,
        ),
      );
    });
  }

  if (!user) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <p className="text-slate-500">Iniciá sesión para usar mensajes.</p>
        <Link href="/login" className="text-primary font-semibold mt-4 inline-block">Iniciar sesión</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden" style={{ height: 'calc(100vh - 140px)' }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 shrink-0">
        <Link href="/comunidad/mensajes" className="text-slate-400 hover:text-slate-700 transition">
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </Link>
        <Link
          href={`/comunidad/u/${other.handle}`}
          className={`size-10 rounded-full bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center font-bold text-white text-sm hover:opacity-90 transition`}
        >
          {initials(other.display_name)}
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/comunidad/u/${other.handle}`} className="font-bold text-slate-900 hover:underline text-sm">
            {other.display_name}
          </Link>
          {other.specialty && (
            <p className="text-xs text-slate-400">{other.specialty} · {other.country ?? ''}</p>
          )}
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          en vivo
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-slate-50">
        {messages.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-8">
            Empezá la conversación con {other.display_name.split(' ')[0]}.
          </p>
        )}
        {messages.map((msg) => {
          const fromMe = msg.sender_id === user.id;
          return (
            <div key={msg.id} className={`flex ${fromMe ? 'justify-end' : 'justify-start'}`}>
              {!fromMe && (
                <div className="size-7 rounded-full bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center font-bold text-white text-[10px] shrink-0 mr-2 mt-1">
                  {initials(other.display_name)}
                </div>
              )}
              <div className={`max-w-[72%] flex flex-col gap-0.5 ${fromMe ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  fromMe
                    ? 'bg-primary text-white rounded-br-sm'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
                }`}>
                  {msg.body}
                </div>
                <span className="text-[10px] text-slate-400 px-1">
                  {timeAgo(msg.created_at)}
                  {fromMe && msg.read_at && <span className="ml-1 text-emerald-500">· visto</span>}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="px-5 py-2 text-xs text-red-700 bg-red-50 border-t border-red-100">
          {error}
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-slate-100 bg-white shrink-0 flex items-end gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder={`Mensaje a ${other.display_name.split(' ')[0]}…`}
          rows={1}
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none placeholder:text-slate-400 max-h-32"
          style={{ overflowY: 'auto' }}
          disabled={pending}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || pending}
          className="size-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">send</span>
        </button>
      </div>
    </div>
  );
}
