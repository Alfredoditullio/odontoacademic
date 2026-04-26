'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createJob, type CreateJobInput } from '@/lib/actions/events-jobs';

const JOB_TYPES: { value: CreateJobInput['job_type']; label: string }[] = [
  { value: 'empleado',      label: 'Empleado/a' },
  { value: 'socio',         label: 'Socio/a' },
  { value: 'guardia',       label: 'Guardia' },
  { value: 'reemplazo',     label: 'Reemplazo' },
  { value: 'docente',       label: 'Docente' },
  { value: 'investigacion', label: 'Investigación' },
];

const MODALITIES: { value: CreateJobInput['modality']; label: string }[] = [
  { value: 'presencial', label: 'Presencial' },
  { value: 'hibrido',    label: 'Híbrido' },
  { value: 'remoto',     label: 'Remoto' },
];

export default function NewJobPage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [clinic, setClinic] = useState('');
  const [jobType, setJobType] = useState<CreateJobInput['job_type']>('empleado');
  const [modality, setModality] = useState<CreateJobInput['modality']>('presencial');
  const [specialty, setSpecialty] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState(''); // separado por enter
  const [contact, setContact] = useState('');
  const [isPaid, setIsPaid] = useState(true);
  const [salaryRange, setSalaryRange] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const reqsArray = requirements.split('\n').map((r) => r.trim()).filter(Boolean);

    startTransition(async () => {
      const res = await createJob({
        title, clinic: clinic || null,
        job_type: jobType, modality,
        specialty: specialty || null,
        city, country, description,
        requirements: reqsArray, contact,
        is_paid: isPaid,
        salary_range: isPaid ? (salaryRange || null) : null,
      });
      if (!res.ok) { setError(res.error); return; }
      router.push(`/comunidad/trabajo/${res.data.id}`);
    });
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-900">Publicar oferta laboral</h1>
          <Link href="/comunidad/trabajo" className="text-sm text-slate-500 hover:text-slate-800">Cancelar</Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Título *">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} required className={inputClass} placeholder="Ej. Odontólogo general full-time" />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Tipo *">
              <select value={jobType} onChange={(e) => setJobType(e.target.value as CreateJobInput['job_type'])} className={inputClass}>
                {JOB_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
            <Field label="Modalidad *">
              <select value={modality} onChange={(e) => setModality(e.target.value as CreateJobInput['modality'])} className={inputClass}>
                {MODALITIES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Clínica / Empresa">
            <input type="text" value={clinic} onChange={(e) => setClinic(e.target.value)} className={inputClass} placeholder="Nombre de la clínica (opcional)" />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="País *">
              <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required className={inputClass} placeholder="Argentina" />
            </Field>
            <Field label="Ciudad *">
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required className={inputClass} placeholder="Buenos Aires" />
            </Field>
            <Field label="Especialidad">
              <input type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)} className={inputClass} placeholder="Ortodoncia" />
            </Field>
          </div>

          <Field label="Descripción del puesto *">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} maxLength={5000} required className={inputClass + ' resize-y'} placeholder="Tareas, horarios, ambiente de trabajo…" />
          </Field>

          <Field label="Requisitos (uno por línea)">
            <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={3} className={inputClass + ' resize-y'} placeholder="Matrícula vigente&#10;3+ años de experiencia&#10;Manejo de inglés" />
          </Field>

          <Field label="Contacto *">
            <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} required className={inputClass} placeholder="rh@clinica.com / WhatsApp +54 911…" />
          </Field>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isPaid} onChange={(e) => setIsPaid(e.target.checked)} />
              <span className="font-semibold text-slate-700">Es remunerado</span>
            </label>
            {isPaid && (
              <input type="text" value={salaryRange} onChange={(e) => setSalaryRange(e.target.value)} placeholder="USD 2000-3000 / ARS 1.5-2M" className={inputClass + ' max-w-[280px]'} />
            )}
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">{error}</div>}

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button type="submit" disabled={pending} className="bg-primary text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition disabled:opacity-50 inline-flex items-center gap-2">
              {pending && <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>}
              {pending ? 'Publicando…' : 'Publicar oferta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClass = 'w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">{label}</label>
      {children}
    </div>
  );
}
