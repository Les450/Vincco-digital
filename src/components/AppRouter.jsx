import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import Landing from '../pages/Landing'
import Register from '../pages/Register'
import Home from '../pages/Home'
import Directorio from '../pages/Directorio'
import MisPuntos from '../pages/Mispuntos'
import Dashboard from '../pages/Dashboard'
import PanelSocio from '../pages/PanelSocio'
import PanelNegocio from '../pages/PanelNegocio'
import Notificaciones from '../pages/Notificaciones'
import Calendario from '../pages/Calendario'
import Favoritos from '../pages/Favoritos'
import NegociosAsociados from '../pages/NegociosAsociados'
import { DemoAiAssistatBasic } from '../components/ui/demo'

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
          <div style={{ paddingBottom: '70px' }}>
            <Favoritos />
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
          <div style={{ paddingBottom: '70px' }}>
            <Calendario />
          </div>
        } />
        <Route path="/notificaciones" element={
          <div style={{ paddingBottom: '70px' }}>
            <Notificaciones />
          </div>
        } />
        <Route path="/negocios-asociados" element={
          <div style={{ paddingBottom: '70px' }}>
            <NegociosAsociados />
          </div>
        } />
        <Route path="/_demo-travel-signin" element={<DemoAiAssistatBasic />} />
      </Routes>
      {!hideNav && <BottomNav />}
    </>
  )
}

export default function AppRouter() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  )
}
