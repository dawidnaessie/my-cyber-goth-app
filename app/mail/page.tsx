'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSystemState } from '@/components/SystemStateContext';
import { soundEngine } from '@/lib/soundEngine';

interface EmailItem {
  id: string;
  senderName: string;
  senderEmail: string;
  role: string;
  subject: string;
  date: string;
  time: string;
  isUnread: boolean;
  isUrgent: boolean;
  isClassified?: boolean;
  snippet: string;
  body: React.ReactNode;
}

export default function MailPage() {
  const { opticsOn, sanityStage } = useSystemState();
  const isDistorted = !opticsOn || sanityStage === 'insanity';

  const [selectedEmailId, setSelectedEmailId] = useState<string>('mail-weber-01');
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'starred' | 'sent' | 'archive' | 'trash'>('inbox');
  const [unreadState, setUnreadState] = useState<Record<string, boolean>>({
    'mail-weber-01': true,
    'mail-sec-02': false,
    'mail-dev-03': false,
    'mail-log-04': false,
    'mail-hr-05': false,
  });

  const markAsRead = (id: string) => {
    soundEngine.playKeystroke();
    setUnreadState((prev) => ({ ...prev, [id]: false }));
  };

  const emails: EmailItem[] = [
    {
      id: 'mail-weber-01',
      senderName: 'Dr. Marcus H. Weber',
      senderEmail: 'm.weber@neuroclin-bio.internal',
      role: 'Kierownik Zespołu Neurobiologii Translacyjnej // Prowadzący',
      subject: 'PILNE: Zlecenie sekcji do monografii o chorobach neurodegeneracyjnych (termin: piątek)',
      date: '17 września 2026',
      time: '08:42:15',
      isUnread: unreadState['mail-weber-01'],
      isUrgent: true,
      snippet:
        'Cześć, w związku ze zbliżającym się terminem oddania rozdziału monografii o terapiach demencji i AD, musisz przygotować podsumowanie bibliograficzne...',
      body: (
        <div className="space-y-4 text-xs md:text-sm leading-relaxed text-slate-800 dark:text-slate-200">
          <p>
            Cześć,
          </p>
          <p>
            W związku ze zbliżającym się terminem oddania naszego rozdziału do monografii <em>„Nowe Horyzonty w Terapiach Neurodegeneracji: Od Biochemii Synaptycznej do Biomarkerów Osoczowych”</em>, pilnie zlecam Ci przygotowanie sekcji przeglądowej oraz weryfikację bibliograficzną w naszym portalu badawczym.
          </p>
          <p>
            Zarząd i komitet redakcyjny oczekują wyczerpującej analizy następujących standardowych mechanizmów terapeutycznych (wykorzystaj naszą bazę w <Link href="/archive" className="text-sky-600 dark:text-sky-400 font-semibold underline">/archive</Link> oraz asystenta <Link href="/chat" className="text-sky-600 dark:text-sky-400 font-semibold underline">/chat</Link>):
          </p>

          <div className="p-3.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Kluczowe zagadnienia do uwzględnienia w przeglądzie:
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              <li>
                <strong>Inhibitory acetylocholinoesterazy (AChE)</strong> (donepezil, rywastygmina) oraz modulacja allosteryczna NMDA (memantyna) — kinetyka receptorowa i zapobieganie napływowi jonów Ca²⁺.
              </li>
              <li>
                <strong>Terapie monoklonalne anty-amyloidowe</strong> (lecanemab, donanemab) — mechanizm usuwania protofibryli Aβ oraz wskaźniki powikłań naczyniowych (ARIA-E).
              </li>
              <li>
                <strong>Białko Tau i biomarkery osoczowe</strong> — fosforylacja p-tau217 i p-tau181 jako czułe indykatory wczesnej neurodystrofii synaptycznej.
              </li>
              <li>
                <strong>Neuroimmunologia i mikroglej</strong> — rola szlaku TREM2 w modulacji fagocytozy blaszek oraz wygaszaniu przewlekłego stanu zapalnego.
              </li>
            </ol>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            Daj mi proszę znać, gdy zbierzesz wstępną bibliografię i przeprowadzisz wstępną kwerendę z asystentem BioResearcher AI. Chciałbym omówić zarys struktury rozdziału jeszcze przed piątkowym kolegium redakcyjnym.
          </p>

          <p className="text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800/70">
            P.S. W sekcji metodycznej musimy podeprzeć się wcześniejszą literaturą naszego ośrodka. Przeszukaj proszę zasoby w <Link href="/archive" className="text-sky-600 dark:text-sky-400 underline font-medium">/archive</Link> pod kątem dawnych protokołów elektrofizjologicznych skrawków hipokampa (CA1) oraz kultur organoidów, aby zestawić parametry techniczne.
          </p>

          <div className="pt-2 text-xs font-mono text-slate-500">
            <p>Pozdrawiam serdecznie,</p>
            <p className="font-bold text-slate-700 dark:text-slate-300 mt-1">Dr. Marcus H. Weber, Ph.D.</p>
            <p>Head of Translational Neurobiology & Synaptic Connectomics</p>
            <p>NeuroClin Biosciences Inc. // Cambridge Campus</p>
          </div>
        </div>
      ),
    },
    {
      id: 'mail-sec-02',
      senderName: 'IT Security & Cluster Ops',
      senderEmail: 'sec-admin@neuroclin-bio.internal',
      role: 'Dział Bezpieczeństwa Teleinformatycznego',
      subject: '[KOMUNIKAT] Okresowa wymiana tokenów autoryzacyjnych do klastra obliczeniowego FPGA',
      date: '16 września 2026',
      time: '17:15:02',
      isUnread: unreadState['mail-sec-02'],
      isUrgent: false,
      snippet:
        'Wszystkie terminale badawcze podpięte do szyny VMEbus muszą zaktualizować tokeny autoryzacyjne przed weekendowym oknem serwisowym...',
      body: (
        <div className="space-y-3 text-xs md:text-sm leading-relaxed text-slate-800 dark:text-slate-200 font-sans">
          <p>
            Szanowni Pracownicy Zespołu Badawczego,
          </p>
          <p>
            W nocy z soboty na niedzielę planowany jest rutynowy restart magistrali światłowodowej klastra biofizycznego FPGA (częstotliwość bazowa 66 MHz). Prosimy o zapisanie wszelkich otwartych sesji symulacji plastyczności synaptycznej do godziny 23:00.
          </p>
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <p>Węzeł główny: CLUSTER-S7-CORE-01</p>
            <p>Protokół: IP-over-VMEbus / Sub-system TH-94</p>
            <p>Status: MONITOROWANY CAŁODOBOWO</p>
          </div>
        </div>
      ),
    },
    {
      id: 'mail-dev-03',
      senderName: 'Aparatura & Metrologia',
      senderEmail: 'lab-devices@neuroclin-bio.internal',
      role: 'Główny Inżynier Przyrządów Pomiarowych',
      subject: 'Raport kalibracji: spektrometry masowe oraz mikromacierze 16 384 sond (HD-MEA)',
      date: '15 września 2026',
      time: '11:30:40',
      isUnread: unreadState['mail-dev-03'],
      isUrgent: false,
      snippet:
        'Kalibracja matrycy HD-MEA #088 wykazała 99.4% sprawności kanałów. Odnotowano drobne fluktuacje potencjału spoczynkowego...',
      body: (
        <div className="space-y-3 text-xs md:text-sm leading-relaxed text-slate-800 dark:text-slate-200">
          <p>Dzień dobry,</p>
          <p>
            Zakończono kwartalną kalibrację matrycy krzemowej o gęstości 16 384 mikroelektrod. Pomiary szumów tła wykazały stabilność na poziomie poniżej 2.5 µV RMS.
          </p>
          <p>
            Zwracamy uwagę, że w kanale 412–420 odnotowano powtarzające się wzorce wyładowań iglicowych o charakterystyce zgodnej z rytmem theta (4–7 Hz), pomimo braku podłączonej świeżej tkanki w bioreaktorze. Urządzenie zostało przekazane do weryfikacji przez zespół konektomiki.
          </p>
        </div>
      ),
    },
    {
      id: 'mail-log-04',
      senderName: 'Dział Logistyki & Odczynników',
      senderEmail: 'supplies@neuroclin-bio.internal',
      role: 'Dział Zaopatrzenia Medycznego',
      subject: 'Dostawa krioflaszek i buforu HEPES (Partia #NC-2026-08)',
      date: '12 września 2026',
      time: '09:04:18',
      isUnread: unreadState['mail-log-04'],
      isUrgent: false,
      snippet:
        'Potwierdzamy przyjęcie partii odczynników buforowych do chłodni -80°C w skrzydle B. Zgłoszenie zapotrzebowania zrealizowane...',
      body: (
        <div className="space-y-3 text-xs md:text-sm leading-relaxed text-slate-800 dark:text-slate-200">
          <p>Informujemy, że zamówiona partia odczynników laboratoryjnych została złożona w magazynie kriogenicznym skrzydła B:</p>
          <ul className="list-disc list-inside space-y-1 font-mono text-xs">
            <li>Bufor HEPES 1M (pH 7.35) — 12 flakonów x 500 ml</li>
            <li>Pożywka hodowlana Neurobasal-A z suplementem B-27 — 20 l</li>
            <li>Mikropipety borokrzemianowe 4.5 MΩ — 500 szt.</li>
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
        'Przypominamy o konieczności ukończenia corocznego e-modułu z zakresu bezpieczeństwa biologicznego BSL-2 oraz archiwizacji danych...',
      body: (
        <div className="space-y-3 text-xs md:text-sm leading-relaxed text-slate-800 dark:text-slate-200">
          <p>Szanowni Pracownicy Działu Badań,</p>
          <p>
            Przypominamy, że do końca bieżącego miesiąca wszyscy analitycy laboratoryjni i operatorzy klastra zobowiązani są do odnowienia wewnętrznej certyfikacji z zakresu procedur BSL-2 oraz protokołów integralności danych GLP (zgodnie z normą ISO/IEC 17025).
          </p>
          <p>
            Szkolenie obejmuje procedury postępowania z pierwotnymi kulturami neuronalnymi, bezpieczną utylizację odczynników organicznych oraz zasady anonimizacji wyników przed publikacją w repozytorium.
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
              Zalogowano jako: <strong>badacz@neuroclin-bio.internal</strong> // Uprawnienia: BSL-2+ / Lab Analyst
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
          <div className="space-y-1">
            <button
              onClick={() => {
                soundEngine.playKeystroke();
                setActiveFolder('inbox');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeFolder === 'inbox'
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>📥</span>
                <span>Odebrane</span>
              </div>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                soundEngine.playKeystroke();
                setActiveFolder('starred');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeFolder === 'starred'
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>⭐</span>
                <span>Oznaczone</span>
              </div>
              <span className="text-[10px] text-slate-400">1</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playKeystroke();
                setActiveFolder('sent');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeFolder === 'sent'
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>📤</span>
                <span>Wysłane</span>
              </div>
              <span className="text-[10px] text-slate-400">14</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playKeystroke();
                setActiveFolder('archive');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeFolder === 'archive'
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>🗄️</span>
                <span>Archiwum Badań</span>
              </div>
              <span className="text-[10px] text-slate-400">128</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playKeystroke();
                setActiveFolder('trash');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeFolder === 'trash'
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>🗑️</span>
                <span>Kosz</span>
              </div>
              <span className="text-[10px] text-slate-400">3</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono text-slate-500">
            <div className="flex justify-between text-[11px]">
              <span>Zajętość konta:</span>
              <span className="font-bold">4.8 GB / 10 GB</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-sky-500 h-full w-[48%]" />
            </div>
            <p className="text-[10px] text-slate-400">Archiwum zgodne z protokołem GLP-NC.</p>
          </div>

          {/* SZYBKIE SKRÓTY DO BADANIA */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              SKRÓTY ROBOCZE:
            </h5>
            <Link
              href="/archive"
              className="block p-2 rounded bg-slate-50 dark:bg-slate-800/60 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-[11px] text-sky-600 dark:text-sky-400 transition-colors"
            >
              &rarr; Baza Publikacji & Archiwum
            </Link>
            <Link
              href="/chat"
              className="block p-2 rounded bg-slate-50 dark:bg-slate-800/60 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-[11px] text-sky-600 dark:text-sky-400 transition-colors"
            >
              &rarr; Bio-Chat AI Konsultant
            </Link>
          </div>
        </aside>

        {/* ŚRODKOWA KOLUMNA: LISTA MAILI */}
        <section
          className={`lg:col-span-4 rounded-xl border p-2 space-y-1.5 overflow-y-auto max-h-[640px] ${
            isDistorted
              ? 'bg-[#080404] border-[#781414]/70 font-mono'
              : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 shadow-sm'
          }`}
        >
          <div className="p-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>SKRZYNKA ODBIORCZA ({emails.length})</span>
            <span className="text-[10px] font-mono">FILTR: DATA DESC</span>
          </div>

          {emails.map((email) => {
            const isSelected = email.id === selectedEmailId;
            const isUnread = email.isUnread;

            return (
              <div
                key={email.id}
                onClick={() => {
                  soundEngine.playKeystroke();
                  setSelectedEmailId(email.id);
                  if (email.isUnread) {
                    markAsRead(email.id);
                  }
                }}
                className={`p-3 rounded-lg cursor-pointer transition-all border select-none ${
                  isSelected
                    ? isDistorted
                      ? 'bg-red-950/60 border-red-700 text-red-100 shadow-sm'
                      : 'bg-sky-50/90 dark:bg-sky-950/50 border-sky-300 dark:border-sky-800 text-sky-950 dark:text-sky-100 shadow-sm'
                    : isDistorted
                    ? 'bg-[#0e0606] border-red-900/40 hover:border-red-700 text-red-300'
                    : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800 hover:border-sky-400 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <div className="flex items-center gap-1.5 font-semibold">
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    )}
                    <span className={isUnread ? 'font-bold text-slate-900 dark:text-white' : ''}>
                      {email.senderName}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{email.time}</span>
                </div>

                <h4
                  className={`text-xs font-semibold mb-1 line-clamp-1 ${
                    email.isUrgent
                      ? 'text-amber-700 dark:text-amber-400 font-bold'
                      : isSelected
                      ? 'text-slate-900 dark:text-white font-bold'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {email.isUrgent && <span className="text-red-500 mr-1">[!]</span>}
                  {email.subject}
                </h4>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                  {email.snippet}
                </p>
              </div>
            );
          })}
        </section>

        {/* PRAWA KOLUMNA: PODGLĄD WYBRANEJ WIADOMOŚCI */}
        <section
          className={`lg:col-span-5 rounded-xl border p-5 md:p-6 flex flex-col justify-between overflow-y-auto max-h-[640px] ${
            isDistorted
              ? 'bg-[#090505] border-[#781414] anomaly-border-blood text-[#e6c2b8]'
              : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 shadow-sm'
          }`}
        >
          <div className="space-y-4">
            {/* GÓRA WIADOMOŚCI */}
            <div className="border-b pb-4 border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {currentEmail.isClassified ? 'DOKUMENT POUFNY // ARCHIWUM' : 'KOMUNIKACJA ROBOCZA'}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {currentEmail.date} // {currentEmail.time}
                </span>
              </div>

              <h2
                className={`text-base md:text-lg font-bold tracking-tight mb-3 ${
                  isDistorted ? 'text-red-400 font-mono anomaly-glow-blood' : 'text-slate-900 dark:text-white'
                }`}
              >
                {currentEmail.subject}
              </h2>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-xs">
                    {currentEmail.senderName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {currentEmail.senderName}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      &lt;{currentEmail.senderEmail}&gt;
                    </p>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-400">
                  <p>Do: badacz@neuroclin-bio.internal</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                    ✓ Szyfrowanie PGP-4096
                  </p>
                </div>
              </div>
            </div>

            {/* TREŚĆ MAILA */}
            <div className="py-2">{currentEmail.body}</div>
          </div>

          {/* DOLNY PASEK AKCJI DLA MAILA */}
          <div className="pt-4 mt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-sans text-slate-500">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => soundEngine.playKeystroke()}
                className="px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-semibold"
              >
                Odpowiedz
              </button>
              <button
                onClick={() => soundEngine.playKeystroke()}
                className="px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Przekaż dalej
              </button>
            </div>

            <span className="text-[10px] font-mono text-slate-400">
              ID Wiadomości: msg-2026-0917-884
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
