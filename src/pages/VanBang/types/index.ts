import type moment from 'moment';

export type FieldType = 'string' | 'number' | 'date';

export interface DiplomaBook {
	id: string;
	year: number;
	createdAt: string;
}

export interface GraduationDecision {
	id: string;
	decisionNumber: string;
	issueDate: string;
	summary: string;
	bookId: string;
	lookupCount: number;
}

export interface TemplateField {
	id: string;
	name: string;
	type: FieldType;
}

export interface DiplomaInfo {
	id: string;
	bookId: string;
	decisionId: string;
	entryNumber: number;
	diplomaNumber: string;
	studentCode: string;
	fullName: string;
	birthDate: string;
	dynamicValues: Record<string, string | number>;
}

export interface RegistryStore {
	books: DiplomaBook[];
	decisions: GraduationDecision[];
	fields: TemplateField[];
	diplomas: DiplomaInfo[];
}

export interface SearchFormValue {
	diplomaNumber?: string;
	entryNumber?: number;
	studentCode?: string;
	fullName?: string;
	birthDate?: moment.Moment;
}

export interface DecisionFormValues {
	decisionNumber: string;
	issueDate: moment.Moment;
	summary: string;
	bookId: string;
}

export interface FieldFormValues {
	name: string;
	type: FieldType;
}

export interface DiplomaFormValues {
	decisionId: string;
	diplomaNumber: string;
	studentCode: string;
	fullName: string;
	birthDate: moment.Moment;
	dynamicValues?: Record<string, any>;
}
