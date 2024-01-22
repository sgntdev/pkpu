import { c as create_ssr_component } from "../../chunks/ssr.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<h1 data-svelte-h="svelte-1axyf4f">Home</h1> <h3 data-svelte-h="svelte-1h6s7mt">List Debitur PKPU</h3> <table border="1px solid" data-svelte-h="svelte-c6lasa"><tr><th>No</th> <th>Nama</th> <th>Tanggal Sidang</th> <th>Tempat Sidang</th> <th>Link</th></tr> <tr><td>1</td> <td>PT ABC</td> <td>4 Januari 2024</td> <td>Jakarta</td> <td><a href="/pt-abc">PT ABC</a></td></tr></table>`;
});
export {
  Page as default
};
