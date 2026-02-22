import Matrix from '@/components/Matrix'

export default function Home() {
  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--cream)' }}
    >
      {/* Header */}
      <header className="px-6 pt-8 pb-4 text-center">
        <h1
          className="text-4xl md:text-5xl font-bold tracking-tight"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: 'var(--dark-olive)',
          }}
        >
          RMC&apos;s Matcha Matrix
        </h1>
        <p
          className="mt-2 text-sm md:text-base max-w-xl mx-auto leading-relaxed"
          style={{ color: 'var(--soft-brown)' }}
        >
          A live community map of Melbourne&apos;s matcha cafes and their most 'popular' drinks, curated by the RMC team, rated by taste and style by you.
          Click any drink sticker to explore and rate.
        </p>
      </header>

      {/* Matrix area */}
      <section className="flex-1 px-4 md:px-8 pb-8 flex flex-col">
        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full" style={{ minHeight: 480 }}>

          {/* Sweet label (top) */}
          <div className="flex justify-center mb-2">
            <span
              className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{
                backgroundColor: 'rgba(110,166,58,0.15)',
                color: 'var(--matcha-green)',
              }}
            >
              Sweet
            </span>
          </div>

          {/* Row: Traditional | Grid | Creative */}
          <div className="flex items-stretch gap-3 flex-1">
            {/* Traditional label (left) */}
            <div className="flex items-center">
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{
                  color: 'var(--soft-brown)',
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  letterSpacing: '0.15em',
                }}
              >
                Traditional
              </span>
            </div>

            {/* Matrix grid */}
            <div className="flex-1 relative" style={{ minHeight: 400 }}>
              <Matrix />
            </div>

            {/* Creative label (right) */}
            <div className="flex items-center">
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{
                  color: 'var(--soft-brown)',
                  writingMode: 'vertical-rl',
                  letterSpacing: '0.15em',
                }}
              >
                Creative
              </span>
            </div>
          </div>

          {/* Bitter label (bottom) */}
          <div className="flex justify-center mt-2">
            <span
              className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{
                backgroundColor: 'rgba(63,74,60,0.12)',
                color: 'var(--dark-olive)',
              }}
            >
              Bitter
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-xs" style={{ color: 'rgba(156,123,91,0.6)' }}>
          Ratings update in real time · Made with matcha &amp; love
        </p>
      </footer>
    </main>
  )
}
