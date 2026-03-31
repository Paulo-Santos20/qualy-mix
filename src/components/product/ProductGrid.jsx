// src/components/product/ProductGrid.jsx
import ProductCard from './ProductCard'

export default function ProductGrid({ products, onInstagram, cols = 'default' }) {
  const colsClass = {
    default: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
    wide:    'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
    compact: 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6',
  }[cols] ?? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'

  if (!products?.length) {
    return (
      <div className="py-16 text-center text-gray-400">
        <p className="text-4xl mb-3">📦</p>
        <p className="font-bold">Nenhum produto encontrado</p>
      </div>
    )
  }

  return (
    <div className={`grid ${colsClass} gap-3`}>
      {products.map(p => (
        <ProductCard key={p.id} product={p} onInstagram={onInstagram} />
      ))}
    </div>
  )
}
