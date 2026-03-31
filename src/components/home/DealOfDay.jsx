// src/components/home/DealOfDay.jsx
import CountdownTimer from '@/components/ui/CountdownTimer'
import StarRating from '@/components/ui/StarRating'
import InstagramIcon from '@/components/icons/InstagramIcon'
import { useCart } from '@/context/CartContext'
import { brl, discountPct } from '@/lib/utils'

export default function DealOfDay({ product, endsAt, onInstagram }) {
  const { addToCart } = useCart()
  if (!product) return null

  const pct = discountPct(product.price, product.oldPrice)

  return (
    <section className="mb-8">
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <div>
              <h2 className="text-white font-black text-lg leading-none">Oferta do Dia</h2>
              <p className="text-orange-100 text-[10px]">Termina em:</p>
            </div>
          </div>
          <CountdownTimer endsAt={endsAt} />
        </div>

        {/* Body */}
        <div className="p-5 sm:p-8 flex flex-col sm:flex-row gap-6 items-center">
          {/* Product image */}
          <div className="relative w-full sm:w-64 h-52 sm:h-56 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-50">
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            {pct > 0 && (
              <div className="absolute top-3 left-3 bg-red-600 text-white font-black text-sm px-3 py-1 rounded-full shadow">
                -{pct}%
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs text-orange-500 font-black uppercase tracking-wide mb-1">
              {product.category}
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 leading-tight">
              {product.name}
            </h3>

            {product.description && (
              <p className="text-gray-500 text-sm mb-3">{product.description}</p>
            )}

            <div className="flex items-center gap-2 justify-center sm:justify-start mb-4">
              <StarRating rating={product.rating} showValue size="md" />
              <span className="text-xs text-gray-400">({product.reviews} avaliações)</span>
            </div>

            <div className="flex items-baseline gap-3 justify-center sm:justify-start mb-6">
              <span className="text-4xl font-black text-red-600">{brl(product.price)}</span>
              {product.oldPrice && (
                <span className="text-gray-400 line-through text-lg">{brl(product.oldPrice)}</span>
              )}
            </div>

            {/* Stock bar */}
            <div className="mb-5 max-w-xs mx-auto sm:mx-0">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Disponível</span>
                <span className="font-bold text-red-600">{product.stock} unidades</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-red-600 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (product.stock / 100) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black py-3.5 rounded-xl transition-all shadow-lg shadow-red-100"
              >
                + Adicionar ao Carrinho
              </button>
              <button
                onClick={() => onInstagram?.(product)}
                className="sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-br from-orange-500 to-red-600 text-white font-bold px-5 py-3.5 rounded-xl hover:opacity-90 active:scale-95 transition-all"
              >
                <InstagramIcon className="w-4 h-4" />
                <span className="text-sm">Post Instagram</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
