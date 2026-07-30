import { negocios, proveedores } from '../data/data_falso'
import Icon from '../components/icons/Icon'

const cardStyle = {
  background: '#ffffff',
  borderRadius: 16,
  padding: '14px 16px',
  marginBottom: 10,
  boxShadow: '0 2px 10px rgba(0,42,61,0.06)',
  border: '1px solid #e4eaef',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
}

const sectionTitleStyle = {
  margin: '0 0 12px',
  fontFamily: "'Sora', 'Inter', sans-serif",
  fontSize: 15,
  fontWeight: 700,
  color: 'rgba(255,255,255,0.7)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

const ratingStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  fontSize: 13,
  fontWeight: 700,
  color: '#003f5a',
}

export default function Directorio() {
  return (
    <div style={{
      padding: '20px 20px 100px',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      background: 'linear-gradient(180deg, #002e43 0%, #003f5a 30%, #3f6f84 100%)',
      minHeight: '100vh',
    }}>
      <h2 style={{
        margin: '0 0 24px',
        fontFamily: "'Sora', 'Inter', sans-serif",
        fontSize: 22,
        fontWeight: 700,
        color: '#ffffff',
      }}>Directorio</h2>

      <h3 style={sectionTitleStyle}>Comercios</h3>
      {negocios.map(n => (
        <div key={n.id} style={cardStyle}>
          <div>
            <strong style={{ color: '#0b1b26', fontSize: 14 }}>{n.nombre}</strong>
            <div style={{ fontSize: 12, color: '#64798a', marginTop: 2 }}>{n.categoria}</div>
          </div>
          <span style={ratingStyle}><Icon name="star" filled size={14} style={{ color: '#fea02f' }} /> {n.rating}</span>
        </div>
      ))}

      <h3 style={{ ...sectionTitleStyle, marginTop: 28 }}>Proveedores</h3>
      {proveedores.map(p => (
        <div key={p.id} style={cardStyle}>
          <div>
            <strong style={{ color: '#0b1b26', fontSize: 14 }}>{p.nombre}</strong>
            <div style={{ fontSize: 12, color: '#64798a', marginTop: 2 }}>{p.categoria}</div>
          </div>
          <span style={ratingStyle}><Icon name="star" filled size={14} style={{ color: '#fea02f' }} /> {p.rating}</span>
        </div>
      ))}
    </div>
  )
}