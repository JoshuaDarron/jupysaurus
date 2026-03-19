import React, { type ReactNode } from 'react';

interface BrowserOnlyProps {
	children: () => ReactNode;
}

export default function BrowserOnly({ children }: BrowserOnlyProps): React.JSX.Element {
	return <>{children()}</>;
}
