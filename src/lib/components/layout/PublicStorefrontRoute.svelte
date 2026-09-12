<script lang="ts">
	import type { Snippet } from 'svelte';
	import DesktopHomeTrailingChrome from '$lib/components/home/desktop/DesktopHomeTrailingChrome.svelte';
	import MobileBottomDock from '$lib/components/home/mobile/MobileBottomDock.svelte';
	import MobileHeader from '$lib/components/home/mobile/MobileHeader.svelte';
	import { isPhoneViewport } from '$lib/hooks/is-mobile.svelte';
	import DayNightFooter from './DayNightFooter.svelte';
	import RouteImageBehavior from './RouteImageBehavior.svelte';
	import SiteChrome from './SiteChrome.svelte';
	import StorefrontShell from './StorefrontShell.svelte';

	type SearchHref = '/' | '/inventory' | '/contact';

	interface Props {
		children: Snippet;
		imageBehavior?: boolean;
		mainContentAnchor?: boolean;
		mobileReplaced?: boolean;
		searchHref?: SearchHref;
	}

	let {
		children,
		imageBehavior = true,
		mainContentAnchor = false,
		mobileReplaced = false,
		searchHref = '/inventory'
	}: Props = $props();
	const showMobileChrome = $derived(isPhoneViewport());
</script>

{#if imageBehavior}
	<RouteImageBehavior />
{/if}

{#if showMobileChrome}
	<MobileHeader {searchHref} />
{/if}

<StorefrontShell {mobileReplaced}>
	{#if mainContentAnchor}
		<span id="main-content" tabindex="-1" class="sr-only"></span>
	{/if}
	<SiteChrome />
	{@render children()}
	<DayNightFooter />
</StorefrontShell>

<DesktopHomeTrailingChrome />

{#if showMobileChrome}
	<MobileBottomDock />
{/if}
