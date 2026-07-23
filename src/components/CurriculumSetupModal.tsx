import React, { useState } from 'react';
import { SubjectName, GradeLevel } from '../types';
import { SUBJECTS, GRADES, SAMPLE_TOPICS, SampleTopicPreset } from '../data/curriculumData';
import { BookOpen, Sparkles, Upload, FileText, CheckCircle, X } from 'lucide-react';

interface CurriculumSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (params: {
    subject: SubjectName;
    grade: GradeLevel;
    topic: string;
    durationMinutes: number;
    rawEvidenceText?: string;
  }) => void;
  isGenerating: boolean;
}

export const CurriculumSetupModal: React.FC<CurriculumSetupModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isGenerating,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectName>('Basic Science & Technology');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('Primary 4');
  const [topic, setTopic] = useState('Parts of a Plant and Photosynthesis');
  const [durationMinutes, setDurationMinutes] = useState(40);
  const [evidenceText, setEvidenceText] = useState(
    'Pupils should observe green plants in the school garden. Explain the functions of roots, stem, leaves, and how chlorophyll uses sunlight, water, and air to produce plant food.'
  );

  if (!isOpen) return null;

  const handleSelectPreset = (preset: SampleTopicPreset) => {
    setSelectedSubject(preset.subject);
    setSelectedGrade(preset.grade);
    setTopic(preset.topic);
    setDurationMinutes(preset.durationMinutes);
    setEvidenceText(preset.evidenceSnippet);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onSubmit({
      subject: selectedSubject,
      grade: selectedGrade,
      topic: topic.trim(),
      durationMinutes,
      rawEvidenceText: evidenceText.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#201A2B]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border-2 border-primary-purple max-w-2xl w-full p-6 md:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 bg-gray-100 p-2 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-bright-orange text-white rounded-2xl flex items-center justify-center font-black overflow-hidden shrink-0 shadow-sm">
            <img
              src="/src/assets/images/teachmate_logo_1784714143045.jpg"
              alt="TeachMate AI Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-white font-black text-xl">TM</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-deep-purple">TeachMate AI — Create New Lesson</h2>
            <p className="text-xs text-gray-500">
              Select Grade & Subject, confirm NERDC curriculum evidence, and run the specialist agent pipeline.
            </p>
          </div>
        </div>

        {/* Preset Quick Select Pills */}
        <div className="mb-6">
          <label className="text-[10px] font-bold text-orange-500 uppercase tracking-wider block mb-2">
            ⚡ Quick Start Presets (NERDC Primary Benchmarks)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SAMPLE_TOPICS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`p-3 rounded-xl border text-left transition-all text-xs flex items-start gap-2 cursor-pointer ${
                  topic === preset.topic
                    ? 'border-primary-purple bg-purple-50 text-purple-900 ring-2 ring-primary-purple/20'
                    : 'border-orange-100 bg-orange-50/50 hover:bg-orange-50 text-gray-700'
                }`}
              >
                <span className="text-lg shrink-0">{preset.icon}</span>
                <div className="min-w-0">
                  <div className="font-bold truncate">{preset.topic}</div>
                  <div className="text-[10px] text-gray-500">
                    {preset.subject} • {preset.grade}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-deep-purple block mb-1">Grade Level</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value as GradeLevel)}
                className="w-full bg-orange-50/50 border border-orange-200 rounded-xl px-3 py-2 text-sm font-semibold text-deep-purple focus:outline-none focus:ring-2 focus:ring-primary-purple"
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-deep-purple block mb-1">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value as SubjectName)}
                className="w-full bg-orange-50/50 border border-orange-200 rounded-xl px-3 py-2 text-sm font-semibold text-deep-purple focus:outline-none focus:ring-2 focus:ring-primary-purple"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-deep-purple block mb-1">Lesson Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Parts of a Plant and Photosynthesis"
              required
              className="w-full bg-orange-50/50 border border-orange-200 rounded-xl px-4 py-2.5 text-sm font-bold text-deep-purple focus:outline-none focus:ring-2 focus:ring-primary-purple"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-deep-purple block mb-1">
              Curriculum Evidence / Textbook Excerpt
            </label>
            <textarea
              rows={3}
              value={evidenceText}
              onChange={(e) => setEvidenceText(e.target.value)}
              placeholder="Paste textbook paragraph or NERDC scheme notes here..."
              className="w-full bg-orange-50/50 border border-orange-200 rounded-xl p-3 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-purple"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating || !topic.trim()}
              className="px-6 py-2.5 bg-bright-orange hover:bg-orange-600 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Orchestrating 20 Agents...' : 'Run Agent Pipeline'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
