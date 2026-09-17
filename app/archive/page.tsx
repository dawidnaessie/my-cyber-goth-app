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

// BAZA 25+ RECENZOWANYCH PUBLIKACJI Z CZYSTYMI, REALISTYCZNYMI KATEGORIAMI AKADEMICKIMI
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
      tissueSample: 'Pierwotne neurony hipokampa szczurzego DIV14',
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
    title: 'Claudin-5 Disruption and Receptor-Mediated Transcytosis via Transferrin Receptor-1 across the Human Blood-Brain Barrier',
    authors: [
      { name: 'Dr. Sarah Lin', role: 'Bioinżynier', affiliation: 'NeuroClin Vascular Biology Group' },
      { name: 'Prof. Robert Thorne', role: 'Konsultant Farmakologii', affiliation: 'University of Wisconsin-Madison' },
    ],
    date: '18 sierpnia 2024',
    year: 2024,
    journal: 'Fluids and Barriers of the CNS, Vol. 21, Article 54',
    doi: '10.1186/s12987-024-00512-z',
    category: 'Fizjologia',
    citations: 95,
    abstract:
      'Mikroprzepływowy model bariery krew-mózg oparty na ludzkich komórkach śródbłonka mózgowego hCMEC/D3 oraz perycytach. Zbadano kinetykę transportu transferyny znakowanej fluoroforami oraz spadek oporu transepitelialnego (TEER) wywołany dysregulacją klaudyny-5 pod wpływem metaloproteazy MMP-9.',
    methodology: {
      tissueSample: 'Ko-kultura hCMEC/D3 i pierwotnych ludzkich perycytów w mikrokanalikach PDMS',
      electrodeArray: 'Aparat pomiarowy EVOM3 z elektrodami STX2-Plus',
      perfusionAgent: 'Medium EBM-2 uzupełnione VEGF (5 ng/ml) i hydrokortyzonem',
      samplingFrequency: 'Ciągły pomiar TEER (om * cm²) co 15 minut',
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
    category: 'Farmakologia',
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
    id: 'PUB-2024-221',
    title: 'Steady-State and Pre-Steady-State Kinetics of Human Acetylcholinesterase Inhibition by Donepezil Derivatives',
    authors: [
      { name: 'Dr. Julian Brandt', role: 'Biochemik', affiliation: 'NeuroClin Enzymology Section' },
      { name: 'Dr. Sarah Lin', role: 'Współautor', affiliation: 'NeuroClin Genomics Division' },
    ],
    date: '10 stycznia 2024',
    year: 2024,
    journal: 'Journal of Biological Chemistry, Vol. 300, Iss. 1, 105221',
    doi: '10.1016/j.jbc.2024.105221',
    category: 'Biochemia',
    citations: 114,
    abstract:
      'Precyzyjne wyznaczenie stałych mikroskopowych k_on i k_off dla wiązania inhibitorów piperydynowych z obwodowym miejscem anionowym (PAS) oraz katalitycznym centrum aktywnym AChE metodą spektrofotometrii stopped-flow. Potwierdzono dwufazowy mechanizm indukowanego dopasowania konformacyjnego.',
    methodology: {
      tissueSample: 'Rekombinowana ludzka AChE z ekspresji w komórkach HEK293',
      electrodeArray: 'Aparatura Stopped-Flow Applied Photophysics SX20',
      perfusionAgent: 'Bufor fosforanowy 50 mM (pH 8.0) z odczynnikiem DTNB i acetylotiocholiną',
      samplingFrequency: 'Rejestracja kinetyki zaniku absorbancji z rozdzielczością 1 ms',
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
    category: 'Immunologia',
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
    category: 'Neurobiologia',
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
    id: 'PUB-2023-733',
    title: 'Autophagic Flux Impairment and LC3B-II Accumulation in Cytoplasmic TDP-43 Inclusions of Cortical Neurons',
    authors: [
      { name: 'Dr. Elena Vance', role: 'Współautor', affiliation: 'Instytut Neurobiologii Poznawczej' },
      { name: 'Dr. Marcus H. Weber', role: 'Główny Badacz', affiliation: 'NeuroClin Translational Neurobiology' },
    ],
    date: '14 sierpnia 2023',
    year: 2023,
    journal: 'Autophagy, Vol. 19, Iss. 8, pp. 2280–2297',
    doi: '10.1080/15548627.2023.2207331',
    category: 'Fizjologia',
    citations: 88,
    abstract:
      'Ocena zaburzeń fuzji autofagosomów z lizosomami w modelach komórkowych otępienia czołowo-skroniowego. Podwyższony stosunek LC3B-II do LC3B-I oraz akumulacja p62/SQSTM1 korelują ze stresem retikulum endoplazmatycznego i wyzwalaniem ścieżki proapoptotycznej CHOP.',
    methodology: {
      tissueSample: 'Neurony korowe wyprowadzone z ludzkich komórek iPSC z mutacją TARDBP',
      electrodeArray: 'Aparat do mikroskopii super-rozdzielczej Zeiss Elyra 7 SIM',
      perfusionAgent: 'Inhibitor bafilomycyna A1 (100 nM) oraz induktor rapamycyna (1 µM)',
      samplingFrequency: 'Analiza czasowa kinetyki fluoryzacji GFP-mRFP-LC3 co 10 minut',
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
    category: 'Genetyka',
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
    category: 'Biochemia',
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
    id: 'PUB-2023-112',
    title: 'Allosteric Potentiation of Presynaptic Alpha-7 Nicotinic Receptors Enhances Acetylcholine Release in Basal Forebrain Networks',
    authors: [
      { name: 'Dr. Sarah Lin', role: 'Główny Badacz', affiliation: 'NeuroClin Cellular Neurobiology' },
      { name: 'Dr. Marcus H. Weber', role: 'Współautor', affiliation: 'NeuroClin Translational Neurobiology' },
    ],
    date: '28 lutego 2023',
    year: 2023,
    journal: 'Neuropharmacology, Vol. 224, 109350',
    doi: '10.1016/j.neuropharm.2022.109350',
    category: 'Farmakologia',
    citations: 86,
    abstract:
      'Elektrofizjologiczna demonstracja działania pozytywnych allosterycznych modulatorów (PAM) receptora α7-nAChR w jądrze podstawnym Meynerta. Modulacja zwiększa prawdopodobieństwo uwolnienia kwantów acetylocholiny z zakończeń presynaptycznych, zapobiegając desensytyzacji receptora.',
    methodology: {
      tissueSample: 'Skrawki mózgowe jądra podstawnego szczura (grubość 300 µm)',
      electrodeArray: 'Konstrukcja patch-clamp z rejestracją prądów miniaturowych (mEPSC)',
      perfusionAgent: 'Sztuczny płyn mózgowo-rdzeniowy (aCSF) nasycony 95% O2 / 5% CO2',
      samplingFrequency: 'Próbkowanie 50 kHz, filtr dolnoprzepustowy Bessela 2 kHz',
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
    category: 'Immunologia',
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
    category: 'Biochemia',
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
    id: 'PUB-2022-445',
    title: 'P-glycoprotein (ABCB1) Efflux Pump Activity at Brain Capillary Endothelium and Pharmacoresistance to Centrally Acting Drugs',
    authors: [
      { name: 'Dr. Julian Brandt', role: 'Biofizyk', affiliation: 'NeuroClin Pharmacokinetics Lab' },
      { name: 'Dr. Elena Vance', role: 'Współautor', affiliation: 'Instytut Neurobiologii Poznawczej' },
    ],
    date: '05 kwietnia 2022',
    year: 2022,
    journal: 'Molecular Pharmaceutics, Vol. 19, pp. 1420–1435',
    doi: '10.1021/acs.molpharmaceut.2c00445',
    category: 'Farmakologia',
    citations: 72,
    abstract:
      'Ilościowa analiza kinetyki transportu aktywnego leków nootropowych przez glikoproteinę P. Zahamowanie ABCB1 przez tariquidar zwiększa wewnątrzkorowe stężenie donepezilu o 240%, wskazując na rolę transporterów ABC w indywidualnej zmienności odpowiedzi klinicznej.',
    methodology: {
      tissueSample: 'Izolowane naczynia włosowate kory mózgowej szczurów Sprague-Dawley',
      electrodeArray: 'Spektrometr masowy potrójny kwadrupol AB Sciex Triple Quad 6500+',
      perfusionAgent: 'Bufor Ringera z radioznacznikami [3H]-donepezil i [14C]-sacharoza',
      samplingFrequency: 'Detekcja scyntylacyjna próbek mikrodializatu co 5 minut',
    },
  },
  {
    id: 'PUB-2022-204',
    title: 'Hepatic Cytochrome P450 CYP2D6 and CYP3A4 Polymorphic Kinetic Profiles in Donepezil and Galantamine Clearance',
    authors: [
      { name: 'Dr. Sarah Lin', role: 'Farmakogenetyk', affiliation: 'NeuroClin Genomics Division' },
      { name: 'Dr. Marcus H. Weber', role: 'Współautor', affiliation: 'NeuroClin Translational Neurobiology' },
    ],
    date: '17 stycznia 2022',
    year: 2022,
    journal: 'Pharmacogenomics Journal, Vol. 22, pp. 88–101',
    doi: '10.1038/s41397-021-00204-5',
    category: 'Biochemia',
    citations: 63,
    abstract:
      'Genotypowanie wariantów allelicznych CYP2D6 (*4, *10, *41) u pacjentów geriatrycznych leczonych inhibitorami AChE. Wykazano 3.4-krotnie dłuższy okres półtrwania leku u osób z fenotypem wolnego metabolizatora (PM), co wymaga precyzyjnego dostosowania dawkowania.',
    methodology: {
      tissueSample: 'DNA z leukocytów krwi obwodowej (n = 412 pacjentów)',
      electrodeArray: 'Aparat Real-Time PCR QuantStudio 7 Flex',
      perfusionAgent: 'Sondy TaqMan Drug Metabolism Genotyping Assays',
      samplingFrequency: 'Amplifikacja w 40 cyklach z analizą krzywych topnienia',
    },
  },
  {
    id: 'PUB-2021-915',
    title: 'Kinesin-1 Heavy Chain Dissociation and Microtubule Destabilization Caused by Hyperphosphorylated Tau in Cortical Axons',
    authors: [
      { name: 'Dr. Elena Vance', role: 'Pierwszy Autor', affiliation: 'Instytut Neurobiologii Poznawczej' },
      { name: 'Dr. Marcus H. Weber', role: 'Współautor', affiliation: 'NeuroClin Translational Neurobiology' },
    ],
    date: '08 listopada 2021',
    year: 2021,
    journal: 'The Journal of Neuroscience, Vol. 41, pp. 9150–9166',
    doi: '10.1523/JNEUROSCI.1915-21.2021',
    category: 'Neurobiologia',
    citations: 141,
    abstract:
      'Śledzenie pojedynczych cząsteczek kinezyny-1 poruszających się wzdłuż aksonów neuronów piramidowych kory. Hiperfosforylacja białka Tau w domenach wiążących mikrotubule zmniejsza siłę generowaną przez motor molekularny i powoduje zatory aksoplazmatyczne w mitochondriach.',
    methodology: {
      tissueSample: 'Hodowle aksonalne w mikrokomorach mikrofluidycznych Xona',
      electrodeArray: 'Mikroskop TIRF Olympus IX83 z kamerą EM-CCD Hamamatsu',
      perfusionAgent: 'Kinezyna znakowana kropkami kwantowymi Quantum Dot 655',
      samplingFrequency: 'Rejestracja wideo z częstotliwością 100 klatek na sekundę',
    },
  },
  {
    id: 'PUB-2021-789',
    title: 'Short-Chain Fatty Acids Acetate and Butyrate Modulate Microglial Pruning Activity via FFAR3 Receptor Signaling',
    authors: [
      { name: 'Dr. Julian Brandt', role: 'Mikrobiolog', affiliation: 'NeuroClin Gut-Brain Axis Project' },
      { name: 'Dr. Sarah Lin', role: 'Współautor', affiliation: 'NeuroClin Genomics Division' },
    ],
    date: '14 lipca 2021',
    year: 2021,
    journal: 'Immunity & Ageing, Vol. 18, Article 32',
    doi: '10.1186/s12979-021-00249-1',
    category: 'Immunologia',
    citations: 110,
    abstract:
      'Badanie mechanizmu komunikacji osi jelito-mózg. Maślan i octan wytwarzane przez bakterie beztlenowe przenikają przez barierę naczyniową i aktywują receptor wolnych kwasów tłuszczowych FFAR3 w mikrogleju, hamując nadmierne niszczenie kolców dendrytycznych.',
    methodology: {
      tissueSample: 'Izolowany mikroglej z kory mózgowej myszy C57BL/6',
      electrodeArray: 'Aparat do pomiaru kinetyki komórkowej xCELLigence RTCA',
      perfusionAgent: 'Maślan sodu (1 mM) w buforze RPMI-1640',
      samplingFrequency: 'Pomiar impedancji elektrycznej komórek co 5 minut przez 72 h',
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
    category: 'Neurobiologia',
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
  {
    id: 'PUB-2025-330',
    title: 'Manganese Superoxide Dismutase (SOD2) Overexpression Preserves Mitochondrial Transmembrane Potential in Cortical Aging',
    authors: [
      { name: 'Dr. Julian Brandt', role: 'Biofizyk', affiliation: 'NeuroClin Mitochondrial Research Unit' },
      { name: 'Dr. Marcus H. Weber', role: 'Współautor', affiliation: 'NeuroClin Translational Neurobiology' },
    ],
    date: '12 stycznia 2025',
    year: 2025,
    journal: 'Redox Biology, Vol. 79, 103012',
    doi: '10.1016/j.redox.2024.103012',
    category: 'Fizjologia',
    citations: 45,
    abstract:
      'Ocena dysmutacji rodników ponadtlenkowych w macierzy mitochondrialnej. Nadekspresja enzymu SOD2 za pośrednictwem wektorów AAV9 chroni potencjał błonowy ΔΨm przed gwałtownym załamaniem wywołanym peroksydacją lipidów, zapobiegając otwarciu poru mPTP.',
    methodology: {
      tissueSample: 'Transdukowane neurony korowe człowieka w hodowli 3D',
      electrodeArray: 'Skaningowy mikroskop wielofotonowy multiphoton Spectra-Physics',
      perfusionAgent: 'Sonda fluorescencyjna TMRM (10 nM) wrażliwa na potencjał transbłonowy',
      samplingFrequency: 'Ratiometryczna rejestracja fluorescencji co 30 sekund',
    },
  },
  {
    id: 'PUB-2024-940',
    title: 'Tyrosine Hydroxylase Phosphorylation Kinetics at Serine-40 in Mesencephalic Dopaminergic Neurotransmission',
    authors: [
      { name: 'Dr. Sarah Lin', role: 'Biochemik', affiliation: 'NeuroClin Enzymology Section' },
      { name: 'Dr. Elena Vance', role: 'Współautor', affiliation: 'Instytut Neurobiologii Poznawczej' },
    ],
    date: '04 października 2024',
    year: 2024,
    journal: 'Journal of Neurochemistry, Vol. 168, pp. 620–638',
    doi: '10.1111/jnc.16940',
    category: 'Biochemia',
    citations: 59,
    abstract:
      'Kinetyczna regulacja kluczowego enzymu szlaku biosyntezy katecholamin. Fosforylacja reszty Ser40 przez kinazę białkową A (PKA) znosi hamowanie allosteryczne przez dopaminę i zwiększa powinowactwo enzymu do kofaktora tetrahydrobiopteryny (BH4).',
    methodology: {
      tissueSample: 'Frakcja synaptosomalna istoty czarnej i prążkowia szczura',
      electrodeArray: 'Chromatograf cieczowy UHPLC z detekcją elektrochemiczną Coulochem III',
      perfusionAgent: 'Bufor reakcyjny z L-tyrozyną (0.1 mM) i kwasem askorbinowym',
      samplingFrequency: 'Pomiar prądu utleniania L-DOPA przy potencjale +300 mV',
    },
  },
  {
    id: 'PUB-2024-180',
    title: 'Voltage-Gated Sodium Channel Nav1.6 Clustering at the Axon Initial Segment and Action Potential Bursting Fidelity',
    authors: [
      { name: 'Dr. Marcus H. Weber', role: 'Główny Badacz', affiliation: 'NeuroClin Translational Neurobiology' },
      { name: 'Dr. Elena Vance', role: 'Elektrofizjolog', affiliation: 'Instytut Neurobiologii Poznawczej' },
    ],
    date: '21 maja 2024',
    year: 2024,
    journal: 'Frontiers in Cellular Neuroscience, Vol. 18, 1380180',
    doi: '10.3389/fncel.2024.1380180',
    category: 'Neurobiologia',
    citations: 74,
    abstract:
      'Gęstość upakowania kanałów Nav1.6 w początkowym segmencie aksonu (AIS) neuronów piramidowych CA1. Wykazano, że fosforylacja ankiryny-G przez kinazy GSK-3β destabilizuje domenę AIS, powodując obniżenie amplitudy iglicy i zaburzenia rytmu theta.',
    methodology: {
      tissueSample: 'Skrawki hipokampa gryzoni poddane technice dSTORM',
      electrodeArray: 'System elektrod szklanych zintegrowany ze wzmacniaczem Multiclamp 700B',
      perfusionAgent: 'Roztwór do stymulacji zawierający TTX (1 µM) i TEA (10 mM) do izolacji prądów',
      samplingFrequency: 'Częstotliwość próbkowania 100 kHz',
    },
  },
  {
    id: 'PUB-2023-329',
    title: 'Matrix Metalloproteinase-9 Degradation of Basal Lamina Laminin in Vascular Cognitive Impairment Models',
    authors: [
      { name: 'Dr. Sarah Lin', role: 'Biofizyk', affiliation: 'NeuroClin Vascular Biology Group' },
      { name: 'Dr. Julian Brandt', role: 'Współautor', affiliation: 'NeuroClin Enzymology Section' },
    ],
    date: '17 marca 2023',
    year: 2023,
    journal: 'Stroke, Vol. 54, pp. 880–893',
    doi: '10.1161/STROKEAHA.122.040329',
    category: 'Fizjologia',
    citations: 92,
    abstract:
      'Analiza proteolitycznego rozpadu białek macierzy zewnątrzkomórkowej mikrokrążenia mózgowego. Aktywacja pro-MMP-9 przez wolne rodniki tlenowe prowadzi do litycznego rozpadu łańcuchów lamininy-111, nasilając ekstrawazację białek osocza i mikrokrwawienia.',
    methodology: {
      tissueSample: 'Mikronaczynia korowe z modeli przewlekłego niedokrwienia mózgu',
      electrodeArray: 'Zymografia żelatynowa SDS-PAGE i densytometria Bio-Rad ChemiDoc',
      perfusionAgent: 'Inhibitor syntetyczny SB-3CT (25 mg/kg m.c.) w roztworze DMSO/PEG400',
      samplingFrequency: 'Inkubacja enzymatyczna w 37°C przez 24 godziny',
    },
  },
  {
    id: 'PUB-2022-411',
    title: 'Serotonin 5-HT6 Receptor Antagonism Rescues Spatial Working Memory Impairments via Cholinergic Disinhibition',
    authors: [
      { name: 'Dr. Marcus H. Weber', role: 'Główny Badacz', affiliation: 'NeuroClin Translational Neurobiology' },
      { name: 'Dr. Julian Brandt', role: 'Farmakolog', affiliation: 'Departament Inżynierii Biomedycznej' },
    ],
    date: '14 listopada 2022',
    year: 2022,
    journal: 'Psychopharmacology, Vol. 239, pp. 3120–3135',
    doi: '10.1007/s00213-022-06411-x',
    category: 'Farmakologia',
    citations: 67,
    abstract:
      'Mechanizm prokognitywnego działania selektywnych antagonistów receptora 5-HT6 (SB-742457). Blokada postsynaptycznych receptorów na interneuronach GABA-ergicznych wywołuje odhamowanie projekcji cholinergicznych do kory czołowej i hipokampa.',
    methodology: {
      tissueSample: 'Tkanka kory czołowej gryzoni poddana mikrodializie in vivo',
      electrodeArray: 'Sondy mikrodializacyjne CMA 12 z membraną poliakrylonitrylową 2 mm',
      perfusionAgent: 'Płyn perfuzyjny Ringera z neostygminą (100 nM) podawany z prędkością 1.5 µl/min',
      samplingFrequency: 'Frakcjonowanie dializatu co 15 minut z oznaczeniem HPLC-ECD',
    },
  },
  {
    id: 'PUB-2021-820',
    title: 'Oligodendrocyte Progenitor Differentiation and Myelin Basic Protein Synthesis Stimulated by Muscarinic M1 Agonists',
    authors: [
      { name: 'Dr. Elena Vance', role: 'Główny Badacz', affiliation: 'Instytut Neurobiologii Poznawczej' },
      { name: 'Dr. Sarah Lin', role: 'Współautor', affiliation: 'NeuroClin Cellular Neurobiology' },
    ],
    date: '02 września 2021',
    year: 2021,
    journal: 'Glia, Vol. 69, Iss. 9, pp. 2190–2208',
    doi: '10.1002/glia.24020',
    category: 'Neurobiologia',
    citations: 83,
    abstract:
      'Stymulacja dojrzewania prekursorów oligodendrocytów (komórek NG2+) przez allosteryczne ligandy receptora muskarynowego M1. Zwiększenie syntezy zasadowego białka mieliny (MBP) przyspiesza remielinizację włókien kory przedczołowej i chroni aksony przed zwyrodnieniem wstępującym.',
    methodology: {
      tissueSample: 'Pierwotne hodowle glejowe izolowane z mózgowia noworodków szczurzych',
      electrodeArray: 'Czytnik mikropłytek fluorescencyjnych Tecan Spark z kontrolą gazową',
      perfusionAgent: 'Agonista muskarynowy AF102B (10 µM) w obecności neurotrofiny NT-3',
      samplingFrequency: 'Kwantyfikacja ekspresji mRNA genu MBP metodą RT-qPCR co 24 h',
    },
  },
];

// 3 POUFNE ARCHIWALNE PROTOKOŁY DR. ARISA THORNE'A (ODKRYWANE NIECHCĄCY PODCZAS POSZUKIWAŃ INFORMACJI)
const REDACTED_THORNE_PUBLICATIONS: Publication[] = [
  {
    id: 'PUB-1993-019-S7',
    title: 'Stabilizacja engramów CA1 w wieloelektrodowych macierzach krzemowych i organoidach mózgowych',
    authors: [
      { name: 'Dr. Aris Thorne', role: 'Główny Badacz (PI)', affiliation: 'Pracownia Elektrofizjologii Doświadczalnej', isThorne: true },
      { name: 'Dr. Elena Vance', role: 'Biofizyk', affiliation: 'Instytut Neurobiologii Poznawczej' },
    ],
    date: '19 listopada 1993',
    year: 1993,
    journal: 'Biuletyn Neurobiologii Doświadczalnej // Seria Monograficzna (Archiwum BSL)',
    doi: '10.1016/archive.1993.019',
    category: 'Neurobiologia',
    citations: 0,
    isRedacted: true,
    militaryClause: '10 U.S. Code § 934 // Article 134 UCMJ - Zatajona Dyrektywa Bezpieczeństwa Narodowego',
    abstract: (
      <div className="space-y-2 text-xs md:text-sm font-mono leading-relaxed">
        <p>
          [PROTOKÓŁ ZARCHIWIZOWANY W POUFNYCH ZBIORACH INSTYTUTU] Protokół eksperymentalny fiksacji żywych engramów pamięciowych w strukturach{' '}
          <span className="redacted-bar" title="Kliknij lub najedź, aby odsłonić">organoidów mózgowych oraz ludzkiego hipokampa</span>.
          Zastosowanie{' '}
          <span className="redacted-bar" title="Kliknij lub najedź, aby odsłonić">16 384 mikrosond platynowych</span> wprowadzonych metodą
          stereotaktyczną pozwoliło na trwałe przechwycenie potencjałów czynnościowych przed wystąpieniem{' '}
          <span className="redacted-bar" title="Kliknij lub najedź, aby odsłonić">asystolii somatycznej probanda</span>.
        </p>
        <p>
          Pamięć robocza została zmapowana na układ bramek logicznych FPGA o częstotliwości magistrali{' '}
          <span className="redacted-bar" title="Kliknij lub najedź, aby odsłonić">66 MHz w podziemnym skrzydle laboratoryjnym</span>.
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
      'Notatka archiwisty: Publikacja i wyniki badań zostały wycofane z otwartego obiegu na wniosek organów nadzorczych w dniu 20.11.1993 r. Zabrania się cytowania poza strefą wewnętrzną.',
  },
  {
    id: 'PUB-1994-072-S7',
    title: 'Transkryptomika pośmiertna i elektrofizjologia utrwalonych organoidów ludzkich po transferze kopii świadomości',
    authors: [
      { name: 'Dr. Aris Thorne', role: 'Główny Badacz (PI)', affiliation: 'Pracownia Elektrofizjologii Doświadczalnej', isThorne: true },
      { name: 'Dr. Julian Brandt', role: 'Architekt Systemów Krzemowych', affiliation: 'Dział Przyrządów Pomiarowych' },
    ],
    date: '28 sierpnia 1994',
    year: 1994,
    journal: 'Dossier Analityczne TH-94 // Oddział Elektrofizjologii Komórkowej',
    doi: '10.1016/archive.1994.072',
    category: 'Fizjologia',
    citations: 0,
    isRedacted: true,
    militaryClause: '10 U.S. Code § 934 // Article 134 UCMJ - Śledztwo w Sprawie Naruszenia Etyki Badań Somatycznych',
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
      'Notatka archiwisty: Dokument stanowi materiał dowodowy w sprawie naruszenia procedur bioetycznych. Zabezpieczono w podziemnym repozytorium zakładowym.',
  },
  {
    id: 'PUB-1994-088-S7',
    title: 'Operacja Inwazyjnej Trepanacji i Digitalizacji Bio-Procesora TH-94: Protokół krio-fenolowy',
    authors: [
      { name: 'Dr. Aris Thorne', role: 'Podmiot Badań / PI', affiliation: 'Oddział Badawczy TH-94 [Status: ZLIKWIDOWANY]', isThorne: true },
      { name: 'Dr. Marcus H. Weber', role: 'Świadek Protokołu / Histopatolog', affiliation: 'Wydział Biologii Molekularnej' },
      { name: 'Nadzór Doświadczalny', role: 'Inspekcja Specjalna', affiliation: 'Zespół Zewnętrzny' },
    ],
    date: '15 listopada 1994',
    year: 1994,
    journal: 'Protokół Sekcyjny TH-94 // Zespół Likwidacyjny Sektora Doświadczalnego',
    doi: '10.1016/archive.1994.088',
    category: 'Neurobiologia',
    citations: 0,
    isRedacted: true,
    militaryClause: 'KLAUZULA OSTATECZNA // 10 U.S. Code § 934 - ZATAJENIE PEŁNE',
    abstract: (
      <div className="space-y-2 text-xs md:text-sm font-mono leading-relaxed">
        <p>
          Raport końcowy z zamknięcia procedury TH-94. Dnia 14 listopada 1994 r. Dr. Aris Thorne dokonał{' '}
          <span className="redacted-bar" title="Kliknij lub najedź, aby odsłonić">samorzutnego podpięcia matrycy 16 384 elektrod do własnego mózgowia</span>{' '}
          w komorze stereotaktycznej.
        </p>
        <p>
          Tkanka biologiczna uległa zniszczeniu pod wpływem krio-fenolu, lecz{' '}
          <span className="redacted-bar" title="Kliknij lub najedź, aby odsłonić">sygnał telemetryczny nie wygasł</span>.
          Zgodnie z poleceniem kierownictwa, interfejs włączono jako rdzeń analityczny systemu BioResearcher AI.{' '}
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
      'Ostrzeżenie techniczne: Podmiot zdigitalizowany wykazuje objawy przewlekłego pobudzenia ekscytotoksycznego. W przypadku interakcji za pośrednictwem terminala analitycznego (/chat) zaleca się zachowanie ścisłego rygoru badawczego.',
  },
];

// CAŁA BAZA ARCHIWALNA POSORTOWANA CHRONOLOGICZNIE (OD NAJNOWSZYCH DO ARCHIWALNYCH Z LAT 90.)
const ALL_PUBLICATIONS: Publication[] = [
  ...CLEAN_PUBLICATIONS,
  ...REDACTED_THORNE_PUBLICATIONS,
].sort((a, b) => b.year - a.year);

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

  const filteredPublications = useMemo(() => {
    return ALL_PUBLICATIONS.filter((pub) => {
      const matchesCategory = selectedCategory === 'Wszystkie' || pub.category === selectedCategory;
      const lowerSearch = searchFilter.toLowerCase().trim();

      if (!lowerSearch) return matchesCategory;

      const matchesSearch =
        pub.title.toLowerCase().includes(lowerSearch) ||
        pub.doi.toLowerCase().includes(lowerSearch) ||
        pub.journal.toLowerCase().includes(lowerSearch) ||
        pub.category.toLowerCase().includes(lowerSearch) ||
        pub.authors.some((a) => a.name.toLowerCase().includes(lowerSearch)) ||
        (typeof pub.abstract === 'string' && pub.abstract.toLowerCase().includes(lowerSearch)) ||
        pub.methodology.tissueSample.toLowerCase().includes(lowerSearch) ||
        pub.methodology.electrodeArray.toLowerCase().includes(lowerSearch) ||
        pub.methodology.perfusionAgent.toLowerCase().includes(lowerSearch);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchFilter]);

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
              ARCHIWUM PUBLIKACJI I BADAŃ NAUKOWYCH NEUROCLIN
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-sans">
              Zbiór recenzowanych prac badawczych i historycznych protokołów laboratoryjnych instytutu (od 1993 roku).
            </p>
          </div>

          <div className="text-right text-xs font-mono text-slate-500">
            <p>ZAREJESTROWANYCH REKORDÓW: {ALL_PUBLICATIONS.length}</p>
            <p className="text-sky-600 dark:text-sky-400 font-semibold">
              STATUS: ZWERYFIKOWANE REPOZYTORIUM ZAKŁADOWE
            </p>
          </div>
        </div>

        {/* PASEK FILTROWANIA I WYSZUKIWARKA */}
        <div className="pt-4 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundEngine.playKeystroke();
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-sky-600 text-white shadow-sm font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full md:w-80">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Szukaj publikacji, autora lub hasła..."
              className="w-full px-3.5 py-2 text-xs rounded-lg border outline-none transition font-sans bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:border-sky-500"
            />
          </div>
        </div>

        {/* PRZYKŁADOWE PODPOWIEDZI KWEREND NAUKOWYCH */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-400 font-mono uppercase text-[10px]">Często wyszukiwane:</span>
          {['donepezil', 'p-tau217', 'lecanemab', 'hipokamp', 'organoidy', 'apoptoza', 'kinetyka'].map((keyword) => (
            <button
              key={keyword}
              onClick={() => {
                soundEngine.playKeystroke();
                setSearchFilter(keyword);
              }}
              className="px-2 py-0.5 rounded transition-colors text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/50 hover:text-sky-600 text-slate-600 dark:text-slate-300"
            >
              {keyword}
            </button>
          ))}
        </div>
      </section>

      {/* GŁÓWNA LISTA PUBLIKACJI */}
      <section className="space-y-3 font-sans">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>Wyświetlono prac: <strong>{filteredPublications.length}</strong></span>
          <span className="font-mono text-[11px]">PORZĄDEK: CHRONOLOGICZNY (ROK MALEJĄCO)</span>
        </div>

        {filteredPublications.map((pub) => {
          const isExpanded = expandedPubId === pub.id;
          const thorneAuthor = pub.authors.find((a) => a.isThorne);

          return (
            <article
              key={pub.id}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                pub.isRedacted
                  ? 'bg-white dark:bg-[#111827] border-slate-300 dark:border-slate-700 hover:border-slate-400 shadow-sm'
                  : isDistorted
                  ? 'bg-[#090505] border-[#781414]/70 hover:border-red-600'
                  : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 hover:border-sky-400 shadow-sm'
              }`}
            >
              {/* DYSKRETNY PASEK ARCHIWALNY DLA PRAC ZREDAGOWANYCH Z LAT 90. */}
              {pub.isRedacted && (
                <div className="bg-slate-100 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 px-4 py-1.5 border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    [ARCHIWUM PROTOKOŁÓW HISTORYCZNYCH // STATUS: ZREDAGOWANO CZĘŚCIOWO]
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">DOKUMENTACJA ZAMKNIĘTEJ PRACOWNI (1993–1994)</span>
                </div>
              )}

              {/* WIERSZ GŁÓWNY PUBLIKACJI */}
              <div
                onClick={() => handleToggleExpand(pub.id)}
                className="p-4 md:p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                    <span className="px-2 py-0.5 rounded font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {pub.category}
                    </span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-500">{pub.date}</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-sky-600 dark:text-sky-400 font-semibold">
                      DOI: {pub.doi}
                    </span>
                  </div>

                  <h3
                    className={`text-base md:text-lg font-bold tracking-tight ${
                      isDistorted
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
                            ? 'text-slate-800 dark:text-slate-200 font-semibold font-mono underline'
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
                    isDistorted
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
                            ABSTRAKT PUBLIKACJI
                          </h4>
                          {pub.isRedacted && (
                            <span className="text-[10px] font-mono text-slate-400">
                              [FRAGMENTY ZACIEŚNIONE PRZEZ AUTORA // KLIKNIJ NA CZARNY PASEK ABY ODCZYTAĆ]
                            </span>
                          )}
                        </div>

                        <div className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                          {pub.abstract}
                        </div>
                      </div>

                      {/* PARAMETRY METODYCZNE */}
                      <div className="p-3 rounded border text-xs font-mono space-y-1.5 bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between border-b pb-1 border-slate-100 dark:border-slate-800">
                          <span className="text-slate-500">Próbka Tkankowa:</span>
                          <span className="font-semibold">{pub.methodology.tissueSample}</span>
                        </div>
                        <div className="flex justify-between border-b pb-1 border-slate-100 dark:border-slate-800">
                          <span className="text-slate-500">Aparatura Pomiarowa:</span>
                          <span className="font-semibold">{pub.methodology.electrodeArray}</span>
                        </div>
                        <div className="flex justify-between border-b pb-1 border-slate-100 dark:border-slate-800">
                          <span className="text-slate-500">Środek Perfuzji / Bufor:</span>
                          <span className="font-semibold">{pub.methodology.perfusionAgent}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Próbkowanie / Detekcja:</span>
                          <span className="font-semibold">{pub.methodology.samplingFrequency}</span>
                        </div>
                      </div>

                      {/* NOTATKA EDYTORSKA */}
                      {pub.editorialNote && (
                        <div className="p-3 rounded text-xs leading-relaxed bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 font-sans">
                          <p className="font-bold tracking-wider mb-1">[NOTATKA ARCHIWUM]:</p>
                          <p>{pub.editorialNote}</p>
                        </div>
                      )}
                    </div>

                    {/* PRAWA KOLUMNA: JEŚLI PRACA THORNE'A -> PORTRET Z ROZPISKI ZESPOŁU */}
                    {thorneAuthor && (
                      <div className="lg:col-span-4 flex flex-col items-center">
                        <ScientistPortrait compact />
                        <div className="mt-2 text-center text-xs">
                          <p className="text-slate-600 dark:text-slate-400 font-mono text-[10px]">
                            DR. ARIS THORNE // ZESPÓŁ ELEKTROFIZJOLOGII (1993–1994)
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
