'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'

// Dynamically import Three.js scene to avoid SSR errors
const ThreeScene = dynamic(() => import('./ThreeScene').then(mod => mod.ThreeScene), { ssr: false })

export function HeroSection() {
  const { scrollY } = useScroll()
  const [scrollProgress, setScrollProgress] = useState(0)
  
  useEffect(() => {
    // Calculate scroll progress (0 to 1) relative to viewport height
    const handleScroll = () => {
       const height = window.innerHeight
       setScrollProgress(Math.min(1, Math.max(0, window.scrollY / height)))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleScrollClick = () => {
    const el = document.getElementById('projects')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const headingWords = "Building things that feel like magic.".split(" ")

  return (
    <section className="relative w-full h-[100svh] flex items-center justify-center overflow-hidden">
      
      {/* Layer 1: ThreeJS Background */}
      <ThreeScene scrollProgress={scrollProgress} />

      {/* Layer 2: Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-dark/30 to-brand-dark pointer-events-none z-10" />

      {/* Layer 3: Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-4xl w-full">
        
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-body text-[13px] tracking-[0.2em] font-medium text-brand-red uppercase mb-6"
        >
          AI Engineer & Full Stack Developer
        </motion.p>

        {/* Main Heading Reveal */}
        <h1 className="font-display font-bold text-4xl md:text-7xl text-white tracking-tight mb-6 leading-[1.1]">
          {headingWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.3 + i * 0.15, // Staggered reveal starting at 300ms
                type: 'spring',
                bounce: 0.2
              }}
              className="inline-block mr-3 lg:mr-4 last:mr-0"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
          className="font-body text-lg md:text-xl text-brand-lgray mb-12 max-w-2xl mx-auto"
        >
          Still figuring out the tricks. Building anyway.
        </motion.p>

        {/* CTA Button */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
        >
          <button
            onClick={handleScrollClick}
            data-cursor="pointer"
            className="group relative px-8 py-3 border border-brand-red text-brand-red hover:bg-brand-red hover:text-white transition-all duration-300 rounded font-body font-medium overflow-hidden"
          >
            <span className="relative z-10">View My Work</span>
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator Bottom */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20 pointer-events-none"
      >
        <span className="font-body text-[10px] tracking-[0.3em] uppercase text-[#555555]">scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#555555] to-transparent animate-pulse opacity-50" />
      </motion.div>

    </section>
  )
}
