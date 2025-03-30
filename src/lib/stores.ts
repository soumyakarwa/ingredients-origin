import { browser } from '$app/environment';
import { writable, readable, derived } from 'svelte/store';
import type { Readable } from 'svelte/store';
import countries from './data/countries.json';
import debounce from 'lodash.debounce';
import Device from 'svelte-device-info';

export const countryData = writable(countries);

export const icons = import.meta.glob<{ default: string }>(
	'/src/lib/assets/ingredient-icons/*.svg',
	{
		eager: true
	}
);

// CODE FROM THE DATAFACE
type Viewport = {
	width: number;
	height: number;
	screenSize: string | undefined;
	screens: { [key: string]: boolean } | undefined;
	canHover: boolean | undefined;
};

export const viewport = readable(
	{
		width: 0,
		height: 0,
		screenSize: undefined,
		screens: undefined,
		canHover: undefined
	} as {
		width: number;
		height: number;
		screenSize: string | undefined;
		screens: { [key: string]: boolean } | undefined;
		canHover: boolean | undefined;
	},
	(set) => {
		const onResize = () => {
			const windowW = window.innerWidth;
			const screens = {
				mobile: windowW < 640,
				sm: windowW >= 640 && windowW < 768,
				md: windowW >= 768 && windowW < 1024,
				lg: windowW >= 1024 && windowW < 1280,
				xl: windowW >= 1280 && windowW < 1536,
				'2xl': windowW >= 1536
			};
			const screenSize = Object.keys(screens).filter(
				(val) => screens[val as keyof typeof screens]
			)[0];
			set({
				width: windowW,
				height: window.innerHeight,
				screenSize,
				screens,
				canHover: Device.canHover
			});
		};
		if (browser) {
			onResize();
			window.addEventListener('resize', debounce(onResize, 50));
		}
		return () => {
			if (browser) window.removeEventListener('resize', onResize);
		};
	}
);

export const isSmallScreen: Readable<boolean> = derived(
	viewport,
	($viewport: Viewport) => $viewport.width < 768,
	true
);

export const canHover: Readable<boolean | undefined> = derived(
	viewport,
	($viewport: Viewport) => $viewport.canHover,
	true
);
