'use client'

import { Tldraw, createShapeId, Editor, BaseBoxShapeUtil, HTMLContainer, T, TLBaseShape } from 'tldraw'
import 'tldraw/tldraw.css'
import { useEffect, useState } from 'react'
import { CheckCircle, AlertCircle, PencilLine, Maximize2 } from 'lucide-react'

// ==========================================
// 1. ENGINE VISUAL: Custom Shape do Marketing OS
// O manifesto exigia um Shape customizado. Isso blinda erros de schema native do Tldraw
// e nos permite renderizar qualquer HTML TailWind complexo (Cards de Tráfego, Thumbnails).
// ==========================================

export type ITaskShape = TLBaseShape<'marketing-task', {
  title: string
  status: string
  color: string
  priority: string
  assignee: string
  w: number
  h: number
}>

export class TaskShapeUtil extends BaseBoxShapeUtil<ITaskShape> {
  static type = 'marketing-task' as const
  
  static props = {
    title: T.string,
    status: T.string,
    color: T.string,
    priority: T.string,
    assignee: T.string,
    w: T.number,
    h: T.number,
  }

  getDefaultProps(): ITaskShape['props'] {
    return {
      title: 'Tarefa',
      status: 'To Do',
      color: 'blue',
      priority: 'Média',
      assignee: 'MM',
      w: 240,
      h: 140,
    }
  }

  component(shape: ITaskShape) {
    const p = shape.props
    const isDone = p.status === 'Done'
    const isDoing = p.status === 'Doing'
    
    let bg = 'bg-blue-500/10 border-blue-500'
    let textC = 'text-blue-500'
    if (isDone) { bg = 'bg-emerald-500/10 border-emerald-500'; textC = 'text-emerald-500' }
    if (isDoing) { bg = 'bg-amber-500/10 border-amber-500'; textC = 'text-amber-500' }

    const isSmall = p.w < 200

    return (
      <HTMLContainer id={shape.id} style={{ pointerEvents: 'all' }}>
        <div 
          className={`w-full h-full flex flex-col p-4 rounded-[24px] border-2 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${bg} group relative overflow-hidden`}
          style={{ width: p.w, height: p.h }}
        >
           {/* Efeito de Reflexo Premium */}
           <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rotate-12" />

           <div className="flex justify-between items-start mb-2 relative z-10">
             <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-lg border-collapse shadow-sm ${bg} brightness-110`}>
               {p.status}
             </span>
             <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 border border-primary/30 flex items-center justify-center text-[9px] font-black text-white shadow-lg shadow-primary/20">
               {p.assignee}
             </div>
           </div>

           <h3 className={`font-black text-foreground leading-tight line-clamp-2 mb-2 flex-1 relative z-10 drop-shadow-sm ${isSmall ? 'text-xs' : 'text-base'}`}>{p.title}</h3>
           
           <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5 relative z-10">
             <div className="flex items-center space-x-1.5">
               <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px] ${p.priority === 'Alta' ? 'bg-rose-500 shadow-rose-500/50' : 'bg-blue-500 shadow-blue-500/50'}`} />
               {!isSmall && <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">{p.priority}</span>}
             </div>
             <div className="flex items-center space-x-1 opacity-40 group-hover:opacity-100 transition-opacity">
               <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[8px] text-muted-foreground font-black uppercase tracking-tighter">Live Sync</span>
             </div>
           </div>
        </div>
      </HTMLContainer>
    )
  }

  indicator(shape: ITaskShape) {
    return <rect width={shape.props.w} height={shape.props.h} rx={12} ry={12} />
  }
}

// Array de utilitários de shapes injetados no Editor
const customShapeUtils = [TaskShapeUtil]

// ==========================================
// 2. INTEGRAÇÃO REACT x TLDRAW (O Componente Principal)
// ==========================================

export default function CreativeRoom({ projectId, tasks = [], onSelectTask }: { projectId: string, tasks?: any[], onSelectTask?: (task: any) => void }) {
  const [mounted, setMounted] = useState(false)
  const [editor, setEditor] = useState<Editor | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!editor) return

    // 1. Organização Hierárquica: Demandas Principais vs Subtarefas
    const rootTasks = tasks.filter(t => !t.parent_id || !tasks.some(p => p.id === t.parent_id))
    const subTasks = tasks.filter(t => !!t.parent_id && tasks.some(p => p.id === t.parent_id))

    let currentX = 100

    rootTasks.forEach((root) => {
      // 2. Processar Subtarefas deste Root em PIRÂMIDE para calcular largura
      const children = subTasks.filter(st => st.parent_id === root.id)
      const subCardW = 180
      const subCardH = 100
      const subGap = 40
      
      // Largura que este bloco (pirâmide) ocupa
      const pyramidWidth = children.length > 0 
        ? (children.length * subCardW) + ((children.length - 1) * subGap)
        : 240 // Largura do card pai

      // A rootX deve garantir que a pirâmide caiba. Se a pirâmide for maior que o card pai,
      // centralizamos o card pai no topo da pirâmide.
      const rootX = children.length > 1 
        ? currentX + (pyramidWidth / 2) - 120 
        : currentX
      
      const rootY = 100
      const rootShapeId = createShapeId(root.id)
      const cor = root.status === 'Done' ? 'green' : root.status === 'Doing' ? 'yellow' : 'blue'

      // Upsert Root Task (Pai)
      const rootProps = {
        title: root.title || 'Sem título',
        status: root.status || 'To Do',
        priority: root.priority || 'Média',
        assignee: 'MM',
        color: cor,
        w: 240,
        h: 140
      }

      if (!editor.getShape(rootShapeId)) {
        editor.createShape({ id: rootShapeId, type: 'marketing-task', x: rootX, y: rootY, props: rootProps })
      } else {
        editor.updateShape({ id: rootShapeId, x: rootX, y: rootY, props: rootProps })
      }

      if (children.length > 0) {
        const startX = rootX + 120 - (pyramidWidth / 2)

        children.forEach((child, childIdx) => {
          const childX = startX + childIdx * (subCardW + subGap)
          const childY = rootY + 280 // Abaixo do pai
          const childShapeId = createShapeId(child.id)
          const childCor = child.status === 'Done' ? 'green' : child.status === 'Doing' ? 'yellow' : 'blue'

          const childProps = {
            title: child.title || 'Sem título',
            status: child.status || 'To Do',
            priority: child.priority || 'Média',
            assignee: 'MM',
            color: childCor,
            w: subCardW,
            h: subCardH
          }

          // Upsert Child Task (Mini Card)
          if (!editor.getShape(childShapeId)) {
            editor.createShape({ id: childShapeId, type: 'marketing-task', x: childX, y: childY, props: childProps })
          } else {
            editor.updateShape({ id: childShapeId, x: childX, y: childY, props: childProps })
          }

          // 3. Criar Seta de Conexão (Parent -> Child)
          const arrowId = createShapeId(`arrow-${root.id}-${child.id}`)
          if (!editor.getShape(arrowId)) {
            editor.createShape({
              id: arrowId,
              type: 'arrow',
              props: {
                color: 'grey',
                dash: 'draw',
                start: { x: 0, y: 0 },
                end: { x: 0, y: 0 },
              }
            })

            editor.createBinding({
              type: 'arrow',
              fromId: arrowId,
              toId: rootShapeId,
              props: { terminal: 'start', normalizedAnchor: { x: 0.5, y: 1 }, isExact: false }
            })
            editor.createBinding({
              type: 'arrow',
              fromId: arrowId,
              toId: childShapeId,
              props: { terminal: 'end', normalizedAnchor: { x: 0.5, y: 0 }, isExact: false }
            })
          }
        })
      }

      // Atualiza o X acumulado para o próximo bloco:
      // Pega o máximo entre a largura do pai (240) e da pirâmide, e soma um gap de 150px
      currentX += Math.max(240, pyramidWidth) + 150
    })

    // Caso existam tarefas que são subtasks mas o pai não está na lista (raro), 
    // poderíamos listá-las separadamente, mas por agora o foco é a hierarquia.
  }, [tasks, editor])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 group/canvas">
      <Tldraw 
         inferDarkMode 
         hideUi={true} // ESCONDE UI NATIVA
         components={{
           Toolbar: null,
           StylePanel: null,
           HelpMenu: null,
           NavigationPanel: null, // Mantendo limpo mas funcional
           ContextMenu: null
         }}
         shapeUtils={customShapeUtils}
         onMount={(ed) => {
           setEditor(ed)
           
           // Escuta cliques nos shapes para abrir o Side Peek
           ed.on('event', (info) => {
             if (info.name === 'pointer_up') {
               const selectedIds = ed.getSelectedShapeIds()
               if (selectedIds.length === 1) {
                 const shape = ed.getShape(selectedIds[0])
                 if (shape?.type === 'marketing-task') {
                   const taskId = selectedIds[0].replace('shape:', '')
                   const originalTask = tasks.find(t => t.id === taskId)
                   if (originalTask && onSelectTask) {
                     onSelectTask(originalTask)
                   }
                 }
               }
             }
           })
         }} 
      />

      {/* TOOLBAR CUSTOMIZADA FLUTUANTE */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[100] flex items-center space-x-2 bg-card/80 backdrop-blur-xl border border-border p-2 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
        <button className="flex items-center space-x-2 px-4 py-2 hover:bg-primary/20 hover:text-primary rounded-xl transition-all font-bold text-xs" onClick={() => alert("Criando nova tarefa no banco...")}>
          <PencilLine className="w-4 h-4" />
          <span>Novo Node</span>
        </button>
        <div className="w-px h-4 bg-border" />
        <button className="flex items-center space-x-2 px-4 py-2 hover:bg-accent rounded-xl transition-all font-bold text-xs" onClick={() => editor?.zoomToFit()}>
          <Maximize2 className="w-4 h-4" />
          <span>Fit Screen</span>
        </button>
      </div>
    </div>
  )
}
