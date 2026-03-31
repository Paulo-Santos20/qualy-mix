// src/App.jsx
import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'

import { CartProvider }          from '@/context/CartContext'
import { CMSProvider, useCMS }   from '@/context/CMSContext'

import Header             from '@/components/layout/Header'
import Footer             from '@/components/layout/Footer'
import MobileMenu         from '@/components/layout/MobileMenu'
import CartDrawer         from '@/components/cart/CartDrawer'
import AdminPanel         from '@/components/cms/AdminPanel'
import InstagramGenerator from '@/components/instagram/InstagramGenerator'

import Home from '@/pages/Home'
import Shop from '@/pages/Shop'

function InnerApp() {
  const { cms, activeCategories } = useCMS()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen,       setCartOpen]       = useState(false)
  const [adminOpen,      setAdminOpen]      = useState(false)
  const [instaOpen,      setInstaOpen]      = useState(false)
  const [instaProduct,   setInstaProduct]   = useState(null)

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

  const handleOpenInstagram = (product = null) => {
    setInstaProduct(product)
    setInstaOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        onOpenMenu  ={() => setMobileMenuOpen(true)}
        onOpenAdmin ={() => setAdminOpen(true)}
        onOpenCart  ={() => setCartOpen(true)}
        searchQuery ={searchQuery}
        onSearch    ={handleSearch}
      />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                activeCategory   ={activeCategory}
                onSelectCategory ={handleSelectCategory}
                onInstagram      ={handleOpenInstagram}
                onOpenInstagram  ={() => handleOpenInstagram(null)}
              />
            }
          />
          <Route
            path="/loja"
            element={
              <Shop
                activeCategory   ={activeCategory}
                onSelectCategory ={handleSelectCategory}
                searchQuery      ={searchQuery}
                onInstagram      ={handleOpenInstagram}
              />
            }
          />
          <Route
            path="*"
            element={
              <Home
                activeCategory   ={activeCategory}
                onSelectCategory ={handleSelectCategory}
                onInstagram      ={handleOpenInstagram}
                onOpenInstagram  ={() => handleOpenInstagram(null)}
              />
            }
          />
        </Routes>
      </main>

      <Footer />

      <MobileMenu
        open             ={mobileMenuOpen}
        onClose          ={() => setMobileMenuOpen(false)}
        categories       ={activeCategories}
        activeCategory   ={activeCategory}
        onSelectCategory ={handleSelectCategory}
        onOpenAdmin      ={() => { setAdminOpen(true); setMobileMenuOpen(false) }}
        onOpenInstagram  ={() => { handleOpenInstagram(null); setMobileMenuOpen(false) }}
        storeName        ={cms.settings.storeName}
      />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}

      {instaOpen && (
        <InstagramGenerator
          onClose            ={() => { setInstaOpen(false); setInstaProduct(null) }}
          preSelectedProduct ={instaProduct}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <CMSProvider>
      <CartProvider>
        <InnerApp />
      </CartProvider>
    </CMSProvider>
  )
}
