<script lang="ts">
	import { CarFront, Globe2, House, Menu, Tag } from '@lucide/svelte';

	let {
		name,
		active = false
	}: { name: 'home' | 'car' | 'sell' | 'import' | 'menu'; active?: boolean } = $props();

	const strokeWidth = $derived(active ? 2.35 : 2);
</script>

{#if name === 'home'}
	<House size={24} {strokeWidth} aria-hidden="true" />
{:else if name === 'car'}
	<CarFront size={24} {strokeWidth} aria-hidden="true" />
{:else if name === 'sell'}
	<Tag size={24} {strokeWidth} aria-hidden="true" />
{:else if name === 'import'}
	<Globe2 size={24} {strokeWidth} aria-hidden="true" />
{:else}
	<Menu size={24} {strokeWidth} aria-hidden="true" />
{/if}
