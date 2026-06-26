import useStore from '../store/puntos_usestore'

const historial = [
  { negocio: 'Ferretería Don Chico', pts: 50 },
  { negocio: 'Pulpería La Esquina', pts: 30 },
  { negocio: 'Agroservicios El Campo', pts: 40 },
]

export default function MisPuntos() {
  const { usuario } = useStore()

  return (
    <div style={{ padding: '20px', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f4f7f4', minHeight: '100vh' }}>

      <h2 style={{ marginBottom: '16px', color: '#1a1a1a' }}>⭐ Mis Puntos</h2>

      {/* Tarjeta principal */}
      <div style={{
        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
        borderRadius: '16px',
        padding: '24px',
        color: '#fff',
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        <p style={{ margin: '0 0 8px', fontSize: '14px', opacity: 0.85 }}>Total acumulado</p>
        <p style={{ margin: '0 0 12px', fontSize: '48px', fontWeight: 'bold' }}>{usuario.puntos}</p>
        <span style={{
          backgroundColor: 'rgba(255,255,255,0.25)',
          borderRadius: '20px',
          padding: '6px 18px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>🥉 Nivel {usuario.nivel}</span>
      </div>

      {/* Historial */}
      <h3 style={{ margin: '0 0 12px', color: '#1a1a1a' }}>Historial de puntos</h3>
      {historial.map((h, i) => (
        <div key={i} style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '14px 16px',
          marginBottom: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
        }}>
          <span style={{ fontSize: '14px', color: '#333' }}>{h.negocio}</span>
          <span style={{
            color: '#16a34a',
            fontWeight: 'bold',
            fontSize: '15px'
          }}>+{h.pts} pts</span>
        </div>
      ))}
    </div>
  )
}