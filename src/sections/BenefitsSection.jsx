import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/icons/Icon'

const BENEFITS = [
  {
    icon: 'target',
    title: 'Fidelización inteligente',
    desc: 'Programa de puntos que conecta consumidores con negocios locales. Cada compra suma y cada punto acerca a tu próxima recompensa.',
    link: 'Saber más',
  },
  {
    icon: 'package',
    title: 'Inventario en tiempo real',
    desc: 'Controla tu stock desde cualquier lugar. Alertas automáticas cuando los niveles están bajos y reportes detallados de tus productos.',
    link: 'Saber más',
  },
  {
    icon: 'file-text',
    title: 'Cotizaciones al instante',
    desc: 'Conecta proveedores con negocios de forma rápida. Solicita y recibe cotizaciones en minutos, no en días.',
    link: 'Saber más',
  },
  {
    icon: 'bar-chart-2',
    title: 'Dashboard centralizado',
    desc: 'Todos tus datos en un solo lugar. Ventas, inventario, clientes y más con gráficos claros y fáciles de entender.',
    link: 'Saber más',
  },
  {
    icon: 'award',
    title: 'Ranking de negocios',
    desc: 'Competencia sana que impulsa la calidad. Los mejores negocios destacan y atraen más clientes.',
    link: 'Saber más',
  },
  {
    icon: 'handshake',
    title: 'Red de colaboración',
    desc: 'Negocios, proveedores y clientes trabajando juntos. Un ecosistema donde todos ganan y la economía local crece.',
    link: 'Saber más',
  },
]

const container = {
  animate: { transition: { staggerChildren: 0.08 } },
}

const item = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
}

export default function BenefitsSection() {
  return (
    <section className="vc-section">
      <div className="vc-section-header">
        <motion.span
          className="vc-section-eyebrow"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Beneficios
        </motion.span>
        <motion.h2
          className="vc-section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Todo lo que necesitas en un solo ecosistema
        </motion.h2>
        <motion.p
          className="vc-section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Vincco reúne todas las herramientas que tu negocio necesita para crecer
        </motion.p>
      </div>

      <motion.div
        className="vc-benefits-grid"
        variants={container}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-100px' }}
      >
        {BENEFITS.map((b, i) => (
          <motion.div key={i} className="vc-benefit-card" variants={item}>
            <div className="vc-benefit-icon"><Icon name={b.icon} size={26} /></div>
            <h3 className="vc-benefit-title">{b.title}</h3>
            <p className="vc-benefit-desc">{b.desc}</p>
            <a href="#!" className="vc-benefit-link">
              {b.link}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
