<script lang="ts">
	import QrCanvas from '$lib/components/QrCanvas.svelte';
	import Icon from '@iconify/svelte';
	import ShowLinkField from './ShowLinkField.svelte';
	import { twMerge } from 'tailwind-merge';
	import { dev } from '$app/environment';
	import slug from 'slug';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	export let link: string = 'https://phu.best/qqq';
	export { clazz as class };
	// export let views: number = 512;
	// export let statisticsLink: string = '/dashboard/links/statistics/qqq';
	// export let editLink: string = '/dashboard/links/edit/qqq';
	// export let deleteLink: string = '/dashboard/links/delete/qqq?confirm=1';
	export let originalLink: string = 'https://www.youtube.com/watch?v=zZdVwTjUtjg';
	let imageqr: HTMLImageElement | null = null;
	let clazz = '';

	function DownloadQRImage() {
		const a = document.createElement('a');
		if (!imageqr) return dev && console.error('imageqr is null');
		a.href = imageqr.src;
		a.download = slug(originalLink) + '.png';
		a.click();
		a.remove();
	}
	async function copyQRImageToClipboars() {
		if (!imageqr) return dev && console.error('imageqr is null');
		try {
			const data = await fetch(imageqr.src);
			const blob = await data.blob();
			await navigator.clipboard.write([
				new ClipboardItem({
					[blob.type]: blob
				})
			]);
		} catch (err: any) {
			console.error('error copying image',{cause: err});
		}
	}
</script>

<div
	transition:fly={{ duration: 300, easing: quintOut }}
	class={twMerge('flex gap-4 md:flex-row flex-col md:justify-between justify-normal p-4', clazz)}
>
	<div class="flex md:flex-row flex-col items-enter gap-4 w-full">
		<QrCanvas bind:imageele={imageqr} content={link} size={512} class="w-28 h-28" />
		<div class="flex flex-col w-full">
			<ShowLinkField title="Shortened Link" {link} />
			<ShowLinkField title="Destination Link" link={originalLink} />
		</div>
	</div>
	<div class="text-md md:text-sm flex md:justify-start gap-2 flex-col md:w-56">
		<!-- <button class="btn btn-sm btn-primary"
			><Icon icon="mdi:eye" />
			<span class="hidden md:inline"> ดูสถิติ </span>
		</button> -->
		<button class="btn btn-sm btn-primary" on:click={copyQRImageToClipboars}
			><Icon icon="mdi:content-copy" />
			<span> Copy Image </span>
		</button>
		<button class="btn btn-sm btn-primary" on:click={DownloadQRImage}
			><Icon icon="mdi:download" />
			<span> Save QR Code </span>
		</button>
		<!-- <button class="btn btn-sm btn-primary"
			><Icon icon="mdi:edit" /><span class="hidden md:inline"> แก้ไข </span>
		</button> -->
		<!-- <button class="btn btn-sm btn-primary"
			><Icon icon="mdi:delete" />
			<span class="hidden md:inline"> ลบ </span>
		</button> -->
	</div>
</div>

<style lang="scss">
	.main-container {
		grid-template-columns: 13rem 1fr;
		@apply md:grid p-4 bg-base-200 shadow-xl rounded-xl flex flex-col justify-center md:items-start items-center;
	}
</style>
