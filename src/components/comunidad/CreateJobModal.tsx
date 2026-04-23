'use client';

import { useState } from 'react';
import type { JobListing, JobType, JobModality } from '@/lib/types';

interface Props {
  onClose: () => void;
  onCreated: (job: JobListing) => void;
}

const TYPE_OPTIONS: { value: JobType; label: string; icon: string; desc: string }[] = [
  { value: 'empleado',      label: 'Empleado/a',    icon: 'badge',        desc: 'Relación de dependencia en consultorio' },
  { value: 'socio',         label: 'Socio/a',       icon: 'handshake',    desc: 'Incorporación como socio o asociado' },
  { value: 'guardia',       label: 'Guardia',       icon: 'emergency',    desc: 'Guardias horarias o de fin de semana' },
  { value: 'reemplazo',     label: 'Reemplazo',     icon: 'swap_horiz',   desc: 'Cobertura por vacaciones o licencia' },
  { value: 'docente',       label: 'Docente',       icon: 'school',       desc: 'Cargo académico en facultad o institución' },
  { value: 'investigacion', label: 'Investigación', icon: 'science',      desc: 'Proyecto de investigación o beca' },
];

const MODALITIES: { value: JobModality; label: string; icon: string }[] = [
  { value: 'presencial', label: 'Presencial', icon: 'location_on' },
  { value: 'hibrido',    label: 'Híbrido',    icon: 'sync_alt' },
  { value: 'remoto',     label: 'Remoto',     icon: 'wifi' },
];

const SPECIALTIES = [
  'Odontología General',
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
  'Urgencias',
  'Biomateriales',
  'Investigación',
  'Docencia',
  'Multidisciplinaria',
  'Otra',
];

interface FormState {
  type: JobType;
  title: string;
  clinic: string;
  anonymous: boolean;
  modality: JobModality;
  specialty: string;
  country: string;
  city: string;
  description: string;
  requirements: string[];
  is_paid: boolean;
  salary_range: string;
  contact: string;
}

const EMPTY: FormState = {
  type: 'empleado',
  title: '',
  clinic: '',
  anonymous: false,
  modality: 'presencial',
  specialty: 'Odontología General',
  country: '',
  city: '',
  description: '',
  requirements: [''],
  is_paid: true,
  salary_range: '',
  contact: '',
};

/* ── Shared field primitives ── */
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-bold text-slate-600 mb-1.5">
      {children}{required && <span className="text-rose-400 ml-0.5">*</span>}
    </label>
  );
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500 placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-400 ${props.className ?? ''}`}
    />
  );
}
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500 placeholder:text-slate-400 resize-none ${props.className ?? ''}`}
    />
  );
}
function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500 bg-white ${props.className ?? ''}`}
    />
  );
}

export function CreateJobModal({ onClose, onCreated }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  /* ── Requirements list helpers ── */
  const setReq = (i: number, val: string) =>
    setForm((f) => { const r = [...f.requirements]; r[i] = val; return { ...f, requirements: r }; });
  const addReq = () =>
    setForm((f) => ({ ...f, requirements: [...f.requirements, ''] }));
  const removeReq = (i: number) =>
    setForm((f) => ({ ...f, requirements: f.requirements.filter((_, idx) => idx !== i) }));

  /* ── Validation ── */
  function validate() {
    const e: typeof errors = {};
    if (!form.title.trim())       e.title       = 'El título es requerido';
    if (!form.country.trim())     e.country     = 'El país es requerido';
    if (!form.city.trim())        e.city        = 'La ciudad es requerida';
    if (!form.description.trim()) e.description = 'La descripción es requerida';
    if (!form.contact.trim())     e.contact     = 'El contacto es requerido';
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const job: JobListing = {
      id: `j-user-${Date.now()}`,
      title: form.title.trim(),
      clinic: form.anonymous ? null : (form.clinic.trim() || null),
      type: form.type,
      modality: form.modality,
      specialty: form.specialty || null,
      city: form.city.trim(),
      country: form.country.trim(),
      description: form.description.trim(),
      requirements: form.requirements.map((r) => r.trim()).filter(Boolean),
      contact: form.contact.trim(),
      is_paid: form.is_paid,
      salary_range: form.is_paid && form.salary_range.trim() ? form.salary_range.trim() : null,
      posted_at: new Date().toISOString(),
    };

    onCreated(job);
    setStep('success');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="font-black text-slate-900">Publicar oferta laboral</h2>
            <p className="text-xs text-slate-400 mt-0.5">Empleo, guardia, sociedad o cargo académico</p>
          </div>
          <button onClick={onClose} className="size-9 rounded-xl hover:bg-slate-100 flex items-center justify-center transition">
            <span className="material-symbols-outlined text-[22px] text-slate-400">close</span>
          </button>
        </div>

        {step === 'success' ? (
          /* ── Success ── */
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-14 px-6 text-center">
            <div className="size-20 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[40px] text-emerald-600">task_alt</span>
            </div>
            <h3 className="text-xl font-black text-slate-900">¡Oferta publicada!</h3>
            <p className="text-sm text-slate-500 max-w-xs">
              Tu aviso ya está visible en la bolsa de trabajo. Los interesados podrán contactarte directamente.
            </p>
            <button
              onClick={onClose}
              className="mt-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition"
            >
              Ver ofertas
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* Tipo */}
              <div>
                <Label required>Tipo de oferta</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TYPE_OPTIONS.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => set('type', t.value)}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition ${
                        form.type === t.value
                          ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-[20px] mt-0.5 shrink-0 ${form.type === t.value ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {t.icon}
                      </span>
                      <div>
                        <p className={`text-xs font-bold ${form.type === t.value ? 'text-emerald-700' : 'text-slate-700'}`}>{t.label}</p>
                        <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{t.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Título */}
              <div>
                <Label required>Título del puesto</Label>
                <Input
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  placeholder='Ej: "Odontóloga/o para consultorio con cartera — turno tarde"'
                />
                {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
              </div>

              {/* Consultorio */}
              <div>
                <Label>Nombre del consultorio o institución</Label>
                <Input
                  value={form.clinic}
                  onChange={(e) => set('clinic', e.target.value)}
                  placeholder='Ej: "Clínica Dental Belgrano"'
                  disabled={form.anonymous}
                />
                <label className="flex items-center gap-2 mt-2 cursor-pointer w-fit">
                  <input
                    type="checkbox"
                    checked={form.anonymous}
                    onChange={(e) => set('anonymous', e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-slate-500">Publicar de forma anónima</span>
                </label>
              </div>

              {/* Modalidad */}
              <div>
                <Label required>Modalidad</Label>
                <div className="flex gap-2">
                  {MODALITIES.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => set('modality', m.value)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold transition ${
                        form.modality === m.value
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">{m.icon}</span>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Especialidad */}
              <div>
                <Label>Especialidad requerida</Label>
                <Select value={form.specialty} onChange={(e) => set('specialty', e.target.value)}>
                  {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>

              {/* Ubicación */}
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
                  <Label required>Ciudad</Label>
                  <Input
                    value={form.city}
                    onChange={(e) => set('city', e.target.value)}
                    placeholder='Ej: "Buenos Aires"'
                  />
                  {errors.city && <p className="text-xs text-rose-500 mt-1">{errors.city}</p>}
                </div>
              </div>

              {/* Descripción */}
              <div>
                <Label required>Descripción de la oferta</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Describí el puesto: horarios, ambiente de trabajo, tipo de pacientes, equipamiento disponible, posibilidades de crecimiento..."
                  rows={4}
                />
                {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
              </div>

              {/* Requisitos */}
              <div>
                <Label>Requisitos</Label>
                <div className="space-y-2">
                  {form.requirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-emerald-400 shrink-0">check_circle</span>
                      <Input
                        value={req}
                        onChange={(e) => setReq(i, e.target.value)}
                        placeholder={`Requisito ${i + 1}`}
                        className="flex-1"
                      />
                      {form.requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeReq(i)}
                          className="shrink-0 size-8 rounded-lg hover:bg-rose-50 text-slate-300 hover:text-rose-400 flex items-center justify-center transition"
                        >
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addReq}
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition mt-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_circle</span>
                    Agregar requisito
                  </button>
                </div>
              </div>

              {/* Remuneración */}
              <div>
                <Label>Remuneración</Label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => set('is_paid', true)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition ${
                      form.is_paid
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px] align-middle mr-1">payments</span>
                    Remunerado
                  </button>
                  <button
                    type="button"
                    onClick={() => set('is_paid', false)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition ${
                      !form.is_paid
                        ? 'bg-slate-100 border-slate-300 text-slate-700'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px] align-middle mr-1">volunteer_activism</span>
                    Ad honorem / Beca
                  </button>
                </div>
                {form.is_paid && (
                  <Input
                    value={form.salary_range}
                    onChange={(e) => set('salary_range', e.target.value)}
                    placeholder='Ej: "USD 800–1.200/mes" o "A convenir" o "% de producción"'
                  />
                )}
              </div>

              {/* Contacto */}
              <div>
                <Label required>Email o link de contacto</Label>
                <Input
                  value={form.contact}
                  onChange={(e) => set('contact', e.target.value)}
                  placeholder="tuconsultorio@email.com o https://..."
                />
                {errors.contact && <p className="text-xs text-rose-500 mt-1">{errors.contact}</p>}
                <p className="text-[11px] text-slate-400 mt-1">
                  Los interesados se contactarán directamente. No publicamos tu email en texto plano.
                </p>
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
                  className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition"
                >
                  <span className="material-symbols-outlined text-[18px]">work</span>
                  Publicar oferta
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
