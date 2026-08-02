import { useNavigate } from 'react-router-dom'
import Icon from './icons/Icon'
import IconRed, { REDES } from './icons/IconRed'
import DotGridBackground from './DotGridBackground'

const VINCCO_LOGO = `${process.env.PUBLIC_URL}/assets/logos/vincco-logo.png`

// Hero de la pagina de Redes Sociales.
// Mismo espiritu que un "integration hero": insignia, titulo, boton
// y una sola hilera de logos desplazandose sin parar.
// Adaptado con los 6 canales reales de Vincco (no iconos genericos)
// y con las clases propias de la pagina en vez de utilidades Tailwind,
// para que quede consistente con el resto de Redes.css / Ayuda.css.

// La hilera se repite varias veces: el truco del scroll infinito es
// que el contenido total = 2 copias identicas, y la animacion mueve
// exactamente el 50% del ancho, asi el final de la copia 1 coincide
// en pixel con el inicio de la copia 2 y no se nota el salto.
const REDES_HERO = ['whatsapp', 'facebook', 'instagram', 'tiktok', 'youtube', 'threads']
const REPETICIONES = 6

function repetir(ids) {
  return Array.from({ length: REPETICIONES }).flatMap(() => ids)
}

function FilaIconos() {
  return (
    <div className="rdshero-fila rdshero-fila--izquierda">
      {repetir(REDES_HERO).map((id, i) => {
        const red = REDES[id]
        return (
          <div key={`${id}-${i}`} className="rdshero-chip" style={{ background: `${red.color}1f` }}>
            <IconRed nombre={id} size={26} style={{ color: red.color }} />
          </div>
        )
      })}
    </div>
  )
}

export default function HeroBannerRedes({ esNegocio }) {
  const navigate = useNavigate()

  // El boton lleva a la seccion util segun el rol: al negocio lo manda
  // a conectar sus redes, al usuario a ver las cuentas oficiales.
  const destinoScroll = esNegocio ? 'rds-mis-redes' : 'rds-oficiales'
  const irASeccion = () => {
    document.getElementById(destinoScroll)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="rdshero">
      <style>{`
        .rdshero {
          position: relative;
          overflow: hidden;
          padding: 64px 20px 40px;
          text-align: center;
          background: linear-gradient(160deg, #001d2a 0%, #002e43 55%, #003f5a 100%);
        }

        .rdshero-volver {
          position: absolute;
          top: 18px;
          left: 18px;
          z-index: 5;
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1.5px solid rgba(255, 255, 255, 0.22);
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          cursor: pointer;
          transition: background 0.15s;
        }

        .rdshero-volver:hover {
          background: rgba(255, 255, 255, 0.18);
        }

        .rdshero-logo {
          position: absolute;
          top: 18px;
          right: 18px;
          z-index: 5;
          height: 30px;
          width: auto;
        }

        .rdshero-contenido {
          position: relative;
          z-index: 2;
          max-width: 640px;
          margin: 0 auto;
        }

        .rdshero-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 18px;
          padding: 7px 16px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          background: rgba(255, 255, 255, 0.08);
          color: #feb862;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .rdshero-titulo {
          margin: 0 0 12px;
          font-family: 'Sora', 'Inter', sans-serif;
          font-size: 26px;
          font-weight: 800;
          line-height: 1.18;
          color: #ffffff;
        }

        .rdshero-subtitulo {
          margin: 0 auto 26px;
          max-width: 480px;
          font-size: 14px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.72);
        }

        .rdshero-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 40px;
          padding: 13px 26px;
          border: none;
          border-radius: 999px;
          background: linear-gradient(135deg, #dd6600, #c05900);
          color: #ffffff;
          font-family: inherit;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 10px 24px rgba(192, 89, 0, 0.32);
          transition: filter 0.2s, transform 0.2s;
        }

        .rdshero-cta:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }

        .rdshero-marquee {
          position: relative;
          display: flex;
          margin: 0 -20px;
          padding: 4px 0;
        }

        .rdshero-fila {
          display: flex;
          gap: 14px;
          width: max-content;
        }

        .rdshero-chip {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          box-shadow: 0 6px 16px rgba(0, 10, 18, 0.28);
        }

        .rdshero-fade {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 60px;
          z-index: 2;
          pointer-events: none;
        }

        .rdshero-fade--izq {
          left: 0;
          background: linear-gradient(to right, #002e43, transparent);
        }

        .rdshero-fade--der {
          right: 0;
          background: linear-gradient(to left, #003f5a, transparent);
        }

        @keyframes rdshero-scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .rdshero-fila--izquierda { animation: rdshero-scroll-left 30s linear infinite; }

        @media (min-width: 481px) {
          .rdshero { padding: 80px 32px 48px; }
          .rdshero-titulo { font-size: 32px; }
          .rdshero-subtitulo { font-size: 15px; }
          .rdshero-chip { width: 58px; height: 58px; }
          .rdshero-logo { height: 34px; top: 24px; right: 28px; }
          .rdshero-volver { top: 24px; left: 28px; }
        }

        @media (min-width: 1025px) {
          .rdshero { padding: 96px 40px 56px; }
          .rdshero-contenido { max-width: 720px; }
          .rdshero-titulo { font-size: 40px; }
          .rdshero-subtitulo { font-size: 16px; max-width: 560px; }
          .rdshero-chip { width: 64px; height: 64px; }
          .rdshero-marquee { margin: 0 -40px; gap: 18px; }
          .rdshero-logo { height: 38px; top: 30px; right: 40px; }
          .rdshero-volver { top: 30px; left: 40px; }
        }

        @media (max-width: 380px) {
          .rdshero { padding: 56px 16px 32px; }
          .rdshero-titulo { font-size: 22px; }
          .rdshero-chip { width: 46px; height: 46px; }
          .rdshero-logo { height: 26px; }
        }
      `}</style>

      <DotGridBackground />

      <button
        type="button"
        className="rdshero-volver"
        onClick={() => navigate(-1)}
        aria-label="Volver"
      >
        <Icon name="arrow-left" size={18} />
      </button>

      <img src={VINCCO_LOGO} alt="VINCCO" className="rdshero-logo" />

      <div className="rdshero-contenido">
        <span className="rdshero-badge">
          <Icon name="globe" size={13} />
          Redes sociales
        </span>

        <h1 className="rdshero-titulo">
          {esNegocio ? 'Todas tus redes, en un solo lugar' : 'Seguí a Vincco en todas partes'}
        </h1>

        <p className="rdshero-subtitulo">
          {esNegocio
            ? 'Conectá tus 6 canales favoritos y dejá que más clientes te encuentren dentro de Vincco.'
            : 'Enterate primero de nuevas promociones, negocios y novedades siguiendo nuestras redes oficiales.'}
        </p>

        <button type="button" className="rdshero-cta" onClick={irASeccion}>
          {esNegocio ? 'Conectar mis redes' : 'Ver redes oficiales'}
          <Icon name="arrow-right" size={15} />
        </button>

        {/* Puramente decorativo: la lista real y accesible de redes
            vive en las secciones de abajo, con sus propios enlaces */}
        <div className="rdshero-marquee" aria-hidden="true">
          <FilaIconos />
          <div className="rdshero-fade rdshero-fade--izq" />
          <div className="rdshero-fade rdshero-fade--der" />
        </div>
      </div>
    </section>
  )
}
