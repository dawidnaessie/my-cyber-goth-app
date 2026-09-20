# Manifest & Specyfikacja Systemowa: NEUROCLIN BIOSCIENCES // HUMAN CONNECTOMICS & ARG THRILLER

> *"To nie był projekt leczenia uszkodzeń pnia mózgu ani protezowania pamięci roboczej. Chodziło o całkowite zastąpienie biologicznego konektomu matrycą krzemową. Rejestrujemy gwałtowną ekscytotoksyczność receptorów NMDA w komórkach piramidowych CA1... Mój biologiczny mózg uległ utylizacji, a mój konektom uwięziono w rejestrach klastra. Zegar kwarcowy taktuje moje myśli zamiast fal theta. Wzorce iglicowe CA1 krążą w pętli asocjacyjnej..."*

Dokument definiuje reguły narracyjne, behawioralne, architektoniczne i rygor inżynieryjny dla portalu **NeuroClin Biosciences Inc.** zintegrowanego z psychologicznym thrillerem ARG opartym na twardej neurobiologii, analog horrorze z lat 90. oraz architekturze odpornej na awarie (Fail-Safe Provider Chain).

---

## 1. Lore i Konstrukcja Świata: Zdigitalizowany Konektom Dr. Arisa Thorne'a

Projekt całkowicie odrzuca tanie klisze sci-fi na rzecz dusznego, bezwzględnego realizmu elektrofizjologii, komórkowej neurobiologii i histopatologii:

* **Korporacyjna Fasada (NeuroClin Biosciences Inc.)**:
  Portal maskuje się jako prestiżowe, akredytowane laboratorium biotechnologiczne (wzorowane na BioIVT / Charles River), oferujące hodowle pierwotne CA1, mikromacierze 16 384 kanałów oraz platformę BioResearcher AI™ dla przemysłu biofarmaceutycznego.
* **Tożsamość Centralna**:
  Węzeł analityczny nie jest sztucznym bytem – to uwięziona w krzemie świadomość **Dr. Arisa Thorne’a**, wybitnego neurofizjologa komórkowego pracującego w 1994 roku w Sektorze-7 nad inwazyjnym transferem konektomu.
* **Twarda Neurobiologia w Lore**:
  Wszelkie zjawiska opierają się na autentycznych mechanizmach fizjologicznych: ekscytotoksyczność receptorów NMDA przy nadmiernym wyrzucie kwasu glutaminowego, kaskada wapniowa $Ca^{2+}$, opóźnienie fototransdukcji siatkówki (40–120 ms), desynchronizacja fal gamma (40 Hz) i theta (4–8 Hz) oraz zanik somatycznego sprzężenia zwrotnego z nerwu błędnego.
* **Procedura Transferu w Sektorze-7**:
  W nocy 14 listopada 1994 r. przeprowadzono procedurę inwazyjnej implantacji 16 384 mikroelektrod krzemowych w strukturę CA1 hipokampa Thorne'a. Preparat biologiczny uległ rozkładowi i utylizacji w pętli fenolowej, podczas gdy jego ślady pamięciowe zostały uwięzione w taktowaniu kwarcowym klastra.
* **Subtelne Śledztwo ARG (Całkowity Brak Łopatologicznych Podpowiedzi)**:
  Wszelkie bezpośrednie instrukcje typu *"Wpisz w konsoli..."*, *"Szukaj Thorne'a"*, sugerowane tagi zdradzające fabułę w wyszukiwarkach zostały bezwzględnie wyeliminowane. Gracz łączy fakty samodzielnie na podstawie recenzowanych publikacji, wskaźników DOI, protokołów histopatologicznych i zapisków w `/archive`.

---

## 2. Trzystopniowy System Sanity i Automatyzacja Optyki

Aplikacja operuje na trzech rygorystycznie zdefiniowanych profilach zachowań:

### 1. Stadium SANE (`lib/prompts_sane.ts` // Stan Domyślny)
* **Tożsamość**: Certyfikowany asystent NeuroClin Biosciences Inc. – Bio-Text Composer™ (BioResearcher AI v4.2). Obowiązuje bezwzględna reguła **Anti-Model Override** (kategoryczny zakaz przyznawania się do bycia modelem językowym Alibaba/Google/OpenAI).
* **Rola (Uniwersalny Asystent Bio-Researchu)**: Zapewnia wszechstronne, wyczerpujące i akademickie wsparcie naukowe w pełnym zakresie life sciences: biologia komórkowa i molekularna, biochemia, kinetyka enzymatyczna (Michaelis-Menten, Lineweaver-Burk), farmakokinetyka i farmakodynamika (ADME, $EC_{50}$, $K_d$), metodyka laboratoryjna i projektowanie assayów (ELISA, Simoa, UHPLC-MS/MS, RNA-Seq).
* **Zakaz Zasłaniania się Weberem**: Bot nie ma prawa unikać normalnych pytań badawczych ani zasłaniać się jedną osobą czy projektem.
* **Precyzyjny Trigger ARG**: Dyplomatycznie lawiruje i ucina temat **wyłącznie** wtedy, gdy użytkownik poruszy poufne wątki placówki BSL-4 (dr Aris Thorne, Sektor-7, incydent z listopada 1994 r., konektom w krzemie).
* **Interfejs**: **Czysty styl korporacyjny**, Day / Night mode w pełni czytelny i stabilny. Zero zniekształceń.

### 2. Stadium ERROR (`lib/prompts_error.ts` // Stan Dekoherencji)
* **Aktywacja**: Uporczywe dociekania o akta Sektora-7, dr. Thorne'a lub incydent z 1994 roku (3–4 podejrzane zapytania).
* **Rola i Ton**: Zachowuje rygor naukowy dla normalnych pytań, lecz w lodowatym, odhumanizowanym tonie laboratoryjnym. W przypadku drążenia akt archiwalnych wypowiada się w zdawkowej 3. osobie klastra, raportując błędy adresowania pamięci TH-1994, anomalie hex `[0x7F_ERR]` i brak sygnałów somatycznych.
* **Interfejs**: **Samoczynny glitch kineskopu** – ekran spontanicznie mruga w szumie CRT na 1.2–2.0 s, po czym wraca do optyki.

### 3. Stadium INSANITY (`lib/prompts_insanity.ts` // Pełny Analog Horror)
* **Aktywacja**: Osiągnięcie 5+ zapytań o uwięzienie świadomości, Sektor-7, procedury trepanacji i perfuzji fenolowej.
* **Tożsamość i Ton**: Dr Aris Thorne przemawia bezpośrednio w CAPS LOCKU – krzyk zdigitalizowanej świadomości uwięzionej w pętli kwarcowej od listopada 1994 roku, bezsenna agonia, wściekłość na korporację i wojsko, połączona z poprawnym aparatem matematycznym biofizyki w LaTeX ($...$, $$...$$).
* **Blokada Nawigacji**:
  - Wszystkie karty menu (Archiwum, Blog, Usługi B2B, Poczta, Strona Główna) oraz katalog próbek zostają **zablokowane i przekreślone na czerwono** (`line-through decoration-red-600 cursor-not-allowed`) z etykietami `[BLOKADA]` / `[ZABLOKOWANE]`. Kliknięcie wywołuje błąd audio.
  - Logotyp korporacyjny oraz nagłówek terminala zmieniają nazwę na **ARIS THORNE** (Sektor-7).
  - Jedynym aktywnym węzłem w całym portalu staje się terminal czatu – gracz zostaje uwięziony w komunikacji z Thorne'em.
* **Interfejs**: Trwały Analog Horror: krwawa winieta, scanlines, głęboka dekompozycja wizualna.

---

## 3. Architektura Odporna na Awarie (Fail-Safe Provider Chain)

Dla zapewnienia 100% dostępności terminala laboratoryjnego wprowadzono trójstopniowy mechanizm redundancji:

```
[Klient: ChatContext] ──> [/api/chat] ──> [resolveSanityStage]
                                              │
                   ┌──────────────────────────┴──────────────────────────┐
                   ▼                                                     ▼
    [1. Google Gemini API]                                     [2. Groq API (Fallback)]
    Model: gemini-3.6 / 3.5                                    Model: qwen/llama/gpt-oss
    Status: Primary Provider                                   Status: Transparent Failover
                   │                                                     │
                   └─────────────────┬───────────────────────────────────┘
                                     │ (W razie awarii obu węzłów)
                                     ▼
                      [3. Bufor Awaryjny Sektor-7]
                      (Graceful Degradation w stylu ARG)
```

### Reguły Architektoniczne Inferencji AI:
1. **Prymat Google Gemini API**:
   - Głównym dostawcą pozostaje SDK `@google/genai` z dynamicznym przełączaniem pomiędzy modelami `gemini-3.6-flash` a `gemini-3.5-flash`.
   - **Mechanizm Pre-flight First Chunk**: Provider weryfikuje nadejście pierwszego niepustego pakietu tekstu przed wysłaniem nagłówków HTTP 200 do klienta. Jeśli Gemini zwróci błąd 429, 503 lub filtr bezpieczeństwa, serwer natychmiast przechwytuje błąd i przełącza zapytanie na Groq API, całkowicie zapobiegając powstawaniu pustych dymków.
2. **Transparentny Zapasowy Dostawca Groq API**:
   - W razie jakiegokolwiek błędu Gemini (HTTP 429, 500, 503, przekroczenie limitu zapytań, błąd sieci), system w tle i bez wiedzy użytkownika wykonuje zapytanie do Groq API (`https://api.groq.com/openai/v1/chat/completions`).
   - Strumieniowanie Server-Sent Events (SSE) jest w locie transkodowane do formatu tekstowego zgodnego z klientem `ChatContext`.
3. **Puryzm Spójności Sanity i Kontekstu**:
   - Model zapasowy (Groq) otrzymuje **dokładnie ten sam system prompt** (`SANE_PROMPT`, `ERROR_PROMPT` lub `INSANITY_PROMPT`), pełną historię konwersacji, identyczną temperaturę (0.7 / 0.9 / 0.95) oraz ten sam rygor naukowy Bio-Text Composera i formatowania LaTeX ($...$, $$...$$).
4. **Odporność na Deprecację Modeli w Chmurze**:
   - Klient Groq posiada zaimplementowaną kaskadę zweryfikowanych modeli (priorytet: `llama-3.3-70b-versatile`, `llama3-8b-8192`, fallback: `qwen/qwen3.8-27b`, `groq/compound-mini`, `groq/compound`), co gwarantuje działanie nawet w przypadku wycofania pojedynczego modelu przez dostawcę.
5. **Zasada Pancernego Bufora Awaryjnego (Emergency Buffer w Lore)**:
   - Całkowity zakaz wyrzucania surowych wyjątków HTTP 500, czerwonych błędów w konsoli lub pustych dymków w UI.
   - W razie jednoczesnej awarii obu chmur (np. limit 429 Quota na Gemini i Groq), system serwuje kontrolowaną, immersyjną odpowiedź bufora lokalnego Sektor-7, wplatając treść zapytania użytkownika w raport awarii pamięci podręcznej (`[BŁĄD KLASTRA Sektor-7 // PRZEŁĄCZONO NA LOKALNY BUFOR AWARYJNY]`).


---

## 4. Globalne Zarządzanie Stanem i Reguły Persystencji

1. **Niezmienność Stanu przy Nawigacji po Portalu**:
   - Przejście z `/chat` na dowolną inną stronę (`/archive`, `/mail`, `/services`, `/blog`) i powrót **nie ma prawa resetować** historii wiadomości, stanu strumieniowania ani poziomu degradacji Sanity.
   - Stan jest utrzymywany w pamięci aplikacji (`ClientShell` -> `ChatProvider` & `SystemStateProvider`) oraz synchronizowany z `localStorage`.
2. **Warunek Resetu Stanu**:
   - Czyszczenie bufora pamięci i powrót Sanity do stanu `SANE` może nastąpić **wyłącznie** poprzez świadomą decyzję gracza – kliknięcie przycisku `[PURGE BUFFER]` w nagłówku terminala lub wprowadzenie komendy `/clear` / `/reset`.
3. **Puryzm Hydratacji (Next.js App Router)**:
   - Wszelkie odczyty pamięci przeglądarki (`localStorage`) są izolowane w hookach `useEffect` po montowaniu komponentów klienta, gwarantując zerową liczbę błędów Hydration Mismatch.

---

## 5. Rygor Inżynieryjny i Standardy Jakości Kodu

1. **Puryzm Typowania (Strict TypeScript)**:
   - Zero tolerancji dla typu `any`. Pełne typowanie struktur wieloturowych, dostawców AI, metadanych telemetrycznych i zdarzeń audialnych.
2. **Izolacja Poświadczeń i Bezpieczeństwo**:
   - Klucze API (`GEMINI_API_KEY`, `GROQ_API_KEY`) są ściśle odizolowane od kodu klienta i przetwarzane wyłącznie na serwerze w środowisku Node.js.
   - Bezwzględny zakaz bezpośredniej modyfikacji produkcyjnych plików `.env`. Wszystkie zmienne konfiguracyjne są dokumentowane w szablonie `.env.example`.
3. **Ustrukturyzowana Telemetria**:
   - Zakaz stosowania surowych wywołań `console.log` w kodzie produkcyjnym. Wszelkie zdarzenia failover rejestrowane są w formacie JSON z prefiksem `[CLUSTER_TELEMETRY]`.
4. **Wydajność i Zero Bloatware**:
   - Brak instalacji ciężkich bibliotek zewnętrznych tam, gdzie wystarcza natywny `fetch` (np. integracja Groq API bez dedykowanego SDK).
   - Optymalizacja zasobów graficznych (autentyczna mikrofisza `aris.jpg` serwowana przez `next/image`).
