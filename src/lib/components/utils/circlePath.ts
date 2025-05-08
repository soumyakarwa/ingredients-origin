import { geoInterpolate, geoPath } from 'd3'; // Import necessary D3 functions

// Helper function to normalize longitude between -180 and 180 degrees
const normalizeLongitude = (long) => {
	if (long > 180) return long - 360;
	if (long < -180) return long + 360;
	return long;
};

// Function to check if two points cross the 180°/−180° meridian
const longitudeDifference = (a, b) => {
	return Math.abs(a[0] - b[0]) > 180;
};

export function createPath3D(routeCoords, projection) {
	if (!routeCoords || routeCoords.length < 2) return '';

	const sampled = [];

	console.log('Route Coordinates (before interpolation):', routeCoords);

	// Iterate over each pair of coordinates to create the path
	for (let i = 0; i < routeCoords.length - 1; i++) {
		let a = routeCoords[i];
		let b = routeCoords[i + 1];

		console.log(`Interpolating between ${a} and ${b}`);

		// Normalize longitudes for wrap-around handling
		a = [normalizeLongitude(a[0]), a[1]]; // Normalize longitude
		b = [normalizeLongitude(b[0]), b[1]]; // Normalize longitude

		console.log(`Normalized coordinates: ${a} and ${b}`);

		// Check if the route crosses the 180°/−180° line
		if (longitudeDifference(a, b)) {
			// If crossing, adjust one of the points to ensure smooth transition
			if (a[0] > b[0]) {
				b = [b[0] + 360, b[1]]; // Wrap b around the globe
			} else {
				a = [a[0] + 360, a[1]]; // Wrap a around the globe
			}

			console.log(`Adjusted coordinates to account for wrap: ${a} and ${b}`);
		}

		const interpolate = geoInterpolate(a, b); // Smooth interpolation between a and b
		const steps = 50;

		// Interpolate between the two points
		for (let t = 0; t <= 1; t += 1 / steps) {
			const point = interpolate(t); // Get the point at fraction t
			const projected = projection([point[0], point[1]]);
			if (projected) sampled.push(projected);
		}
	}

	console.log('Sampled coordinates for path:', sampled);

	// Generate the smooth path using the D3 path generator
	const pathGenerator = geoPath().projection(projection);

	// Return the computed path data for rendering
	return pathGenerator({ type: 'LineString', coordinates: sampled });
}
