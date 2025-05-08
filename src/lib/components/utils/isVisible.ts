export const isVisible = (coords: [number, number], rotationX: number): boolean => {
	const [lng, lat] = coords;
	// convert both to radians
	const lambda = lng * (Math.PI / 180);
	const phi = lat * (Math.PI / 180);
	const lambda0 = rotationX * (Math.PI / 180);
	const cosc =
		Math.sin(phi) * Math.sin(0) + Math.cos(phi) * Math.cos(0) * Math.cos(lambda - lambda0);
	return cosc > 0;
};
