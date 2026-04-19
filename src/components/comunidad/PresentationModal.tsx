'use client';

import { useState, useEffect } from 'react';

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
  const [submitted, setSubmitted] = useState(false);

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
    if (!name.trim() || !specialty.trim() || !country) return;
    const record: PresentationRecord = { postedAt: new Date().toISOString(), name: name.trim(), specialty: specialty.trim(), country };
    localStorage.setItem(LS_KEY, JSON.stringify(record));
    setSubmitted(true);
    onPosted(record);
  }

  const canSubmit = name.trim() && specialty.trim() && country && experience;

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-10 max-w-sm w-full text-center shadow-2xl animate-fade-in-up">
          <div className="size-16 rounded-full bg-sky-100 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-sky-500 text-[36px]">waving_hand</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">¡Bienvenido a OdontoLatam!</h2>
          <p className="text-slate-500 text-sm mb-5">Tu presentación fue publicada. La comunidad ya puede conocerte.</p>
          <p className="text-xs text-slate-400 bg-slate-50 rounded-xl px-4 py-3">
            Podés actualizar tu presentación en 6 meses.
          </p>
          <button
            onClick={onClose}
            className="mt-5 bg-gradient-to-r from-sky-600 to-teal-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition"
          >
            Ver presentaciones
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
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition">
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">waving_hand</span>
              Publicar presentación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
