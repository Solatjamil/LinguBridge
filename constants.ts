
import { TestId, TestMetadata } from './types';

export const TESTS: TestMetadata[] = [
  {
    id: TestId.IELTS_ACADEMIC,
    name: 'IELTS Academic',
    category: 'English',
    purpose: 'University admissions',
    levels: 'Band 0-9',
    description: 'Measures English language proficiency needed for an academic, higher education environment.'
  },
  {
    id: TestId.IELTS_GENERAL,
    name: 'IELTS General',
    category: 'English',
    purpose: 'Immigration/work',
    levels: 'Band 0-9',
    description: 'Measures English language proficiency in a practical, everyday context.'
  },
  {
    id: TestId.TESTDAF,
    name: 'TestDaF',
    category: 'German',
    purpose: 'University study',
    levels: 'B2-C1',
    description: 'A standardized language test for foreign learners of German who plan to study in Germany.'
  },
  {
    id: TestId.DSH,
    name: 'DSH',
    category: 'German',
    purpose: 'University admission',
    levels: 'C1-C2',
    description: 'German language proficiency test required for admission to a German university.'
  },
  {
    id: TestId.GOETHE,
    name: 'Goethe-Zertifikat',
    category: 'German',
    purpose: 'Study, work, visa',
    levels: 'A1-C2',
    description: 'World-recognized German language certificates corresponding to the CEFR levels.'
  },
  {
    id: TestId.TELC,
    name: 'telc Deutsch',
    category: 'German',
    purpose: 'Residency, business',
    levels: 'A1-C2',
    description: 'Language certificates for various purposes including integration and business.'
  },
  {
    id: TestId.OESD,
    name: 'ÖSD',
    category: 'German',
    purpose: 'General proficiency',
    levels: 'A1-C2',
    description: 'Austrian German Language Diploma recognized internationally.'
  },
  {
    id: TestId.A1_VOCAB_BOOK,
    name: 'A1 German Vocabulary Book',
    category: 'German',
    purpose: 'Learn Noun Genders & Articles',
    levels: 'A1 Beginner',
    description: 'The official vocabulary syllabus companion extracted from the A1 German Course Flipbook [https://online.fliphtml5.com/mkzfx/phnn/]. Learn with color coding, add custom cards, and play audio pronunciations.'
  }
];
