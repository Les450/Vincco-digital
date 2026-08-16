import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store/puntos_usestore'
import Icon from './icons/Icon'

// El menu cambia segun quien entra:
// - usuario (consumidor): no tiene negocio propio ni compra a proveedores,
//   asi que no se le muestran "Mi Negocio" ni "Proveedores Guardados".
// - negocio: ve su negocio y los proveedores que guardo.
// - proveedor: ve los negocios que abastece, sin "Proveedores Guardados".
function getMenuItems(userType) {
  const esProveedor = userType === 'proveedor'
  const esCliente = userType === 'usuario' || userType === 'cliente'

  const items = [
    { label: 'Perfil', icon: 'user', path: '/perfil' },
    { label: 'Inicio', icon: 'home', path: '/inicio' },
  ]

  if (!esCliente) {
if (!esCliente && !esProveedor) {
    // Los proveedores del negocio viven en el panel, con la misma
    // interfaz (filtros por categoría y ubicación): el menú abre
    // directo esa seccion.
    items.push({ label: 'Proveedores', icon: 'truck', path: '/panel-negocio?tab=proveedores' })
  }

  items.push(
      esProveedor
        ? { label: 'Negocios Asociados', icon: 'store', path: '/negocios-asociados' }
        // Antes apuntaba a /mi-negocio, que no existe en AppRouter:
        // el menú llevaba a una pantalla en blanco.
        : { label: 'Mi Negocio', icon: 'store', path: '/panel-negocio' }
    )
  }

  items.push(
    // La guía es el manual de la plataforma y, además, la única
    // fuente de la que Kiara saca sus respuestas.
    { label: 'Guía de Usuario', icon: 'book-open', path: '/guia' },
    { label: 'Ayuda y Soporte', icon: 'help-circle', path: '/ayuda' },
    { label: 'Configuraciones', icon: 'settings', path: '/config' },
    { label: 'Redes Sociales', icon: 'globe', path: '/redes' },
  )

  return items
}

// Home vive en tres rutas a la vez (/, /inicio, /home): el item
// "Inicio" tiene que marcarse activo en las tres, no solo en /inicio.
const ALIAS_INICIO = ['/', '/inicio', '/home']

function esRutaActiva(path, pathname) {
  return path === '/inicio' ? ALIAS_INICIO.includes(pathname) : pathname === path
}

const ROLE_LABELS = {
  usuario: 'Cliente',
  cliente: 'Cliente',
  negocio: 'Negocio',
  proveedor: 'Proveedor',
}

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isLoggedIn = useStore((s) => s.isLoggedIn)
  const setLoggedIn = useStore((s) => s.setLoggedIn)
  const userType = useStore((s) => s.userType)
  const menuItems = getMenuItems(userType)
  const rolLabel = ROLE_LABELS[userType] || 'Cliente'

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
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="side-overlay"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          <motion.div
            className="side-panel"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
          >
            <div className="side-header">
              <img
                src={`${process.env.PUBLIC_URL}/assets/logos/vincco-logo.png`}
                alt="Vincco"
                className="side-logo-img"
              />
              <div className="side-header-text">
                <span className="side-logo-text">Vincco</span>
                <span className="side-role-chip">{rolLabel}</span>
              </div>
            </div>

            <nav className="side-nav">
              {menuItems.map((item) => {
                const activo = esRutaActiva(item.path, location.pathname)
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    className={`side-nav-item${activo ? ' side-nav-item--active' : ''}`}
                  >
                    <Icon name={item.icon} size={19} className="side-nav-icon" />
                    <span className="side-nav-label">{item.label}</span>
                    {activo && <span className="side-nav-dot" />}
                  </button>
                )
              })}
            </nav>

            <div className="side-footer">
              {isLoggedIn ? (
                <button onClick={handleLogout} className="side-btn side-btn--danger">
                  Cerrar Sesión
                </button>
              ) : (
                <>
                  <button onClick={handleLogin} className="side-btn side-btn--primary">
                    Iniciar Sesión
                  </button>
                  <button onClick={handleRegister} className="side-btn side-btn--outline">
                    Registrarme
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
