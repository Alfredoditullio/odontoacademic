'use client';

import { useState, useEffect } from 'react';
import { ImageUpload } from '@/components/comunidad/ImageUpload';

const POST_TYPES = [
  {
    value: 'meme',
    emoji: '😂',
    label: 'Meme / Imagen',
    desc: 'Subí una imagen, meme o captura.',
    color: 'from-amber-400 to-orange-500',
    selectedBorder: 'border-orange-400 bg-orange-50 ring-2 ring-orange-200',
  },
  {
    value: 'story',
    emoji: '📝',
    label: 'Anécdota',
    desc: 'Algo gracioso que pasó en el consultorio.',
    color: 'from-rose-400 to-pink-500',
    selectedBorder: 'border-rose-400 bg-rose-50 ring-2 ring-rose-200',
  },
  {
    value: 'poll',
    emoji: '📊',
    label: 'Encuesta',
    desc: 'Una pregunta divertida para la comunidad.',
    color: 'from-violet-400 to-purple-500',
    selectedBorder: 'border-violet-400 bg-violet-50 ring-2 ring-violet-200',
  },
];

const RULES = [
  'No ridiculizés ni identifiques pacientes — ni con cara tapada.',
  'Sin contenido ofensivo, discriminatorio o político.',
  'Las imágenes clínicas gore van en Casos Clínicos, no acá.',
  'Si un colega pide que borres algo que lo involucra, hacelo.',
];

interface Props { onClose: () => void; }

export function SalaDeEsperaModal({ onClose }: Props) {
  const [type, setType] = useState<'meme' | 'story' | 'poll'>('meme');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '', '']);
  const [rulesOk, setRulesOk] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function addOption() { if (pollOptions.length < 6) setPollOptions([...pollOptions, '']); }
  function removeOption(i: number) { if (pollOptions.length > 2) setPollOptions(pollOptions.filter((_, idx) => idx !== i)); }
  function updateOption(i: number, val: string) { setPollOptions(pollOptions.map((o, idx) => idx === i ? val : o)); }

  const canSubmit = title.trim() && rulesOk &&
    (type !== 'poll' || pollOptions.filter((o) => o.trim()).length >= 2) &&
    (type !== 'meme' || images.length > 0);

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-10 max-w-sm w-full text-center shadow-2xl animate-fade-in-up">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">¡Publicado en la Sala de Espera!</h2>
          <p className="text-slate-500 text-sm mb-5">La comunidad ya puede verlo. Esperá los likes. 😄</p>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition"
          >
            Ver el feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[92vh] animate-fade-in-up">

        {/* Header con gradiente cálido */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-6 py-4 sm:rounded-t-2xl flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <span>😄</span> Publicar en Sala de Espera
            </h2>
            <p className="text-xs text-white/80 mt-0.5">El recreo de OdontoLatam</p>
          </div>
          <button onClick={onClose} className="size-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition">
            <span className="material-symbols-outlined text-[22px] text-white">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Tipo */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">¿Qué querés publicar?</label>
            <div className="grid grid-cols-3 gap-2.5">
              {POST_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value as typeof type)}
                  className={`relative flex flex-col items-center text-center px-3 py-4 rounded-xl border-2 transition-all duration-200 ${
                    type === t.value ? t.selectedBorder : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="text-2xl mb-1">{t.emoji}</span>
                  <span className="text-xs font-bold text-slate-800 leading-tight">{t.label}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 leading-tight hidden sm:block">{t.desc}</span>
                  {type === t.value && (
                    <span className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-orange-500 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[13px]">check</span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Título / Caption */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
              {type === 'meme' ? 'Caption (o título del meme)' : type === 'story' ? 'Contala acá' : 'La pregunta'}
              {' '}*
            </label>
            <textarea
              rows={type === 'story' ? 5 : 2}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                type === 'meme'  ? 'El texto que acompaña al meme... o dejá que la imagen hable sola 😂' :
                type === 'story' ? 'Hoy me pasó algo que no puedo creer...' :
                                   '¿Cuál es el peor momento de la semana en el consultorio?'
              }
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 resize-none placeholder:text-slate-300"
            />
          </div>

          {/* Cuerpo extra para anécdota */}
          {type === 'story' && (
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Continuá (opcional)</label>
              <textarea
                rows={3}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="...y lo que dijo después me dejó sin palabras."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 resize-y placeholder:text-slate-300"
              />
            </div>
          )}

          {/* Opciones de encuesta */}
          {type === 'poll' && (
            <div className="space-y-2">
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Opciones (mín. 2, máx. 6)</label>
              {pollOptions.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="size-7 rounded-full bg-violet-100 text-violet-600 text-xs font-black flex items-center justify-center shrink-0">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <input
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    placeholder={`Opción ${i + 1}${i === 0 ? ' (ej: El que cancela 5 min antes)' : ''}`}
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 placeholder:text-slate-300"
                  />
                  {pollOptions.length > 2 && (
                    <button type="button" onClick={() => removeOption(i)} className="size-7 rounded-full hover:bg-red-50 flex items-center justify-center transition shrink-0">
                      <span className="material-symbols-outlined text-red-400 text-[17px]">close</span>
                    </button>
                  )}
                </div>
              ))}
              {pollOptions.length < 6 && (
                <button type="button" onClick={addOption} className="flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-800 mt-1 transition">
                  <span className="material-symbols-outlined text-[15px]">add_circle</span>
                  Agregar opción
                </button>
              )}
            </div>
          )}

          {/* Imagen */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
              {type === 'meme' ? 'Imagen / Meme *' : 'Imagen (opcional)'}
            </label>
            <ImageUpload
              files={images}
              onChange={setImages}
              maxFiles={1}
              required={type === 'meme'}
              hint="PNG, JPG, GIF, WEBP — hasta 10 MB"
              dropzoneClass="hover:border-orange-400 hover:bg-orange-50"
            />
          </div>

          {/* Reglas */}
          <div className={`rounded-xl border-2 px-4 py-4 transition ${rulesOk ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-3">Reglas de la Sala de Espera</p>
            <ul className="space-y-1.5 mb-4">
              {RULES.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="text-base leading-none mt-px">{['🚫', '🚫', '🩸', '🤝'][i]}</span>
                  {r}
                </li>
              ))}
            </ul>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <div
                onClick={() => setRulesOk(!rulesOk)}
                className={`size-5 rounded flex items-center justify-center border-2 transition shrink-0 ${rulesOk ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'}`}
              >
                {rulesOk && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
              </div>
              <span className="text-xs font-semibold text-slate-700">Entendido — voy a respetar estas reglas</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0 bg-white sm:rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition">
            Cancelar
          </button>
          <button
            onClick={() => { if (canSubmit) setSubmitted(true); }}
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <span className="text-base">😄</span>
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
}
