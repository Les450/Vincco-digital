import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Icon from '../icons/Icon'
import DetallePromocion from './DetallePromocion'

/* ══════════════════════════════════════════════════════════════
   La hoja que sube desde abajo cuando el cliente toca "Ver" en
   cualquier tarjeta del Home: promoción, producto o destacada.

   Se eligió hoja y no pantalla nueva por una razón concreta: el
   carrusel de promociones es horizontal y con scroll propio. Si
   "Ver" navegara a otra ruta, al volver el cliente quedaría al
   principio de la lista y tendría que buscar de nuevo dónde iba.
   La hoja se cierra y todo sigue exactamente donde estaba.

   Va en un portal sobre el <body> porque las tarjetas del Home
   viven dentro de contenedores con overflow y transform: desde
   adentro, un position: fixed no se comporta como fijo.
   ══════════════════════════════════════════════════════════════ */

export default function HojaPromocion({ promo, onClose, likes }) {
  const navigate = useNavigate()
  const menosMovimiento = useReducedMotion()
  const abierta = Boolean(promo)

  // Escape cierra, y mientras la hoja está arriba el fondo no
  // scrollea: si no, el dedo mueve el Home por debajo.
  useEffect(() => {
    if (!abierta) return undefined

    const alPresionar = (e) => {
      if (e.key === 'Escape') onClose()
    }
    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', alPresionar)

    return () => {
      document.body.style.overflow = overflowPrevio
      window.removeEventListener('keydown', alPresionar)
    }
  }, [abierta, onClose])

  if (typeof document === 'undefined') return null

  const verTodo = () => {
    onClose()
    navigate(`/promocion/${promo.id}`)
  }

  return createPortal(
    <AnimatePresence>
      {abierta && (
        <motion.div
          className="vc-hoja__fondo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="vc-hoja"
            role="dialog"
            aria-modal="true"
            aria-label={promo.titulo}
            initial={menosMovimiento ? { opacity: 0 } : { y: '100%' }}
            animate={menosMovimiento ? { opacity: 1 } : { y: 0 }}
            exit={menosMovimiento ? { opacity: 0 } : { y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            /* Arrastrar hacia abajo cierra, que es el gesto que la
               gente ya trae aprendido de otras apps. Solo cuenta si
               bajó lo suficiente o si soltó con impulso. */
            drag={menosMovimiento ? false : 'y'}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose()
            }}
          >
            <div className="vc-hoja__agarre" aria-hidden="true" />

            <button type="button" className="vc-hoja__cerrar" onClick={onClose} aria-label="Cerrar">
              <Icon name="x" size={18} />
            </button>

            <div className="vc-hoja__contenido">
              <DetallePromocion promo={promo} variante="hoja" onVerTodo={verTodo} onCerrar={onClose} likes={likes} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
