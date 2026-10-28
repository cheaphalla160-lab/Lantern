/**
 * Web Audio Engine for Festive Background Music, Sound Effects, and Speech Synthesis
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;
  private isMuted: boolean = false;
  private bgmIntervalId: any = null;
  private step: number = 0;

  // Traditional Chinese Pentatonic Melody (Gong, Shang, Jiao, Zhi, Yu)
  // Scale frequencies based on C major pentatonic (C4, D4, E4, G4, A4, C5, D5, E5)
  private melodyNotes = [
    { freq: 523.25, dur: 0.28 }, // C5
    { freq: 440.00, dur: 0.28 }, // A4
    { freq: 392.00, dur: 0.28 }, // G4
    { freq: 329.63, dur: 0.56 }, // E4
    { freq: 392.00, dur: 0.28 }, // G4
    { freq: 440.00, dur: 0.28 }, // A4
    { freq: 523.25, dur: 0.56 }, // C5
    { freq: 587.33, dur: 0.28 }, // D5
    { freq: 523.25, dur: 0.28 }, // C5
    { freq: 440.00, dur: 0.28 }, // A4
    { freq: 392.00, dur: 0.56 }, // G4
    { freq: 329.63, dur: 0.28 }, // E4
    { freq: 293.66, dur: 0.28 }, // D4
    { freq: 261.63, dur: 0.56 }, // C4
    { freq: 293.66, dur: 0.28 }, // D4
    { freq: 329.63, dur: 0.56 }, // E4
  ];

  private bassNotes = [130.81, 196.00, 164.81, 130.81]; // C3, G3, E3, C3

  constructor() {
    // Lazy initialized on first user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.bgmGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();

        this.bgmGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        this.sfxGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

        this.bgmGain.connect(this.ctx.destination);
        this.sfxGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public startBGM() {
    this.initContext();
    if (this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
    this.isBgmPlaying = true;
    this.step = 0;

    // Schedule cheerful looped pentatonic chime pattern
    const tempoMs = 380;
    this.bgmIntervalId = setInterval(() => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain || this.isMuted) return;

      const note = this.melodyNotes[this.step % this.melodyNotes.length];
      const now = this.ctx.currentTime;

      // Play soft pluck / bell melody tone
      this.playPluckTone(note.freq, now, note.dur, this.bgmGain, 'triangle');

      // Play gentle bass note on every 4th beat
      if (this.step % 4 === 0) {
        const bassFreq = this.bassNotes[Math.floor(this.step / 4) % this.bassNotes.length];
        this.playPluckTone(bassFreq, now, 0.7, this.bgmGain, 'sine', 0.15);
      }

      this.step++;
    }, tempoMs);
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmIntervalId) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.bgmGain && this.sfxGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : 0.12, now);
      this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : 0.3, now);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsBgmPlaying(): boolean {
    return this.isBgmPlaying;
  }

  private playPluckTone(
    freq: number,
    startTime: number,
    duration: number,
    outputNode: GainNode,
    type: OscillatorType = 'sine',
    volumeMultiplier = 0.2
  ) {
    if (!this.ctx || this.isMuted) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      // Fast attack, gentle exponential decay like traditional guzheng/harp
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(volumeMultiplier, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(outputNode);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    } catch {
      // Audio playback safety catch
    }
  }

  // SFX: Catching item bubble
  public playCatch() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // SFX: Golden Coin / Goodie Sparkle
  public playCoin() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    [987.77, 1318.51].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0.25, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.07 + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.2);
    });
  }

  // SFX: Success / Star rating celebration chime
  public playSuccessFanfare() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const chords = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, High C
    chords.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.09);

      gain.gain.setValueAtTime(0.28, now + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.09 + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + i * 0.09);
      osc.stop(now + i * 0.09 + 0.4);
    });
  }

  // SFX: Firecracker mini pops
  public playFirecracker() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    for (let i = 0; i < 4; i++) {
      const delay = i * 0.07;
      setTimeout(() => {
        if (!this.ctx || !this.sfxGain) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300 + Math.random() * 200, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.05);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.06);
      }, delay * 1000);
    }
  }

  // TTS Speech Synthesis with child-friendly settings
  public speak(
    text: string,
    options?: { rate?: number; pitch?: number; onEnd?: () => void }
  ) {
    if (!('speechSynthesis' in window)) {
      if (options?.onEnd) options.onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech

      // Clean text for speech if it contains slashes, e.g. "Tangyuan / sweet rice balls" -> read clearly
      let cleanText = text;
      if (text.includes('/')) {
        const parts = text.split('/');
        cleanText = `${parts[0].trim()}, or ${parts[1].trim()}`;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-US';
      utterance.rate = options?.rate ?? 0.88; // Slightly slower for primary kids
      utterance.pitch = options?.pitch ?? 1.15; // Friendly warm pitch

      // Pick best English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Samantha') ||
            v.name.includes('Karen') ||
            v.name.includes('Daniel'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      if (options?.onEnd) {
        utterance.onend = () => {
          options.onEnd!();
        };
        utterance.onerror = () => {
          options.onEnd!();
        };
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      if (options?.onEnd) options.onEnd();
    }
  }

  public cancelSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audioEngine = new AudioEngine();
