import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Sparkles, 
  Volume2, 
  Loader2,
  Gauge
} from 'lucide-react';
import { krishnaVoice, KrishnaVoiceState, TtsLanguage } from '../utils/speechTts.ts';
import { useLanguage } from '../context/LanguageContext.tsx';
import { getTranslation } from '../i18n/translations.ts';

interface KrishnaVoicePlayerProps {
  messageId: string;
  content: string;
  isFloating?: boolean;
}

export const KrishnaVoicePlayer: React.FC<KrishnaVoicePlayerProps> = ({
  messageId,
  content,
  isFloating
}) => {
  const { language: currentAppLang } = useLanguage();
  const t = getTranslation(currentAppLang);
  const [voiceState, setVoiceState] = useState<KrishnaVoiceState>(krishnaVoice.getState());
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  useEffect(() => {
    const unsubscribe = krishnaVoice.subscribe(setVoiceState);
    return () => unsubscribe();
  }, []);

  const isThisPlaying = voiceState.messageId === messageId && voiceState.isPlaying;
  const isThisPaused = voiceState.messageId === messageId && voiceState.isPaused;
  const isThisLoading = voiceState.messageId === messageId && voiceState.isLoading;
  const isThisActive = voiceState.messageId === messageId && (voiceState.isPlaying || voiceState.isPaused || voiceState.isLoading);

  const handlePlayVoice = (lang: TtsLanguage) => {
    krishnaVoice.speak(messageId, content, lang);
  };

  const handleTogglePause = () => {
    if (isThisPlaying) {
      krishnaVoice.pause();
    } else if (isThisPaused) {
      krishnaVoice.resume();
    }
  };

  const handleStop = () => {
    krishnaVoice.stop();
  };

  const handleChangeSpeed = (speed: number) => {
    krishnaVoice.setPlaybackRate(speed);
    setShowSpeedMenu(false);
  };

  const currentLangLabel = voiceState.language === 'te' 
    ? (currentAppLang === 'te' ? 'తెలుగు' : currentAppLang === 'hi' ? 'तेलुगु' : 'Telugu')
    : voiceState.language === 'hi'
    ? (currentAppLang === 'te' ? 'హిందీ' : currentAppLang === 'hi' ? 'हिन्दी' : 'Hindi')
    : (currentAppLang === 'te' ? 'ఇంగ్లీష్' : currentAppLang === 'hi' ? 'अंग्रेज़ी' : 'English');

  return (
    <div className="mt-3 pt-2.5 border-t border-slate-700/50 flex flex-col gap-2">
      {/* Active Playback Bar */}
      {isThisActive ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-2.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-amber-950/30 border border-amber-500/40 shadow-inner">
          <div className="flex items-center gap-2.5">
            {/* Play/Pause Button */}
            <button
              onClick={handleTogglePause}
              disabled={isThisLoading}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/30 transition-all cursor-pointer disabled:opacity-60"
              title={isThisPlaying ? t.ttsPaused : t.ttsPlaying}
              aria-label={isThisPlaying ? "Pause audio" : "Resume audio"}
            >
              {isThisLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              ) : isThisPlaying ? (
                <Pause className="w-4 h-4 fill-slate-950" />
              ) : (
                <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
              )}
            </button>

            {/* Stop Button */}
            <button
              onClick={handleStop}
              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-red-300 flex items-center justify-center border border-slate-700 transition-colors cursor-pointer"
              title={t.ttsStopAudio}
              aria-label="Stop audio"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>

            {/* Equalizer animation and status */}
            <div className="flex items-center gap-2">
              {isThisPlaying && (
                <div className="flex items-end gap-0.5 h-4 w-6 px-0.5" aria-hidden="true">
                  <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s] h-3" />
                  <span className="w-1 bg-yellow-300 rounded-full animate-bounce [animation-delay:-0.15s] h-4" />
                  <span className="w-1 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.45s] h-2" />
                  <span className="w-1 bg-amber-300 rounded-full animate-bounce h-3.5" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-amber-200 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {isThisLoading 
                    ? t.ttsLoading 
                    : isThisPaused
                    ? `${t.ttsPaused} (${currentLangLabel})`
                    : `${currentLangLabel} ${t.ttsVoice}`}
                </span>
                <span className="text-[10px] text-slate-400">
                  {voiceState.source === 'gemini' 
                    ? `✨ Gemini 3.8 Divine Voice (${currentLangLabel})` 
                    : `🔊 Browser Speech Engine (${currentLangLabel})`}
                </span>
              </div>
            </div>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1.5 self-end sm:self-center">
            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
              <Gauge className="w-3 h-3" />
              {t.ttsSpeed}:
            </span>
            <div className="inline-flex rounded-lg bg-slate-800/80 p-0.5 border border-slate-700/60 text-[10px]">
              {[0.85, 1.0, 1.2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => handleChangeSpeed(spd)}
                  className={`px-1.5 py-0.5 rounded cursor-pointer transition-all ${
                    voiceState.playbackRate === spd
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Primary Voice Selection Buttons */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {currentAppLang === 'en' ? (
          <>
            {/* Primary Prominent English Voice Button */}
            <button
              onClick={() => handlePlayVoice('en')}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                isThisActive && voiceState.language === 'en'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/50 shadow-amber-500/30 font-bold'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold border-amber-400/80 shadow-amber-500/20 hover:scale-[1.02]'
              }`}
              title="Listen to Sri Krishna's Divine Voice in English"
            >
              <Volume2 className={`w-4 h-4 ${isThisActive && voiceState.language === 'en' && isThisPlaying ? 'animate-bounce text-slate-950' : 'text-slate-950'}`} />
              <span className="font-medium tracking-wide">
                {isThisActive && voiceState.language === 'en'
                  ? (isThisPlaying ? 'Speaking Divine Words...' : isThisPaused ? 'Paused' : 'Preparing English Voice...')
                  : 'Listen in English (Sri Krishna Voice)'}
              </span>
            </button>

            {/* Telugu Option */}
            <button
              onClick={() => handlePlayVoice('te')}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                isThisActive && voiceState.language === 'te'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400/40'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-amber-200'
              }`}
              title="తెలుగులో వినండి (Listen in Telugu)"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>తెలుగు Audio</span>
            </button>

            {/* Hindi Option */}
            <button
              onClick={() => handlePlayVoice('hi')}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                isThisActive && voiceState.language === 'hi'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400/40'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-amber-200'
              }`}
              title="हिन्दी में सुनें (Listen in Hindi)"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>हिन्दी Audio</span>
            </button>
          </>
        ) : currentAppLang === 'te' ? (
          <>
            {/* Primary Prominent Telugu Voice Button */}
            <button
              onClick={() => handlePlayVoice('te')}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                isThisActive && voiceState.language === 'te'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/50 shadow-amber-500/30 font-bold'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold border-amber-400/80 shadow-amber-500/20 hover:scale-[1.02]'
              }`}
              title="శ్రీకృష్ణుని దివ్యవాణి వినండి (Telugu Audio)"
            >
              <Volume2 className={`w-4 h-4 ${isThisActive && voiceState.language === 'te' && isThisPlaying ? 'animate-bounce text-slate-950' : 'text-slate-950'}`} />
              <span className="font-sans">
                {isThisActive && voiceState.language === 'te'
                  ? (isThisPlaying ? 'వాణి వినిపిస్తోంది...' : isThisPaused ? 'ఆగింది' : 'సిద్ధమవుతోంది...')
                  : 'శ్రీకృష్ణ వాణి వినండి (తెలుగు)'}
              </span>
            </button>

            {/* English Option */}
            <button
              onClick={() => handlePlayVoice('en')}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                isThisActive && voiceState.language === 'en'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400/40'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-slate-100'
              }`}
              title="Listen in English"
            >
              <Volume2 className="w-3.5 h-3.5 text-slate-300" />
              <span>English Audio</span>
            </button>

            {/* Hindi Option */}
            <button
              onClick={() => handlePlayVoice('hi')}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                isThisActive && voiceState.language === 'hi'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400/40'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-amber-200'
              }`}
              title="हिन्दी में सुनें (Hindi Audio)"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>हिन्दी Audio</span>
            </button>
          </>
        ) : (
          <>
            {/* Primary Prominent Hindi Voice Button */}
            <button
              onClick={() => handlePlayVoice('hi')}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                isThisActive && voiceState.language === 'hi'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/50 shadow-amber-500/30 font-bold'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold border-amber-400/80 shadow-amber-500/20 hover:scale-[1.02]'
              }`}
              title="भगवान श्रीकृष्ण की अमृतमयी हिन्दी वाणी सुनें"
            >
              <Volume2 className={`w-4 h-4 ${isThisActive && voiceState.language === 'hi' && isThisPlaying ? 'animate-bounce text-slate-950' : 'text-slate-950'}`} />
              <span className="font-serif tracking-wide">
                {isThisActive && voiceState.language === 'hi'
                  ? (isThisPlaying ? 'वाणी गूँज रही है...' : isThisPaused ? 'वाणी रुकी है' : 'वाणी तैयार हो रही है...')
                  : 'श्रीकृष्ण वाणी सुनें (हिन्दी)'}
              </span>
            </button>

            {/* English Option */}
            <button
              onClick={() => handlePlayVoice('en')}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                isThisActive && voiceState.language === 'en'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400/40'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-slate-100'
              }`}
              title="Listen in English"
            >
              <Volume2 className="w-3.5 h-3.5 text-slate-300" />
              <span>English Audio</span>
            </button>

            {/* Telugu Option */}
            <button
              onClick={() => handlePlayVoice('te')}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                isThisActive && voiceState.language === 'te'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400/40'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-amber-200'
              }`}
              title="తెలుగులో వినండి (Telugu Audio)"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>తెలుగు Audio</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
