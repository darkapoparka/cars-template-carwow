<script lang="ts">
	let {
		title,
		copy,
		image,
		label,
		onOpen
	}: {
		title: string;
		copy: string;
		image: string;
		label: string;
		onOpen: () => void;
	} = $props();
</script>

<button class="lead-manual-card" type="button" onclick={onOpen} aria-label={label}>
	<span class="copy"><strong>{title}</strong><small>{copy}</small></span>
	<img src={image} alt="" aria-hidden="true" />
</button>

<style>
	.lead-manual-card {
		position: relative;
		display: grid;
		width: 100%;
		min-height: 156px;
		align-items: center;
		overflow: hidden;
		text-align: left;
		cursor: pointer;
		border: 1px solid var(--sa-line-strong);
		border-radius: var(--sa-r-md);
		background: var(--sa-bg);
		padding: var(--sa-mobile-gap-lg);
		-webkit-tap-highlight-color: transparent;
	}
	.copy {
		position: relative;
		z-index: 2;
		display: grid;
		gap: var(--sa-mobile-gap-xs);
		width: 48%;
		min-width: 0;
	}
	strong {
		max-width: 12ch;
		color: var(--sa-ink);
		font-size: var(--sa-mobile-type-feature-title);
		font-weight: var(--sa-weight-strong);
		line-height: var(--sa-mobile-leading-heading);
	}
	small {
		max-width: 20ch;
		color: var(--sa-ink-soft);
		font-size: var(--sa-mobile-type-meta);
		line-height: var(--sa-mobile-leading-meta);
	}
	img {
		position: absolute;
		top: var(--sa-mobile-gap-xs);
		right: var(--sa-mobile-gap-xs);
		bottom: var(--sa-mobile-gap-xs);
		width: 53%;
		height: calc(100% - 2 * var(--sa-mobile-gap-xs));
		border-radius: var(--sa-r-sm);
		object-fit: cover;
		object-position: right center;
	}
	.lead-manual-card::after {
		position: absolute;
		inset: 0 40% 0 0;
		z-index: 1;
		background: linear-gradient(90deg, var(--sa-bg) 72%, transparent);
		content: '';
		pointer-events: none;
	}
	.lead-manual-card:active {
		transform: scale(0.995);
	}
	.lead-manual-card:focus-visible {
		outline: 2px solid var(--sa-red);
		outline-offset: 3px;
	}
</style>
