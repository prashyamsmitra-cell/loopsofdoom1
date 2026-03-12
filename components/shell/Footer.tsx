import { Github, Linkedin, Twitter } from 'lucide-react'
import { CommitTicker } from '@/components/ui/CommitTicker'

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="w-full bg-brand-dark flex flex-col items-center pt-16">
      
      {/* Social Links */}
      <div className="flex items-center justify-center gap-8 mb-8">
        <a 
          href="https://github.com/yourusername" 
          target="_blank" 
          rel="noopener noreferrer"
          data-cursor="pointer"
          className="text-brand-dgray hover:text-white transition-colors duration-300"
        >
          <Github size={24} strokeWidth={1.5} />
        </a>
        <a 
          href="https://linkedin.com/in/yourusername" 
          target="_blank" 
          rel="noopener noreferrer"
          data-cursor="pointer"
          className="text-brand-dgray hover:text-white transition-colors duration-300"
        >
          <Linkedin size={24} strokeWidth={1.5} />
        </a>
        <a 
          href="https://twitter.com/yourusername" 
          target="_blank" 
          rel="noopener noreferrer"
          data-cursor="pointer"
          className="text-brand-dgray hover:text-white transition-colors duration-300"
        >
          <Twitter size={24} strokeWidth={1.5} />
        </a>
      </div>

      {/* Copyright */}
      <p className="font-body text-sm text-brand-dgray mb-12">
        © {currentYear} Prashyam Mitra. Built with Next.js + Claude.
      </p>

      {/* Infinite Ticker */}
      <CommitTicker />
    </footer>
  )
}
