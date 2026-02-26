'use client'

import { useState } from 'react'
import { signIn, signUp } from '@/lib/auth'

type Props = {
  onSuccess: () => void
  onClose: () => void
}

export default function AuthModal({ onSuccess, onClose }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: authError } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password)

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      onSuccess()
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Sign in or sign up"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 380,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
          backgroundColor: '#fff',
          fontFamily: 'var(--font)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.75rem 1.5rem 1.25rem',
            backgroundColor: 'var(--green)',
            position: 'relative',
          }}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.18)',
              border: 'none',
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>

          <h2
            style={{
              textAlign: 'center',
              fontFamily: 'var(--font)',
              fontSize: '1.35rem',
              fontWeight: 700,
              color: '#fff',
            }}
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h2>
          <p
            style={{
              textAlign: 'center',
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.72)',
              marginTop: 3,
            }}
          >
            Rate matcha with the community
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-2)',
                  marginBottom: '0.35rem',
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1.5px solid var(--rule)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font)',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--green)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--rule)')}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-2)',
                  marginBottom: '0.35rem',
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1.5px solid var(--rule)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font)',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--green)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--rule)')}
              />
            </div>

            {error && (
              <p style={{ fontSize: '0.8rem', color: '#c0392b', textAlign: 'center' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '10px',
                fontFamily: 'var(--font)',
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                backgroundColor: 'var(--green)',
                color: '#fff',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = 'var(--green-mid)'
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = 'var(--green)'
              }}
            >
              {loading ? 'Loading…' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--ink-3)', marginBottom: '0.5rem' }}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
                setEmail('')
                setPassword('')
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--green)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline',
                fontFamily: 'var(--font)',
              }}
            >
              {isSignUp ? 'Sign in instead' : 'Sign up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
