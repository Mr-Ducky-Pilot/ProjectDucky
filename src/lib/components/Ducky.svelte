<script lang="ts">
	import PetAvatar from './PetAvatar.svelte';

	export type DuckyMood =
		| 'idle'
		| 'excited'
		| 'thinking'
		| 'celebrating'
		| 'curious'
		| 'sleepy'
		| 'sad';

	type Props = {
		mood?: DuckyMood;
		size?: number;
		bob?: boolean;
		label?: string;
		/** If true, ignore the saved pet and show the generic mascot. */
		generic?: boolean;
	};

	let { mood = 'idle', size = 160, bob = true, label = 'Ducky', generic = false }: Props = $props();
</script>

<PetAvatar {mood} {size} {bob} {label} {generic} />
