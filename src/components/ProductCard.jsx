import React from 'react'
import { motion } from 'framer-motion'

export default function ProductCard({ product, onQuickView, onCopyLink, layout = 'list' }) {
  const affiliateLink = product.affiliateLink || product.affiliate_link || '#'

  // --- MINIMAL LINKUP LIST PILL VIEW (Default on Mobile) ---
  if (layout === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="group relative w-full mb-2.5"
      >
        <div 
          onClick={() => onQuickView(product)}
          className="w-full p-2.5 sm:p-3 rounded-full bg-white/70 hover:bg-white/95 border border-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(249,115,22,0.12)] backdrop-blur-md flex items-center justify-between gap-3 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
        >
          {/* Left Thumbnail Image */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white p-1 flex items-center justify-center border border-slate-200/80 shrink-0 overflow-hidden shadow-xs">
            <img
              src={product.image}
              alt={product.title}
              className="max-h-full max-w-full object-contain mix-blend-multiply"
              loading="lazy"
            />
          </div>

          {/* Center Info */}
          <div className="flex-1 min-w-0 text-left">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-orange-600 transition-colors">
              {product.title}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider truncate">
                {product.category}
              </span>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onCopyLink(affiliateLink)}
              title="Copy link"
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </button>

            <a
              href={affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 px-3.5 rounded-full bg-slate-900 hover:bg-orange-500 text-white text-xs font-extrabold transition-all shadow-xs flex items-center gap-1 whitespace-nowrap cursor-pointer"
            >
              <span>Get Deal</span>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="7" y1="17" x2="17" y2="7"/>
                <polyline points="7 7 17 7 17 17"/>
              </svg>
            </a>
          </div>
        </div>
      </motion.div>
    )
  }

  // --- COMPACT GRID VIEW (For Desktop / Grid Toggle) ---
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group relative h-full flex flex-col"
    >
      <div className="relative h-full rounded-2xl p-3 sm:p-3.5 bg-white/80 border border-slate-200/80 hover:border-orange-400/50 shadow-xs hover:shadow-md backdrop-blur-xl flex flex-col justify-between overflow-hidden transition-all duration-300 group-hover:-translate-y-0.5">
        
        <div>
          {/* Category Badge & Copy Link */}
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 truncate max-w-[75%]">
              {product.category}
            </span>

            <button
              onClick={() => onCopyLink(affiliateLink)}
              title="Copy Affiliate Link"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all shrink-0"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </button>
          </div>

          {/* Compact Product Image */}
          <div 
            onClick={() => onQuickView(product)}
            className="relative h-32 sm:h-36 mb-2.5 rounded-xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center overflow-hidden cursor-pointer group-hover:scale-[1.01] transition-transform shadow-inner"
          >
            <img
              src={product.image}
              alt={product.title}
              className="max-h-full max-w-full object-contain mix-blend-multiply"
              loading="lazy"
            />
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors cursor-pointer min-h-[2.3rem] mb-2"
          >
            {product.title}
          </h3>
        </div>

        {/* Action Buttons Row */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 w-full mt-auto">
          <button
            onClick={() => onQuickView(product)}
            className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 cursor-pointer shrink-0"
          >
            Details
          </button>
          
          <a
            href={affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 px-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold text-center shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap min-w-0"
          >
            <span>Get Deal</span>
            <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="7" y1="17" x2="17" y2="7"/>
              <polyline points="7 7 17 7 17 17"/>
            </svg>
          </a>
        </div>

      </div>
    </motion.div>
  )
}