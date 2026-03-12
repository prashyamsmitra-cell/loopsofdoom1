'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function Navbar({ ownerId, isOwner }: { ownerId?: string, isOwner?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const links = [
    { name: 'Projects', href: '/projects' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]
  
  if (isOwner) {
    links.push({ name: 'Dashboard', href: '/dashboard' })
  }

  return (
    <nav
      className={`fixed top-0 w-full h-16 z-50 transition-all duration-300 ease-in-out ${
        isScrolled || mobileMenuOpen
          ? 'bg-brand-dark/90 backdrop-blur-md border-b border-brand-mid'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Logo */}
        <Link 
          href="/" 
          className="font-display font-bold text-[28px] text-brand-red select-none"
          data-cursor="pointer"
        >
          N
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              data-cursor="pointer"
              className="relative font-body text-sm font-medium text-brand-lgray hover:text-white transition-colors duration-200 group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-brand-red origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-brand-lgray hover:text-white p-2 -mr-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-cursor="pointer"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden w-full bg-brand-dark/95 backdrop-blur-md border-b border-brand-mid overflow-hidden"
          >
            <div className="flex flex-col py-4 px-6 gap-6">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="font-display text-lg font-medium text-brand-lgray hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
