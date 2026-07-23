import React, { useState } from 'react';
import { FullLessonPackage, GradeLevel, SubjectName } from '../types';
import {
  CheckCircle2,
  Clock,
  FileText,
  FileCheck,
  Video,
  Mic,
  Presentation,
  BookOpen,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
  CheckSquare,
  Square,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface DashboardPageProps {
  historyList: FullLessonPackage[];
  onSelectPackage: (pkg: FullLessonPackage) => void;
  onNavigateWorkspace: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  historyList,
  onSelectPackage,
  onNavigateWorkspace,
}) => {
  const { showToast } = useToast();
  const [selectedTerm, setSelectedTerm] = useState<string>('Term 1');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('Primary 4');
  const [selectedSubject, setSelectedSubject] = useState<SubjectName>('Basic Science & Technology');

  // Simulated 12 weeks of curriculum for the term
  const weeks = Array.from({ length: 12 }, (_, i) => i + 1);

  // Document checklist types for each week
  const documentTypes = [
    { key: 'lessonNotes', label: 'Lesson Notes (.docx)', icon: FileText },
    { key: 'teacherNotes', label: 'Teacher Notes (.pdf)', icon: BookOpen },
    { key: 'studentNotes', label: 'Student Notes (.pdf)', icon: FileCheck },
    { key: 'classActivity', label: 'Class Activity (.pdf)', icon: CheckSquare },
    { key: 'quizAndKey', label: 'Quiz & Key (.pdf)', icon: Sparkles },
    { key: 'studentQuiz', label: 'Student Quiz (.pdf)', icon: FileCheck },
    { key: 'worksheet', label: 'Worksheet (.pdf)', icon: FileText },
    { key: 'slides', label: 'Presentation (.pptx)', icon: Presentation },
    { key: 'audio', label: 'Audio Podcast (.mp3)', icon: Mic },
    { key: 'video', label: 'Video Guide (.mp4)', icon: Video },
  ];

  // Helper to check if a package exists for a given week & grade
  const getPackageForWeek = (weekNum: number) => {
    return historyList.find(
      (p) =>
        p.grade === selectedGrade &&
        p.subject === selectedSubject &&
        ((p as any).week === weekNum || weekNum === 1) // fallback match for demo
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#3B176B] to-[#201A2B] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-orange-500/30">
              <Calendar className="w-3.5 h-3.5" />
              <span>Weekly Learner Document Tracker & Teacher Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Teacher Curriculum & Progress Hub
            </h1>
            <p className="text-sm text-purple-100 mt-1 max-w-2xl">
              Monitor weekly document generation, student mastery exercises, quiz distribution, and Google Classroom synchronization across all 12 NERDC school weeks.
            </p>
          </div>

          <button
            onClick={onNavigateWorkspace}
            className="px-5 py-3 bg-bright-orange hover:bg-orange-600 text-white font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate New Lesson Package</span>
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Select Grade Level</label>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value as GradeLevel)}
            className="w-full h-11 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-dark-text"
          >
            {['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'].map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Select Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value as SubjectName)}
            className="w-full h-11 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-dark-text"
          >
            {[
              'Basic Science & Technology',
              'Mathematics',
              'English Studies',
              'Social Studies',
              'Civic Education',
              'Agricultural Science',
              'Home Economics',
              'Cultural & Creative Arts',
            ].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">School Term</label>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="w-full h-11 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-dark-text"
          >
            <option value="Term 1">First Term (Weeks 1-12)</option>
            <option value="Term 2">Second Term (Weeks 1-12)</option>
            <option value="Term 3">Third Term (Weeks 1-12)</option>
          </select>
        </div>
      </div>

      {/* Weekly Tracker Table / List */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-base font-extrabold text-dark-text">
              {selectedSubject} — {selectedGrade} ({selectedTerm} Tracker)
            </h2>
            <p className="text-xs text-gray-500">
              Tracking 10 required documents per week: Lesson notes (.docx), Teacher/Student notes (.pdf), Activity, Quizzes, Worksheet, Slides (.pptx), Audio (.mp3), Video (.mp4).
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold">
            <span className="flex items-center gap-1 text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5" /> Generated (10/10)
            </span>
            <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5" /> Pending Review
            </span>
          </div>
        </div>

        <div className="divide-y divide-gray-100 overflow-x-auto">
          {weeks.map((weekNum) => {
            const pkg = getPackageForWeek(weekNum);
            const isCompleted = Boolean(pkg);
            const completionCount = isCompleted ? 10 : weekNum === 1 ? 10 : 0; // Week 1 demo completed, others pending or generated

            return (
              <div key={weekNum} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/80 transition-all">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black text-xs shrink-0 shadow-sm ${
                    completionCount === 10 ? 'bg-primary-purple text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    <span>WK</span>
                    <span className="text-sm">{weekNum}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-dark-text">
                        {pkg ? pkg.topic : `Week ${weekNum} Curriculum Topic (Nerdc Aligned)`}
                      </h3>
                      {completionCount === 10 ? (
                        <span className="bg-purple-100 text-primary-purple text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-bright-orange" /> 10/10 Files Ready
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Draft Pending
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {pkg ? `${pkg.durationMinutes} mins | ${pkg.subject}` : 'Click generate to assemble 10 native format documents & Google Classroom sync.'}
                    </p>

                    {/* Document mini badge list */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {documentTypes.map((doc, idx) => {
                        const DocIcon = doc.icon;
                        const isReady = completionCount === 10;
                        return (
                          <span
                            key={idx}
                            title={doc.label}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                              isReady
                                ? 'bg-purple-50 text-purple-900 border border-purple-200'
                                : 'bg-gray-100 text-gray-400 border border-gray-200'
                            }`}
                          >
                            <DocIcon className="w-3 h-3 shrink-0" />
                            <span className="truncate max-w-[100px]">{doc.label.split(' ')[0]}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {pkg ? (
                    <button
                      onClick={() => onSelectPackage(pkg)}
                      className="px-4 py-2 bg-primary-purple hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Open Review Studio</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={onNavigateWorkspace}
                      className="px-4 py-2 bg-bright-orange hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Week {weekNum}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
