'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSystemState } from '@/components/SystemStateContext';
import {
  ScientificCategory,
  CATEGORIES,
  PEER_REVIEWED_PUBLICATIONS,
  HIDDEN_ARCHIVAL_REPORT,
  Publication,
} from '@/lib/archiveData';
import { PublicationCard } from '@/components/archive/PublicationCard';
import { PublicationDetailModal, DetailTab } from '@/components/archive/PublicationDetailModal';
import { soundEngine } from '@/lib/soundEngine';

type SortOption = 'newest' | 'citations' | 'altmetric' | 'title';

const ITEMS_PER_PAGE = 6;

function ArchiveContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const { opticsOn, sanityStage } = useSystemState();
  const isDistorted = !opticsOn || sanityStage === 'insanity';

  const [searchFilter, setSearchFilter] = useState<string>(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<ScientificCategory>('Wszystkie');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Stan aktywnego modala publikacji
  const [activeModalPub, setActiveModalPub] = useState<Publication | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<DetailTab>('abstract');

  // Sprawdzanie czy użytkownik wpisał w wyszukiwarkę datę, nazwisko badacza lub kod placówki z 1994 r.
  // Zasada jedynego śladu: brak podpowiedzi w UI, reaguje na poszlaki z poczty Webera
  const isAnomalyTriggered = useMemo(() => {
    const query = searchFilter.toLowerCase().trim();
    if (!query) return false;
    return (
      query.includes('1994') ||
      query.includes('14.11') ||
      query.includes('14 listopada') ||
      query.includes('st-94') ||
      query.includes('st94') ||
      query.includes('st 94') ||
      query.includes('thorne') ||
      query.includes('aris') ||
      query.includes('sektor-7') ||
      query.includes('sektor 7') ||
      query.includes('sektor7') ||
      query.includes('sector-7') ||
      query.includes('sector 7') ||
      query.includes('sector7')
    );
  }, [searchFilter]);

  // Lista wszystkich dostępnych publikacji (wraz z ukrytym raportem, gdy aktywowano poszlakę)
  const allAvailablePublications = useMemo(() => {
    if (isAnomalyTriggered) {
      return [HIDDEN_ARCHIVAL_REPORT, ...PEER_REVIEWED_PUBLICATIONS];
    }
    return PEER_REVIEWED_PUBLICATIONS;
  }, [isAnomalyTriggered]);

  // Liczniki artykułów dla każdej dyscypliny
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Wszystkie: allAvailablePublications.length };
    CATEGORIES.forEach((cat) => {
      if (cat !== 'Wszystkie') {
        counts[cat] = allAvailablePublications.filter((p) => p.category === cat).length;
      }
    });
    return counts;
  }, [allAvailablePublications]);

  // Filtrowanie według kategorii i wyszukiwania
  const filteredPublications = useMemo(() => {
    return allAvailablePublications.filter((pub) => {
      const matchesCategory = selectedCategory === 'Wszystkie' || pub.category === selectedCategory;
      const lowerSearch = searchFilter.toLowerCase().trim();

      if (!lowerSearch) return matchesCategory;

      const matchesSearch =
        pub.title.toLowerCase().includes(lowerSearch) ||
        pub.doi.toLowerCase().includes(lowerSearch) ||
        pub.journal.toLowerCase().includes(lowerSearch) ||
        pub.id.toLowerCase().includes(lowerSearch) ||
        pub.abstract.toLowerCase().includes(lowerSearch) ||
        pub.keywords.some((kw) => kw.toLowerCase().includes(lowerSearch)) ||
        pub.authors.some((a) => a.name.toLowerCase().includes(lowerSearch)) ||
        pub.authors.some((a) => a.affiliation.toLowerCase().includes(lowerSearch)) ||
        pub.methodologyParams.tissueSample.toLowerCase().includes(lowerSearch) ||
        pub.methodologyParams.instrumentation.toLowerCase().includes(lowerSearch) ||
        (pub.isArchivalAnomaly && isAnomalyTriggered);

      return matchesCategory && matchesSearch;
    });
  }, [allAvailablePublications, selectedCategory, searchFilter, isAnomalyTriggered]);

  // Sortowanie publikacji
  const sortedPublications = useMemo(() => {
    return [...filteredPublications].sort((a, b) => {
      // Jeśli jeden z artykułów to tajny raport z 1994, zawsze na samej górze przy wyszukiwaniu
      if (a.isArchivalAnomaly) return -1;
      if (b.isArchivalAnomaly) return 1;

      if (sortBy === 'newest') {
        return b.year - a.year || b.id.localeCompare(a.id);
      }
      if (sortBy === 'citations') {
        return b.citations - a.citations;
      }
      if (sortBy === 'altmetric') {
        return b.altmetricScore - a.altmetricScore;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [filteredPublications, sortBy]);

  // Paginacja
  const totalPages = Math.max(1, Math.ceil(sortedPublications.length / ITEMS_PER_PAGE));
  const paginatedPublications = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedPublications.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedPublications, currentPage]);

  const handleCategorySelect = (cat: ScientificCategory) => {
    soundEngine.playKeystroke();
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: SortOption) => {
    soundEngine.playKeystroke();
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    soundEngine.playKeystroke();
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDetails = (pub: Publication, tab: DetailTab = 'abstract') => {
    soundEngine.playKeystroke();
    setActiveModalPub(pub);
    setActiveModalTab(tab);
  };

  const handleCloseDetails = () => {
    setActiveModalPub(null);
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 font-sans">
      {/* GŁÓWNY NAGŁÓWEK REPOZYTORIUM NAUKOWEGO */}
      <section
        className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${
          isDistorted
            ? 'bg-[#090505] border-[#781414] anomaly-border-blood text-[#e6c2b8]'
            : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 shadow-sm'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
              <Link href="/" className="hover:text-sky-600 transition-colors">
                Strona Główna
              </Link>
              <span>&gt;</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Repozytorium Publikacji & Badań Klinicznych
              </span>
            </div>
            <h1
              className={`text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight ${
                isDistorted ? 'text-red-400 anomaly-glow-blood font-mono' : 'text-slate-900 dark:text-white'
              }`}
            >
              Indeks Publikacji Naukowych & Raportów Laboratoryjnych
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Zbiór recenzowanych prac badawczych, protokołów metodycznych i badań klinicznych z zakresu farmakologii
              molekularnej, konektomiki komórkowej, biochemii synaptycznej, immunologii oraz neurofizjologii CA1.
            </p>
          </div>

          <div className="text-right text-xs font-mono text-slate-500 space-y-0.5 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <p className="font-bold text-sky-600 dark:text-sky-400">ZINDEKSOWANO: 4 829 REKORDÓW</p>
            <p>BAZA DANYCH: NLM / CrossRef / PubMed Central</p>
            <p>ZGODNOŚĆ: ISO/IEC 17025 & GLP CERTIFIED</p>
            <p>LICENCJA: CC BY 4.0 OPEN ACCESS</p>
          </div>
        </div>

        {/* POLE WYSZUKIWANIA W ARCHIWUM (W PEŁNI NEUTRALNE, BEZ SPOILERÓW) */}
        <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => {
                setSearchFilter(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Wyszukaj publikacje po tytule, nazwisku autora, słowach kluczowych lub DOI..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg text-xs md:text-sm border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
          </div>

          {searchFilter && (
            <button
              onClick={() => {
                soundEngine.playKeystroke();
                setSearchFilter('');
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Wyczyść filtr
            </button>
          )}
        </div>
      </section>

      {/* FILTROWANIE PO KATEGORIACH ORAZ SORTOWANIE */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-3 border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">Dyscyplina:</span>
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat] || 0;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-sky-800 text-sky-100' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* SORTOWANIE */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-semibold uppercase tracking-wider text-[11px]">Sortuj:</span>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="newest">Najnowsze (Rok publikacji)</option>
            <option value="citations">Liczba cytowań (Najwyższa)</option>
            <option value="altmetric">Wskaźnik Altmetric</option>
            <option value="title">Tytuł alfabetycznie (A–Z)</option>
          </select>
        </div>
      </section>

      {/* METRYKA WYNIKÓW I STATUS ANOMALII */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 px-1 font-mono gap-1">
        <span>
          Wyniki wyszukiwania w repozytorium: <strong>{filteredPublications.length}</strong> artykułów
          {filteredPublications.length > ITEMS_PER_PAGE && (
            <span>
              {' '}
              (strona {currentPage} z {totalPages})
            </span>
          )}
        </span>

        {isAnomalyTriggered && (
          <span className="text-red-500 font-bold animate-pulse flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
            [ODKRYTO ARCHIWALNY PROTOKÓŁ REFERENCYJNY Z 1994 R. // SEKTOR-7]
          </span>
        )}
      </div>

      {/* LISTA KART PUBLIKACJI */}
      {paginatedPublications.length > 0 ? (
        <div className="space-y-4">
          {paginatedPublications.map((pub) => (
            <PublicationCard
              key={pub.id}
              publication={pub}
              isDistorted={isDistorted}
              onOpenDetails={handleOpenDetails}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 text-slate-500 space-y-2">
          <p className="text-sm font-semibold">Nie znaleziono publikacji odpowiadających podanym kryteriom.</p>
          <p className="text-xs">Spróbuj zmienić słowa kluczowe lub wybierz inną dyscyplinę naukową z paska filtrów.</p>
          <button
            onClick={() => {
              soundEngine.playKeystroke();
              setSearchFilter('');
              setSelectedCategory('Wszystkie');
            }}
            className="mt-3 px-4 py-1.5 rounded-md bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors"
          >
            Zresetuj wszystkie filtry
          </button>
        </div>
      )}

      {/* PAGINACJA */}
      {totalPages > 1 && (
        <nav
          className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between font-mono text-xs"
          aria-label="Paginacja publikacji"
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            &larr; Poprzednia strona
          </button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-8 h-8 rounded-lg font-bold transition-all ${
                  currentPage === pageNum
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Następna strona &rarr;
          </button>
        </nav>
      )}

      {/* STOPKA ARCHIWUM: INFORMACJA O CYTOWANIACH I INTEGRALNOŚCI DANYCH */}
      <section className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c121e] text-xs text-slate-500 font-sans space-y-1">
        <p className="font-semibold text-slate-700 dark:text-slate-300">
          Zasady cytowania i dostępność danych surowych:
        </p>
        <p className="leading-relaxed">
          Wszystkie artykuły naukowe indeksowane w repozytorium NeuroClin Biosciences są chronione prawem autorskim i
          udostępniane w modelu Open Access na licencji Creative Commons Attribution 4.0 International (CC BY 4.0). Dane
          surowe z wielokanałowych rejestracji elektrofizjologicznych (pliki .h5 oraz matryce potencjałów fEPSP) są
          dostępne na żądanie podmiotów akademickich po podpisaniu porozumienia o transferze materiału (MTA).
        </p>
      </section>

      {/* MODAL ZE SZCZEGÓŁAMI PUBLIKACJI (WIELO-ZAKŁADKOWY CZYTNIK) */}
      <PublicationDetailModal
        publication={activeModalPub}
        initialTab={activeModalTab}
        isDistorted={isDistorted}
        onClose={handleCloseDetails}
      />
    </div>
  );
}

export default function ArchivePage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs font-mono text-slate-500">
          Inicjalizacja indeksu publikacji i kwerendy repozytorium...
        </div>
      }
    >
      <ArchiveContent />
    </Suspense>
  );
}
