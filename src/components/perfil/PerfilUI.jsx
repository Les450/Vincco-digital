import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from '../icons/Icon'
import BotonVolver from '../BotonVolver'
import useStore from '../../store/puntos_usestore'

/* ══════════════════════════════════════════════════════════════════════
   Piezas compartidas por los tres perfiles (cliente, negocio, proveedor).

   La idea: el perfil es una LIBRETA, no un muro social. Portada de tinta,
   hojas de papel hueso y sellos de caucho. Todo lo que la persona
   acumulo se muestra como recibo, no como caja con numero.

   Nada de esto toca los datos: se leen los mismos objetos de
   data_falso.js y del store, y lo que falta se DEDUCE de ellos
   (el porcentaje del pasaporte, el tipo de movimiento, la fecha del
   sello). Si algun dia esos campos vienen del backend, no hay que
   cambiar una sola linea de aca.
   ══════════════════════════════════════════════════════════════════════ */

/* ── Utilidades ──────────────────────────────────────────────────────── */

// "Ferreteria Don Chico" -> "FD" · "Leslie" -> "LE"
function iniciales(nombre) {
  const partes = (nombre || '').trim().split(/\s+/).filter(Boolean)
  if (!partes.length) return '?'
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[1][0]).toUpperCase()
}

// Solo los digitos de "50 pts" -> 50. Sirve para repartir el pasaporte
// sin tener que cambiar el formato de los datos.
function soloNumero(valor) {
  const n = parseInt(String(valor ?? '').replace(/[^\d]/g, ''), 10)
  return Number.isFinite(n) ? n : 0
}

const PESO_MAXIMO_MB = 5
const LADO_MAXIMO = 512

// Reduce la imagen antes de guardarla. Una foto de celular pesa varios MB
// y en base64 crece un tercio mas; recortada a 512px el avatar se ve
// igual de nitido y ocupa poquisimo.
function comprimirImagen(archivo) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader()
    lector.onerror = () => reject(new Error('No se pudo leer el archivo'))
    lector.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('El archivo no es una imagen válida'))
      img.onload = () => {
        const lado = Math.min(img.width, img.height)
        const origenX = (img.width - lado) / 2
        const origenY = (img.height - lado) / 2
        const destino = Math.min(lado, LADO_MAXIMO)

        const lienzo = document.createElement('canvas')
        lienzo.width = destino
        lienzo.height = destino
        const ctx = lienzo.getContext('2d')
        ctx.drawImage(img, origenX, origenY, lado, lado, 0, 0, destino, destino)

        resolve(lienzo.toDataURL('image/jpeg', 0.82))
      }
      img.src = lector.result
    }
    lector.readAsDataURL(archivo)
  })
}

/* ══════════════════════════════════════════════════════════════════════
   1 · LA PÁGINA
   Envuelve todo y define el color del rol y el del nivel. Los componentes
   de adentro nunca escriben un color: leen --pf-rol y --pf-nivel.
   ══════════════════════════════════════════════════════════════════════ */

export function PerfilPagina({ rol = 'usuario', nivel, children }) {
  const claseNivel = nivel
    ? ` vc-perf--nivel-${String(nivel).toLowerCase()}`
    : ''
  return (
    <div className={`vc-perf vc-perf--${rol}${claseNivel}`}>
      {children}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   2 · EL ANILLO DE NIVEL
   El aro alrededor de la foto no es adorno: dice en que nivel esta la
   persona. Por eso ademas lleva el nombre del nivel escrito abajo — si
   fuera solo color, quien no distingue tonos no se enteraria.
   ══════════════════════════════════════════════════════════════════════ */

function AnilloPerfil({ nombre, foto, onFoto, onQuitarFoto, nivel }) {
  const inputRef = useRef(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const editable = typeof onFoto === 'function'

  const elegir = async (e) => {
    const archivo = e.target.files?.[0]
    // Se limpia el input para que elegir la misma foto otra vez
    // vuelva a disparar el onChange
    e.target.value = ''
    if (!archivo) return

    if (!archivo.type.startsWith('image/')) {
      setError('Elegí un archivo de imagen (JPG o PNG)')
      return
    }
    if (archivo.size > PESO_MAXIMO_MB * 1024 * 1024) {
      setError(`La imagen no puede pesar más de ${PESO_MAXIMO_MB} MB`)
      return
    }

    setError('')
    setCargando(true)
    try {
      const dataUrl = await comprimirImagen(archivo)
      onFoto(dataUrl)
    } catch {
      setError('No se pudo procesar la imagen. Probá con otra.')
    } finally {
      setCargando(false)
    }
  }

  const interior = foto
    ? <img src={foto} alt="" className="vc-perf-anillo__img" />
    : <span aria-hidden="true">{iniciales(nombre)}</span>

  return (
    <div className="vc-perf-anillo">
      {editable ? (
        <button
          type="button"
          className="vc-perf-anillo__disco"
          onClick={() => inputRef.current?.click()}
          aria-label={foto ? 'Cambiar foto de perfil' : 'Subir foto de perfil'}
          data-cargando={cargando ? 'true' : undefined}
        >
          {interior}
          <span className="vc-perf-anillo__capa" aria-hidden="true">
            <Icon name="camera" size={20} />
          </span>
        </button>
      ) : (
        <div className="vc-perf-anillo__disco">{interior}</div>
      )}

      {editable && (
        <input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={elegir}
          className="vc-perf-input-oculto"
          tabIndex={-1}
        />
      )}

      {editable && foto && (
        <button
          type="button"
          className="vc-perf-anillo__quitar"
          onClick={onQuitarFoto}
          aria-label="Quitar foto de perfil"
        >
          <Icon name="trash-2" size={13} />
        </button>
      )}

      {nivel && <span className="vc-perf-anillo__nivel">{nivel}</span>}

      <AnimatePresence>
        {error && (
          <motion.p
            className="vc-perf-error-foto"
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   3 · LA PORTADA
   Nada de "foto redonda gigante centrada + nombre + tres iconos". La
   identidad va a la izquierda, en linea, como el encabezado de un
   documento: primero que documento es, despues de quien.
   ══════════════════════════════════════════════════════════════════════ */

export function PerfilHero({
  kicker,
  nombre,
  subtitulo,
  sellos = [],
  chips = [],            // alias viejo: se sigue aceptando
  extra,
  acciones,
  esquina,
  foto,
  onFoto,
  onQuitarFoto,
  nivel,
}) {
  const marcas = sellos.length ? sellos : chips

  return (
    <header className="vc-perf-portada">
      <div className="vc-perf-portada__trama" aria-hidden="true" />

      {/* El boton es el mismo de Calendario y Avisos; la clase de la
          portada solo lo posiciona. */}
      <div className="vc-perf-portada__volver">
        <BotonVolver tono="tinta" />
      </div>

      {esquina && <div className="vc-perf-portada__esquina">{esquina}</div>}

      <div className="vc-perf-portada__interior">
        <div>
          <p className="vc-perf-etiqueta vc-perf-portada__kicker">{kicker}</p>

          <div className="vc-perf-identidad">
            <AnilloPerfil
              nombre={nombre}
              foto={foto}
              onFoto={onFoto}
              onQuitarFoto={onQuitarFoto}
              nivel={nivel}
            />

            <div className="vc-perf-identidad__texto">
              <h1 className="vc-perf-nombre">{nombre}</h1>
              {subtitulo && <p className="vc-perf-sub">{subtitulo}</p>}
            </div>
          </div>

          {marcas.length > 0 && (
            <ul className="vc-perf-sellos">
              {marcas.map((s) => (
                <li
                  key={s.label}
                  className={
                    'vc-perf-sello' +
                    (s.destacado ? ' vc-perf-sello--tinta' : '') +
                    (s.pionero ? ' vc-perf-sello--pionero' : '')
                  }
                >
                  {s.icono && <Icon name={s.icono} size={13} />}
                  {s.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {extra}
      </div>

      {acciones && <div className="vc-perf-portada__acciones">{acciones}</div>}
    </header>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   4 · LA CINTA DE PROGRESO
   La barra plana no decia nada: "68%" no es una meta. La cinta muestra
   las cuatro paradas del recorrido y donde estas parado. Los puntos y
   los que faltan van arriba, en cifra tabular, para que se lean como un
   monto real y no como un marcador de videojuego.

   El arco dorado solo funciona sobre fondo oscuro: sobre pista clara da
   1.60:1. Por eso la cinta vive en la portada y en ningun otro lado.
   ══════════════════════════════════════════════════════════════════════ */

export function CintaProgreso({
  puntos = 0,
  progreso = 0,
  faltan = 0,
  nivel,
  siguiente,
  niveles = [],
}) {
  const [ancho, setAncho] = useState(0)
  const [subio, setSubio] = useState(false)
  const nivelPrevio = useRef(nivel?.nivel)

  // Al entrar, la cinta se llena desde cero: el gesto cuenta la historia
  // ("llegaste hasta acá"), no solo el estado final.
  useEffect(() => {
    const t = requestAnimationFrame(() => setAncho(progreso))
    return () => cancelAnimationFrame(t)
  }, [progreso])

  // Subida de nivel: confeti ambar, corto y una sola vez.
  useEffect(() => {
    if (nivelPrevio.current && nivel?.nivel && nivelPrevio.current !== nivel.nivel) {
      setSubio(true)
      const t = setTimeout(() => setSubio(false), 1100)
      return () => clearTimeout(t)
    }
    nivelPrevio.current = nivel?.nivel
  }, [nivel])

  const indiceActual = niveles.findIndex((n) => n.nivel === nivel?.nivel)

  return (
    <div className="vc-perf-cinta" data-subio={subio ? 'true' : undefined}>
      {subio && (
        <span className="vc-perf-cinta__confeti" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <i
              key={i}
              style={{
                left: `${6 + i * 6.6}%`,
                '--d': `${i * 45}ms`,
                '--c': i % 3 === 0 ? '#fece90' : i % 3 === 1 ? '#fea02f' : '#de8b27',
              }}
            />
          ))}
        </span>
      )}

      <div className="vc-perf-cinta__top">
        <span className="vc-perf-cinta__puntos">
          <span className="vc-perf-cifra">{puntos}</span>
          <span className="vc-perf-cinta__unidad">puntos</span>
        </span>

        <span className="vc-perf-cinta__falta">
          {siguiente ? (
            <>Te faltan <strong>{faltan}</strong> para {siguiente.nivel}</>
          ) : (
            <>Llegaste al nivel máximo. Seguí sumando para mantenerlo.</>
          )}
        </span>
      </div>

      <div
        className="vc-perf-cinta__pista"
        role="progressbar"
        aria-valuenow={Math.round(progreso)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={
          siguiente
            ? `${Math.round(progreso)} por ciento del camino a nivel ${siguiente.nivel}`
            : 'Nivel máximo alcanzado'
        }
      >
        <span className="vc-perf-cinta__relleno" style={{ width: `${ancho}%` }} />
      </div>

      {niveles.length > 0 && (
        <ul className="vc-perf-cinta__hitos">
          {niveles.map((n, i) => (
            <li
              key={n.nivel}
              className={
                'vc-perf-cinta__hito' +
                (i < indiceActual ? ' vc-perf-cinta__hito--hecho' : '') +
                (i === indiceActual ? ' vc-perf-cinta__hito--actual' : '')
              }
            >
              {n.nivel}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   5 · VERIFICACIÓN
   Igual que antes en comportamiento: no se dibuja si ya esta aprobada.
   ══════════════════════════════════════════════════════════════════════ */

export function VerificacionBanner({ rol, estado, texto }) {
  const abrirKYC = useStore((s) => s.abrirKYC)
  const marcarVerificadoDemo = useStore((s) => s.marcarVerificadoDemo)

  if (estado === 'aprobada') return null

  const pendiente = estado === 'pendiente'

  return (
    <div className={`vc-perf-verif ${pendiente ? 'vc-perf-verif--pendiente' : ''}`}>
      <span className="vc-perf-verif__icono" aria-hidden="true">
        <Icon name={pendiente ? 'help-circle' : 'insignia-verificado'} size={18} />
      </span>

      <div className="vc-perf-verif__texto">
        <strong>
          {pendiente ? 'Tu verificación está en revisión' : 'Todavía no solicitaste la verificación'}
        </strong>
        <p>
          {pendiente
            ? 'El equipo de Vincco la está revisando. Te llega la confirmación a tu correo electrónico apenas quede aprobada.'
            : texto}
        </p>
      </div>

      <div className="vc-perf-verif__acciones">
        {!pendiente && (
          <button
            type="button"
            className="vc-perf-btn vc-perf-btn--solido"
            onClick={() => abrirKYC(rol)}
          >
            Solicitar verificación
          </button>
        )}
        {/* Sin backend no hay equipo real que apruebe la solicitud: este
            boton simula esa aprobacion para seguir probando la cuenta ya
            verificada, sin tocar localStorage a mano. */}
        <button
          type="button"
          className="vc-perf-btn vc-perf-btn--linea"
          onClick={() => marcarVerificadoDemo(rol)}
          title="Solo para pruebas: aprueba la verificación sin revisión real"
        >
          Marcar verificado (demo)
        </button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   6 · SECCIÓN (la hoja de papel)
   ══════════════════════════════════════════════════════════════════════ */

export function Seccion({ titulo, descripcion, accion, children, className = '' }) {
  return (
    <section className={`vc-perf-hoja ${className}`}>
      <div className="vc-perf-hoja__head">
        <div>
          <h2 className="vc-perf-hoja__titulo">{titulo}</h2>
          {descripcion && <p className="vc-perf-hoja__desc">{descripcion}</p>}
        </div>
        {accion && <div className="vc-perf-hoja__acciones">{accion}</div>}
      </div>
      {children}
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   7 · RECIBOS
   Cuatro cajas iguales obligan a leer cuatro veces y no dicen que es lo
   importante. Dos recibos si: cada uno tiene UN monto heroe y un dato de
   apoyo debajo de la linea de corte.

   El monto en cordobas queda con el mismo peso visual que los puntos,
   porque para el usuario nicaraguense el ahorro real ES el valor.

   Sobre la moneda: el proyecto ya decidio (utils/moneda.js) escribir
   "cordobas" con todas sus letras en los montos destacados, porque "C$"
   se lee como dolar canadiense fuera de Nicaragua y los traductores del
   navegador lo convierten. Aca se respeta esa decision: el simbolo queda
   para los precios cortos en linea.
   ══════════════════════════════════════════════════════════════════════ */

function FilaApoyo({ m }) {
  return (
    <div className="vc-perf-apoyo">
      <span className="vc-perf-cifra">{m.valor}</span>
      <span className="vc-perf-apoyo__texto">
        <span className="vc-perf-apoyo__label">
          {m.unidad ? `${m.unidad} · ${m.label}` : m.label}
        </span>
        {m.detalle && <span className="vc-perf-apoyo__detalle">{m.detalle}</span>}
      </span>
      {m.enlace && (
        <Link to={m.enlace} className="vc-perf-apoyo__enlace">
          {m.enlaceLabel || 'Ver más'}
          <Icon name="chevron-right" size={13} />
        </Link>
      )}
    </div>
  )
}

export function Recibos({ items = [], grupos }) {
  const porId = {}
  items.forEach((m) => { porId[m.id] = m })

  // Sin configuracion de grupos, se parte al medio. Asi el componente
  // sigue funcionando aunque le pasen una lista suelta.
  const definicion = grupos && grupos.length
    ? grupos
    : [
        { titulo: 'Tu movimiento', ids: items.slice(0, 2).map((m) => m.id) },
        { titulo: 'Tu recompensa', ids: items.slice(2).map((m) => m.id) },
      ]

  return (
    <div className="vc-perf-recibos">
      {definicion.map((g) => {
        const suyos = (g.ids || []).map((id) => porId[id]).filter(Boolean)
        if (!suyos.length) return null
        const [heroe, ...resto] = suyos

        return (
          <div className="vc-perf-recibo" key={g.titulo}>
            <div className="vc-perf-recibo__hoja">
              <p className="vc-perf-etiqueta vc-perf-recibo__titulo">{g.titulo}</p>

              <span className="vc-perf-monto">
                <span className="vc-perf-cifra">{heroe.valor}</span>
                <span className="vc-perf-monto__unidad">
                  {heroe.unidad ? `${heroe.unidad} · ${heroe.label}` : heroe.label}
                </span>
                {heroe.detalle && (
                  <span className="vc-perf-monto__detalle">{heroe.detalle}</span>
                )}
              </span>

              {heroe.enlace && (
                <p className="vc-perf-recibo__atajo">
                  <Link to={heroe.enlace} className="vc-perf-apoyo__enlace">
                    {heroe.enlaceLabel || 'Ver más'}
                    <Icon name="chevron-right" size={13} />
                  </Link>
                </p>
              )}

              {resto.length > 0 && <hr className="vc-perf-recibo__corte" />}
              {resto.map((m) => <FilaApoyo key={m.id} m={m} />)}

              {g.nota && (
                <p className="vc-perf-recibo__nota">
                  <Icon name={g.notaIcono || 'flame'} size={15} />
                  {g.nota}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Alias por compatibilidad: si alguna pantalla vieja sigue llamando
// <Metricas items={...} />, sigue funcionando y se ve como recibo.
export function Metricas({ items }) {
  return <Recibos items={items} />
}

/* ══════════════════════════════════════════════════════════════════════
   8 · PRIVACIDAD (sin cambios de comportamiento)
   ══════════════════════════════════════════════════════════════════════ */

const CLAVE_PRIVACIDAD = 'vincco:perfil:datos-ocultos'

function leerPreferencia(clave) {
  try {
    return window.localStorage.getItem(clave) === '1'
  } catch {
    return false
  }
}

function guardarPreferencia(clave, oculto) {
  try {
    window.localStorage.setItem(clave, oculto ? '1' : '0')
  } catch {
    // Si no se puede guardar, la preferencia dura solo esta sesion
  }
}

// Enmascara dejando una pista para que el dueño reconozca el dato sin
// exponerlo: el correo conserva inicial y dominio, el telefono los dos
// ultimos digitos, el resto se cubre entero.
function enmascarar(valor, tipo) {
  const texto = String(valor ?? '')
  if (!texto) return ''

  if (tipo === 'email') {
    const [antes, dominio] = texto.split('@')
    if (!dominio) return '•'.repeat(Math.min(texto.length, 12))
    return `${antes.slice(0, 1)}${'•'.repeat(Math.max(antes.length - 1, 3))}@${dominio}`
  }

  if (tipo === 'tel') {
    const visibles = texto.slice(-2)
    return `${'•'.repeat(Math.max(texto.replace(/\s/g, '').length - 2, 4))} ${visibles}`
  }

  return '•'.repeat(Math.min(Math.max(texto.length, 6), 16))
}

/* ══════════════════════════════════════════════════════════════════════
   9 · LA CREDENCIAL
   Los datos personales dejan de ser un formulario y pasan a ser un
   carnet: banda con guilloche arriba, folio, campos con su sello, banda
   de seguridad abajo. Editar sigue siendo el mismo gesto de siempre.
   ══════════════════════════════════════════════════════════════════════ */

export function BloqueDatos({
  campos,
  valores,
  onGuardar,
  titulo,
  descripcion,
  documento = 'Credencial de comprador local',
  folioCampo = 'cedula',
  ocultable = false,
  ocultos,
  onOcultos,
  clavePrivacidad = CLAVE_PRIVACIDAD,
}) {
  const controlado = typeof ocultos === 'boolean' && typeof onOcultos === 'function'

  const [editando, setEditando] = useState(false)
  const [borrador, setBorrador] = useState(valores)
  const [guardado, setGuardado] = useState(false)
  const [ocultosLocal, setOcultosLocal] = useState(() =>
    ocultable && !controlado ? leerPreferencia(clavePrivacidad) : false
  )

  const estanOcultos = controlado ? ocultos : ocultosLocal

  useEffect(() => {
    if (ocultable && !controlado) guardarPreferencia(clavePrivacidad, ocultosLocal)
  }, [ocultable, controlado, ocultosLocal, clavePrivacidad])

  // Al editar siempre se ven los datos: no se puede escribir a ciegas.
  const enmascarado = ocultable && estanOcultos && !editando

  const alternarVisibilidad = () => {
    if (controlado) onOcultos(!ocultos)
    else setOcultosLocal((prev) => !prev)
  }

  const abrir = () => { setBorrador(valores); setEditando(true) }
  const cancelar = () => { setBorrador(valores); setEditando(false) }

  const enviar = (e) => {
    e.preventDefault()
    onGuardar(borrador)
    setEditando(false)
    setGuardado(true)
    setTimeout(() => setGuardado(false), 2600)
  }

  const cambiar = (id, valor) => setBorrador((prev) => ({ ...prev, [id]: valor }))

  const folio = valores?.[folioCampo] || valores?.ruc || ''

  return (
    <section className="vc-perf-hoja vc-perf-credencial">
      <div className="vc-perf-credencial__banda">
        <span className="vc-perf-credencial__marca">
          <span className="vc-perf-etiqueta">{documento}</span>
          <span>Vincco · Nueva Guinea</span>
        </span>

        {ocultable && (
          <button
            type="button"
            className={`vc-perf-ojo ${enmascarado ? 'vc-perf-ojo--activo' : ''}`}
            onClick={alternarVisibilidad}
            aria-pressed={enmascarado}
            title={enmascarado ? 'Mostrar mis datos' : 'Ocultar mis datos'}
            aria-label={enmascarado ? 'Mostrar mis datos personales' : 'Ocultar mis datos personales'}
          >
            <Icon name={enmascarado ? 'eye-off' : 'eye'} size={16} />
          </button>
        )}
      </div>

      <div className="vc-perf-credencial__cuerpo">
        {(titulo || descripcion) && (
          <div className="vc-perf-hoja__head">
            <div>
              {titulo && <h2 className="vc-perf-hoja__titulo">{titulo}</h2>}
              {descripcion && <p className="vc-perf-hoja__desc">{descripcion}</p>}
            </div>
            <div className="vc-perf-hoja__acciones">
              <AnimatePresence>
                {guardado && (
                  <motion.span
                    className="vc-perf-guardado"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Icon name="check" size={14} /> Guardado
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {folio && (
          <p className="vc-perf-credencial__folio">
            <Icon name="key" size={15} />
            {enmascarado ? enmascarar(folio, 'text') : folio}
            {valores?.miembroDesde && (
              <small>
                Miembro desde
                <br />
                {valores.miembroDesde}
              </small>
            )}
          </p>
        )}

        <form onSubmit={enviar}>
          <div className="vc-perf-campos">
            {campos.map((campo) => (
              <div
                key={campo.id}
                className={`vc-perf-campo ${campo.ancho ? 'vc-perf-campo--ancho' : ''}`}
              >
                <span className="vc-perf-campo__label">
                  <span className="vc-perf-campo__placa" aria-hidden="true">
                    <Icon name={campo.icono} size={13} />
                  </span>
                  {campo.label}
                </span>

                {editando ? (
                  campo.tipo === 'textarea' ? (
                    <textarea
                      className="vc-perf-input vc-perf-textarea"
                      value={borrador[campo.id] || ''}
                      onChange={(e) => cambiar(campo.id, e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <input
                      className="vc-perf-input"
                      type={campo.tipo}
                      value={borrador[campo.id] || ''}
                      onChange={(e) => cambiar(campo.id, e.target.value)}
                    />
                  )
                ) : (
                  <span
                    className={
                      'vc-perf-campo__valor' +
                      (enmascarado && campo.privado ? ' vc-perf-campo__valor--oculto' : '')
                    }
                  >
                    {valores[campo.id]
                      ? (enmascarado && campo.privado
                          ? enmascarar(valores[campo.id], campo.tipo)
                          : valores[campo.id])
                      : <em className="vc-perf-campo__vacio">Sin completar</em>}
                  </span>
                )}
              </div>
            ))}
          </div>

          {enmascarado && (
            <p className="vc-perf-privacidad">
              <Icon name="shield" size={13} />
              Tus datos están ocultos. Tocá el ojo para mostrarlos.
            </p>
          )}

          {editando ? (
            <div className="vc-perf-credencial__acciones">
              <button type="button" className="vc-perf-btn vc-perf-btn--fantasma" onClick={cancelar}>
                Cancelar
              </button>
              <button type="submit" className="vc-perf-btn vc-perf-btn--solido">
                Guardar cambios
              </button>
            </div>
          ) : (
            <div className="vc-perf-credencial__pie">
              <span className="vc-perf-credencial__banda-seg" aria-hidden="true" />
              <button type="button" className="vc-perf-btn vc-perf-btn--linea" onClick={abrir}>
                <Icon name="edit-3" size={14} /> Actualizar mi ficha
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   10 · EL MURAL DE RECONOCIMIENTOS
   Sellos de caucho, no badges de app de gimnasio. El desbloqueado va
   entintado; el bloqueado es un sello VACÍO — contorno punteado — con el
   reto que falta a la vista. Al tocarlo, estampa en falso: se hunde y
   vuelve, que es exactamente lo que hace un sello sin tinta.
   ══════════════════════════════════════════════════════════════════════ */

export function Insignias({ items }) {
  return (
    <ul className="vc-perf-mural">
      {items.map((i) => (
        <li
          key={i.id}
          className={`vc-perf-medalla ${i.activa ? 'vc-perf-medalla--activa' : 'vc-perf-medalla--bloqueada'}`}
          tabIndex={0}
        >
          <span className="vc-perf-medalla__disco" aria-hidden="true">
            <Icon name={i.icono} size={22} />
          </span>

          <span className="vc-perf-medalla__label">{i.label}</span>
          <span className="vc-perf-medalla__desc">{i.descripcion}</span>

          {i.activa ? (
            <span className="vc-perf-medalla__fecha">
              <Icon name="check" size={11} />
              {i.fecha ? i.fecha : 'Sellada'}
            </span>
          ) : (
            <span className="vc-perf-medalla__reto">Próximo reto</span>
          )}
        </li>
      ))}
    </ul>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   11 · EL PASAPORTE DE SELLOS
   Los favoritos no son una lista: son las paginas selladas del
   pasaporte. Cada una dice que parte de tus puntos sale de ahi — que es
   el dato que la lista vieja no daba. El porcentaje se calcula de los
   mismos datos, no hace falta un campo nuevo.
   ══════════════════════════════════════════════════════════════════════ */

export function Pasaporte({ items = [] }) {
  const total = items.reduce((suma, f) => suma + soloNumero(f.puntos), 0) || 1

  return (
    <ul className="vc-perf-pasaporte">
      {items.map((f) => {
        const parte = soloNumero(f.puntos)
        const pct = Math.round((parte / total) * 100)

        return (
          <li key={f.id} className="vc-perf-pagina" style={{ '--pf-marca': f.color }}>
            <span className="vc-perf-pagina__marca" aria-hidden="true">
              <Icon name="store" size={18} />
            </span>

            <span className="vc-perf-pagina__cuerpo">
              <strong className="vc-perf-pagina__nombre">{f.nombre}</strong>
              <span className="vc-perf-pagina__cat">{f.categoria}</span>

              <span className="vc-perf-pagina__pista">
                <span className="vc-perf-pagina__relleno" style={{ width: `${pct}%` }} />
              </span>
              <span className="vc-perf-pagina__reparto">
                {pct}% de tus puntos salen de acá
              </span>
            </span>

            <span className="vc-perf-pagina__puntos">{f.puntos}</span>
          </li>
        )
      })}
    </ul>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   12 · EL EXTRACTO
   La actividad se lee como un estado de cuenta del barrio: sello de
   fecha a la izquierda, movimiento al centro, hora a la derecha, y un
   resumen del mes pegado arriba mientras se recorre.

   Cada tipo tiene COLOR Y FORMA. Los tonos calidos de la paleta se
   separan apenas 1.0-1.5:1 de luminancia entre si: como puntos iguales
   se confunden, sobre todo el dorado y el naranja. Con circulo, cuadrado,
   rombo, escudo, aro y triangulo se distinguen aunque no veas el tono, y
   la leyenda lo repite en texto.
   ══════════════════════════════════════════════════════════════════════ */

// El tipo se DEDUCE del icono que ya trae cada movimiento: no hay que
// agregarle un campo a los datos.
const TIPO_POR_ICONO = {
  gift: 'canje', ticket: 'canje', percent: 'canje', tag: 'canje',
  'shopping-bag': 'compra', 'shopping-cart': 'compra', 'dollar-sign': 'compra',
  wallet: 'compra', 'trending-up': 'compra', 'bar-chart-2': 'compra',
  star: 'resena', 'message-circle': 'resena',
  award: 'nivel', medal: 'nivel', crown: 'nivel', flame: 'nivel', zap: 'nivel',
  heart: 'vinculo', store: 'vinculo', users: 'vinculo', handshake: 'vinculo',
  truck: 'vinculo', 'check-circle': 'vinculo', 'file-text': 'vinculo',
  mail: 'aviso', package: 'aviso', 'alert-triangle': 'aviso', bell: 'aviso',
}
const TIPO_POR_TONO = { positivo: 'nivel', neutro: 'compra', alerta: 'aviso' }

const NOMBRE_TIPO = {
  canje: 'Canje',
  compra: 'Compra',
  resena: 'Reseña',
  nivel: 'Logro o nivel',
  vinculo: 'Vínculo',
  aviso: 'Pendiente',
}

function tipoDeMovimiento(a) {
  return TIPO_POR_ICONO[a.icono] || TIPO_POR_TONO[a.tono] || 'compra'
}

// "Hoy, 10:24" -> { etiqueta: 'HOY', hora: '10:24' }
// "29 jul, 09:15" -> { dia: '29', mes: 'JUL', hora: '09:15' }
function sellarFecha(fecha) {
  const [izq = '', hora = ''] = String(fecha || '').split(/,\s*/)
  const m = izq.trim().match(/^(\d{1,2})\s+(\p{L}{3,})/u)
  if (m) return { dia: m[1], mes: m[2].slice(0, 3).toUpperCase(), hora }
  return { etiqueta: izq.trim().toUpperCase(), hora }
}

export function Actividad({ items = [], resumen, resumenIcono = 'calendar' }) {
  const tipos = [...new Set(items.map(tipoDeMovimiento))]

  return (
    <div className="vc-perf-extracto">
      {resumen && (
        <p className="vc-perf-extracto__resumen">
          <Icon name={resumenIcono} size={16} />
          {resumen}
        </p>
      )}

      <ol className="vc-perf-mov-lista">
        {items.map((a) => {
          const tipo = tipoDeMovimiento(a)
          const sello = sellarFecha(a.fecha)

          return (
            <li key={a.id} className={`vc-perf-mov vc-perf-mov--${tipo}`}>
              <span className="vc-perf-mov__fecha" aria-hidden="true">
                {sello.dia ? (
                  <>
                    <span className="vc-perf-mov__dia">{sello.dia}</span>
                    <span className="vc-perf-mov__mes">{sello.mes}</span>
                  </>
                ) : (
                  <span className="vc-perf-mov__mes">{sello.etiqueta}</span>
                )}
              </span>

              <span className="vc-perf-mov__cuerpo">
                <span className="vc-perf-mov__linea">
                  <span className="vc-perf-mov__marca" aria-hidden="true" />
                  <strong className="vc-perf-mov__titulo">{a.titulo}</strong>
                </span>
                <span className="vc-perf-mov__detalle">{a.detalle}</span>
                {/* El tipo y la fecha completa, para quien usa lector de
                    pantalla: la forma y el color no le llegan. */}
                <span className="vc-perf-oculto-visual">
                  {NOMBRE_TIPO[tipo]} · {a.fecha}
                </span>
              </span>

              <time className="vc-perf-mov__hora">{sello.hora}</time>
            </li>
          )
        })}
      </ol>

      {tipos.length > 1 && (
        <ul className="vc-perf-leyenda">
          {tipos.map((t) => (
            <li key={t} className={`vc-perf-mov--${t}`}>
              <span className="vc-perf-mov__marca" aria-hidden="true" />
              <span className="vc-perf-leyenda__texto">{NOMBRE_TIPO[t]}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
