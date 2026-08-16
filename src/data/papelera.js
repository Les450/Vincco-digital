export const PAPELERA_KEY = 'pn_papelera'

export function cargarPapelera() {
  try {
    const guardado = JSON.parse(localStorage.getItem(PAPELERA_KEY) || 'null')
    if (Array.isArray(guardado)) return guardado
  } catch {}
  return []
}

export function guardarPapelera(items) {
  localStorage.setItem(PAPELERA_KEY, JSON.stringify(items))
}

// Guarda una copia de respaldo del producto eliminado para que el
// negocio o proveedor pueda recuperarlo despues, evitando que una
// eliminacion accidental (o sin consentimiento del otro) sea definitiva.
export function moverAPapelera(item, origenPanel = 'inventario') {
  const papelera = cargarPapelera()
  papelera.unshift({
    ...item,
    papeleraId: Date.now(),
    eliminadoEl: new Date().toISOString(),
    origenPanel,
  })
  guardarPapelera(papelera)
}
