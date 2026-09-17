'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSystemState } from './SystemStateContext';
import { soundEngine } from '@/lib/soundEngine';

export function SystemHeader() {
  const pathname = usePathname();
  const { theme, toggleTheme, opticsOn, audioEnabled, toggleAudio, sanityStage, isGlitching } = useSystemState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isDistorted = !opticsOn || sanityStage === 'insanity';

  const navItems = [
    { href: '/', label: 'Strona Główna' },
    { href: '/mail', label: 'Poczta', badge: '1' },
    { href: '/archive', label: 'Archiwum' },
    { href: '/chat', label: 'Bio-Chat AI' },
    { href: '/services', label: 'Usługi B2B' },
    { href: '/blog', label: 'Aktualności' },
    { href: '/status', label: 'Telemetria' },
  ];

  const handleNavClick = () => {
    soundEngine.playKeystroke();
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`border-b sticky top-0 z-40 backdrop-blur-md transition-colors duration-300 ${
        isDistorted
          ? 'bg-[#090505]/95 border-[#781414]/70 text-[#ffcccc]'
          : 'bg-white/95 dark:bg-[#0b0f19]/95 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100'
      }`}
    >
      {/* TOP BAR KORPORACYJNY */}
      <div
        className={`px-4 sm:px-6 lg:px-8 py-1.5 text-[11px] font-sans transition-colors border-b ${
          isDistorted
            ? 'bg-[#150707] border-[#781414]/50 text-[#ff8888]'
            : 'bg-slate-100 dark:bg-[#070b13] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isDistorted
                    ? 'bg-red-500 animate-ping'
                    : sanityStage === 'error'
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-emerald-500'
                }`}
              />
              <span className="font-semibold tracking-wide">
                {isDistorted
                  ? 'KRYTYCZNE ZAKŁÓCENIE KONEKTOMU // SEKTOR-7'
                  : 'GLP & ISO 9001:2015 CERTIFIED FACILITY'}
              </span>
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline font-mono text-[10px]">
              {isDistorted
                ? 'DESYNCHRONIZACJA POTENCJAŁÓW: 418 ms // KONEKTOM TH-94'
                : 'Bio-Analytical Laboratories & Contract Research // ISO/IEC 17025 Accredited'}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span className="hidden sm:inline font-mono">TEL: +1 (800) 555-NEURO</span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span
              className={`font-mono font-bold ${
                isDistorted ? 'text-red-400' : 'text-sky-600 dark:text-sky-400'
              }`}
            >
              PORTAL BADAWCZY V4.2
            </span>
          </div>
        </div>
      </div>

      {/* GŁÓWNY PASEK NAWIGACJI */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* LOGOTYP KORPORACJI */}
        <Link
          href="/"
          onClick={handleNavClick}
          className="flex items-center space-x-3 group cursor-pointer select-none"
        >
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white shadow-sm transition-all ${
              isDistorted
                ? 'bg-red-950 border border-red-600 text-red-200 anomaly-glow-blood'
                : 'bg-gradient-to-br from-sky-600 to-teal-700 group-hover:from-sky-500 group-hover:to-teal-600'
            }`}
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4" />
              <path d="M12 18v4" />
              <path d="M4.93 4.93l2.83 2.83" />
              <path d="M16.24 16.24l2.83 2.83" />
              <path d="M2 12h4" />
              <path d="M18 12h4" />
              <path d="M4.93 19.07l2.83-2.83" />
              <path d="M16.24 7.76l2.83-2.83" />
            </svg>
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold tracking-wider text-base sm:text-lg font-sans">
                NEUROCLIN
              </span>
              <span
                className={`text-xs font-bold px-1.5 py-0.5 rounded tracking-widest uppercase ${
                  isDistorted
                    ? 'bg-red-900/60 text-red-200 border border-red-700'
                    : 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-300/60 dark:border-sky-700/60'
                }`}
              >
                BIOSCIENCES
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans tracking-wide">
              Human Connectomics & Cellular Neurophysiology
            </p>
          </div>
        </Link>

        {/* LINKI NAWIGACJI DESKTOP */}
        <nav className="hidden md:flex items-center space-x-1 font-sans text-xs lg:text-sm font-medium">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={`px-2.5 lg:px-3 py-1.5 rounded-md transition-all inline-flex items-center gap-1.5 ${
                  isActive
                    ? isDistorted
                      ? 'bg-red-900/50 text-white font-semibold border border-red-700 anomaly-glow-blood'
                      : 'bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 font-semibold shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* PRZYCISKI KONTROLNE (THEME, AUDIO, SEARCH, KOSZYK) */}
        <div className="flex items-center space-x-2">
          {/* PRZEŁĄCZNIK WYSZUKIWARKI */}
          <button
            onClick={() => {
              soundEngine.playKeystroke();
              setSearchModalOpen(true);
            }}
            className="p-2 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Szukaj publikacji i preparatów..."
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>

          {/* PRZEŁĄCZNIK MOTYWU (DAY / NIGHT) */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-md transition-all ${
              theme === 'dark'
                ? 'text-amber-400 hover:bg-slate-800'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title={theme === 'dark' ? 'Przełącz na tryb jasny (Laboratory White)' : 'Przełącz na tryb ciemny (Slate Night)'}
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* PRZEŁĄCZNIK DŹWIĘKU */}
          <button
            onClick={() => {
              soundEngine.playKeystroke();
              toggleAudio();
            }}
            className={`px-2.5 py-1.5 rounded-md text-xs font-mono font-semibold transition-all border ${
              audioEnabled
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
            }`}
            title="Przełącznik audiosfery (Proceduralne kliknięcia i monitoring)"
          >
            {audioEnabled ? 'AUDIO: WŁ' : 'AUDIO: WYŁ'}
          </button>

          {/* PRZYCISK KOSZYKA / ZAPYTANIA OFERTOWEGO */}
          <Link
            href="/archive"
            onClick={handleNavClick}
            className={`hidden lg:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-sans font-semibold transition-all shadow-sm ${
              isDistorted
                ? 'bg-red-900 text-white hover:bg-red-800 border border-red-600'
                : 'bg-sky-600 text-white hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span>Katalog Próbek</span>
          </Link>

          {/* PRZYCISK MENU MOBILNEGO */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {/* ROZWIJANE MENU MOBILNE */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 space-y-1 font-sans bg-white dark:bg-[#0b0f19]">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between ${
                pathname === item.href
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500 text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* MODAL SZYBKIEJ WYSZUKIWARKI PUBLIKACJI */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm font-sans tracking-wide">
                KWERENDA ZASOBÓW I BADAŃ // NEUROCLIN
              </h3>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Wpisz np. 'CA1', 'NMDA', 'Thorne', 'ekscytotoksyczność'..."
              className="w-full px-3 py-2 text-sm border rounded-md outline-none bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:border-sky-500"
              autoFocus
            />

            <div className="text-xs text-slate-500 space-y-2 max-h-48 overflow-y-auto font-sans">
              <p className="font-semibold text-slate-400 uppercase text-[10px]">Sugerowane hasła naukowe:</p>
              <div className="flex flex-wrap gap-1.5">
                {['NMDA Receptor Kinetics', '16,384-Site Microelectrode Array', 'Aris Thorne 1994', 'Phenolic Perfusion', 'LTP CA1 Hippocampus'].map((tag) => (
                  <Link
                    key={tag}
                    href={`/archive?q=${encodeURIComponent(tag)}`}
                    onClick={() => {
                      soundEngine.playKeystroke();
                      setSearchModalOpen(false);
                    }}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded hover:bg-sky-100 dark:hover:bg-sky-950/60 hover:text-sky-700"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Link
                href={`/archive?q=${encodeURIComponent(searchQuery)}`}
                onClick={() => {
                  soundEngine.playKeystroke();
                  setSearchModalOpen(false);
                }}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-md transition-colors"
              >
                Przejdź do Archiwum Publikacji &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
