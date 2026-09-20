'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSystemState } from '@/components/SystemStateContext';
import { useChat, Message } from '@/components/ChatContext';
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

/**
 * Zmemoizowany komponent pojedynczej wiadomości.
 * Zapobiega ponownemu przeliczaniu KaTeX i re-renderowaniu historycznych wiadomości
 * podczas pisania w formularzu lub streamowania nowych słów.
 */
const ChatMessageItem = React.memo(function ChatMessageItem({
  msg,
  isDistorted,
}: {
  msg: Message;
  isDistorted: boolean;
}) {
  const isUser = msg.role === 'user';
  const hasContent = typeof msg.content === 'string' && msg.content.trim().length > 0;

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-3xl rounded-xl p-4 text-xs md:text-sm leading-relaxed transition-all shadow-sm ${
          isUser
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
            {isUser
              ? 'UŻYTKOWNIK // BADAWCA:'
              : isDistorted
              ? '⚡ DR. ARIS THORNE [KONEKTOM]:'
              : 'BioResearcher AI™:'}
          </span>
          <span className="ml-3">{msg.timestamp}</span>
        </div>

        <div className="break-words">
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
          ) : hasContent ? (
            <>
              <MarkdownRenderer content={msg.content} isDistorted={isDistorted} />
              {msg.isStreaming && (
                <span
                  className={`inline-block w-2 h-3.5 ml-1 align-middle ${
                    isDistorted ? 'bg-red-500 animate-pulse' : 'bg-sky-500 animate-pulse'
                  }`}
                />
              )}
            </>
          ) : msg.isStreaming ? (
            <div className="flex items-center gap-2 py-1 font-mono text-xs opacity-75">
              <span
                className={`inline-block w-2 h-2 rounded-full animate-ping ${
                  isDistorted ? 'bg-red-500' : 'bg-sky-500'
                }`}
              />
              <span className="italic">
                {isDistorted ? '[REJESTRACJA SYGNAŁU SEKTOR-7...]' : '[TRANSMISJA DANYCH KLASTRA...]'}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
});

/**
 * Formularz wprowadzania wiadomości z w pełni lokalnym stanem (Zero-Lag Typing).
 * Pisanie na klawiaturze odświeża wyłącznie ten komponent – zero wpływu na listę wiadomości i layout.
 */
const ChatInputForm = React.memo(function ChatInputForm({
  onSend,
  isStreaming,
  isDistorted,
  abortStream,
}: {
  onSend: (text: string) => void;
  isStreaming: boolean;
  isDistorted: boolean;
  abortStream: () => void;
}) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isStreaming) return;

    soundEngine.playKeystroke();
    onSend(trimmed);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <footer
      className={`p-3 rounded-xl border transition-all ${
        isDistorted
          ? 'bg-[#0a0505] border-[#781414] anomaly-border-blood'
          : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 shadow-sm'
      }`}
    >
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
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
            disabled={!inputValue.trim()}
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
  );
});

export default function ChatPage() {
  const { opticsOn, sanityStage } = useSystemState();
  const { messages, isStreaming, errorMessage, sendMessage, clearChat, abortStream } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef<boolean>(true);

  const isDistorted = !opticsOn || sanityStage === 'insanity';

  // Inteligentne przewijanie do dołu
  const scrollToBottom = useCallback((force = false) => {
    if (!chatContainerRef.current) return;
    if (force || isAtBottomRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    isAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 60;
  }, []);

  useEffect(() => {
    if (isAtBottomRef.current) {
      scrollToBottom(false);
    }
  }, [messages, scrollToBottom]);

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
                {sanityStage === 'insanity'
                  ? 'ARIS THORNE // KONEKTOM VMEbus SEKTOR-7'
                  : isDistorted
                  ? 'BIORESEARCHER AI // ANOMALIA REJESTRÓW THORNE-94'
                  : 'BioResearcher AI™ v4.2 // Bio-Text Composer'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                {isDistorted
                  ? 'KONEKTOM CA1 AKTYWNY // TRANSMISJA ZWEKTORYZOWANA'
                  : 'Moduł redakcyjny monografii klinicznej (Dr. Marcus H. Weber)'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={clearChat}
              className={`text-xs px-3 py-1.5 rounded-lg border font-mono transition shadow-sm ${
                isDistorted
                  ? 'border-red-900 bg-red-950/40 text-red-300 hover:bg-red-900/60'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              [PURGE BUFFER]
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono opacity-80">
          <div>
            STATUS: <span className="font-bold">{isStreaming ? 'INFERENCJA W TOKU' : 'GOTOWY DO ANALIZY'}</span>
          </div>
          <div>
            SANITY STAGE:{' '}
            <span
              className={`font-bold uppercase ${
                sanityStage === 'insanity'
                  ? 'text-red-500 animate-pulse'
                  : sanityStage === 'error'
                  ? 'text-amber-500'
                  : 'text-emerald-500'
              }`}
            >
              {sanityStage}
            </span>
          </div>
        </div>
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
          <ChatMessageItem key={msg.id} msg={msg} isDistorted={isDistorted} />
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
      <ChatInputForm
        onSend={sendMessage}
        isStreaming={isStreaming}
        isDistorted={isDistorted}
        abortStream={abortStream}
      />
    </div>
  );
}
