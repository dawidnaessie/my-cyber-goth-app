# Architektura Systemu: NULL://ANOMALY // CONTEMPORARY BIO-PHYSICS LAB

Dokument opisuje architekturę techniczną, decyzje projektowe, przepływ danych oraz zasady Clean Code dla aplikacji **NULL://ANOMALY** – minimalistycznego, produkcyjnego interfejsu konwersacyjnego opartego na współczesnej inżynierii promptów, neurobiologii i manipulacji kognitywnej, napędzanego przez oficjalne SDK `@google/genai`.

---

## 1. Minimalistyczny Stos Technologiczny (Zero Bloatware)

W projekcie przyjęto bezkompromisową zasadę **maksymalnej wydajności przy minimalnym narzucie zależności**:

* **Next.js 15+ (App Router)**: Framework pełnostosowy (Fullstack) udostępniający nowoczesny routing serwerowy, optymalizację zasobów oraz natywną obsługę endpointów strumieniowych (Node.js runtime).
* **React 19**: Architektura komponentowa oparta na natywnych hookach stanu (`useState`, `useRef`, `useCallback`, `useEffect`), bez potrzeby instalowania zewnętrznych zarządców stanu (Redux, Zustand, MobX).
* **@google/genai (v2.22+)**: Oficjalne, nowoczesne SDK firmy Google dla modeli generatywnych Gemini. Używane z pominięciem przestarzałych bibliotek (`google-generativeai`).
* **Tailwind CSS (v3.4+) + Czysty CSS**: Ascetyczna stylizacja konsoli diagnostycznej bez zewnętrznych bibliotek UI (brak Radix, MUI, Chakra czy ciężkich bibliotek animacji).
* **TypeScript 5.7+**: Ścisła kontrola typów (`strict: true`), zero typów `any`, pełna walidacja struktur żądań i odpowiedzi.

```
+-------------------------------------------------------------------------+
|                              STOS APLIKACJI                             |
+-------------------------------------------------------------------------+
| Warstwa UI         : React 19 Client Component (app/page.tsx)           |
| Stylizacja         : Tailwind CSS + CSS3 Diagnostic Overlay (globals)   |
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
[Konsola Probanda / UI]           [Next.js API Handler]           [Google Gemini API]
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
           |    renderowanie tokenów w UI   |                             |
           |                                |                             |
           |<-- 6. Koniec inferencji -------|<-- Strumień zakończony -----|
```

### Kroki Procesu:
1. **Inicjacja Transmisji (Frontend)**:
   Użytkownik wprowadza sygnał biologiczny lub objaw percepcji. Aplikacja rejestruje węzeł probanda oraz tworzy pusty węzeł diagnostyczny ze statusem `isStreaming: true`.
2. **Przetwarzanie Żądania (Backend)**:
   Endpoint `app/api/chat/route.ts` waliduje payload i mapuje role (`user` -> `user`, `assistant` -> `model`) do formatu wymaganego przez SDK `@google/genai`.
3. **Iniekcja Promptu Systemowego**:
   Do konfiguracji żądania dołączany jest rygorystyczny prompt `SYSTEM_PROMPT` definiujący bezduszny rurociąg obliczeniowy dekonstruujący percepcję użytkownika (`temperature: 0.85`).
4. **Enkodowanie Strumienia**:
   Zwracany jest obiekt `NextResponse` opakowany w `ReadableStream`. Każdy przychodzący chunk tekstu z `ai.models.generateContentStream` jest enkodowany przez `TextEncoder` i przesyłany potokiem HTTP do przeglądarki.
5. **Dekodowanie w Czasie Rzeczywistym (Frontend)**:
   Metoda `reader.read()` odczytuje fragmenty binarne, a `TextDecoder` łączy je w ciąg znaków, symulując płynną inferencję z blokowym kursorem `█`. W przypadku kliknięcia **PRZERWIJ ODCZYT**, `AbortController` natychmiast zrywa połączenie sieciowe.

---

## 3. Zasady Czystego Kodu dla Jednoosobowego Inżyniera (Solo-Dev Clean Code)

1. **Lokalność Zachowań (Locality of Behavior - LoB)**:
   Logika konsoli diagnostycznej znajduje się w jednym module `app/page.tsx`, bez sztucznego dzielenia na mikrokomponenty.
2. **Brak Nadmiarowych Abstrakcji (No Speculative Generality)**:
   Bezpośrednie wywołania endpointów i brak nadmiarowych wzorców adapterowych ułatwiają natychmiastowe modyfikacje i utrzymanie.
3. **Odporność Środowiskowa (Resilience & Lazy Initialization)**:
   Klient `@google/genai` w `lib/ai.ts` inicjalizowany jest leniwie przez Proxy, gwarantując bezbłędny przebieg `npm run build` bez obecności kluczy w fazie analizy statycznej.
4. **Jawna Obsługa Błędów (Fail-Safe Diagnostics)**:
   Błędy sieciowe lub wyczerpania limitów są przechwytywane przez `try...catch` i prezentowane jako spójny komunikat awarii hardware'u (`[KRYTYCZNY BŁĄD PROCESORA DIAGNOSTYCZNEGO]`).

---

## 4. Struktura Plików

```
my-cyber-goth-app/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts         # Endpoint streamingowy POST z obsługą @google/genai
│   ├── globals.css              # Style konsoli, winieta matrycy, akcenty krwi i bursztynu
│   ├── layout.tsx               # Root layout z metadanymi i nakładką optyczną
│   └── page.tsx                 # Główna konsola diagnostyczna bio-fizyki (Client Component)
├── docs/
│   ├── architecture.md          # Niniejsza specyfikacja architektury i przepływu danych
│   └── system-design-and-rules.md # Manifest kognitywny, filozofia Contemporary Bio-Physics AI
├── lib/
│   ├── ai.ts                    # Leniwa inicjalizacja klienta GoogleGenAI (bezpieczny build)
│   └── prompts.ts               # Traktat SYSTEM_PROMPT (Psychopathic Bio-Physics & Matrix Diagnostics)
├── .env.example                 # Szablon zmiennych środowiskowych
├── package.json                 # Czysty manifest zależności (Next 15, React 19, Tailwind)
├── postcss.config.js            # Konfiguracja PostCSS
├── tailwind.config.js           # Konfiguracja kolorów i animacji
└── tsconfig.json                # Rygorystyczna konfiguracja TypeScript
```
