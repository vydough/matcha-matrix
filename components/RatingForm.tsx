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

  const getLabelForSweetBitter = (val: number) => {
    if (val <= -3) return 'Very Bitter'
    if (val < 0) return 'Bitter'
    if (val === 0) return 'Balanced'
    if (val <= 3) return 'Sweet'
    return 'Very Sweet'
  }

  const getLabelForCreativeTraditional = (val: number) => {
    if (val <= -3) return 'Very Traditional'
    if (val < 0) return 'Traditional'
    if (val === 0) return 'Balanced'
    if (val <= 3) return 'Creative'
    return 'Very Creative'
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sweet / Bitter Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium" style={{ color: 'var(--soft-brown)' }}>Bitter</span>
          <span className="text-sm font-semibold" style={{ color: 'var(--dark-olive)' }}>
            Taste: {getLabelForSweetBitter(sweetBitter)}
          </span>
          <span className="text-xs font-medium" style={{ color: 'var(--soft-brown)' }}>Sweet</span>
        </div>
        <input
          type="range"
          min={-5}
          max={5}
          step={1}
          value={sweetBitter}
          onChange={(e) => setSweetBitter(parseInt(e.target.value))}
          className="w-full"
          aria-label="Sweet to Bitter rating"
        />
        <div className="text-center text-xs mt-1" style={{ color: 'var(--soft-brown)' }}>
          {sweetBitter > 0 ? '+' : ''}{sweetBitter}
        </div>
      </div>

      {/* Creative / Traditional Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium" style={{ color: 'var(--soft-brown)' }}>Traditional</span>
          <span className="text-sm font-semibold" style={{ color: 'var(--dark-olive)' }}>
            Style: {getLabelForCreativeTraditional(creativeTraditional)}
          </span>
          <span className="text-xs font-medium" style={{ color: 'var(--soft-brown)' }}>Creative</span>
        </div>
        <input
          type="range"
          min={-5}
          max={5}
          step={1}
          value={creativeTraditional}
          onChange={(e) => setCreativeTraditional(parseInt(e.target.value))}
          className="w-full"
          aria-label="Creative to Traditional rating"
        />
        <div className="text-center text-xs mt-1" style={{ color: 'var(--soft-brown)' }}>
          {creativeTraditional > 0 ? '+' : ''}{creativeTraditional}
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          backgroundColor: 'var(--dark-olive)',
          color: 'var(--cream)',
        }}
        onMouseEnter={(e) => {
          if (!submitting) {
            (e.target as HTMLButtonElement).style.backgroundColor = 'var(--matcha-green)'
          }
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.backgroundColor = 'var(--dark-olive)'
        }}
      >
        {submitting ? 'Submitting...' : 'Submit Rating'}
      </button>
    </form>
  )
}
