import type { LayoutServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async function load({ url }) {
	try {
		const { pathname } = url;
		const imagesFiles = import.meta.glob('../assets/*.jpg');
		const path = Object.keys(imagesFiles)[0];
		const src = path.split('/').at(-1);
		if (!src) throw error(404, 'Not found');

		const [slug] = src?.split('.') ?? '';
		if (pathname === '/') throw redirect(301, slug);
		return {};
	} catch (err: unknown) {
		// rethrow a redirect error
		const redirectError = err as { status: number; location: string };
		if (redirectError.status === 301) {
			throw redirect(301, redirectError.location);
		}

		// process any other type of error
		console.error(err as string);
		throw error(500, err as string);
	}
};
