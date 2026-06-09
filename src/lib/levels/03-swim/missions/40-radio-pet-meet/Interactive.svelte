<script lang="ts">
	import { onMount } from 'svelte';
	import PetAvatar from '$lib/components/PetAvatar.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import { pet, isNamed, addFriend, unlockDimension, type PetColor, type PetPattern } from '$lib/stores/pet';
	import { connection } from '$lib/stores/connection';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	type Log = { dir: 'sent' | 'recv'; text: string; t: number };
	let logs = $state<Log[]>([]);
	let lastFriend = $state<{ callSign: string; name: string; color: PetColor; pattern: PetPattern } | null>(null);

	function pack(): string {
		const p = $pet;
		const safe = (s: string) => s.replace(/[|;]/g, ' ').slice(0, 14);
		return [
			'INFO',
			p.personality.callSign,
			safe(p.name || 'duck'),
			p.color.primary,
			p.color.secondary,
			p.pattern
		].join('|');
	}

	function unpack(raw: string): { callSign: string; name: string; color: PetColor; pattern: PetPattern } | null {
		const parts = raw.split('|');
		if (parts[0] !== 'INFO' || parts.length < 6) return null;
		return {
			callSign: parts[1],
			name: parts[2],
			color: { primary: parts[3], secondary: parts[4], bill: '#ff9b1a' },
			pattern: (parts[5] as PetPattern) || 'plain'
		};
	}

	async function waveHello() {
		if (!isNamed($pet)) return;
		const info = pack();
		// Three send attempts with jitter to survive collisions
		for (let i = 0; i < 3; i++) {
			await new Promise((r) => setTimeout(r, Math.random() * 200));
			void connection
				.send({ type: 'radio-send', payload: 'HELLO|' + $pet.personality.callSign })
				.catch(() => {});
			void connection.send({ type: 'radio-send', payload: info }).catch(() => {});
		}
		logs = [{ dir: 'sent', text: info, t: Date.now() }, ...logs.slice(0, 19)];
	}

	onMount(() => {
		return connection.onEvent((e) => {
			if (e.type === 'radio' && typeof e.payload === 'string') {
				logs = [{ dir: 'recv', text: e.payload, t: Date.now() }, ...logs.slice(0, 19)];
				if (e.payload.startsWith('INFO|')) {
					const f = unpack(e.payload);
					if (f && f.callSign !== $pet.personality.callSign) {
						lastFriend = f;
						addFriend({ ...f, metInMission: '40-radio-pet-meet' });
						unlockDimension('pet');
						// Auto-complete after first successful meet
						complete();
					}
				}
			}
		});
	});
</script>

<div class="flex flex-col gap-5">
	<div class="grid items-center gap-6 md:grid-cols-2">
		<div class="rounded-3xl bg-egg-cream p-5 text-center shadow-soft">
			<PetAvatar size={120} mood="excited" />
			<p class="mt-2 font-display text-xl font-extrabold text-night-ink">
				{$pet.name || 'You'}
			</p>
			<p class="text-xs uppercase tracking-wider text-night-soft">
				Call sign · {$pet.personality.callSign}
			</p>
		</div>
		<div class="rounded-3xl bg-egg-cream p-5 text-center shadow-soft">
			{#if lastFriend}
				<PetAvatar
					size={120}
					mood="curious"
					pet={{ name: lastFriend.name, color: lastFriend.color, pattern: lastFriend.pattern, accessory: 'none' }}
				/>
				<p class="mt-2 font-display text-xl font-extrabold text-night-ink">{lastFriend.name}</p>
				<p class="text-xs uppercase tracking-wider text-night-soft">{lastFriend.callSign}</p>
				<p class="mt-1 text-sm text-leaf-green">Saved to friends ✓</p>
			{:else}
				<PetAvatar size={120} mood="sleepy" generic />
				<p class="mt-2 font-display text-xl font-extrabold text-night-soft">Waiting…</p>
				<p class="text-xs text-night-soft">No duck has waved yet.</p>
			{/if}
		</div>
	</div>

	{#if !isNamed($pet)}
		<div class="rounded-xl bg-sunset-coral/20 p-4 text-sm text-night-ink">
			Name your duck first (mission <strong>35-pet-namer</strong>) before you can meet others.
		</div>
	{/if}

	<button
		class="self-start rounded-full bg-night-ink px-5 py-3 font-display font-bold text-white disabled:opacity-50"
		disabled={!isNamed($pet)}
		onclick={waveHello}
	>
		📡 Wave hello over radio
	</button>

	<div class="rounded-2xl bg-mist p-3">
		<p class="mb-2 text-xs font-bold uppercase tracking-widest text-night-soft">Radio log</p>
		{#if logs.length === 0}
			<p class="text-sm text-night-soft">Nothing yet — press wave hello.</p>
		{:else}
			<ul class="space-y-1 font-mono text-xs">
				{#each logs as l}
					<li class:text-leaf-green={l.dir === 'sent'} class:text-pond-blue={l.dir === 'recv'}>
						{l.dir === 'sent' ? '→' : '←'} {l.text}
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	<YourTurn
		title="After meeting a duck"
		challenges={[
			'Visit the /friends page — your friend\'s duck is there.',
			'Meet 3 different ducks. Each adds to your friends list.',
			'Try with your friend in another room — does radio still work?'
		]}
	/>
</div>
