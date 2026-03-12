import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  // Strict auth checking for all `/dashboard` routes
  if (!session?.user) {
    redirect('/api/auth/signin')
  }

  // Only the specified GitHub owner can access this
  if ((session.user as any).github_id !== process.env.NEXT_PUBLIC_OWNER_GITHUB_ID) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 text-center">
        <div className="max-w-md p-8 border border-brand-mid bg-brand-dark rounded-xl">
           <h1 className="font-display text-xl text-brand-red mb-4">Unauthorized Access</h1>
           <p className="font-body text-brand-lgray text-sm mb-6">
             Your GitHub account is not authorized to access this dashboard.
             This environment is locked to the owner.
           </p>
           <a 
              href="/api/auth/signout" 
              className="inline-block px-4 py-2 bg-brand-mid text-white rounded hover:bg-brand-mid/80 transition-colors"
            >
             Sign Out
           </a>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}
