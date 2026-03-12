export interface Project {
  id: string
  title: string
  description: string
  long_description?: string
  tech_stack: string[]
  tags: string[]
  image_url?: string
  demo_url?: string
  github_url?: string
  video_url?: string
  category: 'ai' | 'fullstack' | 'in-progress' | 'featured'
  ai_system_prompt?: string
  view_count: number
  modal_open_count: number
  ai_chat_count: number
  display_order: number
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface ChatSession {
  id: string
  project_id: string
  session_id: string
  messages: ChatMessage[]
  rating?: 1 | -1
}

export interface AnalyticsEvent {
  project_id?: string
  event_type: 'page_view' | 'project_view' | 'modal_open' | 'ai_chat_started' | 'ai_chat_rated' | 'contact_submitted'
  session_id?: string
  metadata?: Record<string, unknown>
}

export interface FeatureFlag {
  flag_name: string
  enabled: boolean
  description?: string
}

export interface ProjectFormData {
  title: string
  description: string
  long_description?: string
  tech_stack: string[]
  tags: string[]
  image_url?: string
  demo_url?: string
  github_url?: string
  video_url?: string
  category: Project['category']
  ai_system_prompt?: string
  is_featured: boolean
  display_order: number
}
