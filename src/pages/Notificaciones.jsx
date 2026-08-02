import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/puntos_usestore'
import Icon from '../components/icons/Icon'
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
  const marcarNotificacionLeida = useStore((s) => s.marcarNotificacionLeida)
  const marcarTodasLeidas = useStore((s) => s.marcarTodasLeidas)
  const [filtro, setFiltro] = useState('todas')

  const notificacionesFiltradas = useMemo(() => {
    const delUsuario = notificaciones.filter((n) => n.userType === userType)
    delUsuario.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

    if (filtro === 'no-leidas') return delUsuario.filter((n) => !n.leida)
    if (filtro === 'leidas') return delUsuario.filter((n) => n.leida)
    return delUsuario
  }, [notificaciones, userType, filtro])

  const noLeidas = useMemo(() => {
    return notificaciones.filter((n) => n.userType === userType && !n.leida).length
  }, [notificaciones, userType])

  const handleClick = (n) => {
    if (!n.leida) marcarNotificacionLeida(n.id)
    navigate(n.ruta)
  }

  return (
    <div className="ntf">
      <div className="ntf-header">
        <h2>Notificaciones</h2>
        {noLeidas > 0 && (
          <button className="ntf-marcar-todas" onClick={marcarTodasLeidas} type="button">
            Marcar todas como leídas
          </button>
        )}
      </div>

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
              ? 'No tienes notificaciones pendientes'
              : filtro === 'leidas'
              ? 'No hay notificaciones leídas'
              : 'No hay notificaciones'}
          </p>
          <div className="ntf-vacio-sub">
            {filtro === 'no-leidas' ? '¡Estás al día!' : 'Las notificaciones aparecerán aquí'}
          </div>
        </div>
      ) : (
        <div className="ntf-lista">
          {notificacionesFiltradas.map((n) => (
            <div
              key={n.id}
              className={`ntf-item ${!n.leida ? 'ntf-item--no-leida' : ''}`}
              onClick={() => handleClick(n)}
            >
              <div className="ntf-item-icono"><Icon name={n.icono} size={20} /></div>
              <div className="ntf-item-contenido">
                <div className="ntf-item-titulo">{n.titulo}</div>
                <p className="ntf-item-descripcion">{n.descripcion}</p>
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
    </div>
  )
}
