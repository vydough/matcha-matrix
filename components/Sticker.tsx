'use client'

import Image from 'next/image'
import { type Cafe } from '@/lib/supabase'

type Props = {
  cafe: Cafe
  onClick: (cafe: Cafe) => void
  /** Optional pixel offset to prevent overlapping stickers */
  nudge?: { dx: number; dy: number }
}

/**
 * Convert average ratings → percentage position on the matrix.
 * X-axis: Bitter(-5) → 0% left,  Sweet(+5) → 100% right   (avg_creative_traditional)
 * Y-axis: Earthy(-5) → 0% bottom, Creamy(+5) → 100% top   (avg_sweet_bitter)
 * Uses `left` + `bottom` for precise CSS positioning.
 */
function getPositionPercent(avgSweetBitter: number, avgCreamyEarthy: number) {
  const xPercent = ((avgCreamyEarthy + 5) / 10) * 100
  const yPercent = ((avgSweetBitter + 5) / 10) * 100
  return { xPercent, yPercent }
}

/**
 * Maps colour_richness (-5 to +5) → a CSS hsl() colour.
 * -5 = desaturated olive (muted/dull green)
 *  0 = mid green (neutral)
 * +5 = vivid saturated rich green
 */
function colourFromRichness(val: number): string {
  const t = (val + 5) / 10           // normalise to 0..1
  const sat = Math.round(20 + t * 55) // 20% (muted) → 75% (vivid)
  const lig = Math.round(55 - t * 17) // 55% (light) → 38% (rich/dark)
  return `hsl(120, ${sat}%, ${lig}%)`
}

export default function Sticker({ cafe, onClick, nudge }: Props) {
  const { xPercent, yPercent } = getPositionPercent(
    cafe.avg_sweet_bitter,
    cafe.avg_creative_traditional
  )

  // Colour-coded ring based on average colour richness rating
  const ringColour = colourFromRichness(cafe.avg_colour_richness ?? 0)

  const initials = cafe.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div
      className="sticker-wrapper"
      style={{
        left: `${xPercent}%`,
        bottom: `${yPercent}%`,
        marginLeft: nudge ? nudge.dx : 0,
        marginBottom: nudge ? nudge.dy : 0,
      }}
    >
      <button
        className="sticker"
        onClick={() => onClick(cafe)}
        aria-label={`Open ${cafe.name} details`}
        title={cafe.name}
      >
        {/* Sticker image — fixed size, colour-coded outline tracing actual shape */}
        <div
          className="sticker-img-wrap"
          style={{
            // Override the CSS filter with a colour-coded drop-shadow ring
            filter: `
              drop-shadow(0 0 0 #fff)
              drop-shadow(1px 0 0 #fff)
              drop-shadow(-1px 0 0 #fff)
              drop-shadow(0 1px 0 #fff)
              drop-shadow(0 -1px 0 #fff)
              drop-shadow(2px 2px 0 ${ringColour})
              drop-shadow(-2px -2px 0 ${ringColour})
              drop-shadow(2px -2px 0 ${ringColour})
              drop-shadow(-2px 2px 0 ${ringColour})
              drop-shadow(0 4px 6px rgba(0,0,0,0.15))
            `,
          }}
        >
          <Image
            src={cafe.sticker_url}
            alt={cafe.name}
            width={42}
            height={42}
            style={{ objectFit: 'contain' }}
            onError={(e) => {
              const img = e.target as HTMLImageElement
              img.style.display = 'none'
              const fb = img.parentElement?.querySelector<HTMLElement>('.sticker-fallback')
              if (fb) fb.style.display = 'flex'
            }}
          />
          {/* Fallback initials circle with matching ring colour */}
          <div
            className="sticker-fallback"
            style={{
              display: 'none',
              position: 'absolute', inset: 0,
              borderRadius: '50%',
              backgroundColor: 'var(--green)',
              border: `3px solid ${ringColour}`,
              color: '#fff',
              fontWeight: 900,
              fontSize: '0.75rem',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {initials}
          </div>
        </div>

        {/* Name label */}
        <span style={{
          fontFamily: 'var(--font)',
          fontSize: '0.62rem',
          fontWeight: 700,
          color: 'var(--ink)',
          maxWidth: 64,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textAlign: 'center',
          letterSpacing: '0.01em',
          textShadow: '0 1px 3px rgba(255,255,255,0.9)',
        }}>
          {cafe.name}
        </span>
      </button>
    </div>
  )
}
