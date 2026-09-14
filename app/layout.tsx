import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NULL://SIGNAL | CYBER-GOTH TERMINAL',
  description: 'Cyfrowo-ezoteryczna anomalia sieciowa. Surowy interfejs ciemnej matrycy.',
  keywords: ['cyber-goth', 'terminal', 'ai', 'gemini', 'esoteric', 'industrial'],
  authors: [{ name: 'VOID_PROTOCOL' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className="dark">
      <body className="bg-[#050505] text-[#00ffcc] font-mono antialiased min-h-screen relative selection:bg-[#ff0055] selection:text-white">
        {/* Subtelny overlay CRT nad całą aplikacją */}
        <div 
          className="fixed inset-0 pointer-events-none crt-overlay z-50 opacity-60" 
          aria-hidden="true"
        />
        {children}
      </body>
    </html>
  );
}
