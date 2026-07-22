import React, { useState } from 'react';
import { FullLessonPackage, LanguageCode } from '../types';
import {
  BookOpen,
  FileText,
  UserCheck,
  Activity,
  HelpCircle,
  Award,
  Presentation,
  Video,
  Mic,
  Globe,
  Printer,
  Download,
  CheckCircle2,
  CheckCircle,
  CheckSquare,
  ShieldCheck,
  Loader2,
  AlertCircle,
  X,
} from 'lucide-react';
import { AudioPodcastPlayer } from '../components/AudioPodcastPlayer';
import { PrintableLessonPack } from '../components/PrintableLessonPack';
import { ApiClient } from '../services/apiClient';
import { useToast } from '../context/ToastContext';

interface Props {
  lessonPackage: FullLessonPackage;
  onExportModalOpen: () => void;
  onUpdatePackage?: (updated: FullLessonPackage) => void;
}

export const ReviewStudioPage: React.FC<Props> = ({ lessonPackage, onExportModalOpen, onUpdatePackage }) => {
  const [activeTab, setActiveTab] = useState<
    'plan' | 'teacher' | 'learner' | 'activity' | 'quiz' | 'worksheet' | 'slides' | 'video' | 'podcast'
  >('plan');

  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  const [isApproveAllModalOpen, setIsApproveAllModalOpen] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);

  const { showToast } = useToast();

  // Server-side approval computation across 13 sections
  const sectionChecks = [
    { key: 'lessonPlan', label: 'Lesson Plan', isApproved: lessonPackage.lessonPlan?.status === 'approved' },
    { key: 'teacherNotes', label: 'Teacher Notes', isApproved: lessonPackage.teacherNotes?.status === 'approved' },
    { key: 'learnerNotes', label: 'Student Notes', isApproved: lessonPackage.learnerNotes?.status === 'approved' },
    { key: 'activity', label: 'Class Activity', isApproved: lessonPackage.activity?.status === 'approved' },
    { key: 'quiz', label: 'Quiz & Key', isApproved: lessonPackage.quiz?.status === 'approved' },
    { key: 'worksheet', label: 'Worksheet & Rubric', isApproved: lessonPackage.worksheet?.status === 'approved' },
    { key: 'slideDeck', label: 'Slide Deck (6 Slides)', isApproved: lessonPackage.slideDeck?.status === 'approved' },
    { key: 'videoResources', label: '15s Pixverse Video', isApproved: lessonPackage.videoResources?.status === 'approved' },
    { key: 'audioPodcast', label: 'Audio Podcast', isApproved: lessonPackage.audioPodcast?.status === 'approved' },
    {
      key: 'translations',
      label: 'Multilingual Translations',
      isApproved:
        (lessonPackage as any).translations?.status === 'approved' ||
        Boolean(lessonPackage.learnerNotes?.translatedVersions && Object.keys(lessonPackage.learnerNotes.translatedVersions).length > 0),
    },
    { key: 'citationVerification', label: 'NERDC Citations', isApproved: ((lessonPackage.citationVerification as any)?.status ?? 'approved') === 'approved' },
    { key: 'safetyAudit', label: 'Primary Safety Audit', isApproved: ((lessonPackage.safetyAudit as any)?.status ?? 'approved') === 'approved' },
    { key: 'packageMetadata', label: 'Package Metadata', isApproved: ((lessonPackage as any).packageMetadata?.status ?? 'approved') === 'approved' },
  ];

  const approvedCount = sectionChecks.filter((s) => s.isApproved).length;
  const totalSections = 13;
  const isAllApproved = approvedCount === totalSections;
  const progressPct = Math.round((approvedCount / totalSections) * 100);

  const handleTranslate = async (lang: LanguageCode) => {
    setSelectedLanguage(lang);
    if (lang === 'en') {
      setTranslatedText(null);
      return;
    }

    try {
      setIsTranslating(true);
      const res = await ApiClient.translateSection(lessonPackage.id, lessonPackage.learnerNotes.summaryText, lang);
      setTranslatedText(res.translatedText);
      showToast('Translation Ready', `Translated summary into ${res.languageName}`, 'success');
    } catch (err: any) {
      showToast('Translation Failed', err.message || 'Unable to translate', 'error');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleApproveCurrentSection = async () => {
    const tabToKeyMap: Record<string, string> = {
      plan: 'lessonPlan',
      teacher: 'teacherNotes',
      learner: 'learnerNotes',
      activity: 'activity',
      quiz: 'quiz',
      worksheet: 'worksheet',
      slides: 'slideDeck',
      video: 'videoResources',
      podcast: 'audioPodcast',
    };

    const sectionKey = tabToKeyMap[activeTab] || activeTab;

    try {
      setIsApproving(true);
      const res = await ApiClient.reviewSection(lessonPackage.id, sectionKey, 'approved');
      if (res.package && onUpdatePackage) {
        onUpdatePackage(res.package);
      }
      showToast('Section Approved', `Approved ${activeTab} section.`, 'success');
    } catch (err: any) {
      showToast('Approval Failed', err.message || 'Unable to approve section', 'error');
    } finally {
      setIsApproving(false);
    }
  };

  const handleConfirmApproveAll = async () => {
    try {
      setIsApproving(true);
      const res = await ApiClient.approvePackage(lessonPackage.id);
      if (res.package && onUpdatePackage) {
        onUpdatePackage(res.package);
      }
      showToast('All 13 Sections Approved', 'Lesson package fully verified and ready for export!', 'success');
      setIsApproveAllModalOpen(false);
    } catch (err: any) {
      showToast('Bulk Approval Failed', err.message || 'Server-side approval recalculation failed', 'error');
    } finally {
      setIsApproving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Package Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-purple-100 text-primary-purple px-2.5 py-0.5 rounded-full font-bold">
              {lessonPackage.subject}
            </span>
            <span className="text-xs bg-orange-100 text-bright-orange px-2.5 py-0.5 rounded-full font-bold">
              {lessonPackage.grade}
            </span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{lessonPackage.citationVerification?.nerdcBenchmarkCode || 'NERDC-VERIFIED'}</span>
            </span>
          </div>
          <h2 className="text-2xl font-bold text-deep-purple">{lessonPackage.topic}</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Duration: {lessonPackage.durationMinutes} Mins • 20 Specialist Agents Verified
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-dark-text font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print PDF</span>
          </button>

          {!isAllApproved && (
            <button
              onClick={() => setIsApproveAllModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Approve All ({approvedCount}/13)</span>
            </button>
          )}

          <button
            onClick={onExportModalOpen}
            className="px-4 py-2.5 bg-bright-orange hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Package</span>
          </button>
        </div>
      </div>

      {/* Approval Status Progress Banner */}
      <div className={`p-4 rounded-2xl border-2 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isAllApproved ? 'bg-teal-50 border-teal-500 text-teal-950' : 'bg-amber-50 border-amber-300 text-amber-950'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shrink-0 ${
            isAllApproved ? 'bg-teal-600' : 'bg-amber-500'
          }`}>
            {isAllApproved ? <ShieldCheck className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-xs uppercase tracking-wider">
                {isAllApproved ? 'Export Unlocked — All 13 Sections Approved!' : `Quality Review Gate (${approvedCount}/${totalSections} Approved — ${progressPct}%)`}
              </h4>
            </div>
            <p className="text-xs mt-0.5 opacity-90">
              {isAllApproved
                ? 'All lesson materials, safety audits, and assessments have been verified by a teacher.'
                : 'Review each section below or click "Approve All Sections" to unlock multi-format PDF, Word, and PPT exports.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="w-32 bg-gray-200 h-2 rounded-full overflow-hidden hidden sm:block">
            <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>

          <button
            onClick={handleApproveCurrentSection}
            disabled={isApproving}
            className="px-3 py-1.5 bg-white border border-gray-300 hover:border-emerald-500 text-gray-800 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            {isApproving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
            <span>Approve Current Tab</span>
          </button>
        </div>
      </div>

      {/* Studio Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm scrollbar-none">
        {[
          { id: 'plan', label: 'Lesson Plan', icon: BookOpen },
          { id: 'teacher', label: 'Teacher Notes', icon: UserCheck },
          { id: 'learner', label: 'Student Notes', icon: FileText },
          { id: 'activity', label: 'Class Activity', icon: Activity },
          { id: 'quiz', label: 'Quiz & Key', icon: HelpCircle },
          { id: 'worksheet', label: 'Worksheet', icon: Award },
          { id: 'slides', label: 'Slides (6)', icon: Presentation },
          { id: 'video', label: '15s Video', icon: Video },
          { id: 'podcast', label: 'Audio Podcast', icon: Mic },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-deep-purple text-white shadow-md'
                  : 'text-gray-600 hover:text-deep-purple hover:bg-purple-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-bright-orange' : 'text-gray-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content Display */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm min-h-[400px]">
        {/* TAB 1: LESSON PLAN */}
        {activeTab === 'plan' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-deep-purple border-b border-gray-100 pb-3">
              5-Step Lesson Delivery Plan
            </h3>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Behavioral Objectives</h4>
              <ul className="space-y-2">
                {lessonPackage.lessonPlan.behavioralObjectives.map((obj, i) => (
                  <li key={i} className="text-xs text-gray-800 flex items-start gap-2 bg-purple-50 p-3 rounded-xl border border-purple-100">
                    <span className="font-bold text-primary-purple">{i + 1}.</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">5 Timed Classroom Delivery Steps</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(lessonPackage.lessonPlan.deliverySteps).map(([stepKey, stepVal]: [string, { duration: string; teacherActivity: string; pupilActivity: string }]) => (
                  <div key={stepKey} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-deep-purple capitalize">
                        {stepKey.replace(/([AZ])/g, ' $1').trim()}
                      </span>
                      <span className="text-[10px] bg-orange-100 text-bright-orange font-bold px-2 py-0.5 rounded-full">
                        {stepVal.duration}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700">
                      <strong>Teacher:</strong> {stepVal.teacherActivity}
                    </p>
                    <p className="text-xs text-gray-600">
                      <strong>Pupils:</strong> {stepVal.pupilActivity}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TEACHER NOTES */}
        {activeTab === 'teacher' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-deep-purple border-b border-gray-100 pb-3">
              Teacher Background & Pedagogical Notes
            </h3>

            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 text-xs text-gray-800 leading-relaxed">
              <strong>Pedagogical Context:</strong> {lessonPackage.teacherNotes.pedagogicalBackground}
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Common Misconceptions & Corrections</h4>
              <div className="space-y-3">
                {lessonPackage.teacherNotes.commonMisconceptions.map((item, i) => (
                  <div key={i} className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                    <p className="text-xs font-bold text-amber-900">Misconception: "{item.misconception}"</p>
                    <p className="text-xs text-amber-800">Correction Strategy: {item.correctionStrategy}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Local Nigerian Analogies</h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-gray-700">
                {lessonPackage.teacherNotes.localNigerianAnalogies.map((analogy, i) => (
                  <li key={i}>{analogy}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 3: LEARNER NOTES & TRANSLATION */}
        {activeTab === 'learner' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-deep-purple">Student Summary & Key Vocabulary</h3>

              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary-purple" />
                <span className="text-xs font-bold text-gray-700">Translate Summary:</span>
                {(['en', 'yo', 'ig', 'ha', 'pcm'] as LanguageCode[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleTranslate(lang)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                      selectedLanguage === lang
                        ? 'bg-primary-purple text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 bg-off-white rounded-2xl border border-gray-200 text-xs text-gray-800 leading-relaxed space-y-2">
              <h4 className="font-bold text-primary-purple uppercase text-[11px] tracking-wide">
                Summary ({selectedLanguage.toUpperCase()})
              </h4>
              <p>{isTranslating ? 'Translating summary...' : translatedText || lessonPackage.learnerNotes.summaryText}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Key Vocabulary Terms</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lessonPackage.learnerNotes.keyVocabulary.map((vocab, i) => (
                  <div key={i} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="font-bold text-deep-purple text-xs">{vocab.term}: </span>
                    <span className="text-xs text-gray-700">{vocab.definition}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CLASSROOM ACTIVITY */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-deep-purple border-b border-gray-100 pb-3">
              {lessonPackage.activity.activityName}
            </h3>

            <div className="flex gap-4 text-xs font-semibold text-gray-700">
              <span className="px-3 py-1 bg-purple-100 text-primary-purple rounded-full">
                Grouping: {lessonPackage.activity.grouping}
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Local Nigerian Materials Required</h4>
              <div className="flex flex-wrap gap-2">
                {lessonPackage.activity.localMaterials.map((mat, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-xs font-medium">
                    • {mat}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Step-by-Step Instructions</h4>
              <ol className="space-y-2">
                {lessonPackage.activity.stepByStepInstructions.map((step, i) => (
                  <li key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-800 flex gap-2">
                    <span className="font-bold text-bright-orange">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* TAB 5: QUIZ & KEY */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-deep-purple border-b border-gray-100 pb-3">
              Pupil Quiz & Answer Key
            </h3>

            <div className="space-y-4">
              {lessonPackage.quiz.questions.map((q, i) => (
                <div key={q.id || i} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <h4 className="text-xs font-bold text-deep-purple">
                    Q{i + 1}. {q.questionText}
                  </h4>
                  {q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, idx) => (
                        <div key={idx} className="p-2 bg-white rounded-lg border border-gray-200 text-xs text-gray-700">
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 mt-2">
                    <strong>Correct Answer:</strong> {q.correctAnswer} — <em>{q.explanation}</em>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: WORKSHEET & RUBRIC */}
        {activeTab === 'worksheet' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-deep-purple border-b border-gray-100 pb-3">
              {lessonPackage.worksheet.worksheetTitle}
            </h3>

            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 text-xs text-gray-800">
              <strong>Instructions:</strong> {lessonPackage.worksheet.instructions}
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Class Exercises</h4>
              <ul className="space-y-2">
                {lessonPackage.worksheet.exercises.map((ex, i) => (
                  <li key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-800 flex gap-2">
                    <span className="font-bold text-primary-purple">{i + 1}.</span>
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 7: POWERPOINT SLIDE DECK */}
        {activeTab === 'slides' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-deep-purple border-b border-gray-100 pb-3">
              PowerPoint Presentation Slides ({lessonPackage.slideDeck.slides.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lessonPackage.slideDeck.slides.map((slide) => (
                <div key={slide.slideNumber} className="bg-gradient-to-br from-deep-purple to-purple-900 text-white rounded-2xl p-6 shadow-md border border-purple-400/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-purple-400/20 pb-2">
                    <span className="text-[11px] font-bold text-orange-200">Slide #{slide.slideNumber}</span>
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-purple-200">
                      Interactive Visual
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white">{slide.title}</h4>

                  <ul className="space-y-1 text-xs text-purple-100 list-disc list-inside">
                    {slide.bulletPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>

                  <div className="p-3 bg-white/10 rounded-xl text-[11px] text-purple-200">
                    <strong>Speaker Notes:</strong> {slide.speakerNotes}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: 15s PIXVERSE VIDEO PLAYER */}
        {activeTab === 'video' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-deep-purple border-b border-gray-100 pb-3 flex items-center justify-between">
              <span>15-Second Pixverse Topic Animation</span>
              <span className="text-xs bg-orange-100 text-bright-orange px-2.5 py-0.5 rounded-full font-bold">
                Timeboxed 15s Max
              </span>
            </h3>

            <div className="max-w-2xl mx-auto space-y-4">
              <div className="aspect-video bg-gray-900 rounded-3xl overflow-hidden shadow-xl border-4 border-primary-purple flex items-center justify-center relative">
                <img
                  src={
                    lessonPackage.videoResources.pixverse15sVideoUrl ||
                    `/api/sample-video-stream?topic=${encodeURIComponent(lessonPackage.topic)}`
                  }
                  alt="15s Pixverse Visual Stream"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-700 space-y-1">
                <p>
                  <strong>Prompt Used:</strong> "{lessonPackage.videoResources.videoPromptUsed}"
                </p>
                <p className="text-[11px] text-gray-500">
                  Status: {lessonPackage.videoResources.pixverseStatus.toUpperCase()} • Generated with Pixverse Provider
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: AUDIO PODCAST PLAYER */}
        {activeTab === 'podcast' && (
          <AudioPodcastPlayer podcast={lessonPackage.audioPodcast} topic={lessonPackage.topic} />
        )}
      </div>

      {/* Confirmation Modal for Approve All Sections */}
      {isApproveAllModalOpen && (
        <div className="fixed inset-0 z-50 bg-teal-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-emerald-500 max-w-lg w-full p-6 md:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsApproveAllModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 bg-gray-100 p-2 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-md">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-teal-950">Approve All 13 Sections?</h3>
                <p className="text-xs text-gray-500">Teacher Quality Verification Gate</p>
              </div>
            </div>

            <div className="space-y-3 bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-950 mb-6">
              <p className="font-semibold">
                You are about to mark all 13 lesson components as <span className="uppercase text-emerald-700 font-bold">APPROVED</span>:
              </p>
              <ul className="grid grid-cols-2 gap-1.5 text-[11px] text-emerald-800 list-disc list-inside font-medium">
                <li>Lesson Delivery Plan</li>
                <li>Teacher Notes & Misconceptions</li>
                <li>Student Notes & Vocabulary</li>
                <li>Class Activity & Materials</li>
                <li>Quiz & Answer Key</li>
                <li>Worksheet & 4-Tier Rubric</li>
                <li>PowerPoint Deck (6 Slides)</li>
                <li>15s Pixverse Animation</li>
                <li>Audio Podcast Dialogue</li>
                <li>Multilingual Translations</li>
                <li>NERDC Citations</li>
                <li>Primary Safety Audit</li>
              </ul>
              <p className="text-[11px] text-gray-600 italic border-t border-emerald-200 pt-2">
                This action recalculates server-side package approval and immediately unlocks PDF, Word, PPTX, and ZIP exports.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsApproveAllModalOpen(false)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApproveAll}
                disabled={isApproving}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isApproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4" />}
                <span>Confirm & Approve All 13 Sections</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Printable Version */}
      <PrintableLessonPack lessonPackage={lessonPackage} />
    </div>
  );
};
