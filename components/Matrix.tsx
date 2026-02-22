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

  // Initial fetch
  useEffect(() => {
    fetchCafes()
  }, [fetchCafes])

  // Realtime subscription on ratings table
  useEffect(() => {
    const channel = supabase
      .channel('ratings')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ratings' },
        () => {
          fetchCafes()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchCafes])

  const handleRatingSubmitted = useCallback(() => {
    setSelectedCafe(null)
    fetchCafes()
  }, [fetchCafes])

  return (
    <div className="relative w-full h-full">
      {/* Matrix container */}
      <div
        className="matrix-grid relative w-full h-full rounded-2xl overflow-hidden border"
        style={{
          borderColor: 'rgba(63,74,60,0.2)',
          backgroundColor: 'rgba(245,241,232,0.6)',
        }}
      >
        {/* Center crosshair lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          {/* Horizontal center line */}
          <div
            className="absolute w-full"
            style={{
              top: '50%',
              height: '1px',
              backgroundColor: 'rgba(63,74,60,0.25)',
            }}
          />
          {/* Vertical center line */}
          <div
            className="absolute h-full"
            style={{
              left: '50%',
              width: '1px',
              backgroundColor: 'rgba(63,74,60,0.25)',
            }}
          />
        </div>

        {/* Loading state */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div
                className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto"
                style={{ borderColor: 'var(--matcha-green)', borderTopColor: 'transparent' }}
              />
              <p className="text-sm" style={{ color: 'var(--soft-brown)' }}>Loading cafes...</p>
            </div>
          </div>
        )}

        {/* Stickers */}
        {!loading && cafes.map((cafe) => (
          <Sticker
            key={cafe.id}
            cafe={cafe}
            onClick={setSelectedCafe}
          />
        ))}

        {/* Empty state */}
        {!loading && cafes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm" style={{ color: 'var(--soft-brown)' }}>
              No cafes found. Add some in Supabase!
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
    </div>
  )
}
