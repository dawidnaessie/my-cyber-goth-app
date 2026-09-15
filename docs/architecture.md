# Architektura Systemu: NULL://ANOMALY // COGNITIVE DISRUPTOR & ANALOG HORROR LAB

Dokument opisuje architekturę techniczną, decyzje projektowe, modularny silnik audio, silnik dwustanowej optyki wizualnej, przepływ danych oraz standardy Clean Code dla aplikacji **NULL://ANOMALY** – minimalistycznego, produkcyjnego interfejsu konwersacyjnego z pogranicza neurobiologii, bio-fizyki i manipulacji kognitywnej, napędzanego przez oficjalne SDK `@google/genai` oraz bezbloatware'owy silnik audialny (**Web Audio API + HTML5 Audio**).

---

## 1. Minimalistyczny Stos Technologiczny (Zero Bloatware)

W projekcie przyjęto bezkompromisową zasadę **maksymalnej wydajności przy zerowym narzucie zbędnych zależności**:

* **Next.js 15+ (App Router)**: Pełnostosowy framework udostępniający nowoczesny routing serwerowy, optymalizację zasobów oraz natywną obsługę endpointów strumieniowych (`Node.js` runtime).
* **React 19**: Architektura komponentowa oparta na czystych hookach stanu (`useState`, `useRef`, `useCallback`, `useEffect`), bez zewnętrznych bibliotek zarządzania stanem (brak Redux, Zustand, MobX).
* **Modular Sound Engine (Web Audio API + HTML5 Audio)**: Autorski, modułowy silnik audio (`lib/soundEngine.ts`) łączący proceduralną syntezę czystych fal sinusoidalnych z losowym odtwarzaniem organicznych próbek tła. Zero ciężkich bibliotek dźwiękowych (brak Tone.js, Howler.js).
* **@google/genai (v2.22+)**: Oficjalne, nowoczesne SDK firmy Google dla modeli generatywnych Gemini. Używane z pominięciem przestarzałych bibliotek (`google-generativeai`).
* **Dwustanowy Silnik CSS (Tailwind CSS + Pure CSS3)**:
  * **Clean AI Mode**: Sterylna, krystaliczna konsola laboratoryjna high-end AI.
  * **Analog Horror Mode**: Agresywne scanlines CRT, proceduralny film grain (SVG), jitter luminoforu, aberracja chromatyczna i zniekształcenia kineskopu.
* **TypeScript 5.7+**: Ścisła kontrola typów (`strict: true`), zero typów `any`, pełne bezpieczeństwo struktur żądań, zdarzeń i odpowiedzi.

```
+-----------------------------------------------------------------------------------+
|                                  STOS APLIKACJI                                   |
+-----------------------------------------------------------------------------------+
| Warstwa Prezentacji : React 19 Client Component (app/page.tsx)                    |
| Silnik Optyki (2x)  : Clean AI vs. Analog Horror Anomaly (app/globals.css)        |
| Warstwa Audialna    : Modular Sound Engine (lib/soundEngine.ts)                   |
|                       ├── Web Audio API (Sterylna synteza bipów)                 |
|                       └── HTML5 Audio (Próbki organiczne z public/sounds/)        |
| Warstwa Serwerowa   : Next.js Route Handler (app/api/chat/route.ts)               |
| Integracja GenAI    : @google/genai SDK (lib/ai.ts, lib/prompts.ts)               |
| Runtime Serwera     : Node.js 22+ / V8 Engine                                     |
+-----------------------------------------------------------------------------------+
```

---

## 2. Architektura Silnika Audio (Sound Engine)

Silnik audio zaimplementowano w module [lib/soundEngine.ts](file:///lib/soundEngine.ts) jako singleton zarządzający stanem audio, kontekstem dźwiękowym przeglądarki oraz harmonogramem zdarzeń tła.

### Schemat Przepływu Audialnego

```
                     +----------------------------------------+
                     |         STAN INTERFEJSU (UI)           |
                     | opticsOn: boolean | audioEnabled: bool |
                     +-------------------+--------------------+
                                         |
                                         v
                     +----------------------------------------+
                     |              SOUND ENGINE              |
                     |         (lib/soundEngine.ts)           |
                     +---------+--------------------+---------+
                               |                    |
        OPTYKA: WYŁ [ANOMALIA] |                    | OPTYKA: WŁ [STERILE]
                               v                    v
      +----------------------------------+  +----------------------------------+
      |        WARSTWA ORGANICZNA        |  |         SYNTEZA CYFROWA          |
      |          (HTML5 Audio)           |  |         (Web Audio API)          |
      +----------------------------------+  +----------------------------------+
      | Pliki w /public/sounds/:         |  | Generator sinusoidalny:          |
      | - /sounds/breathing.mp4          |  | - OscillatorNode (sine/triangle) |
      | - /sounds/metal.mp4              |  | - GainNode z opadaniem exp       |
      | - /sounds/water.mp4              |  | Impulsy: 880, 1200, 1760, 2400 Hz|
      | Harmonogram: 20-45 sekund        |  | Harmonogram: 15-35 sekund        |
      | Wolumen: 0.20 (podświadomy)      |  | Wolumen: 0.05 (laboratoryjny)    |
      +----------------------------------+  +----------------------------------+
```

### Specyfikacja Techniczna Profilów Audio:

1. **Profil Sterylny (`opticsOn: true`)**:
   - Wykorzystuje natywny `AudioContext`.
   - Generuje czyste, sterylne bipy telemetryczne symulujące aparaturę pomiarową sterylnego laboratorium.
   - Posiada warianty pojedynczego impulsu (1760 Hz), dwutaktowego potwierdzenia telemetrycznego (1200 Hz -> 1600 Hz) oraz akordu harmonicznego (880 Hz + 1320 Hz).
   - Obwiednia amplitudy: natychmiastowy narost (`linearRampToValueAtTime`) oraz szybkie wygaszanie wykładnicze (`exponentialRampToValueAtTime`) do poziomu zera w czasie 80–180 ms.
   - Cykl: losowo co **15–35 sekund**.

2. **Profil Anomalii (`opticsOn: false`)**:
   - Wykorzystuje instancję HTML5 `Audio`.
   - Obsługuje bezpośrednie ścieżki w katalogu publicznym:
     - `/sounds/breathing.mp4`: niepokojący oddech w tle,
     - `/sounds/metal.mp4`: naprężenia konstrukcyjne i chrzęst metalu,
     - `/sounds/water.mp4`: rezonans płynów biologicznych.
   - Głośność ustawiona na stały niski poziom (`0.2`), aby dźwięk nie zagłuszał lektury, lecz stymulował podświadomą czujność probanda.
   - Cykl: losowo co **20–45 sekund**.
   - Przejście do stanu anomalii aktywuje syntezowany spadek częstotliwości piły (`sawtooth` 120 Hz -> 55 Hz), imitujący awarię kineskopu.

3. **Zarządzanie Cyklem Życia i Odporność Przeglądarkowa**:
   - **Autoplay Compliance**: Inicjalizacja `AudioContext.resume()` następuje dopiero po bezpośredniej interakcji probanda z przełącznikiem `AUDIO: WŁ`.
   - **Płynna Zmiana Profilu**: Zmiana stanu przełącznika `OPTYKA` natychmiast zatrzymuje grające próbki organiczne, zeruje timery harmonogramu i inicjuje pętlę nowego profilu.
   - **Bezpieczeństwo SSR**: Wszystkie operacje na obiektach `window`, `AudioContext` i `Audio` są zabezpieczone guardem `typeof window !== 'undefined'`.
   - **Destrukcja**: Metoda `destroy()` oraz `stopAll()` gwarantują zamknięcie strumieni i timerów przy odmontowywaniu komponentu.

---

## 3. Architektura Silnika Optyki (Clean AI vs. Analog Horror)

Przełącznik "OPTYKA" w [app/page.tsx](file:///app/page.tsx) zarządza stanem logicznym `opticsOn`, który steruje dwiema skrajnie odmiennymi modalnościami wizualnymi:

### 1. Tryb Włączony: Clean AI (`opticsOn: true`)
* **Etykieta przycisku**: `OPTYKA: WŁ`
* **Stylistyka**: Nowoczesny, sterylny interfejs badawczy high-end AI.
* **Paleta**: Głęboki laboratoryjny grafit (`#08090e`), krystaliczny cyjan (`#00f0ff`), szmaragd telemetrii (`#10b981`), czysty tekst (`#f4f4f5`).
* **Efekty**: Brak jakichkolwiek zakłóceń, zniekształceń czy winiety CRT. Subtelne, akcelerowane sprzętowo poświaty neonowe (`.clean-glow-cyan`, `.clean-border-glow`).

### 2. Tryb Wyłączony: Analog Horror Anomaly (`opticsOn: false`)
* **Etykieta przycisku**: `OPTYKA: WYŁ [ANOMALIA]`
* **Stylistyka**: Pełny analog horror i rozpad aparatu percepcyjnego.
* **Paleta**: Pusta czerń matrycy (`#050404`), burgund zakrzepłej krwi (`#781414`), karmazyn ostrzegawczy (`#ff1a1a`), pożółkły kościany tekst (`#cfc4b2`).
* **Warstwy wizualne**:
  * `.analog-scanlines`: Siatka poziomych linii kineskopu z subtelnym rozszczepieniem kanałów RGB (`linear-gradient`).
  * `.analog-vignette`: Ciemna winieta głębokiego kineskopu dagerotypowego (`radial-gradient`).
  * `.analog-noise`: Proceduralny szum / film grain generowany jako bezstratny SVG data-URI.
  * `.analog-flicker`: Pętla jittera kineskopu i mikrodrgań luminoforu (`@keyframes crt-jitter`).
  * `.anomaly-chromatic`: Dynamiczna aberracja chromatyczna tekstu (naprzemienne przesunięcie kanałów czerwieni i cyjanu).

---

## 4. Przepływ Danych (Data Flow & Streaming Lifecycle)

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

## 5. Standardy Czystego Kodu (Solo-Dev Clean Code)

1. **Lokalność Zachowań (Locality of Behavior - LoB)**:
   Interakcje, stan optyki, przełącznik audio i obsługa strumieniowania zorganizowane są bezpośrednio w `app/page.tsx` i dedykowanym serwisie `lib/soundEngine.ts`, bez rozpraszania logiki na dziesiątki niepotrzebnych plików.
2. **Puryzm Zależności (Zero Extra Packages)**:
   Interfejs korzysta wyłącznie ze standardowych bibliotek środowiska (`next`, `react`, `react-dom`, `@google/genai`, `tailwindcss`) oraz natywnych Web APIs przeglądarki (`AudioContext`, `HTMLAudioElement`).
3. **Leniwa Inicjalizacja (Lazy Singleton Proxy)**:
   W `lib/ai.ts` instancja `GoogleGenAI` jest opakowana we wzorzec Proxy, zapobiegając błędom budowania (`npm run build`) przy braku zmiennych środowiskowych podczas pre-renderowania.
4. **Ścisłe Typowanie (Strict TypeScript)**:
   Pełne pokrycie typami interfejsów `Message`, `ChatRequestBody`, strumieni, obiektów audio i zdarzeń DOM.

---

## 6. Bezpieczeństwo i Architektura Zero-Trace

1. **Izolacja Poświadczeń**: Klucz `GEMINI_API_KEY` pozostaje hermetycznie zamknięty po stronie serwera w środowisku Node.js (`app/api/chat/route.ts`).
2. **Filtry Bezpieczeństwa Modelu**: Konwencja psychopatycznego laboranta jest konstruktem inżynierii promptów opartym na filtrach bezpieczeństwa Google GenAI SDK (brak instrukcji samookaleczenia czy przemocy).
3. **Architektura Zero-Trace (Pamięć RAM)**: Brak zewnętrznych baz danych i magazynów `localStorage`. Przycisk **PURGE** niszczy cały bufor sesji w pamięci RAM.
