/**
 * NULL://ANOMALY // MODULAR SOUND ENGINE
 *
 * Silnik audialny wspierający dwustanową optykę systemu:
 * 1. TRYB ANOMALIA (Optics OFF):
 *    - Niskopoziomowe, losowe odtwarzanie próbek organicznych (/sounds/breathing.mp4, /sounds/metal.mp4, /sounds/water.mp4)
 *    - Losowe okno czasowe: 20-45 sekund, niski wolumen (15-25%).
 * 2. TRYB STERYLNY (Optics ON):
 *    - Proceduralny syntezator Web Audio API generujący czyste, minimalistyczne impulsy telemetryczne i laboratoryjne bipy
 *    - Losowe okno czasowe: 15-35 sekund, laboratoryjny wolumen (5-8%).
 *
 * Zero dodatkowych paczek npm (czysty Web Audio API + HTML5 Audio).
 */

const ORGANIC_TRACKS = [
  '/sounds/breathing.mp4',
  '/sounds/metal.mp4',
  '/sounds/water.mp4',
] as const;

export class SoundEngine {
  private static instance: SoundEngine | null = null;

  private audioContext: AudioContext | null = null;
  private currentOrganicAudio: HTMLAudioElement | null = null;
  private schedulerTimeout: NodeJS.Timeout | null = null;
  private isEnabled: boolean = false;
  private opticsOn: boolean = true;
  private isDestroyed: boolean = false;

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
   * Profil Anomaly: Losowe organiczne próbki w tle (/sounds/breathing.mp4, /sounds/metal.mp4, /sounds/water.mp4)
   */
  private triggerRandomOrganicSound(): void {
    if (typeof window === 'undefined') return;

    const randomIndex = Math.floor(Math.random() * ORGANIC_TRACKS.length);
    const soundPath = ORGANIC_TRACKS[randomIndex];

    this.stopCurrentOrganic();

    try {
      const audio = new Audio(soundPath);
      // Niski poziom głośności (18-22%) dla nastrojowego tła psychofizycznego
      audio.volume = 0.2;
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
   * Syntetyczny mikro-impuls aktywacyjny
   */
  private playInterferenceChirp(frequency: number, duration: number): void {
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
