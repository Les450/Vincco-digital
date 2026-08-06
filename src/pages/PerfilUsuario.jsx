import { Link } from 'react-router-dom'
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
  favoritosPerfil,
  niveles,
} from '../data/data_falso'

// Perfil del cliente. Lo que le importa es su progreso: cuantos
// puntos lleva, que tan lejos esta del siguiente nivel y donde
// compra. Por eso el nivel va en el encabezado y no escondido abajo.
//
// El nivel (Bronce, Plata, Oro, VIP) es interno de Vincco: sube segun
// cuanto compra el cliente USANDO la plataforma, no por antiguedad ni
// por nada externo. Los puntos son la medida de esas compras.
// Todos los montos van en cordobas nicaraguenses (C$), nunca en dolares.

function nivelActual(puntos) {
  return [...niveles].reverse().find((n) => puntos >= n.puntosMin) || niveles[0]
}

function nivelSiguiente(puntos) {
  return niveles.find((n) => puntos < n.puntosMin) || null
}

export default function PerfilUsuario() {
  const usuario = useStore((s) => s.usuario)
  const perfil = useStore((s) => s.perfiles.usuario)
  const guardarPerfil = useStore((s) => s.guardarPerfil)
  const guardarFoto = useStore((s) => s.guardarFoto)
  const quitarFoto = useStore((s) => s.quitarFoto)

  const puntos = usuario.puntos
  const nivel = nivelActual(puntos)
  const siguiente = nivelSiguiente(puntos)

  // Cuanto falta para el proximo nivel, en porcentaje del tramo actual.
  const faltan = siguiente ? siguiente.puntosMin - puntos : 0
  const progreso = siguiente
    ? Math.min(100, ((puntos - nivel.puntosMin) / (siguiente.puntosMin - nivel.puntosMin)) * 100)
    : 100

  return (
    <div className="pf pf--usuario">
      <PerfilHero
        kicker="Cuenta de cliente"
        nombre={perfil.nombre}
        subtitulo={`${perfil.barrio}, ${perfil.municipio} · miembro desde ${perfil.miembroDesde}`}
        acento="#dd6600"
        foto={perfil.foto}
        onFoto={(foto) => guardarFoto('usuario', foto)}
        onQuitarFoto={() => quitarFoto('usuario')}
        chips={[
          { label: `Nivel ${nivel.nivel}`, icono: nivel.icono, destacado: true },
          { label: `${puntos} puntos`, icono: 'star' },
          { label: 'Cuenta verificada', icono: 'check-circle' },
        ]}
        extra={
          <div className="pf-nivel">
            <div className="pf-nivel-top">
              <span className="pf-nivel-label">Nivel Vincco · subís comprando con la app</span>
              <span className="pf-nivel-valor">{puntos} pts</span>
            </div>

            <div className="pf-barra" role="presentation">
              <span className="pf-barra-relleno" style={{ width: `${progreso}%` }} />
            </div>

            <p className="pf-nivel-pie">
              {siguiente
                ? <>Te faltan <strong>{faltan} puntos</strong> para llegar a {siguiente.nivel}</>
                : <>Alcanzaste el nivel máximo. Seguí sumando para mantenerlo.</>}
            </p>
          </div>
        }
      />

      <div className="pf-body">
        <Metricas items={metricasPerfil.usuario} />

        <div className="pf-columnas">
          <BloqueDatos
            titulo="Datos personales"
            descripcion="Se usan para identificarte al canjear tus recompensas"
            campos={camposPerfil.usuario}
            valores={perfil}
            onGuardar={(datos) => guardarPerfil('usuario', datos)}
            ocultable
          />

          <Seccion
            titulo="Logros"
            descripcion="Insignias que ganaste comprando local"
            className="pf-seccion--lateral"
          >
            <Insignias items={insigniasPerfil.usuario} />
          </Seccion>
        </div>

        <Seccion
          titulo="Negocios favoritos"
          descripcion="Los comercios donde más puntos acumulás"
          accion={
            <Link to="/favoritos" className="pf-btn pf-btn--linea">
              Ver favoritos
              <Icon name="chevron-right" size={14} />
            </Link>
          }
        >
          <ul className="pf-favoritos">
            {favoritosPerfil.map((f) => (
              <li key={f.id} className="pf-favorito">
                <span className="pf-favorito-marca" style={{ background: f.color }}>
                  <Icon name="store" size={16} />
                </span>
                <span className="pf-favorito-info">
                  <strong>{f.nombre}</strong>
                  <span>{f.categoria}</span>
                </span>
                <span className="pf-favorito-puntos">{f.puntos}</span>
              </li>
            ))}
          </ul>
        </Seccion>

        <Seccion titulo="Actividad reciente" descripcion="Tus últimos movimientos en Vincco">
          <Actividad items={actividadPerfil.usuario} />
        </Seccion>
      </div>
    </div>
  )
}
