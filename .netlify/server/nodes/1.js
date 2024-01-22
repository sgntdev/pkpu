

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.ekZ98-TF.js","_app/immutable/chunks/scheduler.ZhRxoCc_.js","_app/immutable/chunks/index.CmI93sAg.js","_app/immutable/chunks/entry.H1mDlSZl.js"];
export const stylesheets = [];
export const fonts = [];
