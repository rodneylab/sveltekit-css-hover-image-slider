<script lang="ts">
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
	const THUMBNAIL_SIZES = [374, 543];
	const thumbnailSizes = '(max-width: 1024px) 100vw, 543px';
</script>

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
		<a
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
					src={`${src}?w=543}`}
					width={170}
				/></picture
			>
		</a>
	{/each}
</nav>

<style lang="postcss">
	/* Based on Jhey Thompkins CodePen: https://codepen.io/jh3y/pen/mdxggmO */

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

		overflow: auto;
		scroll-snap-type: x mandatory;
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

		scroll-snap-align: center;
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

	a {
		color: var(--colour-alt);
	}

	img {
		background-position: center center;
		background-size: cover;
		background-repeat: no-repeat;
	}
</style>
