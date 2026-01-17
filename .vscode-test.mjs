import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
	files: 'out/test/**/*.test.js',
	mocha: {
		timeout: 60000 // 1 minute
	},
	// https://code.visualstudio.com/api/working-with-extensions/testing-extension#disabling-other-extensions-while-debugging
	launchArgs: ['--disable-extensions']
});
