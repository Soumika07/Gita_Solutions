import React, { useState, useEffect } from 'react';
import { 
  Search, 
  BookOpen, 
  Sparkles, 
  Tag, 
  ChevronRight, 
  Bookmark, 
  BookmarkCheck, 
  X, 
  Volume2, 
  BrainCircuit, 
  Compass, 
  Flame,
  CheckCircle2, 
  Filter,
  Globe
} from 'lucide-react';
import { GITA_CHAPTERS, NOTABLE_SHLOKAS } from '../data/gitaData.ts';
import { Chapter, Shloka } from '../types/gita.ts';
import { explainShloka, searchShlokas } from '../services/api.ts';
import { sacredAudio } from '../utils/audio.ts';
import { useLanguage } from '../context/LanguageContext.tsx';
import { getTranslation } from '../i18n/translations.ts';

interface KnowledgeModuleProps {
  bookmarkedVerses: string[];
  onToggleBookmark: (verseId: string) => void;
}

export const KnowledgeModule: React.FC<KnowledgeModuleProps> = ({ bookmarkedVerses, onToggleBookmark }) => {
  const { language } = useLanguage();
  const t = getTranslation(language);

  const [selectedYoga, setSelectedYoga] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Shloka[]>(NOTABLE_SHLOKAS);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedShloka, setSelectedShloka] = useState<Shloka | null>(null);
  
  // AI Explanation state
  const [explaining, setExplaining] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<{
    verseHeader: string;
    sanskrit: string;
    translation: string;
    modernContextExplanation: string;
    psychologicalInsight: string;
    dailyContemplationPractice: string;
  } | null>(null);
  const [userSituation, setUserSituation] = useState('');

  // Search effect
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const results = await searchShlokas(searchQuery);
          setSearchResults(results);
        } catch {
          setSearchResults(NOTABLE_SHLOKAS);
        }
      } else {
        setSearchResults(NOTABLE_SHLOKAS);
      }
    }, 250);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filteredChapters = GITA_CHAPTERS.filter(ch => {
    if (selectedYoga === 'All') return true;
    return ch.yogaType === selectedYoga;
  });

  const handleAskAiExplain = async (shloka: Shloka) => {
    setSelectedShloka(shloka);
    setExplaining(true);
    sacredAudio.playBell(528);
    try {
      const result = await explainShloka(shloka.chapter, shloka.verse, userSituation, language);
      setAiExplanation(result);
    } catch (e) {
      console.error(e);
    } finally {
      setExplaining(false);
    }
  };

  const getChapterName = (ch: Chapter) => {
    if (language === 'hi' && ch.nameHindi) return ch.nameHindi;
    if (language === 'te' && ch.nameTelugu) return ch.nameTelugu;
    return ch.nameEnglish;
  };

  const getChapterSummary = (ch: Chapter) => {
    if (language === 'hi' && ch.summaryHindi) return ch.summaryHindi;
    if (language === 'te' && ch.summaryTelugu) return ch.summaryTelugu;
    return ch.summary;
  };

  const getChapterThemes = (ch: Chapter): string[] => {
    if (language === 'hi' && ch.themesHindi && ch.themesHindi.length > 0) return ch.themesHindi;
    if (language === 'te' && ch.themesTelugu && ch.themesTelugu.length > 0) return ch.themesTelugu;
    return ch.themes;
  };

  const getShlokaTranslation = (s: Shloka) => {
    if (language === 'hi' && s.translationHindi) return s.translationHindi;
    if (language === 'te' && s.translationTelugu) return s.translationTelugu;
    return s.translation;
  };

  const getShlokaTakeaway = (s: Shloka) => {
    if (language === 'hi' && s.keyTakeawayHindi) return s.keyTakeawayHindi;
    if (language === 'te' && s.keyTakeawayTelugu) return s.keyTakeawayTelugu;
    return s.keyTakeaway;
  };

  const getShlokaWordMeaning = (s: Shloka) => {
    if (language === 'hi' && s.wordMeaningHindi) return s.wordMeaningHindi;
    if (language === 'te' && s.wordMeaningTelugu) return s.wordMeaningTelugu;
    return s.wordMeaning;
  };

  const yogaPaths = [
    { key: 'All', en: 'All Paths', hi: 'सभी योग', te: 'అన్ని మార్గాలు' },
    { key: 'Karma', en: 'Karma Yoga', hi: 'कर्म योग', te: 'కర్మ యోగం' },
    { key: 'Bhakti', en: 'Bhakti Yoga', hi: 'भक्ति योग', te: 'భక్తి యోగం' },
    { key: 'Jnana', en: 'Jnana Yoga', hi: 'ज्ञान योग', te: 'జ్ఞాన యోగం' },
    { key: 'Raja/Dhyana', en: 'Dhyana Yoga', hi: 'ध्यान योग', te: 'ధ్యాన యోగం' },
    { key: 'Universal', en: 'Universal / Cosmic', hi: 'विश्व रूप / परा ज्ञान', te: 'విశ్వరూపం / పరతత్త్వం' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8 animate-fadeIn">
      
      {/* Top Banner / Search */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4" />
            <span>{language === 'hi' ? 'श्रीमद्भगवद्गीता के १८ अध्याय एवं ७०० श्लोक' : language === 'te' ? 'శ్రీమద్భగవద్గీత 18 అధ్యాయాలు & 700 శ్లోకాలు' : 'The Sacred 700 Verses & 18 Chapters'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 font-serif leading-tight">
            {t.knowledgeHeaderTitle}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            {t.knowledgeHeaderSubtitle}
          </p>

          {/* Search Box */}
          <div className="mt-6 flex items-center bg-slate-950/90 border border-amber-500/40 focus-within:border-amber-400 rounded-2xl p-1.5 shadow-lg transition-all">
            <Search className="w-5 h-5 text-amber-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'hi' ? 'संस्कृत शब्द, भावार्थ, विषय या अध्याय (उदा. कर्म, क्रोध, शांति, 2.47) खोजें...' : language === 'te' ? 'శ్లోకం, కీవర్డ్ లేదా అధ్యాయం (ఉదా: కర్మ, క్రోధం, శాంతి, 2.47) వెతకండి...' : "Search by Sanskrit word, keyword, theme (e.g. 'karma', 'anger', 'peace', '2.47')..."}
              className="w-full bg-transparent px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-1.5 text-slate-400 hover:text-white mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Yoga Path Filter */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" /> {t.knowledgeFilterYoga}:
          </span>
          {yogaPaths.map(item => (
            <button
              key={item.key}
              onClick={() => setSelectedYoga(item.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedYoga === item.key
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {language === 'hi' ? item.hi : language === 'te' ? item.te : item.en}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400">
          {language === 'hi' 
            ? `${filteredChapters.length} अध्याय • ${searchResults.length} प्रमुख श्लोक`
            : language === 'te'
            ? `${filteredChapters.length} అధ్యాయాలు • ${searchResults.length} ప్రముఖ శ్లోకాలు`
            : `Showing ${filteredChapters.length} Chapters • ${searchResults.length} Highlighted Verses`}
        </span>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredChapters.map((ch) => (
          <div
            key={ch.number}
            onClick={() => {
              sacredAudio.playBell(380 + ch.number * 10);
              setSelectedChapter(ch);
            }}
            className="group relative bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-xs">
                  {ch.number}
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {ch.yogaType} Yoga
                </span>
              </div>

              <div className="mt-3">
                <h3 className="font-serif text-lg font-bold text-amber-200 group-hover:text-amber-300 transition-colors">
                  {ch.nameSanskrit}
                </h3>
                <p className="text-xs text-slate-400 font-mono tracking-wide">
                  {ch.nameTransliteration}
                </p>
                <h4 className="text-sm font-semibold text-slate-200 mt-1">
                  {getChapterName(ch)}
                </h4>
              </div>

              <p className="mt-3 text-xs text-slate-400 line-clamp-3 leading-relaxed">
                {getChapterSummary(ch)}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>{ch.versesCount} {language === 'hi' ? 'श्लोक' : language === 'te' ? 'శ్లోకాలు' : 'Verses'}</span>
              <span className="text-amber-400 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                {language === 'hi' ? 'अध्याय पढ़ें' : language === 'te' ? 'అధ్యాయం చదవండి' : 'Read Chapter'} <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Shlokas Section */}
      <div className="mt-12 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-xl font-bold text-slate-100 font-serif flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            {language === 'hi' ? 'चुनिंदा मार्गदर्शक श्लोक' : language === 'te' ? 'ముఖ్యమైన దివ్య శ్లోకాలు' : 'Curated Landmark Verses'}
          </h3>
          <span className="text-xs text-slate-400">
            {language === 'hi' 
              ? 'श्लोक पर क्लिक करके आधुनिक जीवन में इसका व्यावहारिक अर्थ प्राप्त करें' 
              : language === 'te' 
              ? 'ప్రతి శ్లోకంపై క్లిక్ చేసి సమకాలీన జీవితానికి మార్గదర్శకత్వాన్ని పొందండి' 
              : 'Click any verse to generate an AI contextual life explanation'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {searchResults.map((shloka) => {
            const isBookmarked = bookmarkedVerses.includes(shloka.id);
            return (
              <div
                key={shloka.id}
                className="bg-slate-900/90 border border-amber-500/20 hover:border-amber-500/50 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                      {language === 'hi' ? `अध्याय ${shloka.chapter}, श्लोक ${shloka.verse}` : language === 'te' ? `అధ్యాయం ${shloka.chapter}, శ్లోకం ${shloka.verse}` : `Chapter ${shloka.chapter}, Verse ${shloka.verse}`}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                        {shloka.theme}
                      </span>
                      <button
                        onClick={() => onToggleBookmark(shloka.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isBookmarked ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title={isBookmarked ? t.bookmarked : t.bookmark}
                      >
                        {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Sanskrit & Telugu Script if active */}
                  <p className="font-serif text-base text-amber-200/90 leading-relaxed font-semibold">
                    {shloka.sanskrit}
                  </p>
                  {language === 'te' && shloka.sanskritTelugu && (
                    <p className="font-serif text-sm text-amber-300/80 leading-relaxed mt-1">
                      {shloka.sanskritTelugu}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 font-mono mt-1 mb-3 italic">
                    {shloka.transliteration}
                  </p>

                  {/* Translation */}
                  <p className="text-sm text-slate-200 leading-relaxed">
                    "{getShlokaTranslation(shloka)}"
                  </p>

                  {/* Word Meaning if available */}
                  {getShlokaWordMeaning(shloka) && (
                    <div className="mt-2 text-[11px] text-slate-400 font-mono bg-slate-950/40 p-2 rounded-lg border border-slate-800/80">
                      <span className="text-amber-400 font-semibold">{t.knowledgeWordMeaning}: </span>
                      {getShlokaWordMeaning(shloka)}
                    </div>
                  )}

                  {/* Key Insight snippet */}
                  <div className="mt-3 p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <strong className="text-amber-400/90 block mb-1">{t.knowledgeKeyTakeaway}:</strong>
                    {getShlokaTakeaway(shloka)}
                  </div>
                </div>

                {/* AI Explain Button */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-end">
                  <button
                    onClick={() => handleAskAiExplain(shloka)}
                    className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-xs font-bold rounded-xl border border-amber-500/30 transition-all flex items-center gap-1.5"
                  >
                    <BrainCircuit className="w-3.5 h-3.5" />
                    <span>{t.knowledgeAskAiExplain}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chapter Detail Modal */}
      {selectedChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100 max-h-[85vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs text-amber-400 font-bold tracking-widest uppercase">
                  {language === 'hi' 
                    ? `अध्याय ${selectedChapter.number} • ${selectedChapter.yogaType} योग` 
                    : language === 'te' 
                    ? `అధ్యాయం ${selectedChapter.number} • ${selectedChapter.yogaType} యోగం` 
                    : `Chapter ${selectedChapter.number} • ${selectedChapter.yogaType} Yoga`}
                </span>
                <h3 className="text-2xl font-bold font-serif text-amber-200 mt-1">
                  {selectedChapter.nameSanskrit} ({selectedChapter.nameTransliteration})
                </h3>
                <h4 className="text-base text-slate-300 font-medium">
                  {getChapterName(selectedChapter)}
                </h4>
              </div>
              <button
                onClick={() => setSelectedChapter(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm leading-relaxed">
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                <h5 className="font-semibold text-amber-300 mb-1">
                  {language === 'hi' ? 'अध्याय का सार' : language === 'te' ? 'అధ్యాయ సారాంశం' : 'Chapter Essence'}
                </h5>
                <p className="text-slate-300">{getChapterSummary(selectedChapter)}</p>
              </div>

              <div>
                <h5 className="font-semibold text-slate-200 mb-2">
                  {language === 'hi' ? 'प्रमुख दार्शनिक सूत्र:' : language === 'te' ? 'ప్రధాన తాత్విక అంశాలు:' : 'Core Philosophical Themes:'}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {getChapterThemes(selectedChapter).map((theme, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {theme}
                    </span>
                  ))}
                </div>
              </div>

              {/* Verses from this chapter */}
              <div className="mt-4">
                <h5 className="font-semibold text-slate-200 mb-2">
                  {language === 'hi' ? 'इस अध्याय के प्रमुख श्लोक:' : language === 'te' ? 'ఈ అధ్యాయంలోని ముఖ్య శ్లోకాలు:' : 'Key Landmark Verses in this Chapter:'}
                </h5>
                {NOTABLE_SHLOKAS.filter(s => s.chapter === selectedChapter.number).length === 0 ? (
                  <p className="text-xs text-slate-500 italic">
                    {language === 'hi' ? 'दैनिक अध्ययन मॉड्यूल में अन्य श्लोकों का अनुशीलन करें।' : language === 'te' ? 'రోజువారీ సాధనలో మరిన్ని శ్లోకాలను అధ్యయనం చేయండి.' : 'Explore full verse chanting in the daily learning module.'}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {NOTABLE_SHLOKAS.filter(s => s.chapter === selectedChapter.number).map(sh => (
                      <div key={sh.id} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
                        <div className="flex justify-between items-center text-xs text-amber-400 font-bold mb-1">
                          <span>{language === 'hi' ? `श्लोक ${selectedChapter.number}.${sh.verse}` : language === 'te' ? `శ్లోకం ${selectedChapter.number}.${sh.verse}` : `Verse ${selectedChapter.number}.${sh.verse}`}</span>
                          <button
                            onClick={() => {
                              setSelectedChapter(null);
                              handleAskAiExplain(sh);
                            }}
                            className="text-xs text-amber-300 hover:underline flex items-center gap-1"
                          >
                            <BrainCircuit className="w-3 h-3" /> {t.knowledgeAskAiExplain}
                          </button>
                        </div>
                        <p className="text-xs text-slate-300 font-serif">{sh.sanskrit}</p>
                        {language === 'te' && sh.sanskritTelugu && (
                          <p className="text-xs text-amber-200/80 font-serif mt-0.5">{sh.sanskritTelugu}</p>
                        )}
                        <p className="text-xs text-slate-400 mt-1">"{getShlokaTranslation(sh)}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedChapter(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Shloka Explainer Modal */}
      {selectedShloka && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/50 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100 max-h-[85vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs text-amber-400 font-bold tracking-wider uppercase flex items-center gap-1">
                  <BrainCircuit className="w-4 h-4" /> {t.knowledgeVerseExplainerTitle}
                </span>
                <h3 className="text-xl font-bold font-serif text-slate-100 mt-1">
                  {language === 'hi' ? `श्रीमद्भगवद्गीता अध्याय ${selectedShloka.chapter}, श्लोक ${selectedShloka.verse}` : language === 'te' ? `శ్రీమద్భగవద్గీత అధ్యాయం ${selectedShloka.chapter}, శ్లోకం ${selectedShloka.verse}` : `Bhagavad Gita ${selectedShloka.chapter}.${selectedShloka.verse}`}
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedShloka(null);
                  setAiExplanation(null);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Verse Sanskrit & Translation */}
            <div className="my-4 p-4 bg-slate-950/70 rounded-2xl border border-amber-500/30">
              <p className="font-serif text-base text-amber-200 font-semibold mb-1">
                {selectedShloka.sanskrit}
              </p>
              {language === 'te' && selectedShloka.sanskritTelugu && (
                <p className="font-serif text-sm text-amber-300/80 mb-1">
                  {selectedShloka.sanskritTelugu}
                </p>
              )}
              <p className="text-xs text-slate-400 font-mono italic mb-2">
                {selectedShloka.transliteration}
              </p>
              <p className="text-xs text-slate-200">
                "{getShlokaTranslation(selectedShloka)}"
              </p>
            </div>

            {/* Custom Situation Prompt */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.knowledgeContextPrompt}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userSituation}
                  onChange={(e) => setUserSituation(e.target.value)}
                  placeholder={t.knowledgeContextPlaceholder}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={() => handleAskAiExplain(selectedShloka)}
                  disabled={explaining}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl disabled:opacity-50"
                >
                  {explaining ? t.loading : (language === 'hi' ? 'पुनः विश्लेषण' : language === 'te' ? 'పునః పరిశీలన' : 'Re-Analyze')}
                </button>
              </div>
            </div>

            {/* AI Generated Output */}
            {explaining && (
              <div className="p-8 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                <p className="text-sm text-amber-300 font-serif">
                  {t.knowledgeGeneratingAnalysis}
                </p>
              </div>
            )}

            {aiExplanation && !explaining && (
              <div className="space-y-4 text-xs sm:text-sm animate-fadeIn">
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                  <h5 className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                    <Compass className="w-4 h-4" /> {language === 'hi' ? 'आधुनिक जीवन में अनुप्रयोग' : language === 'te' ? 'ఆధునిక జీవన అనువర్తనం' : 'Modern Life Application'}
                  </h5>
                  <p className="text-slate-200 leading-relaxed">
                    {aiExplanation.modernContextExplanation}
                  </p>
                </div>

                <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl">
                  <h5 className="font-bold text-indigo-300 mb-1 flex items-center gap-1.5">
                    <BrainCircuit className="w-4 h-4" /> {language === 'hi' ? 'मनोवैज्ञानिक एवं तंत्रिका-वैज्ञानिक दृष्टिकोण' : language === 'te' ? 'మానసిక & నాడీ సంబంధ దృక్పథం' : 'Psychological & Neuroscience Insight'}
                  </h5>
                  <p className="text-slate-300 leading-relaxed">
                    {aiExplanation.psychologicalInsight}
                  </p>
                </div>

                <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl">
                  <h5 className="font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> {language === 'hi' ? '२-मिनट ध्यान व आत्म-चिंतन अभ्यास' : language === 'te' ? '2-నిమిషాల ధ్యాన & ఆత్మ పరిశీలన అభ్యాసం' : '2-Minute Contemplation Practice'}
                  </h5>
                  <p className="text-slate-300 leading-relaxed">
                    {aiExplanation.dailyContemplationPractice}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  setSelectedShloka(null);
                  setAiExplanation(null);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
