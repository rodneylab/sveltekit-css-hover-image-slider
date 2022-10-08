<script lang="ts">
	import Image from '$lib/components/Image.svelte';
	import Thumbnails from '$lib/components/Thumbnails.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let { image, images } = data;
	$: ({ image, images } = { ...data });

	let currentSlug = image.slug;
</script>

<svelte:head>
	<title>{image.title}</title>
</svelte:head>

<main class="container">
	<div class="wrapper">
		<h1 class="heading">SvelteKit CSS-only :hover Image Gallery</h1>
		<section class="preview-container">
			<Image {image} />
		</section>
		<div class="thumbnails-wrapper">
			<Thumbnails {currentSlug} {images} />
		</div>
	</div>
</main>

<style lang="postcss">
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

	.thumbnails-wrapper {
		grid-area: thumbnails;
		position: relative;
		min-height: var(--spacing-32);
	}

	h1 {
		grid-area: heading;
		color: var(--colour-light);
		font-size: var(--font-size-5);
		font-weight: var(--font-weight-bold);
		text-align: right;
		width: var(--max-width-full);
	}
</style>
