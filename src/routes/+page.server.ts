import type { PageServerLoad } from './$types';
import imageMeta from '$lib/data/images.json';
import { join } from 'node:path';
import { error } from '@sveltejs/kit';
import { base64 } from '$lib/utilities/image.server';

export const load: PageServerLoad = async function load({ url }) {
	try {
		const { searchParams } = url;
		const imageSlug = searchParams.get('image') ?? '';

		const imagesFiles = import.meta.glob('../assets/*.jpg');
		const images = await Promise.all(
			Object.keys(imagesFiles).map(async (path) => {
				const src = path.split('/').at(-1);
				const [slug] = src?.split('.') ?? '';
				// @ts-expect-error use slug as index on JSON object
				const { alt, title } = imageMeta[slug];
				const placeholder = src && (await base64(join('src/assets', src), 10));
				return { alt, title, placeholder, slug, src: `/assets/${src}` };
			})
		);
		const image = imageSlug ? { ...images.find(({ slug }) => slug === imageSlug) } : {};
		return {
			image,
			images
		};
	} catch (err: unknown) {
		const httpError = err as { status: number; message: string };
		if (httpError.message) {
			throw error(httpError.status ?? 500, httpError.message);
		}
		throw error(500, err as string);
	}
};
