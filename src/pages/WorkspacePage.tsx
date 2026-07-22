import React, { useState, useEffect, useRef } from 'react';
import { GradeLevel, SubjectName, LanguageCode } from '../types';
import { ApiClient, UploadResponse } from '../services/apiClient';
import { useToast } from '../context/ToastContext';
import {
  Sparkles,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Zap,
  Info,
  ShieldCheck,
  Languages,
  CheckSquare,
  Square,
  FileCheck,
} from 'lucide-react';

interface Props {
  onGenerate: (payload: any, idempotencyKey: string) => void;
  onSelectDemo: (topic: string) => void;
  isLoading: boolean;
}

const DRAFT_STORAGE_KEY = 'teachmate_workspace_draft';

export const WorkspacePage: React.FC<Props> = ({ onGenerate, onSelectDemo, isLoading }) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [subject, setSubject] = useState<SubjectName>('Basic Science & Technology');
  const [grade, setGrade] = useState<GradeLevel>('Primary 4');
  const [topic, setTopic] = useState<string>('The Water Cycle and Rainfall in Nigeria');
  const [durationMinutes, setDurationMinutes] = useState<number>(40);
  const [classSize, setClassSize] = useState<number>(35);
  const [term, setTerm] = useState<string>('Term 1');
  const [week, setWeek] = useState<number>(1);
  const [teacherInstructions, setTeacherInstructions] = useState<string>('');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [rawEvidenceText, setRawEvidenceText] = useState<string>('');

  // Upload State
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<UploadResponse | null>(null);

  // Output Selections
  const [outputs, setOutputs] = useState<Record<string, boolean>>({
    lessonPlan: true,
    teacherNotes: true,
    learnerNotes: true,
    activity: true,
    quiz: true,
    worksheet: true,
    slideDeck: true,
    videoResources: true,
    audioPodcast: true,
  });

  // Idempotency Key
  const [idempotencyKey, setIdempotencyKey] = useState<string>(
    `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
  );

  // 20 Specialist Agents Progress State
  const [agentProgress, setAgentProgress] = useState<number>(0);
  const [currentAgentIndex, setCurrentAgentIndex] = useState<number>(0);

  const specialistAgents = [
    'Curriculum Retrieval Agent (NERDC)',
    'NERDC Benchmark Verification Agent',
    'Behavioral Objectives Architect',
    '5-Step Lesson Plan Synthesizer',
    'Teacher Pedagogical Notes Specialist',
    'Misconception & Correction Generator',
    'Nigerian Local Analogy Agent',
    'Assessment Quiz Compiler',
    'Evaluation Rubric Designer',
    'Weekly Assessment Worksheet Generator',
    'Slide Deck Content Director',
    'Pixverse 15s Video Animator',
    'NotebookLM Audio Podcast Scripter',
    'Multilingual Translation Specialist',
    'Zero-PII Privacy & Safety Sentinel',
    'Citation & Reference Verifier',
    'Google Classroom Sync Agent',
    'DOCX Formatting Specialist',
    'PDF Layout & Styler',
    'Master Package Assembler',
  ];

  useEffect(() => {
    let timer: any;
    if (isLoading) {
      setAgentProgress(5);
      setCurrentAgentIndex(0);
      timer = setInterval(() => {
        setAgentProgress((prev) => {
          if (prev >= 98) return 98;
          const next = prev + 5;
          setCurrentAgentIndex(Math.min(19, Math.floor((next / 100) * 20)));
          return next;
        });
      }, 250);
    } else {
      setAgentProgress(100);
    }
    return () => clearInterval(timer);
  }, [isLoading]);

  const subjects: SubjectName[] = [
    'Basic Science & Technology',
    'Mathematics',
    'English Studies',
    'Social Studies',
    'Civic Education',
    'Agricultural Science',
    'Home Economics',
    'Cultural & Creative Arts',
  ];

  const grades: GradeLevel[] = ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'];

  // Load Saved Draft on Mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.subject) setSubject(parsed.subject);
        if (parsed.grade) setGrade(parsed.grade);
        if (parsed.topic) setTopic(parsed.topic);
        if (parsed.durationMinutes) setDurationMinutes(parsed.durationMinutes);
        if (parsed.classSize) setClassSize(parsed.classSize);
        if (parsed.term) setTerm(parsed.term);
        if (parsed.week) setWeek(parsed.week);
        if (parsed.teacherInstructions) setTeacherInstructions(parsed.teacherInstructions);
        if (parsed.language) setLanguage(parsed.language);
        if (parsed.rawEvidenceText) setRawEvidenceText(parsed.rawEvidenceText);
        if (parsed.outputs) setOutputs(parsed.outputs);
      }
    } catch (e) {
      console.warn('Failed to parse workspace draft from localStorage:', e);
    }
  }, []);

  // Save Draft to localStorage on Form State Change
  useEffect(() => {
    const draft = {
      subject,
      grade,
      topic,
      durationMinutes,
      classSize,
      term,
      week,
      teacherInstructions,
      language,
      rawEvidenceText,
      outputs,
    };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  }, [subject, grade, topic, durationMinutes, classSize, term, week, teacherInstructions, language, rawEvidenceText, outputs]);

  // Handle Reset Form
  const handleResetForm = () => {
    setSubject('Basic Science & Technology');
    setGrade('Primary 4');
    setTopic('');
    setDurationMinutes(40);
    setClassSize(35);
    setTerm('Term 1');
    setWeek(1);
    setTeacherInstructions('');
    setLanguage('en');
    setRawEvidenceText('');
    setUploadedFile(null);
    setUploadProgress(0);
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    showToast('Form Reset', 'Cleared draft and restored default form inputs.', 'info');
  };

  // Upload Handler
  const processFileUpload = async (file: File) => {
    // Validate File Size (10MB Cap)
    if (file.size > 10 * 1024 * 1024) {
      showToast('File Too Large', 'Maximum allowed upload size is 10MB.', 'error');
      return;
    }

    // Validate MIME / extension
    const allowed = ['.pdf', '.docx', '.txt', '.png', '.jpg', '.jpeg'];
    const isAllowed = allowed.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!isAllowed) {
      showToast('Unsupported File Type', 'Please upload PDF, DOCX, TXT, PNG, JPG, or JPEG file.', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    // Simulated Progress steps for smooth UX
    const timer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 85) {
          clearInterval(timer);
          return 85;
        }
        return prev + 25;
      });
    }, 150);

    try {
      const res = await ApiClient.uploadFile(file);
      clearInterval(timer);
      setUploadProgress(100);
      setUploadedFile(res);
      showToast('File Processed', `Successfully extracted context from ${res.originalName}`, 'success');
      if (res.piiWarning) {
        showToast('Photo PII Alert', res.piiMessage || 'Ensure no pupil face/PII is included.', 'warning');
      }
    } catch (err: any) {
      clearInterval(timer);
      showToast('Upload Failed', err.message || 'Error processing file upload.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // Drag & Drop Listeners
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFileUpload(e.target.files[0]);
    }
  };

  // Check Form Validation
  const isTopicValid = topic.trim().length >= 2;
  const isSourceValid = Boolean(uploadedFile || rawEvidenceText.trim().length > 0 || topic.trim().length > 2);
  const isFormValid = isTopicValid && isSourceValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    const selectedOutputs = Object.entries(outputs)
      .filter(([_, isSelected]) => isSelected)
      .map(([key]) => key);

    const payload = {
      subject,
      grade,
      topic: topic.trim(),
      durationMinutes,
      classSize,
      term,
      week,
      teacherInstructions: teacherInstructions.trim() || undefined,
      rawEvidenceText: uploadedFile?.extractedSummary
        ? `${uploadedFile.extractedSummary}\n\n${rawEvidenceText}`
        : rawEvidenceText.trim() || undefined,
      sourceUploadId: uploadedFile?.uploadId,
      outputSelections: selectedOutputs,
      language,
    };

    onGenerate(payload, idempotencyKey);

    // Refresh idempotency key after submission
    setIdempotencyKey(`idemp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`);
  };

  const toggleOutput = (key: string) => {
    setOutputs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* 20 Specialist Agents Progress Bar Indicator */}
      {isLoading && (
        <div className="bg-teal-900 text-white rounded-3xl p-6 border-2 border-teal-700 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center font-bold text-white animate-spin">
                ⚙️
              </div>
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <span>20 Specialist Agents Orchestration Pipeline</span>
                  <span className="text-[10px] bg-bright-orange text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-black">
                    Active
                  </span>
                </h3>
                <p className="text-xs text-teal-200">
                  Current Agent ({currentAgentIndex + 1}/20): <span className="font-bold text-orange-300">{specialistAgents[currentAgentIndex]}</span>
                </p>
              </div>
            </div>
            <span className="text-sm font-extrabold text-orange-400">{agentProgress}%</span>
          </div>

          <div className="w-full bg-teal-950 h-3 rounded-full overflow-hidden border border-teal-800">
            <div
              className="bg-gradient-to-r from-orange-400 to-orange-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${agentProgress}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-teal-200 font-medium pt-1">
            <div className="flex items-center gap-1.5 bg-teal-800/60 p-2 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
              <span>NERDC Standards Verified</span>
            </div>
            <div className="flex items-center gap-1.5 bg-teal-800/60 p-2 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>Pedagogy & Quiz Generation</span>
            </div>
            <div className="flex items-center gap-1.5 bg-teal-800/60 p-2 rounded-lg">
              <FileCheck className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <span>10 Native Documents Compiled</span>
            </div>
            <div className="flex items-center gap-1.5 bg-teal-800/60 p-2 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-green-300 shrink-0" />
              <span>Zero-PII Privacy Enforced</span>
            </div>
          </div>
        </div>
      )}

      {/* Workspace Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <h2 className="text-xl font-bold text-deep-purple flex items-center gap-2">
              <span>Interactive Lesson Workspace</span>
              <span className="text-xs bg-light-orange text-bright-orange px-2.5 py-0.5 rounded-full font-bold">
                NERDC Aligned
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Configure Grade, Subject, Topic, and Upload Curriculum Evidence to generate a full 12-section lesson package.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetForm}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              title="Clear form draft"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Form</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTopic('The Water Cycle and Rainfall in Nigeria');
                setSubject('Basic Science & Technology');
                setGrade('Primary 4');
                onSelectDemo('Water Cycle');
              }}
              className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-primary-purple font-bold text-xs rounded-xl border border-purple-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-bright-orange" />
              <span>Load Water Cycle Demo</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grade & Subject Selector Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="subject-select" className="block text-xs font-bold text-gray-700 mb-2">
                Subject Area <span className="text-bright-orange">*</span>
              </label>
              <select
                id="subject-select"
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectName)}
                className="w-full h-11 px-3.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium text-dark-text focus:ring-2 focus:ring-primary-purple focus:outline-none cursor-pointer"
              >
                {subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="grade-select" className="block text-xs font-bold text-gray-700 mb-2">
                Grade Level <span className="text-bright-orange">*</span>
              </label>
              <select
                id="grade-select"
                value={grade}
                onChange={(e) => setGrade(e.target.value as GradeLevel)}
                className="w-full h-11 px-3.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium text-dark-text focus:ring-2 focus:ring-primary-purple focus:outline-none cursor-pointer"
              >
                {grades.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Topic Name Field & Quick Picks */}
          <div>
            <label htmlFor="topic-input" className="block text-xs font-bold text-gray-700 mb-2">
              Topic Name <span className="text-bright-orange">*</span>
            </label>
            <input
              id="topic-input"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. The Water Cycle and Rainfall in Nigeria"
              className="w-full h-11 px-3.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium text-dark-text focus:ring-2 focus:ring-primary-purple focus:outline-none"
              required
            />
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-[11px] text-gray-500 font-medium self-center">Quick Pick Topics:</span>
              <button
                type="button"
                onClick={() => {
                  setSubject('Basic Science & Technology');
                  setGrade('Primary 4');
                  setTopic('The Water Cycle and Rainfall in Nigeria');
                }}
                className="text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-lg transition-all"
              >
                Water Cycle
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubject('Basic Science & Technology');
                  setGrade('Primary 3');
                  setTopic('Parts of a Plant and Their Functions');
                }}
                className="text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-lg transition-all"
              >
                Parts of a Plant
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubject('Mathematics');
                  setGrade('Primary 5');
                  setTopic('Adding Simple Fractions with Same Denominators');
                }}
                className="text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-lg transition-all"
              >
                Fractions
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubject('Civic Education');
                  setGrade('Primary 4');
                  setTopic('Rights and Duties of a Nigerian Citizen');
                }}
                className="text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-lg transition-all"
              >
                Civic Duties
              </button>
            </div>
          </div>

          {/* Interactive Drag & Drop Upload Dropzone */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-primary-purple" />
                <span>Upload Source Document / Textbook Excerpt (PDF, DOCX, TXT, PNG, JPG)</span>
              </span>
              <span className="text-[11px] text-gray-400 font-normal">Max 10MB</span>
            </label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-bright-orange bg-orange-50/50 scale-[0.99]'
                  : uploadedFile
                  ? 'border-teal-500 bg-teal-50/20'
                  : 'border-gray-300 hover:border-primary-purple bg-gray-50/50 hover:bg-purple-50/20'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                className="hidden"
              />

              {isUploading ? (
                <div className="space-y-3 max-w-xs mx-auto py-2">
                  <div className="w-10 h-10 bg-purple-100 text-primary-purple rounded-xl flex items-center justify-center mx-auto animate-bounce">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-deep-purple">Processing Source Document...</p>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-bright-orange h-full transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono">{uploadProgress}% uploaded</p>
                </div>
              ) : uploadedFile ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">{uploadedFile.originalName}</span>
                        <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                          Uploaded
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Sanitized: <span className="font-mono text-gray-700">{uploadedFile.sanitizedName}</span> (
                        {(uploadedFile.sizeBytes / 1024).toFixed(1)} KB)
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFile(null);
                      setUploadProgress(0);
                      showToast('File Removed', 'Source file cleared from request', 'info');
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                    title="Remove File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2 py-2">
                  <div className="w-12 h-12 bg-purple-100 text-primary-purple rounded-2xl flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-dark-text">
                      Drag & Drop textbook excerpt or click to browse
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Supports PDF, DOCX, TXT, PNG, JPG, JPEG (Up to 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* PII Photo Warning Banner */}
            {uploadedFile?.piiWarning && (
              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3 text-amber-900 text-xs">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">Pupil PII Safety Advisory:</span>
                  <p className="text-[11px] text-amber-800 leading-relaxed">{uploadedFile.piiMessage}</p>
                </div>
              </div>
            )}
          </div>

          {/* Pasted Text / Additional Notes */}
          <div>
            <label htmlFor="evidence-textarea" className="block text-xs font-bold text-gray-700 mb-2 flex items-center justify-between">
              <span>Or Paste Scheme of Work / Textbook Notes directly</span>
              <span className="text-[11px] text-gray-400 font-normal">Optional Context</span>
            </label>
            <textarea
              id="evidence-textarea"
              value={rawEvidenceText}
              onChange={(e) => setRawEvidenceText(e.target.value)}
              rows={3}
              placeholder="Paste relevant NERDC scheme of work notes, textbook paragraphs, or syllabus guidelines..."
              className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-normal text-dark-text focus:ring-2 focus:ring-primary-purple focus:outline-none"
            />
          </div>

          {/* Secondary Parameters: Term, Duration, Class Size, Week, Language */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-2">
            <div>
              <label htmlFor="term-select" className="block text-xs font-bold text-gray-700 mb-1.5">School Term</label>
              <select
                id="term-select"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full h-10 px-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium text-dark-text"
              >
                <option value="Term 1">First Term</option>
                <option value="Term 2">Second Term</option>
                <option value="Term 3">Third Term</option>
              </select>
            </div>

            <div>
              <label htmlFor="week-input" className="block text-xs font-bold text-gray-700 mb-1.5">Term Week</label>
              <input
                id="week-input"
                type="number"
                value={week}
                onChange={(e) => setWeek(Number(e.target.value))}
                min={1}
                max={14}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium text-dark-text"
              />
            </div>

            <div>
              <label htmlFor="duration-input" className="block text-xs font-bold text-gray-700 mb-1.5">Duration (Mins)</label>
              <input
                id="duration-input"
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                min={20}
                max={90}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium text-dark-text"
              />
            </div>

            <div>
              <label htmlFor="class-size-input" className="block text-xs font-bold text-gray-700 mb-1.5">Class Size</label>
              <input
                id="class-size-input"
                type="number"
                value={classSize}
                onChange={(e) => setClassSize(Number(e.target.value))}
                min={5}
                max={120}
                className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium text-dark-text"
              />
            </div>

            <div>
              <label htmlFor="language-select" className="block text-xs font-bold text-gray-700 mb-1.5">Language</label>
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="w-full h-10 px-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium text-dark-text"
              >
                <option value="en">English</option>
                <option value="yo">Yoruba</option>
                <option value="ig">Igbo</option>
                <option value="ha">Hausa</option>
                <option value="pcm">Nigerian Pidgin</option>
              </select>
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label htmlFor="instructions-input" className="block text-xs font-bold text-gray-700 mb-1.5">
              Special Teacher Instructions (Optional)
            </label>
            <input
              id="instructions-input"
              type="text"
              value={teacherInstructions}
              onChange={(e) => setTeacherInstructions(e.target.value)}
              placeholder="e.g. Include additional examples for slow learners; focus heavily on local materials in activity..."
              className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-normal text-dark-text"
            />
          </div>

          {/* Output Asset Selection Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-700">
              Select Lesson Package Outputs to Generate (9 Assets):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { key: 'lessonPlan', label: '5-Step Lesson Plan' },
                { key: 'teacherNotes', label: 'Teacher Pedagogical Notes' },
                { key: 'learnerNotes', label: 'Pupil Revision Notes' },
                { key: 'activity', label: 'Hands-on Activity' },
                { key: 'quiz', label: 'Multiple-Choice Quiz' },
                { key: 'worksheet', label: 'Practice Worksheet' },
                { key: 'slideDeck', label: '6-Slide Presentation' },
                { key: 'videoResources', label: '15s Video & YouTube Links' },
                { key: 'audioPodcast', label: '2-Voice Audio Podcast' },
              ].map((item) => {
                const isSelected = outputs[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleOutput(item.key)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary-purple bg-purple-50 text-deep-purple font-bold'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-bright-orange shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full py-4 bg-bright-orange hover:bg-orange-600 text-white font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>20 Agent Studio Orchestrating Lesson Package...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Full 12-Section Lesson Package</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2 px-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-teal-600" />
                <span>Zero-PII Storage Guarantee</span>
              </span>
              <span className="font-mono">Idempotency Key: {idempotencyKey.slice(0, 16)}...</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
