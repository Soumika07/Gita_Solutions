import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Flame, 
  Layers, 
  Heart, 
  BrainCircuit, 
  Activity, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { resolveDilemma, calculateGunas } from '../services/api.ts';
import { DilemmaSolution, GunaAssessmentResult } from '../types/gita.ts';
import { sacredAudio } from '../utils/audio.ts';
import { useLanguage } from '../context/LanguageContext.tsx';
import { getTranslation } from '../i18n/translations.ts';

export const PersonalizedGuidanceModule: React.FC = () => {
  const { language } = useLanguage();
  const t = getTranslation(language);

  const [activeSubTab, setActiveSubTab] = useState<'dilemma' | 'gunas'>('dilemma');

  // Dilemma state
  const [dilemmaText, setDilemmaText] = useState('');
  const [dilemmaCategory, setDilemmaCategory] = useState('Career vs Purpose');
  const [currentThoughts, setCurrentThoughts] = useState('');
  const [loadingDilemma, setLoadingDilemma] = useState(false);
  const [dilemmaSolution, setDilemmaSolution] = useState<DilemmaSolution | null>(null);

  // Dilemma Categories
  const dilemmaCategories = [
    { value: 'Career vs Purpose', en: 'Career vs Soul Purpose', hi: 'आजीविका बनाम आत्म-उद्देश्य', te: 'వృత్తి / ఉద్యోగం vs ఆత్మ ప్రయోజనం' },
    { value: 'Duty vs Personal Desire', en: 'Duty (Dharma) vs Personal Desire (Kama)', hi: 'कर्तव्य (धर्म) बनाम व्यक्तिगत कामना (काम)', te: 'ధర్మం (కర్తవ్యం) vs వ్యక్తిగత కోరికలు (కామం)' },
    { value: 'Relationship Conflict & Detachment', en: 'Relationship Conflict & Detachment', hi: 'पारिवारिक/संबंध द्वंद्व एवं अनासक्ति', te: 'సంబంధాల ఘర్షణ & అనాసక్తత' },
    { value: 'Ethics vs Material Gain', en: 'Ethics vs Financial / Career Gain', hi: 'नीति व धर्म बनाम भौतिक लाभ', te: 'నైతికత vs లౌకిక లాభం / ధనం' },
    { value: 'Burnout & Overwhelm', en: 'Burnout & Overwhelm vs Ambition', hi: 'अत्यधिक थकान व अवसाद बनाम महत्वाकांक्षा', te: 'తీవ్ర మానసిక ఒత్తిడి vs ఆశయ సాధన' },
    { value: 'Forgiveness vs Boundaries', en: 'Forgiveness vs Righteous Boundaries', hi: 'क्षमाशीलता बनाम धर्मसम्मत सीमाएं', te: 'క్షమాగుణం vs ధర్మబద్ధమైన సరిహద్దులు' }
  ];

  // Multilingual Guna Quiz Questions
  const gunaQuestions = [
    {
      id: 1,
      questionEn: "How do you typically react when an unexpected crisis disrupts your plans?",
      questionHi: "जब कोई अप्रत्याशित संकट आपकी योजनाओं को अस्त-व्यस्त कर देता है, तो आपकी स्वाभाविक प्रतिक्रिया क्या होती है?",
      questionTe: "అనుకోని సంక్షోభం మీ ప్రణాళికలను తలకిందులు చేసినప్పుడు మీరు సాధారణంగా ఎలా స్పందిస్తారు?",
      options: [
        { 
          textEn: "I pause, breathe, accept reality, and calmly assess righteous next steps.", 
          textHi: "मैं ठहरकर गहरी श्वास लेता हूँ, स्थिति को स्वीकार करता हूँ और शांत मन से कर्तव्य का निर्णय लेता हूँ।", 
          textTe: "నేను ఒక క్షణం ఆగి, ప్రశాంతంగా శ్వాస తీసుకుని, వాస్తవాన్ని అంగీకరించి ధర్మబద్ధమైన తదుపరి అడుగు ఆలోచిస్తాను.", 
          guna: 'sattva' 
        },
        { 
          textEn: "I feel irritated, restless, and feverishly scramble to fix it immediately.", 
          textHi: "मैं व्याकुल व अधीर हो उठता हूँ और तुरंत सब कुछ ठीक करने के लिए उतावला हो जाता हूँ।", 
          textTe: "నేను అసహనం, చంచలత్వం చెంది, తక్షణమే పరిస్థితిని సరిదిద్దడానికి ఆందోళనతో పరుగులు తీస్తాను.", 
          guna: 'rajas' 
        },
        { 
          textEn: "I feel paralyzed, hopeless, or avoid dealing with it altogether.", 
          textHi: "मैं स्तब्ध, निराश हो जाता हूँ या समस्या से पूरी तरह मुंह मोड़ लेता हूँ।", 
          textTe: "నేను నిస్సహాయంగా భావించి స్థంభించిపోతాను లేదా సమస్యను పట్టించుకోకుండా పారిపోవడానికి ప్రయత్నిస్తాను.", 
          guna: 'tamas' 
        }
      ]
    },
    {
      id: 2,
      questionEn: "What is your primary motivation in your work and career?",
      questionHi: "आपके कार्य अथवा आजीविका में आपकी मुख्य प्रेरणा क्या है?",
      questionTe: "మీ పని మరియు ఉద్యోగంలో మీ ప్రధాన ప్రేరణ ఏమిటి?",
      options: [
        { 
          textEn: "Performing duty with excellence, service to society, and self-refinement.", 
          textHi: "उत्कृष्टता के साथ कर्तव्य पालन, समाज-सेवा एवं आत्म-शुद्धि।", 
          textTe: "కర్తవ్యాన్ని నిష్ఠతో నెరవేర్చడం, సమాజ సేవ మరియు అంతరంగ పరిపక్వత.", 
          guna: 'sattva' 
        },
        { 
          textEn: "Achieving status, recognition, financial wealth, and beating competitors.", 
          textHi: "प्रतिष्ठा, यश, धनार्जन एवं प्रतिद्वंदियों से आगे निकलना।", 
          textTe: "హోదా, గుర్తింపు, ధన సంపాదన మరియు పోటీదారులను అధిగమించడం.", 
          guna: 'rajas' 
        },
        { 
          textEn: "Merely getting by with minimal effort, feeling uninspired or stuck.", 
          textHi: "जैसे-तैसे न्यूनतम प्रयास से समय काटना, उत्साहहीन व फंसा हुआ अनुभव करना।", 
          textTe: "కనీస ప్రయత్నంతో నెట్టుకురావడం, ఎటువంటి ఉత్సాహం లేకుండా బంధించబడినట్లు భావించడం.", 
          guna: 'tamas' 
        }
      ]
    },
    {
      id: 3,
      questionEn: "How would you describe your typical sleeping and waking patterns?",
      questionHi: "आपकी निद्रा एवं दैनिक जागने की दिनचर्या कैसी है?",
      questionTe: "మీ నిద్ర మరియు నిద్రలేచే అలవాట్లు సాధారణంగా ఎలా ఉంటాయి?",
      options: [
        { 
          textEn: "Wake up fresh before sunrise, sleep peacefully with clean rest.", 
          textHi: "सूर्योदय से पूर्व स्फूर्ति के साथ जागना, गहरी व शांत निद्रा।", 
          textTe: "సూర్యోదయానికి ముందే ఉత్సాహంగా మేల్కొనడం, ప్రశాంతమైన నిద్ర.", 
          guna: 'sattva' 
        },
        { 
          textEn: "Fitful sleep, mind racing with future plans, difficulty switching off.", 
          textHi: "अशांत निद्रा, भविष्य की योजनाओं से मन का चंचल रहना, विचारों का न थमना।", 
          textTe: "అంతరాయాలతో కూడిన నిద్ర, భవిష్యత్ ఆలోచనలతో మనస్సు వేగంగా పరిగెత్తడం, విశ్రాంతి తీసుకోలేకపోవడం.", 
          guna: 'rajas' 
        },
        { 
          textEn: "Oversleeping, grogginess, reluctance to get out of bed in the morning.", 
          textHi: "अत्यधिक सोना, भारीपन, सुबह बिस्तर छोड़ने में आलस्य व जड़ता।", 
          textTe: "అతిగా నిద్రపోవడం, బద్ధకం, ఉదయం లేవడానికి ఇష్టం లేకపోవడం.", 
          guna: 'tamas' 
        }
      ]
    },
    {
      id: 4,
      questionEn: "What kind of food and nutrition appeals most to your body?",
      questionHi: "आपके शरीर और मन को किस प्रकार का भोजन सबसे अधिक भाता है?",
      questionTe: "మీ శరీరానికి, మనస్సుకు ఎటువంటి ఆహారం ఎక్కువ అనుకూలంగా అనిపిస్తుంది?",
      options: [
        { 
          textEn: "Fresh, wholesome, lightly cooked vegetables, fruits, grains, and clean water.", 
          textHi: "ताजा, सात्विक, सुपाच्य फल, हरी सब्जियां, अन्न एवं शुद्ध जल।", 
          textTe: "తాజా, సాత్విక, సులభంగా జీర్ణమయ్యే కూరగాయలు, పండ్లు, ధాన్యాలు మరియు స్వచ్ఛమైన నీరు.", 
          guna: 'sattva' 
        },
        { 
          textEn: "Extremely spicy, salty, pungent foods, caffeine, energy drinks, and rich dining.", 
          textHi: "अत्यधिक तीखा, नमकीन, खट्टा, तले हुए पदार्थ, कैफीन व उत्तेजक भोजन।", 
          textTe: "అత్యధిక కారం, ఉప్పు, వేపుళ్ళు, టీ/కాఫీ మరియు ఉద్రేకం కలిగించే ఆహారాలు.", 
          guna: 'rajas' 
        },
        { 
          textEn: "Processed, heavy, stale, leftover, or overly sweet junk foods.", 
          textHi: "बासी, भारी, प्रसंस्कृत (प्रोसेस्ड), अत्यधिक मीठा अथवा जंक फूड।", 
          textTe: "నిల్వ ఉంచిన, బరువైన, ప్రాసెస్ చేసిన జంక్ ఫుడ్ మరియు నిస్సారమైన ఆహారం.", 
          guna: 'tamas' 
        }
      ]
    },
    {
      id: 5,
      questionEn: "When interacting with someone who holds an opposing viewpoint:",
      questionHi: "जब आपका सामना किसी विपरीत मत रखने वाले व्यक्ति से होता है, तब आपका व्यवहार कैसा होता है?",
      questionTe: "మీ అభిప్రాయానికి భిన్నమైన అభిప్రాయం ఉన్న వ్యక్తితో మాట్లాడేటప్పుడు మీ వైఖరి ఎలా ఉంటుంది?",
      options: [
        { 
          textEn: "I listen patiently with empathy, seeking mutual understanding and truth.", 
          textHi: "मैं धैर्य व सहानुभूति से सुनता हूँ और सत्य तथा सामंजस्य की खोज करता हूँ।", 
          textTe: "నేను ఓపికతో, సానుభూతితో విని, సత్యం మరియు పరస్పర అవగాహన కోసం ప్రయత్నిస్తాను.", 
          guna: 'sattva' 
        },
        { 
          textEn: "I debate vigorously to prove my point and win the argument.", 
          textHi: "मैं अपनी बात सिद्ध करने और बहस जीतने के लिए तीव्र वाद-विवाद करता हूँ।", 
          textTe: "నా వాదనను గెలిపించుకోవడానికి మరియు నేను సరైనవాడినని నిరూపించడానికి తీవ్రంగా వాదిస్తాను.", 
          guna: 'rajas' 
        },
        { 
          textEn: "I tune out, become passive-aggressive, or harbor silent resentment.", 
          textHi: "मैं ध्यान हटा लेता हूँ, कटाक्ष करता हूँ अथवा भीतर ही भीतर द्वेष पालता हूँ।", 
          textTe: "నేను వినడం మానేసి, నిష్క్రియాత్మకంగా మారతాను లేదా మనస్సులోనే అసూయ, కోపం పెంచుకుంటాను.", 
          guna: 'tamas' 
        }
      ]
    },
    {
      id: 6,
      questionEn: "What is the natural climate of your inner mind on a quiet day?",
      questionHi: "किसी शांत दिन आपके अंतर्मन की स्वाभाविक दशा कैसी रहती है?",
      questionTe: "ఎటువంటి బాహ్య ఒత్తిడి లేని ప్రశాంత సమయంలో మీ అంతరంగ స్థితి ఎలా ఉంటుంది?",
      options: [
        { 
          textEn: "Clear, tranquil, contemplative, and naturally grateful.", 
          textHi: "निर्मल, शांत, आत्म-चिंतनशील एवं कृतज्ञता से परिपूर्ण।", 
          textTe: "నిర్మలం, ప్రశాంతం, ఆత్మ పరిశీలన మరియు కృతజ్ఞతా భావంతో కూడిన స్థితి.", 
          guna: 'sattva' 
        },
        { 
          textEn: "Full of ambitions, desires, restlessness, and constant planning.", 
          textHi: "महत्वाकांक्षाओं, कामनाओं, व्यग्रता एवं निरंतर योजनाओं से भरा हुआ।", 
          textTe: "కోరికలు, ఆశయాలు, చంచలత్వం మరియు నిరంతరం భవిష్యత్ ఆలోచనలతో నిండి ఉండటం.", 
          guna: 'rajas' 
        },
        { 
          textEn: "Foggy, bored, lethargic, or drawn to mindless escapism.", 
          textHi: "धुंधला, ऊबा हुआ, आलसी अथवा व्यर्थ के भटकाव की ओर खिंचने वाला।", 
          textTe: "మందకొడిగా, విసుగ్గా, బద్ధకంతో లేదా అర్థంలేని కాలక్షేపానికి లోనవడం.", 
          guna: 'tamas' 
        }
      ]
    }
  ];

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [gunaResult, setGunaResult] = useState<GunaAssessmentResult | null>(null);
  const [calculatingGunas, setCalculatingGunas] = useState(false);

  const handleSolveDilemma = async () => {
    if (!dilemmaText.trim() || loadingDilemma) return;
    setLoadingDilemma(true);
    sacredAudio.playBell(528);

    try {
      const solution = await resolveDilemma(dilemmaText, dilemmaCategory, currentThoughts, language);
      setDilemmaSolution(solution);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDilemma(false);
    }
  };

  const handleAnswerOption = (questionId: number, guna: string) => {
    sacredAudio.playJapaClick();
    setSelectedAnswers(prev => ({ ...prev, [questionId]: guna }));
  };

  const handleCalculateGunas = async () => {
    setCalculatingGunas(true);
    sacredAudio.playBell(432);
    try {
      const answersArray = Object.values(selectedAnswers);
      const result = await calculateGunas(answersArray);
      setGunaResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setCalculatingGunas(false);
    }
  };

  const getQuestionText = (q: typeof gunaQuestions[0]) => {
    if (language === 'hi') return q.questionHi;
    if (language === 'te') return q.questionTe;
    return q.questionEn;
  };

  const getOptionText = (opt: typeof gunaQuestions[0]['options'][0]) => {
    if (language === 'hi') return opt.textHi;
    if (language === 'te') return opt.textTe;
    return opt.textEn;
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8 animate-fadeIn">
      
      {/* Sub Tab Switcher */}
      <div className="flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex gap-1 shadow-lg">
          <button
            onClick={() => setActiveSubTab('dilemma')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'dilemma'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{t.guidanceTabDilemma}</span>
          </button>
          <button
            onClick={() => setActiveSubTab('gunas')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'gunas'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{t.guidanceTabGunaQuiz}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: LIFE DILEMMA SOLVER */}
      {/* ========================================================================= */}
      {activeSubTab === 'dilemma' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Compass className="w-4 h-4" />
                <span>{language === 'hi' ? 'नैतिक एवं सामरिक निर्णय तंत्र' : language === 'te' ? 'నైతిక & ఆచరణాత్మక నిర్ణయ విధానం' : 'Moral & Strategic Decision Framework'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-100">
                {language === 'hi' ? 'अपने धर्म-संकट का समाधान पाएं' : language === 'te' ? 'మీ ధర్మ సందిగ్ధతను పరిష్కరించుకోండి' : 'Resolve Your Dharma Crossroads'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'hi' 
                  ? 'कुरुक्षेत्र में अर्जुन परम धर्म-संकट में थे: अधर्म के विरुद्ध युद्ध करें या झूठी शांति के लिए भाग जाएं? आज आपका कुरुक्षेत्र क्या है?' 
                  : language === 'te' 
                  ? 'కురుక్షేత్రంలో అర్జునుడు తీవ్ర ధర్మ సంకటాన్ని ఎదుర్కొన్నాడు: ధర్మ రక్షణ కోసం పోరాడాలా లేదా తప్పుకోవాలా? నేడు మీ జీవితంలో ఎదురైన ధర్మ సంకటం ఏమిటి?' 
                  : 'Arjuna faced the ultimate dilemma: fight his loved ones for righteousness, or walk away into false peace. What is your battlefield today?'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.guidanceCategoryLabel}
                </label>
                <select
                  value={dilemmaCategory}
                  onChange={(e) => setDilemmaCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  {dilemmaCategories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {language === 'hi' ? cat.hi : language === 'te' ? cat.te : cat.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {language === 'hi' ? 'आपकी वर्तमान भावनाएं / अंतर्द्वंद्व (वैकल्पिक)' : language === 'te' ? 'మీ ప్రస్తుత ఆలోచనలు / ఆందోళనలు (ఐచ్ఛికం)' : 'Your Current Instincts / Tensions (optional)'}
                </label>
                <input
                  type="text"
                  value={currentThoughts}
                  onChange={(e) => setCurrentThoughts(e.target.value)}
                  placeholder={language === 'hi' ? 'उदा. मुझे अपने परिवार की भावनाओं को ठेस पहुंचाने का भय है...' : language === 'te' ? 'ఉదా: కుటుంబ సభ్యుల మనస్సు నొచ్చుకుంటుందేమోనని భయపడుతున్నాను...' : "e.g. 'I am afraid of hurting my family's feelings'..."}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {language === 'hi' ? 'अपनी दुविधा का विस्तार से वर्णन करें:' : language === 'te' ? 'మీ సందిగ్ధతను వివరంగా తెలియజేయండి:' : 'Describe the crossroads in detail:'}
              </label>
              <textarea
                rows={3}
                value={dilemmaText}
                onChange={(e) => setDilemmaText(e.target.value)}
                placeholder={t.guidanceDilemmaInputPlaceholder}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-2xl p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400/40"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSolveDilemma}
                disabled={!dilemmaText.trim() || loadingDilemma}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-2"
              >
                {loadingDilemma ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>{language === 'hi' ? 'दिव्य सारथी से परामर्श...' : language === 'te' ? 'దివ్య మార్గదర్శకత్వం పొందుతున్నాము...' : 'Consulting Divine Charioteer...'}</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-4 h-4" />
                    <span>{t.guidanceResolveBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Dilemma Solution Presentation */}
          {dilemmaSolution && (
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                  <div>
                    <span className="text-xs text-amber-400 uppercase tracking-widest font-bold">
                      {language === 'hi' ? 'धर्म-संकट समाधान' : language === 'te' ? 'ధర్మ సందిగ్ధత పరిష్కారం' : 'Dharma Resolution'}
                    </span>
                    <h4 className="text-xl font-bold font-serif text-slate-100 mt-0.5">
                      {language === 'hi' ? 'मार्गदर्शन:' : language === 'te' ? 'మార్గదర్శకత్వం:' : 'Guidance for:'} "{dilemmaSolution.dilemmaSummary.slice(0, 60)}..."
                    </h4>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                    {t.guidanceRecommendedYoga}: {dilemmaSolution.recommendedYogaPath}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800">
                    <h5 className="font-bold text-amber-300 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> {t.guidanceDharmaPerspective}
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {dilemmaSolution.dharmaPerspective}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800">
                    <h5 className="font-bold text-emerald-300 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Flame className="w-4 h-4" /> {t.guidanceNishkamaKarmaAction}
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {dilemmaSolution.nishkamaKarmaAction}
                    </p>
                  </div>
                </div>

                {/* Relevant Verses */}
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-2">
                    {language === 'hi' ? 'प्रासंगिक गीता सूत्र एवं सिद्धांत:' : language === 'te' ? 'సంబంధిత భగవద్గీత శ్లోకాలు & సూత్రాలు:' : 'Guiding Scriptural Principles:'}
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {dilemmaSolution.relevantVerses.map((v, idx) => (
                      <div key={idx} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 text-xs">
                        <span className="font-bold text-amber-400 block mb-1">
                          {language === 'hi' ? `श्रीमद्भगवद्गीता अध्याय ${v.chapter}, श्लोक ${v.verse}` : language === 'te' ? `భగవద్గీత అధ్యాయం ${v.chapter}, శ్లోకం ${v.verse}` : `Bhagavad Gita ${v.chapter}.${v.verse}`}
                        </span>
                        <p className="text-slate-200 italic mb-1.5">"{v.translation}"</p>
                        <p className="text-slate-400 text-[11px] leading-snug">
                          <strong>{language === 'hi' ? 'व्यावहारिक उपयोग:' : language === 'te' ? 'జీవన అన్వయం:' : 'Application:'}</strong> {v.application}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step-by-Step Action Plan */}
                <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-amber-300 mb-2.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {t.guidanceActionPlan}
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {dilemmaSolution.actionPlan.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sacred Affirmation */}
                <div className="text-center p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                  <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold block mb-1">
                    {t.guidanceSacredAffirmation}
                  </span>
                  <p className="font-serif text-base text-amber-200 font-semibold italic">
                    "{dilemmaSolution.affirmation}"
                  </p>
                </div>

              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: GUNA ASSESSMENT & 4 YOGA PATHS */}
      {/* ========================================================================= */}
      {activeSubTab === 'gunas' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Layers className="w-4 h-4" />
                <span>{language === 'hi' ? 'गुणत्रय-विभाग योग (अध्याय १४)' : language === 'te' ? 'గుణత్రయ విభాగ యోగం (అధ్యాయం 14)' : 'Ayurvedic Consciousness Mapping (Chapter 14)'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-100">
                {language === 'hi' ? 'त्रिगुण स्वभाव परीक्षण' : language === 'te' ? 'త్రిగుణ స్వభావ నిర్ధారణ' : 'Guna Temperament Assessment'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                {t.guidanceGunaQuizIntro}
              </p>
            </div>

            {/* Questions list */}
            <div className="space-y-4 pt-3">
              {gunaQuestions.map((q) => (
                <div key={q.id} className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-200">
                    {q.id}. {getQuestionText(q)}
                  </h4>
                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {q.options.map((opt, i) => {
                      const isSelected = selectedAnswers[q.id] === opt.guna;
                      return (
                        <button
                          key={i}
                          onClick={() => handleAnswerOption(q.id, opt.guna)}
                          className={`p-3 rounded-xl text-left text-xs transition-all flex items-start gap-2.5 ${
                            isSelected
                              ? 'bg-amber-500/20 text-amber-200 border border-amber-400 shadow-md shadow-amber-500/10'
                              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-600'
                          }`}>
                            {isSelected && <span className="w-1.5 h-1.5 bg-slate-950 rounded-full" />}
                          </span>
                          <span>{getOptionText(opt)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Quiz */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-800">
              <span className="text-xs text-slate-400">
                {Object.keys(selectedAnswers).length} / {gunaQuestions.length} {language === 'hi' ? 'प्रश्नों के उत्तर दिए' : language === 'te' ? 'ప్రశ్నలకు సమాధానాలు పూర్తయ్యాయి' : 'questions answered'}
              </span>
              <button
                onClick={handleCalculateGunas}
                disabled={Object.keys(selectedAnswers).length < gunaQuestions.length || calculatingGunas}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-2"
              >
                {calculatingGunas ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>{language === 'hi' ? 'गुणों का विश्लेषण...' : language === 'te' ? 'గుణాల విశ్లేషణ...' : 'Analyzing Consciousness...'}</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-4 h-4" />
                    <span>{t.guidanceGunaSubmit}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Guna Results Output */}
          {gunaResult && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                <div>
                  <span className="text-xs text-amber-400 uppercase tracking-widest font-bold">
                    {t.guidanceDominantGuna}
                  </span>
                  <h4 className="text-2xl font-bold font-serif text-slate-100 capitalize mt-1">
                    {gunaResult.dominantGuna} {language === 'hi' ? 'गुण की प्रधानता' : language === 'te' ? 'గుణ ప్రాధాన్యత' : 'Dominant Guna'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    {gunaResult.analysis}
                  </p>
                </div>

                {/* Score breakdown bars */}
                {(() => {
                  const total = (gunaResult.sattvaScore + gunaResult.rajasScore + gunaResult.tamasScore) || 1;
                  const sattvaPct = Math.round((gunaResult.sattvaScore / total) * 100);
                  const rajasPct = Math.round((gunaResult.rajasScore / total) * 100);
                  const tamasPct = 100 - sattvaPct - rajasPct;
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl">
                        <div className="flex justify-between items-center text-xs font-bold text-emerald-300 mb-1">
                          <span>Sattva (सत्त्व)</span>
                          <span>{sattvaPct}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div className="bg-emerald-400 h-full rounded-full transition-all duration-700" style={{ width: `${sattvaPct}%` }} />
                        </div>
                        <span className="text-[11px] text-slate-400 mt-2 block">
                          {language === 'hi' ? 'प्रकाश, शांति एवं आत्म-ज्ञान' : language === 'te' ? 'ప్రకాశం, శాంతి మరియు జ్ఞానం' : 'Purity, clarity & equilibrium'}
                        </span>
                      </div>

                      <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-2xl">
                        <div className="flex justify-between items-center text-xs font-bold text-amber-300 mb-1">
                          <span>Rajas (रजस्)</span>
                          <span>{rajasPct}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div className="bg-amber-400 h-full rounded-full transition-all duration-700" style={{ width: `${rajasPct}%` }} />
                        </div>
                        <span className="text-[11px] text-slate-400 mt-2 block">
                          {language === 'hi' ? 'उत्साह, कर्म एवं वासना' : language === 'te' ? 'ఉత్సాహం, ఆవేశం & చంచలత్వం' : 'Passion, action & ambition'}
                        </span>
                      </div>

                      <div className="p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-2xl">
                        <div className="flex justify-between items-center text-xs font-bold text-indigo-300 mb-1">
                          <span>Tamas (तमस्)</span>
                          <span>{tamasPct}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div className="bg-indigo-400 h-full rounded-full transition-all duration-700" style={{ width: `${tamasPct}%` }} />
                        </div>
                        <span className="text-[11px] text-slate-400 mt-2 block">
                          {language === 'hi' ? 'आलस्य, भ्रम एवं जड़ता' : language === 'te' ? 'బద్ధకం, అలసట & అజ్ఞానం' : 'Inertia, darkness & rest'}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                    <h5 className="font-bold text-amber-300 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Activity className="w-4 h-4" /> {language === 'hi' ? 'दैनिक आध्यात्मिक साधना' : language === 'te' ? 'రోజువారీ ఆధ్యాత్మిక సాధన' : 'Recommended Daily Practice'}
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {gunaResult.recommendations.spiritualPractice}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                    <h5 className="font-bold text-rose-300 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Heart className="w-4 h-4" /> {language === 'hi' ? 'आहार एवं जीवनशैली' : language === 'te' ? 'ఆహారం & జీవన విధానం' : 'Diet & Lifestyle'}
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {gunaResult.recommendations.diet}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
