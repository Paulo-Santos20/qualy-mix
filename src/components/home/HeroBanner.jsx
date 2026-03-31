// src/components/home/HeroBanner.jsx
import { useState, useEffect, useCallback } from 'react'

export default function HeroBanner({ banners = [] }) {
  const active = banners.filter(b => b.active)
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent(c => (c + 1) % active.length), [active.length])

  useEffect(() => {
    if (active.length <= 1) return
    const id = setInterval(next, 4500)
    return () => clearInterval(id)
  }, [next, active.length])

  if (!active.length) return null
  const b = active[current]

  return (
    <div
      className="relative rounded-2xl overflow-hidden h-56 sm:h-72 md:h-80 transition-colors duration-700"
      style={{ background: b.bgColor }}
    >
      {/* Background image */}
      <img
        src={b.img}
        alt={b.title}
        className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700"
        style={{ opacity: 0.35 }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-10 max-w-lg">
        <span className="text-[10px] font-black tracking-widest text-orange-600 bg-orange-100 px-3 py-1 rounded-full w-fit mb-3 uppercase">
          {b.badge}
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-2">
          {b.title}
        </h1>
        <p className="text-gray-600 text-sm mb-1">{b.subtitle}</p>
        <p className="text-red-600 font-bold text-sm mb-4">
          a partir de{' '}
          <span className="text-2xl font-black">{b.price}</span>
        </p>
        <button className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black px-7 py-3 rounded-xl w-fit transition-all shadow-lg shadow-red-200 text-sm">
          {b.cta} →
        </button>
      </div>

      {/* Arrows */}
      {active.length > 1 && (
        <>
          <button
            onClick={() => setCurrent(c => (c - 1 + active.length) % active.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition-all"
            aria-label="Banner anterior"
          >
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition-all"
            aria-label="Próximo banner"
          >
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {active.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {active.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Banner ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-6 bg-red-600' : 'w-1.5 bg-gray-400/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
