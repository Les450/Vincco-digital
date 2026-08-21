import { useRef, useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Star, Store, Truck, Trophy, Medal, Award, Crown, Gem } from 'lucide-react'
import HeroBanner from '../components/HeroBanner'
import CarouselAnuncios from '../components/CarouselAnuncios'
import HojaPromocion from '../components/promocion/HojaPromocion'
import useStore, { perfilDeSucursal } from '../store/puntos_usestore'
import useLikes from '../hooks/useLikes'
import Icon from '../components/icons/Icon'
import { HighlightCard } from '../components/ui/card-5'
import { COLORES_HOME } from '../styles/colores'
import {
  CLAVE_PROMOCIONES,
  CLAVE_PRODUCTOS,
  CLAVE_DESTACADAS,
  promocionesVisibles,
  productosVisibles,
  destacadasVisibles,
  textoPuntos,
  textoPrecio,
  esAsociado,
} from '../utils/promociones'
import {
  categorias,
  proveedoresAsociados,
  recompensas,
  pasosComoFunciona,
  pasosNegocios,
  pasosProveedores,
  rankingNegocio,
  niveles,
} from '../data/data_falso'

/* Datos del negocio para las promociones publicadas antes de que la
   publicación guardara a su dueño. Sin esto, esas promociones viejas
   abren el detalle sin nombre, sin teléfono y sin WhatsApp.        */
function useNegocioRespaldo(rol = 'negocio') {
  const perfil = useStore((s) => s.perfiles?.[rol])
  const sucursal = useStore((s) =>
    s.sucursales?.[rol]?.find((x) => x.id === s.sucursalActiva?.[rol])
  )
  return useMemo(() => perfilDeSucursal(perfil, sucursal), [perfil, sucursal])
}

/* Lo que el cliente ve en cada sección del Home.

   Un solo hook para los cuatro carruseles: cambia el tipo, no la
   forma. El cliente ve lo de todos los negocios; el socio, lo de la
   sucursal en la que está parado — que es su propio escaparate.  */
function usePublicaciones(tipo) {
  const userType = useStore((s) => s.userType)
  const sucursal = useStore((s) => s.sucursalActiva?.[s.userType])

  /* De quién es la vitrina.

     El Home no es el mismo para todos: el cliente ve lo que publican
     los negocios y el negocio ve lo que publican los proveedores,
     que es a quien le compra. El proveedor no le compra a nadie desde
     acá, así que sigue viendo su propio escaparate — lo mismo que ve
     un cliente cuando entra a su perfil.                           */
  const esProveedor = userType === 'proveedor'
  const rolPublicador = esProveedor ? null : userType === 'negocio' ? 'proveedor' : 'negocio'

  // El respaldo tiene que ser el perfil de quien publicó, no el del
  // que mira: si el negocio está viendo cosas de proveedores, las
  // publicaciones viejas se completan con el perfil del proveedor.
  const respaldo = useNegocioRespaldo(rolPublicador || userType)

  const [items, setItems] = useState([])

  useEffect(() => {
    // null = todas las sucursales de todos los que publican
    const clave = (base) => (esProveedor ? (sucursal ? `${base}:${sucursal}` : base) : null)
    const comun = { respaldo, rolPublicador }

    if (tipo === 'promocion' || tipo === 'limitada') {
      setItems(promocionesVisibles({
        ...comun,
        clave: clave(CLAVE_PROMOCIONES),
        limitadas: tipo === 'limitada',
      }))
    } else if (tipo === 'producto') {
      setItems(productosVisibles({ ...comun, clave: clave(CLAVE_PRODUCTOS) }))
    } else {
      setItems(destacadasVisibles({ ...comun, clave: clave(CLAVE_DESTACADAS) }))
    }
  }, [tipo, esProveedor, rolPublicador, sucursal, respaldo])

  /* Marca cuáles ya son proveedores asociados del negocio. Se hace
     acá y no en la tarjeta para que la hoja de detalle también lo
     sepa sin volver a calcularlo. */
  return useMemo(() => {
    if (rolPublicador !== 'proveedor') return items
    return items.map((it) => ({ ...it, asociado: esAsociado(it.negocio, proveedoresAsociados) }))
  }, [items, rolPublicador])
}

/* Los títulos cambian según quién mira: para el cliente son ofertas
   del barrio, para el negocio son sus proveedores. Es la misma
   sección con otro sentido. */
const TEXTOS_SECCION = {
  cliente: {
    promocion: ['OFERTAS QUE TE ENCANTARÁN', 'Promociones locales'],
    producto: ['LO ÚLTIMO', 'Productos nuevos'],
    limitada: ['NO TE LO PIERDAS', 'Promociones limitadas'],
    destacada: ['LO MÁS QUERIDO', 'Destacadas'],
  },
  negocio: {
    promocion: ['OFERTAS DE TUS PROVEEDORES', 'Promociones de proveedores'],
    producto: ['PARA REABASTECERTE', 'Productos de proveedores'],
    limitada: ['APURATE QUE SE ACABA', 'Ofertas limitadas'],
    destacada: ['LO MÁS PEDIDO', 'Destacados de proveedores'],
  },
}

function useTextosSeccion(tipo) {
  const userType = useStore((s) => s.userType)
  const grupo = userType === 'negocio' ? TEXTOS_SECCION.negocio : TEXTOS_SECCION.cliente
  const [eyebrow, titulo] = grupo[tipo]
  return { eyebrow, titulo }
}

// Los hex vivian escritos aca y repetidos en Mispuntos.jsx.
// Ahora salen de un solo lugar; los valores son identicos.
const C = COLORES_HOME

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

const verTodasBtnStyle = {
  backgroundColor: 'rgba(234, 217, 199, 0.06)',
  color: C.onDark,
  border: '1.5px solid rgba(234, 217, 199, 0.22)',
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
  color: '#ead9c7',
  border: 'none',
  borderRadius: 999,
  cursor: 'pointer',
  fontWeight: 700,
  fontFamily: 'inherit',
  transition: 'all 0.2s',
}

const ctaBtnStyle = {
  ...primaryBtnStyle,
  padding: '14px 32px',
  fontSize: 14,
  marginTop: 'auto',
  width: '100%',
  maxWidth: 320,
  background: `linear-gradient(135deg, ${C.orange}, ${C.orangeDark})`,
  boxShadow: '0 4px 14px rgba(192,89,0,0.3)',
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
  backgroundImage: 'radial-gradient(rgba(234, 217, 199, 0.18) 1.5px, transparent 1.5px)',
  backgroundSize: '18px 18px',
  opacity: 0.6,
}

const promoBadgeStyle = {
  position: 'absolute',
  top: 12,
  left: 12,
  padding: '5px 12px',
  borderRadius: 999,
  backgroundColor: 'rgba(234, 217, 199, 0.92)',
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
  backgroundColor: 'rgba(234, 217, 199, 0.18)',
  border: '1.5px solid rgba(234, 217, 199, 0.35)',
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

// El negocio dueño de la promoción, debajo del título de la tarjeta.
// Antes no se mostraba en ningún lado y el cliente no tenía forma de
// saber a quién le estaba viendo la oferta.
const promoNegocioStyle = {
  margin: '-8px 0 12px',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 12,
  fontWeight: 600,
  color: C.textMuted,
  minWidth: 0,
}

const promoNegocioNombreStyle = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

// Reemplaza a la flecha decorativa que había antes. Alto de 36px
// para que sea cómodo de tocar sin romper el alto de la tarjeta.
const promoVerBtnStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  height: 36,
  padding: '0 16px',
  borderRadius: 999,
  border: 'none',
  color: '#ead9c7',
  fontSize: 13,
  fontWeight: 700,
  fontFamily: 'inherit',
  cursor: 'pointer',
  flexShrink: 0,
  boxShadow: '0 3px 10px rgba(0,0,0,0.18)',
  transition: 'transform 0.18s, filter 0.18s',
}

/* "Asociado": el proveedor con el que este negocio ya trabaja.
   Turquesa, que en el sistema visual es el color del proveedor y de
   la confianza. Turquesa-700 sobre su propio tinte da 6.83:1. */
const chipAsociadoStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  flexShrink: 0,
  padding: '2px 8px',
  borderRadius: 999,
  backgroundColor: C.accentLight,
  color: C.accentDark,
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
}

// El precio en la tarjeta de un producto. Turquesa y no naranja:
// el naranja ya lo usa el botón Ver y dos cosas naranjas juntas
// compiten entre sí.
const promoPrecioStyle = {
  fontSize: 17,
  fontWeight: 900,
  color: C.accentDark,
  fontVariantNumeric: 'tabular-nums',
}

const navArrowBtnStyle = {
  width: 34,
  height: 34,
  borderRadius: '50%',
  border: '1.5px solid rgba(234, 217, 199, 0.22)',
  backgroundColor: 'rgba(234, 217, 199, 0.06)',
  color: C.onDark,
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',
}

const pasoCardStyle = {
  backgroundColor: 'rgba(234, 217, 199, 0.08)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  borderRadius: 18,
  padding: 18,
  border: '1px solid rgba(234, 217, 199, 0.16)',
}

const circleNumStyle = {
  width: 34,
  height: 34,
  borderRadius: '50%',
  color: '#ead9c7',
  display: 'grid',
  placeItems: 'center',
  fontWeight: 700,
  fontSize: 14,
  flexShrink: 0,
}

// Identidad visual de cada nivel del programa Vincco: icono del
// lazo y color de la estrella. Los umbrales (Bronce 0, Plata 200,
// Oro 500, VIP 1000) viven en data_falso.js y son los mismos que
// usa PerfilUsuario.
const NIVELES_ESTILO = {
  Bronce: { Icono: Medal, color: '#cd7f32' },
  Plata: { Icono: Award, color: '#a0aec0' },
  Oro: { Icono: Crown, color: '#fea02f' },
  VIP: { Icono: Gem, color: '#dd6600' },
}

function nivelDelUsuario(puntos) {
  return [...niveles].reverse().find((n) => puntos >= n.puntosMin) || niveles[0]
}

// Insignia compacta: solo el nombre del nivel («Plata», «Oro»…),
// con el icono y color propios de ese nivel.
function NivelInsignia({ nivel }) {
  const estilo = NIVELES_ESTILO[nivel.nivel]
  if (!estilo) return null
  const { Icono, color } = estilo
  return (
    <span
      style={{
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        boxShadow: '0 6px 16px rgba(0,0,0,0.22)',
      }}
      className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[0.08em] text-white ring-2 ring-white/40"
    >
      <Icono className="h-4 w-4" strokeWidth={2.5} />
      {nivel.nivel}
    </span>
  )
}

// El ranking para negocios y proveedores va en la misma posición del
// nivel de los clientes: el puesto que ocupan dentro de su categoría.
// Colores de marca: negocio naranja #dd6600, proveedor turquesa #007a7b.
function RankingInsignia({ posicion, total, color }) {
  return (
    <span
      style={{
        background: `linear-gradient(135deg, ${color}, ${color}99)`,
        boxShadow: '0 6px 16px rgba(0,0,0,0.22)',
      }}
      className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[0.08em] text-white ring-2 ring-white/40"
    >
      <Trophy className="h-4 w-4" strokeWidth={2.5} />
      Ranking {total > 0 ? `#${posicion}` : '—'}
    </span>
  )
}

function SeccionBienvenida({ usuario, userType, negocioNombre }) {
  const esSocio = userType === 'negocio' || userType === 'proveedor'
  const nombre = negocioNombre || usuario.nombre
  const navigate = useNavigate()

  const color = userType === 'negocio'
    ? 'naranja'
    : userType === 'proveedor'
      ? 'turquesa'
      : 'gold'

  const icono =
    userType === 'negocio'
      ? <Store className="h-6 w-6" fill="currentColor" />
      : userType === 'proveedor'
        ? <Truck className="h-6 w-6" fill="currentColor" />
        : <Star className="h-6 w-6" fill="currentColor" />

  const nivel = esSocio ? null : nivelDelUsuario(usuario.puntos ?? 0)
  const rankingColor = userType === 'negocio' ? '#dd6600' : '#007a7b'

  const posicion = rankingNegocio?.posicion ?? 0
  const totalNegocios = rankingNegocio?.total ?? 0

  return (
    <div style={{ marginBottom: 20 }}>
      <HighlightCard
        title={nombre}
        description="Bienvenido de nuevo"
        metricValue={esSocio
          ? `${posicion}${totalNegocios > 0 ? ` / ${totalNegocios}` : ''}`
          : 'Cliente'}
        metricLabel={esSocio ? 'en su categoría' : 'Tipo de cuenta'}
        buttonText="Ver perfil"
        onButtonClick={() => navigate('/perfil')}
        icon={icono}
        iconColor={nivel ? NIVELES_ESTILO[nivel.nivel]?.color : undefined}
        color={color}
        badge={esSocio
          ? <RankingInsignia posicion={posicion} total={totalNegocios} color={rankingColor} />
          : nivel
            ? <NivelInsignia nivel={nivel} />
            : undefined}
        className="w-full max-w-none min-h-[176px] sm:min-h-[200px] sm:p-8"
      />
    </div>
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

/* El pie de la tarjeta: el dato que más importa según el tipo.

   En un producto es el precio, en una promoción son los puntos o el
   descuento, y en una destacada son los me gusta (ese lo arma la
   sección, porque necesita el hook de likes). */
function PieAutomatico({ item }) {
  const precio = textoPrecio(item.precio)
  if (precio) return <span style={promoPrecioStyle}>{precio}</span>

  const puntos = textoPuntos(item.puntos)
  if (puntos) {
    return (
      <div style={promoPointsStyle}>
        <Icon name="star" filled size={12} style={{ color: C.greenText }} />
        <span>{puntos}</span>
      </div>
    )
  }

  if (item.descuento) {
    return (
      <div style={{ ...promoPointsStyle, backgroundColor: '#fdf1e4', color: C.orangeDark }}>
        <Icon name="percent" size={12} style={{ color: C.orangeDark }} />
        <span>{item.descuento}% menos</span>
      </div>
    )
  }

  return <span />
}

/* La tarjeta de todo el Home.

   Antes cada sección tenía la suya: el carrusel de promociones una,
   los productos otra, las destacadas otra y las limitadas una cuarta
   dentro de una caja blanca. Cuatro maneras de mostrar lo mismo.
   Ahora es una sola, y lo único que cambia es el color, el ícono y
   el pie. La flecha decorativa que no llevaba a ningún lado pasó a
   ser el botón "Ver", que abre la hoja de detalle.

   La tarjeta entera también responde al toque: en celular apuntarle
   a un botón de 36px es incómodo. */
function TarjetaPublicacion({ item, index, onVer, pie }) {
  const icono = item.icono || catIconMap[item.categoria] || 'store'

  return (
    <motion.div
      className="promo-card"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      style={promoCardStyle}
      onClick={() => onVer(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onVer(item)
        }
      }}
      aria-label={`Ver ${item.titulo}`}
    >
      <div style={{
        ...promoMediaStyle,
        background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}cc 100%)`,
      }}>
        <div style={promoMediaPatternStyle} />
        {item.badge && (
          <span style={{ ...promoBadgeStyle, color: item.color }}>{item.badge}</span>
        )}
        {item.imagen ? (
          <img src={item.imagen} alt={item.titulo} style={promoImgStyle} />
        ) : (
          <motion.div
            style={promoIconWrapStyle}
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
          >
            <Icon name={icono} size={36} style={{ color: '#ead9c7' }} />
          </motion.div>
        )}
      </div>
      <div style={promoBodyStyle}>
        {item.categoria && <p style={promoCatStyle}>{item.categoria}</p>}
        <h4 style={promoNombreStyle}>{item.titulo}</h4>
        {item.negocio?.nombre && (
          <p style={promoNegocioStyle}>
            <Icon name="store" size={12} style={{ color: C.textMuted }} />
            <span style={promoNegocioNombreStyle}>{item.negocio.nombre}</span>
            {item.asociado && (
              <span style={chipAsociadoStyle} title="Ya es tu proveedor">
                <Icon name="handshake" size={11} /> Asociado
              </span>
            )}
          </p>
        )}
        <div style={promoDividerStyle} />
        <div style={promoFooterStyle}>
          {pie || <PieAutomatico item={item} />}
          <button
            type="button"
            className="promo-ver-btn"
            style={{ ...promoVerBtnStyle, backgroundColor: item.color }}
            onClick={(e) => {
              e.stopPropagation()
              onVer(item)
            }}
          >
            Ver <Icon name="arrow-right" size={14} style={{ color: '#ead9c7' }} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* El carrusel que usan las cuatro secciones.

   Incluye la hoja de detalle: cada sección tiene la suya y abre la
   que le tocaron, así el estado no tiene que subir hasta el Home
   entero para algo que solo le importa a una lista. */
function CarruselHome({ eyebrow, titulo, items, pieDe, likesDe, textoVerTodas = 'Ver todas' }) {
  const scrollRef = useRef(null)
  const [abierta, setAbierta] = useState(null)

  const scrollByAmount = (dir) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.82, behavior: 'smooth' })
  }

  // Sin nada publicado la sección no se dibuja: más honesto que
  // dejar un título con un carrusel vacío debajo.
  if (items.length === 0) return null

  return (
    <section style={sectionStyle}>
      <div style={headerRowStyle}>
        <div>
          <p style={eyebrowStyle}>{eyebrow}</p>
          <h3 style={sectionTitleStyle}>{titulo}</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="promo-nav-group" style={{ display: 'flex', gap: 8 }}>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => scrollByAmount(-1)}
              style={navArrowBtnStyle}
              aria-label="Anterior"
            >
              <Icon name="arrow-left" size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => scrollByAmount(1)}
              style={navArrowBtnStyle}
              aria-label="Siguiente"
            >
              <Icon name="arrow-right" size={16} />
            </motion.button>
          </div>
          <button style={verTodasBtnStyle}>{textoVerTodas}</button>
        </div>
      </div>

      <div className="promo-scroll" ref={scrollRef} style={promoScrollStyle}>
        {items.map((item, i) => (
          <TarjetaPublicacion
            key={`${item.tipo}-${item.id}`}
            item={item}
            index={i}
            onVer={setAbierta}
            pie={pieDe ? pieDe(item) : null}
          />
        ))}
      </div>

      <HojaPromocion
        promo={abierta}
        onClose={() => setAbierta(null)}
        likes={abierta && likesDe ? likesDe(abierta) : null}
      />
    </section>
  )
}

function SeccionPromociones() {
  const { eyebrow, titulo } = useTextosSeccion('promocion')
  const items = usePublicaciones('promocion')

  return (
    <CarruselHome
      eyebrow={eyebrow}
      titulo={titulo}
      items={items}
    />
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
  const { eyebrow, titulo } = useTextosSeccion('producto')
  const items = usePublicaciones('producto')

  return (
    <CarruselHome
      eyebrow={eyebrow}
      titulo={titulo}
      items={items}
      textoVerTodas="Ver todo"
    />
  )
}

function SeccionLimitadas() {
  const { eyebrow, titulo } = useTextosSeccion('limitada')
  const items = usePublicaciones('limitada')

  return (
    <CarruselHome
      eyebrow={eyebrow}
      titulo={titulo}
      items={items}
    />
  )
}

function SeccionDestacadas() {
  const { eyebrow, titulo } = useTextosSeccion('destacada')
  const publicadas = usePublicaciones('destacada')
  const { getLikes, isLikedByMe, toggleLike } = useLikes()

  // Los me gusta viven en su propio hook (localStorage), no en la
  // publicación: por eso se pegan acá y se reordena con ellos.
  const items = publicadas
    .map((d) => ({ ...d, likes: getLikes(d.id, d.likesBase) }))
    .sort((a, b) => b.likes - a.likes)

  const pieDe = (d) => (
    <button
      type="button"
      onClick={(e) => {
        // La tarjeta entera abre la hoja; el corazón no debe abrirla.
        e.stopPropagation()
        toggleLike(d.id, d.likesBase)
      }}
      aria-pressed={isLikedByMe(d.id)}
      aria-label={isLikedByMe(d.id) ? 'Quitar me gusta' : 'Me gusta'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        border: 'none',
        background: isLikedByMe(d.id) ? '#ffe4e9' : C.subtleBg,
        color: isLikedByMe(d.id) ? '#e11d48' : C.textMuted,
        borderRadius: 999,
        padding: '7px 13px',
        fontSize: 12,
        fontWeight: 700,
        fontFamily: 'inherit',
        cursor: 'pointer',
      }}
    >
      <Icon name="heart" filled={isLikedByMe(d.id)} size={14} />
      {d.likes}
    </button>
  )

  return (
    <CarruselHome
      eyebrow={eyebrow}
      titulo={titulo}
      items={items}
      pieDe={pieDe}
      likesDe={(d) => d.likes}
    />
  )
}

export default function Home() {
  const usuario = useStore((s) => s.usuario)
  const userType = useStore((s) => s.userType)
  const negocio = useStore((s) => s.negocio)
  const perfiles = useStore((s) => s.perfiles)
  const navigate = useNavigate()

  // Volverse negocio o proveedor pasa siempre por Socio Vincco: es
  // la única pantalla que ofrece esa conversión, con sus dos
  // tarjetas. Estos anuncios del home ya no saltan directo al
  // registro de negocio/proveedor, para no competir con esa pantalla.
  const irARegistro = (tipo) => {
    if (tipo === 'negocio' || tipo === 'proveedor') {
      navigate('/socio-vincco')
      return
    }
    navigate('/register', { state: { tipo } })
  }

  // Nombre del socio: el de la sucursal activa cuando hay varias.
  // El perfil editable puede no existir para cuentas demo, asi que
  // se cae al campo "negocio" del store y por ultimo al usuario.
  const sucursal = useStore((s) =>
    s.sucursales[userType]?.find((x) => x.id === s.sucursalActiva[userType])
  )
  const negocioNombre =
    perfilDeSucursal(perfiles?.[userType], sucursal)?.nombre ||
    negocio?.nombre ||
    usuario.nombre

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
        .promo-nav-group button:hover { background-color: rgba(234, 217, 199, 0.14) !important; }
        .promo-ver-btn:hover { filter: brightness(1.08); transform: translateX(2px); }
        .promo-card:focus-visible, .promo-limitada-card:focus-visible { outline: 3px solid ${C.gold}; outline-offset: 3px; }
        .promo-limitada-card:hover { box-shadow: 0 10px 26px rgba(15,23,42,0.14) !important; transform: translateY(-3px); }
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
        <SeccionBienvenida usuario={usuario} userType={userType} negocioNombre={negocioNombre} />
        {userType !== 'negocio' && <SeccionCategorias />}
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
            <motion.button
              onClick={() => irARegistro('usuario')}
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.03 }}
              style={ctaBtnStyle}
            >
              Registrarme
            </motion.button>
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
            <motion.button
              onClick={() => irARegistro('negocio')}
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.03 }}
              style={ctaBtnStyle}
            >
              Registrarme
            </motion.button>
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
            <motion.button
              onClick={() => irARegistro('proveedor')}
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.03 }}
              style={ctaBtnStyle}
            >
              Registrarme
            </motion.button>
          </>,
        ]} />
        <SeccionLimitadas />
      </div>
    </div>
  )
}
