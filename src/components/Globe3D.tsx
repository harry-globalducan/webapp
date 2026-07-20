import { useEffect, useRef, useState, type CSSProperties } from 'react'
import createGlobe, { type Globe } from 'cobe'
import { Plane } from 'lucide-react'

/** India hub — Global Ducan ships from here. */
const INDIA: [number, number] = [20.5937, 78.9629]

const ORANGE: [number, number, number] = [1, 0.533, 0.106] // #FF881B
const BLUE: [number, number, number] = [0, 0.29, 0.678] // #004AAD
const GREEN: [number, number, number] = [0.494, 0.851, 0.341] // #7ED957

type Destination = {
  id: string
  label: string
  location: [number, number]
  size: number
  color?: [number, number, number]
  /** Show floating name label on the globe */
  pin?: boolean
}

/** Markets we actively serve from India. */
const DESTINATIONS: Destination[] = [
  { id: 'india', label: 'India', location: INDIA, size: 0.13, color: GREEN, pin: true },
  { id: 'uae', label: 'UAE', location: [25.2048, 55.2708], size: 0.065, color: ORANGE, pin: true },
  { id: 'saudi', label: 'Saudi', location: [24.7136, 46.6753], size: 0.06, color: ORANGE, pin: true },
  { id: 'maldives', label: 'Maldives', location: [4.1755, 73.5093], size: 0.055, pin: true },
  { id: 'mauritius', label: 'Mauritius', location: [-20.1609, 57.5012], size: 0.055, pin: true },
  { id: 'seychelles', label: 'Seychelles', location: [-4.6191, 55.4513], size: 0.05, pin: true },
  { id: 'nepal', label: 'Nepal', location: [27.7172, 85.324], size: 0.05, pin: true },
  { id: 'bhutan', label: 'Bhutan', location: [27.4728, 89.6393], size: 0.048, pin: true },
  { id: 'srilanka', label: 'Sri Lanka', location: [6.9271, 79.8612], size: 0.048 },
  { id: 'qatar', label: 'Qatar', location: [25.2854, 51.531], size: 0.045 },
  { id: 'oman', label: 'Oman', location: [23.588, 58.3829], size: 0.045 },
]

const SERVED = DESTINATIONS.filter((d) => d.id !== 'india').map((d) => d.label)

const ARCS = DESTINATIONS.filter((d) => d.id !== 'india').map((d, i) => ({
  id: `arc-${d.id}`,
  from: INDIA,
  to: d.location,
  color: i % 2 === 0 ? ORANGE : undefined,
}))

const ROUTE_SAMPLES = [
  { to: 'Maldives', code: 'GD-2841' },
  { to: 'UAE', code: 'GD-2903' },
  { to: 'Mauritius', code: 'GD-3012' },
  { to: 'Nepal', code: 'GD-2770' },
  { to: 'Seychelles', code: 'GD-3118' },
  { to: 'Saudi', code: 'GD-2655' },
]

const THETA_BASE = 0.18
const THETA_MIN = -0.4
const THETA_MAX = 0.5
/** Start facing the Indian Ocean / South Asia cluster. */
const PHI_START = 2.55

const MARKERS = DESTINATIONS.map(({ id, location, size, color }) => ({
  id,
  location,
  size,
  color,
}))

function useIsDark() {
  const [dark, setDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'),
  )
  useEffect(() => {
    const root = document.documentElement
    const sync = () => setDark(root.classList.contains('dark'))
    sync()
    const obs = new MutationObserver(sync)
    obs.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])
  return dark
}

function palette(dark: boolean) {
  if (dark) {
    return {
      dark: 1,
      diffuse: 1.35,
      mapSamples: 20000,
      mapBrightness: 6.2,
      mapBaseBrightness: 0.04,
      baseColor: [0.42, 0.58, 0.92] as [number, number, number],
      glowColor: [0.04, 0.06, 0.1] as [number, number, number],
      markerColor: ORANGE,
      arcColor: ORANGE,
      opacity: 0.78,
    }
  }
  return {
    dark: 0,
    diffuse: 1.25,
    mapSamples: 20000,
    mapBrightness: 4.6,
    mapBaseBrightness: 0.02,
    // Softer blue land so destinations read clearly through the sphere
    baseColor: [0.05, 0.26, 0.55] as [number, number, number],
    glowColor: [0.9, 0.94, 0.99] as [number, number, number],
    markerColor: ORANGE,
    arcColor: BLUE,
    opacity: 0.72,
  }
}

/**
 * Interactive WebGL globe — India → Indian Ocean, Himalayas & Gulf markets.
 */
export default function Globe3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  const dark = useIsDark()
  const [ready, setReady] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [routeIdx, setRouteIdx] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setRouteIdx((i) => (i + 1) % ROUTE_SAMPLES.length)
    }, 3200)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const shell = shellRef.current
    if (!canvas || !shell) return

    let width = 0
    let globe: Globe | null = null
    let phi = PHI_START
    let phiOffset = 0
    let thetaOffset = 0
    let dragPhi = 0
    let dragTheta = 0
    let velPhi = 0
    let velTheta = 0
    let pointer: { x: number; y: number } | null = null
    let lastPointer: { x: number; y: number; t: number } | null = null
    let raf = 0
    let startRaf = 0
    let destroyed = false
    let reduceMotion = false

    const dpr = Math.min(window.devicePixelRatio || 2, 2)
    const colors = palette(dark)

    try {
      reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch {
      reduceMotion = false
    }

    const clampTheta = (v: number) => Math.min(THETA_MAX, Math.max(THETA_MIN, v))

    const tick = () => {
      if (destroyed || !globe) return

      const interacting = pointer !== null

      if (!interacting && !reduceMotion) {
        phi += 0.0014
      }

      if (!interacting) {
        if (Math.abs(velPhi) > 0.00008 || Math.abs(velTheta) > 0.00008) {
          phiOffset += velPhi
          thetaOffset = clampTheta(thetaOffset + velTheta)
          velPhi *= 0.94
          velTheta *= 0.94
        } else {
          velPhi = 0
          velTheta = 0
        }
        if (thetaOffset < THETA_MIN) {
          thetaOffset += (THETA_MIN - thetaOffset) * 0.12
        } else if (thetaOffset > THETA_MAX) {
          thetaOffset += (THETA_MAX - thetaOffset) * 0.12
        }
      }

      globe.update({
        phi: phi + phiOffset + dragPhi,
        theta: THETA_BASE + thetaOffset + dragTheta,
        width,
        height: width,
      })
      raf = requestAnimationFrame(tick)
    }

    const mount = () => {
      if (destroyed || globe) return
      width = canvas.offsetWidth
      if (width < 32) return

      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width,
        height: width,
        phi: phi + phiOffset,
        theta: THETA_BASE + thetaOffset,
        scale: 1.04,
        markerElevation: 0.045,
        arcWidth: 0.95,
        arcHeight: 0.28,
        markers: MARKERS,
        arcs: ARCS,
        ...colors,
      })

      setReady(true)
      raf = requestAnimationFrame(tick)
    }

    const onResize = () => {
      width = canvas.offsetWidth
      if (!globe) {
        mount()
        return
      }
      if (width >= 32) globe.update({ width, height: width })
    }

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      pointer = { x: e.clientX, y: e.clientY }
      lastPointer = { x: e.clientX, y: e.clientY, t: performance.now() }
      velPhi = 0
      velTheta = 0
      dragPhi = 0
      dragTheta = 0
      setDragging(true)
      shell.setPointerCapture?.(e.pointerId)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!pointer) return
      const deltaX = e.clientX - pointer.x
      const deltaY = e.clientY - pointer.y
      dragPhi = deltaX / 280
      dragTheta = deltaY / 900

      const now = performance.now()
      if (lastPointer) {
        const dt = Math.max(16, now - lastPointer.t)
        const vx = (e.clientX - lastPointer.x) / dt
        const vy = (e.clientY - lastPointer.y) / dt
        velPhi = Math.max(-0.08, Math.min(0.08, vx * 0.35))
        velTheta = Math.max(-0.04, Math.min(0.04, vy * 0.12))
      }
      lastPointer = { x: e.clientX, y: e.clientY, t: now }
    }

    const onPointerUp = (e: PointerEvent) => {
      if (!pointer) return
      phiOffset += dragPhi
      thetaOffset = clampTheta(thetaOffset + dragTheta)
      dragPhi = 0
      dragTheta = 0
      pointer = null
      lastPointer = null
      setDragging(false)
      try {
        shell.releasePointerCapture?.(e.pointerId)
      } catch {
        // already released
      }
    }

    const ro = new ResizeObserver(onResize)
    ro.observe(canvas)

    shell.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })
    window.addEventListener('pointercancel', onPointerUp, { passive: true })

    startRaf = requestAnimationFrame(() => {
      mount()
      requestAnimationFrame(mount)
    })

    return () => {
      destroyed = true
      cancelAnimationFrame(startRaf)
      cancelAnimationFrame(raf)
      ro.disconnect()
      shell.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      globe?.destroy()
      globe = null
      setReady(false)
    }
  }, [dark])

  const route = ROUTE_SAMPLES[routeIdx]
  const pinLabels = DESTINATIONS.filter((d) => d.pin)

  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
      <div
        ref={shellRef}
        className={`relative aspect-square w-full touch-none select-none ${
          dragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        role="img"
        aria-label="Interactive globe showing Global Ducan shipping from India to Maldives, Mauritius, Seychelles, Bhutan, Nepal, UAE, Saudi Arabia and more."
      >
        <div
          className="pointer-events-none absolute inset-[5%] rounded-full bg-[radial-gradient(circle_at_32%_28%,rgba(255,136,27,0.16),transparent_42%),radial-gradient(circle_at_68%_62%,rgba(0,74,173,0.14),transparent_52%),radial-gradient(circle,rgba(238,244,252,0.7)_0%,rgba(238,244,252,0)_68%)] dark:bg-[radial-gradient(circle_at_32%_28%,rgba(255,136,27,0.18),transparent_42%),radial-gradient(circle_at_68%_62%,rgba(0,74,173,0.22),transparent_52%),radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_68%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-[9%] rounded-full border border-navy-500/15 dark:border-white/10"
          aria-hidden
        />

        <canvas
          ref={canvasRef}
          className={`relative z-[1] h-full w-full transition-opacity duration-700 contain-[layout_paint_size] ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ width: '100%', height: '100%' }}
        />

        {/* Country pins — fade via cobe visibility CSS vars when facing camera */}
        {pinLabels.map((d) => (
          <span
            key={d.id}
            className="globe-pin pointer-events-none absolute z-[2] whitespace-nowrap rounded-full border border-navy-900/10 bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-navy-800 shadow-sm backdrop-blur-sm dark:border-white/15 dark:bg-black/80 dark:text-white"
            style={
              {
                positionAnchor: `--cobe-${d.id}`,
                left: 'anchor(center)',
                bottom: 'anchor(top)',
                translate: '-50% -6px',
                opacity: `var(--cobe-visible-${d.id}, 0)`,
                filter: `blur(calc((1 - var(--cobe-visible-${d.id}, 0)) * 6px))`,
                transition: 'opacity 0.35s ease, filter 0.35s ease',
              } as CSSProperties
            }
          >
            {d.label}
          </span>
        ))}

        <div
          key={route.code}
          className="pointer-events-none absolute -left-2 top-6 z-[3] animate-pop rounded-2xl border border-navy-900/8 bg-white/90 px-4 py-3 shadow-lg shadow-navy-900/5 backdrop-blur-md dark:border-white/10 dark:bg-black/85 dark:shadow-none sm:-left-4"
        >
          <div className="text-[11px] font-medium text-slate-400">Order #{route.code}</div>
          <div className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-navy-900 dark:text-white">
            <Plane className="h-4 w-4 text-tangerine-500" /> India → {route.to}
          </div>
        </div>

        <div className="pointer-events-none absolute -right-1 bottom-14 z-[3] animate-float-late rounded-2xl border border-navy-900/8 bg-white/90 px-4 py-3 shadow-lg shadow-navy-900/5 backdrop-blur-md dark:border-white/10 dark:bg-black/85 dark:shadow-none sm:-right-2 sm:bottom-16">
          <div className="text-[11px] font-medium text-slate-400">From India</div>
          <div className="mt-0.5 text-sm font-bold text-leaf-600 dark:text-leaf-400">
            Indian Ocean & Gulf
          </div>
        </div>

        <p className="pointer-events-none absolute bottom-1 left-1/2 z-[2] -translate-x-1/2 text-[10px] font-medium tracking-wide text-slate-400/80 opacity-0 sm:opacity-100 dark:text-slate-500">
          Drag to explore
        </p>
      </div>

      {/* Always-visible served markets — clarity even without CSS anchor support */}
      <div className="mt-3 px-1">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          We ship from India to
        </p>
        <ul className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
          {SERVED.map((name) => (
            <li
              key={name}
              className="rounded-full border border-navy-500/15 bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-navy-700 backdrop-blur-sm dark:border-white/15 dark:bg-white/5 dark:text-white/85"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
