export const NODE_LABELS: Record<string, string> = {
	sample_google: 'Google Drive Source',
	parse: 'Document Parser',
	preprocessor_langchain: 'LangChain Chunker',
	response: 'Response Output',
};

export const STATUS_LABELS: Record<string, string> = {
	idle: 'Ready',
	validating: 'Validating pipeline...',
	executing: 'Starting execution...',
	polling: 'Waiting for results...',
	teardown: 'Collecting results...',
	done: 'Complete',
	error: 'Failed',
};

export const CONFIG_CELL_LIMIT = 250;
export const CONTENT_LIMIT = 2000;
