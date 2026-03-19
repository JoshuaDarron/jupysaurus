import React from 'react';
import type { PipelineStatus } from '@site/src/types';
import { STATUS_LABELS } from './constants';
import styles from './styles.module.css';

interface StatusIndicatorProps {
	status: PipelineStatus;
}

export default function StatusIndicator({ status }: StatusIndicatorProps): React.JSX.Element {
	const isActive = !['idle', 'done', 'error'].includes(status);
	return (
		<div
			className={`${styles.statusBar} ${isActive ? styles.statusActive : ''} ${status === 'error' ? styles.statusError : ''} ${status === 'done' ? styles.statusDone : ''}`}
		>
			{isActive && <span className={styles.spinner} />}
			{STATUS_LABELS[status] || status}
		</div>
	);
}
