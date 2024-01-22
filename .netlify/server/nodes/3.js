import * as server from '../entries/pages/_id_/_uniquecode_/_page.server.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_id_/_uniquecode_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/[id]/[uniquecode]/+page.server.js";
export const imports = ["_app/immutable/nodes/3.V8HnEgxe.js","_app/immutable/chunks/scheduler.ZhRxoCc_.js","_app/immutable/chunks/index.CmI93sAg.js"];
export const stylesheets = [];
export const fonts = [];
