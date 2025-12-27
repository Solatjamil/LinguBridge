
export enum Language {
  ENGLISH = 'English',
  PUNJABI = 'Punjabi',
  SINDHI = 'Sindhi'
}

export type TestModule = 'Reading' | 'Writing' | 'Listening' | 'Speaking';

export enum DifficultyLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export enum TestId {
  IELTS_ACADEMIC = 'IELTS_ACADEMIC',
  IELTS_GENERAL = 'IELTS_GENERAL',
  TESTDAF = 'TESTDAF',
  DSH = 'DSH',
  GOETHE = 'GOETHE',
  TELC = 'TELC',
  OESD = 'OESD'
}

export interface TestMetadata {
  id: TestId;
  name: string;
  category: 'English' | 'German';
  purpose: string;
  levels: string;
  description: string;
}

export interface Question {
  id: string;
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  nativeExplanation?: string;
  difficultTerms?: string[];
  audioPrompt?: string; // For Listening modules
}

export interface InfographicData {
  title: string;
  concept: string;
  examples: { original: string; translation: string; context: string }[];
  tips: string[];
  visualElements: { label: string; value: string }[];
  difficultTerms?: string[];
  grammarRules: { rule: string; explanation: string; example: string; exampleTranslation: string }[];
}

export interface SessionResult {
  id: string;
  date: string;
  testId: TestId;
  testName: string;
  module: TestModule;
  difficulty: DifficultyLevel;
  unitIndex?: number; // 0-14 for exercises
  mockTestIndex?: number; // 0-9 for mock exams
  score?: number;
  totalQuestions?: number;
  type: 'exercise' | 'mock' | 'learn';
}

export interface UserProgress {
  history: SessionResult[];
  unlockedUnits: Record<string, number>; // testId-module -> maxReachedIndex
  unlockedMockTests: Record<string, number>; // testId -> maxReachedIndex
}
