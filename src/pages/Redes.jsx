import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store/puntos_usestore'
import Icon from '../components/icons/Icon'
import IconRed, { REDES } from '../components/icons/IconRed'
import HeroBannerRedes from '../components/HeroBannerRedes'
import { redesVincco } from '../data/data_falso'
import './Redes.css'

const IDS_REDES = Object.keys(REDES)

// Arma el enlace final a partir de lo que escribio el negocio.
// Si ya pego una URL completa se respeta tal cual.
function construirUrl(id, valor) {
  const limpio = (valor || '').trim()
  if (!limpio) return null
  if (limpio.startsWith('http://') || limpio.startsWith('https://')) return limpio

  const red = REDES[id]
  if (red.tipo === 'telefono') {
    const digitos = limpio.replace(/\D/g, '')
    return digitos ? `${red.prefijo}${digitos}` : null
  }
  return `${red.prefijo}${limpio.replace(/^@/, '')}`
}

function TarjetaRed({ id, valor, onConectar, onQuitar }) {
  const red = REDES[id]
  const conectada = Boolean(valor)
  const url = construirUrl(id, valor)

  return (
    <div className={`red-card ${conectada ? 'red-card--activa' : ''}`}>
      <div className="red-card-top">
        <span className="red-card-icono" style={{ background: `${red.color}18`, color: red.color }}>
          <IconRed nombre={id} size={20} />
        </span>
        <div className="red-card-titulo">
          <span className="red-card-nombre" translate="no">{red.nombre}</span>
          {conectada
            ? <span className="red-card-valor">{valor}</span>
            : <span className="red-card-sin">Sin conectar</span>}
        </div>
        {conectada && (
          <span className="red-card-check" aria-label="Conectada">
            <Icon name="check-circle" size={17} />
          </span>
        )}
      </div>

      <div className="red-card-acciones">
        {conectada ? (
          <>
            {url && (
              <a className="red-btn red-btn--ver" href={url} target="_blank" rel="noopener noreferrer">
                Ver perfil
              </a>
            )}
            <button type="button" className="red-btn red-btn--editar" onClick={() => onConectar(id)}>
              <Icon name="edit-3" size={14} /> Editar
            </button>
            <button
              type="button"
              className="red-btn red-btn--quitar"
              onClick={() => onQuitar(id)}
              aria-label={`Desconectar ${red.nombre}`}
            >
              <Icon name="x" size={14} />
            </button>
          </>
        ) : (
          <button
            type="button"
            className="red-btn red-btn--conectar"
            style={{ background: red.color }}
            onClick={() => onConectar(id)}
          >
            Conectar
          </button>
        )}
      </div>
    </div>
  )
}

export default function Redes() {
  const userType = useStore((s) => s.userType)
  const redesNegocio = useStore((s) => s.redesNegocio)
  const guardarRed = useStore((s) => s.guardarRed)
  const quitarRed = useStore((s) => s.quitarRed)
  const codigoInvitacion = useStore((s) => s.codigoInvitacion)

  const [editandoId, setEditandoId] = useState(null)
  const [valorForm, setValorForm] = useState('')
  const [copiado, setCopiado] = useState(false)

  const esNegocio = userType === 'negocio' || userType === 'proveedor'
  const conectadas = IDS_REDES.filter((id) => redesNegocio[id]).length

  const abrirEditor = (id) => {
    setEditandoId(id)
    setValorForm(redesNegocio[id] || '')
  }

  const cerrarEditor = () => {
    setEditandoId(null)
    setValorForm('')
  }

  const handleGuardar = (e) => {
    e.preventDefault()
    if (!valorForm.trim()) return
    guardarRed(editandoId, valorForm)
    cerrarEditor()
  }

  // El portapapeles falla si no hay permiso o el navegador es viejo,
  // por eso el fallback con execCommand.
  const copiarCodigo = async () => {
    try {
      await navigator.clipboard.writeText(codigoInvitacion)
    } catch {
      const campo = document.createElement('textarea')
      campo.value = codigoInvitacion
      document.body.appendChild(campo)
      campo.select()
      document.execCommand('copy')
      document.body.removeChild(campo)
    }
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2500)
  }

  const mensajeInvitacion = `Te invito a Vincco, la app que te da puntos por comprar en negocios locales de Nueva Guinea. Usa mi codigo ${codigoInvitacion} al registrarte.`
  const compartirWhatsapp = `https://wa.me/?text=${encodeURIComponent(mensajeInvitacion)}`
  const compartirFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://vincco.local')}&quote=${encodeURIComponent(mensajeInvitacion)}`

  const redEditando = editandoId ? REDES[editandoId] : null

  return (
    <div className="rds">
      <HeroBannerRedes esNegocio={esNegocio} />

      <div className="rds-body">
      {/* ── Mis redes: solo para negocios y proveedores ── */}
      {esNegocio && (
        <section className="rds-seccion" id="rds-mis-redes">
          <div className="rds-seccion-head">
            <div>
              <h2>Mis redes</h2>
              <p>Aparecen en tu perfil dentro del directorio</p>
            </div>
            <span className="rds-contador">{conectadas} de {IDS_REDES.length}</span>
          </div>

          <div className="rds-grid">
            {IDS_REDES.map((id) => (
              <TarjetaRed
                key={id}
                id={id}
                valor={redesNegocio[id]}
                onConectar={abrirEditor}
                onQuitar={quitarRed}
              />
            ))}
          </div>

          {conectadas === 0 && (
            <p className="rds-aviso">
              <Icon name="alert-triangle" size={15} />
              Todavía no conectaste ninguna red. Los negocios con redes reciben más visitas a su perfil.
            </p>
          )}
        </section>
      )}

      {/* ── Redes de Vincco ─────────────────────────────── */}
      <section className="rds-seccion" id="rds-oficiales">
        <div className="rds-seccion-head">
          <div>
            <h2>Redes oficiales</h2>
          </div>
        </div>

        <div className="rds-grid rds-grid--oficial">
          {redesVincco.map((red) => {
            const info = REDES[red.id]
            return (
              <a
                key={red.id}
                className="rds-oficial"
                href={red.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="rds-oficial-icono" style={{ background: info.color }}>
                  <IconRed nombre={red.id} size={20} style={{ color: '#ffffff' }} />
                </span>
                <span className="rds-oficial-info">
                  <span className="rds-oficial-nombre" translate="no">{info.nombre}</span>
                  <span className="rds-oficial-usuario">@{red.usuario.replace(/^@/, '')}</span>
                </span>
                <span className="rds-oficial-seguidores">{red.seguidores}</span>
                <Icon name="arrow-right" size={15} className="rds-oficial-flecha" />
              </a>
            )
          })}
        </div>
      </section>

      {/* ── Invitación ──────────────────────────────────── */}
      <section className="rds-seccion">
        <div className="rds-seccion-head">
          <div>
            <h2>Invitá y ganá puntos</h2>
            <p>Recibís 100 puntos por cada persona que se registre con tu código</p>
          </div>
        </div>

        <div className="rds-invitacion">
          <div className="rds-codigo">
            <span className="rds-codigo-label">Tu código de invitación</span>
            <div className="rds-codigo-fila">
              <span className="rds-codigo-valor">{codigoInvitacion}</span>
              <button type="button" className="rds-codigo-copiar" onClick={copiarCodigo}>
                <AnimatePresence mode="wait" initial={false}>
                  {copiado ? (
                    <motion.span
                      key="ok"
                      className="rds-copiar-contenido"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                    >
                      <Icon name="check" size={15} /> Copiado
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copiar"
                      className="rds-copiar-contenido"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                    >
                      <Icon name="file-text" size={15} /> Copiar
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          <div className="rds-compartir">
            <span className="rds-compartir-label">Compartir por</span>
            <div className="rds-compartir-botones">
              <a
                className="rds-compartir-btn"
                style={{ background: REDES.whatsapp.color }}
                href={compartirWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconRed nombre="whatsapp" size={18} /> WhatsApp
              </a>
              <a
                className="rds-compartir-btn"
                style={{ background: REDES.facebook.color }}
                href={compartirFacebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconRed nombre="facebook" size={18} /> Facebook
              </a>
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* ── Modal para conectar o editar una red ────────── */}
      <AnimatePresence>
        {redEditando && (
          <motion.div
            className="rds-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrarEditor}
          >
            <motion.div
              className="rds-modal"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="rds-modal-header">
                <span className="rds-modal-icono" style={{ background: redEditando.color }}>
                  <IconRed nombre={editandoId} size={20} style={{ color: '#ffffff' }} />
                </span>
                <h3>{redesNegocio[editandoId] ? 'Editar' : 'Conectar'} <span translate="no">{redEditando.nombre}</span></h3>
                <button
                  type="button"
                  className="rds-modal-cerrar"
                  onClick={cerrarEditor}
                  aria-label="Cerrar"
                >
                  <Icon name="x" size={16} />
                </button>
              </div>

              <form className="rds-modal-form" onSubmit={handleGuardar}>
                <label htmlFor="rds-valor">
                  {redEditando.tipo === 'telefono' ? 'Número de WhatsApp' : 'Usuario o enlace'}
                </label>
                <input
                  id="rds-valor"
                  type={redEditando.tipo === 'telefono' ? 'tel' : 'text'}
                  value={valorForm}
                  onChange={(e) => setValorForm(e.target.value)}
                  placeholder={redEditando.placeholder}
                  autoFocus
                />
                <p className="rds-modal-ayuda">
                  {redEditando.tipo === 'telefono'
                    ? 'Escribí el número con código de país. Se abre un chat directo.'
                    : `Solo tu usuario, sin la arroba. También podés pegar el enlace completo.`}
                </p>

                <div className="rds-modal-acciones">
                  <button type="button" className="rds-btn-secundario" onClick={cerrarEditor}>
                    Cancelar
                  </button>
                  <button type="submit" className="rds-btn-primario">
                    Guardar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
