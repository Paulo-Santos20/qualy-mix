// src/App.jsx
import { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import { CartProvider } from "@/context/CartContext";
import { CMSProvider, useCMS } from "@/context/CMSContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileMenu from "@/components/layout/MobileMenu";
import CartDrawer from "@/components/cart/CartDrawer";
import AdminPanel from "@/components/cms/AdminPanel";
import AuthModal from "@/components/auth/AuthModal";
import InstagramGenerator from "@/components/instagram/InstagramGenerator";

import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import About from "@/pages/About";

function InnerApp() {
  const { cms, activeCategories } = useCMS();
  const { isOperator, isLoggedIn } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [instaOpen, setInstaOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (q) => {
    setSearchQuery(q);
    if (q && location.pathname !== "/loja") navigate("/loja");
    if (!q && location.pathname === "/loja") navigate("/");
  };

  const handleSelectCategory = (cat) => {
    setActiveCategory(cat);
    if (location.pathname !== "/loja") navigate("/loja");
  };

  // CMS: must be operator/admin — otherwise prompt login
  const handleOpenAdmin = () => {
    if (isOperator) setAdminOpen(true);
    else setAuthOpen(true);
  };

  // Instagram: must be operator/admin
  const handleOpenInsta = () => {
    if (isOperator) setInstaOpen(true);
    else setAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        onOpenMenu={() => setMobileMenuOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        onOpenInsta={handleOpenInsta}
        onOpenCart={() => setCartOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
        searchQuery={searchQuery}
        onSearch={handleSearch}
      />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                activeCategory={activeCategory}
                onSelectCategory={handleSelectCategory}
              />
            }
          />
          <Route
            path="/loja"
            element={
              <Shop
                activeCategory={activeCategory}
                onSelectCategory={handleSelectCategory}
                searchQuery={searchQuery}
              />
            }
          />
          <Route path="/sobre" element={<About />} />

          <Route path="/perfil" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

      {/* ── Overlays ── */}
      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        categories={activeCategories}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        onOpenAdmin={handleOpenAdmin}
        onOpenLogin={() => setAuthOpen(true)}
        storeName={cms.settings.storeName}
      />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}

      {instaOpen && (
        <InstagramGenerator
          onClose={() => setInstaOpen(false)}
          preSelectedProduct={null}
        />
      )}

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </div>
  );
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
  );
}
