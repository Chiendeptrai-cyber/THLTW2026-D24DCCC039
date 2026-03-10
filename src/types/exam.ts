// Knowledge Block Types
export interface KnowledgeBlock {
	id: string;
	name: string;
	description?: string;
	createdAt: string;
}

// Subject Types
export interface Subject {
	id: string;
	code: string;
	name: string;
	credits: number;
	description?: string;
	createdAt: string;
}

// Question Types
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'very_hard';

export interface Question {
	id: string;
	subjectId: string;
	code: string;
	content: string;
	difficulty: DifficultyLevel;
	knowledgeBlockId: string;
	author?: string;
	createdAt: string;
	updatedAt: string;
}

// Test Paper Structure Types
export interface TestPaperQuestionConfig {
	knowledgeBlockId: string;
	difficulty: DifficultyLevel;
	quantity: number;
}

export interface TestPaperTemplate {
	id: string;
	subjectId: string;
	name: string;
	description?: string;
	questionConfigs: TestPaperQuestionConfig[];
	totalQuestions: number;
	createdAt: string;
}

// Test Paper Types
export interface TestPaper {
	id: string;
	templateId?: string;
	subjectId: string;
	name: string;
	questions: Question[];
	structure: TestPaperQuestionConfig[];
	createdAt: string;
	updatedAt: string;
}

// Difficulty Labels
export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
	easy: 'Dễ',
	medium: 'Trung bình',
	hard: 'Khó',
	very_hard: 'Rất khó',
};

export const DIFFICULTY_OPTIONS = [
	{ label: 'Dễ', value: 'easy' },
	{ label: 'Trung bình', value: 'medium' },
	{ label: 'Khó', value: 'hard' },
	{ label: 'Rất khó', value: 'very_hard' },
];
