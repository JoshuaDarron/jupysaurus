import React, { useState, type ReactNode } from 'react';
import usePyodide from './usePyodide';
import styles from './styles.module.css';

interface LiveCodeProps {
	children: ReactNode;
}

interface RunResult {
	output: string;
	errors: string;
}

export default function LiveCode({ children }: LiveCodeProps): React.JSX.Element {
	const code = typeof children === 'string' ? children.trim() : '';
	const { runPython, loading, running } = usePyodide();
	const [result, setResult] = useState<RunResult | null>(null);

	const busy = loading || running;

	let buttonLabel = 'Run';
	if (loading) buttonLabel = 'Loading Pyodide…';
	if (running) buttonLabel = 'Running…';

	async function handleRun() {
		const { output, errors } = await runPython(code);
		setResult({ output, errors });
	}

	return (
		<div className={styles.container}>
			<pre className={styles.codeBlock}>
				<code>{code}</code>
			</pre>
			<div className={styles.toolbar}>
				<button className={styles.runButton} onClick={handleRun} disabled={busy}>
					{buttonLabel}
				</button>
			</div>
			{result?.output && <pre className={styles.output}>{result.output}</pre>}
			{result?.errors && <pre className={styles.error}>{result.errors}</pre>}
		</div>
	);
}
