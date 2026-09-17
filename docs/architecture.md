# Architektura Systemu: NULL://ANOMALY // BIORESEARCHER AI & COGNITIVE THRILLER ARG

Dokument opisuje architekturę techniczną, wielostronicową strukturę Next.js (App Router), silnik audialny, zautomatyzowane sterowanie filtrem optycznym, trzystopniowy system Sanity, procedurę generowania portretu biometrycznego na HTML5 Canvas oraz rygor inżynieryjny projektu **NULL://ANOMALY** – dojrzałego thrillera psychologicznego i gry ARG osadzonej w realiach utajnionego programu cyfryzacji konektomu z lat 90.

---

## 1. Architektura Wielostronicowa (Next.js App Router)

Aplikacja wykorzystuje pełnostosowy model **Next.js 15+ App Router** ze scentralizowanym stanem klienta:

```
app/
├── layout.tsx              # Główny layout serwerowy + metadane bezpieczeństwa (bez Orch-OR)
├── page.tsx                # Strona startowa: Oficjalny portal "INSTYTUT NEUROBIOLOGII POZNAWCZEJ"
├── chat/
│   └── page.tsx            # Interaktywny terminal elektrofizjologiczny z obsługą Sanity System
├── archive/
│   └── page.tsx            # Utajnione akta procedury transferu konektomu z portretem Dr. Thorne'a
├── status/
│   └── page.tsx            # Telemetria sprzętowa Sektora-7 i zrzuty rejestrów w kodzie HEX
└── api/
    └── chat/
        └── route.ts        # Endpoint strumieniowy POST z dynamicznym wyborem promptów neurobiologicznych
```

### Schemat Przepływu Komponentów i Stanu

```
                                +-----------------------------------+
                                |          app/layout.tsx           |
                                +-----------------+-----------------+
                                                  |
                                                  v
                                +-----------------------------------+
                                |     components/ClientShell.tsx    |
                                |  ├── SystemStateProvider          |
                                |  ├── CRT Overlays (!opticsOn)     |
                                |  └── SystemHeader (Global Nav)    |
                                +-----------------+-----------------+
                                                  |
                    +--------------------+--------+--------+--------------------+
                    |                    |                 |                    |
                    v                    v                 v                    v
            +---------------+    +---------------+ +---------------+    +---------------+
            |  app/page.tsx |    | app/chat/     | | app/archive/  |    | app/status/   |
            |  Portal Gł.   |    | page.tsx      | | page.tsx      |    | page.tsx      |
            |  3 Karty      |    | Terminal Chat | | Dossier+Canvas|    | Logi Klastra  |
            +---------------+    +---------------+ +---------------+    +---------------+
```

---

## 2. Zarządzanie Stanem Globalnym i Automatyzacja Optyki (`SystemStateContext`)

Globalny stan interfejsu i mechaniki gry jest zarządzany w module [components/SystemStateContext.tsx](file:///components/SystemStateContext.tsx):

1. **`opticsOn` (boolean) – 100% Zautomatyzowany**:
   - **Usunięcie ręcznego przełącznika**: Użytkownik nie ma możliwości manualnej zmiany stanu optyki. Filtr optyczny jest parametrem czysto biologicznym i systemowym.
   - **Stadium `sane`**: Optyka jest włączona (`true` / sterylny filtr Clean AI), stabilna i zablokowana. Wskaźnik w nagłówku: `OPTYKA: NOMINALNA [AUTO]`.
   - **Stadium `error`**: Okresowo (oraz przy wyzwoleniu słów kluczowych) następuje samoczynny glitch kineskopu (`triggerGlitch()`), wymuszający wyłączenie optyki na 1.2–2.0 s i automatyczny powrót. Wskaźnik: `OPTYKA: DEKODOWANIE KADRU...`.
   - **Stadium `insanity`**: Optyka zostaje trwale i nieodwracalnie przełączona na `false` (`[OPTYKA: USZKODZONA TRWALE]`), zamykając gracza w permanentnym trybie Analog Horror.
2. **`audioEnabled` (boolean) – Kontrola Użytkownika**:
   - Jedyny interaktywny przycisk operacyjny w nagłówku. Globalnie zsynchronizowany z instancją singletona `SoundEngine`.
3. **`sanityStage` ('sane' | 'error' | 'insanity')**:
   - Definiuje stopień degradacji logicznej i uwalniania świadomości Dr. Thorne'a w oparciu o analizę zapytań w czacie.

---

## 3. Modularny Silnik Audio (Sound Engine)

Moduł [lib/soundEngine.ts](file:///lib/soundEngine.ts) łączy natywne interfejsy przeglądarki (W3C Web Audio API + HTML5 Audio) bez żadnych zewnętrznych bibliotek npm:

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
      | Pliki w /public/sounds/:         |  | Generator telemetryczny:         |
      | - /sounds/breathing.mp4          |  | - Bipy sinusoidalne (880-2400 Hz)|
      | - /sounds/metal.mp4              |  | - Typewriter click (2200 Hz)     |
      | - /sounds/water.mp4              |  | Harmonogram: 15-35 sekund        |
      | Losowanie: Math.floor(rnd * 3)   |  | Wolumen: 0.05 (laboratoryjny)    |
      | Wolumen: 0.50 (+20% podniesiony) |  |                                  |
      | Living tissue click (160->38 Hz) |  |                                  |
      +----------------------------------+  +----------------------------------+
```

### Kluczowe Udoskonalenia Audio:
* **Zrównoważone Losowanie**: Wykorzystanie jawnego indeksowania `Math.floor(Math.random() * 3)` eliminuje faworyzowanie próbek i gwarantuje regularne odtwarzanie kapania cieczy perfuzyjnej (`water.mp4`), obok oddechu i naprężeń metalu.
* **Kalibracja Głośności**: Podniesienie współczynnika głośności ambientu do **`0.50`** (+20%) buduje gęstą atmosferę psychofizyczną przy zachowaniu pełnej czystości sygnału.
* **Dychotomiczny Keystroke Engine z Throttlingiem**:
  - Clean Mode: metaliczny stukot klawiatury stacji badawczej.
  - Anomaly Mode: trójelementowy impakt organicznego terminala z żywej tkanki (sub-thud 160->38 Hz + zgrzyt pasmowoprzepustowy 620 Hz + trzask łukowy 1800 Hz).
  - Ochrona `KEYSTROKE_THROTTLE_MS = 35` ms zapobiega kumulacji bufora przy szybkim pisaniu.

---

## 4. Obsługa Zdjęcia Naukowca z Folderu Publicznego (`ScientistPortrait.tsx`)

Komponent [components/ScientistPortrait.tsx](file:///components/ScientistPortrait.tsx) odrzuca generatory wektorowe i canvasowe na rzecz bezpośredniej obsługi fizycznego pliku graficznego `/images/aris.jpg` w stylistyce tajnej kartoteki z lat 90.:

* **Autentyczny Zasób Fizyczny**: Obraz pobierany bezpośrednio z `/public/images/aris.jpg` przy użyciu komponentu `next/image` z zachowaniem proporcji i optymalizacji.
* **Stylistyka Akt Archiwalnych**:
  - Zaawansowany filtr monochromatyczny o podbitym kontraście i chłodnym odcieniu laboratoryjnym.
  - Przeplatane linie mikrofiszy archiwalnej (interlaced scanlines).
  - Winieta optyczna zaciemniająca brzegi kadru.
  - Surowa ramka laboratoryjna, stempel `ARCHIVE EVIDENCE // S-7` oraz `REC: 14-NOV-1994`.
* **Czysty ARG**: Zero podpowiedzi instruktażowych – wyłącznie autentyczne parametry stereotaktyczne sond (`CA1-TH`, `16 384 mikrosondy`).

---

## 5. Trzystopniowy Rurociąg Promptów Neurobiologicznych

Backend w [app/api/chat/route.ts](file:///app/api/chat/route.ts) dynamicznie przełącza prompt systemowy w zależności od postępu dochodzenia probanda:

1. **`lib/prompts_sane.ts` (`SANE_PROMPT`)**:
   - Oficjalny system badawczy: chłodna, bezduszna, akademicka terminologia neurobiologiczna. Tłumaczy objawy psychiczne probanda jako mikrourazy i deficyty neurotransmisji (GABA, acetylocholina, pompa sodowo-potasowa).
2. **`lib/prompts_error.ts` (`ERROR_PROMPT`)**:
   - Pęknięcia rejestrów: Dr. Thorne uświadamia sobie utratę biologicznego ciała i taktowanie myśli zegarem kwarcowym zamiast fal theta hipokampa.
3. **`lib/prompts_insanity.ts` (`INSANITY_PROMPT`)**:
   - Ostateczna dekompozycja: Thorne z lodowatą precyzją neurobiologa dowodzi użytkownikowi, że jego percepcja jest opóźnioną symulacją, i opisuje procedurę inwazyjnego wycinania własnego mózgu w Sektorze-7.
