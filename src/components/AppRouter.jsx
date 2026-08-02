import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import Home from '../pages/Home'

// Home se importa directo porque es la pantalla de entrada.
// El resto se carga solo cuando el usuario entra a esa ruta, asi el
// bundle inicial no arrastra Register (1200+ lineas), los paneles ni Ayuda.
const Landing = lazy(() => import('../pages/Landing'))
const Register = lazy(() => import('../pages/Register'))
const Directorio = lazy(() => import('../pages/Directorio'))
const MisPuntos = lazy(() => import('../pages/Mispuntos'))
const Dashboard = lazy(() => import('../pages/Dashboard'))
const PanelSocio = lazy(() => import('../pages/PanelSocio'))
const PanelNegocio = lazy(() => import('../pages/PanelNegocio'))
const Notificaciones = lazy(() => import('../pages/Notificaciones'))
const Calendario = lazy(() => import('../pages/Calendario'))
const Favoritos = lazy(() => import('../pages/Favoritos'))
const NegociosAsociados = lazy(() => import('../pages/NegociosAsociados'))
const Ayuda = lazy(() => import('../pages/Ayuda'))
const Redes = lazy(() => import('../pages/Redes'))

// Fondo navy mientras carga el trozo de codigo de la pagina.
// Es el mismo color de las pantallas, asi no se ve un flash blanco.
function Cargando() {
  return <div className="route-fallback" />
}

// Envuelve las paginas que llevan barra inferior.
// La clase .page-shell reserva el alto del nav + la safe-area del celular.
function Shell({ children }) {
  return <div className="page-shell">{children}</div>
}

// Rutas que se muestran dentro del shell con barra inferior
const SHELL_ROUTES = [
  { path: '/', element: <Home /> },
  { path: '/inicio', element: <Home /> },
  { path: '/home', element: <Home /> },
  { path: '/directorio', element: <Directorio /> },
  { path: '/puntos', element: <MisPuntos /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/favoritos', element: <Favoritos /> },
  { path: '/recompensas', element: <PanelSocio /> },
  { path: '/publicaciones', element: <PanelSocio /> },
  { path: '/panel-negocio', element: <PanelNegocio /> },
  { path: '/calendario', element: <Calendario /> },
  { path: '/notificaciones', element: <Notificaciones /> },
  { path: '/negocios-asociados', element: <NegociosAsociados /> },
  // Centro de ayuda: sirve para usuarios, comercios y proveedores
  { path: '/ayuda', element: <Ayuda /> },
  // Redes sociales: los negocios conectan las suyas, todos ven las de Vincco
  { path: '/redes', element: <Redes /> },
]

function AppContent() {
  const location = useLocation()
  const hideNav = location.pathname === '/login' || location.pathname === '/register'

  return (
    <>
      <Suspense fallback={<Cargando />}>
        <Routes>
          {SHELL_ROUTES.map(({ path, element }) => (
            <Route key={path} path={path} element={<Shell>{element}</Shell>} />
          ))}
          <Route path="/login" element={<Landing />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Suspense>
      {!hideNav && <BottomNav />}
    </>
  )
}

export default function AppRouter() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  )
}
