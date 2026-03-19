import { renderHook, act } from '@testing-library/react';
import useSemanticSearch from '../useSemanticSearch';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('useSemanticSearch', () => {
	beforeEach(() => {
		mockFetch.mockReset();
	});

	it('starts with empty answer and not loading', () => {
		const { result } = renderHook(() => useSemanticSearch());
		expect(result.current.answer).toBe('');
		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBeNull();
	});

	it('performs a search and returns an answer', async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				status: 'OK',
				data: { objects: { body: { answers: ['Test answer'] } } },
			}),
		});

		const { result } = renderHook(() => useSemanticSearch());

		await act(async () => {
			await result.current.search('what is this?');
		});

		expect(result.current.answer).toBe('Test answer');
		expect(result.current.loading).toBe(false);
	});

	it('clears answer and error state', () => {
		const { result } = renderHook(() => useSemanticSearch());

		act(() => {
			result.current.clear();
		});

		expect(result.current.answer).toBe('');
		expect(result.current.error).toBeNull();
	});
});
