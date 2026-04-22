'use client'

import { useState, useEffect } from 'react'
import { 
  FileImage, 
  Link as LinkIcon, 
  CheckSquare, 
  Search, 
  Sparkles, 
  LayoutGrid, 
  FileText, 
  Users,
  AtSign,
  Heading1,
  Heading2,
  Heading3,
  List as ListIcon,
  ListOrdered,
  Quote,
  Minus,
  Code
} from 'lucide-react'

export function SlashCommandPalette({ onAction }: { onAction: (action: string) => void }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
      
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        setOpen(true)
      }
      
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  if (!open) return null

  const COMMANDS = [
    { id: 'task', title: 'Criar nova Tarefa', icon: CheckSquare, desc: '/task', category: 'Marketing OS' },
    { id: 'asset', title: 'Conectar Google Drive', icon: FileImage, desc: '/asset', category: 'Marketing OS' },
    { id: 'utm', title: 'Gerar Link UTM', icon: LinkIcon, desc: '/utm', category: 'Marketing OS' },
    { id: 'briefing', title: 'Gerar Briefing Estruturado', icon: FileText, desc: '/briefing', category: 'Marketing OS' },
    { id: 'magic', title: 'Magic Breakdown (AI)', icon: Sparkles, desc: '/magic', category: 'Inteligência' },
    
    // Blocos Notion
    { id: 'h1', title: 'Título 1', icon: Heading1, desc: '/h1', category: 'Blocos' },
    { id: 'h2', title: 'Título 2', icon: Heading2, desc: '/h2', category: 'Blocos' },
    { id: 'h3', title: 'Título 3', icon: Heading3, desc: '/h3', category: 'Blocos' },
    { id: 'bullet', title: 'Lista de Tópicos', icon: ListIcon, desc: '/bullet', category: 'Blocos' },
    { id: 'numbered', title: 'Lista Numerada', icon: ListOrdered, desc: '/list', category: 'Blocos' },
    { id: 'quote', title: 'Citação', icon: Quote, desc: '/quote', category: 'Blocos' },
    { id: 'divider', title: 'Divisor', icon: Minus, desc: '/div', category: 'Blocos' },
    { id: 'code', title: 'Snippet de Código', icon: Code, desc: '/code', category: 'Blocos' },

    { id: 'kanban', title: 'Ir para Quadro Kanban', icon: LayoutGrid, desc: '/kanban', category: 'Navegação' },
    { id: 'gallery', title: 'Ir para Galeria de Assets', icon: FileImage, desc: '/gallery', category: 'Navegação' },
    { id: 'mention', title: 'Mencionar Time', icon: AtSign, desc: '/mention', category: 'Social' },
  ]

  const filtered = COMMANDS.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.desc.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="fixed inset-0 bg-background/80 z-[199] backdrop-blur-sm cursor-pointer" onClick={() => setOpen(false)} />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-[90vw] bg-card border border-border rounded-2xl shadow-2xl z-[200] overflow-hidden flex flex-col font-sans animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center border-b border-border px-6 py-4">
          <Search className="w-5 h-5 text-muted-foreground mr-3" />
          <input 
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-foreground text-lg placeholder:text-muted-foreground/30 border-none ring-0 p-0" 
            placeholder="Digite um comando ou procure..." 
          />
        </div>
        
        <div className="max-h-[450px] overflow-y-auto p-3 custom-scrollbar">
          {filtered.length > 0 ? (
            <div className="space-y-4">
               {Array.from(new Set(filtered.map(c => c.category))).map(cat => (
                 <div key={cat} className="space-y-1">
                    <div className="text-[10px] font-black text-muted-foreground/40 uppercase px-3 py-2 mt-2 tracking-[0.2em] flex items-center">
                      {cat}
                      <div className="ml-2 h-px flex-1 bg-border/30" />
                    </div>
                    {filtered.filter(c => c.category === cat).map(cmd => (
                      <div 
                        key={cmd.id}
                        onClick={() => { setOpen(false); onAction(cmd.id) }}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer hover:bg-primary hover:text-white group transition-all"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-lg bg-accent/50 flex items-center justify-center mr-3 group-hover:bg-white/20 transition-colors">
                            <cmd.icon className="h-4 w-4 text-muted-foreground group-hover:text-white" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">{cmd.title}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                           <span className="text-[9px] bg-accent/50 px-2 py-1 rounded-md font-black text-muted-foreground group-hover:bg-black/20 group-hover:text-white/80">{cmd.desc}</span>
                        </div>
                      </div>
                    ))}
                 </div>
               ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground text-sm">
              Nenhum comando encontrado para "{search}"
            </div>
          )}
        </div>
      </div>
    </>
  )
}
