import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad y tratamiento de datos personales de OdontoLatam.',
};

const LAST_UPDATED = '1 de abril de 2026';

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-8">
      <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">{title}</h2>
      <div className="space-y-3 text-sm text-slate-600 leading-relaxed">{children}</div>
    </section>
  );
}

const TOC = [
  { id: 'responsable',   label: '1. Responsable del tratamiento' },
  { id: 'datos',         label: '2. Datos que recopilamos' },
  { id: 'finalidades',   label: '3. Finalidades del tratamiento' },
  { id: 'base-legal',    label: '4. Base legal' },
  { id: 'destinatarios', label: '5. Destinatarios y transferencias' },
  { id: 'conservacion',  label: '6. Plazo de conservación' },
  { id: 'derechos',      label: '7. Tus derechos' },
  { id: 'menores',       label: '8. Menores de edad' },
  { id: 'cookies',       label: '9. Cookies' },
  { id: 'cambios',       label: '10. Cambios en esta política' },
  { id: 'contacto',      label: '11. Contacto' },
];

export default function PrivacidadPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-[32px] text-slate-300">shield</span>
            <h1 className="text-3xl font-extrabold">Política de Privacidad</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">Última actualización: {LAST_UPDATED}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

            {/* TOC sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sticky top-6">
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Contenido</p>
                <nav className="space-y-1">
                  {TOC.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-xs text-slate-600 hover:text-primary py-1 hover:underline leading-tight"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Content */}
            <div className="lg:col-span-3 space-y-8">

              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 text-sm text-sky-800">
                En <strong>OdontoLatam</strong> nos comprometemos a proteger tu privacidad y a tratar tus datos personales de manera transparente, segura y conforme a la legislación aplicable, incluyendo la Ley 25.326 (Argentina), la Ley Federal de Protección de Datos Personales (México), la LGPD (Brasil) y el RGPD europeo cuando corresponda.
              </div>

              <Section id="responsable" title="1. Responsable del tratamiento">
                <p><strong>Razón social:</strong> OdontoLatam S.A.S. (en trámite de constitución)</p>
                <p><strong>Domicilio:</strong> Buenos Aires, Argentina</p>
                <p><strong>Correo electrónico:</strong> privacidad@odontolatam.com</p>
                <p><strong>Sitio web:</strong> www.odontolatam.com</p>
              </Section>

              <Section id="datos" title="2. Datos que recopilamos">
                <p><strong>Datos que nos proporcionás directamente:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Nombre y apellido, dirección de correo electrónico, contraseña (hasheada)</li>
                  <li>Número de matrícula o registro profesional (opcional)</li>
                  <li>Especialidad, país, ciudad y fotografía de perfil</li>
                  <li>Contenido que publicás en la comunidad (posts, comentarios, mensajes privados)</li>
                  <li>Datos de suscripción al newsletter</li>
                </ul>
                <p><strong>Datos que recopilamos automáticamente:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Dirección IP y datos de geolocalización aproximada</li>
                  <li>Tipo de dispositivo, sistema operativo y navegador</li>
                  <li>Páginas visitadas, tiempo de permanencia y acciones dentro de la plataforma</li>
                  <li>Cookies y tecnologías similares (ver sección 9)</li>
                </ul>
                <p><strong>Datos de terceros:</strong> Si te registrás con Google o LinkedIn, recibimos nombre, email y foto de perfil conforme a los permisos que otorgás.</p>
              </Section>

              <Section id="finalidades" title="3. Finalidades del tratamiento">
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li>Gestionar tu cuenta y permitirte acceder a los servicios de la plataforma</li>
                  <li>Facilitar la interacción con la comunidad de profesionales</li>
                  <li>Enviar comunicaciones transaccionales (confirmaciones, notificaciones de actividad)</li>
                  <li>Enviar el newsletter y comunicaciones de marketing si diste tu consentimiento</li>
                  <li>Mejorar la plataforma mediante análisis estadístico agregado y anónimo</li>
                  <li>Prevenir fraudes, abusos y garantizar la seguridad</li>
                  <li>Cumplir con obligaciones legales aplicables</li>
                </ul>
              </Section>

              <Section id="base-legal" title="4. Base legal del tratamiento">
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li><strong>Ejecución de contrato:</strong> para prestarte el servicio de la plataforma</li>
                  <li><strong>Consentimiento:</strong> para comunicaciones de marketing y cookies no esenciales</li>
                  <li><strong>Interés legítimo:</strong> para análisis estadísticos, seguridad y mejora del servicio</li>
                  <li><strong>Obligación legal:</strong> cuando la ley nos exige conservar ciertos datos</li>
                </ul>
              </Section>

              <Section id="destinatarios" title="5. Destinatarios y transferencias internacionales">
                <p>Podemos compartir tus datos con los siguientes terceros, siempre bajo acuerdos de confidencialidad:</p>
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li><strong>Proveedores de infraestructura:</strong> Supabase (base de datos), Vercel (hosting), Cloudflare (CDN)</li>
                  <li><strong>Analítica:</strong> herramientas de análisis de uso de la plataforma (datos anonimizados)</li>
                  <li><strong>Email marketing:</strong> plataforma de envío de newsletters (solo nombre y email)</li>
                  <li><strong>Procesadores de pago:</strong> para transacciones en la tienda</li>
                </ul>
                <p>No vendemos ni alquilamos tus datos personales a terceros con fines comerciales.</p>
              </Section>

              <Section id="conservacion" title="6. Plazo de conservación">
                <p>Conservamos tus datos mientras mantengas tu cuenta activa y durante los plazos mínimos exigidos por la legislación aplicable:</p>
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li>Datos de cuenta: mientras la cuenta esté activa + 3 años tras su eliminación</li>
                  <li>Publicaciones en la comunidad: se disocian de tu identidad al eliminar la cuenta</li>
                  <li>Datos de facturación: 10 años (obligación fiscal)</li>
                  <li>Logs de acceso: 12 meses</li>
                </ul>
              </Section>

              <Section id="derechos" title="7. Tus derechos">
                <p>Podés ejercer los siguientes derechos enviando un email a <strong>privacidad@odontolatam.com</strong>:</p>
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li><strong>Acceso:</strong> conocer qué datos tenemos sobre vos</li>
                  <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos</li>
                  <li><strong>Supresión:</strong> eliminar tus datos cuando ya no sean necesarios</li>
                  <li><strong>Oposición:</strong> oponerte al tratamiento para fines de marketing</li>
                  <li><strong>Limitación:</strong> restringir el tratamiento en ciertos casos</li>
                  <li><strong>Portabilidad:</strong> recibir tus datos en formato estructurado</li>
                  <li><strong>Retirar el consentimiento:</strong> en cualquier momento, sin afectar tratamientos previos</li>
                </ul>
                <p>Responderemos tu solicitud en un plazo máximo de 30 días hábiles.</p>
              </Section>

              <Section id="menores" title="8. Menores de edad">
                <p>OdontoLatam está dirigido exclusivamente a profesionales y estudiantes de odontología. No recopilamos conscientemente datos de menores de 18 años. Si sos menor de esa edad, no debés registrarte. Si detectamos que un usuario es menor de edad, eliminaremos su cuenta.</p>
              </Section>

              <Section id="cookies" title="9. Cookies">
                <p>Utilizamos cookies y tecnologías similares para mejorar tu experiencia. Podés gestionar tus preferencias en cualquier momento. Para más información, consultá nuestra{' '}
                  <Link href="/cookies" className="text-primary font-semibold hover:underline">Política de Cookies</Link>.
                </p>
              </Section>

              <Section id="cambios" title="10. Cambios en esta política">
                <p>Podemos actualizar esta política periódicamente. Te notificaremos por email o mediante un aviso en la plataforma cuando haya cambios significativos. La fecha de última actualización aparece al inicio del documento.</p>
              </Section>

              <Section id="contacto" title="11. Contacto">
                <p>Para cualquier consulta sobre privacidad o ejercicio de tus derechos:</p>
                <ul className="list-none space-y-1 ml-2">
                  <li>📧 privacidad@odontolatam.com</li>
                  <li>🌐 www.odontolatam.com</li>
                  <li>📍 Buenos Aires, Argentina</li>
                </ul>
              </Section>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                <Link href="/terminos" className="text-sm text-primary hover:underline font-semibold">Términos y Condiciones →</Link>
                <Link href="/cookies" className="text-sm text-primary hover:underline font-semibold">Política de Cookies →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
