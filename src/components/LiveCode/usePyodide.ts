import { useRef, useCallback, useState } from 'react';

interface PyodideInstance {
	setStdout(opts: { batched: (line: string) => void }): void;
	setStderr(opts: { batched: (line: string) => void }): void;
	runPythonAsync(code: string): Promise<unknown>;
}

declare function loadPyodide(): Promise<PyodideInstance>;

let pyodidePromise: Promise<PyodideInstance> | null = null;

function loadPyodideSingleton(): Promise<PyodideInstance> {
	if (!pyodidePromise) {
		pyodidePromise = (async () => {
			const script = document.createElement('script');
			script.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js';
			document.head.appendChild(script);
			await new Promise<void>((resolve, reject) => {
				script.onload = () => resolve();
				script.onerror = () => reject(new Error('Failed to load Pyodide'));
			});
			const pyodide = await loadPyodide();
			return pyodide;
		})();
	}
	return pyodidePromise;
}

interface RunResult {
	output: string;
	errors: string;
}

interface UsePyodideReturn {
	runPython: (code: string) => Promise<RunResult>;
	loading: boolean;
	running: boolean;
}

export default function usePyodide(): UsePyodideReturn {
	const [loading, setLoading] = useState(false);
	const [running, setRunning] = useState(false);
	const pyodideRef = useRef<PyodideInstance | null>(null);

	const runPython = useCallback(async (code: string): Promise<RunResult> => {
		setLoading(true);
		try {
			if (!pyodideRef.current) {
				pyodideRef.current = await loadPyodideSingleton();
			}
			setLoading(false);
			setRunning(true);

			const pyodide = pyodideRef.current;
			pyodide.setStdout({ batched: () => {} });
			pyodide.setStderr({ batched: () => {} });

			const stdout: string[] = [];
			const stderr: string[] = [];
			pyodide.setStdout({ batched: (line: string) => stdout.push(line) });
			pyodide.setStderr({ batched: (line: string) => stderr.push(line) });

			await pyodide.runPythonAsync(code);

			const output = stdout.join('\n');
			const errors = stderr.join('\n');
			return { output, errors };
		} catch (err) {
			setLoading(false);
			return { output: '', errors: err instanceof Error ? err.message : String(err) };
		} finally {
			setLoading(false);
			setRunning(false);
		}
	}, []);

	return { runPython, loading, running };
}
