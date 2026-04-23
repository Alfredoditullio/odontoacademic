'use client';

import { useState } from 'react';
import type { CommunityEvent, Profile } from '@/lib/types';

type EventWithAuthor = CommunityEvent & { author: Pick<Profile, 'display_name' | 'handle' | 'avatar_url'> };

interface Props {
  onClose: () => void;
  onCreated: (event: EventWithAuthor) => void;
}

const TYPE_OPTIONS = [
  { value: 'course',   label: 'Curso',     icon: 'school',       desc: 'Formación estructurada, presencial u online' },
  { value: 'workshop', label: 'Taller',    icon: 'construction', desc: 'Práctico, hands-on, laboratorio o clínico' },
  { value: 'webinar',  label: 'Webinar',   icon: 'videocam',     desc: 'Online en vivo, conferencia virtual' },
  { value: 'congress', label: 'Congreso',  icon: 'groups',       desc: 'Congreso o jornada científica' },
  { value: 'meetup',   label: 'Meetup',    icon: 'handshake',    desc: 'Encuentro informal de la comunidad' },
  { value: 'fair',     label: 'Feria',     icon: 'storefront',   desc: 'Exposición o feria comercial/científica' },
] as const;

const SPECIALTIES = [
  'General / Multidisciplinario',
  'Implantología',
  'Periodoncia',
  'Endodoncia',
  'Ortodoncia',
  'Cirugía Oral y Maxilofacial',
  'Rehabilitación Oral / Prótesis',
  'Odontopediatría',
  'Estética Dental',
  'Radiología Dental',
  'Patología Oral',
  'Odontología Digital',
  'IA y Tecnología',
  'Marketing Dental',
  'Gestión del Consultorio',
  'Investigación',
  'Otra',
];

const REGIONS = [
  { value: 'Online',       flag: '🌐', label: 'Online' },
  { value: 'LATAM',        flag: '🌎', label: 'LATAM' },
  { value: 'España',       flag: '🇪🇸', label: 'España' },
  { value: 'Europa',       flag: '🇪🇺', label: 'Europa' },
  { value: 'Norteamérica', flag: '🇺🇸', label: 'Norteamérica' },
  { value: 'Asia',         flag: '🌏', label: 'Asia' },
] as const;

const EMPTY: {
  title: string;
  description: string;
  event_type: CommunityEvent['event_type'];
  specialty: string;
  region: CommunityEvent['region'];
  country: string;
  location: string;
  date_start: string;
  date_end: string;
  is_free: boolean;
  price: string;
  event_url: string;
  registration_url: string;
} = {
  title: '',
  description: '',
  event_type: 'course',
  specialty: 'General / Multidisciplinario',
  region: 'LATAM',
  country: '',
  location: '',
  date_start: '',
  date_end: '',
  is_free: false,
  price: '',
  event_url: '',
  registration_url: '',
};

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-bold text-slate-600 mb-1.5">
      {children} {required && <span className="text-rose-400">*</span>}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary placeholder:text-slate-400 ${props.className ?? ''}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary placeholder:text-slate-400 resize-none ${props.className ?? ''}`}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary bg-white ${props.className ?? ''}`}
    />
  );
}

export function CreateEventModal({ onClose, onCreated }: Props) {
  const [form, setForm] = useState(EMPTY);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [errors, setErrors] = useState<Partial<Record<keyof typeof EMPTY, string>>>({});

  const set = <K extends keyof typeof EMPTY>(key: K, val: (typeof EMPTY)[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  function validate() {
    const e: typeof errors = {};
    if (!form.title.trim())      e.title = 'El título es requerido';
    if (!form.date_start)        e.date_start = 'La fecha de inicio es requerida';
    if (form.region !== 'Online' && !form.country.trim()) e.country = 'Indicá el país';
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const newEvent: EventWithAuthor = {
      id: `ev-user-${Date.now()}`,
      author_id: 'u-001',
      title: form.title.trim(),
      description: form.description.trim() || null,
      event_type: form.event_type,
      specialty: form.specialty || null,
      region: form.region,
      country: form.country.trim() || null,
      location: form.location.trim() || null,
      event_url: form.event_url.trim() || null,
      registration_url: form.registration_url.trim() || null,
      starts_at: new Date(form.date_start).toISOString(),
      ends_at: form.date_end ? new Date(form.date_end).toISOString() : null,
      is_free: form.is_free,
      price: !form.is_free && form.price.trim() ? form.price.trim() : null,
      image_url: null,
      created_at: new Date().toISOString(),
      author: { display_name: 'Dr. Martín Rodríguez', handle: 'dr-rodriguez', avatar_url: null },
    };

    onCreated(newEvent);
    setStep('success');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="font-black text-slate-900">Publicar evento</h2>
            <p className="text-xs text-slate-400 mt-0.5">Curso, taller, webinar o congreso</p>
          </div>
          <button
            onClick={onClose}
            className="size-9 rounded-xl hover:bg-slate-100 flex items-center justify-center transition"
          >
            <span className="material-symbols-outlined text-[22px] text-slate-400">close</span>
          </button>
        </div>

        {step === 'success' ? (
          /* ── Success ── */
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-14 px-6 text-center">
            <div className="size-20 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[40px] text-emerald-600">event_available</span>
            </div>
            <h3 className="text-xl font-black text-slate-900">¡Evento publicado!</h3>
            <p className="text-sm text-slate-500 max-w-xs">
              Tu evento ya aparece en el listado. La comunidad puede verlo y acceder al link de inscripción.
            </p>
            <button
              onClick={onClose}
              className="mt-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition"
            >
              Ver eventos
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* Tipo de evento */}
              <div>
                <Label required>Tipo de evento</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TYPE_OPTIONS.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => set('event_type', t.value)}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition ${
                        form.event_type === t.value
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-[20px] mt-0.5 shrink-0 ${form.event_type === t.value ? 'text-primary' : 'text-slate-400'}`}>
                        {t.icon}
                      </span>
                      <div>
                        <p className={`text-xs font-bold ${form.event_type === t.value ? 'text-primary' : 'text-slate-700'}`}>{t.label}</p>
                        <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{t.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Título */}
              <div>
                <Label required>Título del evento</Label>
                <Input
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  placeholder='Ej: "Taller de Implantes Inmediatos — Nivel Avanzado"'
                />
                {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
              </div>

              {/* Descripción */}
              <div>
                <Label>Descripción</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Describí el contenido, el nivel, los docentes y qué van a aprender los asistentes..."
                  rows={3}
                />
              </div>

              {/* Especialidad */}
              <div>
                <Label required>Especialidad / Temática</Label>
                <Select value={form.specialty} onChange={(e) => set('specialty', e.target.value)}>
                  {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>

              {/* Región + País + Ciudad */}
              <div>
                <Label required>Región</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {REGIONS.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => {
                        set('region', r.value);
                        if (r.value === 'Online') { set('country', ''); set('location', ''); }
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
                        form.region === r.value
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-primary/40'
                      }`}
                    >
                      {r.flag} {r.label}
                    </button>
                  ))}
                </div>

                {form.region !== 'Online' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label required>País</Label>
                      <Input
                        value={form.country}
                        onChange={(e) => set('country', e.target.value)}
                        placeholder='Ej: "Argentina"'
                      />
                      {errors.country && <p className="text-xs text-rose-500 mt-1">{errors.country}</p>}
                    </div>
                    <div>
                      <Label>Ciudad / Sede</Label>
                      <Input
                        value={form.location}
                        onChange={(e) => set('location', e.target.value)}
                        placeholder='Ej: "Buenos Aires"'
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label required>Fecha de inicio</Label>
                  <Input
                    type="date"
                    value={form.date_start}
                    onChange={(e) => set('date_start', e.target.value)}
                  />
                  {errors.date_start && <p className="text-xs text-rose-500 mt-1">{errors.date_start}</p>}
                </div>
                <div>
                  <Label>Fecha de fin</Label>
                  <Input
                    type="date"
                    value={form.date_end}
                    min={form.date_start}
                    onChange={(e) => set('date_end', e.target.value)}
                  />
                </div>
              </div>

              {/* Precio */}
              <div>
                <Label>Precio</Label>
                <div className="flex items-center gap-3 mb-2">
                  <button
                    type="button"
                    onClick={() => set('is_free', true)}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition ${
                      form.is_free
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px] align-middle mr-1">check_circle</span>
                    Gratuito
                  </button>
                  <button
                    type="button"
                    onClick={() => set('is_free', false)}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition ${
                      !form.is_free
                        ? 'bg-amber-50 border-amber-300 text-amber-700'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px] align-middle mr-1">payments</span>
                    Con costo
                  </button>
                </div>
                {!form.is_free && (
                  <Input
                    value={form.price}
                    onChange={(e) => set('price', e.target.value)}
                    placeholder='Ej: "USD 200" o "ARS 50.000"'
                  />
                )}
              </div>

              {/* Links */}
              <div className="space-y-3">
                <div>
                  <Label>Sitio web del evento</Label>
                  <Input
                    type="url"
                    value={form.event_url}
                    onChange={(e) => set('event_url', e.target.value)}
                    placeholder="https://tuevento.com"
                  />
                </div>
                <div>
                  <Label>Link de inscripción</Label>
                  <Input
                    type="url"
                    value={form.registration_url}
                    onChange={(e) => set('registration_url', e.target.value)}
                    placeholder="https://tuevento.com/inscripcion"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Si el link de inscripción es distinto al sitio web, completá los dos.
                  </p>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-white shrink-0 flex items-center justify-between gap-3">
              <p className="text-xs text-slate-400">
                <span className="text-rose-400">*</span> campos requeridos
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition"
                >
                  <span className="material-symbols-outlined text-[18px]">event</span>
                  Publicar evento
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
