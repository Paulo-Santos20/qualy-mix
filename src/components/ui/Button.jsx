// src/components/ui/Button.jsx
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const variants = {
  primary:   'bg-red-600 hover:bg-red-700 text-white shadow-sm',
  secondary: 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm',
  outline:   'border-2 border-red-600 text-red-600 hover:bg-red-50',
  ghost:     'text-gray-600 hover:bg-gray-100',
  dark:      'bg-gray-900 hover:bg-gray-800 text-white',
}

const sizes = {
  sm:   'px-3 py-1.5 text-xs rounded-lg',
  md:   'px-5 py-2.5 text-sm rounded-xl',
  lg:   'px-7 py-3 text-base rounded-xl',
  icon: 'p-2 rounded-xl',
}

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', className, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})

export default Button
