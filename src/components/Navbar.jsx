import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-xl px-6 py-4 flex justify-between items-center border-b border-black/10 shadow-[0_1px_30px_rgba(0,0,0,0.06)] z-10 shrink-0">

      <Link to="/" className="text-2xl font-black text-black tracking-tighter hover:text-black/50 transition-colors">
        Vijay <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-gray-600 to-gray-400">Visions</span>
      </Link>

      <div className="flex items-center gap-4 sm:gap-6">
        <Link to="/" className="text-black/50 hover:text-black font-medium transition-all hover:scale-105 hidden sm:block">
          Products
        </Link>
        
        {/* --- NEW: SUBTLE ADMIN LOGIN BUTTON --- */}
        <Link 
          to="/admin/login" 
          className="text-[10px] sm:text-xs font-bold text-black/30 hover:text-black/80 transition-colors uppercase tracking-widest border border-black/10 px-3 py-1.5 rounded-lg hover:bg-black/5"
        >
          Admin
        </Link>
      </div>

    </nav>
  )
}