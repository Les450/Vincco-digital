import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

const cardStyle = {
  position: 'relative',
  borderRadius: 28,
  boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
  marginBottom: 24,
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #001824 0%, #00121b 100%)',
}

const contentStyle = {
  position: 'relative',
  zIndex: 1,
  padding: 28,
}

const BLOBS = [
  { size: 620, top: '-20%', left: '-14%', color: 'rgba(255,255,255,0.22)', duration: 13, delay: 0 },
  { size: 560, top: '10%', left: '52%', color: 'rgba(255,194,107,0.28)', duration: 15, delay: 2 },
  { size: 540, top: '50%', left: '6%', color: 'rgba(94,234,212,0.24)', duration: 14, delay: 4 },
]

function CarouselSpotlights() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {BLOBS.map((blob, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: blob.top,
            left: blob.left,
            width: blob.size,
            height: blob.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            filter: 'blur(30px)',
          }}
          animate={{
            x: [0, 70, -70, 0],
            y: [0, -60, 50, 0],
          }}
          transition={{
            duration: blob.duration,
            delay: blob.delay,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'mirror',
          }}
        />
      ))}
    </div>
  )
}

const slideContainerStyle = {
  display: 'flex',
  transition: 'transform 0.5s ease-in-out',
}

const slideStyle = {
  minWidth: '100%',
  boxSizing: 'border-box',
}

const dotsContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: 8,
  marginTop: 16,
}

export default function CarouselAnuncios({ slides }) {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  useEffect(() => {
    const id = setInterval(next, 4000)
    return () => clearInterval(id)
  }, [next])

  return (
    <section style={cardStyle}>
      <CarouselSpotlights />
      <div style={contentStyle}>
        <div style={{ position: 'relative' }}>
          <div style={{
            ...slideContainerStyle,
            transform: `translateX(-${current * 100}%)`,
          }}>
            {slides.map((slide, i) => (
              <div key={i} style={slideStyle}>
                {slide}
              </div>
            ))}
          </div>
        </div>
        <div style={dotsContainerStyle}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: i === current ? '#ffc26b' : 'rgba(255,255,255,0.25)',
                padding: 0,
                transition: 'background-color 0.3s',
              }}
              aria-label={`Ir al slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
