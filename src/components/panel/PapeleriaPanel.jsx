import { useState, useRef } from 'react'
import useStore from '../../store/puntos_usestore'
import Icon from '../icons/Icon'
import { cargarInventario, guardarInventario } from '../../data/inventario'
import { cargarPapelera, guardarPapelera } from '../../data/papelera'

function VerificacionPapelera({ onVerificado }) {
  const userType = useStore((s) => s.userType)
  const perfil = useStore((s) => s.perfiles[userType]) || {}
  const [canal, setCanal] = useState(null)
  const [valores, setValores] = useState(['', '', '', ''])
  const [reenviado, setReenviado] = useState(false)
  const inputsRef = useRef([])

  const enviarCodigo = (canalElegido) => {
    setCanal(canalElegido)
    setValores(['', '', '', ''])
    setReenviado(false)
  }

  // Reenvia el codigo por si el anterior no llego o vencio: limpia
  // los campos y avisa que se envio uno nuevo.
  const reenviarCodigo = () => {
    setValores(['', '', '', ''])
    inputsRef.current[0]?.focus()
    setReenviado(true)
  }

  // Sin backend de correo/SMS todavia no hay un codigo real que enviar
  // ni contra el cual comparar, asi que completar los 4 digitos alcanza
  // para avanzar. Cuando se conecte el envio real, aqui se valida contra
  // el codigo que llegue del backend.
  const manejarCambio = (idx, valor) => {
    const digito = valor.replace(/\D/g, '').slice(-1)
    const nuevos = [...valores]
    nuevos[idx] = digito
    setValores(nuevos)

    if (digito && idx < 3) inputsRef.current[idx + 1]?.focus()

    if (nuevos.every((v) => v !== '')) {
      onVerificado()
    }
  }

  const manejarTecla = (idx, e) => {
    if (e.key === 'Backspace' && !valores[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus()
    }
  }

  if (!canal) {
    return (
      <div className="panel-seccion" key="elegir-canal">
        <div className="panel-papelera-verificar">
          <div className="panel-papelera-verificar-icono"><Icon name="lock" size={22} /></div>
          <h2 className="panel-papelera-verificar-titulo">Verifica tu identidad</h2>
          <p className="panel-papelera-verificar-desc">
            Por seguridad, confirma que eres tú antes de entrar a la papelera y ver los productos eliminados.
            Elige dónde quieres recibir el código de verificación.
          </p>

          <div className="panel-papelera-canales">
            {perfil.correo && (
              <button type="button" className="panel-papelera-canal" onClick={() => enviarCodigo('correo')}>
                <Icon name="mail" size={18} />
                <span>
                  <strong>Correo electrónico</strong>
                  <small>{perfil.correo}</small>
                </span>
              </button>
            )}
            {perfil.telefono && (
              <button type="button" className="panel-papelera-canal" onClick={() => enviarCodigo('telefono')}>
                <Icon name="phone" size={18} />
                <span>
                  <strong>Número de teléfono</strong>
                  <small>{perfil.telefono}</small>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="panel-seccion" key="ingresar-codigo">
      <div className="panel-papelera-verificar">
        <div className="panel-papelera-verificar-icono"><Icon name="lock" size={22} /></div>
        <h2 className="panel-papelera-verificar-titulo">Ingresa el código</h2>
        <p className="panel-papelera-verificar-desc">
          Enviamos un código de 4 dígitos a tu {canal === 'correo' ? 'correo' : 'teléfono'}{' '}
          <strong>{canal === 'correo' ? perfil.correo : perfil.telefono}</strong>.
        </p>

        <div className="panel-papelera-otp">
          {valores.map((v, idx) => (
            <input
              key={idx}
              ref={(el) => { inputsRef.current[idx] = el }}
              className="panel-papelera-otp-input"
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={v}
              onChange={(e) => manejarCambio(idx, e.target.value)}
              onKeyDown={(e) => manejarTecla(idx, e)}
              autoFocus={idx === 0}
              autoComplete="off"
              spellCheck={false}
              data-lpignore="true"
              data-1p-ignore="true"
              data-gramm="false"
            />
          ))}
        </div>

        <button type="button" className="panel-btn panel-btn-outline" onClick={reenviarCodigo}>
          Reenviar código
        </button>
        {reenviado && (
          <p className="panel-papelera-reenviado">
            <Icon name="check-circle" size={14} /> Código reenviado a tu {canal === 'correo' ? 'correo' : 'teléfono'}
          </p>
        )}
        <button type="button" className="panel-btn-link" onClick={() => setCanal(null)}>
          Usar otro método
        </button>
      </div>
    </div>
  )
}

export default function PapeleriaPanel() {
  const [verificado, setVerificado] = useState(false)
  const [papelera, setPapelera] = useState(() => cargarPapelera())

  const actualizar = (lista) => {
    setPapelera(lista)
    guardarPapelera(lista)
  }

  const restaurar = (item) => {
    const { papeleraId, eliminadoEl, origenPanel, ...producto } = item
    const inventario = cargarInventario()
    guardarInventario([{ ...producto, id: Date.now() }, ...inventario])
    actualizar(papelera.filter((i) => i.papeleraId !== item.papeleraId))
  }

  const eliminarDefinitivo = (item) => {
    if (!window.confirm(`¿Eliminar definitivamente "${item.nombre}"? Esta acción no se puede deshacer.`)) return
    actualizar(papelera.filter((i) => i.papeleraId !== item.papeleraId))
  }

  const formatearFecha = (iso) => {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString('es-NI', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (!verificado) {
    return <VerificacionPapelera onVerificado={() => setVerificado(true)} />
  }

  return (
    <div className="panel-seccion">
      <div className="panel-seccion-header">
        <div>
          <h2 className="panel-seccion-titulo">Papelería</h2>
          <p className="panel-seccion-desc">Productos eliminados del inventario, disponibles para restaurar</p>
        </div>
      </div>

      {papelera.length === 0 ? (
        <div className="panel-vacio">
          <div className="panel-vacio-icono"><Icon name="trash-2" size={32} /></div>
          <p>No hay productos eliminados por el momento.</p>
        </div>
      ) : (
        <div className="panel-lista">
          {papelera.map((item) => (
            <div key={item.papeleraId} className="panel-inv-item">
              <div className="panel-inv-item-icono">
                {item.imagen ? (
                  <img src={item.imagen} alt={item.nombre} className="panel-inv-item-img" />
                ) : (
                  <Icon name="package" size={20} />
                )}
              </div>
              <div className="panel-inv-item-info">
                <h3 className="panel-inv-item-nombre">{item.nombre}</h3>
                <p className="panel-inv-item-detalle">
                  {item.categoria} · Eliminado el {formatearFecha(item.eliminadoEl)}
                </p>
              </div>
              <div className="panel-inv-item-acciones">
                <button className="panel-btn panel-btn-outline" onClick={() => restaurar(item)} title="Restaurar al inventario">
                  <Icon name="log-out" size={16} /> Restaurar
                </button>
                <button className="panel-btn panel-btn-icono panel-btn-icono--peligro" onClick={() => eliminarDefinitivo(item)} title="Eliminar definitivamente">
                  <Icon name="x" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
