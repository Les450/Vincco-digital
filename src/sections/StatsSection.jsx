import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

const STATS = [
  { value: 150, prefix: '+', suffix: '', label: 'Negocios activos' },
  { value: 3500, prefix: '+', suffix: '', label: 'Usuarios registrados' },
  { value: 20000, prefix: '+', suffix: '', label: 'Puntos entregados' },
  { value: 95, prefix: '', suffix: '%', label: 'Clientes satisfechos' },
]

function CountUp({ value, prefix, suffix }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 2000
          const steps = 60
          const increment = value / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= value) {
              setCount(value)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  return (
    <span ref={ref} className="vc-stat-number">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export default function StatsSection() {
  return (
    <section className="vc-section vc-section--alt">
      <div className="vc-section-header">
        <motion.span
          className="vc-section-eyebrow"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Estadísticas
        </motion.span>
        <motion.h2
          className="vc-section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Vincco en números
        </motion.h2>
        <motion.p
          className="vc-section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          La comunidad Vincco crece cada día
        </motion.p>
      </div>

      <div className="vc-stats">
        <div className="vc-stats-grid">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              className="vc-stat-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              <p className="vc-stat-label">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
