import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/icons/Icon'

const VINCCO_LOGO = `${process.env.PUBLIC_URL}/assets/logos/vincco-logo.png`

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
}

// Posiciones en porcentaje sobre el contenedor cuadrado del padrón.
// Las líneas del SVG y las fichas HTML comparten estas mismas
// coordenadas para quedar alineadas en cualquier tamaño de pantalla.
const HUB = { x: 50, y: 54 }
const NODES = [
  { key: 'consumidor', x: 50, y: 10, variant: 'gold', icon: 'wallet', label: 'Consumidor', sub: 'Acumula puntos' },
  { key: 'comercio', x: 12, y: 90, variant: 'orange', icon: 'store', label: 'Comercio', sub: 'Vende y fideliza' },
  { key: 'proveedor', x: 88, y: 90, variant: 'teal', icon: 'truck', label: 'Proveedor', sub: 'Surte pedidos' },
]

function PadronDiagram() {
  return (
    <div className="vc-hub">
      <div className="vc-hub-ring" />
      <svg className="vc-hub-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {NODES.map((n) => (
          <line key={n.key} x1={HUB.x} y1={HUB.y} x2={n.x} y2={n.y} />
        ))}
      </svg>

      <div className="vc-hub-center">
        <img src={VINCCO_LOGO} alt="" className="vc-hub-center-img" />
        <span className="vc-hub-center-word">Vincco</span>
      </div>

      {NODES.map((n) => (
        <div
          key={n.key}
          className={`vc-hub-node vc-hub-node--${n.variant}`}
          style={{ top: `${n.y}%`, left: `${n.x}%` }}
        >
          <span className="vc-hub-node-icon"><Icon name={n.icon} size={16} /></span>
          <span className="vc-hub-node-label">
            <strong>{n.label}</strong>
            <span>{n.sub}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

export default function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="vc-hero">
      <div className="vc-hero-container">
        <motion.div
          className="vc-hero-content"
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div variants={fadeUp} className="vc-hero-badge">
            <span className="vc-hero-badge-dot">V</span>
            Red económica de Nueva Guinea, Nicaragua
          </motion.div>

          <motion.h1 variants={fadeUp} className="vc-hero-title">
            Un solo padrón digital para <em>la economía local</em>
          </motion.h1>

          <motion.p variants={fadeUp} className="vc-hero-subtitle">
            Vincco conecta a consumidores, comercios y proveedores de la zona
            en un mismo registro: puntos que se acumulan, inventario que se
            controla y cotizaciones que se resuelven en minutos.
          </motion.p>

          <motion.div variants={fadeUp} className="vc-hero-actions">
            <button className="vc-btn vc-btn-primary" onClick={() => navigate('/register')}>
              Registrá tu negocio
              <Icon name="arrow-right" size={16} />
            </button>
            <button
              className="vc-btn vc-btn-secondary"
              onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ver cómo funciona
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
        >
          <PadronDiagram />
        </motion.div>
      </div>
    </section>
  )
}
