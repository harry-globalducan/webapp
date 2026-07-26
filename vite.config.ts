import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBase = env.VITE_API_BASE || 'http://192.168.1.19:15000'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        // Browser calls same-origin `/api/*`; Vite forwards to the REST backend.
        // Path is preserved (backend is expected to namespace routes under /api).
        // If your backend serves routes at the root instead (e.g. /auth/register),
        // add: rewrite: (p) => p.replace(/^\/api/, '')
        '/api': {
          target: apiBase,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
