import React from 'react'
import { motion } from 'framer-motion'

export default function HeroProfile({ profile }) {
  if (!profile) return null

  // Ensure name defaults to Vijay K if database profile has old name
  const name = profile.name && profile.name !== 'Vijay' && profile.name !== 'Vijay Kumar' ? profile.name : 'Vijay K'

  const socialLinks = [
    {
      id: 'instagram',
      url: profile.instagram,
      label: 'Instagram',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
        </svg>
      )
    },
    {
      id: 'youtube',
      url: profile.youtube,
      label: 'YouTube',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
        </svg>
      )
    },
    {
      id: 'linkedin',
      url: profile.linkedin,
      label: 'LinkedIn',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect x="2" y="9" width="4" height="12"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      )
    },
    {
      id: 'facebook',
      url: profile.facebook,
      label: 'Facebook',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      )
    },
    {
      id: 'email',
      url: profile.email ? `mailto:${profile.email}` : null,
      label: 'Email',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      )
    }
  ].filter(s => Boolean(s.url))

  // Simple, clean, easily readable bio text
  const bioText = profile.bio || 'Tech Creator & Reviewer • Curating top phones, gadgets, & accessories'

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative mb-6 sm:mb-8 text-center flex flex-col items-center justify-center max-w-xl mx-auto px-4"
    >
      {/* Centered Avatar Image */}
      <div className="relative mb-3 group">
        <img
          src={profile.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
          alt={name}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-md border-2 border-white"
        />
        <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center shadow-sm" title="Verified Creator">
          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
      </div>

      {/* Creator Name */}
      <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-heading flex items-center justify-center gap-1.5">
        {name}
      </h1>

      {/* Simplified, Clean, Easily Readable Bio */}
      <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1.5 max-w-md leading-relaxed">
        {bioText}
      </p>

      {/* Circular Social Icons */}
      <div className="flex items-center justify-center gap-2.5 mt-3">
        {socialLinks.map((social) => (
          <motion.a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.15, y: -1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={social.label}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/80 hover:bg-white border border-slate-300/80 text-slate-700 hover:text-slate-900 flex items-center justify-center shadow-xs transition-all"
          >
            {social.icon}
          </motion.a>
        ))}
      </div>
    </motion.div>
  )
}
