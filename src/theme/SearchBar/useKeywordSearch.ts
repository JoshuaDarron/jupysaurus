import { useState, useEffect, useRef, useCallback } from 'react';
import type { SearchResult } from '@site/src/types';

interface FlexSearchDocument {
	add(doc: SearchResult): void;
	search(
		query: string,
		options: { limit: number; enrich: boolean },
	): Array<{ result: Array<{ id: string; doc: SearchResult }> }>;
}

interface UseKeywordSearchReturn {
	results: SearchResult[];
	loading: boolean;
	search: (query: string) => void;
	clear: () => void;
}

export default function useKeywordSearch(): UseKeywordSearchReturn {
	const indexRef = useRef<FlexSearchDocument | null>(null);
	const docsRef = useRef<SearchResult[]>([]);
	const [results, setResults] = useState<SearchResult[]>([]);
	const [loading, setLoading] = useState(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const { Document } = await import('flexsearch');
				const res = await fetch('/search-index.json');
				const docs: SearchResult[] = await res.json();
				if (cancelled) return;

				docsRef.current = docs;

				const idx = new Document({
					id: 'id',
					field: ['title', 'body'],
					store: true,
					tokenize: 'forward',
				}) as unknown as FlexSearchDocument;
				docs.forEach((doc) => idx.add(doc));
				indexRef.current = idx;
			} catch (err) {
				console.error('Failed to load search index:', err);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	const search = useCallback((query: string) => {
		if (timerRef.current) clearTimeout(timerRef.current);

		if (!query.trim() || !indexRef.current) {
			setResults([]);
			setLoading(false);
			return;
		}

		setLoading(true);
		timerRef.current = setTimeout(() => {
			const raw = indexRef.current!.search(query, { limit: 10, enrich: true });

			const seen = new Set<string>();
			const merged: SearchResult[] = [];
			for (const fieldResult of raw) {
				for (const entry of fieldResult.result) {
					if (!seen.has(entry.id)) {
						seen.add(entry.id);
						merged.push(entry.doc);
					}
				}
			}
			setResults(merged);
			setLoading(false);
		}, 150);
	}, []);

	const clear = useCallback(() => {
		if (timerRef.current) clearTimeout(timerRef.current);
		setResults([]);
		setLoading(false);
	}, []);

	return { results, loading, search, clear };
}
