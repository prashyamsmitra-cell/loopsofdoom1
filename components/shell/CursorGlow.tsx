'use client'

import { useEffect, useState, useRef } from 'react'

export function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  
  const [isHoveringPointer, setIsHoveringPointer] = useState(false)
  const [isHoveringText, setIsHoveringText] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  // Track coordinates
  const mouse = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    // Don't render on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true)
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      
      // Update dot instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const cursorState = target.closest('[data-cursor]')?.getAttribute('data-cursor')
      
      if (cursorState === 'pointer' || target.tagName === 'A' || target.tagName === 'BUTTON') {
        setIsHoveringPointer(true)
        setIsHoveringText(false)
      } else if (cursorState === 'text' || target.tagName === 'P' || target.tagName === 'H1' || target.tagName === 'H2' || target.tagName === 'SPAN') {
        setIsHoveringText(true)
        setIsHoveringPointer(false)
      } else {
        setIsHoveringPointer(false)
        setIsHoveringText(false)
      }
    }

    // Animation loop for the lagging ring
    const animate = () => {
      // Lerp logic: current + (target - current) * friction
      ring.current.x += (mouse.current.x - ring.current.x) * 0.15
      ring.current.y += (mouse.current.y - ring.current.y) * 0.15

      if (ringRef.current) {
        const xOffset = isHoveringText ? -1 : -16
        const yOffset = isHoveringText ? -12 : -16
        
        ringRef.current.style.transform = `translate(${ring.current.x + xOffset}px, ${ring.current.y + yOffset}px)`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)
    
    // Start animation loop
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      cancelAnimationFrame(rafRef.current)
    }
  }, [isHoveringText, isHoveringPointer])

  if (isTouchDevice) return null

  // Determine dynamic ring styles based on state
  let ringClasses = "fixed top-0 left-0 pointer-events-none z-[9998] rounded-full transition-all duration-300 ease-out"
  
  if (isHoveringPointer) {
    ringClasses += " w-16 h-16 bg-brand-red opacity-30 border-0 -ml-8 -mt-8"
  } else if (isHoveringText) {
    ringClasses += " w-0.5 h-6 bg-brand-red border-0 opacity-80"
  } else {
    ringClasses += " w-8 h-8 border-[1.5px] border-brand-red opacity-50 bg-transparent"
  }

  return (
    <>
      {/* Instant tracking dot */}
      <div 
        ref={dotRef}
        className={`fixed top-0 left-0 w-2 h-2 bg-brand-red rounded-full pointer-events-none z-[9998] -ml-1 -mt-1 transition-opacity duration-300 ${isHoveringText ? 'opacity-0' : 'opacity-100'}`}
      />
      
      {/* Lagging ring/morph geometry */}
      <div 
        ref={ringRef}
        className={ringClasses}
      />
    </>
  )
}
