

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.oX9sRIL3.js","_app/immutable/chunks/scheduler.ZhRxoCc_.js","_app/immutable/chunks/index.CmI93sAg.js"];
export const stylesheets = [];
export const fonts = [];
