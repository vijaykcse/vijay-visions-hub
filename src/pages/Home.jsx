import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [products, setProducts] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  
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

  const categories = ['All', ...new Set(products.map(p => p.category))]

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
        
        {/* --- 1. SINGLE-LINE COMPACT PROFILE WITH SOCIALS --- */}
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
              
              <p className="text-xs sm:text-sm text-black/50 font-medium truncate w-full">
                {profile.bio}
              </p>
            </div>

            {/* --- NEW: SOCIAL MEDIA LINKS --- */}
            <div className="flex items-center gap-4 sm:ml-auto shrink-0 px-4 py-2 sm:py-0 border-t sm:border-t-0 border-black/5 w-full sm:w-auto justify-center sm:justify-end">
              
              {/* Instagram */}
              <a href="https://www.instagram.com/vijay_visions?igsh=MTQ3YzRwZHRpc3EzYQ==" target="_blank" rel="noopener noreferrer" className="text-black/40 hover:text-pink-600 transition-colors hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>

              {/* YouTube */}
              <a href="https://www.youtube.com/@vijayvisions-7" target="_blank" rel="noopener noreferrer" className="text-black/40 hover:text-red-600 transition-colors hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>

              {/* LinkedIn */}
              <a href="https://www.linkedin.com/in/vijay-kumar-08vh/" target="_blank" rel="noopener noreferrer" className="text-black/40 hover:text-blue-600 transition-colors hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>

              {/* Facebook */}
              <a href="https://www.facebook.com/share/18PGeaksaS/" target="_blank" rel="noopener noreferrer" className="text-black/40 hover:text-blue-500 transition-colors hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>

              {/* Email */}
              <a href="mailto:vijay.k.2022.cse@ritchennai.edu.in" className="text-black/40 hover:text-black transition-colors hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </a>
              
            </div>
            
          </div>
        )}

        {/* --- 2. CATEGORY FILTER BAR --- */}
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