import { useState, useCallback } from 'react';
import { TestPaper } from '@/types/exam';

const STORAGE_KEY = 'saved_test_papers';

export default () => {
	const [papers, setPapers] = useState<TestPaper[]>(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			return saved ? JSON.parse(saved) : [];
		} catch {
			return [];
		}
	});

	const savePaper = useCallback(
		(paper: TestPaper) => {
			const newPapers = [...papers, paper];
			setPapers(newPapers);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(newPapers));
			return paper;
		},
		[papers],
	);

	const updatePaper = useCallback(
		(id: string, updatedPaper: Partial<TestPaper>) => {
			const newPapers = papers.map((p) => (p.id === id ? { ...p, ...updatedPaper } : p));
			setPapers(newPapers);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(newPapers));
		},
		[papers],
	);

	const deletePaper = useCallback(
		(id: string) => {
			const newPapers = papers.filter((p) => p.id !== id);
			setPapers(newPapers);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(newPapers));
		},
		[papers],
	);

	const getPaperById = useCallback(
		(id: string) => {
			return papers.find((p) => p.id === id);
		},
		[papers],
	);

	return {
		papers,
		savePaper,
		updatePaper,
		deletePaper,
		getPaperById,
	};
};
