<script lang="ts">
	import { ChevronRight, PhoneCall } from '@lucide/svelte';

	let {
		phoneHref,
		title = 'Искаш помощ?',
		copy = 'Говори директно с екипа ни.'
	}: { phoneHref: string; title?: string; copy?: string } = $props();
</script>

<aside class="lead-contact" aria-label="Контакт с Day Night Auto">
	<span class="lead-contact__icon" aria-hidden="true">
		<PhoneCall size={19} strokeWidth={2.2} />
	</span>
	<span class="lead-contact__copy">
		<strong>{title}</strong>
		<small>{copy}</small>
	</span>
	<a href={phoneHref}>Обади се <ChevronRight size={15} strokeWidth={2.5} /></a>
</aside>

<style>
	.lead-contact {
		display: grid;
		grid-template-columns: 38px minmax(0, 1fr) auto;
		align-items: center;
		gap: 10px;
		min-height: 64px;
		border: 1px solid #e0e5eb;
		border-radius: 14px;
		background: #f7f9fb;
		padding: 9px 10px;
	}

	.lead-contact__icon {
		display: grid;
		width: 38px;
		height: 38px;
		place-items: center;
		border-radius: 50%;
		background: #fff;
		color: var(--sa-red);
	}

	.lead-contact__copy {
		display: grid;
		gap: 2px;
		min-width: 0;
	}
	.lead-contact strong {
		font-size: 14px;
		line-height: 1.15;
	}
	.lead-contact small {
		color: var(--sa-muted);
		font-size: 11px;
		line-height: 1.2;
	}
	.lead-contact a {
		display: inline-flex;
		min-height: 40px;
		align-items: center;
		gap: 3px;
		border-radius: 999px;
		background: var(--sa-red);
		color: #fff;
		padding: 0 11px;
		font-size: 12px;
		font-weight: var(--sa-weight-semibold);
		text-decoration: none;
	}
	.lead-contact a:focus-visible {
		outline: 2px solid var(--sa-red);
		outline-offset: 2px;
	}
</style>
