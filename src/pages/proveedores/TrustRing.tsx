import { cn } from '@/lib/utils'

// ── Score de confianza Vincco ─────────────────────────────
// Firma visual del módulo: un anillo SVG que resume la confiabilidad
// del proveedor (verificación, historial y cumplimiento). Se muestra
// en las tarjetas y en el detalle, siempre del mismo tamaño.
interface TrustRingProps {
  score: number
  size?: number
  className?: string
  withLabel?: boolean
}

export default function TrustRing({ score, size = 52, className, withLabel = false }: TrustRingProps) {
  const stroke = 3.5
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (score / 100) * c

  const altoScore = score >= 90

  return (
    <div className={cn('relative inline-flex shrink-0 items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#E7E9F0"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={altoScore ? '#D4A843' : '#0F2C59'}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      {withLabel ? (
        <span className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[13px] font-bold leading-none text-vincco-ink">{score}</span>
          <span className="mt-0.5 text-[8px] font-medium uppercase tracking-wider text-vincco-slate2">
            conf.
          </span>
        </span>
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-vincco-ink">
          {score}
        </span>
      )}
    </div>
  )
}