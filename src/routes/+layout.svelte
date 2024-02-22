<script>
	import '../app.pcss';
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

<Navbar let:hidden let:toggle class="relative top-0 left-0 right-0 z-50">
	<NavBrand href="/">
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"> PKPU </span>
	</NavBrand>
</Navbar>
<div class="relative mx-auto w-full px-4 md:px-20">
	<slot />
</div>
<!-- <Footer footerType="logo" class="relative bottom-0 left-0 right-0">
	<FooterCopyright href="/" by="pkpu.co.id" />
  </Footer> -->
