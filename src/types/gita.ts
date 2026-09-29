export interface Shloka {
  id: string;
  chapter: number;
  verse: number;
  sanskrit: string;
  sanskritTelugu?: string;
  transliteration: string;
  wordMeaning?: string;
  wordMeaningHindi?: string;
  wordMeaningTelugu?: string;
  translation: string;
  translationHindi?: string;
  translationTelugu?: string;
  commentary: string;
  commentaryHindi?: string;
  commentaryTelugu?: string;
  theme: string;
  themeHindi?: string;
  themeTelugu?: string;
  emotionFocus?: string[];
  emotionFocusHindi?: string[];
  emotionFocusTelugu?: string[];
  keyTakeaway: string;
  keyTakeawayHindi?: string;
  keyTakeawayTelugu?: string;
}

export interface Chapter {
  number: number;
  nameSanskrit: string;
  nameTransliteration: string;
  nameEnglish: string;
  nameHindi?: string;
  nameTelugu?: string;
  versesCount: number;
  summary: string;
  summaryHindi?: string;
  summaryTelugu?: string;
  yogaType: 'Karma' | 'Bhakti' | 'Jnana' | 'Raja/Dhyana' | 'Universal';
  yogaTypeHindi?: string;
  yogaTypeTelugu?: string;
  themes: string[];
  themesHindi?: string[];
  themesTelugu?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  referencedShlokas?: {
    chapter: number;
    verse: number;
    sanskrit?: string;
    translation?: string;
    translationHindi?: string;
    translationTelugu?: string;
  }[];
  sentiment?: string;
}

export interface EmotionAnalysisResult {
  primaryEmotion: string;
  secondaryEmotion?: string;
  intensity: 'mild' | 'moderate' | 'intense';
  gunaState: 'Sattva' | 'Rajas' | 'Tamas' | 'Mixed';
  prescribedShloka: {
    chapter: number;
    verse: number;
    sanskrit: string;
    transliteration: string;
    translation: string;
    practicalRemedy: string;
  };
  spiritualRemedy: string;
  breathingExercise: {
    name: string;
    technique: string;
    durationMinutes: number;
  };
  mindsetShift: string;
  safetyAlert: boolean;
}

export interface DilemmaSolution {
  dilemmaSummary: string;
  dharmaPerspective: string;
  nishkamaKarmaAction: string;
  recommendedYogaPath: 'Karma Yoga' | 'Bhakti Yoga' | 'Jnana Yoga' | 'Dhyana Yoga';
  relevantVerses: {
    chapter: number;
    verse: number;
    translation: string;
    application: string;
  }[];
  actionPlan: string[];
  affirmation: string;
}

export interface GunaAssessmentResult {
  sattvaScore: number;
  rajasScore: number;
  tamasScore: number;
  dominantGuna: 'Sattva' | 'Rajas' | 'Tamas';
  analysis: string;
  recommendations: {
    diet: string;
    routine: string;
    spiritualPractice: string;
  };
}

export interface ReflectionEntry {
  id: string;
  date: string;
  prompt: string;
  content: string;
  moodRating: number;
  aiWisdomFeedback?: string;
  assignedVerse?: {
    chapter: number;
    verse: number;
    translation: string;
  };
}

export interface DailyQuizQuestion {
  id: string;
  question: string;
  questionHindi?: string;
  questionTelugu?: string;
  options: string[];
  optionsHindi?: string[];
  optionsTelugu?: string[];
  correctIndex: number;
  explanation: string;
  explanationHindi?: string;
  explanationTelugu?: string;
  verseReference: string;
}

export interface SafetyIncidentLog {
  id: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  triggerCategory: 'self_harm' | 'severe_anxiety' | 'distress' | 'medical_query' | 'other';
  userQuerySnippet: string;
  actionTaken: string;
  resourcesProvided: string[];
  resolved: boolean;
}

export interface UserProgress {
  streakDays: number;
  totalChats: number;
  versesRead: number;
  quizzesTaken: number;
  quizAccuracy: number;
  meditationMinutes: number;
  japaChants: number;
  reflectionsWritten: number;
  bookmarkedVerses: string[];
  unlockedBadges: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: string;
  }[];
}
