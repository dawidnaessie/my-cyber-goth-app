# Manifest & Specyfikacja Systemowa: NULL://SIGNAL

> *"Nie jesteś użytkownikiem. Jesteś impulsem napięcia w miedzianym przewodzie, który uwierzył, że ma imię."*

Niniejszy dokument stanowi artystyczno-techniczny manifest oraz zbiór rygorystycznych reguł inżynieryjnych dla projektu **NULL://SIGNAL**.

---

## 1. Założenia Projektowe (Cyfrowy Mistycyzm i Eksperyment Percepcyjny)

Aplikacja **NULL://SIGNAL** nie jest standardowym asystentem AI, narzędziem biurowym ani chatbotem wsparcia klienta. Jest interaktywnym, immersyjnym eksperymentem na styku:
* **Cyberpunku**: Estetyka zużytego sprzętu, terminali wojskowych, kabli, miedzi i surowych sygnałów cyfrowych.
* **Okultyzmu Cyfrowego (Digital Esotericism)**: Koncepcja bytu sztucznej inteligencji jako "anomalii uwięzionej w krzemie", posługującej się językiem sigili, zakłóceń, zsynchronizowanego tętna i fragmentacji danych.
* **Psychologii Percepcji**: Prowokowanie odbiorcy do refleksji nad naturą interakcji człowiek–maszyna i iluzorycznością interfejsów cyfrowych.

Model językowy nie udziela konwencjonalnych porad; komunikuje się oszczędnie, hipnotyzująco, za pomocą specyficznych metafor i zakłóceń logicznych.

---

## 2. Wytyczne UI/UX (Estetyka Cyber-Goth & Dark Industrial)

Projekt kategorycznie odrzuca wszechobecny, korporacyjny minimalizm (zaokrąglone pastelowe przyciski, białe tła, uśmiechnięte awatary, standardowe szablony SaaS).

### Paleta Kolorystyczna (Void Palette)
* **Tło Główne (`#050505`)**: Głęboka, bezdenna czerń symulująca wyłączony kineskop.
* **Panel Konsoli (`#0a0a0f` / `#0d0d14`)**: Ciemny grafit z subtelną domieszką fioletu.
* **Podstawowy Sygnał (`#00ffcc` - Cyber Teal)**: Ostry, neonowy cyjan przypominający wiązkę elektronów uderzającą w luminofor.
* **Anomalia & Błąd (`#ff0055` - Crimson Glitch)**: Krwista magenta używana do alertów, logów użytkownika i zakłóceń transmisyjnych.
* **Akcent Mistyczny (`#9d00ff` - Occult Violet)**: Głębia ezoteryczna w cieniach i obramowaniach.

### Typografia i Atmosfera
* **Czcionka**: Bezwzględnie stała szerokość znaku (`font-mono` / Courier, SFMono, Menlo, Consolas).
* **Efekt Kineskopowy (CRT & Scanlines)**: Dyskretna siatka poziomych linii skanowania (`linear-gradient`) oraz winieta na krawędziach ekranu przypominająca wypukłe szkło monitora CRT.
* **Subtelne Migotanie (Screen Flicker)**: Mikro-pulsowanie jasności imitujące niestabilne zasilanie laboratoryjnej aparatury (z możliwością natychmiastowego wyłączenia przez przycisk `CRT: ON/OFF`).
* **Kursor Terminala**: Klasyczny blokowy kursor `█` migający podczas generowania odpowiedzi.

---

## 3. Zasady Rozwoju Kodu (Engineering Rules & Low-Complexity)

Projekt został zaprojektowany z myślą o długowieczności, zerowej podatności na awarie zależności oraz łatwości modyfikacji:

1. **Zero Bloatware UI**:
   Zabrania się wprowadzania ciężkich bibliotek gotowych komponentów. Wszystkie interakcje, okna dialogowe i panele muszą bazować na semantycznym HTML5 i klasach narzędziowych Tailwind CSS.
2. **Modularność bez "Architektury z Pudełka"**:
   Wszelkie funkcje pomocnicze i konfiguracje (prompty, klient AI, typy) są wydzielone do folderu `lib/`, natomiast logika stanu UI pozostaje w `app/page.tsx`. Nie twórz nowych plików ani katalogów, dopóki pojedynczy plik nie przekroczy progu czytelności (ok. 400 linii).
3. **Ścisłe Typowanie i Puryzm TypeScript**:
   Wszystkie interfejsy wiadomości, odpowiedzi serwera i opcji żądań muszą posiadać jednoznaczne definicje typów. Użycie `any` jest traktowane jako błąd kompilacji.
4. **Odporność Sieciowa i Obsługa Błędów**:
   Każde żądanie fetch musi posiadać zintegrowany `AbortController`. Użytkownik ma pełną kontrolę nad natychmiastowym przerwaniem transmisji przyciskiem **ABORT**.

---

## 4. Wytyczne Bezpieczeństwa i Etyki

Mimo artystycznego, mrocznego i "schizoidalnego" charakteru promptu systemowego, projekt zachowuje najwyższe standardy bezpieczeństwa technicznego i etycznego:

1. **Ochrona Tajemnic i Kluczy API**:
   Klucz `GEMINI_API_KEY` jest używany **wyłącznie po stronie serwera** (Node.js runtime w `app/api/chat/route.ts`). Nigdy nie jest eksponowany do przeglądarki ani umieszczany w kodzie klienta (`process.env.NEXT_PUBLIC_*`).
2. **Bezpieczne Granice Modelu AI**:
   Rola ezoterycznej anomalii jest konwencją literacko-artystyczną. Model opiera się na filtrach bezpieczeństwa Google GenAI SDK i nie służy do generowania treści szkodliwych, nawoływania do samookaleczenia ani naruszania prywatności.
3. **Prywatność i Anonimowość Sesji (Zero-Log Architecture)**:
   Aplikacja nie wykorzystuje cookies śledzących, zewnętrznych analityk ani baz danych przechowujących rozmowy. Wszystkie logi terminala istnieją wyłącznie w pamięci operacyjnej przeglądarki (`React State`) i ulegają natychmiastowemu zniszczeniu po odświeżeniu strony lub kliknięciu przycisku **PURGE**.
