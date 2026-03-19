import 'dotenv/config';
import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
	title: 'AI Pipeline Docs',
	tagline: 'AI pipeline orchestration documentation powered by Jupyter notebooks',
	favicon: 'img/favicon.ico',

	future: {
		v4: true,
	},

	url: 'https://your-docusaurus-site.example.com',
	baseUrl: '/',

	onBrokenLinks: 'throw',

	customFields: {
		APARAVI_API_KEY: process.env.APARAVI_API_KEY || '',
		APARAVI_BASE_URL: process.env.APARAVI_BASE_URL || 'https://eaas.aparavi.com/',
		APARAVI_URI: process.env.APARAVI_URI || 'https://eaas.aparavi.com:443',
		WEBHOOK_PK: process.env.WEBHOOK_PK || '',
		WEBHOOK_TOKEN: process.env.WEBHOOK_TOKEN || '',
	},

	i18n: {
		defaultLocale: 'en',
		locales: ['en'],
	},

	plugins: ['./plugins/doc-embeddings'],

	presets: [
		[
			'classic',
			{
				docs: {
					sidebarPath: './sidebars.js',
				},
				blog: false,
				theme: {
					customCss: './src/css/custom.css',
				},
			} satisfies Preset.Options,
		],
	],

	themeConfig: {
		colorMode: {
			respectPrefersColorScheme: true,
		},
		navbar: {
			title: 'AI Pipeline Docs',
			items: [
				{
					type: 'docSidebar',
					sidebarId: 'tutorialSidebar',
					position: 'left',
					label: 'Docs',
				},
				{
					type: 'search',
					position: 'right',
				},
			],
		},
		footer: {
			style: 'dark',
			links: [
				{
					title: 'Docs',
					items: [
						{
							label: 'Introduction',
							to: '/docs/intro',
						},
					],
				},
			],
			copyright: `Copyright © ${new Date().getFullYear()} AI Pipeline Docs. Built with Docusaurus.`,
		},
		prism: {
			theme: prismThemes.github,
			darkTheme: prismThemes.dracula,
		},
	} satisfies Preset.ThemeConfig,
};

export default config;
