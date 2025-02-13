function scrollCurrentIntoView(node: HTMLAnchorElement, current: boolean) {
	if (current) {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		node.scrollIntoView({
			behavior: prefersReducedMotion ? 'auto' : 'smooth',
			inline: 'center',
			block: 'end',
		});
	}
}

export default scrollCurrentIntoView;
