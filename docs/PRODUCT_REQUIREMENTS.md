# Product Requirements Document (PRD)
## Teacher Planning Assistant — Nigerian Primary School AI Studio

---

### 1. Executive Summary
**Teacher Planning Assistant** is an agentic AI lesson-production studio specifically designed for Nigerian primary school educators teaching Grades 1 through 6. Aligned strictly with the Nigerian Educational Research and Development Council (**NERDC**) curriculum standards, the system transforms raw textbook excerpts or curriculum guidelines into a comprehensive, multi-modal, classroom-ready material package in under two minutes. 

By automating the laborious hand-writing of lesson notes, slide decks, worksheets, and assessment materials while preserving full teacher oversight through mandatory review gates, the platform reduces weekly lesson preparation time from **10–15 hours to under 30 minutes**.

---

### 2. Problem Statement
Nigerian primary school teachers face severe administrative burdens and resource constraints:
* **Overwhelming Manual Workload:** Teachers spend 10 to 15 hours every week hand-writing detailed lesson notes, lesson plans, pupil worksheets, and quiz sets into paper notebooks required by head teachers and school inspectors.
* **Mismatched Generic AI Tools:** Existing global AI solutions produce westernized, adult-oriented content that ignores the local Nigerian context, uses unfamiliar cultural analogies, lacks alignment with NERDC schemes of work, and offers zero support for Nigerian languages.
* **Low Visual & Multi-Modal Engagement:** Primary school pupils (Grades 1–6) respond best to vivid visual imagery, localized storytelling, interactive activities, and audio-visual media. However, teachers lack the time and graphic design tools to create customized slide decks, educational audio podcasts, or video summaries.
* **Language Barriers in Multilingual Classrooms:** Early grade learning in Nigeria relies heavily on mother-tongue instruction (Yoruba, Igbo, Hausa) and Nigerian Pidgin to scaffold understanding, but teachers lack rapid translation tools for educational materials.

---

### 3. Product Vision
To empower every primary school teacher in Nigeria with an intelligent, culturally grounded AI co-planner that turns curriculum topics into rich, engaging, multi-modal learning packages—ensuring no teacher spends their evenings writing notes by hand, and every pupil receives contextually relevant, highly visual, and multilingual education.

---

### 4. Primary Users & Stakeholders

| User Role | Primary Needs & Context | Key System Value |
| :--- | :--- | :--- |
| **Primary Teachers (Grades 1–6)** | - Teach multiple subjects daily.<br>- Hand-write official lesson notes.<br>- Need fast, customizable, localized teaching materials. | Generates a complete 12-section lesson package in under 2 minutes, editable and exportable. |
| **Head Teachers & School Inspectors** | - Audit lesson plans for NERDC compliance.<br>- Expect clear objectives, timing, and assessment rubrics. | Guarantees NERDC alignment, clear pedagogical structure, and verified citations. |
| **Primary Learners (Pupils)** | - Need age-appropriate, engaging visuals and stories.<br>- Scaffolding in indigenous languages. | Delivers vivid slide decks, 15s video animations, NotebookLM podcasts, and localized examples. |
| **Parents & Guardians** | - Want clear homework worksheets and revision notes to assist children at home. | Provides neat, printable learner notes and homework worksheets with clear parent instructions. |

---

### 5. User Needs
1. **Curriculum Faithfulness:** Complete alignment with official NERDC schemes of work for Primary 1 to 6 across core subjects (Mathematics, English Studies, Basic Science & Technology, Social Studies, Cultural & Creative Arts, Civic Education, Agricultural Science, Home Economics).
2. **Contextual & Cultural Grounding:** Inclusion of familiar Nigerian names, local market scenarios, native flora/fauna, national landmarks, and local cultural norms.
3. **Multi-Modal Output Generation:** Single-click generation of text notes, printable worksheets, slide decks, audio scripts/podcasts, YouTube links, and short topic videos.
4. **Teacher Control & Editability:** Granular inline editing for every generated section with an explicit approval workflow before exporting.
5. **Low-Bandwidth & Offline Readiness:** Fast loading, responsive layouts, and multi-format exports (PDF, Word/DOCX, PowerPoint/PPTX, MP3, MP4) suitable for low-connectivity environments.

---

### 6. Jobs to Be Done (JTBD)
* **JTBD 1:** "When I am preparing my weekly scheme of work on Sunday evening, I want to upload my topic outline or textbook page so that I can instantly get a fully formatted, NERDC-aligned lesson plan without spending hours writing."
* **JTBD 2:** "When I am teaching a complex topic like *Photosynthesis* or *Civic Rights* to Primary 4 pupils, I want an image-rich slide presentation and a 15-second animated topic video so that my pupils stay captivated and understand visually."
* **JTBD 3:** "When my pupils struggle with English vocabulary, I want to convert key terms and notes into Yoruba, Igbo, Hausa, or Pidgin at the tap of a button so I can explain difficult concepts in their native language."
* **JTBD 4:** "When preparing end-of-term assessments, I want differentiated quizzes with complete answer keys and marking rubrics so I can evaluate pupils fairly and quickly."

---

### 7. Core User Journey

```
[1. Input Topic / Upload Evidence] 
        │
        ▼
[2. Evidence Retrieval & NERDC Confirmation] ──(Teacher Confirms Source)
        │
        ▼
[3. Specialist Agent Orchestration Pipeline] ──(Generates 12+ Package Sections)
        │
        ▼
[4. Studio Review & Interactive Editing] ──(Teacher Edits / Regent / Translates)
        │
        ▼
[5. Mandatory Section Approvals] ──(All Sections Marked 'Approved')
        │
        ▼
[6. Export Multi-Modal Package] ──(PDF, DOCX, PPTX, Audio, Video Zip)
```

1. **Input Stage:** Teacher selects Subject, Grade (Primary 1–6), Duration (e.g., 40 mins), and inputs Topic or uploads textbook PDF/image evidence.
2. **Retrieval & Grounding:** System retrieves evidence from uploaded materials or NERDC benchmark standards; teacher confirms topic scope.
3. **Multi-Agent Pipeline:** The Orchestrator triggers specialist agents sequentially and in parallel to compile the complete lesson material bundle.
4. **Interactive Studio Review:** Teacher reviews generated sections in a tabbed or side-by-side workspace. Sections start in `needs_review` state.
5. **Editing & Refinement:** Teacher modifies text, requests re-generations, toggles multilingual translations, or regenerates visual slides.
6. **Approval & Lock:** Teacher clicks "Approve Section" for each component. Exports remain locked until all mandatory sections are approved.
7. **Multi-Format Export:** Downloads compiled PDF, Word document, PowerPoint presentation, audio podcast MP3, and 15s MP4 video asset.

---

### 8. Agentic AI Value Proposition
Unlike single-prompt chat interfaces that return unstructured walls of generic text, our specialist multi-agent architecture uses targeted system prompts, strict typed schema validation, domain-specific tool access, and safety guardrails. Each agent acts as an expert (e.g., Pedagogy Specialist, Nigerian Language Linguist, Primary School Illustrator) operating under a central Orchestrator Agent to guarantee accuracy, age appropriateness, and formatting precision.

---

### 9. Must-Have Features (MVP Scope)
1. **Curriculum Input & Evidence Upload:** Support for text input, file upload (PDF/PNG/JPG text extraction), Subject selection, and Primary 1–6 grade target.
2. **NERDC Evidence Verification:** Evidence retrieval agent that extracts key learning objectives and checks against standard Nigerian primary curriculum requirements.
3. **Full Lesson Package Generation:**
   - **Lesson Plan:** Objectives, materials needed, 5-step lesson delivery (Set Induction, Instruction, Guided Practice, Independent Practice, Closure), and timing breakdown.
   - **Teacher Notes:** In-depth pedagogical background, common pupil misconceptions, teacher tips, and local analogies.
   - **Learner/Student Notes:** Large, easy-to-read text formatted for Primary 1-6 pupils with key vocabulary and summaries.
   - **Activity Guide:** Individual and group-based hands-on classroom activities using low-cost, locally available materials (e.g., bottle caps, local leaves, cardboard).
   - **Quiz & Answer Key:** 5–10 multiple choice and short answer questions with full answer keys and explanations.
   - **Worksheet & Marking Rubric:** Printable homework worksheet with a structured 4-level marking rubric for quick evaluation.
4. **Visual & Slide Deck Studio:** Slide deck generator creating structured 6-slide presentation specifications with vivid descriptions and image prompts.
5. **Video & YouTube Curation:**
   - **Pixverse 15s Video Generation:** API integration generating a 15-second topic overview animation.
   - **YouTube Curation:** Retrieval of 3 curated, safe, age-appropriate educational YouTube links with topic context.
6. **Audio Podcast Engine:** 2-voice conversational audio podcast script (Teacher & Pupil / Co-Teachers) and audio generation via Gemini TTS.
7. **Nigerian Multilingual Translator:** Instant translation of any section into Yoruba, Igbo, Hausa, and Nigerian Pidgin.
8. **Interactive Review & Approval Gates:** Granular edit controls, section state badges (`needs_review` / `approved`), and export locking.
9. **Export Engine:** Downloadable lesson package bundle (PDF format and clean printable views).

---

### 10. Extended Features (Post-MVP)
1. **PPTX / DOCX Binary Export:** Direct file compilation into editable `.pptx` and `.docx` formats.
2. **PADI Long-Video Integration:** Reserved API pipeline for 60+ second deep-dive educational videos.
3. **School District / Inspectorate Analytics:** Dashboards for head teachers to track lesson completion rates across classes.
4. **Offline Sync & PWA:** Local Storage caching for offline lesson viewing and editing in rural schools.

---

### 11. Out-of-Scope
* Storing pupil grades, attendance, or personally identifiable information (PII).
* Automated grading or student-facing portal logins.
* Custom LMS hosting or complex school administration ERP workflows.

---

### 12. User Stories & Acceptance Criteria

#### US-01: Curriculum Topic & Evidence Selection
* **As a** Primary 3 science teacher,
* **I want to** select Subject, Grade Level (Primary 3), and enter a topic or upload a page from my textbook,
* **So that** the AI generates lesson materials grounded in my specific curriculum requirements.
* **Acceptance Criteria:**
  1. System displays subject dropdown (8 core NERDC subjects), grade dropdown (Primary 1–6), duration input, and topic text field.
  2. File upload component accepts PDF, PNG, and JPG files up to 10MB.
  3. Clicking "Extract Curriculum Evidence" triggers text processing and displays extracted objectives for teacher confirmation.

#### US-02: Full Package Generation Trigger
* **As a** teacher,
* **I want to** initiate package generation with a single click after confirming curriculum evidence,
* **So that** all 12 lesson package sections are created automatically without manual prompts.
* **Acceptance Criteria:**
  1. Primary CTA "Generate Complete Lesson Package" starts the Orchestrator pipeline.
  2. Progress panel displays step-by-step status of each active agent (e.g., "Curriculum Match... Done", "Lesson Plan... Generating").
  3. Total pipeline execution completes in < 120 seconds.

#### US-03: NERDC-Aligned Lesson Plan Review
* **As a** school inspector,
* **I want to** see clear behavioral objectives and a 5-phase delivery breakdown in the lesson plan,
* **So that** I can verify pedagogical quality during school visits.
* **Acceptance Criteria:**
  1. Lesson plan contains behavioral objectives using Bloom's Taxonomy verbs tailored for primary pupils.
  2. Delivery breakdown includes explicit durations for Set Induction, Instruction, Guided Practice, Independent Practice, and Closure.
  3. Material list highlights locally available, low-cost instructional materials.

#### US-04: Detailed Teacher Notes with Misconception Alerts
* **As a** teacher,
* **I want to** read background notes and common pupil misconceptions before class,
* **So that** I can anticipate student questions and explain difficult concepts confidently.
* **Acceptance Criteria:**
  1. Notes include 3+ common pupil misconceptions with actionable correction strategies.
  2. Content includes Nigerian context examples (e.g., using Naira notes for Math, local Nigerian markets for Social Studies).

#### US-05: Age-Appropriate Learner Notes
* **As a** Primary 1 teacher,
* **I want** pupil notes to feature large fonts, simple sentence structures, and high-frequency vocabulary,
* **So that** young learners can read or copy them into their exercise books easily.
* **Acceptance Criteria:**
  1. Flesch-Kincaid grade level for Primary 1-3 content does not exceed Grade 3 reading complexity.
  2. Clear heading hierarchy with short, bulleted summaries and key term definitions.

#### US-06: Hands-On Local Activity Guide
* **As a** teacher in a low-resource classroom,
* **I want** classroom activities that use free or cheap everyday Nigerian materials,
* **So that** pupils learn interactively without requiring expensive lab equipment.
* **Acceptance Criteria:**
  1. Activity guide specifies required materials accessible in typical Nigerian communities (e.g., water bottles, seeds, leaves, stones).
  2. Includes step-by-step pupil instructions and group size recommendations.

#### US-07: Differentiated Quiz & Answer Key
* **As a** teacher,
* **I want** a 5-to-10 question quiz with an answer key and marking guide,
* **So that** I can quickly test pupil comprehension at the end of the lesson.
* **Acceptance Criteria:**
  1. Quiz includes a mix of multiple choice and short answer questions.
  2. Answer key provides full solutions and brief explanations for each answer.

#### US-08: Printable Worksheet & Marking Rubric
* **As a** teacher,
* **I want** a clean worksheet with a 4-level evaluation rubric,
* **So that** I can assign homework and grade pupil submissions consistently.
* **Acceptance Criteria:**
  1. Worksheet features clear pupil header (Name, Date, Grade, Score).
  2. Rubric outlines criteria for 4 achievement tiers (Needs Improvement, Fair, Good, Excellent).

#### US-09: Slide Deck Visual Specifications
* **As a** teacher presenting with a projector or phone,
* **I want** a 6-slide presentation with vivid visual descriptions and slide text,
* **So that** pupils stay visually engaged during instruction.
* **Acceptance Criteria:**
  1. Generates 6 structured slides: Title, Hook/Introduction, Core Concept 1, Core Concept 2, Interactive Class Task, and Summary.
  2. Each slide includes slide title, bulleted body points, speaker notes, and an AI image generation prompt.

#### US-10: Curated YouTube Educational Links
* **As a** teacher preparing for class,
* **I want to** view 3 curated, safe YouTube video links related to the lesson topic,
* **So that** I can play short video clips or watch demonstration videos beforehand.
* **Acceptance Criteria:**
  1. Each link provides video title, duration, recommended snippet timestamp, and relevance description.
  2. Fallback YouTube search query provided if direct video URL retrieval fails.

#### US-11: 15-Second Pixverse Topic Video Generation
* **As a** teacher,
* **I want** a 15-second animated AI video illustrating the key topic concept,
* **So that** I can introduce the lesson topic with an eye-catching visual hook.
* **Acceptance Criteria:**
  1. Server calls Pixverse API with `maxDurationSeconds=15` to generate topic animation.
  2. UI embeds video player with play/pause controls and download option.
  3. Fallback visual banner displayed gracefully if `PIXVERSE_API_KEY` is absent or API fails.

#### US-12: NotebookLM Two-Voice Audio Podcast
* **As a** teacher or pupil listening on a smartphone,
* **I want** a 2-minute two-voice audio podcast discussing the lesson topic in a conversational tone,
* **So that** pupils can listen to an engaging audio review.
* **Acceptance Criteria:**
  1. Generates 2-voice script between "Teacher Blessing" and "Pupil Tobi".
  2. Server synthesizes multi-speaker audio using Gemini TTS SDK.
  3. UI provides audio player with waveform visualizer and transcript drawer.

#### US-13: Multilingual Nigerian Language Translation
* **As a** teacher in Enugu, Ibadan, Kano, or Lagos,
* **I want to** translate any section into Yoruba, Igbo, Hausa, or Nigerian Pidgin,
* **So that** I can explain concepts to pupils in their native language.
* **Acceptance Criteria:**
  1. Section header includes language switcher dropdown: English (Default), Yoruba, Igbo, Hausa, Nigerian Pidgin.
  2. Multilingual Translation Agent produces accurate, culturally natural translations without corrupting educational terms.
  3. Original English text can be restored at any time.

#### US-14: Inline Section Editing & Review Status
* **As a** teacher,
* **I want to** edit any text field directly and mark sections as "Approved",
* **So that** I maintain complete authority over final lesson content.
* **Acceptance Criteria:**
  1. Every section defaults to `needs_review` status badge (amber color).
  2. Inline editing updates section content in real-time.
  3. Clicking "Approve Section" updates status badge to `approved` (green color).

#### US-15: Export Locking & Multi-Format Download
* **As a** head teacher,
* **I want** material exports to remain locked until the teacher approves every section,
* **So that** unreviewed or incomplete AI outputs are never printed or distributed.
* **Acceptance Criteria:**
  1. Export buttons remain disabled with a banner: "Approve all sections to unlock exports (X/12 approved)".
  2. Once all sections are approved, export buttons unlock for PDF generation and printing.

#### US-16: Primary School Safety & PII Prevention
* **As an** AI safety reviewer,
* **I want to** ensure no pupil personal data is collected and all generated content is primary-school safe,
* **So that** child safety and privacy regulations are strictly upheld.
* **Acceptance Criteria:**
  1. Form fields explicitly omit any pupil names, ages, or personal identifier inputs.
  2. Primary-School Safety Agent screens generated content for inappropriate themes, violence, or scary content before display.

---

### 13. Functional & Non-Functional Requirements

#### Functional Requirements
* **FR-1 Input Validation:** System must validate topic length (min 3 chars, max 300 chars), subject, and grade prior to pipeline initiation.
* **FR-2 Typed Schema Enforcement:** All agent outputs must adhere to strict Zod TypeScript schemas before being merged into the master `FullLessonPackage`.
* **FR-3 State Management:** Client application must maintain session state, track edits, handle approval toggles, and persist data in `localStorage`.
* **FR-4 Server-Side API Proxies:** All external provider calls (Gemini, Pixverse, YouTube) must be executed strictly on the server-side (`server.ts`).

#### Non-Functional Requirements
* **NFR-1 Latency & Performance:** Entire 12-section package generation must complete within 120 seconds. Individual text section streaming response < 3 seconds.
* **NFR-2 Reliability:** Fallback mechanisms must exist for every external API call so that key missing errors (e.g., missing Pixverse API key) never crash the application.
* **NFR-3 Accessibility & UI Craft:** High-contrast WCAG AA compliant layout, desktop-first precision, fluid responsive layout (`max-w-7xl`), clean typographic hierarchy (Plus Jakarta Sans body, Playfair Display headings).
* **NFR-4 Security:** Zero exposure of `GEMINI_API_KEY`, `PIXVERSE_API_KEY`, or `PADI_API_KEY` to browser or client bundles.

---

### 14. Primary-School Content Requirements (Grades 1–6)
* **Reading Levels:** Primary 1–3 content uses short, simple sentences (max 10 words per sentence), phonics focus, and high-frequency vocabulary. Primary 4–6 introduces conceptual definitions, structured paragraphs, and step-by-step problem solving.
* **NERDC Curriculum Topics:** Default pre-sets provided for core subjects across Primary 1–6 (e.g., *Primary 1 Math: Counting Objects 1-20*, *Primary 4 Science: Living and Non-Living Things*, *Primary 5 Social Studies: Cultural Diversity in Nigeria*).
* **Nigerian Cultural Inclusion:** Scenarios must feature Nigerian names (e.g., Emeka, Amina, Yetunde, Chidi), local currencies (Naira ₦ and Kobo), regional foods (Jollof rice, Yam, Plantain, Suya), and local landmarks (River Niger, Olumo Rock, Zuma Rock).

---

### 15. Nigerian-Language Requirements
Supported language translations:
1. **Yoruba (Yorùbá):** Standard tone-marked orthography for educational clarity.
2. **Igbo (Asụsụ Igbo):** Standardized Igbo (Igbo Zugbe) vocabulary.
3. **Hausa (Harshen Hausa):** Standard Hausa Latin script (Boko) suitable for Northern Nigerian primary schools.
4. **Nigerian Pidgin:** Popular, natural West African Pidgin English framing for relatable oral explanations and informal classroom scaffolding.

---

### 16. Visual & Slide Deck Engagement Requirements
* **Presentation Format:** 6 structured slides designed for 40-minute lesson delivery.
* **Visual Style:** High-contrast, colorful, uncluttered layouts with clear focal points suitable for young children.
* **Image Prompts:** Detailed, child-friendly AI image prompts generated per slide depicting African pupils, diverse teachers, vibrant Nigerian environments, and clear educational diagrams.

---

### 17. Video & YouTube Requirements
* **Pixverse Topic Animation:** 15-second MP4 video depicting the primary lesson topic using child-friendly, colorful 3D/2D animation prompts. Key parameter: `pixverse.maxDurationSeconds = 15`.
* **YouTube Curation:** 3 age-safe educational YouTube links retrieved per lesson topic, filtered for primary school relevance, with specific timestamps and safety descriptions.

---

### 18. Audio Requirements (NotebookLM Style)
* **Format:** 2-voice conversational podcast script and synthesized audio track (~90–120 seconds).
* **Roles:** "Teacher Blessing" (warm, encouraging lead educator) and "Pupil Tobi" (curious, relatable Primary 4 student).
* **Tone:** Energetic, clear, conversational, featuring Nigerian English accents and friendly educational banter.

---

### 19. Human Review & Approval Requirements
* **Default Review State:** Every generated section defaults to `needs_review` (amber badge).
* **Inline Edit Capability:** Teachers can click and edit any field, bullet point, or objective directly in the UI.
* **Approval Gates:** Section-level "Approve" button transitions state to `approved` (green badge).
* **Export Lock Enforcement:** Export actions (PDF print, summary copy, bundle download) remain strictly disabled until 100% of sections are marked `approved`.

---

### 20. Privacy & Safety Requirements
* **Zero Pupil PII:** System strictly prohibits inputting or storing student names, addresses, ages, photos, or school ID numbers.
* **Primary-School Safety Filter:** Content screening agent inspects generated text for violence, scary elements, political bias, or adult topics.
* **Server-Only API Keys:** All API credentials stored in environment variables, accessed solely by Express backend routes.

---

### 21. Success Metrics

| Metric Category | Target Metric | Measurement Method |
| :--- | :--- | :--- |
| **Generation Speed** | Full package generated in < 120s | Server execution log timer |
| **Grounding Accuracy** | 100% compliance with selected NERDC subject/grade | Curriculum Match Agent audit score |
| **Teacher Editability** | 100% of generated fields inline editable | UI interaction tests |
| **Approval Rate** | > 95% section approval before export | Frontend telemetry state |
| **Visual / PPT Quality** | 6 slides with distinct visual prompts and notes | Schema structure validation |
| **System Reliability** | 0 pipeline crashes on missing optional keys | Automated error-handling tests |

---

### 22. Demo Success Metrics (Hackathon Evaluation)
* **Speed-to-Demo:** Complete, interactive lesson package generated live in under 90 seconds.
* **Multi-Modal Wow Factor:** Live playback of 15s Pixverse video, 2-voice audio podcast, and instant Yoruba/Igbo/Hausa/Pidgin language switching during live presentation.
* **Curriculum Authenticity:** Instant recognition of NERDC Primary 1–6 topics and authentic Nigerian classroom scenarios by judges.

---

### 23. Risks & Mitigations

| Identified Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Missing / Invalid Pixverse API Key** | High | Fallback Video Agent returns an engaging animated SVG diagram component and video summary card without throwing runtime errors. |
| **Language Translation Hallucinations** | Medium | Multilingual Translation Agent relies on strict system prompts with explicit educational glossaries for Yoruba, Igbo, Hausa, and Pidgin. |
| **Slow Video / Audio Generation** | Medium | Asynchronous parallel processing for media generation while text sections render immediately in UI. |
| **Unapproved Output Export** | High | Hard UI export lock enforced until all 12 section state badges report `approved`. |

---

### 24. Acceptance Criteria Summary
A lesson package is considered fully accepted when:
1. Subject, Grade (Primary 1–6), and Topic are confirmed.
2. All 12 required package sections (Lesson Plan, Teacher Notes, Learner Notes, Activity, Quiz, Worksheet, Slide Deck, YouTube Links, Pixverse Video, Audio Podcast, Multilingual Options, Safety Audit) are generated according to Zod schemas.
3. Every section passes through human review and is marked `approved`.
4. Export options unlock successfully.

---

### 25. Open Questions
1. *Future PDF/PPTX Binary Export:* Should binary `.docx` and `.pptx` generation be performed on the server via `pptxgenjs` / `docx` libraries in Phase 2?
2. *Local Storage Limits:* Should session packages older than 7 days be automatically purged to save browser storage space?

---

### 26. Smallest Reliable End-to-End Demo (MVP Target)
The minimum reliable end-to-end demo flow for this application comprises:
1. **Selection:** Primary 4 Science — Topic: *"Photosynthesis: How Plants Make Food"*.
2. **Evidence Confirmation:** Auto-extracting 3 key NERDC objectives.
3. **Generation:** Orchestrating 12 package sections in < 90 seconds.
4. **Interactive Review:** Inline editing teacher notes, playing the 15s topic animation video, listening to the 2-voice audio podcast clip, toggling Primary 4 Learner Notes to Yoruba and Nigerian Pidgin.
5. **Approval & Export:** Marking all 12 sections as `approved`, unlocking the export controls, and generating a clean printable PDF view.
