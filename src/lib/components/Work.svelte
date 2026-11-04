<script lang="ts">
	import { onMount } from 'svelte';
	import Backdrop from './Backdrop.svelte';

	type Project = {
		num: string;
		title: string;
		cat: string;
		year: string;
		classModifier: string;
		/** Base paths without size suffix: '/projects/event/1' serves 1-480.webp (cards, thumbs) and 1-1080.webp (pop-up, single-image cards). Cards show the first 3. At least one required. */
		images: string[];
		/** Optional MP4 shown in the pop-up instead of the gallery; `images` are then its stills for the card. */
		video?: string;
		/** Short description shown in the pop-up. */
		desc: string;
		/** Live site, Behance, Dribbble... Empty = no button. */
		link: string;
	};

	let { editor = false }: { editor?: boolean } = $props();

	let workEl: HTMLElement | null = $state(null);
	let workTrackEl: HTMLElement | null = $state(null);
	let workProgressEl: HTMLElement | null = $state(null);
	let dialogEl: HTMLDialogElement | null = $state(null);
	let currentNum = $state('01');
	let active: Project | null = $state(null);
	let shot = $state(0);

	// Media lives in static/projects/<slug>/ (optimized from fix/).
	const stills = (slug: string, n: number) => Array.from({ length: n }, (_, i) => `/projects/${slug}/${i + 1}`);

	const devProjects: Project[] = [
		{
			num: '01',
			title: 'MenjerBook',
			cat: 'Booking platform · Web app',
			year: '',
			classModifier: 'project--lumen',
			images: stills('menjerbook', 3),
			desc: 'An online booking platform for villas, cabins and glamping around Menjer and Dieng: a mobile-first search and booking flow for guests, plus an admin panel for bookings, properties, units and pricing.',
			link: ''
		},
		{
			num: '02',
			title: 'SPMB SDIT Insan Mulia',
			cat: 'School admission · Web app',
			year: '2025',
			classModifier: 'project--orbit',
			images: stills('spmb', 2),
			desc: 'A new-student admission site for SDIT Insan Mulia Banyumas (2025/2026): a landing page plus an online registration form with student data and document uploads.',
			link: ''
		}
	];

	// Editor & Photographer mode.
	// Photos first, then videos. A video card shows its single cover still.
	const editorProjects: Project[] = [
		{
			num: '01',
			title: 'Sejala Photo',
			cat: 'Portrait · Photography',
			year: '',
			classModifier: 'project--kopi',
			images: stills('sejalaphoto', 6),
			desc: 'Portrait and couple photography with natural expressions and a warm, consistent grade.',
			link: ''
		},
		{
			num: '02',
			title: 'Jejak Cafein',
			cat: 'Cafe · Photography',
			year: '',
			classModifier: 'project--batik',
			images: stills('jejakcafein', 3),
			desc: 'Cafe and interior photography with warm tones and clean layouts for social media.',
			link: ''
		},
		{
			num: '03',
			title: 'Aesthetic Series',
			cat: 'Photo edit · Vertical',
			year: '',
			classModifier: 'project--orbit',
			images: stills('estetic', 3),
			desc: 'A set of vertical photos edited for a soft, consistent aesthetic tone.',
			link: ''
		},
		{
			num: '04',
			title: 'Event Coverage',
			cat: 'Event · Photography',
			year: '',
			classModifier: 'project--kopi',
			images: stills('event', 3),
			desc: 'Event photography finished as vertical, social-ready frames.',
			link: ''
		},
		{
			num: '05',
			title: 'HIV Awareness Animation',
			cat: 'Motion graphics · Animation',
			year: '',
			classModifier: 'project--lumen',
			images: stills('animasi', 1),
			video: '/projects/animasi/video.mp4',
			desc: 'An animated explainer walking through the stages of HIV infection, with simple shapes, bold type and clear pacing.',
			link: ''
		},
		{
			num: '06',
			title: 'FTC UMP 2024 Bumper',
			cat: 'Event bumper · Motion',
			year: '2024',
			classModifier: 'project--pixel',
			images: stills('bumper', 1),
			video: '/projects/bumper/video.mp4',
			desc: 'A 10-second opening bumper for FTC UMP 2024, built around the event mascots and its neon city look.',
			link: ''
		},
		{
			num: '07',
			title: 'Divisi Produksi',
			cat: 'Short video · Edit',
			year: '',
			classModifier: 'project--lumen',
			images: stills('short-video', 1),
			video: '/projects/short-video/video.mp4',
			desc: 'A vertical short video introducing the production division, edited for social media.',
			link: ''
		}
	];

	const projects = $derived(editor ? editorProjects : devProjects);

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

{#snippet picture(src: string, alt: string, lazy: boolean, w: 480 | 1080 = 480)}
	<img src="{src}-{w}.webp" {alt} loading={lazy ? 'lazy' : 'eager'} decoding="async" />
{/snippet}

<section class="work" id="work" data-nav="light" bind:this={workEl}>
	<div class="work__sticky">
		<Backdrop variant="work" />
		<div class="work__head container">
			<p class="eyebrow">(02) Selected Work</p>
			<p class="work__counter"><span>{currentNum}</span> / {String(projects.length).padStart(2, '0')}</p>
		</div>

		<div class="work__track" bind:this={workTrackEl}>
			<div class="work__intro">
				<h2 class="work__title">Selected<br />{editor ? 'Edits & Shots' : 'Projects'}</h2>
				<p>Scroll to explore a few favourites. Tap a card for the story behind it.</p>
			</div>

			{#each projects as project (project.num)}
				{@const shots = project.images.slice(0, 3)}
				<article class="project {project.classModifier}">
					<div class="project__art"></div>
					<div class="project__shots" data-count={shots.length}>
						{#each shots as src, n (n)}
							<div class="shot shot--{n + 1}">
								<!-- A lone shot fills the whole card, so 480px would be upscaled and blurry. -->
								{@render picture(src, '', true, shots.length === 1 ? 1080 : 480)}
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
			{@const shots = active.images}
			<div class="modal__panel {active.classModifier}">
				<button
					class="modal__close"
					type="button"
					aria-label="Close"
					onclick={() => dialogEl?.close()}>×</button
				>

				<div class="modal__gallery">
					<div class="modal__main">
						{#if active.video}
							<!-- svelte-ignore a11y_media_has_caption (no caption files for these edits yet) -->
							<video
								src={active.video}
								poster="{active.images[0]}-1080.webp"
								controls
								playsinline
								preload="none"
								aria-label={active.title}
							></video>
						{:else}
							{@render picture(shots[shot], `${active.title}, image ${shot + 1}`, false, 1080)}
						{/if}
					</div>
					{#if !active.video && shots.length > 1}
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
									{@render picture(src, '', false)}
								</button>
							{/each}
						</div>
					{/if}
				</div>

				<div class="modal__body">
					<p class="eyebrow">{active.num}{active.year ? ` · ${active.year}` : ''}</p>
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
