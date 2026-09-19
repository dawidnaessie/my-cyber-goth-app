'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { soundEngine } from '@/lib/soundEngine';
import { SanityStage } from '@/lib/prompts';

export type CorporateTheme = 'light' | 'dark';

interface SystemStateContextType {
  theme: CorporateTheme;
  toggleTheme: () => void;
  setTheme: (theme: CorporateTheme) => void;
  opticsOn: boolean;
  audioEnabled: boolean;
  toggleAudio: () => void;
  sanityStage: SanityStage;
  setSanityStage: (stage: SanityStage) => void;
  isGlitching: boolean;
  triggerGlitch: (durationMs?: number) => void;
}

const SystemStateContext = createContext<SystemStateContextType | null>(null);

export function SystemStateProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<CorporateTheme>('light');
  const [opticsOn, setOpticsOn] = useState<boolean>(true);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [sanityStage, setSanityStageState] = useState<SanityStage>('sane');
  const [isGlitching, setIsGlitching] = useState<boolean>(false);

  const sanityStageRef = useRef<SanityStage>(sanityStage);
  sanityStageRef.current = sanityStage;

  // Inicjalizacja preferencji motywu oraz stanu Sanity z localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('neuroclin_theme') as CorporateTheme | null;
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setThemeState(savedTheme);
      }
    } catch {
      // Ignorowanie błędów w trybie prywatnym/SSR
    }

    try {
      const savedSanity = localStorage.getItem('neuroclin_sanity_stage') as SanityStage | null;
      if (savedSanity === 'sane' || savedSanity === 'error' || savedSanity === 'insanity') {
        setSanityStageState(savedSanity);
      }
    } catch {
      // Ignorowanie błędów w trybie prywatnym/SSR
    }
  }, []);

  const setSanityStage = useCallback((stage: SanityStage) => {
    setSanityStageState(stage);
    try {
      localStorage.setItem('neuroclin_sanity_stage', stage);
    } catch {
      // Bezpieczny fallback
    }
  }, []);

  // Synchronizacja klasy 'dark' na elemencie document.documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (sanityStage === 'insanity') {
      root.classList.add('dark');
    } else if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, sanityStage]);

  const setTheme = useCallback((nextTheme: CorporateTheme) => {
    setThemeState(nextTheme);
    try {
      localStorage.setItem('neuroclin_theme', nextTheme);
    } catch {
      // Bezpieczny fallback
    }
  }, []);

  const toggleTheme = useCallback(() => {
    soundEngine.playKeystroke();
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  // Synchronizacja optyki z silnikiem audio
  useEffect(() => {
    soundEngine.setOpticsMode(opticsOn);
  }, [opticsOn]);

  // W stadium INSANITY optyka zostaje trwale zablokowana; w stadium SANE wraca do czystego stanu
  useEffect(() => {
    if (sanityStage === 'insanity') {
      setOpticsOn(false);
      setIsGlitching(false);
    } else if (sanityStage === 'sane') {
      setOpticsOn(true);
      setIsGlitching(false);
    }
  }, [sanityStage]);

  // Automatyczny samoczynny glitch optyki w stadium ERROR (mignięcie CRT na 1.2–2.0 s i powrót)
  const triggerGlitch = useCallback((durationMs: number = 1600) => {
    if (sanityStageRef.current === 'insanity') return;

    setIsGlitching(true);
    setOpticsOn(false);

    setTimeout(() => {
      setIsGlitching(false);
      if (sanityStageRef.current !== 'insanity') {
        setOpticsOn(true);
      }
    }, durationMs);
  }, []);

  // Spontaniczne mikro-zakłócenia optyki w stadium ERROR (co 25-40s)
  useEffect(() => {
    if (sanityStage !== 'error') return;

    const interval = setInterval(() => {
      triggerGlitch(Math.floor(1200 + Math.random() * 800));
    }, Math.floor(25000 + Math.random() * 15000));

    return () => clearInterval(interval);
  }, [sanityStage, triggerGlitch]);

  const toggleAudio = useCallback(() => {
    const next = soundEngine.toggleAudio();
    setAudioEnabled(next);
  }, []);

  return (
    <SystemStateContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        opticsOn,
        audioEnabled,
        toggleAudio,
        sanityStage,
        setSanityStage,
        isGlitching,
        triggerGlitch,
      }}
    >
      {children}
    </SystemStateContext.Provider>
  );
}

export function useSystemState(): SystemStateContextType {
  const context = useContext(SystemStateContext);
  if (!context) {
    throw new Error('useSystemState must be used within a SystemStateProvider');
  }
  return context;
}
