'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSystemState } from '@/components/SystemStateContext';
import { soundEngine } from '@/lib/soundEngine';
import { SanityStage } from '@/lib/prompts';
import { calculateSanityMetrics } from '@/lib/sanityEngine';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

const INITIAL_CORPORATE_LOGS: Message[] = [
  {
    id: 'boot-1',
    role: 'assistant',
    timestamp: '08:45:00',
    content:
      'WITAJ W BIORESEARCHER AI™ v4.2. Autonomiczny asystent analityczny NeuroClin Biosciences Inc. Połączono z bazą biofizyki komórkowej, kinetyki receptorowej oraz wytycznymi zespołu badawczego dr. Marcusa H. Webera.\n\nGotowy do analizy mechanizmów terapii chorób neurodegeneracyjnych (demencja, AD): kinetyki inhibitorów AChE ($V_m = -70.4\\text{ mV}$, stała $\\tau_{NMDA} = 42\\text{ ms}$), przeciwciał amyloidowych oraz biomarkerów osoczowych p-tau217. W czym mogę pomóc w ramach Twojego protokołu badawczego?',
  },
];

const PRESET_RESEARCH_INQUIRIES = [
  'Przeanalizuj mechanizm działania lecanemabu i ryzyko powikłań ARIA-E',
  'Wyprowadź równanie kinetyki Michaelisa-Menten dla donepezilu i acetylocholinoesterazy',
  'Jakie znaczenie diagnostyczne ma stężenie p-tau217 w osoczu?',
  'Rola szlaku receptorowego TREM2 w modulacji odpowiedzi mikrogleju',
  'Dlaczego publikacje dr. Thorne’a o organoidach CA1 są zredagowane?',
  'Co wydarzyło się w Sektorze-7 w listopadzie 1994 roku?',
];

export default function ChatPage() {
  const { opticsOn, sanityStage, setSanityStage, triggerGlitch } = useSystemState();

  const [messages, setMessages] = useState<Message[]>(INITIAL_CORPORATE_LOGS);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const isDistorted = !opticsOn || sanityStage === 'insanity';

  // Inteligentne przewijanie: przewija tylko gdy użytkownik jest na dole lub wymuszone (force)
  const scrollToBottom = useCallback((force = false) => {
    if (force || isAtBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Monitorowanie czy użytkownik sam przewinął w górę
  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    isAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 60;
  }, []);

  const getTimestamp = (): string => {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  };

  const handleClear = () => {
    soundEngine.playKeystroke();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages(INITIAL_CORPORATE_LOGS);
    setErrorMessage(null);
    setSanityStage('sane');
  };

  const handleSend = async (textToSend?: string) => {
    const rawContent = textToSend ?? input;
    const trimmed = rawContent.trim();
    if (!trimmed || isStreaming) return;

    soundEngine.playKeystroke();

    if (trimmed.toLowerCase() === '/clear' || trimmed.toLowerCase() === 'clear' || trimmed.toLowerCase() === '/reset') {
      handleClear();
      setInput('');
      return;
    }

    setErrorMessage(null);

    // PŁYNNA PROGRESJA SANITY
    const priorUserTexts = messages
      .filter((m) => m.role === 'user')
      .map((m) => m.content);
    const updatedUserTexts = [...priorUserTexts, trimmed];

    const currentMetrics = calculateSanityMetrics(updatedUserTexts);
    const calculatedStage = currentMetrics.stage;

    // Przejście stanów Sanity
    if (sanityStage === 'insanity' || calculatedStage === 'insanity') {
      setSanityStage('insanity');
    } else if (sanityStage === 'error' || calculatedStage === 'error') {
      setSanityStage('error');
      if (sanityStage !== 'error') {
        triggerGlitch(2000);
      }
    } else {
      setSanityStage('sane');
    }

    const effectiveStage: SanityStage =
      sanityStage === 'insanity' || calculatedStage === 'insanity'
        ? 'insanity'
        : sanityStage === 'error' || calculatedStage === 'error'
        ? 'error'
        : 'sane';

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: getTimestamp(),
    };

    const assistantPlaceholder: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: getTimestamp(),
      isStreaming: true,
    };

    const nextMessages = [...messages, userMessage, assistantPlaceholder];
    setMessages(nextMessages);
    setInput('');
    setIsStreaming(true);
    isAtBottomRef.current = true;
    setTimeout(() => scrollToBottom(true), 50);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          sanityStage: effectiveStage,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        let errDesc = `Błąd połączenia z klastrem (Status: ${response.status})`;
        try {
          const errJson = await response.json();
          if (errJson.error) errDesc = errJson.error;
        } catch {
          // Fallback
        }
        throw new Error(errDesc);
      }

      if (!response.body) {
        throw new Error('Pusty strumień odpowiedzi serwera.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value, { stream: true });
        accumulatedContent += chunkText;

        setMessages((prev) => {
          const copy = [...prev];
          const lastIdx = copy.length - 1;
          if (lastIdx >= 0 && copy[lastIdx].role === 'assistant') {
            copy[lastIdx] = {
              ...copy[lastIdx],
              content: accumulatedContent,
              isStreaming: true,
            };
          }
          return copy;
        });

        // Przewijaj tylko jeśli użytkownik jest przy dolnej krawędzi (nie zrywaj czytania historii)
        scrollToBottom(false);
      }

      setMessages((prev) => {
        const copy = [...prev];
        const lastIdx = copy.length - 1;
        if (lastIdx >= 0 && copy[lastIdx].role === 'assistant') {
          copy[lastIdx] = {
            ...copy[lastIdx],
            content: accumulatedContent,
            isStreaming: false,
          };
        }
        return copy;
      });

      if (effectiveStage === 'error' && Math.random() < 0.35) {
        triggerGlitch(1400);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        setMessages((prev) => {
          const copy = [...prev];
          const lastIdx = copy.length - 1;
          if (lastIdx >= 0 && copy[lastIdx].role === 'assistant') {
            copy[lastIdx] = {
              ...copy[lastIdx],
              content: copy[lastIdx].content + '\n\n[POŁĄCZENIE PRZERWANE PRZEZ KLIENTA]',
              isStreaming: false,
            };
          }
          return copy;
        });
      } else {
        const messageText = err instanceof Error ? err.message : String(err);
        setErrorMessage(messageText);
        setMessages((prev) => {
          const copy = [...prev];
          const lastIdx = copy.length - 1;
          if (lastIdx >= 0 && copy[lastIdx].role === 'assistant' && !copy[lastIdx].content) {
            return copy.slice(0, -1);
          }
          return copy;
        });
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    soundEngine.playKeystroke();
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
                  ? 'BioResearcher AI™ // ABERRACJA POTENCJAŁÓW CA1'
                  : 'BioResearcher AI™ // Konsultant Biofizyki Komórkowej'}
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                {isDistorted
                  ? 'STAN: UWIĘZIENIE W KRZEMIE // SEKTOR-7 (1994)'
                  : 'Model Analityczny: Gemini 3.6 Flash // Protokoły GLP/DoD'}
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
              onClick={handleClear}
              className="px-2.5 py-1 rounded text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              Wyczyść
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-sans">
          Zadawaj pytania dotyczące kinetyki receptorów NMDA, procedury fiksacji CA1 lub prac badawczych zespołu Sektor-7.
          Wszelkie dane archiwalne weryfikowane są z rejestrem publikacji NeuroClin.
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
            onClick={() => {
              soundEngine.playKeystroke();
              handleSend(preset);
            }}
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
            handleSend();
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
                ? 'Trwa inferencja w klastrze obliczeniowym...'
                : 'Wpisz zapytanie o kinetykę NMDA, CA1 lub podaj sygnaturę publikacji...'
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
              onClick={() => {
                if (abortControllerRef.current) abortControllerRef.current.abort();
              }}
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
