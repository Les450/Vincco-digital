import { useNavigate } from 'react-router-dom'
import useStore from '../store/puntos_usestore'
import Icon from '../components/icons/Icon'
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
  lineasProveedor,
} from '../data/data_falso'

// Perfil del proveedor. A diferencia del comercio, no vende al
// publico: vende a otros negocios. Por eso lo que manda es la
// capacidad de abastecer (cobertura, lineas, stock) y la seriedad
// para cotizar y entregar a tiempo.

const ETIQUETA_STOCK = {
  alto: 'Disponible',
  medio: 'Stock medio',
  bajo: 'Stock bajo',
}

export default function PerfilProveedor() {
  const navigate = useNavigate()
  const perfil = useStore((s) => s.perfiles.proveedor)
  const guardarPerfil = useStore((s) => s.guardarPerfil)
  const guardarFoto = useStore((s) => s.guardarFoto)
  const quitarFoto = useStore((s) => s.quitarFoto)
  const negociosAsociados = useStore((s) => s.negociosAsociados)

  const activos = negociosAsociados.filter((n) => n.estado === 'Activo').length
  const zonas = perfil.cobertura.split(/\s*(?:,|y)\s*/).filter(Boolean)

  return (
    <div className="pf pf--proveedor">
      <PerfilHero
        kicker="Cuenta de proveedor"
        nombre={perfil.nombre}
        subtitulo={`${perfil.categoria} · contacto: ${perfil.contacto}`}
        acento="#00374e"
        foto={perfil.foto}
        onFoto={(foto) => guardarFoto('proveedor', foto)}
        onQuitarFoto={() => quitarFoto('proveedor')}
        chips={[
          { label: 'Proveedor verificado', icono: 'check-circle', destacado: true },
          { label: `${negociosAsociados.length} negocios asociados`, icono: 'store' },
          { label: '96% entregas a tiempo', icono: 'truck' },
        ]}
        extra={
          <div className="pf-cobertura">
            <span className="pf-cobertura-label">
              <Icon name="map-pin" size={14} /> Zona de cobertura
            </span>
            <ul className="pf-cobertura-lista">
              {zonas.map((z) => (
                <li key={z}>{z}</li>
              ))}
            </ul>
            <p className="pf-cobertura-pie">
              <strong>{activos}</strong> de {negociosAsociados.length} negocios activos este mes
            </p>
          </div>
        }
        acciones={
          <>
            <button
              type="button"
              className="pf-btn pf-btn--solido"
              onClick={() => navigate('/negocios-asociados')}
            >
              <Icon name="store" size={15} /> Negocios asociados
            </button>
            <button
              type="button"
              className="pf-btn pf-btn--claro"
              onClick={() => navigate('/recompensas')}
            >
              <Icon name="file-text" size={15} /> Cotizaciones
            </button>
          </>
        }
      />

      <div className="pf-body">
        <Metricas items={metricasPerfil.proveedor} />

        <BloqueDatos
          titulo="Datos de la empresa"
          descripcion="Los negocios ven esta información antes de pedirte una cotización"
          campos={camposPerfil.proveedor}
          valores={perfil}
          onGuardar={(datos) => guardarPerfil('proveedor', datos)}
        />

        <Seccion
          titulo="Líneas que distribuís"
          descripcion="Rubros activos y cuántos negocios los compran"
        >
          <ul className="pf-lineas">
            {lineasProveedor.map((l) => (
              <li key={l.id} className="pf-linea">
                <div className="pf-linea-top">
                  <strong>{l.nombre}</strong>
                  <span className={`pf-stock pf-stock--${l.stock}`}>
                    {ETIQUETA_STOCK[l.stock]}
                  </span>
                </div>
                <span className="pf-linea-pie">
                  <Icon name="store" size={13} /> {l.negocios} negocios abastecidos
                </span>
              </li>
            ))}
          </ul>
        </Seccion>

        <div className="pf-columnas">
          <Seccion titulo="Horario de atención" descripcion="Cuándo pueden contactarte los negocios">
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
            titulo="Reconocimientos"
            descripcion="Distinciones como proveedor"
            className="pf-seccion--lateral"
          >
            <Insignias items={insigniasPerfil.proveedor} />
          </Seccion>
        </div>

        <Seccion titulo="Actividad reciente" descripcion="Cotizaciones, pedidos y entregas">
          <Actividad items={actividadPerfil.proveedor} />
        </Seccion>
      </div>
    </div>
  )
}
