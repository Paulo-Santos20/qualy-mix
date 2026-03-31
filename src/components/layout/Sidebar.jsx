// src/components/layout/Sidebar.jsx

export default function Sidebar({ categories, active, onSelect }) {
  return (
    <aside className="hidden lg:block w-56 flex-shrink-0">
      <nav className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-24">
        <div className="bg-red-600 text-white font-black text-sm px-4 py-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Categorias
        </div>

        <button
          onClick={() => onSelect('Todos')}
          className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-left text-xs font-bold transition-colors border-b border-gray-50 ${
            active === 'Todos'
              ? 'bg-red-50 text-red-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          🛍️
          <span>Todos os produtos</span>
        </button>

        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => onSelect(active === c.name ? 'Todos' : c.name)}
            className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-left border-b border-gray-50 transition-colors ${
              active === c.name
                ? 'bg-red-50 text-red-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-lg flex-shrink-0">{c.icon}</span>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate">{c.name}</p>
              <p className="text-[10px] text-gray-400">{c.count} itens</p>
            </div>
            {active === c.name && (
              <svg className="w-3 h-3 text-red-500 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        ))}
      </nav>
    </aside>
  )
}
