export const WEBHOOK_URL = 'https://eaas.aparavi.com/webhook';

/**
 * Read webhook credentials from Docusaurus customFields (sourced from env vars).
 */
export function getWebhookConfig(customFields) {
  return {
    url: WEBHOOK_URL,
    pk: customFields?.WEBHOOK_PK || '',
    token: customFields?.WEBHOOK_TOKEN || '',
  };
}
