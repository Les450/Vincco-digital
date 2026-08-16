import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../../store/puntos_usestore'
import Icon from '../icons/Icon'

// Selector de sucursal para los paneles de negocio y proveedor.
// El dueño que tiene varias sucursales elige cuál está administrando:
// cada sucursal tiene su propio panel (inventario y publicaciones).
// Y también "Mis sucursales": ver la lista, cambiar de sucursal y
// agregar una nueva. Agregar una sucursal usa la misma lógica del
// registro de negocio/proveedor (desde el paso 5) y la nueva queda
// activa al crearla.
export default function SucursalSelector() {
  const navigate = useNavigate()
  const userType = useStore((s) => s.userType)
  const sucursales = useStore((s) => s.sucursales[userType] || [])
  const sucursalActiva = useStore((s) => s.sucursalActiva[userType])
  const cambiarSucursal = useStore((s) => s.cambiarSucursal)

  const [abierto, setAbierto] = useState(false)

  const activa = sucursales.find((s) => s.id === sucursalActiva) || sucursales[0]

  const cerrar = () => {
    setAbierto(false)
  }

  const irAAgregarSucursal = () => {
    cerrar()
    navigate('/register', { state: { tipo: userType, modoSucursal: true } })
  }

  return (
    <div className="panel-sucursal">
      <button
        type="button"
        className="panel-sucursal-btn"
        onClick={() => setAbierto((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={abierto}
      >
        <Icon name="map-pin" size={15} />
        <span className="panel-sucursal-btn-nombre">{activa?.nombre || 'Sucursal'}</span>
        <Icon name="chevron-down" size={14} />
      </button>

      {abierto && (
        <>
          <div className="panel-sucursal-overlay" onClick={cerrar} />
          <div className="panel-sucursal-menu" role="listbox" aria-label="Mis sucursales">
            <p className="panel-sucursal-menu-titulo">
              Mis sucursales
              <span className="panel-sucursal-menu-count">{sucursales.length}</span>
            </p>

            {sucursales.length === 0 && (
              <p className="panel-sucursal-menu-vacio">Aún no tienes sucursales.</p>
            )}

            {sucursales.map((s) => (
              <button
                key={s.id}
                type="button"
                role="option"
                aria-selected={s.id === sucursalActiva}
                className={`panel-sucursal-item ${s.id === sucursalActiva ? 'panel-sucursal-item--activa' : ''}`}
                onClick={() => { cambiarSucursal(userType, s.id); cerrar() }}
              >
                <span className="panel-sucursal-item-icono">
                  <Icon name="store" size={16} />
                </span>
                <span className="panel-sucursal-item-info">
                  <span className="panel-sucursal-item-nombre">{s.nombre}</span>
                  <span className="panel-sucursal-item-direccion">
                    {s.direccion || 'Sin dirección'}
                  </span>
                </span>
                {s.id === sucursalActiva && (
                  <span className="panel-sucursal-item-estado">
                    <Icon name="check-circle" size={14} /> Activa
                  </span>
                )}
              </button>
            ))}

            <button type="button" className="panel-sucursal-agregar" onClick={irAAgregarSucursal}>
              + Agregar sucursal
            </button>
          </div>
        </>
      )}
    </div>
  )
}