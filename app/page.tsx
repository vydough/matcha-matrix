'use client'

import { useState, useEffect } from 'react'
import Matrix from '@/components/Matrix'
import { ensureAnonymousSession } from '@/lib/supabase'
/* next/image removed — using plain <img> for logo to avoid optimization issues */

/* ─────────────────────────────────────────────
   Axis tooltip data
───────────────────────────────────────────── */
type TooltipInfo = {
  label: string
  emoji: string
  description: string
}

const axisTooltips: Record<string, TooltipInfo> = {
  creamy: {
    label: 'Creamy',
    emoji: '🥛',
    description:
      'Smooth, rounded, and mellow. Low bitterness with a soft finish. Often slightly sweet and pairs beautifully with milk. Think silky, balanced, and refined.',
  },
  earthy: {
    label: 'Earthy',
    emoji: '🌱',
    description:
      'Bold, vegetal, and grassy. Stronger green tea depth with a more natural, plant-forward character. Can feel rustic, dry, or intensely "green."',
  },
  sweet: {
    label: 'Sweet',
    emoji: '🍯',
    description:
      'Naturally mellow with subtle sweetness. Less sharpness, minimal astringency, and an easy-to-drink profile.',
  },
  bitter: {
    label: 'Bitter',
    emoji: '🍃',
    description:
      'Sharper and more intense. A pronounced green tea bite with lingering depth. Can feel bold, dry, or slightly astringent.',
  },
}

/* ─────────────────────────────────────────────
   AxisLabel component with hover tooltip
───────────────────────────────────────────── */
function AxisLabel({
  id,
  vertical = false,
  flip = false,
  position,
}: {
  id: keyof typeof axisTooltips
  vertical?: boolean
  flip?: boolean
  position: 'top' | 'bottom' | 'left' | 'right'
}) {
  const [show, setShow] = useState(false)
  const info = axisTooltips[id]

  /*
   * Tooltip opens INWARD toward the matrix so it stays in view:
   *   top label    → tooltip appears below
   *   bottom label → tooltip appears above
   *   left label   → tooltip appears to the right
   *   right label  → tooltip appears to the left
   */
  const tooltipStyle: React.CSSProperties = (() => {
    switch (position) {
      case 'top':
        return { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 8 }
      case 'bottom':
        return { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8 }
      case 'left':
        return { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 8 }
      case 'right':
        return { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 8 }
    }
  })()

  return (
    <div
      style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span
        className="axis-label"
        style={{
          cursor: 'help',
          userSelect: 'none',
          ...(vertical
            ? {
                writingMode: 'vertical-rl',
                transform: flip ? 'rotate(180deg)' : 'none',
              }
            : {}),
        }}
      >
        {info.emoji} {info.label}
      </span>

      {show && (
        <div
          className="axis-tooltip"
          role="tooltip"
          style={{ ...tooltipStyle, zIndex: 100, animation: 'none', opacity: 1 }}
        >
          <p className="tooltip-title">
            {info.emoji} {info.label}
          </p>
          <p className="tooltip-body">{info.description}</p>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Logo floating sticker with CTA popup
───────────────────────────────────────────── */
function LogoSticker() {
  const [open, setOpen] = useState(false)

  return (
    <div className="logo-fab">
      {/* Popup card */}
      {open && (
        <div className="logo-popup">
          <p className="logo-popup-title">RMIT Matcha Club</p>
          <p className="logo-popup-sub">Supported by RMIT Matcha Club&apos;s matcha community</p>
          <div className="logo-popup-links">
            <a
              href="https://linktr.ee/rmitmatchaclub"
              target="_blank"
              rel="noopener noreferrer"
              className="logo-popup-link"
            >
              <span className="logo-popup-link-icon">🌳</span>
              Linktree
            </a>
            <a
              href="https://www.instagram.com/rmit.matchaclub/"
              target="_blank"
              rel="noopener noreferrer"
              className="logo-popup-link"
            >
              <span className="logo-popup-link-icon">📸</span>
              Instagram
            </a>
            <a
              href="https://discord.com/invite/knVk3v5YHS?fbclid=PAQ0xDSwL88phleHRuA2FlbQIxMQABpwahw6YAu9zWR2aEqTT8xuJTK2xy_92ujTQgttbcJRo6oDnR4KCEhI3eKez2_aem_JA2yeUwQKIeZAeM0usbqSw"
              target="_blank"
              rel="noopener noreferrer"
              className="logo-popup-link"
            >
              <span className="logo-popup-link-icon">💬</span>
              Discord
            </a>
            <a
              href="https://campus.hellorubric.com/?eid=40824"
              target="_blank"
              rel="noopener noreferrer"
              className="logo-popup-link"
            >
              <span className="logo-popup-link-icon">📋</span>
              Rubric
            </a>
          </div>
        </div>
      )}

      {/* FAB button */}
      <button
        className="logo-fab-btn"
        onClick={() => setOpen(!open)}
        aria-label="RMIT Matcha Club links"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/rmc.png"
          alt="RMIT Matcha Club"
          width={64}
          height={64}
          style={{ objectFit: 'cover', borderRadius: '50%', display: 'block' }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none'
            const fb = (e.currentTarget as HTMLImageElement).parentElement?.querySelector<HTMLElement>('.logo-fab-placeholder')
            if (fb) fb.style.display = 'flex'
          }}
        />
        <span
          className="logo-fab-placeholder"
          style={{
            display: 'none',
            position: 'absolute',
            inset: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          RMC
        </span>
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Home page
───────────────────────────────────────────── */
export default function Home() {
  // Silently sign in anonymously on first visit — invisible to user
  useEffect(() => {
    ensureAnonymousSession()
  }, [])

  return (
    <main className="page-root">
      {/* Header */}
      <header className="site-header">
        <p className="site-eyebrow">RMIT Matcha Club</p>
        <h1 className="site-title">Matcha Matrix</h1>
        <p className="site-sub">
          A live community map of Melbourne&apos;s matcha cafes and their iconic traditional matcha lattes, curated by the RMC team, rated by taste and style by you.
          Click any drink sticker to explore and rate.
        </p>
        <p className="site-attribution">by RMIT Matcha Club</p>
      </header>

      {/* Matrix section */}
      <section className="matrix-section">
        <div className="matrix-layout">
          {/* Top axis label — Creamy */}
          <div className="axis-slot axis-top">
            <AxisLabel id="creamy" position="bottom" />
          </div>

          {/* Middle row: left label | grid | right label */}
          <div className="axis-slot axis-left">
            <AxisLabel id="bitter" vertical flip position="right" />
          </div>

          <div className="matrix-cell">
            <Matrix />
          </div>

          <div className="axis-slot axis-right">
            <AxisLabel id="sweet" vertical position="left" />
          </div>

          {/* Bottom axis label — Earthy */}
          <div className="axis-slot axis-bottom">
            <AxisLabel id="earthy" position="top" />
          </div>
        </div>
      </section>

      {/* Colour-richness legend */}
      <p className="colour-legend">
        <span className="colour-legend-label">Ring colour</span>
        <span className="colour-legend-bar" aria-hidden="true" />
        <span className="colour-legend-ends">
          <span>🩶 Muted</span>
          <span>💚 Vivid</span>
        </span>
      </p>

      {/* Logo floating sticker */}
      <LogoSticker />

      {/* Footer */}
      <footer className="site-footer">
        <p>Ratings update in real time &middot; Made with matcha &amp; love by Vy (President) &middot; RMIT Matcha Club</p>
      </footer>
    </main>
  )
}
