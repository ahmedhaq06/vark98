import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // 98.css uses `@media (not(hover))`, which Lightning CSS's minifier rejects.
    // 98.css ships pre-minified, so skipping CSS minification costs very little.
    cssMinify: false,
  },
});
