import { useState } from 'react'
import Sidebar from './Sidebar'

const HOME_BACKGROUND = "/assets/images/home-fondohome.jpg"
const VINCCO_LOGO = "/assets/logos/vincco-logo.png"

export default function HeroBanner() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <style>{`
        @media (max-width: 480px) {
          .hero-banner-section {
            min-height: 420px !important;
            border-radius: 0 !important;
          }
          .hero-banner-content h1 {
            font-size: 26px !important;
          }
          .hero-banner-content p {
            font-size: 13px !important;
          }
        }
        @media (min-width: 481px) and (max-width: 767px) {
          .hero-banner-section {
            min-height: 480px !important;
            border-radius: 0 !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .hero-banner-section {
            min-height: 520px !important;
            border-radius: 36px !important;
            margin: 20px !important;
          }
          .hero-banner-content h1 {
            font-size: 32px !important;
          }
        }
        @media (min-width: 1024px) {
          .hero-banner-section {
            min-height: 640px !important;
            border-radius: 0 0 40px 40px !important;
          }
          .hero-banner-content h1 {
            font-size: 42px !important;
          }
          .hero-banner-content p {
            font-size: 16px !important;
          }
        }
      `}</style>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <section className="hero-banner-section" style={{
        position: 'relative',
        minHeight: 560,
        borderRadius: 36,
        overflow: 'hidden',
        backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.10) 0%, rgba(15,23,42,0.45) 100%), url(${HOME_BACKGROUND})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        boxShadow: '0 30px 100px rgba(15, 23, 42, 0.12)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <header style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: '20px 24px',
        }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.20)',
              borderRadius: 10,
              cursor: 'pointer',
              padding: '8px 10px',
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
            }}
            aria-label="Abrir menú"
          >
            <span style={{ display: 'block', width: 20, height: 2, backgroundColor: '#ffffff', borderRadius: 2 }} />
            <span style={{ display: 'block', width: 20, height: 2, backgroundColor: '#ffffff', borderRadius: 2 }} />
            <span style={{ display: 'block', width: 20, height: 2, backgroundColor: '#ffffff', borderRadius: 2 }} />
          </button>

          <img
            src={VINCCO_LOGO}
            alt="VINCCO"
            style={{ height: 48, width: 'auto' }}
          />
        </header>

        <div className="hero-banner-content" style={{
          position: 'relative',
          zIndex: 1,
          color: '#ffffff',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 24px 80px',
          maxWidth: 1200,
          margin: '0 auto',
          width: '100%',
        }}>
          <p style={{
            margin: 0,
            fontSize: 14,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.9)',
          }}>
            DISFRUTA DE VINCCO
          </p>
          <h1 style={{
            margin: '18px 0 16px',
            fontSize: 35,
            lineHeight: 1.05,
            fontWeight: 800,
            maxWidth: 620,
            textShadow: '0 2px 20px rgba(0,0,0,0.15)',
          }}>
            COMPRA Y GANA
          </h1>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 14,
            marginTop: 28,
          }}>
            <button style={{
              backgroundColor: '#ffffff',
              color: '#0f172a',
              border: 'none',
              borderRadius: 999,
              padding: '16px 32px',
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: 700,
              fontFamily: 'inherit',
              boxShadow: '0 18px 40px rgba(15, 23, 42, 0.16)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f4ff' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff' }}>
              Explorar negocios
            </button>
            <button style={{
              backgroundColor: 'rgba(255,255,255,0.18)',
              color: '#ffffff',
              border: '1.5px solid rgba(255,255,255,0.3)',
              borderRadius: 999,
              padding: '16px 32px',
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: 700,
              fontFamily: 'inherit',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.28)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)' }}>
              Ver recompensas
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
