import Icon from '../../icons/Icon'
import { ROLES_KYC } from '../../../data/kyc_options'

// Tarjetas para elegir qué tipo de cuenta se va a verificar.
// Se muestra al arrancar el wizard; el rol que viene del contexto
// (registro, perfil o acción bloqueada) llega preseleccionado.
export default function RoleSelector({ actual, onChange, onContinuar }) {
  return (
    <div className="kyc-selector">
      <div className="kyc-selector-cabecera">
        <span className="kyc-badge">
          <Icon name="shield" size={13} /> Paso 1 de 5
        </span>
        <h2>¿Qué cuenta querés verificar?</h2>
        <p>La verificación es distinta según tu rol en VINCCO. Elegí el que vas a usar.</p>
      </div>

      <div className="kyc-roles">
        {ROLES_KYC.map((rol) => {
          const activo = actual === rol.id
          return (
            <button
              key={rol.id}
              type="button"
              className={`kyc-rol kyc-rol--${rol.acento} ${activo ? 'kyc-rol--activo' : ''}`}
              onClick={() => onChange(rol.id)}
              aria-pressed={activo}
            >
              <span className="kyc-rol-icono">
                <Icon name={rol.icono} size={20} />
              </span>
              <strong>{rol.nombre}</strong>
              <span className="kyc-rol-desc">{rol.descripcion}</span>
              {activo && (
                <span className="kyc-rol-check">
                  <Icon name="check" size={13} />
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="kyc-acciones">
        <button
          type="button"
          className="kyc-btn kyc-btn--primario"
          onClick={onContinuar}
          disabled={!actual}
        >
          Continuar <Icon name="arrow-right" size={15} />
        </button>
      </div>
    </div>
  )
}