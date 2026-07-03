import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Standard Vite + React config. The server host is passed via the CLI
// (--host 0.0.0.0) in docker-compose.yml so the dev server is reachable
// from the host browser.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Allows hot-reload to work reliably when the project is mounted from
    // the host into the container.
    watch: {
      usePolling: true,
    },
    // Proxy the rosbridge WebSocket through this same dev server.
    //
    // In GitHub Codespaces the browser can only reach forwarded ports over an
    // authenticated HTTPS origin. The GUI is served from the forwarded 5173
    // port, so we let it open its WebSocket to THIS origin at "/rosbridge" and
    // transparently forward that to rosbridge (ws://localhost:9090) inside the
    // container. This avoids having to make port 9090 "Public" by hand.
    //
    // The target can be overridden (e.g. for the local multi-container flow)
    // via the VITE_ROSBRIDGE_PROXY_TARGET environment variable.
    proxy: {
      '/rosbridge': {
        target: process.env.VITE_ROSBRIDGE_PROXY_TARGET || 'ws://localhost:9090',
        ws: true,
        changeOrigin: true,
        // rosbridge serves the WebSocket at the root path, so strip the prefix.
        rewrite: (path) => path.replace(/^\/rosbridge/, '') || '/',
      },
    },
  },
});
