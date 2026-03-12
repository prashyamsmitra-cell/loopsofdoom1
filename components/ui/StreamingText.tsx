'use client'

import { useState, useEffect } from 'react'

export function StreamingText({ content, isStreaming }: { content: string, isStreaming: boolean }) {
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (!isStreaming) {
      setShowCursor(false)
      return
    }
    
    // Blink cursor every 500ms while streaming is true
    setShowCursor(true)
    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    
    return () => clearInterval(interval)
  }, [isStreaming])

  return (
    <div className="font-body text-sm md:text-base leading-relaxed whitespace-pre-wrap word-break">
      {content}
      {showCursor && (
        <span className="inline-block ml-1 w-[8px] h-[1em] bg-brand-red animate-pulse align-middle" />
      )}
    </div>
  )
}
