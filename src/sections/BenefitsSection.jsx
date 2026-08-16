import { motion } from 'framer-motion'
import Icon from '../components/icons/Icon'

// Cada actor tiene su color oficial (consumidor=dorado, comercio=naranja,
// proveedor=turquesa): agrupar los beneficios así es más honesto que una
// grilla de 6 íconos anónimos, porque es literalmente cómo funciona Vincco.
const COLUMNS = [
  {
    variant: 'gold',
    actor: 'Consumidor',
    title: 'Tu dinero rinde en el barrio',
    items: [
      { icon: 'wallet', title: 'Fidelización por puntos', desc: 'Cada compra en un comercio afiliado suma puntos que se canjean por descuentos y recompensas.' },
      { icon: 'map-pin', title: 'Directorio verificado', desc: 'Encontrá comercios y proveedores confiables de Nueva Guinea, todos con reseñas reales.' },
    ],
  },
  {
    variant: 'orange',
    actor: 'Comercio',
    title: 'Vendé más, controlá mejor',
    items: [
      { icon: 'package', title: 'Inventario en tiempo real', desc: 'Alertas automáticas cuando el stock baja y reportes claros de lo que más se mueve.' },
      { icon: 'award', title: 'Ranking que premia la calidad', desc: 'Los comercios mejor calificados destacan en el directorio y atraen más clientes.' },
    ],
  },
  {
    variant: 'teal',
    actor: 'Proveedor',
    title: 'Pedidos sin salir a buscarlos',
    items: [
      { icon: 'file-text', title: 'Cotizaciones al instante', desc: 'Los comercios piden precios y vos respondés en minutos, no en días.' },
      { icon: 'truck', title: 'Pedidos de la zona', desc: 'Recibí solicitudes directas de comercios verificados cerca de tu bodega.' },
    ],
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
}

export default function BenefitsSection() {
  return (
    <section className="vc-section" id="beneficios">
      <div className="vc-section-header">
        <motion.span className="vc-section-eyebrow" {...fadeUp}>Un ecosistema, tres actores</motion.span>
        <motion.h2 className="vc-section-title" {...fadeUp}>
          Lo que Vincco resuelve para cada quien
        </motion.h2>
        <motion.p className="vc-section-subtitle" {...fadeUp}>
          Ningún actor de la economía local queda afuera del mismo padrón
        </motion.p>
      </div>

      <motion.div
        className="vc-benefits"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
      >
        {COLUMNS.map((col) => (
          <div key={col.actor} className={`vc-benefit-col vc-benefit-col--${col.variant}`}>
            <div className="vc-benefit-col-header">
              <span className="vc-benefit-col-dot" />
              <span className="vc-benefit-col-actor">{col.actor}</span>
            </div>
            <h3 className="vc-benefit-col-title">{col.title}</h3>

            {col.items.map((it) => (
              <div key={it.title} className="vc-benefit-item">
                <span className="vc-benefit-item-icon"><Icon name={it.icon} size={17} /></span>
                <div>
                  <h4 className="vc-benefit-item-title">{it.title}</h4>
                  <p className="vc-benefit-item-desc">{it.desc}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </section>
  )
}
