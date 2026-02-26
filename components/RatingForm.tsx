'use client'

import { useState } from 'react'
import { supabase, type Rating } from '@/lib/supabase'

type Props = {
  cafeId: string
  onSubmitted: () => void
}

export default function RatingForm({ cafeId, onSubmitted }: Props) {
  // sweet_bitter maps to Y-axis: -5 = Earthy (bottom), +5 = Creamy (top)
  const [sweetBitter, setSweetBitter] = useState(0)
  // creamy_earthy maps to X-axis: -5 = Bitter (left), +5 = Sweet (right)
  const [creamyEarthy, setCreamyEarthy] = useState(0)
  // colour_richness: -5 = very dull/muted green, +5 = very vivid/rich green
  const [colourRichness, setColourRichness] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const rating: Rating = {
        cafe_id: cafeId,
        sweet_bitter: sweetBitter,
        creamy_earthy: creamyEarthy,
        colour_richness: colourRichness,
      }

      let { error: insertError } = await supabase.from('ratings').insert([rating])

      // Graceful fallback: if colour_richness column doesn't exist in DB yet,
      // retry without it so ratings still submit.
      if (insertError?.code === 'PGRST204' && insertError.message.includes('colour_richness')) {
        const { error: fallbackError } = await supabase
          .from('ratings')
          .insert([{ cafe_id: cafeId, sweet_bitter: sweetBitter, creamy_earthy: creamyEarthy }])
        insertError = fallbackError
      }

      if (insertError) {
        console.error('Supabase insert error:', insertError)
        setError(`Failed to submit: ${insertError.message}`)
        setSubmitting(false)
        return
      }

      setSuccess(true)
      setSubmitting(false)
      setTimeout(() => {
        onSubmitted()
      }, 800)
    } catch (err) {
      console.error('Submit error:', err)
      setError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  const getLabelForCreamyEarthy = (val: number) => {
    if (val >= 4) return '🥛 Very Creamy'
    if (val >= 1) return '🥛 Creamy'
    if (val === 0) return 'Balanced'
    if (val >= -3) return '🌱 Earthy'
    return '🌱 Very Earthy'
  }

  const getLabelForSweetBitter = (val: number) => {
    if (val >= 4) return '🍯 Very Sweet'
    if (val >= 1) return '🍯 Sweet'
    if (val === 0) return 'Balanced'
    if (val >= -3) return '🍃 Bitter'
    return '🍃 Very Bitter'
  }

  const getLabelForColourRichness = (val: number) => {
    if (val >= 4) return '💚 Very Vivid'
    if (val >= 1) return '💚 Vivid'
    if (val === 0) return 'Balanced'
    if (val >= -3) return '🩶 Muted'
    return '🩶 Very Muted'
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

  const tickStyle: React.CSSProperties = {
    fontSize: '0.6rem',
    fontFamily: 'var(--font)',
    fontWeight: 500,
    color: 'var(--ink-3)',
  }

  const ticks = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'var(--font)' }}>

      {/* Y-axis slider: Earthy (-5) ← → Creamy (+5) */}
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
          style={{ display: 'block', width: '100%' }}
          aria-label="Earthy to Creamy rating"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px', padding: '0 2px' }}>
          {ticks.map((t) => (
            <span key={t} style={{
              ...tickStyle,
              color: t === sweetBitter ? 'var(--green)' : 'var(--ink-3)',
              fontWeight: t === sweetBitter ? 800 : 500,
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* X-axis slider: Bitter (-5) ← → Sweet (+5) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={labelStyle}>🍃 Bitter</span>
          <span style={centerLabelStyle}>{getLabelForSweetBitter(creamyEarthy)}</span>
          <span style={labelStyle}>🍯 Sweet</span>
        </div>
        <input
          type="range"
          min={-5}
          max={5}
          step={1}
          value={creamyEarthy}
          onChange={(e) => setCreamyEarthy(parseInt(e.target.value))}
          style={{ display: 'block', width: '100%' }}
          aria-label="Bitter to Sweet rating"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px', padding: '0 2px' }}>
          {ticks.map((t) => (
            <span key={t} style={{
              ...tickStyle,
              color: t === creamyEarthy ? 'var(--green)' : 'var(--ink-3)',
              fontWeight: t === creamyEarthy ? 800 : 500,
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Colour richness slider: Muted (-5) ← → Vivid (+5) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={labelStyle}>🩶 Muted</span>
          <span style={centerLabelStyle}>{getLabelForColourRichness(colourRichness)}</span>
          <span style={labelStyle}>💚 Vivid</span>
        </div>
        <input
          type="range"
          min={-5}
          max={5}
          step={1}
          value={colourRichness}
          onChange={(e) => setColourRichness(parseInt(e.target.value))}
          style={{ display: 'block', width: '100%' }}
          aria-label="Muted to Vivid colour rating"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px', padding: '0 2px' }}>
          {ticks.map((t) => (
            <span key={t} style={{
              ...tickStyle,
              color: t === colourRichness ? 'var(--green)' : 'var(--ink-3)',
              fontWeight: t === colourRichness ? 800 : 500,
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {error && (
        <p style={{ fontSize: '0.8rem', color: '#c0392b', textAlign: 'center', fontFamily: 'var(--font)' }}>{error}</p>
      )}

      {success && (
        <p style={{ fontSize: '0.8rem', color: 'var(--green)', textAlign: 'center', fontFamily: 'var(--font)', fontWeight: 600 }}>
          Rating submitted!
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || success}
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
          cursor: (submitting || success) ? 'not-allowed' : 'pointer',
          opacity: (submitting || success) ? 0.6 : 1,
          backgroundColor: success ? 'var(--green-mid)' : 'var(--green)',
          color: '#fff',
          transition: 'background-color 0.15s, opacity 0.15s',
        }}
        onMouseEnter={(e) => {
          if (!submitting && !success) (e.currentTarget.style.backgroundColor = 'var(--green-mid)')
        }}
        onMouseLeave={(e) => {
          if (!submitting && !success) (e.currentTarget.style.backgroundColor = 'var(--green)')
        }}
      >
        {success ? 'Submitted!' : submitting ? 'Submitting…' : 'Submit Rating'}
      </button>
    </form>
  )
}
