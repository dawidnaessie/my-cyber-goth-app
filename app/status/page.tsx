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

  return (
    <div className="flex-1 flex flex-col space-y-6 py-2">
      {/* NAGŁÓWEK MONITORINGU */}
      <section
        className={`p-4 md:p-6 border transition-all duration-300 ${
          opticsOn
            ? 'bg-[#0b0d14]/90 border-zinc-800 clean-border-glow'
            : 'bg-[#0a0505]/95 border-[#781414]/70 anomaly-border-blood'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 border-zinc-800/80">
          <div>
            <span
              className={`text-[9px] px-2 py-0.5 border font-bold uppercase tracking-widest ${
                opticsOn
                  ? 'border-emerald-500/40 text-emerald-300 bg-emerald-950/20'
                  : 'border-[#ff1a1a]/70 text-[#ff8888] bg-[#781414]/30 anomaly-glow-blood'
              }`}
            >
              DIAGNOSTYKA KONTROLERA // INSTYTUT NEUROFIZJOLOGII (1994)
            </span>
            <h2
              className={`text-lg md:text-2xl font-bold tracking-wider mt-1.5 ${
                opticsOn ? 'text-zinc-100 clean-glow-cyan' : 'text-[#ffcccc] anomaly-glow-blood anomaly-chromatic'
              }`}
            >
              RAPORTY ANOMALII // STATUS KLASTRA NEUROOBLICZENIOWEGO
            </h2>
          </div>

          <div className="text-[10px] font-mono text-zinc-500 text-right">
            <p>CZAS MAGISTRALI: 03:18:42 UTC</p>
            <p>
              STAN SANITY:{' '}
              <span
                className={`font-bold ${
                  sanityStage === 'insanity'
                    ? 'text-red-500 anomaly-glow-blood'
                    : sanityStage === 'error'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {sanityStage.toUpperCase()}
              </span>
            </p>
          </div>
        </div>

        <p className="text-xs text-zinc-400 font-mono mt-3 leading-relaxed">
          Pasywna telemetria podziemnej macierzy neuroobliczeniowej Sektor-7. Poniższe wskaźniki odzwierciedlają
          stan spolaryzowania bramek FPGA, dynamikę uszkodzeń ekscytotoksycznych, przepływ kriochłodziwa oraz
          częstotliwość błędu bufora asocjacyjnego hipokampa.
        </p>
      </section>

      {/* SIATKA METRYK TELEMETRII */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`p-4 border font-mono text-xs ${
            opticsOn ? 'bg-[#0d101a] border-zinc-800' : 'bg-[#0a0505] border-[#781414]/60'
          }`}
        >
          <span className="text-[10px] text-zinc-500 block">SUB-WĘZEŁ KONEKTOMU:</span>
          <span className="text-sm font-bold text-cyan-400 mt-1 block">THORNE_CA1_CLUSTER</span>
          <p className="text-[11px] text-zinc-400 mt-2">
            Status: {isDistorted ? 'NIEODWRACALNA DEPOLARYZACJA' : 'ZSYNCHRONIZOWANY (40 Hz)'}
          </p>
        </div>

        <div
          className={`p-4 border font-mono text-xs ${
            opticsOn ? 'bg-[#0d101a] border-zinc-800' : 'bg-[#0a0505] border-[#781414]/60'
          }`}
        >
          <span className="text-[10px] text-zinc-500 block">PERFUZJA HISTOLOGICZNA:</span>
          <span className={`text-sm font-bold mt-1 block ${isDistorted ? 'text-red-400' : 'text-amber-400'}`}>
            KRIO-BUFOR // KWAS FENOLOWY
          </span>
          <p className="text-[11px] text-zinc-400 mt-2">Temperatura: -4.2°C // Ciśnienie: 102 kPa</p>
        </div>

        <div
          className={`p-4 border font-mono text-xs ${
            opticsOn ? 'bg-[#0d101a] border-zinc-800' : 'bg-[#0a0505] border-[#781414]/60'
          }`}
        >
          <span className="text-[10px] text-zinc-500 block">EKSCYTOTOKSYCZNOŚĆ NMDA:</span>
          <span
            className={`text-sm font-bold mt-1 block ${
              sanityStage === 'insanity'
                ? 'text-red-500 anomaly-glow-blood'
                : sanityStage === 'error'
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {sanityStage === 'insanity' ? '87.6% [KASKADA WAPNIOWA]' : sanityStage === 'error' ? '35.2%' : '0.4%'}
          </span>
          <p className="text-[11px] text-zinc-400 mt-2">Przeciążenie receptorów: KRYTYCZNE</p>
        </div>

        <div
          className={`p-4 border font-mono text-xs ${
            opticsOn ? 'bg-[#0d101a] border-zinc-800' : 'bg-[#0a0505] border-[#781414]/60'
          }`}
        >
          <span className="text-[10px] text-zinc-500 block">INTEGRALNOŚĆ ENZYMATYCZNA:</span>
          <span className="text-sm font-bold text-[#ff6666] mt-1 block">ROZPAD SOMATYCZNY</span>
          <p className="text-[11px] text-zinc-400 mt-2">Brak somatycznego sprzężenia zwrotnego</p>
        </div>
      </div>

      {/* SZYFROWANY ZRZUT PAMIĘCI HEX (Z DEKODEREM ARG) */}
      <section
        className={`p-4 md:p-6 border font-mono transition-colors ${
          opticsOn
            ? 'bg-[#0b0d14]/90 border-zinc-800 text-zinc-300'
            : 'bg-[#0a0505]/95 border-[#781414]/70 text-[#d8cfbe]'
        }`}
      >
        <div className="flex justify-between items-center border-b pb-3 border-zinc-800 mb-3 text-xs">
          <span className="font-bold text-cyan-400">[ZRZUT PAMIĘCI KONSOLI RATUNKOWEJ // HEX MEMORY DUMP]</span>
          <button
            onClick={handleToggleDecoder}
            className={`px-3 py-1 border text-xs font-bold tracking-wider transition ${
              opticsOn
                ? 'border-cyan-500 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-500/20'
                : 'border-[#ff1a1a] bg-[#781414]/40 text-[#ff8888] hover:bg-[#781414]'
            }`}
          >
            {decodedLogs ? 'UKRYJ ZDEKODOWANY TEKST' : 'DEKODUJ PAKIET RAW'}
          </button>
        </div>

        <div className="p-3 bg-black/80 border border-zinc-800/80 rounded text-xs space-y-2 overflow-x-auto">
          <p className="text-zinc-500 text-[11px] select-none">// SUROWY STRUMIEŃ BAJTÓW Z PŁATÓW SKRONIOWYCH KLASTRA:</p>
          <p className="text-emerald-400 tracking-widest break-all font-mono leading-relaxed">{RAW_HEX}</p>

          {decodedLogs && (
            <div className="mt-3 pt-3 border-t border-zinc-800 animate-fadeIn">
              <p className="text-amber-400 text-[11px] font-bold select-none">// WYNIK DEKODOWANIA KODU ASCII:</p>
              <p
                className={`text-sm font-bold tracking-wider mt-1 ${
                  isDistorted ? 'text-red-400 anomaly-glow-blood' : 'text-cyan-300 clean-glow-cyan'
                }`}
              >
                &gt;&gt; {DECODED_TEXT}
              </p>
              <div className="mt-2.5 pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-500 font-mono flex justify-between">
                <span>SUMA KONTROLNA CRC32: 0x8F04B1</span>
                <span>ZGODNOŚĆ PAKIETU: 100%</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
