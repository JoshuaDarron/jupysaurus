import React, { useState } from 'react';
import type { PipelineComponent } from '@site/src/types';
import { CONFIG_CELL_LIMIT } from './constants';
import styles from './styles.module.css';

interface TruncatedCellProps {
	text: string;
}

function TruncatedCell({ text }: TruncatedCellProps): React.JSX.Element {
	const [showFull, setShowFull] = useState(false);
	if (text.length <= CONFIG_CELL_LIMIT) {
		return <code>{text}</code>;
	}
	return (
		<>
			<code>{showFull ? text : text.slice(0, CONFIG_CELL_LIMIT) + '…'}</code>
			<button className={styles.showMoreButton} onClick={() => setShowFull(!showFull)}>
				{showFull ? 'Show less' : 'Show more'}
			</button>
		</>
	);
}

interface ConfigTableProps {
	components: PipelineComponent[];
}

export default function ConfigTable({ components }: ConfigTableProps): React.JSX.Element {
	return (
		<table className={styles.table}>
			<thead>
				<tr>
					<th>Stage</th>
					<th>Provider</th>
					<th>Class</th>
					<th>Configuration</th>
				</tr>
			</thead>
			<tbody>
				{components.map((comp) => {
					const config = { ...comp.config } as Record<string, unknown>;
					delete config.actions;
					const configStr = Object.keys(config).length
						? JSON.stringify(config, null, 2)
						: 'default';
					return (
						<tr key={comp.id}>
							<td>
								<code>{comp.id}</code>
							</td>
							<td>{comp.provider}</td>
							<td>{comp.ui?.data?.class || '—'}</td>
							<td>
								<TruncatedCell text={configStr} />
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}
