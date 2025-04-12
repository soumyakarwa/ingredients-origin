import { line, curveCatmullRom } from 'd3';

// export const createPath = line()
// 	.x((d) => d[0])
// 	.y((d) => d[1])
// 	.curve(curveCatmullRom.alpha(1));
export const createPath = (routeCoords) => {
	if (routeCoords.length === 2) {
		const [p1, p2] = routeCoords;
		const mid = [
			(p1[0] + p2[0]) / 2,
			(p1[1] + p2[1]) / 2 - 50 // Adjust for curvature
		];
		return `M${p1[0]},${p1[1]} Q${mid[0]},${mid[1]} ${p2[0]},${p2[1]}`;
	}

	// Use D3 line generator for 3+ points
	const pathGenerator = line()
		.x((d) => d[0])
		.y((d) => d[1])
		.curve(curveCatmullRom.alpha(1));

	return pathGenerator(routeCoords);
};
