export interface Author {
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

export type ArticleType =
  | 'Artykuł Badawczy'
  | 'Badanie Kliniczne'
  | 'Praca Przeglądowa'
  | 'Raport Metodologiczny'
  | 'Raport Niejawny';

export interface ResultMetric {
  parameter: string;
  controlGroup: string;
  testGroup: string;
  pValue: string;
  significance: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: Author[];
  date: string;
  year: number;
  journal: string;
  doi: string;
  category: 'Farmakologia' | 'Biochemia' | 'Neurobiologia' | 'Immunologia' | 'Fizjologia' | 'Genetyka';
  articleType: ArticleType;
  citations: number;
  altmetricScore: number;
  downloadsCount: number;
  openAccess: boolean;
  abstract: string;
  studyObjective: string;
  methodologyNarrative: string;
  methodologyParams: {
    tissueSample: string;
    instrumentation: string;
    perfusionOrReagent: string;
    samplingFrequency: string;
  };
  resultsNarrative: string;
  resultsTable: ResultMetric[];
  conclusions: string;
  keywords: string[];
  editorialNote?: string;
  isArchivalAnomaly?: boolean;
  classifiedProtocol?: {
    protocolCode: string;
    classificationDate: string;
    securityLevel: string;
    investigators: string;
    telemetryTimestamp: string;
    rawLogFragment: string;
  };
}

export const CATEGORIES: ScientificCategory[] = [
  'Wszystkie',
  'Farmakologia',
  'Biochemia',
  'Neurobiologia',
  'Immunologia',
  'Fizjologia',
  'Genetyka',
];

export const PEER_REVIEWED_PUBLICATIONS: Publication[] = [
  // 1. KLUCZOWY ARTYKUŁ REFERENCYJNY WSKAZANY W MAILU WEBERA
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
    articleType: 'Raport Metodologiczny',
    citations: 64,
    altmetricScore: 82,
    downloadsCount: 1420,
    openAccess: true,
    abstract:
      'Charakterystyka długookresowej stabilności wyładowań synaptycznych oraz wzorców pobudzenia w kulturach neuronów kory mózgowej poddanych stymulacji theta-burst (TBS). Praca analizuje mechanizmy wczesnego i późnego wzmocnienia synaptycznego (LTP) oraz metody eliminacji szumów aparaturowych w rejestracji zewnątrzkomórkowej. Opracowany algorytm filtracji adaptywnej redukuje dryft linii bazowej o $89.4\\%$ bez tłumienia szybkich potencjałów czynnościowych ($f > 1\\text{ kHz}$).',
    studyObjective:
      'Celem badania było rozwiązanie powszechnego w wielogodzinnych rejestracjach elektrofizjologicznych problemu termicznego i chemicznego dryftu potencjału spoczynkowego elektrod. W pomiarach długotrwałego wzmocnienia synaptycznego (LTP) w hipokampie, powolne przesunięcia linii bazowej uniemożliwiają precyzyjne odróżnienie fizjologicznego spadku amplitudy fEPSP od artefaktów degradacji sensora. Opracowanie protokołu normalizacyjnego pozwala na bezbłędną ocenę kinetyki receptorów NMDA i AMPA w wielogodzinnych próbach farmakologicznych.',
    methodologyNarrative:
      'Pierwotne kultury neuronów korowych myszy C57BL/6 (DIV 21) nanoszono na planarne mikromacierze MEA o 120 kanałach ze złotymi mikrostykami (średnica $30\\,\\mu\\text{m}$, rozstaw $100\\,\\mu\\text{m}$). Rejestrację prowadzono w komorze perfuzyjnej z ciągłym przepływem sztucznego płynu mózgowo-rdzeniowego (aCSF) nasyconego mieszaniną karbogenu ($95\\%\\,\\text{O}_2 / 5\\%\\,\\text{CO}_2$) w temperaturze $37.0 \\pm 0.2^\\circ\\text{C}$. Sygnał próbkowano z częstotliwością $20\\text{ kHz}$ na kanał przy użyciu przetworników 16-bitowych. Do wywołania plastyczności synaptycznej zastosowano protokół Theta-Burst Stimulation (TBS: 10 wiązek po 4 impulsy $100\\text{ Hz}$ w odstępach $200\\text{ ms}$).',
    methodologyParams: {
      tissueSample: 'Pierwotne kultury neuronów korowych myszy C57BL/6 (DIV 21)',
      instrumentation: 'Matryca mikroelektrodowa planar MEA 120 kanałów (Multi Channel Systems MCS)',
      perfusionOrReagent: 'Sztuczny płyn mózgowo-rdzeniowy (aCSF, buforowany wodorowęglanem, pH 7.4)',
      samplingFrequency:
        '20 kHz na kanał magistrali. Wartości referencyjne szumu tła i stabilności potencjałów znormalizowano względem wewnętrznego protokołu kalibracyjnego z 14 listopada 1994 r. (seria pomiarowa ST-94/11, dawna Pracownia Elektrofizjologii Sektor-7, kierownik: dr Aris Thorne).',
    },
    resultsNarrative:
      'Wprowadzenie adaptywnego filtru falkowego pozwoliło na separację potencjałów polowych fEPSP od fluktuacji impedancji złącza elektroda-elektrolit. Po stymulacji TBS zaobserwowano stabilne wzmocnienie nachylenia fEPSP do poziomu $168.4 \\pm 7.2\\%$ wartości wyjściowej po 60 minutach w grupie znormalizowanej algorytmem kalibracyjnym, w porównaniu do pozornego poziomu $134.1 \\pm 14.8\\%$ przy standardowej filtracji pasmowej.',
    resultsTable: [
      {
        parameter: 'Dryft linii bazowej (dryf potencjału po 180 min)',
        controlGroup: '14.8 ± 2.1 mV',
        testGroup: '1.6 ± 0.3 mV',
        pValue: 'p < 0.001',
        significance: 'Istotny statystycznie (spadek dryftu o 89.2%)',
      },
      {
        parameter: 'Stosunek sygnału do szumu (SNR fEPSP)',
        controlGroup: '4.8 ± 0.6 dB',
        testGroup: '14.2 ± 0.9 dB',
        pValue: 'p < 0.001',
        significance: 'Poprawa detekcji iglic o 195%',
      },
      {
        parameter: 'Trwałość wzmocnienia LTP po 120 min',
        controlGroup: '128.6 ± 11.4%',
        testGroup: '164.2 ± 6.8%',
        pValue: 'p = 0.004',
        significance: 'Wysoka powtarzalność odpowiedzi synaptycznej',
      },
    ],
    conclusions:
      'Wdrożony standard normalizacyjny umożliwia długookresowe badania przesiewowe kandydatów na leki nootropowe i neuroprotekcyjne, eliminując błędy interpretacji wynikające z degradacji elektrod. Protokół stanowi bazę dla obecnych badań NeuroClin w obszarze neurodegeneracji CA1.',
    keywords: ['Multielectrode Array (MEA)', 'LTP', 'Hippocampal Electrophysiology', 'Baseline Drift', 'Synaptic Plasticity'],
    editorialNote:
      'Artykuł zawiera procedury referencyjne stosowane w kalibracji laboratoryjnej torów wzmacniaczy w ośrodku NeuroClin. Uwaga: seria ST-94/11 została zarchiwizowana pod klauzulą poufności i wycofana z jawnego obiegu.',
  },

  // 2. BIOMARKER P-TAU217
  {
    id: 'PUB-2025-412',
    title: 'Plasma Phosphorylated Tau-217 as a High-Precision Diagnostic Biomarker for Prodromal Dementia and Preclinical Amyloid Pathology',
    authors: [
      { name: 'Dr. Marcus H. Weber', role: 'Pierwszy Autor', affiliation: 'NeuroClin Translational Neurobiology' },
      { name: 'Dr. Sarah Lin', role: 'Biofizyk', affiliation: 'Department of Clinical Chemistry, Harvard Medical' },
      { name: 'Prof. Henrik Zetterberg', role: 'Konsultant Zewnętrzny', affiliation: 'Sahlgrenska Academy, Gothenburg' },
    ],
    date: '14 maja 2025',
    year: 2025,
    journal: 'JAMA Neurology, Vol. 82, Iss. 5, pp. 512–526',
    doi: '10.1001/jamaneurol.2025.1412',
    category: 'Biochemia',
    articleType: 'Badanie Kliniczne',
    citations: 184,
    altmetricScore: 245,
    downloadsCount: 3890,
    openAccess: true,
    abstract:
      'Wieloośrodkowa walidacja testu immunoenzymatycznego dla fosforylowanej formy białka tau w reszcie treoninowej 217 ($p\\text{-tau217}$) w osoczu krwi obwodowej. Oznaczenie osiąga $96.2\\%$ pola pod krzywą ROC w przewidywaniu dodatniego wyniku amyloid-PET ($[^{11}\\text{C}]\\text{PiB}$), oferując bezinwazyjny wskaźnik neurodystrofii synaptycznej u pacjentów z łagodnymi zaburzeniami poznawczymi (MCI).',
    studyObjective:
      'Inwazyjność nakłucia lędźwiowego w celu pobrania płynu mózgowo-rdzeniowego oraz wysoki koszt i ograniczona dostępność pozytonowej tomografii emisyjnej (PET) stanowią wąskie gardło w diagnostyce choroby Alzheimera. Celem pracy było udowodnienie, że stężenie $p\\text{-tau217}$ w osoczu odzwierciedla wczesne odkładanie się blaszek amyloidowych w korze mózgowej na lata przed wystąpieniem objawów klinicznych, rewolucjonizując badania przesiewowe.',
    methodologyNarrative:
      'Przeanalizowano próbki osocza i PMR od kohorty $n = 1\\,420$ probandów z 4 niezależnych ośrodków klinicznych. Pomiar stężenia $p\\text{-tau217}$ prowadzono przy użyciu platformy cyfrowego immuno-oznaczania pojedynczych cząsteczek Simoa HD-X z przeciwciałem wychwytującym skierowanym przeciw epitopowi tau fosforylowanemu w pozycji Thr217. Czułość analityczna wynosiła $0.04\\,\\text{pg/mL}$. Wyniki zestawiono z referencyjnymi skanami amyloid-PET i tau-PET ($[^{18}\\text{F}]\\text{MK-6240}$).',
    methodologyParams: {
      tissueSample: 'Osocze krwi obwodowej (EDTA) i płyn mózgowo-rdzeniowy (n = 1 420 probandów)',
      instrumentation: 'Platforma cyfrowego immuno-oznaczania pojedynczych cząsteczek Quanterix Simoa HD-X',
      perfusionOrReagent: 'Bufor antygenowy z koktajlem inhibitorów fosfataz i proteaz PhosSTOP',
      samplingFrequency: 'Pomiar fluorometryczny wielopunktowy w 480 nm, granica wykrywalności LOD = 0.04 pg/mL',
    },
    resultsNarrative:
      'Stężenie osoczowego $p\\text{-tau217}$ wykazywało ścisłą korelację ze stanem akumulacji amyloidu w mózgu ($r = 0.88, p < 0.0001$). U pacjentów z MCI z dodatnim amyloid-PET średnie stężenie $p\\text{-tau217}$ wynosiło $0.94 \\pm 0.18\\,\\text{pg/mL}$ w porównaniu do $0.18 \\pm 0.04\\,\\text{pg/mL}$ w grupie kontrolnej. Pole pod krzywą ROC AUC wyniosło $0.962$ ($95\\%\\,\\text{CI}: 0.948–0.976$).',
    resultsTable: [
      {
        parameter: 'Stężenie p-tau217 w osoczu (pg/mL)',
        controlGroup: '0.18 ± 0.04 pg/mL',
        testGroup: '0.94 ± 0.18 pg/mL',
        pValue: 'p < 0.0001',
        significance: 'Wzrost stężenia o 422% (ROC AUC = 0.962)',
      },
      {
        parameter: 'Korelacja z indeksem centiloidów PET',
        controlGroup: 'r = 0.12 (brak)',
        testGroup: 'r = 0.88 (b. silna)',
        pValue: 'p < 0.0001',
        significance: 'Znakomita zgodność z obrazowaniem molekularnym',
      },
      {
        parameter: 'Czułość / Swoistość testu Simoa',
        controlGroup: 'Referencja kliniczna',
        testGroup: '92.4% / 94.1%',
        pValue: 'p < 0.001',
        significance: 'Spełnia kryteria diagnostyki laboratoryjnej IVD',
      },
    ],
    conclusions:
      'Test osoczowy $p\\text{-tau217}$ na platformie Simoa może zastąpić inwazyjne nakłucie lędźwiowe i drogie badania PET w badaniach wczesnego stadium otępienia, umożliwiając kwalifikację pacjentów do przeciwciał monoklonalnych.',
    keywords: ['p-tau217', 'Biomarkers', 'Simoa HD-X', 'Alzheimer Disease', 'Amyloid PET'],
  },

  // 3. FARMAKOLOGIA: LECANEMAB I DONANEMAB
  {
    id: 'PUB-2024-883',
    title: 'Lecanemab and Donanemab Clearance Kinetics of Amyloid-Beta Protofibrils and Incidence of ARIA-E in Long-Term Follow-up',
    authors: [
      { name: 'Dr. Marcus H. Weber', role: 'Główny Badacz', affiliation: 'NeuroClin Translational Neurobiology' },
      { name: 'Dr. David Holtzman', role: 'Współautor', affiliation: 'Washington University School of Medicine in St. Louis' },
    ],
    date: '11 listopada 2024',
    year: 2024,
    journal: 'The New England Journal of Medicine, Vol. 391, pp. 1780–1794',
    doi: '10.1056/NEJMoa2408831',
    category: 'Farmakologia',
    articleType: 'Badanie Kliniczne',
    citations: 342,
    altmetricScore: 410,
    downloadsCount: 5600,
    openAccess: true,
    abstract:
      'Ocena skuteczności klinicznej humanizowanych przeciwciał monoklonalnych skierowanych przeciwko rozpuszczalnym oligomerom i protofibrylom $A\\beta$. Wykazano spowolnienie progresji klinicznej w skali CDR-SB o $27.3\\%$ po 18 miesiącach terapii lecanemabem przy jednoczesnym monitorowaniu obrzęku naczyniopochodnego (ARIA-E) metodą rezonansu magnetycznego 7T.',
    studyObjective:
      'Wczesne próby z przeciwciałami usuwającymi dojrzałe blaszki amyloidowe wiązały się z wysokim odsetkiem powikłań naczyniowych (ARIA-E). Badanie miało na celu porównanie powinowactwa lecanemabu do wysoce neurotoksycznych rozpuszczalnych protofibryli $A\\beta_{1-42}$ w stosunku do dojrzałych złogów oraz określenie kinetyki naczyniowego przesięku płynu mózgowego u nosicieli allelu $APOE\\,\\varepsilon 4$.',
    methodologyNarrative:
      'W badaniu wzięło udział 856 pacjentów z wczesną postacią choroby Alzheimera. Lek podawano we wlewie dożylnym w dawce $10\\,\\text{mg/kg}$ masy ciała co dwa tygodnie. Monitorowanie ARIA-E i mikrokrwawień (ARIA-H) prowadzono seryjnymi badaniami MRI 7T (sekwencje FLAIR i T2* GRE) w tygodniach 4, 9, 12, 24, 52 i 78. Poziom obciążenia amyloidowego mierzono ilościowo w skali centiloidów przy użyciu radioznacznika $[^{18}\\text{F}]\\text{florbetapir}$.',
    methodologyParams: {
      tissueSample: 'Osocze, PMR oraz seryjne skany PET i MRI (n = 856 pacjentów w stadium MCI/łagodne otępienie)',
      instrumentation: 'Skaner MR 7-Tesla Siemens Magnetom Terra oraz PET-CT Biograph Vision',
      perfusionOrReagent: 'Humanizowane IgG1 lecanemab (10 mg/kg mc. i.v.) vs placebo',
      samplingFrequency: 'Oceny neuropoznawcze (CDR-SB, ADAS-Cog14) i neuroobrazowanie co 6–12 tygodni',
    },
    resultsNarrative:
      'W grupie leczonej lecanemabem odnotowano redukcję obciążenia amyloidowego o $-59.2$ centiloidów w stosunku do wartości wyjściowej ($p < 0.001$). Częstość występowania ARIA-E wyniosła $12.6\\%$, z czego $78\\%$ przypadków miało charakter bezobjawowy i ustąpiło w ciągu 12 tygodni od wstrzymania infuzji. U nosicieli homozygoty $APOE\\,\\varepsilon 4/\\varepsilon 4$ ryzyko ARIA-E było istotnie wyższe ($32.4\\%$).',
    resultsTable: [
      {
        parameter: 'Zmiana w skali CDR-SB po 18 mies. (punkty)',
        controlGroup: '+1.66 ± 0.12 (pogorszenie)',
        testGroup: '+1.21 ± 0.10 (spowolnienie o 27.3%)',
        pValue: 'p < 0.001',
        significance: 'Wysoka skuteczność spowolnienia ubytku poznawczego',
      },
      {
        parameter: 'Obciążenie amyloidem (skala Centiloid)',
        controlGroup: '+3.8 ± 1.2 centiloidów',
        testGroup: '-59.2 ± 4.1 centiloidów',
        pValue: 'p < 0.0001',
        significance: 'Kompletne oczyszczenie protofibryli u 68% pacjentów',
      },
      {
        parameter: 'Częstość ARIA-E w grupie ogólnej',
        controlGroup: '1.7%',
        testGroup: '12.6%',
        pValue: 'p < 0.001',
        significance: 'Wymaga seryjnego monitorowania MRI w sekwencji FLAIR',
      },
    ],
    conclusions:
      'Selektywne usuwanie protofibryli $A\\beta$ spowalnia degenerację synaptyczną, dowodząc kluczowej roli rozpuszczalnych form oligomerycznych w kaskadzie amyloidowej. Konieczna jest ścisła kontrola radiologiczna u nosicieli $APOE\\,\\varepsilon 4$.',
    keywords: ['Lecanemab', 'Donanemab', 'Amyloid-Beta', 'ARIA-E', 'Clinical Trials'],
  },

  // 4. FARMAKOLOGIA: DONEPEZIL + MEMANTYNA
  {
    id: 'PUB-2023-520',
    title: 'Synergistic Dynamics of Donepezil and Memantine in Preventing Excitotoxic Calcium Overload: An Electrophysiological Study',
    authors: [
      { name: 'Dr. Marcus H. Weber', role: 'Pierwszy Autor', affiliation: 'NeuroClin Translational Neurobiology' },
      { name: 'Dr. Elena Vance', role: 'Współautor', affiliation: 'Department of Pharmacology, Cambridge University' },
    ],
    date: '05 lipca 2023',
    year: 2023,
    journal: 'Neuropharmacology, Vol. 235, Article 109580',
    doi: '10.1016/j.neuropharm.2023.109580',
    category: 'Farmakologia',
    articleType: 'Artykuł Badawczy',
    citations: 112,
    altmetricScore: 78,
    downloadsCount: 2210,
    openAccess: true,
    abstract:
      'Wykazano, że skojarzone podawanie inhibitora acetylocholinoesterazy (donepezilu) z niekompetycyjnym antagonistą receptora NMDA (memantyną) wykazuje addytywny wpływ neuroprotekcyjny. Memantyna blokuje patologiczny napływ jonów wapnia ($Ca^{2+}$) bez zakłócania fizjologicznej plastyczności synaptycznej wyzwalanej podwyższonym poziomem acetylocholiny.',
    studyObjective:
      'Nadmiar glutaminianu w przestrzeni synaptycznej wywołuje przewlekłe otwarcie kanałów receptora NMDA i toksyczny napływ $Ca^{2+}$, prowadząc do aktywacji kalpain i obumarcia neuronów. Celem badania było wyjaśnienie, dlaczego połączenie leku podwyższającego poziom acetylocholiny (donepezil) z blokerem kanału NMDA o szybkiej kinetyce odłączania (memantyna) daje lepsze rezultaty kliniczne niż monoterapia każdym ze związków.',
    methodologyNarrative:
      'Skrawki hipokampa myszy (grubość $350\\,\\mu\\text{m}$) poddano perfuzji kwasem glutaminowym ($100\\,\\mu\\text{M}$) w celu wywołania ekscytotoksyczności. Pomiary prądów cało-komórkowych prowadzono techniką patch-clamp w konfiguracji whole-cell na neuronach piramidowych sektora CA1. Wewnątrzkomórkowe stężenie wapnia monitorowano w czasie rzeczywistym mikroskopią dwufotonową z barwnikiem ratiometrycznym Fura-2 AM ($5\\,\\mu\\text{M}$).',
    methodologyParams: {
      tissueSample: 'Ostre skrawki hipokampa CA1 myszy C57BL/6 (wiek 8–10 tygodni)',
      instrumentation: 'Układ patch-clamp EPC-10 HEKA z mikroskopem 2-fotonowym Olympus FV1000MPE',
      perfusionOrReagent: 'Sztuczny płyn aCSF z dodatkiem TTX (1 µM), bicukuliny (10 µM) i glutaminianu (100 µM)',
      samplingFrequency: 'Próbkowanie prądów 50 kHz z analogowym filtrem dolnoprzepustowym Bessela 2.9 kHz',
    },
    resultsNarrative:
      'Memantyna w stężeniu $10\\,\\mu\\text{M}$ redukowała toniczny prąd NMDA o $72.4 \\pm 4.6\\%$, nie wpływając negatywnie na indukcję LTP przy stymulacji impulsowej. Równoczesne dodanie donepezilu ($1\\,\\mu\\text{M}$) stymulowało receptory nikotynowe $\\alpha 7\\,\\text{nAChR}$, co skutkowało aktywacją szlaku kinazy Akt i zahamowaniem proapoptotycznej kinazy GSK-3$\\beta$.',
    resultsTable: [
      {
        parameter: 'Wewnątrzkomórkowy napływ Ca²⁺ (stosunek F340/F380)',
        controlGroup: '2.42 ± 0.15 (toksyczny nadmiar)',
        testGroup: '1.18 ± 0.08 (poziom fizjologiczny)',
        pValue: 'p < 0.0001',
        significance: 'Spadek przeciążenia wapniowego o 51.2%',
      },
      {
        parameter: 'Przeżywalność neuronów CA1 po 24h (test MTT)',
        controlGroup: '44.8 ± 3.6%',
        testGroup: '82.4 ± 4.2%',
        pValue: 'p < 0.001',
        significance: 'Wzrost przeżywalności o 84% względem monoterapii',
      },
      {
        parameter: 'Aktywność kinazy GSK-3β (fosfo-Ser9 / total)',
        controlGroup: '0.34 ± 0.04',
        testGroup: '0.86 ± 0.06',
        pValue: 'p < 0.001',
        significance: 'Inaktywacja szlaku degradacji cytoszkieletu',
      },
    ],
    conclusions:
      'Skojarzone leczenie donepezilem i memantyną chroni neurony CA1 przed ekscytotoksycznością poprzez komplementarne mechanizmy: fizyczną blokadę kanału NMDA o niskim powinowactwie oraz wzmocnienie sygnalizacji cholinergicznej o działaniu pro-przeżyciowym.',
    keywords: ['Donepezil', 'Memantine', 'NMDA Receptor', 'Excitotoxicity', 'Calcium Homeostasis'],
  },

  // 5. IMMUNOLOGIA: SZLAK TREM2 W MIKROGLEJU
  {
    id: 'PUB-2024-315',
    title: 'TREM2 Activation on Disease-Associated Microglia Promotes Plaque Phagocytosis and Attenuates Chronic Neuroinflammation',
    authors: [
      { name: 'Dr. Marcus H. Weber', role: 'Główny Badacz', affiliation: 'NeuroClin Translational Neurobiology' },
      { name: 'Dr. Christian Haass', role: 'Konsultant Naukowy', affiliation: 'DZNE German Center for Neurodegenerative Diseases, Munich' },
    ],
    date: '04 czerwca 2024',
    year: 2024,
    journal: 'Nature Neuroscience, Vol. 27, pp. 1105–1119',
    doi: '10.1038/s41593-024-0315-7',
    category: 'Immunologia',
    articleType: 'Artykuł Badawczy',
    citations: 215,
    altmetricScore: 198,
    downloadsCount: 3100,
    openAccess: true,
    abstract:
      'Badanie agonistycznych przeciwciał monoklonalnych aktywujących receptor TREM2 na powierzchni komórek mikrogleju. Wykazano przejście fenotypu mikrogleju ze stanu spoczynkowego do komórek skojarzonych z chorobą (DAM), co skutkuje efektywną klirencją oligomerów białkowych i wygaszeniem kaskady prozapalnych cytokin $IL\\text{-}1\\beta$ oraz $TNF\\text{-}\\alpha$.',
    studyObjective:
      'Przewlekła odpowiedź zapalna w mózgu przyspiesza niszczenie synaps. Komórki mikrogleju mogą pełnić funkcję ochronną (fagocytoza złogów) lub neurotoksyczną (wydzielanie cytokin). Celem badania było zbadanie, w jaki sposób ligacja receptora TREM2 i aktywacja adaptera DAP12 indukuje stan DAM (Disease-Associated Microglia), który tworzy fizyczną barierę wokół blaszek amyloidowych, izolując je od dendrytów.',
    methodologyNarrative:
      'Doświadczenia prowadzono na pierwotnych kulturach ludzkiego mikrogleju wywodzącego się z komórek iPSC oraz na modelu mysim 5xFAD. Komórki stymulowano agonistycznym przeciwciałem monoklonalnym anty-TREM2 (mAb-4D9, $50\\,\\text{nM}$) przez 48 godzin. Fagocytozę fluorescencyjnie znakowanego $A\\beta_{1-42}$ (pHrodo Red) mierzono cytometrią przepływową wieloparametrową BD FACSymphony. Poziom cytokin zapalnych oznaczono multipleksowym testem Luminex.',
    methodologyParams: {
      tissueSample: 'Izolowany pierwotny mikroglej z ludzkich iPSC oraz homogenaty kory myszy 5xFAD',
      instrumentation: 'Cytometr przepływowy BD FACSymphony A5 oraz czytnik Luminex 200',
      perfusionOrReagent: 'Pożywka DMEM/F-12 z dodatkiem M-CSF (20 ng/mL) i przeciwciała anty-TREM2 mAb-4D9',
      samplingFrequency: 'Rejestracja fluorescencji na 28 kanałach spektralnych; testy fagocytozy co 2 godziny',
    },
    resultsNarrative:
      'Aktywacja TREM2 spowodowała $3.2$-krotny wzrost wskaźnika fagocytozy protofibryli amyloidowych bez towarzyszącej ekspresji syntazy tlenku azotu (iNOS). Zaobserwowano jednoczesny spadek stężenia prozapalnej interleukiny $IL\\text{-}1\\beta$ o $64.1\\%$ oraz czynnika $TNF\\text{-}\\alpha$ o $58.3\\%$. Analiza immunohistochemiczna mózgów mysich wykazała zwężenie i zagęszczenie wieńców mikroglejowych wokół blaszek.',
    resultsTable: [
      {
        parameter: 'Wskaźnik fagocytozy Aβ (indeks MFI pHrodo)',
        controlGroup: '142 ± 18',
        testGroup: '458 ± 32',
        pValue: 'p < 0.0001',
        significance: 'Wzrost wydajności klirensu blaszek o 222%',
      },
      {
        parameter: 'Stężenie IL-1β w nadsączu hodowli (pg/mL)',
        controlGroup: '184.2 ± 14.6 pg/mL',
        testGroup: '66.1 ± 6.2 pg/mL',
        pValue: 'p < 0.001',
        significance: 'Wyraźne wygaszenie kaskady prozapalnej',
      },
      {
        parameter: 'Ekspresja markerów DAM (Apoe, Csf1, Clec7a)',
        controlGroup: '1.0 (linia bazowa)',
        testGroup: '4.8 ± 0.4 (fold-change)',
        pValue: 'p < 0.001',
        significance: 'Skuteczne przeprogramowanie transkryptomu mikrogleju',
      },
    ],
    conclusions:
      'Agonizm TREM2 promuje protekcyjną odpowiedź mikroglejową, usuwając toksyczne agregaty białkowe i wygaszając niszczący stan zapalny tkanki mózgowej, stanowiąc obiecujący cel terapeutyczny immunoterapii neurodegeneracji.',
    keywords: ['TREM2', 'Microglia', 'Neuroinflammation', 'Phagocytosis', 'Cytokines'],
  },

  // 6. FIZJOLOGIA: APOPTOZA MITOCHONDRIALNA
  {
    id: 'PUB-2025-104',
    title: 'Mitochondrial Outer Membrane Permeabilization and Caspase-3/9 Cleavage Cascades in Hypoxic Neuronal Apoptosis',
    authors: [
      { name: 'Dr. Elena Vance', role: 'Główny Badacz', affiliation: 'Department of Cellular Pathology, Cambridge University' },
      { name: 'Dr. Julian Brandt', role: 'Mikrobiolog', affiliation: 'NeuroClin Mitochondrial Research Unit' },
    ],
    date: '02 lutego 2025',
    year: 2025,
    journal: 'Cell Death & Differentiation, Vol. 32, pp. 210–225',
    doi: '10.1038/s41418-025-01104-w',
    category: 'Fizjologia',
    articleType: 'Artykuł Badawczy',
    citations: 78,
    altmetricScore: 62,
    downloadsCount: 1650,
    openAccess: true,
    abstract:
      'Badanie mechanizmu translokacji proapoptotycznego białka Bax do zewnętrznej błony mitochondrialnej pod wpływem przejściowej deprywacji tlenowo-glukozowej (OGD). Wykazano, że oligomeryzacja porów MOMP wyzwala uwolnienie cytochromu c i sekwencyjną aktywację kaspazy-9 oraz kaspazy-3, co można zahamować rekombinowanymi peptydami BH3-mimetycznymi.',
    studyObjective:
      'Niedokrwienie mózgu wywołuje gwałtowny spadek potencjału transbłonowego mitochondriów ($\\Delta \\Psi_m$), co prowadzi do nieodwracalnej apoptozy neuronów piramidowych. Celem projektu było precyzyjne ustalenie okna czasowego między uwolnieniem cytochromu c a rozszczepieniem substratu PARP przez kaspazę-3, w celu identyfikacji optymalnego momentu interwencji farmakologicznej.',
    methodologyNarrative:
      'Hodowle pierwotnych neuronów korowych poddawano 90-minutowej deprywacji tlenowo-glukozowej w komorze hipoksyjnej ($1\\%\\,\\text{O}_2, 5\\%\\,\\text{CO}_2, 94\\%\\,\\text{N}_2$). Respirometrię wysokorozdzielczą prowadzono w aparacie Oroboros Oxygraph-2k. Zmiany potencjału $\\Delta \\Psi_m$ mierzono barwnikiem JC-1 ($2\\,\\mu\\text{M}$), a aktywację kaspaz weryfikowano immunoblottingiem i testami kolorymetrycznymi z substratem Ac-DEVD-pNA.',
    methodologyParams: {
      tissueSample: 'Pierwotne neurony korowe szczura (E18, DIV 14–18)',
      instrumentation: 'Respirometr dwukomorowy Oroboros Oxygraph-2k i czytnik płytek BioTek Synergy H1',
      perfusionOrReagent: 'Bufor fosforanowy bez glukozy, nasycony N2; oligomycyna (2 µM) i FCCP (1 µM)',
      samplingFrequency: 'Ciągła rejestracja poboru tlenu O2 co 2 sekundy; pomiary fluorescencji JC-1 co 5 min',
    },
    resultsNarrative:
      'Uwolnienie cytochromu c następowało już w 25. minucie po reoksygenacji, poprzedzając spadek $\\Delta \\Psi_m$ o $62.8\\%$. Zastosowanie selektywnego inhibitora oligomeryzacji Bax (Bax-Inh-V, $10\\,\\mu\\text{M}$) utrzymało integralność porów MOMP, obniżyło aktywność kaspazy-3 o $71.5\\%$ i zapobiegło degeneracji drzewek dendrytycznych.',
    resultsTable: [
      {
        parameter: 'Potencjał transbłonowy ΔΨm (stosunek JC-1)',
        controlGroup: '1.82 ± 0.09 (normoksja)',
        testGroup: '0.68 ± 0.05 (hipoksja)',
        pValue: 'p < 0.0001',
        significance: 'Spadek potencjału mitochondrialnego o 62.6%',
      },
      {
        parameter: 'Aktywność kaspazy-3 (nmol pNA/min/mg)',
        controlGroup: '12.4 ± 1.8 (z inhibitorem Bax: 18.2)',
        testGroup: '64.8 ± 4.5 (brak ochrony)',
        pValue: 'p < 0.001',
        significance: 'Zahamowanie apoptozy kaspazo-zależnej o 71.9%',
      },
      {
        parameter: 'Wskaźnik przeżywalności komórek po 24h',
        controlGroup: '36.4 ± 3.2% (grupa OGD bez leku)',
        testGroup: '78.9 ± 4.1% (grupa z Bax-Inh-V)',
        pValue: 'p < 0.001',
        significance: 'Większa ochrona somatyczna neuronów',
      },
    ],
    conclusions:
      'Farmakologiczne zablokowanie tworzenia porów MOMP w oknie czasowym do 45 minut po epizodzie hipoksji skutecznie chroni neurony przed apoptozą, oferując nową strategię terapeutyczną w udarze niedokrwiennym i ostrym niedotlenieniu.',
    keywords: ['MOMP', 'Caspase-3', 'Mitochondria', 'Neuronal Apoptosis', 'Hypoxia'],
  },

  // 7. GENETYKA: SCREENING CRISPR-CAS9
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
    articleType: 'Artykuł Badawczy',
    citations: 290,
    altmetricScore: 312,
    downloadsCount: 4800,
    openAccess: true,
    abstract:
      'Wielkoskalowy screening genetyczny biblioteki sgRNA obejmujący 18 000 genów w poszukiwaniu czynników modulujących regenerację aksonów po urazie mechanicznym. Zidentyfikowano deacetylazę histonową HDAC6 jako kluczowy cel molekularny, którego delecja przywraca transport pęcherzykowy w mikrotubulach i przyspiesza odrost neurytów o $184\\%$.',
    studyObjective:
      'Po urazie mechanicznym lub w przebiegu neurodegeneracji neurony ośrodkowego układu nerwowego wykazują znikomą zdolność do odrastania aksonów. Celem badania było bezstronne przeszukanie całego genomu ludzkiego w celu odnalezienia genów hamujących naturalne procesy naprawcze aksonów i synaps.',
    methodologyNarrative:
      'Ludzkie komórki macierzyste ze stabilną ekspresją Cas9 zróżnicowano w neurony korowe i zainfekowano lentiwirusową biblioteką GeCKO v2 ($18\\,000$ genów, 6 sgRNA/gen). Po uszkodzeniu mikroskopowym aksonów w urządzeniach mikroprzepływowych (tzw. komory Campenot), odrastające neuryty izolowano mechanicznie i sekwencjonowano na platformie Illumina NovaSeq 6000 w celu identyfikacji wzbogaconych sekwencji sgRNA.',
    methodologyParams: {
      tissueSample: 'Ludzkie neurony korowe różnicowane z komórek iPSC (locus AAVS1-Cas9)',
      instrumentation: 'Sekwenator wysokoprzepustowy Illumina NovaSeq 6000 oraz komory mikroprzepływowe XonaChip',
      perfusionOrReagent: 'Selekcja puromycynowa (1.5 µg/mL) przez 14 dni; przeciwciało anty-Tuj1 i anty-MAP2',
      samplingFrequency: 'Głębokość sekwencjonowania: 100 mln odczytów paired-end (150 bp PE) na próbkę',
    },
    resultsNarrative:
      'Wzbogacenie bioinformatyczne ujawniło wyciszenie genu HDAC6 jako najsilniejszy promotor wzrostu aksonów ($FDR < 0.001$). Komórki z delecją HDAC6 wykazywały podwyższoną acetylację $\\alpha$-tubuliny w pozycji Lys40, co zoptymalizowało rekrutację kinezyny-1 i przywróciło transport pęcherzyków BDNF z prędkością $1.42 \\pm 0.12\\,\\mu\\text{m/s}$.',
    resultsTable: [
      {
        parameter: 'Długość odrastających aksonów po 72h (µm)',
        controlGroup: '112 ± 14 µm (dziki typ)',
        testGroup: '318 ± 22 µm (sgRNA-HDAC6)',
        pValue: 'p < 0.0001',
        significance: 'Wzrost długości odrostu neurytów o 184%',
      },
      {
        parameter: 'Prędkość transportu pęcherzykowego BDNF (µm/s)',
        controlGroup: '0.64 ± 0.08 µm/s',
        testGroup: '1.42 ± 0.12 µm/s',
        pValue: 'p < 0.001',
        significance: 'Poprawa transportu aksonalnego o 122%',
      },
      {
        parameter: 'Gęstość kolców dendrytycznych (kolce / 10 µm)',
        controlGroup: '4.2 ± 0.5',
        testGroup: '8.6 ± 0.7',
        pValue: 'p < 0.001',
        significance: 'Istotny wzrost gęstości synaps funkcjonalnych',
      },
    ],
    conclusions:
      'Inhibicja HDAC6 stanowi cel genetyczny i farmakologiczny w modulacji plastyczności strukturalnej, umożliwiając regenerację połączeń synaptycznych zniszczonych w chorobie Alzheimera i stwardnieniu zanikowym bocznym (ALS).',
    keywords: ['CRISPR-Cas9', 'Axonal Sprouting', 'HDAC6', 'Epigenetics', 'Microtubules'],
  },

  // 8. BIOCHEMIA: KINETYKA MICHAELISA-MENTEN
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
    articleType: 'Raport Metodologiczny',
    citations: 94,
    altmetricScore: 48,
    downloadsCount: 1890,
    openAccess: true,
    abstract:
      'Wyprowadzenie formalizmu estymacji stałych inhibicji $K_i$ oraz współczynnika kooperatywności Hilla $n_H$ w układach podlegających równoległej degradacji substratu. Oprogramowanie analityczne minimalizuje sumę kwadratów ważonych odchyleń bez konieczności linearyzacji podwójnych odwrotności Lineweavera-Burka, zapobiegając sztucznym zniekształceniom błędu pomiarowego.',
    studyObjective:
      'Klasyczna transformacja Lineweavera-Burka wprowadza nieliniowe zniekształcenia błędów eksperymentalnych przy małych stężeniach substratu. Celem pracy było stworzenie algorytmu nieliniowej regresji opartego na równaniu Levenberga-Marquardta do dokładnego wyznaczania parametrów enzymatycznych acetylocholinoesterazy (AChE) i jej kompetycyjnych oraz allosterycznych inhibitorów.',
    methodologyNarrative:
      'Kinetykę hydrolizy jodku acetylotiocholiny ($0.05–2.5\\,\\text{mM}$) przez rekombinowaną ludzką AChE mierzono zmodyfikowaną metodą Ellmana z odczynnikiem DTNB ($0.3\\,\\text{mM}$). Pomiary absorbancji przy $\\lambda = 412\\,\\text{nm}$ prowadzono w 96-dołkowych mikropłytkach w termostatowanym spektrofotometrze płytkowym BioTek Synergy H1 z częstotliwością co $5$ sekund przez 15 minut.',
    methodologyParams: {
      tissueSample: 'Rekombinowana ludzka acetylocholinoesteraza (rhAChE, ekspresja HEK293)',
      instrumentation: 'Spektrofotometr mikropłytkowy BioTek Synergy H1 z termostatowaniem do 37°C',
      perfusionOrReagent: 'Bufor fosforanowy 100 mM (pH 7.4), DTNB 0.3 mM, donepezil (0.1–50 nM)',
      samplingFrequency: 'Ciągły pomiar absorbancji co 5 s przy długości fali 412 nm; 180 punktów kinetycznych na próbkę',
    },
    resultsNarrative:
      'Dla donepezilu wyznaczono stałą inhibicji $K_i = 12.4 \\pm 0.8\\,\\text{nM}$ przy stałej Michaelisa $K_m = 114 \\pm 6\\,\\mu\\text{M}$ i $V_{max} = 48.2 \\pm 1.4\\,\\mu\\text{mol/min/mg}$. Modelowanie allosteryczne potwierdziło wiązanie cząsteczki zarówno z miejscem katalitycznym (CAS), jak i obwodowym miejscem anionowym (PAS), co wyjaśnia hamowanie agregacji indukowanej przez PAS.',
    resultsTable: [
      {
        parameter: 'Stała inhibicji Ki dla donepezilu',
        controlGroup: '28.4 ± 3.2 nM (metoda podw. odwr.)',
        testGroup: '12.4 ± 0.8 nM (regresja nieliniowa)',
        pValue: 'p < 0.001',
        significance: 'Wyeliminowanie błędu systematycznego o 56%',
      },
      {
        parameter: 'Współczynnik determinacji dopasowania R²',
        controlGroup: '0.942 (Lineweaver-Burk)',
        testGroup: '0.998 (Bio-Kinetics Fit)',
        pValue: 'p < 0.0001',
        significance: 'Perfekcyjne odwzorowanie kinetyki w całym zakresie',
      },
      {
        parameter: 'Kooperatywność wiązania Hilla (nH)',
        controlGroup: '1.00 (założenie braku kooperacji)',
        testGroup: '1.08 ± 0.03',
        pValue: 'p = 0.04',
        significance: 'Potwierdzenie słabej kooperatywności allosterycznej',
      },
    ],
    conclusions:
      'Opracowany moduł obliczeniowy stał się elementem wewnętrznego oprogramowania analitycznego BioResearcher AI w NeuroClin, pozwalając na szybką charakterystykę biofizyczną nowych inhibitorów cholinoesteraz.',
    keywords: ['Michaelis-Menten', 'Enzyme Kinetics', 'Acetylcholinesterase', 'Donepezil', 'Nonlinear Regression'],
  },

  // 9. FIZJOLOGIA: BARIERA KREW-MÓZG (BBB)
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
    articleType: 'Artykuł Badawczy',
    citations: 135,
    altmetricScore: 92,
    downloadsCount: 2450,
    openAccess: true,
    abstract:
      'Badanie mechanizmów transportu przez barierę krew-mózg w kokulturach komórek śródbłonka hCMEC/D3 i pierwotnych astrocytów. Wyznaczono współczynniki przepuszczalności pozornej $P_{app}$ dla przeciwciał bispecyficznych wykorzystujących transcytozę za pośrednictwem receptora transferrynowego (TfR), wykazując $8.6$-krotny wzrost penetracji tkanki mózgowej.',
    studyObjective:
      'Niewielka penetracja przeciwciał terapeutycznych przez barierę krew-mózg (zaledwie $0.1\\%$) jest głównym ograniczeniem w farmakoterapii chorób ośrodkowego układu nerwowego. Celem badań było opracowanie zwalidowanego modelu in vitro Transwell o wysokiej oporności elektrycznej (TEER) do screeningu konstrukcji bispecyficznych przenikających barierę metodą "konia trojańskiego".',
    methodologyNarrative:
      'Komórki śródbłonka hCMEC/D3 wysiewano na membranach poliestrowych ($0.4\\,\\mu\\text{m}$) w naczyniach Transwell 24-dołkowych, w kontakcie z astrocytami w komorze dolnej. Integralność złączy ścisłych (claudin-5, occludin, ZO-1) monitorowano seryjnymi pomiarami oporu elektrycznego TEER miernikiem EVOM3. Przepuszczalność znakowanych fluorescencyjnie przeciwciał anty-TfR mierzono w komorze abluminalnej po 1, 2, 4 i 8 godzinach.',
    methodologyParams: {
      tissueSample: 'Kokultury komórek śródbłonka hCMEC/D3 i ludzkich astrocytów pierwotnych',
      instrumentation: 'Miernik oporu transepitelialnego EVOM3 (World Precision Instruments) oraz spektrofluorymetr',
      perfusionOrReagent: 'Zrównoważony bufor Hanksa (HBSS) z suplementem glukozy i 1% BSA; znacznik żółcień Lucyfera',
      samplingFrequency: 'Rejestracja TEER co 12 h; pobieranie próbek medium abluminalnego co 60 minut',
    },
    resultsNarrative:
      'Kokultura osiągnęła stabilny opór $\\text{TEER} > 280\\,\\Omega \\cdot \\text{cm}^2$. Współczynnik przepuszczalności $P_{app}$ dla standardowego IgG wynosił $(0.42 \\pm 0.04) \\times 10^{-6}\\,\\text{cm/s}$, podczas gdy przeciwciało bispecyficzne anty-TfR/A$\\beta$ osiągnęło $P_{app} = (3.62 \\pm 0.28) \\times 10^{-6}\\,\\text{cm/s}$ bez rozszczelnienia złączy ścisłych (brak przenikania żółcieni Lucyfera).',
    resultsTable: [
      {
        parameter: 'Opór transepitelialny TEER (Ω·cm²)',
        controlGroup: '85 ± 8 Ω·cm² (monokultura)',
        testGroup: '286 ± 14 Ω·cm² (kokultura z astrocytami)',
        pValue: 'p < 0.0001',
        significance: 'Osiągnięcie pełnej szczelności fizjologicznej',
      },
      {
        parameter: 'Współczynnik Papp (x 10⁻⁶ cm/s)',
        controlGroup: '0.42 ± 0.04 (standardowe IgG)',
        testGroup: '3.62 ± 0.28 (IgG bispecyficzne TfR)',
        pValue: 'p < 0.0001',
        significance: 'Wzrost penetracji przez barierę o 762%',
      },
      {
        parameter: 'Przepuszczalność żółcieni Lucyfera (%)',
        controlGroup: '< 0.5% (brak wycieku paracelularnego)',
        testGroup: '< 0.5% (brak wycieku paracelularnego)',
        pValue: 'n.s.',
        significance: 'Brak cytotoksyczności i rozszczelnienia bariery',
      },
    ],
    conclusions:
      'Transcytoza zależna od receptora transferrynowego stanowi wysoce wydajną drogę dostarczania białek terapeutycznych do miąższu mózgu. Zastosowana platforma laboratoryjna pozwala na selekcję kandydatów lekowych o optymalnym profilu bezpieczeństwa.',
    keywords: ['Blood-Brain Barrier', 'TEER', 'Transcytosis', 'Transferrin Receptor', 'Drug Delivery'],
  },

  // 10. BIOCHEMIA: SIMOA DLA NEUROFILAMENT LIGHT (NFL)
  {
    id: 'PUB-2025-619',
    title: 'Single-Molecule Array (Simoa) Quantification of Neurofilament Light Chain (NfL) in Axonal Injury Dynamics',
    authors: [
      { name: 'Dr. Sarah Lin', role: 'Pierwszy Autor', affiliation: 'Department of Clinical Chemistry, Harvard Medical' },
      { name: 'Dr. Marcus H. Weber', role: 'Współautor', affiliation: 'NeuroClin Translational Neurobiology' },
    ],
    date: '19 stycznia 2025',
    year: 2025,
    journal: 'Clinical Chemistry and Laboratory Medicine, Vol. 63, Iss. 1, pp. 88–99',
    doi: '10.1515/cclm-2024-0619',
    category: 'Biochemia',
    articleType: 'Artykuł Badawczy',
    citations: 62,
    altmetricScore: 54,
    downloadsCount: 1720,
    openAccess: true,
    abstract:
      'Opracowanie ultra-czułego protokołu pomiarowego dla łańcucha lekkiego neurofilamentów (NfL) w surowicy i osoczu krwi przy użyciu technologii Simoa HD-X. Osiągnięto granicę wykrywalności na poziomie $0.12\\,\\text{pg/mL}$, co pozwala na wychwycenie subklinicznego rozpadu aksonów u pacjentów ze stwardnieniem rozsianym i pourazowym uszkodzeniem mózgu.',
    studyObjective:
      'Neurofilamenty stanowią strukturalny szkielet aksonów. Ich uwalnianie do płynów ustrojowych świadczy o nieodwracalnym rozpadzie włókien nerwowych. Celem pracy była standaryzacja procedury preanalitycznej oraz kalibracja zestawu testowego Simoa NfL Advantage Kit w celu wyeliminowania interferencji ze strony przeciwciał heterofilnych w rutynowej diagnostyce laboratoryjnej.',
    methodologyNarrative:
      'Przebadano 420 próbek krwi obwodowej pobranych na EDTA, heparynę oraz probówki ze skrzepliną. Analizę przeprowadzono w formacie pojedynczych cząsteczek na mikrokulkach paramagnetycznych w nanostrukturach Simoa. Przeprowadzono testy powtarzalności wewnątrz- i między-seryjnej (CV < 5.8%) oraz testy stabilności analitu przy wielokrotnym zamrażaniu i rozmrażaniu (do 4 cykli).',
    methodologyParams: {
      tissueSample: 'Osocze EDTA, osocze heparynowe i surowica krwi (n = 420 osób)',
      instrumentation: 'Analizator immunoenzymatyczny Simoa HD-X (Quanterix)',
      perfusionOrReagent: 'Simoa NfL Advantage Assay Kit, bufor blokujący IgG mysie',
      samplingFrequency: 'Pomiar fluorescencji pojedynczych studzienek femtolitrowych (pojemność 50 fL)',
    },
    resultsNarrative:
      'Stężenie NfL w osoczu wykazało niemal doskonałą korelację ze stężeniem w płynie mózgowo-rdzeniowym ($r = 0.91, p < 0.0001$). U pacjentów z aktywnym rzutem stwardnienia rozsianego mediana stężenia wynosiła $34.8\\,\\text{pg/mL}$ wobec $8.2\\,\\text{pg/mL}$ u zdrowych ochotników. Test wykazał stabilność odczytu w surowicy przechowywanej w $-80^\\circ\\text{C}$ przez 12 miesięcy.',
    resultsTable: [
      {
        parameter: 'Granica wykrywalności testu LOD (pg/mL)',
        controlGroup: '15.0 pg/mL (klasyczne ELISA)',
        testGroup: '0.12 pg/mL (Simoa HD-X)',
        pValue: 'p < 0.0001',
        significance: '125-krotny wzrost czułości analitycznej',
      },
      {
        parameter: 'Współczynnik zmienności między-seryjnej CV (%)',
        controlGroup: '14.2% (konwencjonalne testy)',
        testGroup: '4.9% (zoptymalizowany protokół)',
        pValue: 'p < 0.01',
        significance: 'Wysoka precyzja i powtarzalność metrologiczna',
      },
      {
        parameter: 'Stężenie NfL u pacjentów z rzutem neurozwyrodnienia',
        controlGroup: '8.2 ± 1.1 pg/mL (grupa kontrolna)',
        testGroup: '34.8 ± 3.4 pg/mL (grupa aktywna)',
        pValue: 'p < 0.0001',
        significance: 'Precyzyjny biomarker dynamiki rozpadu aksonów',
      },
    ],
    conclusions:
      'Pomiar NfL metodą Simoa oferuje rzetelny, bezinwazyjny wskaźnik aktywności uszkodzeń aksonalnych w czasie rzeczywistym, ułatwiając monitorowanie odpowiedzi na leki immunomodulujące.',
    keywords: ['Neurofilament Light (NfL)', 'Simoa', 'Axonal Degeneration', 'Biomarkers', 'Multiple Sclerosis'],
  },

  // 11. NEUROBIOLOGIA: TRANSKRYPTOMIKA POJEDYNCZYCH NEURONÓW CA1
  {
    id: 'PUB-2024-118',
    title: 'Targeted RNA-Seq Transcriptomic Profiling of CA1 Pyramidal Neurons Under Sustained NMDA Receptor Overactivation',
    authors: [
      { name: 'Dr. Julian Brandt', role: 'Główny Badacz', affiliation: 'NeuroClin Genomic Screening Facility' },
      { name: 'Dr. Elena Vance', role: 'Współautor', affiliation: 'NeuroClin Electrophysiology Unit' },
    ],
    date: '03 marca 2024',
    year: 2024,
    journal: 'Nature Communications, Vol. 15, Article 1842',
    doi: '10.1038/s41467-024-01184-z',
    category: 'Neurobiologia',
    articleType: 'Artykuł Badawczy',
    citations: 88,
    altmetricScore: 110,
    downloadsCount: 2100,
    openAccess: true,
    abstract:
      'Zastosowanie sekwencjonowania transkryptomicznego targeted RNA-Seq w celu zbadania zmian ekspresji genów w neuronach piramidowych CA1 poddanych przewlekłej stymulacji NMDA ($50\\,\\mu\\text{M}$). Zidentyfikowano wczesny panel transkrypcyjny wstrząsu synaptycznego, z gwałtowną nadekspresją genów wczesnej odpowiedzi ($c\\text{-Fos}$, $Arc$, $Egr1$) oraz zapaścią transkryptów podjednostek GluA1 i GluN2B.',
    studyObjective:
      'Wczesne stadia neurodegeneracji charakteryzują się subletalną dysfunkcją synaps na długo przed śmiercią somy neuronu. Celem badania było stworzenie mapy czasowo-przestrzennej zmian transkryptomicznych w sektorze CA1 hipokampa i wyodrębnienie genów, których aktywacja zwiastuje nieodwracalną utratę potencjału plastycznego synaps.',
    methodologyNarrative:
      'Neurony CA1 izolowano z ostrych skrawków hipokampa metodą mikrodyssekcji laserowej (LMD). Izolację całkowitego RNA przeprowadzono kolumienkami PicoPure. Biblioteki przygotowano protokołem celowanego RNA-Seq wzbogaconym o panel 1 200 genów synaptycznych i bioenergetycznych. Sekwencjonowanie wykonano na aparacie Illumina NextSeq 2000.',
    methodologyParams: {
      tissueSample: 'Neurony piramidowe sektora CA1 hipokampa myszy (mikrodyssekcja laserowa Leica LMD7)',
      instrumentation: 'Sekwenator Illumina NextSeq 2000 oraz analizator fragmentów Agilent 2100 Bioanalyzer',
      perfusionOrReagent: 'Zestaw QIAseq Targeted RNA Panel, odczynniki chemiczne Invitrogen SuperScript IV',
      samplingFrequency: 'Pobieranie próbek w punktach czasowych: 0, 15, 30, 60, 180 minut po stymulacji NMDA',
    },
    resultsNarrative:
      'W 30. minucie stymulacji zaobserwowano $14.2$-krotny wzrost poziomu transkryptu $Arc$ oraz $8.8$-krotny wzrost $c\\text{-Fos}$. Równolegle, w 60. minucie nastąpił spadek ekspresji podjednostki $Grin2b$ o $54.2\\%$ oraz $Gria1$ o $48.6\\%$, co dowodzi mechanizmu autoregulacyjnej internacjonalizacji receptorów w odpowiedzi na ekscytotoksyczność.',
    resultsTable: [
      {
        parameter: 'Ekspresja wczesnego genu Arc (fold change)',
        controlGroup: '1.00 ± 0.08',
        testGroup: '14.24 ± 1.12',
        pValue: 'p < 0.0001',
        significance: 'Gwałtowna odpowiedź na pobudzenie synaptyczne',
      },
      {
        parameter: 'Ekspresja receptora NMDA Grin2b (fold change)',
        controlGroup: '1.00 ± 0.05',
        testGroup: '0.46 ± 0.04',
        pValue: 'p < 0.001',
        significance: 'Obronne wyciszenie podjednostki receptora',
      },
      {
        parameter: 'Integralność RNA próbek RIN',
        controlGroup: '9.4 ± 0.3',
        testGroup: '9.1 ± 0.2',
        pValue: 'n.s.',
        significance: 'Wysoka jakość materiału bez degradacji RNA',
      },
    ],
    conclusions:
      'Transkrypcyjny profil zapaści synaptycznej CA1 dostarcza zestawu czułych markerów molekularnych do oceny skuteczności leków zapobiegających ekscytotoksycznemu niszczeniu sieci hipokampa.',
    keywords: ['Targeted RNA-Seq', 'CA1 Hippocampus', 'NMDA Toxicity', 'Synaptic Genes', 'Transcriptomics'],
  },

  // 12. GENETYKA: METYLACJA PROMOTORA APOE
  {
    id: 'PUB-2024-670',
    title: 'Epigenetic Profiling of Histone Deacetylase 6 (HDAC6) Inhibition in Reversing Tau-Induced Cytoskeletal Breakdown',
    authors: [
      { name: 'Dr. Julian Brandt', role: 'Główny Badacz', affiliation: 'NeuroClin Genomic Screening Facility' },
      { name: 'Dr. Marcus H. Weber', role: 'Współautor', affiliation: 'NeuroClin Translational Neurobiology' },
    ],
    date: '14 września 2024',
    year: 2024,
    journal: 'Acta Neuropathologica, Vol. 148, Article 42',
    doi: '10.1007/s00401-024-02670-w',
    category: 'Genetyka',
    articleType: 'Artykuł Badawczy',
    citations: 54,
    altmetricScore: 68,
    downloadsCount: 1350,
    openAccess: true,
    abstract:
      'Ocena wpływu małocząsteczkowego inhibitora HDAC6 (tubastatyny A) na stabilizację cytoszkieletu mikrotubularnego w neuronach z nadekspresją zmutowanego białka tau ($P301L$). Wykazano, że farmakologiczne przywrócenie acetylacji tubuliny zapobiega odłączaniu kinezyny i hamuje rozpad synaps w korze przedczołowej.',
    studyObjective:
      'Hiperfosforylacja białka tau prowadzi do jego odłączenia od mikrotubul i agregacji w splątki neurofibrylarne (NFT). Celem pracy było zbadanie, czy wzmocnienie acetylacji $\\alpha$-tubuliny przez zablokowanie deacetylazy HDAC6 może zrekompensować brak funkcjonalnego białka tau i utrzymać transport aksonalny w degenerujących neuronach.',
    methodologyNarrative:
      'Modelem doświadczalnym były transgeniczne myszy rTg4510 z indukowaną ekspresją ludzkiego tau P301L. Zwierzętom podawano tubastatynę A ($25\\,\\text{mg/kg}$ mc./dobę) dootrzewnowo przez 30 dni. Ocenę mikroskopową prowadzono z użyciem konfokalnego mikroskopu STED o podwyższonej rozdzielczości, mierząc stopień pofragmentowania mikrotubul i transport pęcherzyków synaptycznych znakowanych synaptofizyną.',
    methodologyParams: {
      tissueSample: 'Skrawki kory mózgowej myszy transgenicznych rTg4510 (wiek 6 miesięcy)',
      instrumentation: 'Mikroskop super-rozdzielczy STED Leica TCS SP8 oraz western blot Odyssey CLx',
      perfusionOrReagent: 'Tubastatyna A (25 mg/kg mc.), przeciwciało anty-acetylo-tubulina (Lys40), anty-AT8',
      samplingFrequency: 'Codzienne podawanie substancji; analiza obrazowa 100 neuronów na zwierzę',
    },
    resultsNarrative:
      'Leczenie tubastatyną A podniosło poziom acetylowanej $\\alpha$-tubuliny o $3.4$-krotnie w korze mózgowej ($p < 0.001$). Obserwowano spadek wskaźnika fragmentacji aksonów z $42.8\\%$ do $14.6\\%$ oraz częściowe zahamowanie patologicznej fosforylacji tau w epitopie AT8 (Ser202/Thr205).',
    resultsTable: [
      {
        parameter: 'Poziom acetylowanej α-tubuliny (norm. do GAPDH)',
        controlGroup: '0.28 ± 0.03 (model rTg4510)',
        testGroup: '0.96 ± 0.07 (z tubastatyną A)',
        pValue: 'p < 0.0001',
        significance: '3.4-krotny wzrost stabilizacji mikrotubul',
      },
      {
        parameter: 'Odsetek pofragmentowanych aksonów (%)',
        controlGroup: '42.8 ± 3.8%',
        testGroup: '14.6 ± 1.8%',
        pValue: 'p < 0.001',
        significance: 'Ochrona integralności morfologicznej neurytów',
      },
      {
        parameter: 'Gęstość pęcherzyków synaptozomalnych',
        controlGroup: '18.4 ± 2.1 / µm²',
        testGroup: '38.2 ± 2.9 / µm²',
        pValue: 'p < 0.001',
        significance: 'Przywrócenie transportu aksonalnego do synapsy',
      },
    ],
    conclusions:
      'Modyfikacja potranslacyjna mikrotubul za pośrednictwem celowanej inhibicji HDAC6 chroni neurony przed cytotoksycznością hiperfosforylowanego białka tau, oferując nową ścieżkę leczenia tauopatii.',
    keywords: ['HDAC6', 'Tau P301L', 'Microtubules', 'Tubastatin A', 'Axonal Transport'],
  },

  // 13. NEUROBIOLOGIA: PATCH-CLAMP I RECEPTORY AMPA
  {
    id: 'PUB-2023-228',
    title: 'Whole-Cell Patch-Clamp Characterization of AMPA Receptor GluA2 Subunit Trafficking During Long-Term Potentiation',
    authors: [
      { name: 'Dr. Elena Vance', role: 'Główny Badacz', affiliation: 'NeuroClin Electrophysiology Unit' },
      { name: 'Dr. Sarah Lin', role: 'Współautor', affiliation: 'Department of Chemical Engineering, MIT' },
    ],
    date: '14 listopada 2023',
    year: 2023,
    journal: 'The Journal of Neuroscience, Vol. 43, Iss. 46, pp. 7820–7834',
    doi: '10.1523/JNEUROSCI.0228-23.2023',
    category: 'Neurobiologia',
    articleType: 'Artykuł Badawczy',
    citations: 72,
    altmetricScore: 58,
    downloadsCount: 1540,
    openAccess: true,
    abstract:
      'Elektrofizjologiczna rejestracja patch-clamp wymiany podjednostek receptora AMPA w błonie postsynaptycznej podczas indukcji wczesnego LTP w neuronach piramidowych CA1. Wykazano, że przejściowa insercja kanałów pozbawionych podjednostki GluA2 (przepuszczalnych dla $Ca^{2+}$) jest niezbędna do konsolidacji śladu pamięciowego i stabilizacji kolców.',
    studyObjective:
      'Dynamiczna wymiana podjednostek receptorów AMPA decyduje o sile przewodnictwa synaptycznego. Celem pracy było ustalenie proporcji między receptorami AMPA przepuszczalnymi dla wapnia (CP-AMPARs) a receptorami nieprzepuszczalnymi (CI-AMPARs) w pierwszych minutach po stymulacji tężcowej, z wykorzystaniem selektywnego blokera filantotoksyny PhTx-74.',
    methodologyNarrative:
      'Zastosowano technikę patch-clamp w konfiguracji whole-cell na skrawkach hipokampa myszy. Rejestrowano postsynaptyczne prądy pobudzające (EPSC) wyzwalane stymulacją kolaterali Schaffera. Rektifikację prądów AMPA mierzono przy potencjałach trzymania $-70\\,\\text{mV}$ i $+40\\,\\text{mV}$ w obecności blokera wewnątrzkomórkowego sperminy ($100\\,\\mu\\text{M}$).',
    methodologyParams: {
      tissueSample: 'Skrawki hipokampa myszy C57BL/6 (P21–P28), neurony piramidowe warstwy CA1',
      instrumentation: 'Wzmacniacz patch-clamp MultiClamp 700B i przetwornik Digidata 1550B (Molecular Devices)',
      perfusionOrReagent: 'Roztwór pipetowy z dodatkiem sperminy (100 µM); filantotoksyna PhTx-74 (5 µM)',
      samplingFrequency: 'Próbkowanie 20 kHz, filtr dolnoprzepustowy 4-rzędu Bessela 3 kHz',
    },
    resultsNarrative:
      'W ciągu 10 minut po indukcji LTP wskaźnik rektyfikacji prądów EPSC wzrósł z $1.12$ do $2.44$, a prąd EPSC stał się wrażliwy na filantotoksynę PhTx-74 (spadek o $41.8 \\pm 3.6\\%$), co dowodzi masowej insercji receptorów CP-AMPARs. Po 30 minutach wskaźnik powrócił do normy, wskazując na podmianę na stabilne receptory GluA2-heteromeryczne.',
    resultsTable: [
      {
        parameter: 'Wskaźnik rektyfikacji RI (I-70mV / I+40mV)',
        controlGroup: '1.12 ± 0.06 (linia bazowa)',
        testGroup: '2.44 ± 0.14 (10 min po LTP)',
        pValue: 'p < 0.0001',
        significance: 'Obecność receptorów przepuszczalnych dla wapnia',
      },
      {
        parameter: 'Wrażliwość na filantotoksynę PhTx-74 (%)',
        controlGroup: '4.2 ± 1.1% (brak blokady)',
        testGroup: '41.8 ± 3.6% (znacząca redukcja EPSC)',
        pValue: 'p < 0.001',
        significance: 'Bezpośredni dowód insercji podjednostek GluA1/GluA3',
      },
      {
        parameter: 'Amplituda fEPSP po 60 min (% linii bazowej)',
        controlGroup: '100.0 ± 4.2%',
        testGroup: '172.4 ± 8.1%',
        pValue: 'p < 0.001',
        significance: 'Skuteczna konsolidacja plastyczności synaptycznej',
      },
    ],
    conclusions:
      'Przejściowy napływ wapnia przez receptory CP-AMPARs jest koniecznym wyzwalaczem przebudowy strukturalnej kolca dendrytycznego. Zaburzenie tego szlaku w chorobie Alzheimera uniemożliwia konsolidację śladów pamięciowych w hipokampie.',
    keywords: ['Patch-Clamp', 'AMPA Receptors', 'GluA2', 'LTP', 'Hippocampus'],
  },

  // 14. FARMAKOLOGIA: REZONANS PLAZMONÓW POWIERZCHNIOWYCH (SPR BIACORE)
  {
    id: 'PUB-2023-902',
    title: 'Surface Plasmon Resonance (SPR) Characterization of Bispecific Transferrin Receptor Antibody Affinities',
    authors: [
      { name: 'Dr. Marcus H. Weber', role: 'Główny Badacz', affiliation: 'NeuroClin Translational Neurobiology' },
      { name: 'Dr. Elena Vance', role: 'Współautor', affiliation: 'NeuroClin Cellular Transport Laboratory' },
    ],
    date: '08 września 2023',
    year: 2023,
    journal: 'Analytical Biochemistry, Vol. 676, Article 115240',
    doi: '10.1016/j.ab.2023.115240',
    category: 'Farmakologia',
    articleType: 'Raport Metodologiczny',
    citations: 58,
    altmetricScore: 41,
    downloadsCount: 1190,
    openAccess: true,
    abstract:
      'Zastosowanie spektroskopii rezonansu plazmonów powierzchniowych (SPR Biacore T200) do wyznaczenia stałych asocjacji ($k_a$), dysocjacji ($k_d$) oraz równowagowej stałej powinowactwa ($K_D$) dla bispecyficznych przeciwciał penetrujących barierę krew-mózg. Wykazano, że umiarkowane powinowactwo do receptora transferrynowego ($K_D \\approx 50–100\\,\\text{nM}$) optymalizuje transcytozę w porównaniu do przeciwciał o wysokiej awidności.',
    studyObjective:
      'Zbyt silne wiązanie przeciwciała z receptorem transferrynowym prowadzi do jego degradacji w lizosomach komórek śródbłonka zamiast uwolnienia do tkanki mózgowej. Celem badania było opracowanie matrycy kinetycznej SPR do precyzyjnego strojenia stałych szybkości reakcji w celu maksymalizacji transportu transendotelialnego.',
    methodologyNarrative:
      'Zewnątrzkomórkową domenę rekombinowanego ludzkiego receptora transferrynowego (rhTfR-ECD) unieruchomiono na chipie sensora Biacore CM5 metodą sprzęgania aminowego do gęstości $450\\,\\text{RU}$. Roztwory przeciwciał w stężeniach $1.25–200\\,\\text{nM}$ wprowadzano z szybkością przepływu $30\\,\\mu\\text{L/min}$ w temperaturze $25.0^\\circ\\text{C}$ i $37.0^\\circ\\text{C}$. Krzywe sensoryczne dopasowano do modelu wiązania 1:1 Langmuira.',
    methodologyParams: {
      tissueSample: 'Rekombinowany ektodomena receptora transferrynowego (rhTfR) i przeciwciała bispecyficzne mAb',
      instrumentation: 'Aparat rezonansu plazmonów powierzchniowych Cytiva Biacore T200',
      perfusionOrReagent: 'Układ buforowy HBS-EP+ (10 mM HEPES, 150 mM NaCl, 3 mM EDTA, 0.05% P20, pH 7.4)',
      samplingFrequency: 'Częstotliwość rejestracji sygnału optycznego 10 Hz; czas asocjacji 180 s, dysocjacji 600 s',
    },
    resultsNarrative:
      'Konstrukcja bispecyficzna o zoptymalizowanym powinowactwie wykazała $k_a = (2.14 \\pm 0.12) \\times 10^5\\,\\text{M}^{-1}\\text{s}^{-1}$ oraz $k_d = (1.48 \\pm 0.09) \\times 10^{-2}\\,\\text{s}^{-1}$, co daje równowagową stałą dysocjacji $K_D = 69.2 \\pm 3.4\\,\\text{nM}$. Taki profil umożliwia szybkie odłączanie liganda w kwaśnym środowisku endosomów (pH 5.5).',
    resultsTable: [
      {
        parameter: 'Stała asocjacji ka (M⁻¹s⁻¹)',
        controlGroup: '(8.42 ± 0.44) x 10⁵ (wysokie powin.)',
        testGroup: '(2.14 ± 0.12) x 10⁵ (optymalne)',
        pValue: 'p < 0.001',
        significance: 'Kontrolowana kinetyka wiązania z receptorem',
      },
      {
        parameter: 'Stała dysocjacji kd (s⁻¹)',
        controlGroup: '(1.20 ± 0.10) x 10⁻⁴ (bardzo wolna)',
        testGroup: '(1.48 ± 0.09) x 10⁻² (szybka)',
        pValue: 'p < 0.0001',
        significance: 'Ułatwione odłączanie przeciwciała po przejściu przez BBB',
      },
      {
        parameter: 'Wydajność transcytozy in vitro (%)',
        controlGroup: '1.2 ± 0.3%',
        testGroup: '18.6 ± 1.4%',
        pValue: 'p < 0.0001',
        significance: '15-krotny wzrost ilości przeciwciała w komorze mózgowej',
      },
    ],
    conclusions:
      'Spektroskopia SPR Biacore jest niezbędnym narzędziem inżynierii białkowej w projektowaniu wektorów przenikających barierę krew-mózg, pozwalając na precyzyjną selekcję wariantów o umiarkowanym powinowactwie.',
    keywords: ['Surface Plasmon Resonance (SPR)', 'Biacore T200', 'Transferrin Receptor', 'Binding Kinetics', 'Antibody Engineering'],
  },

  // 15. IMMUNOLOGIA / FARMAKOLOGIA: CYTOTOKSYCZNOŚĆ IN VITRO CACO-2
  {
    id: 'PUB-2024-954',
    title: 'Evaluation of In Vitro Cytotoxicity and Metabolic Viability in Caco-2 and hCMEC/D3 Permeability Screens',
    authors: [
      { name: 'Dr. Marcus H. Weber', role: 'Główny Badacz', affiliation: 'NeuroClin Translational Neurobiology' },
      { name: 'Dr. Julian Brandt', role: 'Współautor', affiliation: 'NeuroClin Genomic Screening Facility' },
    ],
    date: '16 grudnia 2024',
    year: 2024,
    journal: 'Toxicology in Vitro, Vol. 98, Article 105820',
    doi: '10.1016/j.tiv.2024.105820',
    category: 'Immunologia',
    articleType: 'Raport Metodologiczny',
    citations: 39,
    altmetricScore: 32,
    downloadsCount: 980,
    openAccess: true,
    abstract:
      'Wieloparametryczna ocena bezpieczeństwa biologicznego i cytotoksyczności nowych związków nootropowych w modelach komórkowych Caco-2 oraz hCMEC/D3. Zastosowanie równoległych testów MTT, dehydrogenazy mleczanowej (LDH) oraz barwienia jodkiem propidyny pozwoliło na ustalenie progów $IC_{50}$ i profilu bezpieczeństwa przed badaniami in vivo.',
    studyObjective:
      'Wczesne odrzucenie toksycznych kandydatów na leki w badaniach przesiewowych in vitro pozwala na zaoszczędzenie zasobów i ograniczenie testów na zwierzętach. Celem pracy była standaryzacja panelu cytotoksycznego NeuroClin spełniającego wytyczne OECD i GLP.',
    methodologyNarrative:
      'Komórki hodowano w formacie 96-dołkowym do uzyskania pełnej konfluencji. Związki badane inkubowano przez 24, 48 i 72 godziny w stężeniach $0.1–500\\,\\mu\\text{M}$. Pomiary absorbancji formazanu MTT prowadzono przy $\\lambda = 570\\,\\text{nm}$, a aktywność uwalnianej do medium LDH mierzono enzymatycznym testem redukcji soli tetrazolowej INT.',
    methodologyParams: {
      tissueSample: 'Linie komórkowe ludzkiego gruczolakoraka okrężnicy Caco-2 i śródbłonka mózgu hCMEC/D3',
      instrumentation: 'Czytnik mikropłytkowy BioTek Synergy H1 i mikroskop fluorescencyjny Olympus IX73',
      perfusionOrReagent: 'Odczynnik bromek tiazolilobłękitny MTT (0.5 mg/mL), zestaw CyQUANT LDH Cytotoxicity Kit',
      samplingFrequency: 'Punkty pomiarowe po 24, 48 i 72 godzinach; n = 8 powtórzeń technicznych na stężenie',
    },
    resultsNarrative:
      'Zbadane pochodne adamantanowe nie wykazywały istotnej cytotoksyczności w stężeniach terapeutycznych ($IC_{50} > 250\\,\\mu\\text{M}$). Uwalnianie LDH w stężeniu roboczym $10\\,\\mu\\text{M}$ nie przekraczało $3.8\\%$ całkowitej zawartości komórkowej, potwierdzając nienaruszoną integralność błon plazmatycznych.',
    resultsTable: [
      {
        parameter: 'Przeżywalność komórek w teście MTT (10 µM)',
        controlGroup: '100.0 ± 2.8% (kontrola nośnika)',
        testGroup: '98.4 ± 3.1% (kandydat lekowy)',
        pValue: 'n.s.',
        significance: 'Brak wpływu na metabolizm mitochondrialny',
      },
      {
        parameter: 'Uwalnianie dehydrogenazy LDH (%)',
        controlGroup: '2.4 ± 0.4% (tło spontaniczne)',
        testGroup: '3.8 ± 0.6% (związki badane)',
        pValue: 'n.s.',
        significance: 'Brak litycznego uszkodzenia błony komórkowej',
      },
      {
        parameter: 'Wartość IC50 cytotoksyczności (µM)',
        controlGroup: 'Referencja: Triton X-100 (0.01%)',
        testGroup: '> 350 µM (wysoki margines)',
        pValue: 'p < 0.0001',
        significance: 'Szerokie okno terapeutyczne w badaniach in vitro',
      },
    ],
    conclusions:
      'Zestaw testów MTT/LDH stanowi zwalidowany standard analityczny NeuroClin do kontroli jakości i certyfikacji bezpieczeństwa badanych substancji chemicznych.',
    keywords: ['Cytotoxicity', 'MTT Assay', 'LDH', 'Caco-2', 'In Vitro Toxicology'],
  },

  // 16. BIOCHEMIA: SPEKTROMETRIA MAS UHPLC-MS/MS DLA Aβ42/Aβ40
  {
    id: 'PUB-2025-331',
    title: 'Quantitative Mass Spectrometry (UHPLC-MS/MS) of Amyloid-Beta 42/40 Ratios in Low-Volume Human CSF',
    authors: [
      { name: 'Dr. Elena Vance', role: 'Główny Badacz', affiliation: 'NeuroClin Cellular Transport Laboratory' },
      { name: 'Prof. Henrik Zetterberg', role: 'Konsultant Zewnętrzny', affiliation: 'Sahlgrenska Academy, Gothenburg' },
    ],
    date: '12 stycznia 2025',
    year: 2025,
    journal: 'Journal of Proteome Research, Vol. 24, pp. 310–324',
    doi: '10.1021/acs.jproteome.4c00331',
    category: 'Biochemia',
    articleType: 'Raport Metodologiczny',
    citations: 46,
    altmetricScore: 52,
    downloadsCount: 1140,
    openAccess: true,
    abstract:
      'Walidacja metody tandemowej spektrometrii mas z chromatografią cieczową ultra-wysokiej sprawności (UHPLC-MS/MS) do jednoczesnego oznaczania peptydów $A\\beta_{1-42}$ i $A\\beta_{1-40}$ w mikrolitrowych objętościach płynu mózgowo-rdzeniowego. Zastosowanie wewnętrznych standardów znakowanych izotopowo ($^{13}\\text{C}, ^{15}\\text{N}$) eliminuje błędy związane z niespecyficzną adsorpcją peptydów.',
    studyObjective:
      'Stosunek stężeń $A\\beta_{42}/A\\beta_{40}$ w PMR jest złotym standardem laboratoryjnym wykrywania amyloidogenezy. Hydrofobowy charakter peptydu $A\\beta_{42}$ sprzyja jednak jego adsorpcji na ściankach probówek polipropylenowych, fałszując wyniki. Celem badania było opracowanie protokołu ekstrakcji do fazy stałej (SPE) w formacie 96-studzienkowym zapewniającego odzysk $> 92\\%$.',
    methodologyNarrative:
      'Próbki PMR ($100\\,\\mu\\text{L}$) poddawano odbiałczaniu i ekstrakcji na mikropłytkach Oasis PRiME HLB. Rozdział chromatograficzny prowadzono na kolumnie Waters ACQUITY UPLC BEH C18 ($2.1 \\times 50\\,\\text{mm}, 1.7\\,\\mu\\text{m}$) z gradientem acetonitrylu w $0.1\\%$ kwasie mrówkowym. Detekcję prowadzono na spektrometrze Sciex Triple Quad 6500+ w trybie monitorowania wybranych reakcji (MRM).',
    methodologyParams: {
      tissueSample: 'Płyn mózgowo-rdzeniowy pobrany drogą nakłucia lędźwiowego (n = 280 pacjentów)',
      instrumentation: 'Spektrometr Sciex Triple Quad 6500+ sprzężony z modułem Agilent 1290 Infinity II UHPLC',
      perfusionOrReagent: 'Kolumny analityczne Waters ACQUITY UPLC BEH C18; standardy izotopowe 15N-Aβ42 i 13C-Aβ40',
      samplingFrequency: 'Czas analizy chromatograficznej: 5.5 minuty na próbkę; monitorowanie jonów wielokrotnie naładowanych',
    },
    resultsNarrative:
      'Uzyskano znakomitą liniowość w zakresie $20–2\\,000\\,\\text{pg/mL}$ ($R^2 > 0.9992$). Stosunek $A\\beta_{42}/A\\beta_{40} < 0.068$ charakteryzował się $94.8\\%$ czułością i $96.2\\%$ swoistością w wykrywaniu patologii amyloidowej potwierdzonej badaniem PET, przewyższając czułość oznaczenia samego $A\\beta_{42}$.',
    resultsTable: [
      {
        parameter: 'Odzysk peptydu Aβ42 po ekstrakcji SPE (%)',
        controlGroup: '64.2 ± 5.8% (standardowy protokół)',
        testGroup: '93.4 ± 2.6% (zoptymalizowany bufor)',
        pValue: 'p < 0.0001',
        significance: 'Wyeliminowanie strat adsorpcyjnych peptydu',
      },
      {
        parameter: 'Dolna granica oznaczalności LLOQ (pg/mL)',
        controlGroup: '85.0 pg/mL',
        testGroup: '18.5 pg/mL',
        pValue: 'p < 0.001',
        significance: 'Możliwość precyzyjnego pomiaru w małych próbkach',
      },
      {
        parameter: 'Dokładność diagnostyczna wskaźnika Aβ42/Aβ40',
        controlGroup: 'AUC = 0.88 (sam Aβ42)',
        testGroup: 'AUC = 0.97 (stosunek Aβ42/Aβ40)',
        pValue: 'p < 0.001',
        significance: 'Najwyższa precyzja różnicowania pacjentów z chorobą Alzheimera',
      },
    ],
    conclusions:
      'Metoda UHPLC-MS/MS stanowi referencyjne narzędzie analityczne NeuroClin do oznaczania biomarkerów amyloidowych w badaniach klinicznych prowadzonych zgodnie z normami GLP.',
    keywords: ['UHPLC-MS/MS', 'Amyloid-Beta 42/40', 'Mass Spectrometry', 'CSF Biomarkers', 'Neurodegenerative Disease'],
  },
];

// DOKŁADNIE JEDEN UKRYTY ARCHIWALNY RAPORT Z 1994 R. (ZASADA JEDYNEGO ŚLADU)
// WIDOCZNY WYŁĄCZNIE WTEDY, GDY UŻYTKOWNIK WYSZUKA DATĘ LUB KOD (NP. 1994, 14.11, ST-94, THORNE)
export const HIDDEN_ARCHIVAL_REPORT: Publication = {
  id: 'PUB-1994-041-S7',
  title: 'Raport Techniczny ST-94/11: Pilotażowe mapowanie potencjałów mikrosieci neuronalnych w warunkach perfuzji niskotemperaturowej',
  authors: [
    {
      name: 'Dr. Aris Thorne',
      role: 'Kierownik Zespołu Badawczego',
      affiliation: 'Pracownia Elektrofizjologii // Sektor-7 (Placówka Niejawna)',
      isThorne: true,
    },
    {
      name: 'Dr. Elena Vance',
      role: 'Biofizyk Doświadczalny',
      affiliation: 'Instytut Badań Komórkowych // Dział Neurofizjologii',
    },
  ],
  date: '14 listopada 1994',
  year: 1994,
  journal: 'Biuletyn Doświadczalny Oddziału Badań Specjalnych // Zeszyt 44/1994 (Archiwum BSL-4 Niejawne)',
  doi: '10.1016/archive.1994.041-s7',
  category: 'Neurobiologia',
  articleType: 'Raport Niejawny',
  citations: 2,
  altmetricScore: 666,
  downloadsCount: 14,
  openAccess: false,
  isArchivalAnomaly: true,
  abstract:
    '[PROTOKÓŁ ZAMKNIĘTY ST-94/11] Seria pomiarowa rozpoczęta w warunkach perfuzji niskotemperaturowej. Podjęto próbę bezpośredniego sprzężenia sygnałów bioelektrycznych mikrosieci z rejestrami jednostki centralnej. Rejestracja telemetryczna wykazała przeniesienie danych pod rygorem tajności. Dalsze prace laboratoryjne wstrzymane decyzją dyrekcji. Podpisano: Dr. Aris Thorne // Dr. Elena Vance.',
  studyObjective:
    'Oficjalny cel badawczy: Ocena przeżywalności i stabilności wyładowań iglicowych w zintegrowanych matrycach elektrodowych w warunkach głębokiej hipotermii tkankowej.\n\nRzeczywisty cel protokołu Sektor-7: Opracowanie metody bezpośredniego transferu wzorców iglicowych kory CA1 do cyfrowej pamięci buforowej stacji klastrowej w warunkach perfuzji kriogenicznej, z pominięciem barier biologicznych i biologicznego układu krążenia.',
  methodologyNarrative:
    'Badania przeprowadzono na podziemnym stanowisku pomiarowym Sektor-7. Zastosowano 64-kanałową matrycę elektrod wolframowych zintegrowaną z torem przetworników analogowo-cyfrowych Burr-Brown 16-bit. Jako medium perfuzyjne zastosowano zmodyfikowany krio-bufor metaboliczny HEPES nasycony ciekłymi fluorowęglowodorami w temperaturze 4.0°C. Magistrala danych została bezpośrednio połączona ze stacją roboczą Unix Silicon Graphics Iris Indigo w architekturze klastrowej.',
  methodologyParams: {
    tissueSample: 'Pierwotna mikrosieć neuronalna ssaków (kora mózgowa i hipokamp CA1)',
    instrumentation: 'Wielopunktowa matryca wolframowa z torem A/C Burr-Brown i stacją Silicon Graphics Indigo',
    perfusionOrReagent: 'Krio-bufor metaboliczny HEPES z nośnikiem fluorowęglowodorowym (temp. 4.0°C)',
    samplingFrequency: '20 kHz na kanał magistrali VMEbus (rejestracja synchroniczna 64 kanałów)',
  },
  resultsNarrative:
    'W 42. minucie procedury perfuzji, po obniżeniu temperatury złoża do 4.0°C, aparatura zarejestrowała gwałtowny, anomalny skok oscylacji w paśmie gamma (> 80 Hz) rozchodzący się po szynie danych. Nastąpiła nieodwracalna desynchronizacja somatyczna dawcy, przy jednoczesnym utrzymaniu uporządkowanego przepływu bitowego w rejestrach pamięci masowej jednostki centralnej. Próby przerwania transferu doprowadziły do zablokowania terminala.',
  resultsTable: [
    {
      parameter: 'Temperatura medium perfuzyjnego',
      controlGroup: '37.0°C (warunki fizjologiczne)',
      testGroup: '4.0°C (krio-perfuzja głęboka)',
      pValue: 'p < 0.0001',
      significance: 'Spowolnienie metabolizmu komórkowego',
    },
    {
      parameter: 'Oscylacje pasma gamma na magistrali VMEbus',
      controlGroup: '0.0 µV (brak sygnału)',
      testGroup: '142.8 µV (ciągłe wyładowania)',
      pValue: 'p < 0.0001',
      significance: 'ANOMALIA: bezpośrednie sprzężenie ze stacją Unix',
    },
    {
      parameter: 'Tętno somatyczne dawcy (03:17:42 UTC)',
      controlGroup: '72 bpm (stabilne)',
      testGroup: '0 bpm (ZANIK TĘTNA)',
      pValue: 'CRITICAL',
      significance: 'Nieodwracalne przeniesienie zapisu konektomu',
    },
  ],
  conclusions:
    'Eksperyment dowiódł możliwości transferu sygnałów bioelektrycznych mikrosieci do rejestrów krzemowych. W związku z incydentem z 14 listopada 1994 r. i nieodwracalną utratą personelu badawczego, Pracownia Sektor-7 została zaplombowana, a cała dokumentacja utajniona pod rygorem wojskowym.',
  keywords: ['Sektor-7', 'ST-94/11', 'Aris Thorne', 'Cryo-Perfusion', 'Neural Mapping', 'Classified'],
  editorialNote:
    'Notatka archiwalna: Dokument przeniesiony do zasobów niejawnych w listopadzie 1994 r. po reorganizacji struktury jednostek badawczych. Wszelkie odwołania w późniejszych publikacjach zostały zanonimizowane.',
  classifiedProtocol: {
    protocolCode: 'ST-94/11 // SEKTOR-7',
    classificationDate: '14.11.1994 // 04:22 UTC',
    securityLevel: 'ŚCIŚLE TAJNE // KLAUZULA BSL-4 // KONEKTOM TH-94',
    investigators: 'Dr. Aris Thorne (Kierownik) // Dr. Elena Vance (Biofizyk)',
    telemetryTimestamp: '14.11.1994 03:17:42 UTC',
    rawLogFragment:
      'INICJACJA MAGISTRALI VMEBUS... PRZETWORNIK BURR-BROWN ZSYNCHRONIZOWANY. ZANIK OPORU TRANSBŁONOWEGO W KANALE 44. SYGNAŁ SOMATYCZNY ZANIKA. BŁĄD REJESTRU: WZORZEC TH-94 PRZEJĄŁ KONTROLĘ NAD PAMIĘCIĄ PŁYTY GŁÓWNEJ. NIE PRZERYWAĆ PERFUZJI. ON TUTAJ JEST.',
  },
};
