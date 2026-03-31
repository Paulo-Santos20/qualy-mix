// src/lib/utils.js

/** Merge class names (Tailwind-friendly) */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

/** Format BRL currency */
export function brl(value) {
  return new Intl.NumberFormat('pt-BR', {
    style:    'currency',
    currency: 'BRL',
  }).format(value)
}

/** Percentage discount */
export function discountPct(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return 0
  return Math.round((1 - price / oldPrice) * 100)
}
