'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { type Cafe } from '@/lib/supabase'
import RatingForm from './RatingForm'

type Props = {
  cafe: Cafe
  onClose: () => void
  onRatingSubmitted: () => void
}

export default function CafeModal({ cafe, onClose, onRatingSubmitted }: Props) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  const formatRating = (val: number) => {
    const n = typeof val === 'number' ? val : parseFloat(String(val))
    return (n > 0 ? '+' : '') + n.toFixed(1)
  }

  const igUrl = `https://www.instagram.com/${cafe.instagram_handle.replace('@', '')}`

  return (
    <div className="modal-overlay" onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-label={`${cafe.name} details`}>
      <div
        ref={modalRef}
        className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: 'var(--cream)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header band */}
        <div className="px-6 pt-6 pb-4" style={{ backgroundColor: 'var(--dark-olive)' }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-colors"
            style={{ backgroundColor: 'rgba(245,241,232,0.15)', color: 'var(--cream)' }}
            aria-label="Close modal"
          >
            ✕
          </button>

          {/* Sticker image */}
          <div className="flex justify-center mb-3">
            <div className="w-20 h-20 relative rounded-full overflow-hidden border-4" style={{ borderColor: 'var(--cream)' }}>
              <Image
                src={cafe.sticker_url}
                alt={`${cafe.name} sticker`}
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback to a green circle with initials
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            </div>
          </div>

          <h2 className="text-center text-xl font-bold" style={{ color: 'var(--cream)', fontFamily: 'Playfair Display, serif' }}>
            {cafe.name}
          </h2>
          <p className="text-center text-sm mt-0.5" style={{ color: 'rgba(245,241,232,0.7)' }}>
            {cafe.suburb}
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Description */}
          <p className="text-sm leading-relaxed" style={{ color: 'var(--charcoal)' }}>
            {cafe.description}
          </p>

          {/* Instagram */}
          <a
            href={igUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: 'var(--matcha-green)' }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10A5 5 0 0 1 12 7zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.25-2.25a.875.875 0 1 1 0 1.75.875.875 0 0 1 0-1.75z"/>
            </svg>
            {cafe.instagram_handle}
          </a>

          {/* Average ratings */}
          {cafe.rating_count > 0 && (
            <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(110,166,58,0.1)', border: '1px solid rgba(110,166,58,0.25)' }}>
              <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--matcha-green)' }}>
                Community Ratings ({cafe.rating_count} {cafe.rating_count === 1 ? 'vote' : 'votes'})
              </p>
              <div className="flex justify-between text-sm">
                <div className="text-center">
                  <p className="font-bold text-lg" style={{ color: 'var(--dark-olive)' }}>
                    {formatRating(cafe.avg_sweet_bitter)}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--soft-brown)' }}>Sweet/Bitter</p>
                </div>
                <div className="w-px" style={{ backgroundColor: 'rgba(110,166,58,0.3)' }} />
                <div className="text-center">
                  <p className="font-bold text-lg" style={{ color: 'var(--dark-olive)' }}>
                    {formatRating(cafe.avg_creative_traditional)}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--soft-brown)' }}>Creative/Traditional</p>
                </div>
              </div>
            </div>
          )}

          {cafe.rating_count === 0 && (
            <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'rgba(156,123,91,0.1)', border: '1px dashed rgba(156,123,91,0.4)' }}>
              <p className="text-sm" style={{ color: 'var(--soft-brown)' }}>No ratings yet — be the first!</p>
            </div>
          )}

          {/* Divider */}
          <div className="h-px" style={{ backgroundColor: 'rgba(63,74,60,0.15)' }} />

          {/* Rating form */}
          <div>
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--dark-olive)', fontFamily: 'Playfair Display, serif' }}>
              Rate This Cafe
            </p>
            <RatingForm cafeId={cafe.id} onSubmitted={onRatingSubmitted} />
          </div>
        </div>
      </div>
    </div>
  )
}
