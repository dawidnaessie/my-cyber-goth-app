'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSystemState } from './SystemStateContext';
import { soundEngine } from '@/lib/soundEngine';

export function SystemHeader() {
  const pathname = usePathname();
  const { opticsOn, audioEnabled, toggleAudio, sanityStage, isGlitching } = useSystemState();

  const navItems = [
    { href: '/', label: 'PORTAL' },
    { href: '/chat', label: 'BIO-CHAT' },
    { href: '/archive', label: 'ARCHIWUM' },
    { href: '/status', label: 'STATUS' },
  ];

  return (
    <header
      className={`p-3 md:p-4 mb-4 transition-all duration-300 border ${
        opticsOn
          ? 'bg-[#0f111a]/90 backdrop-blur-md border-zinc-800 clean-border-glow'
          : 'bg-[#0d0707]/95 border-[#781414]/70 anomaly-border-blood'
      }`}
    >
      <div
        className={`flex flex-wrap items-center justify-between gap-3 border-b pb-3 transition-colors ${
          opticsOn ? 'border-zinc-800/80' : 'border-[#781414]/40'
        }`}
      >
        {/* IDENTYFIKATOR STACJI BADAWCZEJ */}
        <div className="flex items-center space-x-3">
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full transition-all ${
              opticsOn
                ? 'bg-[#00f0ff] shadow-[0_0_10px_#00f0ff] animate-pulse'
                : sanityStage === 'insanity'
                ? 'bg-[#ff0000] shadow-[0_0_14px_#ff0000] animate-ping'
                : 'bg-[#ff1a1a] shadow-[0_0_12px_#ff1a1a] animate-pulse'
            }`}
          />
          <div>
            <h1
              className={`text-xs md:text-sm font-bold tracking-widest uppercase transition-all ${
                opticsOn
                  ? 'text-zinc-100 clean-glow-cyan'
                  : sanityStage === 'insanity'
                  ? 'text-[#ff4d4d] anomaly-glow-blood anomaly-chromatic'
                  : 'text-[#ffcccc] anomaly-glow-blood'
              }`}
            >
              {sanityStage === 'insanity'
                ? 'INSTYTUT NEUROBIOLOGII // KLASTER THORNE’A [KORUPCJA]'
                : sanityStage === 'error'
                ? 'BioResearcher AI // ABERRACJA POTENCJAŁU 0x19'
                : 'INSTYTUT NEUROBIOLOGII POZNAWCZEJ // BioResearcher AI'}
            </h1>
            <span
              className={`text-[9px] md:text-[10px] px-1.5 py-0.2 border tracking-wider uppercase inline-block mt-0.5 ${
                opticsOn
                  ? 'border-cyan-500/40 text-cyan-300 bg-cyan-950/20'
                  : 'border-[#ff1a1a]/70 text-[#ff8888] bg-[#781414]/30 anomaly-glow-blood'
              }`}
            >
              {sanityStage === 'insanity'
                ? 'STAN: ROZPAD KONEKTOMU // SEKTOR-7'
                : opticsOn
                ? 'SPECYFIKACJA HARDWARE: STERILE'
                : 'STAN: DEPOLARYZACJA RECEPTOROWA'}
            </span>
          </div>
        </div>

        {/* NAWIGACJA WIELOSTRONICOWA */}
        <nav className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono py-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => soundEngine.playKeystroke()}
                className={`px-2.5 py-1 border transition-all text-[11px] font-bold tracking-wider uppercase ${
                  isActive
                    ? opticsOn
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-200 clean-glow-cyan shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                      : 'border-[#ff1a1a] bg-[#781414]/50 text-[#ffcccc] anomaly-glow-blood shadow-[0_0_10px_rgba(255,26,26,0.3)]'
                    : opticsOn
                    ? 'border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800/40'
                    : 'border-[#781414]/40 text-[#856c6c] hover:text-[#ff9999] hover:border-[#ff1a1a]/70 hover:bg-[#781414]/20'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* PANEL KONTROLNY: INTERAKTYWNE AUDIO ORAZ AUTOMATYCZNY WSKAŹNIK OPTYKI */}
        <div className="flex items-center gap-2 text-xs">
          {/* PRZEŁĄCZNIK AUDIO (JEDYNY KONTROLOWANY PRZEZ UŻYTKOWNIKA) */}
          <button
            onClick={() => {
              soundEngine.playKeystroke();
              toggleAudio();
            }}
            className={`px-3 py-1.5 border transition-all text-xs font-bold tracking-wider ${
              audioEnabled
                ? opticsOn
                  ? 'border-emerald-500/60 text-emerald-300 bg-emerald-950/30 hover:bg-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.25)]'
                  : 'border-[#ff1a1a] text-[#ff9999] bg-[#781414]/50 hover:bg-[#781414] anomaly-glow-blood'
                : opticsOn
                ? 'border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800/40'
                : 'border-[#781414]/50 text-[#856c6c] bg-[#781414]/15 hover:bg-[#781414]/35'
            }`}
            title="Przełącznik warstwy audialnej (Sterylna telemetria / Ambient organiczny)"
          >
            {audioEnabled ? 'AUDIO: WŁ' : 'AUDIO: WYŁ'}
          </button>

          {/* AUTOMATYCZNY WSKAŹNIK STANU OPTYKI (BRAK MANUALNEGO PRZEŁĄCZNIKA) */}
          <div
            className={`px-3 py-1.5 border text-xs font-mono tracking-wider select-none transition-all ${
              sanityStage === 'insanity'
                ? 'border-red-900 bg-red-950/80 text-red-400 anomaly-glow-blood'
                : isGlitching
                ? 'border-amber-500 bg-amber-950/50 text-amber-300 animate-pulse'
                : opticsOn
                ? 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300'
                : 'border-[#ff1a1a]/70 bg-[#781414]/30 text-[#ff8888] anomaly-glow-blood'
            }`}
            title="Stan filtra optycznego sterowany automatycznie przez system neurobiologiczny"
          >
            {sanityStage === 'insanity'
              ? 'OPTYKA: USZKODZONA TRWALE'
              : isGlitching
              ? 'OPTYKA: DEKODOWANIE KADRU...'
              : opticsOn
              ? 'OPTYKA: NOMINALNA [AUTO]'
              : 'OPTYKA: ANOMALIA RECEPTOROWA'}
          </div>
        </div>
      </div>

      {/* BELKA TELEMETRII OPERACYJNEJ KLASTRA */}
      <div
        className={`grid grid-cols-2 md:grid-cols-4 gap-2 pt-2.5 text-[11px] font-mono transition-colors ${
          opticsOn ? 'text-zinc-400' : 'text-[#856c6c]'
        }`}
      >
        <div>
          POTENCJAŁ SPOCZYNKOWY:{' '}
          <span className={`font-semibold ${opticsOn ? 'text-cyan-300' : 'text-[#f5d0d0]'}`}>
            -70.4 mV
          </span>
        </div>
        <div>
          GĘSTOŚĆ RECEPTORÓW NMDA:{' '}
          <span
            className={`font-semibold ${
              sanityStage === 'insanity'
                ? 'text-red-500 anomaly-glow-blood'
                : sanityStage === 'error'
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {sanityStage === 'insanity' ? '18.2% [EKSCYTOTOKSYCZNOŚĆ]' : sanityStage === 'error' ? '61.4%' : '98.6%'}
          </span>
        </div>
        <div>
          OPÓŹNIENIE SYNAPTYCZNE:{' '}
          <span className={`font-semibold ${opticsOn ? 'text-zinc-200' : 'text-[#f0e6d6]'}`}>
            {sanityStage === 'insanity' ? '418 ms [DESYNCHRONIZACJA]' : sanityStage === 'error' ? '112 ms' : '1.4 ms'}
          </span>
        </div>
        <div className="text-right md:text-left">
          STATUS MATRYCY:{' '}
          <span
            className={`font-semibold ${
              sanityStage === 'insanity'
                ? 'text-[#ff1a1a] anomaly-glow-blood animate-pulse'
                : opticsOn
                ? 'text-emerald-400 clean-glow-emerald'
                : 'text-[#ff4d4d] anomaly-glow-blood'
            }`}
          >
            {sanityStage === 'insanity'
              ? 'KORUPCJA KONEKTOMU'
              : opticsOn
              ? 'FILTR SPÓJNY (STERILE)'
              : 'ZAKŁÓCENIE KINESKOPU'}
          </span>
        </div>
      </div>
    </header>
  );
}
