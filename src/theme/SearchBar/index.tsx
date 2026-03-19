import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import ErrorBoundary from '@site/src/components/ErrorBoundary';

export default function SearchBarWrapper(): React.JSX.Element {
	return (
		<BrowserOnly>
			{() => {
				// eslint-disable-next-line @typescript-eslint/no-require-imports
				const SearchBar = require('./SearchBar').default;
				return (
					<ErrorBoundary>
						<SearchBar />
					</ErrorBoundary>
				);
			}}
		</BrowserOnly>
	);
}
