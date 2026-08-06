import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from '../icons/Icon'

/* ══════════════════════════════════════════════════════════════
   Piezas de la pantalla de configuraciones.

   Ninguna sabe qué ajustes existen: reciben la definición desde
   data/config_opciones.js y la dibujan. Por eso los tres roles
   usan exactamente los mismos componentes aunque su lista de
   ajustes no se parezca en nada.
   ══════════════════════════════════════════════════════════════ */

/* ── Barra superior ──────────────────────────────────────── */

// Barra fina con el botón que abre y cierra el panel, y la ruta
// donde estás. En laptop el botón colapsa el panel para ganar
// ancho; en celular abre el panel como cajón sobre el contenido.
export function ConfigTopbar({ navAbierta, onAlternarNav }) {
  const navigate = useNavigate()

  return (
    <header className="cfg-topbar">
      <button
        type="button"
        className="cfg-topbar-btn"
        onClick={onAlternarNav}
        aria-expanded={navAbierta}
        aria-controls="cfg-panel"
        aria-label={navAbierta ? 'Ocultar el panel de secciones' : 'Mostrar el panel de secciones'}
      >
        <Icon name="sliders" size={17} />
      </button>

      <span className="cfg-topbar-sep" aria-hidden="true" />

      <nav className="cfg-ruta" aria-label="Dónde estás">
        <button type="button" className="cfg-ruta-inicio" onClick={() => navigate('/inicio')}>
          Inicio
        </button>
        <Icon name="chevron-right" size={14} aria-hidden="true" />
        <span className="cfg-ruta-actual" aria-current="page">Configuración</span>
      </nav>

      <button
        type="button"
        className="cfg-topbar-volver"
        onClick={() => navigate(-1)}
        aria-label="Volver"
      >
        <Icon name="arrow-left" size={16} />
        <span>Volver</span>
      </button>
    </header>
  )
}

/* ── Encabezado de la página ─────────────────────────────── */

export function ConfigEncabezado({ titulo, subtitulo }) {
  return (
    <div className="cfg-encabezado">
      <h1>{titulo}</h1>
      <p>{subtitulo}</p>
    </div>
  )
}

/* ── Panel lateral de secciones ──────────────────────────── */

// Índice de la pantalla, siempre a la izquierda.
//
// En laptop es una columna fija que acompaña el scroll. En celular
// y tablet es el mismo panel, pero entra como cajón sobre el
// contenido, porque una columna lateral en 360px se comería la
// mitad del ancho útil.
//
// No cambia de pantalla al tocar: lleva a la sección dentro de la
// misma página. Así el buscador sigue funcionando sobre todo el
// contenido y no perdés de vista lo que ya configuraste.
export function ConfigNav({ secciones, activa, onIr, abierta, onCerrar, rol, pie }) {
  return (
    <>
      {/* Capa oscura detrás del cajón. Solo se ve en celular */}
      <div
        className={`cfg-nav-fondo ${abierta ? 'cfg-nav-fondo--visible' : ''}`}
        onClick={onCerrar}
        aria-hidden="true"
      />

      <aside
        id="cfg-panel"
        className={`cfg-nav ${abierta ? 'cfg-nav--abierta' : ''}`}
        aria-label="Secciones de configuración"
      >
        <div className="cfg-nav-marca">
          <span className="cfg-nav-logo" aria-hidden="true">
            <svg width="30" height="30" viewBox="0 0 72 72" fill="none">
              <circle cx="36" cy="36" r="36" fill="#003f5a" />
              <text
                x="36"
                y="45"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="32"
                fontWeight="800"
                fontFamily="Sora, Inter, sans-serif"
              >
                V
              </text>
            </svg>
          </span>
          <span className="cfg-nav-nombre">Vincco</span>

          {/* Cerrar el cajón: solo hace falta en celular */}
          <button
            type="button"
            className="cfg-nav-cerrar"
            onClick={onCerrar}
            aria-label="Cerrar el panel"
          >
            <Icon name="x" size={17} />
          </button>
        </div>

        <nav className="cfg-nav-cuerpo">
          <span className="cfg-nav-titulo">Configuración · {rol}</span>

          <ul className="cfg-nav-lista">
            {secciones.map((s) => {
              const esActiva = s.id === activa
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    className={`cfg-nav-item ${esActiva ? 'cfg-nav-item--activa' : ''}`}
                    onClick={() => onIr(s.id)}
                    aria-current={esActiva ? 'true' : undefined}
                  >
                    <Icon name={s.icono} size={17} className="cfg-nav-icono" />

                    <span className="cfg-nav-texto">
                      <span className="cfg-nav-label">{s.titulo}</span>
                      {s.resumen && <span className="cfg-nav-resumen">{s.resumen}</span>}
                    </span>

                    {/* Contador de pendientes: lo que necesita tu
                        atención se ve desde el índice */}
                    {s.pendientes > 0 && <span className="cfg-nav-badge">{s.pendientes}</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Accesos que no son secciones de esta página: van abajo,
            separados, para que no se confundan con el índice */}
        {pie?.length > 0 && (
          <div className="cfg-nav-pie">
            {pie.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`cfg-nav-pie-item ${item.peligro ? 'cfg-nav-pie-item--peligro' : ''}`}
                onClick={item.onClick}
              >
                <Icon name={item.icono} size={17} />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </aside>
    </>
  )
}

/* ── Interruptor ─────────────────────────────────────────── */

// Switch propio en vez de <input type="checkbox">: el nativo se ve
// distinto en cada navegador y en Android queda diminuto.
function Switch({ activo, onChange, deshabilitado, etiqueta }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      aria-label={etiqueta}
      disabled={deshabilitado}
      onClick={() => onChange(!activo)}
      className={`cfg-switch ${activo ? 'cfg-switch--on' : ''}`}
    >
      <motion.span
        className="cfg-switch-bola"
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 34 }}
      />
    </button>
  )
}

/* ── Selector de opciones ────────────────────────────────── */

// Para 2 o 3 alternativas cortas. Se ven todas a la vez, así el
// usuario no tiene que abrir un desplegable para saber qué hay.
function Opciones({ valor, opciones, onChange, deshabilitado, etiqueta }) {
  return (
    <div className="cfg-opciones" role="radiogroup" aria-label={etiqueta}>
      {opciones.map((op) => {
        const elegida = op.valor === valor
        return (
          <button
            key={String(op.valor)}
            type="button"
            role="radio"
            aria-checked={elegida}
            disabled={deshabilitado}
            onClick={() => onChange(op.valor)}
            className={`cfg-opcion ${elegida ? 'cfg-opcion--activa' : ''}`}
          >
            {op.label}
          </button>
        )
      })}
    </div>
  )
}

/* ── Número con más y menos ──────────────────────────────── */

// Botones grandes en vez de un input de teclado: la app apunta a
// gente con poca experiencia digital y escribir en un campo
// numérico en el celular es la parte que más se traba.
function Numero({ valor, onChange, min = 0, max = 999999, paso = 1, sufijo, deshabilitado, etiqueta }) {
  const numero = Number(valor) || 0
  const bajar = () => onChange(Math.max(min, numero - paso))
  const subir = () => onChange(Math.min(max, numero + paso))

  return (
    <div className="cfg-numero">
      <button
        type="button"
        className="cfg-numero-btn"
        onClick={bajar}
        disabled={deshabilitado || numero <= min}
        aria-label={`Bajar ${etiqueta}`}
      >
        <span aria-hidden="true">−</span>
      </button>

      <input
        type="number"
        className="cfg-numero-input"
        value={numero}
        min={min}
        max={max}
        disabled={deshabilitado}
        aria-label={etiqueta}
        onChange={(e) => {
          const n = Number(e.target.value)
          if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, n)))
        }}
      />

      <button
        type="button"
        className="cfg-numero-btn"
        onClick={subir}
        disabled={deshabilitado || numero >= max}
        aria-label={`Subir ${etiqueta}`}
      >
        <span aria-hidden="true">+</span>
      </button>

      {sufijo && <span className="cfg-numero-sufijo">{sufijo}</span>}
    </div>
  )
}

/* ── Fila de ajuste ──────────────────────────────────────── */

// Una fila por ajuste. El control de la derecha cambia según
// "tipo", pero la estructura (icono, texto, ayuda) es siempre la
// misma para que la pantalla se lea pareja de arriba a abajo.
export function Ajuste({ campo, valor, onChange, onAccion, bloqueado }) {
  const navigate = useNavigate()
  const deshabilitado = Boolean(bloqueado)

  const contenido = (
    <>
      <span className={`cfg-ajuste-icono ${campo.peligro ? 'cfg-ajuste-icono--peligro' : ''}`}>
        <Icon name={campo.icono} size={17} />
      </span>

      <span className="cfg-ajuste-texto">
        <span className={`cfg-ajuste-label ${campo.peligro ? 'cfg-ajuste-label--peligro' : ''}`}>
          {campo.label}
        </span>
        {campo.ayuda && <span className="cfg-ajuste-ayuda">{campo.ayuda}</span>}
      </span>
    </>
  )

  // Enlace y acción son filas enteras clickeables, no llevan control
  if (campo.tipo === 'enlace') {
    return (
      <button
        type="button"
        className="cfg-ajuste cfg-ajuste--clickeable"
        onClick={() => navigate(campo.ruta)}
      >
        {contenido}
        <Icon name="chevron-right" size={17} className="cfg-ajuste-flecha" />
      </button>
    )
  }

  if (campo.tipo === 'accion') {
    return (
      <button
        type="button"
        className={`cfg-ajuste cfg-ajuste--clickeable ${campo.peligro ? 'cfg-ajuste--peligro' : ''}`}
        onClick={() => onAccion(campo.accion)}
      >
        {contenido}
        <Icon name="chevron-right" size={17} className="cfg-ajuste-flecha" />
      </button>
    )
  }

  // Opciones y número ocupan mucho ancho: en celular el control baja
  // debajo del texto en vez de apretarse al lado. Se marca con una
  // clase en vez de usar :has() para que funcione en navegadores viejos.
  const controlAncho = campo.tipo === 'opciones' || campo.tipo === 'numero'

  return (
    <div
      className={`cfg-ajuste ${controlAncho ? 'cfg-ajuste--ancho' : ''} ${
        deshabilitado ? 'cfg-ajuste--inactivo' : ''
      }`}
    >
      {contenido}

      <div className="cfg-ajuste-control">
        {campo.tipo === 'switch' && (
          <Switch
            activo={Boolean(valor)}
            onChange={onChange}
            deshabilitado={deshabilitado}
            etiqueta={campo.label}
          />
        )}

        {campo.tipo === 'opciones' && (
          <Opciones
            valor={valor}
            opciones={campo.opciones}
            onChange={onChange}
            deshabilitado={deshabilitado}
            etiqueta={campo.label}
          />
        )}

        {campo.tipo === 'numero' && (
          <Numero
            valor={valor}
            onChange={onChange}
            min={campo.min}
            max={campo.max}
            paso={campo.paso}
            sufijo={campo.sufijo}
            deshabilitado={deshabilitado}
            etiqueta={campo.label}
          />
        )}

        {campo.tipo === 'info' && <span className="cfg-info-valor">{campo.valor}</span>}
      </div>
    </div>
  )
}

/* ── Grupo ───────────────────────────────────────────────── */

export function Grupo({ grupo, valores, onCambiar, onAccion, onRestablecer, innerRef, children }) {
  // Un ajuste con "depende" queda inactivo si el interruptor del
  // que depende está apagado: no tiene sentido elegir a qué hora
  // empieza el silencio si el silencio está desactivado.
  const estaBloqueado = (campo) => Boolean(campo.depende) && !valores[campo.depende]

  // Solo se puede restablecer lo que el usuario realmente puede tocar
  const clavesEditables = grupo.ajustes
    .filter((a) => ['switch', 'opciones', 'numero'].includes(a.tipo))
    .map((a) => a.id)

  return (
    // data-seccion lo lee el observador para saber qué sección se
    // está viendo y marcarla en el panel lateral
    <section className="cfg-grupo" ref={innerRef} data-seccion={grupo.id}>
      <div className="cfg-grupo-head">
        <span className="cfg-grupo-icono" aria-hidden="true">
          <Icon name={grupo.icono} size={17} />
        </span>

        <div className="cfg-grupo-texto">
          <h2>{grupo.titulo}</h2>
          {grupo.descripcion && <p>{grupo.descripcion}</p>}
        </div>

        {clavesEditables.length > 0 && (
          <button
            type="button"
            className="cfg-restablecer"
            onClick={() => onRestablecer(clavesEditables)}
            title="Volver a los valores de fábrica de esta sección"
          >
            Restablecer
          </button>
        )}
      </div>

      <div className="cfg-lista">
        {grupo.ajustes.map((campo) => (
          <Ajuste
            key={campo.id}
            campo={campo}
            valor={valores[campo.id]}
            bloqueado={estaBloqueado(campo)}
            onChange={(v) => onCambiar(campo.id, v)}
            onAccion={onAccion}
          />
        ))}
      </div>

      {children}
    </section>
  )
}

/* ── Aviso de guardado ───────────────────────────────────── */

// No hay botón de "Guardar": cada cambio se guarda solo. Este
// aviso existe para que el usuario sepa que pasó algo.
export function AvisoGuardado({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="cfg-aviso"
          role="status"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2 }}
        >
          <Icon name="check-circle" size={15} />
          Cambios guardados
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ── Confirmación ────────────────────────────────────────── */

// Para lo que no se puede deshacer. Nunca un window.confirm:
// no se puede estilar y en móvil se ve como un error del sistema.
export function Confirmacion({ abierto, titulo, mensaje, textoConfirmar, peligro, onConfirmar, onCancelar }) {
  return (
    <AnimatePresence>
      {abierto && (
        <>
          <motion.div
            className="cfg-modal-fondo"
            onClick={onCancelar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="cfg-modal"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={`cfg-modal-icono ${peligro ? 'cfg-modal-icono--peligro' : ''}`}>
              <Icon name={peligro ? 'alert-triangle' : 'help-circle'} size={22} />
            </span>

            <h3 className="cfg-modal-titulo">{titulo}</h3>
            <p className="cfg-modal-mensaje">{mensaje}</p>

            <div className="cfg-modal-acciones">
              <button type="button" className="cfg-btn cfg-btn--fantasma" onClick={onCancelar}>
                Cancelar
              </button>
              <button
                type="button"
                className={`cfg-btn ${peligro ? 'cfg-btn--peligro' : 'cfg-btn--solido'}`}
                onClick={onConfirmar}
              >
                {textoConfirmar}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ── Permisos de vitrina ─────────────────────────────────── */

// El mismo dato visto desde los dos lados del ecosistema:
//   modo="negocio"    -> "¿Dejás que este proveedor te muestre?"
//   modo="proveedor"  -> "¿Qué negocios me dejaron mostrarlos?"
// Está en un solo componente a propósito: si se construyeran por
// separado se desincronizarían y quedarían permisos fantasma.
const ETIQUETA_ESTADO = {
  autorizado: { label: 'Autorizado', icono: 'check-circle', tono: 'ok' },
  pendiente: { label: 'Pendiente', icono: 'clock', tono: 'espera' },
  rechazado: { label: 'Rechazado', icono: 'x', tono: 'no' },
}

export function PermisosVitrina({ permisos, modo, onResponder }) {
  if (!permisos.length) {
    return (
      <p className="cfg-vacio">
        {modo === 'negocio'
          ? 'Ningún proveedor te ha pedido permiso todavía.'
          : 'Todavía no le pediste permiso a ningún negocio.'}
      </p>
    )
  }

  return (
    <ul className="cfg-permisos">
      {permisos.map((p) => {
        const estado = ETIQUETA_ESTADO[p.estado]
        // El proveedor ve el estado pero no lo puede cambiar: la
        // decisión es del negocio. Solo el negocio ve los botones.
        const puedeResponder = modo === 'negocio'

        return (
          <li key={p.id} className="cfg-permiso">
            <span className="cfg-permiso-marca" style={{ background: p.color }}>
              <Icon name={modo === 'negocio' ? 'truck' : 'store'} size={15} />
            </span>

            <div className="cfg-permiso-info">
              <strong>{modo === 'negocio' ? p.proveedor : p.negocio}</strong>
              <span>{p.rubro} · {p.fecha}</span>
            </div>

            <span className={`cfg-permiso-estado cfg-permiso-estado--${estado.tono}`}>
              <Icon name={estado.icono} size={12} />
              {estado.label}
            </span>

            {puedeResponder && p.estado !== 'autorizado' && (
              <button
                type="button"
                className="cfg-permiso-btn cfg-permiso-btn--si"
                onClick={() => onResponder(p.id, 'autorizado')}
              >
                Autorizar
              </button>
            )}

            {puedeResponder && p.estado !== 'rechazado' && (
              <button
                type="button"
                className="cfg-permiso-btn cfg-permiso-btn--no"
                onClick={() => onResponder(p.id, 'rechazado')}
              >
                Rechazar
              </button>
            )}
          </li>
        )
      })}
    </ul>
  )
}
