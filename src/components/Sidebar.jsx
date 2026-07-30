import { useNavigate } from 'react-router-dom'
import useStore from '../store/puntos_usestore'
import Icon from './icons/Icon'

function getMenuItems(userType) {
  const esProveedor = userType === 'proveedor'

  const items = [
    { label: 'Perfil', icon: 'user', path: '/perfil' },
    { label: 'Inicio', icon: 'home', path: '/inicio' },
    { label: esProveedor ? 'Negocios Asociados' : 'Mi Negocio', icon: 'store', path: esProveedor ? '/negocios-asociados' : '/mi-negocio' },
    { label: 'Proveedores Guardados', icon: 'star', path: '/proveedores' },
    { label: 'Ayuda y Soporte', icon: 'help-circle', path: '/ayuda' },
    { label: 'Configuraciones', icon: 'settings', path: '/config' },
    { label: 'Redes Sociales', icon: 'globe', path: '/redes' },
  ]

  return esProveedor ? items.filter((item) => item.path !== '/proveedores') : items
}

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate()
  const { isLoggedIn, setLoggedIn, userType } = useStore()
  const menuItems = getMenuItems(userType)

  const handleNav = (path) => {
    onClose()
    navigate(path)
  }

  const handleLogout = () => {
    setLoggedIn(false)
    onClose()
    navigate('/login')
  }

  const handleLogin = () => {
    onClose()
    navigate('/login')
  }

  const handleRegister = () => {
    onClose()
    navigate('/register')
  }

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1100,
          }}
        />
      )}

      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: 290,
        backgroundColor: '#ffffff',
        zIndex: 1200,
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 30px rgba(0,0,0,0.12)',
      }}>
        <div style={{
          padding: '24px 20px 16px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <svg width="40" height="40" viewBox="0 0 72 72" fill="none">
            <circle cx="36" cy="36" r="36" fill="#003f5a" />
            <text x="36" y="44" textAnchor="middle" fill="#ffffff" fontSize="30" fontWeight="800" fontFamily="Sora, Inter, sans-serif">V</text>
          </svg>
          <span style={{ fontWeight: 800, fontSize: 20, color: '#0b1b26', fontFamily: "'Sora', 'Inter', sans-serif" }}>Vincco</span>
        </div>

        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                width: '100%',
                padding: '14px 24px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: 15,
                color: '#374151',
                textAlign: 'left',
                fontFamily: 'inherit',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              <Icon name={item.icon} size={20} style={{ color: '#64798a' }} />
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{
          borderTop: '1px solid #f0f0f0',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '14px',
                border: 'none',
                borderRadius: 12,
                background: '#fee2e2',
                color: '#b3261e',
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
            >
              Cerrar Sesión
            </button>
          ) : (
            <>
              <button
                onClick={handleLogin}
                style={{
                  width: '100%',
                  padding: '14px',
                  border: 'none',
                  borderRadius: 12,
                  background: '#c05900',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#a34b00'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#c05900'}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={handleRegister}
                style={{
                  width: '100%',
                  padding: '14px',
                  border: '2px solid #007a7b',
                  borderRadius: 12,
                  background: '#ffffff',
                  color: '#005c5e',
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Registrarme
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
