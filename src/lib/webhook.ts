export const WEBHOOK_URL = 'https://eaas.aparavi.com/webhook';

export interface WebhookConfig {
	url: string;
	pk: string;
	token: string;
}

export function getWebhookConfig(customFields: Record<string, unknown>): WebhookConfig {
	return {
		url: WEBHOOK_URL,
		pk: (customFields?.WEBHOOK_PK as string) || '',
		token: (customFields?.WEBHOOK_TOKEN as string) || '',
	};
}
