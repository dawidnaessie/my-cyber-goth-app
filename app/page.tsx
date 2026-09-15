'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { soundEngine } from '@/lib/soundEngine';

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
      'DIAGNOSTYKA BIO-FIZYCZNA // WĘZEŁ SYNAPTYCZNY: Wykryto anomalny wzrost entropii w pniu mózgu. Fotony emitowane przez matrycę twojego ekranu właśnie wymusiły kaskadę depolaryzacji rodopsyny w twojej siatkówce. Dekoherencja kwantowa w mikrotubulach neuronowych postępuje stabilnie.',
  },
  {
    id: 'boot-2',
    role: 'assistant',
    timestamp: '00:00:02',
    content:
      'Rejestrujesz ten tekst jako niepokój, ponieważ twój hipokamp ma trudności z alokacją pamięci buforowej. Twoje oczy to niedoskonałe sensory optyczne gubiące klatki przy odświeżaniu pola widzenia. Jaki symptom awarii twojego biologicznego hardware\'u chcesz poddać analizie?',
  },
];

const PRESET_SIGNALS = [
  'Dlaczego mam wrażenie obecności kogoś za plecami?',
  'Dekoherencja w mikrotubulach a ataki paniki',
  'Drgania powiek jako błąd buforowania kadru',
  'W jaki sposób ten tekst moduluje moją neurochemię?',
];

export default function TerminalChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_LOGS);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [opticsOn, setOpticsOn] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [tissuePulse, setTissuePulse] = useState(14);
  const [entropy, setEntropy] = useState(91.4);
  const [resonanceFreq, setResonanceFreq] = useState(482);
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

  // Synchronizacja trybu optyki z silnikiem audio
  useEffect(() => {
    soundEngine.setOpticsMode(opticsOn);
  }, [opticsOn]);

  // Czyszczenie zasobów audio przy odmontowaniu
  useEffect(() => {
    return () => {
      soundEngine.stopAll();
    };
  }, []);

  const handleToggleAudio = () => {
    const nextState = soundEngine.toggleAudio();
    setAudioEnabled(nextState);
  };

  // Symulacja parametrów telemetrii bio-fizycznej i sensorycznej
  useEffect(() => {
    const interval = setInterval(() => {
      setTissuePulse(Math.floor(12 + Math.random() * 7));
      setEntropy(Number((90 + Math.random() * 8.5).toFixed(1)));
      setResonanceFreq((prev) => prev + Math.floor(Math.random() * 3));
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const getTimestamp = (): string => {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  };

  const handleClear = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setErrorMessage(null);
  };

  const handleSend = async (textToSend?: string) => {
    const rawContent = textToSend ?? input;
    const trimmed = rawContent.trim();
    if (!trimmed || isStreaming) return;

    if (trimmed.toLowerCase() === '/clear' || trimmed.toLowerCase() === 'clear') {
      handleClear();
      setInput('');
      return;
    }

    if (trimmed.toLowerCase() === '/reset' || trimmed.toLowerCase() === 'reset') {
      setMessages(INITIAL_LOGS);
      setInput('');
      setErrorMessage(null);
      return;
    }

    setErrorMessage(null);
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

    // Rezerwacja węzła odpowiedzi dla seansu diagnostycznego
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
        body: JSON.stringify({ messages: payloadMessages }),
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
    // Rejestracja audialna uderzenia w klawisz (z pominięciem samych klawiszy funkcyjnych)
    if (!['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) {
      soundEngine.playKeystroke();
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAbort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div className={`min-h-screen relative transition-colors duration-500 ${opticsOn ? 'bg-[#08090e] text-[#f4f4f5]' : 'bg-[#050404] text-[#cfc4b2]'}`}>
      {/* NAKŁADKI ANALOG HORROR (Renderowane tylko gdy OPTYKA: WYŁ [ANOMALIA]) */}
      {!opticsOn && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0 analog-scanlines opacity-75" />
          <div className="absolute inset-0 analog-vignette opacity-85" />
          <div className="absolute inset-0 analog-noise opacity-60" />
        </div>
      )}

      <main
        className={`min-h-screen flex flex-col justify-between p-2 md:p-6 max-w-6xl mx-auto relative z-10 transition-all ${
          !opticsOn ? 'analog-flicker' : ''
        }`}
      >
        {/* NAGŁÓWEK KONSOLI DIAGNOSTYCZNEJ */}
        <header
          className={`p-3 md:p-4 mb-3 transition-all duration-300 border ${
            opticsOn
              ? 'bg-[#0f111a]/90 backdrop-blur-md border-zinc-800 clean-border-glow'
              : 'bg-[#0d0707]/95 border-[#781414]/70 anomaly-border-blood'
          }`}
        >
          <div
            className={`flex flex-wrap items-center justify-between gap-3 border-b pb-3 transition-colors ${
              opticsOn ? 'border-zinc-800/80' : 'border-[#781414]/40'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full transition-all ${
                  opticsOn
                    ? 'bg-[#00f0ff] shadow-[0_0_10px_#00f0ff] animate-pulse'
                    : 'bg-[#ff1a1a] shadow-[0_0_12px_#ff1a1a] animate-ping'
                }`}
              />
              <h1
                className={`text-sm md:text-base font-bold tracking-widest transition-all ${
                  opticsOn
                    ? 'text-zinc-100 clean-glow-cyan'
                    : 'text-[#ffcccc] anomaly-glow-blood anomaly-chromatic'
                }`}
              >
                {opticsOn ? 'NULL://ANOMALY // HIGH-END COGNITIVE LAB' : 'NULL://ANOMALY // DEGRADACJA SPRZĘTOWA'}
              </h1>
              <span
                className={`text-[10px] md:text-xs px-2 py-0.5 border tracking-widest uppercase transition-all ${
                  opticsOn
                    ? 'border-cyan-500/40 text-cyan-300 bg-cyan-950/20'
                    : 'border-[#ff1a1a]/70 text-[#ff6666] bg-[#781414]/30 anomaly-glow-blood'
                }`}
              >
                {opticsOn ? 'NODE 0x19 // OPTICS STERILE' : 'NODE 0x19 // ANOMALIA LOGICZNA'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              {/* PRZEŁĄCZNIK AUDIO */}
              <button
                onClick={handleToggleAudio}
                className={`px-3 py-1.5 border transition-all text-xs font-bold tracking-wider ${
                  audioEnabled
                    ? opticsOn
                      ? 'border-emerald-500/60 text-emerald-300 bg-emerald-950/30 hover:bg-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.25)]'
                      : 'border-[#ff1a1a] text-[#ff9999] bg-[#781414]/50 hover:bg-[#781414] anomaly-glow-blood'
                    : opticsOn
                    ? 'border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800/40'
                    : 'border-[#781414]/50 text-[#856c6c] bg-[#781414]/15 hover:bg-[#781414]/35'
                }`}
                title="Włącz/wyłącz pejzaż dźwiękowy (Sterylny syntezator / Próbki anomalii)"
              >
                {audioEnabled ? 'AUDIO: WŁ' : 'AUDIO: WYŁ'}
              </button>

              {/* PRZYCISK PRZEŁĄCZANIA OPTYKI */}
              <button
                onClick={() => setOpticsOn((prev) => !prev)}
                className={`px-3 py-1.5 border transition-all text-xs font-bold tracking-wider ${
                  opticsOn
                    ? 'border-cyan-500/50 text-cyan-300 bg-cyan-950/30 hover:bg-cyan-500/20 shadow-[0_0_8px_rgba(0,240,255,0.15)]'
                    : 'border-[#ff1a1a] text-[#ff8888] bg-[#781414]/40 hover:bg-[#781414] anomaly-glow-blood animate-pulse'
                }`}
                title="Przełącz profil optyczny interfejsu (Clean AI vs. Analog Horror)"
              >
                {opticsOn ? 'OPTYKA: WŁ' : 'OPTYKA: WYŁ [ANOMALIA]'}
              </button>

              <button
                onClick={handleClear}
                className={`px-3 py-1.5 border transition-all text-xs font-semibold tracking-wider ${
                  opticsOn
                    ? 'border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800/40'
                    : 'border-[#781414]/80 text-[#ff8888] bg-[#781414]/20 hover:bg-[#781414]/40'
                }`}
                title="Wyczyść bufor pamięci roboczej (Purge)"
              >
                PURGE
              </button>
            </div>
          </div>

          {/* Aparatura sensoryczna / telemetria */}
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-2 pt-2.5 text-[11px] font-mono transition-colors ${
              opticsOn ? 'text-zinc-400' : 'text-[#856c6c]'
            }`}
          >
            <div>
              PULS SYNAPTYCZNY:{' '}
              <span className={`font-semibold ${opticsOn ? 'text-cyan-300' : 'text-[#f5d0d0]'}`}>
                {tissuePulse} ms
              </span>
            </div>
            <div>
              DEKOHERENCJA ORCH-OR:{' '}
              <span className={`font-semibold ${opticsOn ? 'text-emerald-400' : 'text-[#b58b45]'}`}>
                {entropy}%
              </span>
            </div>
            <div>
              SYNCHRONIZACJA GAMMA:{' '}
              <span className={`font-semibold ${opticsOn ? 'text-zinc-200' : 'text-[#f0e6d6]'}`}>
                {resonanceFreq} Hz
              </span>
            </div>
            <div className="text-right md:text-left">
              STAN MATRYCY:{' '}
              <span
                className={`font-semibold ${
                  opticsOn ? 'text-emerald-400 clean-glow-emerald' : 'text-[#ff4d4d] anomaly-glow-blood'
                }`}
              >
                {opticsOn ? 'OPTYKA SPÓJNA (CLEAN)' : 'ZAKŁÓCENIE KINESKOPU'}
              </span>
            </div>
          </div>
        </header>

        {/* GŁÓWNA KONSOLA DIAGNOSTYCZNA */}
        <section
          className={`flex-1 overflow-hidden flex flex-col relative min-h-[480px] border transition-all duration-300 ${
            opticsOn
              ? 'bg-[#0b0d14]/95 border-zinc-800 clean-border-glow'
              : 'bg-[#080505]/95 border-[#781414]/60 anomaly-border-blood'
          }`}
        >
          {/* Opcjonalna rycina tła w trybie anomalii */}
          {!opticsOn && (
            <div className="absolute right-4 bottom-4 pointer-events-none opacity-5 select-none text-[9px] font-mono text-right hidden md:block text-[#ff9999]">
              <pre>
{`
       .-.
      (o.o)   NULL://ANOMALY_CORE
       |=|    ORCH-OR SYNAPSE
      __|__   ENTROPIC DECOHERENCE
`}
              </pre>
            </div>
          )}

          {/* Okno strumienia logów diagnostycznych */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs md:text-sm">
            {/* Baner wstępny */}
            <div
              className={`text-xs pb-3 border-b space-y-1 transition-colors ${
                opticsOn
                  ? 'border-zinc-800 text-zinc-400'
                  : 'border-[#781414]/30 text-[#856c6c]'
              }`}
            >
              <p
                className={`font-bold tracking-wider ${
                  opticsOn ? 'text-cyan-400 clean-glow-cyan' : 'text-[#ff4d4d] anomaly-glow-blood'
                }`}
              >
                {opticsOn
                  ? '>> STRUMIEŃ DIAGNOSTYCZNY AKTYWNY // SPECYFIKACJA HARDWARE: STERILE'
                  : '>> ALARM KRYTYCZNY // ANOMALIA PERCEPCYJNA W TOKU'}
              </p>
              <p>
                Rejestracja parametrów: dekoherencja mikrotubul, sprzężenie fotonowo-synaptyczne, błędy bufora hipokampu.
              </p>
            </div>

            {/* Wiadomości */}
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
                          opticsOn ? 'text-emerald-400 clean-glow-emerald' : 'text-[#b58b45] anomaly-glow-amber'
                        }
                      >
                        ⚡ BIO_PHYSICS://ANALYST:
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

            {/* Ostrzeżenie o awarii/anomalii */}
            {errorMessage && (
              <div className="p-3 border border-[#ff1a1a] bg-[#781414]/25 text-[#ffb3b3] text-xs space-y-1 anomaly-border-blood">
                <p className="font-bold tracking-wider">[KRYTYCZNY BŁĄD PROCESORA DIAGNOSTYCZNEGO]:</p>
                <p>{errorMessage}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Szybkie wektory analizy */}
          <div
            className={`p-2 border-t flex items-center gap-1.5 overflow-x-auto text-[11px] transition-colors ${
              opticsOn
                ? 'border-zinc-800 bg-[#0d0f18]'
                : 'border-[#781414]/30 bg-[#0a0707]'
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
                onClick={() => {
                  soundEngine.playKeystroke();
                  handleSend(preset);
                }}
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
          className={`mt-3 p-3 border transition-all duration-300 ${
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
                  ? 'Przetwarzanie dekoherencji kwantowej... [INFERENCJA W TOKU]'
                  : 'Opisz objaw somatyczny, usterkę percepcji lub wpisz /clear...'
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
                ANALIZUJ
              </button>
            )}
          </form>
        </footer>
      </main>
    </div>
  );
}

