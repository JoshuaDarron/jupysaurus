import React from 'react';
import Link from '@docusaurus/Link';
import Markdown from 'react-markdown';
import type { SearchResult, SearchMode } from '@site/src/types';
import styles from './styles.module.css';

function snippetFromBody(body: string, query: string): string {
	const lower = body.toLowerCase();
	const idx = lower.indexOf(query.toLowerCase());
	if (idx === -1) return body.slice(0, 120) + '...';
	const start = Math.max(0, idx - 50);
	const end = Math.min(body.length, idx + query.length + 70);
	let snippet = body.slice(start, end);
	if (start > 0) snippet = '...' + snippet;
	if (end < body.length) snippet = snippet + '...';
	return snippet;
}

interface KeywordResultsProps {
	results: SearchResult[];
	query: string;
	onSelect: () => void;
}

function KeywordResults({ results, query, onSelect }: KeywordResultsProps): React.JSX.Element {
	if (results.length === 0) {
		return <div className={styles.noResults}>No results found.</div>;
	}
	return (
		<ul className={styles.resultList}>
			{results.map((doc) => (
				<li key={doc.id} className={styles.resultItem}>
					<Link to={doc.url} className={styles.resultLink} onClick={onSelect}>
						<span className={styles.resultTitle}>{doc.title}</span>
						<span className={styles.resultSnippet}>{snippetFromBody(doc.body, query)}</span>
					</Link>
				</li>
			))}
		</ul>
	);
}

interface AiAnswerProps {
	answer: string;
	loading: boolean;
	error: string | null;
}

function AiAnswer({ answer, loading, error }: AiAnswerProps): React.JSX.Element | null {
	if (loading) {
		return <div className={styles.aiLoading}>Thinking...</div>;
	}
	if (error) {
		return <div className={styles.aiError}>{error}</div>;
	}
	if (!answer) return null;
	return (
		<div className={styles.aiAnswer}>
			<Markdown>{answer}</Markdown>
		</div>
	);
}

interface SearchDropdownProps {
	mode: SearchMode;
	query: string;
	keywordResults: SearchResult[];
	aiAnswer: string;
	aiLoading: boolean;
	aiError: string | null;
	onSelect: () => void;
}

export default function SearchDropdown({
	mode,
	query,
	keywordResults,
	aiAnswer,
	aiLoading,
	aiError,
	onSelect,
}: SearchDropdownProps): React.JSX.Element {
	if (mode === 'keyword') {
		return <KeywordResults results={keywordResults} query={query} onSelect={onSelect} />;
	}
	return <AiAnswer answer={aiAnswer} loading={aiLoading} error={aiError} />;
}
