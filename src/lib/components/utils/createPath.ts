import { line, curveCatmullRom } from 'd3';

export const createPath = line()
	.x((d) => d[0])
	.y((d) => d[1])
	.curve(curveCatmullRom.alpha(1));
