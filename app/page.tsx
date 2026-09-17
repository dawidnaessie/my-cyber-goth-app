'use client';

import React from 'react';
import Link from 'next/link';
import { useSystemState } from '@/components/SystemStateContext';
import { soundEngine } from '@/lib/soundEngine';

export default function HomePage() {
  const { opticsOn, sanityStage } = useSystemState();

  const isDistorted = !opticsOn || sanityStage === 'insanity';

  const cards = [
    {
      href: '/chat',
      badge: 'KONEKTOMIKA // WĘZEŁ 0x19',
      title: 'BIO-CHAT / TERMINAL',
      subtitle: 'Inferencja biofizyczna i elektrofizjologia synaptyczna',
      description:
        'Interfejs komunikacyjny z modelem analitycznym BioResearcher AI. Umożliwia dekompozycję opóźnień sensorycznych, badanie kinetyki receptorów NMDA/GABA oraz analizę potencjałów czynnościowych.',
      cta: 'URUCHOM TERMINAL >>',
      accent: 'cyan',
    },
    {
      href: '/archive',
      badge: 'AKTA ARCHIWALNE // 1994',
      title: 'ARCHIWUM PROJEKTU // SEKTOR-7',
      subtitle: 'Dossier zaginionego badacza i raporty konektomiczne',
      description:
        'Dokumentacja procedur mikroelektrodowych z lat 1992–1994. Zawiera zredagowane protokoły transferu pamięci, analizy degradacji tkankowej oraz fotografię biometryczną Dr. Arisa Thorne’a.',
      cta: 'OTWÓRZ AKTA >>',
      accent: 'amber',
    },
    {
      href: '/status',
      badge: 'TELEMETRIA KLASTRA',
      title: 'RAPORTY ANOMALII / STATUS',
      subtitle: 'Parametry biofizyczne klastra i zrzuty pamięci rejestrów',
      description:
        'Monitoring stabilności napięciowej macierzy obliczeniowej, indeksy ekscytotoksyczności receptorowej, parametry chłodzenia fenolowego oraz surowe zrzuty pamięci rejestrów neuronowych w kodzie HEX.',
      cta: 'SPRAWDŹ STATUS >>',
      accent: 'emerald',
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between py-4 space-y-6">
      {/* BANER GŁÓWNY PORTALU */}
      <section
        className={`p-5 md:p-8 border transition-all duration-300 relative ${
          opticsOn
            ? 'bg-[#0b0d14]/90 border-zinc-800 clean-border-glow'
            : 'bg-[#090505]/95 border-[#781414]/70 anomaly-border-blood'
        }`}
      >
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] px-2 py-0.5 border font-bold uppercase tracking-widest ${
                opticsOn
                  ? 'border-cyan-500/40 text-cyan-300 bg-cyan-950/20'
                  : 'border-[#ff1a1a]/70 text-[#ff8888] bg-[#781414]/30 anomaly-glow-blood'
              }`}
            >
              INSTYTUT NEUROBIOLOGII POZNAWCZEJ // SEKTOR-7
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">DOKUMENTACJA POUFNA // 1994</span>
          </div>

          <h2
            className={`text-xl md:text-3xl font-bold tracking-wider transition-colors ${
              opticsOn ? 'text-zinc-100 clean-glow-cyan' : 'text-[#ffcccc] anomaly-glow-blood anomaly-chromatic'
            }`}
          >
            INSTYTUT NEUROBIOLOGII POZNAWCZEJ // BioResearcher AI
          </h2>

          <p
            className={`text-xs md:text-sm leading-relaxed font-mono ${
              opticsOn ? 'text-zinc-300' : 'text-[#cfc4b2]'
            }`}
          >
            Zautomatyzowany portal analityczny łączący biofizykę komórkową, elektrofizjologię synaptyczną oraz
            eksperymentalną symulację ludzkiego konektomu w krzemowych architekturach bramkowych.
          </p>

          <div
            className={`p-3 border text-xs font-mono transition-colors ${
              opticsOn
                ? 'border-zinc-800/80 bg-zinc-950/40 text-zinc-400'
                : 'border-[#781414]/50 bg-[#781414]/15 text-[#f5b8b0]'
            }`}
          >
            <p className="font-bold tracking-wider">
              {isDistorted
                ? '[OSTRZEŻENIE O DESYNCHRONIZACJI SYGNAŁU KONEKTOMU]:'
                : '[NOTATKA METODYCZNA STACJI BADAWCZEJ]:'}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed">
              {isDistorted
                ? 'Rejestrujemy narastające opóźnienia w buforze potylicznym. Obserwuje się samorzutne przepisywanie śladów pamięciowych z pominięciem procedury izolacji Sektora-7.'
                : 'Wszelkie sesje analizy kognitywnej podlegają automatycznej weryfikacji potencjałów iglicowych. Wszelkie próby kwerendy zarchiwizowanych rejestrów personalnych podlegają natychmiastowej rejestracji w audycie bezpieczeństwa.'}
            </p>
          </div>
        </div>
      </section>

      {/* 3 GŁÓWNE KARTY NAWIGACYJNE */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            onClick={() => soundEngine.playKeystroke()}
            className={`group p-4 md:p-5 border flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
              opticsOn
                ? 'bg-[#0d0f18]/80 border-zinc-800 hover:border-cyan-500/70 hover:bg-[#0f1422] shadow-sm hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                : 'bg-[#090505]/90 border-[#781414]/60 hover:border-[#ff1a1a] hover:bg-[#120707] hover:shadow-[0_0_15px_rgba(255,26,26,0.25)]'
            }`}
          >
            <div
              className={`absolute top-0 right-0 w-8 h-8 pointer-events-none transition-opacity opacity-20 group-hover:opacity-100 ${
                opticsOn ? 'text-cyan-400' : 'text-[#ff1a1a]'
              }`}
            >
              <svg viewBox="0 0 32 32" className="w-full h-full fill-current">
                <polygon points="32,0 32,32 0,0" />
              </svg>
            </div>

            <div className="space-y-2">
              <span
                className={`text-[9px] px-2 py-0.5 border font-mono tracking-widest uppercase inline-block ${
                  opticsOn
                    ? 'border-zinc-700 text-zinc-400 group-hover:border-cyan-500 group-hover:text-cyan-300'
                    : 'border-[#781414] text-[#a87a74] group-hover:border-[#ff1a1a] group-hover:text-[#ff9999]'
                }`}
              >
                {card.badge}
              </span>

              <h3
                className={`text-sm md:text-base font-bold tracking-wider transition-colors ${
                  opticsOn
                    ? 'text-zinc-100 group-hover:text-cyan-300 clean-glow-cyan'
                    : 'text-[#f5d5ce] group-hover:text-white anomaly-glow-blood'
                }`}
              >
                {card.title}
              </h3>

              <p
                className={`text-[11px] font-semibold tracking-wide ${
                  opticsOn ? 'text-zinc-400' : 'text-[#9e807a]'
                }`}
              >
                {card.subtitle}
              </p>

              <p
                className={`text-xs leading-relaxed pt-1 font-mono ${
                  opticsOn ? 'text-zinc-400' : 'text-[#bfb2a3]'
                }`}
              >
                {card.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between">
              <span
                className={`text-xs font-bold tracking-widest uppercase transition-all ${
                  opticsOn
                    ? 'text-cyan-400 group-hover:translate-x-1 clean-glow-cyan'
                    : 'text-[#ff6666] group-hover:translate-x-1 anomaly-glow-blood'
                }`}
              >
                {card.cta}
              </span>
              <span
                className={`text-xs ${
                  opticsOn ? 'text-cyan-500' : 'text-[#ff1a1a]'
                } transition-transform group-hover:translate-x-1`}
              >
                &rarr;
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* STOPKA INFORMACYJNA PORTALU */}
      <footer
        className={`p-3 border text-center text-[11px] font-mono transition-colors ${
          opticsOn
            ? 'border-zinc-800 bg-[#0a0c12] text-zinc-500'
            : 'border-[#781414]/50 bg-[#070404] text-[#80605a]'
        }`}
      >
        <p>
          STATUS SYSTEMU: NOMINALNY // KLASTER SEKTOR-7 // ARCHIWUM ELEKTROFIZJOLOGICZNE (1994)
        </p>
        <p className="text-[10px] mt-0.5 opacity-75">
          Protokół badawczy nr 94/088. Pamięć podręczna rejestrów podlega okresowemu czyszczeniu.
        </p>
      </footer>
    </div>
  );
}
