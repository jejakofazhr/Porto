<script lang="ts">
	const quotes = [
		{
			quote: "“Azhar turned our slow, clunky shop into a store people actually enjoy using. Orders went up the week we launched.”",
			initials: "AS",
			name: "Ayu Setiawan",
			role: "Founder, Kopi Senja",
		},
		{
			quote: "“Rare mix of craft and clarity. Our app went from confusing to calm, and the component library Azhar left behind still saves us weeks.”",
			initials: "DL",
			name: "Daniel Lim",
			role: "Head of Product, Lumen",
		},
		{
			quote: "“Our launch site felt alive, with 3D and motion everywhere, yet it loaded instantly on every phone we tried. Delivered ahead of schedule.”",
			initials: "MR",
			name: "Maya Rahman",
			role: "Creative Lead, Orbit",
		},
	];
</script>

<section class="testimonials" id="testimonials">
	<div class="blob blob--pink" aria-hidden="true"></div>
	<div class="blob blob--blue" aria-hidden="true"></div>

	<div class="testimonials__inner container">
		<p class="eyebrow">(03) Kind Words</p>
		<h2 class="testimonials__title">What clients say</h2>

		<!-- Placeholder quotes: replace with real ones before launch. -->
		<div class="quotes">
			{#each quotes as item (item.name)}
				<figure class="quote glass">
					<blockquote>{item.quote}</blockquote>
					<figcaption class="quote__author">
						<span class="quote__avatar" aria-hidden="true"
							>{item.initials}</span
						>
						<span>
							<span class="quote__name">{item.name}</span>
							<span class="quote__role">{item.role}</span>
						</span>
					</figcaption>
				</figure>
			{/each}
		</div>
	</div>
</section>
