import React from 'react';
import { LanguageCode, FullLessonPackage } from '../types';
import { LANGUAGES } from '../data/curriculumData';
import { Languages, ShieldCheck, CheckCircle, Info } from 'lucide-react';

interface SidebarControlsProps {
  lessonPackage: FullLessonPackage | null;
  activeLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  approvedCount: number;
  totalSections: number;
}

export const SidebarControls: React.FC<SidebarControlsProps> = ({
  lessonPackage,
  activeLanguage,
  onSelectLanguage,
  approvedCount,
  totalSections,
}) => {
  return (
    <aside className="w-full lg:w-72 bg-white border-r border-orange-100 p-6 flex flex-col gap-6 shrink-0 shadow-xs">
      {/* Current Lesson Header */}
      <div>
        <label className="text-[10px] font-bold text-orange-500 uppercase tracking-wider block mb-1">
          Current Lesson Focus
        </label>
        {lessonPackage ? (
          <div>
            <h2 className="text-base font-bold text-teal-950 leading-tight mb-1 line-clamp-2">
              {lessonPackage.topic}
            </h2>
            <p className="text-xs text-teal-700 font-medium">
              {lessonPackage.subject} | <span className="font-bold">{lessonPackage.grade}</span>
            </p>
            <div className="mt-2 text-[11px] text-gray-500 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-teal-500" />
              <span>Duration: {lessonPackage.durationMinutes} Mins</span>
            </div>
          </div>
        ) : (
          <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 text-xs text-orange-800">
            No active lesson selected. Click <span className="font-bold">New Lesson</span> above.
          </div>
        )}
      </div>

      {/* Language Output Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold text-orange-500 uppercase tracking-wider flex items-center gap-1">
            <Languages className="w-3 h-3" />
            <span>Language Output</span>
          </label>
          <span className="text-[9px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded font-bold">
            Multilingual
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {LANGUAGES.map((lang) => {
            const isSelected = activeLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => onSelectLanguage(lang.code)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs border border-teal-800'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-teal-300 hover:bg-teal-50'
                }`}
              >
                <span>{lang.label}</span>
                <span className="text-sm">{lang.flag}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Approval Status Card */}
      <div className="bg-teal-900 text-white p-4 rounded-2xl border border-teal-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-orange-300 font-black">
            Approval Lock
          </span>
          <span className="text-xs font-bold text-teal-200">
            {approvedCount}/{totalSections}
          </span>
        </div>
        <div className="w-full bg-teal-950 h-2 rounded-full overflow-hidden">
          <div
            className="bg-orange-400 h-full transition-all duration-300"
            style={{ width: `${totalSections > 0 ? (approvedCount / totalSections) * 100 : 0}%` }}
          />
        </div>
        <p className="text-[11px] text-teal-200 leading-snug">
          {approvedCount === totalSections && totalSections > 0
            ? '✅ All sections approved! Export unlocked.'
            : '🔒 Review and approve all sections before exporting final materials.'}
        </p>
      </div>

      {/* Safety & Grounding Card */}
      <div className="mt-auto bg-orange-100 p-4 rounded-2xl border border-orange-200">
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-orange-700 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-orange-950 leading-relaxed font-medium">
              <span className="font-bold">NERDC Verified:</span> Grounded in official Primary School benchmarks. Zero pupil PII collected.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
