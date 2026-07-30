import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Icon from '../components/icons/Icon'

const STEPS = [
  {
    icon: 'shopping-cart',
    title: 'El cliente compra',
    desc: 'Los consumidores descubren negocios locales y realizan sus compras como siempre, pero ahora cada compra suma.',
  },
  {
    icon: 'star',
    title: 'Gana puntos',
    desc: 'Por cada compra, los clientes acumulan puntos que pueden canjear por recompensas exclusivas en la red Vincco.',
  },
  {
    icon: 'trending-up',
    title: 'El negocio vende más',
    desc: 'Con el programa de fidelización, los clientes vuelven una y otra vez. Las ventas se incrementan hasta un 30%.',
  },
  {
    icon: 'truck',
    title: 'Proveedores reciben más pedidos',
    desc: 'Los negocios usan Vincco para gestionar inventario y realizar pedidos a proveedores verificados de la zona.',
  },
  {
    icon: 'globe',
    title: 'La economía local crece',
    desc: 'Cuando todos colaboran, la comunidad prospera. Más empleos, más circulación de dinero y un ecosistema sostenible.',
  },
]

const stepVariants = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
}

const stepVariantsRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
}

export default function HowItWorks() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  })

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section className="vc-section vc-section--alt" ref={ref}>
      <div className="vc-section-header">
        <motion.span
          className="vc-section-eyebrow"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Cómo funciona
        </motion.span>
        <motion.h2
          className="vc-section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Así impulsamos la economía local
        </motion.h2>
        <motion.p
          className="vc-section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Un ciclo virtuoso donde todos los actores de la comunidad se benefician
        </motion.p>
      </div>

      <div className="vc-timeline">
        <div className="vc-timeline-line" />
        <motion.div className="vc-timeline-line-progress" style={{ height: lineHeight }} />

        {STEPS.map((step, i) => {
          const isLeft = i % 2 === 0
          const v = isLeft ? stepVariants : stepVariantsRight

          return (
            <div key={i} className="vc-timeline-step">
              {isLeft ? (
                <motion.div
                  className="vc-timeline-content"
                  variants={v}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, margin: '-80px' }}
                >
                  <div className="vc-timeline-step-icon"><Icon name={step.icon} size={24} filled /></div>
                  <h3 className="vc-timeline-step-title">{step.title}</h3>
                  <p className="vc-timeline-step-desc">{step.desc}</p>
                </motion.div>
              ) : (
                <div />
              )}

              <motion.div
                className="vc-timeline-step-num"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                {i + 1}
              </motion.div>

              {!isLeft ? (
                <motion.div
                  className="vc-timeline-content"
                  variants={v}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, margin: '-80px' }}
                >
                  <div className="vc-timeline-step-icon"><Icon name={step.icon} size={24} filled /></div>
                  <h3 className="vc-timeline-step-title">{step.title}</h3>
                  <p className="vc-timeline-step-desc">{step.desc}</p>
                </motion.div>
              ) : (
                <div />
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
