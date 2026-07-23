import React from 'react';
import {
  Sparkles,
  BookOpen,
  Video,
  Mic,
  Globe,
  ShieldCheck,
  ArrowRight,
  Award,
  Zap,
  CheckCircle2,
  Presentation,
  FileText,
  HelpCircle,
  Download,
  Layers,
  ChevronRight,
  Play,
  Volume2,
  Cpu,
  Share2,
} from 'lucide-react';
import { SAMPLE_TOPICS } from '../data/curriculumData';

interface Props {
  onStartLesson: () => void;
  onSelectDemo: (topic: string) => void;
}

export const LandingPage: React.FC<Props> = ({ onStartLesson, onSelectDemo }) => {
  return (
    <div className="space-y-14 pb-20 overflow-x-hidden">
      {/* HERO SECTION — 3D Perspective Glass & Vibrant Gradient Workspace */}
      <section className="relative rounded-3xl bg-gradient-to-br from-[#201A2B] via-[#3B176B] to-[#170E28] text-white p-8 sm:p-12 lg:p-16 shadow-[0_25px_60px_-15px_rgba(59,23,107,0.5)] border border-purple-500/30 overflow-hidden">
        {/* Dynamic Glowing Ambient Halo Lights */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-bright-orange/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-purple/40 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hero Copy & Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* 3D Floating Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-[0_8px_16px_rgba(0,0,0,0.2)] text-xs font-black text-orange-300 transform hover:scale-105 transition-transform">
              <div className="w-6 h-6 rounded-full bg-bright-orange flex items-center justify-center text-white shadow-xs shrink-0">
                <Award className="w-3.5 h-3.5" />
              </div>
              <span className="tracking-wide">NERDC Primary Curriculum Aligned (Grades 1–6)</span>
            </div>

            {/* Headline with 3D Text Shadow */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.08] drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                TeachMate AI
              </h1>
              <p className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-300 tracking-tight drop-shadow-sm">
                3D Multi-Modal AI Primary Teacher Studio
              </p>
            </div>

            <p className="text-sm sm:text-base text-purple-100/90 leading-relaxed max-w-xl font-normal">
              Orchestrate <strong className="text-white font-bold">10 specialist AI agents</strong> to instantly generate 5-step lesson notes, PowerPoint slide decks, 15-second animated topic videos, 2-voice audio podcasts, and Google Classroom packages in under 60 seconds.
            </p>

            {/* Action Buttons with 3D Depth Feel */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartLesson}
                className="px-8 py-4 bg-gradient-to-r from-bright-orange to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-black text-sm rounded-2xl shadow-[0_12px_28px_rgba(255,107,26,0.45)] hover:shadow-[0_16px_36px_rgba(255,107,26,0.6)] hover:-translate-y-1 active:translate-y-0.5 transition-all duration-200 flex items-center gap-3 cursor-pointer group"
              >
                <Sparkles className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
                <span>Launch Multi-Modal Studio</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onSelectDemo('Water Cycle')}
                className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl border border-white/30 backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.2)] hover:-translate-y-1 active:translate-y-0.5 transition-all duration-200 flex items-center gap-2.5 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-orange-400" />
                <span>Try Demo: Grade 4 Water Cycle</span>
              </button>
            </div>

            {/* 3D Key Metric Pill Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-purple-500/30 text-xs font-semibold">
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:border-orange-400/50 transition-all">
                <span className="block font-black text-orange-300 text-base">10 Agents</span>
                <span className="text-[10px] text-purple-200/80">Autonomous pipeline</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:border-orange-400/50 transition-all">
                <span className="block font-black text-white text-base">10 Outputs</span>
                <span className="text-[10px] text-purple-200/80">Docx, Pptx, Mp3, Mp4</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:border-orange-400/50 transition-all">
                <span className="block font-black text-orange-300 text-base">100% NERDC</span>
                <span className="text-[10px] text-purple-200/80">Classroom evidence</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:border-orange-400/50 transition-all">
                <span className="block font-black text-white text-base">Direct Sync</span>
                <span className="text-[10px] text-purple-200/80">Google Classroom</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Layered Card Showcase Display */}
          <div className="lg:col-span-5 relative perspective-[1000px]">
            {/* Interactive 3D Perspective Card Composite */}
            <div className="relative transform-gpu rotate-y-[-6deg] rotate-x-[4deg] hover:rotate-y-[0deg] hover:rotate-x-[0deg] transition-all duration-700 ease-out space-y-4">
              
              {/* Card 1: 15s Video Hook Preview */}
              <div className="bg-gradient-to-r from-purple-900/90 to-indigo-950/90 backdrop-blur-xl p-4 rounded-3xl border border-orange-400/40 shadow-[0_20px_40px_rgba(0,0,0,0.4)] space-y-3 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-bright-orange text-white rounded-lg flex items-center justify-center font-bold text-xs shadow-xs">
                      <Video className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black text-white">Pixverse 15s Video Hook</span>
                  </div>
                  <span className="text-[9px] font-black bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full border border-orange-400/30">
                    MP4 ANIMATED
                  </span>
                </div>

                <div className="h-28 bg-black/60 rounded-2xl border border-purple-800 flex items-center justify-center relative overflow-hidden group-hover:border-orange-400/60 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                  <div className="w-10 h-10 rounded-full bg-bright-orange text-white flex items-center justify-center shadow-lg z-20 transform group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                  <span className="absolute bottom-2 left-3 z-20 text-[10px] font-bold text-orange-200">
                    Grade 4: Evaporation & Condensation Visualizer
                  </span>
                </div>
              </div>

              {/* Card 2: 2-Voice Podcast Preview */}
              <div className="bg-gradient-to-r from-purple-950/90 via-[#2A104E] to-purple-900/90 backdrop-blur-xl p-4 rounded-3xl border border-purple-400/30 shadow-[0_20px_40px_rgba(0,0,0,0.4)] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-primary-purple text-white rounded-lg flex items-center justify-center font-bold text-xs shadow-xs">
                      <Mic className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black text-white">NotebookLM Audio Podcast</span>
                  </div>
                  <Volume2 className="w-4 h-4 text-orange-400 animate-pulse" />
                </div>

                <div className="bg-[#1A1228] p-3 rounded-2xl border border-purple-800/80 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-orange-300 font-bold">Teacher Blessing & Pupil Tobi</span>
                    <span className="text-purple-300 font-mono">01:45</span>
                  </div>
                  <div className="flex gap-1 h-3 items-center">
                    {[40, 75, 30, 90, 60, 100, 45, 80, 50, 95, 35, 70, 85, 40, 60, 90, 50].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-orange-500 to-amber-300 rounded-full"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 3: Floating Slide Deck Badge */}
              <div className="p-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl shadow-[0_15px_30px_rgba(255,107,26,0.4)] border border-orange-300/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Presentation className="w-5 h-5 text-white" />
                  <div>
                    <span className="block text-xs font-black">6-Slide PPTX Deck & Notes</span>
                    <span className="text-[10px] text-orange-100">Ready for Classroom Screen Display</span>
                  </div>
                </div>
                <Sparkles className="w-4 h-4 text-amber-200" />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* INSTANT INTERACTIVE SAMPLE LESSONS SECTION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-bright-orange uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Instant Interactive Demos</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-deep-purple tracking-tight">
              Pre-Compiled NERDC Primary Lessons
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Select any primary topic below to open and inspect the full 10-deliverable multi-modal studio package immediately.
            </p>
          </div>

          <button
            onClick={onStartLesson}
            className="px-4 py-2.5 bg-primary-purple hover:bg-deep-purple text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <span>Create Custom Topic</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3D Elevated Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_TOPICS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => onSelectDemo(sample.topic)}
              className="group bg-white rounded-3xl p-6 border-2 border-purple-100 shadow-[0_10px_30px_rgba(91,42,168,0.06)] hover:shadow-[0_20px_45px_rgba(91,42,168,0.18)] hover:border-bright-orange transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-5 relative overflow-hidden transform hover:-translate-y-1.5"
            >
              {/* Vibrant Accent Header Line */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary-purple to-bright-orange" />

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl border border-purple-100 flex items-center justify-center text-2xl shadow-2xs group-hover:scale-110 group-hover:bg-orange-50 transition-all">
                    {sample.icon}
                  </div>
                  <span className="text-[10px] font-black bg-purple-100 text-primary-purple px-3 py-1 rounded-full border border-purple-200 uppercase tracking-wider">
                    {sample.nerdcCode}
                  </span>
                </div>

                <h3 className="font-extrabold text-deep-purple text-base group-hover:text-bright-orange transition-colors line-clamp-2 leading-snug">
                  {sample.topic}
                </h3>

                <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                  <span className="text-bright-orange">{sample.grade}</span>
                  <span>•</span>
                  <span className="text-primary-purple">{sample.subject}</span>
                </div>

                <div className="bg-purple-50/70 p-3 rounded-2xl border border-purple-100 text-[11px] text-gray-700 leading-relaxed italic">
                  "{sample.evidenceSnippet}"
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-black text-bright-orange group-hover:translate-x-1 transition-transform">
                <span>Explore Full 10-Asset Studio Package</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10 SPECIALIST MULTI-MODAL DELIVERABLES SHOWCASE */}
      <section className="space-y-8 bg-gradient-to-b from-purple-50/80 via-orange-50/40 to-white p-8 sm:p-12 rounded-3xl border border-purple-200/80 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-purple-200 shadow-xs text-xs font-black text-primary-purple uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-bright-orange" />
            <span>Complete Teaching Kit</span>
          </div>
          <h2 className="text-3xl font-black text-deep-purple tracking-tight">
            10 Multi-Modal Specialist Deliverables
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Every lesson run produces an end-to-end multi-modal package ready for classroom presentation, printing, or digital deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Deliverable 1 */}
          <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-[0_8px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_32px_rgba(91,42,168,0.12)] hover:border-primary-purple/40 transition-all space-y-3">
            <div className="w-12 h-12 bg-purple-100 text-primary-purple rounded-2xl flex items-center justify-center font-bold shadow-2xs">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-deep-purple text-base">1. 5-Step Lesson Notes</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Standardized format with behavioral objectives, step-by-step teacher actions, pupil responses, and timing.
            </p>
          </div>

          {/* Deliverable 2 */}
          <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-[0_8px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_32px_rgba(255,107,26,0.12)] hover:border-bright-orange/40 transition-all space-y-3">
            <div className="w-12 h-12 bg-orange-100 text-bright-orange rounded-2xl flex items-center justify-center font-bold shadow-2xs">
              <Presentation className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-deep-purple text-base">2. PowerPoint Deck (.pptx)</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Formatted 6-slide teaching presentation complete with key concepts, diagrams, and discussion prompts.
            </p>
          </div>

          {/* Deliverable 3 */}
          <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-[0_8px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_32px_rgba(91,42,168,0.12)] hover:border-primary-purple/40 transition-all space-y-3">
            <div className="w-12 h-12 bg-purple-100 text-primary-purple rounded-2xl flex items-center justify-center font-bold shadow-2xs">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-deep-purple text-base">3. 15s Animated Video Hook</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Pixverse visual concept video to capture primary pupils' imagination at the start of the lesson.
            </p>
          </div>

          {/* Deliverable 4 */}
          <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-[0_8px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_32px_rgba(255,107,26,0.12)] hover:border-bright-orange/40 transition-all space-y-3">
            <div className="w-12 h-12 bg-orange-100 text-bright-orange rounded-2xl flex items-center justify-center font-bold shadow-2xs">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-deep-purple text-base">4. 2-Voice Audio Podcast</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              NotebookLM-style classroom discussion between Teacher Blessing & Pupil Tobi with synthesized speech.
            </p>
          </div>

          {/* Deliverable 5 */}
          <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-[0_8px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_32px_rgba(91,42,168,0.12)] hover:border-primary-purple/40 transition-all space-y-3">
            <div className="w-12 h-12 bg-purple-100 text-primary-purple rounded-2xl flex items-center justify-center font-bold shadow-2xs">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-deep-purple text-base">5. 5-Question Quiz & Key</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Multiple-choice questions with answer key, distractors, and teacher explanation notes.
            </p>
          </div>

          {/* Deliverable 6 */}
          <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-[0_8px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_32px_rgba(255,107,26,0.12)] hover:border-bright-orange/40 transition-all space-y-3">
            <div className="w-12 h-12 bg-orange-100 text-bright-orange rounded-2xl flex items-center justify-center font-bold shadow-2xs">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-deep-purple text-base">6. Homework Sheet & Rubric</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Take-home practice exercise with a 4-level evaluation rubric for objective pupil marking.
            </p>
          </div>

          {/* Deliverable 7 */}
          <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-[0_8px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_32px_rgba(91,42,168,0.12)] hover:border-primary-purple/40 transition-all space-y-3">
            <div className="w-12 h-12 bg-purple-100 text-primary-purple rounded-2xl flex items-center justify-center font-bold shadow-2xs">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-deep-purple text-base">7. Multilingual Translations</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Pupil lesson notes translated into Yoruba, Igbo, Hausa, or Nigerian Pidgin English.
            </p>
          </div>

          {/* Deliverable 8 */}
          <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-[0_8px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_32px_rgba(255,107,26,0.12)] hover:border-bright-orange/40 transition-all space-y-3">
            <div className="w-12 h-12 bg-orange-100 text-bright-orange rounded-2xl flex items-center justify-center font-bold shadow-2xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-deep-purple text-base">8. Local Practical Activities</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Hands-on experiments designed specifically around low-cost everyday local materials.
            </p>
          </div>

          {/* Deliverable 9 */}
          <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-[0_8px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_32px_rgba(91,42,168,0.12)] hover:border-primary-purple/40 transition-all space-y-3">
            <div className="w-12 h-12 bg-purple-100 text-primary-purple rounded-2xl flex items-center justify-center font-bold shadow-2xs">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-deep-purple text-base">9. Google Classroom Push</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              One-click OAuth export to post assignments and slide decks directly to Google Classroom.
            </p>
          </div>
        </div>
      </section>

      {/* TRUST & COMPLIANCE BANNER */}
      <section className="bg-gradient-to-r from-deep-purple via-[#3B176B] to-primary-purple text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-purple-800 relative overflow-hidden">
        <div className="space-y-3 z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 text-orange-200 px-3.5 py-1 rounded-full text-xs font-bold border border-white/20">
            <ShieldCheck className="w-4 h-4 text-bright-orange shrink-0" />
            <span>NERDC Standard & PII Zero-Retention Protection</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Culturally Grounded & Safe for Primary Classrooms
          </h3>
          <p className="text-xs sm:text-sm text-purple-100 leading-relaxed max-w-2xl">
            Every lesson uses local flora, fauna, currency (Naira), and low-cost everyday materials (bottle caps, seeds, local leaves) to make practical science and mathematics intuitive and engaging. Zero pupil personal data is stored.
          </p>
        </div>

        <button
          onClick={onStartLesson}
          className="px-8 py-4 bg-bright-orange hover:bg-orange-600 text-white font-black text-xs rounded-2xl shadow-[0_10px_25px_rgba(255,107,26,0.4)] transition-all shrink-0 cursor-pointer flex items-center gap-2.5 z-10"
        >
          <Sparkles className="w-4 h-4" />
          <span>Create Custom Lesson</span>
        </button>
      </section>
    </div>
  );
};
