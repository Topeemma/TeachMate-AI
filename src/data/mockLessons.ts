import { FullLessonPackage } from '../types';

export const MOCK_LESSON_WATER_CYCLE: FullLessonPackage = {
  id: 'mock-water-cycle-p4',
  createdAt: new Date().toISOString(),
  subject: 'Basic Science & Technology',
  grade: 'Primary 4',
  topic: 'The Water Cycle and Rainfall in Nigeria',
  durationMinutes: 40,
  extractedEvidence: 'Primary 4 NERDC Science standard on water evaporation, condensation, and precipitation during Nigerian rainy season.',
  activeLanguage: 'en',
  lessonPlan: {
    title: 'Lesson Plan: The Water Cycle and Rainfall',
    subject: 'Basic Science & Technology',
    grade: 'Primary 4',
    durationMinutes: 40,
    behavioralObjectives: [
      'Define the 3 primary stages of the water cycle: Evaporation, Condensation, and Precipitation.',
      'Explain how heat from the sun causes water from River Niger and local streams to evaporate.',
      'Demonstrate water condensation using a chilled tin cup experiment in class.',
    ],
    materialsNeeded: [
      'Transparent plastic cup with warm water',
      'Ice cubes or chilled tin cup',
      'Dry handkerchief',
      'Diagram of the Nigerian water cycle',
    ],
    deliverySteps: {
      setInduction: {
        duration: '5 mins',
        teacherActivity: 'Ask pupils what happens to rain puddles outside the classroom after a hot sunny afternoon.',
        pupilActivity: 'Pupils raise hands and share that the sun dries up water puddles.',
      },
      instruction: {
        duration: '15 mins',
        teacherActivity: 'Draw the 3-step water cycle diagram on the chalkboard. Explain Evaporation, Condensation, and Rain.',
        pupilActivity: 'Pupils copy the diagram into their science exercise books and label cloud formations.',
      },
      guidedPractice: {
        duration: '10 mins',
        teacherActivity: 'Guide pupils in pouring warm water into a clear plastic cup and placing a cold lid on top.',
        pupilActivity: 'Pupils observe tiny water droplets forming on the lid (Condensation).',
      },
      independentPractice: {
        duration: '7 mins',
        teacherActivity: 'Distribute quick 3-item fill-in-the-blank assessment on the stages of the water cycle.',
        pupilActivity: 'Pupils complete answers individually in exercise books.',
      },
      closure: {
        duration: '3 mins',
        teacherActivity: 'Summarize key terms and remind pupils why rain is essential for cassava and maize farming.',
        pupilActivity: 'Pupils recite the 3 water cycle stages aloud as a class.',
      },
    },
    status: 'approved',
  },
  teacherNotes: {
    pedagogicalBackground:
      'The water cycle describes the continuous movement of water on, above, and below the surface of the Earth. Primary 4 pupils benefit from connecting evaporation to clothes drying on a line on sunny days.',
    commonMisconceptions: [
      {
        misconception: 'Rain falls because clouds get heavy with dark paint.',
        correctionStrategy: 'Explain that clouds are made of tiny water droplets that join together until heavy enough to fall as rain.',
      },
      {
        misconception: 'Water disappears completely when it dries up from the ground.',
        correctionStrategy: 'Clarify that liquid water turns into invisible water vapor floating in the atmosphere.',
      },
    ],
    teachingTips: [
      'Use local Yoruba phrase "Ìyípo Omi" or Igbo "Mgbe Omi" for mother-tongue scaffolding.',
      'Connect rainfall to agricultural seasons across northern and southern Nigeria.',
    ],
    localNigerianAnalogies: [
      'Compare evaporation to steam rising from a hot pot of boiling pepper soup.',
      'Compare clouds storing rain to a saturated bath sponge holding water until squeezed.',
    ],
    status: 'approved',
  },
  learnerNotes: {
    summaryText:
      'The water cycle is how water moves between the earth and the sky! Heat from the sun turns water into vapor (Evaporation). When vapor cools high up, it forms clouds (Condensation). When clouds get heavy, water falls as rain (Precipitation).',
    keyVocabulary: [
      { term: 'Evaporation', definition: 'When heat turns liquid water into invisible gas or vapor.' },
      { term: 'Condensation', definition: 'When cool air turns water vapor back into water droplets and clouds.' },
      { term: 'Precipitation', definition: 'Rainfall, hail, or dew falling from clouds to the ground.' },
    ],
    coreTakeaways: [
      'The sun powers the water cycle.',
      'Clouds are formed through condensation.',
      'Rainfall replenishes Nigerian rivers, wells, and farmland.',
    ],
    status: 'approved',
  },
  activity: {
    activityName: 'Water Cycle in a Cup Science Experiment',
    grouping: 'Pairs of 2 Pupils',
    localMaterials: ['Clear plastic cup', 'Warm water', 'Metal spoon or tin lid', 'Ice cubes'],
    stepByStepInstructions: [
      'Pour warm water halfway into a clear plastic cup.',
      'Place a cold metal lid with an ice cube over the mouth of the cup.',
      'Watch water droplets collect under the lid and drip back down like rain.',
    ],
    expectedOutcome: 'Pupils witness condensation and simulated precipitation firsthand.',
    status: 'approved',
  },
  quiz: {
    questions: [
      {
        id: 1,
        questionText: 'What stage of the water cycle happens when the sun heats up water in River Niger?',
        options: ['A. Evaporation', 'B. Freezing', 'C. Melting', 'D. Digestion'],
        correctAnswer: 'A. Evaporation',
        explanation: 'Heat from sunlight turns surface water into invisible water vapor.',
      },
      {
        id: 2,
        questionText: 'What forms when cool air turns water vapor back into liquid droplets in the sky?',
        options: ['A. Clouds', 'B. Stones', 'C. Trees', 'D. Dust'],
        correctAnswer: 'A. Clouds',
        explanation: 'Condensation creates clouds made of microscopic water droplets.',
      },
      {
        id: 3,
        questionText: 'Why is rainfall vital for farmers in Nigeria?',
        options: [
          'A. It makes crops grow in the soil',
          'B. It paints the houses blue',
          'C. It stops the sun forever',
          'D. It changes river water to zobo',
        ],
        correctAnswer: 'A. It makes crops grow in the soil',
        explanation: 'Rainfall provides essential moisture for farming cassava, yam, and vegetables.',
      },
    ],
    status: 'approved',
  },
  worksheet: {
    worksheetTitle: 'Primary 4 Science Worksheet: The Water Cycle',
    instructions: 'Complete all questions in your science workbook.',
    exercises: [
      'Draw the water cycle showing the sun, river, clouds, and falling rain.',
      'Write down 2 examples of evaporation you observe at home.',
      'Explain in one sentence why clouds produce rainfall.',
    ],
    rubric: [
      {
        criteria: 'Diagram Accuracy',
        level1NeedsImp: 'Unlabeled drawing',
        level2Fair: 'Labels 1 stage correctly',
        level3Good: 'Labels all 3 stages accurately',
        level4Excellent: 'Detailed drawing with neat arrows and local Nigerian context',
      },
    ],
    status: 'approved',
  },
  slideDeck: {
    deckTitle: 'The Water Cycle & Rainfall in Nigeria',
    slides: [
      {
        slideNumber: 1,
        title: 'Welcome to Basic Science: The Water Cycle',
        bulletPoints: ['Where does rain come from?', 'How does sunlight dry up puddles outside?'],
        speakerNotes: 'Greet Primary 4 pupils. Ask who noticed rain clouds this morning.',
        imagePrompt: 'Vivid vector illustration of Nigerian primary pupils looking at rain clouds in a sunlit school yard.',
      },
      {
        slideNumber: 2,
        title: 'Step 1: Evaporation (The Sun Heating Water)',
        bulletPoints: ['Sun heats River Niger and local streams', 'Liquid water becomes invisible vapor'],
        speakerNotes: 'Connect evaporation to wet clothes drying on a laundry line.',
        imagePrompt: 'Diagram showing warm sunlight turning river water into rising vapor particles.',
      },
      {
        slideNumber: 3,
        title: 'Step 2 & 3: Condensation and Rain',
        bulletPoints: ['Cool air creates clouds', 'Heavy clouds release rain (Precipitation)'],
        speakerNotes: 'Show the cup experiment to illustrate droplets dripping from the lid.',
        imagePrompt: 'Colorful educational diagram of clouds producing rain over green Nigerian farmland.',
      },
    ],
    status: 'approved',
  },
  videoResources: {
    pixverseStatus: 'generated',
    pixverse15sVideoUrl: '/api/sample-video-stream?topic=The%20Water%20Cycle%20and%20Rainfall%20in%20Nigeria',
    videoPromptUsed: '15-second 3D animation showing sunlight evaporating water into clouds and raining over West Africa.',
    youtubeLinks: [
      {
        title: 'Water Cycle Explanation for Kids',
        url: 'https://www.youtube.com/results?search_query=Water+Cycle+Primary+School+Science',
        duration: '3:30',
        recommendedTimestamp: '0:30 - 2:45',
        relevance: 'Clear animation showing evaporation, condensation, and rain.',
      },
    ],
    status: 'approved',
  },
  audioPodcast: {
    title: 'TeachMate AI Science Podcast: The Water Cycle Story',
    dialogueScript: [
      {
        speaker: 'Voice A (Educator)',
        line: 'This is an AI-generated educational audio discussion, not a real recording. Today we are talking about where rain comes from.',
      },
      {
        speaker: 'Voice B (Learner)',
        line: 'Does rain come from big tanks in the sky or somewhere else?',
      },
      {
        speaker: 'Voice A (Educator)',
        line: 'Not tanks! Heat from the sun turns river water into vapor that rises and forms clouds. When clouds cool down, it rains!',
      },
    ],
    status: 'approved',
  },
  citationVerification: {
    verified: true,
    nerdcBenchmarkCode: 'NERDC-BST-P4-T01-VERIFIED',
    sources: ['NERDC Primary 4 Basic Science Curriculum', 'Nigerian National Primary Science Guidelines'],
  },
  safetyAudit: {
    safe: true,
    notes: '100% Primary School Safe. Aligned with Nigerian primary curriculum standards.',
  },
  overallApprovalStatus: 'all_approved',
};
