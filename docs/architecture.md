# Architektura Systemu: NULL://SIGNAL (Cyber-Goth AI Terminal)

Dokument opisuje architekturę techniczną, decyzje projektowe, przepływ danych oraz zasady Clean Code dla aplikacji **NULL://SIGNAL** – minimalistycznego, produkcyjnego interfejsu konwersacyjnego w stylistyce cyber-goth / dark industrial, napędzanego przez najnowsze SDK `@google/genai`.

---

## 1. Minimalistyczny Stos Technologiczny (Zero Bloatware)

W projekcie przyjęto bezkompromisową zasadę **maksymalnej wydajności przy minimalnym narzucie zależności**:

* **Next.js 15+ (App Router)**: Framework pełnoekranowy (Fullstack) udostępniający nowoczesny routing serwerowy, optymalizację zasobów oraz natywną obsługę endpointów strumieniowych (Node.js runtime).
* **React 19**: Architektura komponentowa oparta na natywnych hookach stanu (`useState`, `useRef`, `useCallback`, `useEffect`), bez potrzeby instalowania zewnętrznych zarządców stanu (Redux, Zustand, MobX).
* **@google/genai (v2.22+)**: Oficjalne, nowoczesne SDK firmy Google dla modeli generatywnych Gemini. Używane z pominięciem przestarzałych bibliotek (`google-generativeai`).
* **Tailwind CSS (v3.4+) + Czysty CSS**: Stylizacja bez zewnętrznych bibliotek UI (Brak Radix, MUI, Chakra czy ciężkich bibliotek animacji). CRT scanlines, neon glow i flicker zaimplementowane sprzętowo w czystym CSS.
* **TypeScript 5.7+**: Ścisła kontrola typów (`strict: true`), zero typów `any`, pełna walidacja struktur żądań i odpowiedzi.

```
+-------------------------------------------------------------------------+
|                              STOS APLIKACJI                             |
+-------------------------------------------------------------------------+
| Warstwa UI         : React 19 Client Component (app/page.tsx)           |
| Stylizacja         : Tailwind CSS + CSS3 Scanlines/CRT (globals.css)    |
| Warstwa Serwera    : Next.js Route Handler (app/api/chat/route.ts)      |
| Integracja GenAI   : @google/genai SDK (lib/ai.ts, lib/prompts.ts)       |
| Runtime & Maszyna  : Node.js 22+ / V8 Engine                            |
+-------------------------------------------------------------------------+
```

---

## 2. Przepływ Danych (Data Flow & Streaming Lifecycle)

Komunikacja pomiędzy użytkownikiem a modelem odbywa się w trybie **Server-Sent Streaming** przy użyciu natywnych interfejsów standardu **Web Streams API** (`ReadableStream` i `TextDecoder`).

### Diagram Sekwencji

```
[Przeglądarka / Terminal]         [Next.js API Handler]           [Google Gemini API]
           |                                |                             |
           |--- 1. POST /api/chat --------->|                             |
           |    { messages: [...] }         |                             |
           |                                |-- 2. Inicjalizacja klienta->|
           |                                |   generateContentStream()   |
           |                                |                             |
           |                                |<-- 3. Strumień chunków -----|
           |<-- 4. HTTP 200 (Chunked) ------|                             |
           |    ReadableStream (UTF-8)      |                             |
           |                                |                             |
           |=== 5. Pętla reader.read() ====>|                             |
           |    renderowanie cząstkowe UI   |                             |
           |                                |                             |
           |<-- 6. Koniec transmisji -------|<-- Strumień zakończony -----|
```

### Kroki Procesu:
1. **Inicjacja Transmisji (Frontend)**:
   Użytkownik wysyła impuls tekstowy. Aplikacja natychmiast rejestruje węzeł wiadomości użytkownika oraz tworzy pusty węzeł asystenta ze statusem `isStreaming: true`.
2. **Przetwarzanie Żądania (Backend)**:
   Endpoint `app/api/chat/route.ts` waliduje payload i mapuje role (`user` -> `user`, `assistant` -> `model`) do formatu wymaganego przez SDK `@google/genai`.
3. **Iniekcja Promptu Systemowego**:
   Do konfiguracji żądania dołączany jest ezoteryczny prompt `SCHIZO_SYSTEM_PROMPT` definiujący tożsamość bytu anomalii oraz parametry generacji (np. `temperature: 0.85`).
4. **Enkodowanie Strumienia**:
   Zwracany jest obiekt `NextResponse` opakowany w `ReadableStream`. Każdy przychodzący chunk tekstu z `ai.models.generateContentStream` jest enkodowany przez `TextEncoder` i niezwłocznie przesyłany potokiem HTTP do przeglądarki.
5. **Dekodowanie w Czasie Rzeczywistym (Frontend)**:
   Metoda `reader.read()` odczytuje fragmenty binarne, a `TextDecoder` łączy je w ciąg znaków, symulując płynne pisanie terminala (typing effect). W przypadku kliknięcia **ABORT**, `AbortController` natychmiast zrywa połączenie sieciowe.

---

## 3. Zasady Czystego Kodu dla Jednoosobowego Inżyniera (Solo-Dev Clean Code)

Tworzenie i utrzymanie zaawansowanego projektu przez jedną osobę wymaga rygoru eliminującego tzw. dług poznawczy (cognitive overload):

1. **Lokalność Zachowań (Locality of Behavior - LoB)**:
   Logika komponentu terminala znajduje się w jednym, spójnym module `app/page.tsx`. Zamiast dzielić 300 linii kodu na kilkanaście mikroskopijnych plików (`TerminalHeader`, `TerminalStatus`, `TerminalInput`, `TerminalLog`), zachowano jednolity kontekst.
2. **Brak Nadmiarowych Abstrakcji (No Speculative Generality)**:
   Nie tworzymy uniwersalnych warstw serwisowych typu `RepositoryPattern`, `ChatServiceAdapterFactory` czy `MessageEntityMapper`, dopóki nie ma realnej potrzeby integracji wielu baz danych lub alternatywnych dostawców AI.
3. **Odporność na Błędy Środowiskowe (Resilience & Lazy Initialization)**:
   Klient `@google/genai` w `lib/ai.ts` inicjalizowany jest leniwie (Lazy Singleton z `Proxy`). Zapobiega to awarii procesu budowania Next.js (`npm run build`), gdy klucz `GEMINI_API_KEY` jest dostępny dopiero w środowisku produkcyjnym runtime.
4. **Jawna Obsługa Błędów (Fail-Safe Terminal UX)**:
   Każdy błąd API (np. brak klucza, przekroczenie limitów zapytań, timeout sieci) jest wyłapywany przez blok `try...catch` i tłumaczony na spójny, klimatyczny komunikat terminala (`[KRYTYCZNE ZAKŁÓCENIE MATRYCY]`).

---

## 4. Struktura Plików

```
my-cyber-goth-app/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts         # Endpoint streamingowy POST z obsługą @google/genai
│   ├── globals.css              # Globalne style, CRT scanlines, flicker, neon glow
│   ├── layout.tsx               # Root layout z metadanymi i nakładką CRT
│   └── page.tsx                 # Główny interfejs terminala cyber-goth (Client Component)
├── docs/
│   ├── architecture.md          # Niniejsza specyfikacja architektury i przepływu danych
│   └── system-design-and-rules.md # Manifest projektowy, wytyczne UI/UX i bezpieczeństwo
├── lib/
│   ├── ai.ts                    # Leniwa inicjalizacja klienta GoogleGenAI
│   └── prompts.ts               # Ezoteryczny system prompt (anomalia/schizo-byt)
├── .env.example                 # Szablon zmiennych środowiskowych
├── package.json                 # Czysty manifest zależności (Next 15, React 19, Tailwind)
├── postcss.config.js            # Konfiguracja PostCSS
├── tailwind.config.js           # Konfiguracja kolorów cyber-goth i animacji
└── tsconfig.json                # Rygorystyczna konfiguracja TypeScript
```
