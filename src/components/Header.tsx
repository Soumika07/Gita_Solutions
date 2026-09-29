import React, { useState } from 'react';
import { 
  BookOpen, 
  HeartHandshake, 
  Compass, 
  Flame, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Layers,
  Globe
} from 'lucide-react';
import { sacredAudio } from '../utils/audio.ts';
import { useLanguage, SUPPORTED_LANGUAGES, SupportedLanguage } from '../context/LanguageContext.tsx';
import { getTranslation } from '../i18n/translations.ts';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenEmergency?: () => void;
  onOpenKrishnaDialogue?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenKrishnaDialogue 
}) => {
  const [isOmOn, setIsOmOn] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { language, setLanguage, currentLangInfo } = useLanguage();
  const t = getTranslation(language);

  const handleToggleOm = () => {
    const playing = sacredAudio.toggleOmDrone();
    setIsOmOn(playing);
    if (playing) {
      sacredAudio.playBell(528); // Miraculous tone bell
    }
  };

  const handleLanguageSelect = (langCode: SupportedLanguage) => {
    sacredAudio.playBell(432);
    setLanguage(langCode);
    setIsLangMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: t.navSanctuary, icon: Sparkles },
    { id: 'knowledge', label: t.navExplorer, icon: BookOpen },
    { id: 'emotion', label: t.navEmotions, icon: HeartHandshake },
    { id: 'guidance', label: t.navGuidance, icon: Compass },
    { id: 'reflection', label: t.navWellness, icon: Flame },
    { id: 'learning', label: t.navLearning, icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-2xl border-b border-amber-500/20 text-slate-100 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Platform Name with click to Opening Page */}
          <div 
            onClick={() => {
              sacredAudio.playBell(432);
              setActiveTab('home');
            }}
            className="flex items-center gap-3.5 cursor-pointer group"
            title="Return to Sacred Sanctuary"
          >
            <div 
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/25 border border-amber-300/60 transform group-hover:scale-105 transition-all duration-300 shrink-0"
            >
              <span className="text-xl sm:text-2xl font-serif text-slate-950 font-black select-none">ॐ</span>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-gold-gradient font-cinzel group-hover:brightness-110 transition-all">
                  {t.platformTitle}
                </h1>
                <span className="text-[10px] font-medium tracking-widest uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 hidden xs:inline-block">
                  {t.platformSubtitle}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans hidden md:block max-w-sm truncate tracking-wide">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Quick Action Controls: Language Switcher, Om Drone */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-amber-500/30 text-amber-200 text-xs font-medium transition-all shadow-sm cursor-pointer hover:border-amber-400/70"
                title="Select Language / भाषा चुनें / భాషను ఎంచుకోండి"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold">{currentLangInfo.nativeName}</span>
                <span className="text-[10px] opacity-60 hidden sm:inline">▼</span>
              </button>

              {isLangMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsLangMenuOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900/95 border border-amber-500/40 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xl">
                    <div className="px-3 py-1.5 text-[10px] font-semibold text-amber-400/80 uppercase tracking-widest border-b border-slate-800 mb-1">
                      Choose Language
                    </div>
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => handleLanguageSelect(l.code)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                          language === l.code 
                            ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40' 
                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{l.flag}</span>
                          <span className="font-medium">{l.nativeName}</span>
                        </span>
                        {language === l.code && (
                          <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Om Drone Toggle */}
            <button
              onClick={handleToggleOm}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                isOmOn 
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/20 animate-pulse' 
                  : 'bg-slate-900/90 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:border-slate-600'
              }`}
              title="Toggle sacred Om 136.1Hz drone soundscape"
            >
              {isOmOn ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isOmOn ? t.omPlaying : t.ambientOm}</span>
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-900/80">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sacredAudio.playBell(432 + idx * 20);
                  setActiveTab(item.id);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/30 scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-slate-950' : 'text-amber-400/80'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
