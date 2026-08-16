import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../../store/puntos_usestore'
import Icon from '../icons/Icon'
import RoleSelector from './kyc/RoleSelector'
import ProgressBar from './kyc/ProgressBar'
import FormStep from './kyc/FormStep'
import ValidationInput from './kyc/ValidationInput'
import FileUploader from './kyc/FileUploader'
import './kyc.css'
import {
  PASOS_KYC,
  PASOS_CAMPOS,
  TEXTOS_LEGALES,
  FORMATOS_ID,
  validarIdentidad,
  validarTelefono,
  validarCorreo,
  validarRUC,
  validarMayorEdad,
} from '../../data/kyc_options'

// Verificación de identidad (KYC / debida diligencia, Ley 977).
// Se monta desde AppRouter por encima de todo: aparece en el
// registro, en el perfil cuando el rol no está aprobado y desde
// cualquier acción bloqueada. Es un wizard de 5 pantallas: selector
// de rol, 4 pasos de expediente y la confirmación de envío.
//
// El borrador se guarda en el store (vincco:kyc) al vuelo, por lo
// que cerrar a mitad de camino no pierde nada: al volver a abrir,
// retoma en el paso donde quedó.

const MENSAJES_CAMPO = {
  email: 'Ingresá un correo válido',
  telefono: 'Usá +505 y 8 dígitos',
  fecha: 'Debés ser mayor de 18 años',
}

function validarCampo(campo, valor, nacionalidad) {
  if (campo.tipo === 'archivo') {
    if (campo.req && !valor) return 'Subí este documento'
    if (valor?.error) return valor.error
    return ''
  }
  if (campo.req && (valor === undefined || String(valor).trim() === '')) {
    return 'Campo obligatorio'
  }
  if (!valor) return ''
  if (campo.tipo === 'number' && Number.isNaN(Number(valor))) return 'Ingresá un número'
  // El documento de identidad se valida según la nacionalidad:
  // cédula nicaragüense, DUI, CUI, CURP, etc.
  if (campo.clave === 'cedula') return validarIdentidad(valor, nacionalidad)
  if (campo.tipo === 'email') return validarCorreo(valor) ? '' : MENSAJES_CAMPO.email
  if (campo.tipo === 'tel') return validarTelefono(valor) ? '' : MENSAJES_CAMPO.telefono
  if (campo.clave === 'fechaNacimiento') return validarMayorEdad(valor) ? '' : MENSAJES_CAMPO.fecha
  if (['ruc', 'rucNegocio', 'rucEmpresa'].includes(campo.clave)) {
    return validarRUC(valor) ? '' : MENSAJES_CAMPO.ruc
  }
  return ''
}

export default function VerificacionKYC() {
  const navigate = useNavigate()
  const kyc = useStore((s) => s.kyc)
  const cerrarKYC = useStore((s) => s.cerrarKYC)
  const guardarKYC = useStore((s) => s.guardarKYC)
  const guardarPasoKYC = useStore((s) => s.guardarPasoKYC)
  const cambiarRolKYC = useStore((s) => s.cambiarRolKYC)
  const enviarKYC = useStore((s) => s.enviarKYC)

  // etapa: 0 selector de rol · 1-4 pasos del expediente · 5 éxito
  const [etapa, setEtapa] = useState(0)
  const [rol, setRol] = useState(null)
  const [form, setForm] = useState({})
  const [errores, setErrores] = useState({})
  const [acepta, setAcepta] = useState(false)
  const [enviando, setEnviando] = useState(false)

  // Al abrir: retoma el borrador del rol que corresponda. Si hay
  // datos guardados, entra directo al paso donde quedó; si es un
  // rol nuevo, muestra el selector de rol.
  useEffect(() => {
    if (!kyc.abierto) return
    setForm({ ...kyc.formulario })
    setRol(kyc.rol)
    setErrores({})
    setAcepta(false)
    setEnviando(false)
    const hayBorrador = kyc.rol && Object.keys(kyc.formulario).length > 0
    setEtapa(hayBorrador && kyc.rol ? Math.min(Math.max(kyc.paso || 1, 1), 4) : 0)
    // Solo se corre al abrir o cerrar el wizard, a propósito:
    // dentro no queremos re-sincronizar el formulario local.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kyc.abierto])

  if (!kyc.abierto) return null

  const campos = PASOS_CAMPOS[rol]?.[etapa] || []
  const pasoInfo = PASOS_KYC[etapa - 1]
  const notaLegal =
    etapa === 1 ? TEXTOS_LEGALES.paso1
    : etapa === 2 ? TEXTOS_LEGALES.paso2
    : etapa === 3 ? TEXTOS_LEGALES.paso3
    : etapa === 4 ? TEXTOS_LEGALES.paso4[rol] || TEXTOS_LEGALES.paso1
    : ''

  const cambiarCampo = (clave, valor) => {
    setForm((prev) => ({ ...prev, [clave]: valor }))
    guardarKYC({ [clave]: valor })
    const campo = campos.find((c) => c.clave === clave)
    if (!campo) return
    const mensaje = validarCampo(campo, valor, form.nacionalidad)
    setErrores((prev) => {
      const nuevo = { ...prev }
      if (mensaje) nuevo[clave] = mensaje
      else delete nuevo[clave]
      return nuevo
    })
  }

  const validarPaso = () => {
    const nuevos = {}
    campos.forEach((campo) => {
      const mensaje = validarCampo(campo, form[campo.clave], form.nacionalidad)
      if (mensaje) nuevos[campo.clave] = mensaje
    })
    setErrores(nuevos)
    return Object.keys(nuevos).length === 0
  }

  const avanzar = () => {
    if (!validarPaso()) return
    guardarPasoKYC(etapa + 1)
    setEtapa(etapa + 1)
  }

  const retroceder = () => {
    setEtapa((prev) => {
      const siguiente = prev - 1
      guardarPasoKYC(Math.max(siguiente, 1))
      return siguiente
    })
  }

  const enviar = () => {
    if (!validarPaso() || !acepta) return
    setEnviando(true)
    enviarKYC()
    setTimeout(() => {
      setEnviando(false)
      setEtapa(5)
    }, 900)
  }

  const terminar = () => {
    cerrarKYC()
    // Si el KYC arrancó desde el registro, al terminar se entra a la app.
    if (kyc.desde === 'registro') navigate('/')
  }

  const volverAlSelector = () => {
    if (etapa > 0 && etapa < 5) setErrores({})
    setEtapa(0)
  }

  return (
    <div className={`kyc kyc--${rol || 'nuevo'}`} role="dialog" aria-modal="true" aria-label="Verificación de identidad (Ley 977)">
      <div className="kyc-fondo" />

      <div className="kyc-modal">
        <header className="kyc-cabecera">
          <div className="kyc-marca">
            <span className="kyc-marca-logo">
              <Icon name="shield" size={16} />
            </span>
            <div>
              <strong>VINCCO</strong>
              <span>Verificación de identidad · Ley 977</span>
            </div>
          </div>
          <div className="kyc-cabecera-der">
            {rol && etapa > 0 && etapa < 5 && (
              <button type="button" className="kyc-link" onClick={volverAlSelector}>
                <Icon name="user" size={12} /> {rol}
              </button>
            )}
            <button
              type="button"
              className="kyc-cerrar"
              onClick={cerrarKYC}
              aria-label="Guardar y salir"
            >
              <Icon name="x" size={17} />
            </button>
          </div>
        </header>

        {etapa === 0 && (
          <div className="kyc-contenido">
            <RoleSelector
              actual={rol}
              onChange={setRol}
              onContinuar={() => {
                if (!rol) return
                cambiarRolKYC(rol)
                setForm({})
                setErrores({})
                setEtapa(1)
              }}
            />
          </div>
        )}

        {etapa >= 1 && etapa <= 4 && (
          <div className="kyc-contenido">
            <ProgressBar paso={etapa} />
            <FormStep
              numero={etapa}
              titulo={pasoInfo.titulo}
              icono={pasoInfo.icono}
              notaLegal={notaLegal}
            >
              {campos.map((campo) => {
                // La cédula se adapta a la nacionalidad elegida:
                // máscara (guiones), formato de ejemplo y nota.
                const formato = FORMATOS_ID[form.nacionalidad]
                const campoVista =
                  campo.clave === 'cedula'
                    ? {
                        ...campo,
                        mask: formato?.mascara || null,
                        placeholder: formato?.ejemplo || campo.placeholder,
                        nota: formato
                          ? `Formato de ${formato.nombre} (${formato.ejemplo})`
                          : 'Seleccioná tu nacionalidad para validar el documento',
                      }
                    : campo
                return campoVista.tipo === 'archivo' ? (
                  <FileUploader
                    key={campoVista.clave}
                    campo={campoVista}
                    rol={rol}
                    valor={form[campoVista.clave]}
                    error={errores[campoVista.clave]}
                    onChange={cambiarCampo}
                  />
                ) : (
                  <ValidationInput
                    key={campoVista.clave}
                    campo={campoVista}
                    rol={rol}
                    valor={form[campoVista.clave]}
                    error={errores[campoVista.clave]}
                    onChange={cambiarCampo}
                  />
                )
              })}

              {etapa === 4 && (
                <label className={`kyc-acepta ${acepta ? 'kyc-acepta--ok' : ''}`}>
                  <input
                    type="checkbox"
                    checked={acepta}
                    onChange={(e) => setAcepta(e.target.checked)}
                  />
                  <span className="kyc-acepta-check">
                    {acepta && <Icon name="check" size={11} />}
                  </span>
                  <span>{TEXTOS_LEGALES.autorizacion}</span>
                </label>
              )}
            </FormStep>

            <div className="kyc-acciones">
              <button
                type="button"
                className="kyc-btn kyc-btn--texto"
                onClick={retroceder}
                disabled={enviando}
              >
                <Icon name="arrow-left" size={15} /> Anterior
              </button>
              {etapa < 4 ? (
                <button
                  type="button"
                  className="kyc-btn kyc-btn--primario"
                  onClick={avanzar}
                >
                  Siguiente <Icon name="arrow-right" size={15} />
                </button>
              ) : (
                <button
                  type="button"
                  className="kyc-btn kyc-btn--enviar"
                  onClick={enviar}
                  disabled={enviando || !acepta}
                >
                  {enviando ? (
                    <>
                      <span className="kyc-spinner kyc-spinner--claro" /> Enviando…
                    </>
                  ) : (
                    <>
                      Enviar verificación <Icon name="check-circle" size={15} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {etapa === 5 && (
          <div className="kyc-contenido kyc-contenido--exito">
            <span className="kyc-exito-icono">
              <Icon name="check-circle" size={34} />
            </span>
            <h2>¡Solicitud enviada!</h2>
            <p>{TEXTOS_LEGALES.exito}</p>
            <p className="kyc-exito-nota">
              Mientras tanto podés seguir usando VINCCO; las acciones que requieren
              cuenta verificada se desbloquean apenas se apruebe.
            </p>
            <div className="kyc-acciones kyc-acciones--centradas">
              <button type="button" className="kyc-btn kyc-btn--primario" onClick={terminar}>
                {kyc.desde === 'registro' ? 'Entrar a VINCCO' : 'Entendido'}
              </button>
            </div>
          </div>
        )}

        <footer className="kyc-pie">
          <Icon name="lock" size={12} /> {TEXTOS_LEGALES.art25}
        </footer>
      </div>
    </div>
  )
}