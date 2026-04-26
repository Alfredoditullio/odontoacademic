'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createEvent, type CreateEventInput } from '@/lib/actions/events-jobs';

const EVENT_TYPES: { value: CreateEventInput['event_type']; label: string }[] = [
  { value: 'webinar',  label: 'Webinar' },
  { value: 'congress', label: 'Congreso' },
  { value: 'course',   label: 'Curso' },
  { value: 'workshop', label: 'Taller' },
  { value: 'meetup',   label: 'Meetup' },
  { value: 'fair',     label: 'Feria' },
];

const REGIONS: CreateEventInput['region'][] = ['Online', 'LATAM', 'España', 'Europa', 'Norteamérica', 'Asia'];

export default function NewEventPage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState<CreateEventInput['event_type']>('webinar');
  const [region, setRegion] = useState<CreateEventInput['region']>('Online');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [eventUrl, setEventUrl] = useState('');
  const [registrationUrl, setRegistrationUrl] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!startsAt) { setError('La fecha de inicio es obligatoria'); return; }

    startTransition(async () => {
      const res = await createEvent({
        title, description: description || null, event_type: eventType, region,
        country: country || null, city: city || null, specialty: specialty || null,
        starts_at: new Date(startsAt).toISOString(),
        ends_at: endsAt ? new Date(endsAt).toISOString() : null,
        event_url: eventUrl || null, registration_url: registrationUrl || null,
        is_free: isFree, price: !isFree ? price || null : null,
      });
      if (!res.ok) { setError(res.error); return; }
      router.push(`/comunidad/eventos/${res.data.id}`);
    });
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-900">Publicar evento</h1>
          <Link href="/comunidad/eventos" className="text-sm text-slate-500 hover:text-slate-800">Cancelar</Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Título *">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} required className={inputClass} placeholder="Ej. Webinar de Implantología 2026" />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Tipo *">
              <select value={eventType} onChange={(e) => setEventType(e.target.value as CreateEventInput['event_type'])} className={inputClass}>
                {EVENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
            <Field label="Región *">
              <select value={region} onChange={(e) => setRegion(e.target.value as CreateEventInput['region'])} className={inputClass}>
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Inicio *">
              <input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} required className={inputClass} />
            </Field>
            <Field label="Fin (opcional)">
              <input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} className={inputClass} />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="País">
              <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass} placeholder="Argentina" />
            </Field>
            <Field label="Ciudad">
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} placeholder="Buenos Aires" />
            </Field>
            <Field label="Especialidad">
              <input type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)} className={inputClass} placeholder="Implantología" />
            </Field>
          </div>

          <Field label="Descripción">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} maxLength={5000} className={inputClass + ' resize-y'} placeholder="¿De qué trata el evento?" />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="URL del evento">
              <input type="url" value={eventUrl} onChange={(e) => setEventUrl(e.target.value)} className={inputClass} placeholder="https://…" />
            </Field>
            <Field label="URL de inscripción">
              <input type="url" value={registrationUrl} onChange={(e) => setRegistrationUrl(e.target.value)} className={inputClass} placeholder="https://…" />
            </Field>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} />
              <span className="font-semibold text-slate-700">Es gratuito</span>
            </label>
            {!isFree && (
              <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="USD 50, ARS 5000…" className={inputClass + ' max-w-[200px]'} />
            )}
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">{error}</div>}

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button type="submit" disabled={pending} className="bg-primary text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition disabled:opacity-50 inline-flex items-center gap-2">
              {pending && <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>}
              {pending ? 'Publicando…' : 'Publicar evento'}
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
