import React from 'react';
import { render, screen } from '@testing-library/react';
import LiveCode from '../index';

// Mock usePyodide
jest.mock('../usePyodide', () => ({
	__esModule: true,
	default: () => ({
		runPython: jest.fn().mockResolvedValue({ output: '', errors: '' }),
		loading: false,
		running: false,
	}),
}));

describe('LiveCode', () => {
	it('renders code content', () => {
		render(<LiveCode>{'print("hello")'}</LiveCode>);
		expect(screen.getByText('print("hello")')).toBeInTheDocument();
	});

	it('renders a Run button', () => {
		render(<LiveCode>{'x = 1'}</LiveCode>);
		expect(screen.getByText('Run')).toBeInTheDocument();
	});

	it('handles empty children gracefully', () => {
		render(<LiveCode>{''}</LiveCode>);
		expect(screen.getByText('Run')).toBeInTheDocument();
	});
});
