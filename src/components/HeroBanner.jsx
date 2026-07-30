import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import Icon from './icons/Icon'

const VINCCO_LOGO = `${process.env.PUBLIC_URL}/assets/logos/vincco-logo.png`

const GOLD = '#ffc26b'
const GOLD_LIGHT = '#ffd28c'
const HERO_BG = '#012d40'

const ROTATING_WORDS = ['Conectividad', 'Comercio', 'Fidelidad']

const CONTACTOS = [
  { label: 'Negocios', icon: 'store' },
  { label: 'Proveedores', icon: 'truck' },
  { label: 'Promociones', icon: 'tag' },
  { label: 'Recompensas', icon: 'star' },
  { label: 'Categorías', icon: 'box' },
]

function useRotatingWord(words, intervalMs = 2200) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length)
    }, intervalMs)
    return () => clearInterval(id)
  }, [words, intervalMs])

  return words[index]
}

const DOT_SPACING = 26
const BASE_OPACITY_MIN = 0.25
const BASE_OPACITY_MAX = 0.5
const BASE_RADIUS = 1
const INTERACTION_RADIUS = 140
const INTERACTION_RADIUS_SQ = INTERACTION_RADIUS * INTERACTION_RADIUS
const OPACITY_BOOST = 0.5
const RADIUS_BOOST = 2
const GRID_CELL_SIZE = Math.max(50, Math.floor(INTERACTION_RADIUS / 1.5))

function DotGridBackground() {
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

    dots.forEach((dot, index) => {
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

      ctx.beginPath()
      ctx.fillStyle = `rgba(255,194,107,${opacity.toFixed(3)})`
      ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2)
      ctx.fill()
    })

    animationFrameId.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    handleResize()
    const handleLeave = () => { mousePositionRef.current = { x: null, y: null } }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', handleLeave)
    animationFrameId.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.documentElement.removeEventListener('mouseleave', handleLeave)
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
    }
  }, [handleResize, handleMouseMove, animate])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  )
}

export default function HeroBanner() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const rotatingWord = useRotatingWord(ROTATING_WORDS)

  return (
    <>
      <style>{`
        @media (max-width: 480px) {
          .hero-banner-section { min-height: 460px !important; border-radius: 0 !important; }
          .hero-banner-header { padding: 22px 20px !important; }
          .hero-banner-logo { height: 32px !important; }
          .hero-banner-content { padding: 0 20px 32px !important; }
          .hero-eyebrow { font-size: 11px !important; }
          .hero-title { font-size: 28px !important; }
          .hero-rotating { font-size: 28px !important; height: 38px !important; }
          .hero-description { font-size: 13px !important; max-width: 100% !important; }
          .hero-search { max-width: 100% !important; }
          .hero-contactos-chips { gap: 8px !important; }
          .hero-chip { padding: 8px 14px !important; font-size: 12px !important; }
        }
        @media (min-width: 481px) and (max-width: 767px) {
          .hero-banner-section { min-height: 520px !important; border-radius: 0 !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .hero-banner-section { min-height: 560px !important; border-radius: 36px !important; margin: 20px !important; }
          .hero-title { font-size: 36px !important; }
          .hero-rotating { font-size: 36px !important; height: 46px !important; }
        }
        @media (min-width: 1024px) {
          .hero-banner-section { min-height: 640px !important; border-radius: 0 0 40px 40px !important; }
          .hero-title { font-size: 48px !important; }
          .hero-rotating { font-size: 48px !important; height: 58px !important; }
          .hero-description { font-size: 17px !important; }
        }
        .hero-search-input::placeholder { color: rgba(255,255,255,0.65); }
      `}</style>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <section className="hero-banner-section" style={{
        position: 'relative',
        borderRadius: 36,
        overflow: 'hidden',
        background: HERO_BG,
        boxShadow: '0 30px 100px rgba(0, 24, 36, 0.35)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <DotGridBackground />

        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background: `linear-gradient(to bottom, transparent 0%, ${HERO_BG} 92%), radial-gradient(ellipse at center, transparent 35%, ${HERO_BG} 95%)`,
        }} />

        <header className="hero-banner-header" style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '32px 40px',
        }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.20)',
              borderRadius: 10,
              cursor: 'pointer',
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
            }}
            aria-label="Abrir menú"
          >
            <span style={{ display: 'block', width: 20, height: 2, backgroundColor: '#ffffff', borderRadius: 2 }} />
            <span style={{ display: 'block', width: 20, height: 2, backgroundColor: '#ffffff', borderRadius: 2 }} />
            <span style={{ display: 'block', width: 20, height: 2, backgroundColor: '#ffffff', borderRadius: 2 }} />
          </button>

          <img
            src={VINCCO_LOGO}
            alt="VINCCO"
            className="hero-banner-logo"
            style={{ height: 38, width: 'auto' }}
          />
        </header>

        <div className="hero-banner-content" style={{
          position: 'relative',
          zIndex: 2,
          color: '#ffffff',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '0 40px 56px',
          maxWidth: 1200,
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          <p className="hero-eyebrow" style={{
            margin: 0,
            fontSize: 13,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: 700,
            color: GOLD,
          }}>
            Ecosistema digital para el comercio local
          </p>

          <h1 className="hero-title" style={{
            margin: '16px 0 0',
            fontSize: 40,
            lineHeight: 1.08,
            fontWeight: 700,
            fontFamily: "'Sora', 'Inter', sans-serif",
            letterSpacing: '-0.02em',
            textShadow: '0 4px 24px rgba(0,0,0,0.25)',
          }}>
            Bienvenido a Vincco
          </h1>

          <div className="hero-rotating" style={{
            fontSize: 40,
            height: 50,
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            fontWeight: 700,
            fontFamily: "'Sora', 'Inter', sans-serif",
            letterSpacing: '-0.02em',
            marginBottom: 18,
          }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={rotatingWord}
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 250 }}
                style={{ color: GOLD, display: 'inline-block' }}
              >
                {rotatingWord}
              </motion.span>
            </AnimatePresence>
          </div>

          <p className="hero-description" style={{
            margin: '0 0 32px',
            fontSize: 15,
            lineHeight: 1.6,
            maxWidth: 520,
            color: 'rgba(255,255,255,0.85)',
          }}>
            Descubre negocios locales, gana recompensas por cada compra y fortalece la economía de tu comunidad desde un solo lugar.
          </p>

          <form
            className="hero-search"
            onSubmit={(e) => e.preventDefault()}
            style={{
              display: 'flex',
              width: '100%',
              maxWidth: 480,
              gap: 10,
              marginBottom: 40,
            }}
          >
            <input
              type="text"
              placeholder="Buscar negocios, productos o categorías..."
              aria-label="Buscar"
              className="hero-search-input"
              style={{
                flex: 1,
                minWidth: 0,
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.25)',
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(6px)',
                padding: '14px 20px',
                fontSize: 14,
                color: '#ffffff',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onFocus={(e) => { e.target.style.borderColor = GOLD; e.target.style.background = 'rgba(255,255,255,0.18)' }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.25)'; e.target.style.background = 'rgba(255,255,255,0.12)' }}
            />
            <button
              type="submit"
              aria-label="Buscar"
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                backgroundColor: GOLD,
                color: '#00283b',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = GOLD_LIGHT }}
              onMouseLeave={(e) => { e.currentTarget.style.background = GOLD }}
            >
              <Icon name="search" size={18} />
            </button>
          </form>

          <div className="hero-contactos" style={{ width: '100%' }}>
            <span style={{
              display: 'block',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.55)',
              marginBottom: 12,
            }}>
              Contactos
            </span>
            <div className="hero-contactos-chips" style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
            }}>
              {CONTACTOS.map((c) => (
                <button
                  key={c.label}
                  className="hero-chip"
                  type="button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '9px 18px',
                    borderRadius: 999,
                    border: '1px solid rgba(255,255,255,0.22)',
                    background: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'background 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.16)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)' }}
                >
                  <Icon name={c.icon} size={15} />
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
