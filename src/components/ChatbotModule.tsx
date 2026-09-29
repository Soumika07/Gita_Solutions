import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  BookMarked, 
  Volume2, 
  VolumeX,
  Share2, 
  Check, 
  User, 
  ArrowRight,
  Headphones,
  Mic,
  MicOff
} from 'lucide-react';
import { sendChatMessage } from '../services/api.ts';
import { ChatMessage } from '../types/gita.ts';
import { sacredAudio } from '../utils/audio.ts';
import { useLanguage } from '../context/LanguageContext.tsx';
import { getTranslation } from '../i18n/translations.ts';
import { KrishnaVoicePlayer } from './KrishnaVoicePlayer.tsx';
import { krishnaVoice, voiceInput } from '../utils/speechTts.ts';

interface ChatbotModuleProps {
  onBookmarkVerse?: (verseId: string) => void;
  className?: string;
  initialPrompt?: string;
  isFloating?: boolean;
  onClose?: () => void;
}

export const ChatbotModule: React.FC<ChatbotModuleProps> = ({ 
  onBookmarkVerse, 
  className,
  initialPrompt,
  isFloating,
}) => {
  const { language } = useLanguage();
  const t = getTranslation(language);

  const getWelcomeMessage = (lang: string): string => {
    if (lang === 'hi') {
      return `हे प्रिय आत्मा, आपका स्वागत है। जैसे एक समय कुरुक्षेत्र के रणक्षेत्र में जब अर्जुन विषाद और मोह से घिर गए थे, तब मैंने उनका मार्ग प्रशस्त किया था, वैसे ही आज मैं आपके साथ हूँ।\n\nआपके हृदय में जो भी संशय, भय, कर्तव्य-द्वंद्व अथवा शांति की अभिलाषा हो, उसे निःसंकोच मेरे समक्ष प्रस्तुत करें। सखा भाव से कहें—आपका मन किस बात से व्यथित है?`;
    }
    if (lang === 'te') {
      return `ఓ ప్రియ ఆత్మ స్వరూపా, సుస్వాగతం. ఆనాడు కురుక్షేత్ర రణరంగంలో అర్జునుడు విషాదంతో, కర్తవ్య మోహంతో కుంగిపోయినప్పుడు నేను అతని రథసారథిగా మార్గదర్శనం చేశాను. నేడు కూడా నేను నీకు అండగా ఉన్నాను.\n\nనీ మనస్సులో ఉన్న దుఃఖం, భయం, కర్తవ్య సందిగ్ధత లేదా శాంతి కోసం తపన ఏదైనా నిర్భయంగా నాతో పంచుకో. ఒక మిత్రుడిలా మాట్లాడు—నీ మనస్సును వేధిస్తున్నదేమిటి?`;
    }
    return `O noble seeker, welcome. As once I stood with Arjuna upon the chariot at Kurukshetra when doubt darkened his resolve, so now I stand with you.\n\nWhatever grief, hesitation, battle of duty, or yearning for peace fills your heart today, lay it before Me. Speak freely as friend to Friend. What weighs upon your spirit?`;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: getWelcomeMessage(language),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      referencedShlokas: [
        {
          chapter: 2,
          verse: 47,
          sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन...",
          translation: language === 'hi' 
            ? "तुम्हारा केवल कर्तव्य-कर्म पर अधिकार है, फलों में कभी नहीं।"
            : language === 'te'
            ? "నీ కర్తవ్య కర్మను చేయడంలోనే నీకు అధికారం ఉంది, ఫలితాలపై కాదు."
            : "You have a right to your sacred duty, never to the fruits thereof."
        }
      ]
    }
  ]);

  // Update initial welcome message if user hasn't started conversing yet
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [{
          id: 'welcome',
          role: 'assistant',
          content: getWelcomeMessage(language),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          referencedShlokas: [
            {
              chapter: 2,
              verse: 47,
              sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन...",
              translation: language === 'hi' 
                ? "तुम्हारा केवल कर्तव्य-कर्म पर अधिकार है, फलों में कभी नहीं।"
                : language === 'te'
                ? "నీ కర్తవ్య కర్మను చేయడంలోనే నీకు అధికారం ఉంది, ఫలితాలపై కాదు."
                : "You have a right to your sacred duty, never to the fruits thereof."
            }
          ]
        }];
      }
      return prev;
    });
  }, [language]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const stopListeningRef = useRef<(() => void) | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('Arjuna');
  const [autoVoice, setAutoVoice] = useState<'off' | 'en' | 'te' | 'hi'>(() => {
    try {
      const saved = localStorage.getItem('gita_chat_autovoice');
      if (saved === 'en' || saved === 'te' || saved === 'hi' || saved === 'off') return saved;
    } catch {}
    return (language as 'en' | 'te' | 'hi') || 'en';
  });

  // Keep auto-voice aligned with current app language when switching languages
  useEffect(() => {
    setAutoVoice(prev => (prev === 'off' ? 'off' : (language as 'en' | 'te' | 'hi')));
  }, [language]);

  const handleSetAutoVoice = (val: 'off' | 'en' | 'te' | 'hi') => {
    setAutoVoice(val);
    try {
      localStorage.setItem('gita_chat_autovoice', val);
    } catch {}
  };

  useEffect(() => {
    return () => {
      krishnaVoice.stop();
      if (stopListeningRef.current) {
        stopListeningRef.current();
        stopListeningRef.current = null;
      }
    };
  }, []);

  const handleToggleVoiceInput = () => {
    if (isListening) {
      if (stopListeningRef.current) {
        stopListeningRef.current();
        stopListeningRef.current = null;
      }
      setIsListening(false);
      return;
    }

    sacredAudio.playBell(528);
    setIsListening(true);
    const stopFn = voiceInput.startListening(
      language as any,
      (transcript) => {
        setInput(transcript);
      },
      () => {
        setIsListening(false);
        stopListeningRef.current = null;
      },
      (err) => {
        console.warn('Voice input error:', err);
        setIsListening(false);
        stopListeningRef.current = null;
      }
    );
    stopListeningRef.current = stopFn;
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastInitialPromptRef = useRef<string | null>(null);

  const quickPromptsByLang: Record<string, string[]> = {
    en: [
      "I am paralyzed by fear of failure. How do I act fearlessly?",
      "How can I work hard without getting burned out by results?",
      "Someone close to me has betrayed my trust. How do I respond with Dharma?",
      "My mind is constantly distracted and anxious. How do I tame it?",
      "What is the difference between true detachment and apathy?"
    ],
    hi: [
      "हे श्रीकृष्ण, मैं असफलता के भय से स्तब्ध हूँ। निर्भय होकर कर्म कैसे करूँ?",
      "कड़ी मेहनत करते हुए भी परिणामों की चिंता से बर्नआउट से कैसे बचें?",
      "किसी निकट व्यक्ति ने मेरा विश्वास तोड़ा है। मैं धर्मसम्मत आचरण कैसे करूँ?",
      "मेरा मन निरंतर अशांत और विचलित रहता है। इसे वश में कैसे करूँ?",
      "सच्ची अनासक्ति और उदासीनता (उदासीन भाव) में क्या अंतर है?"
    ],
    te: [
      "శ్రీకృష్ణా, వైఫల్య భయం నన్ను అడ్డుకుంటోంది. నిర్భయంగా కర్తవ్యాన్ని ఎలా ఆచరించాలి?",
      "ఫలితాల ఆందోళనతో అలసిపోకుండా నిరంతరం ఉత్సాహంగా ఎలా శ్రమించాలి?",
      "సన్నిహితులు చేసిన నమ్మకద్రోహాన్ని ధర్మబద్ధంగా ఎలా ఎదుర్కోవాలి?",
      "నా మనస్సు నిరంతరం చంచలంగా, ఆందోళనగా ఉంటోంది. దానిని ప్రశాంతం చేసుకోవడం ఎలా?",
      "నిజమైన అనాసక్తతకు, ఉదాసీనతకు మధ్య తేడా ఏమిటి?"
    ]
  };

  const quickPrompts = quickPromptsByLang[language] || quickPromptsByLang.en;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() && initialPrompt !== lastInitialPromptRef.current) {
      lastInitialPromptRef.current = initialPrompt;
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const response = await sendChatMessage(history, `Role: ${userRole}`, language);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: response.content || "Keep your mind centered on the Divine; fear will vanish.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        referencedShlokas: response.referencedShlokas
      };

      setMessages(prev => [...prev, botMsg]);
      sacredAudio.playBell(480);

      // Auto-voice trigger if enabled
      if (autoVoice !== 'off') {
        setTimeout(() => {
          krishnaVoice.speak(botMsg.id, botMsg.content, autoVoice);
        }, 400);
      }
    } catch (err) {
      console.error(err);
      const fallbackErr = language === 'hi' 
        ? "हे जिज्ञासु, स्थिर रहो। 'समत्वं योग उच्यते' [BG 2.48]—सफलता और विफलता में समान रहकर अपने पवित्र कर्तव्य में लीन रहो। मैं सदैव तुम्हारे साथ हूँ।"
        : language === 'te'
        ? "ఓ జిజ్ఞాసూ, స్థిరంగా ఉండు. 'సమత్వం యోగ ఉచ్యతే' [BG 2.48]—సుఖదుఃఖాలలో సమబుద్ధి కలిగి నీ కర్తవ్యాన్ని నిర్వహించు. నేను సదా నీకు తోడుగా ఉన్నాను."
        : "O seeker, remain steady. 'Perform your duty with calm surrender, abandoning feverish attachment' [BG 2.48]. Let us reflect deeply together.";

      const errBotMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'assistant',
        content: fallbackErr,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, errBotMsg]);

      if (autoVoice !== 'off') {
        setTimeout(() => {
          krishnaVoice.speak(errBotMsg.id, errBotMsg.content, autoVoice);
        }, 400);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={`flex flex-col ${className || 'h-[calc(100vh-14rem)]'} max-w-5xl w-full mx-auto p-4 sm:p-6 bg-slate-900/60 border border-amber-500/20 rounded-3xl shadow-2xl backdrop-blur-md`}>
      
      {/* Top Bar with Role & Persona */}
      {!isFloating ? (
        <div className="flex flex-wrap items-center justify-between pb-3.5 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/30">
                <Sparkles className="w-5 h-5 text-slate-950" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                {t.chatHeaderTitle}
                <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {language === 'hi' ? 'पार्थ सारथी' : language === 'te' ? 'పార్థ సారథి' : 'Partha Sarathi'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'hi' ? 'श्रीमद्भगवद्गीता के 700 श्लोकों पर आधारित दिव्य मार्गदर्शन' : language === 'te' ? 'భగవద్గీతలోని 700 శ్లోకాల దివ్య జ్ఞానం' : 'Trained on the 700 verses of the Bhagavad Gita'}
              </p>
            </div>
          </div>

          {/* Controls: Persona & Auto Voice */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Unified Auto Voice Selector */}
            <div className="flex items-center gap-1.5 bg-slate-850 px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-sm">
              <Headphones className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[11px] text-slate-300 font-medium">{t.ttsAutoVoice}:</span>
              <select
                value={autoVoice}
                onChange={(e) => handleSetAutoVoice(e.target.value as any)}
                className="bg-transparent text-amber-300 focus:outline-none text-[11px] cursor-pointer font-semibold"
                title={t.ttsAutoVoice}
              >
                <option value="off" className="bg-slate-900 text-slate-400">🔇 {language === 'hi' ? 'ध्वनि बंद (Off)' : language === 'te' ? 'ధ్వని ఆపివేయబడింది (Off)' : 'Mute (Off)'}</option>
                <option value="en" className="bg-slate-900 text-amber-300">🔊 English Voice</option>
                <option value="te" className="bg-slate-900 text-amber-300">🔊 తెలుగు వాణి (Telugu)</option>
                <option value="hi" className="bg-slate-900 text-amber-300">🔊 हिन्दी वाणी (Hindi)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-850 px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-sm">
              <span className="text-[11px] text-slate-400">{t.chatRoleSelector}:</span>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="bg-transparent text-amber-300 focus:outline-none text-xs font-semibold cursor-pointer"
              >
                <option value="Arjuna" className="bg-slate-900">{t.chatRoleArjuna}</option>
                <option value="Sincere Seeker" className="bg-slate-900">{t.chatRoleSeeker}</option>
                <option value="Modern Professional" className="bg-slate-900">{t.chatRoleProfessional}</option>
                <option value="Student" className="bg-slate-900">{t.chatRoleStudent}</option>
              </select>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs gap-2">
          {/* Persona selector in floating mode */}
          <div className="flex items-center gap-1">
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="bg-slate-900 text-amber-300 border border-slate-700/80 rounded-lg px-2 py-1 focus:outline-none focus:border-amber-400 text-[11px] cursor-pointer max-w-[120px] truncate"
            >
              <option value="Arjuna">{t.chatRoleArjuna}</option>
              <option value="Sincere Seeker">{t.chatRoleSeeker}</option>
              <option value="Modern Professional">{t.chatRoleProfessional}</option>
              <option value="Student">{t.chatRoleStudent}</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Unified Auto voice selector in floating mode */}
            <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700/80 text-[11px]">
              <Headphones className="w-3 h-3 text-amber-400 shrink-0" />
              <select
                value={autoVoice}
                onChange={(e) => handleSetAutoVoice(e.target.value as any)}
                className="bg-transparent text-amber-300 focus:outline-none text-[11px] cursor-pointer font-semibold"
                title={t.ttsAutoVoice}
              >
                <option value="off" className="bg-slate-900 text-slate-400">🔇 {language === 'hi' ? 'ध्वनि बंद' : language === 'te' ? 'ఆఫ్' : 'Mute'}</option>
                <option value="en" className="bg-slate-900 text-amber-300">🔊 English</option>
                <option value="te" className="bg-slate-900 text-amber-300">🔊 తెలుగు</option>
                <option value="hi" className="bg-slate-900 text-amber-300">🔊 हिन्दी</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-2`}
          >
            <div
              className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-medium rounded-tr-none shadow-md shadow-amber-500/10'
                  : 'bg-slate-800/90 text-slate-200 border border-amber-500/20 rounded-tl-none shadow-lg'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between text-xs mb-1.5 opacity-80 border-b border-black/10 pb-1">
                <span className="font-semibold flex items-center gap-1.5">
                  {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                  {msg.role === 'user' ? userRole : (language === 'hi' ? 'श्रीकृष्ण' : language === 'te' ? 'శ్రీకృష్ణుడు' : 'Sri Krishna')}
                </span>
                <span className="text-[11px]">{msg.timestamp}</span>
              </div>

              {/* Message Text with Paragraph formatting */}
              <div className="space-y-2 whitespace-pre-line text-sm">
                {msg.content}
              </div>

              {/* Referenced Shlokas Pill / Card */}
              {msg.referencedShlokas && msg.referencedShlokas.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-700/60 space-y-2">
                  <span className="text-[11px] font-semibold tracking-wider text-amber-400 uppercase flex items-center gap-1">
                    <BookMarked className="w-3 h-3" /> {t.chatReferencedVerses}
                  </span>
                  {msg.referencedShlokas.map((sh, idx) => (
                    <div key={idx} className="bg-slate-950/60 rounded-xl p-3 border border-amber-500/30">
                      <div className="flex items-center justify-between text-xs text-amber-300 font-bold mb-1">
                        <span>
                          {language === 'hi' 
                            ? `अध्याय ${sh.chapter}, श्लोक ${sh.verse}`
                            : language === 'te'
                            ? `అధ్యాయం ${sh.chapter}, శ్లోకం ${sh.verse}`
                            : `Chapter ${sh.chapter}, Verse ${sh.verse}`}
                        </span>
                        {onBookmarkVerse && (
                          <button
                            onClick={() => onBookmarkVerse(`gita-${sh.chapter}-${sh.verse}`)}
                            className="text-[11px] text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                          >
                            + {t.bookmark}
                          </button>
                        )}
                      </div>
                      {sh.sanskrit && (
                        <p className="font-serif text-amber-200/90 text-xs italic mb-1">
                          {sh.sanskrit}
                        </p>
                      )}
                      <p className="text-xs text-slate-300">
                        "{sh.translation}"
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions for Sri Krishna dialogue message: Telugu and Hindi TTS Audio */}
              {msg.role === 'assistant' && (
                <div className="space-y-1.5">
                  <KrishnaVoicePlayer 
                    messageId={msg.id} 
                    content={msg.content} 
                    isFloating={isFloating} 
                  />

                  <div className="flex items-center justify-between pt-1.5 text-xs text-slate-400">
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer text-[11px]"
                      title={t.share}
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                      <span>{copiedId === msg.id ? t.copied : t.share}</span>
                    </button>

                    <span className="text-[10px] text-amber-400/80 italic flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      {language === 'hi' 
                        ? 'श्रीकृष्ण दिव्य वाणी' 
                        : language === 'te' 
                        ? 'శ్రీకృష్ణ దివ్యవాణి' 
                        : 'Sri Krishna Voice'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 p-4 bg-slate-800/60 rounded-2xl rounded-tl-none border border-amber-500/20 max-w-sm text-sm text-amber-300 animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>{t.loading}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Inquiries */}
      <div className="py-2 overflow-x-auto scrollbar-none flex gap-2">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp)}
            className="text-xs bg-slate-800/80 hover:bg-amber-500/10 text-slate-300 hover:text-amber-300 border border-slate-700/80 hover:border-amber-500/40 rounded-full px-3 py-1 whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>{qp}</span>
            <ArrowRight className="w-3 h-3 opacity-60" />
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-2 flex items-center gap-2 pt-2 border-t border-slate-800"
      >
        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isListening
                ? (language === 'hi' ? 'बोलिए... श्रीकृष्ण सुन रहे हैं...' : language === 'te' ? 'మాట్లాడండి... కృష్ణుడు వింటున్నారు...' : 'Listening to your voice...')
                : t.chatInputPlaceholder
            }
            disabled={isLoading}
            className={`w-full bg-slate-950 border rounded-xl pl-4 pr-11 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
              isListening 
                ? 'border-red-500/80 ring-2 ring-red-500/30 bg-red-950/20 text-red-200 placeholder-red-400/80 animate-pulse' 
                : 'border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40'
            }`}
          />
          {/* Voice Input Microphone Button */}
          {voiceInput.isSupported && (
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              disabled={isLoading}
              className={`absolute right-2 p-2 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                isListening
                  ? 'bg-red-500 text-white animate-bounce shadow-md shadow-red-500/40'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800/80'
              }`}
              title={
                isListening
                  ? (language === 'hi' ? 'बोलना समाप्त करें' : 'Stop speaking')
                  : (language === 'hi' ? 'हिन्दी में बोलें (Voice Typing)' : language === 'te' ? 'తెలుగులో మాట్లాడండి' : 'Speak (Voice typing)')
              }
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl transition-all shadow-md shadow-amber-500/20 cursor-pointer shrink-0"
          title={t.send}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
