import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import BackgroundMesh from '../components/BackgroundMesh'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import SkeletonCard from '../components/SkeletonCard'
import Toast from '../components/Toast'

export default function VideoPage() {
  const { slug } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  useEffect(() => {
    async function fetchVideoProducts() {
      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)

        if (data) setProducts(data)
      } catch (err) {
        console.error('Error fetching video products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchVideoProducts()
  }, [slug])

  const triggerToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleCopyLink = (link) => {
    if (navigator.clipboard && link) {
      navigator.clipboard.writeText(link)
      triggerToast('Affiliate link copied!')
    } else {
      triggerToast('Copied affiliate link!')
    }
  }

  return (
    <div className="relative flex-1 min-h-screen bg-[#07080c] text-white w-full overflow-y-auto">
      <BackgroundMesh />

      <main className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              Video Showcase
            </span>
            <Link to="/" className="text-xs text-gray-400 hover:text-white transition-colors underline">
              ← Return Home
            </Link>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
            Featured Gear from: <span className="text-indigo-400">/{slug}</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Explore all products, setups, and gear featured in this video.
          </p>
        </div>

        {loading ? (
          <SkeletonCard count={4} />
        ) : products.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/10 text-gray-400">
            <p className="text-lg font-bold text-white mb-2">No items featured for this video tag yet.</p>
            <Link to="/" className="inline-block mt-4 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/25">
              Explore All Gear
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 pb-20">
            <AnimatePresence>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setSelectedProduct(p)}
                  onCopyLink={handleCopyLink}
                />
              ))}
            </AnimatePresence>
          </div>
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