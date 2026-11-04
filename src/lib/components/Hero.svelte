<script lang="ts">
	import { onMount } from "svelte";
	import Backdrop from "./Backdrop.svelte";

	const SRCSET = "/images/hero-720.webp 720w, /images/hero-1200.webp 1200w";
	const SIZES = "(max-width: 899px) 92vw, 520px";

	const EDITOR_SRCSET =
		"/images/2side-720.webp 720w, /images/2side-1200.webp 1200w";

	let { editor = $bindable(false) }: { editor?: boolean } = $props();
	let jakartaTime = $state("--:-- WIB");
	let imgEl: HTMLImageElement | null = $state(null);
	let imgReady = $state(false);

	onMount(() => {
		// The image may finish loading before hydration, so `onload` alone can miss it.
		if (imgEl?.complete) imgReady = true;

		const timeFormat = new Intl.DateTimeFormat("en-GB", {
			timeZone: "Asia/Jakarta",
			hour: "2-digit",
			minute: "2-digit",
		});
		const updateJakartaTime = () => {
			jakartaTime = `${timeFormat.format(new Date())} WIB`;
		};
		updateJakartaTime();
		const timeInterval = setInterval(updateJakartaTime, 30000);
		return () => clearInterval(timeInterval);
	});
</script>

<svelte:head>
	<!-- The hero photo is the largest thing on first paint: fetch it early. -->
	<link
		rel="preload"
		as="image"
		type="image/webp"
		imagesrcset={SRCSET}
		imagesizes={SIZES}
	/>
</svelte:head>

<section class="hero" class:hero--editor={editor} id="hero">
	<Backdrop variant="hero" />

	<div class="hero__content container">
		<!-- keyed so the fade-in replays on every switch -->
		{#key editor}
			<div class="hero__main">
				{#if editor}
					<span class="chip glass fade-in"
						><span class="dot"></span>Editor & Photographer</span
					>
					<h1 class="hero__title fade-in" style="--d: 1">
						Cutting <span class="hero__hl">Frames</span>,<br />And
						Capture.
					</h1>
					<p class="hero__intro fade-in" style="--d: 2">
						I'm Azhar Danica, a video editor and photographer from
						Purwokerto, Indonesia. I shape raw footage into stories
						with rhythm, and frame light and people into pictures
						that stay.
					</p>
				{:else}
					<span class="chip glass fade-in"
						><span class="dot"></span>Frontend Developer</span
					>
					<h1 class="hero__title fade-in" style="--d: 1">
						Crafting <span class="hero__hl">UI</span>,<br />Building
						the Web.
					</h1>
					<p class="hero__intro fade-in" style="--d: 2">
						I'm Azhar Danica, a frontend developer from Purwokerto,
						Indonesia. I turn ideas and designs into fast,
						accessible and responsive websites, with clean code and
						interfaces that feel effortless.
					</p>
				{/if}
				<div class="hero__actions fade-in" style="--d: 3">
					<a class="btn btn--light btn--lg" href="#contact"
						>Get in touch <span
							class="btn__arrow"
							aria-hidden="true">→</span
						></a
					>
					<a class="btn glass btn--lg" href="#work">View work</a>
				</div>

				<!-- Editor numbers are placeholders: replace with your real ones. -->
				<dl class="hero__stats fade-in" style="--d: 4">
					<div class="stat">
						<dt class="stat__label">
							{editor ? "Years editing" : "Years coding"}
						</dt>
						<dd class="stat__value">03+</dd>
					</div>
					<div class="stat">
						<dt class="stat__label">
							{editor ? "Videos & shoots" : "Projects shipped"}
						</dt>
						<dd class="stat__value">{editor ? "40+" : "25+"}</dd>
					</div>
					<div class="stat">
						<dt class="stat__label">Purwokerto, ID</dt>
						<dd class="stat__value">{jakartaTime}</dd>
					</div>
				</dl>
			</div>
		{/key}

		<div class="hero__visual fade-in" style="--d: 2">
			<div class="hero__card-back glass" aria-hidden="true"></div>
			<figure class="hero__card glass">
				<div class="hero__media">
					<img
						bind:this={imgEl}
						class="hero__img"
						class:is-ready={imgReady}
						src={editor
							? "/images/2side-1200.webp"
							: "/images/hero-1200.webp"}
						srcset={editor ? EDITOR_SRCSET : SRCSET}
						sizes={SIZES}
						width="1200"
						height={editor ? 900 : 800}
						alt={editor
							? "Portrait of Azhar Danica holding a film camera"
							: "Black-and-white portrait of Azhar Danica leaning on a railing"}
						fetchpriority="high"
						decoding="async"
						onload={() => (imgReady = true)}
					/>
					<span class="hero__badge chip glass">Since 2023</span>
				</div>
				<figcaption class="hero__card-foot">
					<span>
						<span class="hero__card-title">Azhar Danica</span>
						<span class="hero__card-sub"
							>{editor
								? "Video Editor & Photographer"
								: "Frontend Developer"} · Purwokerto, ID</span
						>
					</span>
					<button
						type="button"
						class="btn btn--light btn--sm hero__switch"
						aria-pressed={editor}
						aria-label={editor
							? "Switch to Frontend Developer mode"
							: "Switch to Editor & Photographer mode"}
						onclick={() => {
							editor = !editor;
							imgReady = false; // fade the new photo in once it loads
						}}
					>
						<svg
							viewBox="0 0 24 24"
							width="18"
							height="18"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
							><rect
								x="2"
								y="6"
								width="20"
								height="12"
								rx="6"
							/><circle
								class="hero__switch-knob"
								cx="8"
								cy="12"
								r="3"
							/></svg
						>
						Switch
					</button>
				</figcaption>
			</figure>
		</div>
	</div>

	<a class="hero__scroll glass" href="#about" aria-label="Scroll to About">
		<span class="hero__scroll-dot"></span>
	</a>
</section>
