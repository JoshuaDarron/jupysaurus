export interface PipelineComponent {
	id: string;
	provider: string;
	config: Record<string, unknown>;
	ui?: { data?: { class?: string } };
}

export interface PipelineConfig {
	components: PipelineComponent[];
	pipeline?: unknown;
	errors?: unknown[];
	warnings?: unknown[];
}

export interface PipelineResults {
	documents?: PipelineDocument[];
	results?: PipelineDocument[];
}

export interface PipelineDocument {
	page_content?: string;
	metadata?: { source?: string; title?: string };
}

export interface Message {
	role: 'user' | 'assistant';
	content: string;
}

export interface SearchResult {
	id: string;
	title: string;
	url: string;
	body: string;
}

export type PipelineStatus =
	| 'idle'
	| 'validating'
	| 'executing'
	| 'polling'
	| 'teardown'
	| 'done'
	| 'error';

export type SearchMode = 'keyword' | 'ai';
