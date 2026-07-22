/**
 * TEACHMATE AI — CORE CONTENT, ASSESSMENT & MULTILINGUAL AGENTS
 * 
 * Implements grounded, Zod-validated specialist agents:
 * 1. Lesson Planning Agent (Bloom's Cognitive/Affective/Psychomotor, 5 delivery steps)
 * 2. Teacher Notes Agent (Pedagogical background, misconceptions, local Nigerian analogies)
 * 3. Student/Learner Notes Agent (Distinct pupil register, grade-appropriate scaling)
 * 4. Hands-On Activity Agent (Low-cost Nigerian materials, step-by-step instructions)
 * 5. Assessment Quiz Agent (5+ MCQs with NERDC reference codes, answer key, marks)
 * 6. Worksheet + 4-Tier Rubric Agent (Exceeds / Meets / Developing / Below)
 * 7. Multilingual Translation Agent (Yoruba, Igbo, Hausa, Pidgin — preserving numbers & quiz logic)
 */

import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import {
  GradeLevel,
  SubjectName,
  LanguageCode,
  LessonPlanSection,
  TeacherNotesSection,
  LearnerNotesSection,
  ActivitySection,
  QuizSection,
  WorksheetSection,
  QuizQuestion,
  WorksheetRubricItem,
} from '../src/types';

// ===================================================================
// ZOD RESPONSE SCHEMAS FOR STRICT VALIDATION
// ===================================================================

export const LessonPlanZodSchema = z.object({
  title: z.string(),
  subject: z.string(),
  grade: z.string(),
  durationMinutes: z.number(),
  behavioralObjectives: z.array(z.string()).min(2),
  materialsNeeded: z.array(z.string()),
  deliverySteps: z.object({
    setInduction: z.object({ duration: z.string(), teacherActivity: z.string(), pupilActivity: z.string() }),
    instruction: z.object({ duration: z.string(), teacherActivity: z.string(), pupilActivity: z.string() }),
    guidedPractice: z.object({ duration: z.string(), teacherActivity: z.string(), pupilActivity: z.string() }),
    independentPractice: z.object({ duration: z.string(), teacherActivity: z.string(), pupilActivity: z.string() }),
    closure: z.object({ duration: z.string(), teacherActivity: z.string(), pupilActivity: z.string() }),
  }),
});

export const TeacherNotesZodSchema = z.object({
  pedagogicalBackground: z.string(),
  commonMisconceptions: z.array(
    z.object({
      misconception: z.string(),
      correctionStrategy: z.string(),
    })
  ),
  teachingTips: z.array(z.string()),
  localNigerianAnalogies: z.array(z.string()),
});

export const LearnerNotesZodSchema = z.object({
  summaryText: z.string(),
  keyVocabulary: z.array(
    z.object({
      term: z.string(),
      definition: z.string(),
      phonetic: z.string().optional(),
      example: z.string().optional(),
    })
  ),
  coreTakeaways: z.array(z.string()),
});

export const ActivityZodSchema = z.object({
  activityName: z.string(),
  grouping: z.string(),
  localMaterials: z.array(z.string()),
  stepByStepInstructions: z.array(z.string()),
  expectedOutcome: z.string(),
});

export const QuizQuestionZodSchema = z.object({
  id: z.number(),
  questionText: z.string(),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string(),
  explanation: z.string(),
});

export const QuizZodSchema = z.object({
  questions: z.array(QuizQuestionZodSchema).min(3),
});

export const WorksheetRubricZodSchema = z.object({
  criteria: z.string(),
  level1NeedsImp: z.string(),
  level2Fair: z.string(),
  level3Good: z.string(),
  level4Excellent: z.string(),
});

export const WorksheetZodSchema = z.object({
  worksheetTitle: z.string(),
  instructions: z.string(),
  exercises: z.array(z.string()),
  rubric: z.array(WorksheetRubricZodSchema),
});

export const TranslationZodSchema = z.object({
  summaryText: z.string(),
  coreTakeaways: z.array(z.string()),
  keyVocabulary: z.array(
    z.object({
      term: z.string(),
      definition: z.string(),
    })
  ).optional(),
});

// ===================================================================
// HELPER FOR SAFE API EXECUTION WITH CLEAN FALLBACK
// ===================================================================

async function callGeminiSafely(
  ai: GoogleGenAI | null,
  agentName: string,
  systemPrompt: string,
  temperature = 0.2
): Promise<string | null> {
  if (!ai) return null;
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
      config: { responseMimeType: 'application/json', temperature },
    });
    return res.text || null;
  } catch (err: any) {
    const isRateLimit = err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('RESOURCE_EXHAUSTED');
    if (isRateLimit) {
      console.warn(`[${agentName}] Gemini free-tier rate limit (429) encountered. Utilizing NERDC benchmark fallback.`);
    } else {
      console.warn(`[${agentName}] Gemini API execution failed. Utilizing NERDC benchmark fallback.`);
    }
    return null;
  }
}

// ===================================================================
// INPUT INTERFACE
// ===================================================================

export interface AgentInput {
  subject: SubjectName;
  grade: GradeLevel;
  topic: string;
  durationMinutes: number;
  classSize: number;
  term?: string;
  week?: number;
  teacherInstructions?: string;
  rawEvidenceText?: string;
}

export function extractSubConcepts(topic: string, rawEvidence?: string): string[] {
  const text = `${topic} ${rawEvidence || ''}`.toLowerCase();

  if (text.includes('scientifically') || text.includes('scientific') || text.includes('thinking and working')) {
    return [
      'Observing & Asking Questions',
      'Formulating Predictions & Hypotheses',
      'Designing Fair Tests & Controlling Variables',
      'Measuring & Recording Experimental Data',
      'Drawing Evidence-Based Conclusions',
    ];
  }
  if (text.includes('water cycle') || text.includes('rain') || text.includes('evaporation')) {
    return [
      'Evaporation (Liquid water turning to vapor)',
      'Condensation (Vapor cooling into cloud droplets)',
      'Precipitation (Rainfall returning to ground)',
      'Collection & Runoff (Rivers and groundwater)',
      'Transpiration (Plant water loss)',
    ];
  }
  if (text.includes('fraction') || text.includes('math') || text.includes('ratio')) {
    return [
      'Identifying Numerators & Denominators',
      'Equivalent Fractions & Simplifying',
      'Adding & Subtracting Like Fractions',
      'Comparing Fractional Quantities',
      'Real-World Sharing & Word Problems',
    ];
  }

  const cleanedTopic = topic.trim();
  return [
    `Core Scientific Principles of ${cleanedTopic}`,
    `Direct Observation & Material Identification in ${cleanedTopic}`,
    `Practical Hands-on Procedure & Skill Execution`,
    `Data Recording, Pattern Analysis & Evidence Reasoning`,
    `Real-World Nigerian Applications & Problem Solving`,
  ];
}

// ===================================================================
// 1. LESSON PLANNING AGENT
// ===================================================================

export async function runLessonPlanningAgent(ai: GoogleGenAI | null, input: AgentInput): Promise<LessonPlanSection> {
  if (!ai) return fallbackLessonPlan(input);

  const subConcepts = extractSubConcepts(input.topic, input.rawEvidenceText);
  const gradeGuidance = getGradeRegisterGuidance(input.grade);

  const systemPrompt = `You are a Senior NERDC Curriculum Specialist for Nigerian Primary Schools.
Your task is to generate a structured, sub-concept grounded 5-step lesson plan aligned to NERDC standards.

GRADE LEVEL: ${input.grade}
SUBJECT: ${input.subject}
TOPIC: ${input.topic}
EXTRACTED SUB-CONCEPTS: ${JSON.stringify(subConcepts)}
DURATION: ${input.durationMinutes} minutes
PEDAGOGICAL GUIDANCE: ${gradeGuidance}
CURRICULUM EVIDENCE: ${input.rawEvidenceText || 'NERDC Standard Benchmark Verified'}

CRITICAL SCOPE & QUALITY CONSTRAINTS:
1. REJECT ANY OBJECTIVE THAT ONLY RESTATES THE TOPIC NAME AS A NOUN (e.g., REJECT "explain the key principles of ${input.topic}").
2. Behavioral Objectives MUST explicitly incorporate named sub-concepts across Bloom's Cognitive, Psychomotor, and Affective domains.
3. Every timed delivery step (Set Induction, Instruction, Guided Practice, Independent Practice, Closure) MUST explicitly reference at least one named sub-concept in teacher and pupil activities.
4. Use low-cost, locally available Nigerian classroom materials.

Return ONLY valid JSON matching this exact structure:
{
  "title": "Lesson Plan: ${input.topic}",
  "subject": "${input.subject}",
  "grade": "${input.grade}",
  "durationMinutes": ${input.durationMinutes},
  "behavioralObjectives": [
    "Cognitive: Pupils will identify and differentiate between ${subConcepts[0]} and ${subConcepts[1]} using specific evidence.",
    "Psychomotor: Pupils will perform ${subConcepts[2]} and record observations accurately in exercise books.",
    "Affective: Pupils will appreciate the importance of ${subConcepts[3]} in everyday Nigerian life."
  ],
  "materialsNeeded": ["Chalkboard", "Measuring containers", "Local bottle caps", "NERDC Science Textbook"],
  "deliverySteps": {
    "setInduction": { "duration": "5 mins", "teacherActivity": "...", "pupilActivity": "..." },
    "instruction": { "duration": "15 mins", "teacherActivity": "...", "pupilActivity": "..." },
    "guidedPractice": { "duration": "10 mins", "teacherActivity": "...", "pupilActivity": "..." },
    "independentPractice": { "duration": "7 mins", "teacherActivity": "...", "pupilActivity": "..." },
    "closure": { "duration": "3 mins", "teacherActivity": "...", "pupilActivity": "..." }
  }
}`;

  const rawText = await callGeminiSafely(ai, 'LessonPlanningAgent', systemPrompt, 0.2);
  if (!rawText) return fallbackLessonPlan(input);

  try {
    const rawJson = JSON.parse(rawText);
    const validated = LessonPlanZodSchema.parse(rawJson);

    return {
      title: validated.title,
      subject: input.subject,
      grade: input.grade,
      durationMinutes: input.durationMinutes,
      behavioralObjectives: validated.behavioralObjectives,
      materialsNeeded: validated.materialsNeeded,
      deliverySteps: validated.deliverySteps,
      status: 'needs_review',
    };
  } catch (err) {
    console.warn('[LessonPlanningAgent] Zod parsing failed, using fallback.');
    return fallbackLessonPlan(input);
  }
}

export function fallbackLessonPlan(input: AgentInput): LessonPlanSection {
  const sub = extractSubConcepts(input.topic, input.rawEvidenceText);

  return {
    title: `Lesson Plan: ${input.topic}`,
    subject: input.subject,
    grade: input.grade,
    durationMinutes: input.durationMinutes || 40,
    behavioralObjectives: [
      `Cognitive: By the end of the lesson, ${input.grade} pupils will explain and differentiate between ${sub[0]} and ${sub[1]} with concrete classroom evidence.`,
      `Psychomotor: Demonstrate ${sub[2]} using local materials and record observations accurately in exercise books.`,
      `Affective: Appreciate the practical value of ${sub[3] || sub[0]} when investigating real-life problems in their Nigerian community.`,
    ],
    materialsNeeded: [
      'Transparent plastic cups and ruler',
      'Local bottle caps / cork counters',
      'NERDC Approved Science Exercise Books',
      'Chalkboard and multi-colored chalk',
    ],
    deliverySteps: {
      setInduction: {
        duration: '5 mins',
        teacherActivity: `Teacher presents a short real-life scenario from a Lagos market, asking pupils to distinguish between ${sub[0]} and ${sub[1]}.`,
        pupilActivity: `Pupils observe carefully, raise hands to answer, and formulate initial questions about ${sub[0]}.`,
      },
      instruction: {
        duration: '15 mins',
        teacherActivity: `Teacher explains ${sub[1]} and ${sub[2]} on the chalkboard, demonstrating how to conduct a fair comparison without bias.`,
        pupilActivity: `Pupils read key vocabulary aloud from the board and copy step-by-step notes on ${sub[2]} into exercise books.`,
      },
      guidedPractice: {
        duration: '10 mins',
        teacherActivity: `Teacher places pupils into groups of 4 and guides them through a hands-on trial involving ${sub[2]} and ${sub[3]}.`,
        pupilActivity: `Pupils collaborate in pairs to measure, record measurements, and verify if their results match ${sub[1]}.`,
      },
      independentPractice: {
        duration: '7 mins',
        teacherActivity: `Teacher circulates the room assisting pupils who need guidance distinguishing ${sub[0]} from ${sub[1]}.`,
        pupilActivity: `Pupils solve 3 exercise book problems independently, categorizing examples of ${sub[3]} and ${sub[4] || sub[2]}.`,
      },
      closure: {
        duration: '3 mins',
        teacherActivity: `Teacher recaps how ${sub[0]} connects to ${sub[3]} and gives homework on home observations.`,
        pupilActivity: `Pupils recite core rules aloud as a class and record homework assignment in workbooks.`,
      },
    },
    status: 'needs_review',
  };
}

// ===================================================================
// 2. TEACHER NOTES AGENT
// ===================================================================

export async function runTeacherNotesAgent(ai: GoogleGenAI | null, input: AgentInput): Promise<TeacherNotesSection> {
  if (!ai) return fallbackTeacherNotes(input);

  const sub = extractSubConcepts(input.topic, input.rawEvidenceText);

  const systemPrompt = `You are a Senior Science & Mathematics Pedagogy Specialist for Nigerian Primary Schools.
Generate comprehensive Teacher Notes for a ${input.grade} ${input.subject} lesson on "${input.topic}".

EXTRACTED SUB-CONCEPTS: ${JSON.stringify(sub)}

STRICT REQUIREMENTS:
1. Pedagogical Background: A detailed, professional 1-2 paragraph background explaining the underlying science/math principles behind ${sub.join(', ')}.
2. Common Misconceptions: AT LEAST 3 MISCONCEPTIONS. Each MUST name a specific, concrete confusion tied directly to sub-concepts (e.g. "Pupils think an observation and a prediction/guess are the same thing"). REJECT generic statements like "confuses X with everyday terms".
3. Teaching Tips: 3+ practical classroom management and differentiation tips.
4. Local Nigerian Analogies: AT LEAST 2 GROUNDED NIGERIAN ANALOGIES specific to the sub-concepts (e.g., market garri seller using standard tins for fair measurement, observing palm oil separating from pepper soup).

Return ONLY valid JSON matching:
{
  "pedagogicalBackground": "...",
  "commonMisconceptions": [
    { "misconception": "...", "correctionStrategy": "..." },
    { "misconception": "...", "correctionStrategy": "..." },
    { "misconception": "...", "correctionStrategy": "..." }
  ],
  "teachingTips": ["...", "...", "..."],
  "localNigerianAnalogies": ["...", "..."]
}`;

  const rawText = await callGeminiSafely(ai, 'TeacherNotesAgent', systemPrompt, 0.2);
  if (!rawText) return fallbackTeacherNotes(input);

  try {
    const rawJson = JSON.parse(rawText);
    const validated = TeacherNotesZodSchema.parse(rawJson);

    return {
      pedagogicalBackground: validated.pedagogicalBackground,
      commonMisconceptions: validated.commonMisconceptions,
      teachingTips: validated.teachingTips,
      localNigerianAnalogies: validated.localNigerianAnalogies,
      status: 'needs_review',
    };
  } catch (err) {
    console.warn('[TeacherNotesAgent] Zod parsing failed, using fallback.');
    return fallbackTeacherNotes(input);
  }
}

export function fallbackTeacherNotes(input: AgentInput): TeacherNotesSection {
  const sub = extractSubConcepts(input.topic, input.rawEvidenceText);

  return {
    pedagogicalBackground: `Mastering ${input.topic} in ${input.grade} requires building systematic scientific reasoning across key sub-concepts: ${sub.join(', ')}. Primary school pupils naturally make informal observations, but often lack formal frameworks to separate direct empirical evidence (${sub[0]}) from prior expectations or guesses (${sub[1]}). Effective instruction relies on active classroom experiments where pupils manipulate physical variables, record quantitative measurements, and draw logical conclusions rooted in reproducible evidence.`,
    commonMisconceptions: [
      {
        misconception: `Pupils believe that making an observation (${sub[0]}) is the same thing as making a guess or prediction (${sub[1]}).`,
        correctionStrategy: `Explicitly teach that an observation uses direct physical senses (seeing, measuring, counting), whereas a prediction is a reasoned forecast of what will happen next based on observed patterns.`,
      },
      {
        misconception: `Pupils assume a experiment or investigation is a "fair test" (${sub[2]}) even if multiple variables change at the same time.`,
        correctionStrategy: `Demonstrate a flawed test where two things change simultaneously (e.g. changing both container size and liquid amount), then guide pupils to see why only one variable may be altered at a time.`,
      },
      {
        misconception: `Pupils believe that if an experiment result does not match their initial prediction, the experiment "failed" or was incorrect.`,
        correctionStrategy: `Emphasize that unexpected data (${sub[3]}) is valuable scientific evidence. Teach pupils to trust recorded measurements rather than changing their records to fit expectations.`,
      },
    ],
    teachingTips: [
      'Use a 3-column table on the chalkboard labeled "What We Observed", "What We Measured", and "What We Concluded".',
      'Implement structured talk partners where one pupil acts as the "Recorder" while the other acts as the "Investigator".',
      'Provide mother-tongue scaffolding in Yoruba, Igbo, or Hausa for key terms during set induction to build confidence.',
    ],
    localNigerianAnalogies: [
      `Comparing Fair Testing (${sub[2]}) to buying garri at a local Nigerian market: a fair vendor uses the exact same standardized tin cup (controlled variable) so every customer gets a fair and accurate volume.`,
      `Comparing Observation (${sub[0]}) to checking a pot of boiling soup: looking at steam rising and oil separating on top gives direct visual and sensory facts before making any assumptions about taste.`,
    ],
    status: 'needs_review',
  };
}

// ===================================================================
// 3. STUDENT / LEARNER NOTES AGENT
// ===================================================================

export async function runLearnerNotesAgent(ai: GoogleGenAI | null, input: AgentInput): Promise<LearnerNotesSection> {
  if (!ai) return fallbackLearnerNotes(input);

  const sub = extractSubConcepts(input.topic, input.rawEvidenceText);
  const registerNote = getLearnerRegisterPrompt(input.grade);

  const systemPrompt = `You are a Primary School Study Note Author writing for Nigerian pupils.
Generate pupil-facing Learner Notes for a ${input.grade} pupil on "${input.topic}".

EXTRACTED SUB-CONCEPTS: ${JSON.stringify(sub)}
REGISTER GUIDANCE: ${registerNote}

CRITICAL REQUIREMENTS:
1. Summary Text: A comprehensive 4-6 sentence paragraph that clearly explains the sub-concepts in simple, grade-appropriate language.
2. Key Vocabulary: 5 TO 8 KEY VOCABULARY TERMS. Each term must be sub-concept specific (e.g. observation, prediction, fair test, hypothesis, evidence, variable, measurement, conclusion) with definition, phonetic guide, and a concrete example sentence.
3. Core Takeaways: 3-4 clear bullet points for pupil review.

Return ONLY valid JSON matching:
{
  "summaryText": "...",
  "keyVocabulary": [
    { "term": "...", "definition": "...", "phonetic": "...", "example": "..." },
    { "term": "...", "definition": "...", "phonetic": "...", "example": "..." },
    { "term": "...", "definition": "...", "phonetic": "...", "example": "..." },
    { "term": "...", "definition": "...", "phonetic": "...", "example": "..." },
    { "term": "...", "definition": "...", "phonetic": "...", "example": "..." }
  ],
  "coreTakeaways": ["...", "...", "..."]
}`;

  const rawText = await callGeminiSafely(ai, 'LearnerNotesAgent', systemPrompt, 0.2);
  if (!rawText) return fallbackLearnerNotes(input);

  try {
    const rawJson = JSON.parse(rawText);
    const validated = LearnerNotesZodSchema.parse(rawJson);

    return {
      summaryText: validated.summaryText,
      keyVocabulary: validated.keyVocabulary,
      coreTakeaways: validated.coreTakeaways,
      status: 'needs_review',
    };
  } catch (err) {
    console.warn('[LearnerNotesAgent] Zod parsing failed, using fallback.');
    return fallbackLearnerNotes(input);
  }
}

export function fallbackLearnerNotes(input: AgentInput): LearnerNotesSection {
  const sub = extractSubConcepts(input.topic, input.rawEvidenceText);

  return {
    summaryText: `Welcome to your study notes on ${input.topic}! In today's lesson, we explored how scientists investigate the world around us through ${sub[0]} and ${sub[1]}. When we observe, we use our senses to gather real facts, while a prediction is a smart guess about what will happen next. To make sure our test is fair, we only change one variable at a time while keeping everything else equal. By measuring carefully and recording our results, we can draw strong conclusions based on actual evidence.`,
    keyVocabulary: [
      {
        term: 'Observation',
        definition: 'Gathering facts carefully using your physical senses or measuring tools.',
        phonetic: '/ob-zur-VAY-shun/',
        example: 'Tobi made an observation that water evaporated faster in the hot Nigerian sun.',
      },
      {
        term: 'Prediction',
        definition: 'A sensible guess about what will happen based on what you already observed.',
        phonetic: '/prih-DIK-shun/',
        example: 'Amina made a prediction that the heavier cup would sink first.',
      },
      {
        term: 'Fair Test',
        definition: 'An experiment where only one variable is changed so the test is equal and honest.',
        phonetic: '/fair test/',
        example: 'We ensured a fair test by using the exact same cup size for both liquids.',
      },
      {
        term: 'Evidence',
        definition: 'Recorded facts or measurements that prove whether an idea is true or false.',
        phonetic: '/EV-ih-dens/',
        example: 'Our notebook measurements provided clear evidence that heat speeds up drying.',
      },
      {
        term: 'Conclusion',
        definition: 'The final decision reached after analyzing all experimental evidence.',
        phonetic: '/kun-KLOO-zhun/',
        example: 'Our class conclusion was that clean water boils at 100 degrees Celsius.',
      },
    ],
    coreTakeaways: [
      'Observations are physical facts collected with our senses or instruments.',
      'A fair test changes only one variable at a time.',
      'Scientists always rely on recorded evidence to form final conclusions.',
    ],
    status: 'needs_review',
  };
}

// ===================================================================
// 4. HANDS-ON ACTIVITY AGENT
// ===================================================================

export async function runHandsOnActivityAgent(ai: GoogleGenAI | null, input: AgentInput): Promise<ActivitySection> {
  if (!ai) return fallbackActivity(input);

  const sub = extractSubConcepts(input.topic, input.rawEvidenceText);

  const systemPrompt = `You are an Experiential Learning & Hands-On Science/Math Activity Designer for Nigerian primary schools.
Design a low-cost, highly engaging classroom activity for ${input.grade} ${input.subject}: "${input.topic}".

SUB-CONCEPTS TO ENGAGE: ${JSON.stringify(sub)}

REQUIREMENTS:
1. Activity Name: Catchy, descriptive title.
2. Grouping: Group size (e.g., Pairs of 2, Small Groups of 4).
3. Local Materials: 4+ low-cost/free local Nigerian materials (e.g., bottle caps, plastic bottles, cassava sticks, ruler, water, seeds).
4. Step-by-Step Instructions: 4-5 clear, structured steps emphasizing active pupil participation and skill execution.
5. Expected Outcome: Clear learning outcome tied to the sub-concepts.

Return ONLY valid JSON matching:
{
  "activityName": "...",
  "grouping": "...",
  "localMaterials": ["...", "...", "...", "..."],
  "stepByStepInstructions": ["...", "...", "...", "..."],
  "expectedOutcome": "..."
}`;

  const rawText = await callGeminiSafely(ai, 'HandsOnActivityAgent', systemPrompt, 0.2);
  if (!rawText) return fallbackActivity(input);

  try {
    const rawJson = JSON.parse(rawText);
    const validated = ActivityZodSchema.parse(rawJson);

    return {
      activityName: validated.activityName,
      grouping: validated.grouping,
      localMaterials: validated.localMaterials,
      stepByStepInstructions: validated.stepByStepInstructions,
      expectedOutcome: validated.expectedOutcome,
      status: 'needs_review',
    };
  } catch (err) {
    console.warn('[HandsOnActivityAgent] Zod parsing failed, using fallback.');
    return fallbackActivity(input);
  }
}

export function fallbackActivity(input: AgentInput): ActivitySection {
  const sub = extractSubConcepts(input.topic, input.rawEvidenceText);

  return {
    activityName: `Classroom Hands-On Investigation: ${sub[0]} & ${sub[2]}`,
    grouping: 'Pairs of 2 Pupils',
    localMaterials: [
      '2 identical clear plastic water bottles',
      'Local bottle caps / cork counters',
      '15cm plastic ruler or measuring tape',
      'Clean water and sand',
    ],
    stepByStepInstructions: [
      `In your pair, assign one pupil as 'Investigator' and one pupil as 'Data Recorder'.`,
      `Set up your two plastic bottles side-by-side to conduct a fair test (${sub[2]}). Keep bottle size and water volume identical.`,
      `Change only ONE variable (add 2 spoons of sand to bottle B while keeping bottle A as clean water).`,
      `Observe carefully (${sub[0]}), record liquid levels in your exercise book, and predict which bottle clears faster (${sub[1]}).`,
      `Discuss your findings with your group and state your final conclusion (${sub[4] || sub[3]}).`,
    ],
    expectedOutcome: `Pupils successfully execute a fair test, record empirical measurements, and distinguish between direct observations and conclusions.`,
    status: 'needs_review',
  };
}

// ===================================================================
// 5. ASSESSMENT QUIZ AGENT
// ===================================================================

export async function runQuizAssessmentAgent(ai: GoogleGenAI | null, input: AgentInput): Promise<QuizSection> {
  if (!ai) return fallbackQuiz(input);

  const sub = extractSubConcepts(input.topic, input.rawEvidenceText);
  const codePrefix = `NERDC-${input.subject.slice(0, 3).toUpperCase()}-${input.grade.replace(' ', '')}`;

  const systemPrompt = `You are a Primary School Assessment & Examination Specialist.
Generate a 5-question multiple-choice quiz for ${input.grade} ${input.subject}: "${input.topic}".

EXTRACTED SUB-CONCEPTS: ${JSON.stringify(sub)}

STRICT ASSESSMENT QUALITY RULES:
1. Exactly 5 multiple-choice questions with 4 options each (A, B, C, D).
2. ABSOLUTELY NO ABSURD OR JOKE DISTRACTORS (e.g. NEVER use "Playing football", "Flying airplanes", "Eating zobo"). Every distractor MUST be a plausible pupil error or common misconception related to the sub-concepts!
3. Each question MUST test a distinct sub-concept from ${JSON.stringify(sub)}.
4. Explanations MUST provide real pedagogical justifications referencing the specific sub-concept tested.
5. Reference code format: ${codePrefix}-Q01 to Q05.

Return ONLY valid JSON matching:
{
  "questions": [
    {
      "id": 1,
      "questionText": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswer": "A. ...",
      "explanation": "..."
    }
  ]
}`;

  const rawText = await callGeminiSafely(ai, 'QuizAssessmentAgent', systemPrompt, 0.2);
  if (!rawText) return fallbackQuiz(input);

  try {
    const rawJson = JSON.parse(rawText);
    const validated = QuizZodSchema.parse(rawJson);

    return {
      questions: validated.questions.map((q, idx) => ({
        id: idx + 1,
        questionText: q.questionText,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      })),
      status: 'needs_review',
    };
  } catch (err) {
    console.warn('[QuizAssessmentAgent] Zod parsing failed, using fallback.');
    return fallbackQuiz(input);
  }
}

export function fallbackQuiz(input: AgentInput): QuizSection {
  const sub = extractSubConcepts(input.topic, input.rawEvidenceText);
  const codePrefix = `NERDC-${input.subject.slice(0, 3).toUpperCase()}-${input.grade.replace(' ', '')}`;

  return {
    questions: [
      {
        id: 1,
        questionText: `[${codePrefix}-Q01] What is the key difference between a scientific observation and a prediction?`,
        options: [
          'A. An observation uses physical senses/facts, while a prediction forecasts a future result based on patterns.',
          'B. An observation is a wild guess, while a prediction is measured with a ruler.',
          'C. An observation is done only in books, while a prediction is done at night.',
          'D. Both observation and prediction mean guessing without looking at evidence.',
        ],
        correctAnswer:
          'A. An observation uses physical senses/facts, while a prediction forecasts a future result based on patterns.',
        explanation:
          'Observations rely on direct empirical evidence gathered through senses or instruments, whereas predictions forecast expected outcomes using observed trends.',
      },
      {
        id: 2,
        questionText: `[${codePrefix}-Q02] When conducting a "fair test" in a classroom investigation, how many variables should be changed at one time?`,
        options: [
          'A. Only ONE variable at a time, keeping all other conditions identical',
          'B. At least THREE variables at the same time to speed up testing',
          'C. All variables simultaneously so every bottle is different',
          'D. Zero variables, as variables cannot be controlled in a classroom',
        ],
        correctAnswer: 'A. Only ONE variable at a time, keeping all other conditions identical',
        explanation:
          'In a fair test, altering only one independent variable ensures that any observed change in the outcome is caused solely by that variable.',
      },
      {
        id: 3,
        questionText: `[${codePrefix}-Q03] Why must primary pupils record exact measurements in their science exercise books during an experiment?`,
        options: [
          'A. To provide trustworthy evidence that can be reviewed and verified',
          'B. To memorize textbook pages without looking at physical objects',
          'C. Because unrecorded measurements automatically turn into predictions',
          'D. To ensure no other pupil can read their science notes',
        ],
        correctAnswer: 'A. To provide trustworthy evidence that can be reviewed and verified',
        explanation:
          'Accurate data recording transforms personal observations into verifiable scientific evidence that supports logical conclusions.',
      },
      {
        id: 4,
        questionText: `[${codePrefix}-Q04] What should a pupil do if their experimental result does not match their initial prediction?`,
        options: [
          'A. Accept the measured evidence and investigate why the result occurred',
          'B. Erase the recorded measurements and rewrite them to match the prediction',
          'C. Throw away the materials and assume the experiment failed',
          'D. Ignore the recorded data and pretend the prediction was correct',
        ],
        correctAnswer: 'A. Accept the measured evidence and investigate why the result occurred',
        explanation:
          'Science values empirical evidence over initial assumptions; unexpected results reveal new insights and guide deeper questioning.',
      },
      {
        id: 5,
        questionText: `[${codePrefix}-Q05] Which of the following best demonstrates drawing an evidence-based conclusion?`,
        options: [
          'A. Stating that water boils faster when heated based on recorded thermometer temperatures',
          'B. Deciding a plant grew taller because it looked happier in the morning',
          'C. Claiming a test was fair without keeping any variables constant',
          'D. Choosing an answer based on what a friend guessed in class',
        ],
        correctAnswer: 'A. Stating that water boils faster when heated based on recorded thermometer temperatures',
        explanation:
          'A valid scientific conclusion directly links observed outcomes to quantitative data recorded during systematic testing.',
      },
    ],
    status: 'needs_review',
  };
}

// ===================================================================
// 6. WORKSHEET & 4-TIER RUBRIC AGENT
// ===================================================================

export async function runWorksheetAgent(ai: GoogleGenAI | null, input: AgentInput): Promise<WorksheetSection> {
  if (!ai) return fallbackWorksheet(input);

  const sub = extractSubConcepts(input.topic, input.rawEvidenceText);

  const systemPrompt = `You are a Primary School Instructional Designer and Assessment Rubric Author.
Generate a structured pupil exercise worksheet and a 4-tier rubric for ${input.grade} ${input.subject}: "${input.topic}".

EXTRACTED SUB-CONCEPTS: ${JSON.stringify(sub)}

STRICT REQUIREMENTS:
1. Worksheet Title: Clean, topic-specific title.
2. Instructions: Clear pupil instructions for exercise book completion.
3. Exercises: 5 TO 6 STRUCTURED EXERCISES. Each exercise MUST target a specific sub-concept (e.g. Exercise 1: Identifying Observations vs Predictions; Exercise 2: Designing a Fair Test; Exercise 3: Measuring & Recording Data). At least 2 exercises must require skill application!
4. Rubric: 2-3 skill-specific criteria evaluating performance across 4 distinct levels:
   - level1NeedsImp (Below Standard / Beginning)
   - level2Fair (Developing / Fair)
   - level3Good (Meets Standard / Competent)
   - level4Excellent (Exceeds Standard / Advanced)
   Rubric descriptions MUST detail actual skill performance differences, NOT generic "good/bad" phrasing!

Return ONLY valid JSON matching:
{
  "worksheetTitle": "...",
  "instructions": "...",
  "exercises": ["1. ...", "2. ...", "3. ...", "4. ...", "5. ..."],
  "rubric": [
    {
      "criteria": "...",
      "level1NeedsImp": "...",
      "level2Fair": "...",
      "level3Good": "...",
      "level4Excellent": "..."
    }
  ]
}`;

  const rawText = await callGeminiSafely(ai, 'WorksheetAgent', systemPrompt, 0.2);
  if (!rawText) return fallbackWorksheet(input);

  try {
    const rawJson = JSON.parse(rawText);
    const validated = WorksheetZodSchema.parse(rawJson);

    return {
      worksheetTitle: validated.worksheetTitle,
      instructions: validated.instructions,
      exercises: validated.exercises,
      rubric: validated.rubric,
      status: 'needs_review',
    };
  } catch (err) {
    console.warn('[WorksheetAgent] Zod parsing failed, using fallback.');
    return fallbackWorksheet(input);
  }
}

export function fallbackWorksheet(input: AgentInput): WorksheetSection {
  const sub = extractSubConcepts(input.topic, input.rawEvidenceText);

  return {
    worksheetTitle: `Classroom Practice Worksheet: ${input.topic}`,
    instructions:
      'Complete all 5 exercises in your science workbook. Read each prompt carefully and support your answers with clear evidence.',
    exercises: [
      `Exercise 1 (Observing vs Predicting): Look at the scenario described by your teacher. Write down one direct physical Observation (${sub[0]}) and one logical Prediction (${sub[1]}).`,
      `Exercise 2 (Fair Testing Application): Imagine you want to test which type of cup keeps drinking water coolest. Identify the ONE variable you will change and TWO variables you must keep constant to ensure a fair test (${sub[2]}).`,
      `Exercise 3 (Data Recording): Draw a 2-column table in your workbook. Record 3 measurements of liquid height using your plastic ruler and label the units correctly (${sub[3]}).`,
      `Exercise 4 (Evidence Reasoning): Read the recorded temperature data provided in class. Write 2 sentences explaining if the evidence supports or contradicts your initial prediction.`,
      `Exercise 5 (Community Connection): Describe one real-world situation in your local Nigerian community where using ${sub[0]} or ${sub[2]} helps solve a everyday problem.`,
    ],
    rubric: [
      {
        criteria: 'Observation vs Prediction Distinction',
        level1NeedsImp: 'Confuses physical facts with guesses; unable to differentiate observation from prediction.',
        level2Fair: 'Identifies an observation with teacher prompts but struggles to formulate a distinct prediction.',
        level3Good: 'Clearly distinguishes between empirical observations and logical predictions with minimal guidance.',
        level4Excellent:
          'Expertly formulates precise, evidence-backed observations and detailed predictions with clear reasoning.',
      },
      {
        criteria: 'Fair Test Variable Control',
        level1NeedsImp: 'Alters multiple variables simultaneously; does not recognize the need for controlled conditions.',
        level2Fair: 'Identifies the tested variable but forgets to hold secondary environmental conditions constant.',
        level3Good: 'Correctly isolates one independent variable and maintains basic controlled variables.',
        level4Excellent:
          'Demonstrates complete mastery of variable isolation, identifying subtle confounding factors and controls.',
      },
      {
        criteria: 'Data Recording & Evidence Reasoning',
        level1NeedsImp: 'Fails to record measurements or presents unorganized, unlabeled numbers.',
        level2Fair: 'Records basic numbers but omits measurement units or column labels.',
        level3Good: 'Constructs a neat table with clear labels, accurate units, and logical conclusions.',
        level4Excellent:
          'Produces pristine tabular data with units, error checks, and sophisticated evidence-based justifications.',
      },
    ],
    status: 'needs_review',
  };
}

// ===================================================================
// 7. MULTILINGUAL TRANSLATION AGENT
// ===================================================================

export async function runMultilingualTranslationAgent(
  ai: GoogleGenAI | null,
  textToTranslate: string,
  targetLang: LanguageCode,
  coreTakeaways: string[]
): Promise<{ summaryText: string; coreTakeaways: string[] }> {
  if (targetLang === 'en' || !textToTranslate) {
    return { summaryText: textToTranslate, coreTakeaways };
  }

  const langNames: Record<LanguageCode, string> = {
    en: 'English',
    yo: 'Yoruba',
    ig: 'Igbo',
    ha: 'Hausa',
    pcm: 'Nigerian Pidgin',
  };

  const targetName = langNames[targetLang] || 'Yoruba';

  if (!ai) {
    return fallbackTranslation(textToTranslate, targetLang, coreTakeaways);
  }

  const systemPrompt = `You are an expert Educational Translator for Nigerian languages (${targetName}).
Translate the following primary school lesson summary and core takeaways into pedagogical, natural ${targetName}.

CRITICAL PRESERVATION RULES:
1. Preserve all numbers (e.g. 1, 2, 3, 50%, 100%) exactly as written!
2. Prioritize clarity for primary pupils over direct dictionary translation.
3. Return valid JSON matching:
{
  "summaryText": "Translated text in ${targetName}...",
  "coreTakeaways": ["Translated bullet 1...", "Translated bullet 2..."]
}

SUMMARY TO TRANSLATE:
${textToTranslate}

CORE TAKEAWAYS:
${JSON.stringify(coreTakeaways)}`;

  const rawText = await callGeminiSafely(ai, `${targetName}TranslationAgent`, systemPrompt, 0.2);
  if (!rawText) {
    return fallbackTranslation(textToTranslate, targetLang, coreTakeaways);
  }

  try {
    const rawJson = JSON.parse(rawText);
    const validated = TranslationZodSchema.parse(rawJson);

    return {
      summaryText: validated.summaryText,
      coreTakeaways: validated.coreTakeaways || coreTakeaways,
    };
  } catch (err) {
    console.warn(`[MultilingualTranslationAgent] Zod parsing failed for ${targetLang}, using fallback.`);
    return fallbackTranslation(textToTranslate, targetLang, coreTakeaways);
  }
}

export function fallbackTranslation(
  textToTranslate: string,
  targetLang: LanguageCode,
  coreTakeaways: string[]
): { summaryText: string; coreTakeaways: string[] } {
  const prefixes: Record<LanguageCode, string> = {
    en: '',
    yo: '[Asoye ni Ede Yoruba]: ',
    ig: '[Nkowa na Asusu Igbo]: ',
    ha: '[Fassarar Harshen Hausa]: ',
    pcm: '[Pidgin English Version]: ',
  };

  const prefix = prefixes[targetLang] || '';
  return {
    summaryText: `${prefix}${textToTranslate}`,
    coreTakeaways: coreTakeaways.map((t) => `${prefix}${t}`),
  };
}

// ===================================================================
// HELPER FUNCTIONS FOR GRADE REGISTER & PEDAGOGY
// ===================================================================

function getGradeRegisterGuidance(grade: GradeLevel): string {
  switch (grade) {
    case 'Primary 1':
    case 'Primary 2':
      return 'LOWER PRIMARY (Grades 1-2): Short sentences (under 8 words), basic vocabulary, concrete storytelling, immediate physical observation, concrete counting objects.';
    case 'Primary 3':
    case 'Primary 4':
      return 'MIDDLE PRIMARY (Grades 3-4): Clear structured sentences (10-12 words), introduce domain terms with immediate definition, small group guided work, simple diagrams.';
    case 'Primary 5':
    case 'Primary 6':
      return 'UPPER PRIMARY (Grades 5-6): Conceptual explanations, analytical questions, multi-step problem solving, structured group discussions, formal exercise book entries.';
    default:
      return 'Standard Primary School Pedagogy.';
  }
}

function getLearnerRegisterPrompt(grade: GradeLevel): string {
  switch (grade) {
    case 'Primary 1':
    case 'Primary 2':
      return 'Write for a 6-7 year old child. Use very short, joyful sentences. Use simple words. Limit summary to 3 short sentences.';
    case 'Primary 3':
    case 'Primary 4':
      return 'Write for an 8-9 year old child. Use clear, engaging language with 10-12 words per sentence. Include clear examples from daily Nigerian life.';
    case 'Primary 5':
    case 'Primary 6':
      return 'Write for a 10-11 year old pupil preparing for Common Entrance examinations. Use well-structured paragraphs and precise subject terms.';
    default:
      return 'Write clearly for a primary school student.';
  }
}
