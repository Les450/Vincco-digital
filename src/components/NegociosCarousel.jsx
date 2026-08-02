import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from './icons/Icon'

// Vista principal de Negocios Asociados.
// Reemplaza el layout de lista + detalle: los negocios son chips que rotan
// a la izquierda y la tarjeta grande de la derecha muestra el seleccionado
// con todos sus datos y acciones.
//
// Es un componente presentacional: el negocio seleccionado lo controla
// la pagina, asi la logica de WhatsApp y notificaciones queda en un solo lugar.

const CAT_ICONOS = {
  'Pulpería': 'store',
  'Ferretería': 'tool',
  'Farmacia': 'heart',
  'Boutique': 'shirt',
  'Restaurante': 'utensils',
  'Cafetería': 'coffee',
  'Agroservicio': 'package',
  'Tecnología': 'laptop',
  'Otro': 'store',
}

const AUTO_PLAY_INTERVAL = 4500
const ITEM_HEIGHT = 62

// Acomoda v dentro del rango [min, max) dando la vuelta,
// para que los chips roten en bucle sin saltos.
function wrap(min, max, v) {
  const rango = max - min
  return ((((v - min) % rango) + rango) % rango) + min
}

function MediaNegocio({ negocio, activa }) {
  const icono = CAT_ICONOS[negocio.categoria] || 'store'
  const claseInactiva = activa ? '' : 'ncar-card-img--inactiva'

  if (negocio.imagen) {
    return <img src={negocio.imagen} alt={negocio.nombre} className={`ncar-card-img ${claseInactiva}`} />
  }
  return (
    <div
      className={`ncar-card-img ncar-card-img--placeholder ${claseInactiva}`}
      style={{ background: `linear-gradient(135deg, ${negocio.color} 0%, ${negocio.color}bb 100%)` }}
    >
      <Icon name={icono} size={64} />
    </div>
  )
}

export default function NegociosCarousel({
  negocios = [],
  seleccionadoId,
  onSeleccionar,
  busqueda,
  onBusquedaChange,
  whatsappHref,
  notifEnviada,
  onNotificar,
  onEditar,
  pausado,
}) {
  const total = negocios.length
  const idxActual = Math.max(0, negocios.findIndex((n) => n.id === seleccionadoId))
  const seleccionado = negocios[idxActual] || null

  const irASiguiente = useCallback(() => {
    if (total <= 1) return
    const sig = negocios[(idxActual + 1) % total]
    if (sig) onSeleccionar(sig.id)
  }, [negocios, idxActual, total, onSeleccionar])

  useEffect(() => {
    // Se detiene con 1 solo negocio, mientras el usuario escribe
    // en el buscador o cuando pasa el mouse por encima
    if (pausado || total <= 1) return
    const id = setInterval(irASiguiente, AUTO_PLAY_INTERVAL)
    return () => clearInterval(id)
  }, [irASiguiente, pausado, total])

  // Define si una tarjeta va al centro, atras a un costado, o no se ve
  const getEstadoTarjeta = (index) => {
    const diff = index - idxActual
    let d = diff
    if (diff > total / 2) d -= total
    if (diff < -total / 2) d += total
    if (d === 0) return 'activa'
    if (d === -1) return 'previa'
    if (d === 1) return 'siguiente'
    return 'oculta'
  }

  return (
    <div className="ncar">
      <div className="ncar-shell">
        {/* ── Columna izquierda: buscador + chips ─────────── */}
        <div className="ncar-chips-col">
          <div className="ncar-search">
            <Icon name="search" size={17} className="ncar-search-icono" />
            <input
              type="text"
              placeholder="Buscar negocio asociado..."
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
              aria-label="Buscar negocio asociado"
            />
          </div>

          <div className="ncar-chips-zona">
            <div className="ncar-fade ncar-fade--top" />
            <div className="ncar-fade ncar-fade--bottom" />

            {total === 0 ? (
              <p className="ncar-sin-resultados">No encontramos negocios con ese nombre.</p>
            ) : (
              <div className="ncar-chips-pista">
                {negocios.map((negocio, index) => {
                  const activo = index === idxActual
                  const distancia = wrap(-(total / 2), total / 2, index - idxActual)

                  return (
                    <motion.div
                      key={negocio.id}
                      className="ncar-chip-wrap"
                      style={{ height: ITEM_HEIGHT }}
                      animate={{
                        y: distancia * ITEM_HEIGHT,
                        opacity: 1 - Math.abs(distancia) * 0.25,
                      }}
                      transition={{ type: 'spring', stiffness: 90, damping: 22, mass: 1 }}
                    >
                      <button
                        type="button"
                        onClick={() => onSeleccionar(negocio.id)}
                        className={`ncar-chip ${activo ? 'ncar-chip--activo' : ''}`}
                      >
                        <span className="ncar-chip-icono">
                          <Icon name={CAT_ICONOS[negocio.categoria] || 'store'} size={17} />
                        </span>
                        <span className="ncar-chip-label">{negocio.nombre}</span>
                      </button>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Columna derecha: tarjeta + datos + acciones ── */}
        <div className="ncar-cards-col">
          <div className="ncar-cards-pista">
            {negocios.map((negocio, index) => {
              const estado = getEstadoTarjeta(index)
              const activa = estado === 'activa'
              const previa = estado === 'previa'
              const sig = estado === 'siguiente'

              return (
                <motion.div
                  key={negocio.id}
                  className="ncar-card"
                  initial={false}
                  animate={{
                    x: activa ? 0 : previa ? -100 : sig ? 100 : 0,
                    scale: activa ? 1 : previa || sig ? 0.85 : 0.7,
                    opacity: activa ? 1 : previa || sig ? 0.4 : 0,
                    rotate: previa ? -3 : sig ? 3 : 0,
                    zIndex: activa ? 20 : previa || sig ? 10 : 0,
                    pointerEvents: activa ? 'auto' : 'none',
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 25, mass: 0.8 }}
                >
                  <MediaNegocio negocio={negocio} activa={activa} />

                  <div className={`ncar-card-estado ${activa ? '' : 'ncar-card-estado--oculto'}`}>
                    <span className={`ncar-card-punto ncar-card-punto--${(negocio.estado || 'activo').toLowerCase()}`} />
                    <span>{negocio.estado || 'Activo'}</span>
                  </div>

                  <AnimatePresence>
                    {activa && (
                      <motion.div
                        className="ncar-card-info"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        {/* El nombre no se repite aca: va en el panel
                            de la derecha, junto al boton de editar */}
                        <div className="ncar-card-badge">
                          {index + 1} • {negocio.categoria}
                        </div>
                        <p className="ncar-card-nombre">
                          {negocio.descripcion || negocio.nombre}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          {/* Datos y acciones del negocio activo */}
          <AnimatePresence mode="wait">
            {seleccionado && (
              <motion.div
                key={seleccionado.id}
                className="ncar-panel"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="ncar-panel-encabezado">
                  <div className="ncar-panel-titulo">
                    <p className="ncar-panel-categoria">{seleccionado.categoria}</p>
                    <h2>{seleccionado.nombre}</h2>
                  </div>
                  {onEditar && (
                    <motion.button
                      type="button"
                      className="ncar-btn-editar"
                      onClick={() => onEditar(seleccionado)}
                      whileTap={{ scale: 0.94 }}
                      aria-label={`Editar ${seleccionado.nombre}`}
                    >
                      <Icon name="edit-3" size={16} />
                      <span>Editar</span>
                    </motion.button>
                  )}
                </div>

                <div className="ncar-panel-meta">
                  <div className="ncar-panel-meta-item">
                    <Icon name="map-pin" size={15} />
                    <span>
                      {seleccionado.direccion}, {seleccionado.municipio}, {seleccionado.departamento}
                    </span>
                  </div>
                  <div className="ncar-panel-meta-item">
                    <Icon name="user" size={15} />
                    <span>{seleccionado.propietario}</span>
                  </div>
                  <div className="ncar-panel-meta-item">
                    <Icon name="mail" size={15} />
                    <span>{seleccionado.correo}</span>
                  </div>
                  <div className="ncar-panel-meta-item">
                    <Icon name="message-circle" size={15} />
                    <span>{seleccionado.whatsapp}</span>
                  </div>
                </div>

                <div className="ncar-panel-acciones">
                  <a
                    className="ncar-btn ncar-btn--whatsapp"
                    href={whatsappHref || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-disabled={!whatsappHref}
                    onClick={(e) => { if (!whatsappHref) e.preventDefault() }}
                  >
                    <Icon name="message-circle" size={17} /> Contactar por WhatsApp
                  </a>

                  <motion.button
                    className="ncar-btn ncar-btn--notificar"
                    onClick={onNotificar}
                    type="button"
                    whileTap={{ scale: 0.97 }}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {notifEnviada ? (
                        <motion.span
                          key="ok"
                          className="ncar-btn-contenido"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                        >
                          <Icon name="check-circle" size={17} /> Notificación enviada
                        </motion.span>
                      ) : (
                        <motion.span
                          key="enviar"
                          className="ncar-btn-contenido"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                        >
                          <Icon name="bell" size={17} /> Enviar notificación de compra
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
