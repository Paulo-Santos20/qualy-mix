// src/components/layout/Header.jsx
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart }  from '@/context/CartContext'
import { useCMS }   from '@/context/CMSContext'
import { useAuth, ROLE_LABELS, ROLE_COLORS } from '@/context/AuthContext'
import { brl }      from '@/lib/utils'

const navLinks = [
  { name: 'Início',    path: '/' },
  { name: 'Loja',      path: '/loja' },
  { name: 'Sobre', path: '/sobre' }, 
  { name: 'Promoções', path: '/promocoes' },
  { name: 'Receitas',  path: '/receitas' },
  { name: 'Blog',      path: '/blog' },
  { name: 'Contato',   path: '/contato' },
]

// ── User avatar: photo or initials ──────────────────────────────────────────
function Avatar({ user, size = 'md' }) {
  const sz = size === 'md' ? 'w-9 h-9 text-sm' : 'w-8 h-8 text-xs'
  if (user?.photoURL) {
    return (
      <img
        src={user.photoURL}
        alt={user.displayName || 'Usuário'}
        referrerPolicy="no-referrer"
        className={`${sz} rounded-full object-cover border-2 border-white shadow-sm`}
      />
    )
  }
  const initials = (user?.displayName || user?.email || 'U')
    .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-white font-black border-2 border-white shadow-sm`}>
      {initials}
    </div>
  )
}

export default function Header({
  onOpenMenu, onOpenAdmin, onOpenInsta, onOpenCart, onOpenAuth,
  searchQuery, onSearch,
}) {
  const { count, total }                       = useCart()
  const { cms }                                = useCMS()
  const { user, userRole, isAdmin, isOperator, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen]        = useState(false)
  const dropdownRef                            = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const fn = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const closeDropdown = () => setDropdownOpen(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
      {/* Announcement */}
      <div className="hidden sm:block bg-red-700 text-white text-xs text-center py-2 px-4">
        🚚 Frete grátis acima de <strong>{brl(cms.settings.freeShippingMin)}</strong> · Entrega em até 2h
      </div>

      {/* Main row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* Mobile hamburger */}
        <button onClick={onOpenMenu} className="sm:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors" aria-label="Menu">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="bg-red-600 rounded-xl p-2 shadow-sm shadow-red-200">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <div className="hidden sm:block">
            <span className="font-black text-xl text-gray-900 leading-none block">{cms.settings.storeName}</span>
            <span className="text-[9px] text-gray-400 leading-none">{cms.settings.tagline}</span>
          </div>
          <span className="sm:hidden font-black text-lg text-gray-900">{cms.settings.storeName}</span>
        </Link>

        {/* Search */}
        <div className="flex-1 mx-2 sm:mx-4">
          <div className="relative">
            <input
              type="search"
              value={searchQuery}
              onChange={e => onSearch(e.target.value)}
              placeholder="Buscar produtos, marcas..."
              className="w-full bg-gray-100 rounded-xl pl-10 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white transition-all"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            {searchQuery && (
              <button onClick={() => onSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">

          {/* ── Not logged in ── */}
          {!user && (
            <button
              onClick={onOpenAuth}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-red-600 bg-gray-100 hover:bg-red-50 rounded-xl px-3 py-2.5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Entrar
            </button>
          )}

          {/* ── Logged in: avatar + dropdown ── */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(p => !p)}
                className="flex items-center gap-2 focus:outline-none rounded-xl hover:bg-gray-100 p-1 transition-colors"
                aria-label="Menu do usuário"
              >
                <Avatar user={user} />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-black text-gray-800 leading-none max-w-[90px] truncate">
                    {user.displayName?.split(' ')[0] || 'Conta'}
                  </p>
                  {userRole && (
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${ROLE_COLORS[userRole] ?? 'bg-gray-100 text-gray-500'}`}>
                      {ROLE_LABELS[userRole] ?? userRole}
                    </span>
                  )}
                </div>
                <svg className={`w-3.5 h-3.5 text-gray-400 hidden sm:block transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  {/* User info header */}
                  <div className="px-4 py-3 bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-100 flex items-center gap-3">
                    <Avatar user={user} size="md" />
                    <div className="min-w-0">
                      <p className="text-sm font-black text-gray-900 truncate">{user.displayName || 'Usuário'}</p>
                      <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                      {userRole && (
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${ROLE_COLORS[userRole] ?? ''}`}>
                          {ROLE_LABELS[userRole] ?? userRole}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    {/* Customer items */}
                    <DropdownItem icon="👤" label="Meu Perfil"   onClick={() => { closeDropdown(); window.location.href='/perfil' }} />
                    <DropdownItem icon="📦" label="Meus Pedidos" onClick={closeDropdown} />
                    <DropdownItem icon="⭐" label="Lista de Desejos" onClick={closeDropdown} />

                    {/* Operator / Admin items */}
                    {isOperator && (
                      <>
                        <div className="mx-3 my-1 border-t border-gray-100" />
                        <div className="px-4 py-1">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Gestão</p>
                        </div>
                        <DropdownItem
                          icon="📸"
                          label="Post Instagram"
                          badge="IA"
                          badgeCls="bg-orange-100 text-orange-700"
                          onClick={() => { onOpenInsta(); closeDropdown() }}
                        />
                      </>
                    )}
                    {isAdmin && (
                      <DropdownItem
                        icon="⚙️"
                        label="Painel CMS"
                        badge="Admin"
                        badgeCls="bg-red-100 text-red-700"
                        onClick={() => { onOpenAdmin(); closeDropdown() }}
                      />
                    )}

                    {/* Logout */}
                    <div className="mx-3 my-1 border-t border-gray-100" />
                    <DropdownItem
                      icon="🚪"
                      label="Sair da conta"
                      textCls="text-red-600"
                      onClick={() => { logout(); closeDropdown() }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart */}
          <button
            onClick={onOpenCart}
            className="relative bg-red-600 hover:bg-red-700 text-white rounded-xl px-3 py-2.5 flex items-center gap-2 transition-colors active:scale-95"
            aria-label="Carrinho"
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
          <div className="flex items-center gap-1">
            <button className="flex items-center gap-1.5 bg-red-600 text-white font-black text-xs px-4 py-2.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              Todas Categorias
            </button>
            {navLinks.map(l => (
              <Link key={l.name} to={l.path} className="text-gray-600 hover:text-red-600 font-bold text-xs px-4 py-2.5 transition-colors">
                {l.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
}

function DropdownItem({ icon, label, badge, badgeCls, textCls = 'text-gray-700', onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
    >
      <span className="text-base flex-shrink-0">{icon}</span>
      <span className={`text-sm font-bold flex-1 ${textCls}`}>{label}</span>
      {badge && (
        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${badgeCls}`}>{badge}</span>
      )}
    </button>
  )
}
