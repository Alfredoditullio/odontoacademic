'use client';

import { useState, useEffect } from 'react';
import { ImageUpload } from '@/components/comunidad/ImageUpload';

const POST_TYPES = [
  {
    value: 'strategy',
    emoji: '📈',
    label: 'Estrategia',
    desc: 'Lo que te funciona: Google, Instagram, referidos…',
    border: 'border-amber-400 bg-amber-50 ring-2 ring-amber-200',
  },
  {
    value: 'tool',
    emoji: '🛠️',
    label: 'Herramienta',
    desc: 'Software, app o recurso que usás en tu consultorio.',
    border: 'border-sky-400 bg-sky-50 ring-2 ring-sky-200',
  },
  {
    value: 'question',
    emoji: '🤔',
    label: 'Consulta',
    desc: 'Pedile consejo a la comunidad sobre marketing.',
    border: 'border-violet-400 bg-violet-50 ring-2 ring-violet-200',
  },
  {
    value: 'success',
    emoji: '🏆',
    label: 'Caso de éxito',
    desc: 'Contá qué hiciste y qué resultados conseguiste.',
    border: 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200',
  },
];

const PLATFORMS = ['Instagram', 'Google Maps', 'TikTok', 'Facebook', 'WhatsApp', 'Email', 'Referidos', 'Web propia', 'YouTube'];

const POLL_DEFAULTS: Record<string, string[]> = {
  strategy: ['Instagram orgánico', 'Google Maps / SEO', 'Referidos de pacientes', 'Publicidad paga'],
  tool:     ['Lo recomendaría', 'Sirve pero tiene fallas', 'No lo recomendaría'],
  question: ['Opción A', 'Opción B'],
  success:  [],
};

interface Props { onClose: () => void; }

export function MarketingPostModal({ onClose }: Props) {
  const [type, setType]           = useState<'strategy' | 'tool' | 'question' | 'success'>('strategy');
  const [title, setTitle]         = useState('');
  const [body, setBody]           = useState('');
  const [link, setLink]           = useState('');
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [addPoll, setAddPoll]     = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [submitted, setSubmitted] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function togglePlatform(p: string) {
    setPlatforms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
  }
  function addOption()         { if (pollOptions.length < 5) setPollOptions([...pollOptions, '']); }
  function removeOption(i: number) { if (pollOptions.length > 2) setPollOptions(pollOptions.filter((_, idx) => idx !== i)); }
  function updateOption(i: number, v: string) { setPollOptions(pollOptions.map((o, idx) => idx === i ? v : o)); }

  function handleTypeChange(v: typeof type) {
    setType(v);
    setPlatforms([]);
    const defaults = POLL_DEFAULTS[v];
    if (defaults && defaults.length >= 2) {
      setPollOptions(defaults);
      setAddPoll(v !== 'success');
    } else {
      setPollOptions(['', '']);
      setAddPoll(false);
    }
  }

  const selectedType = POST_TYPES.find((t) => t.value === type)!;
  const canSubmit = title.trim().length > 0 && body.trim().length > 0;

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-10 max-w-sm w-full text-center shadow-2xl">
          <div className="text-5xl mb-4">{selectedType.emoji}</div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">¡Publicado en Marketing Dental!</h2>
          <p className="text-slate-500 text-sm mb-6">La comunidad ya puede verlo y comentar.</p>
          <button onClick={onClose} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition">
            Ver el feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 sm:rounded-t-2xl flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px]">campaign</span>
              Publicar en Marketing Dental
            </h2>
            <p className="text-xs text-white/80 mt-0.5">Estrategias, herramientas y casos de éxito</p>
          </div>
          <button onClick={onClose} className="size-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition">
            <span className="material-symbols-outlined text-[22px] text-white">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Tipo */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">¿Qué querés compartir?</label>
            <div className="grid grid-cols-2 gap-2.5">
              {POST_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => handleTypeChange(t.value as typeof type)}
                  className={`relative flex items-start gap-2.5 text-left px-3.5 py-3 rounded-xl border-2 transition-all ${
                    type === t.value ? t.border : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="text-xl shrink-0">{t.emoji}</span>
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-tight">{t.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{t.desc}</p>
                  </div>
                  {type === t.value && (
                    <span className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-amber-500 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[13px]">check</span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Plataformas (si aplica) */}
          {(type === 'strategy' || type === 'success') && (
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Plataformas involucradas</label>
              <div className="flex flex-wrap gap-1.5">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePlatform(p)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border transition ${
                      platforms.includes(p)
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Título */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Título *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                type === 'strategy' ? 'Ej: Cómo dupliqué mis pacientes nuevos con Google Maps en 3 meses' :
                type === 'tool'     ? 'Ej: Probé Canva Pro para el consultorio — esto fue lo que encontré' :
                type === 'question' ? 'Ej: ¿Vale la pena invertir en publicidad de Instagram en 2026?' :
                                      'Ej: De 0 a 80 pacientes en 6 meses — mi estrategia sin pagar un peso'
              }
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 placeholder:text-slate-400"
            />
          </div>

          {/* Cuerpo */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
              {type === 'strategy' ? 'Contá tu estrategia *' :
               type === 'tool'     ? 'Describí la herramienta *' :
               type === 'question' ? 'Desarrollá tu consulta *' :
                                     'Contá tu historia *'}
            </label>
            <textarea
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={
                type === 'strategy' ? 'Qué hiciste paso a paso, qué resultados mediste, qué repetirías y qué cambiarías...' :
                type === 'tool'     ? 'Cómo la usás, precio, pros y contras, para qué tipo de consultorio es ideal...' :
                type === 'question' ? 'Contexto de tu consultorio, qué ya probaste, qué resultado esperás...' :
                                      'Tu punto de partida, qué acciones tomaste, cuánto tiempo tardaste, resultados concretos...'
              }
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 resize-none placeholder:text-slate-400"
            />
          </div>

          {/* Link opcional */}
          {type === 'tool' && (
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Link a la herramienta (opcional)</label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://..."
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 placeholder:text-slate-400"
              />
            </div>
          )}

          {/* Imágenes */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Imágenes <span className="font-normal text-slate-400 normal-case tracking-normal">(opcional, hasta 4)</span>
            </label>
            <ImageUpload
              files={images}
              onChange={setImages}
              maxFiles={4}
              hint="Screenshots, resultados, capturas — PNG, JPG"
              dropzoneClass="hover:border-amber-400/50 hover:bg-amber-50"
            />
          </div>

          {/* Encuesta */}
          {type !== 'success' && (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => setAddPoll(!addPoll)}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${addPoll ? 'bg-amber-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 size-4 rounded-full bg-white shadow transition-all ${addPoll ? 'left-6' : 'left-1'}`} />
                </button>
                <span className="text-sm font-bold text-slate-700">Agregar encuesta</span>
              </div>
              {addPoll && (
                <div className="space-y-2">
                  {pollOptions.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-amber-100 text-amber-700 text-xs font-black flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + i)}
                      </div>
                      <input
                        value={opt}
                        onChange={(e) => updateOption(i, e.target.value)}
                        placeholder={`Opción ${i + 1}`}
                        className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 placeholder:text-slate-400"
                      />
                      {pollOptions.length > 2 && (
                        <button type="button" onClick={() => removeOption(i)} className="size-7 rounded-full hover:bg-red-50 flex items-center justify-center transition">
                          <span className="material-symbols-outlined text-red-400 text-[17px]">close</span>
                        </button>
                      )}
                    </div>
                  ))}
                  {pollOptions.length < 5 && (
                    <button type="button" onClick={addOption} className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-800 transition">
                      <span className="material-symbols-outlined text-[15px]">add_circle</span>
                      Agregar opción
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 shrink-0 bg-white sm:rounded-b-2xl flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {platforms.map((p) => (
              <span key={p} className="text-[11px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">{p}</span>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition">Cancelar</button>
            <button
              onClick={() => { if (canSubmit) setSubmitted(true); }}
              disabled={!canSubmit}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              Publicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
