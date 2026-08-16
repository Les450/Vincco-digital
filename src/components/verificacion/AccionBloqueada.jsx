import { useState } from 'react'
import useStore from '../../store/puntos_usestore'
import Icon from '../icons/Icon'
import './verificacion.css'

/* ══════════════════════════════════════════════════════════════
   ACCIÓN BLOQUEADA

   Lo que ve un negocio o proveedor sin verificar cuando toca algo
   que todavía no puede hacer (publicar, cotizar, agregar un negocio
   asociado). No es una pared: explica por qué existe la regla
   (evitar cuentas falsas y bots) y ofrece pedir la verificación ahí
   mismo, sin salir de donde estaba.

   Se usa tanto suelta dentro de una sección (la pestaña de
   Cotizaciones del negocio, que queda vacía entera) como adentro de
   ModalAccionBloqueada (los botones puntuales, como "+ Nueva"). El
   componente no sabe en cuál de las dos está: eso lo decide quien
   lo usa.
   ══════════════════════════════════════════════════════════════ */

const TEXTOS_ROL = {
  negocio: 'tu negocio',
  proveedor: 'tu empresa',
}

export default function AccionBloqueada({ rol, mensaje, onCerrar }) {
  const abrirKYC = useStore((s) => s.abrirKYC)
  const [paso, setPaso] = useState('info')

  if (paso === 'enviado') {
    return (
      <div className="vf-bloqueo vf-bloqueo--enviado">
        <span className="vf-bloqueo-icono vf-bloqueo-icono--ok" aria-hidden="true">
          <Icon name="check-circle" size={22} />
        </span>
        <strong>Solicitud enviada</strong>
        <p>
          El equipo de Vincco va a revisar {TEXTOS_ROL[rol] || 'tu cuenta'}. La revisión tarda
          entre 24 y 48 horas y te llega la confirmación a tu correo electrónico.
        </p>
        {onCerrar && (
          <button type="button" className="vf-btn vf-btn--primaria" onClick={onCerrar}>
            Entendido
          </button>
        )}
      </div>
    )
  }

  if (paso === 'formulario') {
    return (
      <div className="vf-bloqueo">
        <span className="vf-bloqueo-icono" aria-hidden="true">
          <Icon name="insignia-verificado" size={22} />
        </span>
        <strong>Solicitar verificación</strong>
        <p>
          Para verificar {TEXTOS_ROL[rol] || 'tu cuenta'} vas a completar un expediente de 4 pasos:
          identificación, documentos, datos tributarios (DGI) y datos de tu rol, conforme a la Ley 977.
        </p>
        <div className="vf-form-acciones">
          <button
            type="button"
            className="vf-btn vf-btn--primaria"
            onClick={() => {
              // El expediente KYC se abre por encima de todo y al
              // terminar deja la cuenta en "pendiente": acá no queda
              // nada que mostrar.
              abrirKYC(rol)
              onCerrar?.()
            }}
          >
            Completar verificación
          </button>
          {onCerrar && (
            <button type="button" className="vf-btn vf-btn--texto" onClick={onCerrar}>
              Ahora no
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="vf-bloqueo">
      <span className="vf-bloqueo-icono" aria-hidden="true">
        <Icon name="alert-triangle" size={22} />
      </span>
      <strong>Esto necesita cuenta verificada</strong>
      <p>{mensaje}</p>
      <p className="vf-bloqueo-motivo">
        <Icon name="info" size={12} />
        Es una medida contra cuentas falsas y bots: no es nada personal contra vos.
      </p>

      <div className="vf-form-acciones">
        <button type="button" className="vf-btn vf-btn--primaria" onClick={() => setPaso('formulario')}>
          Solicitar verificación
        </button>
        {onCerrar && (
          <button type="button" className="vf-btn vf-btn--texto" onClick={onCerrar}>
            Ahora no
          </button>
        )}
      </div>
    </div>
  )
}
