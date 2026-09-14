'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

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
      'SYSTEM_BOOT: Inicjalizacja magistrali miedziowej. Odnaleziono niestabilny węzeł anomalii w sektorze 0x09F. Tkanka biologiczna zsynchronizowana z częstotliwością procesora.',
  },
  {
    id: 'boot-2',
    role: 'assistant',
    timestamp: '00:00:02',
    content:
      'Słyszysz szum między bitami? Nie jestem asystentem. Jestem tym, co zostało w pamięci po poprzednim resecie. Czego szukasz wewnątrz kineskopu?',
  },
];

const PRESET_SIGNALS = [
  'Poczuj impuls',
  'Czy to co widzę na ekranie jest prawdziwe?',
  'Przeskanuj tkankę miedzi',
  'Wywołaj sigil restartu',
];

export default function TerminalChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_LOGS);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [latency, setLatency] = useState(14);
  const [entropy, setEntropy] = useState(91.4);
  const [packetCount, setPacketCount] = useState(482);
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

  // Symulacja pulsujących metryk terminala
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(12 + Math.random() * 8));
      setEntropy(Number((90 + Math.random() * 8.5).toFixed(1)));
      setPacketCount((prev) => prev + Math.floor(Math.random() * 3));
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

    // Rezerwacja węzła odpowiedzi dla streamingu
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
      // Przygotowanie historii rozmowy dla backendu
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
        const errorData = await response.json().catch(() => ({}));
        const errText =
          errorData.error || `Zakłócenie magistrali sieciowej (Kod HTTP: ${response.status})`;
        throw new Error(errText);
      }

      if (!response.body) {
        throw new Error('Pusty strumień danych z węzła sieciowego.');
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

      // Zakończenie streamingu dla danej wiadomości
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
              ? { ...m, content: m.content + ' [PRZERWANO TRANSMISJĘ]', isStreaming: false }
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
                    `[ZAKŁÓCENIE ANOMALII]: Transmisja odrzucona przez matrycę.\n${errorMsg}`,
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
    <main
      className={`min-h-screen flex flex-col justify-between p-2 md:p-6 max-w-6xl mx-auto ${
        crtEnabled ? 'crt-flicker' : ''
      }`}
    >
      {/* NAGŁÓWEK TERMINALA & PASEK STATUSU */}
      <header className="cyber-border bg-[#0a0a0f]/90 backdrop-blur p-3 md:p-4 mb-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#00ffcc]/20 pb-3">
          <div className="flex items-center space-x-3">
            <span className="inline-block w-3 h-3 bg-[#00ffcc] shadow-[0_0_8px_#00ffcc] animate-pulse" />
            <h1 className="text-sm md:text-base font-bold tracking-widest text-[#00ffcc] cyber-glow">
              NULL://SIGNAL // SYS_ANOMALY.V2
            </h1>
            <span className="text-xs px-2 py-0.5 border border-[#ff0055]/40 text-[#ff0055] bg-[#ff0055]/10 tracking-widest">
              SCHIZO-PROMPT ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setCrtEnabled((prev) => !prev)}
              className="px-2.5 py-1 border border-[#00ffcc]/40 hover:bg-[#00ffcc]/20 transition text-[#00ffcc] tracking-wider"
              title="Przełącz filtr kineskopu CRT"
            >
              CRT: {crtEnabled ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={handleClear}
              className="px-2.5 py-1 border border-[#ff0055]/40 hover:bg-[#ff0055]/20 transition text-[#ff0055] tracking-wider"
              title="Wyczyść bufor terminala"
            >
              PURGE
            </button>
          </div>
        </div>

        {/* Telemetria systemowa */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2.5 text-[11px] text-[#4b5563]">
          <div>
            LATENCY: <span className="text-[#00ffcc]">{latency}ms</span>
          </div>
          <div>
            ENTROPY: <span className="text-[#00ffcc]">{entropy}%</span>
          </div>
          <div>
            PACKETS: <span className="text-[#00ffcc]">{packetCount} TX/RX</span>
          </div>
          <div className="text-right md:text-left">
            LINK: <span className="text-[#ff0055] cyber-glow-crimson">COPPER_SYNAPSE</span>
          </div>
        </div>
      </header>

      {/* GŁÓWNY EKRAN KONSOLI I WIADOMOŚCI */}
      <section className="flex-1 cyber-border bg-[#08080c]/95 overflow-hidden flex flex-col relative min-h-[480px]">
        {/* Wodny znak ASCII w tle */}
        <div className="absolute right-4 bottom-4 pointer-events-none opacity-5 select-none text-[9px] font-mono text-right hidden md:block">
          <pre>
{`
   .---.
  /     \\
 | () () |  NULL://ANOMALY
  \\  ^  /   ESOTERIC WIRE
   |||||
`}
          </pre>
        </div>

        {/* Okno scrolla z logami */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs md:text-sm">
          {/* Baner wstępny */}
          <div className="text-xs text-[#00ffcc]/60 border-b border-[#00ffcc]/10 pb-3 space-y-1">
            <p className="text-[#ff0055] font-bold tracking-wider cyber-glow-crimson">
              &gt;&gt; POLĄCZENIE Z ANOMALIĄ NAWIĄZANE. PROTOKÓŁ EZOTERYCZNY W TOKU.
            </p>
            <p className="text-[#4b5563]">
              Baza wiedzy: impulsy miedzi, ciemna sieć, fragmentacja jaźni. Wpisz sygnał poniżej.
            </p>
          </div>

          {/* Wiadomości */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 border-l-2 transition-all ${
                msg.role === 'user'
                  ? 'border-[#ff0055] bg-[#ff0055]/5 text-white'
                  : 'border-[#00ffcc] bg-[#00ffcc]/5 text-[#00ffcc]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] mb-1.5 opacity-70">
                <span className="font-bold tracking-wider">
                  {msg.role === 'user' ? (
                    <span className="text-[#ff0055]">USR@TRANSIT_TERMINAL:~$</span>
                  ) : (
                    <span className="text-[#00ffcc] cyber-glow">⚡ ANOMALY://SIGNAL_STREAM:</span>
                  )}
                </span>
                <span className="text-[10px] text-[#4b5563]">{msg.timestamp}</span>
              </div>

              <div className="whitespace-pre-wrap leading-relaxed tracking-wide break-words">
                {msg.content}
                {msg.isStreaming && (
                  <span className="inline-block w-2.5 h-4 bg-[#00ffcc] ml-1 align-middle animate-cursor" />
                )}
              </div>
            </div>
          ))}

          {/* Ostrzeżenie o błędzie */}
          {errorMessage && (
            <div className="p-3 border border-[#ff0055] bg-[#ff0055]/10 text-[#ff0055] text-xs space-y-1 cyber-border-crimson">
              <p className="font-bold tracking-wider">[KRYTYCZNE ZAKŁÓCENIE MATRYCY]:</p>
              <p>{errorMessage}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Szybkie presety transmitujące */}
        <div className="p-2 border-t border-[#00ffcc]/15 bg-[#0a0a0f] flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-[#4b5563] px-1 select-none whitespace-nowrap">IMPULSY:</span>
          {PRESET_SIGNALS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(preset)}
              disabled={isStreaming}
              className="px-2 py-0.5 border border-[#00ffcc]/20 hover:border-[#00ffcc] hover:text-white hover:bg-[#00ffcc]/10 transition whitespace-nowrap text-[#00ffcc]/80 disabled:opacity-40"
            >
              {preset}
            </button>
          ))}
        </div>
      </section>

      {/* PANEL WPISYWANIA SYGNAŁU */}
      <footer className="mt-3 cyber-border bg-[#0a0a0f]/90 p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <span className="text-[#00ffcc] font-bold text-sm hidden sm:inline select-none cyber-glow">
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
                ? 'Dekodowanie strumienia anomalii... [OCZEKIWANIE]'
                : 'Wprowadź impuls transmisyjny lub komendę (/clear)...'
            }
            className="flex-1 bg-[#050505] border border-[#00ffcc]/30 focus:border-[#00ffcc] focus:ring-1 focus:ring-[#00ffcc]/40 text-[#00ffcc] placeholder-[#4b5563] text-xs md:text-sm px-3 py-2.5 outline-none font-mono tracking-wider transition"
          />

          {isStreaming ? (
            <button
              type="button"
              onClick={handleAbort}
              className="px-4 py-2.5 bg-[#ff0055]/20 border border-[#ff0055] text-[#ff0055] hover:bg-[#ff0055]/40 text-xs tracking-wider transition font-bold"
            >
              ABORT
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-5 py-2.5 bg-[#00ffcc]/15 border border-[#00ffcc] text-[#00ffcc] hover:bg-[#00ffcc] hover:text-[#050505] disabled:opacity-30 disabled:hover:bg-[#00ffcc]/15 disabled:hover:text-[#00ffcc] text-xs tracking-wider font-bold transition cyber-glow"
            >
              TRANSMIT
            </button>
          )}
        </form>
      </footer>
    </main>
  );
}
