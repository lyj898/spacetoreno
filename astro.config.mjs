// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://spacetoreno.com',
  // Must match the canonical URLs, or ranking signal splits across slash and no-slash variants.
  trailingSlash: 'always',
  // Inline the stylesheet so nothing blocks first paint (Lighthouse 95+ is the family's bar).
  build: { format: 'directory', inlineStylesheets: 'always' },
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/404/'),
    }),
  ],
});
