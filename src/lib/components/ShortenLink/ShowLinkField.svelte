<script lang="ts">
	import Icon from '@iconify/svelte';
	export let link: string = 'https://placeholder.com/300x300';
	export let title = 'Link';
	export let disabledCopy = false;

	function copyLinkToClipboard() {
		navigator.clipboard.writeText(link);
	}
</script>

<div class="">
	<span class="text-sm">{title}</span>
	<div
		class="flex justify-between flex-row items-center gap-3 line-clamp-1 join my-1 join-horizontal"
	>
		<p class="p-1.5 text-sm bg-base-300 w-full truncate">
			<a class="link link-hover" href={link}>{link}</a>
		</p>
		{#if !disabledCopy}
			<button class="btn btn-sm min-w-0" on:click|preventDefault={copyLinkToClipboard}
				><Icon icon="mdi:content-copy" class="h-4 w-4 rounded-none" />
				<span class="sr-only">Click to copy</span>
			</button>
		{/if}
	</div>
</div>
