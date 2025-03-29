import { countryData } from '$lib/stores';
import { get } from 'svelte/store';

export const getCoords = (country: string): [number, number] => {
	const data = get(countryData);
	const match = data.find((c) => c.name === country);

	if (!match) return [0, 0];

	return [+match.longitude, +match.latitude];
};
