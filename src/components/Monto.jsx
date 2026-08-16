import { cordobas, cordobasTexto } from '../utils/moneda'

// Envuelve los montos en translate="no": aunque el usuario fuerce la
// traduccion del navegador (boton de traducir en la barra de
// direcciones), esto evita que "cordobas" o los numeros se
// reescriban como otra moneda (ej. "dolares canadienses").

export function Monto({ valor, ...opciones }) {
  return <span translate="no">{cordobas(valor, opciones)}</span>
}

export function MontoTexto({ valor, ...opciones }) {
  return <span translate="no">{cordobasTexto(valor, opciones)}</span>
}
