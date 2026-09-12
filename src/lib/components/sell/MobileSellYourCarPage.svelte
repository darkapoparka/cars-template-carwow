<script lang="ts">
	import { ArrowLeft, CircleCheck, Phone, X } from '@lucide/svelte';
	import { untrack } from 'svelte';
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import { page as appPage } from '$app/state';
	import { submitLead } from '$lib/client/lead-submit';
	import MobileFullSheet from '$lib/components/shared/mobile/MobileFullSheet.svelte';
	import MobileLeadHero from '$lib/components/shared/mobile/MobileLeadHero.svelte';
	import MobileLeadContactCard from '$lib/components/shared/mobile/MobileLeadContactCard.svelte';
	import { daynightSite } from '$lib/data/daynight-site';

	type SellSubmitState = 'idle' | 'submitting' | 'success' | 'error';

	let { initialPath = '/sell-your-car' }: { initialPath?: string } = $props();

	const initialParam = (key: string) =>
		browser ? (appPage.url.searchParams.get(key)?.trim() ?? '') : '';

	let plate = $state(initialParam('plate'));
	let vin = $state(initialParam('vin'));
	let make = $state(initialParam('make'));
	let model = $state(initialParam('model'));
	let year = $state(initialParam('year'));
	let mileage = $state(initialParam('mileage'));
	let phone = $state(initialParam('phone'));
	let quickValue = $state(initialParam('plate') || initialParam('vin'));
	let companyWebsite = $state('');
	let formOpen = $state(
		untrack(() => initialPath.endsWith('/request')) ||
			(browser && ['plate', 'vin', 'make', 'model', 'year', 'mileage', 'phone'].some(initialParam))
	);
	let infoOpen = $state(false);
	let formStep = $state<1 | 2>(1);
	let sellSubmitState = $state<SellSubmitState>('idle');
	let sellSubmitMessage = $state('');

	const phoneHref = `tel:+359${daynightSite.phone.slice(1)}`;
	const sellErrorMessage = `Не успяхме да изпратим заявката. Опитайте отново или се обадете на ${daynightSite.phoneLabel}.`;
	const hasVehicleData = $derived(
		Boolean(plate.trim() || vin.trim() || make.trim() || model.trim())
	);
	const vehicleTitle = $derived(
		[make.trim(), model.trim()].filter(Boolean).join(' ') ||
			plate.trim().toUpperCase() ||
			vin.trim().toUpperCase() ||
			'Автомобил'
	);
	const vehicleMeta = $derived(
		[year.trim(), mileage.trim() && `${mileage.trim()} км`].filter(Boolean).join(' · ')
	);
	const submittedFields = $derived.by(() =>
		[
			['Рег. номер', plate.trim().toUpperCase()],
			['VIN', vin.trim().toUpperCase()],
			['Автомобил', [make.trim(), model.trim()].filter(Boolean).join(' ')],
			['Година', year.trim()],
			['Километри', mileage.trim()]
		]
			.filter(([, value]) => value)
			.map(([label, value]) => ({ label, value }))
	);

	function applyQuickIdentifier() {
		const raw = quickValue.trim().toUpperCase();
		if (!raw) return;
		const compact = raw.replace(/[\s-]/g, '');
		if (/^[A-HJ-NPR-Z0-9]{17}$/.test(compact)) {
			vin = compact;
		} else {
			plate = raw;
		}
	}

	function openForm() {
		applyQuickIdentifier();
		formStep = 1;
		sellSubmitMessage = '';
		if (sellSubmitState === 'error') sellSubmitState = 'idle';
		formOpen = true;
	}

	function openManualForm() {
		quickValue = '';
		openForm();
	}

	function closeForm() {
		formOpen = false;
		formStep = 1;
		sellSubmitMessage = '';
		if (sellSubmitState === 'error') sellSubmitState = 'idle';
	}

	function goBack() {
		formStep = 1;
		sellSubmitMessage = '';
		if (sellSubmitState === 'error') sellSubmitState = 'idle';
	}

	function buildNotes() {
		return [
			['Рег. номер', plate.trim().toUpperCase()],
			['VIN', vin.trim().toUpperCase()],
			['Марка', make.trim()],
			['Модел', model.trim()],
			['Година', year.trim()],
			['Километри', mileage.trim()]
		]
			.filter(([, value]) => value)
			.map(([label, value]) => `${label}: ${value}`)
			.join('\n');
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (formStep === 1) {
			if (!hasVehicleData) {
				sellSubmitState = 'error';
				sellSubmitMessage = 'Добавете номер, VIN или поне марка и модел.';
				return;
			}
			sellSubmitState = 'idle';
			sellSubmitMessage = '';
			formStep = 2;
			return;
		}

		if (sellSubmitState === 'submitting') return;
		const contactValue = phone.trim();
		if (!contactValue) {
			sellSubmitState = 'error';
			sellSubmitMessage = 'Въведете телефон за обратна връзка.';
			return;
		}

		sellSubmitState = 'submitting';
		sellSubmitMessage = '';
		const result = await submitLead({
			customerName: 'Мобилна заявка за оценка',
			contact: contactValue,
			email: null,
			phone: contactValue,
			source: 'sell-your-car-mobile',
			message: buildNotes(),
			companyWebsite
		});

		if (result.ok) {
			sellSubmitState = 'success';
			formOpen = false;
			formStep = 1;
			return;
		}

		sellSubmitState = 'error';
		sellSubmitMessage = result.error || sellErrorMessage;
	}

	function startAnother() {
		plate = '';
		vin = '';
		make = '';
		model = '';
		year = '';
		mileage = '';
		phone = '';
		quickValue = '';
		companyWebsite = '';
		sellSubmitState = 'idle';
		sellSubmitMessage = '';
		openForm();
	}
</script>

<div class="mobile-sell">
	<MobileLeadHero
		kind="sell"
		title="Продай автомобила"
		bind:value={quickValue}
		placeholder="Рег. номер или VIN"
		onSubmit={openForm}
		onInfo={() => (infoOpen = true)}
	/>

	<main id="main-content" tabindex="-1" class="mobile-lead-main">
		{#if sellSubmitState === 'success'}
			<section class="sell-success" aria-labelledby="sell-success-title">
				<span class="sell-success__icon"><CircleCheck size={22} strokeWidth={2.3} /></span>
				<div>
					<h2 id="sell-success-title">Заявката е изпратена</h2>
					<p>Ще се свържем с Вас за оценката и следващата стъпка.</p>
				</div>
				{#if submittedFields.length}
					<dl>
						{#each submittedFields as field (field.label)}
							<div>
								<dt>{field.label}</dt>
								<dd>{field.value}</dd>
							</div>
						{/each}
					</dl>
				{/if}
				<div class="sell-success__actions">
					<a href={phoneHref}><Phone size={17} strokeWidth={2.3} /> Обади се</a>
					<button type="button" onclick={startAnother}>Нова заявка</button>
				</div>
			</section>
		{:else}
			<div class="sell-trust-row" aria-label="Условия за оценка">
				<span>Безплатна оценка</span>
				<span aria-hidden="true">·</span>
				<span>До 1 работен ден</span>
			</div>
			<button
				class="sell-manual-banner"
				type="button"
				onclick={openManualForm}
				aria-label="Нямам номер или VIN. Въведи данните за автомобила ръчно"
			>
				<span class="sell-manual-banner__copy">
					<strong>Нямам номер или VIN</strong>
					<small>Въведи данните за автомобила ръчно.</small>
				</span>
				<img
					class="sell-manual-banner__art"
					src={resolve('/assets/images/sell/sell-manual-art-v1.webp')}
					alt=""
					aria-hidden="true"
				/>
			</button>
			<MobileLeadContactCard
				{phoneHref}
				title="Предпочиташ разговор?"
				copy="Ще помогнем с оценката и следващите стъпки."
			/>
		{/if}
	</main>

	<MobileFullSheet bind:open={formOpen} labelledBy="sell-sheet-title" onClose={closeForm}>
		<form class="lead-sheet" onsubmit={handleSubmit} aria-busy={sellSubmitState === 'submitting'}>
			<header class="lead-sheet__header">
				<button class="lead-sheet__close" type="button" onclick={closeForm} aria-label="Затвори">
					<X size={21} strokeWidth={2.25} />
				</button>
				<div>
					<span>Етап {formStep} от 2</span>
					<h2 id="sell-sheet-title">{formStep === 1 ? 'Автомобил' : 'Контакт'}</h2>
				</div>
				<span class="lead-sheet__spacer" aria-hidden="true"></span>
			</header>

			<div class="lead-sheet__progress" aria-hidden="true">
				<span class="is-active"></span><span class:is-active={formStep === 2}></span>
			</div>

			<div class="lead-sheet__body">
				{#if formStep === 1}
					<section class="lead-fields" aria-label="Данни за автомобила">
						<label class="lead-field">
							<span>Регистрационен номер</span>
							<input bind:value={plate} type="text" placeholder="CB 1234 AB" autocomplete="off" />
						</label>
						<label class="lead-field">
							<span>VIN <small>по желание</small></span>
							<input bind:value={vin} type="text" placeholder="WBA..." autocomplete="off" />
						</label>
						<div class="lead-field-grid">
							<label class="lead-field">
								<span>Марка</span>
								<input bind:value={make} type="text" placeholder="BMW" autocomplete="off" />
							</label>
							<label class="lead-field">
								<span>Модел</span>
								<input bind:value={model} type="text" placeholder="X5" autocomplete="off" />
							</label>
						</div>
						<div class="lead-field-grid">
							<label class="lead-field">
								<span>Година</span>
								<input bind:value={year} type="text" inputmode="numeric" placeholder="2020" />
							</label>
							<label class="lead-field">
								<span>Километри</span>
								<input bind:value={mileage} type="text" inputmode="numeric" placeholder="120 000" />
							</label>
						</div>
					</section>
				{:else}
					<section class="lead-fields" aria-label="Контакт">
						<div class="vehicle-summary">
							<div>
								<span>Автомобил</span><strong>{vehicleTitle}</strong>{#if vehicleMeta}<small
										>{vehicleMeta}</small
									>{/if}
							</div>
							<button type="button" onclick={goBack}>Редактирай</button>
						</div>
						<label class="lead-field">
							<span>Телефон</span>
							<input
								bind:value={phone}
								type="tel"
								inputmode="tel"
								placeholder="08..."
								autocomplete="tel"
								required
							/>
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

				{#if sellSubmitMessage}
					<p class="lead-error" role="alert">{sellSubmitMessage}</p>
				{/if}
			</div>

			<footer class="lead-sheet__footer">
				{#if formStep === 2}
					<button class="lead-back" type="button" onclick={goBack}>
						<ArrowLeft size={18} strokeWidth={2.4} /> Назад
					</button>
				{/if}
				<button class="lead-primary" type="submit" disabled={sellSubmitState === 'submitting'}>
					{formStep === 1
						? 'Продължи'
						: sellSubmitState === 'submitting'
							? 'Изпращаме…'
							: 'Изпрати за оценка'}
				</button>
			</footer>
		</form>
	</MobileFullSheet>

	<MobileFullSheet
		bind:open={infoOpen}
		labelledBy="sell-info-title"
		onClose={() => (infoOpen = false)}
	>
		<section class="info-sheet">
			<header class="info-sheet__header">
				<div>
					<span>Продажба</span>
					<h2 id="sell-info-title">Как работи</h2>
				</div>
				<button type="button" onclick={() => (infoOpen = false)} aria-label="Затвори"
					><X size={21} strokeWidth={2.25} /></button
				>
			</header>
			<div class="info-sheet__list">
				<article>
					<b>01</b><span
						><strong>Данни за колата</strong><small>Номер, VIN или основните параметри.</small
						></span
					>
				</article>
				<article>
					<b>02</b><span
						><strong>Кратко уточнение</strong><small>Свързваме се за състоянието и историята.</small
						></span
					>
				</article>
				<article>
					<b>03</b><span
						><strong>Конкретен вариант</strong><small>Получавате оценка и следваща стъпка.</small
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
	.mobile-sell {
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
		gap: 12px;
		margin-top: -14px;
		border-radius: 24px 24px 0 0;
		background: var(--sa-surface);
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

	.sell-trust-row {
		display: flex;
		min-height: 28px;
		align-items: center;
		justify-content: center;
		gap: 6px;
		color: var(--sa-muted);
		font-size: 12px;
		font-weight: var(--sa-weight-medium);
	}

	.sell-manual-banner {
		position: relative;
		display: grid;
		width: 100%;
		min-height: 156px;
		align-items: center;
		overflow: hidden;
		border: 1px solid #d8e0e8;
		border-radius: 16px;
		background: linear-gradient(90deg, #f4f7f9 0%, #eef2f5 58%, #e9eef2 100%);
		padding: 18px 148px 18px 18px;
		box-shadow: 0 1px 2px rgba(15, 20, 23, 0.04);
		text-align: left;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}
	.sell-manual-banner__copy {
		position: relative;
		z-index: 2;
		display: grid;
		gap: 7px;
		min-width: 0;
	}
	.sell-manual-banner__copy strong {
		max-width: 12ch;
		color: var(--sa-ink);
		font-size: 19px;
		font-weight: var(--sa-weight-strong);
		line-height: 1.08;
	}
	.sell-manual-banner__copy small {
		max-width: 20ch;
		color: var(--sa-muted);
		font-size: 13px;
		font-weight: var(--sa-weight-medium);
		line-height: 1.28;
	}
	.sell-manual-banner__art {
		position: absolute;
		top: 6px;
		right: 6px;
		bottom: 6px;
		width: 53%;
		height: calc(100% - 12px);
		border-radius: 11px;
		object-fit: cover;
		object-position: right center;
	}
	.sell-manual-banner::after {
		position: absolute;
		inset: 6px 42% 6px 6px;
		z-index: 1;
		background: linear-gradient(
			90deg,
			#f4f7f9 0%,
			rgba(244, 247, 249, 0.98) 76%,
			rgba(244, 247, 249, 0) 100%
		);
		content: '';
		pointer-events: none;
	}
	.sell-manual-banner:active {
		transform: scale(0.995);
	}
	.sell-manual-banner:focus-visible {
		outline: 2px solid var(--sa-red);
		outline-offset: 2px;
	}

	.sell-success {
		display: grid;
		grid-template-columns: 38px minmax(0, 1fr);
		gap: 11px;
		border: 1px solid var(--sa-line-strong);
		border-radius: var(--sa-r-md);
		background: #fff;
		padding: 14px;
	}

	.sell-success__icon {
		display: grid;
		width: 38px;
		height: 38px;
		place-items: center;
		border-radius: 50%;
		background: var(--sa-fill);
		color: var(--sa-red);
	}

	.sell-success h2,
	.sell-success p {
		margin: 0;
	}
	.sell-success h2 {
		font-size: var(--sa-mobile-type-card-title);
		font-weight: var(--sa-weight-strong);
	}
	.sell-success p {
		margin-top: 4px;
		color: var(--sa-muted);
		font-size: var(--sa-mobile-type-meta);
		line-height: var(--sa-mobile-leading-meta);
	}
	.sell-success dl {
		grid-column: 1 / -1;
		display: grid;
		gap: 1px;
		margin: 2px 0 0;
		overflow: hidden;
		border-radius: 10px;
		background: var(--sa-line);
	}
	.sell-success dl div {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		background: var(--sa-fill);
		padding: 8px 10px;
	}
	.sell-success dt {
		color: var(--sa-muted);
		font-size: var(--sa-mobile-type-micro);
	}
	.sell-success dd {
		margin: 0;
		font-size: var(--sa-mobile-type-micro);
		font-weight: var(--sa-weight-semibold);
		text-align: right;
	}
	.sell-success__actions {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}
	.sell-success__actions a,
	.sell-success__actions button {
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
	.sell-success__actions a {
		background: var(--sa-red);
		color: #fff;
	}
	.sell-success__actions button {
		background: var(--sa-fill);
		color: var(--sa-ink);
	}

	.lead-sheet {
		display: grid;
		height: 100%;
		grid-template-rows: auto auto minmax(0, 1fr) auto;
		background: var(--sa-surface);
	}

	.lead-sheet__header {
		display: grid;
		grid-template-columns: 40px minmax(0, 1fr) 40px;
		align-items: center;
		gap: 8px;
		border-bottom: 0;
		background: var(--sa-surface);
		color: var(--sa-ink);
		padding: calc(env(safe-area-inset-top) + 8px) var(--sa-mobile-gutter) 7px;
	}

	.lead-sheet__header > div {
		display: grid;
		gap: 1px;
		text-align: center;
	}
	.lead-sheet__header span {
		color: var(--sa-muted);
		font-size: 11px;
		font-weight: var(--sa-weight-semibold);
		line-height: 1.2;
	}
	.lead-sheet__header h2 {
		margin: 0;
		color: var(--sa-ink);
		font-size: 17px;
		font-weight: var(--sa-weight-strong);
		line-height: 1.2;
	}
	.lead-sheet__close {
		display: grid;
		width: 40px;
		height: 40px;
		place-items: center;
		border: 0;
		border-radius: 50%;
		background: var(--sa-fill);
		color: var(--sa-ink);
		padding: 0;
		cursor: pointer;
	}
	.lead-sheet__spacer {
		width: 40px;
		height: 40px;
	}

	.lead-sheet__progress {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 4px;
		background: var(--sa-surface);
		padding: 0 var(--sa-mobile-gutter) 8px;
	}
	.lead-sheet__progress span {
		height: 3px;
		border-radius: 999px;
		background: var(--sa-fill-2);
	}
	.lead-sheet__progress span.is-active {
		background: var(--sa-red);
	}

	.lead-sheet__body {
		overflow-y: auto;
		overscroll-behavior: contain;
		background: var(--sa-surface);
		padding: 10px var(--sa-mobile-gutter) 18px;
	}
	.lead-fields {
		display: grid;
		gap: 10px;
	}
	.lead-field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
	}
	.lead-field {
		display: grid;
		min-width: 0;
		gap: 5px;
		border: 0;
		background: transparent;
		padding: 0;
	}
	.lead-field:focus-within {
		box-shadow: none;
	}
	.lead-field > span {
		color: var(--sa-muted);
		font-size: 11px;
		font-weight: var(--sa-weight-semibold);
		line-height: 1.2;
	}
	.lead-field > span small {
		font: inherit;
		font-weight: var(--sa-weight-regular);
	}
	.lead-field input {
		width: 100%;
		min-width: 0;
		border: 0;
		border-radius: 10px;
		background: var(--sa-fill);
		color: var(--sa-ink);
		font: var(--sa-weight-medium) 16px / 1.25 var(--sa-font);
		outline: 0;
		resize: none;
	}
	.lead-field input {
		height: 46px;
		padding: 0 12px;
	}
	.lead-field input:focus {
		background: var(--sa-fill);
		box-shadow: inset 0 0 0 2px rgba(213, 0, 50, 0.46);
	}
	.lead-field input::placeholder {
		color: #7f8995;
		opacity: 1;
	}
	.vehicle-summary {
		display: flex;
		min-height: 58px;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		border: 0;
		border-radius: 10px;
		background: var(--sa-fill);
		padding: 8px 10px;
	}
	.vehicle-summary > div {
		display: grid;
		min-width: 0;
		gap: 2px;
	}
	.vehicle-summary span {
		color: var(--sa-muted);
		font-size: 11px;
	}
	.vehicle-summary strong {
		overflow: hidden;
		color: var(--sa-ink);
		font-size: var(--sa-mobile-type-body);
		font-weight: var(--sa-weight-strong);
		line-height: 1.2;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.vehicle-summary small {
		color: var(--sa-muted);
		font-size: 11px;
	}
	.vehicle-summary button {
		min-height: 36px;
		flex: 0 0 auto;
		border: 0;
		border-radius: 9px;
		background: var(--sa-surface);
		color: var(--sa-ink);
		font: var(--sa-weight-semibold) 11px / 1 var(--sa-font);
		padding: 0 10px;
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
		padding: 9px 10px;
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
		background: var(--sa-surface);
		padding: 9px var(--sa-mobile-gutter) calc(9px + env(safe-area-inset-bottom));
	}
	.lead-sheet__footer > .lead-primary:only-child {
		grid-column: 1 / -1;
	}
	.lead-back,
	.lead-primary {
		display: inline-flex;
		min-height: 46px;
		align-items: center;
		justify-content: center;
		gap: 6px;
		border: 0;
		border-radius: 11px;
		font: var(--sa-weight-semibold) var(--sa-mobile-type-control-sm) / 1 var(--sa-font);
		cursor: pointer;
	}
	.lead-back {
		background: var(--sa-fill);
		color: var(--sa-ink);
		padding: 0 12px;
	}
	.lead-primary {
		background: var(--sa-red);
		color: #fff;
		padding: 0 16px;
	}
	.lead-primary:disabled {
		background: var(--sa-fill-2);
		color: var(--sa-muted);
		cursor: not-allowed;
	}
	.lead-sheet button:focus-visible,
	.lead-sheet input:focus-visible {
		outline: 2px solid var(--sa-red);
		outline-offset: 2px;
	}

	.info-sheet {
		display: grid;
		height: 100%;
		grid-template-rows: auto minmax(0, 1fr) auto;
		background: #f5f7f9;
	}
	.info-sheet__header {
		display: grid;
		grid-template-columns: 40px minmax(0, 1fr) 40px;
		align-items: center;
		gap: 8px;
		border-bottom: 1px solid var(--sa-line);
		background: #fff;
		padding: calc(env(safe-area-inset-top) + 10px) var(--sa-mobile-gutter) 10px;
	}
	.info-sheet__header > div {
		grid-column: 2;
		grid-row: 1;
		display: grid;
		gap: 1px;
		text-align: center;
	}
	.info-sheet__header span {
		color: var(--sa-red);
		font-size: 11px;
		font-weight: var(--sa-weight-semibold);
		line-height: 1.2;
	}
	.info-sheet__header h2 {
		margin: 0;
		color: var(--sa-ink);
		font-size: 19px;
		font-weight: var(--sa-weight-strong);
		line-height: 1.15;
	}
	.info-sheet__header button {
		grid-column: 3;
		grid-row: 1;
		display: grid;
		width: 40px;
		height: 40px;
		place-items: center;
		justify-self: end;
		border: 0;
		border-radius: 50%;
		background: var(--sa-fill);
		color: var(--sa-ink);
		padding: 0;
		cursor: pointer;
	}
	.info-sheet__list {
		display: grid;
		align-content: start;
		gap: 10px;
		overflow-y: auto;
		padding: 16px var(--sa-mobile-gutter);
	}
	.info-sheet__list article {
		display: grid;
		grid-template-columns: 40px minmax(0, 1fr);
		align-items: center;
		gap: 11px;
		min-height: 72px;
		border: 1px solid #e0e5eb;
		border-radius: 14px;
		background: #fff;
		padding: 10px 11px;
	}
	.info-sheet__list b {
		display: grid;
		width: 40px;
		height: 40px;
		place-items: center;
		border-radius: 50%;
		background: #fff0f3;
		color: var(--sa-red);
		font-size: 11px;
		font-weight: var(--sa-weight-strong);
	}
	.info-sheet__list article > span {
		display: grid;
		gap: 3px;
	}
	.info-sheet__list strong {
		color: var(--sa-ink);
		font-size: 15px;
		font-weight: var(--sa-weight-semibold);
		line-height: 1.2;
	}
	.info-sheet__list small {
		color: var(--sa-muted);
		font-size: 12px;
		line-height: 1.3;
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
		.mobile-sell {
			display: flex;
			flex-direction: column;
		}
	}
</style>
