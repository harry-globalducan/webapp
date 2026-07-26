import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

/** Thin top progress bar that pulses on every route change. */
export default function RouteProgress() {
  const { pathname } = useLocation()
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setState('loading')
    const done = window.setTimeout(() => setState('done'), 380)
    const reset = window.setTimeout(() => setState('idle'), 900)
    return () => {
      window.clearTimeout(done)
      window.clearTimeout(reset)
    }
  }, [pathname])

  if (state === 'idle') return null

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5">
      <div
        className="h-full bg-gradient-to-r from-tangerine-500 via-tangerine-400 to-leaf-400 shadow-[0_0_10px_rgba(255,136,27,0.7)] transition-all ease-out"
        style={{
          width: state === 'done' ? '100%' : '75%',
          opacity: state === 'done' ? 0 : 1,
          transitionDuration: state === 'done' ? '250ms' : '380ms',
        }}
      />
    </div>
  )
}
