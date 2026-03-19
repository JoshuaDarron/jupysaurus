import { WEBHOOK_URL, getWebhookConfig } from '../webhook';

describe('webhook', () => {
	it('exports a constant webhook URL', () => {
		expect(WEBHOOK_URL).toBe('https://eaas.aparavi.com/webhook');
	});

	it('returns config from customFields', () => {
		const config = getWebhookConfig({
			WEBHOOK_PK: 'my-pk',
			WEBHOOK_TOKEN: 'my-token',
		});
		expect(config).toEqual({
			url: 'https://eaas.aparavi.com/webhook',
			pk: 'my-pk',
			token: 'my-token',
		});
	});

	it('returns empty strings when customFields are missing', () => {
		const config = getWebhookConfig({});
		expect(config.pk).toBe('');
		expect(config.token).toBe('');
	});
});
