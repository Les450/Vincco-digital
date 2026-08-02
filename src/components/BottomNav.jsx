import { useNavigate, useLocation } from 'react-router-dom'
import useStore from '../store/puntos_usestore'

function useTabs() {
  // Selector: solo re-renderiza cuando cambia userType, no ante
  // cualquier cambio del store (notificaciones, puntos, etc.)
  const userType = useStore((s) => s.userType)
  const esSocio = userType === 'negocio' || userType === 'proveedor'

  const tabs = [
    {
      label: 'Inicio',
      path: '/home',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      label: 'Favoritos',
      path: '/favoritos',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      label: userType === 'negocio' ? 'Panel' : esSocio ? 'Panel' : 'Premios',
      path: userType === 'negocio' ? '/panel-negocio' : esSocio ? '/recompensas' : '/puntos',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      id: 'publicaciones',
      label: 'Publicar',
      path: '/publicaciones',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
    },
    {
      label: 'Calendario',
      path: '/calendario',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      id: 'notificaciones',
      label: 'Avisos',
      path: '/notificaciones',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
    },
  ]

  // Se filtra por id, no por label: los textos son cortos para que entren
  // en pantallas de 360px y pueden cambiar sin romper esta logica.
  return userType === 'usuario' ? tabs.filter(t => t.id !== 'publicaciones') : tabs
}

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const TABS = useTabs()

  return (
    <nav className="bottom-nav">
      {TABS.map((tab) => {
        const isActive = location.pathname === tab.path
        return (
          <button
            key={tab.path}
            className={`bottom-nav-btn ${isActive ? 'bottom-nav-btn--active' : ''}`}
            onClick={() => navigate(tab.path)}
            type="button"
          >
            <span className="bottom-nav-icon">{tab.icon}</span>
            <span className="bottom-nav-label">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
