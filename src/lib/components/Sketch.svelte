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
	let maxSteps = 42; // Number of images to place along the curve
	let stepDelay = 5;
	let startX, startY, controlX1, controlX2, controlY1, controlY2, endX, endY;
	let draw = $derived(ingredientId != '' ? true : false);

	const sketch = (p5) => {
		p5.setup = async () => {
			// Load the image based on ingredientId
			img = await p5.loadImage(`/icons/${ingredientId}.png`);
			p5.createCanvas(width, height);
			// p5.noLoop(); // Only draw once since the image positions are static

			startX = p5.random(p5.width * 0.05, p5.width * 0.2); // Random start point
			startY = 0;
			controlX1 = p5.random(p5.width * 0.2, p5.width * 0.4);
			controlY1 = p5.random(p5.height * 0.1, p5.height * 0.5);
			controlX2 = p5.random(p5.width * 0.6, p5.width * 1);
			controlY2 = p5.random(p5.height * 0.2, p5.height * 0.7);
			endX = p5.random(p5.width * 0.7, p5.width * 0.9); // Random end point
			endY = p5.height;

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
		};

		p5.draw = () => {
			p5.noStroke();
			p5.noFill();

			// Draw the bezier curve
			p5.bezier(startX, startY, controlX1, controlY1, controlX2, controlY2, endX, endY);

			// Animate the images one by one based on the frame count
			if (draw) {
				for (let i = 0; i < maxSteps + 1; i++) {
					console.log(i);
					if (p5.frameCount > i * stepDelay) {
						const { x, y } = imagePositions[i];
						p5.image(img, x - 25, y - 25, 50, 50); // Draw the image at the stored position
					}
				}
			}
		};
	};
</script>

<div class="h-screen w-screen" bind:clientWidth={width} bind:clientHeight={height}>
	<P5 {sketch} />
</div>
