<script lang="ts">
	import { ArrowLeft, CircleCheck, Globe2, Phone, X } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { page as appPage } from '$app/state';
	import { submitImportRequest } from '$lib/client/import-request-submit';
	import MobileFullSheet from '$lib/components/shared/mobile/MobileFullSheet.svelte';
	import MobileLeadHero from '$lib/components/shared/mobile/MobileLeadHero.svelte';
	import { daynightSite } from '$lib/data/daynight-site';
	import {
		buildImportNotes,
		parseBudgetAmount,
		parseYearValue,
		readImportIntent
	} from '$lib/utils/import-intent';

	type ImportSubmitState = 'idle' | 'submitting' | 'success' | 'error';

	const initial = readImportIntent(appPage.url.searchParams);
	const initialQuery = initial.query || [initial.make, initial.model].filter(Boolean).join(' ');

	let sourceUrl = $state(initial.sourceUrl);
	let importQuery = $state(initialQuery);
	let importMake = $state(initial.make);
	let importModel = $state(initial.model);
	let importYear = $state(initial.year);
	let importBudget = $state(initial.budget);
	let contact = $state(initial.phone);
	let message = $state('');
	let quickValue = $state(initial.sourceUrl || initialQuery);
	let companyWebsite = $state('');
	let formOpen = $state(
		Boolean(
			initial.sourceUrl ||
			initial.query ||
			initial.make ||
			initial.model ||
			initial.year ||
			initial.budget ||
			initial.phone
		)
	);
	let infoOpen = $state(false);
	let formStep = $state<1 | 2>(1);
	let submitState = $state<ImportSubmitState>('idle');
	let submitMessage = $state('');
	let selectedOrigin = $state('XX');

	const originOptions = [
		{ code: 'XX', label: 'Всички' },
		{ code: 'DE', label: 'Германия' },
		{ code: 'EU', label: 'Европа' },
		{ code: 'US', label: 'САЩ' },
		{ code: 'JP', label: 'Япония' },
		{ code: 'CN', label: 'Китай' }
	] as const;
	const selectedOriginLabel = $derived(
		originOptions.find((option) => option.code === selectedOrigin)?.label ?? 'Всички'
	);

	const phoneHref = `tel:+359${daynightSite.phone.slice(1)}`;
	const hasRequestData = $derived(
		Boolean(sourceUrl.trim() || importQuery.trim() || importMake.trim() || importModel.trim())
	);
	const requestTitle = $derived(
		importQuery.trim() ||
			[importMake.trim(), importModel.trim()].filter(Boolean).join(' ') ||
			'Заявка за внос'
	);
	const requestMeta = $derived(
		[
			importYear.trim() && `след ${importYear.trim()}`,
			importBudget.trim() && `до ${importBudget.trim()} €`
		]
			.filter(Boolean)
			.join(' · ')
	);

	function applyQuickValue() {
		const value = quickValue.trim();
		if (!value) return;
		if (/^https?:\/\//i.test(value)) {
			sourceUrl = value;
		} else {
			importQuery = value;
		}
	}

	function openForm() {
		applyQuickValue();
		formStep = 1;
		submitMessage = '';
		if (submitState === 'error') submitState = 'idle';
		formOpen = true;
	}

	function openManualForm() {
		quickValue = '';
		openForm();
	}

	function closeForm() {
		formOpen = false;
		formStep = 1;
		submitMessage = '';
		if (submitState === 'error') submitState = 'idle';
	}

	function goBack() {
		formStep = 1;
		submitMessage = '';
		if (submitState === 'error') submitState = 'idle';
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (formStep === 1) {
			if (!hasRequestData) {
				submitState = 'error';
				submitMessage = 'Добавете линк, VIN или кратко описание на автомобила.';
				return;
			}
			submitState = 'idle';
			submitMessage = '';
			formStep = 2;
			return;
		}

		if (submitState === 'submitting') return;
		const contactValue = contact.trim();
		if (!contactValue) {
			submitState = 'error';
			submitMessage = 'Въведете телефон или имейл за обратна връзка.';
			return;
		}

		const email = contactValue.includes('@') ? contactValue : null;
		const phone = email ? null : contactValue;
		submitState = 'submitting';
		submitMessage = '';

		const result = await submitImportRequest({
			customerName: 'Заявка за внос от сайта',
			contact: contactValue,
			email,
			phone,
			originCountry: selectedOrigin,
			destinationCountry: 'BG',
			desiredMake: importMake.trim() || null,
			desiredModel: importModel.trim() || null,
			desiredYearMin: parseYearValue(importYear),
			desiredYearMax: null,
			budgetMin: null,
			budgetMax: parseBudgetAmount(importBudget),
			fuel: null,
			transmission: null,
			notes: [
				`Произход: ${selectedOriginLabel}`,
				buildImportNotes(
					{
						...initial,
						isImport: true,
						query: importQuery.trim(),
						make: importMake.trim(),
						model: importModel.trim(),
						year: importYear.trim(),
						budget: importBudget.trim(),
						sourceUrl: sourceUrl.trim(),
						phone: contactValue
					},
					message
				)
			]
				.filter(Boolean)
				.join('\n'),
			companyWebsite
		});

		if (result.ok) {
			submitState = 'success';
			formOpen = false;
			formStep = 1;
			return;
		}

		submitState = 'error';
		submitMessage = result.error;
	}

	function startAnother() {
		sourceUrl = '';
		importQuery = '';
		importMake = '';
		importModel = '';
		importYear = '';
		importBudget = '';
		contact = '';
		message = '';
		quickValue = '';
		companyWebsite = '';
		submitState = 'idle';
		submitMessage = '';
		openForm();
	}
</script>

<div class="mobile-import">
	<MobileLeadHero
		kind="import"
		title="Внос на автомобил"
		bind:value={quickValue}
		placeholder="Линк към обява или VIN"
		onSubmit={openForm}
		onInfo={() => (infoOpen = true)}
	/>

	<main id="main-content" tabindex="-1" class="mobile-lead-main">
		{#if submitState === 'success'}
			<section class="import-success" aria-labelledby="import-success-title">
				<span class="import-success__icon"><CircleCheck size={22} strokeWidth={2.3} /></span>
				<div>
					<h2 id="import-success-title">Заявката е изпратена</h2>
					<p>Ще се свържем с Вас с конкретни варианти и следваща стъпка.</p>
				</div>
				<div class="import-success__actions">
					<a href={phoneHref}><Phone size={17} strokeWidth={2.3} /> Обади се</a>
					<button type="button" onclick={startAnother}>Нова заявка</button>
				</div>
			</section>
		{:else}
			<nav class="import-origins" aria-label="Произход на автомобила">
				{#each originOptions as option (option.code)}
					<button
						type="button"
						class:active={selectedOrigin === option.code}
						onclick={() => (selectedOrigin = option.code)}
						aria-pressed={selectedOrigin === option.code}
					>
						{#if option.code === 'XX'}
							<Globe2 size={17} strokeWidth={2.2} aria-hidden="true" />
						{:else}
							<span
								class={`import-origin-flag import-origin-flag--${option.code.toLowerCase()}`}
								aria-hidden="true"
							></span>
						{/if}
						<span>{option.label}</span>
					</button>
				{/each}
			</nav>
			<button
				class="import-manual-banner"
				type="button"
				onclick={openManualForm}
				aria-label="Нямам линк. Опиши автомобила и бюджета"
			>
				<img
					src={resolve('/assets/images/import/import-manual-banner-v3.webp')}
					alt=""
					aria-hidden="true"
					width="435"
					height="166"
				/>
			</button>
		{/if}
	</main>

	<MobileFullSheet bind:open={formOpen} labelledBy="import-sheet-title" onClose={closeForm}>
		<form class="lead-sheet" onsubmit={handleSubmit} aria-busy={submitState === 'submitting'}>
			<header class="lead-sheet__header">
				<button class="lead-sheet__close" type="button" onclick={closeForm} aria-label="Затвори">
					<X size={21} strokeWidth={2.25} />
				</button>
				<div>
					<span>Стъпка {formStep} от 2</span>
					<h2 id="import-sheet-title">{formStep === 1 ? 'Автомобил' : 'Контакт'}</h2>
				</div>
				<span class="lead-sheet__step">{formStep}/2</span>
			</header>

			<div class="lead-sheet__progress" aria-hidden="true">
				<span class="is-active"></span><span class:is-active={formStep === 2}></span>
			</div>

			<div class="lead-sheet__body">
				{#if formStep === 1}
					<section class="lead-fields" aria-label="Автомобил за внос">
						<label class="lead-field">
							<span>Линк към обява <small>по желание</small></span>
							<input
								bind:value={sourceUrl}
								type="url"
								inputmode="url"
								placeholder="https://..."
								autocomplete="url"
							/>
						</label>
						<label class="lead-field">
							<span>Какъв автомобил търсите</span>
							<input
								bind:value={importQuery}
								type="text"
								placeholder="BMW X5, дизел..."
								autocomplete="off"
								required={!sourceUrl.trim()}
							/>
						</label>
						<div class="lead-field-grid">
							<label class="lead-field">
								<span>Година от</span>
								<input bind:value={importYear} type="text" inputmode="numeric" placeholder="2020" />
							</label>
							<label class="lead-field">
								<span>Бюджет €</span>
								<input
									bind:value={importBudget}
									type="text"
									inputmode="numeric"
									placeholder="40 000"
								/>
							</label>
						</div>
					</section>
				{:else}
					<section class="lead-fields" aria-label="Контакт">
						<div class="request-summary">
							<div>
								<span>Търсене</span><strong>{requestTitle}</strong>{#if requestMeta}<small
										>{requestMeta}</small
									>{/if}
							</div>
							<button type="button" onclick={goBack}>Редактирай</button>
						</div>
						<label class="lead-field">
							<span>Телефон или имейл</span>
							<input
								bind:value={contact}
								type="text"
								placeholder="08... или email"
								autocomplete="email"
								required
							/>
						</label>
						<label class="lead-field lead-field--textarea">
							<span>Бележка <small>по желание</small></span>
							<textarea
								bind:value={message}
								rows="3"
								placeholder="Оборудване, гориво, други условия..."
							></textarea>
						</label>
					</section>
				{/if}

				<label class="honeypot" aria-hidden="true">
					<span>Компания</span><input
						bind:value={companyWebsite}
						type="text"
						tabindex="-1"
						autocomplete="off"
					/>
				</label>

				{#if submitMessage}
					<p class="lead-error" role="alert">{submitMessage}</p>
				{/if}
			</div>

			<footer class="lead-sheet__footer">
				{#if formStep === 2}
					<button class="lead-back" type="button" onclick={goBack}
						><ArrowLeft size={18} strokeWidth={2.4} /> Назад</button
					>
				{/if}
				<button class="lead-primary" type="submit" disabled={submitState === 'submitting'}>
					{formStep === 1
						? 'Продължи'
						: submitState === 'submitting'
							? 'Изпращаме…'
							: 'Изпрати заявка'}
				</button>
			</footer>
		</form>
	</MobileFullSheet>

	<MobileFullSheet
		bind:open={infoOpen}
		labelledBy="import-info-title"
		onClose={() => (infoOpen = false)}
	>
		<section class="info-sheet">
			<header class="info-sheet__header">
				<div>
					<span>Внос</span>
					<h2 id="import-info-title">Как работи</h2>
				</div>
				<button type="button" onclick={() => (infoOpen = false)} aria-label="Затвори"
					><X size={21} strokeWidth={2.25} /></button
				>
			</header>
			<div class="info-sheet__list">
				<article>
					<b>01</b><span
						><strong>Изпращате обява</strong><small>Или описвате автомобила, който търсите.</small
						></span
					>
				</article>
				<article>
					<b>02</b><span
						><strong>Получавате разчет</strong><small>Цена, транспорт и следващи стъпки.</small
						></span
					>
				</article>
				<article>
					<b>03</b><span
						><strong>Организираме вноса</strong><small>Координираме покупката и доставката.</small
						></span
					>
				</article>
			</div>
			<a class="info-sheet__call" href={phoneHref}><Phone size={18} strokeWidth={2.3} /> Обади се</a
			>
		</section>
	</MobileFullSheet>
</div>

<style>
	.mobile-import {
		display: none;
		min-height: 100svh;
		background: var(--sa-bg);
		color: var(--sa-ink);
		font-family: var(--sa-font);
	}

	.mobile-lead-main {
		position: relative;
		z-index: 2;
		display: grid;
		flex: 1;
		align-content: start;
		gap: 10px;
		margin-top: -14px;
		border-radius: 24px 24px 0 0;
		background: #eef2f6;
		padding: 27px var(--sa-mobile-gutter) calc(86px + env(safe-area-inset-bottom));
		box-shadow: 0 -1px 0 rgba(255, 255, 255, 0.18);
	}
	.mobile-lead-main::before {
		position: absolute;
		top: 9px;
		left: 50%;
		width: 38px;
		height: 4px;
		border-radius: 999px;
		background: #c4ccd5;
		content: '';
		transform: translateX(-50%);
	}

	.import-origins {
		display: flex;
		gap: 7px;
		overflow-x: auto;
		margin-inline: -2px;
		padding: 0 2px 2px;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
	}
	.import-origins::-webkit-scrollbar {
		display: none;
	}
	.import-origins button {
		display: inline-flex;
		min-height: var(--sa-mobile-pill-h);
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		gap: 7px;
		border: 1px solid #dde3ea;
		border-radius: var(--sa-pill-radius);
		background: #fff;
		color: #25303b;
		font: var(--sa-weight-semibold) var(--sa-mobile-type-control-sm) / 1 var(--sa-font);
		padding: 0 13px;
		box-shadow: 0 1px 1px rgba(15, 20, 23, 0.025);
		cursor: pointer;
		white-space: nowrap;
		-webkit-tap-highlight-color: transparent;
	}
	.import-origins button.active {
		border-color: var(--sa-red);
		background: var(--sa-red);
		color: #fff;
		box-shadow: none;
	}
	.import-origins button:focus-visible {
		outline: 2px solid var(--sa-red);
		outline-offset: 2px;
	}
	.import-origin-flag {
		position: relative;
		display: inline-block;
		width: 20px;
		height: 14px;
		flex: 0 0 auto;
		overflow: hidden;
		border: 1px solid rgba(15, 20, 23, 0.12);
		border-radius: 2px;
		box-sizing: border-box;
	}
	.import-origin-flag--de {
		background: linear-gradient(#111 0 33.33%, #d71f2b 33.33% 66.66%, #f3ca20 66.66%);
	}
	.import-origin-flag--eu {
		background: #1748a0;
	}
	.import-origin-flag--eu::after {
		content: '•';
		position: absolute;
		inset: 0;
		color: #ffd43b;
		font-size: 14px;
		line-height: 11px;
		text-align: center;
	}
	.import-origin-flag--us {
		background: repeating-linear-gradient(to bottom, #b22234 0 1.8px, #fff 1.8px 3.6px);
	}
	.import-origin-flag--us::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 8px;
		height: 7px;
		background: #3c3b6e;
	}
	.import-origin-flag--jp {
		background: #fff;
	}
	.import-origin-flag--jp::after {
		content: '';
		position: absolute;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #bc002d;
		top: 3px;
		left: 6px;
	}
	.import-origin-flag--cn {
		background: #de2910;
	}
	.import-origin-flag--cn::after {
		content: '★';
		position: absolute;
		top: -2px;
		left: 2px;
		color: #ffde00;
		font-size: 8px;
	}
	.import-manual-banner {
		display: block;
		width: 100%;
		overflow: hidden;
		border: 0;
		border-radius: var(--sa-r-md);
		background: transparent;
		padding: 0;
		cursor: pointer;
		box-shadow: none;
		-webkit-tap-highlight-color: transparent;
	}
	.import-manual-banner img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 435 / 166;
		border-radius: var(--sa-r-md);
		object-fit: cover;
	}
	.import-manual-banner:active {
		transform: scale(0.995);
	}
	.import-manual-banner:focus-visible {
		outline: 2px solid var(--sa-red);
		outline-offset: 2px;
	}

	.import-success {
		display: grid;
		grid-template-columns: 38px minmax(0, 1fr);
		gap: 11px;
		border: 1px solid var(--sa-line-strong);
		border-radius: var(--sa-r-md);
		background: #fff;
		padding: 14px;
	}
	.import-success__icon {
		display: grid;
		width: 38px;
		height: 38px;
		place-items: center;
		border-radius: 50%;
		background: var(--sa-fill);
		color: var(--sa-red);
	}
	.import-success h2,
	.import-success p {
		margin: 0;
	}
	.import-success h2 {
		font-size: var(--sa-mobile-type-card-title);
		font-weight: var(--sa-weight-strong);
	}
	.import-success p {
		margin-top: 4px;
		color: var(--sa-muted);
		font-size: var(--sa-mobile-type-meta);
		line-height: var(--sa-mobile-leading-meta);
	}
	.import-success__actions {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}
	.import-success__actions a,
	.import-success__actions button {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		justify-content: center;
		gap: 6px;
		border: 0;
		border-radius: 10px;
		font: var(--sa-weight-semibold) var(--sa-mobile-type-control-sm) / 1 var(--sa-font);
		text-decoration: none;
		cursor: pointer;
	}
	.import-success__actions a {
		background: var(--sa-red);
		color: #fff;
	}
	.import-success__actions button {
		background: var(--sa-fill);
		color: var(--sa-ink);
	}

	.lead-sheet {
		display: grid;
		height: 100%;
		grid-template-rows: auto auto minmax(0, 1fr) auto;
		background: #fff;
	}
	.lead-sheet__header {
		display: grid;
		grid-template-columns: 44px minmax(0, 1fr) 44px;
		align-items: center;
		gap: 10px;
		background: var(--sa-blue);
		color: #fff;
		padding: calc(env(safe-area-inset-top) + 10px) 12px 10px;
	}
	.lead-sheet__header > div {
		display: grid;
		gap: 2px;
		text-align: center;
	}
	.lead-sheet__header span {
		font-size: var(--sa-mobile-type-micro);
		font-weight: var(--sa-weight-medium);
		color: rgba(255, 255, 255, 0.7);
	}
	.lead-sheet__header h2 {
		margin: 0;
		font-size: var(--sa-mobile-type-feature-title);
		font-weight: var(--sa-weight-strong);
		line-height: 1.15;
	}
	.lead-sheet__close {
		display: grid;
		width: 44px;
		height: 44px;
		place-items: center;
		border: 0;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.08);
		color: #fff;
		padding: 0;
		cursor: pointer;
	}
	.lead-sheet__step {
		display: grid;
		width: 38px;
		height: 38px;
		place-items: center;
		justify-self: end;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.1);
		color: #fff !important;
		font-size: var(--sa-mobile-type-micro) !important;
		font-weight: var(--sa-weight-semibold) !important;
	}
	.lead-sheet__progress {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3px;
		background: var(--sa-blue);
		padding: 0 12px 10px;
	}
	.lead-sheet__progress span {
		height: 3px;
		border-radius: 3px;
		background: rgba(255, 255, 255, 0.18);
	}
	.lead-sheet__progress span.is-active {
		background: var(--sa-red);
	}
	.lead-sheet__body {
		overflow-y: auto;
		overscroll-behavior: contain;
		background: var(--sa-bg);
		padding: 12px var(--sa-mobile-gutter) 18px;
	}
	.lead-fields {
		display: grid;
		gap: 8px;
	}
	.lead-field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
	}
	.lead-field {
		display: grid;
		min-width: 0;
		gap: 2px;
		border: 1px solid var(--sa-line-strong);
		border-radius: 12px;
		background: #fff;
		padding: 6px 10px;
	}
	.lead-field:focus-within {
		border-color: rgba(213, 0, 50, 0.52);
		box-shadow: 0 0 0 2px rgba(213, 0, 50, 0.08);
	}
	.lead-field > span {
		color: var(--sa-muted);
		font-size: var(--sa-mobile-type-micro);
		font-weight: var(--sa-weight-semibold);
		line-height: 1.2;
	}
	.lead-field > span small {
		font: inherit;
		font-weight: var(--sa-weight-regular);
	}
	.lead-field input,
	.lead-field textarea {
		width: 100%;
		min-width: 0;
		border: 0;
		background: transparent;
		color: var(--sa-ink);
		font: var(--sa-weight-regular) var(--sa-mobile-type-input) / 1.3 var(--sa-font);
		outline: 0;
		padding: 0;
		resize: none;
	}
	.lead-field input {
		min-height: 30px;
	}
	.lead-field textarea {
		min-height: 60px;
		padding-top: 2px;
	}
	.lead-field input::placeholder,
	.lead-field textarea::placeholder {
		color: #8a94a0;
		opacity: 1;
	}
	.lead-field--textarea {
		padding-bottom: 9px;
	}
	.request-summary {
		display: flex;
		min-height: 60px;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		border: 1px solid var(--sa-line-strong);
		border-radius: 12px;
		background: #fff;
		padding: 8px 10px;
	}
	.request-summary > div {
		display: grid;
		min-width: 0;
		gap: 2px;
	}
	.request-summary span {
		color: var(--sa-muted);
		font-size: var(--sa-mobile-type-micro);
	}
	.request-summary strong {
		overflow: hidden;
		font-size: var(--sa-mobile-type-body);
		font-weight: var(--sa-weight-strong);
		line-height: 1.2;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.request-summary small {
		color: var(--sa-muted);
		font-size: var(--sa-mobile-type-micro);
	}
	.request-summary button {
		min-height: 40px;
		flex: 0 0 auto;
		border: 0;
		border-radius: 10px;
		background: var(--sa-fill);
		color: var(--sa-ink);
		font: var(--sa-weight-semibold) var(--sa-mobile-type-micro) / 1 var(--sa-font);
		padding: 0 11px;
		cursor: pointer;
	}
	.lead-error {
		margin: 10px 0 0;
		border-radius: 10px;
		background: #fff1f2;
		color: #b42318;
		font-size: var(--sa-mobile-type-meta);
		font-weight: var(--sa-weight-medium);
		line-height: var(--sa-mobile-leading-meta);
		padding: 10px 11px;
	}
	.honeypot {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}
	.lead-sheet__footer {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 8px;
		border-top: 1px solid var(--sa-line);
		background: #fff;
		padding: 10px var(--sa-mobile-gutter) calc(10px + env(safe-area-inset-bottom));
	}
	.lead-sheet__footer > .lead-primary:only-child {
		grid-column: 1 / -1;
	}
	.lead-back {
		display: inline-flex;
		min-height: 48px;
		align-items: center;
		justify-content: center;
		gap: 6px;
		border: 0;
		border-radius: 12px;
		background: var(--sa-fill);
		color: var(--sa-ink);
		font: var(--sa-weight-semibold) var(--sa-mobile-type-control-sm) / 1 var(--sa-font);
		padding: 0 13px;
		cursor: pointer;
	}
	.lead-primary {
		min-height: 48px;
		border: 0;
		border-radius: 12px;
		background: var(--sa-red);
		color: #fff;
		font: var(--sa-weight-semibold) var(--sa-mobile-type-control-sm) / 1 var(--sa-font);
		padding: 0 16px;
		cursor: pointer;
	}
	.lead-primary:disabled {
		opacity: 0.68;
		cursor: wait;
	}

	.info-sheet {
		display: grid;
		height: 100%;
		grid-template-rows: auto 1fr auto;
		background: var(--sa-bg);
	}
	.info-sheet__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		background: var(--sa-blue);
		color: #fff;
		padding: calc(env(safe-area-inset-top) + 12px) var(--sa-mobile-gutter) 12px;
	}
	.info-sheet__header > div {
		display: grid;
		gap: 2px;
	}
	.info-sheet__header span {
		color: rgba(255, 255, 255, 0.7);
		font-size: var(--sa-mobile-type-micro);
		font-weight: var(--sa-weight-medium);
	}
	.info-sheet__header h2 {
		margin: 0;
		font-size: var(--sa-mobile-type-section-title);
		font-weight: var(--sa-weight-strong);
	}
	.info-sheet__header button {
		display: grid;
		width: 44px;
		height: 44px;
		place-items: center;
		border: 0;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.08);
		color: #fff;
		padding: 0;
		cursor: pointer;
	}
	.info-sheet__list {
		display: grid;
		align-content: start;
		gap: 8px;
		padding: 14px var(--sa-mobile-gutter);
	}
	.info-sheet__list article {
		display: grid;
		grid-template-columns: 38px minmax(0, 1fr);
		align-items: center;
		gap: 10px;
		min-height: 68px;
		border: 1px solid var(--sa-line-strong);
		border-radius: 12px;
		background: #fff;
		padding: 9px 10px;
	}
	.info-sheet__list b {
		display: grid;
		width: 38px;
		height: 38px;
		place-items: center;
		border-radius: 10px;
		background: var(--sa-fill);
		font-size: var(--sa-mobile-type-micro);
	}
	.info-sheet__list article > span {
		display: grid;
		gap: 3px;
	}
	.info-sheet__list strong {
		font-size: var(--sa-mobile-type-body);
		font-weight: var(--sa-weight-semibold);
	}
	.info-sheet__list small {
		color: var(--sa-muted);
		font-size: var(--sa-mobile-type-meta);
		line-height: var(--sa-mobile-leading-meta);
	}
	.info-sheet__call {
		display: inline-flex;
		min-height: 48px;
		align-items: center;
		justify-content: center;
		gap: 7px;
		margin: 0 var(--sa-mobile-gutter) calc(12px + env(safe-area-inset-bottom));
		border-radius: 12px;
		background: var(--sa-red);
		color: #fff;
		font: var(--sa-weight-semibold) var(--sa-mobile-type-control-sm) / 1 var(--sa-font);
		text-decoration: none;
	}

	@media (max-width: 991px) {
		.mobile-import {
			display: flex;
			flex-direction: column;
		}
	}
</style>
