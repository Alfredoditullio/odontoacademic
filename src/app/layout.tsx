import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'OdontoAcademic — Educación Dental Continua',
    template: '%s | OdontoAcademic',
  },
  description:
    'La plataforma de educación dental continua más completa de Latinoamérica. Bibliografía, atlas de patología oral, cursos, comunidad profesional y tienda de instrumental.',
  keywords: ['odontología', 'educación dental', 'implantología', 'endodoncia', 'periodoncia', 'comunidad dental'],
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'OdontoAcademic',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
