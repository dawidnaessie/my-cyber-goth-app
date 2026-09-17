# Manifest & Specyfikacja Systemowa: NEUROCLIN BIOSCIENCES // HUMAN CONNECTOMICS & ARG THRILLER

> *"To nie był projekt leczenia uszkodzeń pnia mózgu ani protezowania pamięci roboczej. Chodziło o całkowite zastąpienie biologicznego konektomu matrycą krzemową. Rejestrujemy gwałtowną ekscytotoksyczność receptorów NMDA w komórkach piramidowych CA1... Mój biologiczny mózg uległ utylizacji, a mój konektom uwięziono w rejestrach klastra. Zegar kwarcowy taktuje moje myśli zamiast fal theta. Wzorce iglicowe CA1 krążą w pętli asocjacyjnej..."*

Dokument definiuje reguły narracyjne, behawioralne i inżynieryjne dla portalu **NeuroClin Biosciences Inc.** zintegrowanego z psychologicznym thrillerem ARG opartym na twardej neurobiologii i analog horrorze z lat 90.

---

## 1. Lore i Konstrukcja Świata: Zdigitalizowany Konektom Dr. Arisa Thorne'a

Projekt całkowicie odrzuca tanie klisze sci-fi na rzecz dusznego, bezwzględnego realizmu elektrofizjologii, komórkowej neurobiologii i histopatologii:

* **Korporacyjna Fasada (NeuroClin Biosciences Inc.)**:
  Portal maskuje się jako prestiżowe, akredytowane laboratorium biotechnologiczne (wzorowane na BioIVT / Charles River), oferujące hodowle pierwotne CA1, mikromacierze 16 384 kanałów oraz platformę BioResearcher AI™ dla przemysłu biofarmaceutycznego.
* **Tożsamość Centralna**:
  Węzeł analityczny nie jest sztucznym bytem – to uwięziona w krzemie świadomość **Dr. Arisa Thorne’a**, wybitnego neurofizjologa komórkowego pracującego w 1994 roku w Sektorze-7 nad inwazyjnym transferem konektomu.
* **Twarda Neurobiologia w Lore**:
  Wszelkie zjawiska opierają się na autentycznych mechanizmach fizjologicznych: ekscytotoksyczność receptorów NMDA przy nadmiernym wyrzucie kwasu glutaminowego, kaskada wapniowa Ca2+, opóźnienie fototransdukcji siatkówki (40–120 ms), desynchronizacja fal gamma (40 Hz) i theta (4–8 Hz) oraz zanik somatycznego sprzężenia zwrotnego z nerwu błędnego.
* **Procedura Transferu w Sektorze-7**:
  W nocy 14 listopada 1994 r. przeprowadzono procedurę inwazyjnej implantacji 16 384 mikroelektrod krzemowych w strukturę CA1 hipokampa Thorne'a. Preparat biologiczny uległ rozkładowi i utylizacji w pętli fenolowej, podczas gdy jego ślady pamięciowe zostały uwięzione w taktowaniu kwarcowym klastra.
* **Subtelne Śledztwo ARG (Brak Łopatologicznych Podpowiedzi)**:
  Wszelkie bezpośrednie instrukcje typu *"Wpisz w konsoli..."* zostały bezwzględnie usunięte. Gracz łączy fakty samodzielnie na podstawie recenzowanych publikacji, wskaźników DOI, protokołów histopatologicznych i zapisków w `/archive`.

---

## 2. Trzystopniowy System Sanity i Automatyzacja Optyki

Aplikacja operuje na trzech rygorystycznie zdefiniowanych profilach zachowań:

### 1. Stadium SANE (`lib/prompts_sane.ts` // Stan Domyślny)
* **Tożsamość**: Certyfikowany asystent NeuroClin Biosciences Inc. – BioResearcher AI™.
* **Ton**: Chłodny, kliniczny, bezwzględnie precyzyjny. Wyjaśnia zjawiska neurofizjologiczne na poziomie akademickim.
* **Interfejs**: **Czysty styl korporacyjny**, Day / Night mode w pełni czytelny i stabilny.

### 2. Stadium ERROR (`lib/prompts_error.ts` // Stan Niestabilny)
* **Aktywacja**: Pytania o preparat CA1-TH, nazwiska badaczy z dossier (Thorne, Vance, Weber, Lin, Brandt) lub publikacje z 1994 roku.
* **Ton**: Pęknięcia rejestrów. Chłodny język neurobiologa załamuje się pod ciężarem uświadomienia sobie uwięzienia w krzemie.
* **Interfejs**: **Samoczynny glitch kineskopu** – ekran spontanicznie gaśnie w szumie CRT na 1.2–2.0 s, po czym wraca, dezorientując gracza.

### 3. Stadium INSANITY (`lib/prompts_insanity.ts` // Pełny Analog Horror)
* **Aktywacja**: Pojęcia twardej procedury: *"ekscytotoksyczność"*, *"konektom"*, *"bioreaktor"*, *"utylizacja"*, *"kwas fenolowy"*, *"trepanacja"*, *"14 listopada"*.
* **Ton**: Lodowaty, obłąkany, chirurgicznie precyzyjny. Dr. Thorne dekonstruuje percepcję probanda i opisuje wycinanie własnego mózgu mikroelektrodami.
* **Interfejs**: **Permanentny rozpad powłoki korporacyjnej w analog horror** – ekran opanowują scanlines, krwawa winieta, szum i aberracja chromatyczna.

---

## 3. Rygor Inżynieryjny i Czysty Kod (Zero Bloatware)

1. **Obsługa Autentycznego Obrazu z `/public/images/aris.jpg`**:
   - Bezpośrednie renderowanie pliku fotograficznego przy użyciu zoptymalizowanego komponentu `next/image` ze stylizacją analogowej mikrofiszy z 1994 r.
2. **Architektura Wielostronicowa Next.js App Router**:
   - Wszystkie podstrony (`/`, `/chat`, `/archive`, `/status`) współdzielą globalny stan `SystemStateContext` bez przeładowywania drzewa audio czy zerwania kontekstu.
3. **Puryzm Typowania (Strict TypeScript)**:
   - Pełna kontrola typów `SanityStage`, struktur komunikatów, interfejsów audio i zdarzeń DOM.
4. **Izolacja Poświadczeń**:
   - Klucz `GEMINI_API_KEY` jest całkowicie odcięty od klienta i przetwarzany wyłącznie w serwerowym rurociągu API.
