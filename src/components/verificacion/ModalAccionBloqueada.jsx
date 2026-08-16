import AccionBloqueada from './AccionBloqueada'
import Icon from '../icons/Icon'
import './verificacion.css'

/* Envoltorio de modal para AccionBloqueada, para los botones
   puntuales que abren un formulario (publicar, agregar, cotizar).
   Propio y aislado a propósito: cada pantalla que lo usa tiene su
   propio modal con sus propias clases, y mezclar estilos ajenos
   termina rompiendo alguno de los dos. */

export default function ModalAccionBloqueada({ rol, mensaje, onCerrar }) {
  return (
    <div className="vf-modal-fondo" onClick={onCerrar}>
      <div className="vf-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="vf-modal-cerrar" onClick={onCerrar} aria-label="Cerrar">
          <Icon name="x" size={16} />
        </button>
        <AccionBloqueada rol={rol} mensaje={mensaje} onCerrar={onCerrar} />
      </div>
    </div>
  )
}
