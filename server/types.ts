import { z } from 'zod';

// Standard Error Response Format
export interface StandardApiError {
  error: {
    code: string;
    message: string;
    details?: any;
    requestId: string;
    timestamp: string;
  };
}

// Grade Level & Subject Enums for Zod
export const GradeLevelEnum = z.enum([
  'Primary 1',
  'Primary 2',
  'Primary 3',
  'Primary 4',
  'Primary 5',
  'Primary 6',
]);

export const SubjectNameEnum = z.enum([
  'Basic Science & Technology',
  'Mathematics',
  'English Studies',
  'Social Studies',
  'Civic Education',
  'Agricultural Science',
  'Home Economics',
  'Cultural & Creative Arts',
]);

export const LanguageCodeEnum = z.enum(['en', 'yo', 'ig', 'ha', 'pcm']);

export const OutputSelectionEnum = z.enum([
  'lessonPlan',
  'teacherNotes',
  'learnerNotes',
  'activity',
  'quiz',
  'worksheet',
  'slideDeck',
  'videoResources',
  'audioPodcast',
]);

// Request Schemas
export const CreateSessionSchema = z.object({
  teacherName: z.string().optional(),
  schoolName: z.string().optional(),
  defaultGrade: GradeLevelEnum.optional(),
  defaultSubject: SubjectNameEnum.optional(),
});

export const MatchCurriculumSchema = z.object({
  grade: GradeLevelEnum,
  subject: SubjectNameEnum,
  topic: z.string().min(2, 'Topic must be at least 2 characters'),
  keywords: z.array(z.string()).optional(),
});

export const ConfirmCurriculumSchema = z.object({
  sessionId: z.string().optional(),
  nerdcBenchmarkCode: z.string(),
  topic: z.string(),
});

export const GeneratePackageSchema = z.object({
  grade: GradeLevelEnum,
  subject: SubjectNameEnum,
  topic: z.string().min(2, 'Topic is required'),
  durationMinutes: z.number().min(10).max(180).optional().default(40),
  classSize: z.number().min(1).max(150).optional().default(35),
  term: z.enum(['Term 1', 'Term 2', 'Term 3']).optional().default('Term 1'),
  week: z.number().min(1).max(14).optional().default(1),
  teacherInstructions: z.string().optional(),
  rawEvidenceText: z.string().optional(),
  sourceUploadId: z.string().optional(),
  outputSelections: z.array(OutputSelectionEnum).optional(),
  language: LanguageCodeEnum.optional().default('en'),
});

export const PatchPackageSchema = z.object({
  topic: z.string().optional(),
  durationMinutes: z.number().optional(),
  activeLanguage: LanguageCodeEnum.optional(),
  lessonPlan: z.any().optional(),
  teacherNotes: z.any().optional(),
  learnerNotes: z.any().optional(),
  activity: z.any().optional(),
  quiz: z.any().optional(),
  worksheet: z.any().optional(),
  slideDeck: z.any().optional(),
  videoResources: z.any().optional(),
  audioPodcast: z.any().optional(),
});

export const ReviewSectionSchema = z.object({
  sectionKey: OutputSelectionEnum,
  status: z.enum(['needs_review', 'approved']),
  comments: z.string().optional(),
});

export const TranslateSectionSchema = z.object({
  sectionKey: z.string().optional().default('learnerNotes'),
  text: z.string().min(1, 'Text is required for translation'),
  targetLanguage: LanguageCodeEnum,
});

export const GenerateImagesSchema = z.object({
  prompt: z.string().optional(),
  slideIndex: z.number().optional(),
});

export const GenerateVideoSchema = z.object({
  topicPrompt: z.string().min(2, 'Topic prompt is required'),
  durationSeconds: z.number().optional().default(15),
});

export const ExportPackageSchema = z.object({
  format: z.enum(['pdf', 'docx', 'markdown', 'json', 'pptx', 'zip', 'print_ready']),
  includeAnswerKeys: z.boolean().optional().default(true),
  selectedSections: z.array(z.string()).optional(),
});

export type GeneratePackageInput = z.infer<typeof GeneratePackageSchema>;
