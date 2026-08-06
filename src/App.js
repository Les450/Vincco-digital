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

  useEffect(() => {
    const clases = document.body.classList
    clases.toggle('vincco--texto-grande', Boolean(config?.textoGrande))
    clases.toggle('vincco--alto-contraste', Boolean(config?.altoContraste))
  }, [config?.textoGrande, config?.altoContraste])

  useEffect(() => {
    document.documentElement.lang = config?.idioma === 'en' ? 'en' : 'es-NI'
  }, [config?.idioma])

  return <AppRouter />
}

export default App
