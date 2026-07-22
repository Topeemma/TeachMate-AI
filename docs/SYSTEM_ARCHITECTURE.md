# System Architecture Document
## Teacher Planning Assistant — Nigerian Primary School AI Studio

---

### 1. Overview
The **Teacher Planning Assistant** is a full-stack, multi-agent AI system built on React, TypeScript, Node.js (Express), and Google Gemini (`@google/genai`). It employs a centralized Orchestrator Pattern to coordinate approximately 20 specialist agents, converting primary school curriculum topics into structured, multi-modal, NERDC-aligned educational packages.

---

### 2. System Context Diagram (C4 Level 1)

```mermaid
graph TD
    Teacher[Primary School Teacher / Inspector] -->|Interacts via Browser UI| Frontend[React + Vite Frontend Studio]
    Frontend -->|HTTPS / JSON API Calls| ExpressServer[Express Node.js Backend Server]
    
    ExpressServer -->|@google/genai SDK| GeminiAPI[Google Gemini API]
    ExpressServer -->|REST API| PixverseAPI[Pixverse Video Generation API]
    ExpressServer -->|REST API (Reserved)| PadiAPI[Padi Long Video API]
    ExpressServer -->|HTTP Search| YouTubeAPI[YouTube Search / OEmbed API]
    
    subgraph Security Boundary (Server-Side Only)
        ExpressServer
        GeminiAPI
        PixverseAPI
        PadiAPI
    end
```

---

### 3. Container Diagram (C4 Level 2)

```mermaid
graph TB
    subgraph Client Browser Container
        UI[React 19 SPA - Tailwind CSS]
        State[Zustand / React Context State Manager]
        Editor[Monaco / Content Editable Studio Views]
        Storage[Browser LocalStorage Cache]
        
        UI --> State
        UI --> Editor
        State --> Storage
    end

    subgraph Express Backend Container (Port 3000)
        Server[Express App / Router]
        Orchestrator[Agent Orchestrator Engine]
        Registry[Specialist Agent Registry]
        Schemas[Zod Schema Validators]
        
        Server --> Orchestrator
        Orchestrator --> Registry
        Orchestrator --> Schemas
    end

    UI -->|POST /api/generate-lesson| Server
    UI -->|POST /api/translate-section| Server
    UI -->|POST /api/generate-video| Server
    UI -->|POST /api/generate-audio| Server

    Registry -->|Gemini 3.6 Flash / 3.1 Pro| GeminiAPI[Google Gemini Service]
    Registry -->|Pixverse Video Endpoint| PixverseService[Pixverse Video API]
    Registry -->|Gemini TTS / Audio Synthesis| GeminiTTSService[Gemini Speech Service]
```

---

### 4. Frontend Architecture
* **Framework:** React 19 SPA bundled with Vite 6.
* **Styling:** Tailwind CSS v4 utility classes with custom typography scale (Plus Jakarta Sans for UI/body, Playfair Display for display headers).
* **Animations:** `motion` (fka `framer-motion`) for smooth card transitions, accordions, and status badge updates.
* **Icons:** `lucide-react` icons exclusively.
* **State Management:** React Context + `localStorage` persistence for session restoration.
* **Components Breakdown:**
  - `Header`: App branding, subject/grade status bar, approval counter pill, export button.
  - `SetupForm`: Subject, Grade (Primary 1–6), Duration, Topic input, and textbook evidence file dropzone.
  - `EvidenceConfirmModal`: Shows retrieved curriculum evidence for teacher approval.
  - `OrchestrationProgress`: Live progress timeline showing active specialist agents.
  - `StudioWorkspace`: Tabbed/split view showing the 12+ lesson sections.
  - `SectionCard`: Generic wrapper for each section with editable fields, status badge (`needs_review` vs `approved`), regenerate button, and translation selector.
  - `SlideDeckViewer`: Interactive 6-slide presentation carousel with speaker notes and visual prompts.
  - `MediaPlayers`: Pixverse video player and Gemini 2-voice audio podcast player.
  - `ExportModal`: Print preview and downloadable package builder.

---

### 5. Server Architecture
* **Runtime:** Node.js Express server running on Port `3000` (`0.0.0.0` binding).
* **Dev/Build Execution:**
  - Dev: `tsx server.ts`
  - Build: `vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --outfile=dist/server.cjs`
  - Start: `node dist/server.cjs`
* **API Isolation:** API endpoints mounted under `/api/*` prior to Vite middleware static asset serving.
* **Environment Credentials:** Environment variables loaded via central `dotenv` configuration. `GEMINI_API_KEY`, `PIXVERSE_API_KEY`, and `PADI_API_KEY` are consumed exclusively server-side.

---

### 6. Agent Orchestration Architecture

```
                       [Teacher Request / Evidence]
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │ Orchestrator Agent Engine   │
                    └──────────────┬──────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          ▼                        ▼                        ▼
  [Phase 1: Grounding]    [Phase 2: Core Text]     [Phase 3: Multi-Modal]
  • Curriculum Retrieval  • Lesson Planning        • Visual/Diagram Design
  • Curriculum Match      • Teacher Notes          • Slide Deck (PPT)
  • Citation Verification • Learner Notes          • YouTube Curation
                          • Activity Design        • Pixverse Video (15s)
                          • Assessment (Quiz)      • Audio Script & Podcast
                          • Worksheet & Rubric     • Multilingual Translator
                                   │
                                   ▼
                         [Phase 4: Review]
                         • Primary Safety Filter
                         • Quality Review Agent
                                   │
                                   ▼
                    [FullLessonPackage JSON]
                                   │
                                   ▼
                   [Human Review & Approval Lock]
```

The Orchestrator operates as a deterministic pipeline manager that invokes specialist agents sequentially or in parallel batches. Inputs and outputs between agents are strictly validated using Zod schemas. If an agent fails or an external key is missing, a predefined fallback object is returned without failing the parent pipeline.

---

### 7. Specialist Agent Registry (~20 Agents)

| Agent Name | Primary Responsibility | Input Schema | Output Schema | Allowed Tools | Prohibited Actions | Fallback Behavior | Human Review Gate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Curriculum Retrieval** | Extract learning objectives from uploaded textbook files/text. | `{ rawInput, fileBuffer? }` | `{ extractedText, objectives[] }` | Text extraction parser | Inventing non-existent text | Returns default topic objectives | Required |
| **2. Curriculum Match** | Verify alignment with NERDC Primary 1–6 schemes of work. | `{ subject, grade, objectives }` | `{ nerdeMatched, benchmarkTopic }` | Gemini 3.6 Flash | Modifying selected grade level | Uses user-provided topic as benchmark | Automatic |
| **3. Lesson Planning** | Produce 5-step delivery lesson plan with durations. | `{ subject, grade, topic, objectives }` | `LessonPlanSchema` | Gemini 3.6 Flash | Outputting unstructured text | Generates standard 5-step template | Required |
| **4. Teacher Notes** | Generate pedagogical background & misconception alerts. | `{ subject, grade, topic }` | `TeacherNotesSchema` | Gemini 3.6 Flash | Using westernized analogies | Provides standard teaching notes | Required |
| **5. Learner Notes** | Write age-appropriate summary notes for pupils. | `{ grade, topic, keyTerms }` | `LearnerNotesSchema` | Gemini 3.6 Flash | Exceeding target reading level | Uses simplified bullet list | Required |
| **6. Activity Design** | Create hands-on tasks using local Nigerian materials. | `{ subject, grade, topic }` | `ActivitySchema` | Gemini 3.6 Flash | Suggesting costly lab equipment | Uses bottle caps & paper task | Required |
| **7. Assessment (Quiz)** | Build 5–10 question quiz with complete answer key. | `{ grade, topic }` | `QuizSchema` | Gemini 3.6 Flash | Omitted answer explanations | Generates 5 basic MCQs | Required |
| **8. Worksheet & Rubric** | Create printable homework worksheet & 4-tier rubric. | `{ grade, topic }` | `WorksheetSchema` | Gemini 3.6 Flash | Missing grading criteria | Generates default homework worksheet | Required |
| **9. Visual/Diagram Design** | Plan educational visual diagrams and artwork descriptions. | `{ topic, grade }` | `DiagramSchema` | Gemini 3.6 Flash | Requesting unsafe imagery | Generates static text visual plan | Required |
| **10. Slide Deck (PPT)** | Generate 6-slide presentation with visual prompts. | `{ topic, lessonPlan }` | `SlideDeckSchema` | Gemini 3.6 Flash | Exceeding 6 slides limit | Generates 6 core outline slides | Required |
| **11. YouTube Curation** | Find 3 age-safe educational YouTube video links. | `{ topic, subject }` | `YouTubeSchema` | YouTube OEmbed / Search | Directing to unverified channels | Provides YouTube search query link | Automatic |
| **12. Pixverse Video** | Generate 15-second topic animation video. | `{ topicPrompt }` | `{ videoUrl, status }` | Pixverse REST API | Exceeding 15s duration limit | Returns visual animated poster banner | Required |
| **13. Multilingual Translation**| Translate sections to Yoruba, Igbo, Hausa, Pidgin. | `{ sectionText, targetLang }` | `{ translatedText }` | Gemini 3.6 Flash | Corrupting scientific terms | Returns original English text | Required |
| **14. Audio Script** | Write 2-voice podcast script (Teacher & Pupil). | `{ topic, learnerNotes }` | `AudioScriptSchema` | Gemini 3.6 Flash | Monologue format | Generates 2-voice Q&A script | Automatic |
| **15. Audio Production** | Synthesize audio podcast using Gemini TTS SDK. | `{ script }` | `{ audioBase64, mimeType }` | Gemini TTS API | Storing audio on client disk | Returns transcript-only player | Required |
| **16. Citation Verification** | Verify references against NERDC curriculum standards. | `{ lessonPackage }` | `{ verified: boolean, citations[] }` | Gemini 3.6 Flash | Fabricating source citations | Flags section as "NERDC General" | Automatic |
| **17. Primary Safety** | Audit content for age-appropriateness & child safety. | `{ textContent }` | `{ safe: boolean, flags[] }` | Gemini 3.6 Flash | Modifying educational intent | Redacts unsafe phrases | Automatic |
| **18. Quality Review** | Check overall package completeness and formatting. | `{ FullLessonPackage }` | `{ score, complete: boolean }` | Schema Validator | Silently dropping missing fields | Fills missing fields with defaults | Automatic |
| **19. Export Agent** | Compile approved package into printable view & PDF. | `{ ApprovedPackage }` | `{ htmlString, pdfBlob }` | Client Print Engine | Exporting unapproved packages | Disables download button | Mandatory Lock |
| **20. Reserved Padi Video**| Reserved agent for future > 60s deep-dive video. | `{ topic, script }` | `{ videoUrl, status }` | Reserved Padi API | Invoking without key | Returns feature preview banner | Optional |

---

### 8. Data Model & Zod Schemas

```typescript
import { z } from "zod";

export const ReviewStatusSchema = z.enum(["needs_review", "approved"]);
export const LanguageSchema = z.enum(["en", "yo", "ig", "ha", "pcm"]);

export const LessonPlanSchema = z.object({
  title: z.string(),
  subject: z.string(),
  grade: z.string(),
  durationMinutes: z.number().default(40),
  behavioralObjectives: z.array(z.string()),
  materialsNeeded: z.array(z.string()),
  deliverySteps: z.object({
    setInduction: z.object({ duration: z.string(), teacherActivity: z.string(), pupilActivity: z.string() }),
    instruction: z.object({ duration: z.string(), teacherActivity: z.string(), pupilActivity: z.string() }),
    guidedPractice: z.object({ duration: z.string(), teacherActivity: z.string(), pupilActivity: z.string() }),
    independentPractice: z.object({ duration: z.string(), teacherActivity: z.string(), pupilActivity: z.string() }),
    closure: z.object({ duration: z.string(), teacherActivity: z.string(), pupilActivity: z.string() }),
  }),
  status: ReviewStatusSchema.default("needs_review"),
});

export const TeacherNotesSchema = z.object({
  pedagogicalBackground: z.string(),
  commonMisconceptions: z.array(z.object({ misconception: z.string(), correctionStrategy: z.string() })),
  teachingTips: z.array(z.string()),
  localNigerianAnalogies: z.array(z.string()),
  status: ReviewStatusSchema.default("needs_review"),
});

export const LearnerNotesSchema = z.object({
  summaryText: z.string(),
  keyVocabulary: z.array(z.object({ term: z.string(), definition: z.string() })),
  coreTakeaways: z.array(z.string()),
  translations: z.record(LanguageSchema, z.string()).optional(),
  status: ReviewStatusSchema.default("needs_review"),
});

export const ActivitySchema = z.object({
  activityName: z.string(),
  grouping: z.string(),
  localMaterials: z.array(z.string()),
  stepByStepInstructions: z.array(z.string()),
  expectedOutcome: z.string(),
  status: ReviewStatusSchema.default("needs_review"),
});

export const QuizSchema = z.object({
  questions: z.array(
    z.object({
      id: z.number(),
      questionText: z.string(),
      options: z.array(z.string()).optional(),
      correctAnswer: z.string(),
      explanation: z.string(),
    })
  ),
  status: ReviewStatusSchema.default("needs_review"),
});

export const WorksheetSchema = z.object({
  worksheetTitle: z.string(),
  instructions: z.string(),
  exercises: z.array(z.string()),
  rubric: z.array(z.object({ criteria: z.string(), level1: z.string(), level2: z.string(), level3: z.string(), level4: z.string() })),
  status: ReviewStatusSchema.default("needs_review"),
});

export const SlideSchema = z.object({
  slideNumber: z.number(),
  title: z.string(),
  bulletPoints: z.array(z.string()),
  speakerNotes: z.string(),
  imagePrompt: z.string(),
});

export const SlideDeckSchema = z.object({
  deckTitle: z.string(),
  slides: z.array(SlideSchema),
  status: ReviewStatusSchema.default("needs_review"),
});

export const VideoResourcesSchema = z.object({
  pixverse15sVideoUrl: z.string().optional(),
  pixverseStatus: z.enum(["generated", "fallback", "pending"]),
  youtubeLinks: z.array(
    z.object({
      title: z.string(),
      url: z.string(),
      duration: z.string(),
      recommendedTimestamp: z.string(),
      relevance: z.string(),
    })
  ),
  status: ReviewStatusSchema.default("needs_review"),
});

export const AudioPodcastSchema = z.object({
  title: z.string(),
  dialogueScript: z.array(z.object({ speaker: z.string(), line: z.string() })),
  audioBase64: z.string().optional(),
  status: ReviewStatusSchema.default("needs_review"),
});

export const FullLessonPackageSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  subject: z.string(),
  grade: z.string(),
  topic: z.string(),
  lessonPlan: LessonPlanSchema,
  teacherNotes: TeacherNotesSchema,
  learnerNotes: LearnerNotesSchema,
  activity: ActivitySchema,
  quiz: QuizSchema,
  worksheet: WorksheetSchema,
  slideDeck: SlideDeckSchema,
  videoResources: VideoResourcesSchema,
  audioPodcast: AudioPodcastSchema,
  citationVerification: z.object({ verified: z.boolean(), sources: z.array(z.string()) }),
  safetyAudit: z.object({ safe: z.boolean(), notes: z.string() }),
  overallApprovalStatus: z.enum(["draft", "all_approved"]).default("draft"),
});

export type FullLessonPackage = z.infer<typeof FullLessonPackageSchema>;
```

---

### 9. API Route Plan (`server.ts`)

* **`GET /api/health`**
  - **Description:** Health check endpoint returning server status and env readiness.
  - **Response:** `{ status: "ok", env: { geminiKeyConfigured: boolean, pixverseKeyConfigured: boolean } }`

* **`POST /api/generate-lesson`**
  - **Description:** Triggers the multi-agent orchestration pipeline.
  - **Request Body:** `{ subject: string, grade: string, topic: string, duration?: number, rawEvidenceText?: string }`
  - **Response:** `FullLessonPackage` JSON object.

* **`POST /api/translate-section`**
  - **Description:** Translates a specific text section into Yoruba, Igbo, Hausa, or Pidgin.
  - **Request Body:** `{ text: string, targetLanguage: "yo" | "ig" | "ha" | "pcm", context: string }`
  - **Response:** `{ translatedText: string, targetLanguage: string }`

* **`POST /api/generate-video`**
  - **Description:** Calls Pixverse API to generate a 15-second topic video.
  - **Request Body:** `{ topicPrompt: string }`
  - **Response:** `{ videoUrl: string, status: "generated" | "fallback" }`

* **`POST /api/generate-audio`**
  - **Description:** Calls Gemini TTS to synthesize multi-speaker podcast audio from dialogue script.
  - **Request Body:** `{ dialogueScript: Array<{ speaker: string, line: string }> }`
  - **Response:** `{ audioBase64: string, mimeType: "audio/mp3" }`

---

### 10. Model Configuration Strategy

| Task Category | Selected Model Alias | Configuration Options | Justification |
| :--- | :--- | :--- | :--- |
| **Core Text Generation** | `gemini-3.6-flash` | `temperature: 0.3`, `responseMimeType: "application/json"` | Fast, highly accurate structured JSON generation for primary school pedagogy. |
| **Complex Pedagogical Reasoning** | `gemini-3.1-pro-preview` | `temperature: 0.2` | Used for advanced STEM curriculum matching and misconception strategy design. |
| **Multi-Speaker Podcast TTS** | `gemini-3.1-flash-tts-preview` | `responseModalities: ["AUDIO"]`, `multiSpeakerVoiceConfig` | Synthesizes realistic 2-voice conversation between Teacher and Pupil. |
| **Pixverse Video Generation** | `pixverse-v2-api` | `maxDurationSeconds: 15`, `aspectRatio: "16:9"` | Timeboxed 15-second topic overview animation. |
| **Reserved Padi Video** | `padi-video-v1` | `maxDurationSeconds: 60` *(Reserved Block)* | Future expansion for longer-form video generation. |

---

### 11. Security, Privacy, and Retention Boundaries
1. **API Key Isolation:** API keys are injected via process environment variables (`process.env.GEMINI_API_KEY`, `process.env.PIXVERSE_API_KEY`, `process.env.PADI_API_KEY`). No key is sent to or visible from the client bundle.
2. **Zero Student PII:** The system does not accept, store, or process any pupil names, ages, photos, or school ID numbers.
3. **Data Retention:** Lesson packages are stored locally in the browser's `localStorage` cache. No persistent pupil logs or teacher tracking exist on the server.
4. **Safety Verification:** All generated text passes through the Primary-School Safety Agent to ensure content is child-friendly, respectful, and free of inappropriate material.

---

### 12. Implementation Order
1. **Phase 1 (Base Infrastructure):** Express backend setup, Zod schemas, Gemini SDK initialization, and health check routes.
2. **Phase 2 (Orchestration Engine):** Implementing Curriculum, Lesson Plan, Teacher Notes, and Learner Notes agents.
3. **Phase 3 (Multi-Modal & Media):** Slide Deck generator, YouTube link curator, Pixverse 15s video proxy, and Gemini TTS podcast generator.
4. **Phase 4 (Nigerian Multilingual Studio):** Yoruba, Igbo, Hausa, and Pidgin translation endpoints.
5. **Phase 5 (Frontend Studio & Approval Engine):** React UI with section cards, inline editing, approval badges, export locks, and printable PDF renderer.
