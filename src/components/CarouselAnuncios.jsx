import { useState, useEffect, useCallback } from 'react'

const C = {
  primary: '#2F80ED',
  bg: '#eef2f7',
  card: '#ffffff',
  textDark: '#0f172a',
  textBody: '#374151',
  textMuted: '#64748b',
  border: '#e5e7eb',
}

const cardStyle = {
  backgroundColor: C.card,
  borderRadius: 28,
  padding: 28,
  boxShadow: '0 10px 30px rgba(15,23,42,0.06)',
  marginBottom: 24,
  overflow: 'hidden',
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
              backgroundColor: i === current ? C.primary : C.border,
              padding: 0,
              transition: 'background-color 0.3s',
            }}
            aria-label={`Ir al slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
