'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSystemState } from './SystemStateContext';

export function ScientistPortrait() {
  const { opticsOn, sanityStage } = useSystemState();
  const [imgSrc, setImgSrc] = useState<string>('/images/aris.png');
  const [loadFailed, setLoadFailed] = useState<boolean>(false);
  const isDistorted = !opticsOn || sanityStage === 'insanity';

  const handleImageError = () => {
    if (imgSrc === '/images/aris.png') {
      setImgSrc('/images/aris.jpg');
    } else {
      setLoadFailed(true);
    }
  };

  return (
    <div
      className={`border p-4 max-w-sm mx-auto transition-all duration-300 relative select-none font-mono ${
        opticsOn
          ? 'bg-[#090b10] border-zinc-800 clean-border-glow text-zinc-300'
          : 'bg-[#0a0505] border-[#781414] anomaly-border-blood text-[#e6c2b8]'
      }`}
    >
      {/* NAGŁÓWEK AKT EWIDENCYJNYCH Z LAT 90. */}
      <div className="flex justify-between items-center pb-2 mb-3 border-b border-zinc-800/80 text-[10px] tracking-wider uppercase">
        <span className={opticsOn ? 'text-cyan-400 font-bold' : 'text-[#ff4d4d] font-bold'}>
          AKTA: #94-B-088 // THORNE, A.
        </span>
        <span
          className={`px-1.5 py-0.5 border text-[9px] ${
            isDistorted
              ? 'border-[#ff1a1a] text-[#ff8888] bg-[#781414]/30 anomaly-glow-blood'
              : 'border-zinc-700 text-zinc-400 bg-zinc-900/40'
          }`}
        >
          {isDistorted ? 'STATUS: KORUPCJA ENZYMATYCZNA' : 'EWIDENCJA OSOBOWA (1994)'}
        </span>
      </div>

      {/* RAMKA FOTOGRAFII: AUTENTYCZNE ZDJĘCIE W STYLU ARCHIWALNYM LAT 90. */}
      <div className="relative overflow-hidden border border-zinc-700/80 bg-black shadow-inner">
        <div className="relative w-full h-[380px] overflow-hidden bg-zinc-950 flex items-center justify-center">
          {!loadFailed ? (
            <Image
              src={imgSrc}
              alt="Dr. Aris Thorne - Fotografia ewidencyjna (1994)"
              fill
              sizes="(max-width: 640px) 100vw, 360px"
              priority
              unoptimized
              onError={handleImageError}
              className={`object-cover object-top transition-all duration-500 ${
                isDistorted
                  ? 'grayscale contrast-150 brightness-75 anomaly-chromatic'
                  : 'grayscale contrast-125 brightness-90 sepia-[0.15]'
              }`}
            />
          ) : (
            /* Awaryjny fallback na natywny tag img, gdyby Next Image z jakiegoś powodu zablokował zasób */
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src="/images/aris.png"
              alt="Dr. Aris Thorne - Fotografia ewidencyjna (1994)"
              className={`w-full h-full object-cover object-top ${
                isDistorted
                  ? 'grayscale contrast-150 brightness-75 anomaly-chromatic'
                  : 'grayscale contrast-125 brightness-90 sepia-[0.15]'
              }`}
            />
          )}

          {/* INTERLACED SCANLINES (LINIE MIKROFISZY) */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.6) 2px, rgba(0, 0, 0, 0.6) 4px)',
            }}
          />

          {/* WINIETA ANALOGOWA */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.85)]" />

          {/* STEMPEL ARCHIWALNY NA ZDJĘCIU */}
          <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/75 border border-zinc-700 text-[8px] text-zinc-400 font-bold uppercase tracking-widest pointer-events-none">
            ARCHIVE EVIDENCE // S-7
          </div>

          <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/80 border border-zinc-800 text-[8px] text-zinc-500 font-mono tracking-wider pointer-events-none">
            REC: 14-NOV-1994
          </div>
        </div>
      </div>

      {/* METRYKA FORMALNA NAUKOWCA */}
      <div className="mt-3 pt-2.5 border-t border-zinc-800/80">
        <div className="flex justify-between items-baseline">
          <p
            className={`text-xs md:text-sm font-bold tracking-wider transition-colors ${
              opticsOn ? 'text-zinc-100 clean-glow-cyan' : 'text-[#ffcccc] anomaly-glow-blood'
            }`}
          >
            Dr. Aris Thorne
          </p>
          <span className="text-[9px] text-zinc-500 font-mono">WIEK: 52 LATA</span>
        </div>

        <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">
          Kierownik Pracowni Elektrofizjologii Komórkowej
        </p>
        <p className="text-[9px] text-zinc-500 mt-0.5 uppercase tracking-wider">
          Instytut Neurobiologii Poznawczej // Sektor-7
        </p>

        {/* DANE STEREOTAKTYCZNE I REJESTRACYJNE (ORGANICZNE DANE ARCHIWALNE) */}
        <div
          className={`mt-2.5 p-2 border text-[10px] space-y-1 transition-colors ${
            opticsOn
              ? 'border-zinc-800/80 bg-zinc-950/40 text-zinc-400'
              : 'border-[#781414]/60 bg-[#781414]/20 text-[#f0b0a8]'
          }`}
        >
          <div className="flex justify-between">
            <span className="text-zinc-500">OBIEKT PROJEKTU:</span>
            <span className="text-zinc-300 font-bold">KONEKTOM CA1-TH</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">APARATURA SOND:</span>
            <span className="text-zinc-300 font-mono">16 384 MIKROELEKTRODY</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">OSTATNI ZAPIS ECoG:</span>
            <span className={isDistorted ? 'text-red-400 font-bold' : 'text-emerald-400 font-mono'}>
              {isDistorted ? 'ASYSTOLIA ELEKTRYCZNA' : 'DESYNCHRONIZACJA 40 Hz'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
