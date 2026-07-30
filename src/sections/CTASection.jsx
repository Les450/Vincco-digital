import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function CTASection() {
  const navigate = useNavigate()

  return (
    <section className="vc-cta">
      <div className="vc-cta-glow vc-animate-pulse" />
      <div className="vc-cta-content">
        <motion.h2
          className="vc-cta-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Únete al ecosistema Vincco
        </motion.h2>
        <motion.p
          className="vc-cta-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Forma parte de la red que está transformando la economía local.
          Regístrate hoy y comienza a crecer.
        </motion.p>
        <motion.div
          className="vc-cta-actions"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <button className="vc-btn vc-btn-primary" onClick={() => navigate('/register')}>
            Registrar negocio
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <button className="vc-btn vc-btn-secondary" onClick={() => navigate('/login')} style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}>
            Crear cuenta gratis
          </button>
        </motion.div>
      </div>
    </section>
  )
}
