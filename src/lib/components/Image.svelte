<script lang="ts">
	import { getSrcset } from '$lib/utilities/image';
	import '@fontsource/figtree';

	export let image: {
		alt: string;
		title: string;
		placeholder: string;
		slug: string;
		src: string;
	};

	let { alt, src } = image;

	const densities = [1.0, 2.0];
	const SIZES = [374, 768, 1024];
	const avifSrcset = getSrcset({
		densities,
		format: 'avif',
		sizes: SIZES,
		src
	});
	const webpSrcset = getSrcset({
		densities,
		format: 'webp',
		sizes: SIZES,
		src
	});
	const jpgSrcset = getSrcset({
		densities,
		format: 'jpeg',
		sizes: SIZES,
		src
	});
	const sizes = '(max-width: 1024px) 100vw, 1024px';
</script>

<picture>
	<source {sizes} srcset={avifSrcset} type="image/avif" width={1024} height={576} />
	<source {sizes} srcset={webpSrcset} type="image/webp" width={1024} height={576} />
	<source {sizes} srcset={jpgSrcset} type="image/jpeg" width={1024} height={576} />
	<img
		style:background="url('{image.placeholder}')"
		style:background-size="cover"
		class="preview"
		{alt}
		src={`${src}?w=1024`}
		width={1024}
		height={576}
		fetchpriority="high"
	/>
</picture>

<style lang="postcss">
	.preview {
		border-radius: var(--spacing-px-2);
		box-shadow: var(--shadow-elevation-medium);
		outline: var(--spacing-px) solid var(--colour-brand);
		max-width: 100%;
		aspect-ratio: 16/ 9;
		height: auto;
	}

	img {
		background-position: center center;
		background-size: cover;
		background-repeat: no-repeat;
	}
</style>