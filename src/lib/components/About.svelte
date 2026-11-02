<script lang="ts">
	import { onMount } from "svelte";
	import Backdrop from "./Backdrop.svelte";

	type Tool = { name: string; icon: string; invert?: boolean };

	// Delete any line you don't use: the two rows, their order and speed adjust by themselves.
	// Logos live in static/stack/<icon>.svg. `invert` turns black logos white on the dark page.
	const STACK: Tool[] = [
		// Languages
		{ name: "HTML5", icon: "html5" },
		{ name: "CSS3", icon: "css3" },
		{ name: "JavaScript", icon: "javascript" },
		{ name: "TypeScript", icon: "typescript" },
		// Frameworks & libraries
		{ name: "React", icon: "react" },
		{ name: "Next.js", icon: "nextjs", invert: true },
		{ name: "Svelte", icon: "svelte" },
		{ name: "Motion", icon: "motion" },
		// Styling
		{ name: "Tailwind CSS", icon: "tailwindcss" },
		{ name: "Material UI", icon: "materialui" },
		// Data & backend
		{ name: "Node.js", icon: "nodejs" },
		{ name: "Supabase", icon: "supabase" },
		// Workflow & deploy
		{ name: "Git", icon: "git" },
		{ name: "GitHub", icon: "github", invert: true },
		{ name: "VS Code", icon: "vscode" },
		{ name: "Figma", icon: "figma" },
		{ name: "Vercel", icon: "vercel", invert: true },
	];

	// Two rows moving in opposite directions; ~3.5s per logo keeps the speed constant.
	const half = Math.ceil(STACK.length / 2);
	const STACK_ROWS = [STACK.slice(0, half), STACK.slice(half)].filter(
		(r) => r.length,
	);

	let marqueeEl: HTMLElement | null = $state(null);
	let row1El: HTMLElement | null = $state(null);
	let row2El: HTMLElement | null = $state(null);

	onMount(() => {
		const reduceMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		if (reduceMotion || !marqueeEl || !row1El || !row2El) return;

		const MARQUEE_SPEED = 60;
		const rowEls = [row1El, row2El];
		const rows = rowEls.map((row) => {
			const track = row.querySelector<HTMLElement>(".marquee__track")!;
			const group = track.querySelector<HTMLElement>(".marquee__group")!;
			return {
				track,
				group,
				dir: row.classList.contains("marquee--reverse") ? 1 : -1,
				width: 0,
				offset: 0,
			};
		});

		function measureMarquee() {
			for (const r of rows) {
				r.track
					.querySelectorAll(".marquee__group[data-clone]")
					.forEach((c) => c.remove());
				r.width = r.group.getBoundingClientRect().width;
				if (!r.width || !r.track.parentElement) continue;
				const needed =
					Math.ceil(r.track.parentElement.offsetWidth / r.width) + 1;
				for (let i = 0; i < needed; i++) {
					const clone = r.group.cloneNode(true) as HTMLElement;
					clone.dataset.clone = "";
					r.track.appendChild(clone);
				}
				r.offset %= r.width;
			}
		}

		let visible = true;
		let boost = 0;
		let lastScrollY = window.scrollY;
		let lastTime = performance.now();
		let rafId: number | null = null;

		const observer = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
		});
		observer.observe(marqueeEl);

		function marqueeTick(now: number) {
			const dt = Math.min((now - lastTime) / 1000, 0.1);
			lastTime = now;

			const scrollY = window.scrollY;
			const velocity = dt > 0 ? Math.abs(scrollY - lastScrollY) / dt : 0;
			lastScrollY = scrollY;
			const boostTarget = Math.min(velocity * 0.4, 900);
			boost += (boostTarget - boost) * 0.08;

			if (visible) {
				const step = (MARQUEE_SPEED + boost) * dt;
				for (const r of rows) {
					if (!r.width) continue;
					r.offset = (r.offset + step) % r.width;
					const x = r.dir < 0 ? -r.offset : r.offset - r.width;
					r.track.style.transform = `translate3d(${x}px, 0, 0)`;
				}
			}
			rafId = requestAnimationFrame(marqueeTick);
		}

		measureMarquee();
		document.fonts.ready.then(measureMarquee);
		window.addEventListener("resize", measureMarquee);
		rafId = requestAnimationFrame(marqueeTick);

		return () => {
			if (rafId) cancelAnimationFrame(rafId);
			observer.disconnect();
			window.removeEventListener("resize", measureMarquee);
		};
	});
</script>

<section class="about" id="about">
	<Backdrop variant="about" />
	<p class="sr-only">
		Frontend, UI Engineering, Web Apps, Motion, Performance. Azhar Danica,
		Frontend Developer, Indonesia, since 2023.
	</p>
	<div class="marquee" bind:this={marqueeEl}>
		<div class="marquee__row" bind:this={row1El} aria-hidden="true">
			<div class="marquee__track">
				<div class="marquee__group">
					<span>Frontend</span><span class="marquee__sep">✦</span>
					<span class="outline">UI Engineering</span><span
						class="marquee__sep">✦</span
					>
					<span>Web Apps</span><span class="marquee__sep">✦</span>
					<span class="outline">Motion</span><span
						class="marquee__sep">✦</span
					>
					<span>Performance</span><span class="marquee__sep">✦</span>
				</div>
			</div>
		</div>
		<div
			class="marquee__row marquee--reverse"
			bind:this={row2El}
			aria-hidden="true"
		>
			<div class="marquee__track">
				<div class="marquee__group">
					<span>Azhar Danica</span><span class="marquee__sep">✦</span>
					<span class="outline">Frontend Developer</span><span
						class="marquee__sep">✦</span
					>
					<span>Indonesia</span><span class="marquee__sep">✦</span>
					<span class="outline">Since 2023</span><span
						class="marquee__sep">✦</span
					>
				</div>
			</div>
		</div>
	</div>

	<div class="about__body container">
		<p class="eyebrow">(01) About</p>
		<p class="about__text">
			I'm Azhar Danica, a frontend developer working out of Purwokerto. I
			build <strong>interfaces people enjoy using</strong>: fast,
			accessible and responsive websites and web apps, from pixel-perfect
			landing pages to full product UIs, for studios and startups across
			Asia and beyond.
		</p>
		<ul class="about__tags">
			<li class="tag">Responsive UI</li>
			<li class="tag">Design Systems</li>
			<li class="tag">Web Performance</li>
			<li class="tag">Accessibility</li>
			<li class="tag">Animation</li>
			<li class="tag">SEO</li>
		</ul>
	</div>

	<div class="container">
		<p class="eyebrow stack__title">Tools I code with</p>
	</div>
	<div class="stack">
		{#each STACK_ROWS as row, r (r)}
			<div class="stack__row" class:stack__row--reverse={r === 1}>
				<div
					class="stack__track"
					style="--duration: {row.length * 3.5}s"
				>
					<!-- Second copy makes the loop seamless; screen readers only get the first. -->
					{#each [0, 1] as copy (copy)}
						<ul
							class="stack__list"
							aria-hidden={copy === 1 ? "true" : undefined}
						>
							{#each row as tool (tool.name)}
								<li
									class="stack__item"
									class:stack__item--invert={tool.invert}
								>
									<img
										src="/stack/{tool.icon}.svg"
										alt=""
										width="30"
										height="30"
										loading="lazy"
										decoding="async"
									/>{tool.name}
								</li>
							{/each}
						</ul>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</section>
