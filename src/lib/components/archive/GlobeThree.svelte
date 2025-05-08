<script lang="ts">
	import { onMount } from 'svelte';
	import mapData from '$lib/data/map.topojson.json';
	import { feature } from 'topojson-client';
	import { geoEquirectangular } from 'd3';
	import * as THREE from 'three';

	let container: HTMLDivElement | undefined = $state();
	let width = $state(1000);
	let heightProportion = 1;
	let height = $derived(width * heightProportion);
	let sphereRadius = $derived(Math.min(width, height) / 2);

	onMount(() => {
		if (!container) return;

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(width, height);
		container.appendChild(renderer.domElement);

		const geometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
		const material = new THREE.MeshBasicMaterial({ color: 0xfff6d8 });
		const sphere = new THREE.Mesh(geometry, material);
		scene.add(sphere);

		const light = new THREE.PointLight(0xffffff, 1);
		light.position.set(5, 5, 5);
		const ambientLight = new THREE.AmbientLight(0xffffff, 1);
		scene.add(ambientLight);
		scene.add(light);

		camera.position.z = sphereRadius * 2;

		const geo = feature(mapData, mapData.objects['countries']);

		const projection = geoEquirectangular().translate([0, 0]).scale(1);

		for (const feature of geo.features) {
			if (feature.geometry.type !== 'Polygon' && feature.geometry.type !== 'MultiPolygon') continue;

			const coords =
				feature.geometry.type === 'Polygon'
					? [feature.geometry.coordinates]
					: feature.geometry.coordinates;

			for (const polygon of coords) {
				for (const ring of polygon) {
					// Convert lat/lng to 3D positions on sphere
					const vertices: THREE.Vector3[] = ring.map(([lng, lat]) => {
						const phi = (90 - lat) * (Math.PI / 180);
						const theta = (lng + 180) * (Math.PI / 180);
						return new THREE.Vector3(
							sphereRadius * Math.sin(phi) * Math.cos(theta),
							sphereRadius * Math.cos(phi),
							sphereRadius * Math.sin(phi) * Math.sin(theta)
						);
					});

					// Skip if not enough points to form a shape
					if (vertices.length < 3) continue;

					// Create geometry using triangulation
					const shape = new THREE.Shape(vertices.map((v) => new THREE.Vector2(v.x, v.y)));
					const geometry = new THREE.ShapeGeometry(shape);

					// Position the mesh slightly above the sphere so it doesn't z-fight
					const mesh = new THREE.Mesh(
						geometry,
						new THREE.MeshBasicMaterial({ color: 0x88ccaa, side: THREE.DoubleSide })
					);
					mesh.position.z = 0.01; // tiny offset to prevent z-fighting

					scene.add(mesh);
				}
			}
		}

		const animate = () => {
			requestAnimationFrame(animate);
			sphere.rotation.y += 0.003;
			scene.rotation.y += 0.003;
			renderer.render(scene, camera);
		};
		animate();

		return () => {
			renderer.dispose();
		};
	});
</script>

<div class="flex h-full w-full items-center justify-center">
	<div class="flex h-full w-full flex-row items-center justify-center gap-2">
		<div class="flex-1" bind:clientWidth={width} style="height:${height}px">
			<div bind:this={container}></div>
		</div>
		<div class="w-1/2">
			'CONTENT'
			<!-- {#if activeIndex != null} -->
			<!-- Info Tooltip (for active ingredient) -->
			<!-- <InfoTooltip ingredient={ingredients[activeIndex]} bind:activeIndex /> -->
			<!-- {/if} -->
		</div>
	</div>
</div>
