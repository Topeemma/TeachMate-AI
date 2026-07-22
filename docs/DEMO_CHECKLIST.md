# TEACHMATE AI — HACKATHON DEMO CHECKLIST & SCRIPT

**Project:** TeachMate AI — Multi-Agent NERDC Primary School Lesson Engine  
**Version:** 1.0.0-PROD  
**Target Demo Subject:** Basic Science — "Water Cycle, Purification & Water Conservation" (Primary 4, 40 Minutes)  

---

## 1. PRE-DEMO SETUP & HEALTH CHECK

1. **System Health Check:**
   - Open browser or execute: `GET /api/health`
   - Expected Output: `{"status": "ok", "timestamp": "...", "version": "1.0.0"}`
2. **Demo Mode Status:**
   - Built-in instant preset available on Workspace page: **Water Cycle Preset** button.
   - Fallback video stream active at `/api/sample-video-stream`.
3. **Reset Flow:**
   - To start completely fresh, click **Clear Workspace** in the top navigation bar or reload the page.
   - All session data resets instantly without lingering state.

---

## 2. DEMO RECOVERY & FAILURE-RECOVERY SCRIPTS

### Scenario A: Pixverse Video Generation Slow or Fails
> **What to say:**  
> *"While our live 15-second Pixverse AI video generation runs asynchronously in the background via our isolated worker queue, TeachMate AI instantly serves a cached high-definition educational video preview. This guarantees that teachers in low-bandwidth African classrooms never face a blocked interface."*

### Scenario B: AI Generation Latency / API Rate Limit
> **What to say:**  
> *"Our Bounded Orchestrator features built-in fallback mechanisms for every single one of our 20 agents. If an external LLM call experiences latency, our local NERDC curriculum knowledge graph seamlessly supplies structured benchmark content so the teacher always receives a complete 13-section package."*

### Scenario C: Unapproved Export Lock Attempted
> **What to say:**  
> *"Notice how the system blocks export when 12 of 13 sections are approved. TeachMate AI enforces a strict server-side human-in-the-loop requirement. An unreviewed lesson plan or audio transcript can never be exported or sent to text-to-speech synthesis without explicit teacher approval."*

---

## 3. FIVE-MINUTE DEMO SCRIPT (ELEVATOR / SPEED PRESENTATION)

* **0:00 - 0:45 | The Problem:**  
  *"Primary school teachers in Nigeria and sub-Saharan Africa spend up to 15 hours every week manually writing lesson plans, creating worksheets, translating notes into local languages, and sourcing visual materials — often without alignment to national NERDC standards."*

* **0:45 - 2:00 | The Solution & Live Orchestration:**  
  *"Meet TeachMate AI. Watch what happens when I select 'Water Cycle, Purification & Water Conservation' for Primary 4. Behind the scenes, our Bounded Orchestrator deploys 20 specialist AI agents in parallel — from the Lesson Plan Agent to the Pedagogy Agent, Assessment Agent, Multilingual Translation Agent, and Pixverse Video Agent."*

* **2:00 - 3:30 | Review Studio & 13-Section Human Review Gate:**  
  *"In the Review Studio, the teacher sees a complete 13-section lesson package. Notice the global approval progress header. Each section — including local Nigerian analogies, 4-tier evaluation rubrics, slide decks with speaker notes, and 2-voice audio podcast scripts — requires teacher review. If I edit a section, its approval status immediately reverts to 'Needs Review'."*

* **3:30 - 4:30 | Multi-Format Export:**  
  *"When all 13 sections are marked Approved, the export gate unlocks. Teachers can download complete packages in PDF, MS Word (DOCX), Markdown, JSON, PPTX slides, or a bundled ZIP file — ready for printing or offline digital distribution."*

* **4:30 - 5:00 | Impact & Closing:**  
  *"TeachMate AI reduces lesson preparation time from 15 hours down to 3 minutes, giving African educators world-class, NERDC-grounded teaching tools that empower every classroom."*

---

## 4. TEN-MINUTE DETAILED DEMO SCRIPT (JUDGE WALKTHROUGH)

* **0:00 - 1:30 | Context & Uploading Curriculum Evidence:**  
  - Show the **Workspace Setup Modal**.
  - Upload a sample NERDC curriculum PDF or choose the Primary 4 "Water Cycle" preset.
  - Highlight how the **Heading-Aware Chunker** and **TF-IDF Retrieval Service** extract benchmark codes (`NERDC-BSC-P4-W2`) and ground generation in official standards.

* **1:30 - 3:30 | Live Agent Orchestration & Telemetry:**  
  - Click **Generate Full Lesson Package**.
  - Show the **Orchestration Timeline** displaying all 20 agents executing phase by phase.
  - Explain why 20 specialized micro-agents outperform a single monolithic prompt: precision, zero token truncation, and modular error recovery.

* **3:30 - 6:30 | Deep Dive into Generated Artifacts:**  
  - **Lesson Plan & Objectives:** Behavioral objectives aligned with Bloom's taxonomy.
  - **Teacher Notes:** Common misconceptions and authentic Nigerian analogies (sachet water, borehole purification, rainwater harvesting).
  - **Learner Notes & Multilingual Translations:** Side-by-side English, Yoruba, Igbo, Hausa, and Nigerian Pidgin versions with exact number preservation.
  - **Pixverse AI Video & YouTube Curation:** Embedded 15-second topic animation and curated YouTube timestamps.
  - **Two-Voice Audio Podcast:** Interactive dialogue between Lead Educator Teacher Blessing and Assistant Teacher Tobi.
  - **Slide Deck Viewer:** 6 interactive slides with bullet points, speaker notes, and DALL-E image prompts.

* **6:30 - 8:30 | The 13-Section Approval Gate:**  
  - Demonstrate clicking individual section approvals vs. the "Approve All" batch button.
  - Edit a text field in the active section modal to show instant status reversion from `Approved` back to `Needs Review`.
  - Attempt export at 12/13 approved to demonstrate server-side `UNAPPROVED_EXPORT_FORBIDDEN` protection.

* **8:30 - 10:00 | Multi-Format Export & Conclusion:**  
  - Mark all 13 sections approved.
  - Open **Export Package Modal** and download DOCX, PDF, and ZIP packages.
  - Conclude with Q&A on scalability, offline readiness, and responsible AI.
