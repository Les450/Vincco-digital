import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/puntos_usestore'
import './Landing.css'

const VINCCO_LOGO = "/assets/logos/vincco-logo.png"

export default function Landing() {
  const navigate = useNavigate()
  const { setLoggedIn, setUserType } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserTypeLocal] = useState('cliente')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email && password) {
      setUserType(userType)
      setLoggedIn(true)
      navigate('/')
    }
  }

  return (
    <div className="landing">
      <div className="landing-card">
        <div className="landing-logo">
          <img
            src={VINCCO_LOGO}
            alt="VINCCO"
            style={{ width: 72, height: 72, objectFit: 'contain' }}
          />
        </div>

        <p className="landing-greeting">Bienvenido a</p>
        <h1 className="landing-brand">Vincco</h1>
        <p className="landing-desc">
          Regístrate en Vincco para no perderte los beneficios.
        </p>

        <form className="landing-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="usuario@gmail.com"
            className="landing-input"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="landing-input-wrapper">
            <input
              type="password"
              placeholder="Contraseña"
              className="landing-input"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="landing-user-type">
            <span className="landing-user-type-label">Tipo de usuario</span>
            <div className="landing-user-type-options">
              {['cliente', 'negocio', 'proveedor'].map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  className={`landing-user-type-btn ${userType === tipo ? 'active' : ''}`}
                  onClick={() => setUserTypeLocal(tipo)}
                >
                  {tipo === 'cliente' ? 'Cliente' : tipo === 'negocio' ? 'Negocio' : 'Proveedor'}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="landing-btn">
            Iniciar sesión
          </button>
        </form>

        <button
          className="landing-guest"
          onClick={() => navigate('/')}
        >
          Continuar como Invitado
        </button>

        <a href="#" className="landing-forgot">
          ¿Olvidaste tu contraseña?
        </a>

        <p className="landing-register">
          ¿No tienes una cuenta?{' '}
          <button className="landing-register-link" onClick={() => navigate('/register')}>Regístrate</button>
        </p>

        <button
          className="landing-home"
          onClick={() => navigate('/')}
        >
          Ir a la página de inicio
        </button>
      </div>
    </div>
  )
}
