import useStore from '../../store/puntos_usestore'
import Icon from '../icons/Icon'
import { resenasPerfil, rankingNegocio } from '../../data/data_falso'

// Iniciales para el avatar cuando la reseña no trae foto: "María Gutiérrez"
// queda como "MG".
function iniciales(nombre) {
  const partes = (nombre || '').trim().split(/\s+/).filter(Boolean)
  if (!partes.length) return '?'
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[1][0]).toUpperCase()
}

function mensajeRanking(posicion) {
  if (posicion === 1) return '🥇 ¡Eres el negocio #1!'
  if (posicion <= 3) return '🏆 ¡Estás entre los mejores negocios!'
  if (posicion <= 10) return '⭐ Estás entre los 10 mejores.'
  return 'Sigue mejorando para subir en el ranking.'
}

export default function ResenasPanel() {
  const perfil = useStore((s) => s.perfiles.negocio)
  const negocio = useStore((s) => s.negocio)

  const nombre = perfil?.nombre || negocio?.nombre || 'Mi negocio'
  const categoria = perfil?.categoria || negocio?.categoria || ''

  const posicion = rankingNegocio?.posicion ?? 0
  const totalNegocios = rankingNegocio?.total ?? 0

  return (
    <div className="panel-seccion panel-resenas">
      <div className="panel-res-top">
        <div className="panel-res-identidad">
          <h2 className="panel-res-nombre">{nombre}</h2>
          {categoria && (
            <span className="panel-res-chip">
              <Icon name="tag" size={13} />
              {categoria}
            </span>
          )}
        </div>

        <div className="panel-res-ranking">
          <span className="panel-res-ranking-label">Tu ranking es:</span>
          <div className="panel-res-ranking-num">
            <strong>{posicion}</strong>
            {totalNegocios > 0 && <span className="panel-res-ranking-total">/ {totalNegocios}</span>}
          </div>
          <span className="panel-res-ranking-mensaje">{mensajeRanking(posicion)}</span>
        </div>
      </div>

      <div className="panel-res-divisor" />

      <div className="panel-res-seccion">
        <h3 className="panel-res-titulo">Reseñas:</h3>

        {resenasPerfil.length === 0 ? (
          <div className="panel-res-vacio">
            <span className="panel-res-vacio-icono"><Icon name="star" size={32} filled /></span>
            <strong>Aún no tienes reseñas</strong>
            <p>Las opiniones de tus clientes aparecerán aquí.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl overflow-hidden">
            {resenasPerfil.map((r, i) => (
              <article
                key={r.id}
                className={`p-4 sm:p-5 text-sm text-gray-500 ${i !== resenasPerfil.length - 1 ? 'border-b border-gray-200' : ''}`}
              >
                <div className="flex items-center gap-1 mb-3">
                  <span
                    className="h-8 w-8 mr-2 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: 'var(--panel-accent, #c05900)' }}
                    aria-hidden="true"
                  >
                    {iniciales(r.autor)}
                  </span>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <svg key={n} width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M7.049.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 0 0-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.363-1.118L.98 6.72c-.784-.57-.382-1.81.587-1.81h3.461a1 1 0 0 0 .951-.69z"
                        fill={n <= r.estrellas ? '#FF532E' : '#E5E7EB'}
                      />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600">"{r.texto}"</p>
                <div className="mt-3">
                  <p className="text-gray-800 font-medium">{r.autor}</p>
                  <p>{r.fecha}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
