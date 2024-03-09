<script>
    import {
		Breadcrumb,
		BreadcrumbItem,
	} from 'flowbite-svelte';
    export let data;
</script>
<div class="space-y-4">
    <Breadcrumb aria-label="Default breadcrumb example" class="mb-4">
        <BreadcrumbItem home>Dashboard</BreadcrumbItem>
    </Breadcrumb>
</div>