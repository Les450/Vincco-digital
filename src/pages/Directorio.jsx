import { negocios, proveedores } from '../data/data_falso'

export default function Directorio() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Directorio</h2>

      <h3>Comercios</h3>
      {negocios.map(n => (
        <div key={n.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, marginBottom: 10 }}>
          <strong>{n.nombre}</strong> — {n.categoria} — ⭐ {n.rating}
        </div>
      ))}

      <h3 style={{ marginTop: '24px' }}>Proveedores</h3>
      {proveedores.map(p => (
        <div key={p.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, marginBottom: 10 }}>
          <strong>{p.nombre}</strong> — {p.categoria} — ⭐ {p.rating}
        </div>
      ))}
    </div>
  )
}