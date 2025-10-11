import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { env } from "process";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Dev proxy for Sentry tunnel so requests to /monitoring succeed locally
    proxy: {
      "/monitoring": {
        target: env.VITE_SENTRY_DSN,
        changeOrigin: true,
        secure: true,
        headers: {
          "Content-Type": "application/x-sentry-envelope",
        },
        // Map the local /monitoring path to the Sentry envelope endpoint for the project
        rewrite: (path) => "/api/4510171169357904/envelope",
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Ensure consistent chunk names for better caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.names?.[0]?.split('.') || [];
          const extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType || '')) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(extType || '')) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    // Enable source maps for better debugging in production
    sourcemap: mode !== 'production',
    // Ensure manifest.json and service worker are copied to dist
    assetsInlineLimit: 0,
  },
  // PWA specific configurations
  publicDir: 'public',
  base: '/',
  // Ensure service worker and manifest are served correctly
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
  },
}));
