// src/pages/Home.jsx
import { useCMS } from '@/context/CMSContext'
import HeroBanner from '@/components/home/HeroBanner'
import CategoryIcons from '@/components/home/CategoryIcons'
import DealOfDay from '@/components/home/DealOfDay'
import PromoBanners from '@/components/home/PromoBanners'
import InstagramCTA from '@/components/home/InstagramCTA'
import ProductGrid from '@/components/product/ProductGrid'
import SectionHeader from '@/components/ui/SectionHeader'
import Sidebar from '@/components/layout/Sidebar'

export default function Home({ activeCategory, onSelectCategory, onInstagram, onOpenInstagram }) {
  const {
    cms,
    activeBanners,
    activeCategories,
    featuredProducts,
    newProducts,
    saleProducts,
    bestSellers,
    dealProduct,
  } = useCMS()

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
      {/* Hero + Sidebar layout */}
      <div className="flex gap-4 mb-6">
        <Sidebar
          categories={activeCategories}
          active={activeCategory}
          onSelect={onSelectCategory}
        />
        <div className="flex-1 min-w-0 space-y-3">
          <HeroBanner banners={activeBanners} />

          {/* Trust bar */}
          <div className="bg-green-600 rounded-xl px-4 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-1">
            {[
              ['🔒', '100% Seguro'],
              ['🚚', 'Entrega Rápida'],
              ['↩️', 'Devolução Fácil'],
              ['⭐', 'Qualidade Garantida'],
            ].map(([icon, text]) => (
              <span key={text} className="text-white text-xs font-bold flex items-center gap-1">
                {icon} {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Category icons */}
      <CategoryIcons
        categories={activeCategories}
        active={activeCategory}
        onSelect={onSelectCategory}
      />

      {/* Deal of the day */}
      <DealOfDay
        product={dealProduct}
        endsAt={cms.dealOfDay.endsAt}
        onInstagram={onInstagram}
      />

      {/* Featured products */}
      <section className="mb-8">
        <SectionHeader
          title="⭐ Produtos em Destaque"
          subtitle="Selecionados com cuidado para você"
        />
        <ProductGrid products={featuredProducts.slice(0, 10)} onInstagram={onInstagram} />
      </section>

      {/* Promo banners */}
      <PromoBanners banners={cms.promoBanners} />

      {/* New products */}
      <section className="mb-8">
        <SectionHeader
          title="🆕 Novidades da Semana"
          subtitle="Chegaram fresquinhos!"
        />
        <ProductGrid products={newProducts} onInstagram={onInstagram} cols="wide" />
      </section>

      {/* Instagram CTA */}
      <InstagramCTA onOpen={onOpenInstagram} />

      {/* Best sellers */}
      <section className="mb-8">
        <SectionHeader
          title="🏆 Mais Vendidos"
          subtitle="Os favoritos dos nossos clientes"
        />
        <ProductGrid products={bestSellers} onInstagram={onInstagram} />
      </section>

      {/* Second promo banner – full width */}
      <div className="mb-8 relative rounded-3xl overflow-hidden h-40 sm:h-52">
        <img
          src="https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=1200&q=80"
          alt="Promoção de bebidas"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/80 to-red-900/40" />
        <div className="relative z-10 h-full flex flex-col justify-center px-8">
          <p className="text-orange-300 font-black text-xs uppercase tracking-widest mb-1">
            BEBIDAS ESPECIAIS
          </p>
          <h2 className="text-white font-black text-2xl sm:text-3xl mb-3">
            Aproveite e salve<br />
            <span className="text-orange-400">até 40% OFF</span>
          </h2>
          <button className="bg-white text-red-600 font-black px-6 py-2.5 rounded-xl w-fit hover:bg-orange-50 transition-colors text-sm">
            Ver ofertas em bebidas →
          </button>
        </div>
      </div>

      {/* Sale products */}
      {saleProducts.length > 0 && (
        <section className="mb-8">
          <SectionHeader
            title="🔖 Em Promoção"
            subtitle="Aproveite enquanto durar!"
          />
          <ProductGrid products={saleProducts} onInstagram={onInstagram} />
        </section>
      )}
    </div>
  )
}
