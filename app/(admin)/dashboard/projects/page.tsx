'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Project, ProjectFormData } from '@/types'
import { DataTable } from '@/components/dashboard/DataTable'
import { ProjectForm } from '@/components/dashboard/ProjectForm'
import { useProjects } from '@/hooks/useProjects'
import { uploadImage } from '@/lib/upload'

export default function ProjectsDashboard() {
  const { projects, isLoading, mutate } = useProjects()
  const [isEditing, setIsEditing] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setIsEditing(true)
  }

  const handleCreate = () => {
    setEditingProject(null)
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you certain you want to delete this project?')) return

    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      mutate() // Refresh data
    } catch (e) {
      alert('Failed to delete project')
    }
  }

  const handleSubmit = async (data: ProjectFormData & { file?: File }) => {
    setIsSubmitting(true)
    
    try {
      let finalImageUrl = editingProject?.image_url || ''

      // 1. Upload new image if present
      if (data.file) {
         finalImageUrl = await uploadImage(data.file)
      }

      // 2. Prepare payload
      const payload = {
         ...data,
         image_url: finalImageUrl,
         file: undefined // Strip before sending to DB
      }

      // 3. Save to DB
      const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects'
      const method = editingProject ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) throw new Error('Save failed')

      // Refresh list & close form
      await mutate()
      setIsEditing(false)
      setEditingProject(null)

    } catch (e: any) {
      alert(e.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">Projects Manager</h1>
          <p className="font-body text-sm text-brand-dgray mt-1">Create, update, and manage your portfolio items.</p>
        </div>
        
        {!isEditing && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded font-medium hover:bg-[#ff0f1a] transition-colors shadow-lg shadow-brand-red/20"
          >
            <Plus size={18} /> New Project
          </button>
        )}
      </div>

      {isEditing ? (
        <ProjectForm
          initialData={editingProject || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
             setIsEditing(false)
             setEditingProject(null)
          }}
          isSubmitting={isSubmitting}
        />
      ) : isLoading ? (
         <div className="animate-pulse flex gap-4 flex-col">
            <div className="h-12 bg-brand-mid rounded w-full" />
            <div className="h-12 bg-brand-mid rounded w-full" />
            <div className="h-12 bg-brand-mid rounded w-full" />
         </div>
      ) : (
        <DataTable
          projects={projects}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
