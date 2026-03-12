'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useScroll, useTransform, motion } from 'framer-motion'

// Main internal component that uses Three context
function Nodes({ isMobile, scrollYProgress }: { isMobile: boolean, scrollYProgress: number }) {
  const groupRef = useRef<THREE.Group>(null)
  
  // Create nodes with fixed random positions
  const nodeCount = isMobile ? 60 : 150
  
  const nodes = useMemo(() => {
    const temp = []
    for (let i = 0; i < nodeCount; i++) {
      temp.push(new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10
      ))
    }
    return temp
  }, [nodeCount])

  // Create connections based on distance threshold
  const [lineGeometry] = useState(() => new THREE.BufferGeometry())
  
  useMemo(() => {
    if (isMobile) {
      lineGeometry.setFromPoints([])
      return
    }

    const points = []
    for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
            const dist = nodes[i].distanceTo(nodes[j])
            if (dist < 3.5) {
                points.push(nodes[i], nodes[j])
            }
        }
    }
    lineGeometry.setFromPoints(points)
  }, [nodes, isMobile, lineGeometry, nodeCount])

  // Instanced mesh for better performance on nodes
  const sphereGeo = new THREE.SphereGeometry(0.05, 8, 8)
  const sphereMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 })

  // Camera + Mouse interactions
  const { camera, size } = useThree()
  const mouseRef = useRef({ x: 0, y: 0 })
  const targetCameraZ = useRef(15)
  const [opacityScale, setOpacityScale] = useState(1)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / size.width - 0.5) * 2
      mouseRef.current.y = -(e.clientY / size.height - 0.5) * 2
    }
    
    if (!isMobile) {
       window.addEventListener('mousemove', handleMouseMove)
    }
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [size, isMobile])

  // Update loop
  useFrame((state, delta) => {
    if (!groupRef.current) return
    
    // Auto-rotate scene
    groupRef.current.rotation.y += 0.0003

    // Update opacity based on scroll (assuming roughly 0 to 1 for hero height)
    setOpacityScale(Math.max(0, 1 - scrollYProgress * 1.5))
    sphereMat.opacity = 0.7 * opacityScale

    // Camera perspective shift based on mouse and scroll
    targetCameraZ.current = 15 + scrollYProgress * 10
    camera.position.z += (targetCameraZ.current - camera.position.z) * 0.1

    if (!isMobile) {
        const targetX = mouseRef.current.x * 0.3 * 10
        const targetY = mouseRef.current.y * 0.2 * 10
        
        // Tilt scene
        groupRef.current.rotation.x += (targetY * 0.05 - groupRef.current.rotation.x) * 0.1
        groupRef.current.rotation.y += (targetX * 0.05 - groupRef.current.rotation.y) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      <instancedMesh args={[sphereGeo, sphereMat, nodeCount]} renderOrder={1}>
         {nodes.map((pos, i) => {
            const dummy = new THREE.Object3D()
            dummy.position.copy(pos)
            dummy.updateMatrix()
            return <primitive key={i} object={dummy} attach={`instanceMatrix-${i}`} />
         })}
      </instancedMesh>
      
      {!isMobile && (
        <lineSegments geometry={lineGeometry}>
          <lineBasicMaterial attach="material" color={0xffffff} transparent opacity={0.15 * opacityScale} />
        </lineSegments>
      )}
    </group>
  )
}

// Wrapper to dynamically handle mount/mount state
export function ThreeScene({ scrollProgress }: { scrollProgress: number }) {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsMobile(window.innerWidth < 768)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <Canvas 
        camera={{ position: [0, 0, 15], fov: 60 }} 
        dpr={Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio : 1)} // Cap DPR for perf
      >
        <Nodes isMobile={isMobile} scrollYProgress={scrollProgress} />
      </Canvas>
    </div>
  )
}
