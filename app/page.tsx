'use client';

import React from 'react';
import Link from 'next/link';
import { useSystemState } from '@/components/SystemStateContext';
import { soundEngine } from '@/lib/soundEngine';

export default function HomePage() {
  const { opticsOn, sanityStage } = useSystemState();
  const isDistorted = !opticsOn || sanityStage === 'insanity';

  const productCatalog = [
    {
      sku: 'CAT #NC-CA1-94',
      badge: 'BIOLOGICZNY MATERIAŁ PIERWOTNY',
      title: 'Primary CA1 Hippocampal Neuronal Cultures (CA1-TH Series)',
      description:
        'Kriokonserwowane pierwotne neurony piramidowe CA1 izolowane w procedurze stereotaktycznej. Zapewniają wysoką gęstość receptorów NMDA GluN2B, zachowaną kinetykę LTP oraz gotowość do testów elektrofizjologicznych.',
      features: ['99.4% żywotności synaptycznej', 'Zgodność z protokołem Sektor-7 (1994)', 'Format MEA-64 / 16K'],
      cta: 'Szczegóły Produktu',
    },
    {
      sku: 'CAT #NC-MEA-16K',
      badge: 'APARATURA ELEKTROFIZJOLOGICZNA',
      title: '16,384-Site Silicon Microelectrode Array (Thorne Substrate)',
      description:
        'Krzemowa matryca o ultra-wysokiej gęstości 16 384 platynowanych mikrosond. Umożliwia rejestrację lokalnych potencjałów polowych (LFP) i pojedynczych iglic z całego przekroju hipokampa z opóźnieniem poniżej 50 µs.',
      features: ['Średnica sondy 1.2 µm', 'Magistrala 66 MHz FPGA', 'Jednoczesne próbkowanie 10^5 neuronów'],
      cta: 'Specyfikacja Techniczna',
    },
    {
      sku: 'CAT #NC-ASSAY-EXC',
      badge: 'ZESTAW DIAGNOSTYCZNY',
      title: 'Glutamate Excitotoxicity & Calcium Influx Kinetic Assay',
      description:
        'Zintegrowany panel pomiaru masywnego wyrzutu glutaminianu, wyczerpania pompy sodowo-potasowej oraz indukcji porów mitochondrialnych mPTP. Niezbędny w badaniach neurodegeneracji i neuroprotekcji.',
      features: ['Fluorofory Fura-2 AM & FM1-43', 'Pomiary w czasie rzeczywistym', 'Kontrola desensytyzacji NMDA'],
      cta: 'Dokumentacja Panelu',
    },
    {
      sku: 'CAT #NC-PERF-S7',
      badge: 'KRIO-BUFOR SPECJALNY',
      title: 'Phenolic Engram Preservation Buffer (Reagent S7-1994)',
      description:
        'Opatentowany roztwór buforowanego krystalicznego fenolu do natychmiastowej fiksacji fosforylacji receptorowej i zamrażania konformacji kolców dendrytycznych w trakcie aktywnych rytmów theta.',
      features: ['Fiksacja w -15°C', 'Eliminacja rozpadu synaptycznego', 'Stabilizacja konektomu in situ'],
      cta: 'Karta Charakterystyki (MSDS)',
    },
  ];

  return (
    <div className="flex-1 flex flex-col space-y-12 font-sans">
      {/* 1. HERO SECTION (High-End Life Sciences / BioIVT Style) */}
      <section
        className={`rounded-2xl p-6 sm:p-10 md:p-14 border transition-all duration-300 relative overflow-hidden ${
          isDistorted
            ? 'bg-[#0a0505] border-[#781414] anomaly-border-blood text-[#e6c2b8]'
            : 'bg-gradient-to-b from-white to-slate-50 dark:from-[#111827] dark:to-[#0c101a] border-slate-200 dark:border-slate-800 shadow-sm'
        }`}
      >
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-300/60 dark:border-sky-800">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <span>AKREDYTOWANY DOSTAWCA PREPARATÓW NEURONALNYCH & KONEKTOMIKI</span>
          </div>

          <h1
            className={`text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight ${
              isDistorted ? 'text-red-400 anomaly-glow-blood font-mono' : 'text-slate-900 dark:text-white'
            }`}
          >
            Przełomowa Neuro-Diagnostyka & Zaawansowana Konektomika Komórkowa
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Dostarczamy certyfikowane hodowle pierwotne hipokampa, wielokanałowe krzemowe matryce mikroelektrodowe
            oraz autonomiczną platformę <strong>BioResearcher AI™</strong> do zaawansowanego modelowania biofizyki
            synaptycznej i plastyczności neuronowej.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/mail"
              onClick={() => soundEngine.playKeystroke()}
              className="px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <span>Poczta Wewnętrzna</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white text-amber-900 font-bold animate-pulse">
                1 PILNY
              </span>
            </Link>

            <Link
              href="/archive"
              onClick={() => soundEngine.playKeystroke()}
              className="px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <span>Archiwum Publikacji</span>
              <span>&rarr;</span>
            </Link>

            <Link
              href="/services"
              onClick={() => soundEngine.playKeystroke()}
              className="px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold tracking-wide transition-all border border-slate-300 dark:border-slate-700"
            >
              Usługi & Cennik B2B
            </Link>

            <Link
              href="/chat"
              onClick={() => soundEngine.playKeystroke()}
              className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold tracking-wide transition-all border ${
                isDistorted
                  ? 'bg-red-950 border-red-700 text-red-200 hover:bg-red-900 font-mono'
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              Bio-Chat AI
            </Link>
          </div>

          {/* Dyskretna notatka naukowa z elementem lore */}
          <div
            className={`mt-4 p-3 rounded-lg border text-xs leading-relaxed ${
              isDistorted
                ? 'bg-red-950/40 border-red-800 text-red-300 font-mono'
                : 'bg-slate-100/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              {isDistorted
                ? '[KOMUNIKAT DEGRADACJI KONEKTOMU // KLASTER THORNE’A]:'
                : 'Standard Zapewnienia Jakości Badań Neurofizjologicznych:'}
            </p>
            <p className="mt-0.5">
              {isDistorted
                ? 'Pomiary rejestrują nieodwracalną depolaryzację kolców CA1. Odnotowuje się samorzutne przepisywanie engramów pamięciowych z pominięciem bariery logicznej Sektora-7.'
                : 'Wszystkie serie preparatów komórkowych (w tym linia CA1-TH) podlegają weryfikacji potencjałów spoczynkowych (-70 mV) oraz kinetyki desensytyzacji receptorów NMDA pod nadzorem GLP/CLIA.'}
            </p>
          </div>
        </div>
      </section>

      {/* 2. METRYKI TELEMETRII I EFEKTYWNOŚCI LABORATORYJNEJ */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'KANIONY MIKROELEKTROD', value: '16 384', note: 'Rozdzielczość 50 µs / CA1-TH' },
          { label: 'STABILNOŚĆ POTENCJAŁU', value: '-70.4 mV', note: 'Pomiar w buforze aCSF' },
          { label: 'DOPASOWANIE KONEKTOMU', value: '99.4%', note: 'Próbkowanie w rytmie theta (40 Hz)' },
          { label: 'CERTYFIKACJA AUDYTU', value: 'GLP-94-B', note: 'Standardy laboratoryjne FDA/DoD' },
        ].map((metric, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border transition-all ${
              isDistorted
                ? 'bg-[#090505] border-[#781414] text-[#ffcccc] font-mono'
                : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 shadow-sm'
            }`}
          >
            <p className="text-[10px] font-mono tracking-wider uppercase text-slate-500 dark:text-slate-400">
              {metric.label}
            </p>
            <p className={`text-xl sm:text-2xl font-extrabold mt-1 ${isDistorted ? 'text-red-400' : 'text-sky-600 dark:text-sky-400'}`}>
              {metric.value}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">{metric.note}</p>
          </div>
        ))}
      </section>

      {/* 3. KATALOG PRODUKTÓW & USŁUG BADAWCZYCH */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b pb-3 border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Katalog Produktów Neuronowych & Zestawów Odczynników
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Certyfikowane preparaty biologiczne i mikromacierze stosowane w protokołach badawczych NeuroClin.
            </p>
          </div>
          <Link
            href="/archive"
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
          >
            Zobacz powiązane publikacje naukowe &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {productCatalog.map((prod) => (
            <div
              key={prod.sku}
              className={`rounded-xl p-5 sm:p-6 border flex flex-col justify-between transition-all duration-200 ${
                isDistorted
                  ? 'bg-[#090505] border-[#781414]/70 hover:border-red-600 text-[#d8cfbe]'
                  : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 hover:border-sky-400 shadow-sm'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                    {prod.badge}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">{prod.sku}</span>
                </div>

                <h3
                  className={`text-base font-bold tracking-tight ${
                    isDistorted ? 'text-red-300 font-mono' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {prod.title}
                </h3>

                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {prod.description}
                </p>

                <ul className="pt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {prod.features.map((feat, i) => (
                    <li key={i} className="flex items-center space-x-1.5">
                      <span className="text-sky-500 font-bold">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <Link
                  href="/archive"
                  onClick={() => soundEngine.playKeystroke()}
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 flex items-center space-x-1"
                >
                  <span>{prod.cta}</span>
                  <span>&rarr;</span>
                </Link>
                <Link
                  href="/chat"
                  onClick={() => soundEngine.playKeystroke()}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Zapytaj BioResearcher AI
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SEKCJA ZASOBÓW ARCHIWALNYCH & DOKUMENTACJI PROJEKTU SEKTOR-7 */}
      <section
        className={`rounded-xl p-6 sm:p-8 border transition-all ${
          isDistorted
            ? 'bg-[#0d0606] border-[#781414] text-red-200 font-mono'
            : 'bg-slate-50 dark:bg-[#0c101b] border-slate-200 dark:border-slate-800'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              KLAUZULA HISTORYCZNA // ARCHIWA 1991–1994
            </span>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Dossier Zespołu Mapowania Konektomu i Publikacje Dr. Arisa Thorne’a
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Poznaj oryginalne artykuły naukowe, protokoły mikroelektrodowe oraz dokumentację procedury transferu
              pamięci z lat 1991–1994. Wszystkie pozycje zawierają recenzowane abstrakty, parametry metodyki oraz
              autentyczne materiały ewidencyjne.
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <Link
              href="/archive"
              onClick={() => soundEngine.playKeystroke()}
              className="px-4 py-2.5 rounded-md bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold text-center tracking-wide transition-all shadow-sm"
            >
              Przejdź do Archiwum Publikacji &rarr;
            </Link>
            <Link
              href="/status"
              onClick={() => soundEngine.playKeystroke()}
              className="px-4 py-2 rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium text-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Diagnostyka Klastra Obliczeniowego
            </Link>
          </div>
        </div>
      </section>

      {/* 5. CERTYFIKACJA I STANDARDY BEZPIECZEŃSTWA DANYCH */}
      <section className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-[11px] text-slate-400">
          <span>ISO 9001:2015 ACCREDITED</span>
          <span>•</span>
          <span>GOOD LABORATORY PRACTICE (GLP)</span>
          <span>•</span>
          <span>CLIA CERTIFIED NEURO-ARRAY</span>
          <span>•</span>
          <span>BIOSAFETY LEVEL 3 FACILITY</span>
        </div>
        <p className="text-[11px] max-w-2xl mx-auto">
          NeuroClin Biosciences Inc. operuje zgodnie z międzynarodowymi normami bioetycznymi i procedurami ochrony
          danych biometrycznych. Wszystkie preparaty ludzkiego konektomu podlegają ścisłemu rejestrowi Sektor-7.
        </p>
      </section>
    </div>
  );
}
