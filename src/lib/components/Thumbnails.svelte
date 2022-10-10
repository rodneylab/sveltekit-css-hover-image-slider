<script lang="ts">
	import scrollCurrentIntoView from '$lib/shared/actions/scrollCurrentIntoView';
	import { getSrcset } from '$lib/utilities/image';

	export let images: {
		alt: any;
		title: any;
		placeholder: string;
		slug: string;
		src: string;
	}[];
	export let currentSlug: string;

	const densities = [1.0, 2.0];
	const THUMBNAIL_SIZES = [144, 307, 542];
	const thumbnailSizes =
		'(max-width: 768px) 40vw, (max-width: 1024px) 287px, (max-width: 1280px) 400px, 542px';
</script>

<nav class="thumbnails">
	<div aria-hidden="true" class="overscroller" />
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
		<a
			use:scrollCurrentIntoView={slug === currentSlug}
			data-sveltekit-prefetch
			data-sveltekit-reload
			aria-current={slug === currentSlug}
			href={`/${slug}`}
			class="thumbnail"
		>
			<picture>
				<source sizes={thumbnailSizes} srcset={avifThumbnailSrcset} type="image/avif" width={170} />
				<source sizes={thumbnailSizes} srcset={webpThumbnailSrcset} type="image/webp" width={170} />
				<source sizes={thumbnailSizes} srcset={jpgThumbnailSrcset} type="image/jpeg" width={170} />
				<img
					style:background="url('{placeholder}')"
					style:background-size="cover"
					{alt}
					class="thumbnail-item"
					loading="lazy"
					src={`${src}?w=542}`}
					width={542}
					height={305}
				/></picture
			>
		</a>
	{/each}
	<div aria-hidden="true" class="overscroller" />
</nav>

<style lang="postcss">
	/* Based on Jhey Thompkins CodePen: https://codepen.io/jh3y/pen/mdxggmO 
	 * and Adam Argyle git repo: https://github.com/argyleink/2022-css-day_oh-snap
	 */

	.thumbnails {
		display: flex;
		overflow-x: auto;
		border-radius: var(--spacing-2);
		gap: var(--spacing-4);
		background: var(--colour-dark);
		overscroll-behavior-x: contain;
		scroll-snap-type: x mandatory;
		padding: var(--spacing-4);
		scroll-padding: var(--spacing-4);
	}

	.thumbnails::-webkit-scrollbar {
		background: transparent;
	}

	.thumbnails::-webkit-scrollbar-thumb {
		background: var(--colour-alt);
		border-radius: var(--spacing-2);
	}

	.thumbnails::-webkit-scrollbar-track {
		background: var(--colour-dark);
		border-radius: var(--spacing-2);
	}

	.thumbnail {
		/* padding-block: auto; */
		@media (width > 48rem) {
			outline: none;
			height: auto;
			display: grid;
			place-items: center;
			transition: flex 0.2s;
			flex: calc(0.2 + (var(--lerp, 0) * 0.8));
			position: relative;
		}
	}

	.thumbnails > :not(.overscroller) {
		scroll-snap-align: center;
		scroll-snap-stop: always;
	}

	.thumbnail:nth-child(2) {
		scroll-snap-align: start;
	}

	.thumbnail:nth-last-child(2) {
		scroll-snap-align: end;
	}

	.overscroller {
		display: block;
		inline-size: 15vw;
		flex: 0 0 auto;
	}

	.thumbnail-item {
		width: 40vw;
		height: auto;
		aspect-ratio: 16 / 10;
		border-radius: var(--spacing-1);

		@media (width > 48rem) {
			display: inline-block;
			border-style: none;
			width: 125px;

			transition: transform 0.2s;
			transform-origin: 50% 100%;
			position: relative;
			transform: translateY(calc(var(--lerp) * -50%));
		}

		@media (width > 64rem) {
			width: 144px;
		}

		@media (width > 80rem) {
			width: 196px;
		}
	}

	.thumbnail-item:hover {
		border: var(--spacing-px-2) solid var(--colour-light);
	}

	@media (width > 48rem) {
		.overscroller {
			display: none;
		}

		.thumbnails {
			position: absolute;
			top: 0;
			left: 0;
			overflow-x: unset;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: var(--spacing-2);
			padding: var(--spacing-2);
		}
	}

	.thumbnails:hover,
	.thumbnails:focus-within {
		@media (width > 48rem) {
			--show: 1;
			height: var(--spacing-24);
		}
	}

	[aria-current='true'] .thumbnail-item {
		outline: var(--spacing-px-2) solid var(--colour-brand);
	}

	@media (width > 48rem) {
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
	}

	a {
		color: var(--colour-alt);
	}

	picture {
		display: flex;
	}

	img {
		background-position: center center;
		background-repeat: no-repeat;
	}
</style>
