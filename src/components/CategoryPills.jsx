import React from 'react'
import { motion } from 'framer-motion'

export default function CategoryPills({ categories, activeCategory, setActiveCategory }) {
  return (
    <div className="relative mb-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex items-center gap-2 min-w-max">
        {categories.map((category) => {
          const isActive = activeCategory === category

          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-colors duration-300 focus:outline-none select-none cursor-pointer ${
                isActive ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 shadow-md shadow-orange-500/25 border border-orange-400/40"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              
              {!isActive && (
                <div className="absolute inset-0 rounded-2xl bg-white/70 border border-slate-200 hover:bg-white transition-all shadow-sm" />
              )}

              <span className="relative z-10 flex items-center gap-2">
                {category}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
