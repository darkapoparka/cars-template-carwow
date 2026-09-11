<script lang="ts">
	import { ArrowRight, CircleHelp, Link2, ScanLine } from '@lucide/svelte';
	import MobileHeroBar from '$lib/components/shared/MobileHeroBar.svelte';

	let {
		kind,
		title,
		value = $bindable(''),
		placeholder,
		meta = '',
		infoLabel = 'Как работи',
		onSubmit,
		onInfo,
		showLocation = true
	}: {
		kind: 'sell' | 'import';
		title: string;
		value?: string;
		placeholder: string;
		meta?: string;
		infoLabel?: string;
		onSubmit: () => void;
		onInfo: () => void;
		showLocation?: boolean;
	} = $props();

	const inputLabel = $derived(
		kind === 'sell' ? 'Регистрационен номер или VIN' : 'Линк към обява или VIN'
	);

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		onSubmit();
	}
</script>

<header class="mobile-lead-hero">
	<MobileHeroBar {showLocation} />
	<h1>{title}</h1>
	<form class="mobile-lead-hero__search" onsubmit={handleSubmit}>
		<span class="mobile-lead-hero__input-icon" aria-hidden="true">
			{#if kind === 'sell'}
				<ScanLine size={21} strokeWidth={2.2} />
			{:else}
				<Link2 size={21} strokeWidth={2.2} />
			{/if}
		</span>
		<input
			bind:value
			type="text"
			inputmode={kind === 'import' ? 'url' : 'text'}
			enterkeyhint="go"
			autocomplete="off"
			{placeholder}
			aria-label={inputLabel}
		/>
		<button type="submit" aria-label="Продължи">
			<ArrowRight size={21} strokeWidth={2.6} aria-hidden="true" />
		</button>
	</form>
	<div class:mobile-lead-hero__meta--info-only={!meta} class="mobile-lead-hero__meta">
		{#if meta}<strong>{meta}</strong>{/if}
		<button type="button" onclick={onInfo}>
			<CircleHelp size={17} strokeWidth={2.15} aria-hidden="true" />
			<span>{infoLabel}</span>
		</button>
	</div>
</header>

<style>
	.mobile-lead-hero {
		display: grid;
		gap: 13px;
		background: var(--sa-blue);
		color: #fff;
		padding: calc(env(safe-area-inset-top) + 12px) var(--sa-mobile-gutter-wide) 18px;
	}

	.mobile-lead-hero h1 {
		margin: 2px 0 0;
		font-size: var(--sa-mobile-type-page-title);
		font-weight: var(--sa-weight-display);
		line-height: var(--sa-mobile-leading-heading);
		letter-spacing: 0;
	}

	.mobile-lead-hero__search {
		display: grid;
		grid-template-columns: 24px minmax(0, 1fr) var(--sa-mobile-pill-h);
		align-items: center;
		gap: 9px;
		min-height: 52px;
		border-radius: var(--sa-r-pill);
		background: #fff;
		padding: 4px 4px 4px 15px;
		box-shadow: 0 10px 26px rgba(0, 0, 0, 0.18);
	}

	.mobile-lead-hero__input-icon {
		display: grid;
		place-items: center;
		color: #65717e;
	}

	.mobile-lead-hero__input-icon :global(svg),
	.mobile-lead-hero__input-icon :global(svg *) {
		stroke: currentColor !important;
	}

	.mobile-lead-hero__search input {
		width: 100%;
		min-width: 0;
		border: 0;
		background: transparent;
		color: var(--sa-ink);
		font: var(--sa-weight-medium) var(--sa-mobile-type-input) / 1.2 var(--sa-font);
		outline: 0;
		padding: 0;
	}

	.mobile-lead-hero__search input::placeholder {
		color: #66717f;
		opacity: 1;
	}

	.mobile-lead-hero__search:focus-within {
		box-shadow:
			0 0 0 2px rgba(213, 0, 50, 0.72),
			0 10px 26px rgba(0, 0, 0, 0.18);
	}

	.mobile-lead-hero__search button {
		display: grid;
		width: var(--sa-mobile-pill-h);
		height: var(--sa-mobile-pill-h);
		place-items: center;
		border: 0;
		border-radius: 50%;
		background: var(--sa-red);
		color: #fff;
		padding: 0;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}

	.mobile-lead-hero__search button:active {
		transform: scale(0.95);
	}

	.mobile-lead-hero__search button :global(svg),
	.mobile-lead-hero__search button :global(svg *) {
		stroke: #fff !important;
	}

	.mobile-lead-hero__meta {
		display: flex;
		min-height: 32px;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.mobile-lead-hero__meta--info-only {
		justify-content: flex-end;
	}

	.mobile-lead-hero__meta strong {
		font-size: var(--sa-mobile-type-micro);
		font-weight: var(--sa-weight-semibold);
		line-height: 1.2;
	}

	.mobile-lead-hero__meta button {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		gap: 6px;
		border: 0;
		background: transparent;
		color: #fff;
		font: var(--sa-weight-semibold) var(--sa-mobile-type-micro) / 1.2 var(--sa-font);
		padding: 0 2px 0 10px;
		cursor: pointer;
	}

	.mobile-lead-hero__meta button :global(svg),
	.mobile-lead-hero__meta button :global(svg *) {
		stroke: currentColor !important;
	}

	.mobile-lead-hero__meta button:focus-visible,
	.mobile-lead-hero__search button:focus-visible {
		outline: 2px solid #fff;
		outline-offset: 2px;
	}
</style>
