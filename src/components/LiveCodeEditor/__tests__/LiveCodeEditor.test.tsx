import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LiveCodeEditor from '../index';

jest.mock('../../LiveCode/usePyodide', () => ({
	__esModule: true,
	default: () => ({
		runPython: jest.fn().mockResolvedValue({ output: '', errors: '' }),
		loading: false,
		running: false,
	}),
}));

describe('LiveCodeEditor', () => {
	it('renders with default code', () => {
		render(<LiveCodeEditor defaultCode="x = 42" />);
		const textarea = screen.getByRole('textbox');
		expect(textarea).toHaveValue('x = 42');
	});

	it('renders fallback code when no defaultCode is provided', () => {
		render(<LiveCodeEditor />);
		const textarea = screen.getByRole('textbox');
		expect((textarea as HTMLTextAreaElement).value).toContain('Hello, world!');
	});

	it('clears the editor when Clear is clicked', () => {
		render(<LiveCodeEditor defaultCode="test code" />);
		fireEvent.click(screen.getByText('Clear'));
		const textarea = screen.getByRole('textbox');
		expect(textarea).toHaveValue('');
	});
});
