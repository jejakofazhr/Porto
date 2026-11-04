<script lang="ts">
	import Backdrop from "./Backdrop.svelte";

	let { editor = false }: { editor?: boolean } = $props();
	const brand = $derived(editor ? "Azhar Visual" : "Azhar Dev");
</script>

<footer class="footer" id="contact" data-nav="light">
	<Backdrop variant="footer" />
	<div class="container">
		<p class="eyebrow">(04) Contact</p>
		<h2 class="footer__title">
			Let's make<br />something <span class="outline">great</span>
		</h2>
		<a class="btn btn--dark btn--lg" href="mailto:4zh4rd@gmail.com">
			4zh4rd@gmail.com <span class="btn__arrow" aria-hidden="true">→</span
			>
		</a>

		<div class="footer__grid">
			<div>
				<h3 class="footer__heading">Based in</h3>
				<p>Purwokerto, Indonesia<br />Working worldwide</p>
			</div>
			<div>
				<h3 class="footer__heading">Social</h3>
				<ul class="footer__list">
					<li>
						<a href="https://www.instagram.com/jejak.azhr/"
							>Instagram</a
						>
					</li>
					<li><a href="#contact">Dribbble</a></li>
					<li><a href="#contact">Behance</a></li>
					<li><a href="#contact">LinkedIn</a></li>
				</ul>
			</div>
			<div>
				<h3 class="footer__heading">Menu</h3>
				<ul class="footer__list">
					<li><a href="#about">About</a></li>
					<li><a href="#work">Work</a></li>
					<li><a href="#testimonials">Words</a></li>
				</ul>
			</div>
			<div class="footer__top-wrap">
				<a
					class="footer__top glass"
					href="#hero"
					aria-label="Back to top">↑</a
				>
			</div>
		</div>

		<div class="footer__bottom">
			<span>© 2026 {brand}</span>
			<span>Built in Indonesia</span>
		</div>
	</div>

	<div class="footer__wordmark" aria-hidden="true">{brand}</div>
</footer>
