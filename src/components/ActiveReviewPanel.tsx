import React, { useState } from 'react';
import { FullLessonPackage, ReviewStatus, LanguageCode } from '../types';
import { CheckCircle, Edit3, RefreshCw, Languages, Shield, AlertTriangle } from 'lucide-react';

interface ActiveReviewPanelProps {
  sectionKey: string;
  lessonPackage: FullLessonPackage;
  activeLanguage: LanguageCode;
  onUpdateSection: (sectionKey: string, updatedData: any) => void;
  onToggleApproval: (sectionKey: string) => void;
  onTranslate: (sectionKey: string, lang: LanguageCode) => void;
  isTranslating: boolean;
}

export const ActiveReviewPanel: React.FC<ActiveReviewPanelProps> = ({
  sectionKey,
  lessonPackage,
  activeLanguage,
  onUpdateSection,
  onToggleApproval,
  onTranslate,
  isTranslating,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // Helper to extract section content
  const getSectionData = () => {
    switch (sectionKey) {
      case 'lessonPlan':
        return { title: 'Lesson Plan', data: lessonPackage.lessonPlan, status: lessonPackage.lessonPlan.status };
      case 'teacherNotes':
        return { title: 'Teacher Notes', data: lessonPackage.teacherNotes, status: lessonPackage.teacherNotes.status };
      case 'learnerNotes':
        return { title: 'Student/Learner Notes', data: lessonPackage.learnerNotes, status: lessonPackage.learnerNotes.status };
      case 'activity':
        return { title: 'Classroom Activity Guide', data: lessonPackage.activity, status: lessonPackage.activity.status };
      case 'quiz':
        return { title: 'Assessment Quiz & Key', data: lessonPackage.quiz, status: lessonPackage.quiz.status };
      case 'worksheet':
        return { title: 'Worksheet & Marking Rubric', data: lessonPackage.worksheet, status: lessonPackage.worksheet.status };
      default:
        return { title: 'Lesson Plan', data: lessonPackage.lessonPlan, status: lessonPackage.lessonPlan.status };
    }
  };

  const { title, data, status } = getSectionData();
  const isApproved = status === 'approved';

  return (
    <div className="col-span-1 lg:col-span-2 bg-teal-900 rounded-3xl p-6 text-white flex flex-col gap-4 shadow-xl border border-teal-800">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-teal-800/80 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-orange-400 text-xl font-bold">⚡ Active Review:</span>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <span
            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
              isApproved ? 'bg-teal-500 text-white' : 'bg-orange-500 text-white'
            }`}
          >
            {isApproved ? 'APPROVED' : 'NEEDS REVIEW'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onTranslate(sectionKey, activeLanguage)}
            disabled={isTranslating}
            className="text-[11px] font-bold bg-white/10 hover:bg-white/20 text-teal-100 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Languages className="w-3.5 h-3.5 text-orange-400" />
            <span>{isTranslating ? 'Translating...' : `Translate (${activeLanguage.toUpperCase()})`}</span>
          </button>

          <button
            onClick={() => onToggleApproval(sectionKey)}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${
              isApproved
                ? 'bg-teal-500 hover:bg-teal-600 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-white animate-pulse'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isApproved ? 'Approved (Click to Edit)' : 'Approve Section'}</span>
          </button>
        </div>
      </div>

      {/* Content Rendering Body */}
      <div className="bg-teal-950/60 rounded-2xl p-4 md:p-5 border border-teal-800 space-y-4 max-h-[420px] overflow-y-auto text-xs text-teal-100 leading-relaxed font-sans">
        {sectionKey === 'lessonPlan' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-orange-300 text-sm mb-1">Behavioral Objectives</h4>
              <ul className="list-disc list-inside space-y-1 text-teal-100">
                {lessonPackage.lessonPlan.behavioralObjectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-orange-300 text-sm mb-1">Instructional Materials Needed</h4>
              <p className="text-teal-200">{lessonPackage.lessonPlan.materialsNeeded.join(', ')}</p>
            </div>

            <div>
              <h4 className="font-bold text-orange-300 text-sm mb-2">5-Step Delivery Breakdown</h4>
              <div className="space-y-2">
                {Object.entries(lessonPackage.lessonPlan.deliverySteps).map(([stepKey, stepValRaw]) => {
                  const stepVal = stepValRaw as { duration: string; teacherActivity: string; pupilActivity: string };
                  return (
                    <div key={stepKey} className="bg-teal-900/80 p-3 rounded-xl border border-teal-800">
                      <div className="flex justify-between items-center mb-1 font-bold text-white uppercase text-[10px] tracking-wider">
                        <span className="text-orange-400">{stepKey.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="bg-teal-800 px-2 py-0.5 rounded text-teal-200">{stepVal.duration}</span>
                      </div>
                      <p className="text-teal-200"><span className="font-bold text-white">Teacher:</span> {stepVal.teacherActivity}</p>
                      <p className="text-teal-300 mt-0.5"><span className="font-bold text-teal-100">Pupil:</span> {stepVal.pupilActivity}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {sectionKey === 'teacherNotes' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-orange-300 text-sm mb-1">Pedagogical Background</h4>
              <p className="text-teal-100 leading-relaxed">{lessonPackage.teacherNotes.pedagogicalBackground}</p>
            </div>

            <div>
              <h4 className="font-bold text-orange-300 text-sm mb-2">Common Pupil Misconceptions & Corrections</h4>
              <div className="space-y-2">
                {lessonPackage.teacherNotes.commonMisconceptions.map((mc, idx) => (
                  <div key={idx} className="bg-teal-900/80 p-3 rounded-xl border border-orange-500/30">
                    <p className="text-orange-300 font-bold mb-1">⚠️ Misconception: "{mc.misconception}"</p>
                    <p className="text-teal-100">💡 Correction Strategy: {mc.correctionStrategy}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-orange-300 text-sm mb-1">Local Nigerian Analogies</h4>
              <ul className="list-disc list-inside space-y-1">
                {lessonPackage.teacherNotes.localNigerianAnalogies.map((an, i) => (
                  <li key={i}>{an}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {sectionKey === 'learnerNotes' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-orange-300 text-sm mb-1">Pupil Lesson Summary</h4>
              <p className="text-teal-100 text-sm leading-relaxed">{lessonPackage.learnerNotes.summaryText}</p>
            </div>

            <div>
              <h4 className="font-bold text-orange-300 text-sm mb-2">Key Vocabulary Terms</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {lessonPackage.learnerNotes.keyVocabulary.map((vocab, i) => (
                  <div key={i} className="bg-teal-900/80 p-2.5 rounded-xl border border-teal-800">
                    <span className="font-bold text-orange-300 text-xs block mb-0.5">{vocab.term}</span>
                    <span className="text-teal-200 text-[11px]">{vocab.definition}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-orange-300 text-sm mb-1">Core Takeaways</h4>
              <ul className="list-disc list-inside space-y-1">
                {lessonPackage.learnerNotes.coreTakeaways.map((tk, i) => (
                  <li key={i}>{tk}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {sectionKey === 'activity' && (
          <div className="space-y-3">
            <h4 className="font-bold text-orange-300 text-sm">{lessonPackage.activity.activityName}</h4>
            <p><span className="font-bold text-white">Grouping:</span> {lessonPackage.activity.grouping}</p>

            <div>
              <span className="font-bold text-orange-300 block mb-1">Local Nigerian Materials Used:</span>
              <p className="text-teal-200">{lessonPackage.activity.localMaterials.join(', ')}</p>
            </div>

            <div>
              <span className="font-bold text-orange-300 block mb-1">Step-by-Step Instructions:</span>
              <ol className="list-decimal list-inside space-y-1">
                {lessonPackage.activity.stepByStepInstructions.map((st, i) => (
                  <li key={i}>{st}</li>
                ))}
              </ol>
            </div>

            <p><span className="font-bold text-white">Expected Outcome:</span> {lessonPackage.activity.expectedOutcome}</p>
          </div>
        )}

        {sectionKey === 'quiz' && (
          <div className="space-y-3">
            <h4 className="font-bold text-orange-300 text-sm mb-2">5-Question Assessment & Answer Key</h4>
            {lessonPackage.quiz.questions.map((q, i) => (
              <div key={i} className="bg-teal-900/80 p-3 rounded-xl border border-teal-800 space-y-1">
                <p className="font-bold text-white">{q.id}. {q.questionText}</p>
                {q.options && (
                  <div className="grid grid-cols-2 gap-1 my-1 text-[11px] text-teal-200">
                    {q.options.map((opt, idx) => (
                      <span key={idx}>{opt}</span>
                    ))}
                  </div>
                )}
                <p className="text-orange-300 font-bold text-[11px]">Correct Answer: {q.correctAnswer}</p>
                <p className="text-teal-300 text-[10px]">Explanation: {q.explanation}</p>
              </div>
            ))}
          </div>
        )}

        {sectionKey === 'worksheet' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-orange-300 text-sm mb-1">{lessonPackage.worksheet.worksheetTitle}</h4>
              <p className="text-teal-200 italic mb-2">{lessonPackage.worksheet.instructions}</p>
              <ul className="list-disc list-inside space-y-1 text-teal-100">
                {lessonPackage.worksheet.exercises.map((ex, i) => (
                  <li key={i}>{ex}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-orange-300 text-sm mb-2">Marking Rubric (4-Level Evaluation)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px] text-teal-200 border-collapse">
                  <thead>
                    <tr className="bg-teal-950 text-orange-300 font-bold border-b border-teal-800">
                      <th className="p-2">Criteria</th>
                      <th className="p-2">Needs Improvement</th>
                      <th className="p-2">Fair</th>
                      <th className="p-2">Good</th>
                      <th className="p-2">Excellent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lessonPackage.worksheet.rubric.map((r, i) => (
                      <tr key={i} className="border-b border-teal-900">
                        <td className="p-2 font-bold text-white">{r.criteria}</td>
                        <td className="p-2">{r.level1NeedsImp}</td>
                        <td className="p-2">{r.level2Fair}</td>
                        <td className="p-2">{r.level3Good}</td>
                        <td className="p-2 font-bold text-orange-300">{r.level4Excellent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
