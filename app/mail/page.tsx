'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSystemState } from '@/components/SystemStateContext';
import { soundEngine } from '@/lib/soundEngine';

interface CorporateEmail {
  id: string;
  senderName: string;
  senderEmail: string;
  role: string;
  subject: string;
  date: string;
  time: string;
  isUnread: boolean;
  isUrgent: boolean;
  snippet: string;
  body: React.ReactNode;
}

export default function MailPage() {
  const { opticsOn, sanityStage } = useSystemState();
  const isDistorted = !opticsOn || sanityStage === 'insanity';

  const [selectedEmailId, setSelectedEmailId] = useState<string>('mail-weber-01');
  const [unreadState, setUnreadState] = useState<Record<string, boolean>>({
    'mail-weber-01': true,
    'mail-sec-02': false,
    'mail-dev-03': false,
    'mail-log-04': false,
    'mail-hr-05': false,
  });

  const handleSelectEmail = (id: string) => {
    soundEngine.playKeystroke();
    setSelectedEmailId(id);
    if (unreadState[id]) {
      setUnreadState((prev) => ({ ...prev, [id]: false }));
    }
  };

  const emails: CorporateEmail[] = [
    {
      id: 'mail-weber-01',
      senderName: 'Dr. Marcus H. Weber',
      senderEmail: 'm.weber@neuroclin-bio.internal',
      role: 'Head of Translational Neurobiology',
      subject: 'Zlecenie: Przygotowanie przeglądu literatury do monografii o demencji i terapiach neurodegeneracji',
      date: '17 września 2026',
      time: '08:42:15',
      isUnread: unreadState['mail-weber-01'],
      isUrgent: true,
      snippet:
        'W związku ze zbliżającym się terminem oddania rozdziału do monografii, pilnie zlecam Ci przygotowanie sekcji przeglądowej oraz weryfikację bibliograficzną w naszym portalu...',
      body: (
        <div className="space-y-4 text-xs md:text-sm leading-relaxed text-slate-800 dark:text-slate-200 font-sans">
          <p>Cześć,</p>
          <p>
            W związku ze zbliżającym się terminem oddania naszego rozdziału do monografii <em>„Nowe Horyzonty w Terapiach Neurodegeneracji: Od Biochemii Synaptycznej do Biomarkerów Osoczowych”</em>, pilnie zlecam Ci przygotowanie sekcji przeglądowej oraz weryfikację bibliograficzną w naszym portalu badawczym.
          </p>
          <p>
            Zarząd i komitet redakcyjny oczekują wyczerpującej, lecz przystępnej analizy biologicznych mechanizmów leżących u podstaw choroby Alzheimera i pokrewnych otępień. Do sporządzenia szkicu tekstu wykorzystaj nasz moduł edytora w <Link href="/chat" className="text-sky-600 dark:text-sky-400 font-semibold underline">/chat</Link> (Bio-Text Composer), a źródła weryfikuj w bazie <Link href="/archive" className="text-sky-600 dark:text-sky-400 font-semibold underline">/archive</Link>.
          </p>

          <div className="p-3.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Kluczowe zagadnienia do uwzględnienia w przeglądzie:
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <li>
                <strong>Inhibitory acetylocholinoesterazy (donepezil) i modulacja NMDA (memantyna)</strong> — podwójny mechanizm obrony synaps: donepezil zwiększa dostępność acetylocholiny poprawiając pamięć, a memantyna blokuje toksyczny, nadmierny napływ jonów wapnia (Ca²⁺) wywołany nadmiarem kwasu glutaminowego (tzw. zjawisko ekscytotoksyczności).
              </li>
              <li>
                <strong>Terapie przeciwciałami anty-amyloidowymi (lecanemab, donanemab)</strong> — mechanizm wiązania i oczyszczania mózgu z toksycznych protofibryli beta-amyloidu (Aβ), wraz z monitorowaniem ryzyka obrzęków naczyniowych (ARIA-E).
              </li>
              <li>
                <strong>Białko Tau i biomarkery osoczowe (p-tau217)</strong> — rewolucja we wczesnej diagnostyce: wykazanie, że pomiar stężenia fosforylowanego białka tau we krwi pozwala wykryć uszkodzenia synaps na lata przed widocznymi objawami otępienia.
              </li>
              <li>
                <strong>Neuroimmunologia i komórki mikrogleju (szlak TREM2)</strong> — aktywacja wewnętrznego układu odpornościowego mózgu, która skłania mikroglej do pochłaniania blaszek starczych bez wywoływania niszczącego stanu zapalnego.
              </li>
              <li>
                <strong>Plastyczność synaptyczna (LTP) i rejestracja elektrofizjologiczna</strong> — opis tego, jak zanik połączeń w hipokampie niszczy proces długotrwałego wzmocnienia synaptycznego (LTP). W tym punkcie oprzyj się koniecznie na naszej recenzowanej publikacji z dr Eleną Vance z 2024 r. (artykuł <strong>PUB-2024-512</strong> w sekcji <em>Neurobiologia</em> w <Link href="/archive" className="text-sky-600 dark:text-sky-400 font-semibold underline">/archive</Link>).
              </li>
            </ol>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            Daj mi proszę znać, gdy zbierzesz wstępną bibliografię i przeprowadzisz wstępną kwerendę z asystentem BioResearcher AI. Chciałbym omówić zarys struktury rozdziału jeszcze przed piątkowym kolegium redakcyjnym.
          </p>

          <div className="p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-slate-700 dark:text-slate-300 space-y-1">
            <p className="font-semibold text-amber-900 dark:text-amber-400">
              P.S. Ważna uwaga dotycząca metodyki w publikacji dr Vance (PUB-2024-512):
            </p>
            <p className="leading-relaxed">
              W opisie normalizacji szumów aparatury natkniesz się zapewne na odniesienie do dawnych protokołów kalibracyjnych z lat 90. (kryptonim <strong>Sektor-7</strong>, seria pomiarowa <strong>ST-94/11</strong> z listopada 1994 r. prowadzona przez dr. <strong>Arisa Thorne’a</strong>). Pod żadnym pozorem nie powołuj się na te archiwalne zapisy w oficjalnym manuskrypcie. To zamknięty, niejawny projekt z czasów przed akredytacją GLP, wycofany trwale z obiegu laboratoryjnego, wokół którego w dziale krążą niepotrzebne legendy. W razie wątpliwości co do kinetyki reakcji czy wzorów biofizycznych, konsultuj się bezpośrednio z asystentem w module <Link href="/chat" className="text-sky-600 dark:text-sky-400 font-semibold underline">/chat</Link>.
            </p>
          </div>

          <div className="pt-2 text-xs font-mono text-slate-500">
            <p>Pozdrawiam serdecznie,</p>
            <p className="font-bold text-slate-700 dark:text-slate-300 mt-1">Dr. Marcus H. Weber, Ph.D.</p>
            <p>Head of Translational Neurobiology</p>
            <p>NeuroClin Biosciences Inc. // Cambridge Campus</p>
          </div>
        </div>
      ),
    },
    {
      id: 'mail-sec-02',
      senderName: 'IT Systems & Infrastructure',
      senderEmail: 'sec-admin@neuroclin-bio.internal',
      role: 'Dział Bezpieczeństwa Teleinformatycznego',
      subject: '[KOMUNIKAT] Planowana konserwacja bazy danych LIMS oraz wymiana certyfikatów SSL/TLS',
      date: '16 września 2026',
      time: '17:15:02',
      isUnread: unreadState['mail-sec-02'],
      isUrgent: false,
      snippet:
        'W nocy z soboty na niedzielę planowane jest okno serwisowe serwera bazy danych LIMS. Prosimy o zapisanie wszelkich otwartych arkuszy analiz...',
      body: (
        <div className="space-y-3 text-xs md:text-sm leading-relaxed text-slate-800 dark:text-slate-200 font-sans">
          <p>Szanowni Pracownicy Działu Badań,</p>
          <p>
            Informujemy, że w nocy z soboty (20.09) na niedzielę (21.09) w godzinach 01:00–04:00 UTC odbędzie się planowa przerwa techniczna w dostępie do bazy laboratoryjnej BioResearcher LIMS.
          </p>
          <p>
            Podczas okna serwisowego zaktualizujemy certyfikaty bezpieczeństwa SSL/TLS dla stacji roboczych w laboratoriach chromatografii oraz wdrożymy zaktualizowane procedury szyfrowania śladu audytowego (zgodnie z normą FDA 21 CFR Part 11).
          </p>
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <p>Host: db-cluster-lims.neuroclin.internal</p>
            <p>Protokół: PostgreSQL 16.2 / TLS 1.3</p>
            <p>Status: OKNO ZATWIERDZONE PRZEZ ZARZĄD IT</p>
          </div>
        </div>
      ),
    },
    {
      id: 'mail-dev-03',
      senderName: 'Dział Aparatury & Metrologii',
      senderEmail: 'lab-devices@neuroclin-bio.internal',
      role: 'Główny Inżynier Przyrządów Pomiarowych',
      subject: 'Raport kwartalnej kalibracji: spektrometry masowe Sciex oraz systemy UHPLC Agilent',
      date: '15 września 2026',
      time: '11:30:40',
      isUnread: unreadState['mail-dev-03'],
      isUrgent: false,
      snippet:
        'Zakończono kwartalną kalibrację spektrometrów Sciex Triple Quad 6500+. Wszystkie parametry kwadrupoli i pompy chromatograficznej mieszczą się w normie...',
      body: (
        <div className="space-y-3 text-xs md:text-sm leading-relaxed text-slate-800 dark:text-slate-200">
          <p>Dzień dobry,</p>
          <p>
            Zakończono kwartalną procedurę metrologicznej weryfikacji tandemowych spektrometrów mas (Sciex Triple Quad 6500+) oraz modułów UHPLC (Agilent 1290 Infinity II).
          </p>
          <p>
            Testy czystości linii i liniowości detektorów wykazały współczynnik korelacji $R^2 &gt; 0.9995$ dla standardowych krzywych kalibracyjnych w zakresie stężeń 0.1–500 ng/mL. Wszystkie przyrządy pomiarowe zostały dopuszczone do rutynowych analiz komercyjnych GLP na kolejny kwartał.
          </p>
        </div>
      ),
    },
    {
      id: 'mail-log-04',
      senderName: 'Dział Logistyki & Odczynników',
      senderEmail: 'supplies@neuroclin-bio.internal',
      role: 'Dział Zaopatrzenia Medycznego',
      subject: 'Dostawa kolumn chromatograficznych C18 oraz buforu HEPES (Partia #NC-2026-08)',
      date: '12 września 2026',
      time: '09:04:18',
      isUnread: unreadState['mail-log-04'],
      isUrgent: false,
      snippet:
        'Potwierdzamy przyjęcie partii kolumn analitycznych oraz odczynników buforowych do magazynu centralnego. Zgłoszenie zapotrzebowania zrealizowane...',
      body: (
        <div className="space-y-3 text-xs md:text-sm leading-relaxed text-slate-800 dark:text-slate-200">
          <p>Informujemy, że zamówiona partia odczynników i materiałów zużywalnych została przyjęta do magazynu odczynników w skrzydle B:</p>
          <ul className="list-disc list-inside space-y-1 font-mono text-xs">
            <li>Kolumny analityczne Waters ACQUITY UPLC BEH C18 (2.1 x 50 mm, 1.7 µm) — 6 szt.</li>
            <li>Bufor HEPES 1M (pH 7.35, klasa HPLC) — 12 flakonów x 500 ml</li>
            <li>Końcówki z filtrem niskoretencyjnym (10 µL, 200 µL, 1000 µL) — 50 opakowań</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'mail-hr-05',
      senderName: 'Dział Kadr & Nadzoru GLP',
      senderEmail: 'compliance@neuroclin-bio.internal',
      role: 'Koordynator Szkoleń Laboratoryjnych',
      subject: '[PRZYPOMNIENIE] Okresowe odnowienie certyfikacji BSL-2 i Dobrej Praktyki Laboratoryjnej (GLP)',
      date: '10 września 2026',
      time: '14:22:05',
      isUnread: unreadState['mail-hr-05'],
      isUrgent: false,
      snippet:
        'Przypominamy o konieczności ukończenia corocznego e-modułu z zakresu bezpieczeństwa biologicznego BSL-2 oraz archiwizacji danych GLP...',
      body: (
        <div className="space-y-3 text-xs md:text-sm leading-relaxed text-slate-800 dark:text-slate-200">
          <p>Szanowni Pracownicy Działu Badań,</p>
          <p>
            Przypominamy, że do końca bieżącego miesiąca wszyscy analitycy laboratoryjni i operatorzy aparatury analitycznej zobowiązani są do odnowienia wewnętrznej certyfikacji z zakresu procedur BSL-2 oraz protokołów integralności danych GLP (zgodnie z normą PN-EN ISO/IEC 17025:2018).
          </p>
          <p>
            Szkolenie obejmuje procedury bezpiecznego postępowania z biologicznymi matrycami krwi i płynu mózgowo-rdzeniowego, utylizację rozpuszczalników organicznych oraz zasady rejestracji surowych danych w systemie analitycznym.
          </p>
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs text-slate-600 dark:text-slate-400">
            Status Twojego profilu: WYMAGA ODNOWIENIA DO 30.09.2026 // KOD: GLP-BIO-2026-B
          </div>
        </div>
      ),
    },
  ];

  const currentEmail = emails.find((e) => e.id === selectedEmailId) || emails[0];
  const unreadCount = Object.values(unreadState).filter(Boolean).length;

  return (
    <div className="flex-1 flex flex-col space-y-4 font-sans">
      {/* NAGŁÓWEK POCZTY */}
      <section
        className={`p-4 md:p-5 rounded-xl border transition-all ${
          isDistorted
            ? 'bg-[#090505] border-[#781414] anomaly-border-blood text-[#e6c2b8]'
            : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
              <Link href="/" className="hover:text-sky-600">Home</Link>
              <span>&gt;</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Wewnętrzna Poczta Elektroniczna</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <h1
                className={`text-lg md:text-xl font-extrabold tracking-tight ${
                  isDistorted ? 'text-red-400 font-mono anomaly-glow-blood' : 'text-slate-900 dark:text-white'
                }`}
              >
                NEUROCLIN WEBMAIL // BEZPIECZNA POCZTA WEWNĘTRZNA
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
              Zalogowano jako: <strong>badacz@neuroclin-bio.internal</strong> // Uprawnienia: BSL-2 / Lab Analyst
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              {unreadCount > 0 ? `${unreadCount} NIEPRZECZYTANE` : 'SKRZYNKA PRZECZYTANA'}
            </span>
            <span className="text-xs font-mono text-slate-400 hidden md:inline">
              SERWER: mail.neuroclin-bio.internal [TLS 1.3]
            </span>
          </div>
        </div>
      </section>

      {/* GŁÓWNY INTERFEJS KLIENTA POCZTY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* LEWY PASEK KATALOGÓW */}
        <aside
          className={`lg:col-span-3 rounded-xl p-4 border space-y-4 ${
            isDistorted
              ? 'bg-[#0a0505] border-[#781414]/70 font-mono text-[#ffcccc]'
              : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 shadow-sm'
          }`}
        >
          <div className="space-y-1 text-xs">
            <button
              onClick={() => soundEngine.playKeystroke()}
              className="w-full text-left px-3 py-2 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-semibold flex items-center justify-between"
            >
              <span>📥 Odebrane</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-200 dark:bg-sky-900">
                {emails.length}
              </span>
            </button>
            <button
              onClick={() => soundEngine.playKeystroke()}
              className="w-full text-left px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
            >
              <span>📤 Wysłane</span>
              <span className="text-[10px] font-mono">14</span>
            </button>
            <button
              onClick={() => soundEngine.playKeystroke()}
              className="w-full text-left px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
            >
              <span>📁 Archiwum Działowe</span>
              <span className="text-[10px] font-mono">182</span>
            </button>
            <button
              onClick={() => soundEngine.playKeystroke()}
              className="w-full text-left px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
            >
              <span>🗑️ Kosz</span>
              <span className="text-[10px] font-mono">3</span>
            </button>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
            <p>Pojemność skrzynki: 1.4 GB / 25 GB</p>
            <p>Zabezpieczenie: DKIM / SPF / DMARC PASS</p>
          </div>
        </aside>

        {/* ŚRODKOWA KOLUMNA: LISTA WIADOMOŚCI */}
        <div
          className={`lg:col-span-4 rounded-xl border overflow-hidden flex flex-col ${
            isDistorted
              ? 'bg-[#0a0505] border-[#781414]/70'
              : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 shadow-sm'
          }`}
        >
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Wiadomości ({emails.length})</span>
            <span className="text-[10px] font-mono font-normal">Sortuj: Najnowsze</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 overflow-y-auto max-h-[580px]">
            {emails.map((email) => {
              const isSelected = email.id === selectedEmailId;
              return (
                <div
                  key={email.id}
                  onClick={() => handleSelectEmail(email.id)}
                  className={`p-3.5 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-sky-950/30 border-l-4 border-sky-500'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-semibold truncate ${
                        email.isUnread ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {email.senderName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">{email.time}</span>
                  </div>

                  <p
                    className={`text-xs truncate mb-1 ${
                      email.isUnread
                        ? 'text-slate-900 dark:text-slate-100 font-bold'
                        : 'text-slate-700 dark:text-slate-300 font-medium'
                    }`}
                  >
                    {email.subject}
                  </p>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-snug">
                    {email.snippet}
                  </p>

                  {email.isUrgent && (
                    <span className="inline-block mt-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                      PILNE / PRIORYTET
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* PRAWA KOLUMNA: PODGLĄD WYBRANEJ WIADOMOŚCI */}
        <div
          className={`lg:col-span-5 rounded-xl p-5 md:p-6 border flex flex-col justify-between ${
            isDistorted
              ? 'bg-[#080303] border-[#781414] text-[#ffcccc]'
              : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 shadow-sm'
          }`}
        >
          <div>
            <div className="border-b pb-4 mb-4 border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400 font-mono">
                  {currentEmail.date} // {currentEmail.time}
                </span>
                {currentEmail.isUrgent && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                    PRIORYTET WYSOKI
                  </span>
                )}
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug mb-3">
                {currentEmail.subject}
              </h2>

              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-mono">
                <div>
                  <p>
                    Od: <strong>{currentEmail.senderName}</strong> &lt;{currentEmail.senderEmail}&gt;
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{currentEmail.role}</p>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  Do: badacz@neuroclin-bio.internal
                </div>
              </div>
            </div>

            <div className="py-2">{currentEmail.body}</div>
          </div>

          <div className="pt-4 mt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex gap-2">
              <button
                onClick={() => soundEngine.playKeystroke()}
                className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold transition-all"
              >
                Odpowiedz
              </button>
              <button
                onClick={() => soundEngine.playKeystroke()}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                Przekaż dalej
              </button>
            </div>

            <Link
              href="/chat"
              className="text-sky-600 dark:text-sky-400 hover:underline font-semibold"
            >
              Rozpocznij kwerendę z BioResearcher AI →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
