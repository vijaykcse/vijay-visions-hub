import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="bg-white/80 backdrop-blur-xl px-6 py-4 flex justify-between items-center border-b border-black/10 shadow-[0_1px_30px_rgba(0,0,0,0.06)] z-10 shrink-0">

      {/* --- THE TRIPLE-CLICK TRAPDOOR --- */}
      {/* 1 click = Home. 3 fast clicks = Admin Login */}
      <Link 
        to="/" 
        onClick={(e) => {
          // e.detail counts how many rapid clicks just happened
          if (e.detail === 3) {
            e.preventDefault();
            navigate('/admin/login');
          }
        }}
        className="text-2xl font-black text-black tracking-tighter hover:text-black/50 transition-colors select-none"
      >
        Vijay <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-gray-600 to-gray-400">Visions</span>
      </Link>

      <div className="flex items-center gap-4 sm:gap-6">
        <Link to="/" className="text-black/50 hover:text-black font-medium transition-all hover:scale-105 hidden sm:block">
          Products
        </Link>
        
        {/* The Admin button is completely gone! */}
      </div>

    </nav>
  )
}