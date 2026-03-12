import useSWR from 'swr'
import { Project } from '@/types'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useProjects(category?: string) {
  const url = category ? `/api/projects?category=${category}` : '/api/projects'
  
  const { data, error, isLoading, mutate } = useSWR<{ projects: Project[] }>(url, fetcher, {
    revalidateOnFocus: false, // Don't refetch just because user switched tabs
  })

  return {
    projects: data?.projects || [],
    isLoading,
    error,
    mutate
  }
}
