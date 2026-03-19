import { useState, useCallback, useRef } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { getWebhookConfig } from '@site/src/lib/webhook';

interface WebhookResult {
	status: string;
	data?: {
		objects?: {
			body?: {
				answers?: string[];
			};
		};
	};
}

function extractAnswer(result: WebhookResult | null): string {
	if (!result) return 'No response received.';
	if (result.status !== 'OK') return `Error: ${result.status || 'Unknown error'}`;
	const body = result.data?.objects?.body;
	if (!body) return 'No response received.';
	if (body.answers && body.answers.length > 0) return body.answers.join('\n');
	return 'No response received.';
}

interface UseSemanticSearchReturn {
	answer: string;
	loading: boolean;
	error: string | null;
	search: (query: string) => Promise<void>;
	cancel: () => void;
	clear: () => void;
}

export default function useSemanticSearch(): UseSemanticSearchReturn {
	const { siteConfig } = useDocusaurusContext();
	const [answer, setAnswer] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const abortRef = useRef<AbortController | null>(null);

	const search = useCallback(
		async (query: string) => {
			if (!query.trim()) return;

			const { url, pk, token } = getWebhookConfig(
				siteConfig.customFields as Record<string, unknown>,
			);

			setAnswer('');
			setError(null);
			setLoading(true);

			const controller = new AbortController();
			abortRef.current = controller;

			try {
				const response = await fetch(`${url}?token=${token}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'text/plain',
						Authorization: pk,
					},
					body: query.trim(),
					signal: controller.signal,
				});

				if (!response.ok) {
					const errText = await response.text();
					throw new Error(`Webhook error ${response.status}: ${errText}`);
				}

				const result: WebhookResult = await response.json();
				setAnswer(extractAnswer(result));
			} catch (err) {
				if (err instanceof Error && err.name !== 'AbortError') {
					setError(err.message);
				}
			} finally {
				setLoading(false);
				abortRef.current = null;
			}
		},
		[siteConfig.customFields],
	);

	const cancel = useCallback(() => {
		if (abortRef.current) abortRef.current.abort();
	}, []);

	const clear = useCallback(() => {
		setAnswer('');
		setError(null);
		setLoading(false);
	}, []);

	return { answer, loading, error, search, cancel, clear };
}
