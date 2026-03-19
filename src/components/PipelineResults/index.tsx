import React from 'react';
import type { PipelineConfig, PipelineResults as PipelineResultsType } from '@site/src/types';
import PipelineFlow from './PipelineFlow';
import ConfigTable from './ConfigTable';
import ResultCard from './ResultCard';
import StatusIndicator from './StatusIndicator';
import useAparaviPipeline from './useAparaviPipeline';
import styles from './styles.module.css';

interface PipelineResultsProps {
	config?: PipelineConfig;
	results?: PipelineResultsType;
	apiKey?: string;
	baseUrl?: string;
}

export default function PipelineResults({
	config,
	results: staticResults,
	apiKey,
	baseUrl,
}: PipelineResultsProps): React.JSX.Element {
	const pipeline = config || ({} as PipelineConfig);
	const components = pipeline.components || [];
	const {
		status,
		results: liveResults,
		error,
		running,
		executePipeline,
		cancel,
	} = useAparaviPipeline({ apiKey, baseUrl });

	const results = liveResults || staticResults;
	const documents = results?.documents || results?.results || [];

	return (
		<div className={styles.container}>
			<h3>Pipeline Flow</h3>
			<PipelineFlow components={components} />

			<h3>Stage Configuration</h3>
			<div className={styles.configSection}>
				<ConfigTable components={components} />
			</div>

			<div className={styles.executeSection}>
				{running ? (
					<button className={styles.cancelButton} onClick={cancel}>
						Cancel
					</button>
				) : (
					<button
						className={styles.executeButton}
						onClick={() => executePipeline(config!)}
						disabled={!apiKey || (status === 'done' && !!liveResults)}
					>
						Execute Pipeline
					</button>
				)}
				{!apiKey && (
					<span className={styles.apiKeyHint}>Enter an API key above to run the pipeline.</span>
				)}

				{status !== 'idle' && <StatusIndicator status={status} />}
				{error && <pre className={styles.errorMessage}>{error}</pre>}
			</div>

			<h3>
				Execution Results
				{results && (
					<span className={documents.length ? styles.badgeSuccess : styles.badgeError}>
						{documents.length ? `${documents.length} documents` : 'no output'}
					</span>
				)}
			</h3>
			<div className={styles.resultsSection}>
				{!results ? (
					<div className={styles.noResults}>
						No results yet. Click <strong>Execute Pipeline</strong> above to run the pipeline, or
						run <code>python scripts/run_pipeline.py</code> offline.
					</div>
				) : documents.length > 0 ? (
					documents.map((doc, i) => <ResultCard key={i} doc={doc} index={i} />)
				) : (
					<div className={styles.noResults}>
						Pipeline executed but returned no documents. Check the raw results below.
					</div>
				)}
			</div>

			{results && !documents.length && (
				<>
					<h3>Raw Results</h3>
					<pre className={styles.resultBody}>{JSON.stringify(results, null, 2)}</pre>
				</>
			)}
		</div>
	);
}
