<script lang="ts">
	import { readDuckFile, type DuckShare } from '$lib/share/duckfile';

	type Props = {
		onLoaded: (share: DuckShare) => void;
		hint?: string;
	};

	let { onLoaded, hint = 'Drop a .duck file or pick one' }: Props = $props();

	let error = $state('');
	let dragging = $state(false);
	let input: HTMLInputElement | undefined = $state();

	async function handle(files: FileList | null | undefined) {
		error = '';
		if (!files || files.length === 0) return;
		const share = await readDuckFile(files[0]);
		if (!share) {
			error = 'That file does not look like a Ducky share.';
			return;
		}
		onLoaded(share);
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		dragging = false;
		void handle(e.dataTransfer?.files);
	}

	function onPick() {
		input?.click();
	}
</script>

<div
	class="rounded-2xl border-2 border-dashed p-6 text-center transition"
	class:bg-egg-cream={!dragging}
	class:bg-duck-yellow={dragging}
	class:border-night-soft={!dragging}
	class:border-night-ink={dragging}
	role="button"
	tabindex="0"
	onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && onPick()}
	onclick={onPick}
	ondragover={(e) => {
		e.preventDefault();
		dragging = true;
	}}
	ondragleave={() => (dragging = false)}
	ondrop={onDrop}
>
	<p class="mb-3 font-display text-base font-bold text-night-ink">{hint}</p>
	<button class="rounded-full bg-night-ink px-4 py-2 text-sm font-semibold text-white" type="button">
		Choose .duck file
	</button>
	{#if error}
		<p class="mt-3 text-sm text-sunset-coral">{error}</p>
	{/if}
	<input
		type="file"
		accept=".duck,application/json"
		bind:this={input}
		class="hidden"
		onchange={(e) => handle((e.currentTarget as HTMLInputElement).files)}
	/>
</div>
