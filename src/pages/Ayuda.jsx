import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from '../components/icons/Icon'
import {
  canalesSoporte,
  rolesAyuda,
  preguntasFrecuentes,
  articulosAyuda,
  tiposConsulta,
} from '../data/data_falso'
import './Ayuda.css'

const FORM_VACIO = {
  nombre: '', correo: '', tipo: tiposConsulta[0], asunto: '', mensaje: '',
}

// Quita tildes para que buscar "como gano puntos" tambien encuentre
// "¿Cómo gano puntos?"
const ACENTOS = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ü: 'u', ñ: 'n' }

function normalizar(texto) {
  return (texto || '')
    .toLowerCase()
    .replace(/[áéíóúüñ]/g, (c) => ACENTOS[c])
}

function ItemFaq({ item, abierto, onToggle }) {
  return (
    <div className={`ayu-faq-item ${abierto ? 'ayu-faq-item--abierto' : ''}`}>
      <button
        type="button"
        className="ayu-faq-boton"
        onClick={onToggle}
        aria-expanded={abierto}
      >
        <span className="ayu-faq-texto">
          <span className="ayu-faq-categoria">{item.categoria}</span>
          <span className="ayu-faq-pregunta">{item.pregunta}</span>
        </span>
        <motion.span
          className="ayu-faq-flecha"
          animate={{ rotate: abierto ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Icon name="chevron-down" size={18} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {abierto && (
          <motion.div
            className="ayu-faq-respuesta-wrap"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="ayu-faq-respuesta">{item.respuesta}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Ayuda() {
  const navigate = useNavigate()

  const [busqueda, setBusqueda] = useState('')
  const [rolActivo, setRolActivo] = useState('usuarios')
  const [abiertoId, setAbiertoId] = useState(null)
  const [form, setForm] = useState(FORM_VACIO)
  const [enviado, setEnviado] = useState(false)

  const rol = rolesAyuda.find((r) => r.id === rolActivo)
  const texto = normalizar(busqueda.trim())

  // Con busqueda activa se recorren las preguntas de los tres roles;
  // sin busqueda solo se muestran las del rol seleccionado.
  const preguntasVisibles = useMemo(() => {
    if (!texto) {
      return (preguntasFrecuentes[rolActivo] || []).map((p) => ({ ...p, rol: rolActivo }))
    }
    return Object.entries(preguntasFrecuentes).flatMap(([idRol, lista]) =>
      lista
        .filter((p) => normalizar(p.pregunta).includes(texto) || normalizar(p.respuesta).includes(texto))
        .map((p) => ({ ...p, rol: idRol }))
    )
  }, [texto, rolActivo])

  const handleEnviar = (e) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.correo.trim() || !form.mensaje.trim()) return
    setEnviado(true)
    setForm(FORM_VACIO)
    setTimeout(() => setEnviado(false), 4000)
  }

  return (
    <div className="ayu">
      {/* ── Hero ────────────────────────────────────────── */}
      <section className="ayu-hero">
        <button
          className="ayu-hero-volver"
          onClick={() => navigate(-1)}
          type="button"
          aria-label="Volver"
        >
          <Icon name="arrow-left" size={18} />
        </button>

        <motion.div
          className="ayu-hero-contenido"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="ayu-badge">
            <Icon name="headphones" size={14} />
            Centro de ayuda Vincco
          </span>

          <h1>¿Cómo podemos ayudarte?</h1>
          <p className="ayu-hero-sub">
            Encontrá respuestas rápidas, conocé nuestros canales de soporte y
            contactá directamente con nuestro equipo.
          </p>

          <div className="ayu-hero-buscador">
            <div className="ayu-hero-input">
              <Icon name="search" size={18} />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar en nuestra base de conocimiento..."
                aria-label="Buscar en la base de conocimiento"
              />
              {busqueda && (
                <button
                  type="button"
                  className="ayu-hero-limpiar"
                  onClick={() => setBusqueda('')}
                  aria-label="Limpiar búsqueda"
                >
                  <Icon name="x" size={15} />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Canales de soporte ──────────────────────────── */}
      <section className="ayu-seccion ayu-seccion--canales">
        <div className="ayu-seccion-encabezado">
          <span className="ayu-eyebrow">Múltiples canales de soporte</span>
          <h2>Elegí tu canal preferido</h2>
          <p>Contactanos por el medio que más te convenga</p>
        </div>

        <div className="ayu-canales">
          {canalesSoporte.map((canal, i) => (
            <motion.div
              key={canal.id}
              className="ayu-canal"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            >
              <span className="ayu-canal-icono" style={{ background: `${canal.color}18`, color: canal.color }}>
                <Icon name={canal.icono} size={22} />
              </span>
              <h3>{canal.titulo}</h3>
              <p className="ayu-canal-desc">{canal.descripcion}</p>

              <span className="ayu-canal-horario">
                <Icon name="clock" size={13} />
                {canal.disponibilidad}
              </span>

              {canal.href ? (
                <a
                  className="ayu-canal-btn"
                  style={{ background: canal.color }}
                  href={canal.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {canal.accion}
                </a>
              ) : (
                <button
                  type="button"
                  className="ayu-canal-btn"
                  style={{ background: canal.color }}
                >
                  {canal.accion}
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Preguntas frecuentes ────────────────────────── */}
      <section className="ayu-seccion ayu-seccion--faq">
        <div className="ayu-seccion-encabezado">
          <span className="ayu-eyebrow">Preguntas frecuentes</span>
          <h2>Respuestas a tus dudas</h2>
        </div>

        {/* Con busqueda activa se ocultan las pestanas: los resultados
            vienen de los tres roles a la vez */}
        {!texto && (
          <div className="ayu-tabs" role="tablist">
            {rolesAyuda.map((r) => (
              <button
                key={r.id}
                type="button"
                role="tab"
                aria-selected={rolActivo === r.id}
                className={`ayu-tab ${rolActivo === r.id ? 'ayu-tab--activo' : ''}`}
                onClick={() => { setRolActivo(r.id); setAbiertoId(null) }}
              >
                <Icon name={r.icono} size={16} />
                {r.label}
              </button>
            ))}
          </div>
        )}

        <h3 className="ayu-faq-titulo">
          {texto
            ? `${preguntasVisibles.length} ${preguntasVisibles.length === 1 ? 'resultado' : 'resultados'} para "${busqueda}"`
            : `Preguntas de ${rol?.label}`}
        </h3>

        <div className="ayu-faq-lista">
          {preguntasVisibles.length === 0 ? (
            <div className="ayu-faq-vacio">
              <Icon name="search" size={26} />
              <p>No encontramos preguntas con ese texto.</p>
              <span>Probá con otras palabras o escribinos por el formulario de abajo.</span>
            </div>
          ) : (
            preguntasVisibles.map((item) => (
              <ItemFaq
                key={item.id}
                item={item}
                abierto={abiertoId === item.id}
                onToggle={() => setAbiertoId(abiertoId === item.id ? null : item.id)}
              />
            ))
          )}
        </div>
      </section>

      {/* ── Artículos y guías ───────────────────────────── */}
      <section className="ayu-seccion ayu-seccion--articulos">
        <div className="ayu-seccion-encabezado">
          <span className="ayu-eyebrow">Base de conocimiento</span>
          <h2>Artículos y guías útiles</h2>
          <p>Accedé a tutoriales completos para sacarle el máximo provecho a Vincco</p>
        </div>

        <div className="ayu-articulos">
          {articulosAyuda.map((art, i) => (
            <motion.article
              key={art.id}
              className="ayu-articulo"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: (i % 3) * 0.06 }}
            >
              <span className="ayu-articulo-icono" style={{ background: `${art.color}18`, color: art.color }}>
                <Icon name={art.icono} size={20} />
              </span>

              <div className="ayu-articulo-meta">
                <span className="ayu-articulo-rol">{art.rol}</span>
                <span className="ayu-articulo-tiempo">
                  <Icon name="clock" size={12} />
                  {art.minutos} min
                </span>
              </div>

              <h3>{art.titulo}</h3>
              <p>{art.resumen}</p>

              <button type="button" className="ayu-articulo-link">
                Leer más <Icon name="chevron-right" size={14} />
              </button>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ── Formulario de contacto ──────────────────────── */}
      <section className="ayu-seccion ayu-seccion--form">
        <div className="ayu-seccion-encabezado">
          <span className="ayu-eyebrow">Formulario de contacto</span>
          <h2>Contanos tu problema</h2>
          <p>Completá este formulario y nuestro equipo te contactará pronto</p>
        </div>

        <form className="ayu-form" onSubmit={handleEnviar}>
          <div className="ayu-form-row">
            <div className="ayu-form-grupo">
              <label htmlFor="ayu-nombre">Nombre completo *</label>
              <input
                id="ayu-nombre"
                type="text"
                required
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Tu nombre"
              />
            </div>
            <div className="ayu-form-grupo">
              <label htmlFor="ayu-correo">Correo electrónico *</label>
              <input
                id="ayu-correo"
                type="email"
                required
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div className="ayu-form-row">
            <div className="ayu-form-grupo">
              <label htmlFor="ayu-tipo">Tipo de consulta *</label>
              <select
                id="ayu-tipo"
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              >
                {tiposConsulta.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="ayu-form-grupo">
              <label htmlFor="ayu-asunto">Asunto *</label>
              <input
                id="ayu-asunto"
                type="text"
                required
                value={form.asunto}
                onChange={(e) => setForm({ ...form, asunto: e.target.value })}
                placeholder="¿Cuál es tu tema?"
              />
            </div>
          </div>

          <div className="ayu-form-grupo">
            <label htmlFor="ayu-mensaje">Mensaje detallado *</label>
            <textarea
              id="ayu-mensaje"
              rows={5}
              required
              value={form.mensaje}
              onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
              placeholder="Describí tu problema con el mayor detalle posible..."
            />
          </div>

          <button type="submit" className="ayu-form-enviar">
            {enviado ? (
              <><Icon name="check-circle" size={18} /> Solicitud enviada</>
            ) : (
              'Enviar solicitud'
            )}
          </button>

          <AnimatePresence>
            {enviado && (
              <motion.p
                className="ayu-form-ok"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                Recibimos tu mensaje. Te respondemos al correo en un máximo de 24 horas.
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </section>
    </div>
  )
}
