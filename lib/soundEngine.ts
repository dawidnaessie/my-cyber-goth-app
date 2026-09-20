/**
 * NULL://ANOMALY // MODULAR SOUND ENGINE
 *
 * Silnik audialny wspierający dwustanową optykę systemu oraz responsywne efekty interakcji:
 * 1. TRYB ANOMALIA (Optics OFF):
 *    - Skalibrowany współczynnik głośności (0.50) dla nastrojowych próbek organicznych (/sounds/breathing.mp4, /sounds/metal.mp4, /sounds/water.mp4)
 *    - Jawne, zrównoważone losowanie próbek Math.floor(Math.random() * 3) gwarantujące równą ekspozycję kapania wody, metalu i oddechu.
 *    - Losowe okno czasowe: 20-45 sekund.
 *    - Dychotomiczny klik klawiszy: "mięsno-przemysłowy" terminal z żywej tkanki (głuchy impakt biologiczny + zardzewiały zgrzyt + trzask styków).
 * 2. TRYB STERYLNY (Optics ON):
 *    - Proceduralny syntezator Web Audio API generujący czyste impulsy telemetryczne i laboratoryjne bipy (15-35 s, wolumen 5%).
 *    - Dychotomiczny klik klawiszy: ostry, metaliczny trzask klasycznej maszyny do pisania.
 * 3. OCHRONA PRZED PRZESTEROWANIEM (Throttling / Anti-Clipping):
 *    - Bufor minimalnego interwału (35 ms) zapobiegający kumulacji głosów przy szybkim pisaniu.
 *
 * Zero dodatkowych paczek npm (czysty Web Audio API + HTML5 Audio).
 */

const ORGANIC_TRACKS = [
  '/sounds/breathing.mp4',
  '/sounds/metal.mp4',
  '/sounds/water.mp4',
] as const;

// Skorygowany współczynnik głośności (+20% do 0.50) dla wyraźnego, plastycznego tła audialnego
const ORGANIC_AMBIENT_VOLUME = 0.50;

// Minimalny interwał pomiędzy wyzwalaniem dźwięku klawiszy (ms) – ochrona przed przesterowaniem
const KEYSTROKE_THROTTLE_MS = 35;

export class SoundEngine {
  private static instance: SoundEngine | null = null;

  private audioContext: AudioContext | null = null;
  private currentOrganicAudio: HTMLAudioElement | null = null;
  private schedulerTimeout: NodeJS.Timeout | null = null;
  private isEnabled: boolean = false;
  private opticsOn: boolean = true;
  private isDestroyed: boolean = false;
  private lastKeystrokeTime: number = 0;

  private constructor() {
    // Konstruktor prywatny dla wzorca Singleton
  }

  public static getInstance(): SoundEngine {
    if (!SoundEngine.instance) {
      SoundEngine.instance = new SoundEngine();
    }
    return SoundEngine.instance;
  }

  /**
   * Bezpieczna inicjalizacja kontekstu Web Audio API po geście użytkownika
   */
  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.audioContext) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    }

    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {
        // Blokada autoplay przeglądarki - obsługa cicha
      });
    }

    return this.audioContext;
  }

  /**
   * Przełączenie stanu wyciszenia (Mute / Unmute)
   */
  public toggleAudio(): boolean {
    this.setEnabled(!this.isEnabled);
    return this.isEnabled;
  }

  /**
   * Bezpośrednie ustawienie stanu audio
   */
  public setEnabled(enabled: boolean): void {
    if (this.isEnabled === enabled) return;
    this.isEnabled = enabled;

    if (this.isEnabled) {
      this.getAudioContext();
      // Odtwórz subtelny sygnał aktywacji interfejsu
      this.playInterferenceChirp(this.opticsOn ? 1760 : 440, 0.08);
      this.scheduleNextAudioCycle();
    } else {
      this.stopAll();
    }
  }

  public getAudioEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Zmiana trybu optyki (Clean AI vs. Analog Horror Anomaly)
   */
  public setOpticsMode(opticsOn: boolean): void {
    if (this.opticsOn === opticsOn) return;
    this.opticsOn = opticsOn;

    // Natychmiastowe zatrzymanie dotychczasowych dźwięków i reset harmonogramu
    this.stopAllPlayback();

    if (this.isEnabled) {
      // Subtelny dźwięk rekonfiguracji optycznej
      if (opticsOn) {
        this.playSterileBeep(2400, 0.08, 0.04);
      } else {
        this.playDissonantDistortion();
      }
      this.scheduleNextAudioCycle();
    }
  }

  /**
   * Dychotomiczny efekt uderzenia w klawisze (Keystroke / Typewriter Engine)
   */
  public playKeystroke(): void {
    if (!this.isEnabled || this.isDestroyed) return;

    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (now - this.lastKeystrokeTime < KEYSTROKE_THROTTLE_MS) {
      return; // Ochrona przed nakładaniem się głosów i przesterowaniem przy szybkim pisaniu
    }
    this.lastKeystrokeTime = now;

    if (this.opticsOn) {
      this.playCleanTypewriterClick();
    } else {
      this.playFleshIndustrialClick();
    }
  }

  /**
   * Tryb Clean (Optics ON): Czysty, ostro odcięty, metaliczny klik klasycznej maszyny do pisania
   */
  private playCleanTypewriterClick(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Dyskretna mikro-wariacja wysokości tonu (+/- 4%) dla fizycznego realizmu uderzeń
      const pitchVariance = 1 + (Math.random() * 0.08 - 0.04);
      const baseFreq = 2200 * pitchVariance;

      // 1. Składowa metaliczna (ostry, krótki rezonans mechaniczny)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.45, now + 0.028);

      oscGain.gain.setValueAtTime(0.0001, now);
      oscGain.gain.linearRampToValueAtTime(0.08, now + 0.002);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);

      // 2. Mechaniczny transient uderzenia głowicy (bardzo krótki trzask 8 ms)
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();

      snapOsc.type = 'square';
      snapOsc.frequency.setValueAtTime(3600 * pitchVariance, now);
      snapOsc.frequency.exponentialRampToValueAtTime(800, now + 0.008);

      snapGain.gain.setValueAtTime(0.0001, now);
      snapGain.gain.linearRampToValueAtTime(0.04, now + 0.001);
      snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.01);

      snapOsc.connect(snapGain);
      snapGain.connect(ctx.destination);

      snapOsc.start(now);
      snapOsc.stop(now + 0.012);
    } catch {
      // Bezpieczna obsługa wyjątków Web Audio API
    }
  }

  /**
   * Tryb Analog Horror (Optics OFF): Mięsno-przemysłowy klik terminala z żywej tkanki
   * (głuchy impakt biologiczny + zardzewiały zgrzyt + krótki trzask styków elektrycznych)
   */
  private playFleshIndustrialClick(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const pitchVariance = 1 + (Math.random() * 0.1 - 0.05);

      // 1. Głuchy, mięsisty impakt biologiczny (kompresja wilgotnej tkanki pod klawiszem)
      const fleshOsc = ctx.createOscillator();
      const fleshGain = ctx.createGain();

      fleshOsc.type = 'sine';
      // Szybki spadek częstotliwości z 160 Hz do 38 Hz (damp sub-thud)
      fleshOsc.frequency.setValueAtTime(160 * pitchVariance, now);
      fleshOsc.frequency.exponentialRampToValueAtTime(38, now + 0.045);

      fleshGain.gain.setValueAtTime(0.0001, now);
      fleshGain.gain.linearRampToValueAtTime(0.12, now + 0.003);
      fleshGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      fleshOsc.connect(fleshGain);
      fleshGain.connect(ctx.destination);

      fleshOsc.start(now);
      fleshOsc.stop(now + 0.055);

      // 2. Zardzewiały, przemysłowy zgrzyt (filtr pasmowoprzepustowy na fali piłokształtnej)
      const grindOsc = ctx.createOscillator();
      const grindFilter = ctx.createBiquadFilter();
      const grindGain = ctx.createGain();

      grindOsc.type = 'sawtooth';
      grindOsc.frequency.setValueAtTime(95 * pitchVariance, now);
      grindOsc.frequency.linearRampToValueAtTime(50, now + 0.035);

      grindFilter.type = 'bandpass';
      grindFilter.frequency.setValueAtTime(620 * pitchVariance, now);
      grindFilter.Q.setValueAtTime(3.5, now);

      grindGain.gain.setValueAtTime(0.0001, now);
      grindGain.gain.linearRampToValueAtTime(0.09, now + 0.004);
      grindGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      grindOsc.connect(grindFilter);
      grindFilter.connect(grindGain);
      grindGain.connect(ctx.destination);

      grindOsc.start(now);
      grindOsc.stop(now + 0.045);

      // 3. Krótki trzask styków elektrycznych (wyładowanie łukowe na styku elektrody i żywej tkanki)
      const sparkOsc = ctx.createOscillator();
      const sparkFilter = ctx.createBiquadFilter();
      const sparkGain = ctx.createGain();

      sparkOsc.type = 'square';
      sparkOsc.frequency.setValueAtTime(2800 * pitchVariance, now);
      sparkOsc.frequency.exponentialRampToValueAtTime(400, now + 0.015);

      sparkFilter.type = 'highpass';
      sparkFilter.frequency.setValueAtTime(1800, now);

      sparkGain.gain.setValueAtTime(0.0001, now);
      sparkGain.gain.linearRampToValueAtTime(0.06, now + 0.001);
      sparkGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.016);

      sparkOsc.connect(sparkFilter);
      sparkFilter.connect(sparkGain);
      sparkGain.connect(ctx.destination);

      sparkOsc.start(now);
      sparkOsc.stop(now + 0.02);
    } catch {
      // Bezpieczna obsługa wyjątków Web Audio API
    }
  }

  /**
   * Zaplanowanie kolejnego zdarzenia dźwiękowego w oparciu o profil aktywny
   */
  private scheduleNextAudioCycle(): void {
    this.clearSchedule();
    if (!this.isEnabled || this.isDestroyed) return;

    let delayMs: number;
    if (this.opticsOn) {
      // Profil sterylny (Optics ON): 15 - 35 sekund
      delayMs = Math.floor(15000 + Math.random() * 20000);
    } else {
      // Profil anomalii (Optics OFF): 20 - 45 sekund
      delayMs = Math.floor(20000 + Math.random() * 25000);
    }

    this.schedulerTimeout = setTimeout(() => {
      this.triggerScheduledSound();
      this.scheduleNextAudioCycle();
    }, delayMs);
  }

  /**
   * Wyzwolenie dźwięku odpowiadającego bieżącemu profilowi
   */
  private triggerScheduledSound(): void {
    if (!this.isEnabled || this.isDestroyed) return;

    if (this.opticsOn) {
      this.triggerRandomSterilePulse();
    } else {
      this.triggerRandomOrganicSound();
    }
  }

  /**
   * Profil Sterile: Rzadkie, sterylne dźwięki laboratoryjne i bipy telemetryczne (Web Audio API)
   */
  private triggerRandomSterilePulse(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const pulseType = Math.floor(Math.random() * 3);
    switch (pulseType) {
      case 0:
        // Czysty pojedynczy bip laboratoryjny (1760 Hz - A6)
        this.playSterileBeep(1760, 0.12, 0.05);
        break;
      case 1:
        // Podwójny impuls telemetryczny
        this.playSterileBeep(1200, 0.08, 0.04);
        setTimeout(() => {
          if (this.isEnabled && this.opticsOn) {
            this.playSterileBeep(1600, 0.1, 0.04);
          }
        }, 110);
        break;
      case 2:
        // Subtelny harmoniczny rezonans (fale sinusoidalne)
        this.playHarmonicChirp([880, 1320], 0.18, 0.03);
        break;
    }
  }

  /**
   * Profil Anomaly: Jawne, zbalansowane losowanie próbek organicznych w tle (/sounds/breathing.mp4, /sounds/metal.mp4, /sounds/water.mp4)
   * Używa Math.floor(Math.random() * 3) gwarantując jednakową szansę i wyraźne kapanie wody.
   */
  private triggerRandomOrganicSound(): void {
    if (typeof window === 'undefined') return;

    // Jawne losowanie z 3 elementów (0: breathing, 1: metal, 2: water)
    const randomIndex = Math.floor(Math.random() * 3);
    const soundPath = ORGANIC_TRACKS[randomIndex];

    this.stopCurrentOrganic();

    try {
      const audio = new Audio(soundPath);
      // Podniesiony współczynnik głośności (0.50) dla gęstego, plastycznego klimatu
      audio.volume = ORGANIC_AMBIENT_VOLUME;
      this.currentOrganicAudio = audio;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay zablokowany przez przeglądarkę
        });
      }

      audio.onended = () => {
        if (this.currentOrganicAudio === audio) {
          this.currentOrganicAudio = null;
        }
      };
    } catch {
      // Ignorowanie błędów środowiskowych
    }
  }

  /**
   * Generator czystego tonu sinusoidalnego Web Audio API
   */
  private playSterileBeep(frequency: number, duration: number = 0.1, volume: number = 0.05): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch {
      // Błąd obsługi syntezy
    }
  }

  /**
   * Generator wielotonowych impulsów harmonicznych (Sterile Mode)
   */
  private playHarmonicChirp(frequencies: number[], duration: number, volume: number): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const gain = ctx.createGain();

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      gain.connect(ctx.destination);

      frequencies.forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + duration + 0.05);
      });
    } catch {
      // Błąd obsługi syntezy
    }
  }

  /**
   * Syntetyczny mikro-impuls aktywacyjny / dźwięk błędu zablokowanego modułu
   */
  public playInterferenceChirp(frequency: number = 440, duration: number = 0.08): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, now);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, now + duration);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch {
      // Błąd obsługi syntezy
    }
  }

  /**
   * Dźwięk zakłócenia kineskopowego przy wejściu w stan anomalii (Web Audio API)
   */
  private playDissonantDistortion(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(55, now + 0.25);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Błąd obsługi syntezy
    }
  }

  /**
   * Zatrzymanie aktualnie odtwarzanego pliku organicznego
   */
  private stopCurrentOrganic(): void {
    if (this.currentOrganicAudio) {
      try {
        this.currentOrganicAudio.pause();
        this.currentOrganicAudio.currentTime = 0;
      } catch {
        // Ignorowanie błędów przy zatrzymywaniu
      }
      this.currentOrganicAudio = null;
    }
  }

  /**
   * Wyczyszczenie aktywnego timera planowania
   */
  private clearSchedule(): void {
    if (this.schedulerTimeout) {
      clearTimeout(this.schedulerTimeout);
      this.schedulerTimeout = null;
    }
  }

  /**
   * Zatrzymanie wszystkich aktywnych dźwięków
   */
  private stopAllPlayback(): void {
    this.stopCurrentOrganic();
  }

  /**
   * Całkowite wyłączenie dźwięku i reset harmonogramu
   */
  public stopAll(): void {
    this.clearSchedule();
    this.stopAllPlayback();
  }

  /**
   * Zwolnienie zasobów przy odmontowaniu
   */
  public destroy(): void {
    this.isDestroyed = true;
    this.stopAll();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch {
        // Ignorowanie błędów przy zamykaniu kontekstu
      }
      this.audioContext = null;
    }
    SoundEngine.instance = null;
  }
}

export const soundEngine = SoundEngine.getInstance();
