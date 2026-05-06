<script lang="ts">
	type Props = {
		title?: string;
		markdown: string;
	};

	let { title = 'Why this works', markdown }: Props = $props();

	// Tiny markdown subset — enough for the concept cards (paragraphs, **bold**,
	// `code`, headings, lists, blank-line separators). Avoids pulling in a full
	// markdown library and keeps the bundle thin.
	function escape(s: string) {
		return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	function inline(s: string) {
		return escape(s)
			.replace(/`([^`]+)`/g, '<code class="rounded-md bg-(--color-mist) px-1.5 py-0.5 font-mono text-[0.92em]">$1</code>')
			.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
			.replace(/\*([^*]+)\*/g, '<em>$1</em>');
	}

	const html = $derived.by(() => {
		const blocks = markdown.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
		return blocks
			.map((block) => {
				if (block.startsWith('### ')) return `<h4 class="font-display mt-3 text-base font-extrabold">${inline(block.slice(4))}</h4>`;
				if (block.startsWith('## ')) return `<h3 class="font-display mt-3 text-lg font-extrabold">${inline(block.slice(3))}</h3>`;
				if (block.startsWith('> ')) {
					return `<blockquote class="border-l-4 border-(--color-duck-yellow-deep) pl-3 italic text-(--color-night-soft)">${inline(block.slice(2))}</blockquote>`;
				}
				if (/^[-*] /.test(block)) {
					const items = block.split('\n').map((l) => `<li>${inline(l.replace(/^[-*]\s+/, ''))}</li>`).join('');
					return `<ul class="list-disc space-y-1 pl-5">${items}</ul>`;
				}
				return `<p>${inline(block).replace(/\n/g, '<br/>')}</p>`;
			})
			.join('');
	});
</script>

<aside
	class="card relative overflow-hidden rounded-3xl p-6"
	style="background: linear-gradient(180deg, white 0%, #fff8ec 100%);"
>
	<div class="mb-2 flex items-center gap-2">
		<span class="text-xl">💡</span>
		<h3 class="font-display text-lg font-extrabold">{title}</h3>
	</div>
	<div class="prose-sm space-y-3 leading-relaxed text-(--color-night-soft)">{@html html}</div>
</aside>
