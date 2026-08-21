import { Link } from 'react-router-dom'
import useStore from '../store/puntos_usestore'
import Icon from '../components/icons/Icon'
import {
  PerfilPagina,
  PerfilHero,
  CintaProgreso,
  VerificacionBanner,
  Seccion,
  Recibos,
  BloqueDatos,
  Insignias,
  Pasaporte,
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

/* Perfil del cliente — "Tu libreta Vincco".
 *
 * Lo que le importa es su progreso: cuantos puntos lleva, que tan lejos
 * esta del siguiente nivel y donde compra. Por eso el nivel va en la
 * portada, en el anillo de la foto y en la cinta, no escondido abajo.
 *
 * El nivel (Bronce, Plata, Oro, VIP) es interno de Vincco: sube segun
 * cuanto compra el cliente USANDO la plataforma, no por antiguedad ni por
 * nada externo. Los puntos son la medida de esas compras.
 * Todos los montos van en cordobas nicaraguenses, nunca en dolares.
 */

function nivelActual(puntos) {
  return [...niveles].reverse().find((n) => puntos >= n.puntosMin) || niveles[0]
}

function nivelSiguiente(puntos) {
  return niveles.find((n) => puntos < n.puntosMin) || null
}

// Nueva Guinea es el piloto: quien entro en 2026 es de los primeros.
// Se deduce del dato que ya existe, no hace falta un campo nuevo.
function esPionero(miembroDesde) {
  return /202[6]/.test(String(miembroDesde || ''))
}

export default function PerfilUsuario() {
  const usuario = useStore((s) => s.usuario)
  const perfil = useStore((s) => s.perfiles.usuario)
  const guardarPerfil = useStore((s) => s.guardarPerfil)
  const guardarFoto = useStore((s) => s.guardarFoto)
  const quitarFoto = useStore((s) => s.quitarFoto)
  // El ojo lee y escribe la misma preferencia que el interruptor
  // "Ocultar mis datos" de /config: no son dos ajustes distintos.
  const ocultarDatos = useStore((s) => s.configuraciones.usuario.ocultarDatos)
  const guardarConfig = useStore((s) => s.guardarConfig)
  const estadoVerificacion = useStore((s) => s.estadosVerificacion.usuario)

  const puntos = usuario.puntos
  const nivel = nivelActual(puntos)
  const siguiente = nivelSiguiente(puntos)

  // Cuanto falta para el proximo nivel, en porcentaje del tramo actual.
  const faltan = siguiente ? siguiente.puntosMin - puntos : 0
  const progreso = siguiente
    ? Math.min(100, ((puntos - nivel.puntosMin) / (siguiente.puntosMin - nivel.puntosMin)) * 100)
    : 100

  // El micro-copy sale de los mismos numeros que muestra el recibo, para
  // que nunca diga una cosa distinta de la que se ve arriba.
  const m = {}
  metricasPerfil.usuario.forEach((x) => { m[x.id] = x })

  return (
    <PerfilPagina rol="usuario" nivel={nivel.nivel}>
      <PerfilHero
        kicker="Tu libreta Vincco"
        nombre={perfil.nombre}
        subtitulo={`${perfil.barrio} · ${perfil.municipio}`}
        nivel={nivel.nivel}
        foto={perfil.foto}
        onFoto={(foto) => guardarFoto('usuario', foto)}
        onQuitarFoto={() => quitarFoto('usuario')}
        sellos={[
          ...(estadoVerificacion === 'aprobada'
            ? [{ label: 'Cliente verificado', icono: 'check-circle', destacado: true }]
            : []),
          ...(esPionero(perfil.miembroDesde)
            ? [{ label: `Pionero · ${perfil.miembroDesde}`, icono: 'award', pionero: true }]
            : [{ label: `Miembro desde ${perfil.miembroDesde}`, icono: 'calendar' }]),
        ]}
        extra={
          <CintaProgreso
            puntos={puntos}
            progreso={progreso}
            faltan={faltan}
            nivel={nivel}
            siguiente={siguiente}
            niveles={niveles}
          />
        }
      />

      <VerificacionBanner
        rol="usuario"
        estado={estadoVerificacion}
        texto="Para que tu perfil y tus reseñas aparezcan como Cliente verificado, podés solicitar la verificación de tu cuenta."
      />

      <div className="vc-perf__cuerpo">
        {/* Dos recibos, no cuatro cajas. El monto en cordobas queda con el
            mismo peso visual que las compras: para el usuario, el ahorro
            real es el valor real. */}
        <Recibos
          items={metricasPerfil.usuario}
          grupos={[
            {
              titulo: 'Tu recompensa',
              ids: ['ahorro', 'canjes'],
              nota: 'Cada canje es plata que se quedó en Nueva Guinea.',
              notaIcono: 'gift',
            },
            {
              titulo: 'Tu impacto local',
              ids: ['compras', 'favoritos'],
              nota: `Comprás en ${m.favoritos?.valor || 'varios'} negocios distintos del barrio. Así se construye barrio.`,
              notaIcono: 'flame',
            },
          ]}
        />

        <BloqueDatos
          documento="Credencial de comprador local"
          titulo="Tus datos"
          descripcion="Se usan para identificarte al canjear tus recompensas"
          campos={camposPerfil.usuario}
          valores={perfil}
          folioCampo="cedula"
          onGuardar={(datos) => guardarPerfil('usuario', datos)}
          ocultable
          ocultos={ocultarDatos}
          onOcultos={(v) => guardarConfig('usuario', 'ocultarDatos', v)}
        />

        <Seccion
          titulo="Mural de reconocimientos"
          descripcion="Los sellos que fuiste ganando comprando local"
        >
          <Insignias items={insigniasPerfil.usuario} />
        </Seccion>

        <Seccion
          titulo="Tu pasaporte de negocios"
          descripcion="De dónde sale cada parte de tus puntos"
          accion={
            <Link to="/favoritos" className="vc-perf-btn vc-perf-btn--linea">
              Ver favoritos
              <Icon name="chevron-right" size={14} />
            </Link>
          }
        >
          <Pasaporte items={favoritosPerfil} />
        </Seccion>

        <Seccion titulo="Tu extracto" descripcion="Movimientos de tu cuenta en Vincco">
          <Actividad
            items={actividadPerfil.usuario}
            resumenIcono="wallet"
            resumen={`${actividadPerfil.usuario.length} movimientos · llevás ${m.ahorro?.valor || 0} ${m.ahorro?.unidad || 'córdobas'} ahorrados`}
          />
        </Seccion>
      </div>
    </PerfilPagina>
  )
}
