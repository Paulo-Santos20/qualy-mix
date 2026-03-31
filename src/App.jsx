// src/App.jsx
import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'

import { AuthProvider, useAuth } from '@/context/AuthContext'
import { CartProvider }          from '@/context/CartContext'
import { CMSProvider, useCMS }   from '@/context/CMSContext'

import Header             from '@/components/layout/Header'
import Footer             from '@/components/layout/Footer'
import MobileMenu         from '@/components/layout/MobileMenu'
import CartDrawer         from '@/components/cart/CartDrawer'
import AdminPanel         from '@/components/cms/AdminPanel'
import InstagramGenerator from '@/components/instagram/InstagramGenerator'
import AuthModal          from '@/components/auth/AuthModal' // Você precisará criar a UI deste Modal

import Home from '@/pages/Home'
import Shop from '@/pages/Shop'

function InnerApp() {
  const { cms, activeCategories } = useCMS()
  const { user, userRole } = useAuth() // Trazemos o usuário e a permissão

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen,       setCartOpen]       = useState(false)
  const [adminOpen,      setAdminOpen]      = useState(false)
  const [instaOpen,      setInstaOpen]      = useState(false)
  const [authModalOpen,  setAuthModalOpen]  = useState(false)

  const [activeCategory, setActiveCategory] = useState('Todos')
  const [searchQuery,    setSearchQuery]    = useState('')

  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = (q) => {
    setSearchQuery(q)
    if (q && location.pathname !== '/loja') navigate('/loja')
    if (!q && location.pathname === '/loja') navigate('/')
  }

  const handleSelectCategory = (cat) => {
    setActiveCategory(cat)
    if (location.pathname !== '/loja') navigate('/loja')
  }

  // Verifica se o usuário tem permissão para ver os painéis
  const hasAdminAccess = userRole === 'admin'
  const hasOperatorAccess = userRole === 'admin' || userRole === 'operator'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        onOpenMenu ={() => setMobileMenuOpen(true)}
        onOpenCart ={() => setCartOpen(true)}
        onOpenAuth ={() => setAuthModalOpen(true)} // Prop para abrir o login se deslogado
        onOpenAdmin={() => setAdminOpen(true)}     // Disparado pelo dropdown do Header
        onOpenInsta={() => setInstaOpen(true)}     // Disparado pelo dropdown do Header
        searchQuery={searchQuery}
        onSearch   ={handleSearch}
      />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home activeCategory={activeCategory} onSelectCategory={handleSelectCategory} />} />
          <Route path="/loja" element={<Shop activeCategory={activeCategory} onSelectCategory={handleSelectCategory} searchQuery={searchQuery} />} />
          <Route path="*" element={<Home activeCategory={activeCategory} onSelectCategory={handleSelectCategory} />} />
        </Routes>
      </main>

      <Footer />

      <MobileMenu
        open             ={mobileMenuOpen}
        onClose          ={() => setMobileMenuOpen(false)}
        categories       ={activeCategories}
        activeCategory   ={activeCategory}
        onSelectCategory ={handleSelectCategory}
        storeName        ={cms.settings.storeName}
        // Lógica de dropdown pode ir aqui também no menu mobile
      />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {authModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} />}

      {/* Renderiza painéis protegidos APENAS se tiver permissão */}
      {adminOpen && hasAdminAccess && <AdminPanel onClose={() => setAdminOpen(false)} />}
      
      {instaOpen && hasOperatorAccess && (
        <InstagramGenerator onClose={() => setInstaOpen(false)} preSelectedProduct={null} />
      )}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CMSProvider>
        <CartProvider>
          <InnerApp />
        </CartProvider>
      </CMSProvider>
    </AuthProvider>
  )
}