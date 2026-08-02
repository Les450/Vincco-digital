import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/puntos_usestore'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

const VINCCO_LOGO = `${process.env.PUBLIC_URL}/assets/logos/vincco-logo.png`

// Rutas animadas + puntos que dibujan el "mapa" de la red Vincco
const ROUTES = [
  { start: { x: 100, y: 150, delay: 0 }, end: { x: 200, y: 80, delay: 2 }, color: '#c05900' },
  { start: { x: 200, y: 80, delay: 2 }, end: { x: 260, y: 120, delay: 4 }, color: '#007a7b' },
  { start: { x: 50, y: 50, delay: 1 }, end: { x: 150, y: 180, delay: 3 }, color: '#007a7b' },
  { start: { x: 280, y: 60, delay: 0.5 }, end: { x: 180, y: 180, delay: 2.5 }, color: '#c05900' },
]

function DotMap() {
  const canvasRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const generateDots = (width, height) => {
    const dots = []
    const gap = 12
    for (let x = 0; x < width; x += gap) {
      for (let y = 0; y < height; y += gap) {
        const isInMapShape =
          ((x < width * 0.25 && x > width * 0.05) && (y < height * 0.4 && y > height * 0.1)) ||
          ((x < width * 0.25 && x > width * 0.15) && (y < height * 0.8 && y > height * 0.4)) ||
          ((x < width * 0.45 && x > width * 0.3) && (y < height * 0.35 && y > height * 0.15)) ||
          ((x < width * 0.5 && x > width * 0.35) && (y < height * 0.65 && y > height * 0.35)) ||
          ((x < width * 0.7 && x > width * 0.45) && (y < height * 0.5 && y > height * 0.1)) ||
          ((x < width * 0.8 && x > width * 0.65) && (y < height * 0.8 && y > height * 0.6))

        if (isInMapShape && Math.random() > 0.3) {
          dots.push({ x, y, radius: 1, opacity: Math.random() * 0.5 + 0.2 })
        }
      }
    }
    return dots
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      setDimensions({ width, height })
      canvas.width = width
      canvas.height = height
    })

    resizeObserver.observe(canvas.parentElement)
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dots = generateDots(dimensions.width, dimensions.height)
    let animationFrameId
    let startTime = Date.now()

    function drawDots() {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)
      dots.forEach((dot) => {
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 63, 90, ${dot.opacity})`
        ctx.fill()
      })
    }

    function drawRoutes() {
      const currentTime = (Date.now() - startTime) / 1000
      ROUTES.forEach((route) => {
        const elapsed = currentTime - route.start.delay
        if (elapsed <= 0) return

        const duration = 3
        const progress = Math.min(elapsed / duration, 1)
        const x = route.start.x + (route.end.x - route.start.x) * progress
        const y = route.start.y + (route.end.y - route.start.y) * progress

        ctx.beginPath()
        ctx.moveTo(route.start.x, route.start.y)
        ctx.lineTo(x, y)
        ctx.strokeStyle = route.color
        ctx.lineWidth = 1.5
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(route.start.x, route.start.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = route.color
        ctx.fill()

        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = route.color
        ctx.fill()

        ctx.beginPath()
        ctx.arc(x, y, 6, 0, Math.PI * 2)
        ctx.fillStyle = `${route.color}40`
        ctx.fill()

        if (progress === 1) {
          ctx.beginPath()
          ctx.arc(route.end.x, route.end.y, 3, 0, Math.PI * 2)
          ctx.fillStyle = route.color
          ctx.fill()
        }
      })
    }

    function animate() {
      drawDots()
      drawRoutes()
      const currentTime = (Date.now() - startTime) / 1000
      if (currentTime > 15) startTime = Date.now()
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationFrameId)
  }, [dimensions])

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const setLoggedIn = useStore((s) => s.setLoggedIn)
  const setUserType = useStore((s) => s.setUserType)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserTypeLocal] = useState('usuario')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email && password) {
      setUserType(userType)
      setLoggedIn(true)
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#00131e] via-[#002032] to-[#00334d] p-4 relative overflow-hidden">
      <div className="absolute w-[560px] h-[560px] rounded-full bg-[rgba(0,122,123,0.08)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-[rgba(63,111,132,0.06)] top-[30%] left-[40%] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <motion.div
        className="w-full max-w-4xl overflow-hidden rounded-[28px] flex bg-white shadow-[0_30px_80px_rgba(0,18,28,0.45),0_4px_16px_rgba(0,0,0,0.08)] relative z-10"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Panel izquierdo — mapa de la red Vincco */}
        <div className="hidden md:block w-1/2 relative overflow-hidden border-r border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-br from-[#e6eff4] to-[#e3f3f3]">
            <DotMap />

            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
                className="mb-6"
              >
                <img src={VINCCO_LOGO} alt="VINCCO" className="w-16 h-16 object-contain rounded-full shadow-lg shadow-[#003f5a]/20 bg-[#003f5a] p-2.5" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl font-bold mb-2 text-center text-[#002e43]"
              >
                Vincco
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-sm text-center text-[#3d5164] max-w-xs"
              >
                Conectamos clientes, negocios y proveedores en un solo ecosistema local
              </motion.p>
            </div>
          </div>
        </div>

        {/* Panel derecho — formulario de inicio de sesión */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col items-center text-center bg-white">
          <motion.div
            className="mb-5 md:hidden"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
          >
            <img src={VINCCO_LOGO} alt="VINCCO" className="w-[52px] h-[52px] object-contain block mx-auto rounded-full bg-[#003f5a] p-2 shadow-md shadow-[#003f5a]/20" />
          </motion.div>

          <motion.p
            className="m-0 text-sm font-normal text-gray-400 tracking-wide"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
          >
            Bienvenido de nuevo
          </motion.p>

          <motion.h1
            className="m-0 mt-0.5 text-[28px] font-bold text-[#002e43] tracking-tight leading-tight"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
          >
            Inicia sesión
          </motion.h1>

          <motion.form
            className="w-full mt-7 flex flex-col gap-4"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="w-full flex flex-col items-start gap-1.5">
              <label htmlFor="login-email" className="text-xs font-medium text-gray-600 pl-0.5">
                Correo electrónico
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full h-[50px] px-4 border border-gray-200 rounded-xl text-sm text-gray-900 bg-[#f8f9fb] outline-none transition-all duration-200 placeholder:text-[#b0b7c3] focus:border-[#003f5a] focus:shadow-[0_0_0_3px_rgba(0,63,90,0.12)] focus:bg-white"
              />
            </div>

            <div className="w-full flex flex-col items-start gap-1.5">
              <label htmlFor="login-password" className="text-xs font-medium text-gray-600 pl-0.5">
                Contraseña
              </label>
              <div className="w-full relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full h-[50px] px-4 pr-11 border border-gray-200 rounded-xl text-sm text-gray-900 bg-[#f8f9fb] outline-none transition-all duration-200 placeholder:text-[#b0b7c3] focus:border-[#003f5a] focus:shadow-[0_0_0_3px_rgba(0,63,90,0.12)] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute right-0 top-0 bottom-0 w-11 flex items-center justify-center bg-none border-none text-gray-400 hover:text-gray-500 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="w-full flex flex-col gap-2">
              <span className="text-xs font-medium text-gray-600 text-left pl-0.5">
                Tipo de usuario
              </span>
              <div className="flex gap-2">
                {['cliente', 'negocio', 'proveedor'].map((tipo) => (
                  <button
                    key={tipo}
                    type="button"
                    onClick={() => setUserTypeLocal(tipo)}
                    className={`flex-1 h-[42px] rounded-xl text-xs font-medium font-inherit cursor-pointer transition-all duration-250 px-2 ${
                      userType === tipo
                        ? 'border-[#003f5a] bg-[#003f5a] text-white shadow-[0_2px_8px_rgba(0,63,90,0.2)]'
                        : 'border border-gray-200 bg-white text-gray-400 hover:border-[#003f5a] hover:text-[#003f5a] hover:bg-[#f4f8fb]'
                    }`}
                  >
                    {tipo === 'cliente' ? 'Cliente' : tipo === 'negocio' ? 'Negocio' : 'Proveedor'}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              type="submit"
              className="w-full h-[50px] mt-1 border-none rounded-xl bg-[#c05900] text-white text-[15px] font-semibold font-inherit cursor-pointer transition-all duration-250 flex items-center justify-center gap-2"
              whileHover={{ y: -1, boxShadow: '0 4px 16px rgba(192,89,0,0.3)' }}
              whileTap={{ scale: 0.98 }}
            >
              Iniciar sesión
              <ArrowRight size={16} />
            </motion.button>
          </motion.form>

          <motion.button
            className="mt-5 bg-none border-none text-sm font-medium text-[#007a7b] cursor-pointer font-inherit p-0 transition-colors duration-200 hover:text-[#005c5e]"
            onClick={() => navigate('/')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            Continuar como Invitado
          </motion.button>

          <motion.a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="mt-3.5 text-xs text-[#005c5e] no-underline font-normal transition-colors duration-200 hover:text-[#003f5a]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.45 }}
          >
            ¿Olvidaste tu contraseña?
          </motion.a>

          <motion.p
            className="mt-4.5 text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            ¿No tienes una cuenta?{' '}
            <button
              className="text-[#007a7b] underline font-medium bg-none border-none p-0 text-inherit font-inherit cursor-pointer transition-colors duration-200 hover:text-[#003f5a]"
              onClick={() => navigate('/register')}
            >
              Regístrate
            </button>
          </motion.p>

          <motion.button
            className="mt-4 bg-none border-none text-xs text-gray-300 cursor-pointer font-inherit p-0 transition-colors duration-200 hover:text-gray-400"
            onClick={() => navigate('/')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.55 }}
          >
            Ir a la página de inicio
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
