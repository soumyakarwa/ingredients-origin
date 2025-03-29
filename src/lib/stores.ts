import { writable } from 'svelte/store';
import countries from './data/countries.json';

export const countryData = writable(countries);
