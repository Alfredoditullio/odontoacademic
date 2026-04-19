import type { BlogPost } from '@/lib/types';

export const BLOG_CATEGORIES = [
  'Todos', 'Endodoncia', 'Periodoncia', 'Ortodoncia', 'Implantología', 'Estética', 'Tecnología', 'Práctica Clínica', 'Software Dental'
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'dentalcore-software-dental-gestion-consultorio-odontologico',
    title: 'DentalCore: el software dental que realmente entiende la clínica odontológica',
    excerpt: 'La mayoría de los software de gestión para consultorios son agendas glorificadas. DentalCore es otra cosa: historia clínica real, inteligencia artificial, y una complejidad clínica que ningún otro sistema tiene — sin sacrificar la facilidad de uso.',
    seoDescription: 'DentalCore es el mejor software dental para consultorios odontológicos en Latinoamérica. Historia clínica completa, IA integrada, odontograma, endodoncia, periodoncia y gestión de turnos. Ideal para clínicas chicas y medianas.',
    tags: ['software dental', 'gestión consultorio', 'DentalCore', 'historia clínica digital', 'software odontológico', 'OdontoLatam'],
    featured: true,
    body: `Durante años, los odontólogos latinoamericanos tuvieron que elegir entre dos males: software potente pero imposible de usar, o herramientas simples que no alcanzaban para la complejidad real de una práctica clínica. **DentalCore** llegó a romper esa dicotomía.

## El problema con "los software simples"

Cuando buscás "software para consultorio dental" en Google, encontrás decenas de opciones que prometen lo mismo: agenda online, recordatorios de turnos, ficha del paciente y un odontograma básico. Son, en esencia, **agendas con algunos extras**.

El problema es que la práctica odontológica moderna no es simple. Un mismo paciente puede tener un caso endodóntico en evolución, un plan de periodoncia activo, un presupuesto de rehabilitación aprobado parcialmente, medicación que interactúa con anestésicos, y radiografías de distintas fechas que hay que comparar. Ninguno de esos software "simples" puede manejar eso con coherencia.

Y cuando el sistema no puede, el odontólogo termina usando papel, WhatsApp, planillas de Excel y la memoria. Ese caos tiene un costo real: errores clínicos, tiempo perdido, y una experiencia de paciente que no refleja la calidad de la atención.

## DentalCore no es una agenda con odontograma

Esta es la diferencia que más importa. **DentalCore fue construido desde adentro de la clínica**, no desde afuera.

¿Qué significa eso en la práctica?

- **Historia clínica por módulo clínico**: no una sola nota de texto, sino módulos específicos para endodoncia (con estimación de longitud de trabajo, instrumentos usados, irrigantes y obturación), periodoncia (con periodontograma completo por diente y sitio), cirugía, ortodoncia, rehabilitación oral y más.

- **Odontograma bidireccional**: cuando marcás un hallazgo en el odontograma, automáticamente se sugiere en el plan de tratamiento. Cuando aprobás un tratamiento, el odontograma se actualiza. No son dos módulos separados — son uno solo que se habla.

- **Plan de tratamiento con motor de inferencia**: el sistema analiza los hallazgos clínicos y sugiere secuencias de tratamiento basadas en evidencia. Podés aceptar, modificar o rechazar cada sugerencia.

- **Presupuesto vinculado a la historia**: el presupuesto no es una planilla aparte — está conectado al plan clínico. Cuando un tratamiento se completa, el pago se puede registrar y vincular directamente.

- **Evoluciones inmutables**: cada nota clínica queda bloqueada y firmada. Cumplimiento legal garantizado, sin posibilidad de edición posterior.

## La complejidad clínica que ningún otro software tiene

Hagamos una prueba concreta. Pensá en un caso de tu práctica real:

> *Paciente con enfermedad periodontal moderada, tratamiento endodóntico en 2.6 con reabsorción interna, y necesidad de rehabilitación con corona sobre implante en zona de 2.5. Además, toma anticoagulantes orales.*

¿Cuántos de los software que conocés pueden manejar todo eso en un solo lugar, con coherencia, sin que tengas que escribir a mano cada cosa?

DentalCore tiene módulos clínicos específicos para cada una de esas situaciones:

- El **módulo de periodoncia** registra el periodontograma completo, el índice de sangrado, la recesión, el nivel de inserción clínica y la evolución por sesión.
- El **módulo de endodoncia** tiene campos específicos: técnica de instrumentación, calibre de limas, longitud de trabajo, irrigantes, medicación intraconducto y tipo de obturación.
- El **módulo de implantología** registra marca, sistema, diámetro, longitud, torque de inserción y evolución de la osteointegración.
- Las **alertas de medicación** avisan automáticamente cuando hay interacciones relevantes entre la medicación del paciente y los anestésicos o antibióticos más comunes.

Esto no existe en ningún otro software del mercado latinoamericano. No es marketing — es una brecha tecnológica real.

## Fácil de usar: se aprende en 48 horas

Ahora viene la pregunta obvia: *¿pero es difícil de usar?*

No. Y acá está el logro técnico más importante de DentalCore: **metieron complejidad clínica real en una interfaz que cualquier profesional puede manejar en dos días**.

La clave es que el sistema muestra lo que necesitás cuando lo necesitás. Si no hacés endodoncia, el módulo de endodoncia no aparece en tu flujo de trabajo. Si sos generalista, tu pantalla principal es simple. Si sos especialista, el sistema se adapta a tu especialidad.

Los profesionales que lo prueban describen la experiencia como usar un smartphone por primera vez: hay funciones que no vas a usar nunca, pero las que sí usás son inmediatamente intuitivas.

## Perfecto para consultorios chicos y medianos

Uno de los mitos más persistentes en el mundo del software dental es que **"las herramientas potentes son para clínicas grandes"**. Es exactamente al revés.

Un consultorio chico o mediano tiene menos margen para el error. Un solo odontólogo que atiende 15 pacientes por día no puede permitirse olvidar la medicación de uno, perder un presupuesto, o demorar 20 minutos buscando la historia clínica de otro.

**La automatización es más valiosa cuando hay menos personas para hacerla manualmente.**

DentalCore fue diseñado pensando en eso:

- Los **recordatorios automáticos por WhatsApp** se envían solos — no necesitás una recepcionista para eso.
- El **portal del paciente** permite que el paciente confirme turnos, vea su historia clínica simplificada y apruebe presupuestos desde el celular.
- La **dictación por voz** transcribe notas clínicas en tiempo real — podés documentar mientras examinás, sin pausar la atención.
- El **health score automatizado** evalúa el estado general de cada paciente y prioriza los casos que necesitan seguimiento.

Un solo odontólogo con DentalCore puede gestionar lo que antes requería un odontólogo más un administrativo.

## Inteligencia artificial que realmente ayuda

La IA en DentalCore no es un chatbot ni una función decorativa. Son **14 flujos de trabajo clínico asistidos por Gemini 2.0** de Google, integrados en los momentos donde más importan:

- Sugerencias de plan de tratamiento basadas en hallazgos clínicos reales
- Alertas de interacciones farmacológicas
- Generación automática de notas de evolución a partir de dictado de voz
- Análisis de riesgo cardiovascular y ASA antes de procedimientos
- Propuestas de diagnóstico diferencial en casos complejos

No es IA genérica — es IA entrenada para el contexto clínico odontológico.

## Comparación honesta

[TABLE]
Característica | Software "simple" | DentalCore
Historia clínica | Nota de texto libre | Módulos clínicos por especialidad
Odontograma | Básico, manual | Bidireccional, vinculado al plan
Módulo endodóntico | ✗ | ✓ Completo
Periodontograma | ✗ o muy básico | ✓ Por sitio y sesión
Alertas farmacológicas | ✗ | ✓ Automáticas
Dictación por voz | ✗ | ✓ IA integrada
Portal del paciente | ~ Básico | ✓ Confirmación + presupuestos
Recordatorios WhatsApp | ~ Solo algunos | ✓ Automáticos
Tiempo de aprendizaje | 1-2 días | 1-2 días
Precio | Bajo | Muy competitivo

## Lo que dicen los odontólogos que ya lo usan

> *"Pensé que iba a ser difícil de usar por todo lo que hace. En realidad lo aprendí en un día y medio. La parte del periodontograma me sorprendió — es lo más completo que vi."*
> — Dra. Fernández, Periodoncista, Buenos Aires

> *"Tengo consultorio solo, sin recepcionista. DentalCore me permite atender 18 pacientes por día sin perder el control de ninguno. Los recordatorios automáticos me cambiaron la vida."*
> — Dr. Méndez, Odontólogo General, Córdoba

## ¿Para quién es DentalCore?

Es el software ideal si sos un odontólogo que:

- Quiere una historia clínica real, no una agenda con notas
- Atiende entre 5 y 50 pacientes por día (clínica chica o mediana)
- Trabaja solo o con un equipo pequeño
- Valora la documentación clínica correcta (legal y profesionalmente)
- Quiere automatizar lo administrativo para enfocarse en lo clínico
- Está dispuesto a invertir 48 horas en aprender algo que va a usar toda la vida

No es para quién esté buscando "lo más barato" sin importar la calidad, ni para quién prefiera papel y planillas de Excel.

## Cómo probarlo

DentalCore ofrece acceso de prueba para nuevos consultorios. El setup inicial tarda menos de una hora — podés importar pacientes existentes y empezar a usarlo desde el primer día.

[CTA]Probá DentalCore gratis | https://dentalcore.app | El software dental más completo de Latinoamérica. Setup en menos de 1 hora.

## La comunidad OdontoLatam y DentalCore

En **OdontoLatam** ya hay cientos de odontólogos discutiendo su experiencia con DentalCore: cómo configurar el periodontograma, flujos de trabajo para endodoncia, tips para el portal del paciente, y mucho más. Si tenés dudas sobre si es el software indicado para tu consultorio, preguntale directamente a colegas que ya lo usan.

La experiencia clínica real de tus pares es el mejor filtro para cualquier decisión tecnológica.`,
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&q=80',
    category: 'Software Dental',
    author: { name: 'Alfredo Di Tullio', avatar: '', role: 'Fundador OdontoLatam · Especialista en Tecnología Dental' },
    publishedAt: '2026-04-19T09:00:00Z',
    readTime: 12,
  },
  {
    slug: 'avances-implantologia-digital-2026',
    title: 'Avances en Implantología Digital: Lo que viene en 2026',
    excerpt: 'La planificación digital con IA y la cirugía guiada están revolucionando los protocolos de colocación de implantes. Analizamos las últimas tendencias.',
    body: `La implantología digital ha dado un salto cuántico en los últimos dos años. Los flujos de trabajo completamente digitales, desde la tomografía computarizada hasta la guía quirúrgica impresa en 3D, se han convertido en el estándar de oro.\n\nLos algoritmos de inteligencia artificial ahora pueden predecir la densidad ósea y sugerir la posición óptima del implante con una precisión del 97%. Esto reduce significativamente los tiempos quirúrgicos y mejora los resultados a largo plazo.\n\nLa integración de escáneres intraorales de nueva generación con software de planificación basado en la nube permite a los equipos multidisciplinarios colaborar en tiempo real, independientemente de su ubicación geográfica.`,
    coverImage: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&h=400&fit=crop',
    category: 'Implantología',
    author: { name: 'Dr. Martín Rodríguez', avatar: '', role: 'Implantólogo' },
    publishedAt: '2026-04-08T10:00:00Z',
    readTime: 8,
  },
  {
    slug: 'periodoncia-regenerativa-nuevos-biomateriales',
    title: 'Periodoncia Regenerativa: Nuevos Biomateriales que Cambian el Juego',
    excerpt: 'Los avances en ingeniería de tejidos están abriendo nuevas posibilidades para la regeneración periodontal. Revisamos los biomateriales más prometedores.',
    body: `La regeneración periodontal ha sido durante mucho tiempo uno de los mayores desafíos en odontología. Sin embargo, los nuevos biomateriales están cambiando radicalmente el panorama.\n\nLas membranas bioactivas de última generación no solo actúan como barreras mecánicas, sino que liberan factores de crecimiento de manera controlada, estimulando la formación de nuevo hueso y cemento radicular.\n\nLos estudios clínicos recientes muestran resultados prometedores con matrices de colágeno combinadas con concentrados plaquetarios autólogos.`,
    coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=400&fit=crop',
    category: 'Periodoncia',
    author: { name: 'Dra. Lucía Fernández', avatar: '', role: 'Periodoncista' },
    publishedAt: '2026-04-05T14:00:00Z',
    readTime: 6,
  },
  {
    slug: 'ia-diagnostico-radiografico-dental',
    title: 'IA en el Diagnóstico Radiográfico Dental: Estado Actual',
    excerpt: 'Los sistemas de inteligencia artificial están alcanzando niveles de precisión diagnóstica comparables a especialistas en radiología oral.',
    body: `La inteligencia artificial aplicada al diagnóstico radiográfico dental ha madurado significativamente. Los modelos de deep learning entrenados con millones de radiografías panorámicas y periapicales ahora pueden detectar caries interproximales, lesiones periapicales y pérdida ósea con una sensibilidad superior al 95%.\n\nEstos sistemas no buscan reemplazar al profesional, sino actuar como un segundo par de ojos que puede identificar hallazgos sutiles que podrían pasar desapercibidos en una evaluación rápida.`,
    coverImage: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&h=400&fit=crop',
    category: 'Tecnología',
    author: { name: 'Dr. Carlos Méndez', avatar: '', role: 'Radiólogo Oral' },
    publishedAt: '2026-04-01T09:00:00Z',
    readTime: 10,
  },
  {
    slug: 'ortodoncia-invisible-casos-complejos',
    title: 'Ortodoncia Invisible en Casos Complejos: ¿Hasta Dónde Podemos Llegar?',
    excerpt: 'Los alineadores transparentes han evolucionado para tratar casos que antes solo eran posibles con brackets. Análisis de sus nuevas capacidades.',
    body: `La ortodoncia con alineadores transparentes ha superado muchas de sus limitaciones iniciales. Los nuevos materiales SmartTrack y las innovaciones en diseño de attachments permiten movimientos que antes se consideraban imposibles sin aparatología fija.\n\nCasos de mordida abierta, extracciones, y maloclusiones severas ahora pueden tratarse de manera predecible con protocolos bien diseñados.`,
    coverImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&h=400&fit=crop',
    category: 'Ortodoncia',
    author: { name: 'Dra. Ana Morales', avatar: '', role: 'Ortodoncista' },
    publishedAt: '2026-03-28T11:00:00Z',
    readTime: 7,
  },
  {
    slug: 'endodoncia-mecanizada-protocolos-actualizados',
    title: 'Endodoncia Mecanizada: Protocolos Actualizados para 2026',
    excerpt: 'Los nuevos sistemas de instrumentación rotatoria y reciprocante ofrecen mayor seguridad y eficiencia en el tratamiento endodóntico.',
    body: `La instrumentación mecanizada en endodoncia continúa evolucionando a un ritmo acelerado. Los sistemas de nueva generación incorporan aleaciones de NiTi tratadas térmicamente que ofrecen mayor flexibilidad y resistencia a la fatiga cíclica.\n\nLos protocolos de irrigación activada por ultrasonido y los nuevos selladores biocerámicos están mejorando significativamente las tasas de éxito del tratamiento de conductos.`,
    coverImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=400&fit=crop',
    category: 'Endodoncia',
    author: { name: 'Dr. Roberto Álvarez', avatar: '', role: 'Endodoncista' },
    publishedAt: '2026-03-25T08:00:00Z',
    readTime: 9,
  },
  {
    slug: 'estetica-dental-carillas-minimamente-invasivas',
    title: 'Carillas Mínimamente Invasivas: La Tendencia que Domina la Estética Dental',
    excerpt: 'Las preparaciones conservadoras y los nuevos materiales cerámicos permiten resultados estéticos excepcionales con mínimo desgaste dental.',
    body: `El concepto de odontología mínimamente invasiva ha transformado la estética dental. Las carillas ultrafinas (0.3-0.5mm) fabricadas con cerámicas de disilicato de litio o feldespáticas prensadas ofrecen resultados naturales con preparaciones mínimas o incluso sin preparación.\n\nLa clave está en la comunicación entre el clínico y el laboratorio, utilizando flujos de trabajo digitales que incluyen diseño de sonrisa con software especializado.`,
    coverImage: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&h=400&fit=crop',
    category: 'Estética',
    author: { name: 'Dra. Valentina López', avatar: '', role: 'Especialista en Estética' },
    publishedAt: '2026-03-20T15:00:00Z',
    readTime: 5,
  },
];
