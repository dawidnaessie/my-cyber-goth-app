'use client';

import React, { useState } from 'react';
import { Publication } from '@/lib/archiveData';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { soundEngine } from '@/lib/soundEngine';

interface PublicationCardProps {
  publication: Publication;
  isDistorted: boolean;
  onOpenDetails: (pub: Publication, initialTab?: 'abstract' | 'methodology' | 'results' | 'conclusions' | 'cite') => void;
}

export function PublicationCard({ publication, isDistorted, onOpenDetails }: PublicationCardProps) {
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const isArchival = publication.isArchivalAnomaly;

  const handleCopyBibtex = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playKeystroke();

    const firstAuthorLastName = publication.authors[0]?.name.split(' ').pop() || 'NeuroClin';
    const bibtex = `@article{${firstAuthorLastName.toLowerCase()}${publication.year}_${publication.id.replace(/[^a-zA-Z0-9]/g, '')},
  author = {${publication.authors.map((a) => a.name).join(' and ')}},
  title = {{${publication.title}}},
  journal = {${publication.journal.split(',')[0]}},
  year = {${publication.year}},
  doi = {${publication.doi}},
  publisher = {NeuroClin Biosciences Academic Press}
}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(bibtex).then(() => {
        setCopiedBibtex(true);
        setTimeout(() => setCopiedBibtex(false), 2200);
      });
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    if (isArchival) return 'bg-red-950 text-red-300 border border-red-800';
    switch (category) {
      case 'Neurobiologia':
        return 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800';
      case 'Farmakologia':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800';
      case 'Biochemia':
        return 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800';
      case 'Immunologia':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800';
      case 'Fizjologia':
        return 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800';
      case 'Genetyka':
        return 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <article
      onClick={() => onOpenDetails(publication, 'abstract')}
      className={`group rounded-xl border p-5 sm:p-6 transition-all duration-200 cursor-pointer relative overflow-hidden ${
        isArchival
          ? 'bg-[#0f0707] border-red-800/90 shadow-lg hover:border-red-600 hover:shadow-red-950/50'
          : isDistorted
          ? 'bg-[#090505] border-[#781414]/70 hover:border-red-600'
          : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800/90 shadow-sm hover:shadow-md hover:border-sky-300 dark:hover:border-sky-700/60'
      }`}
    >
      {/* PASEK METADANYCH GÓRNYCH */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
          <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider ${getCategoryBadgeClass(publication.category)}`}>
            {publication.category}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {publication.articleType}
          </span>
          <span className="text-slate-400 font-bold">{publication.id}</span>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
          <span>{publication.date}</span>
          <span>•</span>
          {publication.openAccess ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Open Access
            </span>
          ) : (
            <span className="text-red-500 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse" />
              RESTRICTED
            </span>
          )}
        </div>
      </div>

      {/* TYTUŁ PUBLIKACJI */}
      <h3
        className={`text-base sm:text-lg font-bold tracking-tight mb-2 transition-colors ${
          isArchival
            ? 'text-red-300 font-mono group-hover:text-red-200'
            : isDistorted
            ? 'text-red-300 font-mono'
            : 'text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400'
        }`}
      >
        {publication.title}
      </h3>

      {/* AUTORZY I CZASOPISMO */}
      <div className="text-xs text-slate-600 dark:text-slate-400 mb-3 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span>
          <strong className="text-slate-700 dark:text-slate-200 font-semibold">
            {publication.authors.map((a, i) => (
              <span key={a.name}>
                {a.isThorne ? (
                  <span className="text-red-400 font-bold underline decoration-red-600 underline-offset-2">
                    {a.name}
                  </span>
                ) : (
                  a.name
                )}
                {i < publication.authors.length - 1 ? ', ' : ''}
              </span>
            ))}
          </strong>
        </span>
        <span className="text-slate-400">|</span>
        <span className="italic text-slate-700 dark:text-slate-300 font-sans">{publication.journal}</span>
      </div>

      {/* PODGLĄD ABSTRAKTU Z OBSŁUGĄ LATEX */}
      <div className="mb-4 text-xs sm:text-sm leading-relaxed line-clamp-3 text-slate-600 dark:text-slate-300 font-sans">
        {isArchival ? (
          <div className="font-mono text-xs text-slate-300 bg-black/60 p-2.5 rounded border border-red-900/60">
            <span className="text-red-400 font-bold mr-1">[KLAUZULA ST-94/11]:</span>
            Seria pomiarowa rozpoczęta w warunkach perfuzji niskotemperaturowej.{' '}
            <span className="bg-black text-black select-none pointer-events-none px-2 py-0.5 rounded-none inline-block border border-black">
              ████████████████████
            </span>{' '}
            podjęto próbę bezpośredniego sprzężenia sygnałów bioelektrycznych mikrosieci z rejestrami jednostki centralnej...
          </div>
        ) : (
          <MarkdownRenderer content={publication.abstract} isDistorted={isDistorted} />
        )}
      </div>

      {/* TAGI I SŁOWA KLUCZOWE */}
      <div className="flex flex-wrap items-center gap-1.5 mb-4">
        {publication.keywords.map((kw) => (
          <span
            key={kw}
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              isArchival
                ? 'bg-red-950/60 text-red-300 border border-red-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            #{kw}
          </span>
        ))}
      </div>

      {/* DOLNY PASEK STATYSTYK I PRZYCISKÓW AKCJI */}
      <div
        className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-slate-500">
          <span title="Digital Object Identifier">DOI: {publication.doi}</span>
          <span className="hidden sm:inline text-slate-400">•</span>
          <span className="text-sky-600 dark:text-sky-400 font-semibold" title="Liczba niezależnych cytowań">
            Cytowania: {publication.citations}
          </span>
          <span className="hidden sm:inline text-slate-400">•</span>
          <span className="text-amber-600 dark:text-amber-400 font-semibold" title="Altmetric Attention Score">
            Altmetric: {publication.altmetricScore}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyBibtex}
            className="px-2.5 py-1 rounded text-xs font-mono font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Kopiuj rekord bibliograficzny w formacie BibTeX"
          >
            {copiedBibtex ? '✓ Skopiowano' : 'BibTeX'}
          </button>

          <button
            onClick={() => {
              soundEngine.playKeystroke();
              onOpenDetails(publication, 'methodology');
            }}
            className="px-2.5 py-1 rounded text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Metodyka
          </button>

          <button
            onClick={() => {
              soundEngine.playKeystroke();
              onOpenDetails(publication, 'abstract');
            }}
            className={`px-3 py-1 rounded text-xs font-semibold shadow-sm transition-all flex items-center space-x-1 ${
              isArchival
                ? 'bg-red-900 text-white hover:bg-red-800 border border-red-700 anomaly-glow-blood'
                : 'bg-sky-600 text-white hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600'
            }`}
          >
            <span>{isArchival ? 'Otwórz Akta ST-94' : 'Pełny Raport'}</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    </article>
  );
}
