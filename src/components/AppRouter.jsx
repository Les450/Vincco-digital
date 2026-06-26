import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import Landing from '../pages/Landing'
import Register from '../pages/Register'
import Home from '../pages/Home'
import Directorio from '../pages/Directorio'
import MisPuntos from '../pages/Mispuntos'
import Dashboard from '../pages/Dashboard'
import PanelSocio from '../pages/PanelSocio'
import PanelNegocio from '../pages/PanelNegocio'

function AppContent() {
  const location = useLocation()
  const hideNav = location.pathname === '/login' || location.pathname === '/register'

  return (
    <>
      <Routes>
        <Route path="/" element={
          <div style={{ paddingBottom: '70px' }}>
            <Home />
          </div>
        } />
        <Route path="/login" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/inicio" element={
          <div style={{ paddingBottom: '70px' }}>
            <Home />
          </div>
        } />
        <Route path="/home" element={
          <div style={{ paddingBottom: '70px' }}>
            <Home />
          </div>
        } />
        <Route path="/directorio" element={
          <div style={{ paddingBottom: '70px' }}>
            <Directorio />
          </div>
        } />
        <Route path="/puntos" element={
          <div style={{ paddingBottom: '70px' }}>
            <MisPuntos />
          </div>
        } />
        <Route path="/dashboard" element={
          <div style={{ paddingBottom: '70px' }}>
            <Dashboard />
          </div>
        } />
        <Route path="/favoritos" element={
          <div style={{ paddingBottom: '70px', padding: '40px 20px', textAlign: 'center', color: '#64748b', fontFamily: 'Segoe UI, sans-serif' }}>
            <h2 style={{ color: '#0f172a' }}>Favoritos</h2>
            <p>Próximamente</p>
          </div>
        } />
        <Route path="/recompensas" element={
          <div style={{ paddingBottom: '70px' }}>
            <PanelSocio />
          </div>
        } />
        <Route path="/publicaciones" element={
          <div style={{ paddingBottom: '70px' }}>
            <PanelSocio />
          </div>
        } />
        <Route path="/panel-negocio" element={
          <div style={{ paddingBottom: '70px' }}>
            <PanelNegocio />
          </div>
        } />
        <Route path="/calendario" element={
          <div style={{ paddingBottom: '70px', padding: '40px 20px', textAlign: 'center', color: '#64748b', fontFamily: 'Segoe UI, sans-serif' }}>
            <h2 style={{ color: '#0f172a' }}>Calendario</h2>
            <p>Próximamente</p>
          </div>
        } />
        <Route path="/notificaciones" element={
          <div style={{ paddingBottom: '70px', padding: '40px 20px', textAlign: 'center', color: '#64748b', fontFamily: 'Segoe UI, sans-serif' }}>
            <h2 style={{ color: '#0f172a' }}>Notificaciones</h2>
            <p>Próximamente</p>
          </div>
        } />
      </Routes>
      {!hideNav && <BottomNav />}
    </>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
