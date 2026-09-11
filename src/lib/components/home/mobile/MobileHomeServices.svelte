<script lang="ts">
	import { ChevronRight } from '@lucide/svelte';
	import { resolve } from '$app/paths';

	const actions = [
		{
			title: 'Продай / Бартер',
			text: 'Бърза оценка на твоя автомобил',
			href: '/sell-your-car' as const,
			tone: 'red',
			image: '/assets/images/home-promos/sell-studio-v1.webp'
		},
		{
			title: 'Внос по заявка',
			text: 'Автомобил от Европа по твоите критерии',
			href: '/contact?intent=import' as const,
			tone: 'dark',
			image: '/assets/images/import/import-handoff-graphite-campaign-v2.webp'
		},
		{
			title: 'Финансиране',
			text: 'Ясни условия според бюджета',
			href: '/financing' as const,
			tone: 'blue',
			image: '/assets/images/home-promos/kristian-financing-campaign-v1.webp'
		},
		{
			title: 'Услуги',
			text: 'Оглед, документи и съдействие',
			href: '/services' as const,
			tone: 'light',
			image: '/assets/images/services/support-hero-v1.webp'
		}
	] as const;
</script>

<section class="mobile-home-services" aria-labelledby="mobile-home-services-title">
	<header class="mobile-home-services__head">
		<h2 id="mobile-home-services-title">Още от Day Night</h2>
		<span>Плъзни</span>
	</header>
	<div class="mobile-home-services__rail">
		{#each actions as action (action.href)}
			<a
				class={`mobile-home-service mobile-home-service--${action.tone}`}
				href={resolve(action.href)}
			>
				<img src={action.image} alt="" loading="lazy" decoding="async" />
				<span class="mobile-home-service__shade" aria-hidden="true"></span>
				<span class="mobile-home-service__copy">
					<strong>{action.title}</strong>
					<small>{action.text}</small>
					<span class="mobile-home-service__go" aria-hidden="true"
						><ChevronRight size={17} strokeWidth={2.5} /></span
					>
				</span>
			</a>
		{/each}
	</div>
</section>

<style>
	.mobile-home-services {
		display: grid;
		gap: 9px;
		padding: 0 var(--sa-mobile-gutter);
	}
	.mobile-home-services__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}
	.mobile-home-services__head h2 {
		margin: 0;
		color: var(--sa-ink);
		font-size: var(--sa-mobile-type-section-title);
		font-weight: var(--sa-weight-strong);
		line-height: var(--sa-mobile-leading-heading);
	}
	.mobile-home-services__head > span {
		color: var(--sa-muted);
		font-size: var(--sa-mobile-type-meta);
		font-weight: var(--sa-weight-medium);
	}
	.mobile-home-services__rail {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: min(82vw, 318px);
		gap: 10px;
		overflow-x: auto;
		margin-inline: calc(var(--sa-mobile-gutter) * -1);
		padding: 0 var(--sa-mobile-gutter) 4px;
		scroll-padding-inline: var(--sa-mobile-gutter);
		scroll-snap-type: x proximity;
		scrollbar-width: none;
	}
	.mobile-home-services__rail::-webkit-scrollbar {
		display: none;
	}
	.mobile-home-service {
		position: relative;
		display: block;
		height: 150px;
		overflow: hidden;
		border-radius: 14px;
		background: #111315;
		color: #fff !important;
		text-decoration: none;
		isolation: isolate;
		scroll-snap-align: start;
	}
	.mobile-home-service > img {
		position: absolute;
		inset: 0;
		z-index: -2;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 68% center;
	}
	.mobile-home-service__shade {
		position: absolute;
		inset: 0;
		z-index: -1;
		background: linear-gradient(
			90deg,
			rgba(9, 12, 17, 0.96) 0%,
			rgba(9, 12, 17, 0.84) 43%,
			rgba(9, 12, 17, 0.14) 100%
		);
	}
	.mobile-home-service--red .mobile-home-service__shade {
		background: linear-gradient(
			90deg,
			rgba(151, 0, 24, 0.98) 0%,
			rgba(151, 0, 24, 0.88) 44%,
			rgba(70, 0, 12, 0.12) 100%
		);
	}
	.mobile-home-service--blue .mobile-home-service__shade {
		background: linear-gradient(
			90deg,
			rgba(5, 33, 103, 0.98) 0%,
			rgba(5, 33, 103, 0.88) 44%,
			rgba(5, 33, 103, 0.12) 100%
		);
	}
	.mobile-home-service--light {
		color: #111827 !important;
		background: #eef2f6;
	}
	.mobile-home-service--light .mobile-home-service__shade {
		background: linear-gradient(
			90deg,
			rgba(244, 247, 251, 0.99) 0%,
			rgba(244, 247, 251, 0.92) 46%,
			rgba(244, 247, 251, 0.18) 100%
		);
	}
	.mobile-home-service--red > img {
		object-position: 66% center;
	}
	.mobile-home-service--dark > img {
		object-position: 74% center;
	}
	.mobile-home-service--blue > img {
		object-position: 74% center;
	}
	.mobile-home-service--light > img {
		object-position: 75% center;
	}
	.mobile-home-service__copy {
		display: flex;
		height: 100%;
		box-sizing: border-box;
		flex-direction: column;
		align-items: flex-start;
		padding: 16px;
		color: inherit !important;
	}
	.mobile-home-service strong,
	.mobile-home-service small {
		color: inherit !important;
		-webkit-text-fill-color: currentColor !important;
	}
	.mobile-home-service strong {
		max-width: 12ch;
		font-size: var(--sa-mobile-type-feature-title);
		font-weight: var(--sa-weight-strong);
		line-height: var(--sa-mobile-leading-heading);
		letter-spacing: -0.02em;
	}
	.mobile-home-service small {
		max-width: 21ch;
		margin-top: 6px;
		font-size: var(--sa-mobile-type-meta);
		font-weight: var(--sa-weight-medium);
		line-height: var(--sa-mobile-leading-meta);
		opacity: 0.92;
	}
	.mobile-home-service__go {
		display: grid;
		width: 36px;
		height: 36px;
		margin-top: auto;
		place-items: center;
		border: 1px solid currentColor;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.12);
		color: inherit !important;
	}
	.mobile-home-service--light .mobile-home-service__go {
		background: rgba(255, 255, 255, 0.58);
	}
	.mobile-home-service:focus-visible {
		outline: 3px solid var(--sa-red);
		outline-offset: 3px;
	}
	@media (max-width: 370px) {
		.mobile-home-services {
			padding-inline: 12px;
		}
		.mobile-home-services__rail {
			margin-inline: -12px;
			padding-inline: 12px;
			scroll-padding-inline: 12px;
			grid-auto-columns: min(84vw, 306px);
		}
	}
</style>
