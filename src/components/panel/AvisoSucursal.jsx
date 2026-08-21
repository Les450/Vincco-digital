import { useState } from 'react'
import useStore from '../../store/puntos_usestore'
import Icon from '../icons/Icon'

// Anuncio del panel de sucursales: avisa que cada sucursal tiene su
// propio inventario y publicaciones. Sale cuando el dueño cambia de
// sucursal y entra al panel. La X lo cierra (vuelve a salir solo si
// cambia de sucursal otra vez) y "No volver a mostrar" lo silencia
// para siempre, guardado en localStorage mientras no hay backend.
const CLAVE_AVISO = 'vincco:aviso-sucursal'

function leerAviso() {
  try {
    return JSON.parse(window.localStorage.getItem(CLAVE_AVISO) || '{}')
  } catch {
    return {}
  }
}

export default function AvisoSucursal() {
  const userType = useStore((s) => s.userType)
  const sucursalId = useStore((s) => s.sucursalActiva[s.userType])
  const sucursal = useStore((s) => s.sucursales[s.userType]?.find((x) => x.id === sucursalId))
  const [aviso, setAviso] = useState(leerAviso)

  const rol = aviso[userType] || {}
  const visible = !rol.nunca && rol.anunciada !== sucursalId && sucursal

  const guardar = (nuevo) => {
    const completo = { ...aviso, [userType]: nuevo }
    setAviso(completo)
    try {
      window.localStorage.setItem(CLAVE_AVISO, JSON.stringify(completo))
    } catch {}
  }

  if (!visible) return null

  return (
    <div className="panel-sucursal-aviso">
      <button
        type="button"
        className="panel-sucursal-aviso-cerrar"
        onClick={() => guardar({ ...rol, anunciada: sucursalId })}
        aria-label="Cerrar aviso"
      >
        <Icon name="x" size={16} />
      </button>
      <div className="panel-sucursal-aviso-icono">
        <Icon name="map-pin" size={18} />
      </div>
      <div className="panel-sucursal-aviso-contenido">
        <p className="panel-sucursal-aviso-titulo">Estás administrando {sucursal.nombre}</p>
        <p className="panel-sucursal-aviso-texto">
          Cada sucursal tiene su propio panel: inventario y publicaciones independientes.
        </p>
        <button
          type="button"
          className="panel-sucursal-aviso-nunca"
          onClick={() => guardar({ ...rol, nunca: true })}
        >
          No volver a mostrar
        </button>
      </div>
    </div>
  )
}
