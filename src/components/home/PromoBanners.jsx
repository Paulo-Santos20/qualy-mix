// src/components/home/PromoBanners.jsx

export default function PromoBanners({ banners = [] }) {
  const active = banners.filter(b => b.active).slice(0, 2)
  if (!active.length) return null

  const ctaColor = {
    red:    'bg-red-600 hover:bg-red-700',
    orange: 'bg-orange-500 hover:bg-orange-600',
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
      {active.map(b => (
        <div
          key={b.id}
          className="relative rounded-2xl overflow-hidden h-36 sm:h-40"
          style={{ background: b.bgColor }}
        >
          <img
            src={b.img}
            alt={b.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-40 hover:opacity-50 transition-opacity duration-300"
          />
          <div className="relative z-10 p-5 h-full flex flex-col justify-center">
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
              b.ctaColor === 'red' ? 'text-red-600' : 'text-orange-600'
            }`}>
              {b.label}
            </p>
            <h3 className="font-black text-xl text-gray-900 mb-0.5">{b.title}</h3>
            <p className="text-gray-600 text-xs mb-3">{b.subtitle}</p>
            <button
              className={`${ctaColor[b.ctaColor] ?? ctaColor.red} text-white font-black px-4 py-2 rounded-xl text-xs w-fit active:scale-95 transition-all shadow-sm`}
            >
              {b.cta} →
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
