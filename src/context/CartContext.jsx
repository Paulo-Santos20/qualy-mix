// src/context/CartContext.jsx
import { createContext, useContext, useReducer, useCallback } from 'react'

const CartContext = createContext(null)

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find(i => i.id === action.product.id)
      if (existing) {
        return state.map(i =>
          i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...state, { ...action.product, qty: 1 }]
    }
    case 'REMOVE':
      return state.filter(i => i.id !== action.id)
    case 'INCREMENT':
      return state.map(i =>
        i.id === action.id ? { ...i, qty: i.qty + 1 } : i
      )
    case 'DECREMENT':
      return state
        .map(i => i.id === action.id ? { ...i, qty: i.qty - 1 } : i)
        .filter(i => i.qty > 0)
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [])

  const addToCart    = useCallback(product => dispatch({ type: 'ADD', product }), [])
  const removeFromCart = useCallback(id  => dispatch({ type: 'REMOVE', id }), [])
  const increment    = useCallback(id   => dispatch({ type: 'INCREMENT', id }), [])
  const decrement    = useCallback(id   => dispatch({ type: 'DECREMENT', id }), [])
  const clearCart    = useCallback(()   => dispatch({ type: 'CLEAR' }), [])

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const count = items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{ items, total, count, addToCart, removeFromCart, increment, decrement, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart deve ser usado dentro de CartProvider')
  return ctx
}
