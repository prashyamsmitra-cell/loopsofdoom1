'use client'

import { useState, useMemo } from 'react'
import { HeroSection } from '@/components/hero/HeroSection'
import { NetflixShelf } from '@/components/projects/NetflixShelf'
import { ProjectModal } from '@/components/projects/ProjectModal'
import { ChatPanel } from '@/components/projects/ChatPanel'
import { LoadingScreen } from '@/components/shell/LoadingScreen'
import { Footer } from '@/components/shell/Footer'
import { useProjects } from '@/hooks/useProjects'
import { Project } from '@/types'

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false)
  
  const { projects, isLoading } = useProjects()
  
  // Modal & Chat state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [activeSessionId, setActiveSessionId] = useState<string>('')

  // Derived project shelves
  const featuredProjects = useMemo(() => projects.filter(p => p.is_featured), [projects])
  const aiProjects = useMemo(() => projects.filter(p => p.category === 'ai' && !p.is_featured), [projects])
  const fullstackProjects = useMemo(() => projects.filter(p => p.category === 'fullstack' && !p.is_featured), [projects])

  const openProject = (project: Project) => {
    setSelectedProject(project)
    setIsChatOpen(false)
  }

  const openChat = () => {
    setActiveSessionId(crypto.randomUUID()) // New session per open
    setIsChatOpen(true)
  }

  return (
    <>
      <LoadingScreen onComplete={() => setLoadingComplete(true)} />
      
      {/* Don't mount heavy components until loader finishes */}
      {loadingComplete && (
        <main className="flex-1 flex flex-col w-full">
          <HeroSection />

          <div id="projects" className="w-full flex flex-col -mt-20 z-30 pb-20 gap-8">
            {isLoading ? (
               <div className="h-64 flex items-center justify-center text-brand-dgray animate-pulse">
                 Loading neural linkages...
               </div>
            ) : (
                <>
                  <NetflixShelf 
                    title="Featured Work" 
                    projects={featuredProjects} 
                    onCardClick={openProject} 
                  />
                  <NetflixShelf 
                    title="AI & Machine Learning" 
                    projects={aiProjects} 
                    onCardClick={openProject} 
                  />
                  <NetflixShelf 
                    title="Full Stack Engineering" 
                    projects={fullstackProjects} 
                    onCardClick={openProject} 
                    linkHref="/projects"
                  />
                </>
            )}
          </div>

          <Footer />

          {/* Overlays */}
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
            chatEnabled={!!selectedProject?.ai_system_prompt}
            onOpenChat={openChat}
          />

          {isChatOpen && selectedProject && (
            <ChatPanel 
               project={selectedProject} 
               onClose={() => setIsChatOpen(false)}
               sessionId={activeSessionId}
            />
          )}

        </main>
      )}
    </>
  )
}
