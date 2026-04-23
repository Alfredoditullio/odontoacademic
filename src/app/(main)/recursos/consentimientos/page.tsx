import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Consentimientos Informados | OdontoLatam',
  description: 'Modelos de consentimientos informados para los procedimientos más comunes en odontología. Descargá gratis y adaptá a tu práctica clínica.',
};

const CONSENTIMIENTOS = [
  {
    filename: 'extraccion.pdf',
    title: 'Extracción Dental',
    icon: 'medical_services',
    gradient: 'from-red-500 to-rose-600',
    badge: 'bg-red-100 text-red-700',
    category: 'Cirugía Oral',
    pages: 2,
    size: '138 KB',
    desc: 'Incluye riesgos específicos (trismus, alveolitis, hemorragia), indicaciones postoperatorias detalladas, medicación pre y postquirúrgica, y bloque de firma dual.',
    highlights: ['Riesgos personalizados', 'Indicaciones postop', 'Medicación pre/post'],
  },
  {
    filename: 'implantes.pdf',
    title: 'Implantes Dentales',
    icon: 'hardware',
    gradient: 'from-sky-500 to-blue-600',
    badge: 'bg-sky-100 text-sky-700',
    category: 'Implantología',
    pages: 2,
    size: '188 KB',
    desc: 'Procedimiento quirúrgico, oseointegración, riesgos de falla, instrucciones de higiene, compromisos del paciente y autorización para modificaciones en diseño o materiales.',
    highlights: ['Falla de implante', 'Alternativas protéticas', 'Compromisos del paciente'],
  },
  {
    filename: 'ortopedia.pdf',
    title: 'Ortopedia / Ortodoncia',
    icon: 'straighten',
    gradient: 'from-indigo-500 to-violet-600',
    badge: 'bg-indigo-100 text-indigo-700',
    category: 'Ortopedia',
    pages: 2,
    size: '77 KB',
    desc: 'Diagnóstico de maloclusión, aparatología removible y fija, fases de tratamiento, higiene, colaboración del paciente. Incluye asentimiento informado pediátrico con campo de firma.',
    highlights: ['Asentimiento pediátrico', 'Fases de tratamiento', 'Autorización para docencia'],
  },
  {
    filename: 'biopsia.pdf',
    title: 'Biopsia Oral',
    icon: 'genetics',
    gradient: 'from-amber-500 to-orange-500',
    badge: 'bg-amber-100 text-amber-700',
    category: 'Cirugía Oral',
    pages: 1,
    size: '80 KB',
    desc: 'Toma de muestra de tejido, objetivo diagnóstico, riesgos del procedimiento, anestesia local y cuidados postoperatorios. Indicado para lesiones de diagnóstico incierto.',
    highlights: ['Objetivo diagnóstico', 'Anestesia local', 'Cuidados postop'],
  },
  {
    filename: 'tratamiento-de-conducto.pdf',
    title: 'Tratamiento de Conducto',
    icon: 'healing',
    gradient: 'from-teal-500 to-emerald-600',
    badge: 'bg-teal-100 text-teal-700',
    category: 'Endodoncia',
    pages: 1,
    size: '113 KB',
    desc: 'Descripción del tratamiento endodóntico, riesgos de fractura de instrumentos, sobreobturación, recidiva y necesidad de retratamiento. Incluye alternativas al tratamiento.',
    highlights: ['Riesgos de fractura', 'Sobreobturación', 'Retratamiento'],
  },
  {
    filename: 'periodoncia.pdf',
    title: 'Periodoncia',
    icon: 'biotech',
    gradient: 'from-emerald-500 to-green-600',
    badge: 'bg-emerald-100 text-emerald-700',
    category: 'Periodoncia',
    pages: 2,
    size: '153 KB',
    desc: 'Tratamientos periodontales quirúrgicos y no quirúrgicos, riesgos de recesión gingival, sensibilidad, mantenimiento periodontal y consecuencias de no tratar la enfermedad.',
    highlights: ['Cirugía periodontal', 'Recesión gingival', 'Plan de mantenimiento'],
  },
  {
    filename: 'protesis-fija.pdf',
    title: 'Prótesis Fija',
    icon: 'favorite',
    gradient: 'from-pink-500 to-rose-500',
    badge: 'bg-pink-100 text-pink-700',
    category: 'Prótesis',
    pages: 1,
    size: '78 KB',
    desc: 'Coronas, puentes y carillas: preparación dentaria, provisorios, riesgo de sensibilidad, colorimetría, ajuste de oclusión y cuidados con la prótesis definitiva.',
    highlights: ['Preparación dentaria', 'Colorimetría', 'Cuidados de la prótesis'],
  },
  {
    filename: 'protesis-completa.pdf',
    title: 'Prótesis Completa',
    icon: 'sentiment_satisfied',
    gradient: 'from-violet-500 to-purple-600',
    badge: 'bg-violet-100 text-violet-700',
    category: 'Prótesis',
    pages: 2,
    size: '252 KB',
    desc: 'Rehabilitación total, etapas del tratamiento, período de adaptación, reabsorción ósea progresiva, ajustes necesarios, mantenimiento y expectativa de vida de la prótesis.',
    highlights: ['Período de adaptación', 'Reabsorción ósea', 'Mantenimiento'],
  },
  {
    filename: 'protesis-parcial-removible.pdf',
    title: 'Prótesis Parcial Removible',
    icon: 'settings_accessibility',
    gradient: 'from-purple-500 to-indigo-600',
    badge: 'bg-purple-100 text-purple-700',
    category: 'Prótesis',
    pages: 1,
    size: '114 KB',
    desc: 'Esquelético o acrílico, apoyos y ganchos, higiene de la prótesis y los dientes remanentes, riesgos de fractura, necesidad de ajustes y controles periódicos.',
    highlights: ['Tipo de prótesis', 'Higiene específica', 'Controles periódicos'],
  },
  {
    filename: 'odontopediatria.pdf',
    title: 'Odontopediatría',
    icon: 'child_care',
    gradient: 'from-cyan-500 to-sky-600',
    badge: 'bg-cyan-100 text-cyan-700',
    category: 'Odontopediatría',
    pages: 3,
    size: '331 KB',
    desc: 'Tratamientos en niños, firma por representante legal, riesgos de anestesia en pacientes pediátricos, comportamiento y cooperación, selladores, pulpotomías y extracciones.',
    highlights: ['Firma por tutor legal', 'Anestesia pediátrica', 'Pulpotomías'],
  },
  {
    filename: 'toma-de-imagenes.pdf',
    title: 'Toma de Imágenes (≥60 años)',
    icon: 'radiology',
    gradient: 'from-slate-500 to-slate-700',
    badge: 'bg-slate-100 text-slate-700',
    category: 'Radiología',
    pages: 2,
    size: '190 KB',
    desc: 'Consentimiento específico para estudios radiológicos en pacientes mayores de 60 años. Incluye exposición a radiación, dosis, alternativas y justificación del estudio.',
    highlights: ['Dosis de radiación', 'Paciente mayor de 60', 'Justificación diagnóstica'],
  },
];

const COMPLEMENTARIOS = [
  {
    filename: 'historia-clinica-ortodoncia.pdf',
    title: 'Historia Clínica — Módulo Ortodoncia',
    icon: 'description',
    size: '795 KB',
    desc: 'Formulario completo de historia clínica para pacientes de ortodoncia. Incluye anamnesis, fotografías, modelos y planificación de tratamiento.',
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  'Cirugía Oral':    'text-red-600    bg-red-50    border-red-200',
  'Implantología':   'text-sky-700    bg-sky-50    border-sky-200',
  'Ortopedia':       'text-indigo-700 bg-indigo-50 border-indigo-200',
  'Endodoncia':      'text-teal-700   bg-teal-50   border-teal-200',
  'Periodoncia':     'text-emerald-700 bg-emerald-50 border-emerald-200',
  'Prótesis':        'text-violet-700 bg-violet-50 border-violet-200',
  'Odontopediatría': 'text-cyan-700   bg-cyan-50   border-cyan-200',
  'Radiología':      'text-slate-700  bg-slate-50  border-slate-200',
};

export default function ConsentimientosPage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-white mb-6">
              <span className="material-symbols-outlined text-[16px]">download</span>
              Descarga gratuita · Sin registro
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
              Consentimientos Informados
            </h1>
            <p className="text-lg text-white/85 leading-relaxed max-w-2xl">
              Modelos listos para usar en los procedimientos más comunes de la práctica odontológica. Redactados en castellano neutro, adaptables a cualquier país de Latinoamérica.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              {['11 documentos', 'PDF imprimible', 'Actualizado 2024'].map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/90 text-xs font-semibold px-3 py-1.5 rounded-full">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Aviso legal ─── */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-start gap-3">
          <span className="material-symbols-outlined text-amber-500 text-[20px] shrink-0 mt-0.5">info</span>
          <p className="text-xs text-amber-700 leading-relaxed">
            <strong>Aviso legal:</strong> Estos modelos son plantillas orientativas. Cada profesional es responsable de adaptarlos a la legislación vigente en su país y a las circunstancias particulares de cada paciente. En Argentina, el consentimiento informado está regulado por la <strong>Ley 26.529</strong> de Derechos del Paciente.
          </p>
        </div>
      </div>

      {/* ─── Catálogo ─── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Consentimientos disponibles</h2>
              <p className="text-slate-500 text-sm mt-1">Hacé click en <strong>Descargar</strong> para guardar el PDF o en <strong>Ver</strong> para previsualizarlo.</p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold bg-violet-100 text-violet-700 border border-violet-200 px-3 py-1.5 rounded-full">
              <span className="material-symbols-outlined text-[14px]">description</span>
              {CONSENTIMIENTOS.length} documentos
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {CONSENTIMIENTOS.map((c) => (
              <div key={c.filename} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col overflow-hidden">

                {/* Card header */}
                <div className={`bg-gradient-to-br ${c.gradient} px-5 pt-5 pb-6`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="size-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[26px]">{c.icon}</span>
                    </div>
                    <span className="text-[10px] font-black bg-white/20 text-white border border-white/25 px-2.5 py-1 rounded-full uppercase tracking-wide shrink-0">
                      {c.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white mt-4 leading-tight">{c.title}</h3>
                </div>

                {/* Card body */}
                <div className="flex-1 p-5">
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{c.desc}</p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {c.highlights.map((h) => (
                      <span key={h} className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-[11px] text-slate-400">check</span>
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium border-t border-slate-100 pt-3">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">article</span>
                      {c.pages} {c.pages === 1 ? 'página' : 'páginas'}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">folder</span>
                      {c.size}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">picture_as_pdf</span>
                      PDF
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-5 pb-5 flex gap-2">
                  <a
                    href={`/consentimientos/${c.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800 px-4 py-2.5 rounded-xl text-sm font-semibold transition"
                  >
                    <span className="material-symbols-outlined text-[17px]">visibility</span>
                    Ver
                  </a>
                  <a
                    href={`/consentimientos/${c.filename}`}
                    download
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 bg-gradient-to-r ${c.gradient} text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition shadow-sm`}
                  >
                    <span className="material-symbols-outlined text-[17px]">download</span>
                    Descargar
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Formularios complementarios ─── */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-extrabold text-slate-800 mb-1">Formularios complementarios</h2>
          <p className="text-sm text-slate-500 mb-6">Documentos clínicos que acompañan al proceso de consentimiento.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMPLEMENTARIOS.map((doc) => (
              <div key={doc.filename} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-4">
                <div className="size-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-violet-600 text-[20px]">{doc.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 leading-tight">{doc.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{doc.desc}</p>
                  <div className="flex gap-2 mt-3">
                    <a
                      href={`/consentimientos/${doc.filename}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition"
                    >
                      <span className="material-symbols-outlined text-[14px]">visibility</span>
                      Ver
                    </a>
                    <a
                      href={`/consentimientos/${doc.filename}`}
                      download
                      className="text-xs font-bold text-violet-600 hover:text-violet-800 flex items-center gap-1 transition"
                    >
                      <span className="material-symbols-outlined text-[14px]">download</span>
                      Descargar · {doc.size}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ¿Necesitás más? CTA DentalCore ─── */}
      <section className="py-12 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="size-14 rounded-2xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-violet-300 text-[30px]">draw</span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-extrabold text-white mb-1">¿Necesitás consentimientos con firma digital?</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                DentalCore incluye consentimientos personalizables con firma digital del paciente desde el celular, historial de versiones y cumplimiento normativo para Argentina y LATAM.
              </p>
            </div>
            <a
              href="https://dentalcore.app"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition shadow-lg shadow-violet-500/20 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              Conocer DentalCore
            </a>
          </div>
        </div>
      </section>

      {/* ─── Nav ─── */}
      <div className="bg-white border-t border-slate-100 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/recursos" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-primary transition">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Volver a Recursos
          </Link>
        </div>
      </div>
    </>
  );
}
