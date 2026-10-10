declare module 'mammoth';

// Vite `?url` imports resolve to a served asset URL string at build time.
// This declaration lets TypeScript resolve them (the angular-compiler runs
// before Vite's bundler, so it needs the module shape declared here).
declare module '*?url' {
  const url: string;
  export default url;
}
