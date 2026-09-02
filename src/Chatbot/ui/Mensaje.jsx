import { useNavigate } from 'react-router-dom'
import Icon from '../../components/icons/Icon'

const RUTA_KIARA_IMG = `${process.env.PUBLIC_URL || ''}/assets/images/kiara.png`

/* Una burbuja de la conversación con Kiara.

   El mensaje de Kiara puede traer, además del texto:
     - pasos: instrucciones numeradas
     - ruta: un botón que lleva a la pantalla mencionada
     - nota: una aclaración
     - fuente: de qué entrada de la guía salió la respuesta
     - opciones: un menú de botones en vez de una respuesta suelta,
       para preguntas que abarcan varios perfiles (como "¿Cómo me
       verifico?", que depende de si sos cliente, negocio o proveedor)
     - volverA: si esta respuesta vino de tocar una opción, el id del
       menú anterior, para poder volver

   Mostrar la fuente no es adorno: es lo que le permite al usuario
   verificar, y a vos detectar qué entrada de la guía respondió mal. */

export default function Mensaje({ mensaje, onSugerencia, onOpcion }) {
  const navigate = useNavigate()
  const esUsuario = mensaje.autor === 'usuario'

  if (esUsuario) {
    return (
      <div className="chat-msg chat-msg--usuario">
        <p className="chat-burbuja chat-burbuja--usuario">{mensaje.texto}</p>
      </div>
    )
  }

  return (
    <div className="chat-msg chat-msg--bot">
      <span className="chat-avatar" aria-hidden="true">
        <img src={RUTA_KIARA_IMG} alt="" className="chat-avatar-img" loading="lazy" />
      </span>

      <div className="chat-cuerpo">
        <div className={`chat-burbuja ${mensaje.seguro === false ? 'chat-burbuja--limite' : ''}`}>
          <p className="chat-texto">{mensaje.texto}</p>

          {mensaje.pasos?.length > 0 && (
            <ol className="chat-pasos">
              {mensaje.pasos.map((paso, i) => (
                <li key={i}>{paso}</li>
              ))}
            </ol>
          )}

          {mensaje.nota && (
            <p className="chat-nota">
              <Icon name="info" size={13} />
              {mensaje.nota}
            </p>
          )}

          {/* navigate() y no <a href>: la app usa HashRouter, un
              enlace normal recargaría toda la página */}
          {mensaje.ruta && (
            <button
              type="button"
              className="chat-ir"
              onClick={() => navigate(mensaje.ruta)}
            >
              Ir a {mensaje.rutaLabel || mensaje.ruta}
              <Icon name="arrow-right" size={14} />
            </button>
          )}

          {/* Menú: en vez de una respuesta larga, botones numerados.
              El id de cada opción es el de otra entrada de la guía;
              tocarla trae esa respuesta sin volver a escribir nada. */}
          {mensaje.opciones?.length > 0 && (
            <div className="chat-menu">
              {mensaje.opciones.map((opcion, i) => (
                <button
                  key={opcion.id}
                  type="button"
                  className="chat-menu-opcion"
                  onClick={() => onOpcion(opcion, mensaje.fuente)}
                >
                  <span className="chat-menu-numero">{i + 1}</span>
                  <span className="chat-menu-texto">{opcion.texto}</span>
                  <Icon name="chevron-right" size={16} />
                </button>
              ))}
            </div>
          )}

          {mensaje.volverA && (
            <button
              type="button"
              className="chat-volver"
              onClick={() => onOpcion({ id: mensaje.volverA, texto: 'Volver al menú' }, null)}
            >
              <Icon name="arrow-left" size={13} />
              Volver al menú
            </button>
          )}
        </div>

        {mensaje.fuente && !mensaje.opciones?.length && (
          <span className="chat-fuente">Guía de usuario · {mensaje.fuente}</span>
        )}

        {mensaje.sugerencias?.length > 0 && (
          <div className="chat-sugerencias">
            {mensaje.sugerencias.map((s) => (
              <button
                key={s}
                type="button"
                className="chat-sugerencia"
                onClick={() => onSugerencia(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
