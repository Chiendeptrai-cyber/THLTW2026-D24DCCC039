import { STORAGE_KEY } from '../constants';
import type { RegistryStore } from '../types';

export const createId = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

export const normalizeString = (value?: string) => (value || '').trim().toLowerCase();

export const loadStore = (): RegistryStore => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			return {
				books: [],
				decisions: [],
				fields: [],
				diplomas: [],
			};
		}
		const parsed = JSON.parse(raw);
		return {
			books: Array.isArray(parsed?.books) ? parsed.books : [],
			decisions: Array.isArray(parsed?.decisions) ? parsed.decisions : [],
			fields: Array.isArray(parsed?.fields) ? parsed.fields : [],
			diplomas: Array.isArray(parsed?.diplomas) ? parsed.diplomas : [],
		};
	} catch (error) {
		return {
			books: [],
			decisions: [],
			fields: [],
			diplomas: [],
		};
	}
};

export const saveStore = (store: RegistryStore) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};
