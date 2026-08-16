import { useState, useMemo } from 'react'
import Icon from '../icons/Icon'
import useStore from '../../store/puntos_usestore'
import { MontoTexto } from '../Monto'

const STORAGE_KEY = 'vn_cotizaciones_recibidas'

const UNIDADES = ['unidad', 'kg', 'lb', 'litro', 'caja', 'paquete', 'metros']

const PRODUCTO_VACIO = { nombre: '', cantidad: '', precio: '', unidad: 'unidad' }

function FormularioCotizacion({ negocio, proveedor, onClose, onEnviada }) {
  // Los montos se guardan siempre en cordobas; esto solo cambia como
  // se MUESTRAN el subtotal y el total, segun lo que el proveedor
  // eligio en Configuraciones > Idioma y moneda.
  const moneda = useStore((s) => s.configuraciones.proveedor?.moneda) || 'NIO'
  const [productos, setProductos] = useState([PRODUCTO_VACIO])
  const [solicitud, setSolicitud] = useState('')
  const [descuento, setDescuento] = useState('')
  const [envio, setEnvio] = useState('')
  const [entrega, setEntrega] = useState('')
  const [formaPago, setFormaPago] = useState('Contado al recibir')
  const [condiciones, setCondiciones] = useState('')

  const subtotal = useMemo(() => {
    return productos.reduce((s, p) => {
      const cant = Number(p.cantidad) || 0
      const precio = Number(p.precio) || 0
      return s + cant * precio
    }, 0)
  }, [productos])

  const total = subtotal - (Number(descuento) || 0) + (Number(envio) || 0)

  const actualizarProducto = (idx, campo, valor) => {
    setProductos((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [campo]: valor } : p))
    )
  }

  const agregarLinea = () => setProductos((prev) => [...prev, { ...PRODUCTO_VACIO }])

  const quitarLinea = (idx) =>
    setProductos((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== idx)))

  const handleEnviar = (e) => {
    e.preventDefault()
    if (!negocio || !proveedor) return

    const productosValidos = productos.filter(
      (p) => p.nombre.trim() && Number(p.cantidad) > 0 && Number(p.precio) > 0
    )
    if (productosValidos.length === 0) return

    const hoy = new Date()
    const fechaIso = hoy.toISOString().slice(0, 10)
    const vence = new Date(hoy)
    vence.setDate(vence.getDate() + 15)
    const venceIso = vence.toISOString().slice(0, 10)

    const ultima = (() => {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        return Array.isArray(saved) ? saved : []
      } catch {
        return []
      }
    })()

    const maxNumero = ultima.reduce((max, c) => {
      const m = String(c.numero || '').match(/(\d+)/)
      return m ? Math.max(max, Number(m[1])) : max
    }, 0)
    const numeroStr = `COT-${String(maxNumero + 1).padStart(5, '0')}`

    const nueva = {
      id: Date.now(),
      numero: numeroStr,
      proveedor: proveedor.nombre,
      // A qué negocio asociado va dirigida: el proveedor la ve en
      // "Cotizaciones enviadas" con el destino claro.
      negocio: negocio.nombre || null,
      negocioId: negocio.id ?? null,
      fecha: fechaIso,
      vence: venceIso,
      estado: 'pendiente',
      solicitud: solicitud.trim() || null,
      productos: productosValidos.map((p) => ({
        nombre: p.nombre.trim(),
        cantidad: Number(p.cantidad),
        unidad: p.unidad || 'unidad',
        precio: Number(p.precio),
      })),
      descuento: Number(descuento) || 0,
      envio: Number(envio) || 0,
      entrega: entrega.trim() || null,
      formaPago: formaPago.trim() || null,
      condiciones: condiciones.trim() || null,
      motivo: null,
    }

    const actualizadas = [nueva, ...ultima]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizadas))

    if (onEnviada) onEnviada(nueva)
    onClose()
  }

  return (
    <div className="na-modal-overlay" onClick={onClose}>
      <div
        className="na-modal na-modal--cotizacion"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="na-modal-header">
          <h3>Crear cotización para {negocio?.nombre || 'negocio'}</h3>
          <button className="na-modal-cerrar" onClick={onClose} type="button" aria-label="Cerrar">
            <Icon name="x" size={16} />
          </button>
        </div>

        <form className="na-form na-form--cotizacion" onSubmit={handleEnviar}>
          <div className="na-form-grupo">
            <label>Solicitud / motivo de la compra</label>
            <textarea
              rows={2}
              placeholder="¿Qué productos busca este negocio? (ej: reponer cemento y varilla)"
              value={solicitud}
              onChange={(e) => setSolicitud(e.target.value)}
            />
          </div>

          <div className="na-form-cot-productos-header">
            <span className="na-form-cot-productos-titulo">Productos</span>
            <button
              type="button"
              className="na-btn-secundario na-btn--sm"
              onClick={agregarLinea}
            >
              <Icon name="plus" size={14} /> Agregar producto
            </button>
          </div>

          {productos.map((p, idx) => (
            <div key={idx} className="na-form-cot-fila">
              <input
                type="text"
                className="na-form-cot-input-nombre"
                placeholder="Producto"
                value={p.nombre}
                onChange={(e) => actualizarProducto(idx, 'nombre', e.target.value)}
                required
              />
              <input
                type="number"
                min="0"
                step="0.01"
                className="na-form-cot-input-cant"
                placeholder="Cantidad"
                value={p.cantidad}
                onChange={(e) => actualizarProducto(idx, 'cantidad', e.target.value)}
                required
              />
              <select
                className="na-form-cot-input-unidad"
                value={p.unidad || 'unidad'}
                onChange={(e) => actualizarProducto(idx, 'unidad', e.target.value)}
              >
                {UNIDADES.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
              <input
                type="number"
                min="0"
                step="0.01"
                className="na-form-cot-input-precio"
                placeholder="Precio"
                value={p.precio}
                onChange={(e) => actualizarProducto(idx, 'precio', e.target.value)}
                required
              />
              {productos.length > 1 && (
                <button
                  type="button"
                  className="na-form-cot-quitar"
                  onClick={() => quitarLinea(idx)}
                  aria-label="Quitar producto"
                >
                  <Icon name="trash-2" size={14} />
                </button>
              )}
            </div>
          ))}

          <div className="na-form-cot-totales">
            <div className="na-form-cot-total-line">
              <span>Subtotal</span>
              <b><MontoTexto valor={subtotal} moneda={moneda} /></b>
            </div>
            <div className="na-form-cot-total-line">
              <span>Descuento</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={descuento}
                onChange={(e) => setDescuento(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="na-form-cot-total-line">
              <span>Envío</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={envio}
                onChange={(e) => setEnvio(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="na-form-cot-total-line na-form-cot-total-line--grande">
              <span>Total</span>
              <b><MontoTexto valor={total} moneda={moneda} /></b>
            </div>
          </div>

          <div className="na-form-row">
            <div className="na-form-grupo">
              <label>Tiempo de entrega</label>
              <input
                type="text"
                placeholder="ej: 2 días hábiles"
                value={entrega}
                onChange={(e) => setEntrega(e.target.value)}
              />
            </div>
            <div className="na-form-grupo">
              <label>Forma de pago</label>
              <input
                type="text"
                placeholder="ej: Contado al recibir"
                value={formaPago}
                onChange={(e) => setFormaPago(e.target.value)}
              />
            </div>
          </div>

          <div className="na-form-grupo">
            <label>Condiciones</label>
            <textarea
              rows={2}
              placeholder="Precios válidos por 15 días. Pedido mínimo de C$2,000."
              value={condiciones}
                onChange={(e) => setCondiciones(e.target.value)}
            />
          </div>

          <div className="na-form-acciones">
            <button type="button" className="na-btn-secundario" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="na-btn-primario">
              Enviar cotización
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormularioCotizacion
