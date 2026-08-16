import Icon from '../../icons/Icon'
import { PASOS_KYC } from '../../../data/kyc_options'

// Barra de avance del expediente: 4 segmentos (25/50/75/100 %).
// El segmento actual se marca con el acento del rol (cliente:
// cyan, negocio: emerald, proveedor: ámbar).
export default function ProgressBar({ paso }) {
  const porcentaje = `${paso * 25}%`
  return (
    <div className="kyc-progreso" aria-label={`Paso ${paso} de 4`}>
      <div className="kyc-progreso-pasos">
        {PASOS_KYC.map((p) => (
          <span
            key={p.numero}
            className={`kyc-progreso-paso ${
              p.numero === paso ? 'kyc-progreso-paso--activo' : ''
            } ${p.numero < paso ? 'kyc-progreso-paso--hecho' : ''}`}
          >
            <span className="kyc-progreso-icono">
              {p.numero < paso ? <Icon name="check" size={12} /> : p.numero}
            </span>
            <span className="kyc-progreso-nombre">{p.corto}</span>
          </span>
        ))}
      </div>
      <div className="kyc-progreso-track">
        <div className="kyc-progreso-relleno" style={{ width: porcentaje }} />
      </div>
      <span className="kyc-progreso-porcentaje">{porcentaje} completado</span>
    </div>
  )
}