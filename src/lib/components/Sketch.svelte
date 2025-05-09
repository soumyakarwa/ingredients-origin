<script lang="ts">
	import P5 from 'p5-svelte';

	interface Props {
		ingredientId: string;
	}

	let { ingredientId }: Props = $props();

	let width = $state(0);
	let height = $state(0);

	let img = $state();
	let imagePositions: { x: number; y: number }[] = $state([]);
	let maxSteps; // Number of images to place along the curve
	let stepDelay = 100;
	let startX, startY, controlX1, controlX2, controlY1, controlY2, endX, endY;
	let lastTime = 0; // To track the time between frames
	let currentStep = 0; // To keep track of which image we are on

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
			img = await p5.loadImage(`/icons/${ingredientId}.png`);
			p5.createCanvas(width, height);

			// Randomly choose start and end points along the edges
			startX = p5.random(0, p5.width); // Random start point on the top edge
			startY = 0; // Top edge
			endX = p5.random(0, p5.width); // Random end point on the bottom edge
			endY = p5.height; // Bottom edge

			// Control points are now more randomly placed across the canvas
			controlX1 = p5.random(p5.width * 0.5, p5.width); // Control point 1 x position on the right half
			controlY1 = p5.random(0, p5.height); // Control point 1 y position (can still be anywhere on the y-axis)

			controlX2 = p5.random(p5.width * 0.5, p5.width); // Control point 2 x position on the right half
			controlY2 = p5.random(0, p5.height);

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

			// Set maxSteps based on the length of the curve
			maxSteps = Math.floor(curveLength / 20); // Adjust divisor to control step density

			for (let i = 0; i <= maxSteps; i++) {
				const t = i / maxSteps; // Parameter t goes from 0 to 1
				const x = p5.bezierPoint(startX, controlX1, controlX2, endX, t);
				const y = p5.bezierPoint(startY, controlY1, controlY2, endY, t);
				imagePositions[i] = { x, y }; // Store the position of each image
			}
		};

		p5.windowResized = () => {
			// Update canvas size when window is resized
			p5.resizeCanvas(width, height);
			p5.redraw();
		};

		p5.draw = () => {
			const currentTime = p5.millis(); // Get the current time in milliseconds

			// Only proceed if enough time has passed to animate the next image
			if (currentTime - lastTime >= stepDelay && currentStep <= maxSteps) {
				const { x, y } = imagePositions[currentStep];
				p5.noStroke();
				p5.noFill();
				p5.image(img, x - 25, y - 25, 50, 50); // Draw the image at the stored position

				currentStep++; // Move to the next image

				lastTime = currentTime; // Update the last time the image was drawn
			}

			if (currentStep > maxSteps) {
				p5.noLoop(); // Stops the loop after all images are drawn
			}
		};
	};
</script>

<div class="h-screen w-screen" bind:clientWidth={width} bind:clientHeight={height}>
	<P5 {sketch} />
</div>
