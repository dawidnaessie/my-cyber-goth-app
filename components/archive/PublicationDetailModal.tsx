'use client';

import React, { useState, useEffect } from 'react';
import { Publication } from '@/lib/archiveData';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { ScientistPortrait } from '@/components/ScientistPortrait';
import { soundEngine } from '@/lib/soundEngine';

export type DetailTab = 'abstract' | 'methodology' | 'results' | 'conclusions' | 'cite';

interface PublicationDetailModalProps {
  publication: Publication | null;
  initialTab?: DetailTab;
  isDistorted: boolean;
  onClose: () => void;
}

export function PublicationDetailModal({
  publication,
  initialTab = 'abstract',
  isDistorted,
  onClose,
}: PublicationDetailModalProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>(initialTab);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, publication]);

  // Obsługa klawisza Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundEngine.playKeystroke();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!publication) return null;

  const isArchival = publication.isArchivalAnomaly;

  const handleTabClick = (tab: DetailTab) => {
    soundEngine.playKeystroke();
    setActiveTab(tab);
  };

  const handleCopyCitation = (format: 'bibtex' | 'apa' | 'ris') => {
    soundEngine.playKeystroke();
    const firstAuthor = publication.authors[0]?.name || 'NeuroClin Research';
    const authorList = publication.authors.map((a) => a.name).join(', ');

    let citationText = '';
    if (format === 'apa') {
      citationText = `${authorList} (${publication.year}). ${publication.title}. ${publication.journal}. https://doi.org/${publication.doi}`;
    } else if (format === 'ris') {
      citationText = `TY  - JOUR
TI  - ${publication.title}
${publication.authors.map((a) => `AU  - ${a.name}`).join('\n')}
JO  - ${publication.journal.split(',')[0]}
PY  - ${publication.year}
DO  - ${publication.doi}
ER  - `;
    } else {
      const firstAuthorLastName = firstAuthor.split(' ').pop() || 'NeuroClin';
      citationText = `@article{${firstAuthorLastName.toLowerCase()}${publication.year}_${publication.id.replace(/[^a-zA-Z0-9]/g, '')},
  author = {${publication.authors.map((a) => a.name).join(' and ')}},
  title = {{${publication.title}}},
  journal = {${publication.journal.split(',')[0]}},
  year = {${publication.year}},
  doi = {${publication.doi}},
  publisher = {NeuroClin Biosciences Academic Press}
}`;
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(citationText).then(() => {
        setCopiedFormat(format);
        setTimeout(() => setCopiedFormat(null), 2500);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div
        className={`relative w-full max-w-4xl rounded-2xl border shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto transition-all ${
          isArchival
            ? 'bg-[#0b0505] border-red-800/90 text-[#f5dcd7] shadow-red-950/60'
            : isDistorted
            ? 'bg-[#090505] border-[#781414] text-[#ebd4ce]'
            : 'bg-white dark:bg-[#101726] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* BELKA GÓRNA MODALA */}
        <div
          className={`p-4 sm:p-5 border-b flex items-start justify-between gap-3 ${
            isArchival
              ? 'bg-[#180808] border-red-900/80'
              : 'bg-slate-50 dark:bg-[#0c121e] border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="space-y-1.5 flex-1 pr-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span
                className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                  isArchival
                    ? 'bg-red-950 text-red-300 border border-red-800'
                    : 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                }`}
              >
                {publication.category}
              </span>
              <span className="text-slate-500">{publication.id}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">{publication.date}</span>
              <span className="text-slate-400">•</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {publication.openAccess ? 'Otwarte Repozytorium (CC BY 4.0)' : 'Dostęp Ograniczony (BSL-4)'}
              </span>
            </div>

            <h2
              className={`text-lg sm:text-xl font-extrabold tracking-tight leading-snug ${
                isArchival
                  ? 'text-red-300 font-mono anomaly-glow-blood'
                  : isDistorted
                  ? 'text-red-300 font-mono'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {publication.title}
            </h2>

            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
              DOI: <span className="underline">{publication.doi}</span> // Źródło: {publication.journal}
            </p>
          </div>

          <button
            onClick={() => {
              soundEngine.playKeystroke();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Zamknij podgląd publikacji (Esc)"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ANOMALNY BANER DLA ARCHIWALNEGO RAPORTU Z 1994 R. */}
        {isArchival && (
          <div className="p-3 bg-red-950/60 border-b border-red-800 text-red-300 text-xs font-mono flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
              KLAUZULA ARCHIWALNA // STATUS: TRWALE ZREDAGOWANO PRZEZ ZARZĄD
            </span>
            <span>PROTOKÓŁ: ST-94/11 // SEKTOR-7</span>
          </div>
        )}

        {/* ZAKŁADKI NAWIGACYJNE W ŚRODKU ARTYKUŁU */}
        <div
          className={`flex items-center space-x-1 px-4 sm:px-6 pt-3 border-b overflow-x-auto text-xs font-semibold ${
            isArchival
              ? 'border-red-900/60 bg-[#120606]'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101726]'
          }`}
        >
          <button
            onClick={() => handleTabClick('abstract')}
            className={`pb-2.5 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'abstract'
                ? isArchival
                  ? 'border-red-500 text-red-400'
                  : 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            1. Abstrakt & Wprowadzenie
          </button>

          <button
            onClick={() => handleTabClick('methodology')}
            className={`pb-2.5 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'methodology'
                ? isArchival
                  ? 'border-red-500 text-red-400'
                  : 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            2. Metodologia Doświadczalna
          </button>

          <button
            onClick={() => handleTabClick('results')}
            className={`pb-2.5 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'results'
                ? isArchival
                  ? 'border-red-500 text-red-400'
                  : 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            3. Wyniki & Tabela Analityczna
          </button>

          <button
            onClick={() => handleTabClick('conclusions')}
            className={`pb-2.5 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'conclusions'
                ? isArchival
                  ? 'border-red-500 text-red-400'
                  : 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            4. Wnioski & Translacja
          </button>

          <button
            onClick={() => handleTabClick('cite')}
            className={`pb-2.5 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'cite'
                ? isArchival
                  ? 'border-red-500 text-red-400'
                  : 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            5. Cytowanie & Eksport
          </button>
        </div>

        {/* TREŚĆ WYBRANEJ ZAKŁADKI (Z MOŻLIWOŚCIĄ PRZEWIJANIA) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm leading-relaxed font-sans flex-1">
          {/* ZAKŁADKA 1: ABSTRAKT & WPROWADZENIE */}
          {activeTab === 'abstract' && (
            <div className="space-y-6">
              {/* AFILIACJE AUTORÓW */}
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-mono">
                  Autorzy i Jednostki Badawcze:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {publication.authors.map((author) => (
                    <div key={author.name} className="flex flex-col">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {author.name}{' '}
                        <span className="text-[11px] font-normal text-slate-500">({author.role})</span>
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">{author.affiliation}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ABSTRAKT AKADEMICKI */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 font-mono mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                  Abstrakt Badawczy (Executive Abstract):
                </h3>

                {isArchival ? (
                  <div className="space-y-3 font-mono text-xs text-slate-200 bg-black/70 p-4 rounded-lg border border-red-900/80 leading-relaxed">
                    <p>
                      [PROTOKÓŁ ZAMKNIĘTY ST-94/11] Seria pomiarowa rozpoczęta w warunkach perfuzji niskotemperaturowej.{' '}
                      <span className="bg-black text-black select-none pointer-events-none px-3 py-0.5 rounded-none inline-block border border-black">
                        ████████████████████████████████████████
                      </span>{' '}
                      podjęto próbę bezpośredniego sprzężenia sygnałów bioelektrycznych mikrosieci{' '}
                      <span className="bg-black text-black select-none pointer-events-none px-4 py-0.5 rounded-none inline-block border border-black">
                        ████████████████████████████████████████████████
                      </span>{' '}
                      z rejestrami jednostki centralnej.
                    </p>
                    <p>
                      Rejestracja telemetryczna wykazała{' '}
                      <span className="bg-black text-black select-none pointer-events-none px-3 py-0.5 rounded-none inline-block border border-black">
                        ████████████████████████████████
                      </span>{' '}
                      przeniesienie danych pod rygorem tajności.{' '}
                      <span className="bg-black text-black select-none pointer-events-none px-3 py-0.5 rounded-none inline-block border border-black">
                        ████████████████████████
                      </span>{' '}
                      Dalsze prace laboratoryjne wstrzymane decyzją dyrekcji.
                    </p>
                    <div className="pt-2 mt-2 border-t border-red-900/60 text-[11px] text-red-300 flex justify-between">
                      <span>Podpisano: Dr. Aris Thorne // Dr. Elena Vance</span>
                      <span>Data zatwierdzenia: 14.11.1994</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/40 text-slate-800 dark:text-slate-200">
                    <MarkdownRenderer content={publication.abstract} isDistorted={isDistorted} />
                  </div>
                )}
              </div>

              {/* CEL BADANIA / WPROWADZENIE BIOLOGICZNE */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  Cel Badania & Mechanizm Biologiczny (Study Objective):
                </h3>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                  <MarkdownRenderer content={publication.studyObjective} isDistorted={isDistorted} />
                </div>
              </div>

              {/* SŁOWA KLUCZOWE */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-xs font-mono font-semibold text-slate-500 mr-1">Indeks MeSH:</span>
                {publication.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ZAKŁADKA 2: METODOLOGIA DOŚWIADCZALNA */}
          {activeTab === 'methodology' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 font-mono mb-2">
                  Opis Procedury i Przebiegu Eksperymentu:
                </h3>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                  <MarkdownRenderer content={publication.methodologyNarrative} isDistorted={isDistorted} />
                </div>
              </div>

              {/* USTRUKTURYZOWANE PARAMETRY METODYCZNE */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono mb-3">
                  Aparatura Pomiarowa i Parametry Przygotowania Próbki:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                    <p className="font-bold text-slate-700 dark:text-slate-300">Model biologiczny / Próbka:</p>
                    <p className="text-slate-600 dark:text-slate-400">{publication.methodologyParams.tissueSample}</p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                    <p className="font-bold text-slate-700 dark:text-slate-300">Aparatura i Sensory:</p>
                    <p className="text-slate-600 dark:text-slate-400">{publication.methodologyParams.instrumentation}</p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                    <p className="font-bold text-slate-700 dark:text-slate-300">Bufor / Medium perfuzyjne:</p>
                    <p className="text-slate-600 dark:text-slate-400">{publication.methodologyParams.perfusionOrReagent}</p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                    <p className="font-bold text-slate-700 dark:text-slate-300">Próbkowanie & Odniesienie kalibracyjne:</p>
                    <p className="text-slate-600 dark:text-slate-400">{publication.methodologyParams.samplingFrequency}</p>
                  </div>
                </div>
              </div>

              {publication.editorialNote && (
                <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-300 italic font-sans">
                  <strong>Notatka Redakcyjna:</strong> {publication.editorialNote}
                </div>
              )}

              {/* JEŚLI ARTYKUŁ ARCHIWALNY: DOSSIER DR. ARISA THORNE'A */}
              {isArchival && (
                <div className="pt-4 border-t border-red-900/60">
                  <p className="text-xs font-mono font-bold text-red-400 mb-3 uppercase tracking-wider">
                    [ZAŁĄCZNIK BIOMETRYCZNY // KARTA KIEROWNIKA PROJEKTU]:
                  </p>
                  <ScientistPortrait compact />
                </div>
              )}
            </div>
          )}

          {/* ZAKŁADKA 3: WYNIKI & TABELA ANALITYCZNA */}
          {activeTab === 'results' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 font-mono mb-2">
                  Opis Obserwacji Doświadczalnych i Analiza Statystyczna:
                </h3>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                  <MarkdownRenderer content={publication.resultsNarrative} isDistorted={isDistorted} />
                </div>
              </div>

              {/* TABELA PARAMETRYCZNA WYNIKÓW */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono mb-3">
                  Zestawienie Parametrów Biochemicznych i Statystycznych:
                </h4>
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-slate-100 dark:bg-slate-900/80 font-mono text-[11px] text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-3 font-bold">Mierzony Parametr</th>
                        <th className="p-3 font-bold">Grupa Kontrolna</th>
                        <th className="p-3 font-bold">Grupa Badana / Wynik</th>
                        <th className="p-3 font-bold">Poziom p-value</th>
                        <th className="p-3 font-bold">Wnioski Statystyczne</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {publication.resultsTable.map((row, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
                        >
                          <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{row.parameter}</td>
                          <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{row.controlGroup}</td>
                          <td className="p-3 font-mono font-bold text-sky-600 dark:text-sky-400">{row.testGroup}</td>
                          <td className="p-3 font-mono text-emerald-600 dark:text-emerald-400">{row.pValue}</td>
                          <td className="p-3 text-slate-600 dark:text-slate-400">{row.significance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {isArchival && publication.classifiedProtocol && (
                <div className="p-4 rounded-lg bg-black border border-red-800 font-mono text-xs text-red-300 space-y-2">
                  <div className="flex justify-between border-b border-red-900/80 pb-1.5 text-[11px]">
                    <span className="font-bold">TELEMETRIA INCYDENTU: {publication.classifiedProtocol.telemetryTimestamp}</span>
                    <span>KOD: {publication.classifiedProtocol.protocolCode}</span>
                  </div>
                  <p className="leading-relaxed text-slate-300 font-mono">
                    {publication.classifiedProtocol.rawLogFragment}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ZAKŁADKA 4: WNIOSKI & TRANSLACJA */}
          {activeTab === 'conclusions' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 font-mono mb-2">
                  Wnioski Badawcze i Znaczenie Translacyjne (Clinical & Translational Relevance):
                </h3>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                  <MarkdownRenderer content={publication.conclusions} isDistorted={isDistorted} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <p className="text-slate-500 text-[10px] uppercase">Liczba Niezależnych Cytowań</p>
                  <p className="text-lg font-bold text-sky-600 dark:text-sky-400 mt-1">{publication.citations}</p>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <p className="text-slate-500 text-[10px] uppercase">Wskaźnik Altmetric Score</p>
                  <p className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-1">{publication.altmetricScore}</p>
                </div>
                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <p className="text-slate-500 text-[10px] uppercase">Pobrania Pełnego Tekstu PDF</p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">{publication.downloadsCount}</p>
                </div>
              </div>
            </div>
          )}

          {/* ZAKŁADKA 5: CYTOWANIE & EKSPORT */}
          {activeTab === 'cite' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono mb-2">
                  Formaty Cytowania Bibliograficznego:
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Wybierz format bibliograficzny, aby skopiować gotowy rekord do menedżera bibliografii (Mendeley, Zotero, EndNote, LaTeX).
                </p>
              </div>

              {/* FORMAT BIBTEX */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">BibTeX (LaTeX):</span>
                  <button
                    onClick={() => handleCopyCitation('bibtex')}
                    className="px-3 py-1 rounded text-xs font-mono font-semibold bg-sky-600 hover:bg-sky-700 text-white transition-colors"
                  >
                    {copiedFormat === 'bibtex' ? '✓ Skopiowano do schowka!' : 'Kopiuj BibTeX'}
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800">
{`@article{${(publication.authors[0]?.name.split(' ').pop() || 'neuroclin').toLowerCase()}${publication.year}_${publication.id.replace(/[^a-zA-Z0-9]/g, '')},
  author = {${publication.authors.map((a) => a.name).join(' and ')}},
  title = {{${publication.title}}},
  journal = {${publication.journal.split(',')[0]}},
  year = {${publication.year}},
  doi = {${publication.doi}},
  publisher = {NeuroClin Biosciences Academic Press}
}`}
                </pre>
              </div>

              {/* FORMAT APA */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">Format APA (7th Edition):</span>
                  <button
                    onClick={() => handleCopyCitation('apa')}
                    className="px-3 py-1 rounded text-xs font-mono font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {copiedFormat === 'apa' ? '✓ Skopiowano!' : 'Kopiuj APA'}
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-sans">
                  {publication.authors.map((a) => a.name).join(', ')} ({publication.year}). {publication.title}. <em>{publication.journal}</em>. https://doi.org/{publication.doi}
                </div>
              </div>

              {/* FORMAT RIS */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">Format RIS (EndNote / Zotero):</span>
                  <button
                    onClick={() => handleCopyCitation('ris')}
                    className="px-3 py-1 rounded text-xs font-mono font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {copiedFormat === 'ris' ? '✓ Skopiowano!' : 'Kopiuj RIS'}
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800">
{`TY  - JOUR
TI  - ${publication.title}
${publication.authors.map((a) => `AU  - ${a.name}`).join('\n')}
JO  - ${publication.journal.split(',')[0]}
PY  - ${publication.year}
DO  - ${publication.doi}
ER  - `}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* BELKA DOLNA MODALA */}
        <div
          className={`p-3.5 sm:p-4 border-t flex flex-wrap items-center justify-between gap-2 text-xs font-mono ${
            isArchival
              ? 'bg-[#180808] border-red-900/80 text-red-300'
              : 'bg-slate-50 dark:bg-[#0c121e] border-slate-200 dark:border-slate-800 text-slate-500'
          }`}
        >
          <span>
            {isArchival
              ? 'KLAUZULA: AKTA BSL-4 WYCOFANE ZE ZBIORÓW JAWNYCH W 1994 R.'
              : 'Akredytowane Repozytorium NeuroClin Biosciences // ISO/IEC 17025'}
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                soundEngine.playKeystroke();
                onClose();
              }}
              className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            >
              Zamknij
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
