import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogoClick = (e) => {
    // 3 rapid clicks triggers secret admin login
    if (e.detail === 3) {
      e.preventDefault()
      navigate('/admin/login')
    }
  }

  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-40 w-full glass-nav px-4 sm:px-8 py-2.5 flex justify-between items-center"
    >
      {/* Brand Logo with Triple-Click Trapdoor */}
      <Link
        to="/"
        onClick={handleLogoClick}
        title="Triple-click for Admin Access"
        className="group flex items-center gap-3 select-none focus:outline-none"
      >
        <div className="relative w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-sky-400 via-orange-400 to-amber-500 shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
          <img
            src="/logo.png"
            alt="Vijay Visions Official Logo"
            className="w-full h-full rounded-full object-cover bg-slate-950"
          />
        </div>

        <div className="flex flex-col">
          <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight font-heading group-hover:text-orange-600 transition-colors">
            Vijay <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-sky-600">Visions</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 -mt-1 hidden sm:block">
            Official Gear Hub
          </span>
        </div>
      </Link>

      {/* Right Navbar Controls */}
      <div className="flex items-center gap-3">
        {/* Status Live Pulse */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Curated Gear Live</span>
        </div>

        {isAdminPage ? (
          <Link
            to="/"
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200 flex items-center gap-1.5"
          >
            <span>← Back to Store</span>
          </Link>
        ) : (
          <Link
            to="/"
            className="px-4 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 text-xs font-bold transition-all border border-orange-200"
          >
            Home
          </Link>
        )}
      </div>
    </motion.header>
  )
}