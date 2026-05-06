<script lang="ts">
	type Props = {
		markdown: string;
	};
	let { markdown }: Props = $props();

	const KEYWORDS = new Set([
		'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await',
		'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except',
		'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda',
		'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield'
	]);

	const BUILTINS = new Set([
		'display', 'sleep', 'running_time', 'print', 'temperature', 'compass',
		'accelerometer', 'microphone', 'music', 'radio', 'button_a', 'button_b',
		'pin_logo', 'uart', 'Image', 'len', 'int', 'str', 'max', 'min', 'set',
		'list', 'dict', 'range', 'not', 'type', 'super'
	]);

	function esc(s: string) {
		return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	function highlightLine(line: string): string {
		let result = '';
		let i = 0;
		const n = line.length;

		while (i < n) {
			const ch = line[i];

			// String literal
			if (ch === '"' || ch === "'") {
				let j = i + 1;
				while (j < n) {
					if (line[j] === '\\') { j += 2; continue; }
					if (line[j] === ch) { j++; break; }
					j++;
				}
				result += `<span class="cc-str">${esc(line.slice(i, j))}</span>`;
				i = j;
				continue;
			}

			// Comment — rest of line
			if (ch === '#') {
				result += `<span class="cc-cmt">${esc(line.slice(i))}</span>`;
				break;
			}

			// Word: keyword, builtin, or name
			if (/[a-zA-Z_]/.test(ch)) {
				let j = i;
				while (j < n && /[\w]/.test(line[j])) j++;
				const word = line.slice(i, j);
				if (KEYWORDS.has(word)) {
					result += `<span class="cc-kw">${esc(word)}</span>`;
				} else if (BUILTINS.has(word)) {
					result += `<span class="cc-bi">${esc(word)}</span>`;
				} else {
					result += esc(word);
				}
				i = j;
				continue;
			}

			// Number
			if (/[0-9]/.test(ch)) {
				let j = i;
				while (j < n && /[0-9.]/.test(line[j])) j++;
				result += `<span class="cc-num">${esc(line.slice(i, j))}</span>`;
				i = j;
				continue;
			}

			result += esc(ch);
			i++;
		}
		return result;
	}

	function highlightPython(code: string): string {
		return code.split('\n').map(highlightLine).join('\n');
	}

	function inline(s: string): string {
		return esc(s)
			.replace(/`([^`]+)`/g, '<code class="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[0.88em] text-slate-700">$1</code>')
			.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
			.replace(/\*([^*]+)\*/g, '<em>$1</em>');
	}

	const html = $derived.by(() => {
		const src = markdown.trim();
		// Split on fenced code blocks first
		const segments = src.split(/(```(?:python)?\n[\s\S]*?\n```)/g);
		return segments
			.map((seg) => {
				const fenceMatch = seg.match(/^```(python)?\n([\s\S]*?)\n```$/);
				if (fenceMatch) {
					const code = fenceMatch[2];
					const highlighted = highlightPython(code);
					return `<pre class="cc-pre"><code>${highlighted}</code></pre>`;
				}
				// Regular markdown blocks
				return seg
					.split(/\n{2,}/)
					.map((b) => b.trim())
					.filter(Boolean)
					.map((block) => {
						if (block.startsWith('### ')) return `<h4 class="cc-h4">${inline(block.slice(4))}</h4>`;
						if (block.startsWith('## ')) return `<h3 class="cc-h3">${inline(block.slice(3))}</h3>`;
						if (block.startsWith('> '))
							return `<blockquote class="cc-quote">${inline(block.slice(2))}</blockquote>`;
						if (/^[-*] /.test(block)) {
							const items = block
								.split('\n')
								.map((l) => `<li>${inline(l.replace(/^[-*]\s+/, ''))}</li>`)
								.join('');
							return `<ul class="list-disc space-y-1 pl-5">${items}</ul>`;
						}
						return `<p>${inline(block).replace(/\n/g, '<br/>')}</p>`;
					})
					.join('');
			})
			.join('');
	});
</script>

<aside class="card overflow-hidden rounded-3xl" style="background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);">
	<div class="flex items-center gap-2 border-b border-white/10 px-5 py-3">
		<span class="flex gap-1.5">
			<span class="size-3 rounded-full bg-red-500/70"></span>
			<span class="size-3 rounded-full bg-yellow-500/70"></span>
			<span class="size-3 rounded-full bg-green-500/70"></span>
		</span>
		<span class="font-mono text-xs text-slate-400">ducky_os.py</span>
	</div>
	<div
		class="cc-body space-y-3 px-5 py-4 font-mono text-sm leading-relaxed text-slate-300"
	>
		{@html html}
	</div>
</aside>

<style>
	:global(.cc-pre) {
		background: #0a0f1a;
		border-radius: 0.75rem;
		padding: 0.875rem 1rem;
		overflow-x: auto;
		font-size: 0.82rem;
		line-height: 1.6;
		white-space: pre;
	}
	:global(.cc-kw)  { color: #c084fc; font-weight: 600; }
	:global(.cc-bi)  { color: #67e8f9; }
	:global(.cc-str) { color: #86efac; }
	:global(.cc-cmt) { color: #64748b; font-style: italic; }
	:global(.cc-num) { color: #fbbf24; }
	:global(.cc-h3)  { color: #f1f5f9; font-size: 1rem; font-weight: 800; margin-top: 0.5rem; }
	:global(.cc-h4)  { color: #e2e8f0; font-size: 0.9rem; font-weight: 700; margin-top: 0.25rem; }
	:global(.cc-quote) {
		border-left: 3px solid #facc15;
		padding-left: 0.75rem;
		color: #94a3b8;
		font-style: italic;
		font-family: ui-sans-serif, system-ui, sans-serif;
		font-size: 0.85rem;
	}
	:global(.cc-body p),
	:global(.cc-body ul),
	:global(.cc-body li) {
		font-family: ui-sans-serif, system-ui, sans-serif;
		font-size: 0.82rem;
		color: #94a3b8;
	}
	:global(.cc-body li) { list-style: disc; margin-left: 1.25rem; }
</style>
