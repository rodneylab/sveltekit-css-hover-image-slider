import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async function handle({ event, resolve }) {
	const response = await resolve(event);
	response.headers.set('X-Frame-Options', 'SAMEORIGIN');
	response.headers.set('Referrer-Policy', 'no-referrer');
	response.headers.set(
		'Permissions-Policy',
		'accelerometer=(), autoplay=(), camera=(), document-domain=(), encrypted-media=(), fullscreen=(), gyroscope=(), interest-cohort=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), sync-xhr=(), usb=(), xr-spatial-tracking=(), geolocation=()',
	);
	response.headers.set('X-Content-Type-Options', 'nosniff');
	// response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
	return response;
};
