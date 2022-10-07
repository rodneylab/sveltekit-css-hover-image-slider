import sharp from 'sharp';
import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';

export async function base64(imageSource: string, width = 10): Promise<string> {
	const image = sharp(imageSource);
	const bufferPromise = image
		.resize(width, null)
		.jpeg({
			quality: 50,
			progressive: true,
			optimiseScans: true,
			chromaSubsampling: '4:2:0',
			trellisQuantisation: true,
			quantisationTable: 2
		})
		.toBuffer({ resolveWithObject: false });
	const metadataPromise = image.metadata();

	const [buffer, { format }] = await Promise.all([bufferPromise, metadataPromise]);

	return `data:image/${format};base64,${buffer.toString('base64')}`;
}

export function hash(path: string): string {
	const fileBuffer = readFileSync(path);
	const hashSum = crypto.createHash('md5');
	hashSum.update(fileBuffer);
	return hashSum.digest('hex').slice(0, 10);
}
