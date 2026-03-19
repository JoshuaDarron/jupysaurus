import { useState, useCallback, useRef } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type { PipelineConfig, PipelineResults, PipelineStatus } from '@site/src/types';

const POLL_INTERVAL = 5000;
const MAX_POLL_ATTEMPTS = 200;

function formatError(value: unknown): string | null {
	if (value == null) return null;
	if (typeof value === 'string') return value;
	return JSON.stringify(value, null, 2);
}

function wrapPipelinePayload(pipeline: PipelineConfig) {
	if (pipeline.pipeline) {
		return {
			pipeline: pipeline.pipeline,
			errors: pipeline.errors || [],
			warnings: pipeline.warnings || [],
		};
	}
	return { pipeline, errors: [], warnings: [] };
}

interface UseAparaviPipelineOptions {
	apiKey?: string;
	baseUrl?: string;
}

interface UseAparaviPipelineReturn {
	status: PipelineStatus;
	results: PipelineResults | null;
	error: string | null;
	running: boolean;
	executePipeline: (pipelineConfig: PipelineConfig) => Promise<void>;
	cancel: () => void;
}

export default function useAparaviPipeline(
	overrides: UseAparaviPipelineOptions = {},
): UseAparaviPipelineReturn {
	const { siteConfig } = useDocusaurusContext();
	const apiKey = overrides.apiKey || (siteConfig.customFields?.APARAVI_API_KEY as string) || '';
	const baseUrl = (
		overrides.baseUrl ||
		(siteConfig.customFields?.APARAVI_BASE_URL as string) ||
		'https://eaas.aparavi.com/'
	).replace(/\/$/, '');

	const [status, setStatus] = useState<PipelineStatus>('idle');
	const [results, setResults] = useState<PipelineResults | null>(null);
	const [error, setError] = useState<string | null>(null);
	const abortRef = useRef<AbortController | null>(null);

	const running = !['idle', 'done', 'error'].includes(status);

	async function apiFetch(method: string, path: string, body?: unknown) {
		const opts: RequestInit = {
			method,
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
		};
		if (body) opts.body = JSON.stringify(body);
		const res = await fetch(`${baseUrl}${path}`, opts);
		const text = await res.text();
		let json: Record<string, unknown>;
		try {
			json = JSON.parse(text);
		} catch {
			if (res.status >= 400) throw new Error(text || `API error ${res.status}`);
			throw new Error(`Unexpected non-JSON response: ${text}`);
		}
		if (res.status === 401) throw new Error(`Authentication failed: ${text}`);
		if (res.status >= 400)
			throw new Error(
				formatError((json as Record<string, unknown>).error) || text || `API error ${res.status}`,
			);
		return json;
	}

	const executePipeline = useCallback(
		async (pipelineConfig: PipelineConfig) => {
			if (!apiKey) {
				setError(
					'No API key provided. Enter your API key or add APARAVI_API_KEY to your .env file.',
				);
				setStatus('error');
				return;
			}

			const controller = new AbortController();
			abortRef.current = controller;

			setError(null);
			setResults(null);

			try {
				// Step 1: Validate
				setStatus('validating');
				const payload = wrapPipelinePayload(pipelineConfig);
				const validateRes = await apiFetch('POST', '/pipe/validate', payload);
				if (validateRes.status === 'Error') {
					throw new Error(
						`Validation failed: ${formatError(validateRes.error) || 'unknown error'}`,
					);
				}

				// Step 2: Execute
				setStatus('executing');
				const execRes = await apiFetch('PUT', '/task?name=my-task', payload);
				if (execRes.status !== 'OK' || !execRes.data) {
					throw new Error(
						`Execution failed: ${formatError(execRes.error) || 'no task data returned'}`,
					);
				}
				const { token, type: taskType } = execRes.data as {
					token: string;
					type: string;
				};

				// Step 3: Poll for completion
				setStatus('polling');
				let pollResult: Record<string, unknown> = {};
				for (let i = 0; i < MAX_POLL_ATTEMPTS; i++) {
					if (controller.signal.aborted) throw new Error('Cancelled');
					pollResult = await apiFetch(
						'GET',
						`/task?token=${encodeURIComponent(token)}&type=${encodeURIComponent(taskType)}`,
					);
					const taskStatus = (pollResult.data as Record<string, unknown>)?.status;
					if (taskStatus === 'Completed' || taskStatus === 'Done') break;
					if (taskStatus === 'Error' || taskStatus === 'Failed') {
						throw new Error(
							`Pipeline failed: ${formatError((pollResult as Record<string, unknown>).error) || formatError((pollResult.data as Record<string, unknown>)?.error) || 'unknown error'}`,
						);
					}
					await new Promise((r) => setTimeout(r, POLL_INTERVAL));
				}

				// Step 4: Teardown
				setStatus('teardown');
				const teardownRes = await apiFetch(
					'DELETE',
					`/task?token=${encodeURIComponent(token)}&type=${encodeURIComponent(taskType)}`,
				);

				const resultData = (teardownRes.data || pollResult?.data) as PipelineResults;
				setResults(resultData);
				setStatus('done');
			} catch (err) {
				if (err instanceof Error && err.message !== 'Cancelled') {
					setError(err.message);
					setStatus('error');
				} else {
					setStatus('idle');
				}
			} finally {
				abortRef.current = null;
			}
		},
		[apiKey, baseUrl],
	);

	const cancel = useCallback(() => {
		if (abortRef.current) abortRef.current.abort();
	}, []);

	return { status, results, error, running, executePipeline, cancel };
}
