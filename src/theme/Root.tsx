import React, { type ReactNode } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import ErrorBoundary from '@site/src/components/ErrorBoundary';

interface RootProps {
	children: ReactNode;
}

export default function Root({ children }: RootProps): React.JSX.Element {
	return (
		<>
			{children}
			<BrowserOnly>
				{() => {
					// eslint-disable-next-line @typescript-eslint/no-require-imports
					const Chatbot = require('@site/src/components/Chatbot').default;
					return (
						<ErrorBoundary>
							<Chatbot />
						</ErrorBoundary>
					);
				}}
			</BrowserOnly>
		</>
	);
}
