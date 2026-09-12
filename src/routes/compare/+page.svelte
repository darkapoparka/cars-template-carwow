<script lang="ts">
	import MobileComparePage from '$lib/components/compare/MobileComparePage.svelte';
	import CompareContent from '$lib/components/compare/CompareContent.svelte';
	import PublicStorefrontRoute from '$lib/components/layout/PublicStorefrontRoute.svelte';
	import RouteSeo from '$lib/components/seo/RouteSeo.svelte';
	import { isPhoneViewport, isDesktopOrServerViewport } from '$lib/hooks/is-mobile.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const showMobileChrome = $derived(isPhoneViewport());
	const showDesktopChrome = $derived(isDesktopOrServerViewport());
</script>

<RouteSeo title={data.seo.title} description={data.seo.description} />

{#if showMobileChrome}
	<MobileComparePage />
{/if}
{#if showDesktopChrome}
	<PublicStorefrontRoute mainContentAnchor mobileReplaced>
		<CompareContent />
	</PublicStorefrontRoute>
{/if}
