import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async function load({ url }) {
	try {
		const { pathname } = url;
		const imagesFiles = import.meta.glob('../assets/*.jpg');
		const slugs = await Promise.all(
			Object.keys(imagesFiles).map(async (path) => {
				const src = path.split('/').at(-1);
				if (!src) throw error(404, 'Not found');

				const [slug] = src?.split('.') ?? '';
				return `/${slug}`;
			})
		);

		if (!slugs.includes(pathname)) throw redirect(301, slugs[0]);
		return {};
	} catch (err: unknown) {
		const redirectError = err as { status: number; location: string };
		if (redirectError.status === 301) {
			throw redirect(301, redirectError.location);
		}
		console.error(err as string);
		throw error(500, err as string);
	}
};
