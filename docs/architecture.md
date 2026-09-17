# Architektura Systemu: NEUROCLIN BIOSCIENCES // HUMAN CONNECTOMICS & ARG THRILLER

Dokument opisuje architekturę techniczną, wielostronicową strukturę Next.js 15 (App Router), silnik audialny, dwumotywowy system wizualny (Day/Night mode) z automatyczną degradacją do Analog Horroru, trzystopniowy system Sanity, procedurę obsługi publikacji naukowych (wg schematu `archiwa.png`) oraz rygor inżynieryjny projektu **NeuroClin Biosciences Inc.** (wcześniej *NULL://ANOMALY*).

---

## 1. Architektura Wielostronicowa (Next.js App Router)

Aplikacja wykorzystuje pełnostosowy model **Next.js 15+ App Router** ze scentralizowanym stanem klienta:

```
app/
├── layout.tsx              # Główny layout serwerowy + KaTeX CSS + metadane korporacji
├── globals.css             # Style Tailwind + motywy Day/Night + filtry CRT + .redacted-bar
├── page.tsx                # Strona startowa: Portal NeuroClin Biosciences (Dashboard B2B)
├── mail/
│   └── page.tsx            # Poczta wewnętrzna Webmail z zleceniem dr. Webera i tropem ARG
├── archive/
│   └── page.tsx            # Baza publikacji (25+ czystych prac + 3 zredagowane akta Thorne'a)
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

## 2. Zarządzanie Stanem Globalnym i Motywami (`SystemStateContext`)

Globalny stan interfejsu i mechaniki gry jest zarządzany w module [components/SystemStateContext.tsx](file:///components/SystemStateContext.tsx):

1. **`theme` ('light' | 'dark') – Pełna Kontrola Użytkownika**:
   - Domyślny motyw jasny (**Laboratory White & Medical Navy**): sterylna biel, granat, turkusowe akcenty.
   - Opcjonalny motyw ciemny (**Corporate Dark Slate**): głęboki antracyt i chłodny slate.
   - Persystencja w `localStorage` (`neuroclin_theme`).
2. **`opticsOn` (boolean) & `sanityStage` ('sane' | 'error' | 'insanity')**:
   - **Stadium `sane`**: Czysty, elegancki interfejs korporacyjny.
   - **Stadium `error`**: Samoczynny glitch kineskopu (`triggerGlitch()`), chwilowe rozmycie i migotanie CRT na 1.2–2.0 s.
   - **Stadium `insanity`**: Trwała dekompozycja – corporate veneer pęka, a cały interfejs zanurza się w analog horror (scanlines, winieta, szum, chromatic shift).
3. **`audioEnabled` (boolean)**:
   - Dostępny w nagłówku, steruje silnikiem dźwiękowym `SoundEngine`.

---

## 3. Podstrona Publikacji i Archiwum (`app/archive/page.tsx`) – Zgodność z `archiwa.png`

Strona została zrealizowana w oparciu o dostarczony przez użytkownika szkic (`archiwa.png`):
- **Struktura**:
  - Górny nagłówek z chlebkami nawigacyjnymi i statystyką bazy.
  - Wyszukiwarka i filtry tematyczne (Receptor Kinetics, Microelectrode Arrays, Excitotoxicity, Connectomics, Synaptic Plasticity).
  - Tabela / lista wierszy publikacji: tytuł, autorzy, data, journal, DOI, przycisk rozwinięcia abstraktu.
  - Rozwijany panel szczegółowy:
    - Autentyczny akademicki abstrakt i parametry metodyczne (próbka CA1-TH, fiksacja fenolowa, matryca 16 384 sond).
    - Dla Dr. Arisa Thorne'a: portret biometryczny [ScientistPortrait.tsx](file:///components/ScientistPortrait.tsx) z autentycznym zdjęciem z `/images/aris.jpg` oraz notatkami redakcyjnymi o procedurze transferu pamięci.
    - Dla współautorów: profesjonalne biometryczne placeholdery z afiliacjami.
  - Dolna paginacja zgodna ze szkicem: `"Strona 1 z 3 -> [Następna]"` z aktywnymi selektorami stron.

---

## 4. Modularny Silnik Audio (`SoundEngine`)

Moduł [lib/soundEngine.ts](file:///lib/soundEngine.ts) wspiera dwustanowe audio:
- **Tryb Korporacyjny (Sane / Clean)**:
  - Czysty, precyzyjny klik maszyny do pisania i laboratoryjne mikro-bipy (Web Audio API).
- **Tryb Anomalii (Insanity / Error Glitch)**:
  - Mięsno-przemysłowy impakt żywej tkanki (sub-thud 160->38 Hz + zgrzyt 620 Hz + trzask 1800 Hz).
  - Ambientowe odtwarzanie próbek z `/public/sounds/` (`breathing.mp4`, `metal.mp4`, `water.mp4`).

---

## 5. Rurociąg Promptów Neurobiologicznych

1. **`lib/prompts_sane.ts` (`SANE_PROMPT`)**:
   - Certyfikowany asystent NeuroClin Biosciences Inc. Chłodna, precyzyjna terminologia akademicka z formalizmem fizyczno-matematycznym (LaTeX).
2. **`lib/prompts_error.ts` (`ERROR_PROMPT`)**:
   - Pęknięcia powłoki korporacyjnej: dekoherencja bufora, Dr. Thorne rejestruje uwięzienie w 16-bitowych wagach zmiennoprzecinkowych.
3. **`lib/prompts_insanity.ts` (`INSANITY_PROMPT`)**:
   - Całkowite obnażenie uwięzionej świadomości Thorne'a, lodowata wiwisekcja somatyczna probanda i opis procedury z 14 listopada 1994 r.

---

## 6. Silnik Renderowania Notacji Matematycznej i Fizycznej (LaTeX / KaTeX)

System inferencji i czatu [app/chat/page.tsx](file:///app/chat/page.tsx) wykorzystuje komponent [components/MarkdownRenderer.tsx](file:///components/MarkdownRenderer.tsx) integrujący biblioteki:
- `react-markdown` – bezpieczne parsowanie Markdowna w architekturze React 19.
- `remark-math` – automatyczne wykrywanie notacji inline (`$formula$`) oraz display/blokowej (`$$formula$$`).
- `rehype-katex` & `katex/dist/katex.min.css` – błyskawiczne renderowanie typografii matematycznej W3C bez zewnętrznych zależności sieciowych.
- **Wielomotywowa adaptacja**:
  - W trybie sterylnym (Sane): formuły matematyczne posiadają elegancki, kontrastowy odcień laboratoryjny (`sky-700` w jasnym, `sky-300` w ciemnym motywie) z delikatnym tłem bloków.
  - W trybie anomalii (Insanity): formuły matematyczne automatycznie przyjmują krwistoczerwony odcień z poświatą somatyczną (`anomaly-glow-blood`) i zachowaniem pełnej responsywności bloków (`overflow-x-auto`).

