<script lang="ts">
	import { resolve } from '$app/paths';
	import { daynightSite } from '$lib/data/daynight-site';
	import { footerSocialLinks, type FooterSocialIcon } from './mobile-home-data';
</script>

<footer class="mh-footer">
	<div class="mh-footer__brand">
		<img class="mh-footer__logo" src={resolve(daynightSite.logoLight)} alt={daynightSite.name} />
		<p>
			Автокъща в {daynightSite.city} с подбрани употребявани автомобили. Съдействие за документи, регистрация,
			финансиране и доставка.
		</p>
	</div>
	<nav class="mh-footer__social" aria-label="Социални канали и обяви">
		{#snippet footerSocialIcon(icon: FooterSocialIcon)}
			{#if icon === 'facebook'}
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
					<path
						d="M11.4 18.75V10.63H14.13L14.54 7.46H11.4V5.43C11.4 4.51 11.66 3.88 12.98 3.88H14.66V1.04C14.36 1 13.36 0.92 12.2 0.92C9.78 0.92 8.13 2.39 8.13 5.11V7.46H5.39V10.63H8.13V18.75H11.4Z"
						stroke="currentColor"
						stroke-width="1.2"
						stroke-linejoin="round"
					/>
				</svg>
			{:else if icon === 'instagram'}
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
					<rect
						x="2.5"
						y="2.5"
						width="15"
						height="15"
						rx="4.5"
						stroke="currentColor"
						stroke-width="1.4"
					/>
					<circle cx="10" cy="10" r="3.35" stroke="currentColor" stroke-width="1.4" />
					<circle cx="14.2" cy="5.8" r="0.9" fill="currentColor" />
				</svg>
			{:else}
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path
						d="M5 17H3.8C3.36 17 3 16.64 3 16.2V13.28C3 12.41 3.56 11.64 4.39 11.37L6.25 10.77L8 6.85C8.33 6.13 9.04 5.66 9.83 5.66H14.17C14.96 5.66 15.67 6.13 16 6.85L17.75 10.77L19.61 11.37C20.44 11.64 21 12.41 21 13.28V16.2C21 16.64 20.64 17 20.2 17H19"
						stroke="currentColor"
						stroke-width="1.6"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M6.25 10.75H17.75"
						stroke="currentColor"
						stroke-width="1.6"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M8.5 17C8.5 18.1 7.6 19 6.5 19C5.4 19 4.5 18.1 4.5 17C4.5 15.9 5.4 15 6.5 15C7.6 15 8.5 15.9 8.5 17Z"
						stroke="currentColor"
						stroke-width="1.6"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M19.5 17C19.5 18.1 18.6 19 17.5 19C16.4 19 15.5 18.1 15.5 17C15.5 15.9 16.4 15 17.5 15C18.6 15 19.5 15.9 19.5 17Z"
						stroke="currentColor"
						stroke-width="1.6"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			{/if}
		{/snippet}

		{#each footerSocialLinks as item (item.label)}
			{#if item.external}
				<a
					class="mh-footer__social-link"
					href={item.href}
					target="_blank"
					rel="external noopener noreferrer"
					title={item.title}
					aria-label={item.title}
				>
					{@render footerSocialIcon(item.icon)}
				</a>
			{:else}
				<a
					class="mh-footer__social-link"
					href={resolve(item.href)}
					title={item.title}
					aria-label={item.title}
				>
					{@render footerSocialIcon(item.icon)}
				</a>
			{/if}
		{/each}
	</nav>
	<div class="mh-footer__contact">
		<a class="mh-footer__phone" href={daynightSite.phoneHref}>
			<strong>{daynightSite.phoneLabel}</strong>
			<span>Обаждане / Viber</span>
		</a>
		<a
			class="mh-footer__loc"
			href={daynightSite.mapUrl}
			target="_blank"
			rel="external noopener noreferrer"
		>
			{daynightSite.location}
		</a>
	</div>
	<span class="mh-footer__copy"
		>© {new Date().getFullYear()}
		{daynightSite.shortName}
		{daynightSite.city}. Всички права запазени.</span
	>
</footer>

<style>
	.mh-footer a {
		color: inherit;
		text-decoration: none;
	}

	.mh-footer {
		display: grid;
		justify-items: stretch;
		gap: 16px;
		margin-top: 14px;
		border: 0;
		border-radius: 20px 20px 0 0;
		background: #171b1e;
		color: #fff;
		padding: 24px 18px calc(28px + 62px + env(safe-area-inset-bottom));
	}

	.mh-footer__brand {
		display: grid;
		justify-items: start;
		gap: 10px;
	}

	.mh-footer__logo {
		width: 142px;
		height: auto;
		object-fit: contain;
	}

	.mh-footer p {
		margin: 0;
		color: #c5c9ce;
		font-size: var(--sa-text-sm);
		font-weight: var(--sa-weight-medium);
		line-height: 1.5;
	}

	.mh-footer__social {
		display: flex;
		flex-wrap: wrap;
		gap: 9px;
	}

	.mh-footer__social-link {
		display: grid;
		width: var(--sa-mobile-action-h);
		height: var(--sa-mobile-action-h);
		place-items: center;
		border: 1px solid #4b5156;
		border-radius: 50%;
		background: transparent;
		color: #fff !important;
		transition:
			background 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease;
	}

	.mh-footer__social-link:focus-visible,
	.mh-footer__social-link:hover {
		border-color: var(--sa-yellow);
		background: var(--sa-yellow);
		color: #171b1e !important;
	}

	.mh-footer__contact {
		display: grid;
		gap: 8px;
	}

	.mh-footer__phone {
		display: grid;
		gap: 2px;
		justify-items: start;
		color: #fff !important;
	}

	.mh-footer__phone strong {
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-strong);
		line-height: 1.1;
	}

	.mh-footer__phone span {
		color: #c5c9ce;
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-medium);
	}

	.mh-footer__loc {
		display: inline-flex;
		min-height: var(--sa-mobile-action-h);
		align-items: center;
		color: #c5c9ce !important;
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-medium);
		line-height: 1.45;
	}

	.mh-footer__copy {
		max-width: calc(100% - 64px);
		color: #c5c9ce;
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-medium);
	}

	.mh-footer__social-link svg,
	.mh-footer__social-link svg * {
		color: inherit !important;
		stroke: currentColor !important;
	}

	.mh-footer__phone strong {
		color: #fff;
	}

	.mh-footer a:focus-visible {
		outline: 2px solid var(--sa-yellow);
		outline-offset: 3px;
	}

	.mh-footer p {
		font-size: var(--sa-mobile-type-control-sm);
		font-weight: var(--sa-weight-medium);
		line-height: var(--sa-mobile-leading-body);
	}

	.mh-footer__phone span,
	.mh-footer__loc,
	.mh-footer__copy {
		font-size: var(--sa-mobile-type-meta);
		font-weight: var(--sa-weight-medium);
	}
</style>
