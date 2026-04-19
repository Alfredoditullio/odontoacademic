import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description: 'Términos y condiciones de uso de la plataforma OdontoLatam.',
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
  { id: 'objeto',        label: '1. Objeto y aceptación' },
  { id: 'acceso',        label: '2. Acceso y registro' },
  { id: 'uso',           label: '3. Uso aceptable' },
  { id: 'contenido',     label: '4. Contenido del usuario' },
  { id: 'propiedad',     label: '5. Propiedad intelectual' },
  { id: 'tienda',        label: '6. Tienda y transacciones' },
  { id: 'comunidad',     label: '7. Normas de la comunidad' },
  { id: 'disclaimer',    label: '8. Limitación de responsabilidad' },
  { id: 'suspension',    label: '9. Suspensión y baja' },
  { id: 'ley',           label: '10. Ley aplicable' },
  { id: 'contacto',      label: '11. Contacto' },
];

export default function TerminosPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-[32px] text-slate-300">gavel</span>
            <h1 className="text-3xl font-extrabold">Términos y Condiciones</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">Última actualización: {LAST_UPDATED}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

            {/* TOC */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sticky top-6">
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Contenido</p>
                <nav className="space-y-1">
                  {TOC.map((item) => (
                    <a key={item.id} href={`#${item.id}`}
                      className="block text-xs text-slate-600 hover:text-primary py-1 hover:underline leading-tight">
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Content */}
            <div className="lg:col-span-3 space-y-8">

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800">
                Al acceder o usar OdontoLatam, aceptás estos Términos y Condiciones en su totalidad. Si no estás de acuerdo con alguna de sus disposiciones, no debés utilizar la plataforma.
              </div>

              <Section id="objeto" title="1. Objeto y aceptación">
                <p>OdontoLatam (en adelante, "la Plataforma") es un servicio en línea de comunidad profesional, recursos académicos y comercio electrónico destinado a odontólogos, especialistas, estudiantes de odontología y profesionales afines de Latinoamérica.</p>
                <p>El acceso y uso de la Plataforma implica la aceptación plena e incondicional de estos Términos. El uso continuado tras modificaciones publicadas implica la aceptación de las mismas.</p>
              </Section>

              <Section id="acceso" title="2. Acceso y registro">
                <p>El acceso a determinadas funcionalidades requiere registro previo. Al registrarte, declarás que:</p>
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li>Tenés al menos 18 años de edad</li>
                  <li>Sos profesional o estudiante del área odontológica o de la salud</li>
                  <li>Los datos que proporcionás son verídicos, exactos y actualizados</li>
                  <li>Sos responsable de mantener la confidencialidad de tus credenciales de acceso</li>
                  <li>No compartirás tu cuenta con terceros</li>
                </ul>
                <p>Nos reservamos el derecho de verificar la identidad profesional de los usuarios y de rechazar o revocar registros que no cumplan los requisitos.</p>
              </Section>

              <Section id="uso" title="3. Uso aceptable">
                <p>Queda expresamente prohibido:</p>
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li>Usar la Plataforma para fines ilegales o contrarios a estos Términos</li>
                  <li>Publicar contenido falso, engañoso, difamatorio, obsceno o que infrinja derechos de terceros</li>
                  <li>Realizar scraping, robots o acceso automatizado masivo no autorizado</li>
                  <li>Intentar acceder a sistemas, cuentas o datos que no te correspondan</li>
                  <li>Distribuir malware, virus o código malicioso</li>
                  <li>Suplantar la identidad de otra persona u organización</li>
                  <li>Usar la Plataforma para spam o comunicaciones comerciales no solicitadas</li>
                </ul>
              </Section>

              <Section id="contenido" title="4. Contenido del usuario">
                <p>Al publicar contenido (posts, comentarios, imágenes, casos clínicos), otorgás a OdontoLatam una licencia no exclusiva, mundial, libre de regalías para usar, reproducir, modificar y distribuir dicho contenido dentro de la Plataforma con fines operativos y de mejora del servicio.</p>
                <p>Sos el único responsable del contenido que publicás. En particular:</p>
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li>No debés publicar datos personales identificables de pacientes sin su consentimiento expreso</li>
                  <li>Las imágenes clínicas deben anonimizarse conforme a la ética médica y legislación aplicable</li>
                  <li>El contenido académico debe citar las fuentes correspondientes</li>
                  <li>No debés publicar información que pueda constituir consejo médico directo a pacientes no profesionales</li>
                </ul>
              </Section>

              <Section id="propiedad" title="5. Propiedad intelectual">
                <p>Todo el contenido de la Plataforma creado por OdontoLatam (diseño, textos originales, logotipos, software, estructura) está protegido por leyes de propiedad intelectual. Queda prohibida su reproducción total o parcial sin autorización expresa y por escrito.</p>
                <p>El contenido académico de recursos (vademécum, atlas, bibliografía) es de carácter educativo y puede compartirse citando la fuente. No puede ser comercializado.</p>
              </Section>

              <Section id="tienda" title="6. Tienda y transacciones">
                <p>OdontoLatam actúa como intermediario en la Tienda, facilitando la conexión entre compradores y vendedores de productos odontológicos. Las condiciones específicas de cada transacción se detallan en el proceso de compra.</p>
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li>Los precios se expresan en la moneda indicada e incluyen impuestos cuando corresponde</li>
                  <li>Las políticas de devolución se rigen por la legislación de protección al consumidor de cada país</li>
                  <li>OdontoLatam no garantiza la disponibilidad permanente de productos</li>
                </ul>
              </Section>

              <Section id="comunidad" title="7. Normas de la comunidad">
                <p>La comunidad de OdontoLatam se basa en el respeto mutuo y la ética profesional. Además de las restricciones de uso general, en la comunidad queda prohibido:</p>
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li>El acoso, la discriminación o el hostigamiento a otros miembros</li>
                  <li>La publicidad encubierta no declarada como tal</li>
                  <li>La desinformación médica o contenido que contradiga el consenso científico sin fundamento</li>
                  <li>El uso de la plataforma para captación de pacientes de manera engañosa</li>
                </ul>
                <p>Los moderadores podrán eliminar contenido que infrinja estas normas y notificar al usuario.</p>
              </Section>

              <Section id="disclaimer" title="8. Limitación de responsabilidad">
                <p>OdontoLatam no se responsabiliza por:</p>
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li>La exactitud, completitud o actualidad del contenido publicado por usuarios</li>
                  <li>Las decisiones clínicas tomadas con base en información de la Plataforma</li>
                  <li>Interrupciones del servicio por mantenimiento o causas ajenas a nuestra voluntad</li>
                  <li>Daños indirectos, lucro cesante o pérdida de datos derivados del uso de la Plataforma</li>
                </ul>
                <p className="font-medium text-slate-700">El contenido del Vademécum y el Atlas de Patología es de referencia académica. No reemplaza el juicio clínico del profesional. OdontoLatam no es responsable por el uso clínico de dicha información.</p>
              </Section>

              <Section id="suspension" title="9. Suspensión y baja de cuenta">
                <p>Podemos suspender o eliminar tu cuenta, con o sin previo aviso, si:</p>
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li>Incumplís estos Términos o las normas de la comunidad</li>
                  <li>Tu cuenta es utilizada para actividades fraudulentas o ilegales</li>
                  <li>No acreditás tu condición de profesional o estudiante del área cuando se te solicite</li>
                </ul>
                <p>Podés solicitar la eliminación de tu cuenta en cualquier momento desde los ajustes de perfil o escribiendo a soporte@odontolatam.com.</p>
              </Section>

              <Section id="ley" title="10. Ley aplicable y jurisdicción">
                <p>Estos Términos se rigen por las leyes de la República Argentina. Cualquier controversia se someterá a los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires, renunciando las partes a cualquier otro fuero que pudiera corresponderles, salvo que la legislación del país del usuario establezca normas imperativas diferentes.</p>
              </Section>

              <Section id="contacto" title="11. Contacto">
                <ul className="list-none space-y-1">
                  <li>📧 legal@odontolatam.com</li>
                  <li>🌐 www.odontolatam.com</li>
                </ul>
              </Section>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                <Link href="/privacidad" className="text-sm text-primary hover:underline font-semibold">Política de Privacidad →</Link>
                <Link href="/cookies" className="text-sm text-primary hover:underline font-semibold">Política de Cookies →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
