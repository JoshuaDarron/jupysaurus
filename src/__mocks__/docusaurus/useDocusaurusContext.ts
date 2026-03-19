const useDocusaurusContext = () => ({
	siteConfig: {
		customFields: {
			APARAVI_API_KEY: 'test-api-key',
			APARAVI_BASE_URL: 'https://eaas.aparavi.com/',
			APARAVI_URI: 'https://eaas.aparavi.com:443',
			WEBHOOK_PK: 'test-pk',
			WEBHOOK_TOKEN: 'test-token',
		},
	},
});

export default useDocusaurusContext;
