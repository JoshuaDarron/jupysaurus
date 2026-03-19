import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PipelineEditor from '../index';

// Mock PipelineResults
jest.mock('../../PipelineResults', () => ({
	__esModule: true,
	default: () => <div data-testid="pipeline-results" />,
}));

const defaultConfig = {
	components: [
		{ id: 'source', provider: 'sample_google', config: {}, ui: { data: { class: 'source' } } },
	],
};

describe('PipelineEditor', () => {
	it('renders the editor with JSON config', () => {
		render(<PipelineEditor defaultConfig={defaultConfig} apiKey="key" baseUrl="url" />);
		const textarea = screen.getByRole('textbox');
		expect(textarea).toHaveValue(JSON.stringify(defaultConfig, null, 2));
	});

	it('shows Modified badge when text is edited', () => {
		render(<PipelineEditor defaultConfig={defaultConfig} apiKey="key" baseUrl="url" />);
		const textarea = screen.getByRole('textbox');
		fireEvent.change(textarea, { target: { value: '{}' } });
		expect(screen.getByText('Modified')).toBeInTheDocument();
	});

	it('resets to default config', () => {
		render(<PipelineEditor defaultConfig={defaultConfig} apiKey="key" baseUrl="url" />);
		const textarea = screen.getByRole('textbox');
		fireEvent.change(textarea, { target: { value: '{}' } });
		fireEvent.click(screen.getByText('Reset to Default'));
		expect(textarea).toHaveValue(JSON.stringify(defaultConfig, null, 2));
	});

	it('shows parse error for invalid JSON', () => {
		render(<PipelineEditor defaultConfig={defaultConfig} apiKey="key" baseUrl="url" />);
		const textarea = screen.getByRole('textbox');
		fireEvent.change(textarea, { target: { value: 'not json' } });
		fireEvent.click(screen.getByText('Load Pipeline'));
		expect(screen.getByText(/Invalid JSON/)).toBeInTheDocument();
	});
});
