<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import { exportPet } from '$lib/stores/pet';
	import { encodeShare, buildShareUrl, makePetShare, downloadDuckFile } from '$lib/share/duckfile';

	type Props = {
		variant?: 'pet' | 'remix';
		remix?: { missionId: string; code: string; notes?: string };
		title?: string;
	};

	let { variant = 'pet', remix, title = 'Share your duck' }: Props = $props();

	let url = $state('');
	let qrDataUrl = $state('');
	let copied = $state(false);
	let busy = $state(false);

	async function build() {
		busy = true;
		const pet = exportPet();
		const share =
			variant === 'remix' && remix
				? { ...makePetShare(pet), type: 'remix' as const, remix, exportedAt: Date.now() }
				: makePetShare(pet);
		const hash = await encodeShare(share);
		url = buildShareUrl(hash);
		qrDataUrl = await QRCode.toDataURL(url, {
			margin: 1,
			width: 220,
			color: { dark: '#1c1f2e', light: '#fff8ec' }
		});
		busy = false;
	}

	async function copy() {
		try {
			await navigator.clipboard.writeText(url);
			copied = true;
			setTimeout(() => (copied = false), 1600);
		} catch {
			/* no-op */
		}
	}

	function download() {
		const pet = exportPet();
		const share =
			variant === 'remix' && remix
				? { ...makePetShare(pet), type: 'remix' as const, remix, exportedAt: Date.now() }
				: makePetShare(pet);
		downloadDuckFile(share);
	}

	onMount(() => {
		void build();
	});
</script>

<div class="rounded-2xl bg-egg-cream p-5 shadow-soft">
	<h3 class="mb-3 font-display text-lg font-bold text-night-ink">{title}</h3>

	{#if busy}
		<p class="text-sm text-night-soft">Wrapping up your duck…</p>
	{:else if qrDataUrl}
		<div class="flex flex-col items-center gap-3">
			<img src={qrDataUrl} alt="QR code linking to shareable duck" width="220" height="220" />
			<input
				class="w-full rounded-md bg-mist px-3 py-2 text-xs text-night-soft"
				readonly
				value={url}
			/>
			<div class="flex gap-2">
				<button
					class="rounded-full bg-night-ink px-4 py-2 text-sm font-semibold text-white"
					onclick={copy}
				>
					{copied ? 'Copied!' : 'Copy link'}
				</button>
				<button
					class="rounded-full bg-duck-yellow px-4 py-2 text-sm font-semibold text-night-ink"
					onclick={download}
				>
					Download .duck
				</button>
				<button
					class="rounded-full bg-white px-4 py-2 text-sm font-semibold text-night-soft border border-mist"
					onclick={build}
				>
					Refresh
				</button>
			</div>
			<p class="max-w-xs text-center text-xs text-night-soft">
				Share the QR or link — your friend can scan it in Chrome and adopt your duck on their device.
			</p>
		</div>
	{/if}
</div>
