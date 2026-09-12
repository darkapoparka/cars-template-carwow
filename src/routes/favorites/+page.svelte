<script lang="ts">
	import DesktopFavoritesPage from '$lib/components/favorites/desktop/DesktopFavoritesPage.svelte';
	import MobileFavoritesPage from '$lib/components/favorites/mobile/MobileFavoritesPage.svelte';
	import PublicStorefrontRoute from '$lib/components/layout/PublicStorefrontRoute.svelte';
	import RouteSeo from '$lib/components/seo/RouteSeo.svelte';
	import { isDesktopOrServerViewport, isPhoneViewport } from '$lib/hooks/is-mobile.svelte';

	const showMobileShell = $derived(isPhoneViewport());
	const showDesktopShell = $derived(isDesktopOrServerViewport());
</script>

<RouteSeo
	title="Запазени автомобили · Day Night Auto"
	description="Запазени автомобили от наличността на Day Night Auto София."
/>

{#if showMobileShell}
	<MobileFavoritesPage />
{/if}

{#if showDesktopShell}
	<PublicStorefrontRoute mobileReplaced>
		<DesktopFavoritesPage />
	</PublicStorefrontRoute>
{/if}
