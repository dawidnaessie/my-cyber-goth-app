'use client';

import React from 'react';
import Link from 'next/link';
import { useSystemState } from '@/components/SystemStateContext';
import { soundEngine } from '@/lib/soundEngine';

export default function HomePage() {
  const { opticsOn, sanityStage } = useSystemState();
  const isDistorted = !opticsOn || sanityStage === 'insanity';

  const solutions = [
    {
      sku: 'SOL-LCMS-01',
      badge: 'SPEKTROMETRIA MAS & CHROMATOGRAFIA',
      title: 'Profilowanie Farmakokinetyczne i Czystości (UHPLC-MS/MS)',
      description:
        'Wysokorozdzielcza identyfikacja metabolitów, analiza zanieczyszczeń śladowych oraz ilościowe oznaczenia stężeń substancji czynnych w matrycach biologicznych zgodnie z normami GLP.',
      features: [
        'Aparatura Triple Quad 6500+ i Q-TOF',
        'Granica wykrywalności (LOD) < 0.1 ng/ml',
        'Zgodność z wytycznymi ICH M10',
      ],
      cta: 'Poznaj Zakres Usług',
      href: '/services',
    },
    {
      sku: 'SOL-ASSAY-02',
      badge: 'ROZWÓJ TESTÓW IMMUNOCHEMICZNYCH',
      title: 'Projektowanie i Walidacja Testów Immunoassay (ELISA & Simoa)',
      description:
        'Wyprowadzanie zindywidualizowanych testów immunoenzymatycznych, multipleksowych paneli fluorescencyjnych oraz ultra-czułych oznaczeń pojedynczych cząsteczek białkowych.',
      features: [
        'Płytki 96- i 384-dołkowe z certyfikatem CV < 5%',
        'Testy krzyżowe swoistości epitopów',
        'Transfer technologii do fazy klinicznej',
      ],
      cta: 'Specyfikacja Walidacji',
      href: '/services',
    },
    {
      sku: 'SOL-GENOM-03',
      badge: 'ANALIZA EKSPRESJI GENÓW',
      title: 'Ilościowy Screening Genomowy (Targeted RNA-Seq & RT-qPCR)',
      description:
        'Kwantyfikacja ekspresji genów referencyjnych i celów terapeutycznych, kontrola czystości kwasów nukleinowych oraz profilowanie transkryptomiczne dla laboratoriów badawczo-rozwojowych.',
      features: [
        'Platformy cyfrowe QuantStudio i NovaSeq',
        'Automatyczna normalizacja do genów metabolizmu podstawowego',
        'Pełna dekonwolucja bioinformatyczna',
      ],
      cta: 'Konfiguracja Paneli',
      href: '/services',
    },
    {
      sku: 'SOL-SOFT-04',
      badge: 'OPROGRAMOWANIE ANALITYCZNE',
      title: 'Platforma BioResearcher Analytics Suite & Integracja LIMS',
      description:
        'Chmurowy system analityczny wspomagający interpretację kinetyki reakcji biochemicznych, regresję nieliniową parametrów Michaelisa-Menten oraz zarządzanie surowymi danymi laboratoryjnymi.',
      features: [
        'Zgodność ze standardem FDA 21 CFR Part 11',
        'Wbudowany moduł asystenta analitycznego BioResearcher AI',
        'Elektroniczny ślad audytowy (Audit Trail)',
      ],
      cta: 'Dostęp do Platformy',
      href: '/chat',
    },
  ];

  return (
    <div className="flex-1 flex flex-col space-y-12 font-sans">
      {/* 1. HERO SECTION: STERYLNY PORTAL B2B DLA NAUK O ŻYCIU */}
      <section
        className={`rounded-2xl p-6 sm:p-10 md:p-14 border transition-all duration-300 relative overflow-hidden ${
          isDistorted
            ? 'bg-[#0a0505] border-[#781414] anomaly-border-blood text-[#e6c2b8]'
            : 'bg-gradient-to-b from-white to-slate-50 dark:from-[#111827] dark:to-[#0c101a] border-slate-200 dark:border-slate-800 shadow-sm'
        }`}
      >
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-300/60 dark:border-sky-800">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span>AKREDYTOWANE LABORATORIUM ANALITYCZNE & PARTNER BADAWCZY</span>
          </div>

          <h1
            className={`text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight ${
              isDistorted ? 'text-red-400 anomaly-glow-blood font-mono' : 'text-slate-900 dark:text-white'
            }`}
          >
            Precyzyjne Usługi Bio-Analityczne & Oprogramowanie Life Sciences
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Dostarczamy akredytowane wsparcie w zakresie chromatografii cieczowej, spektrometrii mas,
            rozwoju testów immunochemicznych oraz zaawansowaną platformę obliczeniową{' '}
            <strong>BioResearcher Analytics Suite</strong> dla zespołów badawczych i przemysłu farmaceutycznego.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/services"
              onClick={() => soundEngine.playKeystroke()}
              className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <span>Przeglądaj Usługi Analityczne</span>
              <span>&rarr;</span>
            </Link>

            <Link
              href="/archive"
              onClick={() => soundEngine.playKeystroke()}
              className="px-5 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold tracking-wide transition-all border border-slate-300 dark:border-slate-700"
            >
              Baza Publikacji & Badań
            </Link>

            <Link
              href="/chat"
              onClick={() => soundEngine.playKeystroke()}
              className="px-5 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold tracking-wide transition-all"
            >
              Bio-Asystent AI
            </Link>

            <Link
              href="/mail"
              onClick={() => soundEngine.playKeystroke()}
              className="px-4 py-2.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 text-xs sm:text-sm font-medium transition-all"
            >
              Poczta Wewnętrzna
            </Link>
          </div>

          <div className="mt-4 p-3 rounded-lg border text-xs leading-relaxed bg-slate-100/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Gwarancja Integralności Danych i Standardów Analitycznych:
            </p>
            <p className="mt-0.5">
              Wszystkie procedury pomiarowe w naszych jednostkach analitycznych realizowane są zgodnie ze standardami
              Dobrej Praktyki Laboratoryjnej (GLP) oraz wytycznymi walidacyjnymi ISO/IEC 17025.
            </p>
          </div>
        </div>
      </section>

      {/* 2. METRYKI DZIAŁALNOŚCI LABORATORYJNEJ */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'ZGODNOŚĆ Z NORMĄ', value: 'ISO 17025', note: 'Pełna akredytacja procedur' },
          { label: 'PRZEPUSTOWOŚĆ ROCZNA', value: '> 2.4M', note: 'Analizowanych próbek i oznaczeń' },
          { label: 'WSKAŹNIK POWTARZALNOŚCI', value: '99.8%', note: 'Certyfikowane testy międzylaboratoryjne' },
          { label: 'OŚRODKI PARTNERSKIE', value: '450+', note: 'Laboratoria akademickie i biotechnologiczne' },
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

      {/* 3. KATALOG USŁUG I ROZWIĄZAŃ B2B */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b pb-3 border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Kluczowe Obszary Wsparcia Bio-Analitycznego
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Certyfikowane usługi kontraktowe i oprogramowanie dla laboratoriów life sciences.
            </p>
          </div>
          <Link
            href="/services"
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
          >
            Zobacz pełny cennik i kalkulator wyceny &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {solutions.map((sol) => (
            <div
              key={sol.sku}
              className={`rounded-xl p-5 sm:p-6 border flex flex-col justify-between transition-all duration-200 ${
                isDistorted
                  ? 'bg-[#090505] border-[#781414]/70 hover:border-red-600 text-[#d8cfbe]'
                  : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 hover:border-sky-400 shadow-sm'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                    {sol.badge}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">{sol.sku}</span>
                </div>

                <h3
                  className={`text-base font-bold tracking-tight ${
                    isDistorted ? 'text-red-300 font-mono' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {sol.title}
                </h3>

                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {sol.description}
                </p>

                <ul className="pt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {sol.features.map((feat, i) => (
                    <li key={i} className="flex items-center space-x-1.5">
                      <span className="text-sky-500 font-bold">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <Link
                  href={sol.href}
                  onClick={() => soundEngine.playKeystroke()}
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 flex items-center space-x-1"
                >
                  <span>{sol.cta}</span>
                  <span>&rarr;</span>
                </Link>
                <Link
                  href="/chat"
                  onClick={() => soundEngine.playKeystroke()}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Konsultuj z BioResearcher AI
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SEKCJA INFORMACJI O REPOZYTORIUM PUBLIKACJI */}
      <section className="rounded-xl p-6 sm:p-8 border transition-all bg-slate-50 dark:bg-[#0c101b] border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              ZASOBY WIEDZY NAUKOWEJ
            </span>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Baza Publikacji & Wyników Badań Laboratoryjnych NeuroClin
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Przeglądaj zindeksowane, recenzowane prace naukowe z zakresu farmakologii, biochemii,
              fizjologii komórkowej oraz immunologii publikowane we współpracy z naszymi analitykami.
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
              href="/blog"
              onClick={() => soundEngine.playKeystroke()}
              className="px-4 py-2 rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium text-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Aktualności & Komunikaty
            </Link>
          </div>
        </div>
      </section>

      {/* 5. CERTYFIKACJA I STANDARDY BEZPIECZEŃSTWA DANYCH */}
      <section className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-[11px] text-slate-400">
          <span>ISO 9001:2015 CERTIFIED</span>
          <span>•</span>
          <span>ISO/IEC 17025 ACCREDITED</span>
          <span>•</span>
          <span>GOOD LABORATORY PRACTICE (GLP)</span>
          <span>•</span>
          <span>FDA 21 CFR PART 11 COMPLIANT</span>
        </div>
        <p className="text-[11px] max-w-2xl mx-auto">
          NeuroClin Biosciences Inc. operuje zgodnie z międzynarodowymi normami jakości badań bioanalitycznych
          i procedurami walidacyjnymi. Wszelkie prawa zastrzeżone © 2026.
        </p>
      </section>
    </div>
  );
}
