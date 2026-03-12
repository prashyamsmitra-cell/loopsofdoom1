'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, Loader2 } from 'lucide-react'
import { ProjectFormData } from '@/types'

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData>
  onSubmit: (data: ProjectFormData & { file?: File }) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
}

export function ProjectForm({ initialData, onSubmit, onCancel, isSubmitting }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    long_description: initialData?.long_description || '',
    tech_stack: initialData?.tech_stack || [],
    tags: initialData?.tags || [],
    category: initialData?.category || 'fullstack',
    image_url: initialData?.image_url || '',
    demo_url: initialData?.demo_url || '',
    github_url: initialData?.github_url || '',
    video_url: initialData?.video_url || '',
    ai_system_prompt: initialData?.ai_system_prompt || '',
    is_featured: initialData?.is_featured || false,
    display_order: initialData?.display_order || 0
  })

  const [techInput, setTechInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image_url || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setPreviewUrl(URL.createObjectURL(selectedFile))
    }
  }

  const handleAddTech = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault()
      if (!formData.tech_stack.includes(techInput.trim())) {
        setFormData(prev => ({ ...prev, tech_stack: [...prev.tech_stack, techInput.trim()] }))
      }
      setTechInput('')
    }
  }

  const removeTech = (tech: string) => {
    setFormData(prev => ({ ...prev, tech_stack: prev.tech_stack.filter(t => t !== tech) }))
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim().toLowerCase()] }))
      }
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({ ...formData, file: file || undefined })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl bg-brand-dark border border-brand-mid rounded-lg p-6 md:p-8">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column */}
        <div className="space-y-6">
           {/* Basic Info */}
           <div>
             <label className="block text-sm font-medium text-brand-lgray mb-2">Project Title *</label>
             <input
               required
               type="text"
               value={formData.title}
               onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
               className="w-full bg-brand-card border border-brand-mid rounded-md px-4 py-2.5 text-white focus:border-brand-red outline-none transition-colors"
               placeholder="e.g. Netflix Clone"
             />
           </div>

           <div>
             <label className="block text-sm font-medium text-brand-lgray mb-2">Short Description *</label>
             <textarea
               required
               maxLength={500}
               rows={3}
               value={formData.description}
               onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
               className="w-full bg-brand-card border border-brand-mid rounded-md px-4 py-2.5 text-white focus:border-brand-red outline-none transition-colors resize-none"
               placeholder="Brief overview for the card..."
             />
           </div>
           
           <div>
             <label className="block text-sm font-medium text-brand-lgray mb-2">Category *</label>
             <select
               value={formData.category}
               onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as ProjectFormData['category'] }))}
               className="w-full bg-brand-card border border-brand-mid rounded-md px-4 py-2.5 text-white focus:border-brand-red outline-none transition-colors appearance-none"
             >
               <option value="fullstack">Full Stack</option>
               <option value="ai">AI / Machine Learning</option>
               <option value="featured">Featured Work</option>
               <option value="in-progress">In Progress</option>
             </select>
           </div>

           {/* Tech & Tags */}
           <div>
             <label className="block text-sm font-medium text-brand-lgray mb-2">Tech Stack (Press Enter)</label>
             <div className="bg-brand-card border border-brand-mid rounded-md p-2 flex flex-wrap gap-2 focus-within:border-brand-red transition-colors">
               {formData.tech_stack.map(tech => (
                 <span key={tech} className="flex items-center gap-1 bg-brand-mid px-2 py-1 rounded text-xs text-white">
                   {tech} <X size={12} className="cursor-pointer hover:text-brand-red" onClick={() => removeTech(tech)} />
                 </span>
               ))}
               <input
                 type="text"
                 value={techInput}
                 onChange={e => setTechInput(e.target.value)}
                 onKeyDown={handleAddTech}
                 className="flex-1 bg-transparent min-w-[120px] outline-none text-sm text-white px-2"
                 placeholder="e.g. Next.js"
               />
             </div>
           </div>

           <div>
             <label className="block text-sm font-medium text-brand-lgray mb-2">Tags (Press Enter)</label>
             <div className="bg-brand-card border border-brand-mid rounded-md p-2 flex flex-wrap gap-2 focus-within:border-brand-red transition-colors">
               {formData.tags.map(tag => (
                 <span key={tag} className="flex items-center gap-1 bg-brand-red/20 text-brand-red px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">
                   {tag} <X size={12} className="cursor-pointer hover:text-white" onClick={() => removeTag(tag)} />
                 </span>
               ))}
               <input
                 type="text"
                 value={tagInput}
                 onChange={e => setTagInput(e.target.value)}
                 onKeyDown={handleAddTag}
                 className="flex-1 bg-transparent min-w-[120px] outline-none text-sm text-white px-2"
                 placeholder="e.g. clone"
               />
             </div>
           </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
           
           {/* Image Upload */}
           <div>
             <label className="block text-sm font-medium text-brand-lgray mb-2">Project Image</label>
             <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
                  previewUrl ? 'border-brand-red/50' : 'border-brand-mid hover:border-brand-red/50 hover:bg-brand-mid/20'
                }`}
             >
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-brand-dgray">
                    <Upload size={24} className="mb-2" />
                    <span className="text-sm">Click to upload image</span>
                  </div>
                )}
             </div>
             <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
           </div>

           {/* URLs */}
           <div className="space-y-4">
             <div>
               <label className="block text-xs font-medium text-brand-dgray mb-1">Live Demo URL</label>
               <input
                 type="url"
                 value={formData.demo_url}
                 onChange={e => setFormData(prev => ({ ...prev, demo_url: e.target.value }))}
                 className="w-full bg-brand-card border border-brand-mid rounded-md px-3 py-2 text-white text-sm focus:border-brand-red outline-none"
                 placeholder="https://..."
               />
             </div>
             <div>
               <label className="block text-xs font-medium text-brand-dgray mb-1">GitHub Repo URL</label>
               <input
                 type="url"
                 value={formData.github_url}
                 onChange={e => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                 className="w-full bg-brand-card border border-brand-mid rounded-md px-3 py-2 text-white text-sm focus:border-brand-red outline-none"
                 placeholder="https://github.com/..."
               />
             </div>
             <div>
               <label className="block text-xs font-medium text-brand-dgray mb-1">Video Demo URL (.mp4 optional)</label>
               <input
                 type="url"
                 value={formData.video_url}
                 onChange={e => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                 className="w-full bg-brand-card border border-brand-mid rounded-md px-3 py-2 text-white text-sm focus:border-brand-red outline-none"
                 placeholder="https://..."
               />
             </div>
           </div>

           <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="is_featured"
                checked={formData.is_featured}
                onChange={e => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                className="rounded border-brand-mid bg-brand-card text-brand-red focus:ring-brand-red focus:ring-offset-brand-dark w-4 h-4 cursor-pointer"
              />
              <label htmlFor="is_featured" className="text-sm text-brand-lgray cursor-pointer">
                 Feature this project
              </label>
           </div>
        </div>

      </div>

      {/* Full Width AI System Prompt */}
      <div>
         <label className="block text-sm font-medium text-brand-lgray mb-2 flex items-center justify-between">
           <span>AI System Prompt for Chat</span>
           <span className="text-xs text-brand-dgray font-normal">(Leave blank to disable AI chat for this project)</span>
         </label>
         <textarea
           rows={5}
           value={formData.ai_system_prompt}
           onChange={e => setFormData(prev => ({ ...prev, ai_system_prompt: e.target.value }))}
           className="w-full bg-brand-card border border-brand-mid rounded-md px-4 py-3 text-white focus:border-brand-red outline-none transition-colors resize-y font-mono text-sm leading-relaxed"
           placeholder={`You are the architect of ${formData.title || 'this project'}. Explain the challenges you faced with...`}
         />
      </div>

       {/* Full Width Long Description */}
       <div>
         <label className="block text-sm font-medium text-brand-lgray mb-2">Long Description (Detailed Case Study)</label>
         <textarea
           rows={8}
           value={formData.long_description}
           onChange={e => setFormData(prev => ({ ...prev, long_description: e.target.value }))}
           className="w-full bg-brand-card border border-brand-mid rounded-md px-4 py-3 text-white focus:border-brand-red outline-none transition-colors resize-y"
           placeholder="Detailed breakdown of architecture, problems solved, etc..."
         />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-brand-mid">
         <button
           type="button"
           onClick={onCancel}
           disabled={isSubmitting}
           className="px-6 py-2 rounded-md bg-transparent border border-brand-mid text-brand-lgray hover:text-white hover:border-brand-lgray transition-colors disabled:opacity-50"
         >
           Cancel
         </button>
         <button
           type="submit"
           disabled={isSubmitting || !formData.title || !formData.description || formData.tech_stack.length === 0}
           className="flex items-center justify-center min-w-[120px] px-6 py-2 rounded-md bg-brand-red text-white hover:bg-[#ff0f1a] transition-colors disabled:opacity-50 shadow-lg shadow-brand-red/20 font-medium"
         >
           {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Save Project'}
         </button>
      </div>
    </form>
  )
}
