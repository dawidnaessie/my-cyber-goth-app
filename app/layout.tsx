import type { Metadata } from 'next';
import './globals.css';
import { ClientShell } from '@/components/ClientShell';

export const metadata: Metadata = {
  title: 'BioResearcher AI // BIOLOGY RESEARCH APPLICATION',
  description:
    'Rządowy portal badawczy neurobiologii, bio-fizyki komórkowej i konektomiki kognitywnej. Terminal analityczny Departamentu Obrony.',
  keywords: [
    'ai',
    'bio-physics',
    'cellular-biology',
    'neurobiology',
    'connectome',
    'cognitive-lab',
    'bioresearcher',
    'terminal',
  ],
  authors: [{ name: 'DOD_BIOLOGICAL_DIVISION' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className="dark">
      <body className="bg-[#050404] text-[#e0e0e0] font-mono antialiased min-h-screen relative selection:bg-[#781414] selection:text-[#f3ede2]">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
