'use client';

import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { MOCK_PROFILES } from '@/data/mock-community';
import { initials, timeAgo } from '@/lib/utils';

interface Message {
  id: string;
  body: string;
  imageUrl?: string;   // object URL for image attachments
  fromMe: boolean;
  sentAt: string;
}

const SEED_MESSAGES: Record<string, Message[]> = {
  'dra-fernandez': [
    { id: 'm1', body: 'Hola Martín, te escribo por el caso que compartiste. Muy interesante la técnica de elevación bilateral.', fromMe: false, sentAt: '2026-04-10T15:30:00Z' },
    { id: 'm2', body: 'Hola Lucía! Gracias. Fue un caso complejo, especialmente por el grado de atrofia. ¿Tenés alguna duda en particular?', fromMe: true, sentAt: '2026-04-10T15:45:00Z' },
    { id: 'm3', body: 'Sí, ¿qué membrana usaste para la elevación? ¿Colágeno porcino o bovino?', fromMe: false, sentAt: '2026-04-10T16:00:00Z' },
  ],
  'dr-mendez': [
    { id: 'm1', body: 'Gracias por el dato del paper de IA. Lo estoy revisando ahora.', fromMe: true, sentAt: '2026-04-09T10:00:00Z' },
    { id: 'm2', body: '¡De nada! Creo que va a cambiar mucho el diagnóstico radiológico en los próximos años.', fromMe: false, sentAt: '2026-04-09T10:15:00Z' },
  ],
  'dra-morales': [
    { id: 'm1', body: '¿Podrías compartir el protocolo que usás para mordida abierta con alineadores?', fromMe: false, sentAt: '2026-04-07T14:30:00Z' },
  ],
};

export default function ConversationPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = use(params);
  const other = MOCK_PROFILES.find((p) => p.handle === handle);

  const [messages, setMessages]         = useState<Message[]>(SEED_MESSAGES[handle] ?? []);
  const [text, setText]                 = useState('');
  const [pendingImage, setPendingImage] = useState<string | null>(null); // object URL
  const [lightboxSrc, setLightboxSrc]  = useState<string | null>(null); // full-screen image

  const bottomRef  = useRef<HTMLDivElement>(null);
  const fileRef    = useRef<HTMLInputElement>(null);
  const pendingRef = useRef<string | null>(null); // tracks URL to revoke on clear

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup pending image object URL when changed/cleared
  useEffect(() => {
    if (pendingRef.current && pendingRef.current !== pendingImage) {
      URL.revokeObjectURL(pendingRef.current);
    }
    pendingRef.current = pendingImage;
  }, [pendingImage]);

  if (!other) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-slate-500">Conversación no encontrada</p>
        <Link href="/comunidad/mensajes" className="text-primary font-semibold mt-4 inline-block">
          Volver a mensajes
        </Link>
      </div>
    );
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Revoke previous
    if (pendingImage) URL.revokeObjectURL(pendingImage);
    setPendingImage(URL.createObjectURL(file));
    // Reset input so the same file can be re-selected
    e.target.value = '';
  }

  function clearPendingImage() {
    if (pendingImage) URL.revokeObjectURL(pendingImage);
    setPendingImage(null);
  }

  function send() {
    const body = text.trim();
    if (!body && !pendingImage) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        body,
        imageUrl: pendingImage ?? undefined,
        fromMe: true,
        sentAt: new Date().toISOString(),
      },
    ]);
    setText('');
    // Don't revoke the URL — the message still references it
    setPendingImage(null);
    pendingRef.current = null;
  }

  const canSend = text.trim().length > 0 || !!pendingImage;

  return (
    <>
      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxSrc(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxSrc}
            alt="Imagen adjunta"
            className="max-w-full max-h-full rounded-xl object-contain shadow-2xl"
          />
          <button
            onClick={() => setLightboxSrc(null)}
            className="absolute top-4 right-4 size-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <span className="material-symbols-outlined text-white text-[22px]">close</span>
          </button>
        </div>
      )}

      <div className="flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden" style={{ height: 'calc(100vh - 140px)' }}>

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 shrink-0">
          <Link href="/comunidad/mensajes" className="text-slate-400 hover:text-slate-700 transition">
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </Link>
          <Link href={`/comunidad/u/${other.handle}`} className="size-10 rounded-full bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center font-bold text-white text-sm hover:opacity-90 transition">
            {initials(other.display_name)}
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={`/comunidad/u/${other.handle}`} className="font-bold text-slate-900 hover:underline text-sm">
              {other.display_name}
            </Link>
            {other.specialty && (
              <p className="text-xs text-slate-400">{other.specialty} · {other.country}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Interconsulta hint */}
            <span className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
              <span className="material-symbols-outlined text-[13px]">attach_file</span>
              Podés adjuntar imágenes para interconsultas
            </span>
            <Link
              href={`/comunidad/u/${other.handle}`}
              className="text-xs font-semibold text-primary hover:underline hidden sm:block"
            >
              Ver perfil
            </Link>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-slate-50">
          {messages.length === 0 && (
            <p className="text-center text-sm text-slate-400 py-8">
              Empezá la conversación con {other.display_name.split(' ')[0]}.
            </p>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
              {!msg.fromMe && (
                <div className="size-7 rounded-full bg-gradient-to-br from-sky-400 to-teal-500 flex items-center justify-center font-bold text-white text-[10px] shrink-0 mr-2 mt-1">
                  {initials(other.display_name)}
                </div>
              )}
              <div className={`max-w-[72%] ${msg.fromMe ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>

                {/* Image bubble */}
                {msg.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setLightboxSrc(msg.imageUrl!)}
                    className={`overflow-hidden rounded-2xl ${msg.fromMe ? 'rounded-br-sm' : 'rounded-bl-sm'} border border-white/20 shadow-sm hover:opacity-90 transition`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={msg.imageUrl}
                      alt="Imagen adjunta"
                      className="max-w-[220px] max-h-[200px] w-auto h-auto object-cover block"
                    />
                  </button>
                )}

                {/* Text bubble (only if has text) */}
                {msg.body && (
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.fromMe
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
                  }`}>
                    {msg.body}
                  </div>
                )}

                <span className="text-[10px] text-slate-400 px-1">{timeAgo(msg.sentAt)}</span>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Pending image preview bar */}
        {pendingImage && (
          <div className="px-4 pt-2 border-t border-slate-100 bg-white shrink-0 flex items-center gap-3">
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pendingImage}
                alt="Imagen a enviar"
                className="h-16 w-16 object-cover rounded-xl border border-slate-200"
              />
              <button
                type="button"
                onClick={clearPendingImage}
                className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-slate-700 hover:bg-red-600 flex items-center justify-center transition"
              >
                <span className="material-symbols-outlined text-white text-[12px]">close</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Imagen lista para enviar
              {text.trim() ? ' con tu mensaje' : ' — podés agregar un texto arriba'}
            </p>
          </div>
        )}

        {/* Input */}
        <div className="px-4 py-3 border-t border-slate-100 bg-white shrink-0 flex items-end gap-2">

          {/* Attach image button */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            title="Adjuntar imagen"
            className="size-10 rounded-xl border border-slate-200 text-slate-400 hover:text-primary hover:border-primary/40 hover:bg-primary/5 flex items-center justify-center transition shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={`Mensaje a ${other.display_name.split(' ')[0]}…`}
            rows={1}
            className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none placeholder:text-slate-400 max-h-32"
            style={{ overflowY: 'auto' }}
          />

          <button
            onClick={send}
            disabled={!canSend}
            className="size-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </div>
      </div>
    </>
  );
}
