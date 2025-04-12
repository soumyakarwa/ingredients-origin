// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	type Country = {
		key: string;
		latitude: number;
		longitude: number;
		name: string;
	};

	type Ingredient = {
		id: string;
		name: string;
		country: {
			label: string;
			coords: string;
		};
		text: string[];
		route: string[];
	};

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
