<script lang="ts">
	import { ArrowUpRight, Play, X } from '@lucide/svelte';
	import { homeVideos, youtubeChannelUrl } from '$lib/data/daynight-videos';
	import { tick } from 'svelte';

	let activeVideo = $state<string | null>(null);
	let trigger: HTMLButtonElement | undefined;

	function play(id: string, event: MouseEvent) {
		trigger = event.currentTarget as HTMLButtonElement;
		activeVideo = id;
	}

	async function stop() {
		const previous = trigger;
		activeVideo = null;
		await tick();
		previous?.focus();
	}
</script>

<section class="mobile-home-videos" aria-labelledby="mobile-home-videos-title">
	<header class="mobile-home-videos__head">
		<div>
			<span class="mobile-home-videos__eyebrow"><Play size={16} fill="currentColor" /> YouTube</span
			>
			<h2 id="mobile-home-videos-title">Гледай Day Night Auto</h2>
		</div>
		<a
			href={youtubeChannelUrl}
			target="_blank"
			rel="noopener noreferrer"
			aria-label="Всички видеа в YouTube"
		>
			<ArrowUpRight size={20} strokeWidth={2.4} />
		</a>
	</header>

	<div class="mobile-home-videos__rail">
		{#each homeVideos as video (video.id)}
			<article class="mobile-video-card">
				<div class="mobile-video-card__media">
					{#if activeVideo === video.id}
						<iframe
							src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&playsinline=1&hl=bg`}
							title={video.title}
							allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
							allowfullscreen
							referrerpolicy="strict-origin-when-cross-origin"
						></iframe>
						<button
							class="mobile-video-card__close"
							type="button"
							onclick={stop}
							aria-label={`Затвори видеото: ${video.title}`}
						>
							<X size={18} strokeWidth={2.5} />
						</button>
					{:else}
						<button
							class="mobile-video-card__play"
							type="button"
							onclick={(event) => play(video.id, event)}
							aria-label={`Пусни видеото: ${video.title}`}
						>
							<img
								src={video.thumbnail}
								alt=""
								width="720"
								height="404"
								loading="lazy"
								decoding="async"
							/>
							<span class="mobile-video-card__shade" aria-hidden="true"></span>
							<span class="mobile-video-card__playmark" aria-hidden="true"
								><Play size={20} fill="currentColor" /></span
							>
							<span class="mobile-video-card__duration">{video.duration}</span>
							<strong>{video.title}</strong>
						</button>
					{/if}
				</div>
			</article>
		{/each}

		<a
			class="mobile-video-card mobile-video-card--all"
			href={youtubeChannelUrl}
			target="_blank"
			rel="noopener noreferrer"
		>
			<span class="mobile-video-card--all__icon"><Play size={27} fill="currentColor" /></span>
			<strong>Всички видеа</strong>
			<span>Към канала <ArrowUpRight size={16} strokeWidth={2.4} /></span>
		</a>
	</div>
</section>

<style>
	.mobile-home-videos {
		display: grid;
		gap: 10px;
		padding: 0 var(--sa-mobile-gutter);
	}

	.mobile-home-videos__head {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 12px;
		border-radius: 14px;
		background: #111315;
		padding: 16px;
		color: #fff;
	}

	.mobile-home-videos__head > div {
		display: grid;
		gap: 4px;
	}

	.mobile-home-videos__eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: #ff3152 !important;
		font-size: var(--sa-mobile-type-micro);
		font-weight: var(--sa-weight-semibold);
		line-height: 1;
		text-transform: uppercase;
	}

	.mobile-home-videos__head h2 {
		margin: 0;
		color: #fff !important;
		font-size: var(--sa-mobile-type-section-title);
		font-weight: var(--sa-weight-strong);
		line-height: var(--sa-mobile-leading-heading);
	}

	.mobile-home-videos__head > a {
		display: grid;
		width: 44px;
		height: 44px;
		flex: 0 0 44px;
		place-items: center;
		border: 1px solid rgba(255, 255, 255, 0.24);
		border-radius: 50%;
		color: #fff !important;
	}

	.mobile-home-videos__rail {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: min(82vw, 316px);
		gap: 10px;
		overflow-x: auto;
		margin-inline: calc(var(--sa-mobile-gutter) * -1);
		padding: 0 var(--sa-mobile-gutter) 4px;
		scroll-padding-inline: var(--sa-mobile-gutter);
		scroll-snap-type: x proximity;
		scrollbar-width: none;
	}

	.mobile-home-videos__rail::-webkit-scrollbar {
		display: none;
	}

	.mobile-video-card {
		display: block;
		min-width: 0;
		overflow: hidden;
		border-radius: 12px;
		background: #111315;
		scroll-snap-align: start;
	}

	.mobile-video-card__media {
		position: relative;
		aspect-ratio: 16 / 9;
		background: #111315;
	}

	.mobile-video-card iframe,
	.mobile-video-card__play,
	.mobile-video-card__play img {
		display: block;
		width: 100%;
		height: 100%;
	}

	.mobile-video-card iframe {
		border: 0;
	}

	.mobile-video-card__play {
		position: relative;
		border: 0;
		background: #111315;
		padding: 0;
		color: #fff;
		cursor: pointer;
		text-align: left;
	}

	.mobile-video-card__play img {
		object-fit: cover;
	}

	.mobile-video-card__shade {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.05) 28%, rgba(0, 0, 0, 0.84) 100%);
	}

	.mobile-video-card__play strong {
		color: #fff !important;
		position: absolute;
		right: 12px;
		bottom: 11px;
		left: 12px;
		display: -webkit-box;
		overflow: hidden;
		font-size: var(--sa-mobile-type-control-sm);
		font-weight: var(--sa-weight-semibold);
		line-height: 1.3;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	.mobile-video-card__playmark {
		position: absolute;
		top: calc(50% - 22px);
		left: calc(50% - 28px);
		display: grid;
		width: 56px;
		height: 44px;
		place-items: center;
		border-radius: 12px;
		background: #e11d2e;
		color: #fff;
	}

	.mobile-video-card__duration {
		color: #fff !important;
		position: absolute;
		top: 10px;
		right: 10px;
		border-radius: 5px;
		background: rgba(0, 0, 0, 0.78);
		padding: 3px 6px;
		font-size: var(--sa-mobile-type-micro);
		font-weight: var(--sa-weight-semibold);
		line-height: 1.2;
	}

	.mobile-video-card__close {
		position: absolute;
		top: 8px;
		right: 8px;
		display: grid;
		width: 44px;
		height: 44px;
		place-items: center;
		border: 1px solid rgba(255, 255, 255, 0.34);
		border-radius: 50%;
		background: rgba(17, 19, 21, 0.92);
		color: #fff;
		cursor: pointer;
	}

	.mobile-video-card--all {
		display: flex;
		min-height: 178px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 7px;
		border: 1px solid var(--sa-line);
		background: var(--sa-fill);
		padding: 14px;
		color: var(--sa-ink) !important;
		text-align: center;
		text-decoration: none;
	}

	.mobile-video-card--all__icon {
		color: #e11d2e;
	}
	.mobile-video-card--all strong {
		color: var(--sa-ink) !important;
		font-size: var(--sa-mobile-type-feature-title);
		font-weight: var(--sa-weight-strong);
	}
	.mobile-video-card--all > span:last-child {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		gap: 6px;
		font-size: var(--sa-mobile-type-control-sm);
		font-weight: var(--sa-weight-semibold);
	}

	.mobile-home-videos a:focus-visible,
	.mobile-home-videos button:focus-visible,
	.mobile-home-videos iframe:focus-visible {
		outline: 3px solid var(--sa-red);
		outline-offset: 2px;
	}

	@media (max-width: 370px) {
		.mobile-home-videos {
			padding-inline: 12px;
		}
		.mobile-home-videos__rail {
			margin-inline: -12px;
			padding-inline: 12px;
			scroll-padding-inline: 12px;
		}
	}
</style>
