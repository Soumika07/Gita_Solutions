import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  Sparkles, 
  Wind, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Flame, 
  Compass, 
  ArrowRight 
} from 'lucide-react';
import { analyzeEmotion } from '../services/api.ts';
import { EmotionAnalysisResult } from '../types/gita.ts';
import { sacredAudio } from '../utils/audio.ts';
import { useLanguage } from '../context/LanguageContext.tsx';
import { getTranslation } from '../i18n/translations.ts';

export const EmotionDetectionModule: React.FC = () => {
  const { language } = useLanguage();
  const t = getTranslation(language);

  const [inputText, setInputText] = useState('');
  const [context, setContext] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<EmotionAnalysisResult | null>(null);

  // Breathing pacer state
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Hold Empty'>('Inhale');
  const [breathCount, setBreathCount] = useState(4);

  const emotionPresets = [
    {
      label: language === 'hi' ? 'चिंता और व्याकुलता (विषाद)' : language === 'te' ? 'ఆందోళన & భయం (విషాదం)' : 'Anxiety & Worry (Vishada)',
      prompt: language === 'hi' 
        ? 'मैं भविष्य के परिणामों को लेकर निरंतर चिंता और घबराहट महसूस कर रहा हूँ।' 
        : language === 'te' 
        ? 'భవిష్యత్తు గురించి ఆలోచించి నిరంతరం ఆందోళన, భయంతో నా మనస్సు స్థంభించిపోతోంది.' 
        : 'I am feeling paralyzed by constant anxiety and worrying about future outcomes.'
    },
    {
      label: language === 'hi' ? 'क्रोध और खीझ (क्रोध)' : language === 'te' ? 'కోపం & అసహనం (క్రోధం)' : 'Anger & Frustration (Krodha)',
      prompt: language === 'hi'
        ? 'जब लोग मेरी सीमाओं का अनादर करते हैं तो मुझे अत्यधिक क्रोध और कड़वाहट होती है।'
        : language === 'te'
        ? 'ఇతరులు నా మాట విననప్పుడు లేదా అన్యాయం జరిగినప్పుడు తీవ్రమైన ఆవేశం కలుగుతోంది.'
        : 'I feel intense anger and bitterness because people crossed my boundaries and did not listen.'
    },
    {
      label: language === 'hi' ? 'शोक और अवसाद (शोक)' : language === 'te' ? 'దుఃఖం & హృదయ వేదన (శోకం)' : 'Grief & Heartbreak (Shoka)',
      prompt: language === 'hi'
        ? 'मैं गहरे आघात और उदासी से जूझ रहा हूँ। हृदय में भारीपन महसूस हो रहा है।'
        : language === 'te'
        ? 'జీవితంలో ఎదురైన నష్టంతో తీవ్ర విచారం, లోతైన శూన్యత నన్ను కుంగదీస్తున్నాయి.'
        : 'I am dealing with profound loss and sadness. I feel an empty void in my chest.'
    },
    {
      label: language === 'hi' ? 'मोह और अनिर्णय (मोह)' : language === 'te' ? 'మోహం & సందిగ్ధత (మోహం)' : 'Confusion & Indecision (Moha)',
      prompt: language === 'hi'
        ? 'मैं अपने जीवन और कर्तव्य को लेकर भारी संशय और असमंजस में हूँ।'
        : language === 'te'
        ? 'జీవితంలో ఏ దారి ఎంచుకోవాలో అర్థం కాక కర్తవ్య సందిగ్ధంలో చిక్కుకున్నాను.'
        : 'I have no idea which direction to take in my career and morals. I am completely torn.'
    },
    {
      label: language === 'hi' ? 'चंचलता और अशांति' : language === 'te' ? 'చంచలమైన మనస్సు & అశాంతి' : 'Restlessness & Distraction',
      prompt: language === 'hi'
        ? 'मेरा मन एक क्षण भी स्थिर नहीं रहता, विचारों की तीव्र हलचल से अशांत है।'
        : language === 'te'
        ? 'నా మనస్సు ఏకాగ్రత కోల్పోయి, అనేక ఆలోచనలతో నిరంతరం చలిస్తోంది.'
        : 'My mind refuses to sit still, jumping from thought to thought with endless restlessness.'
    },
    {
      label: language === 'hi' ? 'आत्म-संदेह और हीनभावना' : language === 'te' ? 'ఆత్మన్యూనత & అభద్రతాభావం' : 'Imposter Syndrome & Doubt',
      prompt: language === 'hi'
        ? 'मुझे लगता है कि मैं योग्य नहीं हूँ और दूसरों से अपनी तुलना करके निराश होता हूँ।'
        : language === 'te'
        ? 'నన్ను నేను ఇతరులతో పోల్చుకుంటూ సరిపోననే భావనతో సతమతమవుతున్నాను.'
        : 'I feel unworthy and like an imposter. I compare myself to others and feel small.'
    }
  ];

  // Breathing Pacer Timer Loop (Box Breathing: 4s - 4s - 4s - 4s)
  useEffect(() => {
    let interval: any = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathCount(prev => {
          if (prev <= 1) {
            setBreathPhase(currPhase => {
              if (currPhase === 'Inhale') {
                sacredAudio.playBell(580);
                return 'Hold';
              }
              if (currPhase === 'Hold') return 'Exhale';
              if (currPhase === 'Exhale') return 'Hold Empty';
              sacredAudio.playBell(432);
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathCount(4);
      setBreathPhase('Inhale');
    }
    return () => clearInterval(interval);
  }, [isBreathingActive]);

  const handleAnalyze = async (presetText?: string) => {
    const textToRun = presetText || inputText;
    if (!textToRun.trim() || analyzing) return;

    setAnalyzing(true);
    sacredAudio.playBell(528);

    try {
      const result = await analyzeEmotion(textToRun, context, language);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const getBreathPhaseLabel = () => {
    if (!isBreathingActive) {
      return language === 'hi' ? 'तैयार' : language === 'te' ? 'సిద్ధం' : 'Ready';
    }
    switch (breathPhase) {
      case 'Inhale':
        return t.emotionInhale;
      case 'Hold':
        return t.emotionHold;
      case 'Exhale':
        return t.emotionExhale;
      case 'Hold Empty':
        return t.emotionHoldEmpty;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8 animate-fadeIn">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <HeartHandshake className="w-4 h-4" />
          <span>{language === 'hi' ? 'वैदिक मानस-चिकित्सा एवं श्लोक उपचार' : language === 'te' ? 'వైదిక మానసిక విశ్లేషణ & శ్లోక ఔషధం' : 'Vedic Psychological Diagnosis & Shloka Prescriptions'}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 font-serif leading-tight">
          {t.emotionHeaderTitle}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          {t.emotionHeaderSubtitle}
        </p>

        {/* Emotion Preset Chips */}
        <div className="mt-5">
          <span className="text-xs text-rose-300/80 font-medium block mb-2">{t.emotionPresetsTitle}:</span>
          <div className="flex flex-wrap gap-2">
            {emotionPresets.map((ep, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(ep.prompt);
                  handleAnalyze(ep.prompt);
                }}
                className="text-xs bg-slate-800/90 hover:bg-rose-500/20 text-slate-300 hover:text-rose-200 border border-slate-700/80 hover:border-rose-500/40 rounded-full px-3.5 py-1.5 transition-all flex items-center gap-1.5"
              >
                <span>{ep.label}</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Form Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            {language === 'hi' ? 'इस समय आपका मन और हृदय क्या अनुभव कर रहे हैं?' : language === 'te' ? 'ప్రస్తుతం మీ మనస్సు, హృదయం దేనిని అనుభవిస్తున్నాయి?' : 'What is your heart and mind experiencing right now?'}
          </label>
          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.emotionInputPlaceholder}
            className="w-full bg-slate-950 border border-slate-700 focus:border-rose-400 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-400/40 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder={language === 'hi' ? 'संदर्भ (उदा. कार्यस्थल, संबंध, स्वास्थ्य, परीक्षा)...' : language === 'te' ? 'సందర్భం (ఉదా: ఉద్యోగం, సంబంధాలు, ఆరోగ్యం, పరీక్షలు)...' : 'Context (e.g. at work, relationship, health, exams)...'}
            className="bg-slate-950 border border-slate-800 text-xs px-3.5 py-2 rounded-xl text-slate-300 placeholder-slate-600 focus:outline-none focus:border-slate-600 flex-1 min-w-[200px]"
          />
          <button
            onClick={() => handleAnalyze()}
            disabled={!inputText.trim() || analyzing}
            className="px-6 py-2.5 bg-gradient-to-r from-rose-500 via-amber-500 to-amber-600 hover:from-rose-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-rose-500/20 disabled:opacity-40 flex items-center gap-2"
          >
            {analyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>{language === 'hi' ? 'गुणों व श्लोक का विश्लेषण...' : language === 'te' ? 'గుణాల & శ్లోక విశ్లేషణ...' : 'Diagnosing Gunas & Shloka...'}</span>
              </>
            ) : (
              <>
                <HeartHandshake className="w-4 h-4" />
                <span>{t.emotionAnalyzeBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results Display */}
      {analysis && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Top Diagnostics Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                {t.emotionPrimaryFeeling}
              </span>
              <p className="text-lg font-bold text-rose-300 font-serif">
                {analysis.primaryEmotion}
              </p>
              {analysis.secondaryEmotion && (
                <span className="text-xs text-slate-400 mt-1 block">
                  {language === 'hi' ? 'गौण भाव:' : language === 'te' ? 'గౌణ భావన:' : 'Secondary:'} {analysis.secondaryEmotion}
                </span>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                {t.emotionGunaState}
              </span>
              <div className="flex items-center justify-center gap-1.5">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  analysis.gunaState === 'Sattva' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  analysis.gunaState === 'Rajas' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                }`}>
                  {analysis.gunaState} {language === 'hi' ? 'गुण' : language === 'te' ? 'గుణం' : 'Mode'}
                </span>
              </div>
              <span className="text-xs text-slate-400 mt-1 block">
                {language === 'hi' ? 'तीव्रता:' : language === 'te' ? 'తీవ్రత:' : 'Intensity:'} {analysis.intensity}
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                {t.emotionMindsetShift}
              </span>
              <p className="text-xs text-amber-200 font-medium leading-snug">
                {analysis.mindsetShift}
              </p>
            </div>
          </div>

          {/* Prescribed Shloka Medicine Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Flame className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-xs text-amber-400 uppercase tracking-widest font-bold">
                    {t.emotionPrescribedShloka}
                  </span>
                  <h4 className="text-lg font-bold font-serif text-slate-100">
                    {language === 'hi' ? `श्रीमद्भगवद्गीता अध्याय ${analysis.prescribedShloka.chapter}, श्लोक ${analysis.prescribedShloka.verse}` : language === 'te' ? `శ్రీమద్భగవద్గీత అధ్యాయం ${analysis.prescribedShloka.chapter}, శ్లోకం ${analysis.prescribedShloka.verse}` : `Bhagavad Gita Chapter ${analysis.prescribedShloka.chapter}, Verse ${analysis.prescribedShloka.verse}`}
                  </h4>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-950/70 rounded-2xl border border-amber-500/20">
                <p className="font-serif text-lg text-amber-200 font-semibold mb-1 text-center sm:text-left">
                  {analysis.prescribedShloka.sanskrit}
                </p>
                <p className="text-xs text-slate-400 font-mono italic text-center sm:text-left mb-2">
                  {analysis.prescribedShloka.transliteration}
                </p>
                <p className="text-sm text-slate-200 leading-relaxed">
                  "{analysis.prescribedShloka.translation}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80">
                  <h5 className="font-bold text-amber-300 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Compass className="w-4 h-4" /> {t.emotionSpiritualRemedy}
                  </h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {analysis.spiritualRemedy}
                  </p>
                </div>

                <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80">
                  <h5 className="font-bold text-emerald-300 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> {language === 'hi' ? 'व्यावहारिक आचरण' : language === 'te' ? 'ఆచరణాత్మక కార్యాచరణ' : 'Immediate Physical Action'}
                  </h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {analysis.prescribedShloka.practicalRemedy}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Guided Breathwork Pacer */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-md">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Wind className="w-4 h-4" />
                <span>{t.emotionBreathingExercise}</span>
              </div>
              <h4 className="text-xl font-bold font-serif text-slate-100">
                {analysis.breathingExercise.name}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {analysis.breathingExercise.technique}
              </p>
              <p className="text-xs text-amber-400/90 font-medium">
                {language === 'hi' ? `सुझाया गया समय: तंत्रिका तंत्र की शांति हेतु ${analysis.breathingExercise.durationMinutes} मिनट` : language === 'te' ? `సిఫార్సు చేయబడిన సమయం: నాడీ మండల శాంతత కోసం ${analysis.breathingExercise.durationMinutes} నిమిషాలు` : `Recommended session: ${analysis.breathingExercise.durationMinutes} minutes for nervous system calm.`}
              </p>
            </div>

            {/* Visual Animated Breathing Circle */}
            <div className="flex flex-col items-center">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <div 
                  className={`absolute rounded-full border-2 border-emerald-400/50 bg-emerald-500/10 transition-all duration-1000 ${
                    breathPhase === 'Inhale' ? 'w-40 h-40 scale-110 shadow-lg shadow-emerald-500/30' :
                    breathPhase === 'Hold' ? 'w-40 h-40 scale-105 bg-emerald-500/20' :
                    breathPhase === 'Exhale' ? 'w-24 h-24 scale-90' :
                    'w-24 h-24 scale-80'
                  }`}
                />
                <div className="relative text-center z-10 select-none">
                  <span className="text-xs font-semibold uppercase tracking-widest text-emerald-300 block">
                    {getBreathPhaseLabel()}
                  </span>
                  <span className="text-3xl font-extrabold text-slate-100 font-mono">
                    {isBreathingActive ? `${breathCount}s` : '4s'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => setIsBreathingActive(!isBreathingActive)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    isBreathingActive
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                  }`}
                >
                  {isBreathingActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isBreathingActive ? t.emotionPauseBreathing : t.emotionStartBreathing}</span>
                </button>
                <button
                  onClick={() => setIsBreathingActive(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 rounded-xl"
                  title="Reset breathing pacer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
