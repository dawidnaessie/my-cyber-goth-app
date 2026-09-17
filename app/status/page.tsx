'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSystemState } from '@/components/SystemStateContext';
import { soundEngine } from '@/lib/soundEngine';

export default function StatusPage() {
  const { opticsOn, sanityStage } = useSystemState();
  const [decodedLogs, setDecodedLogs] = useState<boolean>(false);

  const isDistorted = !opticsOn || sanityStage === 'insanity';

  const handleToggleDecoder = () => {
    soundEngine.playKeystroke();
    setDecodedLogs((prev) => !prev);
  };

  const RAW_HEX = `53 45 4B 54 4F 52 2D 37 20 2F 2F 20 43 4F 4E 4E 45 43 54 4F 4D 45 20 52 45 43 4F 52 44 20 30 78 31 39 20 2F 2F 20 44 52 2E 20 41 52 49 53 20 54 48 4F 52 4E 45 20 45 4D 42 45 44 44 45 44 20 49 4E 20 53 49 4C 49 43 4F 4E 20 2F 2F 20 4E 4D 44 41 20 45 58 43 49 54 4F 54 4F 58 49 43 49 54 59 20 43 41 53 43 41 44 45 20 41 43 54 49 56 45 20 2F 2F 20 53 4F 4D 41 54 49 43 20 46 45 45 44 42 41 43 4B 20 4E 55 4C 4C`;

  const DECODED_TEXT = `SEKTOR-7 // CONNECTOME RECORD 0x19 // DR. ARIS THORNE EMBEDDED IN SILICON // NMDA EXCITOTOXICITY CASCADE ACTIVE // SOMATIC FEEDBACK NULL`;

  const telemetryMetrics = [
    {
      subsystem: isDistorted ? 'Węzeł Biometryczny TH-94 // Sektor-7' : 'Klaster Obliczeniowy Spektrometrii Mas (HPC LIMS)',
      status: isDistorted ? 'KRYTYCZNY DRYFT PAMIĘCI' : 'NOMINALNY (ZSYNCHRONIZOWANY)',
      metric: isDistorted ? 'Potencjał Dekoherencji' : 'Obciążenie Kolejki Zadań',
      value: isDistorted ? '+12.4 mV [SZOK]' : '14% [SPRAWNY]',
      alert: isDistorted,
    },
    {
      subsystem: isDistorted ? 'Pętla Krio-Perfuzji // Incydent 1994' : 'Układ Termostatyzacji Detektorów Q-TOF',
      status: isDistorted ? 'ZAPAŚĆ KRĄŻENIA BUFORA' : 'STABILNY (18.0°C)',
      metric: 'Przepływ Chłodzący',
      value: isDistorted ? '0.0 mL/min [STOP]' : '4.2 L/min',
      alert: isDistorted,
    },
    {
      subsystem: isDistorted ? 'Konektom Dr. Arisa Thorne\'a' : 'Koprocesor Regresji Kinetyki Biofizycznej',
      status: isDistorted ? 'SAMORZUTNY RE-ROUTING PAMIĘCI' : 'AKTYWNY',
      metric: 'Czas Przetwarzania Pakietu',
      value: isDistorted ? '418 ms [DESYNCHRO]' : '1.4 ms',
      alert: isDistorted,
    },
    {
      subsystem: isDistorted ? 'Rejestr Ekscytotoksyczności Umysłu' : 'Moduł Integralności Danych (FDA 21 CFR Part 11)',
      status: isDistorted ? 'KASKADA SYGNAŁOWA TRWAŁA' : 'ZGODNY (GLP PASS)',
      metric: isDistorted ? 'Wskaźnik Agonii' : 'Suma Kontrolna SHA-256',
      value: isDistorted ? '8.42 Ratio [ALARM]' : 'VALID [0x9A4F]',
      alert: isDistorted,
    },
  ];

  return (
    <div className="flex-1 flex flex-col space-y-6 font-sans">
      {/* NAGŁÓWEK DASHBOARDU */}
      <section
        className={`p-5 md:p-7 rounded-xl border transition-all duration-300 ${
          isDistorted
            ? 'bg-[#090505] border-[#781414] anomaly-border-blood text-[#e6c2b8]'
            : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-xs font-sans text-slate-500 mb-1">
              <Link href="/" className="hover:text-sky-600">Home</Link>
              <span>&gt;</span>
              <span className="text-slate-400">Infrastruktura</span>
              <span>&gt;</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Status Klastra</span>
            </div>
            <h1
              className={`text-xl md:text-2xl font-extrabold tracking-tight ${
                isDistorted ? 'text-red-400 anomaly-glow-blood font-mono' : 'text-slate-900 dark:text-white'
              }`}
            >
              TELEMETRIA KLASTRA & BIOREAKTORÓW NEURALNYCH
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Pasywny monitoring parametrów macierzy neuroobliczeniowej, kriokomór i wskaźników biofizycznych NeuroClin.
            </p>
          </div>

          <div className="text-right text-xs font-mono text-slate-500">
            <p>CZAS MAGISTRALI: 03:18:42 UTC</p>
            <p>
              STAN SYSTEMU:{' '}
              <span
                className={`font-bold ${
                  sanityStage === 'insanity'
                    ? 'text-red-500 anomaly-glow-blood'
                    : sanityStage === 'error'
                    ? 'text-amber-500'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {sanityStage.toUpperCase()}
              </span>
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
          {isDistorted
            ? 'Poniższy pulpit integruje surowe dane telemetryczne z podziemnego kompleksu badawczego Sektor-7.'
            : 'Poniższy pulpit integruje dane telemetryczne z infrastruktury obliczeniowej HPC oraz układów chromatografii i spektrometrii mas NeuroClin Biosciences.'}
        </p>
      </section>

      {/* KAFLE STATUSÓW PODSYSTEMÓW */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        {telemetryMetrics.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
              item.alert
                ? 'bg-[#150707] border-red-800 text-red-200 anomaly-glow-blood'
                : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 shadow-sm text-slate-800 dark:text-slate-200'
            }`}
          >
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">PODSYSTEM:</span>
              <h3 className="font-bold text-xs mt-0.5 text-sky-600 dark:text-sky-400">{item.subsystem}</h3>
              <p className={`text-[11px] mt-2 font-semibold ${item.alert ? 'text-red-400' : 'text-slate-500'}`}>
                Status: {item.status}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-baseline">
              <span className="text-[10px] text-slate-400">{item.metric}:</span>
              <span className="font-bold text-sm">{item.value}</span>
            </div>
          </div>
        ))}
      </section>

      {/* ZRZUT PAMIĘCI REJESTRÓW HEX (ARG LORE) */}
      <section
        className={`p-5 rounded-xl border transition-colors ${
          isDistorted
            ? 'bg-[#0a0505] border-[#781414] text-red-200'
            : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              REJESTR PAMIĘCI // SUB-ADRES 0x19-TH
            </span>
            <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              Surowy Zrzut Magistrali Pamięci Tablicy FPGA
            </h3>
          </div>

          <button
            onClick={handleToggleDecoder}
            className="px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800 hover:bg-sky-100"
          >
            {decodedLogs ? 'Pokaż Surowy Kod HEX' : 'Zdekoduj Bufor ASCII (UTF-8)'}
          </button>
        </div>

        <div className="mt-4 p-4 rounded-lg bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed overflow-x-auto shadow-inner">
          {decodedLogs ? (
            <p className="text-emerald-400 font-bold tracking-wider">{DECODED_TEXT}</p>
          ) : (
            <p className="text-slate-400 tracking-widest break-all">{RAW_HEX}</p>
          )}
        </div>

        <p className="text-[11px] text-slate-500 mt-2 font-mono">
          {isDistorted
            ? 'Pamięć rejestracyjna podtrzymywana bateryjnie od listopada 1994 roku. Sprzętowy kontroler bezpieczeństwa: Sektor-7.'
            : 'Wskaźnik integralności danych weryfikowany automatycznie co 60 sekund zgodnie ze standardami GLP/GMP oraz FDA 21 CFR Part 11.'}
        </p>
      </section>
    </div>
  );
}
