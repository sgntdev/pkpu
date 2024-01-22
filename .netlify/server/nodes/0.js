

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.-DiJ4JzS.js","_app/immutable/chunks/scheduler.ZhRxoCc_.js","_app/immutable/chunks/index.CmI93sAg.js"];
export const stylesheets = [];
export const fonts = [];
