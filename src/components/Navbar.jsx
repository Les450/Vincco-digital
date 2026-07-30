import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Inicio', href: '/home' },
  { label: 'Negocios', href: '/directorio' },
  { label: 'Proveedores', href: '/directorio' },
  { label: 'Ranking', href: '/puntos' },
  { label: 'Beneficios', href: '/home' },
  { label: 'Nosotros', href: '/home' },
  { label: 'Contacto', href: '/home' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      <nav className="vc-navbar">
        <Link to="/home" className="vc-navbar-logo">
          <img
            src={`${process.env.PUBLIC_URL}/assets/logos/vincco-logo.png`}
            alt="Vincco"
            className="vc-navbar-logo-img"
          />
          <span className="vc-navbar-logo-text">Vincco</span>
        </Link>

        <div className="vc-navbar-links">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} to={link.href} className="vc-navbar-link">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="vc-navbar-actions">
          <button className="vc-navbar-btn vc-navbar-btn--ghost" onClick={() => navigate('/login')}>
            Iniciar sesión
          </button>
          <button className="vc-navbar-btn vc-navbar-btn--primary" onClick={() => navigate('/register')}>
            Empieza gratis
          </button>
        </div>

        <button className="vc-navbar-mobile-btn" onClick={() => setMobileOpen(!mobileOpen)}>
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
          <Link
            key={link.label}
            to={link.href}
            className="vc-navbar-mobile-link"
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <div className="vc-navbar-mobile-actions">
          <button className="vc-navbar-btn vc-navbar-btn--ghost" onClick={() => { setMobileOpen(false); navigate('/login') }}>
            Iniciar sesión
          </button>
          <button className="vc-navbar-btn vc-navbar-btn--primary" onClick={() => { setMobileOpen(false); navigate('/register') }}>
            Empieza gratis
          </button>
        </div>
      </div>
    </>
  )
}
