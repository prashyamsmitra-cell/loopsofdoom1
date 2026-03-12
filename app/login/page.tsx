import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Github } from 'lucide-react'
import { signIn } from '@/lib/auth'

export default async function LoginPage() {
  const session = await auth()

  if (session?.user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-4">
      
      {/* Cinematic styling */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-black pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-red/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        
        <div className="w-16 h-16 bg-brand-red rounded flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(229,9,20,0.3)]">
           <span className="font-display font-bold text-4xl text-white">N</span>
        </div>

        <h1 className="font-display font-bold text-3xl text-white mb-2 text-center">Admin Portal</h1>
        <p className="font-body text-brand-lgray text-center mb-10 text-sm">
          Strictly authorized personnel only. (Me).
        </p>

        {/* Note: In App Router, Server Actions are preferred for triggering auth */}
        <form 
          action={async () => {
             'use server'
             await signIn("github", { redirectTo: "/dashboard" })
          }} 
          className="w-full"
        >
          <button 
            type="submit"
            data-cursor="pointer"
            className="w-full group flex items-center justify-center gap-3 bg-white text-black font-body font-medium px-6 py-3.5 rounded hover:bg-brand-lgray transition-colors"
          >
            <Github size={20} className="group-hover:scale-110 transition-transform" />
            Sign in with GitHub
          </button>
        </form>

        <a href="/" className="mt-8 font-body text-sm text-brand-dgray hover:text-white transition-colors" data-cursor="pointer">
           ← Back to Portfolio
        </a>
      </div>
    </div>
  )
}
