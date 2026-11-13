import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Plus,
  Tag,
  Flame,
  ShoppingBag,
  Gamepad2,
  Smartphone,
  BookOpen,
  Dumbbell,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import type { Product } from '@/types';
import { CATEGORIES } from '@/categories';
import { SAMPLE_PRODUCTS } from '@/sampleProducts';
import { ProductCard } from '@/components/ProductCard';
import { AddProductModal } from '@/components/AddProductModal';

const ICONS: Record<string, typeof Gamepad2> = {
  Gamepad2,
  Smartphone,
  ShoppingBag,
  BookOpen,
  Dumbbell,
};

const STORAGE_KEY = 'trendify-find-user-products';

function App() {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0].id);
  const [activeSub, setActiveSub] = useState<string>('All');
  const [showDiscountOnly, setShowDiscountOnly] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load user-added products from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const userProducts: Product[] = JSON.parse(stored);
        setProducts([...userProducts, ...SAMPLE_PRODUCTS]);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  function handleAddProduct(product: Product) {
    const updated = [product, ...products];
    setProducts(updated);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const userProducts: Product[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify([product, ...userProducts]));
    } catch {
      // ignore storage errors
    }
  }

  // When category changes, reset sub-category to "All"
  function handleCategoryClick(catId: string) {
    setActiveCategory(catId);
    setActiveSub('All');
  }

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = products;

    // Category filter
    result = result.filter((p) => p.category === activeCategory);

    // Sub-category filter
    if (activeSub !== 'All') {
      result = result.filter((p) => p.subCategory === activeSub);
    }

    // Search filter (applies within current category)
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Discount-only filter
    if (showDiscountOnly) {
      result = result.filter(
        (p) => p.discountedPrice < p.originalPrice
      );
    }

    return result;
  }, [products, activeCategory, activeSub, search, showDiscountOnly]);

  // Discount products across all categories
  const discountProducts = useMemo(
    () => products.filter((p) => p.discountedPrice < p.originalPrice).slice(0, 8),
    [products]
  );

  const activeCatDef = CATEGORIES.find((c) => c.id === activeCategory);
  const activeCatIcon = activeCatDef ? ICONS[activeCatDef.icon] : Tag;

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <button
              onClick={() => {
                setActiveCategory(CATEGORIES[0].id);
                setActiveSub('All');
                setSearch('');
                setShowDiscountOnly(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex shrink-0 items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-burgundy-magenta">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-burgundy-900">
                Trendify<span className="text-magenta-600"> Finds</span>
              </span>
            </button>

            {/* Search - desktop */}
            <div className="hidden md:flex flex-1 max-w-xl items-center relative">
              <Search className="absolute left-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by title or keyword..."
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-magenta-400 focus:bg-white focus:ring-2 focus:ring-magenta-100"
              />
            </div>

            {/* Right actions - desktop */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setShowDiscountOnly((v) => !v)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  showDiscountOnly
                    ? 'gradient-card-cta text-white shadow-glow'
                    : 'border border-gray-200 text-burgundy-800 hover:border-magenta-300 hover:bg-magenta-50'
                }`}
              >
                <Tag className="h-4 w-4" />
                Discount Offers
              </button>
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-1.5 rounded-full gradient-burgundy-magenta px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-glow hover:brightness-110"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden rounded-lg p-2 text-burgundy-800 hover:bg-gray-100"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Search - mobile */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-magenta-400 focus:bg-white"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between gradient-burgundy-magenta px-5 py-4">
              <span className="text-lg font-bold text-white">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              <button
                onClick={() => { setShowDiscountOnly((v) => !v); setMobileMenuOpen(false); }}
                className={`flex w-full items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                  showDiscountOnly ? 'gradient-card-cta text-white' : 'border border-gray-200 text-burgundy-800'
                }`}
              >
                <Tag className="h-4 w-4" /> Discount Offers
              </button>
              <button
                onClick={() => { setModalOpen(true); setMobileMenuOpen(false); }}
                className="flex w-full items-center gap-2 rounded-lg gradient-burgundy-magenta px-4 py-3 text-sm font-semibold text-white"
              >
                <Plus className="h-4 w-4" /> Add Product
              </button>
              <div className="pt-4">
                <p className="px-2 text-xs font-semibold uppercase text-gray-400 mb-2">Jump to Section</p>
                {CATEGORIES.map((c) => {
                  const Icon = ICONS[c.icon];
                  return (
                    <button
                      key={c.id}
                      onClick={() => { handleCategoryClick(c.id); scrollToSection('products'); }}
                      className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-magenta-50"
                    >
                      <Icon className="h-4 w-4 text-burgundy-600" /> {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== HERO BANNER ===== */}
      <section className="relative overflow-hidden gradient-burgundy-magenta">
        {/* Decorative shapes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-white" />
          <div className="absolute top-20 -left-20 h-48 w-48 rounded-full bg-white" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              <Flame className="h-4 w-4" /> Curated Daily Deals
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Top Daily Amazon Deals
              <br />
              <span className="text-white/80">& Curated Finds</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">
              Discover handpicked products across Gaming, Gadgets, Fashion, Books, and Fitness — updated daily with the best deals and discounts.
            </p>

            {/* Quick jump buttons */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {CATEGORIES.map((c) => {
                const Icon = ICONS[c.icon];
                return (
                  <button
                    key={c.id}
                    onClick={() => { handleCategoryClick(c.id); scrollToSection('products'); }}
                    className="flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white hover:text-burgundy-800 hover:shadow-lg"
                  >
                    <Icon className="h-4 w-4" /> {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOT DISCOUNT OFFERS STRIP ===== */}
      {discountProducts.length > 0 && (
        <section className="bg-white border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-magenta-600 to-burgundy-800">
                <Flame className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-burgundy-900">Hot Discount Offers</h2>
              <span className="rounded-full bg-magenta-100 px-2.5 py-0.5 text-xs font-bold text-magenta-700">
                {discountProducts.length} deals
              </span>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {discountProducts.map((p) => {
                const pct = Math.round(((p.originalPrice - p.discountedPrice) / p.originalPrice) * 100);
                return (
                  <a
                    key={p.id}
                    href={p.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex shrink-0 w-64 flex-col rounded-xl border border-gray-100 bg-white p-3 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
                  >
                    <div className="h-32 w-full bg-gray-50 rounded-lg p-2 flex items-center justify-center overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.title}
                        loading="lazy"
                        className="h-full w-full object-contain transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="rounded-full bg-gradient-to-r from-magenta-600 to-burgundy-800 px-2 py-0.5 text-xs font-bold text-white">
                        {pct}% OFF
                      </span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-burgundy-900">${p.discountedPrice.toFixed(2)}</span>
                        <span className="ml-1 text-xs text-gray-400 line-through">${p.originalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    <p className="mt-1.5 text-xs font-medium text-gray-600 line-clamp-2 leading-snug">{p.title}</p>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== CATEGORY NAVIGATION ===== */}
      <nav className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-3">
            {CATEGORIES.map((c) => {
              const Icon = ICONS[c.icon];
              const isActive = activeCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => handleCategoryClick(c.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    isActive
                      ? 'gradient-burgundy-magenta text-white shadow-md'
                      : 'text-gray-600 hover:bg-magenta-50 hover:text-burgundy-800'
                  }`}
                >
                  <Icon className="h-4 w-4" /> {c.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ===== SUB-CATEGORY PILLS ===== */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-wrap gap-2">
          {activeCatDef?.subCategories.map((sub) => {
            const isActive = activeSub === sub;
            return (
              <button
                key={sub}
                onClick={() => setActiveSub(sub)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-burgundy-800 text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-burgundy-300 hover:text-burgundy-800'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== PRODUCTS GRID ===== */}
      <main id="products" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Section heading */}
        <div className="mb-6 flex items-center gap-3">
          {(() => {
            const ActiveIcon = activeCatIcon;
            return (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-burgundy-magenta">
                <ActiveIcon className="h-5 w-5 text-white" />
              </div>
            );
          })()}
          <div>
            <h2 className="text-2xl font-bold text-burgundy-900">{activeCatDef?.label}</h2>
            <p className="text-sm text-gray-500">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              {activeSub !== 'All' && ` in ${activeSub}`}
              {showDiscountOnly && ' on discount'}
            </p>
          </div>
        </div>

        {/* Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Search className="h-7 w-7 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-700">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try a different sub-category or clear your search filters.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setActiveSub('All');
                setShowDiscountOnly(false);
              }}
              className="mt-4 rounded-lg gradient-card-cta px-5 py-2 text-sm font-semibold text-white"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-burgundy-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Quick links */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                  <Flame className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-extrabold">
                  Trendify<span className="text-magenta-300"> Finds</span>
                </span>
              </div>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                Your daily destination for the best Amazon deals and curated products across gaming, gadgets, fashion, books, and fitness.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wide text-white/90 mb-3">Quick Links</h4>
              <ul className="space-y-2">
                {CATEGORIES.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => { handleCategoryClick(c.id); scrollToSection('products'); }}
                      className="flex items-center gap-1 text-sm text-white/70 transition-colors hover:text-magenta-300"
                    >
                      <ChevronRight className="h-3.5 w-3.5" /> {c.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Deals */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wide text-white/90 mb-3">Explore</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => { setShowDiscountOnly(true); scrollToSection('products'); }}
                    className="flex items-center gap-1 text-sm text-white/70 transition-colors hover:text-magenta-300"
                  >
                    <Tag className="h-3.5 w-3.5" /> Hot Discount Offers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setModalOpen(true); }}
                    className="flex items-center gap-1 text-sm text-white/70 transition-colors hover:text-magenta-300"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add New Product
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Affiliate Disclosure */}
          <div className="mt-10 border-t border-white/15 pt-6">
            <h5 className="mb-2 text-sm font-bold uppercase tracking-wide text-white/90">
              Affiliate Disclosure
            </h5>
            <p className="text-xs leading-relaxed text-white/65">
              Affiliate Disclosure: This website participates in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. As an Amazon Associate, we earn from qualifying purchases at no extra cost to you.
            </p>
          </div>

          {/* Bottom bar */}
          <div className="mt-6 border-t border-white/15 pt-4 text-center text-xs text-white/50">
            &copy; {new Date().getFullYear()} Trendify Finds. All rights reserved. Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates.
          </div>
        </div>
      </footer>

      {/* ===== ADD PRODUCT MODAL ===== */}
      <AddProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddProduct}
      />
    </div>
  );
}

export default App;
