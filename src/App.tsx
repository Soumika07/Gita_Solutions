import React, { useState, useEffect } from 'react';
import { Minus, X, Sparkles } from 'lucide-react';
import { Header } from './components/Header.tsx';
import { OpeningPage } from './components/OpeningPage.tsx';
import { ChatbotModule } from './components/ChatbotModule.tsx';
import { KnowledgeModule } from './components/KnowledgeModule.tsx';
import { EmotionDetectionModule } from './components/EmotionDetectionModule.tsx';
import { PersonalizedGuidanceModule } from './components/PersonalizedGuidanceModule.tsx';
import { ReflectionWellnessModule } from './components/ReflectionWellnessModule.tsx';
import { DailyLearningModule } from './components/DailyLearningModule.tsx';
import { UserProgress } from './types/gita.ts';
import { sacredAudio } from './utils/audio.ts';
import { LanguageProvider, useLanguage } from './context/LanguageContext.tsx';
import { getTranslation } from './i18n/translations.ts';

function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const { language } = useLanguage();
  const t = getTranslation(language);

  // Bottom-right corner Krishna Dialogue is ALWAYS kept as a pop-up
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [initialChatPrompt, setInitialChatPrompt] = useState<string | undefined>(undefined);

  const handleOpenKrishnaDialogue = (prompt?: string) => {
    sacredAudio.playBell(528);
    setIsChatOpen(true);
    if (prompt) {
      setInitialChatPrompt(prompt);
    }
  };

  // If any link or route attempts to open full-page 'chat', redirect to home and pop open the bottom-right dialogue
  useEffect(() => {
    if (activeTab === 'chat') {
      handleOpenKrishnaDialogue();
      setActiveTab('home');
    }
  }, [activeTab]);

  // Persistent User Progress
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem('gita_user_progress');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      streakDays: 4,
      totalChats: 3,
      versesRead: 12,
      quizzesTaken: 2,
      quizAccuracy: 85,
      meditationMinutes: 15,
      japaChants: 216,
      reflectionsWritten: 3,
      bookmarkedVerses: ['gita-2-47', 'gita-6-5', 'gita-18-66'],
      unlockedBadges: []
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('gita_user_progress', JSON.stringify(progress));
    } catch {}
  }, [progress]);

  const handleToggleBookmark = (verseId: string) => {
    sacredAudio.playBell(528);
    setProgress(prev => {
      const exists = prev.bookmarkedVerses.includes(verseId);
      const updated = exists 
        ? prev.bookmarkedVerses.filter(id => id !== verseId)
        : [...prev.bookmarkedVerses, verseId];
      return {
        ...prev,
        bookmarkedVerses: updated,
        versesRead: prev.versesRead + (exists ? 0 : 1)
      };
    });
  };

  const handleMeditationCompleted = (minutes: number) => {
    setProgress(prev => ({
      ...prev,
      meditationMinutes: prev.meditationMinutes + minutes
    }));
  };

  const handleJapaRoundCompleted = () => {
    setProgress(prev => ({
      ...prev,
      japaChants: prev.japaChants + 108
    }));
  };

  const handleQuizCompleted = (_score: number) => {
    setProgress(prev => ({
      ...prev,
      quizzesTaken: prev.quizzesTaken + 1
    }));
  };

  const handleReflectionAdded = () => {
    setProgress(prev => ({
      ...prev,
      reflectionsWritten: prev.reflectionsWritten + 1
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 relative">
      
      {/* Platform Header with Sacred Audio & Multilingual Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenKrishnaDialogue={handleOpenKrishnaDialogue}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8">
        {activeTab === 'home' && (
          <OpeningPage
            onNavigate={(tab) => setActiveTab(tab)}
            onBookmarkVerse={handleToggleBookmark}
            bookmarkedVerses={progress.bookmarkedVerses}
            progress={progress}
            onOpenKrishnaDialogue={handleOpenKrishnaDialogue}
          />
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeModule
            bookmarkedVerses={progress.bookmarkedVerses}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {activeTab === 'emotion' && (
          <EmotionDetectionModule />
        )}

        {activeTab === 'guidance' && (
          <PersonalizedGuidanceModule />
        )}

        {activeTab === 'reflection' && (
          <ReflectionWellnessModule
            onMeditationCompleted={handleMeditationCompleted}
            onJapaRoundCompleted={handleJapaRoundCompleted}
            onReflectionAdded={handleReflectionAdded}
          />
        )}

        {activeTab === 'learning' && (
          <DailyLearningModule
            onQuizCompleted={handleQuizCompleted}
            onBookmarkVerse={handleToggleBookmark}
          />
        )}
      </main>

      {/* Footer with Sacred Shanti Mantra & Disclaimer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-2 text-amber-400/90 font-serif text-sm">
          <span>{t.footerMantra}</span>
        </div>
        <p className="text-[11px] text-slate-400 max-w-2xl mx-auto">
          {t.footerMantraMeaning}
        </p>
        <p className="text-[10px] text-slate-600 max-w-xl mx-auto pt-1">
          {t.footerDisclaimer}
        </p>
      </footer>

      {/* ========================================================================= */}
      {/* ALWAYS PRESENT BOTTOM-RIGHT CORNER KRISHNA DIALOGUE POP-UP & FAB */}
      {/* ========================================================================= */}
      
      {/* Floating Dialogue Pop-up Window */}
      {isChatOpen && (
        <div 
          className="fixed bottom-24 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[480px] md:w-[500px] h-[610px] max-h-[82vh] bg-slate-950/95 border border-amber-500/40 rounded-3xl shadow-2xl shadow-black/90 flex flex-col overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-200"
          role="dialog"
          aria-label="Krishna Dialogue Floating Sanctuary"
        >
          {/* Window Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-900 via-amber-950/50 to-slate-900 border-b border-amber-500/30 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-serif font-black text-sm shadow-md shadow-amber-500/30">
                ॐ
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-200 font-serif leading-tight flex items-center gap-1.5">
                  {t.chatHeaderTitle}
                  <span className="text-[9px] font-normal px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {language === 'hi' ? 'सारथी' : language === 'te' ? 'సారథి' : 'Charioteer'}
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400 truncate max-w-[240px]">
                  {t.chatHeaderSubtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  sacredAudio.playBell(432);
                  setIsChatOpen(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title={language === 'hi' ? 'न्यूनतम करें' : language === 'te' ? 'చిన్నదిగా చేయండి' : 'Minimize'}
                aria-label="Minimize"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  sacredAudio.playBell(432);
                  setIsChatOpen(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                title={t.close}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Module Body */}
          <div className="flex-1 overflow-hidden">
            <ChatbotModule
              onBookmarkVerse={handleToggleBookmark}
              className="h-full border-0 rounded-none bg-transparent shadow-none p-3 sm:p-4 max-w-none"
              initialPrompt={initialChatPrompt}
              isFloating={true}
              onClose={() => setIsChatOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Floating Trigger in Bottom-Right Corner (Always Present & Singular) */}
      <div className="fixed bottom-5 sm:bottom-6 right-4 sm:right-6 z-50">
        {/* The Round Sacred Krishna Dialogue FAB Talisman */}
        <button
          onClick={() => {
            sacredAudio.playBell(isChatOpen ? 432 : 528);
            setIsChatOpen(prev => !prev);
          }}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer group relative ${
            isChatOpen
              ? 'bg-slate-900 border-2 border-amber-400 text-amber-300 shadow-amber-500/20'
              : 'bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-slate-950 border-2 border-amber-300 shadow-amber-500/40 hover:scale-105 active:scale-95'
          }`}
          title={isChatOpen ? (language === 'hi' ? 'संवाद बंद करें' : language === 'te' ? 'సంభాషణ మూసివేయండి' : 'Close Dialogue') : (language === 'hi' ? 'श्रीकृष्ण संवाद पॉप-अप खोलें' : language === 'te' ? 'శ్రీకృష్ణ సంభాషణ పాప్-అప్ తెరవండి' : 'Open Krishna Dialogue Pop-up')}
          aria-label="Toggle Krishna Dialogue Pop-up"
        >
          {/* Glowing sacred amber aura ring when closed */}
          {!isChatOpen && (
            <span className="absolute -inset-1 rounded-full bg-amber-400/40 blur-sm animate-pulse -z-10" />
          )}

          {isChatOpen ? (
            <X className="w-6 h-6 text-amber-300 group-hover:rotate-90 transition-transform" />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-950">
              <span className="text-xl sm:text-2xl font-serif font-black select-none leading-none">
                ॐ
              </span>
              <span className="text-[8px] font-sans font-extrabold uppercase tracking-tighter -mt-0.5">
                {language === 'hi' ? 'संवाद' : language === 'te' ? 'సంభాషణ' : 'Dialogue'}
              </span>
            </div>
          )}
        </button>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
