import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

/** Serves GET /api/social/feed in `vite` so Meta tokens never hit the browser or the Java proxy. */
function socialFeedDevApi(): Plugin {
  return {
    name: 'social-feed-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
        const url = req.url?.split('?')[0]
        if (url !== '/api/social/feed') {
          next()
          return
        }
        if (req.method !== 'GET') {
          res.statusCode = 405
          res.end('Method not allowed')
          return
        }
        try {
          const { fetchSocialFeed } = await import('./server/social/fetchFeed.ts')
          const result = await fetchSocialFeed(6)
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Cache-Control', 'no-store')
          res.end(JSON.stringify(result))
        } catch (e) {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              posts: [],
              sources: [],
              error: e instanceof Error ? e.message : 'Could not load social feed',
            }),
          )
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBase = env.VITE_API_BASE || 'http://192.168.1.19:15000'

  // Expose non-VITE secrets to the Vite middleware / Node process (never to client).
  for (const key of [
    'META_PAGE_ACCESS_TOKEN',
    'META_PAGE_ID',
    'META_IG_USER_ID',
    'META_GRAPH_VERSION',
    'LINKEDIN_ACCESS_TOKEN',
    'LINKEDIN_ORG_ID',
    'LINKEDIN_API_VERSION',
  ]) {
    if (env[key]) process.env[key] = env[key]
  }

  return {
    plugins: [socialFeedDevApi(), react(), tailwindcss()],
    server: {
      proxy: {
        // Browser calls same-origin `/api/*`; Vite forwards to the REST backend.
        // `/api/social/*` is handled above and never reaches this proxy.
        '/api': {
          target: apiBase,
          changeOrigin: true,
          secure: false,
          bypass(req) {
            if (req.url?.startsWith('/api/social')) return req.url
          },
        },
      },
    },
  }
})
