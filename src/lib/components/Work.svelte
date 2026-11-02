<script lang="ts">
	import { onMount } from 'svelte';
	import Backdrop from './Backdrop.svelte';

	type Project = {
		num: string;
		title: string;
		cat: string;
		year: string;
		classModifier: string;
		/** 2-3 images, e.g. ['/projects/kopi-1.webp', '/projects/kopi-2.webp']. Put the files in static/projects/. Empty = gradient placeholders. */
		images: string[];
		/** Short description shown in the pop-up. */
		desc: string;
		/** Live site, Behance, Dribbble... Empty = no button. */
		link: string;
	};

	let workEl: HTMLElement | null = $state(null);
	let workTrackEl: HTMLElement | null = $state(null);
	let workProgressEl: HTMLElement | null = $state(null);
	let dialogEl: HTMLDialogElement | null = $state(null);
	let currentNum = $state('01');
	let active: Project | null = $state(null);
	let shot = $state(0);

	// Placeholder projects: replace images, desc and link with real ones.
	const projects: Project[] = [
		{
			num: '01',
			title: 'Kopi Senja',
			cat: 'E-commerce · Next.js',
			year: '2025',
			classModifier: 'project--kopi',
			images: [],
			desc: 'A warm, sunset-inspired online store for a small coffee brand: product pages, cart and checkout, built mobile-first and loading in under a second.',
			link: ''
		},
		{
			num: '02',
			title: 'Lumen Bank',
			cat: 'Web app · Dashboard',
			year: '2025',
			classModifier: 'project--lumen',
			images: [],
			desc: 'A calmer banking dashboard. Onboarding, transfers and savings rebuilt as a React + TypeScript app on top of a reusable component library.',
			link: ''
		},
		{
			num: '03',
			title: 'Pixel Pals',
			cat: 'Interactive site · 3D',
			year: '2024',
			classModifier: 'project--pixel',
			images: [],
			desc: 'A playful launch site with 3D characters rendered in the browser and scroll-driven animations that stay smooth on mid-range phones.',
			link: ''
		},
		{
			num: '04',
			title: 'Batik Now',
			cat: 'Editorial site · CMS',
			year: '2024',
			classModifier: 'project--batik',
			images: [],
			desc: 'A magazine-style site on modern batik: headless CMS, bold editorial layouts and image-heavy pages that still pass Core Web Vitals.',
			link: ''
		},
		{
			num: '05',
			title: 'Orbit OS',
			cat: 'Marketing site · Vue',
			year: '2023',
			classModifier: 'project--orbit',
			images: [],
			desc: 'A fast marketing website and component library for a productivity tool, from Figma handoff to a responsive, accessible build.',
			link: ''
		}
	];

	/** Real images, or three placeholder slots (null) while there are none. */
	const shotsOf = (p: Project): (string | null)[] =>
		p.images.length ? p.images.slice(0, 3) : [null, null, null];

	function openProject(p: Project) {
		active = p;
		shot = 0;
		dialogEl?.showModal();
	}

	function onDialogClick(e: MouseEvent) {
		// A click outside the panel lands on the <dialog> itself (the backdrop area).
		if (e.target === dialogEl) dialogEl?.close();
	}

	onMount(() => {
		if (!workEl || !workTrackEl || !workProgressEl) return;

		let distance = 0;
		let queued = false;
		let cardCenters: number[] = [];
		const cards = Array.from(workTrackEl.querySelectorAll<HTMLElement>('.project'));

		function measureWork() {
			if (!workEl || !workTrackEl) return;
			distance = Math.max(0, workTrackEl.scrollWidth - window.innerWidth);
			workEl.style.height = `${distance + window.innerHeight}px`;
			cardCenters = cards.map((card) => card.offsetLeft + card.offsetWidth / 2);
			updateWork();
		}

		function queueWork() {
			if (queued) return;
			queued = true;
			requestAnimationFrame(updateWork);
		}

		function updateWork() {
			queued = false;
			if (!workEl || !workTrackEl || !workProgressEl) return;
			const top = workEl.getBoundingClientRect().top;
			const progress = distance ? Math.min(Math.max(-top / distance, 0), 1) : 0;

			workTrackEl.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
			workProgressEl.style.width = `${progress * 100}%`;

			const center = window.innerWidth * progress + progress * distance;
			let current = 0;
			let best = Infinity;
			cardCenters.forEach((cardCenter, i) => {
				const d = Math.abs(cardCenter - center);
				if (d < best) {
					best = d;
					current = i;
				}
			});
			currentNum = String(current + 1).padStart(2, '0');
		}

		window.addEventListener('scroll', queueWork, { passive: true });
		window.addEventListener('resize', measureWork);
		document.fonts.ready.then(measureWork);
		measureWork();

		return () => {
			window.removeEventListener('scroll', queueWork);
			window.removeEventListener('resize', measureWork);
		};
	});
</script>

{#snippet picture(src: string | null, n: number, alt: string, lazy: boolean)}
	{#if src}
		<img {src} {alt} loading={lazy ? 'lazy' : 'eager'} decoding="async" />
	{:else}
		<span class="shot__ph" style="--n: {n}"></span>
	{/if}
{/snippet}

<section class="work" id="work" data-nav="light" bind:this={workEl}>
	<div class="work__sticky">
		<Backdrop variant="work" />
		<div class="work__head container">
			<p class="eyebrow">(02) Selected Work</p>
			<p class="work__counter"><span>{currentNum}</span> / 05</p>
		</div>

		<div class="work__track" bind:this={workTrackEl}>
			<div class="work__intro">
				<h2 class="work__title">Selected<br />Projects</h2>
				<p>Scroll to explore a few favourites. Tap a card for the story behind it.</p>
			</div>

			{#each projects as project (project.num)}
				{@const shots = shotsOf(project)}
				<article class="project {project.classModifier}">
					<div class="project__art"></div>
					<div class="project__shots" data-count={shots.length}>
						{#each shots as src, n (n)}
							<div class="shot shot--{n + 1}">
								{@render picture(src, n, '', true)}
							</div>
						{/each}
					</div>
					<div class="project__info glass">
						<div>
							<h3 class="project__title">
								<span class="project__num">{project.num}</span>{project.title}
							</h3>
							<p class="project__cat">{project.cat}</p>
						</div>
						<span class="project__more">View <span aria-hidden="true">↗</span></span>
					</div>
					<button
						class="project__open"
						type="button"
						aria-haspopup="dialog"
						aria-label="Open details for {project.title}"
						onclick={() => openProject(project)}
					></button>
				</article>
			{/each}
		</div>

		<div class="work__progress" aria-hidden="true">
			<span bind:this={workProgressEl}></span>
		</div>
	</div>

	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions (Esc already closes a modal dialog) -->
	<dialog
		class="modal"
		bind:this={dialogEl}
		aria-labelledby="modal-title"
		onclick={onDialogClick}
		onclose={() => (active = null)}
	>
		{#if active}
			{@const shots = shotsOf(active)}
			<div class="modal__panel {active.classModifier}">
				<button
					class="modal__close"
					type="button"
					aria-label="Close"
					onclick={() => dialogEl?.close()}>×</button
				>

				<div class="modal__gallery">
					<div class="modal__main">
						{@render picture(shots[shot], shot, `${active.title}, image ${shot + 1}`, false)}
					</div>
					{#if shots.length > 1}
						<div class="modal__thumbs">
							{#each shots as src, n (n)}
								<button
									class="modal__thumb"
									class:is-active={n === shot}
									type="button"
									aria-label="Show image {n + 1}"
									aria-pressed={n === shot}
									onclick={() => (shot = n)}
								>
									{@render picture(src, n, '', false)}
								</button>
							{/each}
						</div>
					{/if}
				</div>

				<div class="modal__body">
					<p class="eyebrow">{active.num} · {active.year}</p>
					<h3 class="modal__title" id="modal-title">{active.title}</h3>
					<p class="modal__cat">{active.cat}</p>
					<p class="modal__desc">{active.desc}</p>
					{#if active.link}
						<a
							class="btn btn--light"
							href={active.link}
							target="_blank"
							rel="noopener noreferrer"
							>Visit project <span class="btn__arrow" aria-hidden="true">↗</span></a
						>
					{/if}
				</div>
			</div>
		{/if}
	</dialog>
</section>
