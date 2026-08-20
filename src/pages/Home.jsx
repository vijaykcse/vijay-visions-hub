import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import BackgroundMesh from '../components/BackgroundMesh'
import HeroProfile from '../components/HeroProfile'
import CategoryPills from '../components/CategoryPills'
import SearchBar from '../components/SearchBar'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import SkeletonCard from '../components/SkeletonCard'
import Toast from '../components/Toast'

export default function Home() {
  const [products, setProducts] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  const [layoutView, setLayoutView] = useState(() => {
    return window.innerWidth < 640 ? 'list' : 'grid'
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, productsRes] = await Promise.all([
          supabase.from('profile').select('*').eq('id', 1).single(),
          supabase.from('products').select('*').order('createdAt', { ascending: false })
        ])

        if (profileRes.data) {
          setProfile({
            ...profileRes.data,
            name: profileRes.data.name && profileRes.data.name !== 'Vijay' && profileRes.data.name !== 'Vijay Kumar' ? profileRes.data.name : 'Vijay K'
          })
        } else {
          setProfile({
            name: 'Vijay K',
            bio: 'Tech Creator & Reviewer • Curating top phones, gadgets, & accessories',
            imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            instagram: 'https://instagram.com',
            youtube: 'https://youtube.com',
            linkedin: 'https://linkedin.com',
            email: 'vijay@example.com'
          })
        }

        if (productsRes.data && productsRes.data.length > 0) {
          setProducts(productsRes.data)
        } else {
          setProducts([
            {
              id: '1',
              title: 'Sony Alpha 7 IV Mirrorless Camera',
              category: 'Creator Gear',
              affiliateLink: 'https://amazon.com',
              image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80'
            },
            {
              id: '2',
              title: 'Shure SM7B Studio Vocal Microphone',
              category: 'Creator Gear',
              affiliateLink: 'https://amazon.com',
              image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80'
            },
            {
              id: '3',
              title: 'Keychron Q1 Mechanical Keyboard',
              category: 'Tools',
              affiliateLink: 'https://amazon.com',
              image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80'
            },
            {
              id: '4',
              title: 'Apple MacBook Pro 16-inch M3 Max',
              category: 'Headphones',
              affiliateLink: 'https://amazon.com',
              image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'
            },
            {
              id: '5',
              title: 'Anker Magnetic Wireless Power Bank',
              category: 'Mobiles',
              affiliateLink: 'https://amazon.com',
              image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=600&q=80'
            }
          ])
        }
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const triggerToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleCopyLink = (link) => {
    if (navigator.clipboard && link) {
      navigator.clipboard.writeText(link)
      triggerToast('Affiliate link copied to clipboard!')
    } else {
      triggerToast('Copied affiliate link!')
    }
  }

  const rawCategories = products.map((p) => p.category).filter(Boolean)
  const categories = ['All', ...Array.from(new Set(rawCategories))]

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="relative flex-1 min-h-screen bg-gradient-to-b from-[#fffbeb] via-[#e0f2fe] to-[#bae6fd] text-slate-900 w-full overflow-y-auto">
      <BackgroundMesh />

      <main className="relative z-10 max-w-4xl mx-auto w-full px-3.5 sm:px-6 py-6 sm:py-8">
        {loading ? (
          <div className="h-32 mb-6 rounded-3xl bg-white/70 animate-pulse border border-slate-200" />
        ) : (
          <HeroProfile profile={profile} />
        )}

        {/* Controls: Search, Categories, and Layout Toggle */}
        <div className="mb-5 max-w-xl mx-auto">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            totalResults={filteredProducts.length}
          />

          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CategoryPills
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
            </div>

            {/* Layout Toggle Button */}
            <div className="flex items-center p-1 rounded-2xl bg-white/80 border border-slate-200 shadow-xs shrink-0 mb-6">
              <button
                onClick={() => setLayoutView('list')}
                title="Minimal Linkup List View"
                className={`p-2 rounded-xl text-xs font-bold transition-all ${
                  layoutView === 'list'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="8" y1="6" x2="21" y2="6"/>
                  <line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/>
                  <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </button>

              <button
                onClick={() => setLayoutView('grid')}
                title="Grid View"
                className={`p-2 rounded-xl text-xs font-bold transition-all ${
                  layoutView === 'grid'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Product Showcase */}
        {loading ? (
          <SkeletonCard count={6} />
        ) : (
          <motion.div
            layout
            className={
              layoutView === 'list'
                ? 'max-w-xl mx-auto space-y-1 pb-24'
                : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 pb-24'
            }
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  layout={layoutView}
                  onQuickView={(p) => setSelectedProduct(p)}
                  onCopyLink={handleCopyLink}
                />
              ))}
            </AnimatePresence>

            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full py-12 px-4 text-center rounded-3xl bg-white/80 border border-slate-200 backdrop-blur-xl shadow-xs"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-200">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1 font-heading">No gear found</h3>
                <p className="text-slate-500 text-xs max-w-xs mx-auto">
                  Try adjusting search terms or resetting filters.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('All')
                    setSearchQuery('')
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-xs"
                >
                  Reset Filters
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </main>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onCopyLink={handleCopyLink}
        />
      )}

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  )
}