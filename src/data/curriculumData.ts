import { GradeLevel, SubjectName, LanguageInfo } from '../types';

export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', label: 'English', nativeName: 'English (Official)', flag: '🇳🇬' },
  { code: 'pcm', label: 'Pidgin', nativeName: 'Naija Pidgin', flag: '🗣️' },
  { code: 'yo', label: 'Yoruba', nativeName: 'Èdè Yorùbá', flag: '👑' },
  { code: 'ig', label: 'Igbo', nativeName: 'Asụsụ Igbo', flag: '🦅' },
  { code: 'ha', label: 'Hausa', nativeName: 'Harshen Hausa', flag: '🕌' },
];

export const SUBJECTS: SubjectName[] = [
  'Basic Science & Technology',
  'Mathematics',
  'English Studies',
  'Social Studies',
  'Civic Education',
  'Agricultural Science',
  'Home Economics',
  'Cultural & Creative Arts',
];

export const GRADES: GradeLevel[] = [
  'Primary 1',
  'Primary 2',
  'Primary 3',
  'Primary 4',
  'Primary 5',
  'Primary 6',
];

export interface SampleTopicPreset {
  id: string;
  subject: SubjectName;
  grade: GradeLevel;
  topic: string;
  durationMinutes: number;
  nerdcCode: string;
  evidenceSnippet: string;
  icon: string;
}

export const SAMPLE_TOPICS: SampleTopicPreset[] = [
  {
    id: 'photosynthesis-p4',
    subject: 'Basic Science & Technology',
    grade: 'Primary 4',
    topic: 'Parts of a Plant and Photosynthesis',
    durationMinutes: 40,
    nerdcCode: 'NERDC-BST-P4-T02',
    evidenceSnippet:
      'Pupils should observe green plants in the school garden. Explain the functions of roots, stem, leaves, and how chlorophyll uses sunlight, water, and air to produce plant food.',
    icon: '🌱',
  },
  {
    id: 'money-p3',
    subject: 'Mathematics',
    grade: 'Primary 3',
    topic: 'Money: Shopping and Market Transactions in Naira & Kobo',
    durationMinutes: 40,
    nerdcCode: 'NERDC-MTH-P3-T05',
    evidenceSnippet:
      'Pupils should recognize Nigerian currency notes (₦10, ₦20, ₦50, ₦100, ₦200, ₦500, ₦1000), practice adding price tags of items bought at a local market, and calculate change.',
    icon: '💵',
  },
  {
    id: 'cultural-diversity-p5',
    subject: 'Social Studies',
    grade: 'Primary 5',
    topic: 'Cultural Diversity and Unity in Nigeria',
    durationMinutes: 40,
    nerdcCode: 'NERDC-SST-P5-T01',
    evidenceSnippet:
      'Identify major ethnic groups in Nigeria (Yoruba, Hausa, Igbo, Ijaw, Kanuri, Tiv, Fulani, etc.), their traditional attires, foods, festivals, and how living together peacefully promotes national unity.',
    icon: '🇳🇬',
  },
  {
    id: 'parts-of-speech-p2',
    subject: 'English Studies',
    grade: 'Primary 2',
    topic: 'Nouns: Naming People, Animals, Places and Things in Our School',
    durationMinutes: 35,
    nerdcCode: 'NERDC-ENG-P2-T03',
    evidenceSnippet:
      'Guide pupils to name items in their classroom (desk, chalk, board) and surroundings (tree, dog, market). Differentiate between proper nouns (e.g., Tobi, Lagos) and common nouns.',
    icon: '📖',
  },
  {
    id: 'soil-types-p6',
    subject: 'Agricultural Science',
    grade: 'Primary 6',
    topic: 'Types of Soil and Their Water Holding Capacity',
    durationMinutes: 45,
    nerdcCode: 'NERDC-AGR-P6-T04',
    evidenceSnippet:
      'Collect Sandy, Clay, and Loamy soil samples from the school compound. Conduct a drainage experiment using plastic funnels and measuring cylinders to compare water retention.',
    icon: '🌾',
  },
];
