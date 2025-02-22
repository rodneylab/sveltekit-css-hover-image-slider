<script lang="ts">
	import Image from '$lib/components/Image.svelte';
	import Thumbnails from '$lib/components/Thumbnails.svelte';
	import '$lib/styles/global.css';
	import type { PageData } from './$types';
	import '@fontsource/figtree';

	let { data }: { data: PageData } = $props();

	let { image, images } = $derived(data);

	let currentSlug = $derived(image.slug);
</script>

<svelte:head>
	<title>{image.title} | Svelte CSS Image Slider</title>
	<meta
		name="description"
		content="Svelte CSS image slider: how to create a CSS :hover preview image gallery with mobile bouncing overscroll using future CSS and SvelteKit."
	/>
</svelte:head>

<main class="container">
	<div class="wrapper">
		<h1 class="heading">Svelte CSS Image Slider</h1>
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
		grid-template-columns: var(--max-width-full);
		min-height: 100vh;
		width: var(--max-width-full);
		padding-top: var(--spacing-12);
	}

	.wrapper {
		display: grid;
		grid-template-columns: var(--max-width-full);
		grid-template-areas: 'preview' 'thumbnails' 'heading';
		grid-template-rows: auto auto auto;
		width: calc(var(--max-width-full) - var(--spacing-12));
		padding: var(--spacing-6) var(--spacing-outer) var(--spacing-24);
		max-width: var(--max-width-full);
	}

	@media (width > 48rem) {
		.wrapper {
			padding: var(--spacing-6) auto var(--spacing-24);
			width: min(var(--max-width-full), var(--_max-width-wrapper));
		}
	}

	.preview-container {
		grid-area: preview;
		aspect-ratio: 16 / 10;
		border-radius: var(--spacing-px-2);
		margin-bottom: var(--spacing-6);
		max-width: 100%;
	}

	.thumbnails-wrapper {
		grid-area: thumbnails;
		position: relative;
		min-height: var(--spacing-28);

		@media (width > 80rem) {
			min-height: var(--spacing-36);
		}
	}

	h1 {
		grid-area: heading;
		color: var(--colour-light);
		font-size: var(--font-size-3);
		font-weight: var(--font-weight-bold);
		text-align: right;
		width: var(--max-width-full);

		@media (width > 42rem) {
			font-size: var(--font-size-4);
		}

		@media (width > 64rem) {
			font-size: var(--font-size-5);
		}
	}
</style>
