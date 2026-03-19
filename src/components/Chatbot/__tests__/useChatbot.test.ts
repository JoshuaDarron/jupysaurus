import { renderHook, act } from '@testing-library/react';
import useChatbot from '../useChatbot';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('useChatbot', () => {
	beforeEach(() => {
		mockFetch.mockReset();
	});

	it('starts with empty messages and no error', () => {
		const { result } = renderHook(() => useChatbot());
		expect(result.current.messages).toEqual([]);
		expect(result.current.error).toBeNull();
		expect(result.current.streaming).toBe(false);
	});

	it('reports apiKeyConfigured as true when key is present', () => {
		const { result } = renderHook(() => useChatbot());
		expect(result.current.apiKeyConfigured).toBe(true);
	});

	it('sends a message and receives a response', async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				status: 'OK',
				data: { objects: { body: { answers: ['Hello!'] } } },
			}),
		});

		const { result } = renderHook(() => useChatbot());

		await act(async () => {
			await result.current.sendMessage('Hi');
		});

		expect(result.current.messages).toHaveLength(2);
		expect(result.current.messages[0]).toEqual({ role: 'user', content: 'Hi' });
		expect(result.current.messages[1]).toEqual({ role: 'assistant', content: 'Hello!' });
	});

	it('clears chat history', async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				status: 'OK',
				data: { objects: { body: { answers: ['Reply'] } } },
			}),
		});

		const { result } = renderHook(() => useChatbot());

		await act(async () => {
			await result.current.sendMessage('Test');
		});

		expect(result.current.messages).toHaveLength(2);

		act(() => {
			result.current.clearChat();
		});

		expect(result.current.messages).toEqual([]);
	});
});
