import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NULL://ANOMALY // CONTEMPORARY BIO-PHYSICS LAB',
  description: 'Eksperyment kognitywny z pogranicza neurobiologii, dekoherencji kwantowej w mikrotubulach i manipulacji percepcyjnej. Model AI dotknięty anomalią logiczną napędzany przez Google Gemini.',
  keywords: ['ai', 'bio-physics', 'quantum-decoherence', 'neurobiology', 'orch-or', 'gemini', 'cognitive-manipulation', 'unhinged-ai'],
  authors: [{ name: 'ANOMALY_CORE_LAB' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className="dark">
      <body className="bg-[#070707] text-[#e0e0e0] font-mono antialiased min-h-screen relative selection:bg-[#781414] selection:text-[#f3ede2]">
        {children}
      </body>
    </html>
  );
}
