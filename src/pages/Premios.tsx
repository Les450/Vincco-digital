import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import useStore from '../store/puntos_usestore'
import MisPremios from './premios/MisPremios'
import SubirNivel from './premios/SubirNivel'
import CanjeaPuntos from './premios/CanjeaPuntos'
import DondeGanas from './premios/DondeGanas'
import ActividadReciente from './premios/ActividadReciente'

const VINCCO_LOGO = `${process.env.PUBLIC_URL}/assets/logos/vincco-logo-nav.png`

export default function Premios() {
  const navigate = useNavigate()
  const saldo = useStore((s) => s.usuario.puntos)
  const perfil = useStore((s) => s.perfiles.usuario)
  // Ajuste de privacidad: mientras esté activo el saldo arranca
  // tapado y solo se ve si el usuario toca el ojo.
  const ocultarSaldo = useStore((s) => s.configuraciones.usuario.ocultarSaldo)

  const nombreCompleto: string = (perfil?.nombre as string) || 'Lesbin'
  const iniciales = nombreCompleto
    .split(' ')
    .slice(0, 2)
    .map((p: string) => p[0])
    .join('')
    .toUpperCase()

  const usuario = {
    nombre: nombreCompleto.split(' ')[0],
    handle: nombreCompleto.split(' ')[0].toLowerCase(),
    iniciales,
    miembroDesde: perfil?.miembroDesde || 'agosto 2026',
    foto: perfil?.foto || null,
    puntos: saldo,
  }

  return (
    <div className="min-h-screen bg-hueso-100 font-sans text-tinta-900 antialiased">
      {/* Encabezado sticky con la marca */}
      <header className="sticky top-0 z-40 border-b border-hueso-300 bg-hueso-100/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate('/home')}
            aria-label="Volver al inicio"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-hueso-300 bg-[#fbf7f0] text-tinta-800 shadow-sm transition hover:-translate-y-px hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquesa-600"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </button>

          <img src={VINCCO_LOGO} alt="Vincco" className="h-8 w-auto" />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
        <div className="space-y-12 sm:space-y-16">
          <MisPremios usuario={usuario} ocultarSaldo={ocultarSaldo} />
          {/* Los mismos puntos que pinta el hero: la progresion de
              niveles de abajo queda siempre en sintonia con el badge
              "Nivel X" de arriba. */}
          <SubirNivel puntos={saldo} />
          <CanjeaPuntos puntos={saldo} />
          <DondeGanas />
          <ActividadReciente />
        </div>
      </main>
    </div>
  )
}