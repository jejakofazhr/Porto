<script lang="ts">
	let { editor = false }: { editor?: boolean } = $props();

	// DRAFT quotes written to match the current projects: get each client's OK (or their real words and name) before launch.
	const editorQuotes = [
		{
			quote: "“The photos feel natural and warm, and every frame keeps the same tone. Our clients love seeing themselves this way.”",
			initials: "SP",
			name: "Sejala Photo",
			role: "Photography client",
		},
		{
			quote: "“He captured the cozy feel of our space exactly. Our feed finally looks like what people experience when they walk in.”",
			initials: "JC",
			name: "Jejak Cafein",
			role: "Cafe owner",
		},
		{
			quote: "“The bumper set the mood the second it played. Ten seconds, our mascots, and the whole hall was hyped.”",
			initials: "FT",
			name: "FTC UMP 2024",
			role: "Event committee",
		},
	];

	const devQuotes = [
		{
			quote: "“Guests can find and book a villa in Dieng from their phone in a few taps, and our bookings are no longer scattered across chats.”",
			initials: "MB",
			name: "MenjerBook",
			role: "Owner",
		},
		{
			quote: "“Managing units, prices and availability used to take a spreadsheet and a lot of messages. Now it's one clean dashboard.”",
			initials: "MB",
			name: "MenjerBook",
			role: "Admin team",
		},
		{
			quote: "“Parents could register online and upload documents without coming to school. Admission season was much calmer for our team.”",
			initials: "SI",
			name: "SDIT Insan Mulia Banyumas",
			role: "Admissions committee",
		},
	];

	const quotes = $derived(editor ? editorQuotes : devQuotes);
</script>

<section class="testimonials" id="testimonials">
	<div class="blob blob--pink" aria-hidden="true"></div>
	<div class="blob blob--blue" aria-hidden="true"></div>

	<div class="testimonials__inner container">
		<p class="eyebrow">(03) Kind Words</p>
		<h2 class="testimonials__title">What clients say</h2>

		<div class="quotes">
			{#each quotes as item (item.role + item.name)}
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
