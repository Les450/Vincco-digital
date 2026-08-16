import { lazy, Suspense, useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import VerificacionKYC from './verificacion/VerificacionKYC'
import useStore from '../store/puntos_usestore'
import Home from '../pages/Home'

// Home se importa directo porque es la pantalla de entrada.
// El resto se carga solo cuando el usuario entra a esa ruta, asi el
// bundle inicial no arrastra Register (1200+ lineas), los paneles ni Ayuda.
const Landing = lazy(() => import('../pages/Landing'))
const Bienvenida = lazy(() => import('../pages/Bienvenida'))
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
const Perfil = lazy(() => import('../pages/Perfil'))
const Config = lazy(() => import('../pages/Config'))
const Guia = lazy(() => import('../Chatbot/pagina-guia/Guia'))

// Kiara se carga aparte del resto: quien la tenga apagada en
// Configuración nunca descarga este trozo de código.
const PanelChat = lazy(() => import('../Chatbot/ui/PanelChat'))
const KiaraFlotante = lazy(() => import('../Chatbot/ui/KiaraFlotante'))

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
  // Perfil: una sola ruta que muestra la pantalla del rol activo
  { path: '/perfil', element: <Perfil /> },
  // Configuraciones: igual que el perfil, una ruta y tres pantallas.
  // Es la que abre "Configuraciones" del menú hamburguesa.
  { path: '/config', element: <Config /> },
  // Guía de usuario: el manual de la plataforma. Es también la
  // única fuente de la que Kiara saca sus respuestas.
  { path: '/guia', element: <Guia /> },
]

function AppContent() {
  const location = useLocation()
  const hideNav = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/bienvenida'

  const chatAbierto = useStore((s) => s.chat.abierto)
  const mostrarAsistente = useStore((s) => s.configuraciones[s.userType]?.mostrarAsistente !== false)

  /* En pantalla ancha el panel de Kiara no tapa el contenido: la
     app se corre para dejarle lugar. Ese corrimiento se hace con
     una clase en el <body> para que lo apliquen todas las pantallas
     a la vez, sin que ninguna tenga que saber de Kiara. */
  useEffect(() => {
    document.body.classList.toggle(
      'vincco--asistente-abierto',
      chatAbierto && mostrarAsistente
    )
  }, [chatAbierto, mostrarAsistente])

  return (
    <>
      <Suspense fallback={<Cargando />}>
        <Routes>
          {SHELL_ROUTES.map(({ path, element }) => (
            <Route key={path} path={path} element={<Shell>{element}</Shell>} />
          ))}
          <Route path="/login" element={<Landing />} />
          <Route path="/bienvenida" element={<Bienvenida />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Suspense>

      {/* Verificación KYC (Ley 977): pantalla completa que aparece
          desde el registro, el perfil y las acciones bloqueadas,
          sin que ninguna de esas pantallas tenga que saber de ella. */}
      <VerificacionKYC />

      {!hideNav && <BottomNav />}

      {/* Kiara se monta por encima del router: aparece en todas las
          pantallas sin que ninguna la importe. En login y registro
          no va, porque ahí todavía no se sabe qué rol es. */}
      {!hideNav && mostrarAsistente && (
        <Suspense fallback={null}>
          <PanelChat />
          <KiaraFlotante />
        </Suspense>
      )}
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
