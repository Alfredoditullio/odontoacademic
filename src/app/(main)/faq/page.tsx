import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes',
  description: 'Respondemos las preguntas más comunes sobre OdontoLatam: comunidad, recursos, cuenta y más.',
};

interface FaqItem {
  q: string;
  a: React.ReactNode;
}

const FAQ_SECTIONS: { section: string; icon: string; color: string; items: FaqItem[] }[] = [
  {
    section: 'La plataforma',
    icon: 'public',
    color: 'text-sky-600',
    items: [
      {
        q: '¿Qué es OdontoLatam?',
        a: 'OdontoLatam es la comunidad profesional de odontología más grande de Latinoamérica. Somos un espacio donde odontólogos, especialistas y estudiantes de toda la región pueden compartir casos clínicos, acceder a recursos académicos (vademécum, atlas de patología oral, cursos), conectarse con colegas y comprar materiales e instrumental dental.',
      },
      {
        q: '¿Es gratuito?',
        a: 'El acceso básico a la comunidad, el feed de posts, el vademécum, el atlas y el directorio es completamente gratuito. Algunos contenidos premium de educación continua y funcionalidades avanzadas podrán tener costo en el futuro. Te notificaremos con anticipación antes de implementar cualquier modelo de suscripción.',
      },
      {
        q: '¿En qué países está disponible?',
        a: 'OdontoLatam está disponible en todos los países de habla hispana y portuguesa de América Latina: Argentina, México, Colombia, Brasil, Chile, Perú, Venezuela, Ecuador, Bolivia, Paraguay, Uruguay, Costa Rica, Guatemala, Cuba, República Dominicana, Panamá, Honduras, El Salvador, Nicaragua, entre otros.',
      },
      {
        q: '¿Qué diferencia a OdontoLatam de otras redes sociales?',
        a: (
          <span>
            A diferencia de Facebook o Instagram, OdontoLatam está diseñada específicamente para profesionales de la odontología. Contamos con categorías temáticas especializadas, un vademécum clínico, un atlas de patología oral, casos clínicos estructurados, un directorio de derivación y herramientas pensadas para el ejercicio profesional. Además, estamos integrados con{' '}
            <Link href="https://dentalcore.app" target="_blank" className="text-primary hover:underline font-semibold">DentalCore</Link>
            , el software de gestión dental líder en LATAM.
          </span>
        ),
      },
    ],
  },
  {
    section: 'Cuenta y perfil',
    icon: 'person',
    color: 'text-violet-600',
    items: [
      {
        q: '¿Quién puede registrarse?',
        a: 'Odontólogos, especialistas (implantólogos, periodoncistas, endodoncistas, ortodoncistas, etc.), técnicos dentales y estudiantes de odontología de cualquier año y país de LATAM. Durante el registro podés indicar tu condición y especialidad.',
      },
      {
        q: '¿Necesito acreditar mi matrícula para registrarme?',
        a: 'Para el registro básico no es obligatorio. Sin embargo, para acceder a ciertos contenidos clínicos avanzados y tener el badge de "Odontólogo verificado", te pediremos que ingreses tu número de matrícula o registro profesional, que validamos contra los registros disponibles.',
      },
      {
        q: '¿Puedo tener un perfil como estudiante?',
        a: 'Sí. Al registrarte podés seleccionar el rol "Estudiante", indicar tu universidad y año de cursada. Los estudiantes tienen acceso a la sección Carrera & Estudios donde pueden hacer consultas académicas, compartir dudas y conectar con colegas de otras universidades de LATAM.',
      },
      {
        q: '¿Cómo elimino mi cuenta?',
        a: 'Podés solicitar la eliminación de tu cuenta desde Configuración → Cuenta → Eliminar cuenta, o enviando un email a soporte@odontolatam.com. Los datos se eliminan conforme a nuestra Política de Privacidad.',
      },
    ],
  },
  {
    section: 'Comunidad',
    icon: 'groups',
    color: 'text-teal-600',
    items: [
      {
        q: '¿Cómo publico un caso clínico?',
        a: 'Desde el feed de la comunidad, hacé click en el botón "Nuevo post" y seleccioná la categoría "Casos Clínicos". Podrás adjuntar imágenes, radiografías, descripción del caso, diagnóstico, tratamiento realizado y resultado. Los casos clínicos deben anonimizarse (no incluir datos del paciente).',
      },
      {
        q: '¿Qué tipo de contenido puedo publicar?',
        a: (
          <span>
            Casos clínicos, preguntas académicas, novedades del mundo dental, publicaciones de investigación, dudas clínicas, presentaciones de casos y debates de actualidad. También podés publicar en el Mercado OdontoLatam para vender equipo usado o buscar materiales.
            Consultá nuestras{' '}
            <Link href="/terminos" className="text-primary hover:underline font-semibold">Normas de la Comunidad</Link>
            {' '}para más detalle.
          </span>
        ),
      },
      {
        q: '¿Qué es el sistema de derivaciones?',
        a: 'El sistema de derivaciones te permite enviar un paciente a un colega de confianza. En el perfil de cualquier odontólogo que acepte derivaciones (indicado con el badge "Acepta derivaciones") verás el botón "Pedir derivación". Esta funcionalidad estará disponible en su versión completa próximamente.',
      },
      {
        q: '¿Los mensajes privados son confidenciales?',
        a: 'Sí. Los mensajes privados entre miembros son confidenciales y no son visibles para otros usuarios ni para moderadores, salvo en casos donde exista una denuncia por contenido inapropiado que requiera revisión por parte del equipo de seguridad.',
      },
      {
        q: '¿Qué es OdontoLatam Live?',
        a: 'OdontoLatam Live es nuestro canal de streaming semanal en el que transmitiremos webinars en vivo, presentaciones de casos clínicos, entrevistas con especialistas y paneles de debate. Los eventos son gratuitos para miembros registrados. Próximamente habilitaremos la agenda completa.',
      },
    ],
  },
  {
    section: 'Recursos académicos',
    icon: 'school',
    color: 'text-emerald-600',
    items: [
      {
        q: '¿El Vademécum es confiable para uso clínico?',
        a: 'El Vademécum de OdontoLatam es una herramienta de referencia rápida para profesionales de la salud dental. La información se basa en fuentes actualizadas, pero siempre debe verificarse con el prospecto oficial del medicamento y ajustarse a la situación clínica particular del paciente. No reemplaza el juicio clínico profesional.',
      },
      {
        q: '¿Con qué frecuencia se actualiza el contenido?',
        a: 'El vademécum y el atlas de patología oral se revisan y actualizan periódicamente por nuestro equipo editorial. Si detectás información desactualizada o incorrecta, podés reportarla desde el botón "Reportar error" en cada ficha o escribiéndonos a contenido@odontolatam.com.',
      },
      {
        q: '¿Puedo proponer contenido para el atlas o el vademécum?',
        a: 'Sí. Si sos especialista y querés contribuir con fichas clínicas, casos o revisiones, escribinos a contenido@odontolatam.com. Los colaboradores quedan acreditados en el contenido que generan.',
      },
    ],
  },
  {
    section: 'Tienda',
    icon: 'storefront',
    color: 'text-amber-600',
    items: [
      {
        q: '¿Cómo compro en la Tienda?',
        a: 'Navegá el catálogo, agregá los productos al carrito y seguí el proceso de checkout. Aceptamos los principales medios de pago de cada país (tarjetas de crédito/débito, transferencia bancaria, billeteras digitales según disponibilidad).',
      },
      {
        q: '¿Puedo vender en la Tienda?',
        a: 'Por el momento, la tienda opera con un catálogo curado. Si sos proveedor de materiales o equipos dentales y querés aparecer en nuestro catálogo, contactanos en comercial@odontolatam.com.',
      },
      {
        q: '¿Cuál es la política de devoluciones?',
        a: 'Las devoluciones se rigen por la legislación de defensa del consumidor de cada país. En general, tenés derecho a devolver productos defectuosos o que no correspondan a lo publicado dentro de los plazos legales. Para iniciar una devolución escribí a soporte@odontolatam.com.',
      },
    ],
  },
  {
    section: 'Técnico y soporte',
    icon: 'support_agent',
    color: 'text-slate-600',
    items: [
      {
        q: '¿Cómo reporto un error o problema técnico?',
        a: 'Podés reportar problemas técnicos desde la sección de Configuración → Soporte, o enviando un email a soporte@odontolatam.com describiendo el problema, el dispositivo que usás y los pasos para reproducirlo.',
      },
      {
        q: '¿La plataforma funciona en dispositivos móviles?',
        a: 'Sí. OdontoLatam está diseñada con responsive design y funciona en smartphones y tablets. Estamos desarrollando una app nativa para iOS y Android que estará disponible próximamente.',
      },
      {
        q: '¿Cómo denuncio un contenido inapropiado?',
        a: 'En cada post y comentario encontrás el ícono de tres puntos (⋮) con la opción "Reportar". También podés escribir a comunidad@odontolatam.com. Nuestro equipo revisará el reporte en un plazo máximo de 48 horas.',
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-sky-600 via-cyan-600 to-teal-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
          <span className="material-symbols-outlined text-[48px] mb-3 block opacity-90">help</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Preguntas Frecuentes</h1>
          <p className="text-white/80 max-w-xl mx-auto">
            Todo lo que necesitás saber sobre OdontoLatam. Si no encontrás tu respuesta, escribinos.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          {FAQ_SECTIONS.map((sec) => (
            <div key={sec.section}>
              <div className="flex items-center gap-2.5 mb-5">
                <span className={`material-symbols-outlined text-[24px] ${sec.color}`}>{sec.icon}</span>
                <h2 className="text-xl font-bold text-slate-900">{sec.section}</h2>
              </div>

              <div className="space-y-3">
                {sec.items.map((item, i) => (
                  <details key={i} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none hover:bg-slate-50 transition">
                      <span className="font-semibold text-slate-800 text-sm leading-snug">{item.q}</span>
                      <span className="material-symbols-outlined text-[20px] text-slate-400 shrink-0 transition-transform group-open:rotate-180">
                        expand_more
                      </span>
                    </summary>
                    <div className="px-6 pb-5 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      <div className="pt-4">{item.a}</div>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}

          {/* CTA contacto */}
          <div className="bg-gradient-to-br from-sky-50 to-teal-50 border border-sky-200 rounded-2xl p-8 text-center">
            <span className="material-symbols-outlined text-[36px] text-sky-500 mb-3 block">mail</span>
            <h3 className="text-lg font-bold text-slate-900 mb-2">¿No encontraste tu respuesta?</h3>
            <p className="text-sm text-slate-500 mb-5">Nuestro equipo responde dentro de las 24 horas hábiles.</p>
            <a
              href="mailto:soporte@odontolatam.com"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-teal-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition"
            >
              <span className="material-symbols-outlined text-[18px]">mail</span>
              soporte@odontolatam.com
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
