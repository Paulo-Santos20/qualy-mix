// src/components/layout/Header.jsx
import { useState, useRef, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { useCMS } from '@/context/CMSContext'
import { useAuth } from '@/context/AuthContext'
import { brl } from '@/lib/utils'
import { Link } from 'react-router-dom'

export default function Header({
  onOpenMenu,
  onOpenAdmin,
  onOpenInsta,
  onOpenCart,
  onOpenAuth,
  searchQuery,
  onSearch,
}) {
  const { count, total } = useCart()
  const { cms } = useCMS()
  const { user, userRole, logout } = useAuth()
  
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

 const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Loja', path: '/loja' },
    { name: 'Sobre', path: '/sobre' }, 
    { name: 'Promoções', path: '/promocoes' },
    { name: 'Receitas', path: '/receitas' },
    { name: 'Contato', path: '/contato' }
  ]

  // Fecha o dropdown ao clicar fora dele
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
      {/* Announcement bar */}
      <div className="hidden sm:block bg-red-700 text-white text-xs text-center py-2 px-4">
        🚚 Frete grátis em compras acima de{' '}
        <strong>{brl(cms.settings.freeShippingMin)}</strong> · Entrega em até 2h
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onOpenMenu}
          className="sm:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Abrir menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        {/* Logo */}
        <a href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="bg-red-600 rounded-xl p-2 shadow-sm shadow-red-200">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <div className="hidden sm:block">
            <span className="font-black text-xl text-gray-900 leading-none block">
              {cms.settings.storeName}
            </span>
            <span className="text-[9px] text-gray-400 leading-none">{cms.settings.tagline}</span>
          </div>
          <span className="sm:hidden font-black text-lg text-gray-900">{cms.settings.storeName}</span>
        </a>

        {/* Search */}
        <div className="flex-1 mx-2 sm:mx-4">
          <div className="relative">
            <input
              type="search"
              value={searchQuery}
              onChange={e => onSearch(e.target.value)}
              placeholder="Buscar produtos, marcas..."
              className="w-full bg-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white transition-all"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            {searchQuery && (
              <button
                onClick={() => onSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          
          {/* Autenticação / Conta do Usuário */}
          {!user ? (
            <button 
              onClick={onOpenAuth}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-red-600 bg-gray-100 hover:bg-red-50 rounded-xl px-3 py-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Entrar
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=DC2626&color=fff`} 
                  alt="Perfil" 
                  className="w-8 h-8 rounded-full border-2 border-transparent hover:border-red-600 transition-all object-cover"
                />
              </button>
              
              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg flex flex-col overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Logado como</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{user.email}</p>
                    <span className="text-xs text-red-600 font-semibold capitalize">{userRole}</span>
                  </div>
                  
                  <div className="py-1">
                    {/* Ações baseadas em permissão */}
                    {userRole === 'admin' && (
                      <button 
                        onClick={() => { onOpenAdmin(); setDropdownOpen(false); }} 
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 font-semibold flex items-center gap-2 transition-colors"
                      >
                        ⚙️ Painel CMS
                      </button>
                    )}
                    
                    {(userRole === 'admin' || userRole === 'operator') && (
                      <button 
                        onClick={() => { onOpenInsta(); setDropdownOpen(false); }} 
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 font-semibold flex items-center gap-2 transition-colors"
                      >
                        📸 Post Instagram
                      </button>
                    )}

                    <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 font-semibold flex items-center gap-2 transition-colors">
                      📦 Meus Pedidos
                    </button>
                  </div>

                  <div className="border-t border-gray-100 py-1">
                    <button 
                      onClick={() => { logout(); setDropdownOpen(false); }} 
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold flex items-center gap-2 transition-colors"
                    >
                      🚪 Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart */}
          <button
            onClick={onOpenCart}
            className="relative bg-red-600 hover:bg-red-700 text-white rounded-xl px-3 py-2.5 flex items-center gap-2 transition-colors active:scale-95 ml-2"
            aria-label="Abrir carrinho"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <span className="hidden sm:block text-sm font-black">{brl(total)}</span>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop nav */}
      <nav className="hidden sm:block border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <button className="flex items-center gap-1.5 bg-red-600 text-white font-black text-xs px-4 py-2.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              Todas Categorias
            </button>
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-600 hover:text-red-600 font-bold text-xs px-4 py-2.5 transition-colors hover:border-b-2 hover:border-red-600"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
}