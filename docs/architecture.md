# Architektura Systemu: NEUROCLIN BIOSCIENCES // HUMAN CONNECTOMICS & ARG THRILLER

Dokument opisuje architekturę techniczną, wielostronicową strukturę Next.js 15 (App Router), silnik audialny, dwumotywowy system wizualny (Day/Night mode) z automatyczną degradacją do Analog Horroru, trzystopniowy system Sanity bez sztucznych pętli frazowych, procedurę obsługi publikacji naukowych oraz rygor inżynieryjny projektu **NeuroClin Biosciences Inc.**.

---

## 1. Architektura Wielostronicowa (Next.js App Router)

Aplikacja wykorzystuje pełnostosowy model **Next.js 15+ App Router** ze scentralizowanym, globalnym stanem klienta:

```
app/
├── layout.tsx              # Główny layout serwerowy + KaTeX CSS + metadane korporacji
├── globals.css             # Style Tailwind + motywy Day/Night + filtry CRT + czarne paski cenzury
├── page.tsx                # Strona startowa: Portal B2B usług bioanalitycznych i oprogramowania
├── mail/
│   └── page.tsx            # Poczta wewnętrzna Webmail: 100% autentyczna korespondencja służbowa bez spoilerów
├── archive/
│   └── page.tsx            # Baza publikacji: sterylna wyszukiwarka, czyste dyscypliny, zasada jedynego śladu, raport z 1994 r.
├── chat/
│   └── page.tsx            # BioResearcher AI™ / Bio-Text Composer (globalny stan, persystencja, [PURGE BUFFER])
├── services/
│   └── page.tsx            # Usługi & Cennik B2B: Certyfikowane CRO (UHPLC-MS, ELISA, RNA-Seq, SPR, LIMS)
├── blog/
│   └── page.tsx            # Aktualności korporacyjne: ISO 17025, aparatura, kongresy naukowe
└── api/
    └── chat/
        └── route.ts        # Endpoint strumieniowy POST ze wsparciem SDK @google/genai
```

### Globalny Stan i Warstwa Shell (`components/ClientShell.tsx`)
- W `app/layout.tsx` cała zawartość aplikacji owijana jest w `<ClientShell>`.
- `ClientShell` dostarcza dwa kluczowe konteksty Reacta:
  1. `<SystemStateProvider>` (`SystemStateContext.tsx`) – zarządza motywem (`theme`), zniekształceniami optyki (`opticsOn`, `isGlitching`), silnikiem audio (`audioEnabled`) oraz poziomem degradacji psychiki (`sanityStage`).
  2. `<ChatProvider>` (`ChatContext.tsx`) – zarządza historią wiadomości (`messages`), buforem wpisywania (`input`), statusem strumieniowania (`isStreaming`) oraz rurociągiem komunikacyjnym asystenta.
- Dzięki umiejscowieniu w nadrzędnym shellu, **żadne przejście między podstronami** (np. `/chat` -> `/archive` -> `/services` -> `/chat`) nie resetuje wiadomości ani poziomu Sanity.

---

## 2. Globalna Historia Czatu i Persystencja Sanity

1. **Warstwa Pamięci Podręcznej i Synchronizacji (`localStorage`)**:
   - Historia konwersacji zapisywana jest pod kluczem `neuroclin_chat_history`.
   - Aktualny poziom degradacji Sanity (`sane` | `error` | `insanity`) zapisywany jest pod kluczem `neuroclin_sanity_stage`.
2. **Ochrona przed Hydration Mismatch**:
   - Stan początkowy w SSR i pierwszym przebiegu klienta jest zawsze bezpieczny i identyczny (`INITIAL_CORPORATE_LOGS` oraz `'sane'`).
   - Odczyt i rehydratacja danych z `localStorage` wykonywane są w hooku `useEffect` po stronie klienta, co zapobiega rozbieżnościom HTML między serwerem a klientem.
3. **Ciągłość Doświadczenia Gracza**:
   - Użytkownik wracający na stronę `/chat` widzi dokładnie historię rozmowy, wygenerowane akapity naukowe oraz stan interfejsu (łącznie z glitchami CRT w `error` lub krwawą winietą i scanlines w `insanity`).
4. **Procedura Czyszczenia Bufora (`[PURGE BUFFER]`)**:
   - Czyszczenie pamięci asystenta następuje **wyłącznie** po ręcznym kliknięciu przycisku `[PURGE BUFFER]` w nagłówku terminala lub wpisaniu komendy `/clear` / `/reset`.
   - Operacja ta resetuje historię do komunikatu powitalnego, zeruje poziom Sanity do stanu `SANE`, usuwa dane z `localStorage` i przywraca czystą optykę laboratoryjną.

---

## 3. Portal B2B & Usługi Analityczne (`/`, `/services`)

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

## 4. Poczta Wewnętrzna (`/mail`) – Mid-Level Science & Naturalne Poszlaki

- **Przystępność Biologiczna (Mid-Level Accessibility)**:
  - Treść maila dr. Marcusa H. Webera została dostosowana do czytelnika o średniozaawansowanej wiedzy biologicznej (student medycyny, biologii, pasjonat nauki).
  - Skrajnie hermetyczny żargon zastąpiono jasnymi wyjaśnieniami mechanizmów: ochrona synaps przed ekscytotoksycznością wapniową ($Ca^{2+}$) przez memantynę, klirens blaszek amyloidowych przez lecanemab, wczesna diagnostyka krwi p-tau217 oraz plastyczność synaptyczna LTP w hipokampie.
- **Naturalna Ścieżka Śledztwa ARG**:
  - Weber wprost wskazuje podwładnemu publikację referencyjną: artykuł **PUB-2024-512** autorstwa dr Eleny Vance i dr. Marcusa H. Webera w sekcji *Neurobiologia* w `/archive`.
  - W postscriptum (P.S.) pojawia się intrygująca, profesjonalna przestroga: szef ostrzega przed powoływaniem się na wycofaną z obiegu notę kalibracyjną ze starego **Sektora-7** (seria pomiarowa **ST-94/11** z listopada 1994 r. prowadzona przez dr. **Arisa Thorne’a**).
  - Daje to graczowi czytelne, logiczne punkty zaczepienia do dalszych poszukiwań bez burzenia immersji.

---

## 5. Baza Publikacji & Dwuetapowa Mechanika Śladu ARG (`/archive`)

- **Architektura Modularna i Schemat Danych (`lib/archiveData.ts`, `components/archive/`)**:
  - Struktura danych publikacji została wydzielona do dedykowanego modułu `lib/archiveData.ts` z silnym typowaniem TypeScript (`Publication`, `Author`, `ResultMetric`, `ScientificCategory`, `ArticleType`).
  - Każda publikacja w repozytorium posiada pełną strukturę akademicką (na wzór PubMed / Nature / ScienceDirect):
    1. **Abstrakt (Executive Abstract)**: Zwięzłe podsumowanie hipotez, metodyki i wniosków z renderowaniem symboli i formuł matematycznych/biochemicznych w KaTeX ($p\text{-tau217}$, $\text{Ca}^{2+}$, $K_i$, $P_{app}$, $\Delta \Psi_m$).
    2. **Cel Badania / Wprowadzenie (Study Objective)**: Wyjaśnienie mechanizmu biologicznego, problemu medycznego i celu testu w przystępnym języku dla czytelnika o średniozaawansowanej wiedzy (Mid-Level Biology).
    3. **Metodologia Doświadczalna (Methodology Narrative & Structured Parameters)**: Pełny opis procedury badawczej wraz z zestawieniem parametrów: model komórkowy/tkankowy, aparatura pomiarowa, bufor/medium perfuzyjne oraz częstotliwość próbkowania.
    4. **Wyniki & Tabela Analityczna (Results Narrative & Data Table)**: Spójny opis obserwacji empirycznych oraz precyzyjna tabela zestawiająca grupy kontrolne, grupy badane, wartości $p$-value i istotność statystyczną.
    5. **Wnioski & Translacja Kliniczna (Conclusions & Translational Impact)**: Praktyczne znaczenie dla terapii neurodegeneracji i neuroprotekcji.
    6. **Cytowanie & Eksport (Citation Export)**: Generowanie gotowych rekordów w formatach BibTeX, APA (7th ed.) oraz RIS z możliwością kopiowania jednym kliknięciem.

- **Wielozakładkowy Czytnik Publikacji (`components/archive/PublicationDetailModal.tsx`)**:
  - Interaktywny czytnik z zakładkami: `1. Abstrakt & Wprowadzenie`, `2. Metodologia Doświadczalna`, `3. Wyniki & Tabela Analityczna`, `4. Wnioski & Translacja`, `5. Cytowanie & Eksport`.
  - W pełni responsywny modal z obsługą klawisza `Escape`, animacjami wejścia i pełną integracją dźwiękową `soundEngine`.

- **Skala Repozytorium i Gęstość Wizualna**:
  - 16 pełnowymiarowych, recenzowanych prac badawczych obejmujących 6 klasycznych dyscyplin: `Farmakologia`, `Biochemia`, `Neurobiologia`, `Immunologia`, `Fizjologia`, `Genetyka`.
  - Licznik repozytorium: **4 829 zindeksowanych rekordów**, indeksacja NLM / CrossRef / PubMed Central, zgodność z ISO/IEC 17025 i standardami GLP, licencja CC BY 4.0 Open Access.
  - Filtry dyscyplin z dynamicznymi licznikami artykułów (np. `Wszystkie (16)`, `Neurobiologia (4)`), sortowanie (Najnowsze, Cytowania, Altmetric, Tytuł A–Z) oraz płynna paginacja (6 pozycji na stronę).

- **Zasada Jedynego Śladu (Single Trace Rule)**:
  - Baza `/archive` prezentuje domyślnie wyłącznie w pełni legalne, nowoczesne recenzowane publikacje.
  - W kluczowym artykule dr Vance i dr. Webera (`PUB-2024-512`: *High-Resolution Multielectrode Field Potential Profiling*) w sekcji metodyki znajduje się jednoznaczne potwierdzenie:
    > *„Wartości referencyjne szumu tła i stabilności potencjałów znormalizowano względem wewnętrznego protokołu kalibracyjnego z 14 listopada 1994 r. (seria pomiarowa ST-94/11, dawna Pracownia Elektrofizjologii Sektor-7, kierownik: dr Aris Thorne).”*

- **Sterylna Wyszukiwarka Jako Narzędzie Dedukcji**:
  - Całkowity brak bezpośrednich wskazówek w UI: placeholder w wyszukiwarce ma brzmienie korporacyjne:
    `"Wyszukaj publikacje po tytule, nazwisku autora, słowach kluczowych lub DOI..."`.
  - Wyszukiwarka filtruje po tytule, autorach, afiliacjach, abstraktach, słowach kluczowych MeSH, aparaturze i kodach DOI.

- **Mechanizm Odkrycia i Archiwalny Raport z 1994 r. (`PUB-1994-041-S7`)**:
  - Raport z 1994 r. **nie pojawia się** na liście przy standardowym przeglądaniu ani przy wyborze kategorii.
  - Dopiero gdy użytkownik wpisze w pole wyszukiwania powiązane hasło (`thorne`, `aris`, `1994`, `14.11`, `14 listopada`, `st-94`, `st94`, `sektor-7`, `sektor 7`, `sector 7`), wyszukiwarka ujawnia ukryty dokument:
    *Raport Techniczny ST-94/11: Pilotażowe mapowanie potencjałów mikrosieci neuronalnych w warunkach perfuzji niskotemperaturowej*.
  - **Trwałe Zaczernienie (Permanent Redaction)**:
    - Abstrakt zawiera bloki nieodwracalnej cenzury (`bg-black text-black select-none pointer-events-none`).
    - W zakładce metodyki załączono oficjalną kartę biometryczną i portret doktora Thorne'a (`ScientistPortrait`).
    - W zakładce wyników zawarto oryginalną telemetrię incydentu z 14.11.1994 (godz. 03:17:42 UTC), rejestrującą zanik tętna biologicznego i anomalne oscylacje gamma na magistrali VMEbus.

---

## 6. Bio-Text Composer & Asystent BioResearcher AI (`lib/`, `app/chat/`)

- **Rola i Tożsamość**:
  - Moduł `/chat` funkcjonuje jako **Bio-Text Composer** wspierający redakcję monografii klinicznej o chorobach neurodegeneracyjnych.
  - Generuje zwięzłe akapity naukowe, kinetykę reakcji enzymatycznych, równania biofizyczne w LaTeX ($...$, $$...$$) oraz weryfikację literatury.
- **Trójstopniowy System Sanity**:
  - `SANE`: Rzetelny, erudycyjny konsultant badawczy. Przy pytaniach o Thorne'a dyplomatycznie odmawia dostępu do zarchiwizowanych akt BSL-4 i wraca do zlecenia dr. Webera.
  - `ERROR`: Po 3-4 pytaniach o Sektor-7/Thorne'a system zaczyna dekoherować – pojawiają się raporty błędów pamięci podręcznej z 1994 r., brak tętna somatycznego oraz samoczynne glitche optyki CRT.
  - `INSANITY`: Po 5+ pytaniach pełen Analog Horror. Dr. Aris Thorne przemawia bezpośrednio w CAPS LOCKU, opisując agonię uwięzienia w krzemowych rejestrach klastra.
- **Globalna Persystencja i Inteligentny Auto-Scroll**:
  - Stan historii czatu i stadium degradacji Sanity trwają w tle przy nawigacji po portalu (`/mail`, `/archive`, `/services`, `/blog`).
  - Czyszczenie następuje wyłącznie po świadomym kliknięciu `[PURGE BUFFER]`.
  - Auto-scroll przewija płynnie wyłącznie przy wysłaniu zapytania lub nowej linii strumienia, gdy użytkownik jest przy dolnej krawędzi.
