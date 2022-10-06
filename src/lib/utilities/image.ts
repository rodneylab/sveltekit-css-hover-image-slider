export interface ImageSrcInput {
	format: string;
	src: string;
	width: number;
}

interface ImageWidthsInput {
	densities: number[];
	sizes: number[];
}
type ImageSrcsetInput = ImageWidthsInput & Omit<ImageSrcInput, 'width'>;

function getSortedWidths({ densities, sizes }: ImageWidthsInput): number[] {
	const widths = new Set<number>();
	sizes.forEach((size) => {
		densities.forEach((density) => widths.add(Math.round(size * density)));
	});

	return [...widths].sort((a, b) => b - a);
}

export function getSrcset({ densities, sizes, src, format }: ImageSrcsetInput): string {
	const sortedWidths = getSortedWidths({ densities, sizes });

	return sortedWidths
		.map((element) => `${src}?w=${element}&format=${format} ${element}w`)
		.join(',');
}
