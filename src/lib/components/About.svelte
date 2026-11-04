<script lang="ts">
	import { onMount } from "svelte";
	import Backdrop from "./Backdrop.svelte";

	let { editor = false }: { editor?: boolean } = $props();

	type Tool = { name: string; icon?: string; invert?: boolean };

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

	// Editor & Photographer mode. No logo files for these yet, so they show as text.
	const EDITOR_STACK: Tool[] = [
		{ name: "Premiere Pro" },
		{ name: "After Effects" },
		{ name: "DaVinci Resolve" },
		{ name: "CapCut" },
		{ name: "Lightroom" },
		{ name: "Photoshop" },
		{ name: "Audition" },
		{ name: "Figma", icon: "figma" },
	];

	// Two rows moving in opposite directions; ~3.5s per logo keeps the speed constant.
	const half = Math.ceil(STACK.length / 2);
	// shortcut: editor tools fit one row only, split into two once the list has ~16 tools.
	const STACK_ROWS = $derived(
		editor
			? [EDITOR_STACK]
			: [STACK.slice(0, half), STACK.slice(half)].filter((r) => r.length),
	);
	// The short editor list is narrower than a wide screen, so it needs 4 copies (still 2 identical halves) to loop without a gap.
	const copies = $derived(editor ? [0, 1, 2, 3] : [0, 1]);

	const COPY = {
		dev: {
			row1: ["Frontend", "UI Engineering", "Web Apps", "Motion", "Performance"],
			row2: ["Azhar Danica", "Frontend Developer", "Indonesia", "Since 2023"],
			role: "a frontend developer",
			build: "build",
			strong: "interfaces people enjoy using",
			rest: "fast, accessible and responsive websites and web apps, from pixel-perfect landing pages to full product UIs, for studios and startups across Asia and beyond.",
			tags: ["Responsive UI", "Design Systems", "Web Performance", "Accessibility", "Animation", "SEO"],
			tools: "Tools I code with",
		},
		editor: {
			row1: ["Video Editing", "Photography", "Color Grading", "Motion", "Storytelling"],
			row2: ["Azhar Danica", "Editor & Photographer", "Indonesia", "Since 2023"],
			role: "a video editor and photographer",
			build: "make",
			strong: "pictures that hold attention",
			rest: "edits with rhythm and story, color that sets the mood, and photos of people and places, for brands, events and creators across Asia and beyond.",
			tags: ["Video Editing", "Color Grading", "Motion Graphics", "Portraits", "Event Coverage", "Short-form Content"],
			tools: "Tools I edit with",
		},
	};
	const c = $derived(editor ? COPY.editor : COPY.dev);

	let marqueeEl: HTMLElement | null = $state(null);

	onMount(() => {
		const reduceMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		if (reduceMotion || !marqueeEl) return;

		const MARQUEE_SPEED = 60;
		const rowEls = Array.from(
			marqueeEl.querySelectorAll<HTMLElement>(".marquee__row"),
		);
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
	<p class="sr-only">{c.row1.join(", ")}. {c.row2.join(", ")}.</p>
	<div class="marquee" bind:this={marqueeEl}>
		{#each [c.row1, c.row2] as words, r (r)}
			<div
				class="marquee__row"
				class:marquee--reverse={r === 1}
				aria-hidden="true"
			>
				<div class="marquee__track">
					<div class="marquee__group">
						{#each words as word, i (word)}
							<span class:outline={i % 2 === 1}>{word}</span><span
								class="marquee__sep">✦</span
							>
						{/each}
					</div>
				</div>
			</div>
		{/each}
	</div>

	<div class="about__body container">
		<p class="eyebrow">(01) About</p>
		<p class="about__text">
			I'm Azhar Danica, {c.role} working out of Purwokerto. I
			{c.build} <strong>{c.strong}</strong>: {c.rest}
		</p>
		<ul class="about__tags">
			{#each c.tags as tag (tag)}
				<li class="tag">{tag}</li>
			{/each}
		</ul>
	</div>

	<div class="container">
		<p class="eyebrow stack__title">{c.tools}</p>
	</div>
	<div class="stack">
		{#each STACK_ROWS as row, r (r)}
			<div class="stack__row" class:stack__row--reverse={r === 1}>
				<div
					class="stack__track"
					style="--duration: {row.length * 3.5 * (copies.length / 2)}s"
				>
					<!-- Second copy makes the loop seamless; screen readers only get the first. -->
					{#each copies as copy (copy)}
						<ul
							class="stack__list"
							aria-hidden={copy > 0 ? "true" : undefined}
						>
							{#each row as tool (tool.name)}
								<li
									class="stack__item"
									class:stack__item--invert={tool.invert}
								>
									{#if tool.icon}
										<img
											src="/stack/{tool.icon}.svg"
											alt=""
											width="30"
											height="30"
											loading="lazy"
											decoding="async"
										/>
									{/if}{tool.name}
								</li>
							{/each}
						</ul>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</section>
