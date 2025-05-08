export const getRandomOffset = () => {
	const offsetRange = 20; // adjust this value as needed
	const x = Math.floor(Math.random() * offsetRange * 2 - offsetRange); // -10 to +10
	const y = Math.floor(Math.random() * offsetRange * 2 - offsetRange);
	return `translate(${x}, ${y})`;
};
