import { useState } from 'react'
import { motion } from 'framer-motion'
import Icon from '../icons/Icon'

// Iconos de categoria: cubre las de negocio y de proveedor porque el
// mismo componente sirve para los dos flujos (objetivo="negocio" o
// objetivo="proveedor").
const CATEGORIA_ICONOS = {
  Pulpería: 'store', Restaurante: 'utensils', Ferretería: 'tool', Farmacia: 'heart',
  Boutique: 'shirt', Supermercado: 'shopping-cart', Barbería: 'edit-2', Otro: 'tag',
  Bebidas: 'droplet', Abarrotes: 'package', Lácteos: 'box', Carnes: 'package',
  Panadería: 'box', Limpieza: 'droplet', Electrónica: 'zap',
}

function iniciales(nombre) {
  const partes = (nombre || '').trim().split(/\s+/).filter(Boolean)
  if (!partes.length) return '?'
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[1][0]).toUpperCase()
}

// Flujo de 3 pasos: buscar en el directorio -> ver el perfil de un
// candidato (Seleccionar / Cancelar) -> formulario de solicitud con
// canal de envio y descripcion. Sirve para los dos sentidos
// (proveedor pidiendo negocio, o negocio pidiendo proveedor); quien
// lo usa solo cambia "objetivo", "directorio" y "categorias".
export default function SolicitarAsociacion({
  objetivo,       // 'negocio' | 'proveedor'
  directorio,     // candidatos disponibles (ya sin los que estan pendientes/aceptados)
  categorias,
  onEnviar,       // (datos) => void
  onManual,       // abre el formulario libre para uno que no esta en la lista
  onCerrar,
}) {
  const [paso, setPaso] = useState('buscar')
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('todas')
  const [categoriaCustom, setCategoriaCustom] = useState('')
  const [viendo, setViendo] = useState(null)
  const [elegido, setElegido] = useState(null)
  const [canal, setCanal] = useState('plataforma')
  const [descripcion, setDescripcion] = useState('')

  const filtrados = directorio.filter((d) => {
    const texto = busqueda.trim().toLowerCase()
    if (texto && !d.nombre.toLowerCase().includes(texto) && !d.categoria.toLowerCase().includes(texto)) return false
    if (categoria !== 'todas') {
      if (categoria === 'Otro') {
        const custom = categoriaCustom.trim().toLowerCase()
        if (custom && !d.categoria.toLowerCase().includes(custom)) return false
      } else if (d.categoria !== categoria) {
        return false
      }
    }
    return true
  })

  const abrirPerfil = (entry) => { setViendo(entry); setPaso('perfil') }
  const cancelarPerfil = () => { setViendo(null); setPaso('buscar') }
  const seleccionar = () => { setElegido(viendo); setCanal('plataforma'); setDescripcion(''); setPaso('formulario') }
  const volverAlPerfil = () => { setPaso('perfil') }

  const enviar = (e) => {
    e.preventDefault()
    if (!elegido) return
    onEnviar({
      nombre: elegido.nombre,
      categoria: elegido.categoria,
      propietario: elegido.propietario || elegido.contacto || '',
      whatsapp: elegido.telefono || '',
      correo: elegido.correo || '',
      direccion: '',
      municipio: elegido.municipio || '',
      departamento: elegido.departamento || '',
      descripcion: descripcion.trim() || elegido.descripcion || '',
      imagen: elegido.imagen || null,
    })
  }

  const canalNota = {
    plataforma: 'Le llega como aviso dentro de Vincco.',
    correo: elegido?.correo ? `Se le escribe a ${elegido.correo}.` : `Este ${objetivo} no tiene correo registrado.`,
    whatsapp: elegido?.telefono && elegido?.whatsapp ? `Se abre un mensaje prellenado a ${elegido.telefono}.` : `Este ${objetivo} no tiene WhatsApp registrado.`,
  }

  return (
    <div className="na-modal-overlay" onClick={onCerrar}>
      <motion.div
        className="na-dir-modal"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Paso 1: buscar ─────────────────────────────── */}
        {paso === 'buscar' && (
          <>
            <div className="na-modal-header">
              <h3>Buscar {objetivo}</h3>
              <button className="na-modal-cerrar" onClick={onCerrar} type="button" aria-label="Cerrar">
                <Icon name="x" size={16} />
              </button>
            </div>

            <div className="na-dir-toolbar">
              <div className="na-dir-search">
                <Icon name="search" size={15} />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder={`Buscar ${objetivo}…`}
                  autoFocus
                />
              </div>
              <select
                className="na-dir-select"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="todas">Todas las categorías</option>
                {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {categoria === 'Otro' && (
                <input
                  type="text"
                  className="na-dir-custom"
                  value={categoriaCustom}
                  onChange={(e) => setCategoriaCustom(e.target.value)}
                  placeholder="Escribí la categoría que buscás…"
                  autoFocus
                />
              )}
            </div>

            <div className="na-dir-grid">
              {filtrados.length === 0 ? (
                <div className="na-dir-vacio">
                  <Icon name="search" size={26} />
                  <p>No encontramos {objetivo}s con esa búsqueda.</p>
                </div>
              ) : (
                filtrados.map((entry) => (
                  <button
                    type="button"
                    key={entry.id}
                    className="na-dir-card"
                    onClick={() => abrirPerfil(entry)}
                  >
                    <span className="na-dir-card-media" style={{ background: entry.color }}>
                      {entry.imagen ? <img src={entry.imagen} alt="" /> : iniciales(entry.nombre)}
                    </span>
                    <span className="na-dir-card-body">
                      <span className="na-dir-card-name">
                        {entry.nombre}
                        {entry.verificado && <Icon name="check-circle" size={13} className="na-dir-card-check" />}
                      </span>
                      <span className="na-dir-card-sub">{entry.propietario || entry.contacto} · {entry.municipio}, {entry.departamento}</span>
                      <span className="na-dir-card-tag">{entry.categoria}</span>
                    </span>
                    <span className="na-dir-card-cta">
                      Ver perfil <Icon name="chevron-right" size={14} />
                    </span>
                  </button>
                ))
              )}
            </div>

            {onManual && (
              <button type="button" className="na-dir-manual" onClick={onManual}>
                ¿No lo encontrás? Agregalo con sus datos
              </button>
            )}
          </>
        )}

        {/* ── Paso 2: perfil ─────────────────────────────── */}
        {paso === 'perfil' && viendo && (
          <>
            <button className="na-modal-cerrar na-dir-cerrar-flotante" onClick={onCerrar} type="button" aria-label="Cerrar">
              <Icon name="x" size={16} />
            </button>
            <div className="na-dir-profile-banner" style={{ background: `linear-gradient(135deg, ${viendo.color} 0%, ${viendo.color}bb 100%)` }}>
              <span className="na-dir-profile-avatar">
                {viendo.imagen ? <img src={viendo.imagen} alt="" /> : iniciales(viendo.nombre)}
              </span>
              <div>
                <h2>{viendo.nombre}</h2>
                <p>{viendo.municipio}, {viendo.departamento}</p>
              </div>
            </div>
            <div className="na-dir-profile-body">
              <div className="na-dir-profile-chips">
                <span className="tag-chip"><Icon name={CATEGORIA_ICONOS[viendo.categoria] || 'tag'} size={12} /> {viendo.categoria}</span>
                {viendo.verificado && <span className="tag-chip tag-chip--ok"><Icon name="check-circle" size={12} /> Verificado</span>}
              </div>
              <div className="na-dir-profile-meta">
                <div><Icon name="user" size={15} /><span><small>Propietario / Contacto</small>{viendo.propietario || viendo.contacto}</span></div>
                <div><Icon name="phone" size={15} /><span><small>Teléfono</small>{viendo.telefono}</span></div>
                {viendo.correo && <div><Icon name="mail" size={15} /><span><small>Correo electrónico</small>{viendo.correo}</span></div>}
                <div><Icon name="message-circle" size={15} /><span><small>WhatsApp</small>{viendo.whatsapp ? 'Disponible' : 'No registrado'}</span></div>
              </div>
              <p className="na-dir-profile-desc">{viendo.descripcion}</p>
              <div className="na-form-acciones">
                <button type="button" className="na-btn-secundario" onClick={cancelarPerfil}>Cancelar</button>
                <button type="button" className="na-btn-primario" onClick={seleccionar}>
                  <Icon name="check" size={14} /> Seleccionar
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── Paso 3: formulario de solicitud ────────────── */}
        {paso === 'formulario' && elegido && (
          <>
            <div className="na-modal-header">
              <h3>Solicitar asociación</h3>
              <button className="na-modal-cerrar" onClick={onCerrar} type="button" aria-label="Cerrar">
                <Icon name="x" size={16} />
              </button>
            </div>
            <button type="button" className="na-dir-volver" onClick={volverAlPerfil}>
              <Icon name="arrow-left" size={13} /> Volver al perfil de {elegido.nombre}
            </button>

            <div className="na-dir-target">
              <span className="na-dir-target-avatar" style={{ background: elegido.color }}>
                {elegido.imagen ? <img src={elegido.imagen} alt="" /> : iniciales(elegido.nombre)}
              </span>
              <div>
                <strong>{elegido.nombre}</strong>
                <span>{elegido.categoria} · {elegido.municipio}</span>
              </div>
            </div>

            <form className="na-form" onSubmit={enviar}>
              <div className="na-form-grupo">
                <label>Cómo enviar la solicitud <span className="na-dir-opcional">(opcional, además de por Vincco)</span></label>
                <div className="na-dir-canales">
                  <label className={`na-dir-canal ${canal === 'plataforma' ? 'na-dir-canal--activo' : ''}`}>
                    <input type="radio" name="canal" checked={canal === 'plataforma'} onChange={() => setCanal('plataforma')} />
                    <Icon name="globe" size={16} />
                    <span>Por la plataforma</span>
                  </label>
                  <label className={`na-dir-canal ${canal === 'correo' ? 'na-dir-canal--activo' : ''} ${!elegido.correo ? 'na-dir-canal--deshabilitado' : ''}`}>
                    <input type="radio" name="canal" checked={canal === 'correo'} disabled={!elegido.correo} onChange={() => setCanal('correo')} />
                    <Icon name="mail" size={16} />
                    <span>Por correo{!elegido.correo && <small>No disponible</small>}</span>
                  </label>
                  <label className={`na-dir-canal ${canal === 'whatsapp' ? 'na-dir-canal--activo' : ''} ${!elegido.whatsapp ? 'na-dir-canal--deshabilitado' : ''}`}>
                    <input type="radio" name="canal" checked={canal === 'whatsapp'} disabled={!elegido.whatsapp} onChange={() => setCanal('whatsapp')} />
                    <Icon name="message-circle" size={16} />
                    <span>Por WhatsApp{!elegido.whatsapp && <small>No disponible</small>}</span>
                  </label>
                </div>
                <p className="na-dir-canal-preview">{canalNota[canal]}</p>
              </div>

              <div className="na-form-grupo">
                <label>Descripción breve <span className="na-dir-opcional">(opcional)</span></label>
                <textarea
                  rows={3}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder={`Contale brevemente por qué querés asociarte con este ${objetivo}…`}
                />
              </div>

              <p className="na-form-aviso">
                <Icon name="info" size={13} />
                Esto le manda un aviso al {objetivo}. Queda asociado recién cuando lo acepte.
              </p>

              <div className="na-form-acciones">
                <button type="button" className="na-btn-secundario" onClick={onCerrar}>Cancelar</button>
                <button type="submit" className="na-btn-primario">Enviar solicitud</button>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </div>
  )
}
