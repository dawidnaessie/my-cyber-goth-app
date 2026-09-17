import type { Metadata } from 'next';
import './globals.css';
import { ClientShell } from '@/components/ClientShell';

export const metadata: Metadata = {
  title: 'NeuroClin Biosciences // Human Connectomics & Primary Neural Assays',
  description:
    'Akredytowany portal badawczy neurobiologii, pierwotnych hodowli neuronów CA1, mikromacierzy elektrodowych oraz BioResearcher AI™.',
  keywords: [
    'neuroclin',
    'biosciences',
    'connectomics',
    'ca1-hippocampus',
    'nmda-kinetics',
    'microelectrode-array',
    'cellular-neurobiology',
    'bioresearcher-ai',
    'life-sciences',
  ],
  authors: [{ name: 'NeuroClin Biosciences Inc.' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen relative transition-colors duration-300">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
