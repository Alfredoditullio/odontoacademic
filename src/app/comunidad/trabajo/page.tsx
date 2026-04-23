'use client';

import { useState, useMemo } from 'react';
import { CreateJobModal } from '@/components/comunidad/CreateJobModal';
import type { JobListing, JobType, JobModality } from '@/lib/types';

const TYPE_CONFIG: Record<JobType, { label: string; icon: string; color: string; bg: string }> = {
  empleado:      { label: 'Empleado/a',      icon: 'badge',          color: 'text-sky-700',     bg: 'bg-sky-50 border-sky-200' },
  socio:         { label: 'Socio/a',         icon: 'handshake',      color: 'text-violet-700',  bg: 'bg-violet-50 border-violet-200' },
  guardia:       { label: 'Guardia',         icon: 'emergency',      color: 'text-rose-700',    bg: 'bg-rose-50 border-rose-200' },
  reemplazo:     { label: 'Reemplazo',       icon: 'swap_horiz',     color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
  docente:       { label: 'Docente',         icon: 'school',         color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  investigacion: { label: 'Investigación',   icon: 'science',        color: 'text-indigo-700',  bg: 'bg-indigo-50 border-indigo-200' },
};

const MODALITY_CONFIG: Record<JobModality, { label: string; icon: string }> = {
  presencial: { label: 'Presencial', icon: 'location_on' },
  hibrido:    { label: 'Híbrido',    icon: 'sync_alt' },
  remoto:     { label: 'Remoto',     icon: 'wifi' },
};

const MOCK_JOBS: JobListing[] = [
  {
    id: 'j-001',
    title: 'Odontóloga/o general para consultorio con cartera de pacientes',
    clinic: 'Consultorio Dental Belgrano',
    type: 'empleado',
    modality: 'presencial',
    specialty: 'Odontología General',
    city: 'Buenos Aires',
    country: 'Argentina',
    description: 'Consultorio con 20 años de historia en Belgrano busca profesional para sumarse al equipo. Cartera de pacientes activa, turno tarde de lunes a viernes. Excelente ambiente de trabajo y posibilidad de crecimiento.',
    requirements: ['Título habilitante', 'Matrícula nacional', 'Experiencia mínima 2 años', 'Buenas habilidades comunicacionales'],
    contact: 'trabajos@consultorioblegrano.com.ar',
    is_paid: true,
    salary_range: 'A convenir',
    posted_at: '2026-04-18T10:00:00Z',
  },
  {
    id: 'j-002',
    title: 'Especialista en Ortodoncia — Socio/a para incorporarse a clínica',
    clinic: null,
    type: 'socio',
    modality: 'presencial',
    specialty: 'Ortodoncia',
    city: 'Guadalajara',
    country: 'México',
    description: 'Clínica dental consolidada en zona premium de Guadalajara busca especialista en Ortodoncia para incorporación como socio/a. Infraestructura completa, radiología digital, sillón dedicado y asistente. Ideal para quien quiera crecer sin partir de cero.',
    requirements: ['Especialidad en Ortodoncia', 'Mínimo 3 años de práctica clínica', 'Cartera de pacientes propia (deseable)'],
    contact: 'socios@clinicagdl.mx',
    is_paid: true,
    salary_range: 'Participación en honorarios',
    posted_at: '2026-04-15T09:00:00Z',
  },
  {
    id: 'j-003',
    title: 'Odontólogo/a para guardias en clínica de urgencias — turno noche',
    clinic: 'CentroMédico Odonto 24h',
    type: 'guardia',
    modality: 'presencial',
    specialty: 'Urgencias',
    city: 'Bogotá',
    country: 'Colombia',
    description: 'Clínica de urgencias odontológicas 24hs busca profesionales para cubrir guardias nocturnas (22h–06h) de viernes a domingo. Dotación completa de materiales. Pago por guardia. Ideal para recién graduados o quienes quieran ingresos adicionales.',
    requirements: ['Título y tarjeta profesional vigente', 'Disponibilidad fines de semana', 'Manejo de urgencias básicas'],
    contact: 'rrhh@odonto24bogota.co',
    is_paid: true,
    salary_range: 'COP 180.000 por guardia',
    posted_at: '2026-04-20T08:00:00Z',
  },
  {
    id: 'j-004',
    title: 'Reemplazo por licencia de maternidad — 4 meses — Periodoncia',
    clinic: 'Dra. Valentina Ríos',
    type: 'reemplazo',
    modality: 'presencial',
    specialty: 'Periodoncia',
    city: 'Santiago',
    country: 'Chile',
    description: 'Busco colega especialista en Periodoncia para cubrirme durante licencia de maternidad, mayo a agosto 2026. Consultorio equipado en Providencia, Santiago. Pacientes fidelizados, agenda llena. Se traspasa cartera completa con presentación previa.',
    requirements: ['Especialidad en Periodoncia o Endodoncia', 'Disponibilidad desde mayo 2026', 'Referencias'],
    contact: 'vrios.perio@gmail.com',
    is_paid: true,
    salary_range: 'A convenir',
    posted_at: '2026-04-10T12:00:00Z',
  },
  {
    id: 'j-005',
    title: 'Docente de Clínica Integral — Facultad de Odontología',
    clinic: 'Universidad Peruana Cayetano Heredia',
    type: 'docente',
    modality: 'presencial',
    specialty: 'Odontología General',
    city: 'Lima',
    country: 'Perú',
    description: 'La Facultad de Estomatología de la UPCH convoca a profesionales con experiencia clínica y vocación docente para cubrir horas en la asignatura Clínica Integral del Adulto. Turno mañana, 16 horas semanales. Posibilidad de desarrollo académico.',
    requirements: ['Título de Cirujano Dentista', 'Posgrado o especialización (deseable)', 'Experiencia clínica mínima 3 años', 'Disponibilidad horaria mañana'],
    contact: 'docencia@upch.edu.pe',
    is_paid: true,
    salary_range: 'Según escala docente UPCH',
    posted_at: '2026-04-12T09:00:00Z',
  },
  {
    id: 'j-006',
    title: 'Investigador/a en Biomateriales Dentales — Proyecto FAPESP',
    clinic: 'Universidade de São Paulo — Bauru',
    type: 'investigacion',
    modality: 'presencial',
    specialty: 'Biomateriales',
    city: 'Bauru',
    country: 'Brasil',
    description: 'El Departamento de Materiales Dentales y Prótesis de la FOB-USP convoca a candidatos para proyecto de investigación sobre cementos biocerámicos financiado por FAPESP. Dedicación exclusiva, bolsa de posgrado incluida. Duración 24 meses con posibilidad de extensión.',
    requirements: ['Título de Cirurgião-Dentista', 'Inglés intermedio-avanzado (lectura de papers)', 'Interés en investigación básica y aplicada', 'Disposição para dedicação exclusiva'],
    contact: 'pesquisa.biomateriais@usp.br',
    is_paid: true,
    salary_range: 'Bolsa FAPESP — Mês. R$ 3.500',
    posted_at: '2026-04-08T10:00:00Z',
  },
  {
    id: 'j-007',
    title: 'Odontóloga/o con experiencia en implantes — media jornada',
    clinic: null,
    type: 'empleado',
    modality: 'presencial',
    specialty: 'Implantología',
    city: 'Montevideo',
    country: 'Uruguay',
    description: 'Consultorio privado en Pocitos busca profesional con manejo de implantes para turno mañana (lunes, miércoles y viernes). Equipo joven, ambiente colaborativo, sin jerarquías. Se valora experiencia en rehabilitación implantosoportada.',
    requirements: ['Matrícula habilitante en Uruguay', 'Experiencia comprobable en implantología', 'Buena presencia y habilidades de atención al paciente'],
    contact: 'implantes.mdo@gmail.com',
    is_paid: true,
    salary_range: 'USD 800–1.200 / mes',
    posted_at: '2026-04-19T11:00:00Z',
  },
  {
    id: 'j-008',
    title: 'Especialista en Endodoncia — incorporación inmediata',
    clinic: 'Clínica Dental Miraflores',
    type: 'empleado',
    modality: 'presencial',
    specialty: 'Endodoncia',
    city: 'Lima',
    country: 'Perú',
    description: 'Clínica multidisciplinaria en Miraflores busca endodoncista para incorporación inmediata. Microscopio operatorio disponible, asistente dedicado. Alta demanda de derivaciones internas. Honorarios por producción con base garantizada.',
    requirements: ['Especialidad en Endodoncia', 'Dominio de técnicas rotatorias', 'Manejo de microscopio (deseable)'],
    contact: 'clinicamiraflores.pe@gmail.com',
    is_paid: true,
    salary_range: 'S/ 4.000 base + % producción',
    posted_at: '2026-04-17T14:00:00Z',
  },
];

const ALL_TYPES = ['Todos', 'Empleado/a', 'Socio/a', 'Guardia', 'Reemplazo', 'Docente', 'Investigación'];
const TYPE_MAP: Record<string, JobType[]> = {
  'Empleado/a': ['empleado'], 'Socio/a': ['socio'], 'Guardia': ['guardia'],
  'Reemplazo': ['reemplazo'], 'Docente': ['docente'], 'Investigación': ['investigacion'],
};
const ALL_COUNTRIES = ['Todos', 'Argentina', 'México', 'Colombia', 'Chile', 'Perú', 'Brasil', 'Uruguay'];

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000 / 60 / 60 / 24);
  if (diff === 0) return 'hoy';
  if (diff === 1) return 'ayer';
  return `hace ${diff} días`;
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-bold transition border ${
        active
          ? 'bg-primary text-white border-primary shadow-sm'
          : 'bg-white text-slate-600 border-slate-200 hover:border-primary/40 hover:text-primary'
      }`}
    >
      {children}
    </button>
  );
}

function JobCard({ job }: { job: JobListing }) {
  const [expanded, setExpanded] = useState(false);
  const tc = TYPE_CONFIG[job.type];
  const mc = MODALITY_CONFIG[job.modality];

  return (
    <article className="bg-white rounded-xl border border-slate-200 hover:border-primary/30 hover:shadow-sm transition">
      <div className="p-5">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${tc.bg} ${tc.color}`}>
            <span className="material-symbols-outlined text-[11px]">{tc.icon}</span>
            {tc.label}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
            <span className="material-symbols-outlined text-[11px]">{mc.icon}</span>
            {mc.label}
          </span>
          {job.specialty && (
            <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">
              {job.specialty}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1">{job.title}</h3>

        {/* Location + time */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-3">
          {job.clinic && (
            <span className="flex items-center gap-1 text-slate-500 font-medium">
              <span className="material-symbols-outlined text-[13px]">business</span>
              {job.clinic}
            </span>
          )}
          {!job.clinic && (
            <span className="flex items-center gap-1 text-slate-400 italic">
              <span className="material-symbols-outlined text-[13px]">visibility_off</span>
              Consultorio anónimo
            </span>
          )}
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">location_on</span>
            {job.city}, {job.country}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">schedule</span>
            {timeAgo(job.posted_at)}
          </span>
        </div>

        {/* Description (collapsed) */}
        <p className={`text-xs text-slate-500 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
          {job.description}
        </p>

        {/* Expanded detail */}
        {expanded && (
          <div className="mt-3 space-y-3">
            {job.requirements.length > 0 && (
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Requisitos</p>
                <ul className="space-y-1">
                  {job.requirements.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="material-symbols-outlined text-[13px] text-emerald-500 mt-0.5 shrink-0">check_circle</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {job.salary_range && (
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
                <span className="material-symbols-outlined text-[14px] text-emerald-600">payments</span>
                <span className="text-xs font-semibold text-emerald-700">{job.salary_range}</span>
              </div>
            )}
            <a
              href={job.contact.includes('@') ? `mailto:${job.contact}` : job.contact}
              target={job.contact.includes('@') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary/90 transition"
            >
              <span className="material-symbols-outlined text-[14px]">
                {job.contact.includes('@') ? 'mail' : 'open_in_new'}
              </span>
              {job.contact.includes('@') ? 'Contactar por email' : 'Ver oferta completa'}
            </a>
          </div>
        )}

        {/* Toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 text-[11px] font-bold text-primary hover:underline flex items-center gap-0.5"
        >
          {expanded ? 'Ver menos' : 'Ver detalle y contacto'}
          <span className="material-symbols-outlined text-[14px]">{expanded ? 'expand_less' : 'expand_more'}</span>
        </button>
      </div>
    </article>
  );
}

export default function TrabajoPage() {
  const [typeFilter, setTypeFilter]       = useState('Todos');
  const [countryFilter, setCountryFilter] = useState('Todos');
  const [search, setSearch]               = useState('');
  const [showModal, setShowModal]         = useState(false);
  const [userJobs, setUserJobs]           = useState<JobListing[]>([]);

  const allJobs = useMemo(() => [...userJobs, ...MOCK_JOBS], [userJobs]);

  const filtered = useMemo(() => {
    return allJobs.filter((j) => {
      if (typeFilter !== 'Todos') {
        const allowed = TYPE_MAP[typeFilter] ?? [];
        if (!allowed.includes(j.type)) return false;
      }
      if (countryFilter !== 'Todos' && j.country !== countryFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          j.title.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          (j.specialty ?? '').toLowerCase().includes(q) ||
          j.city.toLowerCase().includes(q) ||
          j.country.toLowerCase().includes(q) ||
          (j.clinic ?? '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allJobs, typeFilter, countryFilter, search]);

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="material-symbols-outlined text-emerald-600 text-[28px]">work</span>
              <h1 className="text-xl font-black text-slate-900">Bolsa de Trabajo</h1>
              <span className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
                {MOCK_JOBS.length} ofertas activas
              </span>
            </div>
            <p className="text-sm text-slate-500 ml-[40px]">
              Empleos, sociedades, guardias y oportunidades académicas para odontólogos de toda Latinoamérica.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="shrink-0 inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Publicar oferta
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por puesto, especialidad, ciudad…"
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Type filter */}
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Tipo</p>
          <div className="flex flex-wrap gap-1.5">
            {ALL_TYPES.map((t) => (
              <Chip key={t} active={typeFilter === t} onClick={() => setTypeFilter(t)}>{t}</Chip>
            ))}
          </div>
        </div>

        {/* Country filter */}
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">País</p>
          <div className="flex flex-wrap gap-1.5">
            {ALL_COUNTRIES.map((c) => (
              <Chip key={c} active={countryFilter === c} onClick={() => setCountryFilter(c)}>{c}</Chip>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-400 pt-1 border-t border-slate-100">
          {filtered.length} oferta{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Job list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 text-center py-14">
          <span className="material-symbols-outlined text-[48px] text-slate-300 block mb-2">work_off</span>
          <p className="font-bold text-slate-600">Sin resultados</p>
          <p className="text-sm text-slate-400 mt-1">Probá con otros filtros</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((j) => <JobCard key={j.id} job={j} />)}
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-2 text-xs text-slate-500">
        <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5 text-slate-400">info</span>
        <p>Las ofertas son publicadas directamente por profesionales y consultorios. OdontoLatam no verifica la veracidad de los avisos ni intermedia en contrataciones. Ante cualquier inconveniente, usá el botón de reporte.</p>
      </div>

      {/* Modal */}
      {showModal && (
        <CreateJobModal
          onClose={() => setShowModal(false)}
          onCreated={(job) => {
            setUserJobs((prev) => [job, ...prev]);
            setShowModal(false);
          }}
        />
      )}

    </div>
  );
}
