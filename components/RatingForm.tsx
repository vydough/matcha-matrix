'use client'

import { useState } from 'react'
import { supabase, type Rating } from '@/lib/supabase'

type Props = {
  cafeId: string
  onSubmitted: () => void
}

export default function RatingForm({ cafeId, onSubmitted }: Props) {
  const [sweetBitter, setSweetBitter] = useState(0)
  const [creativeTraditional, setCreativeTraditional] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const rating: Omit<Rating, 'id'> = {
      cafe_id: cafeId,
      sweet_bitter: sweetBitter,
      creative_traditional: creativeTraditional,
    }

    const { error: insertError } = await supabase.from('ratings').insert([rating])

    if (insertError) {
      setError('Failed to submit rating. Please try again.')
      setSubmitting(false)
      return
    }

    setSubmitting(false)
    onSubmitted()
  }

  /*
    sweet_bitter: Y-axis
      +5 = top   = Creamy (🥛)
      -5 = bottom = Earthy (🌱)

    creative_traditional: X-axis
      -5 = left  = Sweet (🍯)
      +5 = right = Bitter (🍃)
  */

  const getLabelForCreamyEarthy = (val: number) => {
    if (val >= 4) return '🥛 Very Creamy'
    if (val >= 1) return '🥛 Creamy'
    if (val === 0) return 'Balanced'
    if (val >= -3) return '🌱 Earthy'
    return '🌱 Very Earthy'
  }

  const getLabelForSweetBitter = (val: number) => {
    if (val <= -4) return '🍯 Very Sweet'
    if (val <= -1) return '🍯 Sweet'
    if (val === 0) return 'Balanced'
    if (val <= 3) return '🍃 Bitter'
    return '🍃 Very Bitter'
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--ink-3)',
    fontFamily: 'var(--font)',
  }

  const centerLabelStyle: React.CSSProperties = {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--green)',
    fontFamily: 'var(--font)',
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'var(--font)' }}>

      {/* Texture: Earthy (-5) ← slider → Creamy (+5) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={labelStyle}>🌱 Earthy</span>
          <span style={centerLabelStyle}>{getLabelForCreamyEarthy(sweetBitter)}</span>
          <span style={labelStyle}>🥛 Creamy</span>
        </div>
        <input
          type="range"
          min={-5}
          max={5}
          step={1}
          value={sweetBitter}
          onChange={(e) => setSweetBitter(parseInt(e.target.value))}
          style={{ display: 'block', width: '100%', marginTop: '0.5rem' }}
          aria-label="Earthy to Creamy rating"
        />
      </div>

      {/* Sweetness: Sweet (-5) ← slider → Bitter (+5) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={labelStyle}>🍯 Sweet</span>
          <span style={centerLabelStyle}>{getLabelForSweetBitter(creativeTraditional)}</span>
          <span style={labelStyle}>🍃 Bitter</span>
        </div>
        <input
          type="range"
          min={-5}
          max={5}
          step={1}
          value={creativeTraditional}
          onChange={(e) => setCreativeTraditional(parseInt(e.target.value))}
          style={{ display: 'block', width: '100%', marginTop: '0.5rem' }}
          aria-label="Sweet to Bitter rating"
        />
      </div>

      {error && (
        <p style={{ fontSize: '0.8rem', color: '#c0392b', textAlign: 'center', fontFamily: 'var(--font)' }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        style={{
          width: '100%',
          padding: '0.85rem 1.5rem',
          borderRadius: '10px',
          fontFamily: 'var(--font)',
          fontSize: '0.85rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
          border: 'none',
          cursor: submitting ? 'not-allowed' : 'pointer',
          opacity: submitting ? 0.6 : 1,
          backgroundColor: 'var(--green)',
          color: '#fff',
          transition: 'background-color 0.15s, opacity 0.15s',
        }}
        onMouseEnter={(e) => {
          if (!submitting) (e.currentTarget.style.backgroundColor = 'var(--green-mid)')
        }}
        onMouseLeave={(e) => {
          if (!submitting) (e.currentTarget.style.backgroundColor = 'var(--green)')
        }}
      >
        {submitting ? 'Submitting…' : 'Submit Rating'}
      </button>
    </form>
  )
}
