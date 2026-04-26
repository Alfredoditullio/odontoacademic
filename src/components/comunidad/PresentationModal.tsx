'use client';

import { useState, useEffect } from 'react';
import { useSubmitPostFromModal } from '@/lib/hooks/useSubmitPostFromModal';

const INTERESTS = [
  'Implantología', 'Periodoncia', 'Endodoncia', 'Ortodoncia', 'Cirugía Oral',
  'Rehabilitación', 'Estética Dental', 'Odontopediatría', 'Radiología Oral',
  'Odontología General', 'Docencia', 'Investigación', 'IA y Tecnología', 'Gestión de Consultorio',
];

const COUNTRIES = [
  'Argentina', 'México', 'Colombia', 'Chile', 'Venezuela', 'Perú', 'Uruguay',
  'Ecuador', 'Bolivia', 'Paraguay', 'Brasil', 'España', 'Otro',
];

const EXPERIENCE_RANGES = [
  { value: '0-2', label: 'Recién recibido (0–2 años)' },
  { value: '3-5', label: '3 a 5 años' },
  { value: '6-10', label: '6 a 10 años' },
  { value: '11-20', label: '11 a 20 años' },
  { value: '20+', label: 'Más de 20 años' },
];

const LS_KEY = 'ol_presentation';

export interface PresentationRecord {
  postedAt: string; // ISO date
  name: string;
  specialty: string;
  country: string;
}

interface Props {
  onClose: () => void;
  onPosted: (record: PresentationRecord) => void;
}

export function PresentationModal({ onClose, onPosted }: Props) {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [experience, setExperience] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [funFact, setFunFact] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const { submit, pending, error } = useSubmitPostFromModal({
    onPosted: (postId) => {
      // Mantenemos el record en localStorage para que `/comunidad/c/presentaciones`
      // siga sabiendo que ya te presentaste y aplique la regla de "1 cada 6 meses".
      const record: PresentationRecord = {
        postedAt: new Date().toISOString(),
        name: name.trim(),
        specialty: specialty.trim(),
        country,
      };
      try { localStorage.setItem(LS_KEY, JSON.stringify(record)); } catch { /* noop */ }
      onPosted(record);
      // No llamamos onClose porque el hook ya hace router.push al detail del post.
      void postId;
    },
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function toggleInterest(val: string) {
    setSelectedInterests((prev) =>
      prev.includes(val) ? prev.filter((i) => i !== val) : prev.length < 5 ? [...prev, val] : prev
    );
  }

  function handleSubmit() {
    if (!canSubmit || pending) return;
    // Construimos el cuerpo de la presentación a partir de los campos del modal.
    const lines: string[] = [
      `Hola, soy ${name.trim()}.`,
      `Soy ${specialty.trim()} (${experience}).`,
      `Vivo en ${city.trim() ? `${city.trim()}, ` : ''}${country}.`,
    ];
    if (lookingFor.trim()) lines.push(`Lo que busco en OdontoLatam: ${lookingFor.trim()}`);
    if (funFact.trim())    lines.push(`Dato curioso: ${funFact.trim()}`);
    if (selectedInterests.length > 0) lines.push(`Mis intereses: ${selectedInterests.join(', ')}.`);

    submit({
      categorySlug: 'presentaciones',
      title: `${name.trim()} — ${specialty.trim()}`,
      body: lines.join('\n\n'),
      metadata: {
        presentation_name: name.trim(),
        presentation_specialty: specialty.trim(),
        presentation_country: country,
        presentation_city: city.trim() || null,
        presentation_experience: experience,
        presentation_interests: selectedInterests,
      },
    });
  }

  const canSubmit = name.trim() && specialty.trim() && country && experience;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[92vh] animate-fade-in-up">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Presentate a la comunidad</h2>
            <p className="text-xs text-slate-400 mt-0.5">Solo se puede publicar una vez cada 6 meses</p>
          </div>
          <button onClick={onClose} className="size-9 rounded-full hover:bg-slate-100 flex items-center justify-center transition">
            <span className="material-symbols-outlined text-[22px] text-slate-500">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Nombre + Especialidad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Nombre completo *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Dra. María González"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-slate-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Especialidad *</label>
              <input
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="Ej: Periodoncia, Implantología..."
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* País + Ciudad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">País *</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white text-slate-700"
              >
                <option value="">Seleccionar país...</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Ciudad</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ej: Buenos Aires"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Experiencia */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Años de experiencia *</label>
            <div className="flex flex-wrap gap-2">
              {EXPERIENCE_RANGES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setExperience(r.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                    experience === r.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Intereses */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Temas de interés <span className="font-normal text-slate-300 normal-case tracking-normal">(hasta 5)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => {
                const selected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                      selected
                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    } ${!selected && selectedInterests.length >= 5 ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    {selected && <span className="mr-1">✓</span>}
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ¿Qué buscás? */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
              ¿Qué buscás en OdontoLatam?
            </label>
            <textarea
              rows={3}
              value={lookingFor}
              onChange={(e) => setLookingFor(e.target.value)}
              placeholder="Ej: Aprender de casos complejos, conectar con colegas de mi especialidad, compartir experiencias..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none placeholder:text-slate-300"
            />
          </div>

          {/* Dato curioso */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Un dato curioso sobre vos <span className="font-normal text-slate-300 normal-case tracking-normal">(opcional)</span>
            </label>
            <input
              value={funFact}
              onChange={(e) => setFunFact(e.target.value)}
              placeholder="Ej: Soy músico amateur, colecciono libros de anatomía, viajé a 30 países..."
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-slate-300"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <p className="text-[11px] text-slate-400">
            <span className="material-symbols-outlined text-[13px] align-middle">lock</span>
            {' '}Podés editar esto en tu perfil después
          </p>
          <div className="flex items-center gap-2">
            {error && <span className="text-xs text-red-600 mr-2">{error}</span>}
            <button onClick={onClose} disabled={pending} className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition disabled:opacity-50">
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || pending}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <span className={`material-symbols-outlined text-[18px] ${pending ? 'animate-spin' : ''}`}>{pending ? 'progress_activity' : 'waving_hand'}</span>
              {pending ? 'Publicando…' : 'Publicar presentación'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
