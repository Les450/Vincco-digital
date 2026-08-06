import { useNavigate } from 'react-router-dom'
import useStore from '../store/puntos_usestore'
import Icon from '../components/icons/Icon'
import IconRed, { REDES } from '../components/icons/IconRed'
import {
  PerfilHero,
  Seccion,
  Metricas,
  BloqueDatos,
  Insignias,
  Actividad,
} from '../components/perfil/PerfilUI'
import {
  camposPerfil,
  metricasPerfil,
  insigniasPerfil,
  actividadPerfil,
  horarioPerfil,
  resenasPerfil,
} from '../data/data_falso'

// Perfil del comercio. Aca el perfil no es un dato personal: es la
// ficha que ve el cliente en el directorio. Por eso pesa la
// reputacion (calificacion, reseñas, verificacion) y los canales de
// contacto, no los puntos.

function Estrellas({ cantidad }) {
  return (
    <span className="pf-estrellas" aria-label={`${cantidad} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon key={n} name="star" size={13} filled={n <= cantidad} />
      ))}
    </span>
  )
}

export default function PerfilNegocio() {
  const navigate = useNavigate()
  const perfil = useStore((s) => s.perfiles.negocio)
  const guardarPerfil = useStore((s) => s.guardarPerfil)
  const guardarFoto = useStore((s) => s.guardarFoto)
  const quitarFoto = useStore((s) => s.quitarFoto)
  const redesNegocio = useStore((s) => s.redesNegocio)

  const idsConectadas = Object.keys(REDES).filter((id) => redesNegocio[id])

  return (
    <div className="pf pf--negocio">
      <PerfilHero
        kicker="Ficha comercial"
        nombre={perfil.nombre}
        subtitulo={perfil.direccion}
        acento="#007a7b"
        foto={perfil.foto}
        onFoto={(foto) => guardarFoto('negocio', foto)}
        onQuitarFoto={() => quitarFoto('negocio')}
        chips={[
          { label: 'Verificado', icono: 'check-circle', destacado: true },
          { label: perfil.categoria, icono: 'tag' },
          { label: '4.8 · 52 reseñas', icono: 'star' },
          { label: 'Abierto ahora', icono: 'clock' },
        ]}
        extra={
          <div className="pf-ficha">
            <span className="pf-ficha-label">Así te ven tus clientes</span>
            <p className="pf-ficha-texto">{perfil.descripcion}</p>
            <div className="pf-ficha-contacto">
              <span><Icon name="smartphone" size={13} /> {perfil.telefono}</span>
              <span><Icon name="mail" size={13} /> {perfil.correo}</span>
            </div>
          </div>
        }
        acciones={
          <>
            <button
              type="button"
              className="pf-btn pf-btn--solido"
              onClick={() => navigate('/panel-negocio')}
            >
              <Icon name="bar-chart-2" size={15} /> Ir al panel
            </button>
            <button
              type="button"
              className="pf-btn pf-btn--claro"
              onClick={() => navigate('/redes')}
            >
              <Icon name="globe" size={15} /> Mis redes
            </button>
          </>
        }
      />

      <div className="pf-body">
        <Metricas items={metricasPerfil.negocio} />

        <BloqueDatos
          titulo="Información del negocio"
          descripcion="Estos datos aparecen en tu ficha del directorio"
          campos={camposPerfil.negocio}
          valores={perfil}
          onGuardar={(datos) => guardarPerfil('negocio', datos)}
        />

        <div className="pf-columnas">
          <Seccion titulo="Horario de atención" descripcion="Lo que ven los clientes antes de visitarte">
            <ul className="pf-horario">
              {horarioPerfil.map((h) => (
                <li key={h.dia} className={h.abierto ? '' : 'pf-horario--cerrado'}>
                  <span className="pf-horario-dia">{h.dia}</span>
                  <span className="pf-horario-horas">{h.horas}</span>
                </li>
              ))}
            </ul>
          </Seccion>

          <Seccion
            titulo="Canales conectados"
            descripcion={`${idsConectadas.length} de ${Object.keys(REDES).length} redes`}
            className="pf-seccion--lateral"
            accion={
              <button type="button" className="pf-btn pf-btn--linea" onClick={() => navigate('/redes')}>
                <Icon name="edit-3" size={14} /> Gestionar
              </button>
            }
          >
            {idsConectadas.length > 0 ? (
              <ul className="pf-redes">
                {idsConectadas.map((id) => (
                  <li key={id} className="pf-red">
                    <span className="pf-red-icono" style={{ background: REDES[id].color }}>
                      <IconRed nombre={id} size={15} style={{ color: '#ffffff' }} />
                    </span>
                    <span className="pf-red-info">
                      <strong translate="no">{REDES[id].nombre}</strong>
                      <span>{redesNegocio[id]}</span>
                    </span>
                    <Icon name="check-circle" size={15} className="pf-red-check" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="pf-aviso">
                <Icon name="alert-triangle" size={15} />
                Todavía no conectaste ninguna red. Los negocios con redes reciben más visitas.
              </p>
            )}
          </Seccion>
        </div>

        <div className="pf-columnas">
          <Seccion titulo="Últimas reseñas" descripcion="Lo que opinan tus clientes">
            <ul className="pf-resenas">
              {resenasPerfil.map((r) => (
                <li key={r.id} className="pf-resena">
                  <div className="pf-resena-top">
                    <strong>{r.autor}</strong>
                    <Estrellas cantidad={r.estrellas} />
                  </div>
                  <p className="pf-resena-texto">{r.texto}</p>
                  <time className="pf-resena-fecha">{r.fecha}</time>
                </li>
              ))}
            </ul>
          </Seccion>

          <Seccion
            titulo="Reconocimientos"
            descripcion="Distinciones de tu comercio"
            className="pf-seccion--lateral"
          >
            <Insignias items={insigniasPerfil.negocio} />
          </Seccion>
        </div>

        <Seccion titulo="Actividad reciente" descripcion="Movimientos de los últimos días">
          <Actividad items={actividadPerfil.negocio} />
        </Seccion>
      </div>
    </div>
  )
}
