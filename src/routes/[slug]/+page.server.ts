import type { PageServerLoad } from './$types';
import imageMeta from '$lib/data/images.json';
import { join } from 'node:path';
import { error } from '@sveltejs/kit';
import { base64, hash } from '$lib/utilities/image.server';

export const load: PageServerLoad = async function load({ params }) {
	try {
		const { slug: imageSlug } = params;

		const imagesFiles = import.meta.glob('../../assets/*.jpg');
		const images = await Promise.all(
			Object.keys(imagesFiles).map(async (path) => {
				const src = path.split('/').at(-1);
				if (!src) throw error(404, 'Not found');

				const [slug] = src?.split('.') ?? '';
				const {
					alt,
					credit,
					title
				}: { alt: string; credit: { name: string; profile: string }; title: string } =
					// @ts-expect-error use slug as index on JSON object
					imageMeta[slug];
				const imageHash = hash(join('src/assets', src));
				const placeholder = await base64(join('src/assets', src), 10);
				return { alt, credit, placeholder, slug, src: `/assets/${imageHash}/${src}`, title };
			})
		);
		const image = images.find(({ slug }) => slug === imageSlug);
		if (!image) throw error(404, 'Not found');

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
