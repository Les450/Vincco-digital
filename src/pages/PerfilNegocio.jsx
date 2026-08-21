import { useNavigate } from 'react-router-dom'
import useStore, { perfilDeSucursal } from '../store/puntos_usestore'
import Icon from '../components/icons/Icon'
import IconRed, { REDES } from '../components/icons/IconRed'
import SucursalSelector from '../components/panel/SucursalSelector'
import {
  PerfilPagina,
  PerfilHero,
  VerificacionBanner,
  Seccion,
  Recibos,
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
  RANKING_NEGOCIO,
} from '../data/data_falso'

/* Perfil del comercio — "Tu ficha de vitrina".
 *
 * Aca el perfil no es un dato personal: es la ficha que ve el cliente en
 * el directorio. Por eso pesa la reputacion (calificacion, reseñas,
 * verificacion) y los canales de contacto, no los puntos.
 *
 * El acento es NARANJA porque en el ciclo de marca el comercio es el
 * naranja: es el motor del ciclo. Antes estaba en turquesa, que es el
 * color del proveedor, y eso contaba la historia al reves.
 */

function Estrellas({ cantidad }) {
  return (
    <span className="vc-perf-estrellas" aria-label={`${cantidad} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon key={n} name="star" size={13} filled={n <= cantidad} />
      ))}
    </span>
  )
}

function esPionero(miembroDesde) {
  return /202[6]/.test(String(miembroDesde || ''))
}

export default function PerfilNegocio() {
  const navigate = useNavigate()
  const perfilBase = useStore((s) => s.perfiles.negocio)
  const guardarPerfil = useStore((s) => s.guardarPerfilConSucursal)
  const guardarFoto = useStore((s) => s.guardarFoto)
  const quitarFoto = useStore((s) => s.quitarFoto)
  const redesNegocio = useStore((s) => s.redesNegocio)
  const estadoVerificacion = useStore((s) => s.estadosVerificacion.negocio)

  // La ficha que se ve es la de la sucursal activa: cada sucursal tiene
  // su propio nombre, direccion y telefono. La foto y el resto de los
  // datos (RUC, correo...) son de la cuenta y no cambian.
  const sucursal = useStore((s) =>
    s.sucursales.negocio?.find((x) => x.id === s.sucursalActiva.negocio)
  )
  const perfil = perfilDeSucursal(perfilBase, sucursal)

  const idsConectadas = Object.keys(REDES).filter((id) => redesNegocio[id])

  const m = {}
  metricasPerfil.negocio.forEach((x) => { m[x.id] = x })

  return (
    <PerfilPagina rol="negocio">
      <div className="vc-perf-esquina">
        <SucursalSelector />
      </div>

      <PerfilHero
        kicker="Tu ficha de vitrina"
        nombre={perfil.nombre}
        subtitulo={perfil.direccion}
        foto={perfil.foto}
        onFoto={(foto) => guardarFoto('negocio', foto)}
        onQuitarFoto={() => quitarFoto('negocio')}
        sellos={[
          { label: perfil.categoria, icono: 'tag' },
          ...(estadoVerificacion === 'aprobada'
            ? [{ label: 'Negocio verificado', icono: 'check-circle', destacado: true }]
            : []),
          { label: 'Abierto ahora', icono: 'clock' },
          { label: `#${RANKING_NEGOCIO.puesto} de ${RANKING_NEGOCIO.total} en tu categoría`, icono: 'award' },
          ...(esPionero(perfilBase.miembroDesde)
            ? [{ label: `Pionero · ${perfilBase.miembroDesde}`, icono: 'medal', pionero: true }]
            : []),
        ]}
        extra={
          <div className="vc-perf-vitrina">
            <p className="vc-perf-etiqueta">Así te ven tus clientes</p>
            <p className="vc-perf-vitrina__texto">{perfil.descripcion}</p>
            <div className="vc-perf-vitrina__contacto">
              <span><Icon name="smartphone" size={13} /> {perfil.telefono}</span>
              <span><Icon name="mail" size={13} /> {perfil.correo}</span>
            </div>
          </div>
        }
        acciones={
          <>
            <button
              type="button"
              className="vc-perf-btn vc-perf-btn--solido"
              onClick={() => navigate('/panel-negocio')}
            >
              <Icon name="bar-chart-2" size={15} /> Ir al panel
            </button>
            <button
              type="button"
              className="vc-perf-btn vc-perf-btn--claro"
              onClick={() => navigate('/redes')}
            >
              <Icon name="globe" size={15} /> Mis redes
            </button>
          </>
        }
      />

      <VerificacionBanner
        rol="negocio"
        estado={estadoVerificacion}
        texto="Sin verificar podés ver todo el panel, pero no podés publicar ni recibir cotizaciones. Solicitá la verificación de tu negocio para desbloquearlo."
      />

      <div className="vc-perf__cuerpo">
        {/* Un recibo para la plata que entra y otro para lo que te da
            lugar en el directorio. Las ventas en cordobas son el heroe:
            es el numero por el que el comerciante entra a la app. */}
        <Recibos
          items={metricasPerfil.negocio}
          grupos={[
            {
              titulo: 'Tu movimiento',
              ids: ['ventas', 'clientes'],
              nota: `Cada punto que entregás vuelve como visita: ${m.clientes?.valor || 0} clientes ya acumulan con vos.`,
              notaIcono: 'trending-up',
            },
            {
              titulo: 'Tu reputación',
              ids: ['resenas', 'ranking'],
              nota: 'Los negocios mejor calificados aparecen primero en el directorio.',
              notaIcono: 'star',
            },
          ]}
        />

        <BloqueDatos
          documento="Ficha comercial · directorio"
          titulo="Información del negocio"
          descripcion="Estos datos aparecen en tu ficha del directorio"
          campos={camposPerfil.negocio}
          valores={perfil}
          folioCampo="ruc"
          onGuardar={(datos) => guardarPerfil('negocio', datos)}
        />

        <div className="vc-perf-columnas">
          <Seccion titulo="Horario de atención" descripcion="Lo que ven los clientes antes de visitarte">
            <ul className="vc-perf-horario">
              {horarioPerfil.map((h) => (
                <li key={h.dia} className={h.abierto ? '' : 'vc-perf-horario__cerrado'}>
                  <span className="vc-perf-horario__dia">{h.dia}</span>
                  <span className="vc-perf-horario__horas">{h.horas}</span>
                </li>
              ))}
            </ul>
          </Seccion>

          <Seccion
            titulo="Canales conectados"
            descripcion={`${idsConectadas.length} de ${Object.keys(REDES).length} redes`}
            accion={
              <button type="button" className="vc-perf-btn vc-perf-btn--linea" onClick={() => navigate('/redes')}>
                <Icon name="edit-3" size={14} /> Gestionar
              </button>
            }
          >
            {idsConectadas.length > 0 ? (
              <ul className="vc-perf-redes">
                {idsConectadas.map((id) => (
                  <li key={id} className="vc-perf-red">
                    <span className="vc-perf-red__icono" style={{ background: REDES[id].color }}>
                      <IconRed nombre={id} size={15} style={{ color: '#faf6f1' }} />
                    </span>
                    <span className="vc-perf-red__info">
                      <strong translate="no">{REDES[id].nombre}</strong>
                      <span>{redesNegocio[id]}</span>
                    </span>
                    <Icon name="check-circle" size={15} className="vc-perf-red__check" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="vc-perf-recibo__nota">
                <Icon name="alert-triangle" size={15} />
                Todavía no conectaste ninguna red. Los negocios con redes reciben más visitas.
              </p>
            )}
          </Seccion>
        </div>

        <div className="vc-perf-columnas">
          <Seccion titulo="Últimas reseñas" descripcion="Lo que opinan tus clientes">
            <ul className="vc-perf-resenas">
              {resenasPerfil.map((r) => (
                <li key={r.id} className="vc-perf-resena">
                  <div className="vc-perf-resena__top">
                    <strong className="vc-perf-resena__autor">{r.autor}</strong>
                    <Estrellas cantidad={r.estrellas} />
                  </div>
                  <p className="vc-perf-resena__texto">{r.texto}</p>
                  <time className="vc-perf-resena__fecha">{r.fecha}</time>
                </li>
              ))}
            </ul>
          </Seccion>

          <Seccion titulo="Mural de reconocimientos" descripcion="Distinciones de tu comercio">
            <Insignias
              items={insigniasPerfil.negocio.map((i) =>
                i.id === 'n1' ? { ...i, activa: estadoVerificacion === 'aprobada' } : i
              )}
            />
          </Seccion>
        </div>

        <Seccion titulo="Tu extracto" descripcion="Movimientos de los últimos días">
          <Actividad
            items={actividadPerfil.negocio}
            resumenIcono="trending-up"
            resumen={`${actividadPerfil.negocio.length} movimientos · ventas del mes ${m.ventas?.valor || 0} ${m.ventas?.unidad || 'córdobas'}`}
          />
        </Seccion>
      </div>
    </PerfilPagina>
  )
}
