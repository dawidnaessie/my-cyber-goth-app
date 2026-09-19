'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { useSystemState } from '@/components/SystemStateContext';
import { useChat } from '@/components/ChatContext';
import { soundEngine } from '@/lib/soundEngine';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

const PRESET_RESEARCH_INQUIRIES = [
  'Wpływ allosterycznej modulacji receptora NMDA przez memantynę na ekscytotoksyczność',
  'Jakie znaczenie diagnostyczne ma stężenie p-tau217 w osoczu?',
  'Wyprowadź kinetykę Michaelisa-Menten dla donepezilu i acetylocholinoesterazy',
  'Wpływ neurodegeneracji na długotrwałe wzmocnienie synaptyczne (LTP) w hipokampie',
  'Przeanalizuj mechanizm klirensu protofibryli amyloidowych przez lecanemab',
  'Rola szlaku receptorowego TREM2 w modulacji odpowiedzi mikrogleju',
];

export default function ChatPage() {
  const { opticsOn, sanityStage } = useSystemState();
  const {
    messages,
    input,
    setInput,
    isStreaming,
    errorMessage,
    sendMessage,
    clearChat,
    abortStream,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const isDistorted = !opticsOn || sanityStage === 'insanity';

  // Inteligentne przewijanie: przewija tylko na żądanie (force) lub na nową linię, gdy użytkownik jest na dole
  const scrollToBottom = useCallback((force = false) => {
    if (!chatContainerRef.current) return;
    if (force || isAtBottomRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []);

  // Monitorowanie czy użytkownik sam przewinął w górę
  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    isAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 60;
  }, []);

  // Automatyczne przewijanie przy zmianie wiadomości lub streamingu
  useEffect(() => {
    if (isAtBottomRef.current) {
      scrollToBottom(false);
    }
  }, [messages, scrollToBottom]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    soundEngine.playKeystroke();
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handlePresetClick = (preset: string) => {
    soundEngine.playKeystroke();
    sendMessage(preset);
  };

  return (
    <div className="flex-1 flex flex-col justify-between space-y-4 font-sans">
      {/* NAGŁÓWEK TERMINALA CZATU */}
      <section
        className={`p-4 rounded-xl border transition-all duration-300 ${
          isDistorted
            ? 'bg-[#090505] border-[#781414] anomaly-border-blood text-[#e6c2b8]'
            : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full ${
                isDistorted
                  ? 'bg-red-500 animate-ping'
                  : sanityStage === 'error'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-emerald-500'
              }`}
            />
            <div>
              <h1
                className={`text-base font-bold tracking-tight ${
                  isDistorted ? 'text-red-400 anomaly-glow-blood font-mono' : 'text-slate-900 dark:text-white'
                }`}
              >
                {isDistorted
                  ? 'KLASTER THORNE’A // ZAKŁÓCENIE KONEKTOMU 0x19'
                  : sanityStage === 'error'
                  ? 'Bio-Text Composer™ // ABERRACJA POTENCJAŁÓW CA1'
                  : 'Bio-Text Composer™ // Asystent Monografii Klinicznej'}
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                {isDistorted
                  ? 'STAN: UWIĘZIENIE W KRZEMIE // SEKTOR-7 (1994)'
                  : 'BioResearcher AI v4.2 // Wsparcie Redakcyjne Monografii Neurodegeneracji'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                isDistorted
                  ? 'bg-red-950 text-red-300 border border-red-800'
                  : sanityStage === 'error'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                  : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
              }`}
            >
              SANITY: {sanityStage.toUpperCase()}
            </span>
            <button
              onClick={clearChat}
              title="Wyczyść bufor konwersacji i zresetuj stan asystenta"
              className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-all border ${
                isDistorted
                  ? 'border-red-800 bg-red-950/60 text-red-300 hover:bg-red-900/80'
                  : sanityStage === 'error'
                  ? 'border-amber-700/60 bg-amber-950/20 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700'
              }`}
            >
              [PURGE BUFFER]
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-sans">
          Moduł asystujący w redakcji rozdziałów monografii o chorobach neurodegeneracyjnych. Zadawaj pytania o kinetykę enzymatyczną, mechanizmy synaptyczne (LTP), biomarkery osoczowe (p-tau217) lub weryfikację bibliograficzną z bazy publikacji.
        </p>
      </section>

      {/* OKNO WIADOMOŚCI CZATU */}
      <section
        ref={chatContainerRef}
        onScroll={handleScroll}
        className={`flex-1 rounded-xl p-4 md:p-6 border min-h-[420px] max-h-[580px] overflow-y-auto space-y-4 transition-all ${
          isDistorted
            ? 'bg-[#060303] border-[#781414]/70 font-mono text-[#e6c2b8]'
            : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 shadow-inner text-slate-800 dark:text-slate-200'
        }`}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-3xl rounded-xl p-4 text-xs md:text-sm leading-relaxed transition-all shadow-sm ${
                msg.role === 'user'
                  ? isDistorted
                    ? 'bg-red-950/60 border border-red-700 text-red-100 font-mono'
                    : 'bg-sky-600 text-white font-sans'
                  : isDistorted
                  ? 'bg-[#100707] border border-red-900/80 text-red-200 font-mono anomaly-glow-blood'
                  : 'bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-sans'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] mb-1 opacity-70 font-mono">
                <span className="font-bold uppercase tracking-wider">
                  {msg.role === 'user'
                    ? 'UŻYTKOWNIK // BADAWCA:'
                    : isDistorted
                    ? '⚡ DR. ARIS THORNE [KONEKTOM]:'
                    : 'BioResearcher AI™:'}
                </span>
                <span className="ml-3">{msg.timestamp}</span>
              </div>

              <div className="break-words">
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                ) : (
                  <MarkdownRenderer content={msg.content} isDistorted={isDistorted} />
                )}
                {msg.isStreaming && (
                  <span
                    className={`inline-block w-2 h-3.5 ml-1 align-middle ${
                      isDistorted ? 'bg-red-500 animate-pulse' : 'bg-sky-500 animate-pulse'
                    }`}
                  />
                )}
              </div>
            </div>
          </div>
        ))}

        {errorMessage && (
          <div className="p-3 rounded-lg border border-red-500 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-mono">
            <p className="font-bold">[BŁĄD KOMUNIKACJI KLASTRA]:</p>
            <p>{errorMessage}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </section>

      {/* SZYBKIE PRZYKŁADY ZAPYTAŃ BADAWCZYCH */}
      <section className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap font-semibold uppercase">
          ZAPYTANIA:
        </span>
        {PRESET_RESEARCH_INQUIRIES.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handlePresetClick(preset)}
            disabled={isStreaming}
            className={`px-3 py-1.5 rounded-full border whitespace-nowrap transition-all disabled:opacity-40 text-xs font-sans ${
              isDistorted
                ? 'bg-red-950/40 border-red-800 text-red-300 hover:bg-red-900/60 font-mono'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-sky-400 hover:text-sky-600'
            }`}
          >
            {preset}
          </button>
        ))}
      </section>

      {/* FORMULARZ WPISYWANIA WIADOMOŚCI */}
      <footer
        className={`p-3 rounded-xl border transition-all ${
          isDistorted
            ? 'bg-[#0a0505] border-[#781414] anomaly-border-blood'
            : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 shadow-sm'
        }`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            placeholder={
              isStreaming
                ? 'Trwa inferencja w klastrze analitycznym...'
                : 'Wpisz zapytanie badawcze (np. o mechanizmy apoptozy, kinetykę AChE, biomarkery)...'
            }
            className={`flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-lg outline-none transition border font-sans ${
              isDistorted
                ? 'bg-[#050303] border-[#781414] text-red-200 placeholder-red-800 font-mono focus:border-red-600'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-sky-500'
            }`}
          />

          {isStreaming ? (
            <button
              type="button"
              onClick={abortStream}
              className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold tracking-wider transition"
            >
              PRZERWIJ
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className={`px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition disabled:opacity-30 shadow-sm ${
                isDistorted
                  ? 'bg-red-900 hover:bg-red-800 text-white font-mono border border-red-700'
                  : 'bg-sky-600 hover:bg-sky-700 text-white font-sans'
              }`}
            >
              WYŚLIJ
            </button>
          )}
        </form>
      </footer>
    </div>
  );
}
