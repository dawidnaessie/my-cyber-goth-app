'use client';

import React from 'react';
import Link from 'next/link';
import { SystemStateProvider, useSystemState } from './SystemStateContext';
import { SystemHeader } from './SystemHeader';

function CorporateFooter() {
  const { sanityStage, opticsOn } = useSystemState();
  const isDistorted = !opticsOn || sanityStage === 'insanity';

  return (
    <footer
      className={`mt-16 border-t transition-colors duration-300 ${
        isDistorted
          ? 'border-red-900/60 bg-[#070404] text-[#a37d77]'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d121f] text-slate-600 dark:text-slate-400'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="w-4 h-4 rounded-full bg-sky-500 inline-block" />
              <span className="font-bold tracking-wider text-sm text-slate-900 dark:text-white uppercase font-sans">
                NEUROCLIN BIOSCIENCES
              </span>
            </div>
            <p className="leading-relaxed font-sans text-slate-500 dark:text-slate-400">
              Akredytowane laboratorium biologii komórkowej i konektomiki. Dostarczamy validowane preparaty neuronalne,
              linie mikromacierzy CA1 oraz platformy symulacji biofizycznej dla wiodących ośrodków badawczych.
            </p>
            <div className="mt-3 text-[11px] font-mono text-slate-400">
              GLP / CLIA / ISO 9001:2015 CERTIFIED #NC-884-PL
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-200 mb-3 tracking-wider uppercase font-sans">
              PRODUKTY I MATERIAŁY
            </h4>
            <ul className="space-y-2 font-sans">
              <li>
                <Link href="/" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Kultury Pierwotne CA1 (CA1-TH Series)
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Preparaty Synaptosomów Hipokampa
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Krzemowe Macierze 16 384 Mikrosond
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Krio-Bufor Perfuzji Fenolowej
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-200 mb-3 tracking-wider uppercase font-sans">
              ZASOBY NAUKOWE
            </h4>
            <ul className="space-y-2 font-sans">
              <li>
                <Link href="/archive" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Publikacje & Białe Księgi (1991–1994)
                </Link>
              </li>
              <li>
                <Link href="/archive" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Dossier Archiwalne: Dr. Aris Thorne
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  BioResearcher AI™ Konsultant Kliniczny
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                  Telemetria Bioreaktorów Klastra
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-200 mb-3 tracking-wider uppercase font-sans">
              JEDNOSTKI BADAWCZE
            </h4>
            <div className="space-y-1.5 font-mono text-[11px]">
              <p>CAMBRIDGE NEURO-CAMPUS // MA, USA</p>
              <p>BASEL LIFE SCIENCES HUB // SWITZERLAND</p>
              <p className={isDistorted ? 'text-red-400 font-bold' : 'text-slate-400'}>
                PODZIEMNY KOMPLEKS SEKTOR-7 [DOD_DIV]
              </p>
              <p className="pt-2 text-[10px] text-slate-400">
                Infolinia B2B: +1 (800) 555-NEURO // support@neuroclin-bio.com
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-[11px] font-mono text-slate-500">
          <p>© 1994–2026 NeuroClin Biosciences Inc. Wszelkie prawa zastrzeżone.</p>
          <p className="mt-2 md:mt-0">
            {isDistorted ? (
              <span className="text-red-500 anomaly-glow-blood font-bold">
                UWAGA: KORUPCJA REJESTRÓW KONEKTOMU // PROJEKT S7-1994-088
              </span>
            ) : (
              <span>DOKUMENTACJA ZGODNA ZE STANDARDEM GLP-FDA-94-B</span>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}

function ShellContent({ children }: { children: React.ReactNode }) {
  const { sanityStage, isGlitching, opticsOn } = useSystemState();
  const isDistorted = !opticsOn || sanityStage === 'insanity';

  return (
    <div
      className={`min-h-screen relative flex flex-col justify-between transition-colors duration-300 ${
        isDistorted ? 'bg-[#050404] text-[#cfc4b2]' : 'bg-[#f8fafc] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100'
      }`}
    >
      {/* NAKŁADKI ANALOG HORROR (Renderowane tylko w stanie Insanity lub podczas glitcha) */}
      {(isDistorted || isGlitching) && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0 analog-scanlines opacity-75" />
          <div className="absolute inset-0 analog-vignette opacity-85" />
          <div className="absolute inset-0 analog-noise opacity-60" />
        </div>
      )}

      <div className={`flex-1 flex flex-col transition-all ${isDistorted || isGlitching ? 'analog-flicker' : ''}`}>
        <SystemHeader />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
          {children}
        </main>
        <CorporateFooter />
      </div>
    </div>
  );
}

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <SystemStateProvider>
      <ShellContent>{children}</ShellContent>
    </SystemStateProvider>
  );
}
