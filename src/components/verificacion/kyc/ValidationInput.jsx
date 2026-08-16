import Icon from '../../icons/Icon'

// Aplica la máscara del campo: reinserta los guiones según los
// grupos del documento, por ejemplo [3,6,4] + letra final para la
// cédula nicaragüense y [8,1] para el DUI salvadoreño.
function aplicarMascara(valor, config) {
  if (!config) return valor
  const digitos = valor.replace(/[^0-9]/g, '')
  const letras = config.letra ? valor.replace(/[^A-Za-z]/g, '') : ''
  const maxDigitos = config.grupos.reduce((a, b) => a + b, 0)
  const digitosOk = digitos.slice(0, maxDigitos)

  const partes = []
  let pos = 0
  config.grupos.forEach((g) => {
    partes.push(digitosOk.slice(pos, pos + g))
    pos += g
  })

  let salida = partes.filter(Boolean).join('-')
  if (config.letra && digitosOk.length >= maxDigitos) {
    salida += letras.slice(0, config.letra).toUpperCase()
  }
  return salida
}

// Campo de formulario con validación en tiempo real: input, select
// o textarea según "tipo". El error aparece debajo en rojo y el
// borde del campo se pinta del acento del rol cuando es válido.
export default function ValidationInput({
  campo,
  valor,
  onChange,
  error,
  rol,
}) {
  const id = `kyc-${campo.clave}`
  const clase = `kyc-input ${error ? 'kyc-input--err' : ''} ${
    valor !== undefined && valor !== '' && !error ? 'kyc-input--ok' : ''
  } kyc-input--${rol}`

  const manejarCambio = (e) => {
    onChange(campo.clave, aplicarMascara(e.target.value, campo.mask))
  }

  return (
    <div className="kyc-campo">
      <label className="kyc-label" htmlFor={id}>
        {campo.icono && <Icon name={campo.icono} size={13} />}
        {campo.etiqueta}
        {!campo.req && <span className="kyc-opcional">opcional</span>}
      </label>

      {campo.tipo === 'select' ? (
        <select
          id={id}
          className={clase}
          value={valor || ''}
          onChange={manejarCambio}
        >
          <option value="" disabled>
            Seleccioná una opción
          </option>
          {campo.opciones.map((opcion) => (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          className={clase}
          type={campo.tipo === 'number' ? 'number' : campo.tipo === 'email' ? 'email' : campo.tipo === 'tel' ? 'tel' : campo.tipo === 'date' ? 'date' : 'text'}
          value={valor || ''}
          onChange={manejarCambio}
          placeholder={campo.placeholder}
          inputMode={campo.tipo === 'number' ? 'numeric' : undefined}
        />
      )}

      {campo.nota && <p className="kyc-nota">{campo.nota}</p>}
      {error && (
        <p className="kyc-error">
          <Icon name="alert-triangle" size={12} /> {error}
        </p>
      )}
    </div>
  )
}