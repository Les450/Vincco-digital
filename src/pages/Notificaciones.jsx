import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/puntos_usestore'
import Icon from '../components/icons/Icon'
import { filtrarPorConfig } from '../utils/filtroNotificaciones'
import './Notificaciones.css'


function formatearFecha(iso) {
  const fecha = new Date(iso)
  const ahora = new Date()
  const diffMs = ahora - fecha
  const diffMin = Math.floor(diffMs / 60000)
  const diffHoras = Math.floor(diffMs / 3600000)
  const diffDias = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return 'Justo ahora'
  if (diffMin < 60) return `Hace ${diffMin} min`
  if (diffHoras < 24) return `Hace ${diffHoras}h`
  if (diffDias < 7) return `Hace ${diffDias}d`

  const dia = String(fecha.getDate()).padStart(2, '0')
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const hora = String(fecha.getHours()).padStart(2, '0')
  const min = String(fecha.getMinutes()).padStart(2, '0')
  return `${dia}/${mes} ${hora}:${min}`
}

export default function Notificaciones() {
  const navigate = useNavigate()
  const notificaciones = useStore((s) => s.notificaciones)
  const userType = useStore((s) => s.userType)
  const config = useStore((s) => s.configuraciones[s.userType])
  const marcarNotificacionLeida = useStore((s) => s.marcarNotificacionLeida)
  const marcarTodasLeidas = useStore((s) => s.marcarTodasLeidas)
  const eliminarNotificaciones = useStore((s) => s.eliminarNotificaciones)
  const negociosAsociados = useStore((s) => s.negociosAsociados)
  const responderAsociacionNegocio = useStore((s) => s.responderAsociacionNegocio)
  const [filtro, setFiltro] = useState('todas')
  const [modoEliminar, setModoEliminar] = useState(false)
  const [seleccionadas, setSeleccionadas] = useState([])
  const [confirmar, setConfirmar] = useState(false)

  // Las que corresponden al rol Y que la configuración deja pasar.
  // Si el usuario apagó los avisos de promociones en /config, acá
  // dejan de aparecer de verdad.
  const permitidas = useMemo(
    () => filtrarPorConfig(
      notificaciones.filter((n) => n.userType === userType),
      config,
      userType
    ),
    [notificaciones, config, userType]
  )

  const notificacionesFiltradas = useMemo(() => {
    const ordenadas = [...permitidas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

    if (filtro === 'no-leidas') return ordenadas.filter((n) => !n.leida)
    if (filtro === 'leidas') return ordenadas.filter((n) => n.leida)
    return ordenadas
  }, [permitidas, filtro])

  // El contador usa la misma lista que se ve, así el número del
  // badge nunca dice 5 cuando en pantalla hay 3.
  const noLeidas = useMemo(
    () => permitidas.filter((n) => !n.leida).length,
    [permitidas]
  )

  // Solo deja selecciones que sigan existiendo (por si algo fue
  // eliminado mientras se navegaba entre filtros)
  const seleccionadasValidas = useMemo(
    () => seleccionadas.filter((id) => notificaciones.some((n) => n.id === id)),
    [seleccionadas, notificaciones]
  )

  const idsVisibles = notificacionesFiltradas.map((n) => n.id)
  const todasVisiblesSeleccionadas =
    notificacionesFiltradas.length > 0 &&
    idsVisibles.every((id) => seleccionadasValidas.includes(id))

  const handleClick = (n) => {
    if (modoEliminar) {
      toggleSeleccion(n.id)
      return
    }
    if (!n.leida) marcarNotificacionLeida(n.id)
    navigate(n.ruta)
  }

  // Acepta o rechaza una solicitud de asociación desde el aviso
  // mismo, sin ir a ninguna otra pantalla. stopPropagation porque el
  // aviso entero también tiene su propio onClick (que navega).
  const responderSolicitud = (e, n, aceptar) => {
    e.stopPropagation()
    responderAsociacionNegocio(n.negocioAsociadoId, aceptar)
    if (!n.leida) marcarNotificacionLeida(n.id)
  }

  const toggleSeleccion = (id) => {
    setSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const marcarTodosVisibles = () => {
    setSeleccionadas((prev) =>
      todasVisiblesSeleccionadas
        ? prev.filter((id) => !idsVisibles.includes(id))
        : [...new Set([...prev, ...idsVisibles])]
    )
  }

  const salirModoEliminar = () => {
    setModoEliminar(false)
    setSeleccionadas([])
    setConfirmar(false)
  }

  const confirmarEliminacion = () => {
    eliminarNotificaciones(seleccionadasValidas)
    salirModoEliminar()
  }

  return (
    <div className="ntf">
      <div className="ntf-header">
        <h2>Avisos</h2>
        {!modoEliminar && (
          <div className="ntf-header-acciones">
            {noLeidas > 0 && (
              <button className="ntf-marcar-todas" onClick={marcarTodasLeidas} type="button">
                Marcar todas como leídas
              </button>
            )}
            <button
              className="ntf-marcar-todas ntf-eliminar-btn"
              onClick={() => setModoEliminar(true)}
              type="button"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>

      {modoEliminar && (
        <div className="ntf-barra-eliminar">
          <button className="ntf-marcar-todas" onClick={marcarTodosVisibles} type="button">
            {todasVisiblesSeleccionadas ? 'Desmarcar todos' : 'Marcar todos'}
          </button>
          <button
            className={`ntf-btn-eliminar ${seleccionadasValidas.length === 0 ? 'ntf-btn-eliminar--disabled' : ''}`}
            onClick={() => seleccionadasValidas.length > 0 && setConfirmar(true)}
            type="button"
            disabled={seleccionadasValidas.length === 0}
          >
            Eliminar seleccionados {seleccionadasValidas.length > 0 && `(${seleccionadasValidas.length})`}
          </button>
          <button className="ntf-marcar-todas" onClick={salirModoEliminar} type="button">
            Cancelar
          </button>
        </div>
      )}

      <div className="ntf-filtros">
        {[
          { key: 'todas', label: 'Todas' },
          { key: 'no-leidas', label: `No leídas (${noLeidas})` },
          { key: 'leidas', label: 'Leídas' },
        ].map((f) => (
          <button
            key={f.key}
            className={`ntf-filtro-btn ${filtro === f.key ? 'ntf-filtro-btn--activo' : ''}`}
            onClick={() => setFiltro(f.key)}
            type="button"
          >
            {f.label}
          </button>
        ))}
      </div>

      {notificacionesFiltradas.length === 0 ? (
        <div className="ntf-vacio">
          <div className="ntf-vacio-icono">
            <Icon name={filtro === 'no-leidas' ? 'party-popper' : filtro === 'leidas' ? 'inbox' : 'bell'} size={32} />
          </div>
          <p>
            {filtro === 'no-leidas'
              ? 'No tienes avisos pendientes'
              : filtro === 'leidas'
              ? 'No hay avisos leídos'
              : 'No hay avisos'}
          </p>
          <div className="ntf-vacio-sub">
            {filtro === 'no-leidas' ? '¡Estás al día!' : 'Los avisos aparecerán aquí'}
          </div>
        </div>
      ) : (
        <div className="ntf-lista">
          {notificacionesFiltradas.map((n) => (
            <div
              key={n.id}
              className={`ntf-item ${!n.leida ? 'ntf-item--no-leida' : ''} ${modoEliminar && seleccionadasValidas.includes(n.id) ? 'ntf-item--seleccionado' : ''}`}
              onClick={() => handleClick(n)}
            >
              {modoEliminar && (
                <span className="ntf-item-check" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={seleccionadasValidas.includes(n.id)}
                    onChange={() => toggleSeleccion(n.id)}
                    aria-label={`Seleccionar aviso: ${n.titulo}`}
                  />
                </span>
              )}
              <div className="ntf-item-icono"><Icon name={n.icono} size={20} /></div>
              <div className="ntf-item-contenido">
                <div className="ntf-item-titulo">{n.titulo}</div>
                <p className="ntf-item-descripcion">{n.descripcion}</p>

                {n.tipo === 'solicitud_asociacion' && !modoEliminar && (() => {
                  const solicitud = negociosAsociados.find((neg) => neg.id === n.negocioAsociadoId)
                  if (!solicitud || solicitud.estado === 'pendiente') {
                    return (
                      <div className="ntf-item-solicitud" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className="ntf-item-solicitud-btn ntf-item-solicitud-btn--aceptar"
                          onClick={(e) => responderSolicitud(e, n, true)}
                        >
                          <Icon name="check" size={13} /> Aceptar
                        </button>
                        <button
                          type="button"
                          className="ntf-item-solicitud-btn ntf-item-solicitud-btn--rechazar"
                          onClick={(e) => responderSolicitud(e, n, false)}
                        >
                          <Icon name="x" size={13} /> Rechazar
                        </button>
                      </div>
                    )
                  }
                  return (
                    <p className="ntf-item-solicitud-resuelta">
                      <Icon name={solicitud.estado === 'aceptada' ? 'check-circle' : 'x'} size={13} />
                      {solicitud.estado === 'aceptada' ? 'Aceptaste esta solicitud' : 'Rechazaste esta solicitud'}
                    </p>
                  )
                })()}

                <div className="ntf-item-meta">
                  <span className="ntf-item-fecha">{formatearFecha(n.fecha)}</span>
                  <span className={`ntf-item-estado ${!n.leida ? 'ntf-item-estado--no-leida' : 'ntf-item-estado--leida'}`}>
                    {!n.leida ? 'No leída' : 'Leída'}
                  </span>
                </div>
              </div>
              {!n.leida && <div className="ntf-item-indicador" />}
            </div>
          ))}
        </div>
      )}

      {confirmar && (
        <div className="ntf-modal-overlay" onClick={salirModoEliminar}>
          <div className="ntf-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="ntf-confirmar-titulo">
            <h3 id="ntf-confirmar-titulo">
              {todasVisiblesSeleccionadas
                ? '¿Eliminar todos los avisos seleccionados?'
                : '¿Eliminar avisos seleccionados?'}
            </h3>
            <p>Los avisos seleccionados se eliminarán y no podrán recuperarse.</p>
            <div className="ntf-modal-acciones">
              <button className="ntf-modal-cancelar" onClick={salirModoEliminar} type="button">
                Cancelar
              </button>
              <button className="ntf-modal-confirmar" onClick={confirmarEliminacion} type="button">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
