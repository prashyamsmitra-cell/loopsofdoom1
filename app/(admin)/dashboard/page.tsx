import { supabase } from '@/lib/supabase'

export default async function DashboardOverview() {
  
  // Fast aggregate fetch
  const { count: projectsCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })

  const { data: viewsData } = await supabase
    .from('projects')
    .select('view_count')
    .not('view_count', 'is', null)

  const { count: chatsCount } = await supabase
    .from('ai_chat_sessions')
    .select('*', { count: 'exact', head: true })

  const totalViews = viewsData?.reduce((acc, curr) => acc + (curr.view_count || 0), 0) || 0

  const stats = [
    { name: 'Total Projects', value: projectsCount || 0 },
    { name: 'Total Matrix Views', value: totalViews },
    { name: 'AI Chat Sessions', value: chatsCount || 0 },
  ]

  return (
    <div className="max-w-5xl">
      <h1 className="font-display font-bold text-3xl text-white mb-8">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map(stat => (
          <div key={stat.name} className="bg-brand-card border border-brand-mid p-6 rounded-lg">
             <p className="font-body text-sm text-brand-dgray mb-2 font-medium">{stat.name}</p>
             <p className="font-display text-4xl text-white tracking-tight font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Analytics Chart Hookup Next */}
      <div className="bg-brand-card border border-brand-mid p-6 rounded-lg min-h-[400px] flex items-center justify-center">
         <p className="text-brand-dgray font-body italic text-sm">Detailed analytics charts coming soon.</p>
      </div>
    </div>
  )
}
