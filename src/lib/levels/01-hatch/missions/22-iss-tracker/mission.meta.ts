import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '22-iss-tracker',
	level: 1,
	order: 22,
	title: 'ISS Tracker',
	emoji: '🛸',
	oneLiner: 'Track the International Space Station zooming overhead in real time.',
	story: 'The International Space Station orbits Earth every 90 minutes at 27,600 km/h — faster than a bullet. Right now there are astronauts up there! Your Ducky tracks where the ISS is at this very moment, and the OLED shows a live orbital view.',
	duckyIntro: "There's a space station up there RIGHT NOW with astronauts inside! Let's find it!",
	hardware: ['oled', 'led-matrix'],
	pairMode: false,
	dimension: 'science',
	estMinutes: 8,
	remixPrompts: [
		'When will the ISS fly over your town? Look up the next pass at heavens-above.com.',
		'The ISS moves about 450 km per refresh — find a city it crossed between updates.',
		'How many times does the ISS orbit Earth in one day? (Hint: 24h ÷ 90 min)'
	]
};

export default meta;
