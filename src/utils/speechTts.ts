// Divine Text-To-Speech (TTS) Engine for Sri Krishna Dialogue
// Supports Gemini 3.8 Flash Lite TTS audio with high-fidelity 24kHz WAV and
// client-side Web Speech API fallback for Telugu (te-IN) and Hindi (hi-IN).

import { requestSpeechAudio } from '../services/api.ts';

export type TtsLanguage = 'hi' | 'te' | 'en';

export interface KrishnaVoiceState {
  messageId: string | null;
  language: TtsLanguage;
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  playbackRate: number;
  source: 'gemini' | 'browser' | null;
  error?: string | null;
}

type Listener = (state: KrishnaVoiceState) => void;

class KrishnaVoiceController {
  private state: KrishnaVoiceState = {
    messageId: null,
    language: 'en',
    isPlaying: false,
    isPaused: false,
    isLoading: false,
    playbackRate: 1.0,
    source: null,
    error: null
  };

  private listeners: Set<Listener> = new Set();
  private audioElement: HTMLAudioElement | null = null;
  private currentUtteranceQueue: SpeechSynthesisUtterance[] = [];
  private utteranceIndex: number = 0;
  private isCancelling: boolean = false;
  private audioCache = new Map<string, string>(); // messageId:lang -> base64Data

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Trigger voice load
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  public getState(): KrishnaVoiceState {
    return { ...this.state };
  }

  private updateState(partial: Partial<KrishnaVoiceState>) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach(l => l(this.state));
  }

  public setPlaybackRate(rate: number) {
    this.updateState({ playbackRate: rate });
    if (this.audioElement) {
      this.audioElement.playbackRate = rate;
    }
  }

  // Prepares readable dialogue text without markdown symbols and expands Gita shloka citations
  public cleanTextForSpeech(text: string, lang: TtsLanguage): string {
    if (!text) return '';
    
    let clean = text
      // Remove URLs
      .replace(/https?:\/\/[^\s]+/g, '')
      // Expand [BG Chapter.Verse] citations into natural spoken words
      .replace(/\[BG\s*(\d+)[\.:](\d+)\]/gi, (_match, ch, vs) => {
        if (lang === 'hi') {
          return ` श्रीमद्भगवद्गीता अध्याय ${ch}, श्लोक ${vs} `;
        }
        if (lang === 'te') {
          return ` శ్రీమద్భగవద్గీత అధ్యాయం ${ch}, శ్లోకం ${vs} `;
        }
        return ` Bhagavad Gita Chapter ${ch}, Verse ${vs} `;
      })
      // Strip markdown bold, italic, code, headers, quotes
      .replace(/[*#_~`>]/g, '')
      // Clean bullet points
      .replace(/^\s*[-•]\s*/gm, '')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim();

    return clean;
  }

  // Chunks long text by sentence breaks so Web Speech API never times out
  private splitIntoSentenceChunks(text: string, maxLength: number = 140): string[] {
    // Sentence delimiters including Devanagari danda (।)
    const rawChunks = text.split(/([।\.!\?\n\r]+)/g);
    const chunks: string[] = [];
    let current = '';

    for (let i = 0; i < rawChunks.length; i++) {
      const part = rawChunks[i].trim();
      if (!part) continue;

      if ((current + ' ' + part).length > maxLength && current.length > 0) {
        chunks.push(current.trim());
        current = part;
      } else {
        current = current ? `${current} ${part}` : part;
      }
    }

    if (current.trim()) {
      chunks.push(current.trim());
    }

    return chunks.length > 0 ? chunks : [text];
  }

  // Find the most authentic voice available in the browser for English, Telugu, or Hindi
  public getBrowserVoice(lang: TtsLanguage): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    if (lang === 'en') {
      // 1. Look for highest quality natural English voice
      const naturalEn = voices.find(v => 
        (v.lang.startsWith('en') || v.lang === 'en-US' || v.lang === 'en-GB' || v.lang === 'en-IN') &&
        (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('online') || v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('neural'))
      );
      if (naturalEn) return naturalEn;

      // 2. Standard English voices
      const enVoice = voices.find(v => v.lang === 'en-US' || v.lang === 'en-GB' || v.lang === 'en-IN' || v.lang.startsWith('en'));
      if (enVoice) return enVoice;
    }

    if (lang === 'te') {
      // 1. Look for Telugu
      const teVoice = voices.find(v => 
        v.lang === 'te-IN' || 
        v.lang.startsWith('te') || 
        v.name.toLowerCase().includes('telugu')
      );
      if (teVoice) return teVoice;

      // Fallback to Indian English or Hindi if Telugu voice not installed on OS
      const inVoice = voices.find(v => v.lang === 'en-IN' || v.lang.startsWith('hi'));
      if (inVoice) return inVoice;
    }

    if (lang === 'hi') {
      // 1. Look for Hindi
      const hiVoice = voices.find(v => 
        v.lang === 'hi-IN' || 
        v.lang.startsWith('hi') || 
        v.name.toLowerCase().includes('hindi')
      );
      if (hiVoice) return hiVoice;

      // Fallback to Indian English
      const inVoice = voices.find(v => v.lang === 'en-IN');
      if (inVoice) return inVoice;
    }

    // Default English / system voice
    const enVoice = voices.find(v => v.lang === 'en-US') || voices.find(v => v.lang.startsWith('en')) || voices.find(v => v.lang === 'en-IN');
    return enVoice || voices[0] || null;
  }

  // Stop any active audio or speech synthesis
  public stop() {
    this.isCancelling = true;

    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.audioElement.removeAttribute('src');
        this.audioElement.load();
      } catch (e) {
        // ignore
      }
      this.audioElement = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }

    this.currentUtteranceQueue = [];
    this.utteranceIndex = 0;

    this.updateState({
      isPlaying: false,
      isPaused: false,
      isLoading: false,
      messageId: null,
      source: null,
      error: null
    });

    this.isCancelling = false;
  }

  // Pause playback
  public pause() {
    if (this.audioElement && this.state.isPlaying) {
      this.audioElement.pause();
      this.updateState({ isPaused: true, isPlaying: false });
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window && this.state.isPlaying) {
      window.speechSynthesis.pause();
      this.updateState({ isPaused: true, isPlaying: false });
    }
  }

  // Resume playback
  public resume() {
    if (this.audioElement && this.state.isPaused) {
      this.audioElement.play().catch(console.warn);
      this.updateState({ isPaused: false, isPlaying: true });
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window && this.state.isPaused) {
      window.speechSynthesis.resume();
      this.updateState({ isPaused: false, isPlaying: true });
    }
  }

  // Main invocation: Speaks dialogue in Telugu, Hindi, or English
  public async speak(
    messageId: string, 
    text: string, 
    language: TtsLanguage = 'en',
    forceBrowserOnly: boolean = false
  ) {
    // If already playing this message and language, toggle pause / stop
    if (this.state.messageId === messageId && this.state.language === language) {
      if (this.state.isPlaying) {
        this.pause();
        return;
      }
      if (this.state.isPaused) {
        this.resume();
        return;
      }
    }

    // Stop whatever was playing previously
    this.stop();

    const cleanSpoken = this.cleanTextForSpeech(text, language);
    if (!cleanSpoken) return;

    this.updateState({
      messageId,
      language,
      isLoading: true,
      isPlaying: false,
      isPaused: false,
      error: null
    });

    // 1. Try Gemini 3.8 Flash Lite TTS via backend unless forceBrowserOnly
    const cacheKey = `${messageId}:${language}`;
    const cachedWav = this.audioCache.get(cacheKey);

    if (cachedWav && !forceBrowserOnly) {
      this.playWavAudio(cachedWav, messageId, language);
      return;
    }

    if (!forceBrowserOnly) {
      try {
        const response = await requestSpeechAudio(cleanSpoken, language);
        if (response && response.audioData) {
          this.audioCache.set(cacheKey, response.audioData);
          this.playWavAudio(response.audioData, messageId, language);
          return;
        }
      } catch (err: any) {
        console.warn('Backend Gemini TTS unavailable, seamlessly transitioning to browser speech synthesis:', err);
      }
    }

    // 2. Client-Side Web Speech API Fallback
    this.speakViaBrowser(cleanSpoken, messageId, language);
  }

  private playWavAudio(base64Wav: string, messageId: string, language: TtsLanguage) {
    try {
      const audioUrl = `data:audio/wav;base64,${base64Wav}`;
      const audio = new Audio(audioUrl);
      this.audioElement = audio;
      audio.playbackRate = this.state.playbackRate;

      audio.onplay = () => {
        this.updateState({
          isPlaying: true,
          isPaused: false,
          isLoading: false,
          source: 'gemini'
        });
      };

      audio.onended = () => {
        this.updateState({
          isPlaying: false,
          isPaused: false,
          messageId: null,
          source: null
        });
        this.audioElement = null;
      };

      audio.onerror = (e) => {
        console.warn('Audio playback error, falling back to browser speech:', e);
        this.audioElement = null;
        // Fallback to browser speech if audio element fails to play
        this.speakViaBrowser(this.state.messageId ? '' : '', messageId, language);
      };

      audio.play().catch(err => {
        console.warn('Auto-play was blocked or failed:', err);
        this.speakViaBrowser('', messageId, language);
      });
    } catch (e) {
      this.speakViaBrowser('', messageId, language);
    }
  }

  private speakViaBrowser(text: string, messageId: string, language: TtsLanguage) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.updateState({
        isLoading: false,
        isPlaying: false,
        error: 'Text-to-speech is not supported in this browser'
      });
      return;
    }

    const chunks = this.splitIntoSentenceChunks(text);
    if (chunks.length === 0) {
      this.updateState({ isLoading: false });
      return;
    }

    const voice = this.getBrowserVoice(language);
    this.currentUtteranceQueue = [];
    this.utteranceIndex = 0;

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.rate = Math.max(0.7, Math.min(1.4, this.state.playbackRate * 0.95));
      utterance.pitch = 1.0;

      if (voice) {
        utterance.voice = voice;
      }
      utterance.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-US';

      if (i === chunks.length - 1) {
        utterance.onend = () => {
          if (!this.isCancelling) {
            this.updateState({
              isPlaying: false,
              isPaused: false,
              messageId: null,
              source: null
            });
          }
        };
      } else {
        utterance.onend = () => {
          if (!this.isCancelling) {
            this.utteranceIndex++;
          }
        };
      }

      utterance.onerror = (err) => {
        console.warn('Utterance error:', err);
        if (!this.isCancelling) {
          this.updateState({
            isPlaying: false,
            isPaused: false,
            messageId: null,
            source: null
          });
        }
      };

      this.currentUtteranceQueue.push(utterance);
    }

    this.updateState({
      isPlaying: true,
      isPaused: false,
      isLoading: false,
      source: 'browser',
      messageId,
      language
    });

    // Speak all utterances in sequence
    this.currentUtteranceQueue.forEach(u => window.speechSynthesis.speak(u));
  }
}

export const krishnaVoice = new KrishnaVoiceController();

// Voice Input (Speech-to-Text) for speaking in Hindi, Telugu, and English
export class VoiceInputController {
  private recognition: any = null;
  public isSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.isSupported = Boolean(SpeechRec);
    }
  }

  public startListening(
    lang: TtsLanguage,
    onResult: (text: string) => void,
    onEnd: () => void,
    onError: (err: any) => void
  ): () => void {
    if (typeof window === 'undefined') return () => {};
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      onError('Speech recognition is not supported in this browser');
      return () => {};
    }

    try {
      this.recognition = new SpeechRec();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'te' ? 'te-IN' : 'en-US';

      this.recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        onResult(transcript);
      };

      this.recognition.onerror = (e: any) => {
        console.warn('Voice recognition error:', e);
        onError(e);
      };

      this.recognition.onend = () => {
        onEnd();
      };

      this.recognition.start();

      return () => {
        if (this.recognition) {
          try {
            this.recognition.stop();
          } catch {}
          this.recognition = null;
        }
      };
    } catch (e) {
      onError(e);
      return () => {};
    }
  }
}

export const voiceInput = new VoiceInputController();

