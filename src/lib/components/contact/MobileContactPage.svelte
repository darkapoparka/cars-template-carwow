<script lang="ts">
	import { onMount as onClientMount } from 'svelte';
	let interactive = $state(false);
	onClientMount(() => {
		interactive = true;
	});
	import { onDestroy } from 'svelte';
	import { resolve } from '$app/paths';
	import { page as appPage } from '$app/state';
	import { CarFront, Clock, MapPin, MessageCircle, PhoneCall, Send } from '@lucide/svelte';
	import MobileHeroBar from '$lib/components/shared/MobileHeroBar.svelte';
	import { submitLead } from '$lib/client/lead-submit';
	import { daynightSite } from '$lib/data/daynight-site';
	import { readContactIntent, buildContactMessage } from '$lib/utils/contact-intent';
	import { validateLeadContact } from '$lib/utils/lead-validation';
	import { deferredMapFrame } from './deferred-map-frame';

	const phoneHref = daynightSite.phoneHref;
	const mapEmbedSrc = daynightSite.mapEmbedSrc;
	const contactContext = readContactIntent(appPage.url.searchParams);
	let name = $state('');
	let contact = $state(
		appPage.url.searchParams.get('phone') || appPage.url.searchParams.get('email') || ''
	);
	let message = $state(contactContext.message);
	let companyWebsite = $state('');
	let leadSubmitState = $state<'idle' | 'submitting' | 'success' | 'error'>('idle');
	let leadSubmitMessage = $state('');
	let invalidContact = $state(false);
	let submissionController: AbortController | undefined;
	onDestroy(() => submissionController?.abort());

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (leadSubmitState === 'submitting') return;
		const issue = validateLeadContact(contact);
		invalidContact = Boolean(issue);
		if (issue || !name.trim() || !message.trim()) {
			leadSubmitState = 'error';
			leadSubmitMessage = issue?.message || 'Попълнете име и съобщение.';
			const field = (event.currentTarget as HTMLFormElement).elements.namedItem(
				issue ? 'contact' : !name.trim() ? 'name' : 'message'
			);
			if (field instanceof HTMLElement) field.focus();
			return;
		}
		const controller = new AbortController();
		submissionController = controller;
		leadSubmitState = 'submitting';
		leadSubmitMessage = '';
		const contactValue = contact.trim();
		const email = contactValue.includes('@') ? contactValue : null;
		const result = await submitLead(
			{
				customerName: name.trim(),
				contact: contactValue,
				email,
				phone: email ? null : contactValue,
				source: 'contact-page-mobile',
				message: buildContactMessage(contactContext, message),
				companyWebsite
			},
			{ signal: controller.signal }
		);
		if (controller.signal.aborted) return;
		leadSubmitState = result.ok ? 'success' : 'error';
		leadSubmitMessage = result.ok ? 'Екипът ще се свърже с Вас за следваща стъпка.' : result.error;
	}
	const contactCards = [
		{
			id: 'phone',
			title: 'Телефон',
			value: daynightSite.phoneLabel,
			icon: PhoneCall
		},
		{
			id: 'email',
			title: 'Писмен контакт',
			value: 'Използвайте формата за запитване',
			icon: MessageCircle
		},
		{
			id: 'address',
			title: 'Адрес',
			value: daynightSite.location,
			icon: MapPin
		},
		{
			id: 'hours',
			title: 'Работно време',
			value: daynightSite.hoursLabel,
			href: null,
			icon: Clock
		}
	] as const;
</script>

<div class="mobile-contact-app">
	<header class="mobile-contact-hero">
		<img
			class="mobile-contact-hero__bg"
			src={resolve('/assets/images/pages/daynight-about-showroom-suv-v1.webp')}
			alt=""
			aria-hidden="true"
		/>
		<MobileHeroBar showLocation={false} />

		<div class="mobile-contact-hero__copy">
			<span class="mobile-contact-hero__label">Контакти</span>
			<h1>
				Свържете се с {daynightSite.shortName}
			</h1>
			<p>Огледи, въпроси за налични автомобили, бартер, документи и посещение на място.</p>
		</div>

		<div class="mobile-contact-actions">
			<a class="mobile-contact-action mobile-contact-action--call" href={phoneHref}>
				<PhoneCall size={20} strokeWidth={2.5} />
				<span>Обади се</span>
			</a>
			<a
				class="mobile-contact-action mobile-contact-action--map"
				href={daynightSite.mapUrl}
				target="_blank"
				rel="noopener noreferrer"><MapPin size={20} strokeWidth={2.5} /><span>Карта</span></a
			>
		</div>
	</header>

	<main id="main-content" tabindex="-1">
		<section
			class="mobile-contact-form-section"
			aria-labelledby="mobile-contact-form-title"
			tabindex="-1"
		>
			<noscript
				><p>
					За онлайн заявка е необходим JavaScript. <a href={daynightSite.phoneHref}
						>Свържете се с екипа по телефона.</a
					>
				</p></noscript
			>
			<div class="mobile-contact-heading">
				<span>Запитване</span>
				<h2 id="mobile-contact-form-title">
					{contactContext.subject || 'Пишете ни за автомобил'}
				</h2>
			</div>

			{#if contactContext.vehicle}
				<p>
					Автомобил: <strong>{contactContext.vehicle.shortTitle}</strong> · {contactContext.vehicle
						.year} · {contactContext.vehicle.lot}
				</p>
			{/if}

			{#if leadSubmitState === 'success'}
				<div class="mobile-contact-success" role="status" aria-live="polite">
					<MessageCircle size={23} strokeWidth={2.45} />
					<span>
						<strong>Запитването е изпратено</strong>
						<small>{leadSubmitMessage}</small>
					</span>
				</div>
			{:else}
				<form
					method="post"
					class="mobile-contact-form"
					onsubmit={handleSubmit}
					oninput={() => {
						invalidContact = false;
						leadSubmitMessage = '';
					}}
					aria-busy={leadSubmitState === 'submitting'}
					data-daynight-live-lead="true"
				>
					<!-- Honeypot: hidden from users, populated only by bots; dropped server-side. -->
					<div
						aria-hidden="true"
						style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden"
					>
						<label for="mobile-contact-company-website">Не попълвайте това поле</label>
						<input
							id="mobile-contact-company-website"
							name="companyWebsite"
							type="text"
							tabindex="-1"
							autocomplete="off"
							bind:value={companyWebsite}
						/>
					</div>
					<label>
						<span>Име</span>
						<input
							disabled={leadSubmitState === 'submitting' || !interactive}
							bind:value={name}
							name="name"
							maxlength="140"
							type="text"
							placeholder="Вашето име"
							autocomplete="name"
							required
						/>
					</label>

					<label>
						<span>Телефон или имейл</span>
						<input
							disabled={leadSubmitState === 'submitting' || !interactive}
							bind:value={contact}
							name="contact"
							maxlength="180"
							aria-invalid={invalidContact ? true : undefined}
							aria-describedby={invalidContact ? 'mobile-contact-error' : undefined}
							type="text"
							inputmode="text"
							placeholder="Вашият телефон или имейл"
							autocomplete="off"
							required
						/>
					</label>
					<label>
						<span>Съобщение</span>
						<textarea
							disabled={leadSubmitState === 'submitting' || !interactive}
							bind:value={message}
							name="message"
							maxlength="3500"
							rows="3"
							placeholder="Автомобил, оглед, бартер, документи..."
							required
						></textarea>
					</label>
					<button type="submit" disabled={leadSubmitState === 'submitting' || !interactive}>
						<Send size={18} strokeWidth={2.55} />
						<span>
							{leadSubmitState === 'submitting' ? 'Изпращаме...' : 'Изпрати запитване'}
						</span>
					</button>
					{#if leadSubmitMessage}
						<p
							class="mobile-contact-error"
							id="mobile-contact-error"
							role="alert"
							aria-live="polite"
						>
							{leadSubmitMessage}
						</p>
					{/if}
				</form>
			{/if}
		</section>

		<section class="mobile-contact-section" aria-labelledby="mobile-contact-info-title">
			<div class="mobile-contact-heading">
				<span>Инфо</span>
				<h2 id="mobile-contact-info-title">Данни за контакт</h2>
			</div>

			<div class="mobile-contact-cards">
				{#each contactCards as card (card.id)}
					{@const Icon = card.icon}
					<div class="mobile-contact-card">
						<span class="mobile-contact-card__icon"><Icon size={21} strokeWidth={2.45} /></span>
						<span>
							<strong>{card.title}</strong>
							<small>{card.value}</small>
						</span>
					</div>
				{/each}
			</div>
		</section>

		<section class="mobile-contact-map" aria-label="Карта">
			<div class="mobile-contact-map__head">
				<div>
					<span>Локация</span>
					<h2>Шоурум в {daynightSite.city}</h2>
				</div>
				<a href={resolve('/inventory')}>
					<CarFront size={18} strokeWidth={2.45} />
					<span>Коли</span>
				</a>
			</div>
			<iframe
				{@attach deferredMapFrame(mapEmbedSrc, '120px')}
				title={`Карта до ${daynightSite.shortName}, ${daynightSite.city}`}
				data-map-src={mapEmbedSrc}
				height="270"
				style="border:0;width:100%;"
				allowfullscreen
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
			></iframe>
			<a
				class="mobile-contact-map__fallback"
				href={daynightSite.mapUrl}
				target="_blank"
				rel="noopener noreferrer">Отвори картата и упътванията</a
			>
		</section>
	</main>
</div>

<style>
	.mobile-contact-app {
		display: none;
		min-height: 100svh;
		background: #fff;
		color: var(--sa-ink);
		font-family: var(--sa-font);
		-webkit-font-smoothing: antialiased;
		text-rendering: optimizeLegibility;
	}

	.mobile-contact-app :where(a) {
		color: inherit;
		text-decoration: none;
	}

	.mobile-contact-app :where(button) {
		appearance: none;
		border: 0;
		background: transparent;
		color: inherit;
		cursor: pointer;
		font: inherit;
		letter-spacing: 0;
		padding: 0;
	}

	.mobile-contact-app :global(svg),
	.mobile-contact-app :global(svg *) {
		stroke: currentColor !important;
	}

	.mobile-contact-hero {
		position: relative;
		display: grid;
		gap: var(--sa-mobile-gap-md);
		overflow: hidden;
		background: var(--sa-blue);
		padding: calc(env(safe-area-inset-top) + 12px) var(--sa-mobile-gutter-wide) 15px;
		color: #fff;
		isolation: isolate;
	}

	.mobile-contact-hero::after {
		position: absolute;
		inset: 0;
		z-index: -1;
		background: rgba(5, 7, 10, 0.9);
		content: '';
	}

	.mobile-contact-hero__bg {
		position: absolute;
		inset: 0;
		z-index: -2;
		width: 100%;
		height: 100%;
		opacity: 0.42;
		object-fit: cover;
		object-position: center;
	}

	.mobile-contact-hero__copy {
		display: grid;
		gap: var(--sa-mobile-gap-xs);
		max-width: 330px;
	}

	.mobile-contact-heading span,
	.mobile-contact-map__head span {
		color: rgba(255, 255, 255, 0.76);
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-semibold);
		line-height: 1.2;
		text-transform: none;
	}

	.mobile-contact-hero__label {
		color: rgba(255, 255, 255, 0.76);
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-semibold);
		line-height: 1.2;
		text-transform: none;
	}

	.mobile-contact-hero h1 {
		margin: 0;
		color: #fff;
		font-size: var(--sa-text-2xl);
		font-weight: 800;
		letter-spacing: 0;
		line-height: 1.07;
	}

	.mobile-contact-hero p {
		margin: 0;
		color: rgba(255, 255, 255, 0.88);
		font-size: var(--sa-text-sm);
		font-weight: 700;
		line-height: 1.3;
	}

	.mobile-contact-actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--sa-mobile-gap-sm);
	}

	.mobile-contact-action {
		display: inline-flex;
		min-height: var(--sa-mobile-action-h);
		align-items: center;
		justify-content: center;
		gap: var(--sa-mobile-gap-xs);
		border-radius: 8px;
		color: #fff !important;
		font-size: var(--sa-text-sm);
		font-weight: 800;
		line-height: 1;
	}

	.mobile-contact-action span,
	.mobile-contact-action :global(svg),
	.mobile-contact-action :global(svg *) {
		color: #fff !important;
		-webkit-text-fill-color: #fff !important;
		stroke: #fff !important;
	}

	.mobile-contact-action--call {
		background: var(--sa-red);
	}

	.mobile-contact-action--map {
		background: rgba(255, 255, 255, 0.14);
	}

	.mobile-contact-app main {
		display: grid;
		gap: var(--sa-mobile-page-gap);
		padding: 13px var(--sa-mobile-gutter) calc(84px + env(safe-area-inset-bottom));
	}

	.mobile-contact-section,
	.mobile-contact-form-section {
		display: grid;
		gap: var(--sa-mobile-section-gap);
	}

	.mobile-contact-heading {
		display: grid;
		gap: 5px;
	}

	.mobile-contact-heading span,
	.mobile-contact-map__head span {
		color: var(--sa-blue);
	}

	.mobile-contact-heading h2,
	.mobile-contact-map__head h2 {
		margin: 0;
		color: #111827;
		font-size: var(--sa-text-xl);
		font-weight: 800;
		letter-spacing: 0;
		line-height: 1.1;
	}

	.mobile-contact-cards,
	.mobile-contact-form {
		display: grid;
		gap: var(--sa-mobile-gap-sm);
	}

	.mobile-contact-card {
		display: grid;
		grid-template-columns: 42px minmax(0, 1fr) 18px;
		min-height: 72px;
		align-items: center;
		gap: var(--sa-mobile-gap-sm);
		border-radius: 8px;
		background: #f4f6f9;
		padding: 10px 12px;
	}

	.mobile-contact-card:not(a) {
		grid-template-columns: 42px minmax(0, 1fr);
	}

	.mobile-contact-card__icon {
		display: grid;
		width: var(--sa-mobile-pill-h);
		height: var(--sa-mobile-pill-h);
		place-items: center;
		border-radius: 50%;
		background: #fff;
		color: var(--sa-blue);
	}

	.mobile-contact-card > span:nth-child(2) {
		display: grid;
		min-width: 0;
		gap: 4px;
	}

	.mobile-contact-card strong {
		color: #111827;
		font-size: var(--sa-text-base);
		font-weight: 800;
		line-height: 1.1;
	}

	.mobile-contact-card small {
		overflow: hidden;
		color: #66707a;
		font-size: var(--sa-text-xs);
		font-weight: 700;
		line-height: 1.28;
		text-overflow: ellipsis;
	}

	.mobile-contact-card > :global(svg) {
		justify-self: end;
		color: #6b7280;
	}

	.mobile-contact-form label {
		display: grid;
		gap: var(--sa-mobile-gap-xs);
		min-width: 0;
		border: 1px solid #dfe5ec;
		border-radius: 12px;
		background: #eef1f6;
		padding: 8px 11px;
	}

	.mobile-contact-form label:focus-within {
		border-color: rgba(176, 0, 0, 0.52);
		box-shadow: none;
	}

	.mobile-contact-form label span {
		color: #56616e;
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-weight-semibold);
		line-height: 1.2;
		text-transform: none;
	}

	.mobile-contact-form input,
	.mobile-contact-form textarea {
		width: 100%;
		min-width: 0;
		min-height: 44px;
		appearance: none;
		-webkit-appearance: none;
		border: 0 !important;
		border-radius: 0 !important;
		background: transparent !important;
		box-shadow: none !important;
		color: var(--sa-ink) !important;
		font: 400 var(--sa-text-base) / 1.4 var(--sa-font) !important;
		outline: 0 !important;
		padding: 0 !important;
		resize: vertical;
	}

	.mobile-contact-form input::placeholder,
	.mobile-contact-form textarea::placeholder {
		color: #626d7a;
		opacity: 1;
	}

	.mobile-contact-form button {
		display: inline-flex;
		min-height: var(--sa-mobile-action-h);
		align-items: center;
		justify-content: center;
		gap: var(--sa-mobile-gap-xs);
		border-radius: 8px;
		background: var(--sa-red);
		color: #fff !important;
		font-size: var(--sa-text-sm);
		font-weight: 800;
	}

	.mobile-contact-form button:disabled {
		cursor: wait;
		opacity: 0.72;
	}

	.mobile-contact-error {
		margin: 0;
		border-radius: 8px;
		background: #fff1f2;
		padding: 10px 11px;
		color: #b91c1c;
		font-size: var(--sa-text-xs);
		font-weight: 800;
		line-height: 1.32;
	}

	.mobile-contact-success {
		display: grid;
		grid-template-columns: 34px minmax(0, 1fr);
		align-items: center;
		gap: 10px;
		border-radius: 8px;
		background: #eef4ff;
		padding: 13px 12px;
		color: #111827;
	}

	.mobile-contact-success :global(svg) {
		color: var(--sa-blue);
	}

	.mobile-contact-success span {
		display: grid;
		gap: 3px;
	}

	.mobile-contact-success strong {
		font-size: var(--sa-text-sm);
		font-weight: 800;
		line-height: 1.12;
	}

	.mobile-contact-success small {
		color: #647084;
		font-size: var(--sa-text-xs);
		font-weight: 700;
		line-height: 1.28;
	}

	@keyframes mobile-import-sheet-in {
		from {
			opacity: 0.94;
			transform: translateY(28px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.mobile-contact-map {
		display: grid;
		gap: var(--sa-mobile-gap-sm);
		overflow: hidden;
		border-radius: 8px;
		background: #f4f6f9;
		padding: 12px;
	}

	.mobile-contact-map__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--sa-mobile-gap-sm);
	}

	.mobile-contact-map__head > div {
		display: grid;
		gap: 4px;
		min-width: 0;
	}

	.mobile-contact-map__head a {
		display: inline-flex;
		min-height: var(--sa-mobile-hero-cta-h);
		align-items: center;
		justify-content: center;
		gap: 6px;
		border-radius: 999px;
		background: #fff;
		padding: 0 12px;
		color: var(--sa-blue) !important;
		font-size: var(--sa-text-xs);
		font-weight: 800;
		white-space: nowrap;
	}

	.mobile-contact-map iframe {
		display: block;
		overflow: hidden;
		border-radius: 8px;
		background: #dbe3ec;
	}

	@media (max-width: 430px) {
		.mobile-contact-section,
		.mobile-contact-form-section {
			gap: 8px;
		}

		.mobile-contact-cards {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.mobile-contact-card,
		.mobile-contact-card:not(a) {
			grid-template-columns: minmax(0, 1fr);
			min-height: 88px;
			align-content: center;
			gap: 6px;
			padding: 9px 10px;
		}

		.mobile-contact-card__icon {
			width: 36px;
			height: 36px;
		}

		.mobile-contact-form {
			grid-template-columns: minmax(0, 1fr);
			gap: 8px;
		}

		.mobile-contact-form > label:nth-of-type(3),
		.mobile-contact-form > button,
		.mobile-contact-form > .mobile-contact-error {
			grid-column: 1 / -1;
		}

		.mobile-contact-form label {
			padding: 6px 11px;
		}

		.mobile-contact-form input,
		.mobile-contact-form textarea {
			min-height: 36px;
		}
	}

	@media (max-width: 991px) {
		.mobile-contact-app {
			display: block;
		}
	}

	/* Mobile typography contract */
	.mobile-contact-heading span,
	.mobile-contact-map__head span,
	.mobile-contact-hero__label {
		font-size: var(--sa-mobile-type-micro);
		font-weight: var(--sa-weight-semibold);
	}
	.mobile-contact-hero h1 {
		font-size: var(--sa-mobile-type-page-title);
		font-weight: var(--sa-weight-display);
		line-height: var(--sa-mobile-leading-heading);
	}
	.mobile-contact-hero p {
		font-size: var(--sa-mobile-type-body);
		font-weight: var(--sa-weight-medium);
		line-height: var(--sa-mobile-leading-body);
	}
	.mobile-contact-action,
	.mobile-contact-form button {
		font-size: var(--sa-mobile-type-control-sm);
		font-weight: var(--sa-weight-semibold);
	}
	.mobile-contact-heading h2,
	.mobile-contact-map__head h2 {
		font-size: var(--sa-mobile-type-section-title);
		font-weight: var(--sa-weight-strong);
		line-height: var(--sa-mobile-leading-heading);
	}
	.mobile-contact-card strong {
		font-size: var(--sa-mobile-type-card-title);
		font-weight: var(--sa-weight-strong);
	}
	.mobile-contact-card small,
	.mobile-contact-success small {
		font-size: var(--sa-mobile-type-meta);
		font-weight: var(--sa-weight-medium);
		line-height: var(--sa-mobile-leading-meta);
	}
	.mobile-contact-form label span {
		font-size: var(--sa-mobile-type-micro);
		font-weight: var(--sa-weight-semibold);
	}
	.mobile-contact-form input,
	.mobile-contact-form textarea {
		font: var(--sa-weight-regular) var(--sa-mobile-type-input) / var(--sa-mobile-leading-body)
			var(--sa-font) !important;
	}
	.mobile-contact-error {
		font-size: var(--sa-mobile-type-meta);
		font-weight: var(--sa-weight-semibold);
		line-height: var(--sa-mobile-leading-meta);
	}
	.mobile-contact-success strong {
		font-size: var(--sa-mobile-type-control-sm);
		font-weight: var(--sa-weight-strong);
	}
	.mobile-contact-map__fallback {
		display: inline-flex;
		min-height: var(--sa-mobile-action-h);
		align-items: center;
		color: var(--sa-ink);
		font-size: var(--sa-mobile-type-control-sm);
		text-decoration: underline;
	}
</style>
