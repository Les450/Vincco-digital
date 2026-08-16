import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useStore from '../store/puntos_usestore'
import { motion } from 'framer-motion'
import Icon from '../components/icons/Icon'
import './Register.css'

const VINCCO_LOGO = `${process.env.PUBLIC_URL}/assets/logos/vincco-logo.png`

const INITIAL_FORM = {
  nombre: '',
  apellido: '',
  cedula: '',
  nacionalidad: '',
  sexo: '',
  municipio: '',
  departamento: '',
  email: '',
  password: '',
}

const ACCOUNT_TYPES = [
  { id: 'usuario', label: 'Cliente', icon: 'user', desc: 'Compra y acumula puntos' },
  { id: 'negocio', label: 'Negocio', icon: 'store', desc: 'Registra tu comercio' },
  { id: 'proveedor', label: 'Proveedor', icon: 'package', desc: 'Ofrece tus productos' },
]

const SEXO_OPTIONS = ['', 'Masculino', 'Femenino', 'Otro']
const NACIONALIDAD_OPTIONS = [
  '', 'Nicaragüense', 'Hondureña', 'Costarricense', 'Panameña',
  'Salvadoreña', 'Guatemalteca', 'Mexicana', 'Colombiana', 'Otra',
]

const MUNICIPIOS_POR_DEPARTAMENTO = {
  'RAAS': ['Nueva Guinea', 'Bluefields', 'El Rama', 'Muelle de los Bueyes', 'La Cruz de Río Grande', 'El Tortuguero'],
  'Rivas': ['Rivas', 'San Jorge', 'Belén', 'Potosí', 'San Juan del Sur', 'Cárdenas'],
  'Managua': ['Managua', 'Ciudad Sandino', 'Tipitapa', 'Mateare', 'San Francisco Libre'],
  'León': ['León', 'La Paz Centro', 'Nagarote', 'Telica', 'Quezalguaque'],
  'Matagalpa': ['Matagalpa', 'San Ramón', 'Matiguás', 'Esquipulas', 'Rancho Grande'],
  'Otra': ['Otro'],
}

const DEPARTAMENTO_OPTIONS = ['', ...Object.keys(MUNICIPIOS_POR_DEPARTAMENTO)]

const CATEGORIAS = [
  { id: 'alimentos', label: 'Alimentos y Bebidas' },
  { id: 'ropa', label: 'Ropa y Accesorios' },
  { id: 'electronica', label: 'Electrónica' },
  { id: 'hogar', label: 'Hogar y Muebles' },
  { id: 'salud', label: 'Salud y Belleza' },
  { id: 'deportes', label: 'Deportes' },
  { id: 'juguetes', label: 'Juguetes y Entretenimiento' },
  { id: 'libros', label: 'Libros y Papelería' },
  { id: 'servicios', label: 'Servicios Profesionales' },
  { id: 'otros', label: 'Otros' },
]

const STEP_LABELS = [
  'Tipo de cuenta', 'Datos de acceso', 'Verificación',
  'Datos personales', 'Identificación', 'Ubicación',
  'Productos frecuentes', 'Confirmación',
]

const TOTAL_STEPS = 8

const BUSINESS_STEP_LABELS = [
  'Tipo de cuenta', 'Datos de acceso', 'Verificación',
  'Datos del propietario', 'Información del negocio', 'Ubicación',
  'Categorías', 'Configuración', 'Redes y contacto', 'Finalización',
]

const BUSINESS_TOTAL_STEPS = 10

const BUSINESS_CATEGORIAS = [
  { id: 'abarrotes', label: 'Abarrotes' },
  { id: 'reposteria', label: 'Repostería' },
  { id: 'comida-rapida', label: 'Comida rápida' },
  { id: 'asados', label: 'Asados' },
  { id: 'cocteles', label: 'Cócteles' },
  { id: 'ropa', label: 'Ropa y Accesorios' },
  { id: 'calzado', label: 'Calzado' },
  { id: 'tecnologia', label: 'Tecnología' },
  { id: 'belleza', label: 'Belleza y Cuidado Personal' },
  { id: 'hogar', label: 'Hogar y Muebles' },
  { id: 'electronica', label: 'Electrónica' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'otros', label: 'Otros' },
]

const DELIVERY_OPTIONS = ['Sí', 'No']
const TIPO_NEGOCIO_OPTIONS = ['Físico', 'Delivery', 'Freelancer']

export default function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  const setUserType = useStore((s) => s.setUserType)
  const setNegocio = useStore((s) => s.setNegocio)
  const guardarPerfil = useStore((s) => s.guardarPerfil)
  const agregarSucursal = useStore((s) => s.agregarSucursal)
  const continuarSinVerificar = useStore((s) => s.continuarSinVerificar)
  const abrirKYC = useStore((s) => s.abrirKYC)
  const estadosVerificacion = useStore((s) => s.estadosVerificacion)
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState('forward')
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [accountType, setAccountType] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [verificationInput, setVerificationInput] = useState('')
  const [isVerified, setIsVerified] = useState(false)

  // Modo sucursal: el dueño ya está registrado y solo agrega una
  // sucursal nueva. Se reutiliza el flujo de negocio/proveedor pero
  // arrancando en el paso 5 (información del negocio) y, al terminar,
  // crea la sucursal y vuelve al perfil.
  const modoSucursal = Boolean(location.state?.modoSucursal)
  const PASO_INICIAL_SUCURSAL = 4

  // Llegó desde un anuncio del home con el tipo decidido (usuario,
  // negocio o proveedor): se omite el selector y se entra directo
  // al flujo correspondiente. En modo sucursal salta directo al paso
  // 5 (información del negocio), porque el dueño ya está registrado.
  useEffect(() => {
    const tipo = location.state?.tipo
    if (tipo === 'usuario' || tipo === 'negocio' || tipo === 'proveedor') {
      setAccountType(tipo)
      setDirection('forward')
      setStep(modoSucursal ? PASO_INICIAL_SUCURSAL : 1)
    }
  }, [location.state, modoSucursal, PASO_INICIAL_SUCURSAL])

  const [negocioForm, setNegocioForm] = useState({
    telefono: '',
    negocioNombre: '',
    delivery: '',
    tipoNegocio: '',
    horaApertura: '',
    horaCierre: '',
    whatsapp: '',
    facebookPage: '',
    facebookUrl: '',
    instagramUser: '',
    instagramUrl: '',
  })
  const [businessCategories, setBusinessCategories] = useState([])
  const [skipLocation, setSkipLocation] = useState(false)

  // El estado real vive en el store (y en localStorage, vía
  // estadosVerificacion): así, si el usuario recarga la página en
  // esta misma pantalla, no pierde que ya solicitó la verificación.
  const verificationSent = estadosVerificacion[accountType] === 'pendiente'

  const isNegocio = accountType === 'negocio'
  const isProveedor = accountType === 'proveedor'
  const currentTotalSteps = isNegocio || isProveedor ? BUSINESS_TOTAL_STEPS : TOTAL_STEPS
  const currentStepLabels = isNegocio || isProveedor ? BUSINESS_STEP_LABELS : STEP_LABELS

  const handleVerifyCode = () => {
    if (verificationInput.length === 6) {
      setIsVerified(true)
      setErrors((prev) => ({ ...prev, verification: '' }))
    } else {
      setErrors((prev) => ({ ...prev, verification: 'Ingresa el código de 6 dígitos' }))
    }
  }

  const handleResendCode = () => {
    setVerificationInput('')
    setIsVerified(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'departamento') {
      setFormData((prev) => ({ ...prev, departamento: value, municipio: '' }))
      if (skipLocation) setSkipLocation(false)
    } else if (name === 'municipio' && value) {
      setFormData((prev) => ({ ...prev, [name]: value }))
      if (skipLocation) setSkipLocation(false)
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleNegocioChange = (e) => {
    const { name, value } = e.target
    setNegocioForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
    if (errors.categorias) {
      setErrors((prev) => ({ ...prev, categorias: '' }))
    }
  }

  const toggleBusinessCategory = (id) => {
    setBusinessCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
    if (errors.businessCategorias) {
      setErrors((prev) => ({ ...prev, businessCategorias: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (step === 0) {
      if (!accountType) newErrors.accountType = 'Selecciona un tipo de cuenta'
      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }
    if (isNegocio || isProveedor) {
      switch (step) {
        case 1:
          if (!formData.email.trim()) newErrors.email = 'Campo obligatorio'
          if (!negocioForm.telefono.trim()) newErrors.telefono = 'Campo obligatorio'
          if (!formData.password.trim()) newErrors.password = 'Campo obligatorio'
          break
        case 2:
          if (!isVerified) newErrors.verification = 'Debes verificar el código primero'
          break
        case 3:
          if (!formData.nombre.trim()) newErrors.nombre = 'Campo obligatorio'
          if (!formData.apellido.trim()) newErrors.apellido = 'Campo obligatorio'
          break
        case 4:
          if (!negocioForm.negocioNombre.trim()) newErrors.negocioNombre = 'Campo obligatorio'
          break
        case 5:
          if (!skipLocation) {
            if (!formData.departamento) newErrors.departamento = 'Campo obligatorio'
            if (!formData.municipio) newErrors.municipio = 'Campo obligatorio'
          }
          break
        case 6:
          if (businessCategories.length === 0) newErrors.businessCategorias = 'Selecciona al menos una categoría'
          break
        case 7:
          if (!negocioForm.delivery) newErrors.delivery = 'Selecciona una opción'
          if (!negocioForm.tipoNegocio) newErrors.tipoNegocio = 'Selecciona un tipo'
          if (!negocioForm.horaApertura) newErrors.horaApertura = 'Campo obligatorio'
          if (!negocioForm.horaCierre) newErrors.horaCierre = 'Campo obligatorio'
          break
        case 8:
          break
      }
    } else {
      if (step === 1) {
        if (!formData.email.trim()) newErrors.email = 'Campo obligatorio'
        if (!formData.password.trim()) newErrors.password = 'Campo obligatorio'
      } else if (step === 2) {
        if (!isVerified) newErrors.verification = 'Debes verificar el código primero'
      } else if (step === 3) {
        if (!formData.nombre.trim()) newErrors.nombre = 'Campo obligatorio'
        if (!formData.apellido.trim()) newErrors.apellido = 'Campo obligatorio'
      } else if (step === 4) {
        if (!formData.cedula.trim()) newErrors.cedula = 'Campo obligatorio'
        if (!formData.nacionalidad) newErrors.nacionalidad = 'Campo obligatorio'
        if (!formData.sexo) newErrors.sexo = 'Campo obligatorio'
      } else if (step === 5) {
        if (!formData.departamento) newErrors.departamento = 'Campo obligatorio'
        if (!formData.municipio) newErrors.municipio = 'Campo obligatorio'
      } else if (step === 6) {
        if (selectedCategories.length === 0) newErrors.categorias = 'Selecciona al menos una categoría'
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (step === 0) {
      if (!accountType) {
        setErrors({ accountType: 'Selecciona un tipo de cuenta' })
        return
      }
      if (accountType === 'proveedor') {
        setDirection('forward')
        setStep((s) => s + 1)
        return
      }
      setDirection('forward')
      setStep((s) => s + 1)
      return
    }
    if (!validate()) return
    if (isNegocio || isProveedor) {
      if (step === BUSINESS_TOTAL_STEPS - 2) {
        setDirection('forward')
        setStep((s) => s + 1)
        return
      }
      setDirection('forward')
      setStep((s) => s + 1)
      return
    }
    if (step === 7) {
      setUserType(accountType)
      navigate('/login')
      return
    }
    setDirection('forward')
    setStep((s) => s + 1)
  }

  const prevStep = () => {
    setDirection('backward')
    if (step === 0) {
      navigate('/login')
    } else if (modoSucursal && step <= PASO_INICIAL_SUCURSAL) {
      // En modo sucursal no hay pasos atrás del 5: volver sale del flujo
      navigate('/perfil')
    } else {
      setStep((s) => s - 1)
    }
  }

  const getNavButtonLabel = () => {
    if (isNegocio || isProveedor) {
      if (step === 0) return 'Continuar'
      if (step >= 6 && step <= 8) return 'Guardar y Continuar'
      return 'Siguiente'
    }
    if (step === 0) return 'Continuar'
    if (step === 1) return 'Siguiente'
    if (step === 2) return 'Siguiente'
    if (step === 6) return 'Guardar y Continuar'
    if (step === 7) return 'Iniciar Sesión'
    return 'Continuar'
  }

  const animClass = direction === 'forward' ? 'rk-fwd' : 'rk-bwd'
  const municipiosDisponibles = formData.departamento
    ? MUNICIPIOS_POR_DEPARTAMENTO[formData.departamento] || []
    : []

  // Cualquier rol solicita la verificación con el expediente KYC
  // completo (identificación, documentos y datos tributarios):
  // el wizard se abre por encima del registro y, al enviarlo, deja
  // el rol en "pendiente" y vuelve a la app desde ahí mismo.
  const abrirVerificacionKYC = () => {
    guardarDatosRegistro()
    setUserType(accountType)
    abrirKYC(accountType, 'registro')
  }

  // Negocio y proveedor: primero se guardan los datos y se entra
  // a la cuenta, y recién ahí se abre el expediente KYC.
  const abrirFormularioVerificacion = abrirVerificacionKYC

  const handleContinueAsGuest = () => {
    guardarDatosRegistro()
    setUserType(accountType)
    continuarSinVerificar(accountType)
    navigate('/')
  }

  // Guarda el nombre del negocio que se escribió en el registro:
  // es el que se muestra en el home ("Bienvenido de nuevo") y en
  // las reseñas del panel. El perfil puede no existir en cuentas
  // demo, así que también se deja en "negocio" del store.
  const guardarDatosRegistro = () => {
    if (accountType === 'negocio' || accountType === 'proveedor') {
      const nombre = negocioForm.negocioNombre.trim()
      if (nombre) {
        setNegocio((prev) => ({ ...prev, nombre }))
        guardarPerfil(accountType, { nombre })
      }
    }
  }

  const renderStep0 = () => (
    <div className="rk-step0">
      <header className="rk-header">
        <h1 className="rk-title">Bienvenido a Vincco</h1>
        <p className="rk-sub">Regístrate y sé parte de VINCCO</p>
      </header>
      <p className="rk-step0-label">Seleccione su tipo de cuenta</p>
      <div className="rk-account-grid">
        {ACCOUNT_TYPES.map((type) => (
          <button
            key={type.id}
            className={`rk-account-card ${accountType === type.id ? 'rk-account-card--on' : ''}`}
            onClick={() => { setAccountType(type.id); if (errors.accountType) setErrors((prev) => ({ ...prev, accountType: '' })) }}
            type="button"
          >
            <span className="rk-account-icon"><Icon name={type.icon} size={24} /></span>
            <span className="rk-account-label">{type.label}</span>
            <span className="rk-account-desc">{type.desc}</span>
          </button>
        ))}
      </div>
      {errors.accountType && <span className="rk-err rk-err--center">{errors.accountType}</span>}
    </div>
  )

  const renderUsuarioStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="rk-fields">
            <header className="rk-header">
              <h1 className="rk-title">Datos de Acceso</h1>
              <p className="rk-sub">Ingresa tu correo y contraseña</p>
            </header>
            <div className="rk-field">
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Correo electrónico"
                className={`rk-input ${errors.email ? 'rk-input--err' : ''}`}
                autoComplete="email"
              />
              {errors.email && <span className="rk-err">{errors.email}</span>}
            </div>
            <div className="rk-field">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="Contraseña"
                className={`rk-input ${errors.password ? 'rk-input--err' : ''}`}
                autoComplete="new-password"
              />
              {errors.password && <span className="rk-err">{errors.password}</span>}
            </div>
            <label className="rk-checkbox">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              Mostrar contraseña
            </label>
          </div>
        )

      case 2:
        return (
          <div className="rk-fields">
            <header className="rk-header">
              <h1 className="rk-title">Verificación de Correo</h1>
              <p className="rk-sub">Revisa la bandeja de entrada de tu correo e ingresa el código de verificación.</p>
            </header>
            <div className="rk-field">
              <input
                type="text"
                inputMode="numeric"
                placeholder="Código de verificación (6 dígitos)"
                value={verificationInput}
                onChange={(e) => { setVerificationInput(e.target.value); setIsVerified(false) }}
                className={`rk-input ${errors.verification ? 'rk-input--err' : ''} ${isVerified ? 'rk-input--success' : ''}`}
                maxLength={6}
                disabled={isVerified}
              />
              {errors.verification && <span className="rk-err">{errors.verification}</span>}
              {isVerified && <span className="rk-success"><Icon name="check" size={14} /> Código verificado correctamente</span>}
            </div>
            <div className="rk-verify-actions">
              <button
                className="rk-btn rk-btn--verify"
                onClick={handleVerifyCode}
                disabled={isVerified}
                type="button"
              >
                Verificar código
              </button>
              <button
                className="rk-btn rk-btn--resend"
                onClick={handleResendCode}
                type="button"
              >
                Reenviar código
              </button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="rk-fields">
            <header className="rk-header">
              <h1 className="rk-title">Datos Personales</h1>
              <p className="rk-sub">Ingresa tu nombre y apellido</p>
            </header>
            <div className="rk-field">
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                className={`rk-input ${errors.nombre ? 'rk-input--err' : ''}`}
                autoComplete="given-name"
              />
              {errors.nombre && <span className="rk-err">{errors.nombre}</span>}
            </div>
            <div className="rk-field">
              <input
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Apellido"
                className={`rk-input ${errors.apellido ? 'rk-input--err' : ''}`}
                autoComplete="family-name"
              />
              {errors.apellido && <span className="rk-err">{errors.apellido}</span>}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="rk-fields">
            <header className="rk-header">
              <h1 className="rk-title">Identificación</h1>
              <p className="rk-sub">Ingresa tus datos de identificación</p>
            </header>
            <div className="rk-field">
              <input
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                placeholder="Número de cédula"
                className={`rk-input ${errors.cedula ? 'rk-input--err' : ''}`}
                autoComplete="off"
              />
              {errors.cedula && <span className="rk-err">{errors.cedula}</span>}
              <span className="rk-hint">Ej: 000-000000-0000K</span>
            </div>
            <div className="rk-field">
              <select
                name="nacionalidad"
                value={formData.nacionalidad}
                onChange={handleChange}
                className={`rk-input rk-select ${errors.nacionalidad ? 'rk-input--err' : ''}`}
              >
                {NACIONALIDAD_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} disabled={opt === ''}>
                    {opt || 'Selecciona nacionalidad'}
                  </option>
                ))}
              </select>
              {errors.nacionalidad && <span className="rk-err">{errors.nacionalidad}</span>}
            </div>
            <div className="rk-field">
              <select
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                className={`rk-input rk-select ${errors.sexo ? 'rk-input--err' : ''}`}
              >
                {SEXO_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} disabled={opt === ''}>
                    {opt || 'Selecciona sexo'}
                  </option>
                ))}
              </select>
              {errors.sexo && <span className="rk-err">{errors.sexo}</span>}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="rk-fields">
            <header className="rk-header">
              <h1 className="rk-title">Ubicación</h1>
              <p className="rk-sub">Selecciona tu departamento y municipio</p>
            </header>
            <div className="rk-field">
              <select
                name="departamento"
                value={formData.departamento}
                onChange={handleChange}
                className={`rk-input rk-select ${errors.departamento ? 'rk-input--err' : ''}`}
              >
                {DEPARTAMENTO_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} disabled={opt === ''}>
                    {opt || 'Selecciona departamento'}
                  </option>
                ))}
              </select>
              {errors.departamento && <span className="rk-err">{errors.departamento}</span>}
            </div>
            <div className="rk-field">
              <select
                name="municipio"
                value={formData.municipio}
                onChange={handleChange}
                className={`rk-input rk-select ${errors.municipio ? 'rk-input--err' : ''}`}
                disabled={!formData.departamento}
              >
                <option value="" disabled>
                  {formData.departamento ? 'Selecciona municipio' : 'Primero selecciona departamento'}
                </option>
                {municipiosDisponibles.map((mun) => (
                  <option key={mun} value={mun}>{mun}</option>
                ))}
              </select>
              {errors.municipio && <span className="rk-err">{errors.municipio}</span>}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="rk-fields">
            <header className="rk-header">
              <h1 className="rk-title">Productos Frecuentes</h1>
              <p className="rk-sub">¿Qué tipo de productos compras con más frecuencia?</p>
            </header>
            <div className="rk-cat-grid">
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat.id}
                  className={`rk-cat-chip ${selectedCategories.includes(cat.id) ? 'rk-cat-chip--on' : ''}`}
                  onClick={() => toggleCategory(cat.id)}
                  type="button"
                >
                  {cat.label}
                </button>
              ))}
            </div>
            {errors.categorias && <span className="rk-err rk-err--center">{errors.categorias}</span>}
          </div>
        )

      default:
        return null
    }
  }

  const renderComingSoon = () => (
    <div className="rk-coming-soon">
      <img src={VINCCO_LOGO} alt="VINCCO" className="rk-logo-img" />
      <h2 className="rk-coming-title">Próximamente</h2>
      <p className="rk-coming-msg">
        El flujo de registro para <strong>Proveedor</strong> estará disponible pronto.
      </p>
      <button
        className="rk-btn rk-btn--primary"
        onClick={() => { setStep(0); setAccountType(''); setDirection('backward') }}
        type="button"
        style={{ width: '100%', marginTop: 12 }}
      >
        Volver a seleccionar tipo de cuenta
      </button>
    </div>
  )

  const renderNegocioStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="rk-fields">
            <header className="rk-header">
              <h1 className="rk-title">Datos de Acceso</h1>
              <p className="rk-sub">{isProveedor ? 'Regístrate y encuentra negocios que necesiten tus productos' : 'Ingresa los datos de acceso de tu negocio'}</p>
            </header>
            <div className="rk-field">
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Correo electrónico"
                className={`rk-input ${errors.email ? 'rk-input--err' : ''}`}
                autoComplete="email"
              />
              {errors.email && <span className="rk-err">{errors.email}</span>}
            </div>
            <div className="rk-field">
              <input
                name="telefono"
                type="tel"
                value={negocioForm.telefono}
                onChange={handleNegocioChange}
                placeholder="Número de teléfono"
                className={`rk-input ${errors.telefono ? 'rk-input--err' : ''}`}
                autoComplete="tel"
              />
              {errors.telefono && <span className="rk-err">{errors.telefono}</span>}
            </div>
            <div className="rk-field">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="Contraseña"
                className={`rk-input ${errors.password ? 'rk-input--err' : ''}`}
                autoComplete="new-password"
              />
              {errors.password && <span className="rk-err">{errors.password}</span>}
            </div>
            <label className="rk-checkbox">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              Mostrar contraseña
            </label>
          </div>
        )

      case 2:
        return (
          <div className="rk-fields">
            <header className="rk-header">
              <h1 className="rk-title">Verificación de Correo</h1>
              <p className="rk-sub">Revisa la bandeja de entrada de tu correo e ingresa el código de verificación.</p>
            </header>
            <div className="rk-field">
              <input
                type="text"
                inputMode="numeric"
                placeholder="Código de verificación (6 dígitos)"
                value={verificationInput}
                onChange={(e) => { setVerificationInput(e.target.value); setIsVerified(false) }}
                className={`rk-input ${errors.verification ? 'rk-input--err' : ''} ${isVerified ? 'rk-input--success' : ''}`}
                maxLength={6}
                disabled={isVerified}
              />
              {errors.verification && <span className="rk-err">{errors.verification}</span>}
              {isVerified && <span className="rk-success"><Icon name="check" size={14} /> Código verificado correctamente</span>}
            </div>
            <div className="rk-verify-actions">
              <button
                className="rk-btn rk-btn--verify"
                onClick={handleVerifyCode}
                disabled={isVerified}
                type="button"
              >
                Verificar código
              </button>
              <button
                className="rk-btn rk-btn--resend"
                onClick={handleResendCode}
                type="button"
              >
                Reenviar código
              </button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="rk-fields">
            <header className="rk-header">
              <h1 className="rk-title">Datos del Propietario</h1>
              <p className="rk-sub">Ingresa tu nombre y apellido</p>
            </header>
            <div className="rk-field">
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                className={`rk-input ${errors.nombre ? 'rk-input--err' : ''}`}
                autoComplete="given-name"
              />
              {errors.nombre && <span className="rk-err">{errors.nombre}</span>}
            </div>
            <div className="rk-field">
              <input
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Apellido"
                className={`rk-input ${errors.apellido ? 'rk-input--err' : ''}`}
                autoComplete="family-name"
              />
              {errors.apellido && <span className="rk-err">{errors.apellido}</span>}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="rk-fields">
            <header className="rk-header">
              <h1 className="rk-title">{modoSucursal ? 'Información de la Sucursal' : 'Información del Negocio'}</h1>
              <p className="rk-sub">{modoSucursal ? 'Ingresa el nombre de la sucursal' : 'Ingresa el nombre de tu negocio'}</p>
            </header>
            <div className="rk-field">
              <input
                name="negocioNombre"
                value={negocioForm.negocioNombre}
                onChange={handleNegocioChange}
                placeholder={modoSucursal ? 'Nombre de la sucursal' : 'Nombre del negocio'}
                className={`rk-input ${errors.negocioNombre ? 'rk-input--err' : ''}`}
                autoComplete="off"
              />
              {errors.negocioNombre && <span className="rk-err">{errors.negocioNombre}</span>}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="rk-fields">
            <header className="rk-header">
              <h1 className="rk-title">{modoSucursal ? 'Ubicación de la Sucursal' : 'Ubicación del Negocio'}</h1>
              <p className="rk-sub">Selecciona tu departamento y municipio</p>
            </header>
            <div className="rk-field">
              <select
                name="departamento"
                value={formData.departamento}
                onChange={handleChange}
                className={`rk-input rk-select ${errors.departamento ? 'rk-input--err' : ''}`}
              >
                {DEPARTAMENTO_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} disabled={opt === ''}>
                    {opt || 'Selecciona departamento'}
                  </option>
                ))}
              </select>
              {errors.departamento && <span className="rk-err">{errors.departamento}</span>}
            </div>
            <div className="rk-field">
              <select
                name="municipio"
                value={formData.municipio}
                onChange={handleChange}
                className={`rk-input rk-select ${errors.municipio ? 'rk-input--err' : ''}`}
                disabled={!formData.departamento}
              >
                <option value="" disabled>
                  {formData.departamento ? 'Selecciona municipio' : 'Primero selecciona departamento'}
                </option>
                {municipiosDisponibles.map((mun) => (
                  <option key={mun} value={mun}>{mun}</option>
                ))}
              </select>
              {errors.municipio && <span className="rk-err">{errors.municipio}</span>}
            </div>
            <div className="rk-field">
              <p className="rk-map-label">Ubicación en el mapa (opcional)</p>
              <div className="rk-map-placeholder">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-87.0,10.5,-83.0,15.5&layer=mapnik"
                  title="Mapa de Nicaragua"
                  loading="lazy"
                />
              </div>
            </div>
            <button
              className="rk-skip-link"
              onClick={() => { setSkipLocation(true); setDirection('forward'); setStep((s) => s + 1) }}
              type="button"
            >
              Omitir este paso y configurarlo posteriormente
            </button>
          </div>
        )

      case 6:
        return (
          <div className="rk-fields">
            <header className="rk-header">
              <h1 className="rk-title">{modoSucursal ? 'Categorías de la Sucursal' : 'Categorías del Negocio'}</h1>
              <p className="rk-sub">¿Qué tipo de productos ofreces?</p>
            </header>
            <div className="rk-cat-grid">
              {BUSINESS_CATEGORIAS.map((cat) => (
                <button
                  key={cat.id}
                  className={`rk-cat-chip ${businessCategories.includes(cat.id) ? 'rk-cat-chip--on' : ''}`}
                  onClick={() => toggleBusinessCategory(cat.id)}
                  type="button"
                >
                  {cat.label}
                </button>
              ))}
            </div>
            {businessCategories.length > 0 && (
              <div className="rk-tags">
                {businessCategories.map((id) => {
                  const cat = BUSINESS_CATEGORIAS.find((c) => c.id === id)
                  return (
                    <span key={id} className="rk-tag">
                      {cat?.label}
                      <button className="rk-tag-remove" onClick={() => toggleBusinessCategory(id)} type="button"><Icon name="x" size={12} /></button>
                    </span>
                  )
                })}
              </div>
            )}
            {errors.businessCategorias && <span className="rk-err rk-err--center">{errors.businessCategorias}</span>}
          </div>
        )

      case 7:
        return (
          <div className="rk-fields">
            <header className="rk-header">
              <h1 className="rk-title">{modoSucursal ? 'Configuración de la Sucursal' : 'Configuración del Negocio'}</h1>
              <p className="rk-sub">Completa la configuración básica</p>
            </header>
            <div className="rk-field">
              <span className="rk-field-label">¿Tu negocio cuenta con delivery?</span>
              <div className="rk-option-group">
                {DELIVERY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`rk-option-btn ${negocioForm.delivery === opt ? 'rk-option-btn--on' : ''}`}
                    onClick={() => setNegocioForm((prev) => ({ ...prev, delivery: opt }))}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {errors.delivery && <span className="rk-err">{errors.delivery}</span>}
            </div>
            <div className="rk-field">
              <span className="rk-field-label">Tipo de negocio</span>
              <div className="rk-option-group">
                {TIPO_NEGOCIO_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`rk-option-btn ${negocioForm.tipoNegocio === opt ? 'rk-option-btn--on' : ''}`}
                    onClick={() => setNegocioForm((prev) => ({ ...prev, tipoNegocio: opt }))}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {errors.tipoNegocio && <span className="rk-err">{errors.tipoNegocio}</span>}
            </div>
            <div className="rk-field">
              <span className="rk-field-label">Horario de atención</span>
              <div className="rk-time-group">
                <div className="rk-time-wrapper">
                  <input
                    name="horaApertura"
                    type="time"
                    value={negocioForm.horaApertura}
                    onChange={handleNegocioChange}
                    className={`rk-input ${errors.horaApertura ? 'rk-input--err' : ''}`}
                  />
                  {errors.horaApertura && <span className="rk-err">{errors.horaApertura}</span>}
                </div>
                <span className="rk-time-sep">a</span>
                <div className="rk-time-wrapper">
                  <input
                    name="horaCierre"
                    type="time"
                    value={negocioForm.horaCierre}
                    onChange={handleNegocioChange}
                    className={`rk-input ${errors.horaCierre ? 'rk-input--err' : ''}`}
                  />
                  {errors.horaCierre && <span className="rk-err">{errors.horaCierre}</span>}
                </div>
              </div>
            </div>
          </div>
        )

      case 8:
        return (
          <div className="rk-fields">
            <header className="rk-header">
              <h1 className="rk-title">Redes y Contacto</h1>
              <p className="rk-sub">Agrega tus redes sociales (opcional)</p>
            </header>
            <div className="rk-field">
              <input
                name="whatsapp"
                type="tel"
                value={negocioForm.whatsapp}
                onChange={handleNegocioChange}
                placeholder="Número de WhatsApp"
                className="rk-input"
                autoComplete="off"
              />
            </div>
            <div className="rk-field">
              <input
                name="facebookPage"
                value={negocioForm.facebookPage}
                onChange={handleNegocioChange}
                placeholder="Nombre de la página de Facebook"
                className="rk-input"
                autoComplete="off"
              />
            </div>
            <div className="rk-field">
              <input
                name="facebookUrl"
                type="url"
                value={negocioForm.facebookUrl}
                onChange={handleNegocioChange}
                placeholder="URL de la página de Facebook"
                className="rk-input"
                autoComplete="off"
              />
            </div>
            <div className="rk-field">
              <input
                name="instagramUser"
                value={negocioForm.instagramUser}
                onChange={handleNegocioChange}
                placeholder="Nombre de usuario de Instagram"
                className="rk-input"
                autoComplete="off"
              />
            </div>
            <div className="rk-field">
              <input
                name="instagramUrl"
                type="url"
                value={negocioForm.instagramUrl}
                onChange={handleNegocioChange}
                placeholder="URL del perfil de Instagram"
                className="rk-input"
                autoComplete="off"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Cierra el flujo de sucursal: crea la sucursal con los datos del
  // registro (pasos 5 en adelante) y vuelve al perfil. La nueva
  // sucursal queda activa porque así lo hace agregarSucursal.
  const handleSaveSucursal = () => {
    if (!negocioForm.negocioNombre.trim()) return
    agregarSucursal(accountType, {
      nombre: negocioForm.negocioNombre.trim(),
      direccion: skipLocation
        ? ''
        : [formData.departamento, formData.municipio].filter(Boolean).join(', '),
      telefono: negocioForm.telefono,
      categorias: businessCategories,
      tipoNegocio: negocioForm.tipoNegocio,
      delivery: negocioForm.delivery,
      horario: negocioForm.horaApertura || negocioForm.horaCierre
        ? `${negocioForm.horaApertura || '?'} - ${negocioForm.horaCierre || '?'}`
        : '',
      whatsapp: negocioForm.whatsapp,
    })
    navigate('/perfil')
  }

  const renderBusinessWelcome = () => (
    <div className="rk-step3">
      <div className="rk-step3-bg" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/register-negocio.jpg)` }} />
      <div className="rk-step3-overlay">
        {modoSucursal && (
          <button
            type="button"
            className="rk-step3-close"
            onClick={() => navigate('/perfil')}
            aria-label="Salir del formulario"
          >
            <Icon name="x" size={20} />
          </button>
        )}
        <img src={VINCCO_LOGO} alt="VINCCO" className="rk-step3-logo" />
        <div className={`rk-step3-body ${animClass}`} key={`sw${direction}`}>
          {modoSucursal ? (
            <>
              <h1 className="rk-step3-title">Sucursal lista para guardar</h1>
              <p className="rk-step3-msg">
                Revisa que los datos de la sucursal <strong>{negocioForm.negocioNombre.trim() || 'nueva'}</strong> sean
                correctos. Al guardarla quedará activa en tu perfil.
              </p>
              <p className="rk-welcome-note">
                Cada sucursal tiene su propio panel: inventario y publicaciones independientes.
              </p>
            </>
          ) : (
            <>
              <h1 className="rk-step3-title">Felicidades, ya eres parte de VINCCO</h1>
              <p className="rk-step3-msg">
                Ya podés ver todo tu panel de socio. Para publicar y recibir cotizaciones te falta
                un paso: verificar tu negocio.
              </p>
              <p className="rk-welcome-note">
                Una vez aprobada la verificación, recibirás la confirmación en tu correo electrónico.
              </p>
            </>
          )}
        </div>
        <div className="rk-step3-actions">
          {modoSucursal ? (
            <>
              <button
                className="rk-btn rk-btn--primary rk-btn--wide"
                onClick={handleSaveSucursal}
                type="button"
              >
                Guardar nueva sucursal
              </button>
              <button
                className="rk-btn rk-btn--outline"
                onClick={prevStep}
                type="button"
                style={{ maxWidth: 320 }}
              >
                Anterior
              </button>
            </>
          ) : verificationSent ? (
            <>
              <p className="rk-success-msg"><Icon name="check-circle" size={16} /> Solicitud enviada</p>
              <button
                className="rk-btn rk-btn--primary rk-btn--wide"
                onClick={() => navigate('/')}
                type="button"
              >
                Entrar a VINCCO
              </button>
            </>
          ) : (
            <>
              <button
                className="rk-btn rk-btn--primary rk-btn--wide"
                onClick={abrirFormularioVerificacion}
                type="button"
              >
                Solicitar verificación
              </button>
              <button
                className="rk-btn rk-btn--outline rk-btn--wide rk-btn--ghost"
                onClick={handleContinueAsGuest}
                type="button"
              >
                Continuar sin verificación
              </button>
              <button
                className="rk-btn rk-btn--outline"
                onClick={prevStep}
                type="button"
                style={{ maxWidth: 320 }}
              >
                Anterior
              </button>
            </>
          )}
        </div>
        {!modoSucursal && (
          <p className="rk-footer">
            ¿Ya tienes una cuenta?{' '}
            <button className="rk-link" onClick={() => navigate('/login')}>
              Inicia sesión
            </button>
          </p>
        )}
      </div>
    </div>
  )

  const renderProveedorWelcome = () => (
    <div className="rk-step3">
      <div className="rk-step3-bg" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/register-provedores.jpg)` }} />
      <div className="rk-step3-overlay">
        {modoSucursal && (
          <button
            type="button"
            className="rk-step3-close"
            onClick={() => navigate('/perfil')}
            aria-label="Salir del formulario"
          >
            <Icon name="x" size={20} />
          </button>
        )}
        <img src={VINCCO_LOGO} alt="VINCCO" className="rk-step3-logo rk-step3-logo--lg" />
        <div className={`rk-step3-body ${animClass}`} key={`sp${direction}`}>
          {modoSucursal ? (
            <>
              <h1 className="rk-step3-title">Sucursal lista para guardar</h1>
              <p className="rk-step3-msg">
                Revisa que los datos de la sucursal <strong>{negocioForm.negocioNombre.trim() || 'nueva'}</strong> sean
                correctos. Al guardarla quedará activa en tu perfil.
              </p>
              <p className="rk-welcome-note">
                Cada sucursal tiene su propio panel: inventario y publicaciones independientes.
              </p>
            </>
          ) : (
            <>
              <h1 className="rk-step3-title">Felicidades, ya eres parte de VINCCO</h1>
              <p className="rk-step3-msg">
                Ya podés ver todo tu panel de proveedor. Para publicar productos, enviar
                cotizaciones y agregar negocios asociados te falta un paso: verificar tu empresa.
              </p>
              <p className="rk-welcome-note">
                Una vez aprobada la verificación, recibirás la confirmación en tu correo electrónico.
              </p>
            </>
          )}
        </div>
        <div className="rk-step3-actions">
          {modoSucursal ? (
            <>
              <button
                className="rk-btn rk-btn--primary rk-btn--wide"
                onClick={handleSaveSucursal}
                type="button"
              >
                Guardar nueva sucursal
              </button>
              <button
                className="rk-btn rk-btn--outline"
                onClick={prevStep}
                type="button"
                style={{ maxWidth: 320 }}
              >
                Anterior
              </button>
            </>
          ) : verificationSent ? (
            <>
              <p className="rk-success-msg"><Icon name="check-circle" size={16} /> Solicitud enviada</p>
              <button
                className="rk-btn rk-btn--primary rk-btn--wide"
                onClick={() => navigate('/')}
                type="button"
              >
                Entrar a VINCCO
              </button>
            </>
          ) : (
            <>
              <button
                className="rk-btn rk-btn--primary rk-btn--wide"
                onClick={abrirFormularioVerificacion}
                type="button"
              >
                Solicitar verificación
              </button>
              <button
                className="rk-btn rk-btn--outline rk-btn--wide rk-btn--ghost"
                onClick={handleContinueAsGuest}
                type="button"
              >
                Continuar sin verificación
              </button>
              <button
                className="rk-btn rk-btn--outline"
                onClick={prevStep}
                type="button"
                style={{ maxWidth: 320 }}
              >
                Anterior
              </button>
            </>
          )}
        </div>
        {!modoSucursal && (
          <p className="rk-footer">
            ¿Ya tienes una cuenta?{' '}
            <button className="rk-link" onClick={() => navigate('/login')}>
              Inicia sesión
            </button>
          </p>
        )}
      </div>
    </div>
  )

  const renderClientWelcome = () => (
    <div className="rk-step3">
      <div className="rk-step3-bg" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/register-bg.jpg)` }} />
      <div className="rk-step3-overlay">
        <img src={VINCCO_LOGO} alt="VINCCO" className="rk-step3-logo rk-step3-logo--lg" />
        <div className={`rk-step3-body ${animClass}`} key={`s3${direction}`}>
          <h1 className="rk-step3-title">Felicidades, ya eres parte de VINCCO</h1>
          <p className="rk-step3-msg">
            Para que tu perfil y tus reseñas aparezcan como Cliente verificado, debes solicitar
            la verificación de tu cuenta.
          </p>
          <p className="rk-welcome-note">
            Una vez aprobada la verificación, recibirás la confirmación en tu correo electrónico.
          </p>
        </div>
        <div className="rk-step3-actions">
          {verificationSent ? (
            <>
              <p className="rk-success-msg"><Icon name="check-circle" size={16} /> Solicitud enviada</p>
              <button
                className="rk-btn rk-btn--primary rk-btn--wide"
                onClick={() => navigate('/')}
                type="button"
              >
                Entrar a VINCCO
              </button>
            </>
          ) : (
            <button
              className="rk-btn rk-btn--primary rk-btn--wide"
              onClick={abrirVerificacionKYC}
              type="button"
            >
              Solicitar verificación
            </button>
          )}
          <button
            className="rk-btn rk-btn--outline rk-btn--wide rk-btn--ghost"
            onClick={handleContinueAsGuest}
            type="button"
          >
            Continuar sin verificación
          </button>
          <button
            className="rk-btn rk-btn--outline"
            onClick={prevStep}
            type="button"
            style={{ maxWidth: 320 }}
          >
            Anterior
          </button>
        </div>
        <p className="rk-footer">
          ¿Ya tienes una cuenta?{' '}
          <button className="rk-link" onClick={() => navigate('/login')}>
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  )

  return (
    <motion.div
      className="rk"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {step === 0 ? (
        <motion.div
          className="rk-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <img src={VINCCO_LOGO} alt="VINCCO" className="rk-logo-img" />
          <div className={`rk-step ${animClass}`} key={`s${direction}${step}`}>
            {renderStep0()}
          </div>
          <div className="rk-account-info">
            {accountType === 'proveedor' ? 'Completa el registro para conectar con negocios.' : 'Selecciona un tipo de cuenta para continuar.'}
          </div>
          <div className="rk-progress">
            <span className="rk-progress-text">Paso 1 de {currentTotalSteps}</span>
            <div className="rk-dots">
              {Array.from({ length: currentTotalSteps }, (_, i) => (
                <span key={i} className="rk-dot" />
              ))}
            </div>
          </div>
          <div className="rk-nav">
            <button className="rk-btn rk-btn--outline" onClick={prevStep} type="button">
              Anterior
            </button>
            <button className="rk-btn rk-btn--primary" onClick={nextStep} type="button">
              {getNavButtonLabel()}
            </button>
          </div>
          <p className="rk-footer">
            ¿Ya tienes una cuenta?{' '}
            <button className="rk-link" onClick={() => navigate('/login')}>
              Inicia sesión
            </button>
          </p>
        </motion.div>
      ) : (isNegocio || isProveedor) && step === BUSINESS_TOTAL_STEPS - 1 ? (
        isProveedor ? renderProveedorWelcome() : renderBusinessWelcome()
      ) : isNegocio || isProveedor ? (
        <motion.div
          className="rk-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          {modoSucursal && (
            <button
              type="button"
              className="rk-close"
              onClick={() => navigate('/perfil')}
              aria-label="Salir del formulario"
            >
              <Icon name="x" size={18} />
            </button>
          )}
          <img src={VINCCO_LOGO} alt="VINCCO" className="rk-logo-img" />
          <div className={`rk-step ${animClass}`} key={`s${direction}${step}`}>
            {renderNegocioStep()}
          </div>
          <div className="rk-progress">
            <span className="rk-progress-text">
              Paso {modoSucursal ? step - PASO_INICIAL_SUCURSAL + 1 : step + 1} de{' '}
              {modoSucursal ? BUSINESS_TOTAL_STEPS - PASO_INICIAL_SUCURSAL : BUSINESS_TOTAL_STEPS}
              &mdash; {BUSINESS_STEP_LABELS[step]}
            </span>
            <div className="rk-dots">
              {Array.from(
                { length: modoSucursal ? BUSINESS_TOTAL_STEPS - PASO_INICIAL_SUCURSAL : BUSINESS_TOTAL_STEPS },
                (_, i) => (
                  <span
                    key={i}
                    className={`rk-dot ${i <= (modoSucursal ? step - PASO_INICIAL_SUCURSAL : step) ? 'rk-dot--on' : ''}`}
                  />
                )
              )}
            </div>
          </div>
          <div className="rk-nav">
            <button className="rk-btn rk-btn--outline" onClick={prevStep} type="button">
              Anterior
            </button>
            <button
              className="rk-btn rk-btn--primary"
              onClick={nextStep}
              type="button"
              disabled={step === 2 && !isVerified}
              style={step === 2 && !isVerified ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              {getNavButtonLabel()}
            </button>
          </div>
          {!modoSucursal && (
            <p className="rk-footer">
              ¿Ya tienes una cuenta?{' '}
              <button className="rk-link" onClick={() => navigate('/login')}>
                Inicia sesión
              </button>
            </p>
          )}
        </motion.div>
      ) : step === 7 ? (
        renderClientWelcome()
      ) : (
        <motion.div
          className="rk-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <img src={VINCCO_LOGO} alt="VINCCO" className="rk-logo-img" />
          <div className={`rk-step ${animClass}`} key={`s${direction}${step}`}>
            {renderUsuarioStep()}
          </div>
          <div className="rk-progress">
            <span className="rk-progress-text">
              Paso {step + 1} de {TOTAL_STEPS} &mdash; {STEP_LABELS[step]}
            </span>
            <div className="rk-dots">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <span key={i} className={`rk-dot ${i <= step ? 'rk-dot--on' : ''}`} />
              ))}
            </div>
          </div>
          <div className="rk-nav">
            {step > 0 && (
              <button className="rk-btn rk-btn--outline" onClick={prevStep} type="button">
                Anterior
              </button>
            )}
            <button
              className="rk-btn rk-btn--primary"
              onClick={nextStep}
              type="button"
              disabled={step === 2 && !isVerified}
              style={step === 2 && !isVerified ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              {getNavButtonLabel()}
            </button>
          </div>
          <p className="rk-footer">
            ¿Ya tienes una cuenta?{' '}
            <button className="rk-link" onClick={() => navigate('/login')}>
              Inicia sesión
            </button>
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
