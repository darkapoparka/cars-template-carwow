<script lang="ts">
	import { ChevronRight } from '@lucide/svelte';
	import { resolve } from '$app/paths';

	type PromoKind = 'sell' | 'import' | 'all';
	let { kind = 'all' }: { kind?: PromoKind } = $props();

	const promos = [
		{
			kind: 'sell',
			title: 'Продай / Бартер',
			text: 'Бърза оценка на автомобила',
			cta: 'Заяви оценка',
			href: '/sell-your-car' as const,
			tone: 'light',
			image: '/assets/images/home-promos/sell-studio-v1.webp'
		},
		{
			kind: 'import',
			title: 'Внос от Европа',
			text: 'Проверка, транспорт и документи',
			cta: 'Заяви внос',
			href: '/contact?intent=import' as const,
			tone: 'dark',
			image: '/assets/images/import/import-delivery-handoff-banner-v1.webp'
		}
	] as const;

	const visiblePromos = $derived(
		kind === 'all' ? promos : promos.filter((promo) => promo.kind === kind)
	);
	const sectionLabel = $derived(
		kind === 'sell'
			? 'Продай или замени автомобил'
			: kind === 'import'
				? 'Внос от Европа'
				: 'Продажба и внос'
	);
</script>

<section class="mobile-home-promos" aria-label={sectionLabel}>
	{#each visiblePromos as promo (promo.href)}
		<a class={`mobile-home-promo mobile-home-promo--${promo.tone}`} href={resolve(promo.href)}>
			<img src={resolve(promo.image)} alt="" loading="lazy" decoding="async" />
			<span class="mobile-home-promo__shade" aria-hidden="true"></span>
			<span class="mobile-home-promo__copy">
				<strong>{promo.title}</strong>
				<small>{promo.text}</small>
				<span class="mobile-home-promo__cta">
					{promo.cta}
					<ChevronRight size={15} strokeWidth={2.6} aria-hidden="true" />
				</span>
			</span>
		</a>
	{/each}
</section>

<style>
	.mobile-home-promos {
		display: grid;
		gap: 10px;
		padding: 0 var(--sa-mobile-gutter);
	}

	.mobile-home-promo {
		position: relative;
		display: block;
		min-height: 146px;
		overflow: hidden;
		border-radius: 14px;
		text-decoration: none;
		isolation: isolate;
	}
	.mobile-home-promo > img {
		position: absolute;
		inset: 0;
		z-index: -2;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.mobile-home-promo--light > img {
		object-position: 64% center;
	}

	.mobile-home-promo--dark > img {
		object-position: 72% center;
	}

	.mobile-home-promo__shade {
		position: absolute;
		inset: 0;
		z-index: -1;
	}

	.mobile-home-promo--light .mobile-home-promo__shade {
		background: linear-gradient(
			90deg,
			rgba(247, 238, 236, 0.98) 0%,
			rgba(247, 238, 236, 0.9) 44%,
			rgba(247, 238, 236, 0.05) 78%
		);
	}

	.mobile-home-promo--dark .mobile-home-promo__shade {
		background: linear-gradient(
			90deg,
			rgba(10, 12, 15, 0.98) 0%,
			rgba(10, 12, 15, 0.9) 46%,
			rgba(10, 12, 15, 0.18) 80%
		);
	}
	.mobile-home-promo__copy {
		display: flex;
		min-height: 146px;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		gap: 5px;
		padding: 17px 16px;
	}

	.mobile-home-promo strong {
		max-width: 14ch;
		font-size: var(--sa-mobile-type-feature-title);
		font-weight: var(--sa-weight-strong);
		line-height: var(--sa-mobile-leading-heading);
	}

	.mobile-home-promo small {
		max-width: 21ch;
		font-size: var(--sa-mobile-type-meta);
		font-weight: var(--sa-weight-medium);
		line-height: var(--sa-mobile-leading-meta);
	}

	.mobile-home-promo--light {
		color: #17191d !important;
	}

	.mobile-home-promo--dark {
		color: #fff !important;
	}
	.mobile-home-promo strong,
	.mobile-home-promo small {
		color: inherit !important;
		-webkit-text-fill-color: currentColor !important;
	}

	.mobile-home-promo--dark .mobile-home-promo__copy > strong,
	.mobile-home-promo--dark .mobile-home-promo__copy > small {
		color: #fff !important;
		-webkit-text-fill-color: #fff !important;
	}

	.mobile-home-promo__cta {
		display: inline-flex;
		min-height: 40px;
		align-items: center;
		justify-content: center;
		gap: 4px;
		margin-top: 6px;
		border-radius: 999px;
		padding: 0 13px;
		font-size: var(--sa-mobile-type-control-sm);
		font-weight: var(--sa-weight-semibold);
		line-height: 1;
	}

	.mobile-home-promo--light .mobile-home-promo__cta {
		background: #111315;
		color: #fff;
	}

	.mobile-home-promo--dark .mobile-home-promo__cta {
		background: #fff;
		color: #111315;
	}

	.mobile-home-promo :global(svg),
	.mobile-home-promo :global(svg *) {
		stroke: currentColor !important;
	}

	.mobile-home-promo:focus-visible {
		outline: 3px solid var(--sa-red);
		outline-offset: 3px;
	}
	@media (max-width: 370px) {
		.mobile-home-promos {
			padding-inline: 12px;
		}

		.mobile-home-promo,
		.mobile-home-promo__copy {
			min-height: 140px;
		}

		.mobile-home-promo__copy {
			padding: 15px 14px;
		}
	}
</style>
