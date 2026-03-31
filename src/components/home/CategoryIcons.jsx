// src/components/home/CategoryIcons.jsx

export default function CategoryIcons({ categories, active, onSelect }) {
  return (
    <section aria-label="Categorias" className="mb-6 sm:mb-8">
      {/* Mobile: horizontal scroll pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide sm:hidden">
        <button
          onClick={() => onSelect('Todos')}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-black transition-colors ${
            active === 'Todos'
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-600'
          }`}
        >
          Todos
        </button>
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => onSelect(c.name)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-black transition-colors ${
              active === c.name
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            <span>{c.icon}</span>
            {c.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Desktop: icon grid */}
      <div className="hidden sm:grid grid-cols-4 md:grid-cols-8 gap-3">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => onSelect(active === c.name ? 'Todos' : c.name)}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-200 hover:shadow-md group ${
              active === c.name
                ? 'border-red-400 bg-red-50 shadow-sm'
                : 'border-gray-100 bg-white hover:border-red-200'
            }`}
          >
            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
              {c.icon}
            </span>
            <p
              className={`text-[10px] font-bold text-center leading-tight ${
                active === c.name ? 'text-red-600' : 'text-gray-700'
              }`}
            >
              {c.name}
            </p>
            <span className="text-[9px] text-gray-400">{c.count} itens</span>
          </button>
        ))}
      </div>
    </section>
  )
}
