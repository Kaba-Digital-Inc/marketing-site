import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import agentFiles from './scripts/agent-files.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://kabadigitalinc.com',
  integrations: [react(), sitemap(), agentFiles()],
  vite: {
    plugins: [tailwindcss()],
  },
});
