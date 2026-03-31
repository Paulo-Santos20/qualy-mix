// src/context/CMSContext.jsx
import { createContext, useContext, useState, useCallback } from 'react'
import { initialCMS } from '@/data/initialCMS'

const CMSContext = createContext(null)

export function CMSProvider({ children }) {
  const [cms, setCMS] = useState(initialCMS)

  // Settings
  const updateSettings = useCallback(patch =>
    setCMS(prev => ({ ...prev, settings: { ...prev.settings, ...patch } })), [])

  // Products CRUD
  const addProduct = useCallback(product =>
    setCMS(prev => ({
      ...prev,
      products: [...prev.products, { ...product, id: Date.now() }],
    })), [])

  const updateProduct = useCallback((id, patch) =>
    setCMS(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === id ? { ...p, ...patch } : p),
    })), [])

  const deleteProduct = useCallback(id =>
    setCMS(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id),
    })), [])

  // Banners
  const toggleBanner = useCallback(id =>
    setCMS(prev => ({
      ...prev,
      banners: prev.banners.map(b => b.id === id ? { ...b, active: !b.active } : b),
    })), [])

  const updateBanner = useCallback((id, patch) =>
    setCMS(prev => ({
      ...prev,
      banners: prev.banners.map(b => b.id === id ? { ...b, ...patch } : b),
    })), [])

  // Categories
  const toggleCategory = useCallback(id =>
    setCMS(prev => ({
      ...prev,
      categories: prev.categories.map(c => c.id === id ? { ...c, active: !c.active } : c),
    })), [])

  // Deal of Day
  const setDealOfDay = useCallback((productId, hours = 48) =>
    setCMS(prev => ({
      ...prev,
      dealOfDay: { productId, endsAt: Date.now() + hours * 3600000 },
    })), [])

  // Derived data
  const activeCategories = cms.categories.filter(c => c.active)
  const activeBanners    = cms.banners.filter(b => b.active)
  const featuredProducts = cms.products.filter(p => p.featured)
  const newProducts      = cms.products.filter(p => p.newProduct)
  const saleProducts     = cms.products.filter(p => p.oldPrice)
  const bestSellers      = [...cms.products].sort((a, b) => b.reviews - a.reviews).slice(0, 8)
  const dealProduct      = cms.products.find(p => p.id === cms.dealOfDay.productId) || cms.products[0]

  return (
    <CMSContext.Provider value={{
      cms,
      activeCategories,
      activeBanners,
      featuredProducts,
      newProducts,
      saleProducts,
      bestSellers,
      dealProduct,
      updateSettings,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleBanner,
      updateBanner,
      toggleCategory,
      setDealOfDay,
    }}>
      {children}
    </CMSContext.Provider>
  )
}

export const useCMS = () => {
  const ctx = useContext(CMSContext)
  if (!ctx) throw new Error('useCMS deve ser usado dentro de CMSProvider')
  return ctx
}
