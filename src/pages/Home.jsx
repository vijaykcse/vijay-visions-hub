import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [products, setProducts] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // NEW: State to track which category is currently selected in the filter bar
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    async function fetchData() {
      const [profileRes, productsRes] = await Promise.all([
        supabase.from('profile').select('*').eq('id', 1).single(),
        supabase.from('products').select('*').order('createdAt', { ascending: false })
      ])
      if (profileRes.data) setProfile(profileRes.data)
      if (productsRes.data) setProducts(productsRes.data)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="h-screen flex items-center justify-center text-black/30 font-bold animate-pulse tracking-widest uppercase text-sm">
      Loading Vijay Visions...
    </div>
  )

  // Create our category list and add "All" to the very beginning
  const categories = ['All', ...new Set(products.map(p => p.category))]

  // Filter products based on what button the user clicked
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory)

  return (
    <div className="flex-1 overflow-y-auto bg-transparent relative w-full">

      {/* Global Background Effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl z-10" />
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-black/[0.04] rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] bg-black/[0.03] rounded-full blur-[80px]" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
        
        {/* --- 1. SINGLE-LINE COMPACT PROFILE --- */}
        {profile && (
          <div className="mb-6 bg-black/[0.02] backdrop-blur-md border border-black/5 p-2 sm:p-3 rounded-2xl sm:rounded-full shadow-sm flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            
            <img 
              src={profile.imageUrl} 
              className="w-12 h-12 sm:w-10 sm:h-10 rounded-full object-cover border border-black/10 shrink-0" 
              alt={profile.name} 
            />
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 flex-1 min-w-0 w-full text-center sm:text-left">
              <div className="flex justify-center sm:justify-start items-center gap-2 shrink-0">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-black truncate">
                  {profile.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-black/5 text-black/50 font-black tracking-widest text-[9px] uppercase">
                  Creator
                </span>
              </div>
              
              {/* The truncate class ensures the bio never wraps to a second line! */}
              <p className="text-xs sm:text-sm text-black/50 font-medium truncate w-full">
                {profile.bio}
              </p>
            </div>
            
          </div>
        )}

        {/* --- 2. CATEGORY FILTER BAR --- */}
        {/* This replaces the stacked category headers. Users click these to filter. */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map(category => (
            <button 
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeCategory === category 
                ? 'bg-black text-white shadow-md scale-105' 
                : 'bg-black/[0.03] text-black/60 hover:bg-black/[0.06] hover:text-black border border-black/5'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* --- 3. UNIFIED PRODUCT GRID --- */}
        {/* By putting ALL products into ONE grid, there are ZERO empty spaces! */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5 pb-16">
          {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
          
          {filteredProducts.length === 0 && (
            <p className="col-span-full text-center text-black/40 font-bold italic mt-10">
              No products found in this category.
            </p>
          )}
        </div>

      </div>
    </div>
  )
}