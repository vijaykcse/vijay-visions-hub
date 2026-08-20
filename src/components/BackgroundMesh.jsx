import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function BackgroundMesh() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-b from-[#fffbeb] via-[#e0f2fe] to-[#bae6fd]">
      {/* Top Warm Sunset/Yellow Orb */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{ translateX: mousePos.x * 0.5, translateY: mousePos.y * 0.5 }}
        className="absolute -top-40 left-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-amber-200/70 via-yellow-100/60 to-orange-200/40 blur-[130px]"
      />

      {/* Bottom Sky Blue Orb */}
      <motion.div
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 30, -30, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        style={{ translateX: mousePos.x * -0.5, translateY: mousePos.y * -0.5 }}
        className="absolute -bottom-40 right-1/4 w-[750px] h-[750px] rounded-full bg-gradient-to-tr from-sky-300/60 via-blue-200/50 to-indigo-200/40 blur-[140px]"
      />

      {/* Subtle Ambient Overlay */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[30px]" />
    </div>
  )
}
