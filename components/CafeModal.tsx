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

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  const fmt = (val: number) => {
    const n = typeof val === 'number' ? val : parseFloat(String(val))
    return (n > 0 ? '+' : '') + n.toFixed(1)
  }

  const igUrl = `https://www.instagram.com/${cafe.instagram_handle.replace('@', '')}`

  return (
    <div className="modal-overlay" onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-label={`${cafe.name} details`}>
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 420,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
          backgroundColor: '#fff',
          fontFamily: 'inherit',
        }}
      >
        {/* Header band */}
        <div style={{
          padding: '1.75rem 1.5rem 1.25rem',
          backgroundColor: 'var(--green)',
          position: 'relative',
        }}>
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute', top: 14, right: 14,
              width: 30, height: 30,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.18)',
              border: 'none',
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            ✕
          </button>

          {/* Sticker */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <div style={{
              width: 80, height: 80,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid rgba(255,255,255,0.5)',
              position: 'relative',
              backgroundColor: 'rgba(255,255,255,0.15)',
            }}>
              <Image
                src={cafe.sticker_url}
                alt={cafe.name}
                fill
                style={{ objectFit: 'cover' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </div>
          </div>

          <h2 style={{
            textAlign: 'center',
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: '1.35rem',
            fontWeight: 400,
            color: '#fff',
            lineHeight: 1.15,
          }}>
            {cafe.name}
          </h2>
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.72)', marginTop: 3 }}>
            {cafe.suburb}
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: '1.25rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Description */}
          <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--ink-2)' }}>
            {cafe.description}
          </p>

          {/* Instagram */}
          <a
            href={igUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: '0.82rem', fontWeight: 600,
              color: 'var(--green)', textDecoration: 'none',
            }}
          >
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10A5 5 0 0 1 12 7zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.25-2.25a.875.875 0 1 1 0 1.75.875.875 0 0 1 0-1.75z"/>
            </svg>
            {cafe.instagram_handle}
          </a>

          {/* Community ratings */}
          {cafe.rating_count > 0 && (
            <div style={{
              borderRadius: 12,
              padding: '0.85rem 1rem',
              backgroundColor: 'var(--green-light)',
              border: '1px solid rgba(61,107,58,0.18)',
            }}>
              <p style={{
                fontSize: '0.68rem', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--green)', marginBottom: '0.5rem',
              }}>
                Community Ratings · {cafe.rating_count} {cafe.rating_count === 1 ? 'vote' : 'votes'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--green)' }}>
                    {fmt(cafe.avg_sweet_bitter)}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--ink-3)', marginTop: 2 }}>🥛 Creamy / 🌱 Earthy</p>
                </div>
                <div style={{ width: 1, background: 'rgba(61,107,58,0.2)' }} />
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--green)' }}>
                    {fmt(cafe.avg_creative_traditional)}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--ink-3)', marginTop: 2 }}>🍯 Sweet / 🍃 Bitter</p>
                </div>
              </div>
            </div>
          )}

          {cafe.rating_count === 0 && (
            <div style={{
              borderRadius: 12,
              padding: '0.85rem 1rem',
              textAlign: 'center',
              backgroundColor: 'rgba(26,26,26,0.04)',
              border: '1.5px dashed rgba(26,26,26,0.15)',
            }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink-3)' }}>No ratings yet — be the first!</p>
            </div>
          )}

          {/* Divider */}
          <div style={{ height: 1, backgroundColor: 'rgba(26,26,26,0.08)' }} />

          {/* Rating form */}
          <div>
            <p style={{
              fontSize: '0.72rem', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--ink-2)', marginBottom: '0.75rem',
            }}>
              Rate This Cafe
            </p>
            <RatingForm cafeId={cafe.id} onSubmitted={onRatingSubmitted} />
          </div>
        </div>
      </div>
    </div>
  )
}
