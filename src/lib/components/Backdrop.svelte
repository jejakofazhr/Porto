<script lang="ts">
	// Decorative section background: drifting blobs, a dot grid and three doodles.
	// Positions and colours per variant live in app.css (.deco--<variant>).
	// The parent needs `position: relative; isolation: isolate`.
	let { variant }: { variant: "hero" | "about" | "work" | "footer" } = $props();
</script>

<div class="deco deco--{variant}" aria-hidden="true">
	<div class="blob blob--a"></div>
	<div class="blob blob--b"></div>
	<div class="blob blob--c"></div>
	<div class="deco__grid"></div>
	<svg class="doodle doodle--squiggle" viewBox="0 0 160 80" fill="none">
		<path d="M4 60c18-40 34-40 42-10s26 30 36-6 30-38 40-4 18 26 34 2" />
	</svg>
	<svg class="doodle doodle--spark" viewBox="0 0 48 48" fill="none">
		<path d="M24 2c2 14 8 20 22 22-14 2-20 8-22 22-2-14-8-20-22-22 14-2 20-8 22-22Z" />
	</svg>
	<svg class="doodle doodle--ring" viewBox="0 0 60 60" fill="none">
		<circle cx="30" cy="30" r="26" stroke-dasharray="4 7" />
	</svg>
</div>
