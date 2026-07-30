import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/icons/Icon'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
}

export default function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="vc-hero">
      <div className="vc-hero-bg">
        <div className="vc-hero-grid" />
        <div className="vc-hero-glow vc-animate-pulse" />
        <div className="vc-hero-glow-2" />
      </div>

      <div className="vc-hero-container">
        <motion.div
          className="vc-hero-content"
          initial="initial"
          animate="animate"
          variants={{
            animate: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.div variants={fadeUp} className="vc-hero-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Ecosistema Digital de Integración Económica
          </motion.div>

          <motion.h1 variants={fadeUp} className="vc-hero-title">
            Impulsamos la economía local con <span>tecnología</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="vc-hero-subtitle">
            Conectamos consumidores, negocios y proveedores en un ecosistema
            de puntos, fidelización, inventario inteligente y cotizaciones en tiempo real.
          </motion.p>

          <motion.div variants={fadeUp} className="vc-hero-actions">
            <button className="vc-btn vc-btn-primary" onClick={() => navigate('/register')}>
              Empieza gratis
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button className="vc-btn vc-btn-secondary" onClick={() => navigate('/register')}>
              Registrar negocio
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          className="vc-hero-visual"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="vc-hero-dashboard">
            <div className="vc-hero-dash-header">
              <div className="vc-hero-dash-dots">
                <span className="vc-hero-dash-dot" />
                <span className="vc-hero-dash-dot" />
                <span className="vc-hero-dash-dot" />
              </div>
              <span className="vc-hero-dash-title">Panel Vincco</span>
            </div>

            <div className="vc-hero-dash-body">
              <div className="vc-dash-card vc-animate-float">
                <div className="vc-dash-card-icon"><Icon name="star" filled size={20} /></div>
                <div className="vc-dash-card-label">Puntos</div>
                <div className="vc-dash-card-value">2,450</div>
              </div>

              <div className="vc-dash-card vc-animate-float-2">
                <div className="vc-dash-card-icon"><Icon name="bar-chart-2" size={20} /></div>
                <div className="vc-dash-card-label">Pedidos</div>
                <div className="vc-dash-card-value">128</div>
              </div>

              <div className="vc-dash-card vc-animate-float-3">
                <div className="vc-dash-card-icon"><Icon name="file-text" size={20} /></div>
                <div className="vc-dash-card-label">Cotizaciones</div>
                <div className="vc-dash-card-value">34</div>
              </div>

              <div className="vc-dash-card vc-animate-float">
                <div className="vc-dash-card-icon"><Icon name="bell" size={20} /></div>
                <div className="vc-dash-card-label">Notificaciones</div>
                <div className="vc-dash-card-value">6</div>
              </div>

              <div className="vc-dash-card vc-dash-card--wide vc-dash-card--row vc-animate-float-2">
                <div className="vc-dash-avatar">JD</div>
                <div style={{ flex: 1 }}>
                  <div className="vc-dash-card-label">Ranking</div>
                  <div className="vc-rank">
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>#3 de 150 negocios</span>
                  </div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </div>

              <div className="vc-dash-card vc-dash-card--wide vc-animate-float-3">
                <div className="vc-dash-card-label">Reseñas recientes</div>
                <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="star" filled size={14} style={{ color: '#fea02f' }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
