import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Sparkles, 
  Volume2, 
  CheckCircle, 
  XCircle, 
  Award, 
  RotateCcw, 
  BookMarked,
  Flame,
  ChevronRight
} from 'lucide-react';
import { fetchDailyShloka, fetchDailyQuiz } from '../services/api.ts';
import { Shloka, DailyQuizQuestion } from '../types/gita.ts';
import { sacredAudio } from '../utils/audio.ts';
import { useLanguage } from '../context/LanguageContext.tsx';
import { getTranslation } from '../i18n/translations.ts';
import { krishnaVoice } from '../utils/speechTts.ts';

interface DailyLearningModuleProps {
  onQuizCompleted?: (score: number) => void;
  onBookmarkVerse?: (verseId: string) => void;
}

export const DailyLearningModule: React.FC<DailyLearningModuleProps> = ({ onQuizCompleted, onBookmarkVerse }) => {
  const { language } = useLanguage();
  const t = getTranslation(language);

  const [dailyShloka, setDailyShloka] = useState<Shloka | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<DailyQuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const shlokaData = await fetchDailyShloka();
        setDailyShloka(shlokaData.shloka);
        const quizData = await fetchDailyQuiz();
        setQuizQuestions(quizData);
      } catch (err) {
        console.error(err);
      }
    };
    loadContent();
  }, []);

  const getShlokaTranslation = (s: Shloka) => {
    if (language === 'hi' && s.translationHindi) return s.translationHindi;
    if (language === 'te' && s.translationTelugu) return s.translationTelugu;
    return s.translation;
  };

  const getShlokaWordMeaning = (s: Shloka) => {
    if (language === 'hi' && s.wordMeaningHindi) return s.wordMeaningHindi;
    if (language === 'te' && s.wordMeaningTelugu) return s.wordMeaningTelugu;
    return s.wordMeaning;
  };

  const getShlokaTakeaway = (s: Shloka) => {
    if (language === 'hi' && s.keyTakeawayHindi) return s.keyTakeawayHindi;
    if (language === 'te' && s.keyTakeawayTelugu) return s.keyTakeawayTelugu;
    return s.keyTakeaway;
  };

  const handleSpeakShloka = () => {
    if (!dailyShloka) return;

    if (speaking) {
      krishnaVoice.stop();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setSpeaking(false);
      return;
    }

    const targetLang = (language as 'en' | 'te' | 'hi') || 'en';
    let textToRead = '';
    
    if (targetLang === 'hi') {
      textToRead = `श्रीमद्भगवद्गीता अध्याय ${dailyShloka.chapter}, श्लोक ${dailyShloka.verse}। ${dailyShloka.sanskrit}। अनुवाद: ${getShlokaTranslation(dailyShloka)}। मुख्य सिद्धांत: ${getShlokaTakeaway(dailyShloka)}`;
    } else if (targetLang === 'te') {
      textToRead = `శ్రీమద్భగవద్గీత అధ్యాయం ${dailyShloka.chapter}, శ్లోకం ${dailyShloka.verse}। ${dailyShloka.sanskritTelugu || dailyShloka.sanskrit}। తాత్పర్యం: ${getShlokaTranslation(dailyShloka)}। ముఖ్య సూత్రం: ${getShlokaTakeaway(dailyShloka)}`;
    } else {
      textToRead = `Bhagavad Gita Chapter ${dailyShloka.chapter}, Verse ${dailyShloka.verse}. ${dailyShloka.transliteration}. Translation: ${getShlokaTranslation(dailyShloka)}. Key Principle: ${getShlokaTakeaway(dailyShloka)}`;
    }

    setSpeaking(true);
    krishnaVoice.speak(`daily-shloka-${dailyShloka.id}`, textToRead, targetLang);

    // Watch for voice completion
    const unsubscribe = krishnaVoice.subscribe((st) => {
      if (!st.isPlaying && !st.isLoading) {
        setSpeaking(false);
        unsubscribe();
      }
    });
  };

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
    sacredAudio.playJapaClick();
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    const curr = quizQuestions[currentQuestionIndex];
    if (selectedOption === curr.correctIndex) {
      setScore(prev => prev + 1);
      sacredAudio.playBell(528);
    } else {
      sacredAudio.playBell(330);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
      if (onQuizCompleted) {
        onQuizCompleted(score + (selectedOption === quizQuestions[currentQuestionIndex].correctIndex ? 1 : 0));
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  const getQuestionText = (q: DailyQuizQuestion) => {
    if (language === 'hi' && q.questionHindi) return q.questionHindi;
    if (language === 'te' && q.questionTelugu) return q.questionTelugu;
    return q.question;
  };

  const getQuestionOptions = (q: DailyQuizQuestion) => {
    if (language === 'hi' && q.optionsHindi && q.optionsHindi.length > 0) return q.optionsHindi;
    if (language === 'te' && q.optionsTelugu && q.optionsTelugu.length > 0) return q.optionsTelugu;
    return q.options;
  };

  const getQuestionExplanation = (q: DailyQuizQuestion) => {
    if (language === 'hi' && q.explanationHindi) return q.explanationHindi;
    if (language === 'te' && q.explanationTelugu) return q.explanationTelugu;
    return q.explanation;
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8 animate-fadeIn">
      
      {/* Module Banner */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            {language === 'hi' ? 'दैनिक सूक्ष्म ज्ञान' : language === 'te' ? 'దైనందిన సూక్ష్మ జ్ఞానం' : 'Daily Micro-Wisdom'}
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold font-serif text-slate-100 mt-1">
            {t.learningHeaderTitle}
          </h2>
        </div>
      </div>

      {/* 1. Shloka of the Day Hero */}
      {dailyShloka ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-xs">
                ॐ
              </span>
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  {t.learningShlokaOfDay}
                </span>
                <h3 className="text-lg font-bold font-serif text-slate-100">
                  {language === 'hi' 
                    ? `श्रीमद्भगवद्गीता अध्याय ${dailyShloka.chapter}, श्लोक ${dailyShloka.verse}` 
                    : language === 'te' 
                    ? `శ్రీమద్భగవద్గీత అధ్యాయం ${dailyShloka.chapter}, శ్లోకం ${dailyShloka.verse}` 
                    : `Bhagavad Gita Chapter ${dailyShloka.chapter}, Verse ${dailyShloka.verse}`}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeakShloka}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl transition-colors flex items-center gap-1 text-xs"
                title={speaking ? t.stopListening : t.listen}
              >
                <Volume2 className={`w-4 h-4 ${speaking ? 'animate-pulse text-amber-400' : ''}`} />
                <span className="hidden sm:inline">
                  {speaking 
                    ? (language === 'hi' ? 'पाठ जारी...' : language === 'te' ? 'పఠనం జరుగుతోంది...' : 'Chanting...') 
                    : (language === 'hi' ? 'श्लोक सुनें' : language === 'te' ? 'శ్లోకం వినండి' : 'Chant Audio')}
                </span>
              </button>

              {onBookmarkVerse && (
                <button
                  onClick={() => onBookmarkVerse(dailyShloka.id)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 rounded-xl transition-colors"
                  title={t.bookmark}
                >
                  <BookMarked className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Sanskrit Devanagari & Telugu Script & Transliteration */}
          <div className="p-5 bg-slate-950/80 rounded-2xl border border-amber-500/30 text-center space-y-2">
            <p className="font-serif text-xl sm:text-2xl text-amber-200 font-bold leading-relaxed tracking-wide">
              {dailyShloka.sanskrit}
            </p>
            {language === 'te' && dailyShloka.sanskritTelugu && (
              <p className="font-serif text-lg text-amber-300/90 leading-relaxed">
                {dailyShloka.sanskritTelugu}
              </p>
            )}
            <p className="text-xs sm:text-sm text-slate-400 font-mono italic">
              {dailyShloka.transliteration}
            </p>
          </div>

          {/* Word-by-Word Breakdown */}
          {getShlokaWordMeaning(dailyShloka) && (
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-300">
              <strong className="text-amber-400 block mb-1">
                {t.knowledgeWordMeaning}:
              </strong>
              <p className="font-mono text-slate-300 text-[11px] leading-relaxed">
                {getShlokaWordMeaning(dailyShloka)}
              </p>
            </div>
          )}

          {/* Translation */}
          <div className="text-sm text-slate-200 leading-relaxed bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20">
            <strong className="text-amber-300 block mb-1">
              {language === 'hi' ? 'अनुवाद:' : language === 'te' ? 'తాత్పర్యం:' : 'Translation:'}
            </strong>
            "{getShlokaTranslation(dailyShloka)}"
          </div>

          {/* Practical Micro-Action for Today */}
          <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-500/30 flex items-start gap-3 text-xs sm:text-sm">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-300 block mb-0.5">
                {language === 'hi' ? 'आज का पावन सूक्ष्म-आचरण:' : language === 'te' ? 'నేటి దివ్య సూక్ష్మ కార్యాచరణ:' : "Today's Sacred Micro-Action:"}
              </strong>
              <span className="text-slate-200">{getShlokaTakeaway(dailyShloka)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-900 rounded-3xl border border-slate-800 animate-pulse text-amber-300 text-sm">
          {language === 'hi' ? 'आज का पावन श्लोक लोड हो रहा है...' : language === 'te' ? 'నేటి దివ్య శ్లోకం లోడ్ అవుతోంది...' : "Loading today's divine verse..."}
        </div>
      )}

      {/* 2. Daily Gita Wisdom Quiz */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                {t.learningQuizTitle}
              </span>
              <h3 className="text-lg font-bold font-serif text-slate-100">
                {language === 'hi' ? 'धर्म एवं ज्ञान की अपनी समझ को परखें' : language === 'te' ? 'ధర్మం & జ్ఞానంపై మీ అవగాహనను పరీక్షించుకోండి' : 'Test Your Understanding of Dharma'}
              </h3>
            </div>
          </div>
          <span className="text-xs px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full font-bold">
            {language === 'hi' 
              ? `प्रश्न ${quizQuestions.length > 0 ? currentQuestionIndex + 1 : 0} / ${quizQuestions.length}`
              : language === 'te'
              ? `ప్రశ్న ${quizQuestions.length > 0 ? currentQuestionIndex + 1 : 0} / ${quizQuestions.length}`
              : `Question ${quizQuestions.length > 0 ? currentQuestionIndex + 1 : 0} of ${quizQuestions.length}`}
          </span>
        </div>

        {quizQuestions.length > 0 && !quizFinished && (
          <div className="space-y-4">
            <h4 className="text-sm sm:text-base font-semibold text-slate-100 leading-snug">
              {getQuestionText(quizQuestions[currentQuestionIndex])}
            </h4>

            {/* Options list */}
            <div className="space-y-2.5">
              {getQuestionOptions(quizQuestions[currentQuestionIndex]).map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === quizQuestions[currentQuestionIndex].correctIndex;
                let optStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
                  } else if (isSelected) {
                    optStyle = 'bg-rose-950/60 border-rose-500 text-rose-200 font-bold';
                  }
                } else if (isSelected) {
                  optStyle = 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold';
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${optStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswerSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                    {isAnswerSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation card after submit */}
            {isAnswerSubmitted && (
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-amber-500/30 text-xs sm:text-sm space-y-1.5 animate-fadeIn">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> {language === 'hi' ? 'शास्त्रीय विवेचना:' : language === 'te' ? 'శాస్త్ర వివరణ:' : 'Scriptural Explanation:'}
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {getQuestionExplanation(quizQuestions[currentQuestionIndex])}
                </p>
                <span className="text-[11px] font-mono text-amber-400/80 block mt-1">
                  {language === 'hi' ? 'श्लोक संदर्भ:' : language === 'te' ? 'శ్లోక సూచన:' : 'Reference:'} {quizQuestions[currentQuestionIndex].verseReference}
                </span>
              </div>
            )}

            {/* Quiz Control Buttons */}
            <div className="flex justify-end pt-2">
              {!isAnswerSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-amber-500/20"
                >
                  {t.learningSubmitAnswer}
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
                >
                  <span>
                    {currentQuestionIndex + 1 < quizQuestions.length 
                      ? t.learningNextQuestion 
                      : (language === 'hi' ? 'परिणाम देखें' : language === 'te' ? 'ఫలితాలు చూడండి' : 'View Results')}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Quiz Completed Screen */}
        {quizFinished && (
          <div className="p-8 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-bold font-serif text-slate-100">
              {t.learningQuizCompleted}
            </h4>
            <p className="text-sm text-slate-300">
              {language === 'hi' 
                ? `आपका प्राप्तांक: ${quizQuestions.length} में से `
                : language === 'te'
                ? `మీరు సాధించిన మార్కులు: ${quizQuestions.length} కి `
                : 'You scored '}
              <span className="font-bold text-amber-400">{score}</span>
              {language === 'en' ? ` out of ${quizQuestions.length} correct.` : ` अंक`}
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {language === 'hi'
                ? '"नियमित अध्ययन और चिंतन से निष्ठावान साधक के हृदय में ज्ञान का निरंतर प्रकाश होता है।"'
                : language === 'te'
                ? '"నిరంతర అధ్యయనం మరియు ధ్యానం ద్వారా నిజాయితీ గల సాధకుడి హృదయంలో జ్ఞాన ప్రభ ప్రకాశిస్తుంది."'
                : '"Through regular study and contemplation, wisdom steadily dawns upon the sincere seeker."'}
            </p>
            <button
              onClick={handleRestartQuiz}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.learningRestartQuiz}</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
