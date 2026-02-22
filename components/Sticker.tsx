'use client'

import Image from 'next/image'
import { type Cafe } from '@/lib/supabase'

type Props = {
  cafe: Cafe
  onClick: (cafe: Cafe) => void
}

function getPositionPercent(avgSweetBitter: number, avgCreativeTraditional: number) {
  // xPercent: Traditional(-5) → 0%, Creative(+5) → 100%
  const xPercent = ((avgCreativeTraditional + 5) / 10) * 100
  // yPercent: Sweet(+5) → top (0%), Bitter(-5) → bottom (100%) — inverted
  const yPercent = (1 - ((avgSweetBitter + 5) / 10)) * 100
  return { xPercent, yPercent }
}

export default function Sticker({ cafe, onClick }: Props) {
  const { xPercent, yPercent } = getPositionPercent(
    cafe.avg_sweet_bitter,
    cafe.avg_creative_traditional
  )

  return (
    <div
      className="sticker-wrapper"
      style={{
        left: `${xPercent}%`,
        top: `${yPercent}%`,
      }}
    >
      <button
        className="sticker flex flex-col items-center gap-1 bg-transparent border-0 p-0"
        onClick={() => onClick(cafe)}
        aria-label={`Open ${cafe.name} details`}
        title={cafe.name}
      >
        {/* Sticker image */}
        <div className="relative w-14 h-14">
          <Image
            src={cafe.sticker_url}
            alt={cafe.name}
            width={56}
            height={56}
            className="object-contain"
            onError={(e) => {
              const img = e.target as HTMLImageElement
              img.style.display = 'none'
              // show fallback by revealing sibling
              const parent = img.parentElement
              if (parent) {
                const fallback = parent.querySelector('.sticker-fallback') as HTMLElement
                if (fallback) fallback.style.display = 'flex'
              }
            }}
          />
          {/* Hidden fallback, shown via JS when image fails */}
          <div
            className="sticker-fallback w-14 h-14 rounded-full items-center justify-center text-sm font-bold border-2"
            style={{
              display: 'none',
              backgroundColor: 'var(--dark-olive)',
              color: 'var(--cream)',
              borderColor: 'var(--matcha-green)',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            {cafe.name
              .split(' ')
              .map((w) => w[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </div>
        </div>

        {/* Cafe name label */}
        <span
          className="text-xs font-medium text-center leading-tight max-w-[72px] truncate"
          style={{ color: 'var(--charcoal)' }}
        >
          {cafe.name}
        </span>
      </button>
    </div>
  )
}
