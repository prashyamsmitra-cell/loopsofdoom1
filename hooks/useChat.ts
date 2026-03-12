import { useState, useCallback } from 'react'
import { ChatMessage } from '@/types'

export function useChat(projectId: string, sessionId: string, projectTitle: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    content: `Hey! I'm an AI trained on ${projectTitle}. Ask me anything — what I built, how I built it, or what I'd do differently.`,
    timestamp: new Date().toISOString()
  }])
  
  const [isStreaming, setIsStreaming] = useState(false)
  const [rating, setRating] = useState<1 | -1 | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    const newMessage: ChatMessage = { role: 'user', content, timestamp: new Date().toISOString() }
    const updatedMessages = [...messages, newMessage]
    
    setMessages(updatedMessages)
    setIsStreaming(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: projectId,
          session_id: sessionId,
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content }))
        })
      })

      if (!response.ok) {
         throw new Error('Failed to get response')
      }

      if (!response.body) return

      // Add a placeholder assistant message that we will stream into
      setMessages(prev => [...prev, { role: 'assistant', content: '', timestamp: new Date().toISOString() }])

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        const chunkValue = decoder.decode(value)

        setMessages((prev) => {
          const newMsgs = [...prev]
          const lastIndex = newMsgs.length - 1
          if (newMsgs[lastIndex].role === 'assistant') {
             newMsgs[lastIndex].content += chunkValue
          }
          return newMsgs
        })
      }
      
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'System error: Failed to connect to neural network. Please try again later.', 
        timestamp: new Date().toISOString() 
      }])
    } finally {
      setIsStreaming(false)
    }
  }, [messages, projectId, sessionId])

  const submitRating = async (val: 1 | -1) => {
    setRating(val)
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'ai_chat_rated',
        project_id: projectId,
        session_id: sessionId,
        metadata: { rating: val }
      })
    }).catch(console.error) // Fire and forget
  }

  return {
    messages,
    isStreaming,
    sendMessage,
    sessionId,
    rating,
    submitRating
  }
}
