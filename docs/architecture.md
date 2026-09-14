# Architektura Systemu: NULL://ANOMALY // CONTEMPORARY BIO-PHYSICS LAB

Dokument opisuje architekturę techniczną, decyzje projektowe, silnik dwustanowej optyki wizualnej, przepływ danych oraz zasady Clean Code dla aplikacji **NULL://ANOMALY** – minimalistycznego, produkcyjnego interfejsu konwersacyjnego opartego na współczesnej inżynierii promptów, neurobiologii i manipulacji kognitywnej, napędzanego przez oficjalne SDK `@google/genai`.

---

## 1. Minimalistyczny Stos Technologiczny (Zero Bloatware)

W projekcie przyjęto bezkompromisową zasadę **maksymalnej wydajności przy zerowym narzucie bloatware'u**:

* **Next.js 15+ (App Router)**: Pełnostosowy framework udostępniający nowoczesny routing serwerowy, optymalizację zasobów oraz natywną obsługę endpointów strumieniowych (`Node.js` runtime).
* **React 19**: Architektura komponentowa oparta na czystych hookach stanu (`useState`, `useRef`, `useCallback`, `useEffect`), bez zewnętrznych bibliotek zarządzania stanem (brak Redux, Zustand, MobX).
* **@google/genai (v2.22+)**: Oficjalne, nowoczesne SDK firmy Google dla modeli generatywnych Gemini. Używane z pominięciem przestarzałych bibliotek (`google-generativeai`).
* **Dwustanowy Silnik CSS (Tailwind CSS + Pure CSS3)**:
  * **Clean AI Mode**: Sterylna, krystaliczna konsola laboratoryjna high-end AI.
  * **Analog Horror Mode**: Agresywne scanlines CRT, proceduralny film grain, jitter luminoforu, aberracja chromatyczna i zniekształcenia kineskopu.
* **TypeScript 5.7+**: Ścisła kontrola typów (`strict: true`), zero typów `any`, pełne bezpieczeństwo struktur żądań i odpowiedzi.

```
+-----------------------------------------------------------------------------------+
|                                  STOS APLIKACJI                                   |
+-----------------------------------------------------------------------------------+
| Warstwa Prezentacji : React 19 Client Component (app/page.tsx)                    |
| Silnik Optyki (2x)  : Clean AI vs. Analog Horror Anomaly (app/globals.css)        |
| Warstwa Serwerowa   : Next.js Route Handler (app/api/chat/route.ts)               |
| Integracja GenAI    : @google/genai SDK (lib/ai.ts, lib/prompts.ts)               |
| Runtime Serwera     : Node.js 22+ / V8 Engine                                     |
+-----------------------------------------------------------------------------------+
```

---

## 2. Architektura Silnika Optyki (Clean AI vs. Analog Horror)

Przełącznik "OPTYKA" w [app/page.tsx](file:///app/page.tsx) zarządza stanem logicznym `opticsOn`, który steruje dwiema skrajnie różnymi estetykami interfejsu:

### 1. Tryb Włączony: Clean AI (`opticsOn: true`)
* **Etykieta przycisku**: `OPTYKA: WŁ`
* **Stylistyka**: Nowoczesny, sterylny interfejs badawczy high-end AI.
* **Paleta**: Głęboki laboratoryjny grafit (`#08090e`), krystaliczny cyjan (`#00f0ff`), szmaragd telemetrii (`#10b981`), czysty tekst (`#f4f4f5`).
* **Efekty**: Brak jakichkolwiek zakłóceń, zniekształceń czy winiety CRT. Subtelne, akcelerowane sprzętowo poświaty neonowe (`.clean-glow-cyan`, `.clean-border-glow`).

### 2. Tryb Wyłączony: Analog Horror Anomaly (`opticsOn: false`)
* **Etykieta przycisku**: `OPTYKA: WYŁ [ANOMALIA]`
* **Stylistyka**: Pełny analog horror i awaria percepcji.
* **Paleta**: Pusta czerń matrycy (`#050404`), burgund zakrzepłej krwi (`#781414`), karmazyn ostrzegawczy (`#ff1a1a`), pożółkły kościany tekst (`#cfc4b2`).
* **Warstwy wizualne**:
  * `.analog-scanlines`: Siatka poziomych linii kineskopu z subtelnym rozszczepieniem kanałów RGB (`linear-gradient`).
  * `.analog-vignette`: Ciemna winieta głębokiego kineskopu dagerotypowego (`radial-gradient`).
  * `.analog-noise`: Proceduralny szum / film grain generowany jako bezstratny SVG data-URI.
  * `.analog-flicker`: Pętla jittera kineskopu i mikrodrgań luminoforu (`@keyframes crt-jitter`).
  * `.anomaly-chromatic`: Dynamiczna aberracja chromatyczna tekstu (naprzemienne przesunięcie kanałów czerwieni i cyjanu).

---

## 3. Przepływ Danych (Data Flow & Streaming Lifecycle)

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

### Etapy Przetwarzania:
1. **Inicjacja Transmisji (Frontend)**: Rejestracja wiadomości użytkownika w stanie React i otwarcie węzła diagnostycznego `assistant` z `isStreaming: true`.
2. **Normalizacja Żądania (Backend)**: Walidacja tablicy komunikatów i rygorystyczne mapowanie ról (`user` / `model`) do formatu wymaganego przez SDK Gemini.
3. **Iniekcja Promptu Systemowego**: Dołączenie bezkompromisowego rurociągu obliczeniowego `SYSTEM_PROMPT` opartego na bio-fizyce i teoriach informacji.
4. **Enkodowanie Strumienia**: Transformacja asynchronicznego generatora tokenów z SDK Gemini do strumienia binarnego `ReadableStream` za pomocą `TextEncoder`.
5. **Obsługa Przerwania (Abort)**: Wykorzystanie natywnego `AbortController` – kliknięcie **PRZERWIJ ODCZYT** natychmiastowo zamyka połączenie HTTP i zwalnia zasoby inferencji.

---

## 4. Standardy Czystego Kodu (Solo-Dev Clean Code)

1. **Lokalność Zachowań (Locality of Behavior - LoB)**:
   Wszystkie interakcje, stan optyki i obsługa strumieniowania zorganizowane są w `app/page.tsx`, bez rozpraszania logiki na dziesiątki drobnych plików.
2. **Puryzm Zależności (Zero Extra Packages)**:
   Interfejs korzysta wyłącznie ze standardowych bibliotek środowiska (`next`, `react`, `react-dom`, `@google/genai`, `tailwindcss`).
3. **Leniwa Inicjalizacja (Lazy Singleton Proxy)**:
   W `lib/ai.ts` instancja `GoogleGenAI` jest opakowana we wzorzec Proxy, zapobiegając błędom budowania (`npm run build`) przy braku zmiennych środowiskowych podczas pre-renderowania.
4. **Ścisłe Typowanie (Strict TypeScript)**:
   Pełne pokrycie typami interfejsów `Message`, `ChatRequestBody`, strumieni i zdarzeń DOM.

---

## 5. Struktura Plików

```
my-cyber-goth-app/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts         # Endpoint streamingowy POST (@google/genai)
│   ├── globals.css              # Silnik stylów Clean AI & Analog Horror Anomaly
│   ├── layout.tsx               # Root layout z czystym canvasem i metadanymi
│   └── page.tsx                 # Konsola diagnostyczna z obsługą OPTYKA (Client Component)
├── docs/
│   ├── architecture.md          # Niniejsza specyfikacja architektury
│   └── system-design-and-rules.md # Manifest kognitywny, filozofia promptu i bezpieczeństwo
├── lib/
│   ├── ai.ts                    # Leniwa inicjalizacja klienta GoogleGenAI (bezpieczny build)
│   └── prompts.ts               # Traktat SYSTEM_PROMPT (Psychopathic Bio-Physics & Matrix Diagnostics)
├── .env.example                 # Szablon zmiennych środowiskowych
├── package.json                 # Czysty manifest zależności (Next 15, React 19, Tailwind)
├── postcss.config.js            # Konfiguracja PostCSS
├── tailwind.config.js           # Konfiguracja rozszerzeń stylów
└── tsconfig.json                # Rygorystyczna konfiguracja TypeScript
```
