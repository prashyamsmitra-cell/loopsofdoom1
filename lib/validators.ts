import { z } from 'zod'

export const CreateProjectSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  long_description: z.string().optional(),
  tech_stack: z.array(z.string()).min(1),
  tags: z.array(z.string()),
  image_url: z.string().url().optional(),
  demo_url: z.string().url().optional(),
  github_url: z.string().url().optional(),
  video_url: z.string().url().optional(),
  category: z.enum(['ai', 'fullstack', 'in-progress', 'featured']),
  ai_system_prompt: z.string().optional(),
  is_featured: z.boolean().default(false),
  display_order: z.number().int().default(0),
})

export const UpdateProjectSchema = CreateProjectSchema.partial()

export const ChatSchema = z.object({
  project_id: z.string().uuid(),
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().max(2000),
  })).max(20),
  session_id: z.string(),
})

export const MatchSchema = z.object({
  query: z.string().min(10).max(1000),
  session_id: z.string(),
})

export const AnalyticsSchema = z.object({
  event_type: z.enum(['page_view','project_view','modal_open','ai_chat_started','ai_chat_rated','contact_submitted']),
  project_id: z.string().uuid().optional(),
  session_id: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})
