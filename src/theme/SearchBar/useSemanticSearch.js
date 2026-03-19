import { useState, useCallback, useRef } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { getWebhookConfig } from '@site/src/lib/webhook';

function extractAnswer(result) {
  if (!result) return 'No response received.';
  if (result.status !== 'OK') return `Error: ${result.status || 'Unknown error'}`;
  const body = result.data?.objects?.body;
  if (!body) return 'No response received.';
  if (body.answers && body.answers.length > 0) return body.answers.join('\n');
  return 'No response received.';
}

export default function useSemanticSearch() {
  const { siteConfig } = useDocusaurusContext();
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const search = useCallback(async (query) => {
    if (!query.trim()) return;

    const { url, pk, token } = getWebhookConfig(siteConfig.customFields);

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

      const result = await response.json();
      setAnswer(extractAnswer(result));
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [siteConfig.customFields]);

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
