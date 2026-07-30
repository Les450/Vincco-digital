import { useState, useEffect } from 'react'
import useStore from '../store/puntos_usestore'
import Icon from '../components/icons/Icon'
import { recompensas, niveles, consejosPuntos, negociosFavoritos } from '../data/data_falso'

const C = {
  navy900: '#002e43',
  navy800: '#003f5a',
  navy600: '#3f6f84',
  orange: '#dd6600',
  orangeDark: '#c05900',
  gold: '#fea02f',
  goldDark: '#de8b27',
  teal: '#007a7b',
  ink: '#0b1b26',
  textBody: '#3d5164',
  textMuted: '#64798a',
  border: '#e4eaef',
  card: '#ffffff',
  subtleBg: '#f4f8fb',
  surface: '#ffffff',
}

const cardStyle = {
  backgroundColor: C.card,
  borderRadius: 24,
  padding: 24,
  boxShadow: '0 2px 14px rgba(0,42,61,0.07), 0 0 0 1px rgba(0,63,90,0.04)',
  marginBottom: 16,
}

const eyebrowStyle = {
  margin: 0,
  fontSize: 11,
  color: C.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
  fontWeight: 800,
  fontFamily: "'Sora', 'Inter', sans-serif",
}

function nivelActual(puntos) {
  return [...niveles].reverse().find(n => puntos >= n.puntosMin) || niveles[0]
}

function siguienteNivel(puntos) {
  return niveles.find(n => puntos < n.puntosMax) || niveles[niveles.length - 1]
}

function RecompensaCard({ r, puntos }) {
  const disponible = puntos >= r.puntos
  const progreso = Math.min((puntos / r.puntos) * 100, 100)

  return (
    <div style={{
      backgroundColor: disponible ? C.card : C.subtleBg,
      borderRadius: 20,
      border: `1.5px solid ${disponible ? C.border : '#eef2f6'}`,
      overflow: 'hidden',
      transition: 'all 0.2s',
      opacity: disponible ? 1 : 0.7,
      cursor: disponible ? 'pointer' : 'default',
    }}>
      <div style={{
        padding: 20,
        position: 'relative',
      }}>
        {r.popular && (
          <span style={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: C.orange,
            color: '#fff',
            fontSize: 9,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '3px 10px',
            borderRadius: 999,
          }}>
            Popular
          </span>
        )}
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 16,
          background: disponible
            ? `linear-gradient(135deg, ${C.orange}, ${C.orangeDark})`
            : '#e8ecf0',
          display: 'grid',
          placeItems: 'center',
          marginBottom: 16,
        }}>
          <Icon name={r.emoji} size={22} style={{ color: disponible ? '#fff' : C.textMuted }} />
        </div>

        <h4 style={{
          margin: '0 0 4px',
          fontSize: 16,
          fontWeight: 700,
          color: disponible ? C.ink : C.textMuted,
        }}>
          {r.titulo}
        </h4>

        <p style={{
          margin: '0 0 14px',
          fontSize: 12,
          color: C.textBody,
          lineHeight: 1.5,
        }}>
          {r.descripcion}
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontWeight: 800,
            fontSize: 15,
            color: disponible ? C.gold : C.textMuted,
          }}>
            <Icon name="star" filled size={14} style={{ color: disponible ? C.gold : C.textMuted }} />
            {r.puntos}
          </span>

          {disponible ? (
            <button style={{
              backgroundColor: C.orange,
              color: '#fff',
              border: 'none',
              borderRadius: 999,
              padding: '7px 18px',
              fontSize: 12,
              fontWeight: 700,
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}>
              Canjear
            </button>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <div style={{
                width: 60,
                height: 6,
                borderRadius: 999,
                backgroundColor: '#e8ecf0',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${progreso}%`,
                  height: '100%',
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${C.gold}, ${C.orange})`,
                  transition: 'width 0.6s ease',
                }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.textMuted }}>
                {Math.round(progreso)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CarouselAnunciosNegocios() {
  const negociosVIP = [
    { nombre: 'Ferretería Don Chico', icono: 'tool', color: C.navy800, pts: 50, desc: 'Materiales de construcción y ferretería en general' },
    { nombre: 'Pulpería La Esquina', icono: 'coffee', color: C.orange, pts: 30, desc: 'Productos básicos, abarrotes y más' },
    { nombre: 'Agroservicios El Campo', icono: 'package', color: C.teal, pts: 40, desc: 'Insumos agropecuarios para tu negocio' },
    { nombre: 'Café del Barrio', icono: 'coffee', color: C.gold, pts: 25, desc: 'Café artesanal nicaragüense' },
    { nombre: 'Boutique Alma', icono: 'shirt', color: '#8b5cf6', pts: 35, desc: 'Moda femenina y accesorios' },
  ]

  const [actual, setActual] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActual((prev) => (prev + 1) % negociosVIP.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  const n = negociosVIP[actual]

  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.navy800}, #001d2a)`,
      borderRadius: 20,
      overflow: 'hidden',
      position: 'relative',
      minHeight: 160,
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '50%',
        height: '100%',
        background: `radial-gradient(circle at 100% 50%, ${n.color}25, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '22px 24px',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: 18,
          background: `${n.color}20`,
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          border: `2px solid ${n.color}40`,
        }}>
          <Icon name={n.icono} size={32} style={{ color: '#fff' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            backgroundColor: `${C.gold}20`,
            padding: '3px 12px',
            borderRadius: 999,
            marginBottom: 8,
          }}>
            <Icon name="star" filled size={10} style={{ color: C.gold }} />
            <span style={{ fontSize: 10, fontWeight: 800, color: C.gold, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Afiliado VIP
            </span>
          </div>
          <h4 style={{
            margin: '0 0 4px',
            fontSize: 18,
            fontWeight: 700,
            color: '#ffffff',
            fontFamily: "'Sora', 'Inter', sans-serif",
          }}>
            {n.nombre}
          </h4>
          <p style={{
            margin: '0 0 10px',
            fontSize: 13,
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.5,
          }}>
            {n.desc}
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: `${C.gold}20`,
            padding: '6px 16px',
            borderRadius: 999,
          }}>
            <Icon name="star" filled size={14} style={{ color: C.gold }} />
            <span style={{ fontSize: 14, fontWeight: 800, color: C.gold }}>
              +{n.pts} puntos por compra
            </span>
          </div>
        </div>
      </div>

      {/* Dots indicadores */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 8,
        padding: '0 0 14px',
        position: 'relative',
        zIndex: 1,
      }}>
        {negociosVIP.map((_, i) => (
          <button
            key={i}
            onClick={() => setActual(i)}
            style={{
              width: i === actual ? 24 : 8,
              height: 8,
              borderRadius: 999,
              border: 'none',
              background: i === actual ? C.orange : 'rgba(255,255,255,0.25)',
              cursor: 'pointer',
              transition: 'all 0.3s',
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default function MisPuntos() {
  const { usuario } = useStore()
  const nivel = nivelActual(usuario.puntos)
  const sigNivel = siguienteNivel(usuario.puntos)
  const progresoNivel = sigNivel
    ? ((usuario.puntos - nivel.puntosMin) / (sigNivel.puntosMax - nivel.puntosMin)) * 100
    : 100
  const puntosProximo = sigNivel ? sigNivel.puntosMax - usuario.puntos + 1 : 0

  return (
    <div style={{
      background: 'linear-gradient(180deg, #002e43 0%, #003f5a 38%, #3f6f84 100%)',
      minHeight: '100vh',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      paddingBottom: 100,
    }}>
      <style>{`
        @media (max-width: 480px) {
          .mp-grid-2 { grid-template-columns: 1fr !important; }
          .mp-grid-4 { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${C.navy800}, #002438)`,
        padding: '40px 24px 0',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 20,
          }}>
            <Icon name="star" filled size={20} style={{ color: C.gold }} />
            <h2 style={{
              margin: 0,
              fontFamily: "'Sora', 'Inter', sans-serif",
              fontSize: 22,
              fontWeight: 700,
              color: '#ffffff',
            }}>Mis Recompensas</h2>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 20px',
      }}>
        {/* Card principal */}
        <div style={{
          ...cardStyle,
          marginTop: -12,
          position: 'relative',
          zIndex: 2,
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(254,160,47,0.06) 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 20,
            position: 'relative',
            zIndex: 1,
          }}>
            <div>
              <p style={eyebrowStyle}>TU SALDO</p>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 10,
                margin: '8px 0 4px',
              }}>
                <span style={{
                  fontSize: 52,
                  fontWeight: 900,
                  color: C.ink,
                  fontFamily: "'Sora', 'Inter', sans-serif",
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}>
                  {usuario.puntos}
                </span>
                <span style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: C.textMuted,
                }}>
                  puntos
                </span>
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: `${nivel.color}15`,
                padding: '5px 16px',
                borderRadius: 999,
                marginTop: 4,
              }}>
                <Icon name={nivel.icono} size={14} style={{ color: nivel.color }} />
                <span style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: nivel.color,
                }}>
                  Nivel {nivel.nivel}
                </span>
              </div>
            </div>

            <div style={{
              backgroundColor: C.subtleBg,
              borderRadius: 18,
              padding: '16px 20px',
              minWidth: 180,
            }}>
              <p style={{
                margin: '0 0 8px',
                fontSize: 12,
                color: C.textMuted,
                fontWeight: 600,
              }}>
                {sigNivel ? `Próximo nivel: ${sigNivel.nivel}` : '¡Nivel máximo!'}
              </p>
              {sigNivel && (
                <>
                  <div style={{
                    width: '100%',
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: '#e8ecf0',
                    overflow: 'hidden',
                    marginBottom: 8,
                  }}>
                    <div style={{
                      width: `${Math.min(progresoNivel, 100)}%`,
                      height: '100%',
                      borderRadius: 999,
                      background: `linear-gradient(90deg, ${C.gold}, ${C.orange})`,
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                  <p style={{
                    margin: 0,
                    fontSize: 12,
                    fontWeight: 600,
                    color: C.textBody,
                  }}>
                    {puntosProximo} puntos para {sigNivel.nivel}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Cómo ganar puntos */}
        <div style={cardStyle}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 18,
          }}>
            <p style={eyebrowStyle}>GANÁ PUNTOS</p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
            className: 'mp-grid-4',
          }}>
            {consejosPuntos.map((c) => (
              <div key={c.id} style={{
                backgroundColor: C.subtleBg,
                borderRadius: 18,
                padding: 18,
                textAlign: 'center',
                border: `1px solid ${C.border}`,
                transition: 'all 0.2s',
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: `linear-gradient(135deg, ${C.orange}, ${C.orangeDark})`,
                  display: 'grid',
                  placeItems: 'center',
                  margin: '0 auto 12px',
                }}>
                  <Icon name={c.icono} size={20} style={{ color: '#fff' }} />
                </div>
                <h4 style={{
                  margin: '0 0 4px',
                  fontSize: 14,
                  fontWeight: 700,
                  color: C.ink,
                }}>
                  {c.titulo}
                </h4>
                <p style={{
                  margin: 0,
                  fontSize: 12,
                  color: C.textBody,
                  lineHeight: 1.5,
                }}>
                  {c.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recompensas disponibles */}
        <div style={cardStyle}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 18,
          }}>
            <div>
              <p style={eyebrowStyle}>CANJEÁ TUS PUNTOS</p>
              <h3 style={{
                margin: '4px 0 0',
                fontSize: 20,
                fontWeight: 700,
                color: C.ink,
                fontFamily: "'Sora', 'Inter', sans-serif",
              }}>
                Recompensas disponibles
              </h3>
            </div>
            <span style={{
              backgroundColor: C.subtleBg,
              color: C.textMuted,
              fontSize: 12,
              fontWeight: 600,
              padding: '5px 14px',
              borderRadius: 999,
              border: `1px solid ${C.border}`,
            }}>
              {recompensas.filter(r => usuario.puntos >= r.puntos).length} disponibles
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 14,
            className: 'mp-grid-2',
          }}>
            {recompensas.map((r) => (
              <RecompensaCard key={r.id} r={r} puntos={usuario.puntos} />
            ))}
          </div>
        </div>

        {/* Anuncios VIP — Negocios afiliados destacados */}
        <div style={cardStyle}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 18,
          }}>
            <div>
              <p style={eyebrowStyle}>DÓNDE GANAR</p>
              <h3 style={{
                margin: '4px 0 0',
                fontSize: 20,
                fontWeight: 700,
                color: C.ink,
                fontFamily: "'Sora', 'Inter', sans-serif",
              }}>
                Negocios afiliados
              </h3>
            </div>
            <span style={{
              backgroundColor: `${C.gold}15`,
              color: C.gold,
              fontSize: 10,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '4px 12px',
              borderRadius: 999,
              border: `1px solid ${C.gold}30`,
            }}>
              <Icon name="star" filled size={10} style={{ color: C.gold }} /> VIP
            </span>
          </div>

          <CarouselAnunciosNegocios />
        </div>

        {/* Historial */}
        <div style={cardStyle}>
          <p style={eyebrowStyle}>ACTIVIDAD RECIENTE</p>
          <div style={{ marginTop: 14 }}>
            {[
              { negocio: 'Ferretería Don Chico', pts: 50, fecha: 'Hoy' },
              { negocio: 'Pulpería La Esquina', pts: 30, fecha: 'Ayer' },
              { negocio: 'Agroservicios El Campo', pts: 40, fecha: 'Hace 3 días' },
              { negocio: 'Canjeaste café gratis', pts: -80, fecha: 'Hace 5 días' },
              { negocio: 'Reseña en Café del Barrio', pts: 10, fecha: 'Hace 6 días' },
            ].map((h, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 0',
                borderBottom: i < 4 ? `1px solid ${C.border}` : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: h.pts > 0 ? '#ecfdf5' : '#fef2f2',
                    display: 'grid',
                    placeItems: 'center',
                  }}>
                    <Icon
                      name={h.pts > 0 ? 'star' : 'gift'}
                      size={16}
                      style={{ color: h.pts > 0 ? '#166534' : '#dc2626' }}
                    />
                  </div>
                  <div>
                    <p style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 600,
                      color: C.ink,
                    }}>
                      {h.negocio}
                    </p>
                    <p style={{
                      margin: '2px 0 0',
                      fontSize: 12,
                      color: C.textMuted,
                    }}>
                      {h.fecha}
                    </p>
                  </div>
                </div>
                <span style={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: h.pts > 0 ? C.teal : '#dc2626',
                }}>
                  {h.pts > 0 ? '+' : ''}{h.pts} pts
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Niveles */}
        <div style={cardStyle}>
          <p style={eyebrowStyle}>PROGRESIÓN DE NIVELES</p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
            marginTop: 16,
          }}>
            {niveles.map((n) => {
              const alcanzado = usuario.puntos >= n.puntosMin
              return (
                <div key={n.nivel} style={{
                  backgroundColor: alcanzado ? `${n.color}10` : C.subtleBg,
                  borderRadius: 16,
                  padding: 16,
                  textAlign: 'center',
                  border: `1.5px solid ${alcanzado ? n.color : C.border}`,
                  opacity: alcanzado ? 1 : 0.5,
                }}>
                  <Icon
                    name={n.icono}
                    size={24}
                    style={{ color: alcanzado ? n.color : C.textMuted }}
                  />
                  <h4 style={{
                    margin: '8px 0 2px',
                    fontSize: 14,
                    fontWeight: 700,
                    color: alcanzado ? n.color : C.textMuted,
                  }}>
                    {n.nivel}
                  </h4>
                  <p style={{
                    margin: 0,
                    fontSize: 11,
                    color: C.textMuted,
                  }}>
                    {n.puntosMin}–{n.puntosMax === Infinity ? '∞' : n.puntosMax} pts
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
