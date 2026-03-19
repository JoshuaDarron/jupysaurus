import React, { type ReactNode } from 'react';

interface LinkProps {
	to: string;
	children: ReactNode;
	className?: string;
	onClick?: () => void;
}

export default function Link({ to, children, className, onClick }: LinkProps): React.JSX.Element {
	return (
		<a href={to} className={className} onClick={onClick}>
			{children}
		</a>
	);
}
