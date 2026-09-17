'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSystemState } from './SystemStateContext';

export function ScientistPortrait({ compact = false }: { compact?: boolean }) {
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
      className={`border rounded-lg p-4 transition-all duration-300 relative select-none ${
        isDistorted
          ? 'bg-[#0a0505] border-[#781414] anomaly-border-blood text-[#e6c2b8] font-mono'
          : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-sm font-sans'
      } ${compact ? 'max-w-xs' : 'max-w-sm mx-auto'}`}
    >
      {/* NAGŁÓWEK DOSSIER */}
      <div className="flex justify-between items-center pb-2.5 mb-3 border-b border-slate-200 dark:border-slate-800 text-xs">
        <span
          className={`font-bold tracking-wider ${
            isDistorted ? 'text-red-400 font-mono' : 'text-sky-600 dark:text-sky-400'
          }`}
        >
          {isDistorted ? 'AKTA: #94-B-088 // THORNE, A.' : 'REJESTR ARCHIWALNY // DOSSIER'}
        </span>
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
            isDistorted
              ? 'bg-red-950 text-red-300 border border-red-800 anomaly-glow-blood font-mono'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
          }`}
        >
          {isDistorted ? 'STATUS: UWIĘZIONY' : 'DOKUMENTACJA Z 1994 R.'}
        </span>
      </div>

      {/* RAMKA FOTOGRAFII Z PUBLIC/IMAGES/ARIS */}
      <div className="relative overflow-hidden rounded border border-slate-300 dark:border-slate-700 bg-black shadow-inner">
        <div className="relative w-full h-[300px] overflow-hidden bg-slate-950 flex items-center justify-center">
          {!loadFailed ? (
            <Image
              src={imgSrc}
              alt="Dr. Aris Thorne - Fotografia archiwalna (1994)"
              fill
              sizes="(max-width: 640px) 100vw, 360px"
              priority
              unoptimized
              onError={handleImageError}
              className={`object-cover object-top transition-all duration-500 ${
                isDistorted
                  ? 'grayscale contrast-150 brightness-75 anomaly-chromatic'
                  : 'grayscale contrast-110 brightness-95 hover:grayscale-0'
              }`}
            />
          ) : (
            /* Awaryjny fallback na natywny tag img */
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src="/images/aris.png"
              alt="Dr. Aris Thorne - Fotografia archiwalna (1994)"
              className={`w-full h-full object-cover object-top ${
                isDistorted
                  ? 'grayscale contrast-150 brightness-75 anomaly-chromatic'
                  : 'grayscale contrast-110 brightness-95'
              }`}
            />
          )}

          {/* EFEKTY WIDOCZNE W STANIE DISTORTED / ANOMALII */}
          {isDistorted && (
            <>
              <div
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.7) 2px, rgba(0, 0, 0, 0.7) 4px)',
                }}
              />
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.85)]" />
              <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/85 border border-red-800 text-[8px] text-red-300 font-mono uppercase tracking-widest pointer-events-none">
                EVIDENCE 94-088 // S-7
              </div>
            </>
          )}

          {!isDistorted && (
            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded text-[9px] text-slate-200 font-mono">
              FOTOGRAFIA ARCHIWALNA // 14.11.1994
            </div>
          )}
        </div>
      </div>

      {/* METRYKA FORMALNA NAUKOWCA */}
      <div className="mt-3.5 pt-3 border-t border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-baseline">
          <h3
            className={`font-bold text-sm tracking-wide ${
              isDistorted ? 'text-red-300 anomaly-glow-blood font-mono' : 'text-slate-900 dark:text-white'
            }`}
          >
            Dr. Aris Thorne, Ph.D.
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">1942–1994</span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
          Kierownik Zespołu Badań Doświadczalnych
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
          Pracownia Elektrofizjologii // Sektor-7
        </p>

        <div
          className={`mt-3 p-2.5 rounded text-[11px] leading-relaxed transition-colors ${
            isDistorted
              ? 'bg-red-950/40 border border-red-800/80 text-red-200 font-mono'
              : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          {isDistorted ? (
            <div>
              <p className="font-bold text-red-400 mb-1">[SYGNALIZACJA DEKOHERENCJI]:</p>
              <p>
                Ciągła dekoherencja sygnału neuronalnego zarejestrowana w węźle obliczeniowym.
                Zanotowano nieautoryzowaną aktywność pasma kognitywnego odpowiadającą wzorcowi Thorne&apos;a.
              </p>
            </div>
          ) : (
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Karta Informacyjna Archiwum:
              </p>
              <p>
                Prowadził badania nad wielokanałową rejestracją potencjałów błonowych w mikrosieciach neuronalnych.
                Ostatni raport badawczy zarejestrowano 14 listopada 1994 r. przed zamknięciem placówki.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
