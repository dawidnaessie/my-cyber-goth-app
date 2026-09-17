'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSystemState } from '@/components/SystemStateContext';
import { soundEngine } from '@/lib/soundEngine';

interface AnalyticalService {
  id: string;
  name: string;
  category: 'Chromatografia & Spektrometria' | 'Immunochemia & Testy Biochemiczne' | 'Biologia Molekularna & Genomika' | 'Kinetyka & Biofizyka' | 'Testy Komórkowe In Vitro';
  basePriceUsd: number;
  unit: string;
  turnaroundDays: number;
  description: string;
  specifications: string[];
  recommendedFor: string;
}

const ANALYTICAL_SERVICES: AnalyticalService[] = [
  {
    id: 'serv-lcms',
    name: 'Wysokorozdzielcza Spektrometria Mas & Chromatografia (UHPLC-MS/MS)',
    category: 'Chromatografia & Spektrometria',
    basePriceUsd: 1450,
    unit: 'seria do 20 próbek',
    turnaroundDays: 5,
    description:
      'Kwantyfikacja farmakokinetyczna, analiza zanieczyszczeń śladowych, profilowanie metabolitów oraz oznaczenia czystości chemicznej API w złożonych matrycach biologicznych zgodnie z GLP.',
    specifications: [
      'Platformy Sciex Triple Quad 6500+ oraz Agilent 1290 Infinity II UHPLC',
      'Granica oznaczalności (LOQ) poniżej 0.05 ng/mL dla większości analitów',
      'Pełna walidacja metodyki zgodnie z wytycznymi ICH M10 / FDA',
    ],
    recommendedFor: 'Badania biodostępności, transfery analityczne oraz kontrola jakości formulacji farmaceutycznych.',
  },
  {
    id: 'serv-immunoassay',
    name: 'Rozwój i Walidacja Testów Immunoenzymatycznych (ELISA & Simoa HD-X)',
    category: 'Immunochemia & Testy Biochemiczne',
    basePriceUsd: 1200,
    unit: 'płytka 96-dołkowa / seria Simoa',
    turnaroundDays: 6,
    description:
      'Opracowywanie czułych testów kanapkowych (sandwich ELISA), multipleksowych paneli fluorescencyjnych oraz ultra-czułych oznaczeń pojedynczych cząsteczek białkowych (Simoa) w surowicy, osoczu i lizatach.',
    specifications: [
      'Precyzja wewnątrzseryjna CV < 4.5%, międzyseryjna CV < 8.0%',
      'Minimalna objętość próbki: 15 µL matrycy',
      'Testy specyficzności krzyżowej i interferencji endogennych',
    ],
    recommendedFor: 'Ilościowe monitorowanie markerów biologicznych w fazie przedklinicznej i klinicznej.',
  },
  {
    id: 'serv-rna-seq',
    name: 'Targetowane Profilowanie Ekspresji Genów (Targeted RNA-Seq & RT-qPCR)',
    category: 'Biologia Molekularna & Genomika',
    basePriceUsd: 980,
    unit: 'panel 24 próbek (do 96 celów)',
    turnaroundDays: 7,
    description:
      'Ilościowa analiza transkryptomiczna metodą cyfrowego droplet PCR (ddPCR) oraz sekwencjonowania celowanego. Precyzyjna normalizacja do stabilnych genów referencyjnych.',
    specifications: [
      'Aparatura Bio-Rad QX200 ddPCR oraz Applied Biosystems QuantStudio 7',
      'Wykrywanie zmian ekspresji od poziomu 1.2-krotnej zmiany (fold change)',
      'Automatyczny raport bioinformatyczny z analizą $\\Delta\\Delta C_t$',
    ],
    recommendedFor: 'Weryfikacja celów terapeutycznych, badania wyciszania genów (siRNA/CRISPR) oraz screening transkryptomiczny.',
  },
  {
    id: 'serv-spr-kinetics',
    name: 'Kinetyka Wiązań Molekularnych w Czasie Rzeczywistym (Biacore T200 SPR)',
    category: 'Kinetyka & Biofizyka',
    basePriceUsd: 2100,
    unit: 'analiza interakcji ligand-receptor (chip CM5)',
    turnaroundDays: 4,
    description:
      'Bezznacznikowy pomiar stałych kinetycznych asocjacji ($k_a$), dysocjacji ($k_d$) oraz stałej równowagi ($K_D$) zjawiska wiązania przeciwciał, aptamerów i drobnocząsteczkowych inhibitorów do białek docelowych.',
    specifications: [
      'Zakres oznaczania $K_D$: od 1 pM do 1 mM',
      'Termostatowanie celi pomiarowej w zakresie 4–45°C',
      'Dopasowanie nieliniowe do modelu wiązania 1:1 Langmuira',
    ],
    recommendedFor: 'Selekcja wiodących cząsteczek leczniczych, charakterystyka epitopowa przeciwciał monoklonalnych.',
  },
  {
    id: 'serv-cytotox',
    name: 'Testy Żywotności Komórkowej & Modele Przepuszczalności In Vitro',
    category: 'Testy Komórkowe In Vitro',
    basePriceUsd: 850,
    unit: 'panel 3 stężeń / 4 linie komórkowe',
    turnaroundDays: 5,
    description:
      'Standardowe panele oceny cytotoksyczności komórkowej (test MTT, uwalnianie LDH, fluorymetryczny pomiar ATP CellTiter-Glo) oraz badania transportu przez barierę nabłonkową w komorach Transwell (Caco-2 / MDCK).',
    specifications: [
      'Wyznaczanie wartości $IC_{50}$ oraz $EC_{50}$ z 8-punktowych krzywych stężeń',
      'Pomiary oporu transepitelialnego (TEER > 350 $\\Omega \\cdot \\text{cm}^2$)',
      'Kontrole dodatnie i ujemne zwalidowane według norm ISO 10993-5',
    ],
    recommendedFor: 'Wczesny screening bezpieczeństwa związków chemicznych i formulacji kosmetycznych.',
  },
  {
    id: 'serv-lims-cloud',
    name: 'Wdrożenie Oprogramowania BioResearcher Analytics & Integracja LIMS',
    category: 'Kinetyka & Biofizyka',
    basePriceUsd: 3200,
    unit: 'pakiet licencji korporacyjnej + integracja API',
    turnaroundDays: 14,
    description:
      'Chmurowa platforma przetwarzania surowych danych bioanalitycznych, automatycznego dopasowywania krzywych kalibracyjnych, walidacji statystycznej oraz bezpośredniej synchronizacji z systemami LIMS klienta.',
    specifications: [
      'Pełna zgodność z normą FDA 21 CFR Part 11 (Audit Trail, podpisy cyfrowe)',
      'Wbudowany asystent analityczny BioResearcher AI wspomagający interpretację',
      'Eksport raportów walidacyjnych w formatach PDF/A i certyfikowanym XML',
    ],
    recommendedFor: 'Laboratoria dążące do automatyzacji raportowania i przejścia na standardy Dobrej Praktyki Danych (GAMP 5).',
  },
];

export default function ServicesPage() {
  const { opticsOn, sanityStage } = useSystemState();
  const isDistorted = !opticsOn || sanityStage === 'insanity';

  const [selectedCategory, setSelectedCategory] = useState<string>('Wszystkie');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(ANALYTICAL_SERVICES[0].id);

  // Kalkulator zapytania ofertowego (B2B Request for Quotation)
  const [sampleType, setSampleType] = useState<string>('Osocze / Surowica krwi');
  const [sampleCount, setSampleCount] = useState<number>(20);
  const [needGlpCompliance, setNeedGlpCompliance] = useState<boolean>(true);
  const [quoteSubmitted, setQuoteSubmitted] = useState<boolean>(false);

  const categories = [
    'Wszystkie',
    'Chromatografia & Spektrometria',
    'Immunochemia & Testy Biochemiczne',
    'Biologia Molekularna & Genomika',
    'Kinetyka & Biofizyka',
    'Testy Komórkowe In Vitro',
  ];

  const filteredServices = ANALYTICAL_SERVICES.filter(
    (s) => selectedCategory === 'Wszystkie' || s.category === selectedCategory
  );

  const currentService = ANALYTICAL_SERVICES.find((s) => s.id === selectedServiceId) || ANALYTICAL_SERVICES[0];

  const estimatedTotalUsd = Math.round(
    currentService.basePriceUsd * Math.max(1, Math.ceil(sampleCount / 10)) * (needGlpCompliance ? 1.25 : 1.0)
  );

  return (
    <div className="flex-1 flex flex-col space-y-8 font-sans">
      {/* 1. NAGŁÓWEK SEKCI USŁUG B2B */}
      <section
        className={`p-6 sm:p-8 md:p-10 rounded-2xl border transition-all duration-300 ${
          isDistorted
            ? 'bg-[#090505] border-[#781414] anomaly-border-blood text-[#e6c2b8]'
            : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 shadow-sm'
        }`}
      >
        <div className="max-w-4xl space-y-3">
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
            <Link href="/" className="hover:text-sky-600">Home</Link>
            <span>&gt;</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Usługi Analityczne & CRO</span>
          </div>

          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span>KONTRAKTOWE USŁUGI BADAWCZE (CRO) & CERTYFIKACJA GLP</span>
          </div>

          <h1
            className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${
              isDistorted ? 'text-red-400 font-mono anomaly-glow-blood' : 'text-slate-900 dark:text-white'
            }`}
          >
            Certyfikowane Badania Bio-Analityczne & Wsparcie Laboratoryjne
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Świadczymy akredytowane usługi analityczne w reżimie Dobrej Praktyki Laboratoryjnej (GLP) oraz normy ISO/IEC 17025.
            Wspieramy działy R&D jednostek akademickich oraz przemysłu farmaceutycznego na każdym etapie rozwoju cząsteczki:
            od wczesnego profilowania fizykochemicznego po zaawansowaną walidację bioanalityczną.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-slate-500">
            <span>• AKREDYTACJA ISO/IEC 17025:2018</span>
            <span>• ZGODNOŚĆ Z WYTYCZNYMI ICH M10</span>
            <span>• CZAS REALIZACJI OD 4 DNI ROBOCZYCH</span>
          </div>
        </div>
      </section>

      {/* 2. FILTR KATEGORII USŁUG */}
      <section className="flex flex-wrap items-center gap-2 border-b pb-4 border-slate-200 dark:border-slate-800">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">Dział Analityczny:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              soundEngine.playKeystroke();
              setSelectedCategory(cat);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* 3. GŁÓWNA SIATKA KATALOGU USŁUG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEWA KOLUMNA: LISTA KART USŁUG */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Dostępne Pakiety Analityczne ({filteredServices.length})
          </h2>

          <div className="space-y-4">
            {filteredServices.map((serv) => {
              const isSelected = serv.id === selectedServiceId;
              return (
                <div
                  key={serv.id}
                  onClick={() => {
                    soundEngine.playKeystroke();
                    setSelectedServiceId(serv.id);
                  }}
                  className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50/40 dark:bg-sky-950/20 shadow-sm ring-1 ring-sky-500/50'
                      : isDistorted
                      ? 'border-[#781414]/50 bg-[#090505] text-[#d8cfbe]'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {serv.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                      od ${serv.basePriceUsd} USD / {serv.unit}
                    </span>
                  </div>

                  <h3
                    className={`text-base font-bold tracking-tight mb-1.5 ${
                      isSelected ? 'text-sky-700 dark:text-sky-300' : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {serv.name}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                    {serv.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 font-mono">
                    <span>Średni czas: {serv.turnaroundDays} dni roboczych</span>
                    <span className="text-sky-600 dark:text-sky-400 font-semibold hover:underline">
                      {isSelected ? 'Wybrano do kalkulacji ✓' : 'Wybierz do wyceny →'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PRAWA KOLUMNA: KALKULATOR WYCENY & FORMULARZ OFERTOWY */}
        <div className="lg:col-span-5">
          <div
            className={`sticky top-20 p-5 sm:p-6 rounded-xl border transition-all ${
              isDistorted
                ? 'bg-[#0a0505] border-[#781414] text-[#ffcccc]'
                : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 shadow-md'
            }`}
          >
            <div className="border-b pb-3 mb-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                FORMULARZ ZAPYTANIA OFERTOWEGO (RFQ)
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                Wycena Wstępna & Zlecenie Analityczne
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Wybrana usługa: <strong>{currentService.name}</strong>
              </p>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Typ Matrycy Biologicznej / Próbki:
                </label>
                <select
                  value={sampleType}
                  onChange={(e) => setSampleType(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Osocze / Surowica krwi">Osocze / Surowica krwi (EDTA, Heparyna)</option>
                  <option value="Płyn mózgowo-rdzeniowy (CSF)">Płyn mózgowo-rdzeniowy (CSF)</option>
                  <option value="Lizaty komórkowe i frakcje tkankowe">Lizaty komórkowe i frakcje tkankowe</option>
                  <option value="Roztwory rekombinowane / Przeciwciała">Roztwory rekombinowane / Przeciwciała (czystość &gt; 90%)</option>
                  <option value="Ekstrakty kwasów nukleinowych (RNA/DNA)">Ekstrakty kwasów nukleinowych (RNA / DNA)</option>
                  <option value="Formulacje farmaceutyczne / Substancje czynne API">Formulacje farmaceutyczne / Czyste API</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Liczba Próbek w Zleceniu:
                  </label>
                  <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                    {sampleCount} próbek
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={sampleCount}
                  onChange={(e) => setSampleCount(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>5 próbek (min.)</span>
                  <span>50 próbek</span>
                  <span>100 próbek (seria)</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needGlpCompliance}
                    onChange={(e) => setNeedGlpCompliance(e.target.checked)}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Certyfikowany Raport GLP / ISO 17025 (+25%)
                  </span>
                </label>
                <p className="text-[11px] text-slate-500 pl-6 leading-relaxed">
                  Obejmuje pełny ślad audytowy, kalibrację wielopunktową oraz walidację statystyczną do przedłożenia regulatorom (FDA / EMA).
                </p>
              </div>

              {/* SZCZEGÓŁY METODYCZNE WYBRANEJ USŁUGI */}
              <div className="space-y-1.5 pt-1">
                <p className="font-semibold text-slate-700 dark:text-slate-300">Specyfikacja procedury:</p>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                  {currentService.specifications.map((spec, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5">
                      <span className="text-sky-500 font-bold">✓</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* PODSUMOWANIE KOSZTÓW */}
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Szacowany koszt netto:
                  </span>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                    ${estimatedTotalUsd.toLocaleString()} USD
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Zawiera przygotowanie próbek, analizę instrumentalną oraz wygenerowanie certyfikatu analizy (CoA).
                </p>
              </div>

              {quoteSubmitted ? (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-center space-y-1">
                  <p className="font-bold">Zapytanie zostało zarejestrowane (#RFQ-2026-88)</p>
                  <p className="text-[11px]">
                    Nasz koordynator analityczny skontaktuje się w ciągu 24h z przygotowanym protokołem badania.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => {
                      soundEngine.playKeystroke();
                      setQuoteSubmitted(true);
                    }}
                    className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition-all shadow-sm"
                  >
                    Wyślij Zapytanie Ofertowe (RFQ)
                  </button>
                  <Link
                    href="/chat"
                    className="block text-center text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
                  >
                    Skonsultuj protokół pomiarowy z BioResearcher AI →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
