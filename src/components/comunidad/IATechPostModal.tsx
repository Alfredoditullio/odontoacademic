'use client';

import { useState, useEffect } from 'react';
import { ImageUpload } from '@/components/comunidad/ImageUpload';
import { useSubmitPostFromModal } from '@/lib/hooks/useSubmitPostFromModal';

const POST_TYPES = [
  {
    value: 'tool',
    emoji: '🤖',
    label: 'Herramienta nueva',
    desc: 'Software, app o IA que empezaste a usar en el consultorio.',
    border: 'border-violet-400 bg-violet-50 ring-2 ring-violet-200',
  },
  {
    value: 'question',
    emoji: '🙋',
    label: 'Pregunta',
    desc: 'Consultale a la comunidad sobre IA o tecnología dental.',
    border: 'border-sky-400 bg-sky-50 ring-2 ring-sky-200',
  },
  {
    value: 'review',
    emoji: '⭐',
    label: 'Review / Análisis',
    desc: 'Evaluación en profundidad de una herramienta o flujo.',
    border: 'border-amber-400 bg-amber-50 ring-2 ring-amber-200',
  },
  {
    value: 'debate',
    emoji: '💬',
    label: 'Debate',
    desc: 'Lanzá una discusión sobre el futuro de la tecnología en odontología.',
    border: 'border-rose-400 bg-rose-50 ring-2 ring-rose-200',
  },
];

const TOOLS = [
  'ChatGPT / GPT-4', 'Gemini', 'Copilot', 'Midjourney', 'DALL·E',
  'Planmeca Romexis', 'Carestream', '3Shape', 'Medit', 'Cerec',
  'Dental AI', 'Pearl AI', 'Overjet', 'VideaHealth', 'Denti.ai',
];

const POLL_DEFAULTS: Record<string, string[]> = {
  tool:     ['Lo uso y me encanta', 'Lo probé pero no convenció', 'Todavía no lo usé'],
  question: ['Opción A', 'Opción B'],
  review:   ['Lo recomendaría', 'Lo recomendaría con reservas', 'No lo recomendaría'],
  debate:   ['A favor', 'En contra', 'Depende del caso'],
};

interface Props { onClose: () => void; onPosted?: (postId: string) => void; }

export function IATechPostModal({ onClose, onPosted }: Props) {
  const { submit, pending, error } = useSubmitPostFromModal({ onPosted });
  const [type, setType]           = useState<'tool' | 'question' | 'review' | 'debate'>('tool');
  const [title, setTitle]         = useState('');
  const [body, setBody]           = useState('');
  const [link, setLink]           = useState('');
  const [tags, setTags]           = useState<string[]>([]);
  const [addPoll, setAddPoll]     = useState(false);
  const [pollOptions, setPollOptions] = useState(POLL_DEFAULTS['tool']);
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function toggleTag(t: string) {
    setTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  }
  function addOption()               { if (pollOptions.length < 5) setPollOptions([...pollOptions, '']); }
  function removeOption(i: number)   { if (pollOptions.length > 2) setPollOptions(pollOptions.filter((_, idx) => idx !== i)); }
  function updateOption(i: number, v: string) { setPollOptions(pollOptions.map((o, idx) => idx === i ? v : o)); }

  function handleTypeChange(v: typeof type) {
    setType(v);
    setTags([]);
    const defaults = POLL_DEFAULTS[v];
    setPollOptions(defaults);
    setAddPoll(defaults.length >= 2);
  }

  const canSubmit = title.trim().length > 0 && body.trim().length > 0;


  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4 sm:rounded-t-2xl flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px]">smart_toy</span>
              Publicar en IA y Tecnología
            </h2>
            <p className="text-xs text-white/80 mt-0.5">Herramientas, análisis y debates sobre tecnología dental</p>
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
                    <span className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-violet-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[13px]">check</span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tags de herramientas */}
          {(type === 'tool' || type === 'review') && (
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Herramientas mencionadas</label>
              <div className="flex flex-wrap gap-1.5">
                {TOOLS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTag(t)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border transition ${
                      tags.includes(t)
                        ? 'bg-violet-600 text-white border-violet-600'
                        : 'border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-700'
                    }`}
                  >
                    {t}
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
                type === 'tool'     ? 'Ej: Usé IA para hacer diagnósticos — esto aprendí en 3 meses' :
                type === 'question' ? 'Ej: ¿Están usando ChatGPT para redactar historias clínicas?' :
                type === 'review'   ? 'Ej: Pearl AI en el consultorio: análisis completo después de 6 meses' :
                                      'Ej: ¿La IA va a reemplazar al odontólogo en los próximos 10 años?'
              }
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 placeholder:text-slate-400"
            />
          </div>

          {/* Cuerpo */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
              {type === 'tool'     ? 'Contá tu experiencia *' :
               type === 'question' ? 'Desarrollá tu pregunta *' :
               type === 'review'   ? 'Tu análisis *' :
                                     'Desarrollá el debate *'}
            </label>
            <textarea
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={
                type === 'tool'     ? 'Qué herramienta usás, cómo la integrás al flujo de trabajo, pros y contras, precio, para qué tipo de clínica es ideal...' :
                type === 'question' ? 'Contexto de tu consulta, qué ya investigaste, qué respuestas buscás...' :
                type === 'review'   ? 'Características principales, funcionamiento en la práctica, limitaciones, comparación con alternativas, veredicto final...' :
                                      'Tu posición en el debate, argumentos, casos o estudios que lo respaldan, qué opinas de la postura contraria...'
              }
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 resize-none placeholder:text-slate-400"
            />
          </div>

          {/* Link opcional */}
          {(type === 'tool' || type === 'review') && (
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Link a la herramienta (opcional)</label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://..."
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 placeholder:text-slate-400"
              />
            </div>
          )}

          {/* Imágenes / Screenshots */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Capturas de pantalla <span className="font-normal text-slate-400 normal-case tracking-normal">(opcional, hasta 4)</span>
            </label>
            <ImageUpload
              files={images}
              onChange={setImages}
              maxFiles={4}
              hint="Screenshots de la herramienta, resultados, interfaz — PNG, JPG"
              dropzoneClass="hover:border-violet-400/50 hover:bg-violet-50"
            />
          </div>

          {/* Encuesta */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <button
                type="button"
                onClick={() => setAddPoll(!addPoll)}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${addPoll ? 'bg-violet-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 size-4 rounded-full bg-white shadow transition-all ${addPoll ? 'left-6' : 'left-1'}`} />
              </button>
              <span className="text-sm font-bold text-slate-700">Agregar encuesta</span>
            </div>
            {addPoll && (
              <div className="space-y-2">
                {pollOptions.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-violet-100 text-violet-700 text-xs font-black flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <input
                      value={opt}
                      onChange={(e) => updateOption(i, e.target.value)}
                      placeholder={`Opción ${i + 1}`}
                      className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 placeholder:text-slate-400"
                    />
                    {pollOptions.length > 2 && (
                      <button type="button" onClick={() => removeOption(i)} className="size-7 rounded-full hover:bg-red-50 flex items-center justify-center transition">
                        <span className="material-symbols-outlined text-red-400 text-[17px]">close</span>
                      </button>
                    )}
                  </div>
                ))}
                {pollOptions.length < 5 && (
                  <button type="button" onClick={addOption} className="flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-800 transition">
                    <span className="material-symbols-outlined text-[15px]">add_circle</span>
                    Agregar opción
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 shrink-0 bg-white sm:rounded-b-2xl flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span key={t} className="text-[11px] font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full border border-violet-200">{t}</span>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {error && <span className="text-xs text-red-600 mr-2">{error}</span>}
            <button onClick={onClose} disabled={pending} className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition disabled:opacity-50">Cancelar</button>
            <button
              onClick={() => {
                if (!canSubmit || pending) return;
                const validPollOpts = pollOptions.map((o) => o.trim()).filter(Boolean);
                submit({
                  categorySlug: 'ia-tecnologia',
                  title,
                  body: link ? `${body}\n\nLink: ${link}` : body,
                  images,
                  metadata: {
                    iatech_type: type,
                    tags,
                    link: link || null,
                  },
                  poll: addPoll && validPollOpts.length >= 2
                    ? { question: title, options: validPollOpts }
                    : undefined,
                });
              }}
              disabled={!canSubmit || pending}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <span className={`material-symbols-outlined text-[18px] ${pending ? 'animate-spin' : ''}`}>{pending ? 'progress_activity' : 'send'}</span>
              {pending ? 'Publicando…' : 'Publicar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
