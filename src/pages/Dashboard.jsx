import Icon from '../components/icons/Icon'

export default function Dashboard() {
  const stats = [
    { label: 'Clientes hoy', valor: 12, icon: 'users' },
    { label: 'Puntos entregados', valor: 480, icon: 'star' },
    { label: 'Escaneos QR', valor: 8, icon: 'smartphone' },
  ]

  return (
    <div style={{
      padding: '20px 20px 100px',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      background: 'linear-gradient(180deg, #002e43 0%, #003f5a 30%, #3f6f84 100%)',
      minHeight: '100vh',
    }}>

      <h2 style={{
        margin: '0 0 20px',
        fontFamily: "'Sora', 'Inter', sans-serif",
        fontSize: 22,
        fontWeight: 700,
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}><Icon name="bar-chart-2" size={22} /> Mi Negocio</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            backgroundColor: '#fff',
            borderRadius: '18px',
            padding: '18px 12px',
            boxShadow: '0 10px 26px rgba(0,24,36,0.22)',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}><Icon name={s.icon} size={26} filled style={{ color: '#c05900' }} /></div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#003f5a', fontFamily: "'Sora', 'Inter', sans-serif" }}>{s.valor}</div>
            <div style={{ fontSize: '11px', color: '#64798a', marginTop: '4px', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{
        backgroundColor: '#fff',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 10px 26px rgba(0,24,36,0.22)',
      }}>
        <h4 style={{ margin: '0 0 12px', color: '#0b1b26', fontSize: 15, fontWeight: 700 }}>Actividad reciente</h4>
        <p style={{ margin: '8px 0', fontSize: '14px', color: '#3d5164', display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="smartphone" size={16} style={{ color: '#007a7b' }} /> Cliente escaneó QR — hace 5 min</p>
        <p style={{ margin: '8px 0', fontSize: '14px', color: '#3d5164', display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="star" size={16} filled style={{ color: '#c05900' }} /> +30 pts entregados — hace 20 min</p>
        <p style={{ margin: '8px 0', fontSize: '14px', color: '#3d5164', display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="user" size={16} style={{ color: '#003f5a' }} /> Nuevo cliente registrado — hace 1h</p>
      </div>
    </div>
  )
}