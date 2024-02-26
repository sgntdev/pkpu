<script>
	import '../../app.pcss';
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Footer,
		FooterCopyright,
		FooterLink,
		FooterLinkGroup
	} from 'flowbite-svelte';
</script>
<Navbar
	let:hidden
	let:toggle
	class="relative left-0 right-0 top-0 z-50 border border-gray-200 bg-white md:py-4"
>
	<NavBrand href="/">
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"> PKPU </span>
	</NavBrand>
</Navbar>
<div class="relative mx-auto min-h-screen max-w-7xl px-4">
	<slot />
</div>
<Footer footerType="logo" class="relative bottom-0 left-0 right-0">
	<FooterCopyright href="/" by="pkpu.co.id" />
</Footer>
