import React, { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, info: React.ErrorInfo): void {
		console.error('ErrorBoundary caught:', error, info.componentStack);
	}

	render(): ReactNode {
		if (this.state.hasError) {
			if (this.props.fallback) return this.props.fallback;
			return (
				<div
					style={{
						padding: '1rem',
						border: '1px solid #e74c3c',
						borderRadius: '4px',
						background: '#fdf0ef',
						color: '#c0392b',
					}}
				>
					<strong>Something went wrong.</strong>
					<p>{this.state.error?.message}</p>
				</div>
			);
		}
		return this.props.children;
	}
}
