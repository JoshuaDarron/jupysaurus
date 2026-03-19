import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ResultCard from '../ResultCard';

describe('ResultCard', () => {
	const doc = {
		page_content: 'This is test content for the result card.',
		metadata: { source: 'test.pdf', title: 'Test Document' },
	};

	it('renders document title', () => {
		render(<ResultCard doc={doc} index={0} />);
		expect(screen.getByText(/test.pdf/)).toBeInTheDocument();
	});

	it('shows character count', () => {
		render(<ResultCard doc={doc} index={0} />);
		expect(screen.getByText(`${doc.page_content.length} chars`)).toBeInTheDocument();
	});

	it('expands content on click', () => {
		render(<ResultCard doc={doc} index={0} />);
		fireEvent.click(screen.getByText(/test.pdf/));
		expect(screen.getByText(doc.page_content)).toBeInTheDocument();
	});

	it('uses fallback title when metadata is missing', () => {
		render(<ResultCard doc={{ page_content: 'content' }} index={2} />);
		expect(screen.getByText(/Document 3/)).toBeInTheDocument();
	});
});
