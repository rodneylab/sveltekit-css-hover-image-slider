import cspDirectives from './csp-directives.mjs';
import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({ postcss: true }),

	kit: {
		adapter: adapter({ precompress: true }),
		csp: {
			mode: 'hash',
			directives: cspDirectives,
		},
	},
};

export default config;
