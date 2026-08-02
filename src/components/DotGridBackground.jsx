import { useRef, useCallback, useEffect } from 'react'

// Fondo animado de puntos que se usa detras de los hero banners
// (Home y Redes). Vivia adentro de HeroBanner.jsx; se saco a su
// propio archivo para poder reutilizarlo sin duplicar ~200 lineas
// de logica de canvas. El comportamiento es exactamente el mismo.

const DOT_SPACING = 26
const BASE_OPACITY_MIN = 0.25
const BASE_OPACITY_MAX = 0.5
const BASE_RADIUS = 1
const INTERACTION_RADIUS = 170
const INTERACTION_RADIUS_SQ = INTERACTION_RADIUS * INTERACTION_RADIUS
const OPACITY_BOOST = 0.75
const RADIUS_BOOST = 3.5
const GRID_CELL_SIZE = Math.max(50, Math.floor(INTERACTION_RADIUS / 1.5))
// Ademas de subir opacidad/tamano, los puntos bien cerca del cursor
// se redibujan con un halo (shadowBlur) para que el toque se vea
// como un brillo real y no solo un punto un poco mas grande.
const BRILLO_UMBRAL = 0.2
const BRILLO_BLUR = 16

export default function DotGridBackground() {
  const canvasRef = useRef(null)
  const animationFrameId = useRef(null)
  const dotsRef = useRef([])
  const gridRef = useRef({})
  const canvasSizeRef = useRef({ width: 0, height: 0 })
  const mousePositionRef = useRef({ x: null, y: null })

  const createDots = useCallback(() => {
    const { width, height } = canvasSizeRef.current
    if (!width || !height) return

    const newDots = []
    const newGrid = {}
    const cols = Math.ceil(width / DOT_SPACING)
    const rows = Math.ceil(height / DOT_SPACING)

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * DOT_SPACING + DOT_SPACING / 2
        const y = j * DOT_SPACING + DOT_SPACING / 2
        const cellKey = `${Math.floor(x / GRID_CELL_SIZE)}_${Math.floor(y / GRID_CELL_SIZE)}`
        if (!newGrid[cellKey]) newGrid[cellKey] = []
        newGrid[cellKey].push(newDots.length)

        const baseOpacity = Math.random() * (BASE_OPACITY_MAX - BASE_OPACITY_MIN) + BASE_OPACITY_MIN
        newDots.push({
          x,
          y,
          targetOpacity: baseOpacity,
          currentOpacity: baseOpacity,
          opacitySpeed: Math.random() * 0.004 + 0.0015,
        })
      }
    }
    dotsRef.current = newDots
    gridRef.current = newGrid
  }, [])

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    const width = parent ? parent.clientWidth : window.innerWidth
    const height = parent ? parent.clientHeight : window.innerHeight

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
      canvasSizeRef.current = { width, height }
      createDots()
    }
  }, [createDots])

  const handleMouseMove = useCallback((event) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    mousePositionRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }, [])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas ? canvas.getContext('2d') : null
    const dots = dotsRef.current
    const grid = gridRef.current
    const { width, height } = canvasSizeRef.current
    const { x: mouseX, y: mouseY } = mousePositionRef.current

    if (!ctx || !width || !height) {
      animationFrameId.current = requestAnimationFrame(animate)
      return
    }

    ctx.clearRect(0, 0, width, height)

    const active = new Set()
    if (mouseX != null && mouseY != null) {
      const mCellX = Math.floor(mouseX / GRID_CELL_SIZE)
      const mCellY = Math.floor(mouseY / GRID_CELL_SIZE)
      const searchR = Math.ceil(INTERACTION_RADIUS / GRID_CELL_SIZE)
      for (let i = -searchR; i <= searchR; i++) {
        for (let j = -searchR; j <= searchR; j++) {
          const key = `${mCellX + i}_${mCellY + j}`
          if (grid[key]) grid[key].forEach((idx) => active.add(idx))
        }
      }
    }

    // Se agrupan los puntos por color en vez de hacer
    // beginPath + fillStyle + fill uno por uno. Con ~1800 puntos eso
    // eran 1800 cambios de estado del contexto por frame; agrupados
    // bajan a unas pocas decenas. El resultado dibujado es el mismo.
    const porColor = new Map()
    // Puntos cerca del cursor: se guardan aparte para redibujarlos
    // encima con un halo. Normalmente son pocos (el radio de
    // interaccion es chico), asi que este segundo paso es barato.
    const brillantes = []

    for (let index = 0; index < dots.length; index++) {
      const dot = dots[index]

      dot.currentOpacity += dot.opacitySpeed
      if (dot.currentOpacity >= dot.targetOpacity || dot.currentOpacity <= BASE_OPACITY_MIN) {
        dot.opacitySpeed = -dot.opacitySpeed
        dot.currentOpacity = Math.max(BASE_OPACITY_MIN, Math.min(dot.currentOpacity, BASE_OPACITY_MAX))
        dot.targetOpacity = Math.random() * (BASE_OPACITY_MAX - BASE_OPACITY_MIN) + BASE_OPACITY_MIN
      }

      let interaction = 0
      if (mouseX != null && mouseY != null && active.has(index)) {
        const dx = dot.x - mouseX
        const dy = dot.y - mouseY
        const distSq = dx * dx + dy * dy
        if (distSq < INTERACTION_RADIUS_SQ) {
          const dist = Math.sqrt(distSq)
          interaction = Math.max(0, 1 - dist / INTERACTION_RADIUS)
          interaction *= interaction
        }
      }

      const opacity = Math.min(1, dot.currentOpacity + interaction * OPACITY_BOOST)
      const radius = BASE_RADIUS + interaction * RADIUS_BOOST
      const color = `rgba(255,194,107,${opacity.toFixed(3)})`

      const grupo = porColor.get(color)
      if (grupo) grupo.push(dot.x, dot.y, radius)
      else porColor.set(color, [dot.x, dot.y, radius])

      if (interaction > BRILLO_UMBRAL) {
        brillantes.push(dot.x, dot.y, radius, opacity)
      }
    }

    porColor.forEach((coords, color) => {
      ctx.fillStyle = color
      ctx.beginPath()
      for (let i = 0; i < coords.length; i += 3) {
        const x = coords[i]
        const y = coords[i + 1]
        const r = coords[i + 2]
        ctx.moveTo(x + r, y)
        ctx.arc(x, y, r, 0, Math.PI * 2)
      }
      ctx.fill()
    })

    if (brillantes.length) {
      ctx.shadowBlur = BRILLO_BLUR
      ctx.shadowColor = 'rgba(255, 186, 110, 0.95)'
      for (let i = 0; i < brillantes.length; i += 4) {
        const x = brillantes[i]
        const y = brillantes[i + 1]
        const r = brillantes[i + 2]
        const opacity = brillantes[i + 3]
        ctx.fillStyle = `rgba(255,224,180,${opacity.toFixed(3)})`
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0
    }

    animationFrameId.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    handleResize()

    const handleLeave = () => { mousePositionRef.current = { x: null, y: null } }

    // ── Control de reproduccion ────────────────────────────
    // El requestAnimationFrame solo corre cuando el canvas se ve
    // y la pestana esta activa (ver commit de optimizacion del hero).
    let visibleEnPantalla = true
    let pestanaActiva = !document.hidden

    const parar = () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
        animationFrameId.current = null
      }
    }

    const sincronizar = () => {
      const deberiaCorrer = visibleEnPantalla && pestanaActiva
      if (deberiaCorrer && !animationFrameId.current) {
        animationFrameId.current = requestAnimationFrame(animate)
      } else if (!deberiaCorrer) {
        parar()
      }
    }

    const observer = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(
        ([entrada]) => { visibleEnPantalla = entrada.isIntersecting; sincronizar() },
        { threshold: 0 }
      )
      : null

    if (observer && canvas) observer.observe(canvas)

    const handleVisibilidad = () => { pestanaActiva = !document.hidden; sincronizar() }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', handleLeave)
    document.addEventListener('visibilitychange', handleVisibilidad)

    sincronizar()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.documentElement.removeEventListener('mouseleave', handleLeave)
      document.removeEventListener('visibilitychange', handleVisibilidad)
      if (observer) observer.disconnect()
      parar()
    }
  }, [handleResize, handleMouseMove, animate])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  )
}
