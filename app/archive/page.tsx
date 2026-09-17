'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSystemState } from '@/components/SystemStateContext';
import { ScientistPortrait } from '@/components/ScientistPortrait';
import { soundEngine } from '@/lib/soundEngine';

interface Author {
  name: string;
  role: string;
  affiliation: string;
  isThorne?: boolean;
}

interface Publication {
  id: string;
  title: string;
  authors: Author[];
  date: string;
  year: number;
  journal: string;
  doi: string;
  category: 'Receptor Kinetics' | 'Microelectrode Arrays' | 'Excitotoxicity' | 'Connectomics' | 'Synaptic Plasticity';
  citations: number;
  abstract: string;
  methodology: {
    tissueSample: string;
    electrodeArray: string;
    perfusionAgent: string;
    samplingFrequency: string;
  };
  editorialNote?: string;
}

const PUBLICATIONS_DATABASE: Publication[] = [
  {
    id: 'PUB-1994-088',
    title: 'Patch-Clamp Analysis of NMDA Receptor NR2B Subunit Desensitization Kinetics in Adult Hippocampal CA1 Pyramidal Neurons',
    authors: [
      { name: 'Dr. Aris Thorne', role: 'Główny Badacz (PI)', affiliation: 'Pracownia Elektrofizjologii Komórkowej, Sektor-7', isThorne: true },
      { name: 'Dr. Elena Vance', role: 'Współautor / Biofizyk', affiliation: 'Instytut Neurobiologii Poznawczej' },
      { name: 'Dr. Marcus H. Weber', role: 'Współautor / Histopatolog', affiliation: 'Wydział Biologii Molekularnej' },
    ],
    date: '14 listopada 1994',
    year: 1994,
    journal: 'Journal of Cellular Neurophysiology, Vol. 48, Iss. 11',
    doi: '10.1016/j.neurobiol.1994.11.088',
    category: 'Receptor Kinetics',
    citations: 142,
    abstract:
      'Badanie kinetyki desensytyzacji receptorów NMDA zawierających podjednostkę GluN2B w warunkach ciągłej stymulacji mikromacierzowej. Wykazano, że usunięcie bloku magnezowego w potencjale -70 mV prowadzi do gwałtownego napływu jonów Ca2+, indukując nieodwracalne otwarcie porów mitochondrialnych (mPTP) i załamanie gradientu elektrochemicznego somy neuronu.',
    methodology: {
      tissueSample: 'Preparat biologiczny CA1-TH (świeża biopsja stereotaktyczna)',
      electrodeArray: 'Koaksjalne mikropipety borokrzemianowe (opór 4.5 MΩ)',
      perfusionAgent: 'Kwas fenolowy 4.2% w buforze HEPES (pH 7.35)',
      samplingFrequency: '20 kHz (przetwornik 16-bit A/D)',
    },
    editorialNote:
      'UWAGA WYDAWCY (LISTOPAD 1994): Publikacja zatwierdzona w trybie pilnym przed reorganizacją zespołu Sektor-7. Pomiary elektrofizjologiczne preparatu CA1-TH zostały zintegrowane z cyfrowym rurociągiem BioResearcher AI. Biologiczny dawca tkanki nie został uwzględniony w spisie personelu po dacie 15.11.1994 r.',
  },
  {
    id: 'PUB-1994-072',
    title: 'High-Density Multi-Channel Silicon Microelectrode Arrays: 16,384-Site In Vivo Neural Recording in Primate Hippocampal Formations',
    authors: [
      { name: 'Dr. Aris Thorne', role: 'Główny Konstruktor & PI', affiliation: 'Pracownia Elektrofizjologii Komórkowej, Sektor-7', isThorne: true },
      { name: 'Dr. Sarah Lin', role: 'Inżynier Mikrostruktur', affiliation: 'Departament Inżynierii Biomedycznej' },
      { name: 'Dr. Julian Brandt', role: 'Architekt Systemów Krzemowych', affiliation: 'DOD Biological Instrumentation Division' },
    ],
    date: '28 sierpnia 1994',
    year: 1994,
    journal: 'Annals of Biomedical Engineering & Connectomics, Vol. 22, pp. 412–429',
    doi: '10.1016/j.jneurophys.1994.08.019',
    category: 'Microelectrode Arrays',
    citations: 289,
    abstract:
      'Opis trójwymiarowej matrycy krzemowej zawierającej 16 384 indywidualnie adresowalne sondy o średnicy 1.2 µm. Konstrukcja pozwala na bezprecedensowe mapowanie lokalnych potencjałów polowych (LFP) w całym przekroju warstwy CA1 hipokampa z rozdzielczością czasową poniżej 50 mikrosekund, umożliwiając jednoczesną rejestrację 10^5 potencjałów iglicowych.',
    methodology: {
      tissueSample: 'Żywa tkanka hipokampa in situ (przeżyciowa trepanacja potyliczna)',
      electrodeArray: 'Krzemowa matryca 128x128 mikrosond pokrytych platyną',
      perfusionAgent: 'Sztuczny płyn mózgowo-rdzeniowy (aCSF) natleniany 95% O2 / 5% CO2',
      samplingFrequency: '50 kHz na kanał (magistrala optyczna 66 MHz)',
    },
    editorialNote:
      'RAPORT TECHNICZNY: Matryca 16 384 mikrosond wykazała 100% integralności podczas transferu sygnału. Rejestr engramów został zsynchronizowany z macierzą bramek FPGA przed wystąpieniem ucisku tkankowego.',
  },
  {
    id: 'PUB-1994-041',
    title: 'Calcium Cascades and Mitochondrial Permeability Transition in Sustained Glutamatergic Excitotoxicity',
    authors: [
      { name: 'Dr. Elena Vance', role: 'Pierwszy Autor', affiliation: 'Instytut Neurobiologii Poznawczej' },
      { name: 'Dr. Aris Thorne', role: 'Współautor / Nadzór Biofizyczny', affiliation: 'Pracownia Elektrofizjologii Komórkowej, Sektor-7', isThorne: true },
      { name: 'Dr. Marcus H. Weber', role: 'Współautor / Histopatolog', affiliation: 'Wydział Biologii Molekularnej' },
    ],
    date: '12 maja 1994',
    year: 1994,
    journal: 'Molecular and Cellular Neurobiology, Vol. 16, pp. 88–104',
    doi: '10.1016/j.cellbio.1994.05.004',
    category: 'Excitotoxicity',
    citations: 96,
    abstract:
      'Analiza kaskady ekscytotoksycznej wywołanej masywnym wyrzutem kwasu glutaminowego w synapsach Schaffer collateral. Wykazano, że przy przekroczeniu stężenia 100 µM glutaminianu pompa sodowo-potasowa ulega wyczerpaniu w ciągu 180 sekund, wyzwalając samorzutną autolizę neuronów piramidowych przy jednoczesnym generowaniu wyładowań napadowych.',
    methodology: {
      tissueSample: 'Skrawki hipokampa gryzoni oraz tkanka ludzka (Sektor-7)',
      electrodeArray: 'Układ mikroelektrod wielopolowych MEA-64',
      perfusionAgent: 'Kwas glutaminowy (100 µM) + fura-2 AM (wskaźnik Ca2+)',
      samplingFrequency: '10 kHz',
    },
  },
  {
    id: 'PUB-1994-019',
    title: 'Preservation of Theta-Band Oscillatory Engrams Following Rapid Phenolic Perfusion in Micro-Dissected Neural Tissue',
    authors: [
      { name: 'Dr. Aris Thorne', role: 'Główny Badacz (PI)', affiliation: 'Pracownia Elektrofizjologii Komórkowej, Sektor-7', isThorne: true },
      { name: 'Dr. Marcus H. Weber', role: 'Współautor', affiliation: 'Wydział Biologii Molekularnej' },
    ],
    date: '19 lutego 1994',
    year: 1994,
    journal: 'Connectomics & Tissue Preservation Quarterly, Vol. 9, pp. 15–31',
    doi: '10.1016/j.connectomics.1994.02.012',
    category: 'Connectomics',
    citations: 184,
    abstract:
      'Prezentacja metody natychmiastowej kriofiksacji fenolowej komórek CA1 w trakcie aktywnego rytmu theta (4–8 Hz). Zastosowanie schłodzonego do -15°C roztworu fenolowego pozwoliło zamrozić stan fosforylacji receptorów AMPA/NMDA bez degradacji przestrzennej mikrostruktury kolców dendrytycznych.',
    methodology: {
      tissueSample: 'Mikrodyssekcja płata skroniowego i zakrętu zębatego',
      electrodeArray: 'Sondy głębinowe wolframowe (32 kanały)',
      perfusionAgent: 'Buforowany fenol krystaliczny 4.2% w ciekłym krio-nośniku',
      samplingFrequency: '25 kHz',
    },
    editorialNote:
      'KLAUZULA ZASTĘPCZA: Utrwalona struktura stanowi podstawę fizycznego banku preparatów bio-krzemowych NeuroClin Biosciences. Dalsze badania nad odwracalnością procesu zaniechano decyzją zarządu.',
  },
  {
    id: 'PUB-1993-091',
    title: 'Stereotaxic Micro-Trepanation and Coaxial Electrode Navigation for Whole-Volume Connectomic Transfer',
    authors: [
      { name: 'Dr. Aris Thorne', role: 'Główny Badacz', affiliation: 'Pracownia Elektrofizjologii Komórkowej, Sektor-7', isThorne: true },
      { name: 'Dr. Julian Brandt', role: 'Inżynier Neuro-Nawigacji', affiliation: 'DOD Biological Instrumentation Division' },
      { name: 'Dr. Sarah Lin', role: 'Mikroelektronika', affiliation: 'Departament Inżynierii Biomedycznej' },
    ],
    date: '03 listopada 1993',
    year: 1993,
    journal: 'Journal of Stereotactic Neurosurgery & Microdevices, Vol. 31, pp. 201–218',
    doi: '10.1016/j.biomed.1993.11.007',
    category: 'Microelectrode Arrays',
    citations: 215,
    abstract:
      'Procedura mikroinwazyjnego dostępu do hipokampa za pomocą precyzyjnej ramy stereotaktycznej. Algorytm trójwymiarowej trajektorii pozwala na wprowadzenie matrycy mikroelektrodowej bez naruszenia tętnicy naczyniówkowej przedniej, zachowując przepływ krwi podczas procedury mapowania konektomu.',
    methodology: {
      tissueSample: 'Stereotaksja naczelnych oraz preparaty pośmiertne',
      electrodeArray: 'Prowadnice współosiowe tytanowe z sondami krzemowymi',
      perfusionAgent: 'Cytrynian sodu + dextran 40',
      samplingFrequency: '30 kHz',
    },
  },
  {
    id: 'PUB-1993-048',
    title: 'Comparative Desynchronization of Cortical 40-Hz Gamma Rhythms During Perceptual Delay in Cognitive Tasking',
    authors: [
      { name: 'Dr. Aris Thorne', role: 'Główny Badacz (PI)', affiliation: 'Pracownia Elektrofizjologii Komórkowej, Sektor-7', isThorne: true },
      { name: 'Dr. Elena Vance', role: 'Współautor', affiliation: 'Instytut Neurobiologii Poznawczej' },
    ],
    date: '15 czerwca 1993',
    year: 1993,
    journal: 'Cognitive Neurophysics Letters, Vol. 14, pp. 92–108',
    doi: '10.1016/j.cognition.1993.06.015',
    category: 'Synaptic Plasticity',
    citations: 310,
    abstract:
      'Dowód eksperymentalny na to, że subiektywne poczucie „teraźniejszości” u człowieka jest opóźnione o 80–120 milisekund względem rejestracji fotonów na siatkówce. Desynchronizacja rytmu gamma (40 Hz) w korze ciemieniowej prowadzi do rozszczepienia percepcji czasu i wrażenia alienacji somatycznej.',
    methodology: {
      tissueSample: 'Badania wielokanałowe EEG/ECoG u probandów ludzkich',
      electrodeArray: '64-kanałowa siatka podtwardówkowa platynowa',
      perfusionAgent: 'Brak (pomiar in vivo w czuwaniu)',
      samplingFrequency: '5 kHz',
    },
  },
  {
    id: 'PUB-1993-012',
    title: 'Quantifying Synaptic Vesicle Depletion at Schaffer Collateral Terminals under High-Frequency Stimulation',
    authors: [
      { name: 'Dr. Marcus H. Weber', role: 'Główny Autor', affiliation: 'Wydział Biologii Molekularnej' },
      { name: 'Dr. Elena Vance', role: 'Współautor', affiliation: 'Instytut Neurobiologii Poznawczej' },
      { name: 'Dr. Aris Thorne', role: 'Konsultant Biofizyczny', affiliation: 'Pracownia Elektrofizjologii Komórkowej, Sektor-7', isThorne: true },
    ],
    date: '18 stycznia 1993',
    year: 1993,
    journal: 'Synapse Kinetics Review, Vol. 11, pp. 44–59',
    doi: '10.1016/j.synapse.1993.01.012',
    category: 'Synaptic Plasticity',
    citations: 78,
    abstract:
      'Mikroskopia elektronowa i pomiary fluorescencyjne FM1-43 w strefie aktywnej synaps CA3-CA1. Stymulacja 100 Hz powoduje wyczerpanie puli pęcherzyków gotowych do uwolnienia (RRP) w czasie 1.4 sekundy, uniemożliwiając dalszą transmisję sygnału bez syntezy de novo.',
    methodology: {
      tissueSample: 'Hodowle organotypowe skrawków hipokampa',
      electrodeArray: 'Elektrody stymulujące bipolarne Pt-Ir',
      perfusionAgent: 'Barwnik FM1-43 w roztworze Tyrode',
      samplingFrequency: '10 kHz',
    },
  },
  {
    id: 'PUB-1992-077',
    title: 'Microfluidic Delivery of Ionotropic Antagonists during Multi-Electrode Electrocorticography',
    authors: [
      { name: 'Dr. Sarah Lin', role: 'Główny Badacz', affiliation: 'Departament Inżynierii Biomedycznej' },
      { name: 'Dr. Aris Thorne', role: 'Współautor', affiliation: 'Pracownia Elektrofizjologii Komórkowej, Sektor-7', isThorne: true },
    ],
    date: '22 października 1992',
    year: 1992,
    journal: 'Microdevice Technology in Neuroscience, Vol. 5, pp. 112–129',
    doi: '10.1016/j.microdev.1992.10.077',
    category: 'Microelectrode Arrays',
    citations: 165,
    abstract:
      'Integracja kanałów mikroprzepływowych PDMS z elektrodami krzemowymi. Umożliwia zlokalizowaną perfuzję antagonisty APV (D-2-amino-5-fosfonowalerianianu) do wybranych mikrokolumn korowych z dokładnością do 10 piko-litrów.',
    methodology: {
      tissueSample: 'Kora mózgowa gryzoni in vivo',
      electrodeArray: 'Zintegrowana matryca mikroprzepływowo-elektrodowa',
      perfusionAgent: 'APV (50 µM) + CNQX (20 µM)',
      samplingFrequency: '20 kHz',
    },
  },
  {
    id: 'PUB-1992-034',
    title: 'Long-Term Potentiation (LTP) Impairment via Intracellular Magnesium Block Removal in Hypoxic Neurons',
    authors: [
      { name: 'Dr. Aris Thorne', role: 'Główny Badacz', affiliation: 'Pracownia Elektrofizjologii Komórkowej, Sektor-7', isThorne: true },
      { name: 'Dr. Elena Vance', role: 'Współautor', affiliation: 'Instytut Neurobiologii Poznawczej' },
    ],
    date: '05 kwietnia 1992',
    year: 1992,
    journal: 'Hypoxia & Neuronal Pathology, Vol. 8, pp. 201–214',
    doi: '10.1016/j.hypox.1992.04.034',
    category: 'Receptor Kinetics',
    citations: 194,
    abstract:
      'Badanie wpływu niedotlenienia na stabilność engramów pamięciowych. W warunkach anoksji dochodzi do utraty wrażliwości kanałów NMDA na jon Mg2+, powodując natychmiastowe zatarcie śladu pamięciowego i uniemożliwienie konsolidacji LTP.',
    methodology: {
      tissueSample: 'Skrawki hipokampa w komorze hipoksyjnej',
      electrodeArray: 'Szklane mikroelektrody zewnątrzkomórkowe',
      perfusionAgent: 'Gaz anoksyjny 95% N2 / 5% CO2',
      samplingFrequency: '10 kHz',
    },
  },
  {
    id: 'PUB-1991-089',
    title: 'Digital Reconstruction of CA3-CA1 Feedforward Axonal Arbors using 66-MHz Dedicated Processing Clocks',
    authors: [
      { name: 'Dr. Julian Brandt', role: 'Główny Badacz', affiliation: 'DOD Biological Instrumentation Division' },
      { name: 'Dr. Aris Thorne', role: 'Kierownik Merytoryczny', affiliation: 'Pracownia Elektrofizjologii Komórkowej, Sektor-7', isThorne: true },
    ],
    date: '14 listopada 1991',
    year: 1991,
    journal: 'Early Computational Neuroscience & Silicon Engrams, Vol. 3, pp. 67–85',
    doi: '10.1016/j.compneuro.1991.11.089',
    category: 'Connectomics',
    citations: 133,
    abstract:
      'Początki architektury BioResearcher: emulacja dynamiki 10 000 synaps hipokampa na dedykowanym klastrze procesorów RISC taktowanych zegarem 66 MHz. Wykazano, że odwzorowanie opóźnień aksonalnych w krzemie eliminuje biologiczny rozpad śladu pamięciowego.',
    methodology: {
      tissueSample: 'Model numeryczny oparty na rekonstrukcjach histologicznych Thorne’a',
      electrodeArray: 'Magistrala VMEbus z koprocesorami DSP',
      perfusionAgent: 'N/A (model krzemowy in vitro)',
      samplingFrequency: '100 kHz (cykl magistrali)',
    },
  },
];

const ITEMS_PER_PAGE = 4;
const TOTAL_PAGES = 3;

export default function ArchivePage() {
  const { opticsOn, sanityStage } = useSystemState();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [expandedPubId, setExpandedPubId] = useState<string | null>('PUB-1994-088');

  const isDistorted = !opticsOn || sanityStage === 'insanity';

  const categories = ['All', 'Receptor Kinetics', 'Microelectrode Arrays', 'Excitotoxicity', 'Connectomics', 'Synaptic Plasticity'];

  const filteredPublications = useMemo(() => {
    return PUBLICATIONS_DATABASE.filter((pub) => {
      const matchesCategory = selectedCategory === 'All' || pub.category === selectedCategory;
      const lowerSearch = searchFilter.toLowerCase();
      const matchesSearch =
        !lowerSearch ||
        pub.title.toLowerCase().includes(lowerSearch) ||
        pub.doi.toLowerCase().includes(lowerSearch) ||
        pub.authors.some((a) => a.name.toLowerCase().includes(lowerSearch)) ||
        pub.abstract.toLowerCase().includes(lowerSearch);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchFilter]);

  const displayedPublications = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPublications.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPublications, currentPage]);

  const handleToggleExpand = (id: string) => {
    soundEngine.playKeystroke();
    setExpandedPubId(expandedPubId === id ? null : id);
  };

  const handlePageChange = (page: number) => {
    soundEngine.playKeystroke();
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex-1 flex flex-col space-y-6">
      {/* 1. HEADER SEKCYJNY (Zgodnie z wireframe archiwa.png) */}
      <section
        className={`p-5 md:p-7 rounded-xl border transition-all duration-300 ${
          isDistorted
            ? 'bg-[#090505] border-[#781414] anomaly-border-blood text-[#e6c2b8]'
            : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 shadow-sm'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-4 border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-xs font-sans text-slate-500 mb-1">
              <Link href="/" className="hover:text-sky-600">Home</Link>
              <span>&gt;</span>
              <span className="text-slate-400">Zasoby Badawcze</span>
              <span>&gt;</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Publikacje & Archiwa</span>
            </div>
            <h1
              className={`text-xl md:text-2xl font-extrabold tracking-tight font-sans ${
                isDistorted ? 'text-red-400 anomaly-glow-blood font-mono' : 'text-slate-900 dark:text-white'
              }`}
            >
              ARCHIWUM PUBLIKACJI NAUKOWYCH & BIAŁYCH KSIĄG (1991–1994)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-sans">
              Zbiór prac badawczych z zakresu kinetyki receptorów CA1, mikromacierzy neuronowych oraz modelowania transferu konektomu.
            </p>
          </div>

          <div className="text-right text-xs font-mono text-slate-500">
            <p>ZAREJESTROWANYCH PRAC: {PUBLICATIONS_DATABASE.length}</p>
            <p className="text-[11px] text-sky-600 dark:text-sky-400">STATUS BAZY: DOSTĘP JAWNY (GLP)</p>
          </div>
        </div>

        {/* FILTRY I WYSZUKIWARKA */}
        <div className="pt-4 flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Kategorie */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundEngine.playKeystroke();
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? isDistorted
                      ? 'bg-red-900 text-white border border-red-700'
                      : 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat === 'All' ? 'Wszystkie Publikacje' : cat}
              </button>
            ))}
          </div>

          {/* Input wyszukiwarki */}
          <div className="w-full md:w-72">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => {
                setSearchFilter(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Filtruj wg tytułu, autora, DOI..."
              className="w-full px-3 py-1.5 text-xs rounded-md border outline-none bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:border-sky-500"
            />
          </div>
        </div>
      </section>

      {/* 2. GŁÓWNA LISTA / TABELA ARTYKUŁÓW (Ściśle według schematu archiwa.png) */}
      <section className="space-y-3 font-sans">
        {displayedPublications.map((pub) => {
          const isExpanded = expandedPubId === pub.id;
          const thorneAuthor = pub.authors.find((a) => a.isThorne);

          return (
            <article
              key={pub.id}
              className={`rounded-lg border transition-all duration-200 overflow-hidden ${
                isDistorted
                  ? 'bg-[#090505] border-[#781414]/70 hover:border-red-600'
                  : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 hover:border-sky-400 shadow-sm'
              }`}
            >
              {/* WIERSZ GŁÓWNY PUBLIKACJI (tytuł, autorzy, data, akcja) */}
              <div
                onClick={() => handleToggleExpand(pub.id)}
                className="p-4 md:p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold">
                      {pub.category}
                    </span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-500">{pub.date}</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-sky-600 dark:text-sky-400 font-semibold">DOI: {pub.doi}</span>
                  </div>

                  <h3
                    className={`text-base md:text-lg font-bold tracking-tight ${
                      isDistorted ? 'text-red-300 anomaly-glow-blood font-mono' : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {pub.title}
                  </h3>

                  <div className="text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Autorzy:</span>
                    {pub.authors.map((author, idx) => (
                      <span
                        key={idx}
                        className={
                          author.isThorne
                            ? isDistorted
                              ? 'text-red-400 font-bold underline font-mono'
                              : 'text-sky-700 dark:text-sky-300 font-semibold underline'
                            : 'text-slate-600 dark:text-slate-400'
                        }
                      >
                        {author.name}
                        {idx < pub.authors.length - 1 ? ',' : ''}
                      </span>
                    ))}
                    <span className="text-slate-400">({pub.journal})</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end md:self-center">
                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded text-xs font-semibold tracking-wider transition-all flex items-center space-x-1.5 ${
                      isExpanded
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                        : isDistorted
                        ? 'bg-red-950 text-red-200 border border-red-800'
                        : 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800 hover:bg-sky-100'
                    }`}
                  >
                    <span>{isExpanded ? 'Zwiń Abstrakt' : 'Rozwiń Abstrakt'}</span>
                    <span className="text-xs font-bold">{isExpanded ? '▲' : '▼'}</span>
                  </button>
                </div>
              </div>

              {/* ROZWIJANY PANEL DETALI (ABSTRAKT, METODYKA, PROFIL NAUKOWCA) */}
              {isExpanded && (
                <div
                  className={`p-5 md:p-6 border-t transition-colors ${
                    isDistorted
                      ? 'bg-[#0f0707] border-[#781414]/50'
                      : 'bg-slate-50/70 dark:bg-[#0c101a] border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEWA KOLUMNA: ABSTRAKT I METODYKA */}
                    <div className="lg:col-span-8 space-y-4">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                          ABSTRAKT PRACY NAUKOWEJ
                        </h4>
                        <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                          {pub.abstract}
                        </p>
                      </div>

                      {/* Tabela parametrów metodycznych */}
                      <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-xs font-mono space-y-1.5">
                        <div className="flex justify-between border-b pb-1 border-slate-100 dark:border-slate-800">
                          <span className="text-slate-500">Próbka Tkankowa:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {pub.methodology.tissueSample}
                          </span>
                        </div>
                        <div className="flex justify-between border-b pb-1 border-slate-100 dark:border-slate-800">
                          <span className="text-slate-500">Aparatura Elektrodowa:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {pub.methodology.electrodeArray}
                          </span>
                        </div>
                        <div className="flex justify-between border-b pb-1 border-slate-100 dark:border-slate-800">
                          <span className="text-slate-500">Środek Perfuzji:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {pub.methodology.perfusionAgent}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Częstotliwość Próbkowania:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {pub.methodology.samplingFrequency}
                          </span>
                        </div>
                      </div>

                      {/* Notatka edytorska (ARG Lore) */}
                      {pub.editorialNote && (
                        <div
                          className={`p-3 rounded text-xs leading-relaxed ${
                            isDistorted
                              ? 'bg-red-950/60 border border-red-800 text-red-200 font-mono anomaly-glow-blood'
                              : 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 font-sans'
                          }`}
                        >
                          <p className="font-bold tracking-wider mb-1">
                            {isDistorted ? '[POUFNY RAPORT EKSCYTOTOKSYCZNOŚCI]:' : '[NOTATKA REDAKCYJNA WYDAWNICTWA]:'}
                          </p>
                          <p>{pub.editorialNote}</p>
                        </div>
                      )}

                      {/* Pozostali współautorzy - profesjonalne biometryczne placeholdery */}
                      <div className="pt-2">
                        <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Afiliacje Zespołu Badawczego:
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {pub.authors
                            .filter((a) => !a.isThorne)
                            .map((author, idx) => (
                              <div
                                key={idx}
                                className="p-2 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] flex items-center space-x-2.5 text-xs"
                              >
                                <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-[10px]">
                                  {author.name.split(' ').map((n) => n[0]).join('')}
                                </div>
                                <div className="leading-tight">
                                  <p className="font-semibold text-slate-800 dark:text-slate-200">{author.name}</p>
                                  <p className="text-[10px] text-slate-500">{author.role}</p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* PRAWA KOLUMNA: JEŚLI PRACA DR. THORNE'A -> ZDJĘCIE Z PUBLIC/IMAGES/ARIS */}
                    {thorneAuthor && (
                      <div className="lg:col-span-4 flex flex-col items-center">
                        <ScientistPortrait compact />
                        <div className="mt-2 text-center">
                          <Link
                            href="/chat"
                            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                          >
                            Zapytaj BioResearcher AI o tę publikację &rarr;
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </section>

      {/* 3. PAGINACJA DOLNA (Dokładnie wg szkicu: 1 / X stron -> nastepna buton itp) */}
      <section
        className={`p-3 md:p-4 rounded-lg border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono transition-colors ${
          isDistorted
            ? 'bg-[#090505] border-[#781414] text-[#ffcccc]'
            : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 shadow-sm'
        }`}
      >
        <div className="flex items-center space-x-2">
          <span>Strona</span>
          <span className="font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
            {currentPage}
          </span>
          <span>z {TOTAL_PAGES} stron</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500">Wyświetlanie {displayedPublications.length} z {filteredPublications.length} publikacji</span>
        </div>

        {/* Przyciski paginacji */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
          >
            &larr; Poprzednia
          </button>

          {[1, 2, 3].map((p) => (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              className={`w-8 h-8 rounded font-bold transition-all ${
                currentPage === p
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(Math.min(TOTAL_PAGES, currentPage + 1))}
            disabled={currentPage === TOTAL_PAGES}
            className="px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
          >
            Następna &rarr;
          </button>
        </div>
      </section>

      {/* STOPKA FIRMOWA ZGODNA ZE SZKICEM ('nazwa firmy inc.') */}
      <div className="text-right text-xs font-mono text-slate-400 dark:text-slate-500 pt-2 select-none">
        <p>NeuroClin Biosciences Inc. // Department of Cellular Neurobiology</p>
      </div>
    </div>
  );
}
