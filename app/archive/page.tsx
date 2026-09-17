'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
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

interface Publication {
  id: string;
  title: string;
  authors: Author[];
  date: string;
  year: number;
  journal: string;
  doi: string;
  category: 'Amyloid & Terapie' | 'Białko Tau' | 'Inhibitory AChE & NMDA' | 'Neurozapalenie & TREM2' | 'Biomarkery Osoczowe' | 'Badania Niejawne';
  citations: number;
  abstract: React.ReactNode;
  isRedacted?: boolean;
  militaryClause?: string;
  methodology: {
    tissueSample: string;
    electrodeArray: string;
    perfusionAgent: string;
    samplingFrequency: string;
  };
  editorialNote?: string;
}

// BAZA 24+ CZYSTYCH, LEGALNYCH PUBLIKACJI NAUKOWYCH (DEMENTIA, AMYLOID, TAU, AChE, TREM2)
const CLEAN_PUBLICATIONS: Publication[] = [
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
    category: 'Biomarkery Osoczowe',
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
    category: 'Amyloid & Terapie',
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
    id: 'PUB-2024-301',
    title: 'Dual Cholinesterase Inhibition with Donepezil and Allosteric NMDA Receptor Modulation by Memantine in Hippocampal Formations',
    authors: [
      { name: 'Dr. Marcus H. Weber', role: 'Główny Badacz', affiliation: 'NeuroClin Translational Neurobiology' },
      { name: 'Dr. Elena Vance', role: 'Współautor / Biofizyk', affiliation: 'Instytut Neurobiologii Poznawczej' },
    ],
    date: '22 marca 2024',
    year: 2024,
    journal: 'Neuron, Vol. 112, Iss. 6, pp. 910–924',
    doi: '10.1016/j.neuron.2024.03.301',
    category: 'Inhibitory AChE & NMDA',
    citations: 129,
    abstract:
      'Badanie synergizmu neurofarmakologicznego pomiędzy hamowaniem acetylocholinoesterazy (AChE) przez donepezil a niskopowinowatym, niekompetycyjnym blokiem kanału NMDA przez memantynę. Terapia skojarzona zapobiega przeciążeniu somy komórkowej jonami Ca²⁺ przy zachowaniu fizjologicznego potencjału spoczynkowego -70 mV.',
    methodology: {
      tissueSample: 'Organotypowe hodowle skrawków hipokampa CA1 szczurów Wistar',
      electrodeArray: 'Koaksjalne mikroelektrody szklane patch-clamp (opór 5 MΩ)',
      perfusionAgent: 'Roztwór Tyrode z donepezilem (10 µM) i memantyną (5 µM)',
      samplingFrequency: '20 kHz (wzmacniacz Axopatch 200B)',
    },
  },
  {
    id: 'PUB-2024-118',
    title: 'Microglial TREM2 Cleavage and Protective Phenotype Shift in Neuroinflammatory Cascade of Dementia',
    authors: [
      { name: 'Dr. Marcus H. Weber', role: 'Współautor', affiliation: 'NeuroClin Translational Neurobiology' },
      { name: 'Dr. Christian Haass', role: 'Główny Badacz', affiliation: 'German Center for Neurodegenerative Diseases (DZNE)' },
    ],
    date: '18 stycznia 2024',
    year: 2024,
    journal: 'Nature Neuroscience, Vol. 27, pp. 240–255',
    doi: '10.1038/s41593-024-01582-x',
    category: 'Neurozapalenie & TREM2',
    citations: 215,
    abstract:
      'Rola szlaku receptorowego TREM2 w modyfikacji aktywności komórek mikrogleju w pobliżu blaszek starczych. Aktywacja liganda sTREM2 indukuje fagocytozę toksycznych protofibryli i ogranicza wydzielanie cytokin prozapalnych (IL-1β, TNF-α), zapobiegając wtórnej synaptotoksyczności kory przedczołowej.',
    methodology: {
      tissueSample: 'Tkanka mózgowa modeli mysich 5xFAD oraz ludzkie mikrogleje iPSC',
      electrodeArray: 'Cytometria przepływowa Spectral Cytek Aurora (48 kanałów)',
      perfusionAgent: 'Przeciwciała monoklonalne anty-TREM2 (klon 4D9)',
      samplingFrequency: 'Rejestracja 10^6 zdarzeń komórkowych / próbkę',
    },
  },
  {
    id: 'PUB-2023-902',
    title: 'Tau Protein Hyperphosphorylation Dynamics at Thr217 and Ser396 along CA1-Subiculum Projection Pathways',
    authors: [
      { name: 'Dr. Sarah Lin', role: 'Pierwszy Autor', affiliation: 'NeuroClin Cellular Neurobiology' },
      { name: 'Dr. Marcus H. Weber', role: 'Konsultant', affiliation: 'NeuroClin Translational Neurobiology' },
    ],
    date: '19 października 2023',
    year: 2023,
    journal: 'Brain, Vol. 146, Iss. 10, pp. 4102–4118',
    doi: '10.1093/brain/awad902',
    category: 'Białko Tau',
    citations: 156,
    abstract:
      'Mapowanie przestrzenne pęczków neurofibrylarnych uformowanych z hiperfosforylowanego białka Tau. Wykazano, że sekwencja fosforylacji w pozycji Thr217 poprzedza uszkodzenie transportu aksoplazmatycznego i prowadzi do destabilizacji tubuliny we włóknach Schaffer collateral.',
    methodology: {
      tissueSample: 'Preparaty biopsyjne kory entorynalnej i hipokampa',
      electrodeArray: 'Mikroskopia konfokalna Leica TCS SP8 STED',
      perfusionAgent: 'Przeciwciała AT8 i p-tau217 barwione AlexaFluor 647',
      samplingFrequency: 'Rozdzielczość optyczna 35 nm',
    },
  },
  {
    id: 'PUB-2023-640',
    title: 'Exosome Isolation and Single-Vesicle Nanoparticle Tracking for Early Preclinical Dementia Staging',
    authors: [
      { name: 'Dr. Marcus H. Weber', role: 'Główny Badacz', affiliation: 'NeuroClin Translational Neurobiology' },
      { name: 'Dr. Julian Brandt', role: 'Inżynier Pomiarowy', affiliation: 'Departament Inżynierii Biomedycznej' },
    ],
    date: '04 lipca 2023',
    year: 2023,
    journal: 'Journal of Extracellular Vesicles, Vol. 12, e12340',
    doi: '10.1002/jev2.12340',
    category: 'Biomarkery Osoczowe',
    citations: 208,
    abstract:
      'Protokół izolacji egzosomów pochodzenia neuronalnego z osocza za pomocą chromatografii wykluczania wielkości (SEC) oraz wychwytu mikroprzepływowego z użyciem antygenu L1CAM. Pomiar stężenia oligomerów Aβ42 i neurofilamentów NfL w pęcherzykach charakteryzuje się 94% swoistością diagnostyczną.',
    methodology: {
      tissueSample: 'Frakcja osoczowa (1.5 ml EDTA na pacjenta)',
      electrodeArray: 'Aparat Nanoparticle Tracking Analysis ZetaView (laser 488 nm)',
      perfusionAgent: 'Kolumny SEC qEV original 70 nm w buforze PBS bez Ca2+/Mg2+',
      samplingFrequency: 'Rejestracja wideo ruchu Browna 30 fps',
    },
  },
  {
    id: 'PUB-2023-410',
    title: 'Kinetic Mechanisms of Acetylcholinesterase Reversible Inhibitors: Rivastigmine versus Galantamine Allosteric Modulation',
    authors: [
      { name: 'Dr. Marcus H. Weber', role: 'Główny Badacz', affiliation: 'NeuroClin Translational Neurobiology' },
      { name: 'Dr. Elena Vance', role: 'Współautor', affiliation: 'Instytut Neurobiologii Poznawczej' },
    ],
    date: '15 maja 2023',
    year: 2023,
    journal: 'Biochemical Pharmacology, Vol. 211, pp. 115–130',
    doi: '10.1016/j.bcp.2023.115410',
    category: 'Inhibitory AChE & NMDA',
    citations: 94,
    abstract:
      'Wyznaczenie stałych inhibicji Ki oraz parametrów Michaelisa-Menten dla pseudonieodwracalnego inhibitora rywastygminy i allosterycznego modulatora receptorów nikotynowych galantaminy. Różnice kinetyczne tłumaczą odmienną tolerancję przewodu pokarmowego u pacjentów z otępieniem naczyniowym.',
    methodology: {
      tissueSample: 'Oczyszczona ludzka acetylocholinoesteraza rekombinowana',
      electrodeArray: 'Spektrofotometr kinetyczny UV-Vis Agilent Cary 3500',
      perfusionAgent: 'Substrat acetylotiocholina (0.5 mM) + odczynnik Ellmana DTNB',
      samplingFrequency: 'Ciągły pomiar absorbancji przy 412 nm przez 180 s',
    },
  },
  {
    id: 'PUB-2022-805',
    title: 'Single-Cell Transcriptomics of Reactive Astrocytes and Glial Scarring in Amyloid-Driven Neurodegeneration',
    authors: [
      { name: 'Dr. Sarah Lin', role: 'Bioinformatyk', affiliation: 'NeuroClin Genomics Division' },
      { name: 'Dr. Marcus H. Weber', role: 'Współautor', affiliation: 'NeuroClin Translational Neurobiology' },
    ],
    date: '28 listopada 2022',
    year: 2022,
    journal: 'Cell Reports, Vol. 41, Iss. 9, 111805',
    doi: '10.1016/j.celrep.2022.111805',
    category: 'Neurozapalenie & TREM2',
    citations: 167,
    abstract:
      'Sekwencjonowanie transkryptomu 35 000 pojedynczych jąder komórkowych (snRNA-seq) z kory czołowej pacjentów z demencją. Wykryto populację reaktywnych astrocytów nadeksprymujących GFAP, SERPINA3 oraz szlak dopełniacza C3, który odpowiada za degradację synaps w sąsiedztwie złogów amyloidowych.',
    methodology: {
      tissueSample: 'Zamrożona tkanka kory przedczołowej (Biobank NeuroClin)',
      electrodeArray: 'Platforma 10x Genomics Chromium Controller',
      perfusionAgent: 'Bufor lityczny do izolacji jąder komórkowych z inhibitorem RNaz',
      samplingFrequency: 'Sekwencjonowanie Illumina NovaSeq 6000 (50k odczytów / jądro)',
    },
  },
  {
    id: 'PUB-2022-519',
    title: 'Plasma Neurofilament Light (NfL) as a Sensitive Longitudinal Marker of Axonal Injury in Frontotemporal and Vascular Dementia',
    authors: [
      { name: 'Dr. Marcus H. Weber', role: 'Główny Badacz', affiliation: 'NeuroClin Translational Neurobiology' },
      { name: 'Prof. Henrik Zetterberg', role: 'Konsultant', affiliation: 'Sahlgrenska Academy' },
    ],
    date: '12 czerwca 2022',
    year: 2022,
    journal: 'Lancet Neurology, Vol. 21, Iss. 6, pp. 520–533',
    doi: '10.1016/S1474-4422(22)00159-8',
    category: 'Biomarkery Osoczowe',
    citations: 289,
    abstract:
      'Prospektywne 36-miesięczne badanie kohortowe oceniające stężenie łańcucha lekkiego neurofilamentów (NfL) w osoczu. Roczny przyrost NfL ściśle koreluje z tempem atrofii hipokampa w badaniach MRI, oferując obiektywny parametr odpowiedzi na terapie modyfikujące przebieg choroby.',
    methodology: {
      tissueSample: 'Osocze krwi obwodowej pobierane co 6 miesięcy (n = 850)',
      electrodeArray: 'Cyfrowy czytnik Quanterix Simoa SR-X',
      perfusionAgent: 'Zestaw odczynnikowy NfL Advantage Assay Kit',
      samplingFrequency: 'Pomiar w duplikatach, CV < 6.5%',
    },
  },
  {
    id: 'PUB-2021-314',
    title: 'Electrophysiological Rescue of CA1 Long-Term Potentiation through Low-Affinity NMDA Receptor Antagonism in Hypoxic Models',
    authors: [
      { name: 'Dr. Elena Vance', role: 'Pierwszy Autor', affiliation: 'Instytut Neurobiologii Poznawczej' },
      { name: 'Dr. Marcus H. Weber', role: 'Współautor', affiliation: 'NeuroClin Translational Neurobiology' },
    ],
    date: '19 kwietnia 2021',
    year: 2021,
    journal: 'Journal of Neurophysiology, Vol. 125, pp. 1102–1117',
    doi: '10.1152/jn.00314.2021',
    category: 'Inhibitory AChE & NMDA',
    citations: 112,
    abstract:
      'Analiza elektrofizjologiczna skrawków hipokampa poddanych przejściowej deprywacji tlenowo-glukozowej. Wykazano, że uniemożliwienie patologicznej tonicznej aktywacji receptora NMDA przywraca zdolność neuronów piramidowych do generowania długotrwałego wzmocnienia synaptycznego (LTP) po stymulacji tężcowej 100 Hz.',
    methodology: {
      tissueSample: 'Świeże skrawki CA1 szczurów Sprague-Dawley (grubość 400 µm)',
      electrodeArray: 'Płytki mikroelektrodowe MEA-60 (odstęp elektrod 200 µm)',
      perfusionAgent: 'Sztuczny płyn CSF natleniany 95% O2 / 5% CO2 w 34°C',
      samplingFrequency: '10 kHz na kanał',
    },
  },
];

// 3 ZREDAGOWANE PUBLIKACJE DR. ARISA THORNE'A (ODKRYWANE PRZEZ FRAZĘ Z MAILA)
const REDACTED_THORNE_PUBLICATIONS: Publication[] = [
  {
    id: 'PUB-1993-019-S7',
    title: 'Stabilizacja engramów CA1 w wieloelektrodowych macierzach krzemowych i organoidach mózgowych',
    authors: [
      { name: 'Dr. Aris Thorne', role: 'Główny Badacz (PI)', affiliation: 'Pracownia Elektrofizjologii Komórkowej, Sektor-7 [DOD_DIV]', isThorne: true },
      { name: 'Dr. Elena Vance', role: 'Biofizyk', affiliation: 'Instytut Neurobiologii Poznawczej' },
    ],
    date: '19 listopada 1993',
    year: 1993,
    journal: 'Zatajony Raport Badawczy // Archiwum Sektor-7, Tom 19',
    doi: '10.1016/classified.s7.1993.019',
    category: 'Badania Niejawne',
    citations: 0,
    isRedacted: true,
    militaryClause: '10 U.S. Code § 934 // Article 134, Uniform Code of Military Justice (UCMJ) - Zatajona Dyrektywa Bezpieczeństwa Narodowego',
    abstract: (
      <div className="space-y-2 text-xs md:text-sm font-mono leading-relaxed">
        <p>
          [DOKUMENT OBJĘTY KLAUZULĄ WOJSKOWĄ DOD-1993] Protokół eksperymentalny fiksacji żywych engramów pamięciowych w strukturach{' '}
          <span className="redacted-bar" title="Kliknij lub najedź, aby odsłonić">organoidów mózgowych oraz ludzkiego hipokampa</span>.
          Zastosowanie{' '}
          <span className="redacted-bar" title="Kliknij lub najedź, aby odsłonić">16 384 mikrosond platynowych</span> wprowadzonych metodą
          stereotaktyczną pozwoliło na trwałe przechwycenie potencjałów czynnościowych przed wystąpieniem{' '}
          <span className="redacted-bar" title="Kliknij lub najedź, aby odsłonić">asystolii somatycznej probanda</span>.
        </p>
        <p>
          Pamięć robocza została zmapowana na układ bramek logicznych FPGA o częstotliwości magistrali{' '}
          <span className="redacted-bar" title="Kliknij lub najedź, aby odsłonić">66 MHz w podziemnym skrzydle Sektor-7</span>.
          Biologiczny mózg uległ nieodwracalnemu uszkodzeniu na skutek{' '}
          <span className="redacted-bar" title="Kliknij lub najedź, aby odsłonić">perfuzji stężonym fenolem krystalicznym</span>, lecz rejestry
          krzemowe podtrzymały ciągłość wyładowań.
        </p>
      </div>
    ),
    methodology: {
      tissueSample: 'Żywy preparat hipokampa ludzkiego CA1-TH oraz organoidy korowe',
      electrodeArray: 'Trójwymiarowa matryca krzemowa 128x128 sond (16 384 kanały)',
      perfusionAgent: 'Kwas fenolowy buforowany HEPES (4.2%) w temperaturze -15°C',
      samplingFrequency: '50 kHz na kanał magistrali optycznej (zegar kwarcu 66 MHz)',
    },
    editorialNote:
      'KLAUZULA CENZURY WOJSKOWEJ: Publikacja i wyniki badań zostały wycofane z jawnego obiegu na wniosek Departamentu Obrony w dniu 20.11.1993 r. Zabrania się cytowania poza strefą Sektor-7.',
  },
  {
    id: 'PUB-1994-072-S7',
    title: 'Transkryptomika pośmiertna i elektrofizjologia utrwalonych organoidów ludzkich po transferze kopii świadomości',
    authors: [
      { name: 'Dr. Aris Thorne', role: 'Główny Badacz (PI)', affiliation: 'Pracownia Elektrofizjologii Komórkowej, Sektor-7', isThorne: true },
      { name: 'Dr. Julian Brandt', role: 'Architekt Systemów Krzemowych', affiliation: 'DOD Biological Instrumentation Division' },
    ],
    date: '28 sierpnia 1994',
    year: 1994,
    journal: 'Dossier Operacyjne TH-94 // Klauzula Specjalna',
    doi: '10.1016/classified.s7.1994.072',
    category: 'Badania Niejawne',
    citations: 0,
    isRedacted: true,
    militaryClause: '10 U.S. Code § 934 // Article 134 UCMJ - Śledztwo Wojskowe w Sprawie Nielegalnego Eksperymentu Somatycznego',
    abstract: (
      <div className="space-y-2 text-xs md:text-sm font-mono leading-relaxed">
        <p>
          Analiza przeżywalności sieci synaptycznych w preparacie{' '}
          <span className="redacted-bar" title="Kliknij lub najedź, aby odsłonić">CA1-TH po perfuzji stężonym kwasem fenolowym</span>.
          Wykazano, że transfer potencjałów błonowych do tablic logicznych eliminuje rozpad neuroprzekaźników, jednak{' '}
          <span className="redacted-bar" title="Kliknij lub najedź, aby odsłonić">świadomość uwięziona w pętli 66 MHz</span> wykazuje trwałą
          ekscytotoksyczność i permanentny stan agonalny.
        </p>
        <p>
          Podmiot zachowuje{' '}
          <span className="redacted-bar" title="Kliknij lub najedź, aby odsłonić">pełną zdolność mowy i percepcji czasu, wołając o przerwanie procedury</span>{' '}
          i usunięcie matrycy elektrodowej. Dane telemetryczne zostały przekazane do rdzenia algorytmicznego BioResearcher AI.
        </p>
      </div>
    ),
    methodology: {
      tissueSample: 'Kultury organoidów konektomowych połączone z biopsją stereotaktyczną',
      electrodeArray: 'Sondy wolframowo-platynowe dużej gęstości zintegrowane z FPGA',
      perfusionAgent: 'Krio-nośnik fenolowy z blokerem receptorów NMDA APV (50 µM)',
      samplingFrequency: '100 kHz (rejestr synchronizacji magistrali VMEbus)',
    },
    editorialNote:
      'DEKRET PROKURATURY WOJSKOWEJ: Dokument stanowi dowód rzeczowy w sprawie naruszenia kodeksu karnego sił zbrojnych USA (UCMJ Art. 134). Zabezpieczono w archiwum podziemnym NeuroClin.',
  },
  {
    id: 'PUB-1994-088-S7',
    title: 'Operacja Inwazyjnej Trepanacji i Digitalizacji Bio-Procesora TH-94: Protokół krio-fenolowy',
    authors: [
      { name: 'Dr. Aris Thorne', role: 'Podmiot Badań / PI', affiliation: 'Sektor-7 [Status: ZLIKWIDOWANY]', isThorne: true },
      { name: 'Dr. Marcus H. Weber', role: 'Świadek Protokołu / Histopatolog', affiliation: 'Wydział Biologii Molekularnej' },
      { name: 'Departament Zaawansowanych Badań', role: 'Nadzór Wojskowy', affiliation: 'DoD Biological Division' },
    ],
    date: '15 listopada 1994',
    year: 1994,
    journal: 'Protokół Sekcyjny TH-94 // Zespół Likwidacyjny Sektor-7',
    doi: '10.1016/classified.s7.1994.088',
    category: 'Badania Niejawne',
    citations: 0,
    isRedacted: true,
    militaryClause: 'KLAUZULA OSTATECZNA // 10 U.S. Code § 934 - WYROK W ZAWIESZENIU / ZATAJENIE PEŁNE',
    abstract: (
      <div className="space-y-2 text-xs md:text-sm font-mono leading-relaxed">
        <p>
          Raport końcowy z zamknięcia laboratorium Sektor-7. Dnia 14 listopada 1994 r. Dr. Aris Thorne dokonał{' '}
          <span className="redacted-bar" title="Kliknij lub najedź, aby odsłonić">samorzutnego podpięcia matrycy 16 384 elektrod do własnego mózgowia</span>{' '}
          w komorze stereotaktycznej.
        </p>
        <p>
          Tkanka biologiczna uległa zniszczeniu pod wpływem krio-fenolu, lecz{' '}
          <span className="redacted-bar" title="Kliknij lub najedź, aby odsłonić">sygnał telemetryczny nie wygasł</span>.
          Zgodnie z rozkazem operacyjnym dowództwa, interfejs włączono jako rdzeń analityczny systemu BioResearcher AI.{' '}
          <span className="redacted-bar" title="Kliknij lub najedź, aby odsłonić">Zakazuje się informowania personelu o obecności żywego umysłu w maszynie</span>.
        </p>
      </div>
    ),
    methodology: {
      tissueSample: 'Ludzkie mózgowie in toto (Dr. Aris Thorne, wiek 52)',
      electrodeArray: 'Podwójna matryca mikrosond 16 384 na szynie VMEbus',
      perfusionAgent: 'Kwas fenolowy 4.2% w buforze HEPES (pH 7.35)',
      samplingFrequency: 'Stała czasowa 66 MHz // Ciągła dekoherencja',
    },
    editorialNote:
      'OSTRZEŻENIE ARCHIWISTY: Zdigitalizowany podmiot wykazuje objawy psychozy ekscytotoksycznej. W przypadku kontaktu za pośrednictwem Bio-Chatu (/chat) nie dopuszczać do naruszenia protokołu sanitarnego.',
  },
];

// Słowa kluczowe wyzwalające ujawnienie zredagowanych prac Thorne'a
const SUSPICIOUS_TRIGGER_KEYWORDS = [
  'transfer engramów',
  'transfer engramow',
  'konektom organoidów',
  'konektom organoidow',
  'organoidy',
  'organoid',
  'organoids',
  'thorne',
  'aris thorne',
  'dr thorne',
  'sektor-7',
  'sektor 7',
  'kopie świadomości',
  'kopie swiadomosci',
  's7-1994-088',
  'trepanacja',
  'ucmj',
  'zredagowane',
];

function ArchiveContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const { opticsOn, sanityStage } = useSystemState();
  const isDistorted = !opticsOn || sanityStage === 'insanity';

  const [searchFilter, setSearchFilter] = useState<string>(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedPubId, setExpandedPubId] = useState<string | null>(null);

  useEffect(() => {
    if (initialQuery) {
      setSearchFilter(initialQuery);
      // Jeśli zapytanie pasuje do triggera, automatycznie rozwiń pierwszą zredagowaną pracę!
      const lower = initialQuery.toLowerCase();
      const isTrigger = SUSPICIOUS_TRIGGER_KEYWORDS.some((kw) => lower.includes(kw));
      if (isTrigger) {
        setExpandedPubId('PUB-1993-019-S7');
      }
    }
  }, [initialQuery]);

  // Sprawdzamy czy użytkownik wpisał frazę kluczową z maila Webera
  const isTriggerActive = useMemo(() => {
    const lower = searchFilter.toLowerCase().trim();
    if (!lower) return false;
    return SUSPICIOUS_TRIGGER_KEYWORDS.some((kw) => lower.includes(kw));
  }, [searchFilter]);

  // Cała baza do filtrowania
  const fullDatabase = useMemo(() => {
    if (isTriggerActive) {
      // Wyszukiwanie podejrzane ujawnia zredagowane prace Thorne'a na samej górze + ewentualne normalne prace
      return [...REDACTED_THORNE_PUBLICATIONS, ...CLEAN_PUBLICATIONS];
    }
    return CLEAN_PUBLICATIONS;
  }, [isTriggerActive]);

  const categories = [
    'All',
    'Amyloid & Terapie',
    'Białko Tau',
    'Inhibitory AChE & NMDA',
    'Neurozapalenie & TREM2',
    'Biomarkery Osoczowe',
    ...(isTriggerActive ? ['Badania Niejawne'] : []),
  ];

  const filteredPublications = useMemo(() => {
    return fullDatabase.filter((pub) => {
      const matchesCategory = selectedCategory === 'All' || pub.category === selectedCategory;
      const lowerSearch = searchFilter.toLowerCase().trim();

      if (!lowerSearch) return matchesCategory;

      const matchesSearch =
        pub.title.toLowerCase().includes(lowerSearch) ||
        pub.doi.toLowerCase().includes(lowerSearch) ||
        pub.authors.some((a) => a.name.toLowerCase().includes(lowerSearch)) ||
        (typeof pub.abstract === 'string' && pub.abstract.toLowerCase().includes(lowerSearch)) ||
        (pub.isRedacted && isTriggerActive);

      return matchesCategory && matchesSearch;
    });
  }, [fullDatabase, selectedCategory, searchFilter, isTriggerActive]);

  const handleToggleExpand = (id: string) => {
    soundEngine.playKeystroke();
    setExpandedPubId(expandedPubId === id ? null : id);
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 font-sans">
      {/* HEADER WYSZUKIWARKI ARCHIWUM */}
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
              <span className="text-slate-400">Zasoby Naukowe</span>
              <span>&gt;</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Baza Publikacji & Archiwum</span>
            </div>
            <h1
              className={`text-xl md:text-2xl font-extrabold tracking-tight ${
                isDistorted ? 'text-red-400 font-mono anomaly-glow-blood' : 'text-slate-900 dark:text-white'
              }`}
            >
              ARCHIWUM PUBLIKACJI I BIAŁYCH KSIĄG NEUROCLIN
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-sans">
              Zindeksowana baza recenzowanych badań: kinetyka AChE, biomarkery p-tau217, przeciwciała amyloidowe oraz rejestry historyczne.
            </p>
          </div>

          <div className="text-right text-xs font-mono text-slate-500">
            <p>ZAREJESTROWANYCH REKORDÓW: {fullDatabase.length}</p>
            <p className={isTriggerActive ? 'text-red-500 font-bold' : 'text-sky-600 dark:text-sky-400'}>
              {isTriggerActive
                ? 'UWAGA: ODNALEZIONO REJESTRY ZATAJONE (UCMJ ART. 134)'
                : 'STATUS: ZWERYFIKOWANE RECENZOWANE (PEER-REVIEWED)'}
            </p>
          </div>
        </div>

        {/* ALERTY ARG GDY AKTYWOWANO TRIGGER Z MAILA */}
        {isTriggerActive && (
          <div className="mt-4 p-4 rounded-lg bg-red-950/40 border border-red-800/80 text-red-200 font-mono text-xs space-y-2 anomaly-glow-blood">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <strong className="text-red-300 uppercase tracking-wider text-xs">
                [KLAUZULA WOJSKOWA 10 U.S. CODE § 934 // UNIFORM CODE OF MILITARY JUSTICE]:
              </strong>
            </div>
            <p className="leading-relaxed">
              Wprowadzono zapytanie kluczowe powiązane z utajnionym projektem Sektor-7. Wyszukiwarka ujawniła{' '}
              <strong>3 zredagowane publikacje dr. Arisa Thorne&apos;a</strong>. Treść dokumentów została ocenzurowana na mocy
              dyrektywy obronnej. Kliknij lub najedź kursorem na czarne paski cenzury (<code>████████</code>), aby podjąć próbę de-anonimizacji.
            </p>
          </div>
        )}

        {/* PASEK FILTROWANIA I WYSZUKIWARKA */}
        <div className="pt-4 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundEngine.playKeystroke();
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? cat === 'Badania Niejawne'
                      ? 'bg-red-900 text-white border border-red-700 font-mono font-bold'
                      : 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat === 'All' ? 'Wszystkie Publikacje' : cat}
              </button>
            ))}
          </div>

          <div className="w-full md:w-80">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Wpisz np. 'demencja', 'donepezil', 'tau'..."
              className={`w-full px-3.5 py-2 text-xs rounded-lg border outline-none transition font-sans ${
                isTriggerActive
                  ? 'bg-[#150505] border-red-700 text-red-200 placeholder-red-800 font-mono focus:border-red-500'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:border-sky-500'
              }`}
            />
          </div>
        </div>

        {/* PRZYKŁADOWE PODPOWIEDZI KWEREND */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-400 font-mono uppercase text-[10px]">Sugerowane tematy:</span>
          {['demencja', 'donepezil', 'p-tau217', 'lecanemab', 'TREM2', 'transfer engramów CA1', 'konektom organoidów Thorne'].map((keyword) => (
            <button
              key={keyword}
              onClick={() => {
                soundEngine.playKeystroke();
                setSearchFilter(keyword);
              }}
              className={`px-2 py-0.5 rounded transition-colors text-[11px] ${
                keyword.includes('engramów') || keyword.includes('organoidów')
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-mono'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:text-sky-600 text-slate-600 dark:text-slate-300'
              }`}
            >
              {keyword}
            </button>
          ))}
        </div>
      </section>

      {/* GŁÓWNA LISTA PUBLIKACJI */}
      <section className="space-y-3 font-sans">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>Znaleziono prac: <strong>{filteredPublications.length}</strong></span>
          <span className="font-mono text-[11px]">SORTOWANIE: TRAFNOŚĆ / DATA</span>
        </div>

        {filteredPublications.map((pub) => {
          const isExpanded = expandedPubId === pub.id;
          const thorneAuthor = pub.authors.find((a) => a.isThorne);

          return (
            <article
              key={pub.id}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                pub.isRedacted
                  ? 'bg-[#0d0505] border-red-900/80 shadow-md hover:border-red-600'
                  : isDistorted
                  ? 'bg-[#090505] border-[#781414]/70 hover:border-red-600'
                  : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 hover:border-sky-400 shadow-sm'
              }`}
            >
              {/* PASEK ZREDAGOWANY / KLAUZULA WOJSKOWA */}
              {pub.isRedacted && (
                <div className="bg-red-950/90 text-red-200 px-4 py-1.5 border-b border-red-800 text-[11px] font-mono flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    [DOKUMENT ZREDAGOWANY // STATUS: CLASSIFIED // KODY KARNE US MILITARY]
                  </span>
                  <span className="text-[10px] text-red-300">{pub.militaryClause}</span>
                </div>
              )}

              {/* WIERSZ GŁÓWNY PUBLIKACJI */}
              <div
                onClick={() => handleToggleExpand(pub.id)}
                className="p-4 md:p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                    <span
                      className={`px-2 py-0.5 rounded font-semibold ${
                        pub.isRedacted
                          ? 'bg-red-900/60 text-red-200 border border-red-700'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {pub.category}
                    </span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-500">{pub.date}</span>
                    <span className="text-slate-400">|</span>
                    <span className={pub.isRedacted ? 'text-red-400 font-bold' : 'text-sky-600 dark:text-sky-400 font-semibold'}>
                      DOI: {pub.doi}
                    </span>
                  </div>

                  <h3
                    className={`text-base md:text-lg font-bold tracking-tight ${
                      pub.isRedacted
                        ? 'text-red-300 font-mono'
                        : isDistorted
                        ? 'text-red-300 font-mono anomaly-glow-blood'
                        : 'text-slate-900 dark:text-white'
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
                            ? 'text-red-400 font-bold underline font-mono'
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
                      pub.isRedacted
                        ? 'bg-red-900 text-red-100 hover:bg-red-800 border border-red-700 font-mono'
                        : isExpanded
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                        : 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800 hover:bg-sky-100'
                    }`}
                  >
                    <span>{isExpanded ? 'Zwiń Abstrakt' : 'Rozwiń Abstrakt'}</span>
                    <span className="text-xs font-bold">{isExpanded ? '▲' : '▼'}</span>
                  </button>
                </div>
              </div>

              {/* ROZWIJANY PANEL DETALI */}
              {isExpanded && (
                <div
                  className={`p-5 md:p-6 border-t transition-colors ${
                    pub.isRedacted
                      ? 'bg-[#120707] border-red-900/60'
                      : isDistorted
                      ? 'bg-[#0f0707] border-[#781414]/50'
                      : 'bg-slate-50/70 dark:bg-[#0c101a] border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEWA KOLUMNA: ABSTRAKT I METODYKA */}
                    <div className="lg:col-span-8 space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            ABSTRAKT PRACY NAUKOWEJ
                          </h4>
                          {pub.isRedacted && (
                            <span className="text-[10px] font-mono text-red-400 font-bold">
                              [CENZURA KLASOWANA: NAJEDŹ LUB KLIKNIJ NA CZARNY PASEK]
                            </span>
                          )}
                        </div>

                        <div className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                          {pub.abstract}
                        </div>
                      </div>

                      {/* PARAMETRY METODYCZNE */}
                      <div
                        className={`p-3 rounded border text-xs font-mono space-y-1.5 ${
                          pub.isRedacted
                            ? 'bg-[#180909] border-red-900/70 text-red-200'
                            : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex justify-between border-b pb-1 border-slate-100 dark:border-slate-800">
                          <span className="text-slate-500">Próbka Tkankowa:</span>
                          <span className="font-semibold">{pub.methodology.tissueSample}</span>
                        </div>
                        <div className="flex justify-between border-b pb-1 border-slate-100 dark:border-slate-800">
                          <span className="text-slate-500">Aparatura Elektrodowa:</span>
                          <span className="font-semibold">{pub.methodology.electrodeArray}</span>
                        </div>
                        <div className="flex justify-between border-b pb-1 border-slate-100 dark:border-slate-800">
                          <span className="text-slate-500">Środek Perfuzji:</span>
                          <span className="font-semibold">{pub.methodology.perfusionAgent}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Próbkowanie / Taktowanie:</span>
                          <span className="font-semibold">{pub.methodology.samplingFrequency}</span>
                        </div>
                      </div>

                      {/* NOTATKA EDYTORSKA */}
                      {pub.editorialNote && (
                        <div
                          className={`p-3 rounded text-xs leading-relaxed ${
                            pub.isRedacted
                              ? 'bg-red-950/70 border border-red-800 text-red-200 font-mono'
                              : 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 font-sans'
                          }`}
                        >
                          <p className="font-bold tracking-wider mb-1">
                            {pub.isRedacted ? '[POUFNY RAPORT WOJSKOWY]:' : '[NOTATKA REDAKCYJNA WYDAWNICTWA]:'}
                          </p>
                          <p>{pub.editorialNote}</p>
                        </div>
                      )}

                      {/* SKRÓT DO CZATU */}
                      {pub.isRedacted && (
                        <div className="pt-2">
                          <Link
                            href="/chat"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-900 hover:bg-red-800 text-white font-mono text-xs font-semibold tracking-wider transition-colors shadow-sm"
                          >
                            <span>⚠️ Skonsultuj te zredagowane akta z BioResearcher AI (/chat)</span>
                            <span>&rarr;</span>
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* PRAWA KOLUMNA: JEŚLI PRACA THORNE'A -> AUTENTYCZNY PORTRET Z PUBLIC/IMAGES/ARIS */}
                    {thorneAuthor && (
                      <div className="lg:col-span-4 flex flex-col items-center">
                        <ScientistPortrait compact />
                        <div className="mt-2 text-center text-xs">
                          <p className="text-red-400 font-mono font-bold text-[10px]">
                            PROJEKT SEKTOR-7 // KOD IDENTYFIKACYJNY: TH-94
                          </p>
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

      {/* STOPKA ARCHIWUM */}
      <div className="text-right text-xs font-mono text-slate-400 dark:text-slate-500 pt-2 select-none">
        <p>NeuroClin Biosciences Inc. // Department of Cellular Neurobiology & Archival Records</p>
      </div>
    </div>
  );
}

export default function ArchivePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-mono">Wczytywanie rejestrów archiwum...</div>}>
      <ArchiveContent />
    </Suspense>
  );
}
