import { format } from 'date-fns'
import { Edit, Trash2, Eye, MessageSquare } from 'lucide-react'
import { Project } from '@/types'

interface DataTableProps {
  projects: Project[]
  onEdit: (project: Project) => void
  onDelete: (id: string) => void
}

export function DataTable({ projects, onEdit, onDelete }: DataTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-brand-mid bg-brand-dark/50">
      <table className="w-full text-left text-sm font-body text-brand-lgray">
        <thead className="text-xs uppercase bg-brand-mid border-b border-brand-mid text-white">
          <tr>
            <th scope="col" className="px-6 py-4 font-medium">Title</th>
            <th scope="col" className="px-6 py-4 font-medium hidden md:table-cell">Category</th>
            <th scope="col" className="px-6 py-4 font-medium hidden lg:table-cell">Stats</th>
            <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-brand-dgray">
                No projects found. Create your first one.
              </td>
            </tr>
          ) : (
            projects.map((project) => (
              <tr key={project.id} className="border-b border-brand-mid/50 hover:bg-brand-mid/20 transition-colors">
                
                <td className="px-6 py-4 font-display font-medium text-white">
                  <div className="flex items-center gap-3">
                     {project.image_url ? (
                       <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-brand-card">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                         <img src={project.image_url} alt="" className="w-full h-full object-cover" />
                       </div>
                     ) : (
                       <div className="w-10 h-10 rounded bg-brand-mid flex-shrink-0" />
                     )}
                     <div>
                       <div className="line-clamp-1">{project.title}</div>
                       <div className="text-brand-dgray text-xs mt-0.5 font-body">
                         {format(new Date(project.created_at), 'MMM d, yyyy')}
                       </div>
                     </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className="px-2 py-1 rounded-sm bg-brand-card text-[10px] uppercase tracking-wider font-semibold">
                    {project.category}
                  </span>
                </td>
                
                <td className="px-6 py-4 hidden lg:table-cell">
                  <div className="flex items-center gap-4 text-brand-dgray text-xs">
                    <span className="flex items-center gap-1.5" title="Views">
                      <Eye size={14} /> {project.view_count || 0}
                    </span>
                    <span className="flex items-center gap-1.5" title="AI Chats">
                      <MessageSquare size={14} /> {project.ai_chat_count || 0}
                    </span>
                  </div>
                </td>
                
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(project)}
                      className="p-2 text-brand-lgray hover:text-white hover:bg-brand-mid rounded-md transition-colors"
                      title="Edit Project"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(project.id)}
                      className="p-2 text-brand-dgray hover:text-brand-red hover:bg-brand-red/10 rounded-md transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
                
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
