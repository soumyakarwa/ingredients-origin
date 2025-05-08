import { geoInterpolate, range } from 'd3';

export function getArcSegment(start: [number, number], end: [number, number], steps = 50) {
	return range(0, 1.01, 1 / steps).map(geoInterpolate(start, end));
}
