<script lang="ts">
	type Props = {
		initial: string;
		code: string;
	};

	let { initial, code = $bindable() }: Props = $props();

	let textarea: HTMLTextAreaElement | undefined = $state();

	$effect(() => {
		if (!code) code = initial;
	});

	function resize() {
		if (!textarea) return;
		textarea.style.height = 'auto';
		textarea.style.height = textarea.scrollHeight + 'px';
	}

	$effect(() => {
		// trigger resize on code changes
		void code;
		queueMicrotask(resize);
	});
</script>

<div class="rounded-2xl bg-night-ink p-3 shadow-soft">
	<div class="mb-2 flex items-center justify-between">
		<span class="font-mono text-xs uppercase tracking-wider text-duck-yellow">main.py</span>
		<button
			class="text-xs text-duck-yellow underline"
			onclick={() => {
				code = initial;
				queueMicrotask(resize);
			}}
		>
			reset to template
		</button>
	</div>
	<textarea
		bind:this={textarea}
		bind:value={code}
		oninput={resize}
		spellcheck="false"
		class="block w-full resize-none bg-transparent font-mono text-sm leading-snug text-egg-cream outline-none"
		style="min-height: 240px;"
	></textarea>
</div>
