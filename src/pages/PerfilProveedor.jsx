import { useNavigate } from 'react-router-dom'
import useStore, { perfilDeSucursal } from '../store/puntos_usestore'
import Icon from '../components/icons/Icon'
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
  lineasProveedor,
} from '../data/data_falso'

/* Perfil del proveedor — "Tu hoja de ruta".
 *
 * A diferencia del comercio, no vende al publico: vende a otros
 * negocios. Por eso lo que manda es la capacidad de abastecer
 * (cobertura, lineas, stock) y la seriedad para cotizar y entregar a
 * tiempo. El acento es TURQUESA, que en el ciclo de marca es el color
 * del proveedor: confianza y verificacion.
 */

const ETIQUETA_STOCK = {
  alto: 'Disponible',
  medio: 'Stock medio',
  bajo: 'Stock bajo',
}

function esPionero(miembroDesde) {
  return /202[6]/.test(String(miembroDesde || ''))
}

export default function PerfilProveedor() {
  const navigate = useNavigate()
  const perfilBase = useStore((s) => s.perfiles.proveedor)
  const guardarPerfil = useStore((s) => s.guardarPerfilConSucursal)
  const guardarFoto = useStore((s) => s.guardarFoto)
  const quitarFoto = useStore((s) => s.quitarFoto)
  const negociosAsociados = useStore((s) => s.negociosAsociados)
  const estadoVerificacion = useStore((s) => s.estadosVerificacion.proveedor)

  // La ficha que se ve es la de la sucursal activa: cada sucursal tiene
  // su propio nombre, direccion y telefono. La foto y el resto de los
  // datos (RUC, correo...) son de la cuenta y no cambian.
  const sucursal = useStore((s) =>
    s.sucursales.proveedor?.find((x) => x.id === s.sucursalActiva.proveedor)
  )
  const perfil = perfilDeSucursal(perfilBase, sucursal)

  // Solo cuentan las asociaciones ya aceptadas por el negocio: las
  // pendientes y rechazadas no son una relacion real todavia.
  const asociados = negociosAsociados.filter((n) => n.estado === 'aceptada')
  const zonas = perfil.cobertura.split(/\s*(?:,|y)\s*/).filter(Boolean)

  const m = {}
  metricasPerfil.proveedor.forEach((x) => { m[x.id] = x })

  return (
    <PerfilPagina rol="proveedor">
      <div className="vc-perf-esquina">
        <SucursalSelector />
      </div>

      <PerfilHero
        kicker="Tu hoja de ruta"
        nombre={perfil.nombre}
        subtitulo={`${perfil.categoria} · contacto: ${perfil.contacto}`}
        foto={perfil.foto}
        onFoto={(foto) => guardarFoto('proveedor', foto)}
        onQuitarFoto={() => quitarFoto('proveedor')}
        sellos={[
          ...(estadoVerificacion === 'aprobada'
            ? [{ label: 'Proveedor verificado', icono: 'check-circle', destacado: true }]
            : []),
          { label: `${asociados.length} negocios asociados`, icono: 'store' },
          { label: `${m.entregas?.valor || '—'} entregas a tiempo`, icono: 'truck' },
          ...(esPionero(perfilBase.miembroDesde)
            ? [{ label: `Pionero · ${perfilBase.miembroDesde}`, icono: 'medal', pionero: true }]
            : []),
        ]}
        extra={
          <div className="vc-perf-cobertura">
            <p className="vc-perf-etiqueta">
              <Icon name="map-pin" size={13} /> Zona de cobertura
            </p>
            <ul className="vc-perf-cobertura__lista">
              {zonas.map((z) => (
                <li key={z}>{z}</li>
              ))}
            </ul>
            <p className="vc-perf-cobertura__pie">
              <strong>{asociados.length}</strong> negocios asociados activos
            </p>
          </div>
        }
        acciones={
          <>
            <button
              type="button"
              className="vc-perf-btn vc-perf-btn--solido"
              onClick={() => navigate('/negocios-asociados')}
            >
              <Icon name="store" size={15} /> Negocios asociados
            </button>
            <button
              type="button"
              className="vc-perf-btn vc-perf-btn--claro"
              onClick={() => navigate('/recompensas')}
            >
              <Icon name="file-text" size={15} /> Cotizaciones
            </button>
          </>
        }
      />

      <VerificacionBanner
        rol="proveedor"
        estado={estadoVerificacion}
        texto="Sin verificar podés ver todo el panel, pero no podés publicar productos, enviar cotizaciones ni agregar negocios asociados. Solicitá la verificación de tu empresa para desbloquearlo."
      />

      <div className="vc-perf__cuerpo">
        {/* El proveedor no mide plata en el perfil, mide confianza: a
            cuantos llega y si cumple. Esos son los dos heroes. */}
        <Recibos
          items={metricasPerfil.proveedor}
          grupos={[
            {
              titulo: 'Tu alcance',
              ids: ['negocios', 'cotizaciones'],
              nota: 'Los negocios que abastecés pueden mostrarte en su perfil, si te dan permiso.',
              notaIcono: 'store',
            },
            {
              titulo: 'Tu cumplimiento',
              ids: ['entregas', 'aceptacion'],
              nota: 'Entregar a tiempo es lo que te separa del mercado informal.',
              notaIcono: 'truck',
            },
          ]}
        />

        <BloqueDatos
          documento="Credencial de proveedor"
          titulo="Datos de la empresa"
          descripcion="Los negocios ven esta información antes de pedirte una cotización"
          campos={camposPerfil.proveedor}
          valores={perfil}
          folioCampo="ruc"
          onGuardar={(datos) => guardarPerfil('proveedor', datos)}
        />

        <Seccion
          titulo="Líneas que distribuís"
          descripcion="Rubros activos y cuántos negocios los compran"
        >
          <ul className="vc-perf-lineas">
            {lineasProveedor.map((l) => (
              <li key={l.id} className="vc-perf-linea">
                <div className="vc-perf-linea__top">
                  <strong className="vc-perf-linea__nombre">{l.nombre}</strong>
                  <span className={`vc-perf-stock vc-perf-stock--${l.stock}`}>
                    {ETIQUETA_STOCK[l.stock]}
                  </span>
                </div>
                <span className="vc-perf-linea__pie">
                  <Icon name="store" size={13} /> {l.negocios} negocios abastecidos
                </span>
              </li>
            ))}
          </ul>
        </Seccion>

        <div className="vc-perf-columnas">
          <Seccion titulo="Horario de atención" descripcion="Cuándo pueden contactarte los negocios">
            <ul className="vc-perf-horario">
              {horarioPerfil.map((h) => (
                <li key={h.dia} className={h.abierto ? '' : 'vc-perf-horario__cerrado'}>
                  <span className="vc-perf-horario__dia">{h.dia}</span>
                  <span className="vc-perf-horario__horas">{h.horas}</span>
                </li>
              ))}
            </ul>
          </Seccion>

          <Seccion titulo="Mural de reconocimientos" descripcion="Distinciones como proveedor">
            <Insignias
              items={insigniasPerfil.proveedor.map((i) =>
                i.id === 'p1' ? { ...i, activa: estadoVerificacion === 'aprobada' } : i
              )}
            />
          </Seccion>
        </div>

        <Seccion titulo="Tu extracto" descripcion="Cotizaciones, pedidos y entregas">
          <Actividad
            items={actividadPerfil.proveedor}
            resumenIcono="truck"
            resumen={`${actividadPerfil.proveedor.length} movimientos · ${m.aceptacion?.valor || '—'} de tus cotizaciones se aceptan`}
          />
        </Seccion>
      </div>
    </PerfilPagina>
  )
}
