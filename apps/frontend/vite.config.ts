import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    headers: {
      // Remove or comment out COEP in development
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    }
  },
  // Keep COEP in production if needed
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // Optional: Add COEP headers only in production
        intro: `
          if (import.meta.env.PROD) {
            const headers = new Headers();
            headers.set("Cross-Origin-Embedder-Policy", "require-corp");
            headers.set("Cross-Origin-Opener-Policy", "same-origin");
          }
        `,
      },
    },
  },
});
