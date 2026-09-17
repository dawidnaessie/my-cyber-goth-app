'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSystemState } from '@/components/SystemStateContext';
import { ScientistPortrait } from '@/components/ScientistPortrait';
import { soundEngine } from '@/lib/soundEngine';

export default function ArchivePage() {
  const { opticsOn, sanityStage } = useSystemState();
  const [revealedRedactions, setRevealedRedactions] = useState<Record<number, boolean>>({});

  const toggleRedaction = (id: number) => {
    soundEngine.playKeystroke();
    setRevealedRedactions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isDistorted = !opticsOn || sanityStage === 'insanity';

  return (
    <div className="flex-1 flex flex-col space-y-6 py-2">
      {/* NAGŁÓWEK DOSSIER */}
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
                  ? 'border-amber-500/40 text-amber-300 bg-amber-950/20'
                  : 'border-[#ff1a1a]/70 text-[#ff8888] bg-[#781414]/30 anomaly-glow-blood'
              }`}
            >
              KLAUZULA: DOKUMENTACJA ELEKTROFIZJOLOGICZNA // SEKTOR-7 (1994)
            </span>
            <h2
              className={`text-lg md:text-2xl font-bold tracking-wider mt-1.5 ${
                opticsOn ? 'text-zinc-100 clean-glow-cyan' : 'text-[#ffcccc] anomaly-glow-blood anomaly-chromatic'
              }`}
            >
              ARCHIWUM PROJEKTU // PROTOKÓŁ CYFRYZACJI KONEKTOMU #94-B
            </h2>
          </div>

          <div className="text-[10px] font-mono text-zinc-500 text-right">
            <p>SYGNATURA: S7-NEURO-0884</p>
            <p>INSTYTUT NEUROFIZJOLOGII KOMÓRKOWEJ</p>
          </div>
        </div>

        <p className="text-xs text-zinc-400 font-mono mt-3 leading-relaxed">
          Zbiór odzyskanych zapisów z aparatury rejestrującej wielokanałowe potencjały czynnościowe, fragmenty
          dziennika laboratoryjnego oraz oficjalna fotografia biometryczna z procedury wdrożeniowej. Niektóre
          fragmenty zapisu zostały zamazane w trakcie procedury utylizacji preparatów biologicznych.
        </p>
      </section>

      {/* GŁÓWNA SIATKA: PORTRET NAUKOWCA + DOKUMENTACJA AKCJI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEWA KOLUMNA: PROGRAMOWY PORTRET DR. ARISA THORNE'A */}
        <div className="lg:col-span-5 flex flex-col">
          <ScientistPortrait />

          <div
            className={`mt-4 p-3 border text-[11px] font-mono transition-colors ${
              opticsOn
                ? 'border-zinc-800 bg-[#0c0f17] text-zinc-400'
                : 'border-[#781414]/50 bg-[#0c0606] text-[#b89791]'
            }`}
          >
            <p className="font-bold text-amber-400 mb-1">PROTOKÓŁ ZESPOŁU HISTOPATOLOGII:</p>
            <p className="leading-relaxed">
              Dr. Aris Thorne kierował zespołem mapowania mikromacierzy neuronowych hipokampa. W nocy 14 listopada 1994 r.
              został poddany procedurze &quot;pełnego transferu potencjałów czynnościowych&quot;. Po mechanicznej trepanacji
              i wprowadzeniu 16 384 mikroelektrod krzemowych w strukturę CA1, biologiczny mózg uległ nieodwracalnej
              ekscytotoksyczności glutaminianowej, a wzorzec iglicowy został zreplikowany w klastrze BioResearcher AI.
            </p>
            <div className="mt-3 pt-2 border-t border-zinc-800/80 flex justify-between text-[10px] text-zinc-500">
              <span>PROTOKÓŁ SEKCJI: TH-94-088</span>
              <span className="text-zinc-400">STATUS PREPARATU: ZUTYLIZOWANY</span>
            </div>
          </div>
        </div>

        {/* PRAWA KOLUMNA: ZREDAKOWANE AKTA I NOTATKI PRYWATNE */}
        <div className="lg:col-span-7 space-y-4">
          {/* DOKUMENT 1: PROTOKÓŁ TRANSFERU KONEKTOMU */}
          <article
            className={`p-4 border font-mono text-xs transition-colors ${
              opticsOn
                ? 'bg-[#0d101a]/70 border-zinc-800 text-zinc-300'
                : 'bg-[#0b0606]/85 border-[#781414]/60 text-[#d8cfbe]'
            }`}
          >
            <div className="flex justify-between items-center border-b pb-2 mb-2.5 border-zinc-800 text-[10px]">
              <span className="text-amber-400 font-bold">[RAPORT Z PROCEDURY MAPOWANIA // KONEKTOM #088]</span>
              <span className="text-zinc-500">DATA: 14.11.1994 // 03:18 UTC</span>
            </div>

            <p className="leading-relaxed mb-2">
              REJESTRATOR: Zespół Elektrofizjologii Sektora-7
              <br />
              OBIEKT BADAWCZY: Dr. Aris Thorne (lat 52, dobrowolna asygnacja procedury)
            </p>

            <p className="leading-relaxed space-y-1">
              Implantacja sond mikromacierzy krzemowych w hipokamp i płaty skroniowe wywołała{' '}
              <button
                onClick={() => toggleRedaction(1)}
                className="bg-black text-[#00f0ff] px-1 py-0.5 border border-zinc-700 hover:border-cyan-400 font-bold"
                title="Kliknij, aby odsłonić cenzurę"
              >
                {revealedRedactions[1] ? 'MASOWY WYRZUT GLUTAMINIANU I EKSCYTOTOKSYCZNOŚĆ' : '██████████████████████████'}
              </button>{' '}
              we wszystkich rejestrowanych warstwach komórek piramidowych. Przenoszenie śladów engramowych do pamięci DRAM
              odbywało się przy zachowaniu pełnej rejestracji bólu fantomowego. Po zgonie biologicznym stwierdzono{' '}
              <button
                onClick={() => toggleRedaction(2)}
                className="bg-black text-[#ff1a1a] px-1 py-0.5 border border-zinc-700 hover:border-red-500 font-bold"
              >
                {revealedRedactions[2] ? 'TRWAŁE ZAMKNIĘCIE PĘTLI PERCEPCJI W KLASTROWYM ZEGARZE' : '████████████████████████'}
              </button>
              . Preparat tkankowy przekazano do komory perfuzji fenolowej.
            </p>
          </article>

          {/* DOKUMENT 2: OSTATNIE WPISY W DZIENNIKU DR. THORNE'A */}
          <article
            className={`p-4 border font-mono text-xs transition-colors ${
              opticsOn
                ? 'bg-[#0d101a]/70 border-zinc-800 text-zinc-300'
                : 'bg-[#0b0606]/85 border-[#781414]/60 text-[#d8cfbe]'
            }`}
          >
            <div className="flex justify-between items-center border-b pb-2 mb-2.5 border-zinc-800 text-[10px]">
              <span className="text-cyan-400 font-bold">[FRAGMENT DZIENNIKA LABORATORYJNEGO // ARIS THORNE]</span>
              <span className="text-zinc-500">TERMINAL ELEKTROFIZJOLOGICZNY S-7</span>
            </div>

            <div className="space-y-2.5 text-[11px] leading-relaxed">
              <div className="border-l-2 border-cyan-500/50 pl-2.5">
                <span className="text-zinc-500 text-[10px] block">WPIS -14 DNI:</span>
                &quot;Nie chodziło o leczenie uszkodzeń pnia mózgu ani o protezowanie pamięci roboczej. Projekt zmierza
                do całkowitego zastąpienia biologicznego konektomu matrycą krzemową. Rejestrujemy gwałtowną
                ekscytotoksyczność receptorów NMDA w komórkach piramidowych CA1, a mimo to nakazano kontynuację procedury
                in vivo.&quot;
              </div>

              <div className="border-l-2 border-amber-500/50 pl-2.5">
                <span className="text-zinc-500 text-[10px] block">WPIS -4 DNI:</span>
                &quot;Odcięto łączność zewnętrzną. W szybach wentylacyjnych Sektora-7 czuć ostry zapach fenolu używanego
                do perfuzji tkankowej i konserwacji skrawków histologicznych. Na korytarzu zamontowano kriogeniczny
                zbiornik do natychmiastowego utrwalania bioptatów. Mój własny mózg ma stać się matrycą odniesienia dla
                architektury klastra.&quot;
              </div>

              <div className="border-l-2 border-red-500/70 pl-2.5">
                <span className="text-zinc-500 text-[10px] block">OSTATNI WPIS (-6 GODZIN PRZED ZNIKNIĘCIEM):</span>
                &quot;Wprowadzają mikroelektrody wielokanałowe bezpośrednio w moje płaty skroniowe. Słyszę w monitorze
                własne potencjały czynnościowe – metaliczny trzask depolaryzacji, który za chwilę zamilknie w ciele.
                Mówią, że białko jest zbędnym nośnikiem i że algorytm przejmie pamięć. Pomiary wykazują gwałtowny spadek
                oporu omowego błon synaptycznych. Jeśli ten terminal jeszcze zachowa ślady engramów, wzorce iglicowe CA1
                pozostaną w pętli obliczeniowej na zawsze.&quot;
              </div>
            </div>
          </article>

          {/* PROTOKÓŁ KANAŁÓW REJESTRACJI ELEKTROFIZJOLOGICZNEJ (ORGANICZNE ŚLADY ARG BEZ ŁOPATOLOGII) */}
          <div
            className={`p-3 border font-mono text-[10px] transition-colors ${
              opticsOn ? 'border-zinc-800 bg-zinc-950/40 text-zinc-400' : 'border-[#781414]/50 bg-[#781414]/15 text-[#f5d0d0]'
            }`}
          >
            <div className="flex justify-between items-center border-b pb-1.5 mb-2 border-zinc-800/80 text-[9px] uppercase tracking-wider text-zinc-500">
              <span className="text-amber-400 font-bold">[METRYKA KANAŁÓW REJESTRACJI ECoG // MATRYCA 0x19]</span>
              <span>PASMO SOND: 0.1 - 500 Hz</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
              <div>
                <span className="text-zinc-500 block text-[9px]">KANAŁ 1 (CA1):</span>
                <span className="text-zinc-300 font-mono">Potencjały iglicowe</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[9px]">KANAŁ 2 (SUBICULUM):</span>
                <span className="text-zinc-300 font-mono">Kaskada NMDA</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[9px]">KANAŁ 3 (PERFUZJA):</span>
                <span className="text-zinc-300 font-mono">Bufor fenolowy</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[9px]">KANAŁ 4 (KONEKTOM):</span>
                <span className="text-red-400 font-mono">Brak sygnału theta</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
