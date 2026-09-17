'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSystemState } from '@/components/SystemStateContext';
import { soundEngine } from '@/lib/soundEngine';

interface BlogPost {
  id: string;
  title: string;
  category: 'Klinika' | 'Technologia' | 'Aparatura' | 'Historia Bio-Tech';
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
    title: 'Nowa era w diagnostyce demencji: Osoczowe biomarkery p-tau217 rewolucjonizują wczesny screening',
    category: 'Klinika',
    date: '14 września 2026',
    readTime: '4 min czytania',
    author: 'Dr. Marcus H. Weber, Zespół Neurobiologii Translacyjnej',
    summary:
      'Wieloośrodkowe badania kliniczne potwierdzają, że pomiar stężenia fosforylowanego białka tau (p-tau217) we frakcjach egzosomalnych osiąga ponad 95% korelacji z badaniami PET u pacjentów w stadium przedklinicznym.',
    content: [
      'Wczesne wykrywanie patologii neurozwyrodnieniowych przez lata opierało się na kosztownych badaniach neuroobrazowych PET oraz inwazyjnej punkcji lędźwiowej.',
      'Wprowadzenie czułych testów opartych na immuno-oznaczaniu p-tau217 w połączeniu z izolacją pęcherzyków zewnątrzkomórkowych (egzosomów) pozwala na identyfikację procesu chorobowego nawet na 15 lat przed wystąpieniem pierwszych ubytków pamięciowych.',
      'Nasze laboratorium w Cambridge wdrożyło zwalidowany panel diagnostyczny, który w połączeniu z profilowaniem cytokin neurozapalnych (szlak TREM2) pozwala precyzyjnie kwalifikować pacjentów do terapii przeciwciałami monoklonalnymi.',
    ],
    tags: ['p-tau217', 'Biomarkery', 'Alzheimer', 'Egzosomy'],
  },
  {
    id: 'post-2',
    title: 'NeuroClin instaluje 64-węzłowy klaster bio-krzemowy do symulacji konektomu w czasie rzeczywistym',
    category: 'Technologia',
    date: '02 września 2026',
    readTime: '5 min czytania',
    author: 'Dział Inżynierii Systemów Biomedycznych',
    summary:
      'Nowy węzeł obliczeniowy integruje dedykowane tablice FPGA o taktowaniu nanosekundowym z modelem kinetyki 16 384 mikrosond, emulując lokalne potencjały polowe warstwy CA1 hipokampa.',
    content: [
      'Złożoność obliczeniowa symulacji sieci neuronalnych in silico od dawna napotykała na barierę opóźnień pamięciowych w architekturach von Neumanna.',
      'Nowy system zainstalowany w Sektorze C łączy bezpośrednie rejestry plastyczności synaptycznej ze sprzętową akceleracją równań Nernsta i Goldmana-Hodgkina-Katza.',
      'Architektura ta bazuje na pionierskich rozwiązaniach magistrali VMEbus testowanych w naszych laboratoriach od wczesnych lat 90., zapewniając stabilność emulacji rytmu theta (4–8 Hz) bez biologicznego zmęczenia tkanki.',
    ],
    tags: ['Bio-Computing', 'FPGA', 'Konektom', 'CA1'],
  },
  {
    id: 'post-3',
    title: 'Mechanizmy działania inhibitorów AChE a ochrona przed ekscytotoksycznością glutaminianową',
    category: 'Klinika',
    date: '25 sierpnia 2026',
    readTime: '6 min czytania',
    author: 'Dr. Elena Vance, Instytut Neurobiologii',
    summary:
      'Przegląd mechanistyczny: Dlaczego równoległe stosowanie donepezilu i memantyny wykazuje synergizm farmakodynamiczny w stabilizacji potencjału spoczynkowego neuronów piramidowych.',
    content: [
      'Deficyt przekaźnictwa cholinergicznego w hipokampie koreluje bezpośrednio z utratą kolców dendrytycznych w obszarze CA1.',
      'Inhibitory acetylocholinoesterazy zwiększają dostępność acetylocholiny w szczelinie synaptycznej, co ułatwia generowanie długotrwałego wzmocnienia synaptycznego (LTP).',
      'Jednocześnie niekompetycyjny antagonista receptora NMDA, memantyna, zapobiega patologicznemu napływowi jonów wapnia w stanach spoczynku, chroniąc mitochondria komórkowe przed zapaścią elektrochemiczną.',
    ],
    tags: ['AChE', 'NMDA', 'Donepezil', 'Memantyna'],
  },
  {
    id: 'post-4',
    title: 'Nowa generacja mikromacierzy krzemowych HD-MEA zintegrowana z hodowlami organoidów mózgowych',
    category: 'Aparatura',
    date: '18 sierpnia 2026',
    readTime: '3 min czytania',
    author: 'Dr. Sarah Lin, Dział Mikroelektroniki',
    summary:
      'Zmniejszenie średnicy sond platynowych do 1.2 µm pozwala na bezpośrednie rejestrowanie potencjałów czynnościowych w głębokich warstwach sferoidów neuronalnych 3D.',
    content: [
      'Hodowle organoidów mózgowych iPSC wykazują zaskakująco wysoki stopień samoorganizacji, jednak monitorowanie ich aktywności bioelektrycznej wewnątrz sferoidu stanowiło wyzwanie inżynieryjne.',
      'Nasza najnowsza matryca o gęstości 16 384 punktów pomiarowych umożliwia bezinwazyjny wgląd w propagację potencjałów iglicowych bez uszkadzania błony komórkowej.',
      'Układ ten został poddany walidacji w warunkach ciągłej perfuzji krio-ochronnej, otwierając drogę do długoterminowych rejestracji stabilności engramów.',
    ],
    tags: ['HD-MEA', 'Mikroelektrody', 'Organoidy'],
  },
  {
    id: 'post-5',
    title: '30-lecie wdrożenia pierwszych wielkoskalowych biosieci hodowlanych w NeuroClin (1994–2024)',
    category: 'Historia Bio-Tech',
    date: '10 lipca 2026',
    readTime: '7 min czytania',
    author: 'Archiwum Korporacyjne NeuroClin Biosciences',
    summary:
      'Wspomnienie przełomowych eksperymentów zespołu Sektor-7 pod kierownictwem dr. Arisa Thorne’a i dr Eleny Vance, które zdefiniowały współczesną bioelektronikę krzemową.',
    content: [
      'W listopadzie 1994 roku w podziemnym skrzydle badawczym Sektor-7 przeprowadzono serię bezprecedensowych eksperymentów nad bezpośrednią fiksacją potencjałów błonowych tkanki ludzkiej na podłożu półprzewodnikowym.',
      'Chociaż część szczegółowych protokołów stereotaktycznych została wówczas wycofana z jawnego obiegu na mocy ówczesnych regulacji obronnych, to właśnie tamte odkrycia legły u podstaw architektury BioResearcher AI.',
      'Dzisiejsza technologia hodowli organoidów korowych oraz macierzy mikroelektrodowych jest bezpośrednią kontynuacją tamtej pionierskiej wizji połączenia biologii komórkowej z nieprzemijającą precyzją krzemu.',
    ],
    tags: ['Sektor-7', 'Aris Thorne', 'Historia', '1994'],
  },
];

export default function BlogPage() {
  const { opticsOn, sanityStage } = useSystemState();
  const isDistorted = !opticsOn || sanityStage === 'insanity';

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  const categories = ['All', 'Klinika', 'Technologia', 'Aparatura', 'Historia Bio-Tech'];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    return selectedCategory === 'All' || post.category === selectedCategory;
  });

  return (
    <div className="flex-1 flex flex-col space-y-6 font-sans">
      {/* HEADER BLOGA */}
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
              <span className="font-semibold text-slate-700 dark:text-slate-300">Aktualności & Komunikaty</span>
            </div>
            <h1
              className={`text-xl md:text-2xl font-extrabold tracking-tight ${
                isDistorted ? 'text-red-400 font-mono anomaly-glow-blood' : 'text-slate-900 dark:text-white'
              }`}
            >
              NEUROCLIN INSIGHTS // AKTUALNOŚCI ZE ŚWIATA BIOTECHNOLOGII
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-sans">
              Przegląd najnowszych badań, raportów z pracowni neurobiologii translacyjnej i historii bioinżynierii.
            </p>
          </div>

          <div className="text-right text-xs font-mono text-slate-500">
            <p className="font-bold text-sky-600 dark:text-sky-400">DZIAŁ INFORMACJI NAUKOWEJ</p>
            <p>Aktualizacja: Wrzesień 2026</p>
          </div>
        </div>

        {/* KATEGORIE BLOGA */}
        <div className="pt-4 flex items-center gap-1.5 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundEngine.playKeystroke();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? isDistorted
                    ? 'bg-red-900 text-white border border-red-700'
                    : 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'All' ? 'Wszystkie Aktualności' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* SIATKA ARTYKUŁÓW */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className={`p-5 rounded-xl border flex flex-col justify-between transition-all duration-200 hover:shadow-md ${
              isDistorted
                ? 'bg-[#090505] border-[#781414]/70 hover:border-red-600'
                : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 hover:border-sky-400 shadow-sm'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                  {post.category}
                </span>
                <span className="text-slate-400">{post.readTime}</span>
              </div>

              <h2
                className={`text-base font-bold leading-snug tracking-tight ${
                  isDistorted ? 'text-red-300 font-mono anomaly-glow-blood' : 'text-slate-900 dark:text-white'
                }`}
              >
                {post.title}
              </h2>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {post.summary}
              </p>

              <div className="flex flex-wrap gap-1 pt-1">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-500"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="text-[11px] text-slate-500">
                <p className="font-semibold text-slate-700 dark:text-slate-300 line-clamp-1">{post.author}</p>
                <p className="font-mono text-[10px]">{post.date}</p>
              </div>

              <button
                onClick={() => {
                  soundEngine.playKeystroke();
                  setActivePost(post);
                }}
                className="px-3 py-1.5 rounded bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800 hover:bg-sky-100 font-semibold transition-colors"
              >
                Czytaj artykuł &rarr;
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* MODAL CZYTANIA PEŁNEGO ARTYKUŁU */}
      {activePost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                  {activePost.category}
                </span>
                <span className="text-xs font-mono text-slate-400">{activePost.date}</span>
              </div>
              <button
                onClick={() => setActivePost(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <h2 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {activePost.title}
            </h2>

            <div className="text-xs text-slate-500 font-mono pb-2 border-b border-slate-100 dark:border-slate-800">
              Autor: {activePost.author} // Czas lektury: {activePost.readTime}
            </div>

            <div className="space-y-3 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {activePost.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex flex-wrap gap-1.5">
                {activePost.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[10px] text-slate-600 dark:text-slate-400">
                    #{t}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setActivePost(null)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md transition-colors"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
