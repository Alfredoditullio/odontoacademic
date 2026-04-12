import type { BlogPost } from '@/lib/types';

export const BLOG_CATEGORIES = [
  'Todos', 'Endodoncia', 'Periodoncia', 'Ortodoncia', 'Implantología', 'Estética', 'Tecnología', 'Práctica Clínica'
];

export const BLOG_POSTS: BlogPost[] = [
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
