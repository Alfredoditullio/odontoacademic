'use client';

import { useState, useEffect } from 'react';
import { ImageUpload } from '@/components/comunidad/ImageUpload';

const SPECIALTIES = [
  { value: 'periodoncia',      label: 'Periodoncia',         icon: 'genetics',           specialists: 23 },
  { value: 'implantologia',    label: 'Implantología',       icon: 'stethoscope',        specialists: 18 },
  { value: 'endodoncia',       label: 'Endodoncia',          icon: 'healing',            specialists: 15 },
  { value: 'ortodoncia',       label: 'Ortodoncia',          icon: 'straighten',         specialists: 12 },
  { value: 'cirugia',          label: 'Cirugía Oral',        icon: 'surgical',           specialists: 11 },
  { value: 'rehabilitacion',   label: 'Rehabilitación',      icon: 'favorite',           specialists: 14 },
  { value: 'estetica',         label: 'Estética Dental',     icon: 'star',               specialists: 9  },
  { value: 'radiologia',       label: 'Radiología Oral',     icon: 'radiology',          specialists: 8  },
  { value: 'pediatria',        label: 'Odontopediatría',     icon: 'child_care',         specialists: 7  },
  { value: 'general',          label: 'Odontología General', icon: 'medical_services',   specialists: 142 },
];

const POST_TYPES = [
  {
    value: 'help',
    label: 'Necesito ayuda',
    icon: 'help',
    color: 'from-amber-400 to-orange-500',
    border: 'border-amber-300 bg-amber-50',
    selectedBorder: 'border-amber-500 bg-amber-50 ring-2 ring-amber-300',
    badge: 'bg-amber-100 text-amber-800',
    desc: 'Compartí un caso en curso y pedí la opinión de tus colegas.',
  },
  {
    value: 'resolved',
    label: 'Caso resuelto',
    icon: 'check_circle',
    color: 'from-emerald-400 to-teal-500',
    border: 'border-emerald-200 bg-emerald-50',
    selectedBorder: 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-300',
    badge: 'bg-emerald-100 text-emerald-800',
    desc: 'Compartí un caso terminado con el plan aplicado y los resultados.',
  },
  {
    value: 'debate',
    label: 'Debate / Pregunta',
    icon: 'forum',
    color: 'from-indigo-400 to-violet-500',
    border: 'border-indigo-200 bg-indigo-50',
    selectedBorder: 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-300',
    badge: 'bg-indigo-100 text-indigo-800',
    desc: 'Abrí una discusión teórica o hacé una encuesta a la comunidad.',
  },
];

interface Props {
  onClose: () => void;
}

export function ClinicalPostModal({ onClose }: Props) {
  const [type, setType] = useState<'help' | 'resolved' | 'debate'>('help');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [specialty, setSpecialty] = useState('');
  const [showOutcome, setShowOutcome] = useState(false);
  const [outcome, setOutcome] = useState('');
  const [addPoll, setAddPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [submitted, setSubmitted] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  // lock scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const selectedType = POST_TYPES.find((t) => t.value === type)!;
  const selectedSpecialty = SPECIALTIES.find((s) => s.value === specialty);

  function addPollOption() {
    if (pollOptions.length < 6) setPollOptions([...pollOptions, '']);
  }
  function removePollOption(i: number) {
    if (pollOptions.length > 2) setPollOptions(pollOptions.filter((_, idx) => idx !== i));
  }
  function updatePollOption(i: number, val: string) {
    setPollOptions(pollOptions.map((o, idx) => idx === i ? val : o));
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-10 max-w-sm w-full text-center shadow-2xl animate-fade-in-up">
          <div className="size-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-emerald-600 text-[36px]">check_circle</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">¡Post publicado!</h2>
          <p className="text-slate-500 text-sm mb-2">Tu post fue publicado en Casos Clínicos.</p>
          {type === 'help' && specialty && selectedSpecialty && (
            <p className="text-sm font-semibold text-sky-700 bg-sky-50 rounded-xl px-4 py-2 mb-4">
              <span className="material-symbols-outlined text-[15px] align-middle mr-1">notifications</span>
              Se notificó a <strong>{selectedSpecialty.specialists} especialistas</strong> en {selectedSpecialty.label}.
            </p>
          )}
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-sky-600 to-teal-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition"
          >
            Ver el feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[92vh] animate-fade-in-up">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Nuevo caso clínico</h2>
            <p className="text-xs text-slate-400 mt-0.5">Publicando en Casos Clínicos</p>
          </div>
          <button onClick={onClose} className="size-9 rounded-full hover:bg-slate-100 flex items-center justify-center transition">
            <span className="material-symbols-outlined text-[22px] text-slate-500">close</span>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

          {/* ── Tipo de post ── */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">¿Qué tipo de post es?</label>
            <div className="grid grid-cols-3 gap-2.5">
              {POST_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => { setType(t.value as typeof type); setUrgent(false); setSpecialty(''); setAddPoll(false); }}
                  className={`relative flex flex-col items-center text-center px-3 py-4 rounded-xl border-2 transition-all duration-200 ${
                    type === t.value ? t.selectedBorder : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`size-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center mb-2 shadow-sm`}>
                    <span className="material-symbols-outlined text-white text-[20px]">{t.icon}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 leading-tight">{t.label}</span>
                  {type === t.value && (
                    <span className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[13px]">check</span>
                    </span>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">{selectedType.desc}</p>
          </div>

          {/* ── Necesito ayuda: urgencia + especialidad ── */}
          {type === 'help' && (
            <div className="space-y-4">
              {/* Urgencia */}
              <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-500 text-[20px]">emergency</span>
                  <div>
                    <div className="text-sm font-bold text-red-700">Marcar como URGENTE</div>
                    <div className="text-xs text-red-500">Se destacará con una etiqueta roja en el feed</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setUrgent(!urgent)}
                  className={`relative size-12 rounded-full flex items-center justify-center transition-colors ${urgent ? 'bg-red-500' : 'bg-slate-200'}`}
                >
                  <div className={`size-5 rounded-full bg-white shadow transition-transform ${urgent ? 'translate-x-2.5' : '-translate-x-2.5'}`} />
                </button>
              </div>

              {/* Especialidad */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Especialidad requerida
                  <span className="ml-1 text-slate-300 font-normal normal-case tracking-normal">(notifica a especialistas)</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {SPECIALTIES.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setSpecialty(specialty === s.value ? '' : s.value)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition ${
                        specialty === s.value
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px] text-slate-400">{s.icon}</span>
                      <span className="text-xs font-semibold text-slate-700 flex-1">{s.label}</span>
                      <span className="text-[10px] text-slate-400 font-bold">{s.specialists}</span>
                    </button>
                  ))}
                </div>

                {/* Notificación preview */}
                {selectedSpecialty && (
                  <div className="mt-3 flex items-start gap-2.5 bg-sky-50 border border-sky-200 rounded-xl px-4 py-3 animate-fade-in-up">
                    <span className="material-symbols-outlined text-sky-500 text-[20px] shrink-0 mt-0.5">notifications_active</span>
                    <div>
                      <p className="text-sm font-bold text-sky-800">
                        Se notificará a {selectedSpecialty.specialists} especialistas en {selectedSpecialty.label}
                      </p>
                      <p className="text-xs text-sky-600 mt-0.5">
                        Recibirán una notificación push para que vean tu caso y puedan comentar.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Título ── */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Título del post</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                type === 'help' ? 'Ej: Defecto óseo vertical en 3.6, ¿qué técnica regenerativa usarían?' :
                type === 'resolved' ? 'Ej: Rehabilitación implantosoportada en maxilar atrófico — resultado a 2 años' :
                'Ej: ¿Cuándo prefieren EMD vs membrana en regeneración periodontal?'
              }
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-slate-300"
            />
          </div>

          {/* ── Contenido ── */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
              {type === 'help' ? 'Descripción del caso' : type === 'resolved' ? 'Descripción del caso y plan aplicado' : 'Desarrollo de la pregunta o debate'}
            </label>
            <textarea
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={
                type === 'help'
                  ? 'Describí el paciente (edad, antecedentes relevantes), el problema clínico, hallazgos, lo que ya hiciste y qué consulta necesitás...'
                  : type === 'resolved'
                  ? 'Describí el caso, el plan de tratamiento que aplicaste, los materiales usados y el resultado final...'
                  : 'Planteá la pregunta o el debate. Podés agregar contexto clínico, referencias bibliográficas o tu propia opinión...'
              }
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y placeholder:text-slate-300"
            />
          </div>

          {/* ── Caso resuelto: resultado ── */}
          {type === 'resolved' && (
            <div>
              <button
                type="button"
                onClick={() => setShowOutcome(!showOutcome)}
                className="flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition"
              >
                <span className="material-symbols-outlined text-[18px]">{showOutcome ? 'expand_less' : 'add'}</span>
                {showOutcome ? 'Ocultar resultado' : '+ Agregar resumen del resultado'}
              </button>
              {showOutcome && (
                <div className="mt-3 animate-fade-in-up">
                  <textarea
                    rows={3}
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    placeholder="Resultado a corto/largo plazo, controles, complicaciones, aprendizajes..."
                    className="w-full border border-emerald-200 bg-emerald-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 resize-y placeholder:text-emerald-300"
                  />
                </div>
              )}
            </div>
          )}

          {/* ── Debate: encuesta ── */}
          {type === 'debate' && (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => setAddPoll(!addPoll)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${addPoll ? 'bg-indigo-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 size-4 rounded-full bg-white shadow transition-all ${addPoll ? 'left-6' : 'left-1'}`} />
                </button>
                <span className="text-sm font-bold text-slate-700">Agregar encuesta</span>
              </div>

              {addPoll && (
                <div className="space-y-2 animate-fade-in-up">
                  <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Opciones de la encuesta (mín 2, máx 6)</label>
                  {pollOptions.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + i)}
                      </div>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => updatePollOption(i, e.target.value)}
                        placeholder={`Opción ${i + 1}`}
                        className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                      />
                      {pollOptions.length > 2 && (
                        <button type="button" onClick={() => removePollOption(i)} className="size-7 rounded-full hover:bg-red-50 flex items-center justify-center transition">
                          <span className="material-symbols-outlined text-red-400 text-[17px]">close</span>
                        </button>
                      )}
                    </div>
                  ))}
                  {pollOptions.length < 6 && (
                    <button
                      type="button"
                      onClick={addPollOption}
                      className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 mt-1 transition"
                    >
                      <span className="material-symbols-outlined text-[15px]">add_circle</span>
                      Agregar opción
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Imágenes ── */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Imágenes clínicas <span className="font-normal text-slate-400 normal-case tracking-normal">(opcional, hasta 8)</span>
            </label>
            <ImageUpload
              files={images}
              onChange={setImages}
              maxFiles={8}
              hint="Radiografías, fotos clínicas, capturas de pantalla — PNG, JPG, HEIC"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0 bg-white rounded-b-2xl">
          {/* Tag preview */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${selectedType.badge}`}>
              <span className="material-symbols-outlined text-[12px]">{selectedType.icon}</span>
              {selectedType.label}
            </span>
            {type === 'help' && urgent && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                <span className="material-symbols-outlined text-[12px]">emergency</span>
                URGENTE
              </span>
            )}
            {type === 'help' && selectedSpecialty && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">
                <span className="material-symbols-outlined text-[12px]">stethoscope</span>
                {selectedSpecialty.label}
              </span>
            )}
            {type === 'debate' && addPoll && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                <span className="material-symbols-outlined text-[12px]">ballot</span>
                Encuesta
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition">
              Cancelar
            </button>
            <button
              onClick={() => { if (title.trim() && body.trim()) setSubmitted(true); }}
              disabled={!title.trim() || !body.trim()}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
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
