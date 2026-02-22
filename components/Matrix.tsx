'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase, type Cafe } from '@/lib/supabase'
import Sticker from './Sticker'
import CafeModal from './CafeModal'

export default function Matrix() {
  const [cafes, setCafes] = useState<Cafe[]>([])
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchCafes = useCallback(async () => {
    const { data, error } = await supabase
      .from('cafe_averages')
      .select('*')

    if (error) {
      console.error('Error fetching cafes:', error)
      return
    }

    setCafes(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchCafes()
  }, [fetchCafes])

  useEffect(() => {
    const channel = supabase
      .channel('ratings')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ratings' },
        () => { fetchCafes() }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchCafes])

  const handleRatingSubmitted = useCallback(() => {
    setSelectedCafe(null)
    fetchCafes()
  }, [fetchCafes])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Matrix grid */}
      <div className="matrix-grid" style={{ position: 'relative', width: '100%', height: '100%' }}>

        {/* Corner quadrant labels */}
        <div className="corner-label corner-tl">
          <p className="corner-label-title">🥛🍯 Creamy &amp; Sweet</p>
          <p className="corner-label-desc">Smooth, mellow, easy sipping</p>
        </div>
        <div className="corner-label corner-tr">
          <p className="corner-label-title">🥛🍃 Creamy &amp; Bitter</p>
          <p className="corner-label-desc">Rich, deep, velvety bite</p>
        </div>
        <div className="corner-label corner-bl">
          <p className="corner-label-title">🌱🍯 Earthy &amp; Sweet</p>
          <p className="corner-label-desc">Grassy with gentle sweetness</p>
        </div>
        <div className="corner-label corner-br">
          <p className="corner-label-title">🌱🍃 Earthy &amp; Bitter</p>
          <p className="corner-label-desc">Bold, intense, traditional</p>
        </div>

        {/* Centre crosshair */}
        <div
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          {/* Horizontal line */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '1px',
            background: 'rgba(26,26,26,0.12)',
          }} />
          {/* Vertical line */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '1px',
            background: 'rgba(26,26,26,0.12)',
          }} />
        </div>

        {/* Loading */}
        {loading && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 28, height: 28,
                border: '2.5px solid var(--green)',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                margin: '0 auto 8px',
                animation: 'spin 0.75s linear infinite',
              }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--ink-3)', fontFamily: 'var(--font)' }}>Loading…</p>
            </div>
          </div>
        )}

        {/* Stickers */}
        {!loading && cafes.map((cafe) => (
          <Sticker key={cafe.id} cafe={cafe} onClick={setSelectedCafe} />
        ))}

        {/* Empty state */}
        {!loading && cafes.length === 0 && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-3)', fontFamily: 'var(--font)' }}>
              No cafes yet — add some in Supabase!
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedCafe && (
        <CafeModal
          cafe={selectedCafe}
          onClose={() => setSelectedCafe(null)}
          onRatingSubmitted={handleRatingSubmitted}
        />
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
