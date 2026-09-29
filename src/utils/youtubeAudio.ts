// Audio-only YouTube Player manager for https://youtu.be/50g5bnruep0
// Plays the exact ISKCON Kirtan "Hare Krishna Hare Rama" sound with NO video display.

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

class YouTubeAudioService {
  private player: any = null;
  private isLoaded = false;
  private isPlayingAudio = false;
  private videoId = '50g5bnruep0'; // Best Of ISKCON Kirtan | Hare Krishna Hare Rama
  private pendingPlay = false;
  private currentVolume = 90;
  private stateChangeListeners: ((isPlaying: boolean) => void)[] = [];

  constructor() {
    this.loadYouTubeAPI();
  }

  private loadYouTubeAPI() {
    if (typeof window === 'undefined') return;

    if (window.YT && window.YT.Player) {
      this.isLoaded = true;
      return;
    }

    const existingScript = document.getElementById('youtube-iframe-api');
    if (!existingScript) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const previousOnReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (previousOnReady) previousOnReady();
      this.isLoaded = true;
      if (this.pendingPlay) {
        this.createPlayerAndPlay();
      }
    };
  }

  // Ensure the hidden container and YT.Player are ready
  private createPlayerAndPlay() {
    if (typeof document === 'undefined') return;

    let container = document.getElementById('yt-audio-hidden-slot');
    if (!container) {
      container = document.createElement('div');
      container.id = 'yt-audio-hidden-slot';
      // Completely hide video visually while keeping audio active
      container.style.position = 'fixed';
      container.style.top = '-9999px';
      container.style.left = '-9999px';
      container.style.width = '1px';
      container.style.height = '1px';
      container.style.opacity = '0';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '-1000';
      document.body.appendChild(container);
    }

    const playerDiv = document.createElement('div');
    playerDiv.id = 'yt-audio-player-iframe';
    container.innerHTML = '';
    container.appendChild(playerDiv);

    try {
      this.player = new window.YT.Player('yt-audio-player-iframe', {
        height: '1',
        width: '1',
        videoId: this.videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          loop: 1,
          playlist: this.videoId, // Required for loop in YouTube iframe API
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(this.currentVolume);
            event.target.playVideo();
            this.isPlayingAudio = true;
            this.notifyListeners(true);
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.PLAYING === 1, PAUSED === 2, ENDED === 0
            if (event.data === 1) {
              this.isPlayingAudio = true;
              this.notifyListeners(true);
            } else if (event.data === 2) {
              this.isPlayingAudio = false;
              this.notifyListeners(false);
            } else if (event.data === 0) {
              // Loop back to beginning
              event.target.playVideo();
            }
          },
          onError: (e: any) => {
            console.warn('YouTube audio playback notice:', e);
          }
        }
      });
    } catch (err) {
      console.warn('Error instantiating YouTube player:', err);
    }
  }

  play() {
    this.pendingPlay = true;

    if (this.player && typeof this.player.playVideo === 'function') {
      try {
        this.player.setVolume(this.currentVolume);
        this.player.playVideo();
        this.isPlayingAudio = true;
        this.notifyListeners(true);
        return;
      } catch (err) {
        console.warn('Retry creating player:', err);
      }
    }

    if (window.YT && window.YT.Player) {
      this.createPlayerAndPlay();
    } else {
      this.loadYouTubeAPI();
    }
  }

  pause() {
    this.pendingPlay = false;
    this.isPlayingAudio = false;
    this.notifyListeners(false);
    if (this.player && typeof this.player.pauseVideo === 'function') {
      try {
        this.player.pauseVideo();
      } catch (e) {}
    }
  }

  stop() {
    this.pause();
    if (this.player && typeof this.player.seekTo === 'function') {
      try {
        this.player.seekTo(0);
      } catch (e) {}
    }
  }

  setVolume(percent: number) {
    this.currentVolume = Math.max(0, Math.min(100, percent));
    if (this.player && typeof this.player.setVolume === 'function') {
      try {
        this.player.setVolume(this.currentVolume);
      } catch (e) {}
    }
  }

  isPlaying(): boolean {
    return this.isPlayingAudio;
  }

  subscribe(listener: (isPlaying: boolean) => void) {
    this.stateChangeListeners.push(listener);
    return () => {
      this.stateChangeListeners = this.stateChangeListeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(playing: boolean) {
    this.stateChangeListeners.forEach(listener => {
      try { listener(playing); } catch (e) {}
    });
  }
}

export const youtubeAudio = new YouTubeAudioService();
