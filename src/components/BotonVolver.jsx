import { useNavigate } from 'react-router-dom'
import Icon from './icons/Icon'

/* Boton de retroceso, uno solo para toda la app.
 *
 * Antes cada pantalla que lo necesitaba se dibujaba el suyo. Ahora es
 * este: mismo tamaño (44px, el area tactil minima), mismo icono y
 * mismo gesto en Perfil, Calendario y Avisos.
 *
 * Lo unico que cambia es el tono, porque no es lo mismo un boton sobre
 * el azul petroleo que sobre un fondo claro:
 *   tono="tinta"  → sobre fondos oscuros (perfil, calendario)
 *   tono="papel"  → sobre fondos claros (avisos)
 *
 * Sobre el destino: "atras" no siempre existe. Si la persona entro
 * directo a /calendario desde la barra inferior en su primera pantalla,
 * un history.back() la sacaria de la app. React Router numera las
 * entradas en history.state.idx; si estamos en la primera (idx 0 o sin
 * idx), en vez de salir se va al destino de siempre.
 */
export default function BotonVolver({
  tono = 'tinta',
  destino = '/home',
  etiqueta = 'Volver',
  className = '',
}) {
  const navigate = useNavigate()

  const volver = () => {
    const idx = window.history.state?.idx
    if (typeof idx === 'number' && idx > 0) navigate(-1)
    else navigate(destino, { replace: true })
  }

  return (
    <button
      type="button"
      className={`vc-volver vc-volver--${tono} ${className}`.trim()}
      onClick={volver}
      aria-label={etiqueta}
      title={etiqueta}
    >
      <Icon name="arrow-left" size={18} />
    </button>
  )
}
