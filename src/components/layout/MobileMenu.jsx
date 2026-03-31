// src/components/layout/MobileMenu.jsx
import { useEffect } from 'react'
import InstagramIcon from '@/components/icons/InstagramIcon'

export default function MobileMenu({ open, onClose, categories, activeCategory, onSelectCategory, onOpenAdmin, onOpenInstagram, storeName }) {
  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const handleCategory = (name) => {
    onSelectCategory(name)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 sm:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute left-0 top-0 h-full w-72 bg-white flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 to-red-600 p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 rounded-lg p-1.5">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <span className="text-white font-black text-lg">{storeName}</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl font-bold leading-none">
            ×
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-2">
          <div className="px-3 py-2">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest px-2 mb-2">
              Categorias
            </p>
            <button
              onClick={() => handleCategory('Todos')}
              className={`flex items-center gap-3 w-full p-3 rounded-xl text-left mb-1 transition-colors ${
                activeCategory === 'Todos' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="text-xl">🛍️</span>
              <span className="font-bold text-sm">Todos os produtos</span>
            </button>

            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => handleCategory(c.name)}
                className={`flex items-center gap-3 w-full p-3 rounded-xl text-left mb-1 transition-colors ${
                  activeCategory === c.name ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{c.icon}</span>
                <div>
                  <p className={`font-bold text-sm ${activeCategory === c.name ? 'text-red-600' : 'text-gray-800'}`}>
                    {c.name}
                  </p>
                  <p className="text-[10px] text-gray-400">{c.count} produtos</p>
                </div>
              </button>
            ))}
          </div>

          <hr className="my-2 mx-3" />

          <div className="px-3 py-2">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest px-2 mb-2">
              Ferramentas
            </p>
            <button
              onClick={() => { onOpenAdmin(); onClose() }}
              className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 text-left mb-1"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span className="font-bold text-sm text-gray-700">Painel CMS</span>
            </button>
            <button
              onClick={() => { onOpenInstagram(); onClose() }}
              className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-orange-50 text-left"
            >
              <InstagramIcon className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-sm text-gray-700">Gerar Post Instagram</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4 flex-shrink-0">
          <p className="text-[10px] text-gray-400 text-center">
            © 2024 {storeName} · Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  )
}
