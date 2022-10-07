import { error } from '@sveltejs/kit';
import type { Readable } from 'node:stream';
import { createReadStream, statSync } from 'node:fs';
import { join } from 'path';
import sharp from 'sharp';
import { PassThrough } from 'node:stream';
import type { RequestHandler } from './$types';

async function metadata(
	source: string
): Promise<{ format?: string; width?: number; error?: string }> {
	try {
		const image = sharp(source);
		const { format, width } = await image.metadata();
		if (format) {
			return { format, width };
		}
	} catch (error: unknown) {
		console.error(`Error reading image metadata: ${source}: ${error}`);
	}
	return { error: `Error reading image metadata: ${source}` };
}

function resize(imageStream: Readable, width: number, format: string): ReturnType<RequestHandler> {
	let sharpTransforms;
	switch (format) {
		case 'jpeg':
			sharpTransforms = sharp().resize(width).jpeg({ mozjpeg: true });
			break;
		case 'avif':
			sharpTransforms = sharp().resize(width).avif({ quality: 80 });
			break;
		case 'webp':
			sharpTransforms = sharp().resize(width).webp({ quality: 80 });
			break;
		default:
			sharpTransforms = sharp();
	}
	const passthroughStream = new PassThrough();
	imageStream.pipe(sharpTransforms).pipe(passthroughStream);

	// @ts-expect-error respond with passthrough stream
	return new Response(passthroughStream as unknown);
}

export const GET: RequestHandler = async function get({ params, url, setHeaders }) {
	try {
		const { filename } = params;

		const srcPath = join('src/assets', filename);
		const fileStat = statSync(srcPath);

		if (!fileStat) {
			throw error(404, 'Not found');
		}

		const metadataPromise = metadata(srcPath);
		const readStream = createReadStream(srcPath);
		const { format, width } = await metadataPromise;

		if (!format || !readStream || !width) {
			throw error(404, 'Not found');
		}

		const { searchParams } = url;
		const outputWidthString = searchParams.get('w');
		const outputWidth = outputWidthString
			? Math.min(parseInt(outputWidthString, 10), width)
			: width;
		const outputFormat = searchParams.get('format') ?? format;

		setHeaders({
			'Content-Type': `image/${outputFormat}`,
			'Cache-Control': 'public, max-age=31536000, immutable'
		});

		return resize(readStream, outputWidth, outputFormat);
	} catch (err: unknown) {
		const httpError = err as { status: number; message: string };
		if (httpError.status && httpError.message) {
			throw error(httpError.status, httpError.message);
		}
		const { pathname } = url;
		const message = `Error in load function for path "${pathname}": ${err as string}`;
		console.error(message);
		throw error(500, message);
	}
};
