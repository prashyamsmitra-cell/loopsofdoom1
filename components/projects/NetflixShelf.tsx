'use client'

import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Project } from '@/types'
import { ProjectCard } from './ProjectCard'

interface NetflixShelfProps {
  title: string
  projects: Project[]
  onCardClick: (project: Project) => void
  linkHref?: string
}

export function NetflixShelf({ title, projects, onCardClick, linkHref }: NetflixShelfProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -320, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 320, behavior: 'smooth' })
    }
  }

  if (projects.length === 0) return null

  return (
    <div 
      className="w-full relative py-8 group/shelf"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-end justify-between px-6 md:px-12 mb-4">
        <h2 className="font-display font-bold text-2xl text-white tracking-tight">{title}</h2>
        {linkHref && (
          <a
            href={linkHref}
            data-cursor="pointer"
            className="font-body text-sm font-medium text-brand-red hover:text-white transition-colors duration-200"
          >
            Explore All →
          </a>
        )}
      </div>

      {/* Scrollable Container Area */}
      <div className="relative w-full">
        {/* Left Mask / Fade - purely visual */}
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#111111] to-transparent z-10 pointer-events-none" />

        <div
          ref={containerRef}
          className="flex flex-row gap-4 overflow-x-auto scroll-smooth pb-4 px-6 md:px-12 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide native
        >
          {projects.map((project, idx) => (
            <div key={project.id} className="snap-start snap-always">
              <ProjectCard 
                project={project} 
                onClick={onCardClick} 
                index={idx} 
                priority={idx < 4} // eagerly load early images
              />
            </div>
          ))}
        </div>

        {/* Right Mask / Fade */}
        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#111111] to-transparent z-10 pointer-events-none" />

        {/* Navigation Arrows */}
        <button
          onClick={scrollLeft}
          data-cursor="pointer"
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 h-full w-12 bg-black/50 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 hover:bg-black/80 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <ChevronLeft className="text-white w-8 h-8" />
        </button>
        
        <button
          onClick={scrollRight}
          data-cursor="pointer"
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 h-full w-12 bg-black/50 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 hover:bg-black/80 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <ChevronRight className="text-white w-8 h-8" />
        </button>
      </div>
    </div>
  )
}
