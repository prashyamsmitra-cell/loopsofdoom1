'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Github, ExternalLink, Play } from 'lucide-react'
import { Project } from '@/types'
import { TechBadge } from './TechBadge'

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
  chatEnabled: boolean
  onOpenChat: () => void
}

export function ProjectModal({ project, onClose, chatEnabled, onOpenChat }: ProjectModalProps) {
  
  // Lock body scroll and handle escape
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden'
      // Fire analytics event
      ;(async () => {
        try {
          await fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event_type: 'modal_open', project_id: project.id })
          })
        } catch (err) {
          console.error(err)
        }
      })()
    } else {
      document.body.style.overflow = 'auto'
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && project) onClose()
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = 'auto'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [project, onClose])

  if (!project) return null

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-brand-dark/95 backdrop-blur-sm cursor-pointer overflow-y-auto"
      >
        <div className="min-h-full w-full flex items-center justify-center p-4 md:p-8">
          
          {/* Modal Container linking layoutId for shared transition */}
          <motion.div
            layoutId={project.id}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            className="w-full max-w-6xl bg-brand-dark border border-brand-mid rounded-xl overflow-hidden shadow-2xl relative cursor-default flex flex-col md:flex-row"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Close Button top-right absolute */}
            <button
               onClick={onClose}
               data-cursor="pointer"
               className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black text-white rounded-full backdrop-blur transition-colors"
            >
               <X size={20} />
            </button>

            {/* Left Column - Media & Prose (60%) */}
            <div className="w-full md:w-[60%] border-b md:border-b-0 md:border-r border-brand-mid flex flex-col">
              
              {/* Media Container with CSS browser chrome */}
              <div className="w-full bg-brand-card2 p-4 md:p-8 flex items-center justify-center min-h-[300px]">
                <div className="w-full max-w-2xl rounded-lg overflow-hidden shadow-2xl border border-brand-mid/50 bg-[#111111] animate-float">
                  
                  {/* Browser Chrome Header */}
                  <div className="h-8 bg-[#2D2D2D] w-full flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  </div>
                  
                  {/* Media Content */}
                  <div className="relative aspect-video bg-black w-full">
                     {project.video_url ? (
                        <video 
                          src={project.video_url} 
                          autoPlay 
                          loop 
                          muted 
                          playsInline 
                          className="w-full h-full object-cover" 
                        />
                     ) : (
                        <img 
                          src={project.image_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1470&auto=format&fit=crop"} 
                          alt={project.title} 
                          className="w-full h-full object-cover"
                        />
                     )}
                  </div>
                </div>
              </div>

              {/* Prose Content */}
              <div className="p-6 md:p-8 flex-1 bg-brand-dark overflow-y-auto">
                 <h3 className="font-display font-bold text-xl text-white mb-4">How I Built This</h3>
                 <div className="w-8 h-1 bg-brand-red mb-6" />
                 <div className="prose prose-invert prose-p:font-body prose-p:text-brand-lgray prose-p:leading-relaxed max-w-none space-y-4">
                    {project.long_description ? (
                       <p className="whitespace-pre-wrap">{project.long_description}</p>
                    ) : (
                       <p className="italic text-brand-dgray">Deep dive documentation coming soon.</p>
                    )}
                 </div>
              </div>
            </div>

            {/* Right Column - Meta & Actions (40%) */}
            <div className="w-full md:w-[40%] bg-[#0a0a0a] p-6 md:p-8 flex flex-col gap-8">
              
              <div className="space-y-4">
                <h2 className="font-display font-bold text-3xl md:text-4xl text-white leading-tight">
                  {project.title}
                </h2>
                
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                     <span key={tag} className="px-2.5 py-1 rounded bg-brand-red/10 text-brand-red text-xs font-body uppercase tracking-widest font-bold">
                       {tag}
                     </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                 <h3 className="font-display font-medium text-lg text-white">Tech Stack</h3>
                 <div className="flex flex-wrap gap-2">
                    {project.tech_stack.map((tech, i) => (
                       <TechBadge key={tech} tech={tech} index={i} />
                    ))}
                 </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-brand-mid">
                 <div className="flex flex-col sm:flex-row gap-3">
                   {project.github_url && (
                     <a 
                       href={project.github_url} 
                       target="_blank" 
                       rel="noreferrer"
                       data-cursor="pointer"
                       className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded border border-brand-dgray text-white hover:border-white transition-colors text-sm font-medium"
                     >
                       <Github size={16} /> Source Code
                     </a>
                   )}
                   {project.demo_url && (
                     <a 
                       href={project.demo_url} 
                       target="_blank" 
                       rel="noreferrer"
                       data-cursor="pointer"
                       className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded border border-brand-red bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white transition-colors text-sm font-medium"
                     >
                       <ExternalLink size={16} /> Live Demo
                     </a>
                   )}
                 </div>

                 {chatEnabled && project.ai_system_prompt && (
                   <button
                     onClick={onOpenChat}
                     data-cursor="pointer"
                     className="w-full flex items-center justify-center gap-2 py-4 rounded bg-brand-red text-white hover:bg-[#ff0f1a] transition-colors shadow-lg shadow-brand-red/20 text-sm font-medium uppercase tracking-wide mt-4"
                   >
                     <Play size={16} className="fill-current" /> Ask AI About This Project
                   </button>
                 )}
              </div>

              <div className="mt-auto pt-8 flex items-center text-brand-dgray text-xs font-body gap-2">
                 <span>👁</span> {project.view_count || 0} views • {project.modal_open_count || 0} modal opens
              </div>

            </div>

          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
