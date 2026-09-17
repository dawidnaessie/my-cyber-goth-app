'use client';

import React from 'react';
import { SystemStateProvider, useSystemState } from './SystemStateContext';
import { SystemHeader } from './SystemHeader';

function ShellContent({ children }: { children: React.ReactNode }) {
  const { opticsOn, isGlitching } = useSystemState();

  return (
    <div
      className={`min-h-screen relative transition-colors duration-500 ${
        opticsOn ? 'bg-[#08090e] text-[#f4f4f5]' : 'bg-[#050404] text-[#cfc4b2]'
      }`}
    >
      {/* NAKŁADKI ANALOG HORROR (Renderowane gdy OPTYKA: WYŁ lub w trakcie glitcha) */}
      {(!opticsOn || isGlitching) && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0 analog-scanlines opacity-75" />
          <div className="absolute inset-0 analog-vignette opacity-85" />
          <div className="absolute inset-0 analog-noise opacity-60" />
        </div>
      )}

      <div
        className={`min-h-screen flex flex-col justify-between p-2 md:p-6 max-w-6xl mx-auto relative z-10 transition-all ${
          !opticsOn || isGlitching ? 'analog-flicker' : ''
        }`}
      >
        <SystemHeader />
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    </div>
  );
}

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <SystemStateProvider>
      <ShellContent>{children}</ShellContent>
    </SystemStateProvider>
  );
}
