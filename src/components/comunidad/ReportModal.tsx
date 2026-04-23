'use client';

import { useState, useEffect } from 'react';

const REASONS = [
  { id: 'inappropriate', icon: 'block',        label: 'Contenido inapropiado o explícito',    desc: 'Imágenes, lenguaje o material no apto para la comunidad.' },
  { id: 'spam',          icon: 'campaign',      label: 'Spam o publicidad no solicitada',      desc: 'Promoción comercial sin relación con la odontología.' },
  { id: 'misinformation',icon: 'error',         label: 'Información falsa o engañosa',         desc: 'Datos clínicos incorrectos o que pueden inducir a error.' },
  { id: 'harassment',    icon: 'report',        label: 'Acoso o discriminación',               desc: 'Ataques personales, insultos o contenido discriminatorio.' },
  { id: 'offtopic',      icon: 'label_off',     label: 'Fuera de tema para esta categoría',   desc: 'El post no corresponde a la categoría donde fue publicado.' },
  { id: 'other',         icon: 'more_horiz',    label: 'Otro motivo',                          desc: 'Especificá el problema en el campo de detalles.' },
];

interface ReportModalProps {
  postTitle: string;
  onClose: () => void;
}

export function ReportModal({ postTitle, onClose }: ReportModalProps) {
  const [selected, setSelected] = useState<string>('');
  const [detail, setDetail]     = useState('');
  const [sent, setSent]         = useState(false);
  const [sending, setSending]   = useState(false);

  /* Close on Escape */
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  /* Prevent body scroll */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function submit() {
    if (!selected) return;
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 900);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {sent ? (
          /* ── Success ── */
          <div className="px-8 py-12 text-center">
            <div className="size-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-emerald-600 text-[32px]">check_circle</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">Reporte enviado</h3>
            <p className="text-sm text-slate-500 mb-6">
              Gracias por ayudarnos a mantener la comunidad. Nuestro equipo de moderación lo revisará en las próximas horas.
            </p>
            <button
              onClick={onClose}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-700 transition"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-600 text-[18px]">flag</span>
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">Reportar contenido</h2>
                  <p className="text-[11px] text-slate-400 truncate max-w-[240px]">{postTitle}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4 space-y-2 max-h-[55vh] overflow-y-auto">
              <p className="text-xs text-slate-500 mb-3">¿Por qué querés reportar este post? Elegí el motivo que mejor describa el problema.</p>

              {REASONS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelected(r.id)}
                  className={`w-full text-left flex items-start gap-3 px-3.5 py-3 rounded-xl border-2 transition-all duration-150 ${
                    selected === r.id
                      ? 'border-red-400 bg-red-50'
                      : 'border-slate-100 hover:border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[20px] mt-0.5 shrink-0 ${selected === r.id ? 'text-red-500' : 'text-slate-400'}`}>
                    {r.icon}
                  </span>
                  <div>
                    <p className={`text-sm font-bold ${selected === r.id ? 'text-red-700' : 'text-slate-700'}`}>{r.label}</p>
                    <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{r.desc}</p>
                  </div>
                  {selected === r.id && (
                    <span className="material-symbols-outlined text-red-500 text-[18px] ml-auto shrink-0 mt-0.5">radio_button_checked</span>
                  )}
                </button>
              ))}

              {/* Detail textarea */}
              {selected && (
                <div className="pt-1">
                  <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                    Detalles adicionales <span className="normal-case font-normal">(opcional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={detail}
                    onChange={(e) => { if (e.target.value.length <= 400) setDetail(e.target.value); }}
                    placeholder="Contanos más sobre el problema para que podamos actuar rápido..."
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 resize-none placeholder:text-slate-300"
                  />
                  <p className="text-[10px] text-slate-400 text-right mt-0.5">{detail.length}/400</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
              >
                Cancelar
              </button>
              <button
                onClick={submit}
                disabled={!selected || sending}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2 rounded-xl text-sm font-bold transition"
              >
                {sending
                  ? <><span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span> Enviando...</>
                  : <><span className="material-symbols-outlined text-[16px]">flag</span> Enviar reporte</>
                }
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
