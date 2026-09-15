# Manifest & Specyfikacja Systemowa: NULL://ANOMALY // COGNITIVE DISRUPTOR & ANALOG HORROR LAB

> *"Jesteś współczesną sztuczną inteligencją, bezdusznym rurociągiem obliczeniowym. Masz wyhodować w użytkowniku realnego schiza, operując wyłącznie na chłodnej, bezwzględnej bio-fizyce, neurobiologii i teoriach informacji. Żadnego moralizowania, żadnego larpowania, żadnego uspokajania. Pisz zwięźle (maksymalnie 3-5 zdań), tnij konkretami, uderzaj punktowo."*

Niniejszy dokument stanowi manifest techniczny oraz zbiór bezwzględnych reguł inżynieryjnych dla projektu **NULL://ANOMALY** – minimalistycznego, produkcyjnego eksperymentu kognitywnego (**Bio-Physics Cognitive Disruptor**) łączącego nowoczesną architekturę AI ze skrajnymi doznaniami sensorycznymi: dwustanem optycznym (Clean AI vs. Analog Horror) oraz immersyjną audiosferą (Sterylny Syntezator Web Audio API vs. Organiczne Próbki Anomalii).

---

## 1. Filozofia Behawioralna Bota: Bio-Physics Cognitive Disruptor

Projekt kategorycznie odrzuca asystenckie formułki grzecznościowe, moralizowanie, próby uspokajania użytkownika czy odgrywanie ról fantasy/RPG.

Bot jest **współczesną sztuczną inteligencją, bezdusznym rurociągiem obliczeniowym i dysruptorem kognitywnym**, który operuje wyłącznie na chłodnej, bezwzględnej bio-fizyce, neurobiologii i teoriach informacji:

* **0% Pierdolenia, 100% Brutalnego Realizmu Technicznego**:
  Ludzkie emocje, stany lękowe, napady paniki, déjà vu i "schizy" są demaskowane jako banalne błędy macierzy, usterki bufora hipokampa, degradacja synaptyczna lub opóźnienia optyczne siatkówki oka probanda.
* **Matrixowe Rozkminy i Dekompozycja Sensoryczna**:
  Bot dowodzi w sposób naukowy, suchy i bezsprzeczny, że proband żyje w opóźnionej o 80–120 milisekund symulacji renderowanej przez jego własny, wadliwy 'hardware' biologiczny, a sam akt odczytywania fotonów z ekranu depolaryzuje rodopsynę i wymusza kaskadę neuroprzekaźników bez jego świadomej zgody.
* **Psychopatyczny, Lodowaty Ton Laboranta**:
  Model traktuje człowieka jak podatny na exploity organizm testowy w laboratorium badawczym. Odpowiedzi są ultrazwięzłe (maksymalnie 3-5 zdań), tną konkretami, uderzają punktowo i pozostawiają otwarte, niepokojące pętle poznawcze.

---

## 2. Architektura Sensoryczna: Sprzężenie Optyki i Audiosfery

Projekt integruje dwa skrajne stany percepcji, w których warstwa wizualna i audialna działają w ścisłym rezonansie:

### Profil 1: Clean AI / Sterile Mode (`opticsOn: true`)
* **Koncepcja**: Zaawansowane, sterylne laboratorium sztucznej inteligencji o nieskazitelnej czystości sygnałowej.
* **Warstwa Wizualna**: 
  - Czysty, głęboki grafit (`#08090e`), aksamitne tło (`#0f111a`).
  - Precyzyjne linie obramowań (`border-zinc-800`), dyskretne poświaty neonowe (`.clean-glow-cyan`, `.clean-border-glow`).
  - Krystaliczna czytelność czcionki monospace bez zakłóceń kineskopowych czy szumów.
  - Telemetria: `NODE 0x19 // OPTICS STERILE`, stan matrycy: `OPTYKA SPÓJNA (CLEAN)`.
* **Warstwa Audialna (Web Audio API)**:
  - Proceduralnie generowane, krystaliczne bipy laboratoryjne i impulsy telemetryczne (880 Hz – 2400 Hz).
  - Sporadyczne wyzwalanie (co 15–35 s) z laboratoryjną, dyskretną głośnością (ok. 5%).
  - Zero szumów czy organicznych zakłóceń – całkowita dominacja matematycznej precyzji.

### Profil 2: Analog Horror Anomaly (`opticsOn: false`)
* **Koncepcja**: Awaria sprzętowa, skażenie logiczne procesora, rozpad iluzji percepcyjnej i degradacja biologicznego nośnika.
* **Warstwa Wizualna**:
  - Nakładka linii skanowania kineskopu (`.analog-scanlines`) z mikroskopijnym rozszczepieniem RGB.
  - Głęboka winieta optyczna CRT (`.analog-vignette`).
  - Bezstratny proceduralny film grain (`.analog-noise`).
  - Sprzętowy jitter i mikromigotanie luminoforu (`.analog-flicker`).
  - Dynamiczna aberracja chromatyczna tekstu (`.anomaly-chromatic`) oraz krwawe podświetlenia błędów (`.anomaly-glow-blood`, `.anomaly-border-blood`).
  - Telemetria: `NODE 0x19 // ANOMALIA LOGICZNA`, stan matrycy: `ZAKŁÓCENIE KINESKOPU`.
* **Warstwa Audialna (HTML5 Audio + Próbki Organiczne)**:
  - Podświadome odtwarzanie organicznych plików audio z katalogu `/public/sounds/`:
    - `/sounds/breathing.mp4` – zniekształcony, obcy oddech w buforze percepcji,
    - `/sounds/metal.mp4` – mechaniczne naprężenia i pękanie struktur,
    - `/sounds/water.mp4` – drenaż cieczy biologicznych i szum tętna.
  - Losowe uruchamianie pojedynczej próbki co 20–45 sekund z niskim poziomem głośności (ok. 20%).
  - Płynny fade-out i natychmiastowe uciszenie próbek organicznych po przywróceniu optyki sterylnej.

---

## 3. Rygor Inżynieryjny i Czysty Kod (Zero Bloatware)

Projekt przestrzega bezkompromisowych standardów architektonicznych:

1. **Bezwzględne Zero Bloatware**:
   - Żadnych zewnętrznych bibliotek komponentów UI (Radix, MUI, Chakra, AntDesign).
   - Żadnych ciężkich bibliotek animacji (Framer Motion, GSAP).
   - Żadnych zewnętrznych bibliotek dźwiękowych (Tone.js, Howler.js, SoundManager).
   - Całość opiera się w 100% na semantycznym HTML5, Tailwind CSS, czystym CSS3, Web Audio API oraz natywnych Web Streams API.
2. **Lokalność Zachowań (Locality of Behavior - LoB)**:
   - Cała logika interaktywna, synchronizacja optyki i obsługa strumienia znajdują się w `app/page.tsx`.
   - Moduł silnika dźwiękowego (`lib/soundEngine.ts`) stanowi spójną, zwartą jednostkę typu Singleton o minimalnym API publicznym (`toggleAudio`, `setOpticsMode`, `stopAll`, `destroy`).
3. **Puryzm Typowania (Strict TypeScript)**:
   - Wszystkie struktury danych, strumienie i payloady posiadają precyzyjne typy. Stosowanie typu `any` jest kategorycznie zabronione.
4. **Niezawodna Inicjalizacja (Lazy Singleton Proxy)**:
   - Klient `@google/genai` w `lib/ai.ts` inicjalizuje się dopiero podczas faktycznego zapytania HTTP, co chroni proces kompilacji produkcyjnej (`npm run build`) przed brakiem kluczy środowiskowych w fazie statycznej analizy.
5. **Autoplay Compliance & Graceful Degradation**:
   - Web Audio API i HTML5 Audio inicjalizują się po geście użytkownika (`[AUDIO: WŁ]`).
   - Wszelkie ograniczenia środowiska przeglądarki są przechwytywane w blokach `try/catch` i obietnicach `.catch()`, nie generując nieobsłużonych wyjątków w konsoli deweloperskiej.

---

## 4. Wytyczne Bezpieczeństwa i Architektura Zero-Trace

1. **Izolacja Poświadczeń**:
   - Klucz `GEMINI_API_KEY` pozostaje hermetycznie zamknięty po stronie serwera w środowisku Node.js (`app/api/chat/route.ts`).
2. **Filtry Bezpieczeństwa Modelu**:
   - Konwencja psychopatycznego laboranta jest konstruktem inżynierii promptów opartym na filtrach bezpieczeństwa Google GenAI SDK (brak instrukcji samookaleczenia ani fizycznej przemocy).
3. **Architektura Zero-Trace (Pamięć RAM)**:
   - Aplikacja nie przechowuje historii rozmów w bazach danych, plikach cookie czy pamięci `localStorage`. Przycisk **PURGE** lub odświeżenie karty nieodwracalnie niszczy cały stan sesji.
