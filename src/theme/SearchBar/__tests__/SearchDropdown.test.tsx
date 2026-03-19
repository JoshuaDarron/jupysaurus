import React from 'react';
import { render, screen } from '@testing-library/react';
import SearchDropdown from '../SearchDropdown';

// Mock react-markdown
jest.mock('react-markdown', () => ({
	__esModule: true,
	default: ({ children }: { children: string }) => <div>{children}</div>,
}));

describe('SearchDropdown', () => {
	it('renders keyword results', () => {
		const results = [
			{ id: '1', title: 'Getting Started', url: '/docs/intro', body: 'Introduction guide' },
		];
		render(
			<SearchDropdown
				mode="keyword"
				query="getting"
				keywordResults={results}
				aiAnswer=""
				aiLoading={false}
				aiError={null}
				onSelect={jest.fn()}
			/>,
		);
		expect(screen.getByText('Getting Started')).toBeInTheDocument();
	});

	it('shows no results message when empty', () => {
		render(
			<SearchDropdown
				mode="keyword"
				query="xyz"
				keywordResults={[]}
				aiAnswer=""
				aiLoading={false}
				aiError={null}
				onSelect={jest.fn()}
			/>,
		);
		expect(screen.getByText('No results found.')).toBeInTheDocument();
	});

	it('renders AI loading state', () => {
		render(
			<SearchDropdown
				mode="ai"
				query="test"
				keywordResults={[]}
				aiAnswer=""
				aiLoading={true}
				aiError={null}
				onSelect={jest.fn()}
			/>,
		);
		expect(screen.getByText('Thinking...')).toBeInTheDocument();
	});

	it('renders AI answer', () => {
		render(
			<SearchDropdown
				mode="ai"
				query="test"
				keywordResults={[]}
				aiAnswer="Here is the answer"
				aiLoading={false}
				aiError={null}
				onSelect={jest.fn()}
			/>,
		);
		expect(screen.getByText('Here is the answer')).toBeInTheDocument();
	});
});
