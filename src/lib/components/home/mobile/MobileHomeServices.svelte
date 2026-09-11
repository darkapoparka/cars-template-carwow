<script lang="ts">
	import { ChevronRight } from '@lucide/svelte';
	import { resolve } from '$app/paths';

	const actions = [
		{
			title: 'Продай / Бартер',
			text: 'Бърза оценка на автомобила',
			cta: 'Заяви оценка',
			href: '/sell-your-car' as const,
			tone: 'sell',
			image: '/assets/images/home-promos/sell-studio-v1.webp'
		},
		{
			title: 'Внос по заявка',
			text: 'Автомобил от Европа по твоите критерии',
			cta: 'Заяви внос',
			href: '/contact?intent=import' as const,
			tone: 'import',
			image: '/assets/images/import/import-handoff-graphite-campaign-v2.webp'
		}
	] as const;
</script>

<section class="mobile-home-services" aria-labelledby="mobile-home-services-title">
	<div class="mobile-home-services__head">
		<h2 id="mobile-home-services-title">Продай или внеси</h2>
	</div>
	<div class="mobile-home-services__stack">
		{#each actions as action (action.href)}
			<a
				class={`mobile-home-service mobile-home-service--${action.tone}`}
				href={resolve(action.href)}
			>
				<span class="mobile-home-service__copy">
					<strong>{action.title}</strong>
					<small>{action.text}</small>
					<span class="mobile-home-service__cta">
						{action.cta}
						<ChevronRight size={15} strokeWidth={2.5} />
					</span>
				</span>
				<img src={resolve(action.image)} alt="" loading="lazy" decoding="async" />
			</a>
		{/each}
	</div>
</section>

<style>
	.mobile-home-services {
		display: grid;
		gap: 10px;
		padding: 0 var(--sa-mobile-gutter);
	}
	.mobile-home-services__head h2 {
		margin: 0;
		font-size: var(--sa-mobile-type-section-title);
		font-weight: var(--sa-weight-strong);
		line-height: var(--sa-mobile-leading-heading);
	}

	.mobile-home-services__stack {
		display: grid;
		gap: 10px;
	}

	.mobile-home-service {
		position: relative;
		display: grid;
		min-height: 132px;
		grid-template-columns: minmax(0, 1fr) 46%;
		overflow: hidden;
		border-radius: 14px;
		text-decoration: none;
		isolation: isolate;
	}

	.mobile-home-service--sell {
		background: #f6ece9;
		color: #15171a !important;
	}
	.mobile-home-service--import {
		background: #151719;
		color: #fff !important;
	}

	.mobile-home-service--import :is(strong, small) {
		color: #fff !important;
		-webkit-text-fill-color: #fff !important;
	}

	.mobile-home-service__copy {
		position: relative;
		z-index: 2;
		display: flex;
		min-width: 0;
		flex-direction: column;
		align-items: flex-start;
		padding: 16px 8px 14px 16px;
	}

	.mobile-home-service strong {
		font-size: var(--sa-mobile-type-feature-title);
		font-weight: var(--sa-weight-strong);
		line-height: var(--sa-mobile-leading-heading);
	}

	.mobile-home-service small {
		max-width: 18ch;
		margin-top: 5px;
		font-size: var(--sa-mobile-type-meta);
		font-weight: var(--sa-weight-medium);
		line-height: var(--sa-mobile-leading-meta);
		color: inherit;
		opacity: 0.78;
	}
	.mobile-home-service__cta {
		display: inline-flex;
		min-height: 36px;
		align-items: center;
		gap: 4px;
		margin-top: auto;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.72);
		padding: 0 11px;
		font-size: var(--sa-mobile-type-meta);
		font-weight: var(--sa-weight-semibold);
		color: #15171a;
	}

	.mobile-home-service--import .mobile-home-service__cta {
		border: 1px solid rgba(255, 255, 255, 0.2);
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
	}

	.mobile-home-service > img {
		position: absolute;
		top: 0;
		right: 0;
		width: 54%;
		height: 100%;
		object-fit: cover;
		object-position: 72% center;
	}
	.mobile-home-service--sell > img {
		object-position: 80% center;
	}

	.mobile-home-service--import > img {
		object-position: 70% center;
	}

	.mobile-home-service:focus-visible {
		outline: 3px solid var(--sa-red);
		outline-offset: 3px;
	}

	@media (max-width: 370px) {
		.mobile-home-services {
			padding-inline: 12px;
		}
		.mobile-home-service {
			min-height: 126px;
			grid-template-columns: minmax(0, 1fr) 43%;
		}
		.mobile-home-service__copy {
			padding: 14px 6px 12px 14px;
		}
		.mobile-home-service > img {
			width: 51%;
		}
	}
</style>
