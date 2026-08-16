import Icon from '../../icons/Icon'

// Tarjeta de un paso del expediente: número de paso, título con
// icono, los campos como hijos y, abajo, la nota legal que le
// corresponde (Art. 17, 22, 15 o 25 de la Ley 977).
export default function FormStep({ numero, titulo, icono, notaLegal, children }) {
  return (
    <section className="kyc-paso">
      <div className="kyc-paso-cabecera">
        <span className="kyc-paso-numero">{numero}</span>
        <div className="kyc-paso-titulo">
          <h2>
            <Icon name={icono} size={16} /> {titulo}
          </h2>
          <span>Paso {numero} de 4</span>
        </div>
      </div>

      <div className="kyc-paso-campos">{children}</div>

      {notaLegal && (
        <p className="kyc-legal">
          <Icon name="info" size={13} /> {notaLegal}
        </p>
      )}
    </section>
  )
}