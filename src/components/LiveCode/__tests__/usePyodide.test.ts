import { renderHook } from '@testing-library/react';
import usePyodide from '../usePyodide';

describe('usePyodide', () => {
	it('starts with loading and running as false', () => {
		const { result } = renderHook(() => usePyodide());
		expect(result.current.loading).toBe(false);
		expect(result.current.running).toBe(false);
	});

	it('exposes a runPython function', () => {
		const { result } = renderHook(() => usePyodide());
		expect(typeof result.current.runPython).toBe('function');
	});
});
