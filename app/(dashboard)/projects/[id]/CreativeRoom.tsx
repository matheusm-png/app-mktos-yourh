'use client'

import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { useEffect, useState } from 'react'

export default function CreativeRoom({ projectId, initialTasks }: { projectId: string, initialTasks: any[] }) {
  // Isso carrega o canvas infinito do tldraw.
  // Na versão final nós podemos sincronizar o estado store do Tldraw com o Supabase.
  const [mounted, setMounted] = useState(false)

  // Prevenir erros de renderização no SSR com Nextjs e o Canvas
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* O Tldraw traz uma experiência muito parecida com Milanote e FigJam nativamente */}
      <Tldraw inferDarkMode />
    </div>
  )
}
