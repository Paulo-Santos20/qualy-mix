// src/pages/Shop.jsx
import { useState, useMemo } from 'react'
import { useCMS } from '@/context/CMSContext'
import ProductGrid from '@/components/product/ProductGrid'
import SectionHeader from '@/components/ui/SectionHeader'

const SORT_OPTIONS = [
  { value: 'relevance',   label: 'Relevância' },
  { value: 'price_asc',  label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'rating',     label: 'Melhor avaliação' },
  { value: 'reviews',    label: 'Mais avaliados' },
]

const TAG_OPTIONS = ['Todos', 'OFERTA', 'ORGÂNICO', 'DESTAQUE', 'NOVO']

export default function Shop({ activeCategory, onSelectCategory, searchQuery, onInstagram }) {
  const { cms, activeCategories } = useCMS()
  const [sort, setSort] = useState('relevance')
  const [tagFilter, setTagFilter] = useState('Todos')

  const filtered = useMemo(() => {
    let list = [...cms.products]

    if (activeCategory && activeCategory !== 'Todos') {
      list = list.filter(p => p.category === activeCategory)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      )
    }
    if (tagFilter !== 'Todos') {
      list = list.filter(p => p.tag === tagFilter)
    }

    switch (sort) {
      case 'price_asc':  return list.sort((a, b) => a.price - b.price)
      case 'price_desc': return list.sort((a, b) => b.price - a.price)
      case 'rating':     return list.sort((a, b) => b.rating - a.rating)
      case 'reviews':    return list.sort((a, b) => b.reviews - a.reviews)
      default:           return list
    }
  }, [cms.products, activeCategory, searchQuery, sort, tagFilter])

  const title = searchQuery
    ? `Resultados para "${searchQuery}"`
    : activeCategory && activeCategory !== 'Todos'
    ? activeCategory
    : 'Todos os Produtos'

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1">
        <button onClick={() => onSelectCategory('Todos')} className="hover:text-red-600 transition-colors">Início</button>
        <span>/</span>
        <span className="text-gray-700 font-bold">{activeCategory || 'Loja'}</span>
      </nav>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        <button
          onClick={() => onSelectCategory('Todos')}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-black transition-colors ${
            !activeCategory || activeCategory === 'Todos'
              ? 'bg-red-600 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-red-300'
          }`}
        >
          Todos
        </button>
        {activeCategories.map(c => (
          <button
            key={c.id}
            onClick={() => onSelectCategory(c.name)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-black transition-colors ${
              activeCategory === c.name
                ? 'bg-red-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-red-300'
            }`}
          >
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="flex gap-1 flex-wrap">
          {TAG_OPTIONS.map(t => (
            <button
              key={t}
              onClick={() => setTagFilter(t)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                tagFilter === t
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-orange-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="ml-auto">
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="text-xs font-bold border border-gray-200 rounded-xl px-3 py-2 focus:border-red-400 outline-none bg-white"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <SectionHeader
        title={title}
        subtitle={`${filtered.length} produto${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`}
      />

      <ProductGrid products={filtered} onInstagram={onInstagram} />
    </div>
  )
}
