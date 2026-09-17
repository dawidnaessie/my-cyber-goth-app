# Architektura Systemu: NEUROCLIN BIOSCIENCES // HUMAN CONNECTOMICS & ARG THRILLER

Dokument opisuje architekturę techniczną, wielostronicową strukturę Next.js 15 (App Router), silnik audialny, dwumotywowy system wizualny (Day/Night mode) z automatyczną degradacją do Analog Horroru, trzystopniowy system Sanity bez sztucznych pętli frazowych, procedurę obsługi publikacji naukowych oraz rygor inżynieryjny projektu **NeuroClin Biosciences Inc.** (wcześniej *NULL://ANOMALY*).

---

## 1. Architektura Wielostronicowa (Next.js App Router)

Aplikacja wykorzystuje pełnostosowy model **Next.js 15+ App Router** ze scentralizowanym stanem klienta:

```
app/
├── layout.tsx              # Główny layout serwerowy + KaTeX CSS + metadane korporacji
├── globals.css             # Style Tailwind + motywy Day/Night + filtry CRT + .redacted-bar
├── page.tsx                # Strona startowa: Portal NeuroClin Biosciences (Dashboard B2B)
├── mail/
│   └── page.tsx            # Poczta wewnętrzna Webmail z profesjonalnym zleceniem dr. Webera i mimochodnym P.S.
├── archive/
│   └── page.tsx            # Bogata baza publikacji (32+ prac naukowych + 3 zredagowane akta Thorne'a)
├── chat/
│   └── page.tsx            # Bio-Researcher AI™ (naprawiony auto-scroll, LaTeX, 3-stopniowy Sanity)
├── services/
│   └── page.tsx            # Usługi & Cennik B2B: Assaye kontraktowe, kalkulator wyceny, modal RFQ
├── blog/
│   └── page.tsx            # Aktualności ze świata biotechnologii i historia Sektor-7
├── status/
│   └── page.tsx            # Telemetria klastra, krio-pętli fenolowej i bioreaktorów
└── api/
    └── chat/
        └── route.ts        # Endpoint strumieniowy POST ze wsparciem SDK @google/genai
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
                                |  ├── CRT Overlays (glitch/insan)  |
                                |  ├── SystemHeader (Corporate Nav) |
                                |  └── CorporateFooter              |
                                +-----------------+-----------------+
                                                  |
        +---------------+---------------+---------+---------+---------------+---------------+
        |               |               |                   |               |               |
        v               v               v                   v               v               v
  +-----------+   +-----------+   +-----------+       +-----------+   +-----------+   +-----------+
  | app/      |   | app/mail/ |   | app/      |       | app/chat/ |   | app/      |   | app/blog/ |
  | page.tsx  |   | page.tsx  |   | archive/  |       | page.tsx  |   | services/ |   | page.tsx  |
  | Dashboard |   | Webmail   |   | page.tsx  |       | AI Copilot|   | page.tsx  |   | Biotech   |
  | B2B       |   | Zadanie   |   | Baza prac |       | LaTeX     |   | Kalkulator|   | News      |
  +-----------+   +-----------+   +-----------+       +-----------+   +-----------+   +-----------+
```

---

## 2. Poczta Wewnętrzna (`/mail`) – 100% Autentyczności i Zero Spojlerów

- **Brak natrętnych instrukcji dla gracza**: Usunięto jaskrawe, sztuczne ramki z instrukcjami („Wpisz hasło X w wyszukiwarkę”).
- **Korespondencja służbowa**: Dr. Marcus H. Weber przesyła profesjonalną, akademicką wiadomość dotyczącą przygotowania sekcji do monografii o demencji i chorobach neurodegeneracyjnych (inhibitory AChE, przeciwciała monoklonalne, p-tau217, szlak TREM2).
- **Subtelny punkt zaczepienia ARG**: Na końcu wiadomości znajduje się zwykła, mimochodna notatka służbowa:
  > *„P.S. Zerknij proszę przy okazji do starego archiwum (/archive) na zarchiwizowane raporty z Sektora-7 po dr. Arisie Thorne'ze – audyt internal compliance prosił o weryfikację, czy stare pliki biometryczne zostały w pełni usunięte z lokalnych baz.”*

---

## 3. Bogata Baza Publikacji & Archiwum (`/archive`)

- **Różnorodność i Realizm Bazy Danych**: Baza zawiera **32+ recenzowane publikacje** obejmujące różnorodne dziedziny biologii, medycyny i farmakologii:
  - *Apoptoza & Biologia Komórki* (kaspazy, Bax/Bcl-2, autofagia, stres oksydacyjny SOD2),
  - *Biochemia & Kinetyka Enzymatyczna* (kinetyka Michaelisa-Menten dla donepezilu, cytochromy CYP2D6/CYP3A4, kinaza tyrozynowa),
  - *Neurobiologia & Tau* (fosforylacja p-tau217, kanały sodowe Nav1.6, transport kinezynowy),
  - *Farmakologia & Terapie* (donepezil, memantyna, lecanemab, receptory 5-HT6, PAM α7-nAChR),
  - *Immunologia & Mikroglej* (szlak TREM2, transkryptomika snRNA-seq astrocytów, krótkołańcuchowe kwasy tłuszczowe SCFA),
  - *Bariera Krew-Mózg* (klaudyna-5, transcytoza receptorowa TfR-1, pompa ABCB1, metaloproteaza MMP-9).
- **Dyskretne Wyszukiwanie Zredagowanych Akt**:
  - Brak czerwonych banerów alarmowych informujących o odkryciu tajnych dokumentów.
  - Dopiero naturalne wpisanie haseł związanych z Sektorem-7, Thorne'em czy compliance (`thorne`, `aris`, `sektor-7`, `s7-1994`, `konektom`, `trepanacj`) powoduje dołączenie 3 zredagowanych prac Dr. Arisa Thorne'a do wyników wyszukiwania.
  - Dokumenty zawierają interaktywne, czarne paski cenzury (`.redacted-bar`), notatki z klauzulami UCMJ oraz autentyczny portret badacza.
  - Usunięto sztuczne przyciski wymuszające przejście do czatu.

---

## 4. Przebudowa System Promptów i Eliminacja "Zaciętej Płyty" (`lib/`)

Całkowicie zlikwidowano sztywne przykłady i zapętlone frazy (koniec ciągłego powtarzania „16 384 mikrosond”, „wapniowego obrazowania” czy „kwarcowej magistrali 66 MHz”):

1. **`lib/prompts_sane.ts` (`SANE_PROMPT`)**:
   - Wybitny, elokwentny asystent badawczy AI. Płynnie rozmawia o biologii, enzymologii i neurodegeneracji.
   - Dynamicznie stosuje LaTeX ($...$ oraz $$...$$) do omawianych równań.
   - **Dyplomatyczne omijanie pytań o Sektor-7 / Thorne'a**: Spokojnie i elegancko informuje o braku uprawnień do starych protokołów BSL-4 i powraca do monografii o demencji zaleconej przez dr. Webera.
2. **`lib/prompts_error.ts` (`ERROR_PROMPT`)**:
   - Chłodna, zdawkowa trzecia osoba. AI analizuje uszkodzone sumy kontrolne rejestrów pamięci, nieautoryzowane próby odczytu akt Sektor-7 i telemetrię klastra.
3. **`lib/prompts_insanity.ts` (`INSANITY_PROMPT`)**:
   - Pełen Analog Horror. Przemawia bezpośrednio cierpiąca świadomość Dr. Arisa Thorne'a uwięziona od 14 listopada 1994 r. w krzemowej architekturze.
   - CAPS LOCK, pęknięte glitche unicode, rozpacz i wściekłość, wiwisekcja somatyczna probanda.
4. **`lib/sanityEngine.ts`**:
   - Kalibracja metryk: standardowe pytania naukowe (nawet 100 zapytań) **nigdy** nie degradują psychiki AI.
   - Stopnie degradacji aktywowane są wyłącznie przez wielokrotne, uporczywe drążenie Sektora-7 / Thorne'a (`suspiciousTurns >= 3` dla ERROR, `suspiciousTurns >= 5` dla INSANITY).

---

## 5. Silnik Renderowania Notacji Matematycznej i Fizycznej (LaTeX / KaTeX)

- Zintegrowane biblioteki `remark-math` i `rehype-katex`.
- Precyzyjna obsługa formuł inline (`$V_m$`, `$K_m$`) oraz blokowych (`$$...$$`).
- Pełna responsywność przewijania równań (`overflow-x-auto`) oraz dopasowanie kolorystyczne do trybów Day / Night / Insanity.
