export default function Dashboard() {
  const stats = [
    { label: 'Clientes hoy', valor: 12, icon: '👥' },
    { label: 'Puntos entregados', valor: 480, icon: '⭐' },
    { label: 'Escaneos QR', valor: 8, icon: '📲' },
  ]

  return (
    <div style={{ padding: '20px', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f4f7f4', minHeight: '100vh' }}>

      <h2 style={{ marginBottom: '20px', color: '#1a1a1a' }}>📊 Mi Negocio</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            backgroundColor: '#fff',
            borderRadius: '14px',
            padding: '18px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px' }}>{s.icon}</div>
            <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#16a34a' }}>{s.valor}</div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{
        backgroundColor: '#fff',
        borderRadius: '14px',
        padding: '18px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
      }}>
        <h4 style={{ margin: '0 0 12px', color: '#333' }}>Actividad reciente</h4>
        <p style={{ margin: '6px 0', fontSize: '14px', color: '#555' }}>📲 Cliente escaneó QR — hace 5 min</p>
        <p style={{ margin: '6px 0', fontSize: '14px', color: '#555' }}>⭐ +30 pts entregados — hace 20 min</p>
        <p style={{ margin: '6px 0', fontSize: '14px', color: '#555' }}>👤 Nuevo cliente registrado — hace 1h</p>
      </div>
    </div>
  )
}