/** @type {import('jest').Config} */
const config = {
	testEnvironment: 'jsdom',
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				tsconfig: 'tsconfig.json',
			},
		],
	},
	moduleNameMapper: {
		'\\.module\\.css$': '<rootDir>/src/__mocks__/styleMock.ts',
		'\\.css$': '<rootDir>/src/__mocks__/styleMock.ts',
		'^@site/(.*)$': '<rootDir>/$1',
		'^@theme-original/(.*)$': '<rootDir>/.docusaurus/theme-original/$1',
		'^@docusaurus/(.*)$': '<rootDir>/src/__mocks__/docusaurus/$1',
	},
	setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
	testMatch: ['<rootDir>/src/**/__tests__/**/*.test.{ts,tsx}'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};

module.exports = config;
