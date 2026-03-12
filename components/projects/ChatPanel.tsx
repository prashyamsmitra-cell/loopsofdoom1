'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Project } from '@/types'
import { StreamingText } from '../ui/StreamingText'
import { useChat } from '@/hooks/useChat' // We will build this SWR hook next

interface ChatPanelProps {
  project: Project
  onClose: () => void
  sessionId: string
}

export function ChatPanel({ project, onClose, sessionId }: ChatPanelProps) {
  const { messages, isStreaming, sendMessage, rating, submitRating } = useChat(project.id, sessionId, project.title)
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isStreaming])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isStreaming) return
    sendMessage(input)
    setInput('')
  }

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-[190] cursor-pointer block md:hidden"
      />
      
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 h-[100svh] w-full md:w-[400px] bg-brand-card border-l border-brand-mid z-[200] flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-brand-mid bg-brand-dark">
          <div>
            <h3 className="font-display font-bold text-white text-lg line-clamp-1">{project.title}</h3>
            <p className="font-body text-xs text-brand-lgray">AI Assistant</p>
          </div>
          <button 
            onClick={onClose}
            data-cursor="pointer" 
            className="p-2 -mr-2 text-brand-dgray hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scroll-smooth">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user'
            const isLastAssistant = !isUser && idx === messages.length - 1

            return (
              <div key={idx} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl ${
                    isUser 
                      ? 'bg-brand-red text-white rounded-tr-sm' 
                      : 'bg-brand-mid text-brand-lgray rounded-tl-sm border border-brand-mid/50'
                  }`}
                >
                  {isLastAssistant ? (
                    <StreamingText content={msg.content} isStreaming={isStreaming} />
                  ) : (
                    <p className="font-body text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </div>
            )
          })}

          {/* Typing Indicator */}
          {isStreaming && messages[messages.length - 1]?.role === 'user' && (
             <div className="flex w-full justify-start">
                <div className="bg-brand-mid rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                      className="w-1.5 h-1.5 rounded-full bg-brand-lgray"
                    />
                  ))}
                </div>
             </div>
          )}

          {/* Rating (Shows after 3 interactions to avoid spam) */}
          {messages.length >= 4 && !isStreaming && !rating && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="mt-4 flex flex-col items-center gap-2 border-t border-brand-mid pt-4 mx-4"
            >
              <p className="text-xs text-brand-dgray">Was this conversation helpful?</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => submitRating(1)}
                  data-cursor="pointer"
                  className="p-2 rounded-full hover:bg-brand-mid text-brand-lgray hover:text-brand-green transition-colors"
                >
                  <ThumbsUp size={16} />
                </button>
                <button 
                   onClick={() => submitRating(-1)}
                   data-cursor="pointer"
                   className="p-2 rounded-full hover:bg-brand-mid text-brand-lgray hover:text-brand-red transition-colors"
                >
                  <ThumbsDown size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-brand-mid bg-brand-dark/50">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isStreaming}
              data-cursor="text"
              className="w-full bg-brand-mid border border-brand-mid focus:border-brand-red rounded-lg pl-4 pr-12 py-3 text-white placeholder-brand-dgray text-sm md:text-base outline-none disabled:opacity-50 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              data-cursor="pointer"
              className="absolute right-2 p-2 text-brand-red disabled:text-brand-dgray hover:bg-brand-red/10 rounded-md transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </motion.div>
    </>
  )
}
