import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatPanel from '../ChatPanel';

// Mock react-markdown (ESM-only package)
jest.mock('react-markdown', () => ({
	__esModule: true,
	default: ({ children }: { children: string }) => <div>{children}</div>,
}));

// Mock useChatbot
jest.mock('../useChatbot', () => ({
	__esModule: true,
	default: () => ({
		messages: [],
		streaming: false,
		error: null,
		sendMessage: jest.fn(),
		cancel: jest.fn(),
		clearChat: jest.fn(),
		apiKeyConfigured: true,
	}),
}));

// jsdom doesn't have scrollIntoView
beforeAll(() => {
	Element.prototype.scrollIntoView = jest.fn();
});

describe('ChatPanel', () => {
	it('renders the chat panel with placeholder text', () => {
		render(<ChatPanel onClose={jest.fn()} />);
		expect(screen.getByText('Ask a question about the documentation.')).toBeInTheDocument();
	});

	it('renders input field and send button', () => {
		render(<ChatPanel onClose={jest.fn()} />);
		expect(screen.getByPlaceholderText('Ask about the docs...')).toBeInTheDocument();
		expect(screen.getByText('Send')).toBeInTheDocument();
	});

	it('calls onClose when close button is clicked', () => {
		const onClose = jest.fn();
		render(<ChatPanel onClose={onClose} />);
		fireEvent.click(screen.getByLabelText('Close chat'));
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
