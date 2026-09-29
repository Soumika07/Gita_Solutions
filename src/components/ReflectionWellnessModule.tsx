import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  BookMarked, 
  PenTool, 
  CheckCircle2, 
  Clock, 
  Heart,
  Volume2
} from 'lucide-react';
import { REFLECTION_PROMPTS, MULTILINGUAL_REFLECTION_PROMPTS } from '../data/gitaData.ts';
import { analyzeReflection } from '../services/api.ts';
import { sacredAudio } from '../utils/audio.ts';
import { ReflectionEntry } from '../types/gita.ts';
import { useLanguage } from '../context/LanguageContext.tsx';
import { getTranslation } from '../i18n/translations.ts';

interface ReflectionWellnessModuleProps {
  onMeditationCompleted?: (minutes: number) => void;
  onJapaRoundCompleted?: () => void;
  onReflectionAdded?: () => void;
}

export const ReflectionWellnessModule: React.FC<ReflectionWellnessModuleProps> = ({
  onMeditationCompleted,
  onJapaRoundCompleted,
  onReflectionAdded
}) => {
  const { language } = useLanguage();
  const t = getTranslation(language);

  const [activeTab, setActiveTab] = useState<'timer' | 'japa' | 'journal'>('timer');

  // 1. Meditation Timer State (Quiet Stillness of the Soul)
  const [meditationMinutes, setMeditationMinutes] = useState(5);
  const [meditationSecondsLeft, setMeditationSecondsLeft] = useState(300);
  const [isMeditationRunning, setIsMeditationRunning] = useState(false);
  const [isHareRamSoundEnabled, setIsHareRamSoundEnabled] = useState(true);
  const [isManualChantPlaying, setIsManualChantPlaying] = useState(false);
  const [chantVolume, setChantVolume] = useState<number>(0.9);
  const [audioSource, setAudioSource] = useState<'youtube' | 'local'>('youtube');

  useEffect(() => {
    sacredAudio.setAudioSource(audioSource);
  }, [audioSource]);

  useEffect(() => {
    let timer: any = null;
    if (isMeditationRunning && meditationSecondsLeft > 0) {
      if (isHareRamSoundEnabled) {
        sacredAudio.startHareRamChant(chantVolume);
      }
      timer = setInterval(() => {
        setMeditationSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (meditationSecondsLeft === 0 && isMeditationRunning) {
      setIsMeditationRunning(false);
      setIsManualChantPlaying(false);
      sacredAudio.stopHareRamChant();
      sacredAudio.playBell(528);
      if (onMeditationCompleted) {
        onMeditationCompleted(meditationMinutes);
      }
    } else if (!isMeditationRunning && !isManualChantPlaying) {
      sacredAudio.stopHareRamChant();
    }
    return () => {
      clearInterval(timer);
    };
  }, [isMeditationRunning, meditationSecondsLeft, isHareRamSoundEnabled, isManualChantPlaying, chantVolume, audioSource]);

  // Clean up audio on unmount or tab switch
  useEffect(() => {
    return () => {
      sacredAudio.stopHareRamChant();
    };
  }, []);

  const handleStartMeditation = (mins: number) => {
    setMeditationMinutes(mins);
    setMeditationSecondsLeft(mins * 60);
    setIsMeditationRunning(true);
    sacredAudio.playBell(432);
    if (isHareRamSoundEnabled) {
      sacredAudio.startHareRamChant(chantVolume);
    }
  };

  const handleToggleManualTest = () => {
    if (isManualChantPlaying || isMeditationRunning) {
      sacredAudio.stopHareRamChant();
      setIsManualChantPlaying(false);
    } else {
      sacredAudio.playBell(432);
      sacredAudio.startHareRamChant(chantVolume);
      setIsManualChantPlaying(true);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 2. Japa Mala Counter State
  const mantras = [
    { 
      titleEn: "Maha-Mantra", 
      titleHi: "महा-मन्त्र", 
      titleTe: "మహా మంత్రం", 
      textEn: "Hare Krishna Hare Krishna Krishna Krishna Hare Hare, Hare Rama Hare Rama Rama Rama Hare Hare",
      textHi: "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे। हरे राम हरे राम राम राम हरे हरे॥",
      textTe: "హరే కృష్ణ హరే కృష్ణ కృష్ణ కృష్ణ హరే హరే | హరే రామ హరే రామ రామ రామ హరే హరే ||"
    },
    { 
      titleEn: "Vasudeva Mantra", 
      titleHi: "द्वादशाक्षर मन्त्र", 
      titleTe: "వాసుదేవ మంత్రం", 
      textEn: "Om Namo Bhagavate Vasudevaya",
      textHi: "ॐ नमो भगवते वासुदेवाय",
      textTe: "ఓం నమో భగవతే వాసుదేవాయ"
    },
    { 
      titleEn: "Gayatri Mantra", 
      titleHi: "गायत्री मन्त्र", 
      titleTe: "గాయత్రీ మంత్రం", 
      textEn: "Om Bhur Bhuva Svah, Tat Savitur Varenyam, Bhargo Devasya Dheemahi, Dhiyo Yo Nah Prachodayat",
      textHi: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥",
      textTe: "ఓం భూర్భువస్సువః తత్సవితుర్వరేణ్యం భర్గో దేవస్య ధీమహి ధియో యో నః ప్రచోదయాత్ ||"
    },
    { 
      titleEn: "Soham Breath Mantra", 
      titleHi: "सो ऽहम् हंस मन्त्र", 
      titleTe: "సో ऽహమ్ ప్రాణ మంత్రం", 
      textEn: "So-Ham: I am That Pure Divine Consciousness",
      textHi: "सो ऽहम् (हंस मन्त्र: मैं वही सच्चिदानन्द स्वरूप हूँ)",
      textTe: "సో ऽహమ్ (నేను ఆ పరమాత్మ స్వరూపమే)"
    },
    { 
      titleEn: "Om Shanti", 
      titleHi: "शान्ति मन्त्र", 
      titleTe: "శాంతి మంత్రం", 
      textEn: "Om Shanti, Shanti, Shanti - Peace in Body, Mind and Soul",
      textHi: "ॐ शान्तिः शान्तिः शान्तिः (त्रिविध तापों की शांति)",
      textTe: "ఓం శాంతిః శాంతిః శాంతిః (ఆధ్యాత్మిక, ఆదిభౌతిక, ఆదిదైవిక శాంతి)"
    }
  ];

  const [selectedMantraIdx, setSelectedMantraIdx] = useState(0);
  const [beadCount, setBeadCount] = useState(0);
  const [roundsCompleted, setRoundsCompleted] = useState(0);

  const getMantraDisplay = (idx: number) => {
    const m = mantras[idx];
    if (language === 'hi') return m.textHi;
    if (language === 'te') return m.textTe;
    return m.textEn;
  };

  const getMantraTitle = (idx: number) => {
    const m = mantras[idx];
    if (language === 'hi') return m.titleHi;
    if (language === 'te') return m.titleTe;
    return m.titleEn;
  };

  const handleBeadClick = () => {
    sacredAudio.playJapaClick();
    if (beadCount + 1 >= 108) {
      setBeadCount(0);
      setRoundsCompleted(prev => prev + 1);
      sacredAudio.playBell(528);
      if (onJapaRoundCompleted) {
        onJapaRoundCompleted();
      }
    } else {
      setBeadCount(prev => prev + 1);
    }
  };

  // 3. Sacred Journal State
  const [journalPromptIndex, setJournalPromptIndex] = useState(0);
  const [journalContent, setJournalContent] = useState('');
  const [moodRating, setMoodRating] = useState(7);
  const [analyzingJournal, setAnalyzingJournal] = useState(false);
  const [journalFeedback, setJournalFeedback] = useState<any | null>(null);
  const [journalEntries, setJournalEntries] = useState<ReflectionEntry[]>(() => {
    try {
      const saved = localStorage.getItem('gita_journal_entries');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const getCurrentPrompt = () => {
    const p = MULTILINGUAL_REFLECTION_PROMPTS[journalPromptIndex % MULTILINGUAL_REFLECTION_PROMPTS.length];
    if (language === 'hi' && p.hi) return p.hi;
    if (language === 'te' && p.te) return p.te;
    return p.en;
  };

  const handleSaveReflection = async () => {
    if (!journalContent.trim() || analyzingJournal) return;
    setAnalyzingJournal(true);
    sacredAudio.playBell(432);

    try {
      const feedback = await analyzeReflection(journalContent, moodRating, language);
      setJournalFeedback(feedback);

      const currentPromptText = getCurrentPrompt();

      const newEntry: ReflectionEntry = {
        id: `entry-${Date.now()}`,
        date: new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        prompt: currentPromptText,
        content: journalContent.trim(),
        moodRating,
        aiWisdomFeedback: feedback.aiFeedback,
        assignedVerse: feedback.assignedVerse
      };

      const updated = [newEntry, ...journalEntries];
      setJournalEntries(updated);
      try {
        localStorage.setItem('gita_journal_entries', JSON.stringify(updated));
      } catch (e) {}

      if (onReflectionAdded) {
        onReflectionAdded();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingJournal(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8 animate-fadeIn">
      
      {/* Sub Tabs */}
      <div className="flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex gap-1 shadow-lg">
          <button
            onClick={() => setActiveTab('timer')}
            className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'timer'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{t.wellnessTabMeditation}</span>
          </button>
          <button
            onClick={() => setActiveTab('japa')}
            className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'japa'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>{t.wellnessTabJapa}</span>
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'journal'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>{t.wellnessTabJournal}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DHYANA MEDITATION TIMER */}
      {/* ========================================================================= */}
      {activeTab === 'timer' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col items-center text-center space-y-6">
          <div className="space-y-1">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-widest">
              {language === 'hi' ? 'गीता अध्याय ६ (आत्मसंयम योग)' : language === 'te' ? 'భగవద్గీత అధ్యాయం 6 (ఆత్మసంయమ యోగం)' : 'Gita Chapter 6 (Atma Samyama Yoga)'}
            </span>
            <h3 className="text-2xl font-bold font-serif text-slate-100">
              {t.wellnessMeditationTitle}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {language === 'hi' 
                ? '"यथा दीपो निवातस्थो नेङ्गते सोपमा स्मृता..." — जैसे वायु रहित स्थान में दीपक निष्कंप रहता है, वैसे ही योगी का मन ध्यान में स्थिर रहता है।' 
                : language === 'te' 
                ? '"గాలి లేని చోట దీపపు జ్యోతి నిశ్చలంగా ఉన్నట్లు, ధ్యానంలో స్థిరపడిన యోగి మనస్సు చలించదు."' 
                : '"As a lamp in a windless place does not flicker, so the disciplined mind of a yogi remains steady in meditation." (Gita 6.19)'}
            </p>
          </div>

          {/* Big Circular Timer Display */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className={`absolute inset-0 rounded-full border-4 border-amber-500/30 ${isMeditationRunning ? 'border-t-amber-400 animate-spin duration-1000' : ''}`} />
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-5xl font-mono font-extrabold text-slate-100 tracking-wider">
                {formatTime(meditationSecondsLeft)}
              </span>
              <span className="text-xs text-amber-400 mt-2 font-medium">
                {isMeditationRunning 
                  ? (language === 'hi' ? 'ध्यान जारी है...' : language === 'te' ? 'ధ్యానం జరుగుతోంది...' : 'Dhyana in progress...') 
                  : (language === 'hi' ? 'अवधि चुनें और सीधे बैठें' : language === 'te' ? 'సమయాన్ని ఎంచుకుని నిటారుగా కూర్చోండి' : 'Select duration & sit tall')}
              </span>
            </div>
          </div>

          {/* Duration Presets */}
          <div className="flex flex-wrap justify-center gap-2">
            {[3, 5, 10, 15, 20].map(mins => (
              <button
                key={mins}
                onClick={() => handleStartMeditation(mins)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  meditationMinutes === mins && isMeditationRunning
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-amber-500/40 hover:text-amber-300'
                }`}
              >
                {mins} {language === 'hi' ? 'मिनट' : language === 'te' ? 'నిమిషాలు' : 'Minutes'}
              </button>
            ))}
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (!isMeditationRunning) {
                  sacredAudio.playBell(432);
                  if (isHareRamSoundEnabled) {
                    sacredAudio.startHareRamChant(chantVolume);
                  }
                  setIsMeditationRunning(true);
                } else {
                  sacredAudio.stopHareRamChant();
                  setIsMeditationRunning(false);
                  setIsManualChantPlaying(false);
                }
              }}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-colors cursor-pointer ${
                isMeditationRunning 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              }`}
            >
              {isMeditationRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isMeditationRunning ? t.wellnessPauseMeditation : t.wellnessStartMeditation}</span>
            </button>

            <button
              onClick={() => {
                setIsMeditationRunning(false);
                setIsManualChantPlaying(false);
                sacredAudio.stopHareRamChant();
                setMeditationSecondsLeft(meditationMinutes * 60);
              }}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-xl cursor-pointer"
              title={t.wellnessResetTimer}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Hare Ram Hare Ram Maha-Mantra Slokam Sound Card */}
          <div className={`w-full max-w-xl p-5 sm:p-6 rounded-2xl border transition-all duration-300 ${
            isMeditationRunning || isManualChantPlaying
              ? 'bg-gradient-to-b from-amber-500/15 via-slate-950 to-slate-950 border-amber-400/50 shadow-xl shadow-amber-500/15 ring-1 ring-amber-400/30' 
              : 'bg-slate-950/60 border-slate-800'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-amber-500/20">
              <div className="flex items-center gap-2">
                <Volume2 className={`w-4 h-4 ${isMeditationRunning || isManualChantPlaying ? 'text-amber-400 animate-bounce' : 'text-slate-400'}`} />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  {isMeditationRunning || isManualChantPlaying 
                    ? (language === 'hi' ? 'महा-मन्त्र ध्वनि प्रवाहित' : language === 'te' ? 'మహా మంత్ర ధ్వని మ్రోగుతోంది' : 'Maha-Mantra Sound Playing') 
                    : (language === 'hi' ? 'हरे राम महा-मन्त्र नाद' : language === 'te' ? 'హరే రామ నాదం' : 'Hare Ram Slokam Sound')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Instant Play / Test Button */}
                <button
                  onClick={handleToggleManualTest}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isManualChantPlaying
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                      : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                  }`}
                  title="Directly test or preview the chant audio"
                >
                  {isManualChantPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isManualChantPlaying ? (language === 'hi' ? 'ध्वनि रोकें' : language === 'te' ? 'ఆపండి' : 'Stop Audio') : (language === 'hi' ? 'ध्वनि सुनें' : language === 'te' ? 'వినండి' : 'Play / Test Sound')}</span>
                </button>

                {/* Mute / Unmute Toggle */}
                <button
                  onClick={() => {
                    const next = !isHareRamSoundEnabled;
                    setIsHareRamSoundEnabled(next);
                    if (!next) {
                      sacredAudio.stopHareRamChant();
                      setIsManualChantPlaying(false);
                    } else if (isMeditationRunning) {
                      sacredAudio.startHareRamChant(chantVolume);
                    }
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-colors cursor-pointer ${
                    isHareRamSoundEnabled
                      ? 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}
                  title="Toggle Hare Ram Maha-Mantra sound"
                >
                  {isHareRamSoundEnabled ? (language === 'hi' ? 'ध्वनि: चालू' : language === 'te' ? 'ధ్వని: ఆన్' : 'Auto-Sound: ON') : (language === 'hi' ? 'मौन' : language === 'te' ? 'మౌనం' : 'Muted')}
                </button>
              </div>
            </div>

            {/* Sacred Shlokam Display */}
            <div className="pt-3 text-center space-y-2">
              <p className="font-serif text-lg sm:text-2xl text-amber-200 font-bold leading-relaxed tracking-wide select-none">
                हरे राम हरे राम राम राम हरे हरे।<br className="sm:hidden" /> हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे॥
              </p>
              {language === 'te' && (
                <p className="font-serif text-base sm:text-xl text-amber-300 font-semibold leading-relaxed tracking-wide select-none">
                  హరే రామ హరే రామ రామ రామ హరే హరే | హరే కృష్ణ హరే కృష్ణ కృష్ణ కృష్ణ హరే హరే ||
                </p>
              )}
              <p className="text-xs sm:text-sm text-slate-300/80 italic font-serif">
                Hare Rāma Hare Rāma, Rāma Rāma Hare Hare · Hare Kṛṣṇa Hare Kṛṣṇa, Kṛṣṇa Kṛṣṇa Hare Hare
              </p>

              {/* YouTube Audio Source Information */}
              <div className="py-1 px-3 rounded-xl bg-slate-900/90 border border-amber-500/20 max-w-md mx-auto flex items-center justify-between text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <span className="truncate">
                    {audioSource === 'youtube' 
                      ? 'Best Of ISKCON Kirtan (youtu.be/50g5bnruep0)' 
                      : 'Studio Vocal Chant (Offline WAV)'}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    onClick={() => {
                      const next = audioSource === 'youtube' ? 'local' : 'youtube';
                      setAudioSource(next);
                      if (isMeditationRunning || isManualChantPlaying) {
                        sacredAudio.stopHareRamChant();
                        setTimeout(() => sacredAudio.startHareRamChant(chantVolume), 100);
                      }
                    }}
                    className="text-[10px] text-amber-400 hover:text-amber-300 underline cursor-pointer"
                  >
                    {audioSource === 'youtube' 
                      ? (language === 'hi' ? 'लोकल ऑडियो' : language === 'te' ? 'లోకల్ ఆడియో' : 'Switch to Local') 
                      : (language === 'hi' ? 'यूट्यूब कीर्तन' : language === 'te' ? 'యూట్యూబ్ కీర్తన' : 'Switch to YouTube')}
                  </button>
                </div>
              </div>
              
              {isMeditationRunning || isManualChantPlaying ? (
                <div className="pt-2 flex items-center justify-center gap-2 text-xs text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="font-medium">
                    {language === 'hi' ? 'पवित्र संकीर्तन नाद प्रवाहित हो रहा है...' : language === 'te' ? 'పవిత్ర సంకీర్తన ధ్వని ప్రవహిస్తోంది...' : 'Playing sacred chant audio...'}
                  </span>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 pt-1">
                  {language === 'hi' 
                    ? 'ऊपर ध्यान शुरू करें अथवा पवित्र संकीर्तन का आनंद लें।' 
                    : language === 'te' 
                    ? 'ధ్యానం ప్రారంభించండి లేదా పవిత్ర నాదాన్ని ఆలకించండి.' 
                    : 'Click Begin Quiet Stillness above or tap Play / Test Sound to immerse in the sacred chant sound.'}
                </p>
              )}
            </div>

            {/* Volume Control */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px]">{language === 'hi' ? 'ध्वनि तीव्रता:' : language === 'te' ? 'శబ్దం స్థాయి:' : 'Chant Volume:'}</span>
              <div className="flex items-center gap-1.5">
                {[
                  { labelEn: 'Soft', labelHi: 'धीमा', labelTe: 'నెమ్మదిగా', val: 0.4 },
                  { labelEn: 'Medium', labelHi: 'मध्यम', labelTe: 'మధ్యస్థం', val: 0.7 },
                  { labelEn: 'Full', labelHi: 'पूर्ण', labelTe: 'పూర్తి', val: 1.0 }
                ].map(item => (
                  <button
                    key={item.labelEn}
                    onClick={() => {
                      setChantVolume(item.val);
                      if (isMeditationRunning || isManualChantPlaying) {
                        sacredAudio.startHareRamChant(item.val);
                      }
                    }}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      Math.abs(chantVolume - item.val) < 0.1
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {language === 'hi' ? item.labelHi : language === 'te' ? item.labelTe : item.labelEn}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: 108 JAPA MALA COUNTER */}
      {/* ========================================================================= */}
      {activeTab === 'japa' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col items-center text-center space-y-6">
          <div className="space-y-1">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-widest">
              {language === 'hi' ? 'गीता अध्याय १० श्लोक २५' : language === 'te' ? 'భగవద్గీత అధ్యాయం 10 శ్లోకం 25' : 'Gita Chapter 10 Verse 25'}
            </span>
            <h3 className="text-2xl font-bold font-serif text-slate-100">
              {t.wellnessJapaTitle}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {language === 'hi' ? '"यज्ञानां जपयज्ञोऽस्मि" — समस्त यज्ञों में मैं जप-यज्ञ हूँ।' : language === 'te' ? '"యజ్ఞానాం జపయజ్ఞోస్మి" — సమస్త యజ్ఞములలో నేను జపయజ్ఞమును.' : '"Among sacrifices, I am the sacrifice of silent chanting (Japa Yajna)."'}
            </p>
          </div>

          {/* Mantra Selector */}
          <div className="w-full max-w-md">
            <select
              value={selectedMantraIdx}
              onChange={(e) => setSelectedMantraIdx(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-amber-300 focus:outline-none focus:border-amber-400"
            >
              {mantras.map((_, i) => (
                <option key={i} value={i}>
                  {getMantraTitle(i)} — {getMantraDisplay(i).slice(0, 32)}...
                </option>
              ))}
            </select>
          </div>

          {/* Mantra Display Card */}
          <div className="p-4 bg-slate-950/70 border border-amber-500/20 rounded-2xl max-w-lg w-full">
            <p className="font-serif text-sm sm:text-base text-amber-200 font-semibold leading-relaxed">
              {getMantraDisplay(selectedMantraIdx)}
            </p>
          </div>

          {/* The Big Clickable Japa Bead */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleBeadClick}
              className="group relative w-48 h-48 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex flex-col items-center justify-center p-6 text-slate-950 shadow-2xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border-4 border-amber-300/40 select-none"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-slate-900/80 mb-1">
                {t.wellnessTapBead}
              </span>
              <span className="text-5xl font-mono font-extrabold text-slate-950">
                {beadCount}
              </span>
              <span className="text-xs font-semibold text-slate-900/90 mt-1">
                {t.wellnessBeadCount}
              </span>
            </button>

            {/* Rounds completed */}
            <div className="mt-4 flex items-center gap-4 text-xs font-semibold">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                {t.wellnessRoundsCompleted}: {roundsCompleted}
              </span>
              <button
                onClick={() => {
                  setBeadCount(0);
                  setRoundsCompleted(0);
                }}
                className="text-slate-400 hover:text-slate-200 text-xs hover:underline cursor-pointer"
              >
                {t.reset}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SACRED JOURNALING */}
      {/* ========================================================================= */}
      {activeTab === 'journal' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-widest">
                  {language === 'hi' ? 'आत्म-विचार (स्वाध्याय)' : language === 'te' ? 'ఆత్మ విచారం (స్వాధ్యాయం)' : 'Atma-Vichara (Self-Inquiry)'}
                </span>
                <h3 className="text-xl font-bold font-serif text-slate-100 mt-0.5">
                  {language === 'hi' ? 'दैनिक आध्यात्मिक दैनंदिनी' : language === 'te' ? 'దైనందిన ఆధ్యాత్మిక అంతర్మథనం' : 'Daily Gita Sacred Journal'}
                </h3>
              </div>
              <button
                onClick={() => setJournalPromptIndex((journalPromptIndex + 1) % MULTILINGUAL_REFLECTION_PROMPTS.length)}
                className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 cursor-pointer"
              >
                {language === 'hi' ? 'अगला विचार सूत्र ↻' : language === 'te' ? 'తదుపరి ప్రేరణ ↻' : 'Next Prompt ↻'}
              </button>
            </div>

            {/* Reflection Prompt Quote */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                {t.wellnessJournalPromptTitle}:
              </span>
              <p className="text-sm text-slate-100 font-medium">
                "{getCurrentPrompt()}"
              </p>
            </div>

            {/* Mood Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-1.5">
                <span>{t.wellnessMoodRatingLabel}</span>
                <span className="text-amber-400 font-bold">{moodRating} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={moodRating}
                onChange={(e) => setMoodRating(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Journal Textarea */}
            <div>
              <textarea
                rows={4}
                value={journalContent}
                onChange={(e) => setJournalContent(e.target.value)}
                placeholder={t.wellnessJournalPlaceholder}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-2xl p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400/40"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveReflection}
                disabled={!journalContent.trim() || analyzingJournal}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
              >
                {analyzingJournal ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>{language === 'hi' ? 'गीता दृष्टि प्राप्त हो रही है...' : language === 'te' ? 'భగవద్గీత జ్ఞాన విశ్లేషణ...' : 'Extracting Gita Insights...'}</span>
                  </>
                ) : (
                  <>
                    <PenTool className="w-4 h-4" />
                    <span>{t.wellnessSaveReflection}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Feedback Card */}
          {journalFeedback && (
            <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>{t.wellnessAiMentorFeedback}</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {journalFeedback.aiFeedback}
              </p>

              {journalFeedback.assignedVerse && (
                <div className="p-4 bg-slate-950/70 border border-amber-500/20 rounded-2xl">
                  <span className="text-xs font-bold text-amber-400 block mb-1">
                    {language === 'hi' 
                      ? `आपके लिए निर्देशित श्लोक: अध्याय ${journalFeedback.assignedVerse.chapter}, श्लोक ${journalFeedback.assignedVerse.verse}` 
                      : language === 'te' 
                      ? `మీ కోసం సూచించబడిన శ్లోకం: అధ్యాయం ${journalFeedback.assignedVerse.chapter}, శ్లోకం ${journalFeedback.assignedVerse.verse}` 
                      : `Your Assigned Contemplative Verse: Chapter ${journalFeedback.assignedVerse.chapter}, Verse ${journalFeedback.assignedVerse.verse}`}
                  </span>
                  <p className="text-xs text-slate-300 italic">
                    "{journalFeedback.assignedVerse.translation}"
                  </p>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-slate-800 gap-2">
                <span className="text-emerald-300 font-semibold">
                  {language === 'hi' ? 'विकसित सद्गुण:' : language === 'te' ? 'పెంపొందించిన సద్గుణం:' : 'Virtue Cultivated:'} {journalFeedback.virtueGained || 'Self-Awareness'}
                </span>
                <span className="text-slate-400">
                  {language === 'hi' ? 'दैनिक सुझाव:' : language === 'te' ? 'సూచన:' : 'Tip:'} {journalFeedback.practicalTip || 'Start tomorrow with 5 minutes of stillness.'}
                </span>
              </div>
            </div>
          )}

          {/* Saved History */}
          {journalEntries.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                {language === 'hi' ? `पूर्व विचार एवं संस्मरण (${journalEntries.length})` : language === 'te' ? `గత అంతర్మథనాలు (${journalEntries.length})` : `Your Past Reflections (${journalEntries.length})`}
              </h4>
              <div className="space-y-3">
                {journalEntries.slice(0, 3).map((entry) => (
                  <div key={entry.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span className="font-semibold text-amber-400">{entry.date}</span>
                      <span>{language === 'hi' ? 'मनःस्थिति:' : language === 'te' ? 'మానసిక స్థితి:' : 'Mood:'} {entry.moodRating}/10</span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2">
                      "{entry.content}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
