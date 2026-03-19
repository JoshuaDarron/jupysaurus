import { renderHook } from '@testing-library/react';
import useAparaviPipeline from '../useAparaviPipeline';

describe('useAparaviPipeline', () => {
	it('starts in idle state with no results', () => {
		const { result } = renderHook(() => useAparaviPipeline());
		expect(result.current.status).toBe('idle');
		expect(result.current.results).toBeNull();
		expect(result.current.error).toBeNull();
		expect(result.current.running).toBe(false);
	});

	it('exposes executePipeline and cancel functions', () => {
		const { result } = renderHook(() => useAparaviPipeline());
		expect(typeof result.current.executePipeline).toBe('function');
		expect(typeof result.current.cancel).toBe('function');
	});

	it('accepts apiKey and baseUrl overrides', () => {
		const { result } = renderHook(() =>
			useAparaviPipeline({ apiKey: 'custom-key', baseUrl: 'https://custom.api.com/' }),
		);
		expect(result.current.status).toBe('idle');
	});
});
