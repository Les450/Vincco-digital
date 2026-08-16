import { useState } from 'react'
import useStore from '../../store/puntos_usestore'
import Icon from '../icons/Icon'
import './verificacion.css'

/* ══════════════════════════════════════════════════════════════
   FORMULARIO DE VERIFICACIÓN — negocio y proveedor

   Lo único que pide hoy es el RUC, porque es lo único que definió
   el dueño de Vincco. El resto del trámite todavía se está
   definiendo, así que este formulario se queda mínimo a propósito:
   el día que se agreguen más campos, se agregan acá y en ningún
   otro lado, porque es el único lugar donde se solicita la
   verificación de negocio/proveedor (Registro, Perfil y cualquier
   acción bloqueada lo usan a través de AccionBloqueada).

   Sin RUC también se puede enviar: el dueño de Vincco pidió
   explícitamente que quien no lo tenga pueda seguir, y que
   administración lo contacte después para ver cómo verificarlo. */

export default function FormularioRUC({ rol, onEnviada }) {
  const solicitarVerificacion = useStore((s) => s.solicitarVerificacion)
  const [ruc, setRuc] = useState('')
  const [enviando, setEnviando] = useState(false)

  const enviar = (e) => {
    e.preventDefault()
    if (enviando) return
    setEnviando(true)
    solicitarVerificacion(rol, { ruc: ruc.trim() || null })
    onEnviada(Boolean(ruc.trim()))
  }

  return (
    <form className="vf-form" onSubmit={enviar}>
      <label className="vf-form-label" htmlFor="vf-ruc">Número de RUC</label>
      <input
        id="vf-ruc"
        className="vf-form-input"
        type="text"
        inputMode="text"
        placeholder="Ej: J0310000123456"
        value={ruc}
        onChange={(e) => setRuc(e.target.value)}
        autoComplete="off"
      />
      <p className="vf-form-ayuda">
        <Icon name="info" size={12} />
        Si todavía no tenés RUC, no pasa nada: podés enviar la solicitud igual.
      </p>

      <div className="vf-form-acciones">
        <button type="submit" className="vf-btn vf-btn--primaria">
          Enviar solicitud
        </button>
        {!ruc.trim() && (
          <button type="submit" className="vf-btn vf-btn--texto">
            No tengo RUC, continuar igual
          </button>
        )}
      </div>
    </form>
  )
}
