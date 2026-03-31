// src/components/cart/CartDrawer.jsx
import { useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { brl } from '@/lib/utils'

export default function CartDrawer({ open, onClose }) {
  const { items, total, count, increment, decrement, removeFromCart } = useCart()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full sm:w-96 bg-white flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <h2 className="font-black text-gray-900 text-lg">Meu Carrinho</h2>
            {count > 0 && (
              <span className="bg-red-100 text-red-600 text-xs font-black px-2 py-0.5 rounded-full">
                {count} {count === 1 ? 'item' : 'itens'}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none hover:bg-gray-100 rounded-lg p-1 transition-colors"
            aria-label="Fechar carrinho"
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400 py-16 px-6">
              <div className="text-6xl">🛒</div>
              <p className="font-bold text-lg">Seu carrinho está vazio</p>
              <p className="text-sm text-center">Adicione produtos para continuar comprando</p>
              <button
                onClick={onClose}
                className="mt-2 bg-red-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-red-700 transition-colors text-sm"
              >
                Ver produtos
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50 px-4">
              {items.map(item => (
                <li key={item.id} className="py-4 flex gap-3">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&q=60' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug">
                      {item.name}
                    </p>
                    <p className="text-xs text-red-600 font-black mt-0.5">{brl(item.price)}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => decrement(item.id)}
                        className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-600 rounded-lg font-black transition-colors text-base leading-none"
                      >
                        −
                      </button>
                      <span className="text-sm font-black text-gray-800 min-w-[1.5rem] text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => increment(item.id)}
                        className="w-7 h-7 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg font-black transition-colors text-base leading-none"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between flex-shrink-0">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                      aria-label="Remover item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                    <p className="text-sm font-black text-gray-900">
                      {brl(item.price * item.qty)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-5 space-y-3 flex-shrink-0 bg-gray-50">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-bold">{brl(total)}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600">
              <span>Frete</span>
              <span className="font-bold">{total >= 199 ? 'Grátis! 🎉' : brl(12.90)}</span>
            </div>
            <hr />
            <div className="flex justify-between">
              <span className="font-black text-gray-900">Total</span>
              <span className="font-black text-2xl text-red-600">
                {brl(total >= 199 ? total : total + 12.90)}
              </span>
            </div>
            <button className="w-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-red-100 text-base">
              Finalizar Pedido →
            </button>
            <button
              onClick={onClose}
              className="w-full text-gray-500 hover:text-gray-700 font-bold py-2 text-sm transition-colors"
            >
              Continuar comprando
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
