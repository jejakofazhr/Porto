<script lang="ts">
	import { onMount } from "svelte";
	import Backdrop from "./Backdrop.svelte";

	const SRCSET = "/images/hero-720.webp 720w, /images/hero-1200.webp 1200w";
	const SIZES = "(max-width: 899px) 92vw, 520px";

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

<section class="hero" id="hero">
	<Backdrop variant="hero" />

	<div class="hero__content container">
		<div class="hero__main">
			<span class="chip glass fade-in"
				><span class="dot"></span>Frontend Developer</span
			>
			<h1 class="hero__title fade-in" style="--d: 1">
				Crafting <span class="hero__hl">UI</span>,<br />Building the
				Web.
			</h1>
			<p class="hero__intro fade-in" style="--d: 2">
				I'm Azhar Danica, a frontend developer from Purwokerto,
				Indonesia. I turn ideas and designs into fast, accessible and
				responsive websites, with clean code and interfaces that feel
				effortless.
			</p>
			<div class="hero__actions fade-in" style="--d: 3">
				<a class="btn btn--light btn--lg" href="#contact"
					>Get in touch <span class="btn__arrow" aria-hidden="true"
						>→</span
					></a
				>
				<a class="btn glass btn--lg" href="#work">View work</a>
			</div>

			<dl class="hero__stats fade-in" style="--d: 4">
				<div class="stat">
					<dt class="stat__label">Years coding</dt>
					<dd class="stat__value">03+</dd>
				</div>
				<div class="stat">
					<dt class="stat__label">Projects shipped</dt>
					<dd class="stat__value">25+</dd>
				</div>
				<div class="stat">
					<dt class="stat__label">Purwokerto, ID</dt>
					<dd class="stat__value">{jakartaTime}</dd>
				</div>
			</dl>
		</div>

		<div class="hero__visual fade-in" style="--d: 2">
			<div class="hero__card-back glass" aria-hidden="true"></div>
			<figure class="hero__card glass">
				<div class="hero__media">
					<img
						bind:this={imgEl}
						class="hero__img"
						class:is-ready={imgReady}
						src="/images/hero-1200.webp"
						srcset={SRCSET}
						sizes={SIZES}
						width="1200"
						height="800"
						alt="Black-and-white portrait of Azhar Danica leaning on a railing"
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
							>Frontend Developer · Purwokerto, ID</span
						>
					</span>
					<span class="hero__card-tag" aria-hidden="true">✦</span>
				</figcaption>
			</figure>
		</div>
	</div>

	<a class="hero__scroll glass" href="#about" aria-label="Scroll to About">
		<span class="hero__scroll-dot"></span>
	</a>
</section>
