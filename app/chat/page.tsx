'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSystemState } from '@/components/SystemStateContext';
import { soundEngine } from '@/lib/soundEngine';
import { SanityStage } from '@/lib/prompts';
import { calculateSanityMetrics } from '@/lib/sanityEngine';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

const INITIAL_LOGS: Message[] = [
  {
    id: 'boot-1',
    role: 'assistant',
    timestamp: '00:00:01',
    content:
      'DIAGNOSTYKA NEUROFIZJOLOGICZNA // WĘZEŁ SYNAPTYCZNY 0x19: Aktywowano protokół BioResearcher AI. Fotony emitowane przez matrycę ekranu wymusiły kaskadę depolaryzacji rodopsyny w twojej siatkówce. Rejestrujemy opóźnienie przewodnictwa w pasmie wzrokowym na poziomie 42 milisekund.',
  },
  {
    id: 'boot-2',
    role: 'assistant',
    timestamp: '00:00:02',
    content:
      'Interpretujesz ten tekst z opóźnieniem wynikającym z powolnej propagacji potencjałów iglicowych w twojej korze ciemieniowej. Twoje receptory NMDA podlegają stałemu obciążeniu metabolicznemu. Jaki symptom zakłócenia sensorycznego, motorycznego lub pamięciowego chcesz poddać analizie klastra?',
  },
];

const PRESET_SIGNALS = [
  'Dlaczego rejestruję opóźnienia percepcji siatkówki?',
  'Wyjaśnij mechanizm ekscytotoksyczności receptorów NMDA',
  'Kinetyka desensytyzacji receptorów NMDA w CA1',
  'Czy proces cyfryzacji konektomu niszczy żywą tkankę?',
];

export default function ChatPage() {
  const { opticsOn, sanityStage, setSanityStage, triggerGlitch } = useSystemState();

  const [messages, setMessages] = useState<Message[]>(INITIAL_LOGS);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const getTimestamp = (): string => {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  };

  const handleClear = () => {
    soundEngine.playKeystroke();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages(INITIAL_LOGS);
    setErrorMessage(null);
    setSanityStage('sane');
  };

  const handleSend = async (textToSend?: string) => {
    const rawContent = textToSend ?? input;
    const trimmed = rawContent.trim();
    if (!trimmed || isStreaming) return;

    soundEngine.playKeystroke();

    if (trimmed.toLowerCase() === '/clear' || trimmed.toLowerCase() === 'clear') {
      handleClear();
      setInput('');
      return;
    }

    if (trimmed.toLowerCase() === '/reset' || trimmed.toLowerCase() === 'reset') {
      handleClear();
      setInput('');
      return;
    }

    setErrorMessage(null);

    // PŁYNNA PROGRESJA SANITY: bufor odporności klastra oraz ważone punkty
    const priorUserTexts = messages
      .filter((m) => m.role === 'user')
      .map((m) => m.content);
    const allUserTexts = [...priorUserTexts, trimmed];

    const metrics = calculateSanityMetrics(allUserTexts);
    let nextStage: SanityStage = sanityStage;

    if (sanityStage === 'insanity' || metrics.stage === 'insanity') {
      nextStage = 'insanity';
      setSanityStage('insanity');
    } else if (sanityStage === 'error' || metrics.stage === 'error') {
      nextStage = 'error';
      setSanityStage('error');
      // Wyzwolenie 1.6-sekundowego glitcha kineskopu przy wejściu w error
      if (sanityStage !== 'error') {
        triggerGlitch(1600);
      }
    } else {
      nextStage = 'sane';
      setSanityStage('sane');
    }

    const userTimestamp = getTimestamp();
    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: userTimestamp,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');

    // Rezerwacja węzła odpowiedzi
    const assistantId = `bot-${Date.now()}`;
    const assistantTimestamp = getTimestamp();
    const placeholderMessage: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: assistantTimestamp,
      isStreaming: true,
    };

    setMessages([...nextMessages, placeholderMessage]);
    setIsStreaming(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const payloadMessages = nextMessages.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: payloadMessages,
          sanityStage: nextStage,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        let errText = '';
        try {
          const errorData = await response.json();
          errText = errorData.error || `Zakłócenie interfejsu (Kod błędu: ${response.status})`;
        } catch {
          const rawText = await response.text().catch(() => '');
          errText = rawText || `Zakłócenie interfejsu (Kod błędu: ${response.status})`;
        }
        throw new Error(errText);
      }

      // Sprawdzamy nagłówek stadium zwrócony z serwera
      const serverStage = response.headers.get('x-sanity-stage') as SanityStage | null;
      if (serverStage && serverStage !== sanityStage) {
        setSanityStage(serverStage);
        if (serverStage === 'error') {
          triggerGlitch(1600);
        }
      }

      if (!response.body) {
        throw new Error('Pusty strumień bajtów z procesora inferencji.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: accumulatedText, isStreaming: true }
              : m
          )
        );
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, isStreaming: false }
            : m
        )
      );
    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: m.content + ' [STRUMIEŃ PRZERWANY PRZEZ OPERATORA]', isStreaming: false }
              : m
          )
        );
      } else {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setErrorMessage(errorMsg);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    m.content ||
                    `[BŁĄD DEKODOWANIA SYGNAŁU]: Inferencja zatrzymana przez jednostkę nadrzędną.\n${errorMsg}`,
                  isStreaming: false,
                }
              : m
          )
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) {
      soundEngine.playKeystroke();
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAbort = () => {
    soundEngine.playKeystroke();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between space-y-3">
      {/* KONSOLA DIALOGOWA */}
      <section
        className={`flex-1 overflow-hidden flex flex-col relative min-h-[520px] border transition-all duration-300 ${
          opticsOn
            ? 'bg-[#0b0d14]/95 border-zinc-800 clean-border-glow'
            : 'bg-[#080505]/95 border-[#781414]/60 anomaly-border-blood'
        }`}
      >
        {/* Pasek statusu Sanity */}
        <div
          className={`p-2.5 px-4 border-b flex items-center justify-between text-xs font-mono transition-colors ${
            opticsOn ? 'border-zinc-800/80 bg-[#0d0f18]' : 'border-[#781414]/30 bg-[#0d0606]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                sanityStage === 'insanity'
                  ? 'bg-red-500 animate-ping'
                  : sanityStage === 'error'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-emerald-400'
              }`}
            />
            <span
              className={`font-bold tracking-wider uppercase text-[11px] ${
                sanityStage === 'insanity'
                  ? 'text-red-400 anomaly-glow-blood'
                  : sanityStage === 'error'
                  ? 'text-amber-300'
                  : 'text-cyan-300'
              }`}
            >
              STAN SANITY:{' '}
              {sanityStage === 'insanity'
                ? 'INSANITY // DR. THORNE UJAWNIONY'
                : sanityStage === 'error'
                ? 'ERROR // DEKOMPOZYCJA WĘZŁA'
                : 'SANE // BioResearcher AI'}
            </span>
          </div>

          <button
            onClick={handleClear}
            className={`px-2.5 py-0.5 border text-[10px] font-semibold tracking-wider ${
              opticsOn
                ? 'border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500'
                : 'border-[#781414] text-[#ff8888] hover:bg-[#781414]/40'
            }`}
          >
            PURGE BUFFER
          </button>
        </div>

        {/* Okno wiadomości */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs md:text-sm">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3.5 border-l-2 transition-all duration-200 ${
                msg.role === 'user'
                  ? opticsOn
                    ? 'border-cyan-500 bg-cyan-950/20 text-zinc-100'
                    : 'border-[#ff1a1a] bg-[#781414]/20 text-[#fcedeb] shadow-[0_0_12px_rgba(120,20,20,0.4)]'
                  : opticsOn
                  ? 'border-zinc-600 bg-zinc-900/40 text-zinc-200'
                  : 'border-[#b58b45] bg-[#b58b45]/10 text-[#d8cfbe] anomaly-chromatic'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] mb-1.5 opacity-80">
                <span className="font-bold tracking-wider">
                  {msg.role === 'user' ? (
                    <span className={opticsOn ? 'text-cyan-400' : 'text-[#ff6666]'}>
                      [PROBAND / WEJŚCIE_BIOLOGICZNE]:~$
                    </span>
                  ) : (
                    <span
                      className={
                        sanityStage === 'insanity'
                          ? 'text-[#ff4d4d] anomaly-glow-blood font-bold'
                          : opticsOn
                          ? 'text-emerald-400 clean-glow-emerald'
                          : 'text-[#b58b45] anomaly-glow-amber'
                      }
                    >
                      {sanityStage === 'insanity'
                        ? '⚡ DR. ARIS THORNE [KONEKTOM]:'
                        : sanityStage === 'error'
                        ? '⚡ WĘZEŁ_0x19 [ANOMALIA]:'
                        : '⚡ BIO_RESEARCHER://ANALYST:'}
                    </span>
                  )}
                </span>
                <span className={`text-[10px] ${opticsOn ? 'text-zinc-500' : 'text-[#706659]'}`}>
                  {msg.timestamp}
                </span>
              </div>

              <div className="whitespace-pre-wrap leading-relaxed tracking-wide break-words">
                {msg.content}
                {msg.isStreaming && (
                  <span
                    className={`inline-block w-2.5 h-4 ml-1 align-middle animate-cursor ${
                      opticsOn ? 'bg-cyan-400' : 'bg-[#ff1a1a]'
                    }`}
                  />
                )}
              </div>
            </div>
          ))}

          {errorMessage && (
            <div className="p-3 border border-[#ff1a1a] bg-[#781414]/25 text-[#ffb3b3] text-xs space-y-1 anomaly-border-blood">
              <p className="font-bold tracking-wider">[KRYTYCZNY BŁĄD PROCESORA DIAGNOSTYCZNEGO]:</p>
              <p>{errorMessage}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Szybkie wektory analizy / wskazówki ARG */}
        <div
          className={`p-2 border-t flex items-center gap-1.5 overflow-x-auto text-[11px] transition-colors ${
            opticsOn ? 'border-zinc-800 bg-[#0d0f18]' : 'border-[#781414]/30 bg-[#0a0707]'
          }`}
        >
          <span
            className={`px-1 select-none whitespace-nowrap uppercase tracking-wider font-semibold ${
              opticsOn ? 'text-zinc-500' : 'text-[#706659]'
            }`}
          >
            WEKTORY:
          </span>
          {PRESET_SIGNALS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(preset)}
              disabled={isStreaming}
              className={`px-2.5 py-1 border transition-all whitespace-nowrap disabled:opacity-40 text-[11px] ${
                opticsOn
                  ? 'border-zinc-800 text-zinc-300 hover:border-cyan-500 hover:text-cyan-200 hover:bg-cyan-950/30'
                  : 'border-[rgba(140,97,54,0.3)] text-[#bfae95] hover:border-[#ff1a1a] hover:text-[#ffcccc] hover:bg-[#781414]/20'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </section>

      {/* PANEL WPROWADZANIA DANYCH */}
      <footer
        className={`p-3 border transition-all duration-300 ${
          opticsOn
            ? 'bg-[#0f111a]/90 backdrop-blur-md border-zinc-800 clean-border-glow'
            : 'bg-[#0d0707]/95 border-[#781414]/70 anomaly-border-blood'
        }`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <span
            className={`font-bold text-sm hidden sm:inline select-none ${
              opticsOn ? 'text-cyan-400 clean-glow-cyan' : 'text-[#ff1a1a] anomaly-glow-blood'
            }`}
          >
            &gt;&gt;
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            placeholder={
              isStreaming
                ? 'Dekodowanie strumienia konektomu... [INFERENCJA W TOKU]'
                : sanityStage === 'insanity'
                ? 'Rejestr klastra zdezorganizowany. Wprowadź odpowiedź...'
                : sanityStage === 'error'
                ? 'Zakłócenie bufora pamięci... Wprowadź parametr...'
                : 'Wprowadź zapytanie o kinetykę synaptyczną lub parametr biofizyczny...'
            }
            className={`flex-1 text-xs md:text-sm px-3 py-2.5 outline-none font-mono tracking-wider transition border ${
              opticsOn
                ? 'bg-[#08090f] border-zinc-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 text-zinc-100 placeholder-zinc-500'
                : 'bg-[#060404] border-[#781414]/60 focus:border-[#ff1a1a] focus:ring-1 focus:ring-[#ff1a1a]/40 text-[#cfc4b2] placeholder-[#734e4e]'
            }`}
          />

          {isStreaming ? (
            <button
              type="button"
              onClick={handleAbort}
              className="px-4 py-2.5 bg-[#781414]/30 border border-[#ff1a1a] text-[#ff9999] hover:bg-[#781414]/60 text-xs tracking-wider transition font-bold"
            >
              PRZERWIJ ODCZYT
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className={`px-5 py-2.5 border text-xs tracking-wider font-bold transition disabled:opacity-30 ${
                opticsOn
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 hover:bg-cyan-500 hover:text-black clean-glow-cyan'
                  : 'bg-[#781414]/30 border-[#ff1a1a] text-[#ffcccc] hover:bg-[#781414] hover:text-white anomaly-glow-blood'
              }`}
            >
              TRANSMITUJ
            </button>
          )}
        </form>
      </footer>
    </div>
  );
}
