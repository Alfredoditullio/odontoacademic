import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'OdontoLatam — La Comunidad Dental de Latinoamérica',
    template: '%s | OdontoLatam',
  },
  description:
    'La comunidad de odontólogos más grande de Latinoamérica. Casos clínicos, vademécum odontológico, atlas de patología oral, cursos, marketplace y networking profesional. Partner oficial de DentalCore, el mejor software dental para consultorios.',
  keywords: [
    'odontología', 'comunidad dental', 'implantología', 'endodoncia', 'periodoncia',
    'software dental', 'DentalCore', 'gestión consultorio odontológico', 'historia clínica dental',
    'software odontológico latinoamérica', 'educación dental continua',
  ],
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'OdontoLatam',
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
