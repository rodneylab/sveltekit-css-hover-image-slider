<script lang="ts">
	import { getSrcset } from '$lib/utilities/image';
	import '@fontsource/figtree';

	let {
		image,
	}: {
		image: {
			alt: string;
			credit: { name: string; profile: string };
			title: string;
			placeholder: string;
			slug: string;
			src: string;
		};
	} = $props();

	let {
		alt,
		credit: { name: artist, profile },
		src,
	} = $derived(image);

	const densities = [1.0, 2.0];
	const SIZES = [280, 374, 672, 768, 1024];
	const avifSrcset = $derived(
		getSrcset({
			densities,
			format: 'avif',
			sizes: SIZES,
			src,
		}),
	);
	const webpSrcset = $derived(
		getSrcset({
			densities,
			format: 'webp',
			sizes: SIZES,
			src,
		}),
	);
	const jpgSrcset = $derived(
		getSrcset({
			densities,
			format: 'jpeg',
			sizes: SIZES,
			src,
		}),
	);
	const sizes =
		'(max-width: 768px) 100vw, (max-width: 1024px) 672px, (max-width: 1280px) 768px, 1024px';
</script>

<svelte:head>
	<link
		rel="preload"
		as="image"
		href={src}
		imagesrcset={avifSrcset}
		imagesizes={sizes}
		fetchpriority="high"
	/>
</svelte:head>

<figure>
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
	<figcaption>CREDIT: <a href={profile}>{artist}</a></figcaption>
</figure>

<style lang="postcss">
	.preview {
		border-radius: var(--spacing-px-2);
		box-shadow: var(--shadow-elevation-medium);
		outline: var(--spacing-px) solid var(--colour-brand);
		max-width: 100%;
		aspect-ratio: 16 / 10;
		height: auto;
	}

	figure {
		margin: var(--spacing-0);
	}

	img {
		background-position: center center;
		background-repeat: no-repeat;
	}

	figcaption {
		width: var(--max-width-full);
		text-align: right;
		margin-top: var(--spacing-2);
		color: var(--colour-light);
	}

	figcaption a {
		color: inherit;
	}
</style>
