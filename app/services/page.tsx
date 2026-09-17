'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSystemState } from '@/components/SystemStateContext';
import { soundEngine } from '@/lib/soundEngine';

interface AssayService {
  id: string;
  name: string;
  category: 'Biomarkery' | 'Genomika' | 'Elektrofizjologia' | 'Modele 3D' | 'Obrazowanie';
  basePriceUsd: number;
  unit: string;
  turnaroundDays: number;
  description: string;
  specifications: string[];
  recommendedFor: string;
}

const ASSAYS_CATALOG: AssayService[] = [
  {
    id: 'assay-exosome',
    name: 'Izolacja Egzosomów i Analiza NTA (Exosome Profiling)',
    category: 'Biomarkery',
    basePriceUsd: 1850,
    unit: 'seria 10 próbek osocza/CSF',
    turnaroundDays: 7,
    description:
      'Wysokooczyszczona frakcjonacja pęcherzyków zewnątrzkomórkowych metodą SEC połączona z Nanoparticle Tracking Analysis (NTA) oraz immuno-oznaczaniem markerów neurodegeneracji.',
    specifications: [
      'Detekcja tetraspanin: CD9, CD63, CD81',
      'Pomiar stężenia p-tau217 oraz oligomerów amyloid-β42',
      'Rozdzielczość wielkości cząstek: 30–800 nm',
    ],
    recommendedFor: 'Diagnostyka wczesnych stadiów chorób otępiennych i monitorowanie terapii monoklonalnych.',
  },
  {
    id: 'assay-ddpcr',
    name: 'Wysokoprzepustowy Digital Droplet PCR (ddPCR Screening)',
    category: 'Genomika',
    basePriceUsd: 920,
    unit: 'płytka 96-dołkowa',
    turnaroundDays: 5,
    description:
      'Absolutna kwantyfikacja kopii kwasów nukleinowych bez konieczności stosowania krzywych wzorcowych. Skrajna czułość wykrywania mutacji w genach APP, PSEN1, MAPT oraz alleli APOE.',
    specifications: [
      'Generowanie do 20 000 kropli emulsyjnych na dołek',
      'Czułość analityczna: 0.001% zmutowanych alleli',
      'Panel multipleksowy: APOE-ε4 / MAPT / SNCA',
    ],
    recommendedFor: 'Screening genetyczny pacjentów w badaniach klinicznych fazy I–III.',
  },
  {
    id: 'assay-hd-mea',
    name: 'Elektrofizjologia HD-MEA (16 384 Mikrosondy Krzemowe)',
    category: 'Elektrofizjologia',
    basePriceUsd: 4500,
    unit: 'eksperyment 48h in vitro',
    turnaroundDays: 10,
    description:
      'Wielkoskalowe mapowanie lokalnych potencjałów polowych (LFP) i wyładowań jednostkowych w żywych preparatach neuronalnych CA1 oraz organoidach kory mózgowej z rozdzielczością poniżej 50 µs.',
    specifications: [
      'Gęstość elektrod: 3 150 elektrod / mm²',
      'Równoległa rejestracja do 16 384 kanałów ze sprzężeniem stałoprądowym',
      'Analiza rytmów theta (4–8 Hz) oraz oscylacji gamma (40 Hz)',
    ],
    recommendedFor: 'Badania neurotoksyczności, fiksacji synaptycznej i kinetyki bloku magnezowego NMDA.',
  },
  {
    id: 'assay-organoids',
    name: 'Hodowla i Różnicowanie Organoidów Kory Mózgowej (3D iPSC)',
    category: 'Modele 3D',
    basePriceUsd: 6200,
    unit: 'partia 6 organoidów (cykl 60 dni)',
    turnaroundDays: 60,
    description:
      'Generowanie trójwymiarowych sferoidów neuronalnych z komórek iPSC pacjentów. Modelowanie architektury kory czołowej i formacji hipokampa z zachowaniem spontanicznej synchronizacji synaps.',
    specifications: [
      'Ekspresja markerów: NeuN, MAP2, GFAP, vGlut1',
      'Formowanie funkcjonalnych mikrokolumn neuronalnych',
      'Możliwość integracji z matrycą mikrosond krzemowych',
    ],
    recommendedFor: 'Testowanie leków modulujących plastyczność i mechanizmy naprawy neurodegeneracji.',
  },
  {
    id: 'assay-scrna',
    name: 'Transkryptomika Pojedynczych Komórek (scRNA-seq 10x Genomics)',
    category: 'Genomika',
    basePriceUsd: 3400,
    unit: 'biblioteka 10 000 komórek',
    turnaroundDays: 14,
    description:
      'Pojedynczokomórkowe profilowanie transkryptomu tkanki mózgowej i kultur organotypowych. Identyfikacja subpopulacji mikrogleju zaangażowanego w degradację blaszek amyloidowych przez szlak TREM2.',
    specifications: [
      'Głębokość sekwencjonowania: 50 000 odczytów / komórkę',
      'Pełna dekonwolucja fenotypów mikrogleju (M1 vs. M2 / DAM)',
      'Mapowanie ekspresji podjednostek receptora NMDA (GluN2A / GluN2B)',
    ],
    recommendedFor: 'Określanie celów molekularnych dla immunoterapii neurozapalenia.',
  },
  {
    id: 'assay-calcium',
    name: 'Dynamiczne Obrazowanie Wapniowe Live-Cell (Fura-2 AM)',
    category: 'Obrazowanie',
    basePriceUsd: 1250,
    unit: 'seria 5 rejestracji dynamicznych',
    turnaroundDays: 4,
    description:
      'Kwantyfikacja napływu jonów Ca²⁺ w somie neuronów piramidowych podczas stymulacji agonistami receptorów glutaminianowych. Pomiary kinetyki powrotu do homeostazy i ryzyka ekscytotoksyczności.',
    specifications: [
      'Ratiometryczny wskaźnik Fura-2 AM (340/380 nm)',
      'Rejestracja w warstwach CA1 hipokampa',
      'Wyznaczanie stałych czasowych usuwania wapnia (τ_Ca)',
    ],
    recommendedFor: 'Weryfikacja bezpieczeństwa nowych cząsteczek blokujących receptory NMDA.',
  },
];

export default function ServicesPage() {
  const { opticsOn, sanityStage } = useSystemState();
  const isDistorted = !opticsOn || sanityStage === 'insanity';

  const [selectedAssayIds, setSelectedAssayIds] = useState<string[]>(['assay-exosome', 'assay-hd-mea']);
  const [sampleMultiplier, setSampleMultiplier] = useState<number>(1);
  const [turnaroundTier, setTurnaroundTier] = useState<'standard' | 'express' | 'rush'>('standard');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [orderConfirmation, setOrderConfirmation] = useState<string | null>(null);

  const toggleSelectAssay = (id: string) => {
    soundEngine.playKeystroke();
    setSelectedAssayIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const turnaroundMultiplier = turnaroundTier === 'rush' ? 1.5 : turnaroundTier === 'express' ? 1.25 : 1.0;

  const totalBasePrice = selectedAssayIds.reduce((sum, id) => {
    const assay = ASSAYS_CATALOG.find((a) => a.id === id);
    return sum + (assay ? assay.basePriceUsd : 0);
  }, 0);

  const calculatedTotal = Math.round(totalBasePrice * sampleMultiplier * turnaroundMultiplier);

  const handlePlaceOrder = () => {
    soundEngine.playKeystroke();
    const quoteId = `RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}-NC`;
    setOrderConfirmation(quoteId);
    setModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 font-sans">
      {/* HEADER USŁUG */}
      <section
        className={`p-5 md:p-7 rounded-xl border transition-all ${
          isDistorted
            ? 'bg-[#090505] border-[#781414] anomaly-border-blood text-[#e6c2b8]'
            : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 shadow-sm'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
              <Link href="/" className="hover:text-sky-600">Home</Link>
              <span>&gt;</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Usługi Badawcze B2B</span>
            </div>
            <h1
              className={`text-xl md:text-2xl font-extrabold tracking-tight ${
                isDistorted ? 'text-red-400 font-mono anomaly-glow-blood' : 'text-slate-900 dark:text-white'
              }`}
            >
              USŁUGI BADAWCZE & ASSAYE KONTRAKTOWE (CRO)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-sans">
              Akredytowane procedury analityczne: izolacja egzosomów, screening mikromacierzowy HD-MEA oraz zaawansowane hodowle organoidów mózgowych.
            </p>
          </div>

          <div className="text-right text-xs font-mono text-slate-500 space-y-0.5">
            <p className="font-bold text-sky-600 dark:text-sky-400">AKREDYTACJA GLP / CLIA / ISO 9001</p>
            <p>Laboratoria: Cambridge / Basel</p>
          </div>
        </div>

        {/* METRYKI LABORATORYJNE */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
          <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <p className="text-[10px] text-slate-500 font-mono">Dostępność Macierzy HD-MEA:</p>
            <p className="font-bold text-slate-800 dark:text-slate-200">16 384 Kanały // Gotowe</p>
          </div>
          <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <p className="text-[10px] text-slate-500 font-mono">Czystość Egzosomów:</p>
            <p className="font-bold text-emerald-600 dark:text-emerald-400">&gt; 98.6% SEC-NTA</p>
          </div>
          <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <p className="text-[10px] text-slate-500 font-mono">Zgodność Regulacyjna:</p>
            <p className="font-bold text-slate-800 dark:text-slate-200">FDA 21 CFR Part 58</p>
          </div>
          <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <p className="text-[10px] text-slate-500 font-mono">Bioreaktory CA1-TH:</p>
            <p className="font-bold text-sky-600 dark:text-sky-400">Aktywny monitoring 24/7</p>
          </div>
        </div>
      </section>

      {/* GŁÓWNA SEKCJA: KATALOG ASSAYÓW + KALKULATOR ZAMÓWIENIA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEWA KOLUMNA: KATALOG USŁUG */}
        <section className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Dostępne Procedury Analityczne ({ASSAYS_CATALOG.length})
            </h2>
            <span className="text-xs text-slate-500">Zaznacz assaye, aby obliczyć szacunkowy koszt</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ASSAYS_CATALOG.map((assay) => {
              const isSelected = selectedAssayIds.includes(assay.id);

              return (
                <div
                  key={assay.id}
                  onClick={() => toggleSelectAssay(assay.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between select-none ${
                    isSelected
                      ? isDistorted
                        ? 'bg-red-950/60 border-red-700 text-red-100 shadow-md'
                        : 'bg-sky-50/90 dark:bg-sky-950/50 border-sky-400 dark:border-sky-600 text-slate-900 dark:text-white shadow-md'
                      : isDistorted
                      ? 'bg-[#090505] border-[#781414]/50 hover:border-red-800 text-red-300'
                      : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {assay.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
                        <span className="text-sky-600 dark:text-sky-400">${assay.basePriceUsd}</span>
                        <span className="text-slate-400 font-normal">/ {assay.unit}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-sm leading-snug">{assay.name}</h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {assay.description}
                    </p>

                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 space-y-1 text-[11px] font-mono">
                      {assay.specifications.map((spec, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-slate-500 dark:text-slate-400">
                          <span className="text-sky-500">✓</span>
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">
                      Czas realizacji: ~{assay.turnaroundDays} dni roboczych
                    </span>
                    <button
                      type="button"
                      className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                        isSelected
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? '✓ Wybrano' : '+ Dodaj do wyceny'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* PRAWA KOLUMNA: INTERAKTYWNY KALKULATOR ZAPOTRZEBOWANIA */}
        <aside className="lg:col-span-4 space-y-4">
          <div
            className={`p-5 rounded-xl border sticky top-24 space-y-4 ${
              isDistorted
                ? 'bg-[#0a0505] border-[#781414] anomaly-border-blood font-mono'
                : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 shadow-sm'
            }`}
          >
            <div className="border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm tracking-wide text-slate-900 dark:text-white uppercase font-sans">
                KALKULATOR BADAŃ KONTRAKTOWYCH
              </h3>
              <p className="text-[11px] text-slate-500">
                Natychmiastowe oszacowanie budżetu projektu B2B
              </p>
            </div>

            {/* LISTA WYBRANYCH USŁUG */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Wybrane pozycje ({selectedAssayIds.length}):
              </label>
              {selectedAssayIds.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Brak wybranych pozycji z katalogu.</p>
              ) : (
                <ul className="space-y-1.5 max-h-40 overflow-y-auto pr-1 text-xs">
                  {selectedAssayIds.map((id) => {
                    const item = ASSAYS_CATALOG.find((a) => a.id === id);
                    if (!item) return null;
                    return (
                      <li
                        key={id}
                        className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                      >
                        <span className="line-clamp-1 flex-1 mr-2 text-[11px] font-medium">{item.name}</span>
                        <span className="font-mono font-bold text-sky-600 dark:text-sky-400 text-xs shrink-0">
                          ${item.basePriceUsd}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* LICZBA PRÓBEK / SERII */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Mnożnik Próbek / Kohort:</span>
                <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{sampleMultiplier}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={sampleMultiplier}
                onChange={(e) => setSampleMultiplier(parseInt(e.target.value, 10))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1 seria (pilot)</span>
                <span>5 serii</span>
                <span>10 serii (badanie kliniczne)</span>
              </div>
            </div>

            {/* TRYB REALIZACJI */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Tryb Przetwarzania i Standard Kontroli:
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setTurnaroundTier('standard')}
                  className={`p-2 rounded border text-center transition-all ${
                    turnaroundTier === 'standard'
                      ? 'bg-sky-600 text-white font-semibold border-sky-600'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <p className="font-bold text-[11px]">Standard</p>
                  <p className="text-[9px] opacity-80">+0%</p>
                </button>
                <button
                  type="button"
                  onClick={() => setTurnaroundTier('express')}
                  className={`p-2 rounded border text-center transition-all ${
                    turnaroundTier === 'express'
                      ? 'bg-sky-600 text-white font-semibold border-sky-600'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <p className="font-bold text-[11px]">Express</p>
                  <p className="text-[9px] opacity-80">+25%</p>
                </button>
                <button
                  type="button"
                  onClick={() => setTurnaroundTier('rush')}
                  className={`p-2 rounded border text-center transition-all ${
                    turnaroundTier === 'rush'
                      ? 'bg-sky-600 text-white font-semibold border-sky-600'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <p className="font-bold text-[11px]">GLP Rush 48h</p>
                  <p className="text-[9px] opacity-80">+50%</p>
                </button>
              </div>
            </div>

            {/* PODSUMOWANIE FINANSOWE */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Koszty analityczne netto:</span>
                <span className="font-mono font-semibold">${totalBasePrice * sampleMultiplier}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Dopłata za tryb ({turnaroundTier}):</span>
                <span className="font-mono font-semibold">
                  +${Math.round(totalBasePrice * sampleMultiplier * (turnaroundMultiplier - 1))}
                </span>
              </div>

              <div className="pt-2 border-t border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white uppercase font-sans">
                  SZACOWANY KOSZT BADANIA:
                </span>
                <span className="text-lg font-bold font-mono text-sky-600 dark:text-sky-400">
                  ${calculatedTotal.toLocaleString()} USD
                </span>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={selectedAssayIds.length === 0}
                className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white text-xs font-semibold tracking-wider transition-colors shadow-sm mt-3"
              >
                GENERUJ ZAPYTANIE OFERTOWE / ZAMÓWIENIE &rarr;
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* MODAL POTWIERDZENIA ZAMÓWIENIA */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <h3 className="font-bold text-sm tracking-wide text-slate-900 dark:text-white">
                  ZLECENIE BADAŃ PRZYJĘTE // GLP-NC
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 font-sans">
              <p>
                Dziękujemy za złożenie zapytania ofertowego w <strong>NeuroClin Biosciences Inc.</strong>
              </p>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700 font-mono text-xs space-y-1">
                <p>
                  Numer Zlecenia: <strong className="text-sky-600 dark:text-sky-400">{orderConfirmation}</strong>
                </p>
                <p>Wybranych pozycji: {selectedAssayIds.length}</p>
                <p>Szacunkowy budżet: ${calculatedTotal.toLocaleString()} USD</p>
                <p>Tryb: {turnaroundTier.toUpperCase()} // GLP Validated</p>
              </div>
              <p className="text-[11px] text-slate-500">
                Potwierdzenie wraz z protokołem transferu materiału biologicznego (MTA) oraz numerem partii zostało wygenerowane. Nasz koordynator skontaktuje się w ciągu 2 godzin roboczych.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-md transition-colors"
              >
                Zamknij & Powrót do Portalu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
