import { renderHook, act } from '@testing-library/react';
import useKeywordSearch from '../useKeywordSearch';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('useKeywordSearch', () => {
	beforeEach(() => {
		mockFetch.mockReset();
		mockFetch.mockResolvedValue({
			json: async () => [],
		});
	});

	it('starts with empty results and not loading', () => {
		const { result } = renderHook(() => useKeywordSearch());
		expect(result.current.results).toEqual([]);
		expect(result.current.loading).toBe(false);
	});

	it('exposes search and clear functions', () => {
		const { result } = renderHook(() => useKeywordSearch());
		expect(typeof result.current.search).toBe('function');
		expect(typeof result.current.clear).toBe('function');
	});

	it('clears results when clear is called', () => {
		const { result } = renderHook(() => useKeywordSearch());
		act(() => {
			result.current.clear();
		});
		expect(result.current.results).toEqual([]);
		expect(result.current.loading).toBe(false);
	});
});
