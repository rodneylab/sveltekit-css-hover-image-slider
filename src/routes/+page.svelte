<script lang="ts">
	import { getSrcset } from '$lib/utilities/image';
	import '@fontsource/figtree';
	import type { PageData } from './$types';

	export let data: PageData;

	let { image, images } = data;
	$: ({ image, images } = data);

	const densities = [1.0, 2.0];
	const SIZES = [374, 768, 1024];
	const THUMBNAIL_SIZES = [374, 543];
	const avifSrcset =
		image.src &&
		getSrcset({
			densities,
			format: 'avif',
			sizes: SIZES,
			src: image.src
		});
	const webpSrcset =
		image.src &&
		getSrcset({
			densities,
			format: 'webp',
			sizes: SIZES,
			src: image.src
		});
	const jpgSrcset =
		image.src &&
		getSrcset({
			densities,
			format: 'jpeg',
			sizes: SIZES,
			src: image.src
		});
	const sizes = '(max-width: 1024px) 100vw, 1024px';
	const thumbnailSizes = '(max-width: 1024px) 100vw, 543px';
</script>

<svelte:head>
	<title>{image.title}</title>
</svelte:head>

<main class="container">
	<div class="wrapper">
		<h1 class="heading">SvelteKit CSS-only :hover Image Gallery</h1>
		<section class="preview-container">
			{#if image.src}
				<picture>
					<source {sizes} srcset={avifSrcset} type="image/avif" width={1024} height={576} />
					<source {sizes} srcset={webpSrcset} type="image/webp" width={1024} height={576} />
					<source {sizes} srcset={jpgSrcset} type="image/jpeg" width={1024} height={576} />
					<img
						style:background="url('{image.placeholder}')"
						style:background-size="cover"
						class="preview"
						alt={image.alt}
						src={`${image.src}?w=1024`}
						width={1024}
						height={576}
						fetchpriority="high"
					/>
				</picture>
			{/if}
		</section>
		<div class="thumbnails-wrapper">
			<nav class="thumbnails">
				{#each images as { alt, placeholder, src, slug }}
					{@const avifThumbnailSrcset = getSrcset({
						densities,
						format: 'avif',
						sizes: THUMBNAIL_SIZES,
						src
					})}
					{@const webpThumbnailSrcset = getSrcset({
						densities,
						format: 'webp',
						sizes: THUMBNAIL_SIZES,
						src
					})}
					{@const jpgThumbnailSrcset = getSrcset({
						densities,
						format: 'jpeg',
						sizes: THUMBNAIL_SIZES,
						src
					})}
					<a href={`/?image=${slug}`} class="thumbnail">
						<picture>
							<source
								sizes={thumbnailSizes}
								srcset={avifThumbnailSrcset}
								type="image/avif"
								width={170}
							/>
							<source
								sizes={thumbnailSizes}
								srcset={webpThumbnailSrcset}
								type="image/webp"
								width={170}
							/>
							<source
								sizes={thumbnailSizes}
								srcset={jpgThumbnailSrcset}
								type="image/jpeg"
								width={170}
							/>
							<img
								style:background="url('{placeholder}')"
								style:background-size="cover"
								{alt}
								class="thumbnail-item"
								loading="lazy"
								src={`${src}?w=543}`}
								width={170}
							/></picture
						>
					</a>
				{/each}
			</nav>
		</div>
	</div>
</main>

<style lang="postcss">
	:global(*, *:after, *:before) {
		box-sizing: border-box;
	}

	:global(body) {
		min-height: 100vh;
		font-family: var(--font-family-body);
		background: var(--colour-brand);

		/* CREDIT: https://www.joshwcomeau.com/gradient-generator/ */
		background-image: linear-gradient(
			30deg,
			hsl(221deg 51% 16%) 0%,
			hsl(222deg 39% 20%) 38%,
			hsl(223deg 31% 23%) 50%,
			hsl(223deg 25% 27%) 58%,
			hsl(222deg 21% 31%) 64%,
			hsl(222deg 21% 31%) 69%,
			hsl(223deg 25% 27%) 73%,
			hsl(223deg 31% 23%) 78%,
			hsl(222deg 39% 20%) 84%,
			hsl(221deg 51% 16%) 100%
		);
	}

	:root {
		--lerp-0: 1;
		--lerp-1: 0.5625;
		--lerp-2: 0.25;
		--lerp-3: 0.0625;
		--lerp-4: 0;

		--spacing-px: 1px;
		--spacing-px-2: 2px;
		--spacing-1: 0.25rem;
		--spacing-2: 0.5rem;
		--spacing-4: 1rem;
		--spacing-5: 1.25rem;
		--spacing-6: 1.5rem;
		--spacing-12: 3rem;
		--spacing-24: 6rem;
		--spacing-32: 8rem;
		--spacing-outer: max(var(--spacing-6), 5vw);
		--max-width-container-lg: 64rem;
		--max-width-wrapper: var(--max-width-container-lg);
		--max-width-full: 100%;

		/* font sizes */
		--font-size-5: 2.441rem;

		/* font weights */
		--font-weight-bold: bold;

		/* font families */
		--font-family-body: Figtree;

		--colour-dark: hsl(0deg 0% 0%); /* black */
		--colour-light: hsl(0deg 0% 90%); /* mercury */
		--colour-theme: hsl(221deg 51% 16%); /* big stone */
		--colour-alt: hsl(30deg 1% 47%); /* concord */
		--colour-brand: hsl(180deg 8% 45%); /* sirocco */

		/* CREDIT: https://www.joshwcomeau.com/shadow-palette/*/
		--shadow-color: 224deg 67% 6%;
		--shadow-elevation-medium: -1px 1px 1.6px hsl(var(--shadow-color) / 0.36),
			-3.3px 3.3px 5.3px -0.8px hsl(var(--shadow-color) / 0.36),
			-8.2px 8.2px 13px -1.7px hsl(var(--shadow-color) / 0.36),
			-20px 20px 31.8px -2.5px hsl(var(--shadow-color) / 0.36);
	}

	.container {
		display: grid;
		place-items: center;
		grid-template-columns: 100%;
		min-height: 100vh;
		width: 100%;
		padding-top: var(--spacing-12);
	}

	.wrapper {
		display: grid;
		grid-template-columns: 100%;
		grid-template-areas: 'preview' 'thumbnails' 'heading';
		grid-template-rows: auto auto auto;
		width: min(calc(48rem - var(--spacing-outer)), var(--max-width-wrapper));
		margin: var(--spacing-6) var(--spacing-outer) var(--spacing-24);
		max-width: var(--max-width-full);
	}

	@media (width > 48rem) {
		.wrapper {
			margin: var(--spacing-6) auto var(--spacing-24);
			width: min(var(--max-width-full) - var(--spacing-24), var(--max-width-wrapper));
		}
	}

	.preview-container {
		grid-area: preview;
		aspect-ratio: 16 / 9;
		border-radius: var(--spacing-px-2);
		margin-bottom: var(--spacing-6);
		max-width: 100%;
	}

	.preview {
		border-radius: var(--spacing-px-2);
		box-shadow: var(--shadow-elevation-medium);
		outline: var(--spacing-px) solid var(--colour-brand);
		max-width: 100%;
		aspect-ratio: 16/ 9;
		height: auto;
	}

	.thumbnails-wrapper {
		grid-area: thumbnails;
		position: relative;
		min-height: var(--spacing-32);
	}

	.thumbnails {
		display: flex;
		position: absolute;
		top: 0;
		left: 0;
		width: var(--max-width-full);
		padding: var(--spacing-2);
		border-radius: var(--spacing-2);
		gap: var(--spacing-2);
		background: var(--colour-dark);
		align-items: center;
		justify-content: center;
		max-width: 100%;
	}

	.thumbnails:hover,
	.thumbnails:focus-within {
		--show: 1;
		height: var(--spacing-24);
	}

	.thumbnail {
		outline: none;
		height: auto;
		display: grid;
		place-items: center;
		transition: flex 0.2s;
		flex: calc(0.2 + (var(--lerp, 0) * 0.8));
		position: relative;
		min-height: var(--spacing-12);
		aspect-ratio: 16 /9;
	}

	.thumbnail:after {
		content: '';
		width: 5%;
		aspect-ratio: 1;
		background: var(--text-1);
		position: absolute;
		bottom: 10%;
		left: 50%;
		border-radius: var(--radius-3);
		transform: translate(-50%, -50%);
		z-index: -1;
	}

	.thumbnail:before {
		content: '';
		position: absolute;
		width: calc(100% + var(--spacing-5));
		bottom: 0;
		aspect-ratio: 1 / 2;
		left: 50%;
		transition: transform 0.2s;
		transform-origin: 50% 100%;
		transform: translateX(-50%) scaleY(var(--show, 0));
		z-index: -1;
	}

	.thumbnail-item {
		width: var(--max-width-full);
		width: 196px;
		aspect-ratio: 16 /9;
		border-radius: var(--spacing-1);
		background: var(--bg), var(--surface-1);
		display: inline-block;
		transition: transform 0.2s;
		transform-origin: 50% 100%;
		position: relative;
		transform: translateY(calc(var(--lerp) * -50%));
	}

	.thumbnail .thumbnail-item {
		transition: outline 0.2s;
		outline: var(--colour-brand) var(--spacing-px) solid;
	}

	:is(.thumbnails:hover, .thumbnails:focus-within) .thumbnail-item {
		width: var(--max-width-full);
	}

	:is(.thumbnail:hover, .thumbnail:focus-visible) {
		--lerp: var(--lerp-0);
		z-index: 5;
	}
	.thumbnail:has(+ :is(.thumbnail:hover, .thumbnail:focus-visible)),
	:is(.thumbnail:hover, .thumbnail:focus-visible) + .thumbnail {
		--lerp: var(--lerp-1);
		z-index: 4;
	}
	.thumbnail:has(+ .thumbnail + :is(.thumbnail:hover, .thumbnail:focus-visible)),
	:is(.thumbnail:hover, .thumbnail:focus-visible) + .thumbnail + .thumbnail {
		--lerp: var(--lerp-2);
		z-index: 3;
	}
	.thumbnail:has(+ .thumbnail + .thumbnail + :is(.thumbnail:hover, .thumbnail:focus-visible)),
	:is(.thumbnail:hover, .thumbnail:focus-visible) + .thumbnail + .thumbnail + .thumbnail {
		--lerp: var(--lerp-3);
		z-index: 2;
	}
	.thumbnail:has(+ .thumbnail
			+ .thumbnail
			+ .thumbnail
			+ :is(.thumbnail:hover, .thumbnail:focus-visible)),
	:is(.thumbnail:hover, .thumbnail:focus-visible)
		+ .thumbnail
		+ .thumbnail
		+ .thumbnail
		+ .thumbnail {
		--lerp: var(--lerp-4);
		z-index: 1;
	}

	h1 {
		grid-area: heading;
		color: var(--colour-light);
		font-size: var(--font-size-5);
		font-weight: var(--font-weight-bold);
		text-align: right;
		width: var(--max-width-full);
	}

	a {
		color: var(--colour-alt);
	}

	img {
		background-position: center center;
		background-size: cover;
		background-repeat: no-repeat;
	}
</style>
