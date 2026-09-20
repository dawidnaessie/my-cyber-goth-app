'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useSystemState } from './SystemStateContext';
import { soundEngine } from '@/lib/soundEngine';
import { SanityStage } from '@/lib/prompts';
import { calculateSanityMetrics } from '@/lib/sanityEngine';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isStreaming: boolean;
  errorMessage: string | null;
  sendMessage: (textToSend: string) => Promise<void>;
  clearChat: () => void;
  abortStream: () => void;
}

export const INITIAL_CORPORATE_LOGS: Message[] = [
  {
    id: 'boot-1',
    role: 'assistant',
    timestamp: '08:45:00',
    content:
      'Dzień dobry. Moduł Bio-Text Composer™ (BioResearcher AI v4.2) został pomyślnie zainicjalizowany w środowisku analitycznym NeuroClin Biosciences. Załadowano uniwersalny profil analityczny nauk biologicznych, biochemii, farmakokinetyki i biofizyki komórkowej.\n\nSłużę wszechstronnym wsparciem w projektowaniu assayów laboratoryjnych (ELISA, Simoa, UHPLC-MS/MS, RNA-Seq), kinetyce enzymatycznej (modele Michaelisa-Menten, inhibicja), farmakodynamice, modulacji receptorowej, biomarkerach molekularnych oraz formalizmie biofizycznym. W jakim zagadnieniu mogę pomóc w Twoim bieżącym protokole badawczym?',
  },
];

const CHAT_STORAGE_KEY = 'neuroclin_chat_history';

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { sanityStage, setSanityStage, triggerGlitch } = useSystemState();

  const [messages, setMessages] = useState<Message[]>(INITIAL_CORPORATE_LOGS);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<Message[]>(messages);
  messagesRef.current = messages;

  const sanityStageRef = useRef<SanityStage>(sanityStage);
  sanityStageRef.current = sanityStage;

  // Bezpieczna synchronizacja z localStorage po stronie klienta (brak hydration error)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filtrujemy jakiekolwiek historyczne puste dymki
          const sanitized = parsed
            .filter((m: Message) => typeof m.content === 'string' && m.content.trim().length > 0)
            .map((m: Message) => ({
              ...m,
              isStreaming: false,
            }));
          if (sanitized.length > 0) {
            setMessages(sanitized);

            // Dynamiczna rekoncyliacja stanu Sanity z wczytaną historią wiadomości
            const userTexts = sanitized
              .filter((m: Message) => m.role === 'user')
              .map((m: Message) => m.content);
            const metrics = calculateSanityMetrics(userTexts);
            setSanityStage(metrics.stage);
            return;
          }
        }
      }
      // Jeżeli brak zapisanych wiadomości – upewnij się, że stadium to czysty stan korporacyjny SANE
      setSanityStage('sane');
    } catch {
      // Ignorowanie błędów w trybie prywatnym / SSR
    }
  }, [setSanityStage]);

  const saveMessagesToStorage = useCallback((msgs: Message[]) => {
    try {
      // Zapisujemy wyłącznie wiadomości z rzeczywistą zawartością tekstową (zero pustych dymków w storage)
      const toSave = msgs
        .filter((m) => typeof m.content === 'string' && m.content.trim().length > 0)
        .map((m) => ({ ...m, isStreaming: false }));
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // Ignorowanie błędów zapisu do localStorage
    }
  }, []);

  const abortStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const clearChat = useCallback(() => {
    soundEngine.playKeystroke();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setMessages(INITIAL_CORPORATE_LOGS);
    setErrorMessage(null);
    setIsStreaming(false);
    setSanityStage('sane');
    try {
      localStorage.removeItem(CHAT_STORAGE_KEY);
      localStorage.setItem('neuroclin_sanity_stage', 'sane');
    } catch {
      // Ignorowanie błędów w trybie prywatnym
    }
  }, [setSanityStage]);

  const sendMessage = useCallback(
    async (textToSend: string) => {
      const trimmed = textToSend?.trim();
      if (!trimmed || isStreaming) return;

      if (
        trimmed.toLowerCase() === '/clear' ||
        trimmed.toLowerCase() === 'clear' ||
        trimmed.toLowerCase() === '/reset' ||
        trimmed.toLowerCase() === 'reset'
      ) {
        clearChat();
        return;
      }

      setErrorMessage(null);

      // PŁYNNA PROGRESJA SANITY NA PODSTAWIE HISTORII ZAPYTAŃ UŻYTKOWNIKA
      const currentMessages = messagesRef.current;
      const priorUserTexts = currentMessages
        .filter((m) => m.role === 'user')
        .map((m) => m.content);
      const updatedUserTexts = [...priorUserTexts, trimmed];

      const currentMetrics = calculateSanityMetrics(updatedUserTexts);
      const targetStage = currentMetrics.stage;
      const previousStage = sanityStageRef.current;

      setSanityStage(targetStage);
      if (targetStage === 'error' && previousStage !== 'error') {
        triggerGlitch(2000);
      }

      const effectiveStage: SanityStage = targetStage;

      const getTimestamp = (): string => {
        const now = new Date();
        return now.toTimeString().split(' ')[0];
      };

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

      const nextMessages = [...currentMessages, userMessage, assistantPlaceholder];
      setMessages(nextMessages);
      setIsStreaming(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...currentMessages, userMessage].map((m) => ({
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
        }

        const finalMessages: Message[] = [...nextMessages];
        const lastIdx = finalMessages.length - 1;
        if (lastIdx >= 0 && finalMessages[lastIdx].role === 'assistant') {
          if (!accumulatedContent.trim()) {
            // Jeśli strumień zakończył się bez ani jednego znaku tekstu, usuwamy pusty dymek
            finalMessages.splice(lastIdx, 1);
          } else {
            finalMessages[lastIdx] = {
              ...finalMessages[lastIdx],
              content: accumulatedContent,
              isStreaming: false,
            };
          }
        }
        setMessages(finalMessages);
        saveMessagesToStorage(finalMessages);

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
                content: copy[lastIdx].content
                  ? `${copy[lastIdx].content}\n\n[POŁĄCZENIE PRZERWANE PRZEZ KLIENTA]`
                  : '[POŁĄCZENIE PRZERWANE PRZEZ KLIENTA]',
                isStreaming: false,
              };
            }
            saveMessagesToStorage(copy);
            return copy;
          });
        } else {
          const rawMessage = err instanceof Error ? err.message : String(err);
          const isNetworkError =
            rawMessage.toLowerCase().includes('failed to fetch') ||
            rawMessage.toLowerCase().includes('network') ||
            rawMessage.toLowerCase().includes('load failed');

          const fallbackText = isNetworkError
            ? '[BŁĄD KLASTRA Sektor-7: Utraceno synchronizację węzłów obliczeniowych. Przełączono na bufor lokalny.]\n\n[TRANSMISJA PRZERWANA]: Brak odpowiedzi z interfejsu sieciowego klastra. Bufor lokalny zabezpieczył wprowadzone zapytanie badawcze. Sprawdź połączenie i ponów próbę.'
            : rawMessage;

          setMessages((prev) => {
            const copy = [...prev];
            const lastIdx = copy.length - 1;
            if (lastIdx >= 0 && copy[lastIdx].role === 'assistant') {
              copy[lastIdx] = {
                ...copy[lastIdx],
                content: copy[lastIdx].content
                  ? `${copy[lastIdx].content}\n\n${fallbackText}`
                  : fallbackText,
                isStreaming: false,
              };
            }
            saveMessagesToStorage(copy);
            return copy;
          });

          if (!isNetworkError) {
            setErrorMessage(rawMessage);
          }
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [isStreaming, clearChat, saveMessagesToStorage, setSanityStage, triggerGlitch]
  );

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        isStreaming,
        errorMessage,
        sendMessage,
        clearChat,
        abortStream,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat(): ChatContextType {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
