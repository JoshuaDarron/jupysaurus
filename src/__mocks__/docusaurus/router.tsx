import React from 'react';

interface RedirectProps {
	to: string;
}

export function Redirect({ to }: RedirectProps): React.JSX.Element {
	return <div data-testid="redirect" data-to={to} />;
}
