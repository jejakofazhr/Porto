<script lang="ts">
	import Nav from "#lib/components/Nav.svelte";
	import Hero from "#lib/components/Hero.svelte";
	import About from "#lib/components/About.svelte";
	import Work from "#lib/components/Work.svelte";
	import Testimonials from "#lib/components/Testimonials.svelte";
	import Footer from "#lib/components/Footer.svelte";

	const DESCRIPTION =
		"Azhar Danica Budi Zulfalillah is a frontend developer from Purwokerto, Indonesia, building fast, accessible and responsive websites and web apps since 2018.";
</script>

<svelte:head>
	<title>Azhar Danica — Frontend Developer</title>
	<meta name="description" content={DESCRIPTION} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Azhar Danica — Frontend Developer" />
	<meta property="og:description" content={DESCRIPTION} />
	<meta name="twitter:card" content="summary" />
</svelte:head>

<Nav />

<main>
	<Hero />
	<About />
	<Work />
	<Testimonials />
</main>

<Footer />
