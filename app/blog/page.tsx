'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSystemState } from '@/components/SystemStateContext';
import { soundEngine } from '@/lib/soundEngine';

interface BlogPost {
  id: string;
  title: string;
  category: 'Akredytacja' | 'Aparatura & Metodyka' | 'Farmacja & Biochemia' | 'Wydarzenia Branżowe' | 'Historia Ośrodka';
  date: string;
  readTime: string;
  author: string;
  summary: string;
  content: string[];
  tags: string[];
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Polskie Centrum Akredytacji odnawia certyfikację ISO/IEC 17025 dla działu spektrometrii mas NeuroClin',
    category: 'Akredytacja',
    date: '14 września 2026',
    readTime: '3 min czytania',
    author: 'Dział Zapewnienia Jakości & Nadzoru GLP',
    summary:
      'Zakończono pomyślnie coroczny audyt jednostki bioanalitycznej. Zakres akredytacji rozszerzono o ilościowe oznaczanie peptydów sygnaturowych oraz zanieczyszczeń nitrozaminowych w substancjach czynnych (API).',
    content: [
      'Z satysfakcją informujemy, że nasza jednostka analityczna w Cambridge pomyślnie przeszła cykliczny audyt nadzorczy zgodności z normą PN-EN ISO/IEC 17025:2018-02.',
      'Audytorzy zewnętrzni potwierdzili najwyższą precyzję procedur pomiarowych realizowanych na tandemowych spektrometrach mas (UHPLC-MS/MS) oraz pełną integralność elektronicznych śladów audytowych w systemie BioResearcher Analytics.',
      'Wprowadzona certyfikacja obejmuje również zaktualizowane procedury walidacyjne zgodne z wytycznymi ICH M10 (Bioanalytical Method Validation), umożliwiając naszym partnerom bezpośrednie przedkładanie raportów do Europejskiej Agencji Leków (EMA) oraz amerykańskiej FDA.',
    ],
    tags: ['ISO 17025', 'GLP', 'Walidacja', 'Spektrometria Mas'],
  },
  {
    id: 'post-2',
    title: 'Inwestycje aparaturowe: Nowe systemy UHPLC-MS/MS potrajają przepustowość analiz farmakokinetycznych',
    category: 'Aparatura & Metodyka',
    date: '02 września 2026',
    readTime: '4 min czytania',
    author: 'Zespół Chromatografii Cieczowej',
    summary:
      'Instalacja dwóch nowoczesnych zestawów Sciex Triple Quad 6500+ z automatycznymi podajnikami próbek pozwala na jednoczesne profilowanie do 600 próbek biologicznych na dobę.',
    content: [
      'W odpowiedzi na rosnące zapotrzebowanie ze strony firm biofarmaceutycznych prowadzących wczesne fazy badań klinicznych, NeuroClin Biosciences zainwestował w rozbudowę parku maszynowego.',
      'Nowe zestawy tandemowej spektrometrii mas zintegrowane z ultrawysokociśnieniową chromatografią cieczową (UHPLC) charakteryzują się wyjątkowo niskim limitem detekcji (LOD < 0.05 ng/mL) przy skróconym czasie retencji poniżej 3 minut na próbkę.',
      'Zwiększona przepustowość pozwala skrócić standardowy czas dostarczenia raportu analitycznego z 10 do 4 dni roboczych, zachowując pełną zgodność ze standardami Dobrej Praktyki Laboratoryjnej.',
    ],
    tags: ['UHPLC', 'Triple Quad', 'Farmakokinetyka', 'Inwestycje'],
  },
  {
    id: 'post-3',
    title: 'Modelowanie nieliniowej kinetyki Michaelisa-Menten w wieloskładnikowych układach enzymatycznych',
    category: 'Farmacja & Biochemia',
    date: '25 sierpnia 2026',
    readTime: '6 min czytania',
    author: 'Dr. Marcus H. Weber, Zespół Biochemii Translacyjnej',
    summary:
      'Artykuł metodyczny: Jak poprawnie estymować stałe $V_{max}$ oraz $K_m$ przy równoczesnym występowaniu hamowania kompetycyjnego i allosterycznego w testach przesiewowych in vitro.',
    content: [
      'Wielocząsteczkowe kaskady enzymatyczne w badaniach nad lekami często wykazują odchylenia od klasycznego modelu Michaelisa-Menten na skutek zjawisk kooperatywności substratowej oraz zmian konformacyjnych enzymu.',
      'W artykule przedstawiamy metodykę regresji nieliniowej zaimplementowaną w naszym module analitycznym BioResearcher AI, która eliminuje błędy związane z linearyzacją Lineweavera-Burka.',
      'Wdrożenie formalizmu z wagami wariancyjnymi pozwala na rzetelne wyznaczanie stałych inhibicji ($K_i$) nawet w obecności śladowych zanieczyszczeń matrycy białkowej.',
    ],
    tags: ['Kinetyka Enzymatyczna', 'Michaelis-Menten', 'Regresja', 'Inhibitory'],
  },
  {
    id: 'post-4',
    title: 'Reprezentacja NeuroClin Biosciences na Europejskim Kongresie Chemii Analitycznej 2026 w Bazylei',
    category: 'Wydarzenia Branżowe',
    date: '12 sierpnia 2026',
    readTime: '3 min czytania',
    author: 'Dział Relacji Naukowych',
    summary:
      'Nasi analitycy zaprezentują trzy plakaty naukowe poświęcone ultra-czułemu oznaczaniu biomarkerów białkowych metodą pojedynczych cząsteczek (Simoa) oraz automatyzacji transferu danych LIMS.',
    content: [
      'W dniach 18–21 października 2026 r. delegacja badawcza NeuroClin weźmie udział w 14th European Conference on Analytical Chemistry w Bazylei.',
      'Głównym tematem wystąpienia naszego zespołu będzie standaryzacja procedur pre-analitycznych dla próbek osocza oraz wpływ cykli zamrażania-rozmrażania na stabilność epitopów białkowych.',
      'Zapraszamy wszystkich partnerów akademickich i przemysłowych do odwiedzenia naszego stoiska B-14 w strefie Contract Research Organizations.',
    ],
    tags: ['Konferencja', 'Bazylea', 'Simoa', 'Pre-analityka'],
  },
  {
    id: 'post-5',
    title: '30 lat tradycji analitycznej (1996–2026): Od klasycznej chromatografii kolumnowej do platform multi-omicznych',
    category: 'Historia Ośrodka',
    date: '10 lipca 2026',
    readTime: '5 min czytania',
    author: 'Zarząd NeuroClin Biosciences Inc.',
    summary:
      'Trzy dekady ciągłego doskonalenia metod pomiarowych. Retrospekcja rozwoju infrastruktury laboratoryjnej i ewolucji standardów jakościowych w badaniach nauk o życiu.',
    content: [
      'W 1996 roku powołano pierwsze zintegrowane laboratorium bioanalityczne, które dało początek dzisiejszemu NeuroClin Biosciences. Zaczynając od pojedynczego zestawu HPLC z detekcją UV, stopniowo budowaliśmy kompetencje w obszarze zaawansowanej chemii analitycznej.',
      'Przez ostatnie trzydzieści lat byliśmy świadkami transformacji całego sektora biotechnologicznego: przejścia od metod manualnych do w pełni zautomatyzowanych robotów pipetujących, cyfryzacji procedur i powstania zaawansowanych paneli multi-omicznych.',
      'Dziękujemy naszym klientom, partnerom klinicznym i pracownikom za zaufanie, dzięki któremu wspólnie kształtujemy bezpieczną i precyzyjną przyszłość terapii biologicznych.',
    ],
    tags: ['Jubileusz', 'Historia', 'R&D', 'Ewolucja Metod'],
  },
];

export default function BlogPage() {
  const { opticsOn, sanityStage } = useSystemState();
  const isDistorted = !opticsOn || sanityStage === 'insanity';

  const [selectedCategory, setSelectedCategory] = useState<string>('Wszystkie');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const categories = [
    'Wszystkie',
    'Akredytacja',
    'Aparatura & Metodyka',
    'Farmacja & Biochemia',
    'Wydarzenia Branżowe',
    'Historia Ośrodka',
  ];

  const filteredPosts = BLOG_POSTS.filter(
    (post) => selectedCategory === 'Wszystkie' || post.category === selectedCategory
  );

  return (
    <div className="flex-1 flex flex-col space-y-8 font-sans">
      {/* NAGŁÓWEK BLOGA */}
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
            <span className="font-semibold text-slate-700 dark:text-slate-300">Aktualności & Komunikaty</span>
          </div>

          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span>NEUROCLIN BIOSCIENCES // BIULETYN INFORMACYJNY & KOMUNIKATY</span>
          </div>

          <h1
            className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${
              isDistorted ? 'text-red-400 font-mono anomaly-glow-blood' : 'text-slate-900 dark:text-white'
            }`}
          >
            Aktualności Laboratoryjne, Akredytacje & Publikacje Metodyczne
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Oficjalny biuletyn korporacyjny NeuroClin Biosciences. Publikujemy informacje o postępach audytowych,
            nowych wdrożeniach aparaturowych, recenzowanych opracowaniach metodycznych oraz wydarzeniach naukowych.
          </p>
        </div>
      </section>

      {/* PASEK FILTROWANIA KATEGORII */}
      <section className="flex flex-wrap items-center gap-2 border-b pb-4 border-slate-200 dark:border-slate-800">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">Dział Informacji:</span>
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

      {/* LISTA WPISÓW BLOGOWYCH */}
      <section className="space-y-5">
        {filteredPosts.map((post) => {
          const isExpanded = expandedPostId === post.id;
          return (
            <article
              key={post.id}
              className={`p-6 rounded-xl border transition-all duration-200 ${
                isDistorted
                  ? 'bg-[#090505] border-[#781414]/70 text-[#d8cfbe]'
                  : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                    {post.category}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{post.date}</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">{post.readTime}</span>
              </div>

              <h2
                className={`text-lg sm:text-xl font-bold tracking-tight mb-2 ${
                  isDistorted ? 'text-red-300 font-mono' : 'text-slate-900 dark:text-white'
                }`}
              >
                {post.title}
              </h2>

              <p className="text-xs font-mono text-slate-500 mb-3">Autor: {post.author}</p>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                {post.summary}
              </p>

              {isExpanded && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans animate-fadeIn">
                  {post.content.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              )}

              <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => {
                    soundEngine.playKeystroke();
                    setExpandedPostId(isExpanded ? null : post.id);
                  }}
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 flex items-center space-x-1"
                >
                  <span>{isExpanded ? 'Zwiń treść' : 'Czytaj pełny artykuł'}</span>
                  <span>{isExpanded ? '↑' : '→'}</span>
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
