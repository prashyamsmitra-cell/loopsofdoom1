'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  onClick: (project: Project) => void
  priority?: boolean
  index?: number
}

// Fallback image if none provided
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1470&auto=format&fit=crop"

export function ProjectCard({ project, onClick, priority = false, index = 0 }: ProjectCardProps) {
  
  return (
    <motion.div
      layoutId={project.id} // Hooking up Framer Motion Shared Layout
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      onClick={() => onClick(project)}
      data-cursor="pointer"
      className="group relative w-72 h-44 flex-shrink-0 cursor-pointer rounded-md overflow-hidden bg-brand-card border border-transparent hover:border-brand-red/50 hover:shadow-[0_0_0_2px_#E50914,0_8px_32px_rgba(229,9,20,0.3)] transition-all duration-300 ease-out hover:-translate-y-2"
    >
      {/* Background Image / Target Video */}
      <div className="absolute inset-0 w-full h-full bg-brand-mid overflow-hidden">
        {project.video_url ? (
          <video
            src={project.video_url}
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 absolute inset-0"
          />
        ) : null}
        
        <Image
          src={project.image_url || DEFAULT_IMAGE}
          alt={project.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 288px"
          className={`object-cover transition-transform duration-500 ease-out group-hover:scale-110 ${project.video_url ? 'group-hover:opacity-0' : ''}`}
        />
      </div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent pointer-events-none z-20" />

      {/* Card Content - Bottom Aligned */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end z-30 pointer-events-none">
        
        <h3 className="font-display font-bold text-white text-base mb-2 line-clamp-1">
          {project.title}
        </h3>

        {/* Small Tags Pill List */}
        <div className="flex flex-wrap gap-1.5 min-h-[20px]">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded bg-brand-red/20 text-brand-red text-[10px] font-body uppercase tracking-wider font-semibold"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Hover revealing tech stack overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-none">
           {project.tech_stack.slice(0, 4).map((tech) => (
             <span key={tech} className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-brand-lgray text-[10px] whitespace-nowrap">
               {tech}
             </span>
           ))}
           {project.tech_stack.length > 4 && <span className="text-[10px] text-brand-dgray">+{project.tech_stack.length - 4}</span>}
        </div>
      </div>
    </motion.div>
  )
}
