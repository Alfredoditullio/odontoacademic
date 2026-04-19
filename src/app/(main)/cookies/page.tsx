import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Información sobre el uso de cookies y tecnologías de seguimiento en OdontoLatam.',
};

const LAST_UPDATED = '1 de abril de 2026';

const COOKIE_TABLE = [
  {
    name: 'session_token',
    type: 'Esencial',
    duration: 'Sesión',
    purpose: 'Mantiene tu sesión iniciada en la plataforma.',
    canDisable: false,
  },
  {
    name: 'csrf_token',
    type: 'Esencial',
    duration: 'Sesión',
    purpose: 'Protege contra ataques de falsificación de solicitudes entre sitios.',
    canDisable: false,
  },
  {
    name: 'ol_preferences',
    type: 'Funcional',
    duration: '1 año',
    purpose: 'Guarda tus preferencias de idioma, tema y configuración de la plataforma.',
    canDisable: true,
  },
  {
    name: 'ol_newsletter_dismissed',
    type: 'Funcional',
    duration: '30 días',
    purpose: 'Recuerda si cerraste el popup de newsletter para no mostrarlo nuevamente.',
    canDisable: true,
  },
  {
    name: '_ga, _ga_*',
    type: 'Analítica',
    duration: '2 años',
    purpose: 'Google Analytics: mide el tráfico y comportamiento de los usuarios de forma anónima y agregada.',
    canDisable: true,
  },
  {
    name: '_fbp',
    type: 'Marketing',
    duration: '3 meses',
    purpose: 'Facebook Pixel: permite medir la efectividad de campañas publicitarias.',
    canDisable: true,
  },
];

export default function CookiesPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-[32px] text-slate-300">cookie</span>
            <h1 className="text-3xl font-extrabold">Política de Cookies</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">Última actualización: {LAST_UPDATED}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Intro */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800">
            Esta política explica qué son las cookies, qué cookies utiliza OdontoLatam, para qué las usamos y cómo podés gestionarlas o desactivarlas.
          </div>

          {/* ¿Qué son? */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">¿Qué son las cookies?</h2>
            <div className="text-sm text-slate-600 leading-relaxed space-y-3">
              <p>Las cookies son pequeños archivos de texto que un sitio web almacena en tu dispositivo (computadora, tablet, teléfono) cuando lo visitás. Sirven para recordar información sobre tu visita, lo que hace que la experiencia sea más eficiente y personalizada.</p>
              <p>Además de cookies, podemos usar tecnologías similares como <strong>localStorage</strong>, <strong>sessionStorage</strong> o <strong>pixels</strong> de seguimiento, que funcionan de manera análoga.</p>
            </div>
          </div>

          {/* Tipos */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Tipos de cookies que utilizamos</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {[
                { type: 'Esenciales', icon: 'lock', color: 'border-slate-200 bg-slate-50', desc: 'Necesarias para el funcionamiento básico del sitio. No pueden desactivarse.', badge: 'bg-slate-200 text-slate-700' },
                { type: 'Funcionales', icon: 'tune', color: 'border-sky-100 bg-sky-50', desc: 'Recuerdan tus preferencias para mejorar tu experiencia.', badge: 'bg-sky-100 text-sky-700' },
                { type: 'Analítica', icon: 'bar_chart', color: 'border-violet-100 bg-violet-50', desc: 'Nos ayudan a entender cómo se usa la plataforma (datos anonimizados).', badge: 'bg-violet-100 text-violet-700' },
                { type: 'Marketing', icon: 'campaign', color: 'border-orange-100 bg-orange-50', desc: 'Permiten mostrar publicidad relevante y medir campañas.', badge: 'bg-orange-100 text-orange-700' },
              ].map((t) => (
                <div key={t.type} className={`rounded-xl border p-4 ${t.color}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[18px] text-slate-600">{t.icon}</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${t.badge}`}>{t.type}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Table */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Listado de cookies</h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Cookie</th>
                    <th className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Tipo</th>
                    <th className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Duración</th>
                    <th className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Finalidad</th>
                    <th className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Opcional</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {COOKIE_TABLE.map((c) => (
                    <tr key={c.name} className="bg-white hover:bg-slate-50 transition">
                      <td className="px-4 py-3 font-mono text-xs text-slate-700 font-semibold">{c.name}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.type === 'Esencial' ? 'bg-slate-100 text-slate-700' :
                          c.type === 'Funcional' ? 'bg-sky-100 text-sky-700' :
                          c.type === 'Analítica' ? 'bg-violet-100 text-violet-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>{c.type}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{c.duration}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{c.purpose}</td>
                      <td className="px-4 py-3 text-center">
                        {c.canDisable
                          ? <span className="material-symbols-outlined text-[18px] text-emerald-500">check_circle</span>
                          : <span className="material-symbols-outlined text-[18px] text-slate-300">remove_circle</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cómo gestionar */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">¿Cómo gestionar las cookies?</h2>
            <div className="text-sm text-slate-600 leading-relaxed space-y-3">
              <p>Podés gestionar o deshabilitar las cookies opcionales de las siguientes formas:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Panel de preferencias:</strong> (próximamente) podrás configurar tus preferencias desde el banner de cookies al acceder al sitio.</li>
                <li><strong>Navegador:</strong> podés configurar tu navegador para bloquear o eliminar cookies. Ten en cuenta que esto puede afectar la funcionalidad del sitio.</li>
                <li><strong>Google Analytics:</strong> podés optar por no participar instalando el{' '}
                  <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">complemento de inhabilitación de Google Analytics</a>.</li>
              </ul>
              <p className="text-xs text-slate-400">Instrucciones por navegador: <a href="https://support.google.com/chrome/answer/95647" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Chrome</a> · <a href="https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Firefox</a> · <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Safari</a></p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
            <Link href="/privacidad" className="text-sm text-primary hover:underline font-semibold">Política de Privacidad →</Link>
            <Link href="/terminos" className="text-sm text-primary hover:underline font-semibold">Términos y Condiciones →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
