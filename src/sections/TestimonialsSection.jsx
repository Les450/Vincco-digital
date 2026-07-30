import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import Icon from '../components/icons/Icon'

const TESTIMONIALS = [
  {
    name: 'María González',
    role: 'Dueña de Cafetería El Aroma',
    avatar: 'MG',
    text: 'Desde que usamos Vincco, nuestros clientes vuelven semana tras semana. El programa de puntos transformó la fidelidad de nuestros clientes.',
    stars: 5,
  },
  {
    name: 'Carlos Mendoza',
    role: 'Proveedor de insumos',
    avatar: 'CM',
    text: 'Recibir cotizaciones de los negocios es increíblemente fácil. En minutos tengo pedidos nuevos sin tener que salir a buscarlos.',
    stars: 5,
  },
  {
    name: 'Ana Martínez',
    role: 'Consumidora frecuente',
    avatar: 'AM',
    text: 'Amo acumular puntos en mis compras del día a día. Ya canjeé varios descuentos y siento que mi dinero rinde más.',
    stars: 5,
  },
  {
    name: 'Roberto Sánchez',
    role: 'Gerente de Ferretería Sánchez',
    avatar: 'RS',
    text: 'El dashboard me da una visibilidad completa de mi inventario. Ahora sé exactamente qué comprar y cuándo.',
    stars: 4,
  },
  {
    name: 'Lucía Pérez',
    role: 'Dueña de Boutique Luna',
    avatar: 'LP',
    text: 'El ranking de negocios nos motivó a mejorar nuestro servicio. Ahora somos el negocio mejor valorado de nuestra zona.',
    stars: 5,
  },
]

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length)
    }, 4000)
    return () => clearInterval(intervalRef.current)
  }, [])

  const visible = []
  for (let i = 0; i < 3; i++) {
    visible.push(TESTIMONIALS[(current + i) % TESTIMONIALS.length])
  }

  return (
    <section className="vc-section">
      <div className="vc-section-header">
        <motion.span
          className="vc-section-eyebrow"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Testimonios
        </motion.span>
        <motion.h2
          className="vc-section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Lo que dicen nuestros usuarios
        </motion.h2>
        <motion.p
          className="vc-section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Historias reales de la comunidad Vincco
        </motion.p>
      </div>

      <div className="vc-testimonials">
        <div className="vc-testimonials-track" style={{ transform: `translateX(0)` }}>
          {visible.map((t, i) => (
            <motion.div
              key={`${t.name}-${i}`}
              className="vc-testimonial-card"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="vc-testimonial-stars">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Icon key={j} name="star" filled size={15} style={{ color: '#fea02f' }} />
                ))}
              </div>
              <p className="vc-testimonial-text">{t.text}</p>
              <div className="vc-testimonial-author">
                <div className="vc-testimonial-avatar">{t.avatar}</div>
                <div>
                  <p className="vc-testimonial-name">{t.name}</p>
                  <p className="vc-testimonial-role">{t.role}</p>
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
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                border: 'none',
                background: i === current ? '#2F80ED' : '#e5e7eb',
                cursor: 'pointer',
                transition: 'all 0.3s',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
