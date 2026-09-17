'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { soundEngine } from '@/lib/soundEngine';
import { SanityStage } from '@/lib/prompts';

interface SystemStateContextType {
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
  const [opticsOn, setOpticsOn] = useState<boolean>(true);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [sanityStage, setSanityStage] = useState<SanityStage>('sane');
  const [isGlitching, setIsGlitching] = useState<boolean>(false);

  const sanityStageRef = useRef<SanityStage>(sanityStage);
  sanityStageRef.current = sanityStage;

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
      // Przywrócenie optyki następuje tylko wtedy, gdy nie doszło do trwałej degradacji
      if (sanityStageRef.current !== 'insanity') {
        setOpticsOn(true);
      }
    }, durationMs);
  }, []);

  // Spontaniczne mikro-zakłócenia optyki w stadium ERROR (co 20-35s)
  useEffect(() => {
    if (sanityStage !== 'error') return;

    const interval = setInterval(() => {
      triggerGlitch(Math.floor(1200 + Math.random() * 800));
    }, Math.floor(20000 + Math.random() * 15000));

    return () => clearInterval(interval);
  }, [sanityStage, triggerGlitch]);

  const toggleAudio = useCallback(() => {
    const next = soundEngine.toggleAudio();
    setAudioEnabled(next);
  }, []);

  return (
    <SystemStateContext.Provider
      value={{
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
