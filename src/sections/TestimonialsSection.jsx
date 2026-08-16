import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import Icon from '../components/icons/Icon'

const TESTIMONIALS = [
  {
    name: 'María González',
    role: 'Comercio · Cafetería El Aroma',
    variant: 'orange',
    text: 'Desde que usamos Vincco, nuestros clientes vuelven semana tras semana. El programa de puntos transformó la fidelidad de nuestros clientes.',
  },
  {
    name: 'Carlos Mendoza',
    role: 'Proveedor de insumos',
    variant: 'teal',
    text: 'Recibir cotizaciones de los negocios es increíblemente fácil. En minutos tengo pedidos nuevos sin tener que salir a buscarlos.',
  },
  {
    name: 'Ana Martínez',
    role: 'Consumidora frecuente',
    variant: 'gold',
    text: 'Amo acumular puntos en mis compras del día a día. Ya canjeé varios descuentos y siento que mi dinero rinde más.',
  },
  {
    name: 'Roberto Sánchez',
    role: 'Comercio · Ferretería Sánchez',
    variant: 'orange',
    text: 'El panel me da una visibilidad completa de mi inventario. Ahora sé exactamente qué comprar y cuándo.',
  },
  {
    name: 'Lucía Pérez',
    role: 'Comercio · Boutique Luna',
    variant: 'orange',
    text: 'El ranking de negocios nos motivó a mejorar nuestro servicio. Ahora somos el negocio mejor valorado de nuestra zona.',
  },
]

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length)
    }, 5000)
    return () => clearInterval(intervalRef.current)
  }, [])

  const visible = []
  for (let i = 0; i < 3; i++) {
    visible.push(TESTIMONIALS[(current + i) % TESTIMONIALS.length])
  }

  return (
    <section className="vc-section" id="testimonios">
      <div className="vc-section-header">
        <motion.span
          className="vc-section-eyebrow"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Constancias
        </motion.span>
        <motion.h2
          className="vc-section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Lo que dice la gente de la red
        </motion.h2>
        <motion.p
          className="vc-section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Testimonios verificados de los tres actores del padrón
        </motion.p>
      </div>

      <div className="vc-testimonials">
        <div className="vc-testimonials-track">
          {visible.map((t, i) => (
            <motion.div
              key={`${t.name}-${i}`}
              className="vc-testimonial-card"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <p className="vc-testimonial-mark">&ldquo;</p>
              <p className="vc-testimonial-text">{t.text}</p>
              <div className="vc-testimonial-author">
                <span className="vc-testimonial-seal">
                  <Icon name="shield" filled size={17} />
                </span>
                <div>
                  <p className="vc-testimonial-name">{t.name}</p>
                  <p className={`vc-testimonial-role vc-testimonial-role--${t.variant}`}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Ver constancia ${i + 1}`}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                border: 'none',
                background: i === current ? 'var(--vc-orange-700)' : 'var(--vc-bone-line)',
                cursor: 'pointer',
                transition: 'background 0.3s',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
