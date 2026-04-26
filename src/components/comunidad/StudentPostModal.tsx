'use client';

import { useState, useEffect } from 'react';
import { useSubmitPostFromModal } from '@/lib/hooks/useSubmitPostFromModal';

const POST_TYPES = [
  {
    value: 'doubt',
    emoji: '🤔',
    label: 'Duda académica',
    desc: 'Algo que no entendiste en clase o en el libro.',
    selectedBorder: 'border-indigo-400 bg-indigo-50 ring-2 ring-indigo-200',
    urgencyOptions: ['Sin urgencia', 'Parcial esta semana', '¡Parcial mañana!'],
  },
  {
    value: 'practice',
    emoji: '🏥',
    label: 'Clínica & Práctica',
    desc: 'Algo vivido en la práctica supervisada.',
    selectedBorder: 'border-teal-400 bg-teal-50 ring-2 ring-teal-200',
    urgencyOptions: null,
  },
  {
    value: 'campus',
    emoji: '🎓',
    label: 'Vida universitaria',
    desc: 'Tu facu, compañeros, consejos, experiencias.',
    selectedBorder: 'border-violet-400 bg-violet-50 ring-2 ring-violet-200',
    urgencyOptions: null,
  },
  {
    value: 'debate',
    emoji: '💬',
    label: 'Debate',
    desc: '¿Qué piensan sobre...? Abrí el debate.',
    selectedBorder: 'border-rose-400 bg-rose-50 ring-2 ring-rose-200',
    urgencyOptions: null,
  },
];

const STUDY_YEARS = ['1° año', '2° año', '3° año', '4° año', '5° año', '6° año'];

const SUGGESTED_TAGS = [
  '#parcial', '#clínica', '#periodoncia', '#endodoncia', '#ortodoncia',
  '#cirugía', '#anatomía', '#histología', '#radiología', '#rehabilitación',
  '#pediatría', '#primeravez', '#residente',
];

interface Props { onClose: () => void; onPosted?: (postId: string) => void; }

export function StudentPostModal({ onClose, onPosted }: Props) {
  const { submit, pending, error } = useSubmitPostFromModal({ onPosted });
  const [type, setType] = useState<'doubt' | 'practice' | 'campus' | 'debate'>('doubt');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [studyYear, setStudyYear] = useState('');
  const [urgency, setUrgency] = useState('Sin urgencia');
  const [tags, setTags] = useState<string[]>([]);
  const [pollOptions, setPollOptions] = useState(['', '']);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function toggleTag(tag: string) {
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  }
  function addPollOption() { if (pollOptions.length < 5) setPollOptions([...pollOptions, '']); }
  function removePollOption(i: number) { if (pollOptions.length > 2) setPollOptions(pollOptions.filter((_, idx) => idx !== i)); }
  function updatePollOption(i: number, val: string) { setPollOptions(pollOptions.map((o, idx) => idx === i ? val : o)); }

  const canSubmit = title.trim().length > 0 &&
    (type !== 'debate' || pollOptions.filter((o) => o.trim()).length >= 2);


  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[92vh] animate-fade-in-up">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-6 py-4 sm:rounded-t-2xl flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px]">school</span>
              Publicar en Carrera & Estudios
            </h2>
            <p className="text-xs text-white/80 mt-0.5">El espacio de los estudiantes de odonto de LATAM</p>
          </div>
          <button onClick={onClose} className="size-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition">
            <span className="material-symbols-outlined text-[22px] text-white">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Tipo de post */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">¿Qué querés compartir?</label>
            <div className="grid grid-cols-2 gap-2.5">
              {POST_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value as typeof type)}
                  className={`relative flex items-start gap-2.5 text-left px-3.5 py-3 rounded-xl border-2 transition-all duration-200 ${
                    type === t.value ? t.selectedBorder : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="text-xl shrink-0 mt-0.5">{t.emoji}</span>
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-tight">{t.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight hidden sm:block">{t.desc}</p>
                  </div>
                  {type === t.value && (
                    <span className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-white text-[13px]">check</span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Urgencia para dudas */}
          {type === 'doubt' && (
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Urgencia</label>
              <div className="flex gap-2 flex-wrap">
                {['Sin urgencia', 'Parcial esta semana', '¡Parcial mañana! 😱'].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUrgency(u)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border transition ${
                      urgency === u
                        ? u.includes('mañana')
                          ? 'bg-red-100 border-red-300 text-red-700'
                          : u.includes('semana')
                            ? 'bg-amber-100 border-amber-300 text-amber-700'
                            : 'bg-slate-100 border-slate-300 text-slate-700'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Año de cursada */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Tu año de cursada
              <span className="ml-2 text-slate-400 font-normal normal-case tracking-normal text-[10px]">— el contexto ayuda a que la respuesta sea más útil</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {STUDY_YEARS.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setStudyYear(studyYear === y ? '' : y)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border transition ${
                    studyYear === y
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
              {type === 'doubt' ? 'Tu pregunta *' : type === 'debate' ? 'La pregunta del debate *' : 'Título *'}
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                type === 'doubt'    ? 'Ej: ¿Por qué el ligamento periodontal funciona como amortiguador?' :
                type === 'practice' ? 'Ej: Mi primera extracción sin complicaciones — el alivio que no esperaba' :
                type === 'campus'   ? 'Ej: ¿Cuál es la mejor facultad de odonto de LATAM?' :
                                      'Ej: ¿Deberían las facultades enseñar más odontología digital?'
              }
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 placeholder:text-slate-300"
            />
          </div>

          {/* Cuerpo */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
              {type === 'doubt' ? 'Contexto (opcional, pero ayuda)' : 'Describilo (opcional)'}
            </label>
            <textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={
                type === 'doubt'    ? 'Contá qué ya intentaste entender, qué dice el libro, qué parte no te cierra...' :
                type === 'practice' ? 'Contá cómo fue, qué aprendiste, qué harías diferente...' :
                type === 'campus'   ? 'Compartí tu experiencia con tu facultad, qué rescatás, qué cambiarías...' :
                                      'Contexto del debate, por qué te parece importante discutirlo...'
              }
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 resize-none placeholder:text-slate-300"
            />
          </div>

          {/* Opciones de encuesta para debate */}
          {type === 'debate' && (
            <div className="space-y-2">
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Opciones de la encuesta (mín. 2, máx. 5)</label>
              {pollOptions.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="size-7 rounded-full bg-indigo-100 text-indigo-600 text-xs font-black flex items-center justify-center shrink-0">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <input
                    value={opt}
                    onChange={(e) => updatePollOption(i, e.target.value)}
                    placeholder={`Opción ${i + 1}`}
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 placeholder:text-slate-300"
                  />
                  {pollOptions.length > 2 && (
                    <button type="button" onClick={() => removePollOption(i)} className="size-7 rounded-full hover:bg-red-50 flex items-center justify-center transition">
                      <span className="material-symbols-outlined text-red-400 text-[17px]">close</span>
                    </button>
                  )}
                </div>
              ))}
              {pollOptions.length < 5 && (
                <button type="button" onClick={addPollOption} className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 mt-1 transition">
                  <span className="material-symbols-outlined text-[15px]">add_circle</span>
                  Agregar opción
                </button>
              )}
            </div>
          )}

          {/* Tags sugeridos */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Tags (opcional)</label>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition font-semibold ${
                    tags.includes(tag)
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Info: odontólogos pueden ver y responder */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 flex items-start gap-3">
            <span className="material-symbols-outlined text-indigo-400 text-[18px] shrink-0 mt-0.5">info</span>
            <p className="text-xs text-indigo-700 leading-relaxed">
              <strong>Estudiantes y odontólogos verán tu post.</strong> Las respuestas de profesionales registrados se marcan con su especialidad para que puedas calibrar el peso de cada opinión.
            </p>
          </div>
        </div>

        {/* Footer preview + submit */}
        <div className="px-6 py-4 border-t border-slate-100 shrink-0 bg-white sm:rounded-b-2xl">
          {/* Tag preview */}
          {(tags.length > 0 || studyYear || urgency !== 'Sin urgencia') && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {studyYear && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200">
                  <span className="material-symbols-outlined text-[12px]">school</span>
                  {studyYear}
                </span>
              )}
              {urgency !== 'Sin urgencia' && (
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                  urgency.includes('mañana') ? 'bg-red-100 text-red-700 border-red-200' : 'bg-amber-100 text-amber-700 border-amber-200'
                }`}>
                  {urgency.includes('mañana') ? '🚨' : '⏰'} {urgency}
                </span>
              )}
              {tags.map((tag) => (
                <span key={tag} className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
            {error && <span className="text-xs text-red-600 mr-2">{error}</span>}
            <button onClick={onClose} disabled={pending} className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition disabled:opacity-50">
              Cancelar
            </button>
            <button
              onClick={() => {
                if (!canSubmit || pending) return;
                const validPollOpts = pollOptions.map((o) => o.trim()).filter(Boolean);
                submit({
                  categorySlug: 'carrera-estudios',
                  title,
                  body: body.trim() || title,
                  metadata: {
                    student_post_type: type,
                    study_year: studyYear || null,
                    urgency,
                    tags,
                  },
                  poll: type === 'debate' && validPollOpts.length >= 2
                    ? { question: title, options: validPollOpts }
                    : undefined,
                });
              }}
              disabled={!canSubmit || pending}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
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
