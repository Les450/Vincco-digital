import HeroBanner from '../components/HeroBanner'
import CarouselAnuncios from '../components/CarouselAnuncios'
import useStore from '../store/puntos_usestore'
import {
  categorias,
  promociones,
  recompensas,
  pasosComoFunciona,
  pasosNegocios,
  pasosProveedores,
  promocionesLimitadas,
} from '../data/data_falso'

const C = {
  primary: '#2F80ED',
  primaryLight: '#EBF2FF',
  primaryDark: '#1a5cc7',
  bg: '#f4f6f9',
  card: '#ffffff',
  textDark: '#0f172a',
  textBody: '#374151',
  textMuted: '#64748b',
  border: '#e8ecf1',
  accent: '#0d9488',
  accentLight: '#e6f7f5',
  greenBg: '#ecfdf5',
  greenText: '#166534',
  gold: '#d97706',
  goldLight: '#fef3c7',
}

const cardStyle = {
  backgroundColor: C.card,
  borderRadius: 24,
  padding: 28,
  boxShadow: '0 2px 12px rgba(15,23,42,0.05), 0 0 0 1px rgba(15,23,42,0.03)',
  marginBottom: 20,
}

const sectionStyle = { marginBottom: 20 }

const headerRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 18,
}

const eyebrowStyle = {
  margin: 0,
  fontSize: 11,
  color: C.primary,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  fontWeight: 700,
}

const sectionTitleStyle = {
  margin: '4px 0 0',
  fontSize: 20,
  fontWeight: 700,
  color: C.textDark,
}

const verTodasBtnStyle = {
  backgroundColor: 'transparent',
  color: C.primary,
  border: `1.5px solid ${C.primary}`,
  borderRadius: 999,
  padding: '7px 18px',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 700,
  fontFamily: 'inherit',
  transition: 'all 0.2s',
}

const primaryBtnStyle = {
  backgroundColor: C.primary,
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

const pasoCardStyle = {
  backgroundColor: C.bg,
  borderRadius: 18,
  padding: 18,
  border: `1px solid ${C.border}`,
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

function SeccionBusqueda() {
  return (
    <section style={{
      ...cardStyle,
      marginTop: -22,
      position: 'relative',
      zIndex: 3,
      padding: '22px 24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          backgroundColor: C.primaryLight,
          display: 'grid',
          placeItems: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.textDark }}>
          Encuentra lo que necesitas
        </p>
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar negocios, productos, categorías..."
          style={{
            flex: 1,
            minWidth: 200,
            borderRadius: 14,
            border: `1.5px solid ${C.border}`,
            padding: '13px 18px',
            fontSize: 14,
            color: C.textDark,
            outline: 'none',
            fontFamily: 'inherit',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = C.primary}
          onBlur={(e) => e.target.style.borderColor = C.border}
        />
        <button style={{
          ...primaryBtnStyle,
          borderRadius: 14,
          padding: '13px 26px',
          fontSize: 14,
          whiteSpace: 'nowrap',
          background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`,
          boxShadow: '0 4px 14px rgba(47,128,237,0.3)',
        }}>
          Buscar
        </button>
      </div>
    </section>
  )
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
        ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)'
        : `linear-gradient(135deg, ${C.card} 0%, ${C.primaryLight} 100%)`,
      border: esSocio ? '1px solid #fde68a' : `1px solid ${C.border}`,
    }}>
      <div>
        <p style={{ margin: 0, fontSize: 13, color: C.textMuted, fontWeight: 600 }}>
          Bienvenido de nuevo
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '6px 0 4px' }}>
          <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.textDark }}>
            {usuario.nombre}
          </h3>
          {esSocio && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#ffffff',
              fontSize: 10,
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: 999,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              boxShadow: '0 2px 8px rgba(217,119,6,0.3)',
            }}>
              ★ Socio
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
          ? 'linear-gradient(135deg, #d97706, #b45309)'
          : `linear-gradient(135deg, ${C.accent}, #0f766e)`,
        padding: '14px 22px',
        borderRadius: 18,
        boxShadow: esSocio
          ? '0 4px 14px rgba(217,119,6,0.25)'
          : '0 4px 14px rgba(13,148,136,0.25)',
      }}>
        <span style={{ fontSize: 24, lineHeight: 1 }}>⭐</span>
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
              boxShadow: '0 2px 10px rgba(15,23,42,0.06)',
              border: `1px solid ${C.border}`,
              display: 'grid',
              placeItems: 'center',
              fontSize: 28,
              transition: 'all 0.2s',
            }}>
              {cat.icono}
            </div>
            <span style={{ fontSize: 12, color: C.textBody, fontWeight: 600, textAlign: 'center' }}>
              {cat.nombre}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

function SeccionPromociones() {
  return (
    <section style={sectionStyle}>
      <div style={headerRowStyle}>
        <div>
          <p style={eyebrowStyle}>OFERTAS QUE TE ENCANTARÁN</p>
          <h3 style={sectionTitleStyle}>Promociones locales</h3>
        </div>
        <button style={verTodasBtnStyle}>Ver todas</button>
      </div>
      <div className="home-grid-2" style={twoColGrid}>
        {promociones.map((p) => (
          <div key={p.id} style={{
            backgroundColor: C.card,
            borderRadius: 20,
            padding: 22,
            boxShadow: '0 2px 12px rgba(15,23,42,0.05)',
            border: `1px solid ${C.border}`,
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.2s',
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(90deg, ${p.color}, ${p.color}88)`,
              borderRadius: '20px 20px 0 0',
            }} />
            <span style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: 999,
              backgroundColor: `${p.color}18`,
              color: p.color,
              fontSize: 11,
              fontWeight: 700,
              marginBottom: 14,
            }}>
              {p.badge}
            </span>
            <p style={{ margin: '0 0 4px', fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              {p.categoria}
            </p>
            <h4 style={{ margin: '0 0 12px', fontSize: 17, fontWeight: 700, color: C.textDark }}>
              {p.nombre}
            </h4>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: C.greenBg,
              padding: '4px 12px',
              borderRadius: 999,
            }}>
              <span style={{ fontSize: 12 }}>⭐</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.greenText }}>
                {p.puntos}
              </span>
            </div>
          </div>
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
              fontSize: 24,
              flexShrink: 0,
            }}>
              {r.emoji}
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

function SeccionLimitadas() {
  return (
    <section style={cardStyle}>
      <div style={{ marginBottom: 20 }}>
        <p style={eyebrowStyle}>NO TE LO PIERDAS</p>
        <h3 style={{ ...sectionTitleStyle, marginTop: 4 }}>Promociones Limitadas</h3>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: C.textMuted }}>
          Disfruta de las promociones de VINCCO
        </p>
      </div>
      <div className="home-grid-3" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 14,
      }}>
        {promocionesLimitadas.map((pl) => (
          <div key={pl.id} style={{
            background: `linear-gradient(135deg, ${C.primaryLight} 0%, #ffffff 100%)`,
            borderRadius: 18,
            padding: 22,
            minHeight: 140,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            border: `1px solid ${C.border}`,
            transition: 'all 0.2s',
          }}>
            <h4 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: C.textDark }}>
              {pl.titulo}
            </h4>
            <p style={{ margin: 0, fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>
              {pl.descripcion}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  const { usuario, userType } = useStore()

  return (
    <div style={{
      backgroundColor: C.bg,
      minHeight: '100vh',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: C.textDark,
    }}>
      <style>{`
        .home-cat-scroll::-webkit-scrollbar { height: 0; }
        .home-cat-scroll { scrollbar-width: none; }
        input::placeholder { color: ${C.textMuted}; }
        @media (max-width: 600px) {
          .home-grid-2 { grid-template-columns: 1fr !important; }
          .home-grid-3 { grid-template-columns: 1fr !important; }
          .home-two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <HeroBanner />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 40px' }}>
        <SeccionBusqueda />
        <SeccionBienvenida usuario={usuario} userType={userType} />
        <SeccionCategorias />
        <SeccionPromociones />
        <CarouselAnuncios slides={[
          <>
            <p style={{ margin: 0, fontSize: 11, color: C.primary, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>
              Así de fácil es ganar
            </p>
            <h3 style={{ margin: '8px 0 12px', fontSize: 22, fontWeight: 700, color: C.textDark }}>
              4 pasos para ser un miembro verificado
            </h3>
            <p style={{ margin: '0 0 24px', color: C.textBody, lineHeight: 1.7, maxWidth: 480 }}>
              Regístrate, compra en comercios locales, acumula puntos y canjéalos por experiencias y descuentos exclusivos.
            </p>
            <button style={{
              ...primaryBtnStyle,
              padding: '13px 30px',
              fontSize: 14,
              marginBottom: 20,
              background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`,
              boxShadow: '0 4px 14px rgba(47,128,237,0.3)',
            }}>
              Registrarme
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pasosComoFunciona.map((paso) => (
                <div key={paso.id} style={pasoCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                    <div style={{ ...circleNumStyle, background: `linear-gradient(135deg, ${C.accent}, #0f766e)` }}>
                      {paso.id}
                    </div>
                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.textDark }}>{paso.title}</h4>
                  </div>
                  <p style={{ margin: 0, color: C.textBody, fontSize: 13, lineHeight: 1.6 }}>{paso.description}</p>
                </div>
              ))}
            </div>
          </>,
          <>
            <div style={{ marginBottom: 20 }}>
              <p style={{ margin: 0, fontSize: 11, color: C.primary, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>
                Negocios
              </p>
              <h3 style={{ margin: '6px 0 8px', fontSize: 22, fontWeight: 700, color: C.textDark }}>
                Sé parte de VINCCO
              </h3>
              <p style={{ margin: 0, color: C.textBody, lineHeight: 1.7, maxWidth: 560 }}>
                Promueve tu negocio y aumenta tus ventas mediante nuestro ecosistema digital.
              </p>
            </div>
            <div style={twoColGridSm}>
              {pasosNegocios.map((paso) => (
                <div key={paso.id} style={pasoCardStyle}>
                  <div style={{ ...circleNumStyle, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, marginBottom: 10 }}>
                    {paso.id}
                  </div>
                  <h4 style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: C.textDark }}>{paso.title}</h4>
                  <p style={{ margin: 0, color: C.textBody, fontSize: 12, lineHeight: 1.6 }}>{paso.description}</p>
                </div>
              ))}
            </div>
          </>,
          <>
            <div style={{ marginBottom: 20 }}>
              <p style={{ margin: 0, fontSize: 11, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>
                Proveedores
              </p>
              <h3 style={{ margin: '6px 0 8px', fontSize: 22, fontWeight: 700, color: C.textDark }}>
                Sé parte de VINCCO
              </h3>
              <p style={{ margin: 0, color: C.textBody, lineHeight: 1.7, maxWidth: 560 }}>
                Distribuye tus productos a los negocios de VINCCO y aumenta tus ventas.
              </p>
            </div>
            <div style={twoColGridSm}>
              {pasosProveedores.map((paso) => (
                <div key={paso.id} style={pasoCardStyle}>
                  <div style={{ ...circleNumStyle, background: `linear-gradient(135deg, ${C.accent}, #0f766e)`, marginBottom: 10 }}>
                    {paso.id}
                  </div>
                  <h4 style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: C.textDark }}>{paso.title}</h4>
                  <p style={{ margin: 0, color: C.textBody, fontSize: 12, lineHeight: 1.6 }}>{paso.description}</p>
                </div>
              ))}
            </div>
          </>,
        ]} />
        <SeccionRecompensas userType={userType} />
        <SeccionLimitadas />
      </div>
    </div>
  )
}
