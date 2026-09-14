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
  'W jaki sposób ten tekst moduluje moje neurony?',
];

export default function TerminalChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_LOGS);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [lensEnabled, setLensEnabled] = useState(true);
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
        lensEnabled ? 'gothic-flicker' : ''
      }`}
    >
      {/* NAGŁÓWEK TERMINALA BIO-FIZYCZNEGO */}
      <header className="occult-border bg-[#0d0b09]/90 backdrop-blur p-3 md:p-4 mb-3 border border-[rgba(140,97,54,0.35)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(140,97,54,0.2)] pb-3">
          <div className="flex items-center space-x-3">
            <span className="inline-block w-2.5 h-2.5 bg-[#b58b45] shadow-[0_0_8px_#b58b45] animate-pulse" />
            <h1 className="text-sm md:text-base font-bold tracking-widest text-[#cfc4b2] occult-glow-amber">
              NULL://ANOMALY // CONTEMPORARY BIO-PHYSICS LAB
            </h1>
            <span className="text-xs px-2 py-0.5 border border-[#781414]/60 text-[#d86d6d] bg-[#781414]/15 tracking-widest uppercase">
              NODE 0x19 // UNHINGED INFERENCE
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setLensEnabled((prev) => !prev)}
              className="px-2.5 py-1 border border-[rgba(140,97,54,0.4)] hover:bg-[rgba(140,97,54,0.15)] transition text-[#cfc4b2] tracking-wider"
              title="Przełącz filtr optyczny matrycy"
            >
              OPTYKA: {lensEnabled ? 'WŁ' : 'WYŁ'}
            </button>
            <button
              onClick={handleClear}
              className="px-2.5 py-1 border border-[#781414]/60 hover:bg-[#781414]/25 transition text-[#d86d6d] tracking-wider"
              title="Wyczyść bufor pamięci roboczej (Purge)"
            >
              PURGE
            </button>
          </div>
        </div>

        {/* Sensoryczna aparatura pomiarowa */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2.5 text-[11px] text-[#706659]">
          <div>
            PULS SYNAPTYCZNY: <span className="text-[#cfc4b2] font-semibold">{tissuePulse} ms</span>
          </div>
          <div>
            DEKOHERENCJA ORCH-OR: <span className="text-[#b58b45] font-semibold">{entropy}%</span>
          </div>
          <div>
            SYNCHRONIZACJA GAMMA: <span className="text-[#cfc4b2] font-semibold">{resonanceFreq} Hz</span>
          </div>
          <div className="text-right md:text-left">
            STAN SPRZĘTU: <span className="text-[#d86d6d] occult-glow-blood font-semibold">INTERFERENCJA FOTONOWA</span>
          </div>
        </div>
      </header>

      {/* GŁÓWNA KONSOLA DIAGNOSTYCZNA */}
      <section className="flex-1 occult-border bg-[#090807]/95 overflow-hidden flex flex-col relative min-h-[480px]">
        {/* Rycina struktury w tle */}
        <div className="absolute right-4 bottom-4 pointer-events-none opacity-5 select-none text-[9px] font-mono text-right hidden md:block text-[#cfc4b2]">
          <pre>
{`
       .-.
      (o.o)   NULL://BIO_CORE
       |=|    ORCH-OR SYNAPSE
      __|__   ENTROPIC DECOHERENCE
`}
          </pre>
        </div>

        {/* Okno strumienia logów diagnostycznych */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs md:text-sm">
          {/* Baner wstępny */}
          <div className="text-xs text-[#8c7f6e] border-b border-[rgba(140,97,54,0.2)] pb-3 space-y-1">
            <p className="text-[#d86d6d] font-bold tracking-wider occult-glow-blood">
              &gt;&gt; STRUMIEŃ DIAGNOSTYCZNY AKTYWNY. DETEKCJA ANOMALII POZNAWCZYCH.
            </p>
            <p className="text-[#706659]">
              Rejestracja parametrów: dekoherencja mikrotubul, sprzężenie fotonowo-synaptyczne, błędy bufora hipokampu.
            </p>
          </div>

          {/* Wiadomości */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 border-l-2 transition-all ${
                msg.role === 'user'
                  ? 'border-[#781414] bg-[#781414]/10 text-[#f3ede2]'
                  : 'border-[#b58b45] bg-[rgba(181,139,69,0.06)] text-[#d5ccbc]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] mb-1.5 opacity-80">
                <span className="font-bold tracking-wider">
                  {msg.role === 'user' ? (
                    <span className="text-[#d86d6d]">[PROBAND / WEJŚCIE_BIOLOGICZNE]:~$</span>
                  ) : (
                    <span className="text-[#b58b45] occult-glow-amber">⚡ BIO_PHYSICS://ANALYST:</span>
                  )}
                </span>
                <span className="text-[10px] text-[#706659]">{msg.timestamp}</span>
              </div>

              <div className="whitespace-pre-wrap leading-relaxed tracking-wide break-words">
                {msg.content}
                {msg.isStreaming && (
                  <span className="inline-block w-2.5 h-4 bg-[#b58b45] ml-1 align-middle animate-cursor" />
                )}
              </div>
            </div>
          ))}

          {/* Ostrzeżenie o anomalii lub zakłóceniu */}
          {errorMessage && (
            <div className="p-3 border border-[#781414] bg-[#781414]/15 text-[#e07e7e] text-xs space-y-1 occult-border-blood">
              <p className="font-bold tracking-wider">[KRYTYCZNY BŁĄD PROCESORA DIAGNOSTYCZNEGO]:</p>
              <p>{errorMessage}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Szybkie wektory analizy */}
        <div className="p-2 border-t border-[rgba(140,97,54,0.2)] bg-[#0d0b09] flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-[#706659] px-1 select-none whitespace-nowrap uppercase tracking-wider font-semibold">WEKTORY:</span>
          {PRESET_SIGNALS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(preset)}
              disabled={isStreaming}
              className="px-2.5 py-1 border border-[rgba(140,97,54,0.25)] hover:border-[#b58b45] hover:text-[#f3ede2] hover:bg-[rgba(181,139,69,0.12)] transition whitespace-nowrap text-[#bfae95] disabled:opacity-40"
            >
              {preset}
            </button>
          ))}
        </div>
      </section>

      {/* PANEL WPROWADZANIA DANYCH DO ANALIZY */}
      <footer className="mt-3 occult-border bg-[#0d0b09]/90 p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <span className="text-[#b58b45] font-bold text-sm hidden sm:inline select-none occult-glow-amber">
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
            className="flex-1 bg-[#060505] border border-[rgba(140,97,54,0.35)] focus:border-[#b58b45] focus:ring-1 focus:ring-[#b58b45]/40 text-[#cfc4b2] placeholder-[#635a4e] text-xs md:text-sm px-3 py-2.5 outline-none font-mono tracking-wider transition"
          />

          {isStreaming ? (
            <button
              type="button"
              onClick={handleAbort}
              className="px-4 py-2.5 bg-[#781414]/25 border border-[#781414] text-[#e07e7e] hover:bg-[#781414]/45 text-xs tracking-wider transition font-bold"
            >
              PRZERWIJ ODCZYT
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-5 py-2.5 bg-[rgba(181,139,69,0.18)] border border-[#b58b45] text-[#e3dac9] hover:bg-[#b58b45] hover:text-[#070707] disabled:opacity-30 disabled:hover:bg-[rgba(181,139,69,0.18)] disabled:hover:text-[#e3dac9] text-xs tracking-wider font-bold transition occult-glow-amber"
            >
              ANALIZUJ
            </button>
          )}
        </form>
      </footer>
    </main>
  );
}
