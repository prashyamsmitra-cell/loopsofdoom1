'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2 } from 'lucide-react'

export default function ContactPage() {
  const [query, setQuery] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [response, setResponse] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || isSubmitting) return

    setIsSubmitting(true)
    setResponse('')

    try {
      // Connect to the Match endpoint we built in Phase 3
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
           query,
           session_id: crypto.randomUUID()
        })
      })

      if (!res.ok) throw new Error('Match failed')
      if (!res.body) return

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        setResponse(prev => prev + decoder.decode(value))
      }

    } catch (e: any) {
      setResponse("System offline or rate limited. Please try emailing me directly instead.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto min-h-[80svh] flex flex-col justify-center">
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="text-center mb-12"
      >
        <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">Smart Contact</h1>
        <p className="font-body text-brand-lgray text-lg max-w-2xl mx-auto">
          Tell me what you&apos;re looking for in a developer. The AI will instantly search my portfolio and recommend my most relevant work experience to you.
        </p>
      </motion.div>

      <motion.form 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.2 }}
         onSubmit={handleSubmit} 
         className="w-full relative group"
      >
         <textarea
           value={query}
           onChange={e => setQuery(e.target.value)}
           placeholder="e.g., I'm looking for someone who has experience building scalable Next.js applications and integrating with Stripe..."
           rows={4}
           disabled={isSubmitting}
           data-cursor="text"
           className="w-full bg-brand-card/50 backdrop-blur border border-brand-mid focus:border-brand-red rounded-xl p-6 text-white text-lg resize-none outline-none transition-all placeholder:text-brand-dgray shadow-2xl"
         />
         <div className="absolute bottom-4 right-4">
           <button
             type="submit"
             disabled={!query.trim() || isSubmitting}
             data-cursor="pointer"
             className="px-6 py-2.5 bg-brand-red text-white flex items-center gap-2 rounded hover:bg-[#ff0f1a] transition-colors disabled:opacity-50 disabled:hover:bg-brand-red shadow-lg shadow-brand-red/20 font-medium"
           >
             {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
             Analyze Requirements
           </button>
         </div>
      </motion.form>

      {/* Streaming Results Area */}
      {response && (
        <motion.div 
           initial={{ opacity: 0, height: 0 }}
           animate={{ opacity: 1, height: 'auto' }}
           className="mt-12 p-8 bg-brand-card border border-brand-mid/50 rounded-xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-red to-transparent opacity-50" />
          <h3 className="font-display font-bold text-white text-xl mb-4 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
             AI Recommendation
          </h3>
          <div className="prose prose-invert prose-p:font-body prose-p:text-brand-lgray prose-p:leading-relaxed max-w-none whitespace-pre-wrap">
             {response}
          </div>
          
          {/* Real Email Fallback */}
          <div className="mt-8 pt-8 border-t border-brand-mid flex flex-col items-center text-center">
             <p className="font-body text-brand-dgray text-sm mb-4">
               Prefer traditional email? Let&apos;s talk.
             </p>
             <a href="mailto:hello@example.com" data-cursor="pointer" className="px-6 py-3 border border-brand-lgray text-white hover:bg-white hover:text-black transition-colors rounded font-medium">
               hello@example.com
             </a>
          </div>
        </motion.div>
      )}
    </div>
  )
}
