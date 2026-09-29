import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  BookOpen, 
  HeartHandshake, 
  Compass, 
  Flame, 
  Sparkles, 
  Volume2, 
  Bookmark, 
  BookmarkCheck, 
  ArrowRight, 
  Sun, 
  Play, 
  Square,
  Clock,
  Feather
} from 'lucide-react';
import { NOTABLE_SHLOKAS } from '../data/gitaData.ts';
import { sacredAudio } from '../utils/audio.ts';
import { UserProgress } from '../types/gita.ts';
import { useLanguage } from '../context/LanguageContext.tsx';
import { getTranslation } from '../i18n/translations.ts';

interface OpeningPageProps {
  onNavigate: (tabId: string) => void;
  onBookmarkVerse: (verseId: string) => void;
  bookmarkedVerses: string[];
  progress?: UserProgress;
  onOpenKrishnaDialogue: (prompt?: string) => void;
}

export const OpeningPage: React.FC<OpeningPageProps> = ({
  onNavigate,
  onBookmarkVerse,
  bookmarkedVerses,
  onOpenKrishnaDialogue
}) => {
  const [selectedEmotionId, setSelectedEmotionId] = useState<string>('anxiety');
  const [quickBreathSeconds, setQuickBreathSeconds] = useState<number | null>(null);
  const [showTeluguScript, setShowTeluguScript] = useState<boolean>(false);

  const { language } = useLanguage();
  const t = getTranslation(language);

  // Clean up any ongoing chant on unmount
  useEffect(() => {
    return () => {
      sacredAudio.stopHareRamChant();
    };
  }, []);

  // Daily verse spotlight (BG 2.47 - Karma Yoga cornerstone)
  const spotlightShloka = NOTABLE_SHLOKAS[0];
  const isSpotlightBookmarked = bookmarkedVerses.includes(spotlightShloka.id);

  const spotlightTranslation = language === 'hi' ? (spotlightShloka.translationHindi || spotlightShloka.translation) :
                               language === 'te' ? (spotlightShloka.translationTelugu || spotlightShloka.translation) :
                               spotlightShloka.translation;

  const spotlightTakeaway = language === 'hi' ? (spotlightShloka.keyTakeawayHindi || spotlightShloka.keyTakeaway) :
                            language === 'te' ? (spotlightShloka.keyTakeawayTelugu || spotlightShloka.keyTakeaway) :
                            spotlightShloka.keyTakeaway;

  const spotlightTheme = language === 'hi' ? (spotlightShloka.themeHindi || spotlightShloka.theme) :
                         language === 'te' ? (spotlightShloka.themeTelugu || spotlightShloka.theme) :
                         spotlightShloka.theme;

  const handleRingBell = (freq: number = 432) => {
    sacredAudio.playBell(freq);
  };

  const startQuickBreath = () => {
    sacredAudio.playBell(432);
    sacredAudio.startHareRamChant(0.9);
    setQuickBreathSeconds(60);
    const interval = setInterval(() => {
      setQuickBreathSeconds(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          sacredAudio.stopHareRamChant();
          sacredAudio.playBell(528);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopQuickBreath = () => {
    setQuickBreathSeconds(null);
    sacredAudio.stopHareRamChant();
  };

  // Quick emotional triage definitions (Multilingual)
  const emotionQuickChecks = [
    {
      id: 'anxiety',
      label: language === 'hi' ? 'चिंता एवं अति-विचार' : language === 'te' ? 'ఆందోళన & అతి ఆలోచన' : 'Anxiety & Overthinking',
      sanskritKicker: language === 'hi' ? 'विषाद एवं चंचलता' : language === 'te' ? 'విషాదం & చంచలత్వం' : 'Vishada & Chanchalata',
      shlokaRef: 'BG 2.47',
      remedyTitle: language === 'hi' ? 'कर्म पर ध्यान, फल की चिंता से मुक्ति' : language === 'te' ? 'కర్తవ్యంపై దృష్టి, ఫలిత విముక్తి' : 'Focus on Action, Release the Outcome',
      quote: language === 'hi' ? 'तुम्हारा केवल कर्तव्य-कर्म करने पर अधिकार है, उसके फलों पर कभी नहीं। कल की चिंता में आज के कर्तव्य को मत रोको।' : language === 'te' ? 'నీ కర్తవ్య కర్మను చేయడంలోనే నీకు అధికారం ఉంది, ఫలితాలపై కాదు. రేపటి భయంతో నేటి ధర్మాన్ని వీడకు.' : 'You have a right to your sacred effort, but never to the fruits. Do not let anxiety over tomorrow paralyze your duty today.',
      verseId: 'gita-2-47'
    },
    {
      id: 'anger',
      label: language === 'hi' ? 'क्रोध एवं हताशा' : language === 'te' ? 'కోపం & తీవ్ర అసహనం' : 'Anger & Frustration',
      sanskritKicker: language === 'hi' ? 'क्रोध' : language === 'te' ? 'క్రోధం' : 'Krodha',
      shlokaRef: 'BG 2.62-63',
      remedyTitle: language === 'hi' ? 'क्रोध को अतृप्त कामना में पहचानें' : language === 'te' ? 'తీరని కోరికే కోపానికి కారణం' : 'Trace Wrath Back to Unmet Attachment',
      quote: language === 'hi' ? 'आसक्ति से कामना और कामना में विघ्न से क्रोध उत्पन्न होता है। इच्छाओं को शांत कर विवेक को पुनः जाग्रत करें।' : language === 'te' ? 'వ్యామోహం నుండి కోరిక, తీరని కోరిక నుండి క్రోధం పుడతాయి. కోరికలను నియంత్రించి వివేకాన్ని మేల్కొల్పండి.' : 'From attachment arises desire; from thwarted desire, anger is born. Stilling desire restores intellectual discernment.',
      verseId: 'gita-2-62'
    },
    {
      id: 'grief',
      label: language === 'hi' ? 'शोक एवं हृदय की पीड़ा' : language === 'te' ? 'దుఃఖం & హృదయ వేదన' : 'Grief & Heartache',
      sanskritKicker: language === 'hi' ? 'शोक एवं तितिक्षा' : language === 'te' ? 'శోకం & తితిక్ష' : 'Shoka',
      shlokaRef: 'BG 2.14',
      remedyTitle: language === 'hi' ? 'तितिक्षा — समत्व भाव से सहनशीलता' : language === 'te' ? 'తితిక్ష — సమబుద్ధితో కూడిన ఓర్పు' : 'Titiksha — Endurance with Equanimity',
      quote: language === 'hi' ? 'सुख-दुःख, लाभ-हानि आने-जाने वाले अनित्य मौसम हैं। तुम्हारे भीतर का अविनाशी आत्मा सदैव अछूता रहता है।' : language === 'te' ? 'సుఖదుఃఖాలు, జయాపజయాలు వచ్చిపోయే కాలాలు. మీ అంతరంగంలోని శాశ్వతమైన ఆత్మ ఎన్నడూ నశించదు.' : 'Pleasure and pain, gain and loss are transient seasons. The indestructible soul within remains untainted by earthly sorrow.',
      verseId: 'gita-2-14'
    },
    {
      id: 'confusion',
      label: language === 'hi' ? 'अनिर्णय एवं धर्म संकट' : language === 'te' ? 'సందిగ్ధత & ధర్మ సంకటం' : 'Indecision & Life Crossroads',
      sanskritKicker: language === 'hi' ? 'मोह एवं धर्म संकट' : language === 'te' ? 'మోహం & స్వధర్మం' : 'Moha & Dharma Sankata',
      shlokaRef: 'BG 3.35',
      remedyTitle: language === 'hi' ? 'अपने वास्तविक स्वधर्म को पहचानें' : language === 'te' ? 'మీ నిజమైన స్వధర్మాన్ని ఎంచుకోండి' : 'Align with Your Authentic Calling (Swadharma)',
      quote: language === 'hi' ? 'दूसरों के जीवन की नकल करने से त्रुटिपूर्ण होने पर भी अपना स्वाभाविक स्वधर्म कहीं श्रेष्ठ है।' : language === 'te' ? 'ఇతరుల జీవితాన్ని అనుకరించడం కంటే లోపభూయిష్టమైనా సరే తన స్వధర్మాన్ని ఆచరించడమే శ్రేయస్కరం.' : 'Better is one’s own duty performed imperfectly than living someone else’s copied life. Act with pure conscience.',
      verseId: 'gita-3-35'
    },
    {
      id: 'peace',
      label: language === 'hi' ? 'मानसिक शांति व एकाग्रता' : language === 'te' ? 'ప్రశాంతత & ఏకాగ్రత' : 'Craving Stillness & Focus',
      sanskritKicker: language === 'hi' ? 'प्रशांत मानस' : language === 'te' ? 'ప్రశాంత చిత్తం' : 'Prashanta Manasa',
      shlokaRef: 'BG 6.5',
      remedyTitle: language === 'hi' ? 'मन को अपना सर्वश्रेष्ठ मित्र बनाएं' : language === 'te' ? 'మనస్సును మీ గొప్ప మిత్రుడిగా చేసుకోండి' : 'Make Your Mind Your Greatest Ally',
      quote: language === 'hi' ? 'अपने मन के द्वारा अपना उद्धार करो; अनुशासित मन ही आत्मा का सबसे सच्चा मित्र है।' : language === 'te' ? 'మనస్సు ద్వారా మిమ్మల్ని మీరు ఉన్నతంగా తీర్చిదిద్దుకోండి; సాధన చేసిన మనస్సే పరమ మిత్రుడు.' : 'Elevate yourself through the power of your own steady mind; the trained mind is the greatest friend of the self.',
      verseId: 'gita-6-5'
    }
  ];

  const activeEmotion = emotionQuickChecks.find(e => e.id === selectedEmotionId) || emotionQuickChecks[0];

  // 4 Core Yogas (Multilingual)
  const yogas = [
    {
      name: language === 'hi' ? 'कर्म योग' : language === 'te' ? 'కర్మ యోగం' : 'Karma Yoga',
      sanskrit: 'कर्मयोग',
      subtitle: language === 'hi' ? 'निःस्वार्थ सेवा का मार्ग' : language === 'te' ? 'నిష్కామ కర్మ మార్గం' : 'The Path of Selfless Action',
      teaching: language === 'hi' ? 'फल की आसक्ति छोड़कर कुशलता और समर्पण से किया गया कर्म ही सर्वोच्च पूजा है।' : language === 'te' ? 'ఫలాపేక్ష లేకుండా భగవదర్పణ బుద్ధితో కర్తవ్యాన్ని నిర్వర్తించడమే కర్మయోగం.' : 'Work done with devotion and excellence, surrendering attachment to the fruits. Transforms every daily action into sacred worship.',
      keyVerse: 'BG 2.47 · Chapter 3'
    },
    {
      name: language === 'hi' ? 'भक्ति योग' : language === 'te' ? 'భక్తి యోగం' : 'Bhakti Yoga',
      sanskrit: 'भक्तियोग',
      subtitle: language === 'hi' ? 'परम प्रेम व शरणागति का मार्ग' : language === 'te' ? 'ప్రేమపూర్వక శరణాగతి మార్గం' : 'The Path of Loving Devotion',
      teaching: language === 'hi' ? 'अहंकार को प्रभु चरणों में समर्पित कर सर्वत्र भगवद्दर्शन करना और करुणा का विस्तार करना।' : language === 'te' ? 'అహంకారాన్ని దైవానికి సమర్పించి, సకల ప్రాణులలోనూ భగవంతుని దర్శించే ప్రేమ మార్గం.' : 'Surrendering the ego in tender love and trust to the Divine presence. Cultivates boundless compassion and universal oneness.',
      keyVerse: 'BG 9.26 · Chapter 12'
    },
    {
      name: language === 'hi' ? 'ज्ञान योग' : language === 'te' ? 'జ్ఞాన యోగం' : 'Jnana Yoga',
      sanskrit: 'ज्ञानयोग',
      subtitle: language === 'hi' ? 'विवेक व आत्म-बोध का मार्ग' : language === 'te' ? 'ఆత్మ విచారణ & వివేక మార్గం' : 'The Path of Discerning Wisdom',
      teaching: language === 'hi' ? 'नश्वर देह और अविनाशी साक्षी आत्मा के भेद को जानकर मुक्ति प्राप्त करना।' : language === 'te' ? 'నశించే భౌతిక శరీరానికి, శాశ్వతమైన ఆత్మ చైతన్యానికి గల భేదాన్ని గ్రహించే వివేక మార్గం.' : 'Dissecting reality through contemplation: discerning the eternal conscious soul (Atman) from the transient mortal body.',
      keyVerse: 'BG 2.20 · Chapter 4 & 13'
    },
    {
      name: language === 'hi' ? 'ध्यान योग (राज योग)' : language === 'te' ? 'ధ్యాన యోగం (రాజ యోగం)' : 'Raja / Dhyana Yoga',
      sanskrit: 'ध्यानयोग',
      subtitle: language === 'hi' ? 'चित्त-वृत्ति निरोध का मार्ग' : language === 'te' ? 'మనోనిగ్రహ ధ్యాన మార్గం' : 'The Path of Meditation',
      teaching: language === 'hi' ? 'प्राणायाम, आसन और मौन साधना द्वारा चंचल मन को शांत कर आत्म-लीन होना।' : language === 'te' ? 'ప్రాణాయామం, సమతుల్య జీవనం మరియు నిశ్శబ్ద ధ్యానం ద్వారా చంచల మనస్సును వశపరుచుకోవడం.' : 'Mastering the restless currents of the mind through pranayama, balanced posture, and silent meditative absorption.',
      keyVerse: 'BG 6.5 · Chapter 6'
    }
  ];

  // Quick inquiry prompts for Sri Krishna
  const quickQueryStarters = [
    {
      label: language === 'hi' ? 'असफलता का भय' : language === 'te' ? 'వైఫల్య భయం & కార్యాచరణ' : 'Fear of Failure & Action',
      prompt: language === 'hi' ? 'हे श्रीकृष्ण, मैं असफलता के भय से स्तब्ध हूँ। निर्भय होकर कर्म कैसे करूँ?' : language === 'te' ? 'శ్రీకృష్ణా, వైఫల్య భయం నన్ను అడ్డుకుంటోంది. నిర్భయంగా కర్తవ్యాన్ని ఎలా ఆచరించాలి?' : 'I am paralyzed by fear of failure. How do I act fearlessly?'
    },
    {
      label: language === 'hi' ? 'कार्य-तनाव व अनासक्ति' : language === 'te' ? 'పని ఒత్తిడి & నిష్కామ కర్మ' : 'Burnout & Detachment',
      prompt: language === 'hi' ? 'कड़ी मेहनत करते हुए भी परिणामों की चिंता से बर्नआउट से कैसे बचें?' : language === 'te' ? 'ఫలితాల ఆందోళనతో అలసిపోకుండా నిరంతరం ఉత్సాహంగా ఎలా శ్రమించాలి?' : 'How can I work hard without getting burned out by results?'
    },
    {
      label: language === 'hi' ? 'विश्वासघात व धर्म' : language === 'te' ? 'విశ్వాసఘాతుకం & ధర్మ ప్రవర్తన' : 'Betrayal & Right Conduct',
      prompt: language === 'hi' ? 'किसी निकट व्यक्ति ने मेरा विश्वास तोड़ा है। मैं धर्मसम्मत आचरण कैसे करूँ?' : language === 'te' ? 'సన్నిహితులు చేసిన నమ్మకద్రోహాన్ని ధర్మబద్ధంగా ఎలా ఎదుర్కోవాలి?' : 'Someone close to me betrayed my trust. How do I respond with Dharma?'
    },
    {
      label: language === 'hi' ? 'चंचल मन पर विजय' : language === 'te' ? 'చంచల మనో నిగ్రహం' : 'Restless Mind Mastery',
      prompt: language === 'hi' ? 'मेरा मन निरंतर अशांत और विचलित रहता है। इसे वश में करने का मार्ग बताएं।' : language === 'te' ? 'నా మనస్సు నిరంతరం చంచలంగా, ఆందోళనగా ఉంటోంది. దానిని ప్రశాంతం చేసుకోవడం ఎలా?' : 'My mind is constantly distracted and anxious. How do I tame it?'
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. CINEMATIC PROSCENIUM HERO */}
      {/* ------------------------------------------------------------- */}
      <section className="relative overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 p-8 sm:p-12 lg:p-16 shadow-2xl shadow-amber-500/5">
        
        {/* Subtle celestial illumination */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 w-96 h-96 bg-yellow-600/5 rounded-full blur-[90px]" />
        
        {/* Sacred Geometric Mandala Vector Background */}
        <svg 
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] opacity-[0.035] text-amber-200"
          viewBox="0 0 200 200" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.5"
        >
          <circle cx="100" cy="100" r="90" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="70" />
          <circle cx="100" cy="100" r="50" strokeDasharray="4 2" />
          <circle cx="100" cy="100" r="30" />
          <polygon points="100,10 120,80 190,100 120,120 100,190 80,120 10,100 80,80" />
          <polygon points="100,30 115,85 170,100 115,115 100,170 85,115 30,100 85,85" />
        </svg>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-7">
          
          {/* Sacred Sanskrit Invocation with Bell Strike */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs sm:text-sm font-serif shadow-sm">
            <span 
              onClick={() => handleRingBell(432)}
              className="cursor-pointer hover:scale-110 transition-transform font-bold text-amber-400"
              title="Click to strike sacred temple bell (432Hz)"
            >
              ॐ
            </span>
            <span>ॐ नमो भगवते वासुदेवाय · {t.homeHeroKicker}</span>
          </div>

          {/* Majestic Title & Poetic Presence */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-cinzel leading-tight text-balance">
              {t.homeHeroTitle}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
              {t.homeHeroSubtitle}
            </p>
          </div>

          {/* Primary Action Controls (Distinct & Singular) */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 pt-2">
            <button
              onClick={() => {
                handleRingBell(528);
                onOpenKrishnaDialogue();
              }}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-bold text-sm sm:text-base shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
            >
              <MessageSquare className="w-5 h-5 text-slate-950" />
              <span>{t.homeStartKrishnaDialogue}</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                handleRingBell(432);
                onNavigate('knowledge');
              }}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 text-slate-200 hover:text-white font-semibold text-sm sm:text-base border border-slate-700/80 hover:border-amber-500/40 transition-all cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>{t.homeExploreVerses}</span>
            </button>
          </div>

          {/* Clean Unboxed Metadata Strip */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 font-sans">
            <span>18 {language === 'hi' ? 'पावन अध्याय' : language === 'te' ? 'పవిత్ర అధ్యాయాలు' : 'Sacred Chapters'}</span>
            <span aria-hidden="true" className="text-amber-500/50">·</span>
            <span>700 {language === 'hi' ? 'अमृत श्लोक' : language === 'te' ? 'దివ్య శ్లోకాలు' : 'Timeless Shlokas'}</span>
            <span aria-hidden="true" className="text-amber-500/50">·</span>
            <span>4 {language === 'hi' ? 'योग मार्ग' : language === 'te' ? 'యోగ మార్గాలు' : 'Classical Yogas'}</span>
            <span aria-hidden="true" className="text-amber-500/50">·</span>
            <span>English · हिन्दी · తెలుగు</span>
          </div>

          {/* Curated Charioteer Seeds for Immediate Inquiry */}
          <div className="pt-4 text-left">
            <p className="text-xs text-slate-400 mb-2.5 font-medium text-center">
              {language === 'hi' ? 'सारथी श्रीकृष्ण से सीधे मार्गदर्शन प्राप्त करें:' : language === 'te' ? 'సారథియైన శ్రీకృష్ణుని ఈ ప్రశ్నలతో అడగండి:' : 'Seek immediate clarity from the Charioteer on modern dilemmas:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {quickQueryStarters.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleRingBell(528);
                    onOpenKrishnaDialogue(item.prompt);
                  }}
                  className="flex flex-col text-left p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-200 transition-all text-xs group cursor-pointer"
                >
                  <span className="font-semibold text-amber-400/90 group-hover:text-amber-300 text-[11px] mb-1 flex items-center justify-between">
                    <span>{item.label}</span>
                    <span className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">→</span>
                  </span>
                  <span className="line-clamp-2 text-slate-400 group-hover:text-slate-200 text-[11px] leading-relaxed">
                    "{item.prompt}"
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. THE LIVING SHLOKA (Spotlighted Sacred Verse) */}
      {/* ------------------------------------------------------------- */}
      <section className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900/95 via-slate-950 to-slate-900/90 p-6 sm:p-10 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Subtle manuscript watermark */}
        <div className="absolute top-3 right-6 text-9xl font-serif text-amber-500/[0.03] select-none pointer-events-none">
          ॐ
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Sun className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block font-cinzel">
                {t.homeDailyShlokaTitle}
              </span>
              <span className="text-xs text-slate-400">
                {language === 'hi' ? `अध्याय ${spotlightShloka.chapter}, श्लोक ${spotlightShloka.verse}` : language === 'te' ? `అధ్యాయం ${spotlightShloka.chapter}, శ్లోకం ${spotlightShloka.verse}` : `Chapter ${spotlightShloka.chapter}, Verse ${spotlightShloka.verse}`}
                <span className="mx-1.5 opacity-40">·</span>
                {language === 'hi' ? spotlightTheme : spotlightTheme}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {language === 'te' && (
              <button
                onClick={() => setShowTeluguScript(!showTeluguScript)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 cursor-pointer transition-colors"
              >
                {showTeluguScript ? 'దేవనాగరి' : 'తెలుగు లిపి'}
              </button>
            )}

            <button
              onClick={() => onBookmarkVerse(spotlightShloka.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border cursor-pointer ${
                isSpotlightBookmarked
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700'
              }`}
              title="Bookmark verse"
            >
              {isSpotlightBookmarked ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{isSpotlightBookmarked ? t.bookmarked : t.bookmark}</span>
            </button>
          </div>
        </div>

        {/* Sacred Sanskrit Devanagari or Telugu Script */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-amber-500/20 text-center space-y-3 shadow-inner">
          <p className="font-serif text-xl sm:text-3xl text-amber-200 font-medium leading-relaxed whitespace-pre-line tracking-wide">
            {showTeluguScript && spotlightShloka.sanskritTelugu ? spotlightShloka.sanskritTelugu : spotlightShloka.sanskrit}
          </p>
          <p className="text-xs sm:text-sm text-slate-400 italic font-editorial">
            {spotlightShloka.transliteration}
          </p>
        </div>

        {/* Translation & Metaphysical Principle */}
        <div className="space-y-3 max-w-3xl">
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-serif italic">
            "{spotlightTranslation}"
          </p>
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-amber-300/90 leading-relaxed">
            <span className="font-semibold text-amber-200">
              {language === 'hi' ? 'मूल सिद्धांत: ' : language === 'te' ? 'ముఖ్య ఆధ్యాత్మిక సూత్రం: ' : 'Key Principle: '}
            </span>
            {spotlightTakeaway}
          </div>
        </div>

        {/* Footer controls for this shloka */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={() => handleRingBell(528)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-xs text-slate-300 hover:text-amber-300 transition-colors border border-slate-700/80 cursor-pointer"
            title="Strike 528Hz Miracle Tone Bell"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Chime 528Hz</span>
          </button>

          <button
            onClick={() => {
              handleRingBell(432);
              onNavigate('knowledge');
            }}
            className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer group"
          >
            <span>{t.homeExploreVerses}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. THE INNER COMPASS (Emotional State & Vedantic Psychological Healing) */}
      {/* ------------------------------------------------------------- */}
      <section className="rounded-3xl border border-slate-800/90 bg-slate-900/60 p-6 sm:p-10 space-y-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/70 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider font-cinzel">
              <HeartHandshake className="w-4 h-4" />
              <span>{t.homeEmotionTriageTitle}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-cinzel mt-1">
              {language === 'hi' ? 'इस समय आपका मन कैसा अनुभव कर रहा है?' : language === 'te' ? 'ప్రస్తుతం మీ మనస్సు ఎలా ఉంది?' : 'Where is Your Consciousness Resting Today?'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {t.homeEmotionTriageSubtitle}
            </p>
          </div>

          <button
            onClick={() => {
              handleRingBell(432);
              onNavigate('emotion');
            }}
            className="self-start sm:self-auto flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer group"
          >
            <span>{t.explore} {t.navEmotions}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Emotion Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {emotionQuickChecks.map(item => {
            const isSelected = item.id === selectedEmotionId;
            return (
              <button
                key={item.id}
                onClick={() => {
                  handleRingBell(480);
                  setSelectedEmotionId(item.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 scale-[1.02]'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Selected Emotion Wisdom Box */}
        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-slate-950 to-slate-900/90 p-6 space-y-4 shadow-inner">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-serif text-amber-300 font-semibold">{activeEmotion.sanskritKicker}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-amber-400/90 font-medium">{activeEmotion.shlokaRef}</span>
            </div>
            <span className="text-[11px] text-slate-500">
              {language === 'hi' ? 'भगवद्गीता मनोविज्ञान' : language === 'te' ? 'భగవద్గీత మనస్తత్వశాస్త్రం' : 'Bhagavad Gita Psychology'}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-white">
            {activeEmotion.remedyTitle}
          </h3>

          <p className="text-sm text-slate-300 italic font-serif leading-relaxed pl-3.5 border-l-2 border-amber-500/60">
            "{activeEmotion.quote}"
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                handleRingBell(528);
                onOpenKrishnaDialogue(
                  language === 'hi'
                    ? `हे श्रीकृष्ण, कृपया मुझे ${activeEmotion.label} से उबरने का मार्ग बताएं: "${activeEmotion.remedyTitle}"`
                    : language === 'te'
                    ? `శ్రీకృష్ణా, దయచేసి ${activeEmotion.label} అధిగమించే మార్గాన్ని నాకు అనుగ్రహించండి: "${activeEmotion.remedyTitle}"`
                    : `Sri Krishna, please guide me on dealing with ${activeEmotion.label.toLowerCase()}: "${activeEmotion.remedyTitle}"`
                );
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-950" />
              <span>{t.chatAskKrishnaBtn}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. THE FOUR CLASSICAL YOGAS */}
      {/* ------------------------------------------------------------- */}
      <section className="rounded-3xl border border-slate-800/90 bg-slate-900/40 p-6 sm:p-10 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider font-cinzel">
            <Feather className="w-4 h-4" />
            <span>{t.homePillarsTitle}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-cinzel mt-1">
            {language === 'hi' ? 'श्रीमद्भगवद्गीता के चार योग' : language === 'te' ? 'భగవద్గీతలోని నాలుగు యోగ మార్గాలు' : 'The 4 Classical Yogas'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {language === 'hi' ? 'श्रीकृष्ण मनुष्य के हाथ (कर्म), हृदय (भक्ति), बुद्धि (ज्ञान) और मन (ध्यान) का दिव्य समन्वय सिखाते हैं।' : language === 'te' ? 'చేతులు (కర్మ), హృదయం (భక్తి), బుద్ధి (జ్ఞానం) మరియు మనస్సు (ధ్యానం) లను అనుసంధానించే సమగ్ర మార్గం.' : 'Sri Krishna harmonizes all four faculties of human life: hands (action), heart (devotion), intellect (wisdom), and breath (meditation).'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {yogas.map((yoga, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-2xl border border-slate-800/80 bg-slate-950/70 space-y-3 flex flex-col justify-between hover:border-amber-500/30 transition-all hover:scale-[1.01]"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-serif text-amber-400 text-sm font-bold">{yoga.sanskrit}</span>
                  <span className="text-[11px] text-slate-500 font-mono">{yoga.keyVerse}</span>
                </div>
                <h3 className="text-base font-bold text-white font-cinzel">{yoga.name}</h3>
                <p className="text-xs font-medium text-amber-300/80">{yoga.subtitle}</p>
                <p className="text-xs text-slate-400 leading-relaxed pt-1">{yoga.teaching}</p>
              </div>

              <button
                onClick={() => {
                  handleRingBell(432);
                  onNavigate('guidance');
                }}
                className="pt-2 text-xs text-slate-300 hover:text-amber-300 font-medium flex items-center gap-1 transition-colors cursor-pointer group"
              >
                <span>{t.guidanceTabGunaQuiz}</span>
                <ArrowRight className="w-3 h-3 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. SACRED STILLNESS (One-Minute Maha-Mantra Contemplation) */}
      {/* ------------------------------------------------------------- */}
      <section className="rounded-3xl border border-amber-500/25 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2.5 max-w-xl text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider font-cinzel">
            <Flame className="w-4 h-4" />
            <span>{t.homeQuickChantTitle}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-cinzel">
            {language === 'hi' ? 'आरंभ करने से पूर्व मन को शांत करें' : language === 'te' ? 'ప్రారంభించే ముందు మనస్సును ప్రశాంతం చేసుకోండి' : 'Still the Mind Before You Begin'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {t.homeQuickChantSubtitle}
          </p>
          {quickBreathSeconds !== null && (
            <div className="pt-2">
              <p className="font-serif text-sm sm:text-base text-amber-300 font-semibold tracking-wide">
                {language === 'te' 
                  ? 'హరే రామ హరే రామ రామ రామ హరే హరే। హరే కృష్ణ హరే కృష్ణ కృష్ణ కృష్ణ హరే హరే॥' 
                  : 'हरे राम हरे राम राम राम हरे हरे। हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे॥'}
              </p>
              <p className="text-[11px] text-slate-400 italic">
                {language === 'hi' ? 'पावन महामंत्र की ध्वनि गूंज रही है...' : language === 'te' ? 'దివ్య మహామంత్ర నాదం కొనసాగుతోంది...' : 'Playing sacred Maha-Mantra audio soundscape'}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3.5">
          {quickBreathSeconds !== null ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200">
                <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                <span className="font-mono text-lg font-bold tabular-nums">
                  {quickBreathSeconds}s {language === 'hi' ? 'शेष' : language === 'te' ? 'మిగిలి ఉంది' : 'remaining'}
                </span>
                <span className="text-xs text-slate-300 italic hidden sm:inline">Hare Ram Chanting</span>
              </div>
              <button
                onClick={stopQuickBreath}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-2xl border border-slate-700 cursor-pointer"
                title={t.homeStopChant}
              >
                <Square className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={startQuickBreath}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 text-slate-950" />
              <span>{t.homeQuickChantBtn}</span>
            </button>
          )}

          <button
            onClick={() => {
              handleRingBell(432);
              onNavigate('reflection');
            }}
            className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-850 hover:bg-slate-800 text-slate-200 hover:text-white text-xs sm:text-sm font-medium transition-colors border border-slate-700/80 cursor-pointer"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{t.wellnessTabMeditation}</span>
          </button>
        </div>
      </section>

    </div>
  );
};
