// src/components/auth/UserDropdown.jsx
import { useState, useRef, useEffect } from 'react'
import { useAuth, ROLE_LABELS, ROLE_COLORS } from '@/context/AuthContext'
import RoleBadge from './RoleBadge'

function Avatar({ user, size = 'md' }) {
  const sz = size === 'md' ? 'w-9 h-9 text-sm' : 'w-7 h-7 text-xs'
  if (user?.photoURL) {
    return (
      <img
        src={user.photoURL}
        alt={user.displayName || 'Usuário'}
        className={`${sz} rounded-full object-cover ring-2 ring-white`}
        referrerPolicy="no-referrer"
      />
    )
  }
  const initials = (user?.displayName || user?.email || 'U')
    .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-white font-black ring-2 ring-white`}>
      {initials}
    </div>
  )
}

export default function UserDropdown({ onOpenLogin, onOpenAdmin }) {
  const { user, userRole, isOperator, isAdmin, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Not logged in — show login button
  if (!user) {
    return (
      <button
        onClick={onOpenLogin}
        className="flex items-center gap-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 font-bold text-xs rounded-xl px-3 py-2 transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
        <span className="hidden sm:block">Entrar</span>
      </button>
    )
  }

  return (
    <div className="relative" ref={ref}>
      {/* Avatar trigger */}
      <button
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-2 rounded-xl hover:bg-gray-100 px-2 py-1 transition-all"
        aria-label="Menu do usuário"
      >
        <Avatar user={user} />
        <div className="hidden sm:block text-left">
          <p className="text-xs font-black text-gray-800 leading-none max-w-[100px] truncate">
            {user.displayName?.split(' ')[0] || 'Usuário'}
          </p>
          <RoleBadge role={userRole} size="sm" />
        </div>
        <svg className={`w-3 h-3 text-gray-400 transition-transform hidden sm:block ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {/* User info */}
          <div className="px-4 py-3 bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Avatar user={user} size="lg" />
              <div className="min-w-0">
                <p className="text-sm font-black text-gray-900 truncate">
                  {user.displayName || 'Usuário'}
                </p>
                <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                <RoleBadge role={userRole} size="sm" />
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            {/* Customer links */}
            <MenuItem icon="📦" label="Meus pedidos" onClick={() => setOpen(false)} />
            <MenuItem icon="⭐" label="Lista de desejos" onClick={() => setOpen(false)} />
            <MenuItem icon="👤" label="Minha conta"   onClick={() => setOpen(false)} />

            {/* Operator / Admin links */}
            {isOperator && (
              <>
                <div className="mx-3 my-1 border-t border-gray-100" />
                <div className="px-4 py-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Gestão</p>
                </div>
                <MenuItem
                  icon="⚙️"
                  label="Painel CMS"
                  badge={isAdmin ? 'Admin' : 'Operador'}
                  badgeColor={isAdmin ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}
                  onClick={() => { onOpenAdmin(); setOpen(false) }}
                />
              </>
            )}

            {/* Logout */}
            <div className="mx-3 my-1 border-t border-gray-100" />
            <MenuItem
              icon="🚪"
              label="Sair da conta"
              color="text-red-600"
              onClick={() => { logout(); setOpen(false) }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function MenuItem({ icon, label, badge, badgeColor, color = 'text-gray-700', onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left ${color}`}
    >
      <span className="text-base flex-shrink-0">{icon}</span>
      <span className="text-sm font-bold flex-1">{label}</span>
      {badge && (
        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${badgeColor}`}>
          {badge}
        </span>
      )}
    </button>
  )
}
