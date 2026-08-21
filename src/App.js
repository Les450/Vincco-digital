import { useEffect } from 'react'
import AppRouter from './components/AppRouter'
import useStore from './store/puntos_usestore'
import './App.css'

// Las preferencias de accesibilidad que el usuario elige en /config
// se aplican poniendo clases en el <body>. Así el CSS las aplica a
// toda la app de una vez, sin que cada pantalla tenga que leer la
// configuración por su cuenta.
//
// El idioma se refleja en el atributo lang del documento: es lo que
// usan el lector de pantalla y el corrector del navegador para saber
// en qué idioma está la página.
function App() {
  const config = useStore((s) => s.configuraciones[s.userType])
  const tema = config?.tema || 'claro'

  useEffect(() => {
    const clases = document.body.classList
    clases.toggle('vincco--alto-contraste', Boolean(config?.altoContraste))
    clases.toggle('vincco--texto-grande', config?.tamanoTexto === 'grande')
    clases.toggle('vincco--texto-muy-grande', config?.tamanoTexto === 'muyGrande')
    clases.toggle('vincco--sin-animaciones', Boolean(config?.reducirAnimaciones))
  }, [config?.altoContraste, config?.tamanoTexto, config?.reducirAnimaciones])

  // El tema oscuro usa la clase .dark que el proyecto ya maneja
  // (tailwind darkMode:class, las variables de index.css y el tema
  // del calendario). En automático sigue al dispositivo y reacciona
  // solo si el usuario cambia el modo del teléfono sin recargar.
  useEffect(() => {
    const medio = window.matchMedia('(prefers-color-scheme: dark)')
    const aplicar = () => {
      document.body.classList.toggle(
        'dark',
        tema === 'oscuro' || (tema === 'auto' && medio.matches)
      )
    }
    aplicar()
    medio.addEventListener('change', aplicar)
    return () => medio.removeEventListener('change', aplicar)
  }, [tema])

  useEffect(() => {
    document.documentElement.lang = config?.idioma === 'en' ? 'en' : 'es-NI'
  }, [config?.idioma])

  return <AppRouter />
}

export default App
