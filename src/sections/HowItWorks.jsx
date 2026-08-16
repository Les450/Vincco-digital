import { motion } from 'framer-motion'
import Icon from '../components/icons/Icon'

const STEPS = [
  {
    icon: 'shopping-cart',
    title: 'El cliente compra en un comercio afiliado',
    desc: 'Descubre negocios locales en el directorio y paga como siempre — la diferencia es que ahora la compra queda registrada en su padrón.',
  },
  {
    icon: 'wallet',
    title: 'Gana puntos al instante',
    desc: 'Por cada compra se acumulan puntos que puede canjear por recompensas dentro de la red Vincco.',
  },
  {
    icon: 'trending-up',
    title: 'El comercio vende más y controla su inventario',
    desc: 'La fidelización trae clientes que vuelven, y el panel muestra en tiempo real qué hay que reponer.',
  },
  {
    icon: 'truck',
    title: 'El proveedor recibe el pedido',
    desc: 'Cuando el stock baja, el comercio pide cotización directo a proveedores verificados de la zona.',
  },
  {
    icon: 'globe',
    title: 'La economía de Nueva Guinea circula',
    desc: 'Cada compra, cada punto y cada pedido quedan dentro de la misma red local — el dinero no se va del municipio.',
  },
]

export default function HowItWorks() {
  return (
    <section className="vc-section vc-section--alt" id="como-funciona">
      <div className="vc-section-header">
        <span className="vc-section-eyebrow">El padrón, paso a paso</span>
        <h2 className="vc-section-title">Así circula una compra dentro de Vincco</h2>
        <p className="vc-section-subtitle">
          Un ciclo real, no una promesa: cada paso queda registrado para los tres actores
        </p>
      </div>

      <div className="vc-ledger">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.title}
            className="vc-ledger-item"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: (i % 5) * 0.05 }}
          >
            <span className="vc-ledger-num vc-tabular">{String(i + 1).padStart(2, '0')}</span>
            <div className="vc-ledger-body">
              <span className="vc-ledger-icon"><Icon name={step.icon} size={19} /></span>
              <div>
                <h3 className="vc-ledger-title">{step.title}</h3>
                <p className="vc-ledger-desc">{step.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
