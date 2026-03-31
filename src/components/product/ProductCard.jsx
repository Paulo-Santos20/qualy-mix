// src/components/product/ProductCard.jsx
import { useState } from 'react'
import Badge from '@/components/ui/Badge'
import StarRating from '@/components/ui/StarRating'
import { useCart } from '@/context/CartContext'
import { brl, discountPct } from '@/lib/utils'
import InstagramIcon from '@/components/icons/InstagramIcon'

export default function ProductCard({ product, onInstagram }) {
  const { addToCart } = useCart()
  const [hover, setHover]     = useState(false)
  const [added, setAdded]     = useState(false)
  const pct = discountPct(product.price, product.oldPrice)

  const handleAdd = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <article
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 h-40 sm:h-48 flex-shrink-0">
        <img
          src={product.img}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80' }}
        />

        {/* Top badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.tag && <Badge tag={product.tag} />}
        </div>
        {pct > 0 && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
            -{pct}%
          </div>
        )}

        {/* Instagram hover button */}
        <div
          className={`absolute bottom-2 right-2 transition-all duration-200 ${
            hover ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <button
            onClick={() => onInstagram?.(product)}
            title="Gerar post Instagram"
            className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
          >
            <InstagramIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1 gap-1.5">
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
          {product.category}
        </p>
        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug flex-1">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5">
          <StarRating rating={product.rating} />
          <span className="text-[10px] text-gray-400">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-red-600 font-black text-lg leading-none">
            {brl(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-gray-400 line-through text-xs">
              {brl(product.oldPrice)}
            </span>
          )}
        </div>

        <button
          onClick={handleAdd}
          className={`mt-1 w-full py-2.5 rounded-xl text-xs font-black transition-all duration-200 active:scale-95 ${
            added
              ? 'bg-green-500 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {added ? '✓ Adicionado!' : '+ Carrinho'}
        </button>
      </div>
    </article>
  )
}
