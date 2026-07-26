import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Fade out the instant splash once the app has painted its first frame.
function hideSplash() {
  const splash = document.getElementById('app-splash')
  if (!splash) return
  splash.classList.add('is-hidden')
  splash.addEventListener('transitionend', () => splash.remove(), { once: true })
  window.setTimeout(() => splash.remove(), 700)
}
requestAnimationFrame(() => requestAnimationFrame(hideSplash))

// PWA: register the service worker so the app is installable and can act as a
// share target on Android ("Share → Global Ducan" from any product page).
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
