import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../../store/puntos_usestore'
import Icon from '../icons/Icon'

// El `|| []` dentro del selector creaba un array nuevo en cada lectura.
// Zustand compara por referencia para decidir si redibuja, y como
// [] !== [] siempre le daba distinto: este componente se redibujaba
// ante cualquier cambio del store, aunque las sucursales no cambiaran.
// Con una constante fija la referencia se mantiene.
const SIN_SUCURSALES = []

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
  const sucursales = useStore((s) => s.sucursales[userType] ?? SIN_SUCURSALES)
  const sucursalActiva = useStore((s) => s.sucursalActiva[userType])
  const cambiarSucursal = useStore((s) => s.cambiarSucursal)
  const eliminarSucursal = useStore((s) => s.eliminarSucursal)

  const [abierto, setAbierto] = useState(false)
  const [desbloqueando, setDesbloqueando] = useState(null)
  const [contrasena, setContrasena] = useState('')
  const [errorContrasena, setErrorContrasena] = useState('')
  const [verContrasena, setVerContrasena] = useState(false)
  // Id de la sucursal esperando confirmación de borrado: el primer
  // toque del ícono de basura solo pregunta, el segundo elimina.
  const [porEliminar, setPorEliminar] = useState(null)

  const activa = sucursales.find((s) => s.id === sucursalActiva) || sucursales[0]

  const cerrar = () => {
    setAbierto(false)
    setDesbloqueando(null)
    setContrasena('')
    setErrorContrasena('')
    setVerContrasena(false)
    setPorEliminar(null)
  }

  const irAAgregarSucursal = () => {
    cerrar()
    navigate('/register', { state: { tipo: userType, modoSucursal: true } })
  }

  const elegirSucursal = (s) => {
    // La activa no se vuelve a desbloquear: solo cambia el botón.
    if (s.id === sucursalActiva) return cerrar()
    // Sucursales sin contraseña definida (creadas antes de que
    // existiera) se cambian directo; las nuevas piden la suya.
    if (!s.contrasena) {
      cambiarSucursal(userType, s.id)
      return cerrar()
    }
    setDesbloqueando(s.id)
    setContrasena('')
    setErrorContrasena('')
  }

  const confirmarDesbloqueo = () => {
    if (!desbloqueando) return
    const s = sucursales.find((x) => x.id === desbloqueando)
    if (!s) return cerrar()
    if (contrasena.trim() !== s.contrasena) {
      setErrorContrasena('Contraseña incorrecta')
      return
    }
    cambiarSucursal(userType, s.id)
    cerrar()
  }

  const confirmarEliminar = (s) => {
    eliminarSucursal(userType, s.id)
    setPorEliminar(null)
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
              <div key={s.id} className="panel-sucursal-fila">
                <button
                  type="button"
                  role="option"
                  aria-selected={s.id === sucursalActiva}
                  className={`panel-sucursal-item ${s.id === sucursalActiva ? 'panel-sucursal-item--activa' : ''}`}
                  onClick={() => elegirSucursal(s)}
                >
                  <span className="panel-sucursal-item-icono">
                    <Icon name="store" size={16} />
                  </span>
                  <span className="panel-sucursal-item-info">
                    <span className="panel-sucursal-item-nombre">
                      {s.nombre}
                      {s.principal && (
                        <span className="panel-sucursal-item-principal">Principal</span>
                      )}
                    </span>
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

                {porEliminar === s.id ? (
                  <div className="panel-sucursal-borrar-confirm">
                    <span>¿Eliminar?</span>
                    <button
                      type="button"
                      className="panel-sucursal-borrar-si"
                      onClick={() => confirmarEliminar(s)}
                    >
                      Sí, eliminar
                    </button>
                    <button
                      type="button"
                      className="panel-sucursal-borrar-no"
                      onClick={() => setPorEliminar(null)}
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="panel-sucursal-borrar"
                    aria-label={`Eliminar ${s.nombre}`}
                    onClick={() => setPorEliminar(s.id)}
                  >
                    <Icon name="trash-2" size={14} />
                  </button>
                )}

                {desbloqueando === s.id && (
                  <div className="panel-sucursal-desbloqueo">
                    <p className="panel-sucursal-desbloqueo-titulo">
                      Contraseña de {s.nombre}
                    </p>
                    <div className={`panel-sucursal-desbloqueo-campo ${errorContrasena ? 'panel-sucursal-desbloqueo-campo--err' : ''}`}>
                      <input
                        type={verContrasena ? 'text' : 'password'}
                        className="panel-sucursal-desbloqueo-input"
                        placeholder="Escribe la contraseña de la sucursal"
                        value={contrasena}
                        onChange={(e) => { setContrasena(e.target.value); setErrorContrasena('') }}
                        onKeyDown={(e) => { if (e.key === 'Enter') confirmarDesbloqueo() }}
                        autoFocus
                      />
                      <button
                        type="button"
                        className="panel-sucursal-desbloqueo-ojo"
                        onClick={() => setVerContrasena((v) => !v)}
                        aria-label={verContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        <Icon name={verContrasena ? 'eye-off' : 'eye'} size={16} />
                      </button>
                    </div>
                    {errorContrasena && (
                      <p className="panel-sucursal-desbloqueo-error">{errorContrasena}</p>
                    )}
                    <div className="panel-sucursal-desbloqueo-acciones">
                      <button
                        type="button"
                        className="panel-sucursal-desbloqueo-btn"
                        onClick={confirmarDesbloqueo}
                      >
                        Cambiar a esta sucursal
                      </button>
                      <button
                        type="button"
                        className="panel-sucursal-desbloqueo-cancelar"
                        onClick={() => { setDesbloqueando(null); setContrasena(''); setErrorContrasena('') }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
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