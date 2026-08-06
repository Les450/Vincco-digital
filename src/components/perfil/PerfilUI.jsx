import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from '../icons/Icon'

// Piezas compartidas por los tres perfiles (cliente, negocio y
// proveedor). Cada perfil arma su propia pantalla combinandolas,
// asi el estilo es consistente pero el contenido y el orden de las
// secciones son distintos segun el rol.

/* ── Encabezado ──────────────────────────────────────────── */

// Iniciales para el avatar cuando no hay foto: "Ferreteria Don Chico"
// queda como "FD", "Leslie" como "LE".
function iniciales(nombre) {
  const partes = (nombre || '').trim().split(/\s+/).filter(Boolean)
  if (!partes.length) return '?'
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[1][0]).toUpperCase()
}

const PESO_MAXIMO_MB = 5
const LADO_MAXIMO = 512

// Reduce la imagen antes de guardarla. Una foto de celular pesa
// varios MB y en base64 crece un tercio mas; recortada a 512px
// cuadrados el avatar se ve igual de nitido y ocupa poquisimo.
function comprimirImagen(archivo) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader()
    lector.onerror = () => reject(new Error('No se pudo leer el archivo'))
    lector.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('El archivo no es una imagen válida'))
      img.onload = () => {
        // Recorte centrado al cuadrado mas grande que entre en la foto
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

function AvatarPerfil({ nombre, foto, onFoto, onQuitarFoto }) {
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
    } catch (err) {
      setError('No se pudo procesar la imagen. Probá con otra.')
    } finally {
      setCargando(false)
    }
  }

  if (!editable) {
    return (
      <div className="pf-avatar" aria-hidden="true">
        {foto ? <img src={foto} alt="" className="pf-avatar-img" /> : <span>{iniciales(nombre)}</span>}
      </div>
    )
  }

  return (
    <div className="pf-avatar-zona">
      <button
        type="button"
        className={`pf-avatar pf-avatar--editable ${cargando ? 'pf-avatar--cargando' : ''}`}
        onClick={() => inputRef.current?.click()}
        aria-label={foto ? 'Cambiar foto de perfil' : 'Subir foto de perfil'}
      >
        {foto
          ? <img src={foto} alt="" className="pf-avatar-img" />
          : <span aria-hidden="true">{iniciales(nombre)}</span>}

        <span className="pf-avatar-capa" aria-hidden="true">
          <Icon name="camera" size={18} />
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={elegir}
        className="pf-avatar-input"
        tabIndex={-1}
      />

      {foto && (
        <button
          type="button"
          className="pf-avatar-quitar"
          onClick={onQuitarFoto}
          aria-label="Quitar foto de perfil"
        >
          <Icon name="trash-2" size={13} />
        </button>
      )}

      <AnimatePresence>
        {error && (
          <motion.p
            className="pf-avatar-error"
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

export function PerfilHero({
  kicker,
  nombre,
  subtitulo,
  chips = [],
  acento,
  extra,
  acciones,
  foto,
  onFoto,
  onQuitarFoto,
}) {
  const navigate = useNavigate()

  return (
    <header className="pf-hero" style={{ '--pf-acento': acento }}>
      <div className="pf-hero-trama" aria-hidden="true" />

      <button
        type="button"
        className="pf-hero-volver"
        onClick={() => navigate(-1)}
        aria-label="Volver"
      >
        <Icon name="arrow-left" size={18} />
      </button>

      <div className="pf-hero-cuerpo">
        <div className="pf-hero-identidad">
          <AvatarPerfil
            nombre={nombre}
            foto={foto}
            onFoto={onFoto}
            onQuitarFoto={onQuitarFoto}
          />

          <div className="pf-hero-texto">
            <span className="pf-hero-kicker">{kicker}</span>
            <h1 className="pf-hero-nombre">{nombre}</h1>
            {subtitulo && <p className="pf-hero-sub">{subtitulo}</p>}

            {chips.length > 0 && (
              <ul className="pf-chips">
                {chips.map((chip) => (
                  <li key={chip.label} className={`pf-chip ${chip.destacado ? 'pf-chip--destacado' : ''}`}>
                    {chip.icono && <Icon name={chip.icono} size={13} />}
                    {chip.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {extra && <div className="pf-hero-extra">{extra}</div>}
      </div>

      {acciones && <div className="pf-hero-acciones">{acciones}</div>}
    </header>
  )
}

/* ── Secciones ───────────────────────────────────────────── */

export function Seccion({ titulo, descripcion, accion, children, className = '' }) {
  return (
    <section className={`pf-seccion ${className}`}>
      <div className="pf-seccion-head">
        <div>
          <h2>{titulo}</h2>
          {descripcion && <p>{descripcion}</p>}
        </div>
        {accion}
      </div>
      {children}
    </section>
  )
}

/* ── Metricas ────────────────────────────────────────────── */

// Una metrica puede llevar "enlace": ahi la tarjeta suma un atajo al
// final (por ejemplo "Ver favoritos" -> /favoritos, la misma ruta que
// usa la barra inferior del home de clientes).
export function Metricas({ items }) {
  return (
    <ul className="pf-metricas">
      {items.map((m) => (
        <li key={m.id} className={`pf-metrica ${m.enlace ? 'pf-metrica--enlazada' : ''}`}>
          <span className="pf-metrica-icono">
            <Icon name={m.icono} size={17} />
          </span>
          <strong className="pf-metrica-valor">
            {m.valor}
            {/* La unidad va aparte y mas chica: el numero se lee grande
                y la moneda queda escrita con todas sus letras. */}
            {m.unidad && <span className="pf-metrica-unidad">{m.unidad}</span>}
          </strong>
          <span className="pf-metrica-label">{m.label}</span>
          <span className="pf-metrica-detalle">{m.detalle}</span>

          {m.enlace && (
            <Link to={m.enlace} className="pf-metrica-enlace">
              {m.enlaceLabel || 'Ver más'}
              <Icon name="chevron-right" size={13} />
            </Link>
          )}
        </li>
      ))}
    </ul>
  )
}

/* ── Privacidad de los datos ─────────────────────────────── */

// Clave donde se recuerda la preferencia. Si el usuario decide dejar
// sus datos ocultos, la proxima vez que entre al perfil siguen ocultos.
const CLAVE_PRIVACIDAD = 'vincco:perfil:datos-ocultos'

function leerPreferencia(clave) {
  try {
    return window.localStorage.getItem(clave) === '1'
  } catch {
    // Modo privado del navegador o storage bloqueado: por defecto visible
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

// Enmascara el valor dejando una pista para que el usuario reconozca
// el dato sin exponerlo: el correo conserva la inicial y el dominio,
// el telefono los ultimos dos digitos y el resto se cubre completo.
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

/* ── Datos editables ─────────────────────────────────────── */

// Muestra los campos como ficha de lectura y, al tocar "Editar",
// los cambia por inputs sin sacar al usuario de la pagina.
// Con "ocultable" aparece el boton de ojo para esconder los datos
// personales de un vistazo (util si le prestan el celular a alguien).
export function BloqueDatos({
  campos,
  valores,
  onGuardar,
  titulo,
  descripcion,
  ocultable = false,
  clavePrivacidad = CLAVE_PRIVACIDAD,
}) {
  const [editando, setEditando] = useState(false)
  const [borrador, setBorrador] = useState(valores)
  const [guardado, setGuardado] = useState(false)
  const [ocultos, setOcultos] = useState(() => (ocultable ? leerPreferencia(clavePrivacidad) : false))

  useEffect(() => {
    if (ocultable) guardarPreferencia(clavePrivacidad, ocultos)
  }, [ocultable, ocultos, clavePrivacidad])

  // Al editar siempre se ven los datos: no se puede escribir a ciegas.
  const enmascarado = ocultable && ocultos && !editando

  const alternarVisibilidad = () => setOcultos((prev) => !prev)

  const abrir = () => {
    setBorrador(valores)
    setEditando(true)
  }

  const cancelar = () => {
    setBorrador(valores)
    setEditando(false)
  }

  const enviar = (e) => {
    e.preventDefault()
    onGuardar(borrador)
    setEditando(false)
    setGuardado(true)
    setTimeout(() => setGuardado(false), 2600)
  }

  const cambiar = (id, valor) => setBorrador((prev) => ({ ...prev, [id]: valor }))

  return (
    <Seccion
      titulo={titulo}
      descripcion={descripcion}
      accion={
        !editando ? (
          <div className="pf-head-acciones">
            <AnimatePresence>
              {guardado && (
                <motion.span
                  className="pf-guardado"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Icon name="check" size={14} /> Guardado
                </motion.span>
              )}
            </AnimatePresence>

            {ocultable && (
              <button
                type="button"
                className={`pf-ojo ${enmascarado ? 'pf-ojo--activo' : ''}`}
                onClick={alternarVisibilidad}
                aria-pressed={enmascarado}
                title={enmascarado ? 'Mostrar mis datos' : 'Ocultar mis datos'}
                aria-label={enmascarado ? 'Mostrar mis datos personales' : 'Ocultar mis datos personales'}
              >
                <Icon name={enmascarado ? 'eye-off' : 'eye'} size={16} />
              </button>
            )}

            <button type="button" className="pf-btn pf-btn--linea" onClick={abrir}>
              <Icon name="edit-3" size={14} /> Editar
            </button>
          </div>
        ) : null
      }
    >
      <form className="pf-datos" onSubmit={enviar}>
        <div className="pf-datos-grid">
          {campos.map((campo) => (
            <div
              key={campo.id}
              className={`pf-campo ${campo.ancho ? 'pf-campo--ancho' : ''}`}
            >
              <span className="pf-campo-label">
                <Icon name={campo.icono} size={14} />
                {campo.label}
              </span>

              {editando ? (
                campo.tipo === 'textarea' ? (
                  <textarea
                    className="pf-input pf-textarea"
                    value={borrador[campo.id] || ''}
                    onChange={(e) => cambiar(campo.id, e.target.value)}
                    rows={3}
                  />
                ) : (
                  <input
                    className="pf-input"
                    type={campo.tipo}
                    value={borrador[campo.id] || ''}
                    onChange={(e) => cambiar(campo.id, e.target.value)}
                  />
                )
              ) : (
                <span
                  className={`pf-campo-valor ${enmascarado && campo.privado ? 'pf-campo-valor--oculto' : ''}`}
                >
                  {valores[campo.id]
                    ? (enmascarado && campo.privado
                        ? enmascarar(valores[campo.id], campo.tipo)
                        : valores[campo.id])
                    : <em className="pf-vacio">Sin completar</em>}
                </span>
              )}
            </div>
          ))}
        </div>

        {enmascarado && (
          <p className="pf-privacidad-aviso">
            <Icon name="shield" size={13} />
            Tus datos están ocultos. Tocá el ojo para mostrarlos.
          </p>
        )}

        {editando && (
          <div className="pf-datos-acciones">
            <button type="button" className="pf-btn pf-btn--fantasma" onClick={cancelar}>
              Cancelar
            </button>
            <button type="submit" className="pf-btn pf-btn--solido">
              Guardar cambios
            </button>
          </div>
        )}
      </form>
    </Seccion>
  )
}

/* ── Insignias ───────────────────────────────────────────── */

export function Insignias({ items }) {
  return (
    <ul className="pf-insignias">
      {items.map((i) => (
        <li key={i.id} className={`pf-insignia ${i.activa ? '' : 'pf-insignia--bloqueada'}`}>
          <span className="pf-insignia-icono">
            <Icon name={i.icono} size={16} />
          </span>
          <span className="pf-insignia-texto">
            <strong>{i.label}</strong>
            <span>{i.descripcion}</span>
          </span>
          {!i.activa && <Icon name="shield" size={14} className="pf-insignia-candado" />}
        </li>
      ))}
    </ul>
  )
}

/* ── Actividad ───────────────────────────────────────────── */

export function Actividad({ items }) {
  return (
    <ol className="pf-actividad">
      {items.map((a) => (
        <li key={a.id} className={`pf-act pf-act--${a.tono}`}>
          <span className="pf-act-marca">
            <Icon name={a.icono} size={14} />
          </span>
          <div className="pf-act-cuerpo">
            <strong className="pf-act-titulo">{a.titulo}</strong>
            <span className="pf-act-detalle">{a.detalle}</span>
          </div>
          <time className="pf-act-fecha">{a.fecha}</time>
        </li>
      ))}
    </ol>
  )
}
