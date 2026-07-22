export type GradeLevel = 'Primary 1' | 'Primary 2' | 'Primary 3' | 'Primary 4' | 'Primary 5' | 'Primary 6';

export type SubjectName =
  | 'Basic Science & Technology'
  | 'Mathematics'
  | 'English Studies'
  | 'Social Studies'
  | 'Civic Education'
  | 'Agricultural Science'
  | 'Home Economics'
  | 'Cultural & Creative Arts';

export type LanguageCode = 'en' | 'yo' | 'ig' | 'ha' | 'pcm';

export interface LanguageInfo {
  code: LanguageCode;
  label: string;
  nativeName: string;
  flag: string;
}

export type ReviewStatus = 'needs_review' | 'approved';

export interface LessonPlanSection {
  title: string;
  subject: string;
  grade: GradeLevel;
  durationMinutes: number;
  behavioralObjectives: string[];
  materialsNeeded: string[];
  deliverySteps: {
    setInduction: { duration: string; teacherActivity: string; pupilActivity: string };
    instruction: { duration: string; teacherActivity: string; pupilActivity: string };
    guidedPractice: { duration: string; teacherActivity: string; pupilActivity: string };
    independentPractice: { duration: string; teacherActivity: string; pupilActivity: string };
    closure: { duration: string; teacherActivity: string; pupilActivity: string };
  };
  status: ReviewStatus;
}

export interface TeacherNotesSection {
  pedagogicalBackground: string;
  commonMisconceptions: Array<{ misconception: string; correctionStrategy: string }>;
  teachingTips: string[];
  localNigerianAnalogies: string[];
  status: ReviewStatus;
}

export interface LearnerNotesSection {
  summaryText: string;
  keyVocabulary: Array<{ term: string; definition: string; phonetic?: string; example?: string }>;
  coreTakeaways: string[];
  translatedVersions?: Partial<Record<LanguageCode, { summaryText: string; coreTakeaways: string[] }>>;
  status: ReviewStatus;
}

export interface ActivitySection {
  activityName: string;
  grouping: string;
  localMaterials: string[];
  stepByStepInstructions: string[];
  expectedOutcome: string;
  status: ReviewStatus;
}

export interface QuizQuestion {
  id: number;
  questionText: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizSection {
  questions: QuizQuestion[];
  status: ReviewStatus;
}

export interface WorksheetRubricItem {
  criteria: string;
  level1NeedsImp: string;
  level2Fair: string;
  level3Good: string;
  level4Excellent: string;
}

export interface WorksheetSection {
  worksheetTitle: string;
  instructions: string;
  exercises: string[];
  rubric: WorksheetRubricItem[];
  status: ReviewStatus;
}

export interface SlideItem {
  slideNumber: number;
  title: string;
  bulletPoints: string[];
  speakerNotes: string;
  imagePrompt: string;
}

export interface SlideDeckSection {
  deckTitle: string;
  slides: SlideItem[];
  status: ReviewStatus;
}

export interface YouTubeLink {
  title: string;
  url: string;
  duration: string;
  recommendedTimestamp: string;
  relevance: string;
}

export interface VideoResourcesSection {
  pixverse15sVideoUrl?: string;
  pixverseStatus: 'generated' | 'fallback' | 'pending';
  videoPromptUsed: string;
  youtubeLinks: YouTubeLink[];
  status: ReviewStatus;
}

export interface DialogueLine {
  speaker: 'Voice A (Educator)' | 'Voice B (Learner)';
  line: string;
}

export interface AudioPodcastSection {
  title: string;
  dialogueScript: DialogueLine[];
  audioBase64?: string;
  audioMimeType?: string;
  status: ReviewStatus;
}

export interface FullLessonPackage {
  id: string;
  createdAt: string;
  subject: SubjectName;
  grade: GradeLevel;
  topic: string;
  durationMinutes: number;
  extractedEvidence?: string;
  activeLanguage: LanguageCode;
  
  lessonPlan: LessonPlanSection;
  teacherNotes: TeacherNotesSection;
  learnerNotes: LearnerNotesSection;
  activity: ActivitySection;
  quiz: QuizSection;
  worksheet: WorksheetSection;
  slideDeck: SlideDeckSection;
  videoResources: VideoResourcesSection;
  audioPodcast: AudioPodcastSection;
  
  citationVerification: {
    verified: boolean;
    nerdcBenchmarkCode: string;
    sources: string[];
  };
  
  safetyAudit: {
    safe: boolean;
    notes: string;
  };
  
  overallApprovalStatus: 'draft' | 'all_approved';
}

export interface GenerateLessonRequest {
  subject: SubjectName;
  grade: GradeLevel;
  topic: string;
  durationMinutes?: number;
  rawEvidenceText?: string;
}
