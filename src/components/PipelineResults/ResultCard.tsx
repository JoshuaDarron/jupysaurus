import React, { useState } from 'react';
import type { PipelineDocument } from '@site/src/types';
import { CONTENT_LIMIT } from './constants';
import styles from './styles.module.css';

interface ResultCardProps {
	doc: PipelineDocument;
	index: number;
}

export default function ResultCard({ doc, index }: ResultCardProps): React.JSX.Element {
	const [expanded, setExpanded] = useState(false);
	const [showFull, setShowFull] = useState(false);
	const title = doc.metadata?.source || doc.metadata?.title || `Document ${index + 1}`;
	const fullContent = doc.page_content || JSON.stringify(doc, null, 2);
	const charCount = fullContent.length;
	const isTruncated = charCount > CONTENT_LIMIT && !showFull;
	const displayContent = isTruncated ? fullContent.slice(0, CONTENT_LIMIT) : fullContent;

	return (
		<div className={styles.resultCard}>
			<div className={styles.resultHeader} onClick={() => setExpanded(!expanded)}>
				<span className={styles.resultTitle}>
					{expanded ? '▾' : '▸'} {title}
				</span>
				<span className={styles.resultMeta}>{charCount.toLocaleString()} chars</span>
			</div>
			{expanded && (
				<div className={styles.resultBody}>
					{displayContent}
					{isTruncated && <span className={styles.truncatedNote}>...</span>}
					{charCount > CONTENT_LIMIT && (
						<button className={styles.showMoreButton} onClick={() => setShowFull(!showFull)}>
							{showFull ? 'Show less' : `Show all (${charCount.toLocaleString()} chars)`}
						</button>
					)}
				</div>
			)}
		</div>
	);
}
