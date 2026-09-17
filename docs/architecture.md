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
│   └── page.tsx            # Poczta wewnętrzna Webmail: autentyczna korespondencja służbowa bez spojlerów
├── archive/
│   └── page.tsx            # Baza publikacji: czyste dyscypliny (Farmakologia, Biochemia, itd.), przypadkowe odkrycia
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

---

## 2. Poczta Wewnętrzna (`/mail`) – 100% Autentyczności i Zero Podpowiedzi na Tacy

- **Brak natrętnych instrukcji dla gracza**: Usunięto jaskrawe ramki oraz gotowe podpowiedzi („wpisz to w wyszukiwarkę”).
- **Brak nienaturalnych wycieków w skrzynce odbiorczej**: Wszystkie maile w skrzynce odbiorczej to autentyczna, nudna korespondencja korporacyjna (BHP, IT tokeny FPGA, metrologia HD-MEA, zaopatrzenie w bufor HEPES, odnowienie certyfikacji GLP/BSL-2).
- **Zadanie od Dr. Marcusa H. Webera**:
  - Wiadomość dotyczy przygotowania sekcji do monografii o demencji i chorobach neurodegeneracyjnych (*Donepezil, Memantyna, Lecanemab, p-tau217, TREM2*).
  - W notatce końcowej Weber prosi jedynie o weryfikację dawnych protokołów metodycznych dotyczących skrawków hipokampa (CA1) oraz wczesnych kultur organoidów w celu porównania aparatury badawczej. Zero wspominek o Thorne'ze, Sektorze-7 czy cenzurze.

---

## 3. Baza Publikacji & Archiwum (`/archive`) – Realistyczne Kategorie i Przypadkowe Odkrycie

- **Czyste Kategorie Akademickie**: Zrezygnowano z wieloczłonowych kategorii z łącznikami `&` oraz wyeliminowano sztuczną kategorię „Badania Niejawne”. Zastosowano klasyczne dyscypliny laboratoryjne:
  1. `Wszystkie`
  2. `Farmakologia`
  3. `Biochemia`
  4. `Neurobiologia`
  5. `Immunologia`
  6. `Fizjologia`
  7. `Genetyka`
- **Naturalne, Przypadkowe Odkrycie (Environmental Storytelling)**:
  - Baza zawiera **28 chronologicznie ułożonych publikacji** (od najnowszych z 2025 r. do archiwalnych z lat 90.).
  - Użytkownik, realizując polecenie Webera, wyszukuje w archiwum standardowe hasła dotyczące modeli tkankowych (np. `organoidy`, `hipokamp`, `CA1`, `elektrofizjologia`, `perfuzja`, `ekscytotoksyczność`).
  - Wśród wyników wyszukiwania natrafia mimochodem na starsze publikacje ośrodka z lat 1993–1994 (np. *Stabilizacja engramów CA1 w wieloelektrodowych macierzach krzemowych i organoidach mózgowych*).
  - Dopiero po rozwinięciu abstraktu widoczne są czarne paski cenzury (`.redacted-bar`), drastyczne parametry krio-perfuzji fenolowej na ludzkim mózgowiu oraz archiwalny portret Dr. Arisa Thorne'a.
  - Zero wyskakujących alarmów, zero banerów z klauzulami wojskowymi na stronie głównej archiwum.

---

## 4. Przebudowa System Promptów i Eliminacja Pętli Frazowych (`lib/`)

- **`lib/prompts_sane.ts` (`SANE_PROMPT`)**: Wybitny, elokwentny asystent badawczy. Odrzuca powtarzanie szablonowych zwrotów o „16 384 mikrosondach” czy „zegarze 66 MHz”. Przy próbach poruszenia spraw archiwalnych grzecznie i dyplomatycznie kieruje rozmowę na monografię o demencji.
- **`lib/prompts_error.ts` (`ERROR_PROMPT`)**: Chłodna, zdawkowa trzecia osoba. AI analizuje anomalie sum kontrolnych i błędy odczytu pamięci klastra.
- **`lib/prompts_insanity.ts` (`INSANITY_PROMPT`)**: Czysty Analog Horror. Dr. Aris Thorne przemawia bezpośrednio z wnętrza maszyny (CAPS LOCK, glitche, agonia uwięzienia).
- **`lib/sanityEngine.ts`**: Zwykłe zapytania biologiczne nigdy nie obniżają Sanity. Degradacja zachodzi wyłącznie po wielokrotnym, uporczywym drążeniu incydentu z 1994 r. ($\ge 3$ zapytania dla ERROR, $\ge 5$ dla INSANITY).
