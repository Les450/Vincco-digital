import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/puntos_usestore'
import Icon from '../components/icons/Icon'
import {
  ConfigTopbar,
  ConfigEncabezado,
  ConfigNav,
  Grupo,
  AvisoGuardado,
  Confirmacion,
  PermisosVitrina,
} from '../components/config/ConfigUI'
import { configPorRol, cabeceraConfig } from '../data/config_opciones'
import './Config.css'

/* ══════════════════════════════════════════════════════════════
   Configuraciones — una sola ruta (/config) para los tres roles.

   Mismo patrón que /perfil: la pantalla es una sola y lo que
   cambia es la lista de ajustes, que viene de config_opciones.js.
   Así, cuando agreguemos un ajuste para negocios, no hay que
   tocar este archivo.

   Lo único que se programa acá aparte de dibujar la lista son las
   dos secciones especiales de consentimiento (permisos de vitrina),
   porque no son un interruptor sino una relación entre dos cuentas.
   ══════════════════════════════════════════════════════════════ */

// El buscador ignora tildes: escribir "notificacion" encuentra
// "Notificaciones", que es como la gente escribe en el celular.
const ACENTOS = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ü: 'u', ñ: 'n' }

function normalizar(texto) {
  return (texto || '').toLowerCase().replace(/[áéíóúüñ]/g, (c) => ACENTOS[c])
}

function grupoCoincide(grupo, busqueda) {
  if (!busqueda) return grupo
  const q = normalizar(busqueda)

  // Si el título del grupo coincide, se muestra completo
  if (normalizar(grupo.titulo).includes(q)) return grupo

  const ajustes = grupo.ajustes.filter((a) =>
    normalizar(a.label).includes(q) || normalizar(a.ayuda).includes(q)
  )

  return ajustes.length ? { ...grupo, ajustes } : null
}

export default function Config() {
  const navigate = useNavigate()
  const userType = useStore((s) => s.userType)
  const configuraciones = useStore((s) => s.configuraciones)
  const guardarConfig = useStore((s) => s.guardarConfig)
  const restablecerConfig = useStore((s) => s.restablecerConfig)
  const permisosVitrina = useStore((s) => s.permisosVitrina)
  const responderPermisoVitrina = useStore((s) => s.responderPermisoVitrina)
  const setLoggedIn = useStore((s) => s.setLoggedIn)
  const perfil = useStore((s) => s.perfiles[userType])

  const [busqueda, setBusqueda] = useState('')
  const [aviso, setAviso] = useState(false)
  const [confirmacion, setConfirmacion] = useState(null)
  const [seccionActiva, setSeccionActiva] = useState(null)

  // El panel arranca abierto en laptop y cerrado en celular: ahí es
  // un cajón que tapa el contenido, así que no puede aparecer solo.
  const esAncho = () =>
    typeof window !== 'undefined' && window.matchMedia('(min-width: 1025px)').matches

  const [navAbierta, setNavAbierta] = useState(esAncho)

  // Si la ventana cruza el punto de quiebre (girar el celular,
  // achicar la ventana), el panel vuelve al estado que corresponde
  // a ese tamaño en vez de quedar en un estado raro.
  useEffect(() => {
    const consulta = window.matchMedia('(min-width: 1025px)')
    const alCambiar = (e) => setNavAbierta(e.matches)
    consulta.addEventListener('change', alCambiar)
    return () => consulta.removeEventListener('change', alCambiar)
  }, [])

  // En celular el cajón tapa la pantalla: cerrarlo con Escape es lo
  // que espera cualquiera que use teclado.
  useEffect(() => {
    if (!navAbierta) return undefined
    const alTeclear = (e) => {
      if (e.key === 'Escape' && !esAncho()) setNavAbierta(false)
    }
    window.addEventListener('keydown', alTeclear)
    return () => window.removeEventListener('keydown', alTeclear)
  }, [navAbierta])

  // Un ref por sección, para poder llevar el scroll hasta ella y
  // para que el observador sepa cuál se está viendo.
  const refsSecciones = useRef({})
  const registrarSeccion = useCallback((id) => (nodo) => {
    if (nodo) refsSecciones.current[id] = nodo
    else delete refsSecciones.current[id]
  }, [])

  const cabecera = cabeceraConfig[userType] || cabeceraConfig.usuario
  const grupos = configPorRol[userType] || configPorRol.usuario
  const valores = configuraciones[userType] || {}

  const gruposVisibles = useMemo(
    () => grupos.map((g) => grupoCoincide(g, busqueda)).filter(Boolean),
    [grupos, busqueda]
  )

  // El aviso de "guardado" se esconde solo a los 2 segundos
  useEffect(() => {
    if (!aviso) return undefined
    const id = setTimeout(() => setAviso(false), 2000)
    return () => clearTimeout(id)
  }, [aviso])

  const cambiar = (clave, valor) => {
    guardarConfig(userType, clave, valor)
    setAviso(true)
  }

  const restablecer = (claves) => {
    restablecerConfig(userType, claves)
    setAviso(true)
  }

  // Las acciones destructivas pasan siempre por confirmación
  const ejecutarAccion = (accion) => {
    if (accion === 'cerrarSesion') {
      setConfirmacion({
        titulo: '¿Cerrar sesión?',
        mensaje: 'Vas a volver a la pantalla de inicio. Tus puntos y tu configuración se mantienen.',
        textoConfirmar: 'Cerrar sesión',
        peligro: false,
        alConfirmar: () => {
          setLoggedIn(false)
          navigate('/login')
        },
      })
    }

    if (accion === 'eliminarCuenta') {
      setConfirmacion({
        titulo: '¿Eliminar tu cuenta?',
        mensaje:
          'Se borran tus datos y perdés los puntos que llevás acumulados. Esta acción no se puede deshacer.',
        textoConfirmar: 'Sí, eliminar',
        peligro: true,
        // Todavía no hay backend: por ahora solo cierra la sesión.
        // Cuando exista la API, acá va la llamada de baja.
        alConfirmar: () => {
          setLoggedIn(false)
          navigate('/login')
        },
      })
    }
  }

  // ── Secciones de consentimiento ──────────────────────────
  // El negocio ve las solicitudes que recibió; el proveedor ve el
  // estado de las que él pidió. Es la misma lista filtrada distinto.
  const misPermisos = useMemo(() => {
    if (userType === 'negocio') {
      return permisosVitrina.filter((p) => p.negocio === perfil?.nombre)
    }
    if (userType === 'proveedor') {
      return permisosVitrina.filter((p) => p.proveedor === perfil?.nombre)
    }
    return []
  }, [permisosVitrina, userType, perfil])

  const autorizados = misPermisos.filter((p) => p.estado === 'autorizado').length
  const pendientes = misPermisos.filter((p) => p.estado === 'pendiente').length

  const mostrarPermisos = userType === 'negocio' || userType === 'proveedor'
  const coincidePermisos =
    !busqueda ||
    normalizar('vitrina permisos proveedores clientes consentimiento').includes(normalizar(busqueda))

  const hayPermisos = mostrarPermisos && coincidePermisos

  // Lo que lista el panel lateral. Se arma de lo que realmente está
  // en pantalla, así al buscar el índice se recorta solo y nunca te
  // ofrece ir a una sección que no existe.
  const secciones = useMemo(() => {
    const lista = []
    if (hayPermisos) {
      lista.push({
        id: 'permisos',
        titulo: userType === 'negocio' ? 'Quién puede mostrarme' : 'Mi vitrina de clientes',
        resumen: userType === 'negocio' ? 'Permisos de proveedores' : 'Negocios que autorizaron',
        icono: 'handshake',
        pendientes: userType === 'negocio' ? pendientes : 0,
      })
    }
    gruposVisibles.forEach((g) =>
      lista.push({ id: g.id, titulo: g.titulo, resumen: g.descripcion, icono: g.icono })
    )
    return lista
  }, [hayPermisos, gruposVisibles, userType, pendientes])

  // Marca en el panel la sección que estás viendo. La franja de
  // detección es el tercio superior de la pantalla: es donde la
  // vista se siente "posada" al hacer scroll.
  useEffect(() => {
    const nodos = secciones
      .map((s) => refsSecciones.current[s.id])
      .filter(Boolean)

    if (!nodos.length || typeof IntersectionObserver === 'undefined') return undefined

    const observador = new IntersectionObserver(
      (entradas) => {
        const visible = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]

        if (visible?.target?.dataset?.seccion) {
          setSeccionActiva(visible.target.dataset.seccion)
        }
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    )

    nodos.forEach((n) => observador.observe(n))
    return () => observador.disconnect()
  }, [secciones])

  const irASeccion = (id) => {
    const nodo = refsSecciones.current[id]
    if (!nodo) return
    setSeccionActiva(id)
    // En celular el cajón tapa el contenido: se cierra al elegir,
    // si no, tocás una sección y no la ves.
    if (!esAncho()) setNavAbierta(false)
    nodo.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Atajos del pie del panel: no son secciones de esta página,
  // por eso van separados abajo y no en el índice.
  const pieDelPanel = [
    { id: 'perfil', icono: 'user', label: 'Mi perfil', onClick: () => navigate('/perfil') },
    { id: 'ayuda', icono: 'headphones', label: 'Ayuda y soporte', onClick: () => navigate('/ayuda') },
    {
      id: 'salir',
      icono: 'log-out',
      label: 'Cerrar sesión',
      peligro: true,
      onClick: () => ejecutarAccion('cerrarSesion'),
    },
  ]

  return (
    // El acento del rol se define acá arriba para que lo hereden
    // tanto la barra superior como el panel lateral
    <div
      className={`cfg ${navAbierta ? 'cfg--con-panel' : ''}`}
      style={{ '--cfg-acento': cabecera.acento }}
    >
      {/* Panel izquierdo: índice de lo que hay en la página.
          Columna fija en laptop, cajón deslizable en celular. */}
      <ConfigNav
        secciones={secciones}
        activa={seccionActiva}
        onIr={irASeccion}
        abierta={navAbierta}
        onCerrar={() => setNavAbierta(false)}
        rol={cabecera.rol}
        pie={pieDelPanel}
      />

      <div className="cfg-principal">
        <ConfigTopbar navAbierta={navAbierta} onAlternarNav={() => setNavAbierta((v) => !v)} />

        <div className="cfg-body">
          <div className="cfg-contenido">
            <ConfigEncabezado titulo={cabecera.titulo} subtitulo={cabecera.subtitulo} />
            {/* Con 8 secciones y más de 30 ajustes, buscar es más rápido
                que hacer scroll. Sobre todo en celular. */}
            <div className="cfg-buscador">
              <Icon name="search" size={17} />
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar un ajuste…"
                aria-label="Buscar un ajuste"
              />
              {busqueda && (
                <button type="button" onClick={() => setBusqueda('')} aria-label="Limpiar búsqueda">
                  <Icon name="x" size={15} />
                </button>
              )}
            </div>
    
            {hayPermisos && (
              <section
                className="cfg-grupo cfg-grupo--destacado"
                ref={registrarSeccion('permisos')}
                data-seccion="permisos"
              >
                <div className="cfg-grupo-head">
                  <span className="cfg-grupo-icono" aria-hidden="true">
                    <Icon name="handshake" size={17} />
                  </span>
                  <div className="cfg-grupo-texto">
                    <h2>
                      {userType === 'negocio' ? 'Quién puede mostrarme' : 'Mi vitrina de clientes'}
                    </h2>
                    <p>
                      {userType === 'negocio'
                        ? 'Proveedores que pidieron mostrarte públicamente como cliente suyo'
                        : 'Negocios que autorizaron aparecer en tu perfil. Solo se muestran los autorizados'}
                    </p>
                  </div>
                </div>
    
                <div className="cfg-permisos-resumen">
                  <span className="cfg-pastilla cfg-pastilla--ok">
                    <Icon name="check-circle" size={13} /> {autorizados} autorizados
                  </span>
                  {pendientes > 0 && (
                    <span className="cfg-pastilla cfg-pastilla--espera">
                      <Icon name="clock" size={13} /> {pendientes} pendientes
                    </span>
                  )}
                </div>
    
                <PermisosVitrina
                  permisos={misPermisos}
                  modo={userType}
                  onResponder={(id, estado) => {
                    responderPermisoVitrina(id, estado)
                    setAviso(true)
                  }}
                />
    
                {userType === 'proveedor' && (
                  <p className="cfg-nota">
                    <Icon name="info" size={13} />
                    No podés autorizarte solo: la decisión es de cada negocio. Vos pedís, ellos deciden.
                  </p>
                )}
              </section>
            )}
    
            {gruposVisibles.map((grupo) => (
              <Grupo
                key={grupo.id}
                grupo={grupo}
                valores={valores}
                onCambiar={cambiar}
                onAccion={ejecutarAccion}
                onRestablecer={restablecer}
                innerRef={registrarSeccion(grupo.id)}
              />
            ))}
    
            {!gruposVisibles.length && !hayPermisos && (
              <p className="cfg-vacio cfg-vacio--busqueda">
                No encontramos ningún ajuste con “{busqueda}”.
              </p>
            )}
          </div>
        </div>
      </div>

      <AvisoGuardado visible={aviso} />

      <Confirmacion
        abierto={Boolean(confirmacion)}
        titulo={confirmacion?.titulo}
        mensaje={confirmacion?.mensaje}
        textoConfirmar={confirmacion?.textoConfirmar}
        peligro={confirmacion?.peligro}
        onCancelar={() => setConfirmacion(null)}
        onConfirmar={() => {
          confirmacion?.alConfirmar?.()
          setConfirmacion(null)
        }}
      />
    </div>
  )
}
