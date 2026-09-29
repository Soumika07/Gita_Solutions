import { SupportedLanguage } from '../context/LanguageContext.tsx';

export interface Translations {
  // Navigation & Brand
  platformTitle: string;
  platformSubtitle: string;
  tagline: string;
  navSanctuary: string;
  navExplorer: string;
  navEmotions: string;
  navGuidance: string;
  navWellness: string;
  navLearning: string;
  navSoulJourney: string;
  navSafetyAdmin: string;
  crisisSupport: string;
  ambientOm: string;
  omPlaying: string;
  languageSelect: string;
  
  // Common Actions
  listen: string;
  stopListening: string;
  bookmark: string;
  bookmarked: string;
  share: string;
  copied: string;
  send: string;
  clear: string;
  reset: string;
  loading: string;
  searchPlaceholder: string;
  all: string;
  close: string;
  explore: string;
  learnMore: string;

  // Home / Opening Page
  homeHeroKicker: string;
  homeHeroTitle: string;
  homeHeroSubtitle: string;
  homeStartKrishnaDialogue: string;
  homeExploreVerses: string;
  homeDailyShlokaTitle: string;
  homeQuickChantTitle: string;
  homeQuickChantSubtitle: string;
  homeQuickChantBtn: string;
  homeQuickChantActive: string;
  homeStopChant: string;
  homeEmotionTriageTitle: string;
  homeEmotionTriageSubtitle: string;
  homePillarsTitle: string;
  homeStreakDays: string;
  homeVersesRead: string;
  homeChantsDone: string;
  homeMeditationMinutes: string;

  // Chatbot Module
  chatHeaderTitle: string;
  chatHeaderSubtitle: string;
  chatWelcomeMessage: string;
  chatRoleArjuna: string;
  chatRoleSeeker: string;
  chatRoleProfessional: string;
  chatRoleStudent: string;
  chatRoleSelector: string;
  chatInputPlaceholder: string;
  chatSuggestedQuestions: string;
  chatAskKrishnaBtn: string;
  chatReferencedVerses: string;
  chatDisclaimer: string;
  ttsHindi: string;
  ttsTelugu: string;
  ttsEnglish: string;
  ttsPlaying: string;
  ttsPaused: string;
  ttsLoading: string;
  ttsSpeed: string;
  ttsVoice: string;
  ttsDivineAudio: string;
  ttsNativeAudio: string;
  ttsStopAudio: string;
  ttsPlaybackRate: string;
  ttsAutoVoice: string;
  ttsVoiceSettings: string;

  // Knowledge Module
  knowledgeHeaderTitle: string;
  knowledgeHeaderSubtitle: string;
  knowledgeFilterYoga: string;
  knowledgeChaptersCount: string;
  knowledgeVerseExplainerTitle: string;
  knowledgeVerseExplainerDesc: string;
  knowledgeAskAiExplain: string;
  knowledgeContextPrompt: string;
  knowledgeContextPlaceholder: string;
  knowledgeGeneratingAnalysis: string;
  knowledgeSanskritScript: string;
  knowledgeTeluguScript: string;
  knowledgeDevanagariScript: string;
  knowledgeWordMeaning: string;
  knowledgeKeyTakeaway: string;
  knowledgeCommentary: string;

  // Emotion Module
  emotionHeaderTitle: string;
  emotionHeaderSubtitle: string;
  emotionInputPlaceholder: string;
  emotionAnalyzeBtn: string;
  emotionPresetsTitle: string;
  emotionPrimaryFeeling: string;
  emotionGunaState: string;
  emotionPrescribedShloka: string;
  emotionSpiritualRemedy: string;
  emotionBreathingExercise: string;
  emotionMindsetShift: string;
  emotionStartBreathing: string;
  emotionPauseBreathing: string;
  emotionInhale: string;
  emotionHold: string;
  emotionExhale: string;
  emotionHoldEmpty: string;

  // Personalized Guidance Module
  guidanceHeaderTitle: string;
  guidanceHeaderSubtitle: string;
  guidanceTabDilemma: string;
  guidanceTabGunaQuiz: string;
  guidanceDilemmaInputPlaceholder: string;
  guidanceCategoryLabel: string;
  guidanceResolveBtn: string;
  guidanceDharmaPerspective: string;
  guidanceNishkamaKarmaAction: string;
  guidanceRecommendedYoga: string;
  guidanceActionPlan: string;
  guidanceSacredAffirmation: string;
  guidanceGunaQuizIntro: string;
  guidanceGunaSubmit: string;
  guidanceDominantGuna: string;

  // Wellness & Reflection Module
  wellnessHeaderTitle: string;
  wellnessHeaderSubtitle: string;
  wellnessTabMeditation: string;
  wellnessTabJapa: string;
  wellnessTabJournal: string;
  wellnessMeditationTitle: string;
  wellnessStartMeditation: string;
  wellnessPauseMeditation: string;
  wellnessResetTimer: string;
  wellnessJapaTitle: string;
  wellnessJapaSubtitle: string;
  wellnessBeadCount: string;
  wellnessRoundsCompleted: string;
  wellnessTapBead: string;
  wellnessJournalPromptTitle: string;
  wellnessJournalPlaceholder: string;
  wellnessMoodRatingLabel: string;
  wellnessSaveReflection: string;
  wellnessAiMentorFeedback: string;

  // Daily Learning Module
  learningHeaderTitle: string;
  learningHeaderSubtitle: string;
  learningShlokaOfDay: string;
  learningQuizTitle: string;
  learningSubmitAnswer: string;
  learningNextQuestion: string;
  learningQuizCompleted: string;
  learningScore: string;
  learningRestartQuiz: string;

  // Progress Module
  progressHeaderTitle: string;
  progressHeaderSubtitle: string;
  progressStreak: string;
  progressBadgesTitle: string;
  progressSavedVersesTitle: string;
  progressNoBookmarks: string;

  // Emergency Modal
  emergencyModalTitle: string;
  emergencyModalSubtitle: string;
  emergencyCompassionNote: string;
  emergencyIndiaHotlines: string;
  emergencyGlobalHotlines: string;
  emergencyCallNow: string;

  // Footer
  footerMantra: string;
  footerMantraMeaning: string;
  footerDisclaimer: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  en: {
    platformTitle: "Gita AI",
    platformSubtitle: "Wisdom Platform",
    tagline: "Spiritual Intelligence & Bhagavad Gita Guidance Platform",
    navSanctuary: "Opening Sanctuary",
    navExplorer: "Gita Explorer",
    navEmotions: "Emotion Healing",
    navGuidance: "Life Dilemmas & Gunas",
    navWellness: "Wellness & Japa",
    navLearning: "Daily Learning",
    navSoulJourney: "Soul Journey",
    navSafetyAdmin: "Safety & Admin",
    crisisSupport: "Crisis Support",
    ambientOm: "Ambient Om",
    omPlaying: "Om Playing",
    languageSelect: "Language",

    listen: "Listen",
    stopListening: "Stop",
    bookmark: "Bookmark",
    bookmarked: "Bookmarked",
    share: "Share",
    copied: "Copied!",
    send: "Send",
    clear: "Clear",
    reset: "Reset",
    loading: "Consulting Gita wisdom...",
    searchPlaceholder: "Search verses, concepts, emotions, or chapter numbers...",
    all: "All",
    close: "Close",
    explore: "Explore",
    learnMore: "Learn More",

    homeHeroKicker: "Sacred Spiritual Intelligence",
    homeHeroTitle: "Timeless Wisdom of the Gita for Modern Life",
    homeHeroSubtitle: "Embark upon an enlightening dialogue with Sri Krishna. Overcome anxiety, conquer moral paralysis, harmonise your Gunas, and find inner peace through the 700 verses of the Bhagavad Gita.",
    homeStartKrishnaDialogue: "Converse with Krishna",
    homeExploreVerses: "Explore 18 Chapters",
    homeDailyShlokaTitle: "Verse of the Day (Spotlight)",
    homeQuickChantTitle: "1-Minute Mindfulness & Sacred Chant",
    homeQuickChantSubtitle: "Centering meditation with sacred Hare Krishna chant & 528Hz bell tone.",
    homeQuickChantBtn: "Start 1-Min Centering",
    homeQuickChantActive: "Centering in progress...",
    homeStopChant: "End Session",
    homeEmotionTriageTitle: "Quick Emotional Sanctuary",
    homeEmotionTriageSubtitle: "Select what stirs within you right now for an immediate scriptural balm.",
    homePillarsTitle: "Four Sacred Paths of the Gita",
    homeStreakDays: "Day Streak",
    homeVersesRead: "Verses Contemplated",
    homeChantsDone: "Japa Mantras",
    homeMeditationMinutes: "Meditation Mins",

    chatHeaderTitle: "Divine Dialogue with Sri Krishna",
    chatHeaderSubtitle: "Speak freely as Arjuna to the Supreme Charioteer and receive compassionate, verse-grounded counsel.",
    chatWelcomeMessage: "O noble seeker, welcome. As once I stood with Arjuna upon the chariot at Kurukshetra when doubt darkened his resolve, so now I stand with you.\n\nWhatever grief, hesitation, battle of duty, or yearning for peace fills your heart today, lay it before Me. Speak freely as friend to Friend. What weighs upon your spirit?",
    chatRoleArjuna: "Arjuna (Warrior in Crisis)",
    chatRoleSeeker: "Sincere Seeker",
    chatRoleProfessional: "Modern Professional",
    chatRoleStudent: "Student / Learner",
    chatRoleSelector: "Your Perspective:",
    chatInputPlaceholder: "Share your life dilemma, moral struggle, or feeling...",
    chatSuggestedQuestions: "Suggested Inquiries:",
    chatAskKrishnaBtn: "Ask Krishna",
    chatReferencedVerses: "Referenced Gita Shlokas:",
    chatDisclaimer: "Sri Krishna's guidance here is inspired by the philosophical teachings of the Bhagavad Gita.",
    ttsHindi: "Hindi Audio",
    ttsTelugu: "Telugu Audio",
    ttsEnglish: "English Audio",
    ttsPlaying: "Speaking Sri Krishna's words...",
    ttsPaused: "Audio Paused",
    ttsLoading: "Synthesizing divine voice...",
    ttsSpeed: "Speed",
    ttsVoice: "Voice",
    ttsDivineAudio: "Divine Voice (Gemini TTS)",
    ttsNativeAudio: "Browser Speech Voice",
    ttsStopAudio: "Stop Voice",
    ttsPlaybackRate: "Speech Speed",
    ttsAutoVoice: "Auto-Speak Response",
    ttsVoiceSettings: "Voice Sanctuary",

    knowledgeHeaderTitle: "Bhagavad Gita Knowledge Explorer",
    knowledgeHeaderSubtitle: "Explore all 18 Chapters, 700 Verses, Sanskrit original, English, Hindi, and Telugu meanings with modern psychological application.",
    knowledgeFilterYoga: "Filter by Yoga Path:",
    knowledgeChaptersCount: "18 Sacred Chapters",
    knowledgeVerseExplainerTitle: "Modern Life Application Engine",
    knowledgeVerseExplainerDesc: "Understand how this ancient shloka resolves 21st-century stress, career burnout, relationships, and mental quietude.",
    knowledgeAskAiExplain: "Generate Modern Commentary",
    knowledgeContextPrompt: "Your specific life situation (optional):",
    knowledgeContextPlaceholder: "e.g., Struggling with demanding work deadlines and fear of losing my job...",
    knowledgeGeneratingAnalysis: "Generating in-depth philosophical commentary...",
    knowledgeSanskritScript: "Devanagari Sanskrit",
    knowledgeTeluguScript: "Telugu Script (తెలుగు లిపి)",
    knowledgeDevanagariScript: "Devanagari (देवनागरी)",
    knowledgeWordMeaning: "Word-by-Word Breakdown",
    knowledgeKeyTakeaway: "Core Spiritual Principle",
    knowledgeCommentary: "Illuminating Commentary",

    emotionHeaderTitle: "Gita Emotion Healing & Ayurveda Diagnostics",
    emotionHeaderSubtitle: "Map your psychological turbulence into Gunas (Sattva, Rajas, Tamas) and discover therapeutic shlokas, pranayama, and mindset shifts.",
    emotionInputPlaceholder: "Describe what you are feeling in your heart or mind right now...",
    emotionAnalyzeBtn: "Analyze Emotion & Prescribe Shloka",
    emotionPresetsTitle: "Common Emotional States:",
    emotionPrimaryFeeling: "Primary Emotion Detected",
    emotionGunaState: "Dominant Guna State",
    emotionPrescribedShloka: "Prescribed Sacred Shloka",
    emotionSpiritualRemedy: "Spiritual Remedy (Gita Psychology)",
    emotionBreathingExercise: "Prescribed Breathing Exercise (Pranayama)",
    emotionMindsetShift: "Conscious Mindset Shift",
    emotionStartBreathing: "Start Breathwork Pacer",
    emotionPauseBreathing: "Pause Breathwork",
    emotionInhale: "Inhale Slowly (4s)",
    emotionHold: "Hold Calmly (4s)",
    emotionExhale: "Exhale Gently (4s)",
    emotionHoldEmpty: "Rest Empty (4s)",

    guidanceHeaderTitle: "Personalized Guidance & Guna Assessment",
    guidanceHeaderSubtitle: "Untangle ethical crossroads through Dharma and discover your predominant Guna balance.",
    guidanceTabDilemma: "Dilemma Resolution",
    guidanceTabGunaQuiz: "3 Gunas Assessment",
    guidanceDilemmaInputPlaceholder: "Describe your dilemma (e.g., career switch vs stability, difficult relationship decision, duty vs personal ambition)...",
    guidanceCategoryLabel: "Category of Dilemma",
    guidanceResolveBtn: "Resolve Through Gita Wisdom",
    guidanceDharmaPerspective: "Dharma & Cosmic Harmony Perspective",
    guidanceNishkamaKarmaAction: "Nishkama Karma Action (Selfless Execution)",
    guidanceRecommendedYoga: "Recommended Yoga Path",
    guidanceActionPlan: "Four-Step Action Plan",
    guidanceSacredAffirmation: "Empowering Sacred Affirmation",
    guidanceGunaQuizIntro: "Discover whether Sattva (harmony), Rajas (action/restlessness), or Tamas (inertia) governs your current state.",
    guidanceGunaSubmit: "Calculate My Guna Balance",
    guidanceDominantGuna: "Your Dominant Guna",

    wellnessHeaderTitle: "Spiritual Wellness, Japa & Contemplation",
    wellnessHeaderSubtitle: "Cultivate Sthitaprajna (steady intellect) through sacred meditation, 108 Japa beads, and daily reflective journaling.",
    wellnessTabMeditation: "Meditation Timer",
    wellnessTabJapa: "108 Japa Mala",
    wellnessTabJournal: "Daily Soul Journal",
    wellnessMeditationTitle: "Silent Stillness & Sacred Chant",
    wellnessStartMeditation: "Begin Meditation",
    wellnessPauseMeditation: "Pause",
    wellnessResetTimer: "Reset Timer",
    wellnessJapaTitle: "108 Beads Sacred Chanting",
    wellnessJapaSubtitle: "Count each bead with sincere remembrance of the Divine Name.",
    wellnessBeadCount: "Bead Count",
    wellnessRoundsCompleted: "Mala Rounds Completed",
    wellnessTapBead: "Tap to Chant (One Bead)",
    wellnessJournalPromptTitle: "Contemplative Reflection Prompt",
    wellnessJournalPlaceholder: "Pour your honest thoughts, doubts, and inner reflections here...",
    wellnessMoodRatingLabel: "Current Emotional State (1 = Very Heavy, 10 = Deep Peace):",
    wellnessSaveReflection: "Submit Reflection for Spiritual Feedback",
    wellnessAiMentorFeedback: "Sri Krishna's Reflective Feedback",

    learningHeaderTitle: "Daily Learning & Gita Wisdom Quiz",
    learningHeaderSubtitle: "Deepen your scriptural knowledge day by day with the Verse of the Day and interactive quizzes.",
    learningShlokaOfDay: "Daily Shloka of Contemplation",
    learningQuizTitle: "Daily Gita Wisdom Quiz",
    learningSubmitAnswer: "Submit Answer",
    learningNextQuestion: "Next Question",
    learningQuizCompleted: "Quiz Completed!",
    learningScore: "Your Score",
    learningRestartQuiz: "Retake Quiz",

    progressHeaderTitle: "Soul Journey & Spiritual Progress",
    progressHeaderSubtitle: "Track your consistency, bookmarked verses, japa rounds, and unlocked badges of wisdom.",
    progressStreak: "Consecutive Days Streak",
    progressBadgesTitle: "Spiritual Milestones & Badges",
    progressSavedVersesTitle: "Your Bookmarked Shlokas",
    progressNoBookmarks: "No bookmarked verses yet. Explore the 18 chapters and bookmark verses that resonate with your soul.",

    emergencyModalTitle: "Sacred Care & Crisis Support",
    emergencyModalSubtitle: "Immediate compassionate human help is available 24/7.",
    emergencyCompassionNote: "While the Bhagavad Gita offers timeless wisdom, severe emotional pain or crisis deserves caring, immediate human ears. You are never alone.",
    emergencyIndiaHotlines: "India Helplines (24/7 Toll-Free)",
    emergencyGlobalHotlines: "Global & US/Canada Helplines",
    emergencyCallNow: "Call Now",

    footerMantra: "ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः। सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत्॥",
    footerMantraMeaning: "May all beings be happy. May all beings be free from illness. May all see what is auspicious. May no one suffer.",
    footerDisclaimer: "Gita AI Wisdom Platform is an educational spiritual philosophy platform rooted in the Bhagavad Gita. For urgent psychological or psychiatric help, please connect with 24/7 crisis hotlines."
  },

  hi: {
    platformTitle: "गीता एआई",
    platformSubtitle: "ज्ञान मंच",
    tagline: "श्रीमद्भगवद्गीता का दिव्य आध्यात्मिक मार्गदर्शन एवं जीवन प्रबंधन मंच",
    navSanctuary: "आरंभिक धाम",
    navExplorer: "गीता अन्वेषक",
    navEmotions: "भाव उपचार",
    navGuidance: "जीवन धर्म व त्रिगुण",
    navWellness: "साधना व जप",
    navLearning: "दैनिक स्वाध्याय",
    navSoulJourney: "आत्म यात्रा",
    navSafetyAdmin: "सुरक्षा व ऑडिट",
    crisisSupport: "संकट सहायता",
    ambientOm: "ॐ नाद",
    omPlaying: "ॐ बज रहा है",
    languageSelect: "भाषा",

    listen: "सुनें",
    stopListening: "रोकें",
    bookmark: "सुरक्षित करें",
    bookmarked: "सुरक्षित",
    share: "साझा करें",
    copied: "कॉपी हो गया!",
    send: "भेजें",
    clear: "साफ़ करें",
    reset: "रीसेट",
    loading: "गीता ज्ञान का मंथन हो रहा है...",
    searchPlaceholder: "श्लोक, विषय, मनोभाव या अध्याय संख्या खोजें...",
    all: "सभी",
    close: "बंद करें",
    explore: "अन्वेषण करें",
    learnMore: "और जानें",

    homeHeroKicker: "दिव्य आध्यात्मिक प्रज्ञा",
    homeHeroTitle: "आधुनिक जीवन के लिए श्रीमद्भगवद्गीता का शाश्वत ज्ञान",
    homeHeroSubtitle: "भगवान श्रीकृष्ण के साथ पावन संवाद करें। अपने संशयों, भय, मानसिक तनाव और त्रिगुणों को संतुलित कर 700 श्लोकों के प्रकाश में परम शांति प्राप्त करें।",
    homeStartKrishnaDialogue: "श्रीकृष्ण से संवाद करें",
    homeExploreVerses: "18 अध्यायों का अन्वेषण करें",
    homeDailyShlokaTitle: "आज का पावन श्लोक (विशेष)",
    homeQuickChantTitle: "1-मिनट ध्यान व पावन नाम जप",
    homeQuickChantSubtitle: "हरे राम हरे कृष्ण महामंत्र एवं 528Hz पावन ध्वनि से मन को शांत करें।",
    homeQuickChantBtn: "1-मिनट ध्यान आरंभ करें",
    homeQuickChantActive: "ध्यान जारी है...",
    homeStopChant: "समाप्त करें",
    homeEmotionTriageTitle: "त्वरित मनोभाव उपचार",
    homeEmotionTriageSubtitle: "अपने वर्तमान मनोभाव का चयन करें और गीता के श्लोक से तुरंत सांत्वना व समाधान पाएं।",
    homePillarsTitle: "गीता के चार पावन योग मार्ग",
    homeStreakDays: "दिनों की निरंतरता",
    homeVersesRead: "अध्ययन किए गए श्लोक",
    homeChantsDone: "जप संख्या",
    homeMeditationMinutes: "ध्यान मिनट",

    chatHeaderTitle: "भगवान श्रीकृष्ण से दिव्य संवाद",
    chatHeaderSubtitle: "कुरुक्षेत्र के पार्थ की भांति निष्कपट होकर परम सारथी श्रीकृष्ण के समक्ष अपने संशय रखें।",
    chatWelcomeMessage: "हे प्रिय आत्मा, आपका स्वागत है। जैसे एक समय कुरुक्षेत्र के रणक्षेत्र में जब अर्जुन विषाद और मोह से घिर गए थे, तब मैंने उनका मार्ग प्रशस्त किया था, वैसे ही आज मैं आपके साथ हूँ।\n\nआपके हृदय में जो भी संशय, भय, कर्तव्य-द्वंद्व अथवा शांति की अभिलाषा हो, उसे निःसंकोच मेरे समक्ष प्रस्तुत करें। सखा भाव से कहें—आपका मन किस बात से व्यथित है?",
    chatRoleArjuna: "अर्जुन (संकट में योद्धा)",
    chatRoleSeeker: "सच्चा जिज्ञासु",
    chatRoleProfessional: "आधुनिक कर्मयोगी",
    chatRoleStudent: "विद्यार्थी / अध्येता",
    chatRoleSelector: "आपकी भूमिका:",
    chatInputPlaceholder: "अपने मन की दुविधा, नैतिक संकट या भावना यहाँ लिखें...",
    chatSuggestedQuestions: "सुझाए गए प्रश्न:",
    chatAskKrishnaBtn: "श्रीकृष्ण से पूछें",
    chatReferencedVerses: "संदर्भित गीता श्लोक:",
    chatDisclaimer: "यहाँ भगवान श्रीकृष्ण का परामर्श श्रीमद्भगवद्गीता के सार्वभौमिक सिद्धांतों पर आधारित है।",
    ttsHindi: "हिन्दी वाणी (ऑडियो)",
    ttsTelugu: "तेलुगु वाणी (ఆడియో)",
    ttsEnglish: "अंग्रेज़ी वाणी",
    ttsPlaying: "भगवान श्रीकृष्ण की दिव्य वाणी गूँज रही है...",
    ttsPaused: "वाणी रुकी हुई है",
    ttsLoading: "दिव्य वाणी तैयार हो रही है...",
    ttsSpeed: "गति",
    ttsVoice: "स्वर",
    ttsDivineAudio: "दिव्य स्वर (Gemini TTS)",
    ttsNativeAudio: "ब्राउज़र ध्वनि प्रणाली",
    ttsStopAudio: "वाणी रोकें",
    ttsPlaybackRate: "वाणी की गति",
    ttsAutoVoice: "उत्तर का स्वतः वाचन",
    ttsVoiceSettings: "वाणी अनुभाग",

    knowledgeHeaderTitle: "भगवद्गीता ज्ञान अन्वेषक",
    knowledgeHeaderSubtitle: "सभी 18 अध्याय, 700 श्लोक, मूल संस्कृत, हिन्दी व तेलुगु अनुवाद तथा आधुनिक मनोवैज्ञानिक अनुप्रयोग का अध्ययन करें।",
    knowledgeFilterYoga: "योग मार्ग द्वारा फ़िल्टर करें:",
    knowledgeChaptersCount: "18 पावन अध्याय",
    knowledgeVerseExplainerTitle: "आधुनिक जीवन अनुप्रयोग इंजन",
    knowledgeVerseExplainerDesc: "जानें कि यह प्राचीन श्लोक आज के तनाव, करियर की चिंता, संबंधों की उलझन और मानसिक शांति में कैसे उपयोगी है।",
    knowledgeAskAiExplain: "आधुनिक भाष्य तैयार करें",
    knowledgeContextPrompt: "आपकी विशिष्ट परिस्थिति (वैकल्पिक):",
    knowledgeContextPlaceholder: "उदा. कार्यस्थल का भारी तनाव और असफलता का भय...",
    knowledgeGeneratingAnalysis: "गहन आध्यात्मिक व्याख्या तैयार हो रही है...",
    knowledgeSanskritScript: "देवनागरी संस्कृत",
    knowledgeTeluguScript: "तेलुगु लिपि (తెలుగు లిపి)",
    knowledgeDevanagariScript: "देवनागरी (देवनागरी)",
    knowledgeWordMeaning: "पदच्छेद एवं शब्दार्थ",
    knowledgeKeyTakeaway: "मूल आध्यात्मिक सिद्धांत",
    knowledgeCommentary: "प्रकाशमान भाष्य",

    emotionHeaderTitle: "गीता भाव उपचार एवं आयुर्वेद निदान",
    emotionHeaderSubtitle: "अपनी मानसिक अशांति को त्रिगुणों (सत्त्व, रज, तम) में पहचानें और उपचारात्मक श्लोक, प्राणायाम व दृष्टि-परिवर्तन प्राप्त करें।",
    emotionInputPlaceholder: "इस समय आपके मन या हृदय में जो भी भाव उठ रहा है, उसे यहाँ व्यक्त करें...",
    emotionAnalyzeBtn: "भाव का विश्लेषण करें और श्लोक पाएं",
    emotionPresetsTitle: "सामान्य मानसिक अवस्थाएं:",
    emotionPrimaryFeeling: "पहचाना गया मुख्य मनोभाव",
    emotionGunaState: "प्रमुख गुण की स्थिति",
    emotionPrescribedShloka: "निर्धारित पावन श्लोक",
    emotionSpiritualRemedy: "आध्यात्मिक समाधान (गीता मनोविज्ञान)",
    emotionBreathingExercise: "निर्धारित प्राणायाम विधि",
    emotionMindsetShift: "दृष्टिकोण में परिवर्तन",
    emotionStartBreathing: "श्वास-प्रश्वास अभ्यास आरंभ करें",
    emotionPauseBreathing: "अभ्यास रोकें",
    emotionInhale: "धीरे-धीरे श्वास लें (4 से.)",
    emotionHold: "सहजता से रोकें (4 से.)",
    emotionExhale: "धीरे-धीरे श्वास छोड़ें (4 से.)",
    emotionHoldEmpty: "रिक्त रहकर शांत रहें (4 से.)",

    guidanceHeaderTitle: "व्यक्तिगत मार्गदर्शन एवं त्रिगुण परीक्षण",
    guidanceHeaderSubtitle: "धर्म के प्रकाश में नैतिक दुविधाओं को सुलझाएं और अपने भीतर सत्त्व, रज व तम का संतुलन जानें।",
    guidanceTabDilemma: "धर्म संकट व दुविधा समाधान",
    guidanceTabGunaQuiz: "त्रिगुण परीक्षण",
    guidanceDilemmaInputPlaceholder: "अपनी दुविधा का वर्णन करें (उदा. करियर बनाम आत्मसंतुष्टि, कठिन पारिवारिक निर्णय, कर्तव्य बनाम व्यक्तिगत इच्छा)...",
    guidanceCategoryLabel: "दुविधा की श्रेणी",
    guidanceResolveBtn: "गीता ज्ञान द्वारा समाधान पाएं",
    guidanceDharmaPerspective: "धर्म एवं समष्टिगत कल्याण का दृष्टिकोण",
    guidanceNishkamaKarmaAction: "निष्काम कर्म (फल की आसक्ति रहित कर्म)",
    guidanceRecommendedYoga: "अनुशंसित योग मार्ग",
    guidanceActionPlan: "चार चरणों की कार्ययोजना",
    guidanceSacredAffirmation: "दिव्य संकल्प एवं पुष्टि",
    guidanceGunaQuizIntro: "जानिए कि इस समय आपके स्वभाव में सत्त्व (प्रकाश), रज (अशांति/कामना) या तम (प्रमाद/जड़ता) में से किसकी प्रधानता है।",
    guidanceGunaSubmit: "मेरे त्रिगुणों का संतुलन निकालें",
    guidanceDominantGuna: "आपका प्रधान गुण",

    wellnessHeaderTitle: "आध्यात्मिक साधना, नाम जप एवं आत्मनिरीक्षण",
    wellnessHeaderSubtitle: "शांत ध्यान, 108 मनकों की जपमाला और दैनिक स्वाध्याय डायरी द्वारा स्थितप्रज्ञता का अभ्यास करें।",
    wellnessTabMeditation: "ध्यान टाइमर",
    wellnessTabJapa: "108 जप माला",
    wellnessTabJournal: "दैनिक आत्म-डायरी",
    wellnessMeditationTitle: "मौन स्थिरता एवं पावन महामंत्र",
    wellnessStartMeditation: "ध्यान आरंभ करें",
    wellnessPauseMeditation: "रोकें",
    wellnessResetTimer: "टाइमर रीसेट करें",
    wellnessJapaTitle: "108 मनकों का पावन नाम जप",
    wellnessJapaSubtitle: "ईश्वर के पावन नाम के स्मरण के साथ प्रत्येक मनके का स्पर्श करें।",
    wellnessBeadCount: "मनका संख्या",
    wellnessRoundsCompleted: "पूर्ण की गई मालाएं",
    wellnessTapBead: "जप हेतु स्पर्श करें (एक मनका)",
    wellnessJournalPromptTitle: "दैनिक आत्म-मंथन प्रश्न",
    wellnessJournalPlaceholder: "अपने आंतरिक विचार, संशय और साधना के अनुभव यहाँ लिखें...",
    wellnessMoodRatingLabel: "वर्तमान मानसिक अवस्था (1 = भारी अशांति, 10 = परम शांति):",
    wellnessSaveReflection: "मार्गदर्शन हेतु डायरी प्रविष्टि भेजें",
    wellnessAiMentorFeedback: "श्रीकृष्ण का प्रेरक मार्गदर्शन",

    learningHeaderTitle: "दैनिक स्वाध्याय एवं गीता ज्ञान प्रश्नोत्तरी",
    learningHeaderSubtitle: "प्रतिदिन एक श्लोक के गहन मनन और ज्ञानवर्धक प्रश्नोत्तरी से अपनी प्रज्ञा को निखारें।",
    learningShlokaOfDay: "आज का स्वाध्याय श्लोक",
    learningQuizTitle: "दैनिक गीता प्रश्नोत्तरी",
    learningSubmitAnswer: "उत्तर जांचें",
    learningNextQuestion: "अगला प्रश्न",
    learningQuizCompleted: "प्रश्नोत्तरी पूर्ण हुई!",
    learningScore: "आपका प्राप्तांक",
    learningRestartQuiz: "पुनः प्रयास करें",

    progressHeaderTitle: "आत्म यात्रा एवं आध्यात्मिक प्रगति",
    progressHeaderSubtitle: "अपनी स्वाध्याय निरंतरता, सहेजे गए श्लोक, जप संख्या और प्राप्त की गई उपलब्धियों का अवलोकन करें।",
    progressStreak: "लगातार स्वाध्याय दिवस",
    progressBadgesTitle: "आध्यात्मिक मील के पत्थर व उपाधियां",
    progressSavedVersesTitle: "आपके द्वारा सहेजे गए श्लोक",
    progressNoBookmarks: "अभी कोई श्लोक सहेजा नहीं गया है। 18 अध्यायों में जाएं और जो श्लोक आपके हृदय को छूएं, उन्हें सहेजें।",

    emergencyModalTitle: "पावन संबल एवं संकट सहायता",
    emergencyModalSubtitle: "संवेदनशील मानवीय सहायता 24/7 निःशुल्क उपलब्ध है।",
    emergencyCompassionNote: "यद्यपि श्रीमद्भगवद्गीता शाश्वत आध्यात्मिक संबल प्रदान करती है, अत्यधिक मानसिक संकट में तुरंत किसी संवेदनशील विशेषज्ञ से बात करना अत्यंत आवश्यक है। आप कभी अकेले नहीं हैं।",
    emergencyIndiaHotlines: "भारत राष्ट्रीय हेल्पलाइन (24/7 निःशुल्क)",
    emergencyGlobalHotlines: "अंतर्राष्ट्रीय व अमेरिका/कनाडा हेल्पलाइन",
    emergencyCallNow: "तुरंत कॉल करें",

    footerMantra: "ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः। सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत्॥",
    footerMantraMeaning: "सभी सुखी हों, सभी रोगमुक्त रहें, सभी का कल्याण हो, कोई भी दुःख का भागी न बने।",
    footerDisclaimer: "गीता एआई प्लेटफॉर्म श्रीमद्भगवद्गीता पर आधारित एक आध्यात्मिक-दार्शनिक साधन है। गंभीर मानसिक संकट में कृपया तुरंत 24/7 हेल्पलाइन या चिकित्सक से संपर्क करें।"
  },

  te: {
    platformTitle: "గీతా ఏఐ",
    platformSubtitle: "జ్ఞాన వేదిక",
    tagline: "ఆధునిక జీవనానికి శ్రీమద్భగవద్గీత దివ్య జ్ఞానం మరియు ఆధ్యాత్మిక మార్గదర్శక వేదిక",
    navSanctuary: "ప్రారంభ ధామం",
    navExplorer: "గీతా అన్వేషణ",
    navEmotions: "భావోద్వేగ సాంత్వన",
    navGuidance: "ధర్మ సందేహాలు & గుణాలు",
    navWellness: "ధ్యానం & జపం",
    navLearning: "నిత్య స్వాధ్యాయం",
    navSoulJourney: "ఆత్మ ప్రయాణం",
    navSafetyAdmin: "భద్రత & అడ్మిన్",
    crisisSupport: "అత్యవసర సహాయం",
    ambientOm: "ఓం నాదం",
    omPlaying: "ఓం మోగుతోంది",
    languageSelect: "భాష",

    listen: "వినండి",
    stopListening: "ఆపండి",
    bookmark: "బుక్‌మార్క్",
    bookmarked: "సేవ్ చేయబడింది",
    share: "షేర్ చేయండి",
    copied: "కాపీ అయింది!",
    send: "పంపండి",
    clear: "క్లియర్",
    reset: "రీసెట్",
    loading: "భగవద్గీత జ్ఞాన మథనం జరుగుతోంది...",
    searchPlaceholder: "శ్లోకాలు, భావాలు, అధ్యాయం సంఖ్య శోధించండి...",
    all: "అన్నీ",
    close: "మూసివేయి",
    explore: "అన్వేషించండి",
    learnMore: "మరింత తెలుసుకోండి",

    homeHeroKicker: "దివ్య ఆధ్యాత్మిక జ్ఞానం",
    homeHeroTitle: "ఆధునిక జీవనానికి భగవద్గీత అమృత వాక్కులు",
    homeHeroSubtitle: "శ్రీకృష్ణునితో పవిత్ర సంభాషణ చేయండి. ఆందోళన, కర్తవ్య సందిగ్ధత, నిరాశలను అధిగమించి, 700 శ్లోకాల వెలుగులో అంతఃశాంతిని పొందండి.",
    homeStartKrishnaDialogue: "శ్రీకృష్ణునితో సంభాషించండి",
    homeExploreVerses: "18 అధ్యాయాల అన్వేషణ",
    homeDailyShlokaTitle: "నేటి శ్లోక రత్నం (ప్రత్యేకం)",
    homeQuickChantTitle: "1-నిమిషం ధ్యానం & నామ జపం",
    homeQuickChantSubtitle: "హరే రామ హరే కృష్ణ మహామంత్రం మరియు 528Hz పవిత్ర నాదంతో మనస్సును ప్రశాంతం చేసుకోండి.",
    homeQuickChantBtn: "1-నిమిషం ధ్యానం ప్రారంభించండి",
    homeQuickChantActive: "ధ్యానం కొనసాగుతోంది...",
    homeStopChant: "ముగించండి",
    homeEmotionTriageTitle: "భావోద్వేగ తక్షణ సాంత్వన",
    homeEmotionTriageSubtitle: "ఈ క్షణం మీ మనస్సులో ఉన్న భావాన్ని ఎంచుకుని, గీతా శ్లోకం ద్వారా తక్షణ సాంత్వన పొందండి.",
    homePillarsTitle: "గీతలోని నాలుగు దివ్య యోగ మార్గాలు",
    homeStreakDays: "నిరంతర అధ్యయన రోజులు",
    homeVersesRead: "అధ్యయనం చేసిన శ్లోకాలు",
    homeChantsDone: "జపించిన మంత్రాలు",
    homeMeditationMinutes: "ధ్యానం చేసిన నిమిషాలు",

    chatHeaderTitle: "శ్రీకృష్ణ పరమాత్మునితో దివ్య సంభాషణ",
    chatHeaderSubtitle: "కురుక్షేత్రంలో అర్జునుడిలా మీ సంశయాలను, హృదయ వేదనను జగద్గురువైన కృష్ణుడి ఎదుట ఉంచండి.",
    chatWelcomeMessage: "ఓ ప్రియ ఆత్మ స్వరూపా, సుస్వాగతం. ఆనాడు కురుక్షేత్ర రణరంగంలో అర్జునుడు విషాదంతో, కర్తవ్య మోహంతో కుంగిపోయినప్పుడు నేను అతని రథసారథిగా మార్గదర్శనం చేశాను. నేడు కూడా నేను నీకు అండగా ఉన్నాను.\n\nనీ మనస్సులో ఉన్న దుఃఖం, భయం, కర్తవ్య సందిగ్ధత లేదా శాంతి కోసం తపన ఏదైనా నిర్భయంగా నాతో పంచుకో. ఒక మిత్రుడిలా మాట్లాడు—నీ మనస్సును వేధిస్తున్నదేమిటి?",
    chatRoleArjuna: "అర్జునుడు (సందేహంలో ఉన్న యోధుడు)",
    chatRoleSeeker: "నిజమైన జిజ్ఞాసువు",
    chatRoleProfessional: "ఆధునిక ఉద్యోగి / కర్మయోగి",
    chatRoleStudent: "విద్యార్థి / అభ్యాసకుడు",
    chatRoleSelector: "మీ పాత్ర:",
    chatInputPlaceholder: "మీ మనస్సులోని సందిగ్ధత, సమస్య లేదా భావాన్ని ఇక్కడ రాయండి...",
    chatSuggestedQuestions: "కొన్ని ముఖ్య ప్రశ్నలు:",
    chatAskKrishnaBtn: "కృష్ణుడిని అడగండి",
    chatReferencedVerses: "ఉదహరించిన గీతా శ్లోకాలు:",
    chatDisclaimer: "ఇక్కడ శ్రీకృష్ణుని మార్గదర్శకత్వం శ్రీమద్భగవద్గీత సార్వకాలిక తాత్విక సిద్ధాంతాలపై ఆధారపడి ఉంటుంది.",
    ttsHindi: "హిందీ వాణి (ఆడియో)",
    ttsTelugu: "తెలుగు వాణి (ఆడియో)",
    ttsEnglish: "ఇంగ్లీష్ వాణి",
    ttsPlaying: "శ్రీకృష్ణ భగవానుని దివ్యవాణి వినిపిస్తోంది...",
    ttsPaused: "వాణి ఆగింది",
    ttsLoading: "దివ్యవాణి సిద్ధమవుతోంది...",
    ttsSpeed: "వేగం",
    ttsVoice: "స్వరం",
    ttsDivineAudio: "దివ్య స్వరం (Gemini TTS)",
    ttsNativeAudio: "బ్రౌజర్ వాయిస్ ఇంజిన్",
    ttsStopAudio: "వాణిని ఆపండి",
    ttsPlaybackRate: "వాయిస్ వేగం",
    ttsAutoVoice: "సమాధానాన్ని స్వయంచాలకంగా వినండి",
    ttsVoiceSettings: "వాణి మందిరం",

    knowledgeHeaderTitle: "భగవద్గీత జ్ఞాన నిధి",
    knowledgeHeaderSubtitle: "18 అధ్యాయాలు, 700 శ్లోకాలు, మూల సంస్కృతం, తెలుగు లిపి, తెలుగు తాత్పర్యం మరియు ఆధునిక జీవన అనువర్తనాన్ని తెలుసుకోండి.",
    knowledgeFilterYoga: "యోగ మార్గం ప్రకారం చూడండి:",
    knowledgeChaptersCount: "18 పవిత్ర అధ్యాయాలు",
    knowledgeVerseExplainerTitle: "ఆధునిక జీవన అనువర్తన యంత్రం",
    knowledgeVerseExplainerDesc: "ఈ ప్రాచీన శ్లోకం నేటి ఒత్తిడి, ఉద్యోగ ఆందోళన, బాంధవ్యాల సమస్యలు మరియు మానసిక ప్రశాంతతకు ఎలా తోడ్పడుతుందో తెలుసుకోండి.",
    knowledgeAskAiExplain: "ఆధునిక వ్యాఖ్యానాన్ని రూపొందించండి",
    knowledgeContextPrompt: "మీ ప్రస్తుత పరిస్థితి (ఐచ్ఛికం):",
    knowledgeContextPlaceholder: "ఉదా: తీవ్రమైన పని ఒత్తిడి మరియు వైఫల్యం గురించిన భయం...",
    knowledgeGeneratingAnalysis: "లోతైన ఆధ్యాత్మిక వివరణ సిద్ధమవుతోంది...",
    knowledgeSanskritScript: "దేవనాగరి సంస్కృతం",
    knowledgeTeluguScript: "తెలుగు లిపిలో శ్లోకం",
    knowledgeDevanagariScript: "దేవనాగరి లిపి",
    knowledgeWordMeaning: "ప్రతిపదార్థం",
    knowledgeKeyTakeaway: "ముఖ్య ఆధ్యాత్మిక సూత్రం",
    knowledgeCommentary: "జ్ఞానప్రదమైన వివరణ",

    emotionHeaderTitle: "గీతా భావోద్వేగ సాంత్వన & ఆయుర్వేద విశ్లేషణ",
    emotionHeaderSubtitle: "మీ మానసిక అలజడిని త్రిగుణాలు (సత్త్వ, రజ, తమ) ద్వారా అర్థం చేసుకోండి; తగిన శ్లోకం, ప్రాణాయామం మరియు ఆలోచనా మార్పును పొందండి.",
    emotionInputPlaceholder: "ఈ సమయంలో మీ మనస్సులో కలుగుతున్న భావాన్ని వివరించండి...",
    emotionAnalyzeBtn: "భావాన్ని విశ్లేషించి శ్లోకం పొందండి",
    emotionPresetsTitle: "సాధారణ మానసిక స్థితులు:",
    emotionPrimaryFeeling: "గుర్తించబడిన ప్రధాన భావోద్వేగం",
    emotionGunaState: "ప్రబలమైన గుణ స్థితి",
    emotionPrescribedShloka: "మీ కోసమైన గీతా శ్లోకం",
    emotionSpiritualRemedy: "ఆధ్యాత్మిక పరిష్కారం (గీతా మనస్తత్వశాస్త్రం)",
    emotionBreathingExercise: "నిర్దేశించిన ప్రాణాయామ పద్ధతి",
    emotionMindsetShift: "ఆలోచనా ధోరణిలో మార్పు",
    emotionStartBreathing: "శ్వాస సాధన ప్రారంభించండి",
    emotionPauseBreathing: "ఆపండి",
    emotionInhale: "నెమ్మదిగా శ్వాస తీసుకోండి (4 సె.)",
    emotionHold: "ప్రశాంతంగా నిలపండి (4 సె.)",
    emotionExhale: "నెమ్మదిగా వదలండి (4 సె.)",
    emotionHoldEmpty: "నిశ్శబ్దంగా ఉండండి (4 సె.)",

    guidanceHeaderTitle: "వ్యక్తిగత మార్గదర్శకత్వం & త్రిగుణ పరీక్ష",
    guidanceHeaderSubtitle: "ధర్మ దృష్టితో జీవన సందిగ్ధతలను పరిష్కరించుకోండి మరియు మీలోని సత్త్వ, రజో, తమో గుణాల సమతుల్యతను తెలుసుకోండి.",
    guidanceTabDilemma: "ధర్మ సందేహాల నివృత్తి",
    guidanceTabGunaQuiz: "త్రిగుణ పరీక్ష",
    guidanceDilemmaInputPlaceholder: "మీ సందిగ్ధతను వివరించండి (ఉదా: కెరీర్ ఎంపిక, కష్టమైన కుటుంబ నిర్ణయం, బాధ్యత వర్సెస్ స్వార్థం)...",
    guidanceCategoryLabel: "సమస్య విభాగం",
    guidanceResolveBtn: "గీతా జ్ఞానంతో పరిష్కారం పొందండి",
    guidanceDharmaPerspective: "ధర్మం మరియు విశ్వ శ్రేయస్సు దృక్కోణం",
    guidanceNishkamaKarmaAction: "నిష్కామ కర్మ (ఫలాపేక్ష లేని కార్యాచరణ)",
    guidanceRecommendedYoga: "సిఫార్సు చేయబడిన యోగ మార్గం",
    guidanceActionPlan: "నాలుగు దశల కార్యాచరణ ప్రణాళిక",
    guidanceSacredAffirmation: "ఆధ్యాత్మిక ఆత్మవిశ్వాస వాక్యం",
    guidanceGunaQuizIntro: "మీ ప్రస్తుత జీవన విధానాన్ని సత్త్వమా (స్పష్టత), రజస్సా (అతి చురుకుదనం/ఆశ), లేక తమస్సా (స్తబ్దత/బద్ధకం) నడిపిస్తోందో తెలుసుకోండి.",
    guidanceGunaSubmit: "నా త్రిగుణ స్థితిని లెక్కించండి",
    guidanceDominantGuna: "మీలోని ప్రధాన గుణం",

    wellnessHeaderTitle: "ఆధ్యాత్మిక సాధన, నామ జపం & ఆత్మపరిశీలన",
    wellnessHeaderSubtitle: "ప్రశాంత ధ్యానం, 108 తులసి మాల జపం మరియు నిత్య ఆత్మపరిశీలన డైరీ ద్వారా స్థితప్రజ్ఞతను సాధించండి.",
    wellnessTabMeditation: "ధ్యాన టైమర్",
    wellnessTabJapa: "108 జపమాల",
    wellnessTabJournal: "నిత్య సాధనా డైరీ",
    wellnessMeditationTitle: "నిశ్శబ్ద ధ్యానం & పవిత్ర నామ స్మరణ",
    wellnessStartMeditation: "ధ్యానం ప్రారంభించండి",
    wellnessPauseMeditation: "విరామం",
    wellnessResetTimer: "టైమర్ రీసెట్ చేయండి",
    wellnessJapaTitle: "108 పూసల పవిత్ర నామ జపం",
    wellnessJapaSubtitle: "భగవన్నామ స్మరణతో ప్రతి పూసను భక్తితో తాకుతూ జపించండి.",
    wellnessBeadCount: "పూస సంఖ్య",
    wellnessRoundsCompleted: "పూర్తయిన మాలలు",
    wellnessTapBead: "జపించడానికి తాకండి (ఒక పూస)",
    wellnessJournalPromptTitle: "నేటి ఆత్మపరిశీలన ప్రశ్న",
    wellnessJournalPlaceholder: "మీ ఆలోచనలు, అంతరంగ అనుభవాలు మరియు సాధనను ఇక్కడ రాయండి...",
    wellnessMoodRatingLabel: "ప్రస్తుత మానసిక స్థితి (1 = తీవ్ర ఆందోళన, 10 = పరమ శాంతి):",
    wellnessSaveReflection: "ఆధ్యాత్మిక విశ్లేషణ కోసం పంపండి",
    wellnessAiMentorFeedback: "శ్రీకృష్ణుని ఆత్మబోధ",

    learningHeaderTitle: "నిత్య స్వాధ్యాయం & భగవద్గీత క్విజ్",
    learningHeaderSubtitle: "ప్రతిరోజూ ఒక పవిత్ర శ్లోకం మరియు జ్ఞానోదయ క్విజ్ ద్వారా మీ గీతా జ్ఞానాన్ని పెంపొందించుకోండి.",
    learningShlokaOfDay: "నేటి స్వాధ్యాయ శ్లోకం",
    learningQuizTitle: "నిత్య గీతా క్విజ్",
    learningSubmitAnswer: "సమాధానం సరిచూడండి",
    learningNextQuestion: "తర్వాతి ప్రశ్న",
    learningQuizCompleted: "క్విజ్ పూర్తయింది!",
    learningScore: "మీ స్కోరు",
    learningRestartQuiz: "మళ్లీ ప్రయత్నించండి",

    progressHeaderTitle: "ఆత్మ ప్రయాణం & ఆధ్యాత్మిక పురోగతి",
    progressHeaderSubtitle: "మీ సాధన నిరంతరత, బుక్‌మార్క్ చేసిన శ్లోకాలు, జప సంఖ్య మరియు సాధించిన పురస్కారాలను పరిశీలించండి.",
    progressStreak: "నిరంతర సాధనా రోజులు",
    progressBadgesTitle: "ఆధ్యాత్మిక మైలురాళ్లు & బ్యాడ్జ్‌లు",
    progressSavedVersesTitle: "మీరు భద్రపరచుకున్న శ్లోకాలు",
    progressNoBookmarks: "ఇంకా శ్లోకాలు ఏవీ సేవ్ చేయలేదు. 18 అధ్యాయాల జ్ఞాన నిధిని దర్శించి, మీకు నచ్చిన శ్లోకాలను భద్రపరచుకోండి.",

    emergencyModalTitle: "పవిత్ర ఆదరణ & అత్యవసర సహాయం",
    emergencyModalSubtitle: "మానవతా దృక్పథంతో కూడిన ఉచిత సహాయం 24/7 అందుబాటులో ఉంది.",
    emergencyCompassionNote: "భగవద్గీత శాశ్వతమైన ఆధ్యాత్మిక శాంతిని అందిస్తుంది; అయినప్పటికీ తీవ్రమైన మానసిక ఆందోళన లేదా సంక్షోభ సమయంలో నిపుణులైన సహాయకులతో మాట్లాడటం ఎంతో ముఖ్యం. మీరు ఒంటరిగా లేరు.",
    emergencyIndiaHotlines: "భారత జాతీయ హెల్ప్‌లైన్లు (24/7 ఉచితం)",
    emergencyGlobalHotlines: "అంతర్జాతీయ & అమెరికా/కెనడా హెల్ప్‌లైన్లు",
    emergencyCallNow: "కాల్ చేయండి",

    footerMantra: "ఓం సర్వే భవన్తు సుఖినః సర్వే సన్తు నిరామయాః। సర్వే భద్రాణి పశ్యన్తు మా కశ్చిద్దుఃఖభాగ్భవేత్॥",
    footerMantraMeaning: "అందరూ సుఖంగా ఉండాలి. అందరూ ఆరోగ్యంగా ఉండాలి. అందరికీ శుభం కలగాలి. ఎవరూ దుఃఖానికి గురికాకూడదు.",
    footerDisclaimer: "గీతా ఏఐ వేదిక భగవద్గీత తాత్విక జ్ఞానాన్ని అందించే వేదిక. తీవ్ర మానసిక ఆందోళన ఉన్నప్పుడు దయచేసి 24/7 హెల్ప్‌లైన్లు లేదా మానసిక వైద్యులను సంప్రదించండి."
  }
};

export function getTranslation(lang: SupportedLanguage): Translations {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
