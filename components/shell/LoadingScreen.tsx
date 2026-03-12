'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MESSAGES = [
  "Compiling vibes...",
  "Asking the AI nicely...",
  "Almost. Maybe.",
  "Skill issue fixed.",
  "Loading personality...",
  "Don't rush me."
]

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true)
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    // Dismiss loading screen max 2.5s or on window.onload + slight delay
    const totalDuration = 2500
    let isComplete = false

    const handleComplete = () => {
      if (!isComplete) {
        isComplete = true
        setIsVisible(false)
        setTimeout(onComplete, 400) // Wait for exit animation
      }
    }

    const maxTimeout = setTimeout(handleComplete, totalDuration)
    
    if (document.readyState === 'complete') {
        const remaining = Math.max(0, 1500 - performance.now()); // Ensure at least 1.5s visual
        setTimeout(handleComplete, remaining)
    } else {
        window.addEventListener('load', handleComplete)
    }

    return () => {
      clearTimeout(maxTimeout)
      window.removeEventListener('load', handleComplete)
    }
  }, [onComplete])

  useEffect(() => {
    // Cycle messages every 400ms
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length)
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] bg-[#111111] flex flex-col items-center justify-center p-4 selection:bg-brand-red selection:text-white"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6, bounce: 0.4 }}
            className="flex items-center justify-center pb-8"
          >
            <span className="font-display font-bold text-brand-red text-9xl">N</span>
          </motion.div>

          {/* Progress Bar Container */}
          <div className="w-64 h-0.5 bg-brand-mid overflow-hidden rounded-full mb-6">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'linear' }}
              className="h-full bg-brand-red"
            />
          </div>

          {/* Messages */}
          <div className="h-6 relative w-64 text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 font-body text-brand-dgray text-sm"
              >
                {MESSAGES[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
