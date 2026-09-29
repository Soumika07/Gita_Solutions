// Web Audio API synthesizer for meditative bell, Om drone, and Japa click
import { youtubeAudio } from './youtubeAudio.ts';

class SacredAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isOmPlaying = false;
  private omGainNode: GainNode | null = null;
  private omOscillators: OscillatorNode[] = [];

  // Hare Ram Maha-Mantra Sound State
  private isHareRamPlaying = false;
  private hareRamInterval: any = null;
  private hareRamGain: GainNode | null = null;
  private tanpuraOscs: OscillatorNode[] = [];
  private audioElement: HTMLAudioElement | null = null;
  private audioMode: 'youtube' | 'local' = 'youtube'; // Defaults to user-requested YouTube audio

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play Tibetan Singing Bowl / Temple Bell chime
  playBell(freq: number = 432) {
    try {
      const ctx = this.getContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;

      // Base strike
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Harmonics for singing bowl timbre
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2.76, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.3, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.exponentialRampToValueAtTime(0.08, now + 0.03);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

      osc.connect(gain);
      osc2.connect(gain2);
      gain.connect(ctx.destination);
      gain2.connect(ctx.destination);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 3.6);
      osc2.stop(now + 2.1);
    } catch (e) {
      console.warn('Audio not allowed yet or supported:', e);
    }
  }

  // Subtle bead click for Japa Mala
  playJapaClick() {
    try {
      const ctx = this.getContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {
      // Ignored
    }
  }

  // Toggle ambient sacred Om 136.1 Hz (Cosmic frequency) drone
  toggleOmDrone(): boolean {
    try {
      const ctx = this.getContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      if (this.isOmPlaying) {
        if (this.omGainNode) {
          this.omGainNode.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
          setTimeout(() => {
            this.omOscillators.forEach(o => {
              try { o.stop(); } catch(e) {}
            });
            this.omOscillators = [];
          }, 1300);
        }
        this.isOmPlaying = false;
        return false;
      } else {
        const now = ctx.currentTime;
        const mainGain = ctx.createGain();
        mainGain.gain.setValueAtTime(0.001, now);
        mainGain.gain.linearRampToValueAtTime(0.12, now + 2.0);
        mainGain.connect(ctx.destination);
        this.omGainNode = mainGain;

        // Frequencies: Fundamental 136.1Hz (Om / Earth year frequency) + Octave 272.2Hz + Fifth 204.15Hz
        const freqs = [136.1, 272.2, 204.15, 68.05];
        this.omOscillators = freqs.map((f, i) => {
          const osc = ctx.createOscillator();
          const subGain = ctx.createGain();
          osc.type = i === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(f, now);
          subGain.gain.value = 1 / (i + 1.5);
          osc.connect(subGain);
          subGain.connect(mainGain);
          osc.start(now);
          return osc;
        });

        this.isOmPlaying = true;
        return true;
      }
    } catch (e) {
      console.warn('Om drone audio error:', e);
      return false;
    }
  }

  isPlayingOm(): boolean {
    return this.isOmPlaying;
  }

  // --------------------------------------------------------------------------
  // HARE RAM HARE RAM MAHA-MANTRA CHANT (YouTube ISKCON Kirtan + Fallback Engine)
  // --------------------------------------------------------------------------
  setAudioSource(source: 'youtube' | 'local') {
    this.audioMode = source;
  }

  getAudioSource(): 'youtube' | 'local' {
    return this.audioMode;
  }

  startHareRamChant(volume: number = 0.9) {
    this.isHareRamPlaying = true;

    // 1. Primary Engine: YouTube Video 50g5bnruep0 (Best Of ISKCON Kirtan | Hare Krishna Hare Rama)
    if (this.audioMode === 'youtube') {
      try {
        youtubeAudio.setVolume(Math.round(volume * 100));
        youtubeAudio.play();
      } catch (e) {
        console.warn('YouTube audio service launch notice:', e);
      }
    }

    // 2. Secondary Engine: Studio Chant WAV (/audio/hare_ram_chant.wav)
    try {
      if (typeof window !== 'undefined') {
        if (!this.audioElement) {
          this.audioElement = new Audio('/audio/hare_ram_chant.wav');
          this.audioElement.preload = 'auto';
        }
        this.audioElement.loop = true;
        this.audioElement.volume = Math.max(0.1, Math.min(1.0, volume));

        // In local mode, or if youtube is still loading, start local playback
        if (this.audioMode === 'local') {
          const promise = this.audioElement.play();
          if (promise !== undefined) {
            promise.catch(err => {
              console.warn('Audio play waiting for direct user gesture:', err);
            });
          }
        }
      }
    } catch (e) {
      console.warn('HTML5 audio chant error:', e);
    }
  }

  stopHareRamChant() {
    this.isHareRamPlaying = false;

    // Stop YouTube audio
    try {
      youtubeAudio.stop();
    } catch (e) {}

    // Stop HTML5 audio
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch (e) {}
    }

    // Stop Web Audio tanpura
    if (this.hareRamGain && this.ctx) {
      try {
        this.hareRamGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      } catch (e) {}
    }
    setTimeout(() => {
      this.tanpuraOscs.forEach(o => {
        try { o.stop(); } catch (e) {}
      });
      this.tanpuraOscs = [];
      this.hareRamGain = null;
    }, 600);
  }

  isPlayingHareRam(): boolean {
    return this.isHareRamPlaying;
  }
}

export const sacredAudio = new SacredAudioSynthesizer();
