import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../store/puntos_usestore'
import Icon from '../../components/icons/Icon'
import { entradasDelRol, seccionesDelRol } from '../conocimiento/guia_generada'
import { normalizar } from '../orquestador/normalizar'
import './Guia.css'

/* ══════════════════════════════════════════════════════════════
   GUÍA DE USUARIO

   Dibuja el manual a partir de la guía compilada, que sale de
   src/Chatbot/guiausuario.md. El mismo archivo que lee Kiara para
   responder.

   Esa es la idea central: escribís una entrada nueva en la guía y
   aparece acá Y Kiara la aprende, en el mismo commit. No existe
   forma de que el manual y la asistente se contradigan.

   El contenido se filtra por rol: al cliente no le mostramos cómo
   editar inventario, porque no tiene inventario.
   ══════════════════════════════════════════════════════════════ */

export default function Guia() {
  const navigate = useNavigate()
  const userType = useStore((s) => s.userType)
  const abrirChat = useStore((s) => s.abrirChat)

  const [busqueda, setBusqueda] = useState('')
  const [abierta, setAbierta] = useState(null)

  const entradas = useMemo(() => entradasDelRol(userType), [userType])
  const secciones = useMemo(() => seccionesDelRol(userType), [userType])

  // Busca en título, resumen y palabras clave, ignorando tildes.
  // Es la misma normalización que usa Kiara.
  const filtradas = useMemo(() => {
    if (!busqueda.trim()) return entradas
    const q = normalizar(busqueda)
    return entradas.filter((e) =>
      normalizar(e.titulo).includes(q) ||
      normalizar(e.resumen).includes(q) ||
      e.claves.some((c) => normalizar(c).includes(q))
    )
  }, [entradas, busqueda])

  const porSeccion = useMemo(() => {
    const mapa = {}
    filtradas.forEach((e) => {
      if (!mapa[e.seccion]) mapa[e.seccion] = []
      mapa[e.seccion].push(e)
    })
    return mapa
  }, [filtradas])

  const seccionesVisibles = secciones.filter((s) => porSeccion[s.id]?.length)

  const rolLabel = { usuario: 'Cliente', negocio: 'Negocio', proveedor: 'Proveedor' }[userType]

  return (
    <div className="gui">
      <header className="gui-hero">
        <button
          type="button"
          className="gui-volver"
          onClick={() => navigate(-1)}
          aria-label="Volver"
        >
          <Icon name="arrow-left" size={18} />
        </button>

        <div className="gui-hero-cuerpo">
          <span className="gui-kicker">Guía de usuario · {rolLabel}</span>
          <h1>Cómo usar Vincco</h1>
          <p>
            Todo lo que la plataforma hace, explicado paso a paso. Kiara responde usando
            exactamente esta guía.
          </p>
        </div>
      </header>

      <div className="gui-body">
        <div className="gui-buscador">
          <Icon name="search" size={17} />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscá en la guía…"
            aria-label="Buscar en la guía"
          />
          {busqueda && (
            <button type="button" onClick={() => setBusqueda('')} aria-label="Limpiar búsqueda">
              <Icon name="x" size={15} />
            </button>
          )}
        </div>

        {/* Atajo a Kiara: si preferís preguntar en vez de leer */}
        <button type="button" className="gui-asistente" onClick={abrirChat}>
          <span className="gui-asistente-icono" aria-hidden="true">
            <Icon name="message-circle" size={18} />
          </span>
          <span className="gui-asistente-texto">
            <strong>¿Preferís preguntarle a Kiara?</strong>
            <span>Responde con esta misma guía, nada más</span>
          </span>
          <Icon name="chevron-right" size={17} />
        </button>

        {seccionesVisibles.map((seccion) => (
          <section key={seccion.id} className="gui-seccion">
            <div className="gui-seccion-head">
              <span className="gui-seccion-icono" aria-hidden="true">
                <Icon name={seccion.icono} size={17} />
              </span>
              <div>
                <h2>{seccion.titulo}</h2>
                <p>{seccion.descripcion}</p>
              </div>
              <span className="gui-seccion-cuenta">{porSeccion[seccion.id].length}</span>
            </div>

            <div className="gui-entradas">
              {porSeccion[seccion.id].map((entrada) => {
                const esta = abierta === entrada.id
                return (
                  <div key={entrada.id} className={`gui-entrada ${esta ? 'gui-entrada--abierta' : ''}`}>
                    <button
                      type="button"
                      className="gui-entrada-btn"
                      onClick={() => setAbierta(esta ? null : entrada.id)}
                      aria-expanded={esta}
                    >
                      <span className="gui-entrada-titulo">
                        {entrada.titulo}
                        {entrada.pendiente && (
                          <span className="gui-pendiente">Todavía no disponible</span>
                        )}
                      </span>
                      <motion.span animate={{ rotate: esta ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <Icon name="chevron-down" size={17} />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {esta && (
                        <motion.div
                          className="gui-entrada-cuerpo-wrap"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="gui-entrada-cuerpo">
                            <p className="gui-resumen">{entrada.resumen}</p>

                            {entrada.pasos?.length > 0 && (
                              <ol className="gui-pasos">
                                {entrada.pasos.map((p, i) => <li key={i}>{p}</li>)}
                              </ol>
                            )}

                            {entrada.nota && (
                              <p className="gui-nota">
                                <Icon name="info" size={13} />
                                {entrada.nota}
                              </p>
                            )}

                            {entrada.ruta && (
                              <button
                                type="button"
                                className="gui-ir"
                                onClick={() => navigate(entrada.ruta)}
                              >
                                Ir a {entrada.rutaLabel || entrada.ruta}
                                <Icon name="arrow-right" size={14} />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </section>
        ))}

        {!seccionesVisibles.length && (
          <p className="gui-vacio">
            No encontramos nada con “{busqueda}”. Probá con otras palabras o preguntale a Kiara.
          </p>
        )}

        <p className="gui-pie">
          <Icon name="info" size={13} />
          Esta guía es la única fuente de Kiara. Si algo no está acá, responde que no lo
          sabe en vez de inventarlo.
        </p>
      </div>
    </div>
  )
}
