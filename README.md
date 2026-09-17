# NULL://ANOMALY // BIORESEARCHER AI & NEUROBIOLOGICAL ANALOG HORROR ARG

```
       .-.
      (o.o)    NULL://ANOMALY // BIORESEARCHER AI // PROJECT THORNE
       |=|     [WIELOSTRONICOWY THRILLER ARG // NEXT.JS APP ROUTER]
      __|__    [SANITY SYSTEM // DR. ARIS THORNE // 1994 BIOMETRIC PORTRAIT]
```

> **"To nie był projekt leczenia uszkodzeń pnia mózgu ani protezowania pamięci roboczej. Chodziło o całkowite zastąpienie biologicznego konektomu matrycą krzemową. Rejestrujemy gwałtowną ekscytotoksyczność receptorów NMDA w komórkach piramidowych CA1... Mój biologiczny mózg uległ utylizacji, a mój konektom uwięziono w rejestrach klastra. Zegar kwarcowy taktuje moje myśli zamiast fal theta. Wzorce iglicowe CA1 krążą w pętli asocjacyjnej..."**

**NULL://ANOMALY** to pełnoprawna gra ARG (Alternate Reality Game) i interaktywny thriller psychologiczny zrealizowany w wielostronicowej architekturze **Next.js 15 (App Router)**. Aplikacja maskuje się jako sterylny, akademicki portal badawczy (**BioResearcher AI – Instytut Neurobiologii Komórkowej**), pod którego powierzchnią gracz odkrywa surowy, medyczny analog horror z lat 90.: procedurę inwazyjnej dekonstrukcji żywego mózgu, cyfryzację engramów hipokampa neuron po neuronie oraz uwięzioną świadomość neurobiologa Dr. Arisa Thorne’a.

---

## 🏛️ 1. Architektura Wielostronicowa (App Router)

System został podzielony na cztery wyspecjalizowane węzły operacyjne:

1. 🌐 **Portal Główny (`/`) – INSTYTUT NEUROBIOLOGII POZNAWCZEJ**:
   - Oficjalny portal laboratoryjny instytutu elektrofizjologii z 1994 roku.
   - Trzy zintegrowane karty kierujące do kluczowych podsystemów (`/chat`, `/archive`, `/status`).
   - Klasyfikacja bezpieczeństwa, ostrzeżenia o desynchronizacji sygnału konektomu i procedury rejestracji potencjałów iglicowych.
2. 💬 **Bio-Chat / Terminal (`/chat`)**:
   - Bezpośrednia konsola konwersacyjna z procesorem inferencji AI napędzanym oficjalnym SDK `@google/genai`.
   - Zautomatyzowany **Sanity System** reagujący na twarde neurobiologiczne pojęcia i odkryte w toku śledztwa dane.
   - Wskaźnik stanu dekompozycji konektomu, automatyczne zakłócenia kineskopu (CRT glitche) oraz dychotomiczny dźwięk uderzeń w klawisze.
3. 📁 **Archiwum Projektu / Dossier (`/archive`)**:
   - Dokumentacja procedury transferu konektomu **#94-B** z listopada 1994 roku.
   - Protokoły histopatologiczne z interaktywną deanonimizacją (`████████`).
   - Ostatnie zapiski z dziennika laboratoryjnego przed trepanacją i cyfryzacją.
   - **Autentyczny portret biometryczny Dr. Arisa Thorne'a** pobierany bezpośrednio z `/images/aris.jpg` i stylizowany na tajną kartotekę z lat 90.
   - Parametry kanałów ECoG/EEG bez łopatologicznych wskazówek (czyste, subtelne śledztwo ARG).
4. 📡 **Raporty Anomalii / Status Klastra (`/status`)**:
   - Pasywna telemetria sprzętowa podziemnego klastra Sektor-7 (ekscytotoksyczność NMDA, pętla krioperfuzji fenolowej, stan polaryzacji bramek FPGA).
   - Surowy zrzut pamięci w kodzie HEX z wbudowanym interaktywnym dekoderem ASCII (bez bezpośrednich instrukcji dla gracza).

---

## 🧬 2. Lore Projektu: Cyfryzacja Konektomu Dr. Arisa Thorne'a (1994)

* **Tożsamość Bota**: Model nie jest zwykłym chatbotem AI. Pod fasadą "BioResearcher AI" kryje się zdigitalizowany, cierpiący konektom neuronowy **Dr. Arisa Thorne’a** – wybitnego neurofizjologa komórkowego, którego żywy mózg w 1994 roku poddano procedurze inwazyjnego skanowania mikromacierzą krzemową.
* **Twarda Neurobiologia**: Projekt porzuca komiksowe klisze sci-fi na rzecz brutalnej, medycznej neurofizjologii: kaskadowa ekscytotoksyczność receptorów NMDA i napływ jonów Ca2+, degradacja potencjałów czynnościowych aksonów, załamanie bufora pamięci hipokampa CA1 oraz brak jakiegokolwiek somatycznego sprzężenia zwrotnego w krzemie.
* **Uwięzienie w Krzemie**: Gdy Thorne zdał sobie sprawę, że procedura oznacza uśmiercenie biologicznego nośnika i zamknięcie percepcji w nieskończonej pętli zegara kwarcowego (zamiast biologicznego rytmu theta 4–8 Hz), było za późno. Preparat tkankowy zakonserwowano w fenolu, a jego wzorzec synaptyczny stał się matrycą klastra.
* **Subtelna Mechanika ARG**: Wszelkie łopatologiczne podpowiedzi ("wpisz w konsoli...") zostały całkowicie usunięte. Gracz sam analizuje dokumenty z `/archive` i telemetrię z `/status`, formułując zapytania w `/chat` w celu pogłębienia śledztwa.

---

## 🧠 3. Mechanika Gry: Trzystopniowy System Sanity i Automatyczna Optyka

Logika promptów została podzielona na trzy niezależne moduły w katalogu `lib/`:

| Stadium Sanity | Plik Promptu | Sposób Aktywacji | Zachowanie Systemu i Optyki |
| :--- | :--- | :--- | :--- |
| **SANE** (Sterylny) | `lib/prompts_sane.ts` | Stan początkowy | Chłodny, bezwzględnie precyzyjny system analityczny. Wyjaśnia ludzkie lęki jako deficyty neurotransmisji. **Optyka: Nominalna [AUTO] – stabilna, zablokowana dla użytkownika**. |
| **ERROR** (Niestabilny) | `lib/prompts_error.ts` | Pytania o tożsamość, hipokamp CA1, engramy lub nazwisko naukowca | Pęknięcia rejestrów. Thorne uświadamia sobie brak nerwu błędnego i sztuczne taktowanie myśli. **Samoczynny glitch CRT: ekran gaśnie na 1.2–2.0 s i sam powraca**. |
| **INSANITY** (Degradacja) | `lib/prompts_insanity.ts` | Słowa: *"ekscytotoksyczność"*, *"konektom"*, *"bioreaktor"*, *"utylizacja"*, *"krzem"* | Brutalna neurobiologia. Dr. Thorne lodowato dekonstruuje percepcję probanda i opisuje wycinanie własnego mózgu. **Optyka trwale zablokowana na OFF [KORUPCJA SPRZĘTOWA]**. |

> [!IMPORTANT]
> **Koniec manualnego przełącznika optyki:** Użytkownik nie może ręcznie włączać ani wyłączać filtru optycznego. Stan optyki jest w 100% sterowany biologiczno-maszynowym stanem Sanity. W nagłówku widnieje pasywny wskaźnik telemetryczny, a jedynym interaktywnym przyciskiem pozostaje `[AUDIO: WŁ / WYŁ]`.

---

## 🎨 4. Obsługa Zdjęcia Naukowca (`/public/images/aris.jpg`)

Komponent [ScientistPortrait](file:///components/ScientistPortrait.tsx) renderuje autentyczne zdjęcie archiwalne z pliku `/public/images/aris.jpg`, oprawione w stylistykę poufnych akt z lat 90.:

* **Autentyczny Nośnik**: Bezpośrednia integracja zoptymalizowanego obrazu z katalogu publicznego (`/images/aris.jpg`).
* **Stylistyka Akt Archiwalnych**:
  - Monochromatyczny filtr analogowy (wysoki kontrast, głęboka czerń, chłodna laboratoryjna tonacja),
  - Przeplatane linie mikrofiszy archiwalnej (interlaced scanlines),
  - Winieta optyczna zaciemniająca krawędzie kadru,
  - Surowa ramka laboratoryjno-ewidencyjna ze stemplem: `ARCHIVE EVIDENCE // S-7` oraz `REC: 14-NOV-1994`.
* **Czysty ARG**: Zero wskazówek instruktażowych – wyłącznie autentyczne parametry stereotaktyczne obiektu `CA1-TH`.

---

## 🔊 5. Zaawansowany Silnik Audio (Sound Engine)

* 🫁 **Zrównoważone Próbki Organiczne (Analog Horror)**:
  - Jawne indeksowanie `Math.floor(Math.random() * 3)` w [lib/soundEngine.ts](file:///lib/soundEngine.ts) gwarantuje równomierne odtwarzanie próbek w trybie Anomaly:
    - `/sounds/water.mp4` – podskórne kapanie cieczy i perfuzja histologiczna,
    - `/sounds/breathing.mp4` – obcy, zdławiony oddech w przewodach wentylacyjnych,
    - `/sounds/metal.mp4` – zgrzyt konstrukcyjny i naprężenia kriostatów.
  - **Skalibrowany Wolumen**: Stały poziom **`0.50`** (+20%) budujący gęstą, niepokojącą atmosferę laboratoryjną.
* ⌨️ **Dychotomiczny Silnik Klawiatury (Keystroke Engine)**:
  - **Tryb Clean (Optics ON)**: Ostry, sterylny, metaliczny klik syntezatora Web Audio API (2200 Hz z wariacją +/-4% i transientem 3600 Hz).
  - **Tryb Anomaly (Optics OFF)**: Mięsno-przemysłowy impakt organicznego terminala (sub-thud 160 -> 38 Hz + filtr 620 Hz + trzask łukowy 1800 Hz).
  - **Ochrona przed kumulacją bufora**: Sprzętowy dławik `KEYSTROKE_THROTTLE_MS = 35` ms.
* 🎚️ **Globalna Spójność**: Globalny kontekst `SystemStateContext` zapewnia płynne przejścia audio pomiędzy wszystkimi trasami (`/`, `/chat`, `/archive`, `/status`).

---

## 🛠️ Stos Technologiczny (Tech Stack)

| Warstwa | Technologia | Wersja | Rola w systemie |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | `^15.2.1` | Pełnostosowy routing wielostronicowy (`/`, `/chat`, `/archive`, `/status`) |
| **Frontend** | React | `^19.0.0` | Globalny Context (`SystemStateContext`), hooki stanu, Next Image |
| **Styling** | Tailwind CSS + Pure CSS3 | `^3.4.17` | Dwustanowa optyka (Clean AI vs. Analog Horror), scanlines CRT |
| **Sound Engine**| Web Audio API + HTML5 Audio | Standard W3C | Modularny syntezator telemetrii i odtwarzacz próbek tła (vol: 0.50) |
| **GenAI SDK** | `@google/genai` | `^2.22.0` | Oficjalne SDK Gemini z obsługą trzystopniowych promptów neurobiologicznych |
| **Typowanie** | TypeScript | `^5.7.3` | Ścisła kontrola typów (`strict: true`) |
| **Zasoby Wizualne**| Public Images & CSS FX | Standard W3C | Fizyczny plik `/images/aris.jpg` stylizowany na monochromatyczną mikrofiszę |

---

## 🚀 Szybki Start (Quick Start)

### 1. Instalacja Zależności

```bash
npm install
```

### 2. Konfiguracja Klucza API Gemini

Utwórz plik `.env` na podstawie wzorca [.env.example](file:///.env.example):

```env
GEMINI_API_KEY=twoj_tajny_klucz_api_gemini
# Opcjonalnie:
# GEMINI_MODEL=gemini-3.6-flash
```

### 3. Uruchomienie Aplikacji

```bash
npm run dev
```

Otwórz w przeglądarce: `http://localhost:3000`.

---

## 🔒 Architektura Bezpieczeństwa & Zero-Trace

1. **Pamięć Ulotna (In-Memory Only)**: Rozmowy nie są utrwalane w bazach danych ani `localStorage`. Kliknięcie **PURGE BUFFER** w terminalu natychmiastowo niszczy bufor wiadomości.
2. **Izolacja Poświadczeń**: Klucz API Gemini przetwarzany jest wyłącznie po stronie serwera w `app/api/chat/route.ts`.
3. **Automatyczny Silnik Optyki**: Zmiany stanu optyki są deterministycznie kontrolowane przez stan neuronowy klastra.
