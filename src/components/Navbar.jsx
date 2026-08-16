import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// Esta navbar solo vive en /bienvenida (la landing publica), asi que
// sus links son o anclas a las secciones de esa misma pagina, o rutas
// reales de la app. Antes apuntaban a /home y /puntos sin relacion con
// lo que mostraba la pagina.
const NAV_LINKS = [
  { label: 'Beneficios', anchor: 'beneficios' },
  { label: 'Cómo funciona', anchor: 'como-funciona' },
  { label: 'Testimonios', anchor: 'testimonios' },
  { label: 'Directorio', href: '/directorio' },
]

function NavLink({ link, className, onNavigate }) {
  if (link.anchor) {
    return (
      <a
        href={`#${link.anchor}`}
        className={className}
        onClick={(e) => {
          e.preventDefault()
          onNavigate?.()
          document.getElementById(link.anchor)?.scrollIntoView({ behavior: 'smooth' })
        }}
      >
        {link.label}
      </a>
    )
  }
  return (
    <Link to={link.href} className={className} onClick={onNavigate}>
      {link.label}
    </Link>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      <nav className="vc-navbar">
        <Link to="/bienvenida" className="vc-navbar-logo">
          <img
            src={`${process.env.PUBLIC_URL}/assets/logos/vincco-logo.png`}
            alt="Vincco"
            className="vc-navbar-logo-img"
          />
          <span className="vc-navbar-logo-text">Vincco</span>
        </Link>

        <div className="vc-navbar-links">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.label} link={link} className="vc-navbar-link" />
          ))}
        </div>

        <div className="vc-navbar-actions">
          <button className="vc-navbar-btn vc-navbar-btn--ghost" onClick={() => navigate('/login')}>
            Iniciá sesión
          </button>
          <button className="vc-navbar-btn vc-navbar-btn--primary" onClick={() => navigate('/register')}>
            Registrá tu negocio
          </button>
        </div>

        <button
          className="vc-navbar-mobile-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={mobileOpen}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </nav>

      <div className={`vc-navbar-mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.label}
            link={link}
            className="vc-navbar-mobile-link"
            onNavigate={() => setMobileOpen(false)}
          />
        ))}
        <div className="vc-navbar-mobile-actions">
          <button className="vc-navbar-btn vc-navbar-btn--ghost" onClick={() => { setMobileOpen(false); navigate('/login') }}>
            Iniciá sesión
          </button>
          <button className="vc-navbar-btn vc-navbar-btn--primary" onClick={() => { setMobileOpen(false); navigate('/register') }}>
            Registrá tu negocio
          </button>
        </div>
      </div>
    </>
  )
}
