import type { Metadata } from 'next'
import { Space_Grotesk, Inter, Press_Start_2P } from 'next/font/google'
import './globals.css'
import { CursorGlow } from '@/components/shell/CursorGlow'
import { auth } from '@/lib/auth'
import { Navbar } from '@/components/shell/Navbar'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  variable: '--font-space-grotesk' 
})

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter' 
})

const pressStart = Press_Start_2P({ 
  weight: '400', 
  subsets: ['latin'], 
  variable: '--font-press-start'
})

export const metadata: Metadata = {
  title: 'Portfolio | Dev',
  description: 'AI Engineer & Full Stack Developer Portfolio',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const isOwner = session?.user && (session.user as any).github_id === process.env.NEXT_PUBLIC_OWNER_GITHUB_ID

  return (
    <html lang="en" className="dark">
      <body 
        className={`${spaceGrotesk.variable} ${inter.variable} ${pressStart.variable} font-body bg-brand-dark text-brand-lgray antialiased selection:bg-brand-red selection:text-white min-h-screen flex flex-col`}
      >
        <CursorGlow />
        <Navbar isOwner={!!isOwner} />
        {children}
      </body>
    </html>
  )
}
