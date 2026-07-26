/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Backend origin for the Global Ducan REST API (no trailing slash),
   * e.g. `https://api.globalducan.com`.
   *
   * - Dev: used by the Vite proxy in vite.config.ts (the browser still calls
   *   same-origin `/api/v1/*`).
   * - Prod: if set at build time, the client calls this origin directly.
   *   Leave unset to keep requests relative and proxy them via vercel.json.
   */
  readonly VITE_API_BASE?: string
  /** Public web origin, used for referral links. */
  readonly VITE_WEB_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
