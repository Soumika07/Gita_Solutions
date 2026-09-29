import {
  Chapter,
  Shloka,
  ChatMessage,
  EmotionAnalysisResult,
  DilemmaSolution,
  GunaAssessmentResult,
  ReflectionEntry,
  DailyQuizQuestion
} from '../types/gita.ts';

export async function checkServerHealth() {
  const res = await fetch('/api/health');
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function sendChatMessage(
  messages: { role: string; content: string }[], 
  userDharmaRole?: string,
  language?: string
) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, userDharmaRole, language })
  });
  if (!res.ok) throw new Error('Chat failed');
  return res.json();
}

export async function analyzeEmotion(
  text: string, 
  context?: string,
  language?: string
): Promise<EmotionAnalysisResult> {
  const res = await fetch('/api/emotion/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, context, language })
  });
  if (!res.ok) throw new Error('Emotion analysis failed');
  return res.json();
}

export async function resolveDilemma(
  dilemma: string, 
  category: string, 
  currentThoughts?: string,
  language?: string
): Promise<DilemmaSolution> {
  const res = await fetch('/api/guidance/dilemma', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dilemma, category, currentThoughts, language })
  });
  if (!res.ok) throw new Error('Dilemma analysis failed');
  return res.json();
}

export async function calculateGunas(answers: string[]): Promise<GunaAssessmentResult> {
  const res = await fetch('/api/guidance/gunas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers })
  });
  if (!res.ok) throw new Error('Guna assessment failed');
  return res.json();
}

export async function fetchChapters(): Promise<Chapter[]> {
  const res = await fetch('/api/gita/chapters');
  if (!res.ok) throw new Error('Failed to fetch chapters');
  return res.json();
}

export async function fetchChapterDetails(id: number): Promise<Chapter & { notableVerses: Shloka[] }> {
  const res = await fetch(`/api/gita/chapter/${id}`);
  if (!res.ok) throw new Error('Failed to fetch chapter details');
  return res.json();
}

export async function fetchDailyShloka(): Promise<{ date: string; shloka: Shloka }> {
  const res = await fetch('/api/gita/shloka/daily');
  if (!res.ok) throw new Error('Failed to fetch daily shloka');
  return res.json();
}

export async function searchShlokas(query: string): Promise<Shloka[]> {
  const res = await fetch(`/api/gita/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

export async function explainShloka(
  chapter: number, 
  verse: number, 
  userSituation?: string,
  language?: string
) {
  const res = await fetch('/api/gita/shloka/explain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chapter, verse, userSituation, language })
  });
  if (!res.ok) throw new Error('Failed to explain shloka');
  return res.json();
}

export async function fetchReflectionPrompts(language?: string): Promise<string[]> {
  const url = language ? `/api/reflection/prompts?language=${encodeURIComponent(language)}` : '/api/reflection/prompts';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch prompts');
  return res.json();
}

export async function analyzeReflection(content: string, moodRating: number, language?: string) {
  const res = await fetch('/api/reflection/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, moodRating, language })
  });
  if (!res.ok) throw new Error('Failed to analyze reflection');
  return res.json();
}

export async function fetchDailyQuiz(): Promise<DailyQuizQuestion[]> {
  const res = await fetch('/api/quiz/daily');
  if (!res.ok) throw new Error('Failed to fetch quiz');
  return res.json();
}

export async function checkSafety(text: string) {
  const res = await fetch('/api/safety/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error('Safety check failed');
  return res.json();
}

export async function fetchAdminMetrics() {
  const res = await fetch('/api/admin/metrics');
  if (!res.ok) throw new Error('Failed to fetch admin metrics');
  return res.json();
}

export async function resolveAdminLog(id: string) {
  const res = await fetch('/api/admin/logs/resolve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  if (!res.ok) throw new Error('Failed to resolve log');
  return res.json();
}

export interface SpeechTtsResponse {
  audioData?: string;
  mimeType?: string;
  fallbackToBrowser?: boolean;
  language: string;
  spokenText: string;
  source?: string;
  error?: string;
}

export async function requestSpeechAudio(
  text: string,
  language: 'hi' | 'te' | 'en' = 'hi',
  voiceName?: string
): Promise<SpeechTtsResponse> {
  const res = await fetch('/api/tts/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language, voiceName })
  });
  if (!res.ok) {
    throw new Error('TTS request failed');
  }
  return res.json();
}

