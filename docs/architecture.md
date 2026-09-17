# Architektura Systemu: NEUROCLIN BIOSCIENCES // HUMAN CONNECTOMICS & ARG THRILLER

Dokument opisuje architekturę techniczną, wielostronicową strukturę Next.js 15 (App Router), silnik audialny, dwumotywowy system wizualny (Day/Night mode) z automatyczną degradacją do Analog Horroru, trzystopniowy system Sanity bez sztucznych pętli frazowych, procedurę obsługi publikacji naukowych oraz rygor inżynieryjny projektu **NeuroClin Biosciences Inc.**.

---

## 1. Architektura Wielostronicowa (Next.js App Router)

Aplikacja wykorzystuje pełnostosowy model **Next.js 15+ App Router** ze scentralizowanym stanem klienta:

```
app/
├── layout.tsx              # Główny layout serwerowy + KaTeX CSS + metadane korporacji
├── globals.css             # Style Tailwind + motywy Day/Night + filtry CRT + czarne paski cenzury
├── page.tsx                # Strona startowa: Portal B2B usług bioanalitycznych i oprogramowania
├── mail/
│   └── page.tsx            # Poczta wewnętrzna Webmail: 100% autentyczna korespondencja służbowa bez spoilerów
├── archive/
│   └── page.tsx            # Baza publikacji: czyste dyscypliny, zasada jedynego śladu, ukryty raport z 1994 r.
├── chat/
│   └── page.tsx            # BioResearcher AI™ (naprawiony auto-scroll, LaTeX KaTeX, 3-stopniowy Sanity)
├── services/
│   └── page.tsx            # Usługi & Cennik B2B: Certyfikowane CRO (UHPLC-MS, ELISA, RNA-Seq, SPR, LIMS)
├── blog/
│   └── page.tsx            # Aktualności korporacyjne: ISO 17025, aparatura, kongresy naukowe
├── status/
│   └── page.tsx            # Telemetria klastra HPC i układów analitycznych NeuroClin
└── api/
    └── chat/
        └── route.ts        # Endpoint strumieniowy POST ze wsparciem SDK @google/genai
```

---

## 2. Portal B2B & Usługi Analityczne (`/`, `/services`)

- **Hiperrealistyczna Fasada Korporacyjna**:
  - Usługi analityczne dla branży farmaceutycznej i jednostek akademickich:
    1. Spektrometria mas wysokiej rozdzielczości i chromatografia cieczowa (UHPLC-MS/MS Sciex 6500+).
    2. Opracowywanie i walidacja testów immunoenzymatycznych (ELISA oraz ultra-czuła platforma Simoa HD-X).
    3. Profilowanie transkryptomiczne i ekspresji genów (Targeted RNA-Seq & ddPCR).
    4. Kinetyka wiązań makromolekularnych w czasie rzeczywistym (SPR Biacore T200).
    5. Testy in vitro cytotoksyczności (MTT, LDH) i modele barierowe Transwell (Caco-2).
    6. Platforma analityczna *BioResearcher Analytics Suite* z integracją LIMS (zgodność z FDA 21 CFR Part 11).
  - Całkowite wyeliminowanie elementów sci-fi: brak sprzedaży tkanek, brak hodowli organoidów z dostawą do domu, brak wzmianek o krzemowych matrycach na stronie głównej.

---

## 3. Poczta Wewnętrzna (`/mail`) & Blog (`/blog`) – 100% Autentyczności

- **Poczta wewnętrzna (`/mail`)**:
  - Zero pomarańczowych ramek z instrukcjami dla gracza i zero spoilerów.
  - Dr. Marcus H. Weber zleca pracownikowi przygotowanie przeglądu literatury do monografii o demencji i terapiach neurodegeneracyjnych (inhibitory AChE, memantyna, lecanemab, p-tau217, TREM2).
  - W dopisku P.S. Weber prosi wyłącznie o sprawdzenie wewnętrznego repozytorium `/archive` pod kątem wcześniejszych publikacji i artykułów recenzowanych zespołu.
  - Pozostałe wiadomości to rutynowe komunikaty operacyjne (konserwacja bazy LIMS, kalibracja spektrometrów mas, zaopatrzenie w kolumny C18, szkolenie GLP/BSL-2).
- **Blog (`/blog`)**:
  - Nudny, profesjonalny biuletyn korporacyjny (odnowienie akredytacji ISO/IEC 17025, instalacja nowych układów UHPLC, modelowanie kinetyki Michaelisa-Menten, udział w kongresie w Bazylei, 30-lecie tradycji analitycznej).

---

## 4. Baza Publikacji & Dwuetapowa Mechanika Śladu ARG (`/archive`)

- **Zasada Jedynego Śladu (Single Trace Rule)**:
  - Baza `/archive` prezentuje domyślnie wyłącznie w pełni legalne, nowoczesne recenzowane publikacje ułożone w klasycznych kategoriach: `Farmakologia`, `Biochemia`, `Neurobiologia`, `Immunologia`, `Fizjologia`, `Genetyka`.
  - W jednym ze współczesnych artykułów z neurobiologii (`PUB-2024-512`: *High-Resolution Multielectrode Field Potential Profiling*) w metodyce znajduje się sucha wzmianka referencyjna:
    > *„Wartości referencyjne szumu tła i stabilności potencjałów znormalizowano względem wewnętrznego protokołu kalibracyjnego z 14 listopada 1994 r. (seria pomiarowa ST-94/11).”*
- **Wyszukiwarka jako Klucz Odkrycia**:
  - Archiwalny raport z 1994 r. **nie pojawia się** na liście przy standardowym przeglądaniu ani przy wyborze kategorii.
  - Dopiero gdy użytkownik wpisze w pole wyszukiwania datę lub kod (`1994`, `14.11`, `14 listopada`, `ST-94`, `Thorne`), wyszukiwarka ujawnia ukryty dokument:
    *Raport Techniczny ST-94/11: Pilotażowe mapowanie potencjałów mikrosieci neuronalnych*.
- **Trwałe Zaczernienie (Permanent Redaction)**:
  - Artykuł jest niemal w całości zredagowany czarnym tuszem (`bg-black text-black select-none pointer-events-none`).
  - **Brak możliwości podejrzenia tekstu pod spodem** (brak hovera/odkrywania).
  - Widoczne są jedynie szczątki kontekstu technicznego, tytuł, data (14.11.1994), podpisy (Dr. Aris Thorne, Dr. Elena Vance) oraz fotografia doktora Thorne'a (`ScientistPortrait`).

---

## 5. Asystent BioResearcher AI & Naprawa Błędów (`lib/`, `app/chat/`)

- **Prompty AI (`lib/prompts_*.ts`)**:
  - `SANE`: Erudycyjny, elegancki asystent badawczy. Wyjaśnia zjawiska biochemiczne i fizyczne stosując formalny zapis LaTeX ($...$, $$...$$). Pytania o Thorne'a dyplomatycznie kieruje z powrotem na monografię o demencji.
  - `ERROR`: Chłodna, zdawkowa telemetria bufora pamięci po 3-4 dociekliwych pytaniach.
  - `INSANITY`: Pełen Analog Horror po 5+ pytaniach. Dr. Aris Thorne – uwięziony umysł w CAPS LOCK, wołający o pomoc.
  - Kategoryczny zakaz zacinania się w powtarzaniu tych samych szablonowych fraz.
- **Naprawa Auto-Scrolla (`app/chat/page.tsx`)**:
  - Scrollowanie następuje natychmiastowo (`behavior: 'auto'`) przy wysłaniu wiadomości oraz gdy podczas streamingu napływa znak nowej linii (`\n`) i użytkownik znajduje się przy dolnej krawędzi.
  - Całkowita eliminacja szarpania ekranu token po tokenie.
- **Wsparcie Motywów**:
  - Perfekcyjny kontrast i czytelność elementów LaTeX w trybie jasnym (Day) i ciemnym (Night).
