import React from 'react';
import { Sparkles, BookOpen, Video, Mic, Globe, ShieldCheck, ArrowRight, CheckCircle2, Award, Zap, Layers, Cpu, FileCheck } from 'lucide-react';

interface Props {
  onStartLesson: () => void;
  onSelectDemo: (topic: string) => void;
}

export const LandingPage: React.FC<Props> = ({ onStartLesson, onSelectDemo }) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-8 sm:p-12 md:p-16 shadow-2xl overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-500/20 backdrop-blur-md rounded-full border border-teal-500/30 text-xs font-bold text-teal-300">
            <Award className="w-4 h-4 text-bright-orange" />
            <span>NERDC Primary Curriculum Aligned (Grades 1–6)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            TeachMate AI
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-orange-400 text-2xl sm:text-4xl mt-2 font-extrabold">
              Professional Primary Teacher Assistant
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
            Orchestrate 8 specialist AI agents to instantly generate comprehensive 5-step lesson notes, PowerPoint slide decks, 15-second animated topic videos, 2-voice audio podcasts, and Google Classroom resources.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={onStartLesson}
              className="px-7 py-4 bg-bright-orange hover:bg-orange-600 text-white font-bold text-sm rounded-2xl shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2.5 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-white" />
              <span>Launch Lesson Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectDemo('Water Cycle')}
              className="px-6 py-4 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-sm rounded-2xl backdrop-blur-md border border-slate-700 transition-all flex items-center gap-2.5 cursor-pointer shadow-sm"
            >
              <Zap className="w-4 h-4 text-bright-orange" />
              <span>Try Demo: Grade 4 Water Cycle</span>
            </button>
          </div>

          {/* Quick Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-800/80 text-xs text-slate-300">
            <div>
              <span className="block text-lg font-black text-white">20</span>
              <span>Specialist Agents</span>
            </div>
            <div>
              <span className="block text-lg font-black text-white">10</span>
              <span>Native Formats</span>
            </div>
            <div>
              <span className="block text-lg font-black text-white">100%</span>
              <span>NERDC Aligned</span>
            </div>
            <div>
              <span className="block text-lg font-black text-white">Instant</span>
              <span>Google Classroom Sync</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-deep-slate tracking-tight">
            Comprehensive Multi-Modal Lesson Suite
          </h2>
          <p className="text-sm text-slate-600">
            Designed specifically for Nigerian primary school educators to reduce paperwork by 80% and elevate pupil engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 bg-orange-50 text-bright-orange rounded-2xl flex items-center justify-center font-bold shadow-sm">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-deep-slate text-base">5-Step Lesson Notes</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Structured behavioral objectives, teacher activity, pupil activity, and hands-on experiments using local Nigerian materials.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 bg-teal-50 text-primary-teal rounded-2xl flex items-center justify-center font-bold shadow-sm">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-deep-slate text-base">15s Pixverse Video Guides</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Timeboxed 15-second animated topic visuals generated for classroom projectors or offline mobile viewing.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center font-bold shadow-sm">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-deep-slate text-base">2-Voice Audio Podcasts</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Conversational script between Teacher Blessing and Pupil Tobi with live synthesized speech playback.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center font-bold shadow-sm">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-deep-slate text-base">Multilingual Translation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instant translation of summary notes into Yoruba, Igbo, Hausa, or Nigerian Pidgin English for inclusive learning.
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Compliance Banner */}
      <section className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-teal-800">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-bright-orange" />
            <span>NERDC Standard & Nigerian Cultural Integrity</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Built for Nigerian Classrooms (Grades 1–6)
          </h3>
          <p className="text-xs sm:text-sm text-teal-100 max-w-2xl leading-relaxed">
            Every lesson incorporates local flora, fauna, currency (Naira), and low-cost everyday materials (bottle caps, seeds, local leaves) to make practical science and mathematics intuitive and engaging.
          </p>
        </div>

        <button
          onClick={onStartLesson}
          className="px-6 py-3.5 bg-bright-orange hover:bg-orange-600 text-white font-bold text-xs rounded-2xl shadow-lg transition-all shrink-0 cursor-pointer flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Lesson Now</span>
        </button>
      </section>
    </div>
  );
};
