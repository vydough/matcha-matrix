'use client'

import Image from 'next/image'
import { type Cafe } from '@/lib/supabase'

type Props = {
  cafe: Cafe
  onClick: (cafe: Cafe) => void
}

function getPositionPercent(avgSweetBitter: number, avgCreativeTraditional: number) {
  // X-axis: Sweet(-5) → 0% left, Bitter(+5) → 100% left
  const xPercent = ((avgCreativeTraditional + 5) / 10) * 100
  // Y-axis: Creamy(+5) → top (0%), Earthy(-5) → bottom (100%) — inverted
  const yPercent = (1 - ((avgSweetBitter + 5) / 10)) * 100
  return { xPercent, yPercent }
}

export default function Sticker({ cafe, onClick }: Props) {
  const { xPercent, yPercent } = getPositionPercent(
    cafe.avg_sweet_bitter,
    cafe.avg_creative_traditional
  )

  const initials = cafe.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div
      className="sticker-wrapper"
      style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
    >
      <button
        className="sticker"
        onClick={() => onClick(cafe)}
        aria-label={`Open ${cafe.name} details`}
        title={cafe.name}
      >
        {/* Sticker image */}
        <div style={{ position: 'relative', width: 56, height: 56 }}>
          <Image
            src={cafe.sticker_url}
            alt={cafe.name}
            width={56}
            height={56}
            style={{ objectFit: 'contain', borderRadius: '50%' }}
            onError={(e) => {
              const img = e.target as HTMLImageElement
              img.style.display = 'none'
              const fb = img.parentElement?.querySelector<HTMLElement>('.sticker-fallback')
              if (fb) fb.style.display = 'flex'
            }}
          />
          {/* Fallback initials circle */}
          <div
            className="sticker-fallback"
            style={{
              display: 'none',
              position: 'absolute', inset: 0,
              borderRadius: '50%',
              backgroundColor: 'var(--green)',
              color: '#fff',
              fontWeight: 900,
              fontSize: '1rem',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2.5px solid rgba(255,255,255,0.6)',
            }}
          >
            {initials}
          </div>
        </div>

        {/* Name label */}
        <span style={{
          fontFamily: 'var(--font)',
          fontSize: '0.67rem',
          fontWeight: 700,
          color: 'var(--ink)',
          maxWidth: 72,
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
