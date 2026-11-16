import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger(), VitePWA({
    strategies: 'generateSW',
    registerType: 'autoUpdate',
    injectRegister: null,
    manifest: false,
    devOptions: { enabled: false },
    filename: 'sw.js',
    includeAssets: ['manifest.webmanifest', 'icons/*.png', 'favicon.ico', 'hero-skater-poster.jpg'],
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,jpg,svg,ico,woff,woff2}'],
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      cleanupOutdatedCaches: true,
      navigateFallback: null,
      runtimeCaching: [
        {
          urlPattern: ({ request, url, sameOrigin }) => request.mode === 'navigate' && sameOrigin &&
            !/^\/(?:~oauth|auth|api|functions|rest|storage)(?:\/|$)/.test(url.pathname),
          handler: 'NetworkFirst',
          options: {
            cacheName: 'skategoals-pages',
            networkTimeoutSeconds: 3,
            precacheFallback: { fallbackURL: '/index.html' },
            cacheableResponse: { statuses: [200] },
            expiration: { maxEntries: 20, maxAgeSeconds: 7 * 24 * 60 * 60 },
          },
        },
        {
          urlPattern: ({ url, sameOrigin }) => sameOrigin && /^\/assets\/[^/]+-[\w-]+\.(?:js|css|woff2?|png|jpe?g|svg)$/.test(url.pathname),
          handler: 'CacheFirst',
          options: { cacheName: 'skategoals-static', cacheableResponse: { statuses: [200] } },
        },
      ],
    },
  })].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
