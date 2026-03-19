import React from 'react';
import { render, screen } from '@testing-library/react';
import PipelineFlow from '../PipelineFlow';

const components = [
	{ id: 'src', provider: 'sample_google', config: {}, ui: { data: { class: 'source' } } },
	{ id: 'parse', provider: 'parse', config: {}, ui: { data: { class: 'data' } } },
];

describe('PipelineFlow', () => {
	it('renders all component nodes', () => {
		render(<PipelineFlow components={components} />);
		expect(screen.getByText('Google Drive Source')).toBeInTheDocument();
		expect(screen.getByText('Document Parser')).toBeInTheDocument();
	});

	it('renders node labels (component IDs)', () => {
		render(<PipelineFlow components={components} />);
		expect(screen.getByText('src')).toBeInTheDocument();
		expect(screen.getByText('parse')).toBeInTheDocument();
	});

	it('renders arrows between nodes', () => {
		const { container } = render(<PipelineFlow components={components} />);
		const arrows = container.querySelectorAll('.arrow');
		expect(arrows).toHaveLength(1);
	});
});
