import { motion } from 'framer-motion'
import Icon from '../components/icons/Icon'

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', icon: 'bar-chart-2' },
  { label: 'Inventario', icon: 'package' },
  { label: 'Cotizaciones', icon: 'file-text' },
  { label: 'Pedidos', icon: 'truck' },
  { label: 'Puntos', icon: 'star' },
  { label: 'Clientes', icon: 'users' },
  { label: 'Reseñas', icon: 'star' },
]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
}

export default function DashboardPreview() {
  return (
    <section className="vc-section">
      <div className="vc-section-header">
        <motion.span className="vc-section-eyebrow" {...fadeUp}>
          Dashboard
        </motion.span>
        <motion.h2 className="vc-section-title" {...fadeUp}>
          Tu negocio al alcance de un clic
        </motion.h2>
        <motion.p className="vc-section-subtitle" {...fadeUp}>
          Un panel moderno e intuitivo con todo lo que necesitas para gestionar tu negocio
        </motion.p>
      </div>

      <motion.div
        className="vc-preview"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="vc-preview-wrapper">
          <div className="vc-preview-header">
            <span className="vc-preview-dot" />
            <span className="vc-preview-dot" />
            <span className="vc-preview-dot" />
          </div>
          <div className="vc-preview-body">
            <div className="vc-preview-sidebar">
              {SIDEBAR_ITEMS.map((item, i) => (
                <div key={i} className={`vc-preview-sidebar-item ${i === 0 ? 'vc-preview-sidebar-item--active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name={item.icon} filled size={15} /> {item.label}
                </div>
              ))}
            </div>
            <div className="vc-preview-main">
              <div className="vc-preview-card vc-preview-card--wide">
                <div className="vc-preview-card-label">Inventario total</div>
                <div className="vc-preview-card-value">1,284 productos</div>
                <div className="vc-preview-card-bar">
                  <div className="vc-preview-card-bar-fill" />
                </div>
              </div>
              <div className="vc-preview-card">
                <div className="vc-preview-card-label">Cotizaciones</div>
                <div className="vc-preview-card-value">34 activas</div>
              </div>
              <div className="vc-preview-card">
                <div className="vc-preview-card-label">Pedidos</div>
                <div className="vc-preview-card-value">128 este mes</div>
              </div>
              <div className="vc-preview-card">
                <div className="vc-preview-card-label">Ranking</div>
                <div className="vc-preview-card-value">#3 local</div>
              </div>
              <div className="vc-preview-card">
                <div className="vc-preview-card-label">Puntos</div>
                <div className="vc-preview-card-value">2,450</div>
              </div>
              <div className="vc-preview-card">
                <div className="vc-preview-card-label">Clientes</div>
                <div className="vc-preview-card-value">+250 nuevos</div>
              </div>
              <div className="vc-preview-card">
                <div className="vc-preview-card-label">Reseñas</div>
                <div className="vc-preview-card-value" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>4.8 <Icon name="star" filled size={14} /></div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
