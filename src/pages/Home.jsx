import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import HeroBanner from '../components/HeroBanner'
import CarouselAnuncios from '../components/CarouselAnuncios'
import useStore from '../store/puntos_usestore'
import useLikes from '../hooks/useLikes'
import Icon from '../components/icons/Icon'
import { COLORES_HOME } from '../styles/colores'
import {
  categorias,
  promociones,
  recompensas,
  pasosComoFunciona,
  pasosNegocios,
  pasosProveedores,
  promocionesLimitadas,
  destacadas,
} from '../data/data_falso'

function useLocalData(key, fallback) {
  const [data, setData] = useState(fallback)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.length > 0) setData(parsed)
      }
    } catch {}
  }, [key])
  return data
}

// Los hex vivian escritos aca y repetidos en Mispuntos.jsx.
// Ahora salen de un solo lugar; los valores son identicos.
const C = COLORES_HOME

const cardStyle = {
  backgroundColor: C.card,
  borderRadius: 24,
  padding: 28,
  boxShadow: '0 2px 14px rgba(0,42,61,0.07), 0 0 0 1px rgba(0,63,90,0.04)',
  marginBottom: 20,
}

const sectionStyle = { marginBottom: 24 }

const headerRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 18,
}

const eyebrowStyle = {
  margin: 0,
  fontSize: 11,
  color: C.gold,
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
  fontWeight: 800,
  fontFamily: "'Sora', 'Inter', sans-serif",
}

const sectionTitleStyle = {
  margin: '6px 0 0',
  fontSize: 21,
  fontWeight: 700,
  color: C.onDark,
  fontFamily: "'Sora', 'Inter', sans-serif",
  letterSpacing: '-0.01em',
}

const cardTitleStyle = {
  ...sectionTitleStyle,
  color: C.textDark,
}

const verTodasBtnStyle = {
  backgroundColor: 'rgba(255,255,255,0.06)',
  color: C.onDark,
  border: '1.5px solid rgba(255,255,255,0.22)',
  borderRadius: 999,
  padding: '7px 18px',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 700,
  fontFamily: 'inherit',
  transition: 'all 0.2s',
}

const primaryBtnStyle = {
  backgroundColor: C.orange,
  color: '#ffffff',
  border: 'none',
  borderRadius: 999,
  cursor: 'pointer',
  fontWeight: 700,
  fontFamily: 'inherit',
  transition: 'all 0.2s',
}

const twoColGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }
const twoColGridSm = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }

const catIconMap = {
  'Restaurante': 'utensils',
  'Ropa': 'shirt',
  'Cafetería': 'coffee',
  'Tecnología': 'laptop',
}

const promoScrollStyle = {
  display: 'flex',
  gap: 20,
  overflowX: 'auto',
  scrollSnapType: 'x mandatory',
  paddingBottom: 10,
  paddingTop: 2,
}

const promoCardStyle = {
  flex: '0 0 auto',
  width: 'clamp(228px, 72vw, 272px)',
  scrollSnapAlign: 'start',
  backgroundColor: C.card,
  borderRadius: 22,
  overflow: 'hidden',
  boxShadow: '0 4px 18px rgba(15,23,42,0.08)',
  border: `1px solid ${C.border}`,
  cursor: 'pointer',
}

const promoMediaStyle = {
  position: 'relative',
  height: 140,
  display: 'grid',
  placeItems: 'center',
  overflow: 'hidden',
}

const promoMediaPatternStyle = {
  position: 'absolute',
  inset: 0,
  backgroundImage: 'radial-gradient(rgba(255,255,255,0.18) 1.5px, transparent 1.5px)',
  backgroundSize: '18px 18px',
  opacity: 0.6,
}

const promoBadgeStyle = {
  position: 'absolute',
  top: 12,
  left: 12,
  padding: '5px 12px',
  borderRadius: 999,
  backgroundColor: 'rgba(255,255,255,0.92)',
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.02em',
  zIndex: 2,
  boxShadow: '0 2px 8px rgba(0,0,0,0.14)',
}

const promoIconWrapStyle = {
  width: 64,
  height: 64,
  borderRadius: '50%',
  backgroundColor: 'rgba(255,255,255,0.18)',
  border: '1.5px solid rgba(255,255,255,0.35)',
  display: 'grid',
  placeItems: 'center',
  zIndex: 1,
}

const promoImgStyle = { width: '100%', height: '100%', objectFit: 'cover' }

const promoBodyStyle = { padding: '18px 20px 20px' }

const promoCatStyle = {
  margin: '0 0 4px',
  fontSize: 11,
  color: C.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  fontWeight: 700,
}

const promoNombreStyle = {
  margin: '0 0 14px',
  fontSize: 17,
  fontWeight: 700,
  color: C.textDark,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

const promoDividerStyle = {
  height: 1,
  backgroundColor: C.border,
  margin: '0 0 14px',
}

const promoFooterStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
}

const promoPointsStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  backgroundColor: C.greenBg,
  padding: '5px 12px',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  color: C.greenText,
}

const promoArrowBtnStyle = {
  width: 32,
  height: 32,
  borderRadius: '50%',
  display: 'grid',
  placeItems: 'center',
  flexShrink: 0,
  boxShadow: '0 3px 10px rgba(0,0,0,0.18)',
}

const navArrowBtnStyle = {
  width: 34,
  height: 34,
  borderRadius: '50%',
  border: '1.5px solid rgba(255,255,255,0.22)',
  backgroundColor: 'rgba(255,255,255,0.06)',
  color: C.onDark,
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',
}

const pasoCardStyle = {
  backgroundColor: 'rgba(255,255,255,0.08)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  borderRadius: 18,
  padding: 18,
  border: '1px solid rgba(255,255,255,0.16)',
}

const circleNumStyle = {
  width: 34,
  height: 34,
  borderRadius: '50%',
  color: '#ffffff',
  display: 'grid',
  placeItems: 'center',
  fontWeight: 700,
  fontSize: 14,
  flexShrink: 0,
}

function SeccionBienvenida({ usuario, userType }) {
  const esSocio = userType === 'negocio' || userType === 'proveedor'

  return (
    <section style={{
      ...cardStyle,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 16,
      background: esSocio
        ? `linear-gradient(135deg, #fffaf0 0%, ${C.goldLight} 100%)`
        : `linear-gradient(135deg, ${C.card} 0%, ${C.primaryLight} 100%)`,
      border: esSocio ? '1px solid #fbdca0' : `1px solid ${C.border}`,
    }}>
      <div>
        <p style={{ margin: 0, fontSize: 13, color: C.textMuted, fontWeight: 600 }}>
          Bienvenido de nuevo
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '6px 0 4px' }}>
          <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.textDark, fontFamily: "'Sora', 'Inter', sans-serif", letterSpacing: '-0.01em' }}>
            {usuario.nombre}
          </h3>
          {esSocio && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,
              color: '#ffffff',
              fontSize: 10,
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: 999,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              boxShadow: '0 2px 8px rgba(217,140,31,0.35)',
            }}>
              <Icon name="star" filled size={11} /> Socio
            </span>
          )}
        </div>
        <p style={{ margin: 0, fontSize: 13, color: C.primary, fontWeight: 500 }}>
          {esSocio ? 'Panel de administración' : 'Tablero de puntos en negocios'}
        </p>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: esSocio
          ? `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`
          : `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
        padding: '14px 22px',
        borderRadius: 18,
        boxShadow: esSocio
          ? '0 4px 14px rgba(217,140,31,0.3)'
          : '0 4px 14px rgba(13,148,136,0.25)',
      }}>
        <Icon name="star" filled size={24} style={{ color: '#ffffff' }} />
        <div>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#ffffff' }}>
            {usuario.puntos}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>
            puntos
          </p>
        </div>
      </div>
    </section>
  )
}

function SeccionCategorias() {
  return (
    <section style={sectionStyle}>
      <div style={headerRowStyle}>
        <div>
          <p style={eyebrowStyle}>EXPLORA</p>
          <h3 style={sectionTitleStyle}>Categorías</h3>
        </div>
        <button style={verTodasBtnStyle}>Ver todas</button>
      </div>
      <div className="home-cat-scroll" style={{
        display: 'flex',
        gap: 16,
        overflowX: 'auto',
        paddingBottom: 20,
      }}>
        {categorias.map((cat) => (
          <div key={cat.id} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            minWidth: 80,
            cursor: 'pointer',
          }}>
            <div style={{
              width: 68,
              height: 68,
              borderRadius: 20,
              backgroundColor: C.card,
              boxShadow: '0 6px 16px rgba(0,24,36,0.22)',
              border: `1px solid ${C.border}`,
              display: 'grid',
              placeItems: 'center',
              transition: 'all 0.2s',
            }}>
              <Icon name={cat.icono} size={28} style={{ color: C.primary }} />
            </div>
            <span style={{ fontSize: 12, color: C.onDarkMuted, fontWeight: 600, textAlign: 'center' }}>
              {cat.nombre}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

function PromoCard({ promo, index }) {
  const icon = catIconMap[promo.categoria] || 'store'

  return (
    <motion.div
      className="promo-card"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      style={promoCardStyle}
    >
      <div style={{
        ...promoMediaStyle,
        background: `linear-gradient(135deg, ${promo.color} 0%, ${promo.color}cc 100%)`,
      }}>
        <div style={promoMediaPatternStyle} />
        <span style={{ ...promoBadgeStyle, color: promo.color }}>{promo.badge}</span>
        {promo.imagen ? (
          <img src={promo.imagen} alt={promo.nombre} style={promoImgStyle} />
        ) : (
          <motion.div
            style={promoIconWrapStyle}
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
          >
            <Icon name={icon} size={36} style={{ color: '#ffffff' }} />
          </motion.div>
        )}
      </div>
      <div style={promoBodyStyle}>
        <p style={promoCatStyle}>{promo.categoria}</p>
        <h4 style={promoNombreStyle}>{promo.nombre}</h4>
        <div style={promoDividerStyle} />
        <div style={promoFooterStyle}>
          <div style={promoPointsStyle}>
            <Icon name="star" filled size={12} style={{ color: C.greenText }} />
            <span>{promo.puntos}</span>
          </div>
          <div style={{ ...promoArrowBtnStyle, backgroundColor: promo.color }}>
            <Icon name="arrow-right" size={14} style={{ color: '#ffffff' }} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function SeccionPromociones() {
  const scrollRef = useRef(null)
  const promosLocales = useLocalData('pn_promociones', [])
  const promosCombinadas = promosLocales.length > 0
    ? promosLocales.map((p, i) => ({
        id: p.id,
        badge: p.descuento ? `${p.descuento}% OFF` : 'Promoción',
        categoria: p.titulo,
        nombre: p.descripcion || p.titulo,
        puntos: p.puntos || 'Especial',
        color: '#c05900',
        imagen: p.imagen || null,
      }))
    : promociones

  const scrollByAmount = (dir) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.82, behavior: 'smooth' })
  }

  return (
    <section style={sectionStyle}>
      <div style={headerRowStyle}>
        <div>
          <p style={eyebrowStyle}>OFERTAS QUE TE ENCANTARÁN</p>
          <h3 style={sectionTitleStyle}>Promociones locales</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="promo-nav-group" style={{ display: 'flex', gap: 8 }}>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => scrollByAmount(-1)}
              style={navArrowBtnStyle}
              aria-label="Promoción anterior"
            >
              <Icon name="arrow-left" size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => scrollByAmount(1)}
              style={navArrowBtnStyle}
              aria-label="Siguiente promoción"
            >
              <Icon name="arrow-right" size={16} />
            </motion.button>
          </div>
          <button style={verTodasBtnStyle}>Ver todas</button>
        </div>
      </div>
      <div className="promo-scroll" ref={scrollRef} style={promoScrollStyle}>
        {promosCombinadas.map((p, i) => (
          <PromoCard key={p.id} promo={p} index={i} />
        ))}
      </div>
    </section>
  )
}

function SeccionRecompensas({ userType }) {
  const esSocio = userType === 'negocio' || userType === 'proveedor'

  return (
    <section style={sectionStyle}>
      <div style={headerRowStyle}>
        <div>
          <p style={eyebrowStyle}>{esSocio ? 'TUS BENEFICIOS' : 'CANJEA TUS PUNTOS'}</p>
          <h3 style={sectionTitleStyle}>{esSocio ? 'Panel Socio' : 'Recompensas disponibles'}</h3>
        </div>
        <button style={verTodasBtnStyle}>Ver todas</button>
      </div>
      <div className="home-grid-2" style={twoColGrid}>
        {recompensas.map((r) => (
          <div key={r.id} style={{
            backgroundColor: C.card,
            borderRadius: 18,
            padding: 18,
            boxShadow: '0 2px 10px rgba(15,23,42,0.04)',
            border: `1px solid ${C.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            transition: 'all 0.2s',
          }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${C.primaryLight}, ${C.primaryLight}cc)`,
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}>
              <Icon name={r.emoji} size={24} style={{ color: C.primary }} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 3px', fontSize: 15, fontWeight: 700, color: C.textDark }}>
                {r.titulo}
              </h4>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.primary }}>
                {r.puntos} pts
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function SeccionProductos() {
  const productosLocales = useLocalData('pn_productos', [])

  if (productosLocales.length === 0) return null

  return (
    <section style={sectionStyle}>
      <div style={headerRowStyle}>
        <div>
          <p style={eyebrowStyle}>LO ÚLTIMO</p>
          <h3 style={sectionTitleStyle}>Productos nuevos</h3>
        </div>
        <button style={verTodasBtnStyle}>Ver todo</button>
      </div>
      <div style={{
        display: 'flex',
        gap: 16,
        overflowX: 'auto',
        paddingBottom: 8,
      }}>
        {productosLocales.map((p) => (
          <div key={p.id} style={{
            minWidth: 200,
            backgroundColor: C.card,
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 2px 14px rgba(0,42,61,0.07), 0 0 0 1px rgba(0,63,90,0.04)',
            flexShrink: 0,
            transition: 'all 0.2s',
          }}>
            <div style={{
              height: 140,
              background: p.imagen
                ? `url(${p.imagen}) center/cover no-repeat`
                : `linear-gradient(135deg, ${C.primaryLight}, ${C.primaryLight}cc)`,
              display: 'grid',
              placeItems: 'center',
            }}>
              {!p.imagen && <Icon name="package" size={40} style={{ color: C.primary }} />}
            </div>
            <div style={{ padding: '14px 16px' }}>
              <h4 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: C.textDark }}>
                {p.titulo}
              </h4>
              {p.descripcion && (
                <p style={{ margin: '0 0 8px', fontSize: 12, color: C.textMuted, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {p.descripcion}
                </p>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {p.precio && (
                  <span style={{ fontSize: 18, fontWeight: 900, color: C.accent }}>
                    C${p.precio}
                  </span>
                )}
                {p.stock && (
                  <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 600 }}>
                    {p.stock} uds.
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function SeccionLimitadas() {
  const limitadasLocales = useLocalData('pn_limitadas', [])

  const items = limitadasLocales.length > 0
    ? limitadasLocales.map((p) => ({
        id: p.id,
        titulo: p.titulo,
        descripcion: p.descripcion || (p.descuento ? `Oferta: ${p.descuento}` : ''),
        badge: p.descuento || null,
        imagen: p.imagen || null,
        validoHasta: p.validoHasta || null,
      }))
    : promocionesLimitadas.map((p) => ({ ...p, imagen: null, badge: null, validoHasta: null }))

  return (
    <section style={cardStyle}>
      <div style={{ marginBottom: 20 }}>
        <p style={eyebrowStyle}>NO TE LO PIERDAS</p>
        <h3 style={{ ...cardTitleStyle, marginTop: 4 }}>Promociones Limitadas</h3>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: C.textMuted }}>
          Disfruta de las promociones de VINCCO
        </p>
      </div>
      <div className="home-grid-3" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 14,
      }}>
        {items.map((pl) => (
          <div key={pl.id} style={{
            borderRadius: 18,
            padding: 0,
            overflow: 'hidden',
            background: pl.imagen
              ? `linear-gradient(135deg, ${C.primaryLight} 0%, #ffffff 100%)`
              : `linear-gradient(135deg, ${C.primaryLight} 0%, #ffffff 100%)`,
            border: `1px solid ${C.border}`,
            transition: 'all 0.2s',
            minHeight: 140,
            position: 'relative',
          }}>
            {pl.imagen && (
              <div style={{
                width: '100%',
                height: 120,
                overflow: 'hidden',
              }}>
                <img src={pl.imagen} alt={pl.titulo} style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }} />
              </div>
            )}
            <div style={{
              padding: pl.imagen ? '14px 18px 18px' : 22,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              flex: 1,
            }}>
              {pl.badge && (
                <span style={{
                  display: 'inline-flex',
                  alignSelf: 'flex-start',
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: 999,
                  marginBottom: 8,
                }}>
                  {pl.badge}
                </span>
              )}
              <h4 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: C.textDark }}>
                {pl.titulo}
              </h4>
              <p style={{ margin: 0, fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>
                {pl.descripcion}
              </p>
              {pl.validoHasta && (
                <p style={{ margin: '6px 0 0', fontSize: 11, color: '#8f5a00', fontWeight: 600 }}>
                  <Icon name="calendar" size={10} /> Hasta {pl.validoHasta}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function SeccionDestacadas() {
  const destacadasLocales = useLocalData('pn_destacadas', [])
  const { getLikes, isLikedByMe, toggleLike } = useLikes()

  const itemsBase = destacadasLocales.length > 0
    ? destacadasLocales.map((d) => ({
        id: d.id,
        titulo: d.titulo,
        descripcion: d.descripcion,
        categoria: d.categoria || '',
        imagen: d.imagen || null,
        likesBase: 0,
      }))
    : destacadas.map((d) => ({ ...d, likesBase: d.likes || 0, imagen: null }))

  const items = [...itemsBase]
    .map((d) => ({ ...d, likes: getLikes(d.id, d.likesBase) }))
    .sort((a, b) => b.likes - a.likes)

  return (
    <section style={sectionStyle}>
      <div style={headerRowStyle}>
        <div>
          <p style={eyebrowStyle}>LO MÁS QUERIDO</p>
          <h3 style={sectionTitleStyle}>Destacadas</h3>
        </div>
        <button style={verTodasBtnStyle}>Ver todas</button>
      </div>
      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
        {items.map((d) => (
          <div key={d.id} style={{
            minWidth: 220,
            backgroundColor: C.card,
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 2px 14px rgba(0,42,61,0.07), 0 0 0 1px rgba(0,63,90,0.04)',
            flexShrink: 0,
          }}>
            <div style={{
              height: 130,
              background: d.imagen
                ? `url(${d.imagen}) center/cover no-repeat`
                : 'linear-gradient(135deg, #fde2e8, #fff5f7)',
              display: 'grid',
              placeItems: 'center',
            }}>
              {!d.imagen && <Icon name="trending-up" size={36} style={{ color: '#e11d48' }} />}
            </div>
            <div style={{ padding: '14px 16px' }}>
              {d.categoria && (
                <p style={{ margin: '0 0 4px', fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                  {d.categoria}
                </p>
              )}
              <h4 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: C.textDark }}>
                {d.titulo}
              </h4>
              {d.descripcion && (
                <p style={{ margin: '0 0 10px', fontSize: 12, color: C.textMuted, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {d.descripcion}
                </p>
              )}
              <button
                onClick={() => toggleLike(d.id, d.likesBase)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  border: 'none',
                  background: isLikedByMe(d.id) ? '#ffe4e9' : C.subtleBg,
                  color: isLikedByMe(d.id) ? '#e11d48' : C.textMuted,
                  borderRadius: 999,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Icon name="heart" filled={isLikedByMe(d.id)} size={14} />
                {d.likes}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  const usuario = useStore((s) => s.usuario)
  const userType = useStore((s) => s.userType)

  return (
    <div style={{
      background: 'linear-gradient(180deg, #002e43 0%, #003f5a 38%, #3f6f84 100%)',
      minHeight: '100vh',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: C.textDark,
    }}>
      <style>{`
        .home-cat-scroll::-webkit-scrollbar { height: 0; }
        .home-cat-scroll { scrollbar-width: none; }
        .promo-scroll::-webkit-scrollbar { height: 0; }
        .promo-scroll { scrollbar-width: none; scroll-behavior: smooth; }
        .promo-card:hover { box-shadow: 0 14px 32px rgba(15,23,42,0.16) !important; border-color: rgba(0,63,90,0.18) !important; }
        .promo-nav-group button:hover { background-color: rgba(255,255,255,0.14) !important; }
        input::placeholder { color: ${C.textMuted}; }
        @media (max-width: 600px) {
          .home-grid-2 { grid-template-columns: 1fr !important; }
          .home-grid-3 { grid-template-columns: 1fr !important; }
          .home-two-col { grid-template-columns: 1fr !important; }
        }
        /* Tablet: faltaba este tramo. Las de 3 columnas quedaban
           demasiado angostas entre 601px y 1024px. */
        @media (min-width: 601px) and (max-width: 1024px) {
          .home-grid-3 { grid-template-columns: 1fr 1fr !important; }
          .home-two-col { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <HeroBanner />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 40px' }}>
        <SeccionBienvenida usuario={usuario} userType={userType} />
        <SeccionCategorias />
        <SeccionPromociones />
        <SeccionRecompensas userType={userType} />
        <SeccionProductos />
        <SeccionDestacadas />
        <CarouselAnuncios slides={[
          <>
            <p style={{ margin: 0, fontSize: 12, color: C.gold, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>
              Así de fácil es ganar
            </p>
            <h3 style={{ margin: '8px 0 12px', fontSize: 25, fontWeight: 700, color: C.onDark }}>
              4 pasos para ser un miembro verificado
            </h3>
            <p style={{ margin: '0 0 24px', fontSize: 15, color: C.onDarkMuted, lineHeight: 1.7, maxWidth: 480 }}>
              Regístrate, compra en comercios locales, acumula puntos y canjéalos por experiencias y descuentos exclusivos.
            </p>
            <button style={{
              ...primaryBtnStyle,
              padding: '13px 30px',
              fontSize: 14,
              marginBottom: 20,
              background: `linear-gradient(135deg, ${C.orange}, ${C.orangeDark})`,
              boxShadow: '0 4px 14px rgba(192,89,0,0.3)',
            }}>
              Registrarme
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pasosComoFunciona.map((paso) => (
                <div key={paso.id} style={pasoCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                    <div style={{ ...circleNumStyle, background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})` }}>
                      {paso.id}
                    </div>
                    <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.onDark }}>{paso.title}</h4>
                  </div>
                  <p style={{ margin: 0, color: C.onDarkMuted, fontSize: 14, lineHeight: 1.6 }}>{paso.description}</p>
                </div>
              ))}
            </div>
          </>,
          <>
            <div style={{ marginBottom: 20 }}>
              <p style={{ margin: 0, fontSize: 12, color: C.gold, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>
                Negocios
              </p>
              <h3 style={{ margin: '6px 0 8px', fontSize: 25, fontWeight: 700, color: C.onDark }}>
                Sé parte de VINCCO
              </h3>
              <p style={{ margin: 0, fontSize: 15, color: C.onDarkMuted, lineHeight: 1.7, maxWidth: 560 }}>
                Promueve tu negocio y aumenta tus ventas mediante nuestro ecosistema digital.
              </p>
            </div>
            <div style={twoColGridSm}>
              {pasosNegocios.map((paso) => (
                <div key={paso.id} style={pasoCardStyle}>
                  <div style={{ ...circleNumStyle, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, marginBottom: 10 }}>
                    {paso.id}
                  </div>
                  <h4 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: C.onDark }}>{paso.title}</h4>
                  <p style={{ margin: 0, color: C.onDarkMuted, fontSize: 13, lineHeight: 1.6 }}>{paso.description}</p>
                </div>
              ))}
            </div>
          </>,
          <>
            <div style={{ marginBottom: 20 }}>
              <p style={{ margin: 0, fontSize: 12, color: '#5eead4', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>
                Proveedores
              </p>
              <h3 style={{ margin: '6px 0 8px', fontSize: 25, fontWeight: 700, color: C.onDark }}>
                Sé parte de VINCCO
              </h3>
              <p style={{ margin: 0, fontSize: 15, color: C.onDarkMuted, lineHeight: 1.7, maxWidth: 560 }}>
                Distribuye tus productos a los negocios de VINCCO y aumenta tus ventas.
              </p>
            </div>
            <div style={twoColGridSm}>
              {pasosProveedores.map((paso) => (
                <div key={paso.id} style={pasoCardStyle}>
                  <div style={{ ...circleNumStyle, background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`, marginBottom: 10 }}>
                    {paso.id}
                  </div>
                  <h4 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: C.onDark }}>{paso.title}</h4>
                  <p style={{ margin: 0, color: C.onDarkMuted, fontSize: 13, lineHeight: 1.6 }}>{paso.description}</p>
                </div>
              ))}
            </div>
          </>,
        ]} />
        <SeccionLimitadas />
      </div>
    </div>
  )
}
