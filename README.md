🕉️ Gita AI Wisdom Platform
A full-stack spiritual intelligence platform powered by the timeless philosophy of the Bhagavad Gita and Google Gemini AI. The platform offers interactive dialogue with Sri Krishna, contextual verse exploration, Ayurvedic emotion diagnosis, ethical dilemma resolution, reflective wellness (Japa & Meditation), and robust crisis safety guardrails in English, Hindi (हिन्दी), and Telugu (తెలుగు).
🌟 Key Features
1. 🦚 Divine Sri Krishna Dialogue (/api/chat)
Always-accessible floating dialog window acting as the seeker's personal Charioteer (Sarathi).
Empathetic, philosophically grounded responses citing specific Bhagavad Gita verses ([BG Chapter.Verse]).
Native fluency and script support in English, Hindi (देवनागरी), and Telugu (తెలుగు లిపి).
Integrated voice recitation via Gemini Text-to-Speech and Web Speech API.
2. 🧘 Vedic Emotion Detection & Remedies (/api/emotion/analyze)
Maps human distress (anxiety, anger, grief, attachment, doubt) onto Gita psychology and the Tri-Guna framework (Sattva, Rajas, Tamas).
Prescribes specific Bhagavad Gita verses tailored to emotional equilibrium.
Actionable remedies: pranayama breathwork (Sama Vritti, Nadi Shodhana, Shitali), mental reframing, and spiritual contemplations.
3. ⚖️ Personalized Guidance & Dilemma Resolution (/api/guidance/dilemma, /api/guidance/gunas)
Ethical Dilemma Engine: Analyzes modern career, relationship, and moral crossroads through Swadharma (authentic duty) and Nishkama Karma (selfless action).
Guna Assessment: Interactive psychological quiz assessing personal distribution of Sattva, Rajas, and Tamas with customized lifestyle, dietary, and spiritual recommendations.
4. 📜 Bhagavad Gita Knowledge Explorer (/api/gita/*)
Complete chapter catalog (all 18 chapters) with Sanskrit titles, meanings, summaries, and verse counts.
Notable shlokas with Devanagari script, Telugu script, Roman transliteration, and multilingual translations.
AI Verse Explainer: Translates ancient wisdom into modern 21st-century context, psychological insights, and daily 2-minute actionable practices.
Multi-field search across themes, Sanskrit terms, emotions, and chapter/verse identifiers.
5. 📿 Reflection & Wellness Sanctuary (/api/reflection/*)
108 Japa Mala Counter: Interactive digital japa bead counter with tactile sound feedback, completion bells, and round tracking.
Dhyana Meditation Timer: Configurable meditation clock with authentic 528 Hz singing bowls, ambient tanpura tones, and Hare Ram chant audio.
Atma-Vichara Journal: Guided self-reflection prompts with AI mentor feedback, virtue cultivation tracking, and assigned Gita verses.
6. 📖 Daily Learning & Quizzes (/api/quiz/daily, /api/gita/shloka/daily)
Verse of the Day with contextual reflection.
Daily interactive Bhagavad Gita quizzes covering philosophy, history, and life applications.
User progress tracking: reading streaks, verses memorized/bookmarked, meditation minutes, and japa counts.
7. 🛡️ Comprehensive Crisis Safety Guardrails (/api/safety/*)
Real-time screening for self-harm and acute mental health crisis keywords.
Automatic compassionate intervention card displaying immediate 24/7 toll-free crisis lifelines:
988 Suicide & Crisis Lifeline (US & Canada)
Tele-MANAS (14416 / 1800-891-4416, India)
KIRAN Mental Health Helpline (1800-599-0019, India)
Vandrevala Foundation (+91 9999 666 555)
Server-side safety incident logging and admin metrics dashboard.
🛠️ Architecture & Tech Stack
code
Text
┌─────────────────────────────────────────────────────────────┐
│                    React 19 Frontend                        │
│   (Vite, Tailwind CSS v4, Lucide Icons, Motion Animations)  │
│      English  │  हिन्दी (Hindi)  │  తెలుగు (Telugu)        │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON
┌──────────────────────────────▼──────────────────────────────┐
│                    Express.js Backend                       │
│    (tsx server.ts, Vite Middleware in Dev, Static in Prod)  │
├─────────────────────────────────────────────────────────────┤
│  • Sri Krishna Chatbot       • Emotion Detection Engine     │
│  • Knowledge Explorer API    • Guna & Dilemma Resolver      │
│  • Reflection & Japa Audio   • Safety & Audit Subsystem     │
└──────────────────────────────┬──────────────────────────────┘
                               │ Google Gen AI SDK
┌──────────────────────────────▼──────────────────────────────┐
│                    Google Gemini AI                         │
│   - gemini-3.8-flash (Reasoning, Multi-turn Chat, Analysis) │
│   - gemini-3.8-flash-lite-tts (High-fidelity Voice Audio)  │
│   - Built-in scriptural fallbacks when offline or unkeyed   │
└─────────────────────────────────────────────────────────────┘
Technology Highlights
Frontend: React 19, TypeScript, Vite 8, Tailwind CSS v4 (@tailwindcss/vite), motion, lucide-react.
Backend: Node.js, Express 4, tsx TypeScript runtime, dotenv.
AI / LLM: @google/genai TypeScript SDK with model cascading (gemini-3.8-flash, gemini-flash-latest, gemini-3.1-flash-lite, gemini-3.8-flash-lite-tts).
Audio Synthesis: Web Audio API (harmonics, 528 Hz solfeggio singing bowl, temple bell) + local sacred wav audio.
📁 Project Structure
code
Text
├── index.html                   # HTML entry point with Cinzel & Cormorant fonts
├── metadata.json                # Project capabilities and applet metadata
├── package.json                 # Dependencies and npm scripts
├── server.ts                    # Express backend, Gemini routes, safety pipeline
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS v4
├── public/
│   └── audio/
│       └── hare_ram_chant.wav   # Authentic sacred chant audio
└── src/
    ├── main.tsx                 # React application mounting point
    ├── App.tsx                  # Root layout, navigation, persistent progress
    ├── index.css                # Global Tailwind CSS and gold styling tokens
    ├── components/
    │   ├── ChatbotModule.tsx           # Floating Krishna dialogue dialog
    │   ├── DailyLearningModule.tsx     # Daily shloka & interactive quizzes
    │   ├── EmotionDetectionModule.tsx  # Emotion diagnosis & remedies
    │   ├── Header.tsx                  # Top bar with multilingual selector & audio
    │   ├── KnowledgeModule.tsx         # 18 Chapters explorer & AI verse insights
    │   ├── KrishnaVoicePlayer.tsx      # Multi-language voice playback controller
    │   ├── OpeningPage.tsx             # Hero sanctuary, dashboard, quick access
    │   ├── PersonalizedGuidanceModule.tsx # Swadharma dilemmas & Guna quiz
    │   └── ReflectionWellnessModule.tsx   # Japa mala, meditation, journaling
    ├── context/
    │   └── LanguageContext.tsx         # Language state provider (EN / HI / TE)
    ├── data/
    │   └── gitaData.ts                 # Gita chapters, notable verses, quizzes
    ├── i18n/
    │   └── translations.ts             # Complete UI strings in EN, HI, and TE
    ├── services/
    │   └── api.ts                      # Client-side API fetch client & fallbacks
    ├── types/
    │   └── gita.ts                     # TypeScript interfaces & types
    └── utils/
        ├── audio.ts                    # Web Audio synthesizer for bells & bowls
        ├── speechTts.ts                # Client-side Web Speech fallback engine
        └── youtubeAudio.ts             # Sacred ambient sound utilities
🚀 Getting Started
Prerequisites
Node.js (v18.0.0 or higher recommended)
npm (v9.0.0 or higher)
1. Clone & Install Dependencies
code
Bash
# Clone the repository
git clone <your-repo-url>
cd gita-ai-wisdom-platform

# Install dependencies
npm install
2. Configure Environment Variables
Create a .env file in the root directory:
code
Env
# Google Gemini API Key (Required for full AI generation and TTS)
GEMINI_API_KEY=your_gemini_api_key_here

# Server Port (Default is 3000)
PORT=3000
Note: If GEMINI_API_KEY is not provided, the platform automatically utilizes its high-fidelity built-in scriptural wisdom fallbacks, ensuring zero downtime and fully offline-capable responses.
3. Run Development Server
code
Bash
npm run dev
Open your browser at http://localhost:3000 to interact with the platform.
4. Build for Production
code
Bash
# Build the React frontend into /dist
npm run build

# Start the full-stack server in production mode
npm start
5. Type Checking / Linting
code
Bash
npm run lint
📡 API Reference
Endpoint	Method	Description
/api/health	GET	Health check, server uptime, Gemini key status, request counts
/api/chat	POST	Dialogue with Sri Krishna with context, verses, and language support
/api/emotion/analyze	POST	Analyzes feelings using Gita psychology, Gunas, and breathwork
/api/guidance/dilemma	POST	Resolves moral/career dilemmas using Swadharma and Nishkama Karma
/api/guidance/gunas	POST	Computes Sattva, Rajas, and Tamas distribution percentages
/api/gita/chapters	GET	Returns list of all 18 Bhagavad Gita chapters
/api/gita/chapter/:id	GET	Returns details and notable verses for a specific chapter
/api/gita/shloka/daily	GET	Returns the deterministic verse of the day
/api/gita/search	GET	Search verses by Sanskrit text, translation, theme, or emotion
/api/gita/shloka/explain	POST	Generates modern contextual, psychological commentary for any verse
/api/reflection/prompts	GET	Retrieves multilingual journaling contemplation prompts
/api/reflection/analyze	POST	Provides spiritual feedback, virtue identification, and verse assignment
/api/tts/generate	POST	Generates divine speech audio via gemini-3.8-flash-lite-tts
/api/quiz/daily	GET	Fetches daily learning quiz questions with explanations
/api/safety/check	POST	Real-time crisis detection and emergency hotline provisioning
/api/admin/metrics	GET	Audit metrics, memory usage, and unresolved safety incident logs
/api/admin/logs/resolve	POST	Marks an audit safety incident as resolved
🌐 Multilingual Support
The platform is designed ground-up for trilingual parity:
English: International seeker audience.
Hindi (हिन्दी): Native Devanagari script for chants, dialogues, and scriptural commentary.
Telugu (తెలుగు): Complete Telugu script translations for all verses, UI components, and Sri Krishna dialogues.
Switch languages seamlessly via the language selector in the top header.
🕊️ Safety & Ethical Guidelines
Non-Clinical Disclaimer: The Gita AI Wisdom Platform provides spiritual, philosophical, and contemplative guidance inspired by the Bhagavad Gita. It is not a substitute for licensed medical, psychiatric, or psychological diagnosis or treatment.
Immediate Intervention: Any input conveying self-harm or suicidal intent is immediately intercepted, displaying emergency helpline numbers with 24/7 access.
📜 License
This project is licensed under the MIT License.
