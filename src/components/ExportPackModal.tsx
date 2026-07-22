import React, { useState } from 'react';
import { FullLessonPackage } from '../types';
import { ApiClient } from '../services/apiClient';
import { GoogleClassroomService, ClassroomCourse } from '../services/GoogleClassroomService';
import { Download, Printer, Lock, CheckCircle, FileText, X, Copy, FileCode, Presentation, Archive, Loader2 } from 'lucide-react';

interface ExportPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonPackage: FullLessonPackage | null;
  approvedCount: number;
  totalSections: number;
  onTriggerPrint: () => void;
}

export const ExportPackModal: React.FC<ExportPackModalProps> = ({
  isOpen,
  onClose,
  lessonPackage,
  approvedCount,
  totalSections,
  onTriggerPrint,
}) => {
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const [gcToken, setGcToken] = useState<string | null>(() => GoogleClassroomService.getStoredToken());
  const [courses, setCourses] = useState<ClassroomCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [workType, setWorkType] = useState<'ASSIGNMENT' | 'MATERIAL'>('ASSIGNMENT');
  const [isLoadingCourses, setIsLoadingCourses] = useState<boolean>(false);
  const [isSharingGC, setIsSharingGC] = useState<boolean>(false);
  const [isUploadingAll, setIsUploadingAll] = useState<boolean>(false);
  const [gcSuccess, setGcSuccess] = useState<{ postId: string; webViewLink?: string } | null>(null);
  const [gcError, setGcError] = useState<string | null>(null);

  if (!isOpen || !lessonPackage) return null;

  const isLocked = approvedCount < totalSections;

  const handleConnectGC = async () => {
    setGcError(null);
    setIsLoadingCourses(true);
    try {
      const token = await GoogleClassroomService.requestToken();
      setGcToken(token);
      const fetchedCourses = await GoogleClassroomService.fetchCourses(token);
      setCourses(fetchedCourses);
      if (fetchedCourses.length > 0) {
        setSelectedCourseId(fetchedCourses[0].id);
      }
    } catch (err: any) {
      console.error('GC Connect error:', err);
      setGcError(err.message || 'Failed to authenticate with Google Classroom');
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const handleShareToClassroom = async () => {
    if (!gcToken || !selectedCourseId || !lessonPackage) return;
    setGcError(null);
    setIsSharingGC(true);
    try {
      const result = await GoogleClassroomService.shareLessonToClassroom(gcToken, selectedCourseId, lessonPackage, workType);
      setGcSuccess(result);
    } catch (err: any) {
      console.error('GC Share error:', err);
      setGcError(err.message || 'Failed to share lesson to Google Classroom');
    } finally {
      setIsSharingGC(false);
    }
  };

  const handleUploadAllMaterials = async () => {
    if (!gcToken || !selectedCourseId || !lessonPackage) return;
    setGcError(null);
    setIsUploadingAll(true);
    try {
      const result = await GoogleClassroomService.shareAllMaterials(gcToken, selectedCourseId, lessonPackage);
      setGcSuccess({ postId: 'batch_' + result.postedCount, webViewLink: result.webViewLink });
    } catch (err: any) {
      console.error('GC Batch upload error:', err);
      setGcError(err.message || 'Failed to upload all materials to Google Classroom');
    } finally {
      setIsUploadingAll(false);
    }
  };

  const handleExportFormat = async (format: 'pdf' | 'docx' | 'markdown' | 'json' | 'pptx' | 'zip') => {
    setExportError(null);
    setDownloadingFormat(format);
    try {
      const res = await ApiClient.exportPackage(lessonPackage.id, format);
      if (res.downloadUrl) {
        const link = document.createElement('a');
        link.href = res.downloadUrl;
        link.download = res.filename || `TeachMate_${lessonPackage.topic}_${format}.${format}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else if (res.content) {
        const blob = new Blob([res.content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = res.filename || `TeachMate_${lessonPackage.topic}_${format}.${format}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      }
    } catch (err: any) {
      console.error('Export failed:', err);
      setExportError(err.message || 'Export forbidden. All 13 sections must be approved.');
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleCopyTextSummary = () => {
    const text = `
TEACHMATE AI LESSON PACKAGE: ${lessonPackage.topic}
Subject: ${lessonPackage.subject} | Grade: ${lessonPackage.grade}
Duration: ${lessonPackage.durationMinutes} Mins
NERDC Benchmark: ${lessonPackage.citationVerification?.nerdcBenchmarkCode}

OBJECTIVES:
${lessonPackage.lessonPlan.behavioralObjectives.map((o) => `• ${o}`).join('\n')}

MATERIALS:
${lessonPackage.lessonPlan.materialsNeeded.join(', ')}

SUMMARY NOTES:
${lessonPackage.learnerNotes.summaryText}

QUIZ:
${lessonPackage.quiz.questions.map((q) => `${q.id}. ${q.questionText}\nAnswer: ${q.correctAnswer}`).join('\n\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    alert('Lesson package summary copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-teal-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border-2 border-teal-500 max-w-2xl w-full p-6 md:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 bg-gray-100 p-2 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-md">
            🚀
          </div>
          <div>
            <h2 className="text-xl font-bold text-teal-950">Export Multi-Format Lesson Package</h2>
            <p className="text-xs text-gray-500">
              Download verified Teacher & Learner packages in PDF, Word (DOCX), Markdown, JSON, PPTX, or ZIP.
            </p>
          </div>
        </div>

        {/* Export Error Alert */}
        {exportError && (
          <div className="bg-red-50 border border-red-300 p-3 rounded-xl mb-4 text-xs text-red-800 flex items-center gap-2">
            <Lock className="w-4 h-4 text-red-600 shrink-0" />
            <span>{exportError}</span>
          </div>
        )}

        {/* Lock Banner */}
        {isLocked ? (
          <div className="bg-orange-100 border-2 border-orange-300 p-4 rounded-2xl mb-6 text-orange-950 flex items-start gap-3">
            <Lock className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-orange-700">
                Exports Locked ({approvedCount}/{totalSections} Approved)
              </h4>
              <p className="text-xs mt-1 leading-relaxed">
                To guarantee educational quality and safety, all {totalSections} lesson sections must be reviewed and explicitly marked <span className="font-bold">APPROVED</span> before exporting.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-teal-50 border-2 border-teal-500 p-4 rounded-2xl mb-6 text-teal-950 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-teal-600 shrink-0" />
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-teal-800">
                All {totalSections} Sections Approved!
              </h4>
              <p className="text-xs text-teal-700">
                Your lesson package is fully verified for classroom distribution.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => handleExportFormat('zip')}
            disabled={isLocked || downloadingFormat === 'zip'}
            className="py-3 px-4 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed col-span-1 sm:col-span-2"
          >
            {downloadingFormat === 'zip' ? <Loader2 className="w-4 h-4 animate-spin text-orange-300" /> : <Archive className="w-4 h-4 text-orange-300" />}
            <span>Download Complete Package ZIP (Teacher & Learner Bundles)</span>
          </button>

          <button
            onClick={onTriggerPrint}
            disabled={isLocked}
            className="py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Printer className="w-4 h-4 text-orange-300" />
            <span>Printable PDF / Save as PDF</span>
          </button>

          <button
            onClick={() => handleExportFormat('docx')}
            disabled={isLocked || downloadingFormat === 'docx'}
            className="py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {downloadingFormat === 'docx' ? <Loader2 className="w-4 h-4 animate-spin text-orange-300" /> : <FileText className="w-4 h-4 text-orange-300" />}
            <span>Download MS Word (.DOCX)</span>
          </button>

          <button
            onClick={() => handleExportFormat('markdown')}
            disabled={isLocked || downloadingFormat === 'markdown'}
            className="py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {downloadingFormat === 'markdown' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCode className="w-4 h-4" />}
            <span>Download Markdown (.MD)</span>
          </button>

          <button
            onClick={() => handleExportFormat('pptx')}
            disabled={isLocked || downloadingFormat === 'pptx'}
            className="py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {downloadingFormat === 'pptx' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Presentation className="w-4 h-4" />}
            <span>Download Slide Deck (.PPTX)</span>
          </button>

          <button
            onClick={() => handleExportFormat('json')}
            disabled={isLocked || downloadingFormat === 'json'}
            className="py-3 px-4 bg-white border-2 border-gray-200 hover:border-teal-500 text-gray-800 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {downloadingFormat === 'json' ? <Loader2 className="w-4 h-4 animate-spin text-teal-700" /> : <Download className="w-4 h-4 text-teal-700" />}
            <span>Download Structured JSON</span>
          </button>

          <button
            onClick={handleCopyTextSummary}
            disabled={isLocked}
            className="py-3 px-4 bg-white border-2 border-gray-200 hover:border-teal-500 text-gray-800 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Copy className="w-4 h-4 text-teal-700" />
            <span>Copy Text Summary</span>
          </button>
        </div>

        {/* Google Classroom Integration Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-sm">
                  📚
                </div>
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-blue-950">Share to Google Classroom</h3>
                  <p className="text-[11px] text-blue-700">Post directly as Coursework or Material to your connected classes</p>
                </div>
              </div>
              {!gcToken ? (
                <button
                  onClick={handleConnectGC}
                  disabled={isLoadingCourses}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isLoadingCourses ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Connect Classroom</span>}
                </button>
              ) : (
                <button
                  onClick={() => {
                    GoogleClassroomService.clearToken();
                    setGcToken(null);
                    setCourses([]);
                    setGcSuccess(null);
                  }}
                  className="text-[11px] text-gray-500 hover:text-red-600 underline cursor-pointer font-medium"
                >
                  Disconnect
                </button>
              )}
            </div>

            {gcError && (
              <div className="bg-red-100 text-red-800 p-2.5 rounded-xl text-xs mb-3">
                {gcError}
              </div>
            )}

            {gcSuccess ? (
              <div className="bg-emerald-100 border border-emerald-300 p-3 rounded-xl text-xs text-emerald-950 flex flex-col gap-2">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <CheckCircle className="w-4 h-4" />
                  <span>Successfully posted to Google Classroom!</span>
                </div>
                {gcSuccess.webViewLink && (
                  <a
                    href={gcSuccess.webViewLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline font-medium hover:text-blue-800 text-[11px]"
                  >
                    Open in Google Classroom ↗
                  </a>
                )}
                <button
                  onClick={() => setGcSuccess(null)}
                  className="mt-1 self-start px-2.5 py-1 bg-white border border-emerald-300 text-emerald-800 rounded-lg text-[11px] font-semibold cursor-pointer"
                >
                  Share to Another Class
                </button>
              </div>
            ) : gcToken ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-blue-900 mb-1">Select Classroom Course:</label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full bg-white border border-blue-300 rounded-xl px-3 py-2 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {courses.length === 0 ? (
                      <option value="">No courses found. Click to load...</option>
                    ) : (
                      courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} {c.section ? `(${c.section})` : ''}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-[11px] font-bold text-blue-900">Post Type:</label>
                  <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="workType"
                      checked={workType === 'ASSIGNMENT'}
                      onChange={() => setWorkType('ASSIGNMENT')}
                      className="text-blue-600"
                    />
                    <span>Assignment (Graded 100pts)</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="workType"
                      checked={workType === 'MATERIAL'}
                      onChange={() => setWorkType('MATERIAL')}
                      className="text-blue-600"
                    />
                    <span>Course Material</span>
                  </label>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleShareToClassroom}
                    disabled={isLocked || isSharingGC || isUploadingAll || !selectedCourseId}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isSharingGC ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Share Single Lesson Post</span>}
                  </button>

                  <button
                    onClick={handleUploadAllMaterials}
                    disabled={isLocked || isSharingGC || isUploadingAll || !selectedCourseId}
                    className="w-full py-2.5 bg-blue-800 hover:bg-blue-900 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isUploadingAll ? <Loader2 className="w-4 h-4 animate-spin text-orange-300" /> : <span className="text-orange-200 font-black">🚀 Upload All 7 Lesson Materials At Once</span>}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-blue-800 italic">
                Connect your Google account to grant permission for posting assignments and course materials to your Google Classroom courses.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
