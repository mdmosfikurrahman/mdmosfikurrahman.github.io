import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// GitHub Pages serves its own 404 for unknown paths. For SPAs we copy
// dist/index.html to dist/404.html so GitHub serves the same app shell on
// unknown routes; React Router's <Route path="*"> then renders NotFound.
function githubPagesSpaFallback() {
  return {
    name: 'github-pages-spa-404',
    closeBundle() {
      const src = path.resolve(__dirname, 'dist/index.html');
      const dst = path.resolve(__dirname, 'dist/404.html');
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dst);
        // eslint-disable-next-line no-console
        console.log('\n✓ Copied dist/index.html → dist/404.html (GitHub Pages SPA fallback)');
      }
    },
  };
}

export default defineConfig({
  base: '/', // ✅ Correct for user/org GitHub Pages site
  plugins: [react(), githubPagesSpaFallback()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
