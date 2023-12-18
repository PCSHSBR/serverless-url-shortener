<script lang="ts">
	import Icon from '@iconify/svelte';
	import { fade } from 'svelte/transition';
	import { SignedIn, SignedOut, collectionStore, userStore } from 'sveltefire';
	import { auth, db, signIn } from '$lib/client/firebase';
	import ShortedLink from '$lib/components/ShortenLink/ShortedLink.svelte';
	import linkGlass from '$lib/assets/linkGlass.png';
	import CreateShortenedLink from '$lib/components/CreateShortenedLink.svelte';
	import CreateAndShowHistory from '$lib/components/CreateAndShowHistory.svelte';
	import { collection, query } from 'firebase/firestore';
	import type { Link } from '$lib/client/dynamic-link';

	const user = userStore(auth);
</script>

<svelte:head>
	<title>PCSHSBR Short</title>
</svelte:head>

<section class="max-w-[calc(792px-24px)] w-[calc(100vw-64px)] mx-auto mt-10">
	<h1 class="text-6xl leading-snug">
		<span class="flex w-[128px] h-[128px]">
			<img src={linkGlass} class="object-cover w-full h-full" alt="" />
		</span>
		Make the URL <span class="font-extrabold text-primary"> shorter than before </span> now.
	</h1>
	<SignedIn>
		<CreateAndShowHistory />
	</SignedIn>
	<div
		class="carousel carousel-center w-full px-1 py-4 space-x-4 bg-neutral rounded-box md:justify-center justify-start"
	>
		<div
			class="carousel-item feature-container-card sm:w-52 w-[calc(100%-28px)] box-content flex p-4 flex-col sm:items-center items-start h-64 rounded-2xl"
		>
			<Icon icon="mdi:fast-forward" class="text-6xl" />
			<h2 class="text-2xl">Fast</h2>
			<p>
				pcshs-short Makes the use of various websites significantly faster by allowing you to access links.
				shortened
			</p>
		</div>
		<div
			class="carousel-item feature-container-card sm:w-52 w-[calc(100%-28px)] box-content flex p-4 flex-col sm:items-center items-start h-64 rounded-2xl"
		>
			<Icon icon="mdi:link" class="text-6xl" />
			<h2 class="text-2xl">More short!</h2>
			<p>psh-short Make the link shorter, no matter how long the link is.</p>
		</div>
		<div
			class="carousel-item feature-container-card relative sm:w-52 w-[calc(100%-28px)] box-content flex p-4 flex-col sm:items-center items-start h-64 rounded-2xl"
		>
			<div>
				<Icon icon="mdi:play" class="text-6xl" />
				<h2 class="text-2xl font-bold">Get started now</h2>
				<small>
					Special for email <code>@pccbr.ac.th</code> and
<code>@pcshsbr.ac.th</code> only
				</small>
			</div>
			<a href={$user ? '/dashboard' : 'login'}
				><button class="btn btn-primary absolute bottom-0 left-0 right-0 m-3 box-border"
					>{$user ? 'ไปยังแดชบอร์ด' : 'สร้าง'}</button
				></a
			>
		</div>
	</div>
	<div>
		<SignedOut>
			<p class="text-center">
				<a href="/login"><button class="btn btn-ghost btn-sm">เข้าสู่ระบบ</button></a> เพื่อเริ่มใช้งาน
			</p>
		</SignedOut>
	</div>
</section>
