<script lang="ts">
	import P5 from 'p5-svelte';

	interface Props {
		ingredientId: string[];
		bezier?: {
			startPos: { x: number; y: number };
			endPos: { x: number; y: number };
			control1: { x: number; y: number };
			control2: { x: number; y: number };
		};
	}

	let { ingredientId, bezier }: Props = $props();

	let width = $state(0);
	let height = $state(0);

	let img = $state([]);
	let imagePositions: { x: number; y: number }[] = $state([]);
	let maxSteps;
	let stepDelay = 100;
	let startX, startY, controlX1, controlX2, controlY1, controlY2, endX, endY;
	let lastTime = 0;
	let currentStep = 0;

	const sketch = (p5) => {
		const estimateBezierLength = (
			startX,
			startY,
			controlX1,
			controlY1,
			controlX2,
			controlY2,
			endX,
			endY,
			steps = 100
		) => {
			let length = 0;
			let lastX = startX;
			let lastY = startY;

			for (let i = 1; i <= steps; i++) {
				const t = i / steps;
				const x = p5.bezierPoint(startX, controlX1, controlX2, endX, t);
				const y = p5.bezierPoint(startY, controlY1, controlY2, endY, t);
				length += p5.dist(lastX, lastY, x, y);
				lastX = x;
				lastY = y;
			}

			return length;
		};

		p5.setup = async () => {
			ingredientId.forEach(async (imageId, i) => {
				img[i] = await p5.loadImage(`/icons/${imageId}.png`);
			});

			p5.createCanvas(width, height);

			startX = bezier ? bezier.startPos.x * p5.width : p5.random(0, p5.width);
			startY = bezier ? bezier.startPos.y * p5.height : 0;
			endX = bezier ? bezier.endPos.x * p5.width : p5.random(0, p5.width);
			endY = bezier ? bezier.endPos.y * p5.height : p5.height;
			controlX1 = bezier ? bezier.control1.x * p5.width : p5.random(p5.width * 0.5, p5.width);
			controlY1 = bezier ? bezier.control1.y * p5.height : p5.random(0, p5.height);
			controlX2 = bezier ? bezier.control2.x * p5.width : p5.random(p5.width * 0.5, p5.width);
			controlY2 = bezier ? bezier.control2.y * p5.height : p5.random(0, p5.height);

			const curveLength = estimateBezierLength(
				startX,
				startY,
				controlX1,
				controlY1,
				controlX2,
				controlY2,
				endX,
				endY,
				25
			);

			maxSteps = Math.floor(curveLength / 20);
			for (let i = 0; i <= maxSteps; i++) {
				const t = i / maxSteps;
				const x = p5.bezierPoint(startX, controlX1, controlX2, endX, t);
				const y = p5.bezierPoint(startY, controlY1, controlY2, endY, t);
				imagePositions[i] = { x, y };
			}
		};

		p5.windowResized = () => {
			p5.resizeCanvas(width, height);
			p5.redraw();
		};

		p5.draw = () => {
			const currentTime = p5.millis();
			if (currentTime - lastTime >= stepDelay && currentStep <= maxSteps) {
				const { x, y } = imagePositions[currentStep];
				p5.noStroke();
				p5.noFill();
				const index = currentStep % img.length;
				p5.image(img[index], x - 25, y - 25, 50, 50);

				currentStep++;

				lastTime = currentTime;
			}

			if (currentStep > maxSteps) {
				p5.noLoop();
			}
		};
	};
</script>

<div class="h-screen w-screen" bind:clientWidth={width} bind:clientHeight={height}>
	<P5 {sketch} />
</div>
