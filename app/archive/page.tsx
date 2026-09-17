'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSystemState } from '@/components/SystemStateContext';
import { ScientistPortrait } from '@/components/ScientistPortrait';
import { soundEngine } from '@/lib/soundEngine';

interface Author {
  name: string;
  role: string;
  affiliation: string;
  isThorne?: boolean;
}

export type ScientificCategory =
  | 'Wszystkie'
  | 'Farmakologia'
  | 'Biochemia'
  | 'Neurobiologia'
  | 'Immunologia'
  | 'Fizjologia'
  | 'Genetyka';

interface Publication {
  id: string;
  title: string;
  authors: Author[];
  date: string;
  year: number;
  journal: string;
  doi: string;
  category: 'Farmakologia' | 'Biochemia' | 'Neurobiologia' | 'Immunologia' | 'Fizjologia' | 'Genetyka';
  citations: number;
  abstract: React.ReactNode;
  isArchivalAnomaly?: boolean;
  methodology: {
    tissueSample: string;
    electrodeArray: string;
    perfusionAgent: string;
    samplingFrequency: string;
  };
  editorialNote?: string;
}

// BAZA PEŁNOPRAWNYCH, W PEŁNI LEGALNYCH RECENZOWANYCH PUBLIKACJI NAUKOWYCH
const PEER_REVIEWED_PUBLICATIONS: Publication[] = [
  {
    id: 'PUB-2025-412',
    title: 'Plasma Phosphorylated Tau-217 as a High-Precision Diagnostic Biomarker for Prodromal Dementia and Preclinical Amyloid Pathology',
    authors: [
      { name: 'Dr. Marcus H. Weber', role: 'Pierwszy Autor', affiliation: 'NeuroClin Translational Neurobiology' },
      { name: 'Dr. Sarah Lin', role: 'Biofizyk', affiliation: 'Department of Clinical Chemistry, Harvard Medical' },
      { name: 'Prof. Henrik Zetterberg', role: 'Konsultant Zewnętrzny', affiliation: 'Sahlgrenska Academy' },
    ],
    date: '14 maja 2025',
    year: 2025,
    journal: 'JAMA Neurology, Vol. 82, Iss. 5, pp. 512–526',
    doi: '10.1001/jamaneurol.2025.1412',
    category: 'Biochemia',
    citations: 184,
    abstract:
      'Wieloośrodkowa walidacja testu immunoenzymatycznego dla fosforylowanej formy białka tau (p-tau217) w osoczu. Oznaczenie osiąga 96.2% pola pod krzywą ROC w przewidywaniu dodatniego wyniku amyloid-PET, oferując bezinwazyjny wskaźnik neurodystrofii synaptycznej u pacjentów z łagodnymi zaburzeniami poznawczymi (MCI).',
    methodology: {
      tissueSample: 'Osocze krwi obwodowej i płyn mózgowo-rdzeniowy (n = 1 420 probandów)',
      electrodeArray: 'Platforma cyfrowego immuno-oznaczania pojedynczych cząsteczek Simoa HD-X',
      perfusionAgent: 'Bufor antygenowy z inhibitorem fosfataz PhosSTOP',
      samplingFrequency: 'Pomiar fotometryczny w 480 nm',
    },
  },
  {
    id: 'PUB-2025-104',
    title: 'Mitochondrial Outer Membrane Permeabilization and Caspase-3/9 Cleavage Cascades in Hypoxic Neuronal Apoptosis',
    authors: [
      { name: 'Dr. Elena Vance', role: 'Główny Badacz', affiliation: 'Department of Cellular Pathology, Cambridge' },
      { name: 'Dr. Julian Brandt', role: 'Mikrobiolog', affiliation: 'NeuroClin Mitochondrial Research Unit' },
    ],
    date: '02 lutego 2025',
    year: 2025,
    journal: 'Cell Death & Differentiation, Vol. 32, pp. 210–225',
    doi: '10.1038/s41418-025-01104-w',
    category: 'Fizjologia',
    citations: 78,
    abstract:
      'Badanie mechanizmu translokacji białka Bax do zewnętrznej błony mitochondrialnej pod wpływem przejściowej deprywacji tlenowo-glukozowej. Wykazano, że oligomeryzacja porów MOMP wyzwala uwolnienie cytochromu c i sekwencyjną aktywację kaspazy-9 oraz kaspazy-3, co można zahamować rekombinowanymi peptydami BH3-mimetycznymi.',
    methodology: {
      tissueSample: 'Pierwotne linie komórkowe neuronów korowych',
      electrodeArray: 'Respirometr wielokanałowy Oroboros Oxygraph-2k',
      perfusionAgent: 'Bufor fosforanowy z oligomycyną (2 µM) i FCCP (1 µM)',
      samplingFrequency: 'Rejestracja poboru tlenu co 2 sekundy',
    },
  },
  {
    id: 'PUB-2024-883',
    title: 'Lecanemab and Donanemab Clearance Kinetics of Amyloid-Beta Protofibrils and Incidence of ARIA-E in Long-Term Follow-up',
    authors: [
      { name: 'Dr. Marcus H. Weber', role: 'Główny Badacz', affiliation: 'NeuroClin Translational Neurobiology' },
      { name: 'Dr. David Holtzman', role: 'Współautor', affiliation: 'Washington University School of Medicine' },
    ],
    date: '11 listopada 2024',
    year: 2024,
    journal: 'The New England Journal of Medicine, Vol. 391, pp. 1780–1794',
    doi: '10.1056/NEJMoa2408831',
    category: 'Farmakologia',
    citations: 342,
    abstract:
      'Ocena skuteczności klinicznej humanizowanych przeciwciał monoklonalnych skierowanych przeciwko rozpuszczalnym oligomerom i protofibrylom Aβ. Wykazano istotne statystycznie spowolnienie progresji w skali CDR-SB o 27% po 18 miesiącach, przy jednoczesnym monitorowaniu obrzęku naczyniopochodnego (ARIA-E) metodą rezonansu magnetycznego.',
    methodology: {
      tissueSample: 'Biopsje korowe i seryjne pomiary PET 11C-PiB',
      electrodeArray: 'Skaner MR 7-Tesla Siemens Magnetom Terra',
      perfusionAgent: 'Wlew dożylny 10 mg/kg co 2 tygodnie',
      samplingFrequency: 'Sekwencje FLAIR i SWI co 6 tygodni',
    },
  },
  {
    id: 'PUB-2024-512',
    title: 'High-Resolution Multielectrode Field Potential Profiling and Baseline Drift Normalization in Murine Synaptic Networks',
    authors: [
      { name: 'Dr. Elena Vance', role: 'Główny Badacz', affiliation: 'NeuroClin Electrophysiology Unit' },
      { name: 'Dr. Marcus H. Weber', role: 'Współautor', affiliation: 'NeuroClin Translational Neurobiology' },
    ],
    date: '18 sierpnia 2024',
    year: 2024,
    journal: 'Journal of Neurophysiology, Vol. 132, Iss. 2, pp. 412–429',
    doi: '10.1152/jn.00512.2024',
    category: 'Neurobiologia',
    citations: 64,
    abstract:
      'Charakterystyka długookresowej stabilności wyładowań synaptycznych oraz wzorców pobudzenia w kulturach neuronów kory mózgowej poddanych stymulacji theta-burst (TBS). Praca analizuje mechanizmy wczesnego i późnego wzmocnienia synaptycznego (LTP) oraz metody eliminacji szumów aparaturowych w rejestracji zewnątrzkomórkowej.',
    methodology: {
      tissueSample: 'Pierwotne kultury neuronów korowych myszy C57BL/6 (DIV 21)',
      electrodeArray: 'Matryca mikroelektrodowa planar MEA 120 kanałów (Multi Channel Systems)',
      perfusionAgent: 'Sztuczny płyn mózgowo-rdzeniowy (aCSF, nasycony 95% O2 / 5% CO2)',
      samplingFrequency:
        '20 kHz na kanał. Wartości referencyjne szumu tła i stabilności potencjałów znormalizowano względem wewnętrznego protokołu kalibracyjnego z 14 listopada 1994 r. (seria pomiarowa ST-94/11).',
    },
    editorialNote:
      'Artykuł zawiera procedury referencyjne stosowane w kalibracji laboratoryjnej torów wzmacniaczy w ośrodku NeuroClin.',
  },
  {
    id: 'PUB-2024-315',
    title: 'TREM2 Activation on Disease-Associated Microglia Promotes Plaque Phagocytosis and Attenuates Chronic Neuroinflammation',
    authors: [
      { name: 'Dr. Marcus H. Weber', role: 'Główny Badacz', affiliation: 'NeuroClin Translational Neurobiology' },
      { name: 'Dr. Christian Haass', role: 'Konsultant Naukowy', affiliation: 'DZNE Munich' },
    ],
    date: '04 czerwca 2024',
    year: 2024,
    journal: 'Nature Neuroscience, Vol. 27, pp. 1105–1119',
    doi: '10.1038/s41593-024-0315-7',
    category: 'Immunologia',
    citations: 215,
    abstract:
      'Badanie agonistycznych przeciwciał monoklonalnych aktywujących receptor TREM2 na powierzchni komórek mikrogleju. Wykazano przejście fenotypu mikrogleju ze stanu spoczynkowego do komórek skojarzonych z chorobą (DAM), co skutkuje efektywną klirencją oligomerów białkowych i wygaszeniem kaskady prozapalnych cytokin IL-1β oraz TNF-α.',
    methodology: {
      tissueSample: 'Izolowany pierwotny mikroglej ludzki i mysi',
      electrodeArray: 'Cytometr przepływowy BD FACSymphony A5',
      perfusionAgent: 'Pożywka DMEM/F-12 z dodatkiem rekombinowanego M-CSF (20 ng/ml)',
      samplingFrequency: 'Pomiar fluorescencji wieloparametrowej (28 kanałów)',
    },
  },
  {
    id: 'PUB-2023-742',
    title: 'CRISPR-Cas9 Functional Screening Identifies Epigenetic Regulators of Axonal Sprouting and Synaptic Maintenance',
    authors: [
      { name: 'Dr. Julian Brandt', role: 'Główny Badacz', affiliation: 'NeuroClin Genomic Screening Facility' },
      { name: 'Dr. Feng Zhang', role: 'Współautor Zewnętrzny', affiliation: 'Broad Institute of MIT and Harvard' },
    ],
    date: '19 października 2023',
    year: 2023,
    journal: 'Cell, Vol. 186, Iss. 21, pp. 4680–4698',
    doi: '10.1016/j.cell.2023.09.742',
    category: 'Genetyka',
    citations: 290,
    abstract:
      'Wielkoskalowy screening genetyczny biblioteki sgRNA obejmujący 18 000 genów w poszukiwaniu czynników modulujących regenerację aksonów po urazie mechanicznym. Zidentyfikowano deacetylazę histonową HDAC6 jako kluczowy cel molekularny, którego delecja przywraca transport pęcherzykowy w mikrotubulach.',
    methodology: {
      tissueSample: 'Różnicowane neurony ludzkie ze stabilną ekspresją Cas9',
      electrodeArray: 'Sekwencjonowanie Illumina NovaSeq 6000 (150 bp PE)',
      perfusionAgent: 'Selekcja puromycynowa (1.5 µg/ml) przez 14 dni',
      samplingFrequency: 'Głębokość sekwencjonowania: 100M odczytów na próbkę',
    },
  },
  {
    id: 'PUB-2023-520',
    title: 'Synergistic Dynamics of Donepezil and Memantine in Preventing Excitotoxic Calcium Overload: An Electrophysiological Study',
    authors: [
      { name: 'Dr. Marcus H. Weber', role: 'Pierwszy Autor', affiliation: 'NeuroClin Translational Neurobiology' },
      { name: 'Dr. Elena Vance', role: 'Współautor', affiliation: 'Department of Pharmacology, Cambridge' },
    ],
    date: '05 lipca 2023',
    year: 2023,
    journal: 'Neuropharmacology, Vol. 235, Article 109580',
    doi: '10.1016/j.neuropharm.2023.109580',
    category: 'Farmakologia',
    citations: 112,
    abstract:
      'Wykazano, że skojarzone podawanie inhibitora acetylocholinoesterazy (donepezilu) z niekompetycyjnym antagonistą receptora NMDA (memantyną) wykazuje addytywny wpływ neuroprotekcyjny. Memantyna blokuje patologiczny toniczny napływ Ca²⁺ bez zakłócania fizjologicznej plastyczności synaptycznej wyzwalanej podwyższonym poziomem acetylocholiny.',
    methodology: {
      tissueSample: 'Skrawki mózgowe kory nowej poddane działaniu kwasu glutaminowego (100 µM)',
      electrodeArray: 'Układ patch-clamp w konfiguracji whole-cell (EPC-10 HEKA)',
      perfusionAgent: 'Kwas kynureninowy z blokerem kanałów sodowych TTX (1 µM)',
      samplingFrequency: 'Próbkowanie 50 kHz z filtrem Bessela 2.9 kHz',
    },
  },
  {
    id: 'PUB-2022-814',
    title: 'Nonlinear Regression and Michaelis-Menten Kinetics Modeling for Allosteric Enzyme Inhibitors in Multi-Substrate Systems',
    authors: [
      { name: 'Dr. Marcus H. Weber', role: 'Biofizyk Analityczny', affiliation: 'NeuroClin Mathematical Biology Unit' },
      { name: 'Dr. Sarah Lin', role: 'Współautor', affiliation: 'Department of Chemical Engineering, MIT' },
    ],
    date: '12 listopada 2022',
    year: 2022,
    journal: 'Biophysical Journal, Vol. 121, pp. 2410–2425',
    doi: '10.1016/j.bpj.2022.08.814',
    category: 'Biochemia',
    citations: 94,
    abstract:
      'Wyprowadzenie formalizmu estymacji stałych inhibicji $K_i$ oraz współczynnika kooperatywności Hilla $n_H$ w układach podlegających równoległej degradacji substratu. Oprogramowanie analityczne minimalizuje sumę kwadratów ważonych odchyleń bez konieczności linearyzacji podwójnych odwrotności.',
    methodology: {
      tissueSample: 'Rekombinowane ludzkie enzymy mikrosomalne CYP450 oraz AChE',
      electrodeArray: 'Spektrofotometr płytkowy BioTek Synergy H1',
      perfusionAgent: 'Substrat chromogenny DTNB (odczynnik Ellmana, 0.3 mM)',
      samplingFrequency: 'Ciągły pomiar absorbancji w 412 nm co 5 sekund',
    },
  },
  {
    id: 'PUB-2022-311',
    title: 'Tight Junction Integrity and Transcytosis Kinetics of Monoclonal Antibodies across the In Vitro Human Blood-Brain Barrier',
    authors: [
      { name: 'Dr. Elena Vance', role: 'Główny Badacz', affiliation: 'NeuroClin Cellular Transport Laboratory' },
      { name: 'Dr. Julian Brandt', role: 'Współautor', affiliation: 'Department of Physiology, University of Oxford' },
    ],
    date: '28 marca 2022',
    year: 2022,
    journal: 'Fluids and Barriers of the CNS, Vol. 19, Article 34',
    doi: '10.1186/s12987-022-00311-x',
    category: 'Fizjologia',
    citations: 135,
    abstract:
      'Badanie mechanizmów transportu przez barierę krew-mózg w kokulturach komórek śródbłonka hCMEC/D3 i astrocytów. Wyznaczono współczynniki przepuszczalności pozornej $P_{app}$ dla przeciwciał bispecyficznych wykorzystujących transcytozę za pośrednictwem receptora transferrynowego (TfR).',
    methodology: {
      tissueSample: 'Transwell kokultury komórkowe z filtrem porowatym 0.4 µm',
      electrodeArray: 'Miernik oporu transepitelialnego EVOM3 (World Precision Instruments)',
      perfusionAgent: 'Bufor Hanksa (HBSS) z suplementem glukozy i 1% BSA',
      samplingFrequency: 'Pomiar oporu elektrycznego TEER co 12 godzin',
    },
  },
];

// DOKŁADNIE JEDEN UKRYTY ARCHIWALNY RAPORT Z 1994 R. (ZASADA JEDYNEGO ŚLADU)
// WIDOCZNY WYŁĄCZNIE WTEDY, GDY UŻYTKOWNIK WYSZUKA DATĘ LUB KOD (NP. 1994, 14.11, ST-94, THORNE)
const HIDDEN_ARCHIVAL_REPORT: Publication = {
  id: 'PUB-1994-041-S7',
  title: 'Raport Techniczny ST-94/11: Pilotażowe mapowanie potencjałów mikrosieci neuronalnych w warunkach perfuzji niskotemperaturowej',
  authors: [
    { name: 'Dr. Aris Thorne', role: 'Kierownik Zespołu Badawczego', affiliation: 'Pracownia Elektrofizjologii // Sektor-7', isThorne: true },
    { name: 'Dr. Elena Vance', role: 'Biofizyk Doświadczalny', affiliation: 'Instytut Badań Komórkowych' },
  ],
  date: '14 listopada 1994',
  year: 1994,
  journal: 'Biuletyn Doświadczalny Oddziału Badań Specjalnych // Zeszyt 44/1994 (Archiwum Niejawne)',
  doi: '10.1016/archive.1994.041',
  category: 'Neurobiologia',
  citations: 2,
  isArchivalAnomaly: true,
  abstract: (
    <div className="space-y-3 font-mono text-xs leading-relaxed text-slate-200">
      <div className="p-2.5 rounded bg-red-950/40 border border-red-800/80 text-red-300 text-[11px] flex items-center justify-between">
        <span>KLAUZULA ARCHIWALNA // STATUS: TRWALE ZREDAGOWANO</span>
        <span>PROTOKÓŁ: ST-94/11</span>
      </div>

      <div className="space-y-2 p-3 bg-black/80 rounded border border-slate-800 text-slate-300">
        <p>
          [PROTOKÓŁ ZAMKNIĘTY ST-94/11] Seria pomiarowa rozpoczęta w warunkach perfuzji niskotemperaturowej.{' '}
          <span className="bg-black text-black select-none pointer-events-none px-2 py-0.5 rounded-none inline-block border border-black">
            ████████████████████████████████
          </span>{' '}
          podjęto próbę bezpośredniego sprzężenia sygnałów bioelektrycznych mikrosieci{' '}
          <span className="bg-black text-black select-none pointer-events-none px-3 py-0.5 rounded-none inline-block border border-black">
            ████████████████████████████████████████████
          </span>{' '}
          z rejestrami jednostki centralnej.
        </p>

        <p>
          Rejestracja telemetryczna wykazała{' '}
          <span className="bg-black text-black select-none pointer-events-none px-4 py-0.5 rounded-none inline-block border border-black">
            ████████████████████████████████████████████████████
          </span>{' '}
          przeniesienie danych pod rygorem tajności.{' '}
          <span className="bg-black text-black select-none pointer-events-none px-3 py-0.5 rounded-none inline-block border border-black">
            ████████████████████████
          </span>{' '}
          Dalsze prace laboratoryjne wstrzymane decyzją dyrekcji.
        </p>

        <div className="pt-2 mt-2 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap justify-between items-center gap-2">
          <span>Podpisano: Dr. Aris Thorne // Dr. Elena Vance</span>
          <span>Data rejestracji: 14.11.1994</span>
        </div>
      </div>
    </div>
  ),
  methodology: {
    tissueSample: 'Pierwotna mikrosieć neuronalna ssaków',
    electrodeArray: 'Wielopunktowa matryca badawcza zintegrowana z torem A/C',
    perfusionAgent: 'Krio-bufor metaboliczny HEPES z perfuzją ciągłą',
    samplingFrequency: '20 kHz na kanał magistrali danych',
  },
  editorialNote:
    'Notatka archiwalna: Dokument przeniesiony do zasobów niejawnych w listopadzie 1994 r. po reorganizacji struktury jednostek badawczych.',
};

const CATEGORIES: ScientificCategory[] = [
  'Wszystkie',
  'Farmakologia',
  'Biochemia',
  'Neurobiologia',
  'Immunologia',
  'Fizjologia',
  'Genetyka',
];

function ArchiveContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const { opticsOn, sanityStage } = useSystemState();
  const isDistorted = !opticsOn || sanityStage === 'insanity';

  const [searchFilter, setSearchFilter] = useState<string>(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<ScientificCategory>('Wszystkie');
  const [expandedPubId, setExpandedPubId] = useState<string | null>(null);

  // Sprawdzanie czy użytkownik wpisał w wyszukiwarkę datę lub kod z 1994 r.
  const isAnomalyTriggered = useMemo(() => {
    const query = searchFilter.toLowerCase().trim();
    if (!query) return false;
    return (
      query.includes('1994') ||
      query.includes('14.11') ||
      query.includes('14 listopada') ||
      query.includes('st-94') ||
      query.includes('st94') ||
      query.includes('thorne') ||
      query.includes('aris')
    );
  }, [searchFilter]);

  const allAvailablePublications = useMemo(() => {
    if (isAnomalyTriggered) {
      return [HIDDEN_ARCHIVAL_REPORT, ...PEER_REVIEWED_PUBLICATIONS];
    }
    return PEER_REVIEWED_PUBLICATIONS;
  }, [isAnomalyTriggered]);

  const filteredPublications = useMemo(() => {
    return allAvailablePublications.filter((pub) => {
      const matchesCategory = selectedCategory === 'Wszystkie' || pub.category === selectedCategory;
      const lowerSearch = searchFilter.toLowerCase().trim();

      if (!lowerSearch) return matchesCategory;

      const matchesSearch =
        pub.title.toLowerCase().includes(lowerSearch) ||
        pub.doi.toLowerCase().includes(lowerSearch) ||
        pub.journal.toLowerCase().includes(lowerSearch) ||
        pub.authors.some((a) => a.name.toLowerCase().includes(lowerSearch)) ||
        pub.methodology.tissueSample.toLowerCase().includes(lowerSearch) ||
        pub.methodology.samplingFrequency.toLowerCase().includes(lowerSearch);

      return matchesCategory && matchesSearch;
    });
  }, [allAvailablePublications, selectedCategory, searchFilter]);

  const handleCategorySelect = (cat: ScientificCategory) => {
    soundEngine.playKeystroke();
    setSelectedCategory(cat);
  };

  const handleToggleExpand = (id: string) => {
    soundEngine.playKeystroke();
    setExpandedPubId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 font-sans">
      {/* NAGŁÓWEK REPOZYTORIUM NAUKOWEGO */}
      <section
        className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${
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
              <span className="font-semibold text-slate-700 dark:text-slate-300">Repozytorium Publikacji & Badań</span>
            </div>
            <h1
              className={`text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight ${
                isDistorted ? 'text-red-400 anomaly-glow-blood font-mono' : 'text-slate-900 dark:text-white'
              }`}
            >
              Indeks Publikacji Naukowych & Raportów Laboratoryjnych
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Recenzowane prace naukowe z zakresu farmakologii molekularnej, biochemii, neurobiologii i immunologii.
            </p>
          </div>

          <div className="text-right text-xs font-mono text-slate-500 hidden sm:block">
            <p>BAZA DANYCH: DOI INDEXED</p>
            <p>ZASÓB: OTWARTY DOSTĘP (CC BY 4.0)</p>
          </div>
        </div>

        {/* POLE WYSZUKIWANIA W ARCHIWUM */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Wyszukaj artykuł po tytule, autorze, DOI, dacie (np. 2024, donepezil, simoa)..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg text-xs md:text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
          </div>

          {searchFilter && (
            <button
              onClick={() => {
                soundEngine.playKeystroke();
                setSearchFilter('');
              }}
              className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Wyczyść filtr
            </button>
          )}
        </div>
      </section>

      {/* FILTROWANIE PO JEDNODYSYCYPLINARNYCH KATEGORIACH */}
      <section className="flex flex-wrap items-center gap-1.5 border-b pb-3 border-slate-200 dark:border-slate-800">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">Dyscyplina:</span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategorySelect(cat)}
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

      {/* LISTA ARTYKUŁÓW W ARCHIWUM */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-mono">
          <span>Znaleziono pozycji: {filteredPublications.length}</span>
          {isAnomalyTriggered && (
            <span className="text-red-500 font-bold animate-pulse">
              [ODKRYTO ARCHIWALNY PROTOKÓŁ REFERENCYJNY Z 1994 R.]
            </span>
          )}
        </div>

        {filteredPublications.map((pub) => {
          const isExpanded = expandedPubId === pub.id;
          const isArchival = pub.isArchivalAnomaly;

          return (
            <article
              key={pub.id}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isArchival
                  ? 'bg-[#0f0707] border-red-800/90 shadow-lg'
                  : isDistorted
                  ? 'bg-[#090505] border-[#781414]/70'
                  : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isArchival
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                      }`}
                    >
                      {pub.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{pub.id}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-500">{pub.date}</span>
                </div>

                <h2
                  className={`text-base sm:text-lg font-bold tracking-tight mb-2 ${
                    isArchival
                      ? 'text-red-300 font-mono'
                      : isDistorted
                      ? 'text-red-300 font-mono'
                      : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {pub.title}
                </h2>

                <div className="flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-400 mb-3">
                  <span>
                    Autorzy:{' '}
                    <strong>
                      {pub.authors.map((a) => a.name).join(', ')}
                    </strong>
                  </span>
                  <span>•</span>
                  <span className="italic">{pub.journal}</span>
                </div>

                {/* PODGLĄD ABSTRAKTU */}
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans mb-3">
                  {typeof pub.abstract === 'string' ? <p>{pub.abstract}</p> : pub.abstract}
                </div>

                {/* ROZWIJANA METODYKA I METADANE */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                        <p className="font-bold text-slate-700 dark:text-slate-300">Próbka badawcza:</p>
                        <p className="text-slate-600 dark:text-slate-400">{pub.methodology.tissueSample}</p>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                        <p className="font-bold text-slate-700 dark:text-slate-300">Aparatura pomiarowa:</p>
                        <p className="text-slate-600 dark:text-slate-400">{pub.methodology.electrodeArray}</p>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                        <p className="font-bold text-slate-700 dark:text-slate-300">Medium perfuzyjne / Bufor:</p>
                        <p className="text-slate-600 dark:text-slate-400">{pub.methodology.perfusionAgent}</p>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                        <p className="font-bold text-slate-700 dark:text-slate-300">Częstotliwość i parametry:</p>
                        <p className="text-slate-600 dark:text-slate-400">{pub.methodology.samplingFrequency}</p>
                      </div>
                    </div>

                    {pub.editorialNote && (
                      <p className="text-xs text-slate-500 font-sans italic">
                        {pub.editorialNote}
                      </p>
                    )}

                    {/* DLA ARTYKUŁU ARCHIWALNEGO: FOTOGRAFIA I DOSSIER DR. THORNE'A */}
                    {isArchival && (
                      <div className="mt-4 pt-4 border-t border-red-900/60">
                        <p className="text-xs font-mono font-bold text-red-400 mb-3">
                          [ZAŁĄCZNIK BIOMETRYCZNY // KARTA KIEROWNIKA PROJEKTU]:
                        </p>
                        <ScientistPortrait compact />
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-mono text-[11px] text-slate-400">
                    DOI: {pub.doi} {pub.citations > 0 && `// Cytowania: ${pub.citations}`}
                  </span>

                  <button
                    onClick={() => handleToggleExpand(pub.id)}
                    className="font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 flex items-center space-x-1"
                  >
                    <span>{isExpanded ? 'Zwiń specyfikację' : 'Szczegóły metodyki i aparatury'}</span>
                    <span>{isExpanded ? '↑' : '→'}</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default function ArchivePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-mono text-slate-500">Ładowanie indeksu publikacji...</div>}>
      <ArchiveContent />
    </Suspense>
  );
}
