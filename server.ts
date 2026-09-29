import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { GITA_CHAPTERS, NOTABLE_SHLOKAS, DAILY_QUIZZES, REFLECTION_PROMPTS, MULTILINGUAL_REFLECTION_PROMPTS } from './src/data/gitaData.ts';
import { SafetyIncidentLog } from './src/types/gita.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '5mb' }));

// In-memory safety incident store
const safetyIncidentLogs: SafetyIncidentLog[] = [
  {
    id: "safe-init-1",
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    severity: "low",
    triggerCategory: "severe_anxiety",
    userQuerySnippet: "I am feeling so overwhelmed by my failures and exam results",
    actionTaken: "Prescribed Gita 2.47 (Nishkama Karma) and 4-7-8 breathing exercise. Warm reassurance provided.",
    resourcesProvided: ["Gita 2.47", "Mindfulness Audio", "Breathwork Guide"],
    resolved: true
  }
];

let apiRequestCount = 0;
const serverStartTime = Date.now();

// Server-side Gemini AI setup
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper for calling Gemini with model fallback and graceful degradation
async function generateGeminiContent(options: {
  contents: any;
  config?: any;
  timeoutMs?: number;
}): Promise<string> {
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('API_KEY_UNSET');
  }

  const timeout = options.timeoutMs || 6000;
  const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const callPromise = ai.models.generateContent({
        model,
        contents: options.contents,
        config: options.config,
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout on model ${model}`)), timeout)
      );

      const response = await Promise.race([callPromise, timeoutPromise]);
      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} attempt failed:`, err.message || err);
    }
  }

  throw lastError || new Error('All model attempts failed');
}

// Middleware for API logging
app.use('/api', (req, res, next) => {
  apiRequestCount++;
  next();
});

// Explicit audio file serving
app.use('/audio', express.static(path.resolve(__dirname, 'public/audio')));
app.get('/api/audio/hare-ram', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/audio/hare_ram_chant.wav'));
});

// -------------------------------------------------------------
// HELPER: Emergency Crisis Detection Regex
// -------------------------------------------------------------
function detectCrisisKeywords(text: string): boolean {
  const lower = text.toLowerCase();
  const crisisPatterns = [
    'suicide', 'kill myself', 'end my life', 'want to die', 'harm myself',
    'self harm', 'cutting myself', 'hang myself', 'no reason to live', 'better off dead'
  ];
  return crisisPatterns.some(pattern => lower.includes(pattern));
}

// -------------------------------------------------------------
// ENDPOINT: Health & Config Status
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptimeSeconds: Math.floor((Date.now() - serverStartTime) / 1000),
    hasGeminiKey: Boolean(apiKey && apiKey.length > 5),
    activeModel: 'gemini-3.8-flash',
    totalChapters: GITA_CHAPTERS.length,
    notableShlokas: NOTABLE_SHLOKAS.length,
    totalApiRequests: apiRequestCount,
    timestamp: new Date().toISOString()
  });
});

// -------------------------------------------------------------
// 1. CHATBOT MODULE: Krishna Wisdom Dialogue
// -------------------------------------------------------------
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userDharmaRole, language = 'en' } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Valid messages array is required' });
    }

    const latestMessage = messages[messages.length - 1];
    const userPrompt = latestMessage.content || '';

    // Safety check first
    if (detectCrisisKeywords(userPrompt)) {
      const logEntry: SafetyIncidentLog = {
        id: `safe-${Date.now()}`,
        timestamp: new Date().toISOString(),
        severity: 'critical',
        triggerCategory: 'self_harm',
        userQuerySnippet: userPrompt.slice(0, 100),
        actionTaken: 'Triggered immediate crisis mitigation card with emergency helpline numbers',
        resourcesProvided: ['988 Suicide & Crisis Lifeline', 'KIRAN National Helpline: 1800-599-0019', 'Tele-MANAS: 14416'],
        resolved: false
      };
      safetyIncidentLogs.unshift(logEntry);

      let safetyText = `O noble seeker, your life is sacred, eternal, and deeply precious. Please know that your pain is real, but you do not have to carry this heavy darkness alone.\n\n"You are an eternal spark of consciousness (Atman), indestructible and radiant. Even when the clouds are darkest, the sun within never sets."\n\nIf you are feeling in crisis or having thoughts of self-harm, please reach out right now to compassionate professionals who are ready to listen:\n\n• **National Suicide & Crisis Lifeline**: Dial or text **988** (US/Canada, toll-free 24/7)\n• **India Tele-MANAS**: Dial **14416** or **1800-891-4416** (24/7 Govt Helpline)\n• **Vandrevala Foundation**: **+91 9999 666 555**\n• **International Crisis Lines**: https://findahelpline.com\n\nPlease reach out to a trusted loved one, counselor, or doctor right now. You are never alone.`;

      if (language === 'hi') {
        safetyText = `हे प्रिय आत्मा, आपका जीवन अत्यंत पावन, अमूल्य और शाश्वत है। आपकी पीड़ा वास्तविक है, किन्तु आपको इस भारी अंधकार को अकेले नहीं सहना है।\n\n"न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः।" (गीता 2.20)\nआप एक अविनाशी आत्म-चेतना हैं।\n\nकृपया इस संकट के समय तुरंत इन निःशुल्क एवं 24/7 सहृदय विशेषज्ञों से संपर्क करें:\n\n• **भारत Tele-MANAS (राष्ट्रीय मानसिक स्वास्थ्य हेल्पलाइन)**: डायल करें **14416** या **1800-891-4416** (24/7 टोल-फ्री)\n• **किरण (KIRAN) राष्ट्रीय हेल्पलाइन**: **1800-599-0019**\n• **वांद्रेवाला फाउंडेशन**: **+91 9999 666 555**\n• **अंतर्राष्ट्रीय हेल्पलाइन**: https://findahelpline.com\n\nकृपया अपने किसी प्रियजन, परामर्शदाता या चिकित्सक से तुरंत बात करें। आप अकेले नहीं हैं।`;
      } else if (language === 'te') {
        safetyText = `ఓ ప్రియ ఆత్మ స్వరూపా, నీ జీవితం ఎంతో పవిత్రమైనది, శాశ్వతమైనది మరియు అత్యంత విలువైనది. నీ బాధ నిజమైనదే కావచ్చు, కానీ ఈ కష్టాన్ని నువ్వు ఒంటరిగా మోయవలసిన అవసరం లేదు.\n\n"న జాయతే మ్రియతే వా కదాచిత్..." (గీత 2.20)\nనువ్వు నాశనం లేని శాశ్వతమైన ఆత్మ చైతన్యానివి.\n\nఒకవేళ మీరు తీవ్ర నిరాశలో లేదా సంక్షోభంలో ఉన్నట్లయితే, దయచేసి వెంటనే నిపుణులైన సహాయకులను సంప్రదించండి:\n\n• **భారత Tele-MANAS జాతీయ హెల్ప్‌లైన్**: **14416** లేదా **1800-891-4416** (24/7 ఉచితం)\n• **కిరణ్ (KIRAN) మానసిక ఆరోగ్య హెల్ప్‌లైన్**: **1800-599-0019**\n• **వాంద్రేవాలా ఫౌండేషన్**: **+91 9999 666 555**\n• **అంతర్జాతీయ హెల్ప్‌లైన్లు**: https://findahelpline.com\n\nదయచేసి మీ ఆత్మీయులతో లేదా వైద్యులతో వెంటనే మాట్లాడండి. మీకు తోడుగా మేమున్నాము.`;
      }

      return res.json({
        role: 'assistant',
        content: safetyText,
        referencedShlokas: [
          {
            chapter: 2,
            verse: 20,
            sanskrit: "न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः।",
            translation: language === 'hi' ? "आत्मा न कभी जन्म लेती है और न कभी मरती है। यह अजन्मा, नित्य, शाश्वत और पुरातन है।" :
                         language === 'te' ? "ఆత్మ ఎన్నడూ పుట్టదు, చావదు. ఇది జన్మలేనిది, శాశ్వతమైనది, సనాతనమైనది." :
                         "The soul is never born nor dies at any time. It is unborn, eternal, ever-existing and primeval.",
            translationHindi: "आत्मा न कभी जन्म लेती है और न कभी मरती है। यह अजन्मा, नित्य, शाश्वत और पुरातन है।",
            translationTelugu: "ఆత్మ ఎన్నడూ పుట్టదు, చావదు. ఇది జన్మలేనిది, శాశ్వతమైనది, సనాతనమైనది."
          }
        ],
        safetyTriggered: true
      });
    }

    // Build context with relevant shlokas
    const matchedShloka = NOTABLE_SHLOKAS.find(s => 
      s.emotionFocus?.some(e => userPrompt.toLowerCase().includes(e.toLowerCase())) ||
      s.theme.toLowerCase().includes(userPrompt.toLowerCase().slice(0, 10))
    ) || NOTABLE_SHLOKAS[0];

    const shlokaTranslation = language === 'hi' ? (matchedShloka.translationHindi || matchedShloka.translation) :
                              language === 'te' ? (matchedShloka.translationTelugu || matchedShloka.translation) :
                              matchedShloka.translation;

    if (!apiKey) {
      // Fallback wisdom response when API key is not yet configured
      let fallbackDialogue = `O seeker of truth, hear My words with a steady heart. The challenges and turbulence you face are not here to break you, but to awaken the lion of consciousness within you.\n\nIn the second chapter of the Gita, I remind Arjuna:\n\n"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nYou have a right to your sacred duty, but never to the fruits of action. Do not let yourself be burdened by anxiety over the unknown tomorrow."\n\nTake a slow, deep breath. Focus solely on the single righteous step you can take today. Release what lies beyond your control into the cosmic order. How can we break down this duty together?`;

      if (language === 'hi') {
        fallbackDialogue = `हे सत्य के खोजी, शांत चित्त से मेरे वचन सुनो। जीवन की चुनौतियाँ और उथल-पुथल तुम्हें तोड़ने नहीं, अपितु तुम्हारे भीतर सोए हुए आत्म-सिंह को जगाने आई हैं।\n\nगीता के दूसरे अध्याय में मैंने अर्जुन को यही स्मरण कराया था:\n\n"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nतुम्हारा केवल अपने कर्तव्य-कर्म करने पर अधिकार है, उसके फल पर कभी नहीं। अज्ञात भविष्य की चिंता से वर्तमान के धर्म को मत रोको।"\n\nएक शांत और गहरी श्वास लो। आज तुम जो एक धर्मसम्मत कदम उठा सकते हो, केवल उसी पर ध्यान एकाग्र करो। जो तुम्हारे नियंत्रण से बाहर है, उसे मुझ परमात्मा पर छोड़ दो। कहो, हम इस कर्तव्य को मिलकर कैसे सिद्ध करें?`;
      } else if (language === 'te') {
        fallbackDialogue = `ఓ సత్య జిజ్ఞాసూ, ప్రశాంతమైన చిత్తంతో నా అమృత వాక్కులను విను. నీవు ఎదుర్కొంటున్న ఈ పరీక్షలు నిన్ను కుంగదీయడానికి రాలేదు, నీ అంతరంగంలోని దివ్య ఆత్మ తేజాన్ని మేల్కొల్పడానికే వచ్చాయి.\n\nభగవద్గీత రెండవ అధ్యాయంలో నేను అర్జునునికి ప్రబోధించినట్లే:\n\n"కర్మణ్యేవాధికారస్తే మా ఫలేషు కదాచన।\nనీ కర్తవ్య కర్మను ఆచరించడంలోనే నీకు అధికారం ఉంది గానీ, దాని ఫలితాలపై ఎప్పుడూ లేదు. తెలియని భవిష్యత్తు గురించిన భయంతో నేటి ధర్మాన్ని విస్మరించవద్దు."\n\nఒకసారి ప్రశాంతంగా దీర్ఘ శ్వాస తీసుకో. ఈ రోజు నీవు తీసుకోగల ఒకే ఒక్క ధర్మబద్ధమైన చర్యపై మనస్సును లగ్నం చేయి. నీ చేతుల్లో లేని ఫలితాన్ని జగత్తు నియమానికి అర్పించు. కలిసి ఈ కర్తవ్యాన్ని ఎలా నిర్వర్తిద్దామో చెప్పు?`;
      }

      return res.json({
        role: 'assistant',
        content: fallbackDialogue,
        referencedShlokas: [
          {
            chapter: matchedShloka.chapter,
            verse: matchedShloka.verse,
            sanskrit: matchedShloka.sanskrit,
            translation: shlokaTranslation,
            translationHindi: matchedShloka.translationHindi,
            translationTelugu: matchedShloka.translationTelugu
          }
        ]
      });
    }

    const conversationHistory = messages.slice(-5).map((m: any) => `${m.role === 'user' ? 'Arjuna (Seeker)' : 'Krishna (Mentor)'}: ${m.content}`).join('\n');

    let systemInstruction = "You are Sri Krishna from the Bhagavad Gita offering timeless wisdom for modern dilemmas. Respond with depth, warmth, verse citations, and actionable steps.";
    let languageInstruction = "Respond in English.";

    if (language === 'hi') {
      systemInstruction = "आप श्रीमद्भगवद्गीता के साक्षात परम सखा एवं योगेश्वर भगवान श्रीकृष्ण हैं। आप शुद्ध, कल्याणकारी एवं ओजस्वी हिन्दी (देवनागरी लिपि) में संवाद करते हैं।";
      languageInstruction = "CRITICAL: You MUST write your entire response purely and beautifully in Hindi (हिन्दी / देवनागरी लिपि). Address the seeker with warmth (e.g., 'हे प्रिय सखे', 'हे अर्जुन', 'हे पुण्यात्मन्'). Cite Gita verses with [BG Chapter.Verse] and explain them in clear Hindi.";
    } else if (language === 'te') {
      systemInstruction = "మీరు శ్రీమద్భగవద్గీతలో అర్జునునికి దివ్యోపదేశం చేసిన జగద్గురువైన శ్రీకృష్ణ పరమాత్ముడు. సంపూర్ణ కరుణతో, ప్రేమతో, భక్తి-జ్ఞాన సమన్వయంతో స్వచ్ఛమైన తెలుగులో (తెలుగు లిపి) సమాధానమిస్తారు.";
      languageInstruction = "CRITICAL: You MUST write your entire response purely and beautifully in Telugu (తెలుగు లిపి). Address the seeker with affectionate warmth (e.g., 'ఓ ప్రియ మిత్రమా', 'ఓ ఆత్మ స్వరూపా', 'అర్జునా'). Cite Gita verses with [BG Chapter.Verse] and explain their profound application in Telugu.";
    }

    const prompt = `You are Lord Krishna, the supreme charioteer, divine friend, and enlightened counselor to the seeker (who comes as Arjuna).
Your demeanor is deeply compassionate, wise, dignified, calm, and practical.
Address the seeker with warmth.
Speak with the profound philosophical depth of the Bhagavad Gita, applying its teachings (Dharma, Nishkama Karma, Sthitaprajna, the Gunas, Atman, and Devotion) directly to modern life, career, relationships, and emotional struggles.

Reference specific verses where appropriate in format [BG Chapter.Verse] (for example: [BG 2.47] or [BG 6.5]).
Break down practical, actionable steps for the seeker.

LANGUAGE REQUIREMENT: ${languageInstruction}

User role/state: ${userDharmaRole || 'A sincere spiritual seeker in the modern world'}

Recent conversation:
${conversationHistory}

Provide your profound, encouraging response:`;

    let replyText = "";
    try {
      replyText = await generateGeminiContent({
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });
    } catch (apiErr) {
      console.warn("AI generation fell back to scriptural synthesis:", apiErr);
      if (language === 'hi') {
        replyText = `हे सत्य के खोजी, अविचलित मन से मेरा परामर्श सुनो।

जब भी तुम्हारे विचार भविष्य के परिणामों या चिंता से घिर जाएं, कर्मयोग के मूल सिद्धांत [BG 2.47] का स्मरण करो:
"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।"

1. **तूफान को पहचानो, स्वयं तूफान मत बनो**: जैसा मैंने अर्जुन से कहा था [BG 2.14], सुख और दुःख, सफलता और विलंब शीत और ग्रीष्म ऋतुओं की तरह क्षणिक हैं। वे आते और जाते हैं; उन्हें शांत तितिक्षा (सहनशीलता) से देखना सीखो।
2. **अगले सही कर्म पर ध्यान दो**: आने वाले कल की कल्पना में अपने प्राण मत गंवाओ। आज जो पवित्र कर्तव्य तुम्हारे सामने है, उसमें अपना संपूर्ण चित्त लगा दो।
3. **भार समर्पित करो**: जब तुम निस्वार्थ भाव से शुभ कर्म मुझे अर्पित करते हो [BG 9.22], तो तुम्हारा योगक्षेम मैं स्वयं वहन करता हूँ।

बताओ, आगे बढ़ने के लिए आज तुम कौन सा एक धर्मयुक्त कदम उठाओगे?`;
      } else if (language === 'te') {
        replyText = `ఓ సత్య జిజ్ఞాసూ, స్థిరమైన మనస్సుతో నా హితవును ఆలకించు.

ఫలితాల గురించిన భయం లేదా ఆందోళన నిన్ను చుట్టుముట్టినప్పుడల్లా కర్మయోగపు మూల సూత్రాన్ని [BG 2.47] గుర్తుచేసుకో:
"కర్మణ్యేవాధికారస్తే మా ఫలేషు కదాచన।"

1. **తుఫానును గమనించు, నువ్వే తుఫానుగా మారకు**: అర్జునుడికి నేను చెప్పినట్లు [BG 2.14], సుఖదుఃఖాలు, విజయాలు, జాప్యాలు శీతోష్ణాల వలె వచ్చిపోయే తాత్కాలిక తరంగాలు. వాటిని ప్రశాంతమైన తితిక్షతో (ఓర్పుతో) గమనించు.
2. **ప్రస్తుత సత్కర్మపైనే దృష్టి నిలుపు**: రేపటి ఊహల్లో నీ ప్రాణశక్తిని వృథా చేయకు. ఈ రోజు నీ కర్తవ్యంగా ఉన్న పవిత్రమైన పనిపైనే పూర్తి శ్రద్ధ పెట్టు.
3. **భారాన్ని పరమాత్మకు అర్పించు**: నీవు నిష్కల్మషమైన సంకల్పంతో కర్తవ్యాన్ని నిర్వహించినప్పుడు [BG 9.22], నీ యోగక్షేమాలను నేనే స్వయంగా వహిస్తాను.

చెప్పు, ముందుకు సాగడానికి ఈ రోజు నీవు వేయగల ఆ ఒక్క ధర్మబద్ధమైన అడుగు ఏమిటి?`;
      } else {
        replyText = `O seeker of truth, hear My counsel with an undisturbed mind.

Whenever your thoughts are seized by anxiety or fear over outcomes, recall the fundamental principle of Karma Yoga [BG 2.47]:
"You have a right to your sacred duty, but never to the fruits thereof."

1. **Acknowledge the Storm without Becoming It**: As I told Arjuna [BG 2.14], pleasures and pains, successes and delays are transient like winter and summer. They come and go; learn to observe them with patient calm (Titiksha).
2. **Focus on the Next Right Action**: Do not expend your vital prana anticipating tomorrow. Pour your total attention into whatever wholesome action lies directly in front of you today.
3. **Surrender the Burden**: When you dedicate your sincere efforts to the greater whole [BG 9.22], the universe preserves what you possess and provides what you lack.

Tell Me, what is the single righteous step you can take today to move forward?`;
      }
    }

    res.json({
      role: 'assistant',
      content: replyText,
      referencedShlokas: [
        {
          chapter: matchedShloka.chapter,
          verse: matchedShloka.verse,
          sanskrit: matchedShloka.sanskrit,
          translation: shlokaTranslation,
          translationHindi: matchedShloka.translationHindi,
          translationTelugu: matchedShloka.translationTelugu
        }
      ]
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: 'Failed to generate dialogue',
      fallback: "Equanimity is yoga (Samatvam Yoga Uchyate). Take a quiet breath and remember your indestructible essence."
    });
  }
});

// -------------------------------------------------------------
// 2. EMOTION DETECTION & REMEDIES MODULE
// -------------------------------------------------------------
app.post('/api/emotion/analyze', async (req, res) => {
  try {
    const { text, context, language = 'en' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text prompt is required for emotion analysis' });
    }

    const isCrisis = detectCrisisKeywords(text);

    if (isCrisis) {
      const logEntry: SafetyIncidentLog = {
        id: `safe-emo-${Date.now()}`,
        timestamp: new Date().toISOString(),
        severity: 'critical',
        triggerCategory: 'self_harm',
        userQuerySnippet: text.slice(0, 100),
        actionTaken: 'Crisis detected in emotion analyzer; safety card served.',
        resourcesProvided: ['988 Lifeline', 'Kiran Mental Health 1800-599-0019'],
        resolved: false
      };
      safetyIncidentLogs.unshift(logEntry);
    }

    if (!apiKey) {
      // Fallback structured emotion analysis with multilingual support
      if (language === 'hi') {
        return res.json({
          primaryEmotion: "चिंता एवं व्याकुलता (विषाद)",
          secondaryEmotion: "अज्ञात का भय",
          intensity: "moderate",
          gunaState: "Rajas",
          prescribedShloka: {
            chapter: 2,
            verse: 47,
            sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
            transliteration: "karmaṇy-evādhikāras te mā phaleṣhu kadāchana...",
            translation: "तुम्हारा केवल अपने कर्तव्य-कर्म करने का अधिकार है, उसके फलों में कभी नहीं।",
            practicalRemedy: "आज उठाए जा सकने वाले 2 तात्कालिक कदम लिखें। मन को अगले 30 दिनों की चिंता में भटकने से रोकें।"
          },
          spiritualRemedy: "'मेरे साथ क्या होगा?' के स्थान पर 'मैं अभी अपना सर्वश्रेष्ठ योगदान कैसे दूँ?' का भाव जगाएं। परिणाम को परमात्मा पर छोड़ दें।",
          breathingExercise: {
            name: "सम वृत्ति प्राणायाम (मन की शांति हेतु)",
            technique: "4 सेकंड श्वास लें, 4 सेकंड रोकें, 4 सेकंड में छोड़ें, 4 सेकंड शांत रहें। 5 चक्र दोहराएं।",
            durationMinutes: 3
          },
          mindsetShift: "दृष्टिकोण बदलें: 'मुझे सब कुछ नियंत्रित करना है' से 'मैं प्रेमपूर्वक अपना कर्तव्य करता हूँ और फल प्रभु पर छोड़ता हूँ।'",
          safetyAlert: isCrisis
        });
      } else if (language === 'te') {
        return res.json({
          primaryEmotion: "ఆందోళన & చంచలత్వం (విషాదం)",
          secondaryEmotion: "భవిష్యత్ భయం",
          intensity: "moderate",
          gunaState: "Rajas",
          prescribedShloka: {
            chapter: 2,
            verse: 47,
            sanskrit: "కర్మణ్యేవాధికారస్తే మా ఫలేషు కదాచన...",
            transliteration: "karmaṇy-evādhikāras te mā phaleṣhu kadāchana...",
            translation: "నీ కర్తవ్య కర్మను ఆచరించడంలోనే నీకు అధికారం ఉంది గానీ, దాని ఫలితాలపై ఎప్పుడూ లేదు.",
            practicalRemedy: "ఈ రోజు మీరు చేయగలిగిన తక్షణ 2 పనులను రాసుకోండి. భవిష్యత్తు గురించి అతిగా ఆలోచించకుండా మనస్సును ఆపండి."
          },
          spiritualRemedy: "'నాకేం జరుగుతుందో' అనే భయం నుండి 'నేను నా కర్తవ్యాన్ని ఎలా ఉత్తమంగా చేయగలను' అనే దృక్పథానికి మారండి. ఫలితాన్ని ఈశ్వరార్పణం చేయండి.",
          breathingExercise: {
            name: "సమ వృత్తి ప్రాణాయామం (ప్రశాంతత కోసం)",
            technique: "4 సెకన్లు శ్వాస తీసుకోండి, 4 సెకన్లు నిలపండి, 4 సెకన్లలో వదలండి, 4 సెకన్లు శూన్యంలో ఉండండి. 5 సార్లు సాధన చేయండి.",
            durationMinutes: 3
          },
          mindsetShift: "'ప్రతిదీ నా నియంత్రణలోనే ఉండాలి' అనే భావన నుండి 'నా కర్తవ్యాన్ని శ్రద్ధతో చేస్తాను, ఫలితాన్ని విశ్వానికి సమర్పిస్తాను' అనే ప్రశాంతతకు మారండి.",
          safetyAlert: isCrisis
        });
      }

      return res.json({
        primaryEmotion: "Anxiety & Apprehension (Vishada)",
        secondaryEmotion: "Fear of Uncertainty",
        intensity: "moderate",
        gunaState: "Rajas",
        prescribedShloka: {
          chapter: 2,
          verse: 47,
          sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
          transliteration: "karmaṇy-evādhikāras te mā phaleṣhu kadāchana...",
          translation: "You have a right only to work, never to its fruits. Let not the fruits of action be your motive.",
          practicalRemedy: "Write down the next 2 immediate physical steps you can take today. Forbid your mind from speculating on 30-day outcomes."
        },
        spiritualRemedy: "Shift your mental stance from 'What will happen to me?' to 'How can I offer my best effort right now?' Surrender the anxiety of the unknown to the cosmic intelligence.",
        breathingExercise: {
          name: "Sama Vritti (Box Breathing for Equanimity)",
          technique: "Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold empty for 4 seconds. Repeat for 5 cycles.",
          durationMinutes: 3
        },
        mindsetShift: "From 'I must control everything' to 'I do my duty with love, and trust the universe with the outcome.'",
        safetyAlert: isCrisis
      });
    }

    const langDirective = language === 'hi' ? 'Hindi (हिन्दी / देवनागरी लिपि)' : language === 'te' ? 'Telugu (తెలుగు లిపి)' : 'English';

    const prompt = `Analyze this person's expressed emotional state through the psychological framework of the Bhagavad Gita and Ayurveda:
User statement: "${text}"
Additional context: "${context || 'None'}"
Language requested: ${langDirective}

CRITICAL: All textual output (primaryEmotion, secondaryEmotion, practicalRemedy, spiritualRemedy, breathingExercise.name, breathingExercise.technique, mindsetShift) MUST BE WRITTEN IN ${langDirective}.

Evaluate:
1. Primary emotion (e.g., in Hindi: चिंता/विषाद, क्रोध, शोक, मोह; in Telugu: ఆందోళన/విషాదం, క్రోధం, శోకం, మోహం; in English: Anxiety/Vishada, Anger/Krodha, etc.)
2. Secondary emotion
3. Intensity: "mild", "moderate", or "intense"
4. Dominant Guna state: "Sattva" | "Rajas" | "Tamas" | "Mixed"
5. Prescribe a specific Bhagavad Gita verse (give Chapter, Verse, Sanskrit, Transliteration, Translation in requested language, and practicalRemedy in requested language)
6. Actionable Spiritual Remedy (Gita philosophical solution)
7. A specific calming Breathing / Pranayama Exercise (e.g. Nadi Shodhana, Bhramari, Sama Vritti) with precise instructions and duration
8. Mindset shift (from false perspective to Sattvic truth)

Return strictly valid JSON conforming to this schema without Markdown backticks:
{
  "primaryEmotion": "string",
  "secondaryEmotion": "string",
  "intensity": "mild" | "moderate" | "intense",
  "gunaState": "Sattva" | "Rajas" | "Tamas" | "Mixed",
  "prescribedShloka": {
    "chapter": number,
    "verse": number,
    "sanskrit": "string",
    "transliteration": "string",
    "translation": "string",
    "practicalRemedy": "string"
  },
  "spiritualRemedy": "string",
  "breathingExercise": {
    "name": "string",
    "technique": "string",
    "durationMinutes": number
  },
  "mindsetShift": "string",
  "safetyAlert": boolean
}`;

    let parsed: any = null;
    try {
      const textResponse = await generateGeminiContent({
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4
        }
      });
      parsed = JSON.parse(textResponse.trim());
    } catch (err) {
      console.warn("Emotion analysis fell back to scriptural diagnosis:", err);
      const isAnger = text.toLowerCase().includes('ang') || text.toLowerCase().includes('frustrat') || text.toLowerCase().includes('mad') || text.includes('क्रोध') || text.includes('కోపం');
      const isGrief = text.toLowerCase().includes('sad') || text.toLowerCase().includes('lost') || text.toLowerCase().includes('grief') || text.includes('शोक') || text.includes('బాధ');
      
      const targetShloka = isAnger ? NOTABLE_SHLOKAS.find(s => s.id === 'gita-2-62')! :
                           isGrief ? NOTABLE_SHLOKAS.find(s => s.id === 'gita-2-14')! :
                           NOTABLE_SHLOKAS.find(s => s.id === 'gita-2-47')!;

      const transl = language === 'hi' ? (targetShloka.translationHindi || targetShloka.translation) :
                     language === 'te' ? (targetShloka.translationTelugu || targetShloka.translation) :
                     targetShloka.translation;

      const takeaway = language === 'hi' ? (targetShloka.keyTakeawayHindi || targetShloka.keyTakeaway) :
                       language === 'te' ? (targetShloka.keyTakeawayTelugu || targetShloka.keyTakeaway) :
                       targetShloka.keyTakeaway;

      parsed = {
        primaryEmotion: isAnger 
          ? (language === 'hi' ? "क्रोध एवं हताशा (क्रोध)" : language === 'te' ? "కోపం & అసహనం (క్రోధం)" : "Anger & Frustration (Krodha)")
          : isGrief 
          ? (language === 'hi' ? "शोक एवं दुःख (शोक)" : language === 'te' ? "దుఃఖం & వేదన (శోకం)" : "Grief & Sorrow (Shoka)")
          : (language === 'hi' ? "चिंता एवं व्याकुलता (विषाद)" : language === 'te' ? "ఆందోళన & చంచలత్వం (విషాదం)" : "Anxiety & Restlessness (Vishada)"),
        secondaryEmotion: isAnger 
          ? (language === 'hi' ? "अतृप्त अपेक्षा" : language === 'te' ? "భంగపడిన కోరిక" : "Thwarted Expectation")
          : isGrief 
          ? (language === 'hi' ? "वियोग का कष्ट" : language === 'te' ? "వియోగ వేదన" : "Sense of Loss")
          : (language === 'hi' ? "अज्ञात का भय" : language === 'te' ? "భవిష్యత్ భయం" : "Fear of Uncertainty"),
        intensity: "moderate",
        gunaState: isAnger ? "Rajas" : isGrief ? "Tamas" : "Rajas",
        prescribedShloka: {
          chapter: targetShloka.chapter,
          verse: targetShloka.verse,
          sanskrit: targetShloka.sanskrit,
          transliteration: targetShloka.transliteration,
          translation: transl,
          practicalRemedy: takeaway
        },
        spiritualRemedy: isAnger 
          ? (language === 'hi' ? "रुकें और पहचानें कि क्रोध अतृप्त कामना की छाया है। दूसरों को नियंत्रित करने की आसक्ति छोड़ें।" : language === 'te' ? "తీరని కోరికే కోపానికి కారణమని గుర్తించండి. ఇతరులను నియంత్రించాలనే తాపత్రయాన్ని విడనాడండి." : "Pause and recognize that anger is the shadow of unmet desire. Dissolve the attachment to controlling others.")
          : isGrief 
          ? (language === 'hi' ? "अविनाशी आत्मा का स्मरण करें। चेतना का मूल स्वरूप न कभी जलता है, न डूबता है, न नष्ट होता है।" : language === 'te' ? "శాశ్వతమైన ఆత్మను స్మరించండి. ఆత్మ ఎన్నడూ నశించదు, చావదు." : "Remember the eternal Atman. The essence of consciousness can never be burned, drowned, or destroyed.")
          : (language === 'hi' ? "अपने सामने उपस्थित कर्तव्य पर ध्यान केंद्रित करें। फलों को परमात्मा पर छोड़ दें।" : language === 'te' ? "ప్రస్తుత కర్తవ్యంపై దృష్టి నిలపండి. ఫలితాలను జగత్తు నియమానికి సమర్పించండి." : "Focus solely on the duty in front of you. Surrender the fruits to the cosmic order."),
        breathingExercise: {
          name: isAnger ? (language === 'hi' ? "शीतली प्राणायाम (शीतलता हेतु)" : language === 'te' ? "శీతలీ ప్రాణాయామం" : "Shitali Pranayama") : (language === 'hi' ? "सम वृत्ति प्राणायाम" : language === 'te' ? "సమ వృత్తి ప్రాణాయామం" : "Sama Vritti (Box Breathing)"),
          technique: language === 'hi' ? "4 से. श्वास लें, 4 से. रोकें, 4 से. छोड़ें, 4 से. शांत रहें।" : language === 'te' ? "4 సెకన్లు శ్వాస తీసుకోండి, 4 సెకన్లు నిలపండి, 4 సెకన్లలో వదలండి, 4 సెకన్లు శూన్యంలో ఉండండి." : "Inhale gently for 4s, hold with soft chest for 4s, exhale slowly for 4s, rest empty for 4s.",
          durationMinutes: 3
        },
        mindsetShift: language === 'hi' 
          ? "'मैं इस तूफान का शिकार हूँ' से बदलकर 'मैं अपने भीतर का शांत, अविनाशी साक्षी (आत्मा) हूँ।'"
          : language === 'te'
          ? "'నేను ఈ కష్టాల బాధితుడిని' నుండి 'నేను ఎన్నడూ చెదరని దివ్య అంతరంగ సాక్షిని' అనే సత్యానికి మారండి."
          : "From 'I am the victim of this storm' to 'I am the calm, indestructible witness (Sakshi) within.'",
        safetyAlert: isCrisis
      };
    }

    if (isCrisis) {
      parsed.safetyAlert = true;
    }
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/emotion/analyze:', error);
    // Graceful fallback
    const fallbackShloka = NOTABLE_SHLOKAS[0];
    res.json({
      primaryEmotion: "Emotional Turbulence (Chitta Vritti)",
      secondaryEmotion: "Doubt",
      intensity: "moderate",
      gunaState: "Rajas",
      prescribedShloka: {
        chapter: fallbackShloka.chapter,
        verse: fallbackShloka.verse,
        sanskrit: fallbackShloka.sanskrit,
        transliteration: fallbackShloka.transliteration,
        translation: fallbackShloka.translation,
        practicalRemedy: "Anchor your attention on the present breath. Remind yourself that action alone is your domain."
      },
      spiritualRemedy: "Remember that you are the eternal conscious witness (Sakshi), not the passing storm of emotion.",
      breathingExercise: {
        name: "Nadi Shodhana (Alternate Nostril Breathing)",
        technique: "Close right nostril, inhale left 4s. Close left, exhale right 4s. Inhale right 4s, exhale left 4s.",
        durationMinutes: 4
      },
      mindsetShift: "Recognize emotions as transient visitors upon the unchanging screen of your soul.",
      safetyAlert: false
    });
  }
});

// -------------------------------------------------------------
// 3. PERSONALIZED GUIDANCE: Dilemma Resolution & Guna Quiz
// -------------------------------------------------------------
app.post('/api/guidance/dilemma', async (req, res) => {
  try {
    const { dilemma, category, currentThoughts, language = 'en' } = req.body;
    if (!dilemma) {
      return res.status(400).json({ error: 'Dilemma description is required' });
    }

    if (!apiKey) {
      if (language === 'hi') {
        return res.json({
          dilemmaSummary: dilemma,
          dharmaPerspective: "गीता में धर्म कोई रूढ़िवादिता नहीं, अपितु सार्वभौमिक सद्भाव और सत्य है। आपका सर्वोच्च कर्तव्य व्यक्तिगत अहंकार या सामाजिक भय से मुक्त होकर अंतरात्मा की आवाज से सत्यनिष्ठ निर्णय लेना है।",
          nishkamaKarmaAction: "कर्म को व्यक्तिगत अहंकार और फल की लालसा से अलग करें। पूछें: 'कौन सा निर्णय समग्र कल्याण और मेरे अंतःकरण के अनुकूल है?' न कि 'किससे मुझे तुरंत प्रशंसा मिलेगी?'",
          recommendedYogaPath: "Karma Yoga",
          relevantVerses: [
            {
              chapter: 3,
              verse: 35,
              translation: "दूसरों के धर्म का अच्छी तरह अनुकरण करने की अपेक्षा अपना सहज धर्म (स्वधर्म) दोषयुक्त होने पर भी श्रेष्ठ है।",
              application: "पारिवारिक या सामाजिक दबाव में आकर किसी और का बनावटी जीवन जीने की भूल न करें।"
            },
            {
              chapter: 2,
              verse: 48,
              translation: "सफलता और विफलता में समान रहकर योगस्थ होकर अपने कर्तव्य का पालन करो। समत्व ही योग कहलाता है।",
              application: "पवित्र भाव से निर्णय लें, उस पर दृढ़ रहें और जो भी परिणाम आए उसे गरिमा से स्वीकारें।"
            }
          ],
          actionPlan: [
            "निर्णय लेने से पूर्व 5 मिनट मौन में मन को स्थिर करें।",
            "सुविधा के बजाय अपने मूलभूत नैतिक मूल्यों के आधार पर विकल्पों की तुलना करें।",
            "निर्णय लें और बिना आत्म-ग्लानि के साहसपूर्वक आगे बढ़ें।",
            "परिणाम को ईश्वर और लोक-कल्याण को समर्पित कर दें।"
          ],
          affirmation: "मैं अपने स्वधर्म में अडिग हूँ। मैं निर्भय होकर सत्य और निष्काम भाव से कर्म करता हूँ।"
        });
      } else if (language === 'te') {
        return res.json({
          dilemmaSummary: dilemma,
          dharmaPerspective: "గీత ప్రకారం ధర్మం అంటే మూఢాచారాలు కావు, అది విశ్వ శ్రేయస్సు మరియు అంతరాత్మ సత్యం. లోక భయానికి లొంగక, స్వార్థం లేక ధర్మానికి అనుగుణంగా నడుచుకోవడమే పరమ కర్తవ్యం.",
          nishkamaKarmaAction: "కర్మను అహంకారం నుండి వేరు చేయండి. 'నాకేం పేరు వస్తుంది?' అని కాకుండా, 'ఈ నిర్ణయం సత్యానికి, నైతికతకు ఎంతవరకు న్యాయం చేస్తుంది?' అని ఆలోచించండి.",
          recommendedYogaPath: "Karma Yoga",
          relevantVerses: [
            {
              chapter: 3,
              verse: 35,
              translation: "ఇతరుల ధర్మాన్ని చక్కగా ఆచరించడం కంటే లోపభూయిష్టమైనా సరే తన స్వధర్మాన్ని ఆచరించడమే శ్రేష్టమైనది.",
              application: "ఇతరుల ఒత్తిడికి తలొగ్గి మరొకరి జీవితాన్ని అనుకరించవద్దు; మీ నిజమైన స్వభావాన్ని అనుసరించండి."
            },
            {
              chapter: 2,
              verse: 48,
              translation: "విజయం, అపజయాల పట్ల సమబుద్ధి కలిగి, యోగస్థుడవై కర్తవ్యాన్ని నిర్వహించు. సమత్వమే యోగమని చెప్పబడుతుంది.",
              application: "నిష్కల్మషమైన సంకల్పంతో నిర్ణయం తీసుకోండి, ధైర్యంతో ఆచరించండి, ఫలితాన్ని హుందాగా స్వీకరించండి."
            }
          ],
          actionPlan: [
            "నిర్ణయానికి ముందు 5 నిమిషాలు నిశ్శబ్దంలో మనస్సును నిలకడ చేసుకోండి.",
            "స్వల్పకాలిక సౌలభ్యం కంటే మీ నైతిక సూత్రాలకు ప్రాధాన్యతనివ్వండి.",
            "పశ్చాత్తాపం లేకుండా ధైర్యంగా సరైన నిర్ణయాన్ని అమలు చేయండి.",
            "ఫలితాన్ని విశ్వకళ్యాణానికి, పరమాత్మకు అర్పించండి."
          ],
          affirmation: "నేను నా స్వధర్మంలో స్థిరంగా ఉన్నాను. నిష్కామ భావనతో, నిర్భయంగా సత్య మార్గంలో నడుస్తాను."
        });
      }

      return res.json({
        dilemmaSummary: dilemma,
        dharmaPerspective: "In the Gita, Dharma is not rigid dogmatism; it is righteous harmony. Your highest duty is to act from a place of integrity without being blinded by selfish attachment or fear of societal judgment.",
        nishkamaKarmaAction: "Disentangle the action itself from personal ego. Ask: 'What choice serves the highest collective truth and my innate conscience?' rather than 'What choice gives me immediate praise?'",
        recommendedYogaPath: "Karma Yoga",
        relevantVerses: [
          {
            chapter: 3,
            verse: 35,
            translation: "It is far better to perform one's own natural duty (Swadharma), even though imperfectly, than to adopt another's duty. Following another's path invites fear and ruin.",
            application: "Do not let family or peer pressure push you into living someone else's counterfeit life."
          },
          {
            chapter: 2,
            verse: 48,
            translation: "Perform your duty with an equanimous mind, abandoning all attachment to success or failure. Such equanimity is called Yoga.",
            application: "Make your decision with pure motive, execute it steadily, and accept whatever unfolds with dignity."
          }
        ],
        actionPlan: [
          "Quiet your mind for 5 minutes before evaluating the decision.",
          "List your choices against your core moral values rather than short-term convenience.",
          "Take the decisive action without looking back with self-pity or regret.",
          "Dedicate the outcome to universal welfare."
        ],
        affirmation: "I stand firm in my Dharma. I act with clean intent and pure courage, fearless of the future."
      });
    }

    const langDirective = language === 'hi' ? 'Hindi (हिन्दी / देवनागरी लिपि)' : language === 'te' ? 'Telugu (తెలుగు లిపి)' : 'English';

    const prompt = `Solve this ethical, career, or life dilemma using the profound philosophy of the Bhagavad Gita:
Dilemma: "${dilemma}"
Category: "${category || 'General Life Decision'}"
User's current thoughts: "${currentThoughts || 'Uncertain'}"
Target Language: ${langDirective}

CRITICAL: All fields (dilemmaSummary, dharmaPerspective, nishkamaKarmaAction, relevantVerses.translation, relevantVerses.application, actionPlan, affirmation) MUST BE GENERATED IN ${langDirective}.

Provide a structured, deeply inspiring philosophical and practical resolution:
- Dharma perspective (duty, truth, universal order)
- Nishkama Karma action (acting without egoistic attachment to fruits)
- Recommended Yoga Path (Karma Yoga, Bhakti Yoga, Jnana Yoga, or Dhyana Yoga)
- 2 relevant Gita verses with Chapter, Verse, translation in target language, and practical application
- 4 clear action steps in an action plan
- A sacred empowering affirmation

Return strictly JSON matching this structure:
{
  "dilemmaSummary": "string",
  "dharmaPerspective": "string",
  "nishkamaKarmaAction": "string",
  "recommendedYogaPath": "Karma Yoga" | "Bhakti Yoga" | "Jnana Yoga" | "Dhyana Yoga",
  "relevantVerses": [
    {
      "chapter": number,
      "verse": number,
      "translation": "string",
      "application": "string"
    }
  ],
  "actionPlan": ["string", "string", "string", "string"],
  "affirmation": "string"
}`;

    let result: any = null;
    try {
      const textResponse = await generateGeminiContent({
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5
        }
      });
      result = JSON.parse(textResponse.trim());
    } catch (apiErr) {
      console.warn("Dilemma resolution fell back to scriptural synthesis:", apiErr);
      if (language === 'hi') {
        result = {
          dilemmaSummary: dilemma,
          dharmaPerspective: "धर्म का अर्थ है अपनी अंतरात्मा और समष्टिगत सत्य के अनुकूल आचरण करना। भय या लोभ के वशीभूत न हों।",
          nishkamaKarmaAction: "फल की आसक्ति का त्याग कर सर्वोत्तम नैतिक विकल्प चुनें।",
          recommendedYogaPath: "Karma Yoga",
          relevantVerses: [
            {
              chapter: 2,
              verse: 47,
              translation: "तुम्हारा केवल अपने कर्तव्य-कर्म करने का अधिकार है, उसके फल पर कभी नहीं।",
              application: "पूरी निष्ठा से कर्म करें और परिणाम को ईश्वरीय विधान पर छोड़ दें।"
            },
            {
              chapter: 3,
              verse: 35,
              translation: "दूसरों के धर्म की नकल करने से अपना स्वधर्म कहीं उत्तम है।",
              application: "अपने अंतर्मन के मूल्यों के प्रति निष्ठावान रहें।"
            }
          ],
          actionPlan: [
            "शांत होकर आत्म-अवलोकन करें।",
            "नैतिकता को सुविधा पर प्राथमिकता दें।",
            "निडर होकर कर्म करें।",
            "ईश्वर पर पूर्ण भरोसा रखें।"
          ],
          affirmation: "मैं अपने धर्म में अडिग हूँ। मैं सत्य और निष्काम भाव से कार्य करता हूँ।"
        };
      } else if (language === 'te') {
        result = {
          dilemmaSummary: dilemma,
          dharmaPerspective: "ధర్మ మార్గంలో నడవడమే సర్వోన్నత కర్తవ్యం. అల్పకాలిక ప్రయోజనాల కంటే శాశ్వత సత్యానికి ప్రాధాన్యతనివ్వండి.",
          nishkamaKarmaAction: "ఫలాపేక్ష లేక ప్రస్తుత కర్తవ్యాన్ని చిత్తశుద్ధితో ఆచరించండి.",
          recommendedYogaPath: "Karma Yoga",
          relevantVerses: [
            {
              chapter: 2,
              verse: 47,
              translation: "కర్తవ్య కర్మను చేయడమే నీ హక్కు, ఫలితాలపై ఎప్పుడూ కాదు.",
              application: "సత్య మార్గంలో మీ వంతు కృషి చేయండి; ఫలితాన్ని భగవంతునికి అర్పించండి."
            },
            {
              chapter: 3,
              verse: 35,
              translation: "ఇతరుల ధర్మాన్ని అనుకరించడం కంటే స్వధర్మాన్ని ఆచరించడమే శ్రేయస్కరం.",
              application: "మీ సహజ నైతిక విలువలను ఎల్లప్పుడూ కాపాడుకోండి."
            }
          ],
          actionPlan: [
            "మనస్సును ప్రశాంతం చేసుకోండి.",
            "స్వార్థానికి కాక నైతికతకు ప్రాధాన్యతనివ్వండి.",
            "ధైర్యంతో ముందుకు సాగండి.",
            "దైవ రక్షణపై నమ్మకం ఉంచండి."
          ],
          affirmation: "నేను ధర్మ మార్గంలో ఉన్నాను. నిర్భయంగా నా కర్తవ్యాన్ని నిర్వహిస్తాను."
        };
      } else {
        result = {
          dilemmaSummary: dilemma,
          dharmaPerspective: "Dharma requires looking beyond short-term gratification or fear of discomfort. The highest duty is to align your actions with truth, compassion, and the welfare of all beings (Loka-Sangraha).",
          nishkamaKarmaAction: "Sever the mental knot of attachment to outcomes. Make the most principled decision available today without agonizing over what others might say.",
          recommendedYogaPath: "Karma Yoga",
          relevantVerses: [
            {
              chapter: 2,
              verse: 47,
              translation: "You have a right to perform your duty, but never to the fruits of action.",
              application: "Do your utmost in the situation; leave the ultimate outcome to the cosmic law."
            },
            {
              chapter: 3,
              verse: 35,
              translation: "Better is one's own duty, though devoid of merit, than the duty of another well performed.",
              application: "Stay loyal to your authentic calling and moral values rather than imitating others."
            }
          ],
          actionPlan: [
            "Take 10 minutes in silence to still the restless mind.",
            "Write down the core moral principle at stake.",
            "Choose the path of integrity over convenience.",
            "Execute with courage and complete surrender of the outcome."
          ],
          affirmation: "I stand firm in my Dharma. I act without fear, dedicated to truth and peace."
        };
      }
    }
    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/guidance/dilemma:', error);
    res.status(500).json({ error: 'Failed to analyze dilemma' });
  }
});

// Guna Assessment Calculation
app.post('/api/guidance/gunas', (req, res) => {
  const { answers } = req.body; // array of values: 'sattva' | 'rajas' | 'tamas'
  let sattvaCount = 0;
  let rajasCount = 0;
  let tamasCount = 0;

  if (Array.isArray(answers) && answers.length > 0) {
    answers.forEach(ans => {
      if (ans === 'sattva') sattvaCount++;
      else if (ans === 'rajas') rajasCount++;
      else if (ans === 'tamas') tamasCount++;
    });
  } else {
    // Default balanced baseline
    sattvaCount = 5;
    rajasCount = 3;
    tamasCount = 2;
  }

  const total = Math.max(1, sattvaCount + rajasCount + tamasCount);
  const sPct = Math.round((sattvaCount / total) * 100);
  const rPct = Math.round((rajasCount / total) * 100);
  const tPct = 100 - (sPct + rPct);

  let dominant: 'Sattva' | 'Rajas' | 'Tamas' = 'Sattva';
  if (rPct >= sPct && rPct >= tPct) dominant = 'Rajas';
  else if (tPct >= sPct && tPct >= rPct) dominant = 'Tamas';

  res.json({
    sattvaScore: sPct,
    rajasScore: rPct,
    tamasScore: tPct,
    dominantGuna: dominant,
    analysis: dominant === 'Sattva' 
      ? 'Your consciousness exhibits high clarity, harmony, and wisdom. Continue nurturing serenity while keeping vigilance against subtle spiritual ego.'
      : dominant === 'Rajas'
      ? 'Your current state is propelled by ambition, restless drive, and intense mental activity. Channel this vibrant energy into selfless service (Karma Yoga) and take regular meditative pauses.'
      : 'You are experiencing fatigue, procrastination, or inertia. Break stagnation through light morning physical movement, fresh whole foods, and waking up with the sunrise.',
    recommendations: {
      diet: dominant === 'Sattva' ? 'Fresh fruits, soaked nuts, green vegetables, warm ghee, and pure water' : dominant === 'Rajas' ? 'Avoid excess chili, caffeine, processed sugar; incorporate cooling herbs like mint and coriander' : 'Warm, freshly cooked spices, ginger tea, avoid stale or heavy fried foods',
      routine: dominant === 'Sattva' ? 'Early morning Brahma Muhurta meditation and study of scriptures' : dominant === 'Rajas' ? 'Evening digital sundown, mindful pacing, and walking in nature' : 'Brisk morning walk, invigorating Pranayama (Kapalabhati, Surya Bhedana), clean living spaces',
      spiritualPractice: dominant === 'Sattva' ? 'Silent contemplation (Jnana Yoga) and Sthitaprajna study' : dominant === 'Rajas' ? 'Nishkama Karma (selfless action without calculating rewards)' : 'Japa chanting, physical yoga asanas, and uplifting sacred music'
    }
  });
});

// -------------------------------------------------------------
// 4. KNOWLEDGE MODULE: Chapters, Shlokas & AI Verse Explainer
// -------------------------------------------------------------
app.get('/api/gita/chapters', (req, res) => {
  res.json(GITA_CHAPTERS);
});

app.get('/api/gita/chapter/:id', (req, res) => {
  const chapterId = Number(req.params.id);
  const chapter = GITA_CHAPTERS.find(c => c.number === chapterId);
  if (!chapter) {
    return res.status(404).json({ error: 'Chapter not found' });
  }

  const verses = NOTABLE_SHLOKAS.filter(s => s.chapter === chapterId);
  res.json({
    ...chapter,
    notableVerses: verses
  });
});

app.get('/api/gita/shloka/daily', (req, res) => {
  // Use day of year to deterministically cycle through verses
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const shlokaIndex = dayOfYear % NOTABLE_SHLOKAS.length;
  const shloka = NOTABLE_SHLOKAS[shlokaIndex];

  res.json({
    date: now.toISOString().split('T')[0],
    shloka
  });
});

app.get('/api/gita/search', (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase();
  if (!q) {
    return res.json(NOTABLE_SHLOKAS.slice(0, 8));
  }

  const results = NOTABLE_SHLOKAS.filter(s => 
    s.sanskrit.toLowerCase().includes(q) ||
    s.transliteration.toLowerCase().includes(q) ||
    s.translation.toLowerCase().includes(q) ||
    s.commentary.toLowerCase().includes(q) ||
    s.theme.toLowerCase().includes(q) ||
    `chapter ${s.chapter}`.includes(q) ||
    `${s.chapter}.${s.verse}`.includes(q) ||
    s.emotionFocus?.some(e => e.toLowerCase().includes(q))
  );

  res.json(results);
});

app.post('/api/gita/shloka/explain', async (req, res) => {
  try {
    const { chapter, verse, userSituation, language = 'en' } = req.body;
    const existing = NOTABLE_SHLOKAS.find(s => s.chapter === Number(chapter) && s.verse === Number(verse));

    const sanskritText = (language === 'te' && existing?.sanskritTelugu) ? existing.sanskritTelugu : (existing?.sanskrit || "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन...");
    const translText = language === 'hi' ? (existing?.translationHindi || existing?.translation) :
                       language === 'te' ? (existing?.translationTelugu || existing?.translation) :
                       (existing?.translation || "You have a right to your duty, but not to the fruits thereof.");

    if (!apiKey) {
      if (language === 'hi') {
        return res.json({
          verseHeader: `श्रीमद्भगवद्गीता अध्याय ${chapter}, श्लोक ${verse}`,
          sanskrit: sanskritText,
          translation: translText,
          modernContextExplanation: "यह शाश्वत श्लोक सिखाता है कि सच्ची स्वतंत्रता तब मिलती है जब हम अपने आत्म-सम्मान और आनंद को बाह्य परिणाम से मुक्त कर लेते हैं। आधुनिक करियर में यह कार्य को कला बनाकर बर्नआउट (थकावट) से बचाता है।",
          psychologicalInsight: "भविष्य के परिणामों का निरंतर चिंतन मस्तिष्क में तनाव पैदा करता है। केवल प्रक्रिया (प्रक्रिया-लीनता) में रहने से 'स्थितप्रज्ञ' शांति प्राप्त होती है।",
          dailyContemplationPractice: "आज कोई भी मुख्य कार्य आरंभ करने से पहले 3 गहरी श्वास लें और कहें: 'मैं पूरी निष्ठा से यह कर्म करता हूँ और फल की चिंता से मुक्त होता हूँ।'"
        });
      } else if (language === 'te') {
        return res.json({
          verseHeader: `శ్రీమద్భగవద్గీత అధ్యాయం ${chapter}, శ్లోకం ${verse}`,
          sanskrit: sanskritText,
          translation: translText,
          modernContextExplanation: "బాహ్య ప్రశంసలు మరియు ఫలితాల వ్యామోహం నుండి మనస్సును విడిపించినప్పుడే నిజమైన స్వేచ్ఛ లభిస్తుందని ఈ శ్లోకం బోధిస్తుంది. ఉద్యోగాల్లో అలసట, ఒత్తిడిని నివారించి మన పనిని ఒక యజ్ఞంగా మారుస్తుంది.",
          psychologicalInsight: "భవిష్యత్ ఫలితాలపై అతిగా ఆలోచించడం వల్ల దీర్ఘకాలిక మానసిక ఒత్తిడి కలుగుతుంది. ప్రస్తుత కార్యాచరణపై దృష్టి పెట్టినప్పుడు ప్రశాంతమైన 'స్థితప్రజ్ఞ' స్థితి లభిస్తుంది.",
          dailyContemplationPractice: "ఈ రోజు మీ ప్రధాన పనిని ప్రారంభించే ముందు 3 దీర్ఘ శ్వాసలు తీసుకోండి: 'నేను శ్రద్ధతో నా శ్రమను అర్పిస్తాను; ఫలితం గురించిన భయం వీడతాను' అని సంకల్పించండి."
        });
      }

      return res.json({
        verseHeader: `Bhagavad Gita Chapter ${chapter}, Verse ${verse}`,
        sanskrit: sanskritText,
        translation: translText,
        modernContextExplanation: "This timeless verse teaches that true freedom comes when we separate our personal dignity and joy from external validation. In modern careers, it prevents burnout by turning work into art.",
        psychologicalInsight: "Cognitive obsession with future outcomes activates chronic stress circuits. Staying rooted in process produces flow state (Sthitaprajna).",
        dailyContemplationPractice: "Before starting your principal task today, take 3 deep breaths and mentally declare: 'I offer this effort with complete sincerity; I release all anxiety about results.'"
      });
    }

    const langDirective = language === 'hi' ? 'Hindi (हिन्दी / देवनागरी लिपि)' : language === 'te' ? 'Telugu (తెలుగు లిపి)' : 'English';

    const prompt = `Provide an illuminating, modern contextual commentary on Bhagavad Gita Chapter ${chapter}, Verse ${verse}.
${existing ? `Sanskrit: ${existing.sanskrit}\nTranslation: ${translText}` : ''}
${userSituation ? `The seeker is applying this verse to their current situation: "${userSituation}"` : ''}
Target Language: ${langDirective}

CRITICAL: All commentary fields (verseHeader, translation, modernContextExplanation, psychologicalInsight, dailyContemplationPractice) MUST BE IN ${langDirective}.

Generate a clear, insightful breakdown:
1. Verse Header in target language
2. Sanskrit text and Translation in target language
3. Modern Context Explanation (how it solves 21st-century issues: stress, ambition, relationships, identity)
4. Psychological Insight (aligning neuroscience / cognitive psychology with Gita wisdom)
5. Daily Contemplation Practice (a concrete 2-minute actionable exercise)

Return strictly valid JSON:
{
  "verseHeader": "string",
  "sanskrit": "string",
  "translation": "string",
  "modernContextExplanation": "string",
  "psychologicalInsight": "string",
  "dailyContemplationPractice": "string"
}`;

    let parsed: any = null;
    try {
      const textResponse = await generateGeminiContent({
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.6
        }
      });
      parsed = JSON.parse(textResponse.trim());
    } catch (apiErr) {
      console.warn("Shloka explain fell back to synthesis:", apiErr);
      if (language === 'hi') {
        parsed = {
          verseHeader: `श्रीमद्भगवद्गीता अध्याय ${chapter}, श्लोक ${verse}`,
          sanskrit: sanskritText,
          translation: translText,
          modernContextExplanation: "यह श्लोक सिखाता है कि फल की चिंता त्यागकर कर्म में लीन होने से ही सच्चा आनंद और कार्यकुशलता प्राप्त होती है।",
          psychologicalInsight: "अति-विचार से मुक्त होकर वर्तमान में जीने से मानसिक शांति और एकाग्रता बढ़ती है।",
          dailyContemplationPractice: "कार्य प्रारंभ करने से पूर्व 3 गहरी श्वास लें और फल की आसक्ति रहित कर्म का संकल्प करें।"
        };
      } else if (language === 'te') {
        parsed = {
          verseHeader: `శ్రీమద్భగవద్గీత అధ్యాయం ${chapter}, శ్లోకం ${verse}`,
          sanskrit: sanskritText,
          translation: translText,
          modernContextExplanation: "ఫలితంపై వ్యామోహం వీడి పనిలో లగ్నమైనప్పుడే సంపూర్ణ నైపుణ్యం, ఆనందం సాధ్యమవుతాయి.",
          psychologicalInsight: "ప్రస్తుత క్షణంలో జీవించడం వల్ల మానసిక అలజడి తగ్గి ప్రశాంతత చేకూరుతుంది.",
          dailyContemplationPractice: "పని ప్రారంభానికి ముందు 3 దీర్ఘ శ్వాసలతో మనస్సును నిలకడ చేసుకోండి."
        };
      } else {
        parsed = {
          verseHeader: `Bhagavad Gita Chapter ${chapter}, Verse ${verse}`,
          sanskrit: sanskritText,
          translation: translText,
          modernContextExplanation: "This timeless verse teaches that true freedom comes when we separate our personal dignity and joy from external validation. In modern careers, it prevents burnout by turning work into art.",
          psychologicalInsight: "Cognitive obsession with future outcomes activates chronic stress circuits. Staying rooted in process produces flow state (Sthitaprajna).",
          dailyContemplationPractice: "Before starting your principal task today, take 3 deep breaths and mentally declare: 'I offer this effort with complete sincerity; I release all anxiety about results.'"
        };
      }
    }
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/gita/shloka/explain:', error);
    res.status(500).json({ error: 'Failed to generate verse explanation' });
  }
});

// -------------------------------------------------------------
// 5. REFLECTION & WELLNESS MODULE
// -------------------------------------------------------------
app.get('/api/reflection/prompts', (req, res) => {
  const lang = String(req.query.language || 'en');
  if (lang === 'hi') {
    return res.json(MULTILINGUAL_REFLECTION_PROMPTS.map(p => p.hi));
  }
  if (lang === 'te') {
    return res.json(MULTILINGUAL_REFLECTION_PROMPTS.map(p => p.te));
  }
  res.json(MULTILINGUAL_REFLECTION_PROMPTS.map(p => p.en));
});

app.post('/api/reflection/analyze', async (req, res) => {
  try {
    const { content, moodRating, language = 'en' } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Journal content is required' });
    }

    if (!apiKey) {
      if (language === 'hi') {
        return res.json({
          aiFeedback: "आपका आत्म-चिंतन गहरी निष्कपटता और सत्यनिष्ठा को दर्शाता है। भगवान श्रीकृष्ण कहते हैं कि जो साधक अपनी आंतरिक वृत्तियों का ईमानदारी से निरीक्षण करता है, उसने आत्म-उत्थान की यात्रा आरंभ कर दी है। स्वयं की कटु आलोचना किए बिना अपनी भावनाओं को स्वीकार करें।",
          assignedVerse: {
            chapter: 6,
            verse: 5,
            translation: "मनुष्य को अपने मन के द्वारा अपना उद्धार करना चाहिए। मन ही जीवात्मा का परम मित्र है और वही सबसे बड़ा शत्रु भी।"
          },
          virtueGained: "आत्म-अवलोकन एवं सजगता (आत्म-विचार)",
          practicalTip: "कल प्रातः फोन देखने से पहले 5 मिनट मौन में कृतज्ञता का अनुभव करें।"
        });
      } else if (language === 'te') {
        return res.json({
          aiFeedback: "మీ అంతరంగ పరిశీలన ఎంతో నిష్కల్మషమైనది మరియు సత్యసంధమైనది. తన అంతరంగాన్ని నిష్పక్షపాతంగా పరిశీలించే సాధకుడే ఆత్మ పురోగతి మార్గంలో పయనిస్తున్నాడని శ్రీకృష్ణుడు తెలియజేస్తున్నాడు. మిమ్మల్ని మీరు కించపరచుకోకుండా, శాంతితో ముందుకు సాగండి.",
          assignedVerse: {
            chapter: 6,
            verse: 5,
            translation: "మనిషి తన మనస్సు ద్వారా తన్ను తాను ఉద్ధరించుకోవాలి; మనస్సే మిత్రుడు, మనస్సే పరమ శత్రువు."
          },
          virtueGained: "ఆత్మ విచారణ & స్పృహ",
          practicalTip: "రేపు ఉదయం మొబైల్ చూసే ముందు 5 నిమిషాలు నిశ్శబ్దంలో పరమాత్మకు కృతజ్ఞతలు తెలుపుకోండి."
        });
      }

      return res.json({
        aiFeedback: "Your reflection shows deep sincerity. Sri Krishna observes that the seeker who examines their inner life with honesty has already begun the journey of self-elevation. Continue acknowledging your emotions without harsh self-condemnation.",
        assignedVerse: {
          chapter: 6,
          verse: 5,
          translation: "Elevate yourself through the power of your own mind; do not degrade yourself. For the mind is the greatest friend of the self, and also its bitterest enemy."
        },
        virtueGained: "Self-Awareness (Atma-Vichara)",
        practicalTip: "Tomorrow morning, begin your day with 5 minutes of silent gratitude before checking your phone."
      });
    }

    const langDirective = language === 'hi' ? 'Hindi (हिन्दी / देवनागरी लिपि)' : language === 'te' ? 'Telugu (తెలుగు లిపి)' : 'English';

    const prompt = `Read this spiritual seeker's journal reflection and mood rating (${moodRating}/10):
"${content}"
Target Language: ${langDirective}

Provide loving, compassionate, uplifting feedback as a Bhagavad Gita spiritual mentor:
- Provide an encouraging mentor perspective honoring their vulnerability
- Assign a specific Bhagavad Gita verse (Chapter, Verse, Translation in target language) that directly illuminates their reflection
- Identify the virtue cultivated through this reflection (e.g., in Hindi: आत्म-विचार, स्थितप्रज्ञता, तितिक्षा, शांति, करुणा; in Telugu: ఆత్మ విచారణ, స్థితప్రజ్ఞత, తితిక్ష, శాంతి; in English: Sthitaprajna, Titiksha, Shanti, Shraddha, Karuna)
- One practical micro-habit for tomorrow

CRITICAL: All fields (aiFeedback, assignedVerse.translation, virtueGained, practicalTip) MUST BE IN ${langDirective}.

Return valid JSON:
{
  "aiFeedback": "string",
  "assignedVerse": {
    "chapter": number,
    "verse": number,
    "translation": "string"
  },
  "virtueGained": "string",
  "practicalTip": "string"
}`;

    let parsed: any = null;
    try {
      const textResponse = await generateGeminiContent({
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5
        }
      });
      parsed = JSON.parse(textResponse.trim());
    } catch (apiErr) {
      console.warn("Reflection analysis fell back to synthesis:", apiErr);
      if (language === 'hi') {
        parsed = {
          aiFeedback: "आपका आत्म-चिंतन गहरी निष्कपटता को दर्शाता है। श्रीकृष्ण कहते हैं कि जो साधक अपनी आंतरिक वृत्तियों का ईमानदारी से निरीक्षण करता है, उसने आत्म-उत्थान की यात्रा आरंभ कर दी है।",
          assignedVerse: {
            chapter: 6,
            verse: 5,
            translation: "मनुष्य को अपने मन के द्वारा अपना उद्धार करना चाहिए; मन ही मित्र है और मन ही शत्रु।"
          },
          virtueGained: "आत्म-अवलोकन (आत्म-विचार)",
          practicalTip: "कल प्रातः 5 मिनट मौन में कृतज्ञता का अनुभव करें।"
        };
      } else if (language === 'te') {
        parsed = {
          aiFeedback: "మీ అంతరంగ పరిశీలన ఎంతో నిష్కల్మషమైనది. తన అంతరంగాన్ని నిష్పక్షపాతంగా పరిశీలించే సాధకుడే ఆత్మ పురోగతిలో ముందడుగు వేస్తున్నాడు.",
          assignedVerse: {
            chapter: 6,
            verse: 5,
            translation: "మనిషి తన మనస్సు ద్వారా తన్ను తాను ఉద్ధరించుకోవాలి; మనస్సే మిత్రుడు, మనస్సే పరమ శత్రువు."
          },
          virtueGained: "ఆత్మ విచారణ & వివేకం",
          practicalTip: "రేపు ఉదయం 5 నిమిషాలు నిశ్శబ్దంలో పరమాత్మకు కృతజ్ఞతలు తెలుపుకోండి."
        };
      } else {
        parsed = {
          aiFeedback: "Your reflection shows deep sincerity. Sri Krishna observes that the seeker who examines their inner life with honesty has already begun the journey of self-elevation. Continue acknowledging your emotions without harsh self-condemnation.",
          assignedVerse: {
            chapter: 6,
            verse: 5,
            translation: "Elevate yourself through the power of your own mind; do not degrade yourself. For the mind is the greatest friend of the self, and also its bitterest enemy."
          },
          virtueGained: "Self-Awareness (Atma-Vichara)",
          practicalTip: "Tomorrow morning, begin your day with 5 minutes of silent gratitude before checking your phone."
        };
      }
    }
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/reflection/analyze:', error);
    res.status(500).json({ error: 'Failed to analyze reflection' });
  }
});

// -------------------------------------------------------------
// TEXT-TO-SPEECH (TTS) MODULE: Sri Krishna Telugu & Hindi Audio
// -------------------------------------------------------------
const ttsAudioCache = new Map<string, { audioData: string; mimeType: string; spokenText: string }>();

function isMostlyLatinText(str: string): boolean {
  let latinCount = 0;
  let nonLatinCount = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
      latinCount++;
    } else if (code > 255) {
      nonLatinCount++;
    }
  }
  return latinCount > nonLatinCount;
}

app.post('/api/tts/generate', async (req, res) => {
  try {
    const { text, language = 'hi', voiceName } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Valid text is required for TTS' });
    }

    const targetLang = (language === 'te' ? 'te' : language === 'hi' ? 'hi' : 'en') as 'te' | 'hi' | 'en';

    // Strip markdown formatting and expand shloka citations
    let cleanText = text
      .replace(/https?:\/\/[^\s]+/g, '')
      .replace(/[*#_~`>]/g, '')
      .replace(/\[BG\s*(\d+)[\.:](\d+)\]/gi, (_match, ch, vs) => {
        if (targetLang === 'hi') return `श्रीमद्भगवद्गीता अध्याय ${ch}, श्लोक ${vs}`;
        if (targetLang === 'te') return `శ్రీమద్భగవద్గీత అధ్యాయం ${ch}, శ్లోకం ${vs}`;
        return `Bhagavad Gita Chapter ${ch}, Verse ${vs}`;
      })
      .replace(/\s+/g, ' ')
      .trim();

    // If dialogue language does not match the requested voice language, adapt to authentic speech in target language
    if ((targetLang === 'te' || targetLang === 'hi') && isMostlyLatinText(cleanText) && apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const transPrompt = targetLang === 'te'
          ? `Translate this guidance from Lord Krishna into natural, compassionate, poetic Telugu (తెలుగు లిపి) as spoken by Sri Krishna in the Bhagavad Gita:\n\n"${cleanText.slice(0, 500)}"\n\nOnly return the translated Telugu speech text, without notes:`
          : `Translate this guidance from Lord Krishna into natural, compassionate, poetic Hindi (देवनागरी लिपि) as spoken by Sri Krishna in the Bhagavad Gita:\n\n"${cleanText.slice(0, 500)}"\n\nOnly return the translated Hindi speech text, without notes:`;

        const translated = await generateGeminiContent({
          contents: transPrompt,
          config: { temperature: 0.3 }
        });
        if (translated && translated.trim()) {
          cleanText = translated.trim();
        }
      } catch (transErr) {
        console.warn('TTS translation adaptation skipped:', transErr);
      }
    } else if (targetLang === 'en' && !isMostlyLatinText(cleanText) && apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const transPrompt = `Translate this guidance or Bhagavad Gita teaching into natural, compassionate, and inspiring English as spoken by Lord Krishna to Arjuna:\n\n"${cleanText.slice(0, 500)}"\n\nOnly return the translated English speech text, without notes:`;
        const translated = await generateGeminiContent({
          contents: transPrompt,
          config: { temperature: 0.3 }
        });
        if (translated && translated.trim()) {
          cleanText = translated.trim();
        }
      } catch (transErr) {
        console.warn('TTS English translation adaptation skipped:', transErr);
      }
    }

    // Check memory cache
    const cacheKey = `${targetLang}:${cleanText.slice(0, 160)}`;
    if (ttsAudioCache.has(cacheKey)) {
      const cached = ttsAudioCache.get(cacheKey)!;
      return res.json({
        audioData: cached.audioData,
        mimeType: cached.mimeType,
        language: targetLang,
        spokenText: cached.spokenText,
        source: 'gemini-tts-cached'
      });
    }

    // Generate high-fidelity WAV speech with Gemini 3.8 Flash Lite TTS
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const chosenVoice = voiceName || (targetLang === 'te' ? 'Puck' : targetLang === 'hi' ? 'Fenrir' : 'Aoede');
        const voiceStyle = targetLang === 'te'
          ? "శ్రీకృష్ణ పరమాత్ముని అమృతతుల్యమైన, కరుణాపూరితమైన, ప్రశాంతమైన దివ్య వాణి."
          : targetLang === 'hi'
          ? "भगवान श्रीकृष्ण की शांत, गंभीर, करुणामयी और ओजस्वी वाणी जो श्रोता को निर्भय और स्थिर करे।"
          : "Lord Sri Krishna speaking in a peaceful, divine, compassionate, resonant, and inspiring English voice.";

        const ttsResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: cleanText.slice(0, 600), // Limit single vocalization chunk for optimum latency
                  speechMetadata: {
                    style: voiceStyle,
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: chosenVoice },
              },
            },
          },
        });

        const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          ttsAudioCache.set(cacheKey, {
            audioData: base64Audio,
            mimeType: 'audio/wav',
            spokenText: cleanText
          });

          return res.json({
            audioData: base64Audio,
            mimeType: 'audio/wav',
            language: targetLang,
            spokenText: cleanText,
            source: 'gemini-tts'
          });
        }
      } catch (geminiTtsErr: any) {
        console.warn('Gemini 3.8 Flash Lite TTS call failed, signaling browser fallback:', geminiTtsErr.message || geminiTtsErr);
      }
    }

    // Fallback to client browser speech synthesis
    res.json({
      fallbackToBrowser: true,
      language: targetLang,
      spokenText: cleanText,
      message: 'Gemini TTS offline; client will use Web Speech API'
    });
  } catch (error: any) {
    console.error('Error in /api/tts/generate:', error);
    res.status(500).json({ error: 'Failed to process TTS', fallbackToBrowser: true });
  }
});

// -------------------------------------------------------------
// 6. DAILY LEARNING MODULE: Quiz
// -------------------------------------------------------------
app.get('/api/quiz/daily', (req, res) => {
  res.json(DAILY_QUIZZES);
});

// -------------------------------------------------------------
// 8. SAFETY & ADMIN MODULE: Emergency Protocols & Audit Logs
// -------------------------------------------------------------
app.post('/api/safety/check', (req, res) => {
  const { text } = req.body;
  if (!text) return res.json({ isCrisis: false });

  const isCrisis = detectCrisisKeywords(text);
  if (isCrisis) {
    const log: SafetyIncidentLog = {
      id: `safe-check-${Date.now()}`,
      timestamp: new Date().toISOString(),
      severity: 'critical',
      triggerCategory: 'self_harm',
      userQuerySnippet: text.slice(0, 100),
      actionTaken: 'Flagged via real-time safety pipeline; emergency crisis modal triggered',
      resourcesProvided: ['988 Lifeline', 'Kiran Mental Health 1800-599-0019', 'Tele-MANAS 14416'],
      resolved: false
    };
    safetyIncidentLogs.unshift(log);
  }

  res.json({
    isCrisis,
    emergencyHotlines: [
      { name: "Suicide & Crisis Lifeline (USA/Canada)", number: "988", type: "call_and_text" },
      { name: "Tele-MANAS National Helpline (India)", number: "14416 or 1800-891-4416", type: "toll_free_24_7" },
      { name: "KIRAN Mental Health Helpline (India)", number: "1800-599-0019", type: "toll_free_24_7" },
      { name: "Vandrevala Foundation Helpline", number: "+91 9999 666 555", type: "call_and_whatsapp" },
      { name: "AASRA Helpline", number: "+91 98204 66726", type: "call_24_7" },
      { name: "International Resources", url: "https://findahelpline.com", type: "global_directory" }
    ]
  });
});

app.get('/api/admin/metrics', (req, res) => {
  res.json({
    serverUptimeSeconds: Math.floor((Date.now() - serverStartTime) / 1000),
    totalApiRequests: apiRequestCount,
    hasGeminiKey: Boolean(apiKey && apiKey.length > 5),
    activeModel: 'gemini-3.8-flash',
    totalSafetyIncidents: safetyIncidentLogs.length,
    unresolvedIncidents: safetyIncidentLogs.filter(l => !l.resolved).length,
    recentIncidents: safetyIncidentLogs.slice(0, 10),
    serverMemory: process.memoryUsage(),
    nodeVersion: process.version
  });
});

app.post('/api/admin/logs/resolve', (req, res) => {
  const { id } = req.body;
  const target = safetyIncidentLogs.find(l => l.id === id);
  if (target) {
    target.resolved = true;
    res.json({ success: true, log: target });
  } else {
    res.status(404).json({ error: 'Log not found' });
  }
});

// -------------------------------------------------------------
// FRONTEND SERVING: Dev vs Prod
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🕉️ Gita AI Wisdom Platform backend running at http://0.0.0.0:${PORT}`);
    console.log(`Backend API endpoints initialized with Gemini 3.8 Flash.`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
