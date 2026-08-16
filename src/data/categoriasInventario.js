import { useEffect, useState } from 'react'

export const CATEGORIAS_KEY = 'pn_categorias_inventario'

export const CATEGORIAS_INVENTARIO_INICIALES = [
  'Herramientas', 'Materiales', 'Alimentos', 'Limpieza', 'Electrónicos', 'Ropa', 'Otros',
]

export function cargarCategorias() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CATEGORIAS_KEY) || 'null')
    if (Array.isArray(guardado) && guardado.length > 0) return guardado
  } catch {}
  return [...CATEGORIAS_INVENTARIO_INICIALES]
}

export function guardarCategorias(categorias) {
  localStorage.setItem(CATEGORIAS_KEY, JSON.stringify(categorias))
}

export function useCategoriasInventario() {
  const [categorias, setCategorias] = useState(cargarCategorias)

  useEffect(() => {
    guardarCategorias(categorias)
  }, [categorias])

  const agregarCategoria = (nombre) => {
    const limpio = (nombre || '').trim()
    if (!limpio) return false
    if (categorias.some((c) => c.toLowerCase() === limpio.toLowerCase())) return false
    setCategorias((prev) => [...prev, limpio])
    return true
  }

  const eliminarCategoria = (nombre) => {
    setCategorias((prev) => prev.filter((c) => c !== nombre))
  }

  return [categorias, agregarCategoria, eliminarCategoria]
}
