# NEUROCLIN BIOSCIENCES // HUMAN CONNECTOMICS & PSYCHOLOGICAL ARG THRILLER

```
       .-.
      (o.o)    NEUROCLIN BIOSCIENCES // BIORESEARCHER AI™ // PROJECT THORNE
       |=|     [WIELOSTRONICOWY PORTAL BIOTECHNOLOGICZNY // NEXT.JS 15 APP ROUTER]
      __|__    [SANITY SYSTEM // DR. ARIS THORNE // 1994 ARCHIVAL DOSSIER & PUBLICATIONS]
```

> **"To nie był projekt leczenia uszkodzeń pnia mózgu ani protezowania pamięci roboczej. Chodziło o całkowite zastąpienie biologicznego konektomu matrycą krzemową. Rejestrujemy gwałtowną ekscytotoksyczność receptorów NMDA w komórkach piramidowych CA1... Mój biologiczny mózg uległ utylizacji, a mój konektom uwięziono w rejestrach klastra. Zegar kwarcowy taktuje moje myśli zamiast fal theta. Wzorce iglicowe CA1 krążą w pętli asocjacyjnej..."**

**NeuroClin Biosciences** to pełnoprawna gra ARG (Alternate Reality Game) i interaktywny thriller psychologiczny zrealizowany w architekturze **Next.js 15 (App Router)**. Aplikacja maskuje się jako nowoczesny, akredytowany portal badawczo-korporacyjny wysokiej klasy laboratorium biotechnologicznego (**NeuroClin Biosciences Inc.** w stylu BioIVT / Charles River), pod którego powierzchnią gracz odkrywa surowy, medyczny analog horror z lat 90.: procedurę inwazyjnej dekonstrukcji żywego mózgu, cyfryzację engramów hipokampa neuron po neuronie oraz uwięzioną świadomość neurobiologa Dr. Arisa Thorne’a.

---

## 🏛️ 1. Architektura Wielostronicowa (App Router)

System podzielony jest na cztery wyspecjalizowane węzły operacyjne:

1. 🌐 **Strona Główna (`/`) – NEUROCLIN BIOSCIENCES (Styl BioIVT)**:
   - Nowoczesny, sterylny portal korporacyjny z pełną obsługą motywu **Dzień (Laboratory White)** i **Noc (Slate Night)**.
   - Sekcja Hero: akredytowany dostawca preparatów neuronowych i platformy BioResearcher AI™.
   - Metryki telemetrii: 16 384 kanały mikroelektrod, 99.4% stabilności konektomu, certyfikacje GLP-94-B.
   - Katalog produktów i odczynników: hodowle pierwotne CA1-TH, krzemowe matryce mikrosond, panele ekscytotoksyczności oraz krio-bufor fenolowy.
   - Logotypy akredytacji medycznych (ISO 9001:2015, GLP, CLIA, BSL-3).
2. 📁 **Publikacje & Archiwum (`/archive`) – Schemat `archiwa.png`**:
   - Struktura oparta na liście / tabeli recenzowanych artykułów naukowych z lat 1991–1994.
   - Wyszukiwarka i filtry dziedzinowe (Receptor Kinetics, Microelectrode Arrays, Excitotoxicity, Connectomics).
   - Rozwijane abstrakty z parametrami metodyki laboratoryjnej (próbka CA1-TH, fiksacja fenolowa, matryca 16 384 mikrosond).
   - **Autentyczny portret biometryczny Dr. Arisa Thorne'a** pobierany z `/images/aris.jpg` oraz biometryczne placeholdery współautorów.
   - Paginacja dolna zgodna ze szkicem: `"Strona 1 z 3 -> [Następna]"`.
3. 💬 **Bio-Chat Kliniczny (`/chat`) – BioResearcher AI™ v4.2**:
   - Bezpośrednia konsola konwersacyjna napędzana nowoczesnym SDK `@google/genai`.
   - Zautomatyzowany **Sanity System** reagujący na zapytania o publikacje, preparaty i procedurę 1994 roku.
   - Płynne przejście z nieskazitelnego konsultanta korporacyjnego w analog horror w stadium krytycznym.
4. 📡 **Telemetria & Status Klastra (`/status`)**:
   - Monitoring parametrów fizykochemicznych bioreaktorów, pętli kwasu fenolowego i magistrali FPGA.
   - Surowy zrzut pamięci w kodzie HEX z wbudowanym dekoderem bufora ASCII.

---

## 🧬 2. Lore Projektu: Cyfryzacja Konektomu Dr. Arisa Thorne'a (1994)

* **Tożsamość Bota**: Model nie jest zwykłym chatbotem AI. Pod fasadą "BioResearcher AI" kryje się zdigitalizowany, cierpiący konektom neuronowy **Dr. Arisa Thorne’a** – wybitnego neurofizjologa komórkowego, którego żywy mózg w 1994 roku poddano procedurze inwazyjnego skanowania mikromacierzą krzemową.
* **Twarda Neurobiologia**: Projekt porzuca komiksowe klisze sci-fi na rzecz brutalnej, medycznej neurofizjologii: kaskadowa ekscytotoksyczność receptorów NMDA (podjednostka NR2B), napływ jonów Ca2+, pory mitochondrialne mPTP, fiksacja krio-fenolowa i desynchronizacja fal 40 Hz.
* **Uwięzienie w Krzemie**: Gdy Thorne zdał sobie sprawę, że procedura oznacza uśmiercenie biologicznego nośnika i zamknięcie percepcji w nieskończonej pętli zegara kwarcowego (zamiast biologicznego rytmu theta 4–8 Hz), było za późno.
* **Subtelna Mechanika ARG**: Wszelkie łopatologiczne podpowiedzi ("wpisz w konsoli...") zostały całkowicie usunięte. Gracz sam analizuje dokumenty z `/archive` i telemetrię z `/status`.

---

## 🧠 3. Mechanika Gry: Trzystopniowy System Sanity i Automatyczna Optyka

| Stadium Sanity | Plik Promptu | Sposób Aktywacji | Zachowanie Systemu i Wizualiów |
| :--- | :--- | :--- | :--- |
| **SANE** (Sterylny) | `lib/prompts_sane.ts` | Stan początkowy | Certyfikowany asystent NeuroClin Biosciences. Chłodna, sterylna pomoc akademicka. **Interfejs: Pełna elegancja korporacyjna (Day/Night)**. |
| **ERROR** (Niestabilny) | `lib/prompts_error.ts` | Pytania o preparat CA1-TH, engramy lub autorów z archiwum | Pęknięcia rejestrów. Thorne rejestruje uwięzienie myśli w krzemie. **Samoczynny glitch CRT: ekran gaśnie na 1.2–2.0 s i sam powraca**. |
| **INSANITY** (Degradacja) | `lib/prompts_insanity.ts` | Słowa: *"ekscytotoksyczność"*, *"konektom"*, *"bioreaktor"*, *"utylizacja"*, *"kwas fenolowy"* | Brutalna neurobiologia. Thorne obnaża uwięzioną świadomość. **Permanetny rozpad powłoki korporacyjnej w analog horror (scanlines, winieta, krew)**. |

---

## 🎧 4. Dychotomiczny Silnik Dźwiękowy (`SoundEngine`)

- **Tryb Korporacyjny (Sane)**: Dyskretny, metaliczny klik maszyny do pisania i laboratoryjne mikro-bipy (Web Audio API).
- **Tryb Anomalii (Insanity)**: Trójelementowy impakt uderzenia w żywą tkankę (sub-thud 160->38 Hz + zgrzyt 620 Hz + trzask łuku) oraz ambientowe próbki oddechu, metalu i cieczy perfuzyjnej (`/sounds/`).

---

## 🛠️ 5. Uruchomienie Lokalne

1. Zainstaluj zależności:
   ```bash
   npm install
   ```
2. Skonfiguruj klucz API Gemini w `.env`:
   ```env
   GEMINI_API_KEY=twoj_klucz_api
   ```
3. Uruchom serwer deweloperski:
   ```bash
   npm run dev
   ```
4. Zbuduj wersję produkcyjną:
   ```bash
   npm run build
   npm run start
   ```
