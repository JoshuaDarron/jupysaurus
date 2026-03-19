import React, { useState } from 'react';
import usePyodide from '../LiveCode/usePyodide';
import styles from './styles.module.css';

const FALLBACK_CODE = `# Write your Python code here
print("Hello, world!")`;

interface LiveCodeEditorProps {
	defaultCode?: string;
}

interface RunResult {
	output: string;
	errors: string;
}

export default function LiveCodeEditor({ defaultCode }: LiveCodeEditorProps): React.JSX.Element {
	const initialCode = typeof defaultCode === 'string' ? defaultCode : FALLBACK_CODE;
	const [code, setCode] = useState(initialCode);
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

	function handleClear() {
		setCode('');
		setResult(null);
	}

	return (
		<div className={styles.container}>
			<textarea
				className={styles.editor}
				value={code}
				onChange={(e) => setCode(e.target.value)}
				spellCheck={false}
				rows={Math.max(10, initialCode.split('\n').length + 2)}
			/>
			<div className={styles.toolbar}>
				<button className={styles.clearButton} onClick={handleClear} disabled={busy}>
					Clear
				</button>
				<button className={styles.runButton} onClick={handleRun} disabled={busy || !code.trim()}>
					{buttonLabel}
				</button>
			</div>
			{result?.output && <pre className={styles.output}>{result.output}</pre>}
			{result?.errors && <pre className={styles.error}>{result.errors}</pre>}
		</div>
	);
}
