import { useState, useRef, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import useStore from '../../store/puntos_usestore'
import Icon from '../../components/icons/Icon'
import Mensaje from './Mensaje'
import { preguntar, mensajeBienvenida } from '../orquestador/orquestador'
import { precargarGuia } from '../conocimiento'
import './Chat.css'

const RUTA_KIARA_IMG = `${process.env.PUBLIC_URL || ''}/assets/images/kiara.png`

/* ══════════════════════════════════════════════════════════════
   PANEL DE KIARA — la asistente de Vincco

   Vive al costado de la página, siempre disponible.

     Escritorio (≥1280px): columna fija a la derecha. El contenido
       de la app se corre para dejarle lugar, no la tapa.
     Tablet y celular: pestaña al costado que abre el panel encima.

   El usuario puede apagarla del todo desde Configuración → La app
   → "Mostrar a Kiara". Si la apaga, este componente no devuelve
   nada: ni el panel ni la pestaña.

   Este componente NO sabe cómo se responden las preguntas. Llama a
   preguntar() y muestra lo que vuelva.
   ══════════════════════════════════════════════════════════════ */

export default function PanelChat() {
  const { pathname } = useLocation()

  const userType = useStore((s) => s.userType)
  const mostrar = useStore((s) => s.configuraciones[s.userType]?.mostrarAsistente !== false)
  const chat = useStore((s) => s.chat)
  const cerrarChat = useStore((s) => s.cerrarChat)
  const agregarMensajeChat = useStore((s) => s.agregarMensajeChat)
  const setChatPensando = useStore((s) => s.setChatPensando)
  const limpiarChat = useStore((s) => s.limpiarChat)

  const [borrador, setBorrador] = useState('')
  const finRef = useRef(null)

  const { abierto, mensajes, pensando } = chat

  /* Al abrir, intenta bajar la guía publicada. Si el servidor la
     tiene actualizada, Kiara responde con esa; si falla, sigue con
     la que vino compilada y nadie se entera.
     Se hace acá y no al cargar la app para que quien nunca abre a
     Kiara no gaste una descarga. */
  useEffect(() => {
    if (abierto) precargarGuia()
  }, [abierto])

  // Primer saludo: se agrega una sola vez, cuando el chat se abre
  // con la conversación vacía.
  useEffect(() => {
    if (abierto && mensajes.length === 0) {
      agregarMensajeChat({ autor: 'asistente', ...mensajeBienvenida(userType) })
    }
  }, [abierto, mensajes.length, userType, agregarMensajeChat])

  // Baja al último mensaje cuando llega uno nuevo
  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [mensajes, pensando])

  const enviar = useCallback(async (texto) => {
    const limpio = (texto || '').trim()
    if (!limpio || pensando) return

    agregarMensajeChat({ autor: 'usuario', texto: limpio })
    setBorrador('')
    setChatPensando(true)

    // Pausa mínima para que se vea que "está pensando". El motor
    // local responde en milisegundos y sin esto el mensaje aparece
    // tan rápido que parece que no procesó nada.
    await new Promise((r) => setTimeout(r, 320))

    try {
      const respuesta = await preguntar(limpio, {
        rol: userType,
        ruta: pathname,
        historial: mensajes,
      })
      agregarMensajeChat({ autor: 'asistente', ...respuesta })
    } catch {
      agregarMensajeChat({
        autor: 'asistente',
        texto: 'Se me complicó procesar eso. ¿Podés escribirlo de otra forma?',
        seguro: false,
        sugerencias: [],
      })
    } finally {
      setChatPensando(false)
    }
  }, [pensando, userType, pathname, mensajes, agregarMensajeChat, setChatPensando])

  // Escape cierra el panel cuando está encima del contenido
  useEffect(() => {
    if (!abierto) return undefined
    const alTeclear = (e) => {
      if (e.key === 'Escape' && !window.matchMedia('(min-width: 1280px)').matches) {
        cerrarChat()
      }
    }
    window.addEventListener('keydown', alTeclear)
    return () => window.removeEventListener('keydown', alTeclear)
  }, [abierto, cerrarChat])

  // Apagada desde Configuración: no se dibuja nada
  if (!mostrar) return null

  return (
    <>
      <div
        className={`chat-fondo ${abierto ? 'chat-fondo--visible' : ''}`}
        onClick={cerrarChat}
        aria-hidden="true"
      />

      <aside
        id="panel-kiara"
        className={`chat-panel ${abierto ? 'chat-panel--abierto' : ''}`}
        aria-label="Kiara, la asistente de Vincco"
      >
        <header className="chat-head">
          <span className="chat-head-marca" aria-hidden="true">
            <img src={RUTA_KIARA_IMG} alt="" className="chat-head-avatar" />
          </span>

          <div className="chat-head-texto">
            <strong>Kiara</strong>
            <span>Asistente de Vincco</span>
          </div>

          {mensajes.length > 1 && (
            <button
              type="button"
              className="chat-head-btn"
              onClick={limpiarChat}
              aria-label="Empezar de nuevo"
              title="Empezar de nuevo"
            >
              <Icon name="trash-2" size={15} />
            </button>
          )}

          <button
            type="button"
            className="chat-head-btn"
            onClick={cerrarChat}
            aria-label="Cerrar a Kiara"
          >
            <Icon name="x" size={17} />
          </button>
        </header>

        <div className="chat-lista">
          {mensajes.map((m) => (
            <Mensaje key={m.id} mensaje={m} onSugerencia={enviar} />
          ))}

          {pensando && (
            <div className="chat-msg chat-msg--bot">
              <span className="chat-avatar" aria-hidden="true">
                <img src={RUTA_KIARA_IMG} alt="" className="chat-avatar-img" />
              </span>
              <div className="chat-burbuja chat-burbuja--pensando" role="status">
                <span /><span /><span />
              </div>
            </div>
          )}

          <div ref={finRef} />
        </div>

        <form
          className="chat-entrada"
          onSubmit={(e) => {
            e.preventDefault()
            enviar(borrador)
          }}
        >
          <input
            type="text"
            value={borrador}
            onChange={(e) => setBorrador(e.target.value)}
            placeholder="Preguntale a Kiara…"
            aria-label="Escribí tu pregunta"
            maxLength={300}
          />
          <button
            type="submit"
            disabled={!borrador.trim() || pensando}
            aria-label="Enviar pregunta"
          >
            <Icon name="arrow-right" size={17} />
          </button>
        </form>

        <p className="chat-pie">
          Kiara responde solo sobre Vincco, con lo que dice la guía de usuario.
        </p>
      </aside>
    </>
  )
}
