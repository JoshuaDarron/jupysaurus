import React from 'react';
import type { PipelineComponent } from '@site/src/types';
import { NODE_LABELS } from './constants';
import styles from './styles.module.css';

const CLASS_STYLES: Record<string, string> = {
	source: styles.source,
	data: styles.data,
	preprocessor: styles.preprocessor,
	infrastructure: styles.infrastructure,
};

interface PipelineFlowProps {
	components: PipelineComponent[];
}

export default function PipelineFlow({ components }: PipelineFlowProps): React.JSX.Element {
	return (
		<div className={styles.flow}>
			{components.map((comp, i) => (
				<React.Fragment key={comp.id}>
					{i > 0 && <span className={styles.arrow}>&rarr;</span>}
					<div className={`${styles.node} ${CLASS_STYLES[comp.ui?.data?.class || ''] || ''}`}>
						{NODE_LABELS[comp.provider] || comp.provider}
						<span className={styles.nodeLabel}>{comp.id}</span>
					</div>
				</React.Fragment>
			))}
		</div>
	);
}
