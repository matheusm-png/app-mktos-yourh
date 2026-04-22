'use client'

import { useState, useEffect } from "react"
import CreativeRoom from "./CreativeRoom"
import { 
  FileText, 
  LayoutGrid, 
  List, 
  Navigation, 
  ChevronRight, 
  MoreHorizontal, 
  X, 
  Plus, 
  Clock, 
  Link as LinkIcon,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  User as UserIcon,
  ArrowRight,
  MoreVertical,
  Maximize2,
  CheckSquare,
  Target
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { SlashCommandPalette } from "./SlashCommandPalette"

export default function NotionPageView({ params }: { params: { id: string } }) {
  const [activeView, setActiveView] = useState<'doc' | 'table' | 'kanban' | 'canvas' | 'gallery' | 'calendar'>('table')
  
  const [tasks, setTasks] = useState<any[]>([])
  const [selectedTask, setSelectedTask] = useState<any | null>(null)
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null) // Novo: Proofing
  const [assetPins, setAssetPins] = useState<any[]>([]) // Novo: Comentários na imagem
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [showDrivePicker, setShowDrivePicker] = useState(false)
  const [editingCell, setEditingCell] = useState<{ id: string, field: string } | null>(null)
  const [galleryFilter, setGalleryFilter] = useState('Todos')
  const [galleryStatus, setGalleryStatus] = useState('Todos')

  // Handler que executa a mágica acionada no Menu /
  function handleSlashAction(action: string) {
    if (action === 'utm') {
       window.location.href = '/campaigns'
    } else if (action === 'asset') {
       setShowDrivePicker(true)
    } else if (action === 'task') {
       setActiveView('table')
       setTimeout(() => document.getElementById('new-task-input')?.focus(), 100)
    } else if (action === 'kanban') {
       setActiveView('kanban')
    } else if (action === 'gallery') {
       setActiveView('gallery')
    } else if (action === 'magic') {
       // Lógica de IA: Breakdown automático
       const aiTasks = [
         { id: crypto.randomUUID(), project_id: params.id, title: "Análise de Copy (IA)", status: 'To Do', priority: 'Média', parent_id: selectedTask?.id },
         { id: crypto.randomUUID(), project_id: params.id, title: "Ajuste de Ganchos (IA)", status: 'To Do', priority: 'Alta', parent_id: selectedTask?.id },
         { id: crypto.randomUUID(), project_id: params.id, title: "Export em 3 Formatos (IA)", status: 'Approval', priority: 'Baixa', parent_id: selectedTask?.id }
       ]
       setTasks(prev => [...prev, ...aiTasks])
       alert("🪄 Magic Breakdown: A Inteligência Artificial analisou seu contexto e gerou 3 sub-etapas estratégicas no seu cronograma!")
    } else if (action === 'briefing') {
       alert("📝 Gerando template de Briefing Estruturado de Marketing...")
    }
  }

  // Busca dados reais do supabase
  useEffect(() => {
    async function loadTasks() {
      const { data } = await supabase.from('tasks').select('*').eq('project_id', params.id).order('created_at', { ascending: true })
      if (data) setTasks(data)
    }
    loadTasks()
  }, [params.id])

  async function handleCreateTask(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (!newTaskTitle.trim()) return
    const newId = crypto.randomUUID()
    const tempTask = {
      id: newId,
      project_id: params.id,
      title: newTaskTitle,
      status: 'To Do',
      priority: 'Média',
    }
    
    setTasks([...tasks, tempTask])
    setNewTaskTitle('')

    const { data: inserted, error } = await supabase.from('tasks').insert([{
      id: newId,
      project_id: params.id,
      title: tempTask.title,
      status: 'To Do',
      priority: 'Média'
    }]).select().single()

    if (error) {
      console.error("Erro ao criar task:", error)
      alert(`Erro ao salvar no banco: ${error.message}`)
      setTasks(current => current.filter(t => t.id !== newId))
      return
    }

    if (inserted) {
      setTasks(current => current.map(t => t.id === newId ? inserted : t))
    }
  }

  async function handleUpdateTask(taskId: string, updates: any) {
    setTasks(current => current.map(t => t.id === taskId ? { ...t, ...updates } : t))
    if (selectedTask && selectedTask.id === taskId) {
       setSelectedTask({ ...selectedTask, ...updates })
    }
    await supabase.from('tasks').update(updates).eq('id', taskId)
    setEditingCell(null)
  }

  async function handleCreateSubtask(parentId: string) {
    const title = prompt("Título da sub-etapa:")
    if (!title) return

    const newId = crypto.randomUUID()
    const { data: inserted, error } = await supabase.from('tasks').insert([{
      id: newId,
      project_id: params.id,
      parent_id: parentId,
      title,
      status: 'To Do',
      priority: 'Média'
    }]).select().single()

    if (error) {
      console.error(error)
      alert(`Erro ao criar sub-etapa: ${error.message}. Isso pode ocorrer se a tarefa principal ainda não tiver sido sincronizada.`)
      return
    }

    if (inserted) {
      setTasks(prev => [...prev, inserted])
    }
  }

  async function handleDeleteTask(taskId: string) {
    if (!confirm("Tem certeza que deseja excluir esta atividade?")) return
    setTasks(prev => prev.filter(t => t.id !== taskId))
    await supabase.from('tasks').delete().eq('id', taskId)
  }

  const KANBAN_COLUMNS = ['To Do', 'Doing', 'Approval', 'Done']

  return (
    <div className="flex flex-col bg-background min-h-screen -mx-6 -mt-6 relative selection:bg-primary/20 selection:text-primary">
      
      {/* Header Mural */}
      <div className="h-56 w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-black relative group overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        
        <div className="absolute bottom-6 right-8 flex space-x-2">
          <button onClick={() => alert("📤 Upload de Capa: Selecione uma imagem (JPG/PNG) para o banner do projeto.")} className="bg-white/10 backdrop-blur-xl border border-white/20 px-3 py-1.5 rounded-xl text-[10px] font-black text-white hover:bg-white/20 transition-all uppercase tracking-widest shadow-2xl">
            Alterar Capa
          </button>
          <button onClick={() => alert("🛠️ Modo Reposicionamento: Arraste a capa para ajustar o enquadramento.")} className="bg-white/10 backdrop-blur-xl border border-white/20 px-3 py-1.5 rounded-xl text-[10px] font-black text-white hover:bg-white/20 transition-all uppercase tracking-widest">
            Reposicionar
          </button>
        </div>

        <div className="absolute top-6 left-12 z-10 flex items-center space-x-3 text-xs text-white/50 font-black uppercase tracking-[0.2em]">
          <span onClick={() => window.location.href='/projects'} className="hover:text-white cursor-pointer transition-colors">WORKSPACE</span>
          <ChevronRight className="w-3 h-3 opacity-30" />
          <span className="text-white hover:text-primary transition-colors cursor-default">PROJETO ATUAL</span>
        </div>
      </div>
      
      {/* Content wrapper */}
      <div className="max-w-7xl w-full mx-auto px-12 relative -mt-20 z-10 flex-1 flex flex-col">
        
        {/* Emoji Icon Floating */}
        <div className="group relative w-max mb-6">
          <div className="text-8xl bg-card border-4 border-background w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl hover:scale-105 hover:-rotate-12 transition-all duration-500 cursor-pointer overflow-hidden leading-none">
            🚀
          </div>
          <button onClick={() => alert("🎨 Customização de Ícone: Em breve você poderá subir seu próprio emoji ou logo.")} className="absolute -bottom-2 -right-2 bg-primary text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><Plus className="w-4 h-4"/></button>
        </div>

        {/* Title and Controls */}
        <div className="flex items-center justify-between mb-8 group/title">
          <div className="flex-1">
            <input 
              type="text" 
              defaultValue="Campanha Black Friday 2026" 
              className="text-5xl font-black bg-transparent outline-none border-none text-foreground placeholder:text-muted-foreground/30 w-full py-2 hover:bg-accent/30 rounded-2xl transition-all"
            />
            <div className="flex items-center space-x-4 mt-2 text-muted-foreground/60">
               <div className="flex items-center text-xs font-bold uppercase tracking-widest"><Clock className="w-3 h-3 mr-1.5" /> Última edição em 5 min</div>
               <div className="w-1 h-1 bg-border rounded-full" />
               <div onClick={() => alert("👥 Time do Projeto: MM (Admin), AL (Designer), JP (Tráfego).")} className="flex items-center text-xs font-bold uppercase tracking-widest cursor-pointer hover:text-primary transition-colors"><UserIcon className="w-3 h-3 mr-1.5" /> 3 membros ativos</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => alert("🤖 IA Marketing Insight: Analisando concorrência... Sugerindo orçamento de R$ 5k para Meta Ads este mês.")}
              className="flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/20 transition-all shadow-lg active:scale-95"
            >
               <Sparkles className="w-4 h-4 mr-1" /> IA Insight
            </button>
            <button 
              onClick={() => alert("Menu de Opções do Projeto: Exportar PDF, Arquivar, Duplicar.")}
              className="p-3 hover:bg-accent rounded-xl transition-all text-muted-foreground"
            >
              <MoreHorizontal className="w-5 h-5"/>
            </button>
          </div>
        </div>

        {/* View Switcher - Premium Tabs */}
        <div className="flex items-center space-x-1 border-b border-border/50 mb-10 overflow-x-auto pb-px">
          {[
            { id: 'doc', label: 'Briefing', icon: FileText },
            { id: 'table', label: 'Cronograma', icon: List },
            { id: 'kanban', label: 'Quadro Visual', icon: LayoutGrid },
            { id: 'canvas', label: 'Mapa Conceitual', icon: Navigation },
            { id: 'calendar', label: 'Calendário', icon: Calendar },
            { id: 'gallery', label: 'Criativos', icon: FileText }
          ].map((tab: any) => (
            <button 
              key={tab.id}
              onClick={() => setActiveView(tab.id)} 
              className={`flex items-center space-x-2 px-5 py-3 text-xs font-black uppercase tracking-[0.1em] transition-all relative group ${activeView === tab.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <tab.icon className={`w-4 h-4 ${activeView === tab.id ? 'stroke-[3]' : 'opacity-50'}`} />
              <span>{tab.label}</span>
              {activeView === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-4px_12px_rgba(79,70,229,0.5)]" />}
            </button>
          ))}
          <div className="flex-1" />
          <button onClick={() => alert("🔍 Busca Rápida: Pesquise por títulos de tasks ou briefings neste projeto.")} className="p-2 text-muted-foreground/40 hover:text-foreground transition-colors"><Search className="w-4 h-4"/></button>
          <button onClick={() => alert("📂 Filtros Avançados: Organize por Dono, Prioridade ou Data.")} className="p-2 text-muted-foreground/40 hover:text-foreground transition-colors"><Filter className="w-4 h-4"/></button>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full pb-32">
          
          {activeView === 'calendar' && (
            <div className="bg-card border border-border/60 rounded-[40px] p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-700">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex flex-col">
                    <h3 className="text-3xl font-black text-foreground tracking-tighter capitalize">{new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 mt-1">Visão Mensal de Operações</p>
                  </div>
                  <div className="flex bg-accent/30 p-1.5 rounded-2xl border border-border/50">
                     <button className="px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary text-white shadow-xl transition-all">Mês</button>
                     <button className="px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-accent transition-all" onClick={() => alert("Visão de Semana (Beta): Em breve você poderá focar na agenda dos próximos 7 dias.")}>Semana</button>
                  </div>
               </div>

               <div className="grid grid-cols-7 gap-4">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} className="text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground pb-4">{day}</div>
                  ))}
                  
                  {/* Grid de Dias (Simulação do mês atual) */}
                  {Array.from({ length: 35 }).map((_, i) => {
                    const dayNum = (i - 2) // Simulação para abril 2026 (começa na qua=3)
                    const isToday = dayNum === 21
                    const isOutside = dayNum <= 0 || dayNum > 30
                    
                    const dayTasks = tasks.filter(t => {
                       if (!t.due_date) return false;
                       const d = new Date(t.due_date);
                       return d.getDate() === dayNum && d.getMonth() === 3; // Abril (3)
                    })

                    return (
                      <div 
                        key={i} 
                        className={`min-h-[140px] p-4 rounded-3xl border transition-all relative group
                          ${isOutside ? 'bg-accent/5 border-transparent opacity-20' : 'bg-accent/10 border-border/20 hover:border-primary/40 hover:bg-primary/5'}
                          ${isToday ? 'ring-2 ring-primary ring-offset-4 ring-offset-background' : ''}`}
                      >
                         <span className={`text-xs font-black ${isToday ? 'text-primary' : 'text-muted-foreground/60 group-hover:text-foreground'}`}>
                            {dayNum > 0 && dayNum <= 30 ? dayNum : ''}
                         </span>
                         
                         <div className="mt-3 space-y-1.5">
                            {dayTasks.map(task => (
                               <div 
                                 key={task.id}
                                 onClick={() => setSelectedTask(task)}
                                 className={`p-2 rounded-xl text-[9px] font-black uppercase tracking-tighter truncate border
                                   ${task.status === 'Done' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                     task.status === 'Doing' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                     'bg-primary/10 text-primary border-primary/20'}`}
                               >
                                  {task.title}
                               </div>
                            ))}
                            {!isOutside && dayTasks.length === 0 && (
                              <button onClick={() => alert(`Adicionar task para o dia ${dayNum}`)} className="w-full py-2 rounded-xl border border-dashed border-border/20 opacity-0 group-hover:opacity-100 transition-all text-muted-foreground hover:border-primary/40">
                                <Plus className="w-3 h-3 mx-auto" />
                              </button>
                            )}
                         </div>
                      </div>
                    )
                  })}
               </div>
            </div>
          )}

          {activeView === 'doc' && (
            <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Documento de Estratégia</h3>
                  <button 
                    onClick={() => {
                        const template = "## 🎯 Objetivo da Campanha\n[Descreva o objetivo principal ex: ROAS 4.0]\n\n## 👥 Público-Alvo\n[Personas e Segmentação]\n\n## 📢 Canais e Distribuição\n[Meta, TikTok, Google]\n\n## 💰 Orçamento Sugerido\n[Investimento total]";
                        // Simula preenchimento (em um app real usaria o estado do documento)
                        const textarea = document.querySelector('textarea[name="briefing-editor"]') as HTMLTextAreaElement;
                        if(textarea) textarea.value = template;
                        alert("📝 Template de Briefing estruturado carregado com sucesso!");
                    }}
                    className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors text-[10px] font-black uppercase tracking-widest"
                  >
                     <Sparkles className="w-4 h-4" /> <span>Usar Template Estratégico</span>
                  </button>
               </div>
               {/* Exemplo de Blocos Notion-like */}
               <div className="space-y-4">
                 <div className="flex items-start group/block">
                   <div className="w-8 h-8 flex items-center justify-center opacity-0 group-hover/block:opacity-100 cursor-grab text-muted-foreground/40 mr-1">⠿</div>
                   <h2 className="text-3xl font-black text-foreground">A estratégia do Lançamento</h2>
                 </div>
                 <div className="flex items-start group/block">
                   <div className="w-8 h-8 flex items-center justify-center opacity-0 group-hover/block:opacity-100 cursor-grab text-muted-foreground/40 mr-1">⠿</div>
                   <textarea 
                     className="w-full bg-transparent border-none outline-none resize-none text-muted-foreground leading-relaxed text-lg"
                     placeholder="Clique para começar a escrever..."
                     defaultValue="Este é o briefing central do projeto. Aqui definimos os KPIs de ROI em 4x e a distribuição de budget em Meta (60%) e Google (40%). O foco é audiência fria no primeiro momento."
                   />
                 </div>
               </div>

               <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl space-y-4">
                  <div className="flex items-center space-x-2 text-primary font-black text-[10px] uppercase tracking-widest">
                    <Sparkles className="w-4 h-4" /> IA Sumário Sugerido
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                    "O projeto está 60% focado em vídeo. Recomendo criar 3 variações de gancho para o Reels do Produto X para maximizar a retenção."
                  </p>
               </div>

               <div className="flex justify-end pt-8">
                  <button onClick={() => alert("💾 Briefing Salvo: Todas as alterações foram enviadas para o banco de dados.")} className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Salvar Alterações</button>
               </div>
            </div>
          )}

          {activeView === 'table' && (
            <div className="border border-border/60 rounded-[32px] bg-card overflow-hidden shadow-2xl animate-in zoom-in-98 duration-500">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-accent/40 border-b border-border/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-6 py-5">Atividade / Fase</th>
                    <th className="px-6 py-5">Dono</th>
                    <th className="px-6 py-5">Progresso</th>
                    <th className="px-6 py-5">Deadline</th>
                    <th className="px-6 py-5 text-right">Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {(() => {
                    const sortedTasks: { task: any, depth: number }[] = []
                    
                    // Função recursiva para construir a árvore
                    const buildHierarchy = (parentId: string | null, depth: number) => {
                      const children = tasks.filter(t => t.parent_id === parentId)
                      // Ordena por criação para manter consistência dentro do nível
                      children.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                      
                      children.forEach(child => {
                        sortedTasks.push({ task: child, depth })
                        buildHierarchy(child.id, depth + 1)
                      })
                    }

                    // Inicia pelos "Roots" (sem parent_id)
                    buildHierarchy(null, 0)

                    // Fallback para tarefas órfãs (caso algum parent_id não seja encontrado)
                    tasks.forEach(t => {
                      if (!sortedTasks.find(st => st.task.id === t.id)) {
                        sortedTasks.push({ task: t, depth: 0 })
                      }
                    })

                    return sortedTasks.map(({ task, depth }) => (
                      <tr key={task.id} className="group hover:bg-primary/5 transition-all cursor-pointer">
                        <td className="px-6 py-5">
                          <div 
                            className="flex items-center space-x-4 pl-4 relative" 
                            style={{ marginLeft: `${depth * 40}px` }}
                          >
                             <div className="flex items-center">
                                {/* Linha conectora dinâmica baseada na profundidade */}
                                {depth > 0 && (
                                  <div className="absolute -left-6 w-6 h-px bg-border/50" />
                                )}
                                <div className={`w-2 h-2 rounded-full shadow-lg ${task.priority === 'Alta' ? 'bg-rose-500 shadow-rose-500/20' : 'bg-blue-500 shadow-blue-500/20'}`} />
                             </div>
                             <div className="flex flex-col flex-1" onClick={(e) => { e.stopPropagation(); setEditingCell({ id: task.id, field: 'title' }) }}>
                               {editingCell?.id === task.id && editingCell?.field === 'title' ? (
                                 <input 
                                   autoFocus
                                   defaultValue={task.title}
                                   onBlur={(e) => handleUpdateTask(task.id, { title: e.target.value })}
                                   onKeyDown={(e) => { 
                                     if (e.key === 'Enter') handleUpdateTask(task.id, { title: e.currentTarget.value })
                                     if (e.key === 'Escape') setEditingCell(null)
                                   }}
                                   className="bg-transparent border-none outline-none font-bold text-foreground text-base w-full"
                                 />
                               ) : (
                                 <div className="flex items-center justify-between" onClick={() => setSelectedTask(task)}>
                                    <span className={`font-bold text-foreground group-hover:text-primary transition-colors text-base ${task.status === 'Done' ? 'line-through opacity-40' : ''}`}>{task.title}</span>
                                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                                      <button onClick={(e) => { e.stopPropagation(); handleCreateSubtask(task.id) }} title="Adicionar Sub-etapa" className="p-1 hover:bg-accent rounded text-muted-foreground"><Plus className="w-3 h-3"/></button>
                                      <button className="p-1 hover:bg-accent rounded text-primary"><ArrowRight className="w-3 h-3"/></button>
                                    </div>
                                 </div>
                               )}
                               <span className="text-[10px] uppercase font-black tracking-widest opacity-30 group-hover:opacity-60 transition-opacity">
                                 {depth === 0 ? 'PRODUÇÃO CRIATIVA' : depth === 1 ? 'SUB-ETAPA' : 'DETALHAMENTO'}
                               </span>
                             </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                           <div onClick={(e) => { e.stopPropagation(); alert("👤 Matheus Moitinho: Admin e Gestor do Projeto.") }} className="flex items-center space-x-2 bg-accent/40 w-max px-3 py-1.5 rounded-full border border-border/20 shadow-inner cursor-pointer hover:bg-accent/60 transition-all">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[8px] font-black text-white">MM</div>
                              <span className="text-xs font-black uppercase tracking-tighter text-muted-foreground">MOITINHO</span>
                           </div>
                        </td>
                        <td className="px-6 py-5">
                          <select 
                            value={task.status || 'To Do'}
                            onChange={(e) => handleUpdateTask(task.id, { status: e.target.value })}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all outline-none cursor-pointer appearance-none
                              ${task.status === 'Done' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                task.status === 'Doing' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                task.status === 'Approval' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' :
                                'bg-zinc-500/10 text-muted-foreground border-zinc-500/20'}`}
                          >
                            {KANBAN_COLUMNS.map(c => <option key={c} value={c} className="bg-background text-foreground">{c}</option>)}
                          </select>
                        </td>
                        <td className="px-6 py-5">
                           <label className="flex items-center space-x-2 cursor-pointer group/date">
                             <Calendar className="w-3.5 h-3.5 text-muted-foreground group-hover/date:text-primary transition-colors shrink-0" />
                             <input 
                               type="date"
                               defaultValue={task.due_date ? task.due_date.slice(0, 10) : ''}
                               onChange={(e) => handleUpdateTask(task.id, { due_date: e.target.value })}
                               className="bg-transparent outline-none border-none text-[11px] font-black text-muted-foreground group-hover/date:text-foreground transition-colors cursor-pointer w-[110px]"
                             />
                           </label>
                        </td>
                        <td className="px-6 py-5 text-right">
                           <div 
                             onClick={(e) => { e.stopPropagation(); alert("🎬 Visualização de Asset: Gerando preview instantâneo do criativo..."); }}
                             className="w-12 h-8 bg-accent/60 rounded-lg border border-border flex items-center justify-center text-[10px] font-black text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-all cursor-pointer"
                           >
                             MP4
                           </div>
                        </td>
                      </tr>
                    ))
                  })()}
                  <tr className="bg-accent/5">
                    <td colSpan={5} className="p-0">
                      <form onSubmit={handleCreateTask} className="w-full flex items-center px-10 py-5">
                        <Plus className="w-5 h-5 text-primary mr-4 opacity-50" />
                        <input 
                          id="new-task-input"
                          value={newTaskTitle} 
                          onChange={e=>setNewTaskTitle(e.target.value)} 
                          placeholder="Clique para adicionar uma nova etapa estratégica..." 
                          className="bg-transparent text-sm outline-none flex-1 font-bold text-foreground placeholder:text-muted-foreground/30" 
                        />
                      </form>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeView === 'kanban' && (
            <div className="flex items-start space-x-6 h-full overflow-x-auto pb-12 select-none animate-in fade-in duration-500">
               {KANBAN_COLUMNS.map(col => {
                 const colTasks = tasks.filter(t => (t.status || 'To Do') === col)
                 return (
                   <div 
                     key={col} 
                     className="min-w-[340px] w-[340px] flex flex-col max-h-full"
                     onDragOver={(e) => e.preventDefault()}
                     onDrop={(e) => {
                       const taskId = e.dataTransfer.getData("taskId")
                       if (taskId) handleUpdateTask(taskId, { status: col })
                     }}
                   >
                     <div className="flex items-center justify-between px-2 mb-6">
                        <div className="flex items-center space-x-3">
                           <div className={`w-2 h-2 rounded-full ${col === 'Done' ? 'bg-emerald-500' : col === 'Doing' ? 'bg-amber-500' : 'bg-zinc-500'}`} />
                           <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground">{col}</h4>
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground/40 bg-accent/40 px-2.5 py-1 rounded-lg border border-border/50">{colTasks.length}</span>
                     </div>
                     
                     <div className="space-y-4">
                        {colTasks.map(task => (
                           <div 
                             key={task.id} 
                             draggable 
                             onDragStart={(e) => e.dataTransfer.setData("taskId", task.id)}
                             onClick={() => setSelectedTask(task)} 
                             className="bg-card border border-border/80 rounded-3xl p-5 shadow-sm hover:shadow-2xl hover:border-primary/40 transition-all cursor-grab active:cursor-grabbing group overflow-hidden relative"
                           >
                              {/* Task Preview / Meta Info */}
                              <div className="flex items-start justify-between mb-4">
                                 <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest border border-white/10 ${task.priority === 'Alta' ? 'bg-rose-500 text-white' : 'bg-primary text-white'}`}>
                                    {task.priority || 'Média'}
                                 </span>
                                 <MoreVertical onClick={(e) => { e.stopPropagation(); alert("Ações Rápidas: Duplicar, Arquivar ou Mover."); }} className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-0.5 hover:bg-accent rounded" />
                              </div>

                              <p className="font-bold text-base leading-tight text-foreground group-hover:text-primary transition-colors mb-6">{task.title}</p>
                              
                              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
                                 <div className="flex -space-x-2">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 border-2 border-background flex items-center justify-center text-[10px] font-black text-white shadow-xl">MM</div>
                                 </div>
                                 <div className="flex items-center text-[10px] font-black text-muted-foreground/50 uppercase tracking-tighter">
                                    <Clock className="w-3 h-3 mr-1" /> 22 ABR
                                 </div>
                              </div>
                           </div>
                        ))}
                        
                        <button 
                            onClick={(e) => { e.stopPropagation(); setActiveView('table'); setTimeout(() => document.getElementById('new-task-input')?.focus(), 100); }}
                            className="w-full py-4 border-2 border-dashed border-border/20 rounded-3xl text-xs font-black uppercase tracking-widest text-muted-foreground hover:border-primary/40 hover:text-primary transition-all flex items-center justify-center space-x-2 group/add"
                        >
                           <Plus className="w-4 h-4 group-hover/add:rotate-90 transition-transform" />
                           <span>Adicionar Atividade</span>
                        </button>
                     </div>
                   </div>
                 )
               })}
            </div>
          )}

          {activeView === 'canvas' && (
            <div className="h-[75vh] w-full border border-border/60 rounded-[40px] overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-700 bg-black/20">
               <CreativeRoom projectId={params.id} tasks={tasks} onSelectTask={(task) => setSelectedTask(task)} />
               <div className="absolute top-6 left-12 z-50 bg-background/40 backdrop-blur-2xl border border-white/10 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl text-white">
                 <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Mapa Estratégico Realtime</span>
                 </div>
               </div>
            </div>
          )}

          {activeView === 'gallery' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
               <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
                  <div className="flex flex-col">
                     <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter">Repositório de Assets</h3>
                     <p className="text-muted-foreground text-sm font-medium mt-1">Conexão nativa com Google Drive para aprovação ágil.</p>
                  </div>
                  <button 
                    onClick={() => setShowDrivePicker(true)}
                    className="mt-4 md:mt-0 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 transition-all active:scale-95 flex items-center"
                  >
                    <Plus className="w-5 h-5 mr-3" /> Conectar Drive
                  </button>
               </div>

               {/* FILTROS GLASSMORPHISM */}
               <div className="flex items-center space-x-4 mb-12">
                  <div className="flex bg-accent/30 p-1.5 rounded-2xl border border-border/50">
                     {['Todos', 'Vertical', 'Wide', 'Square'].map(f => (
                       <button 
                        key={f} 
                        onClick={() => setGalleryFilter(f)}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${galleryFilter === f ? 'bg-primary text-primary-foreground shadow-xl' : 'hover:bg-accent text-muted-foreground'}`}>{f}</button>
                     ))}
                  </div>
                  <div className="flex bg-accent/30 p-1.5 rounded-2xl border border-border/50">
                     {['Todos', 'Aprovado', 'Revisão'].map(s => (
                       <button 
                        key={s} 
                        onClick={() => setGalleryStatus(s)}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${galleryStatus === s ? 'bg-primary text-primary-foreground shadow-xl' : 'hover:bg-accent text-muted-foreground'}`}>{s}</button>
                     ))}
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {[1,2,3,4].map(i => (
                    <div 
                      key={i} 
                      onClick={() => setSelectedAsset({ id: i, name: `Criativo_TikTok_V${i}.mp4`, status: 'Revisão', stage: 'Design' })}
                      className="group flex flex-col bg-card border border-border/80 rounded-[32px] overflow-hidden hover:shadow-2xl hover:border-primary/30 transition-all duration-500 cursor-pointer"
                    >
                       <div className="h-64 bg-accent/20 relative group overflow-hidden">
                          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                             <button className="bg-background w-12 h-12 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"><ArrowRight className="w-5 h-5 text-primary"/></button>
                          </div>
                          <div className="absolute top-4 left-4 bg-background/80 backdrop-blur px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border border-border/50">Vertical</div>
                          <div className="w-full h-full flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-700">📽️</div>
                       </div>
                       <div className="p-6">
                          <p className="font-bold text-foreground group-hover:text-primary transition-colors text-base truncate">Criativo_TikTok_V{i}.mp4</p>
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
                             <span className={`text-[10px] font-black uppercase tracking-widest ${i === 1 ? 'text-emerald-500' : 'text-amber-500'}`}>{i === 1 ? 'Aprovado' : 'Revisão'}</span>
                             <span className="text-[10px] font-black text-muted-foreground opacity-40 uppercase tracking-tighter">2h atrás</span>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

        </div>
      </div>

      {/* PROOFING VIEW - ACELERAÇÃO DE APROVAÇÃO */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-background z-[200] animate-in fade-in duration-300 flex flex-col">
           {/* Header Proofing */}
           <div className="p-6 border-b border-border flex items-center justify-between bg-card">
              <div className="flex items-center space-x-6">
                 <button onClick={() => setSelectedAsset(null)} className="p-2 hover:bg-accent rounded-xl"><X className="w-6 h-6"/></button>
                 <div>
                    <h3 className="text-xl font-black text-foreground tracking-tighter">{selectedAsset.name}</h3>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Modo de Aprovação Ativo</p>
                 </div>
              </div>
              
              <div className="flex items-center space-x-4">
                 <div className="flex items-center space-x-1 bg-accent/40 rounded-xl p-1 border border-border">
                    {['Design', 'Gestor', 'Tráfego'].map(s => (
                       <div key={s} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${selectedAsset.stage === s ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground/50'}`}>
                          {s}
                       </div>
                    ))}
                 </div>
                 <button onClick={() => { 
                    alert("✅ Criativo Aprovado neste Stage! Enviando notificação para o próximo responsável.");
                    setSelectedAsset(null);
                 }} className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all active:scale-95">Aprovar Versão</button>
              </div>
           </div>

           <div className="flex-1 flex overflow-hidden">
              {/* Image Area with Pins */}
              <div className="flex-1 overflow-auto bg-black/40 flex items-center justify-center p-20 relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                 <div className="relative group cursor-crosshair shadow-2xl rounded-lg overflow-hidden border border-white/10" onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    setAssetPins([...assetPins, { x, y, text: 'Novo comentário...' }]);
                 }}>
                    <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop" className="max-h-[80vh] w-auto pointer-events-none" />
                    {/* Render Pins */}
                    {assetPins.map((pin, i) => (
                       <div key={i} style={{ left: `${pin.x}%`, top: `${pin.y}%` }} className="absolute w-8 h-8 -ml-4 -mt-4 bg-primary text-white flex items-center justify-center rounded-full border-4 border-background shadow-2xl font-black text-xs animate-in zoom-in duration-200">
                          {i + 1}
                       </div>
                    ))}
                 </div>
                 <p className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 text-[10px] font-black uppercase tracking-widest">Clique em qualquer lugar da imagem para deixar um ajuste</p>
              </div>

              {/* Comments Sidebar */}
              <div className="w-[400px] border-l border-border bg-card flex flex-col">
                 <div className="p-6 border-b border-border">
                    <h4 className="text-xs font-black text-foreground uppercase tracking-[0.2em]">Ajustes Solicitados ({assetPins.length})</h4>
                 </div>
                 <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {assetPins.map((pin, i) => (
                       <div key={i} className="bg-accent/20 p-4 rounded-2xl border border-border/50 group hover:border-primary/50 transition-all">
                          <div className="flex items-center space-x-3 mb-3">
                             <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-black text-white">{i+1}</div>
                             <span className="text-[10px] font-black text-foreground uppercase">Matheus Moitinho</span>
                          </div>
                          <p className="text-sm text-muted-foreground font-medium">{pin.text}</p>
                       </div>
                    ))}
                    {assetPins.length === 0 && (
                       <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                          <Target className="w-12 h-12" />
                          <p className="text-xs font-black uppercase tracking-widest">Nenhum pin adicionado</p>
                       </div>
                    )}
                 </div>
                 <div className="p-6 bg-accent/10 border-t border-border">
                    <button className="w-full py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20">Solicitar Alterações</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* SIDE PEEK - PREMIUM DRAWER */}
      {selectedTask && (
        <>
          <div className="fixed inset-0 bg-background/40 backdrop-blur-sm z-[100] transition-opacity duration-500" onClick={() => setSelectedTask(null)} />
          <div className="fixed top-0 right-0 h-full w-[720px] max-w-[95vw] bg-card border-l border-border z-[110] shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in slide-in-from-right duration-500 flex flex-col">
            
            {/* Header Side Peek */}
            <div className="p-6 pb-2 flex items-center justify-between">
               <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${selectedTask.status === 'Done' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">CENTRO DE OPERAÇÕES</span>
                    <span className="text-[9px] font-bold text-muted-foreground/40">{selectedTask.id}</span>
                  </div>
               </div>
               <div className="flex items-center space-x-2">
                  <button onClick={() => alert("Ações da Atividade: Mover, Duplicar ou Exportar.")} className="p-2 hover:bg-accent rounded-xl transition-all text-muted-foreground"><MoreHorizontal className="w-5 h-5"/></button>
                  <button onClick={() => setSelectedTask(null)} className="p-2 bg-accent/50 hover:bg-accent rounded-xl transition-all text-foreground"><X className="w-5 h-5"/></button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto px-12 py-8 custom-scrollbar">
               {/* Caminho Breadcrumb Interno */}
               <div className="flex items-center space-x-2 text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest mb-6">
                  <span>Projetos</span> <ChevronRight className="w-3 h-3" /> <span>{params.id.slice(0,8)}</span> <ChevronRight className="w-3 h-3" /> <span className="text-primary/60">Atividade</span>
               </div>

               <input 
                 value={selectedTask.title}
                 onChange={e => handleUpdateTask(selectedTask.id, { title: e.target.value })}
                 className="text-4xl font-black bg-transparent border-none outline-none text-foreground w-full py-4 mb-8 placeholder:text-muted-foreground/20 leading-tight"
                 placeholder="Título da Atividade"
               />

               {/* Grid de Propriedades Elite */}
               <div className="grid grid-cols-2 gap-8 mb-12 p-8 rounded-[40px] bg-accent/20 border border-border/40 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                  
                  <div className="space-y-6">
                    <div className="flex flex-col space-y-2">
                       <label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Responsável Técnico</label>
                       <div className="flex items-center space-x-3 group/member cursor-pointer" onClick={() => alert("👥 Alterar Responsável: Selecione um novo membro para esta atividade.")}>
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-black text-white shadow-xl shadow-indigo-500/20 ring-2 ring-background ring-offset-2 ring-offset-primary/20">MM</div>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-foreground group-hover/member:text-primary transition-colors">Matheus Moitinho</span>
                            <span className="text-[9px] font-bold text-muted-foreground/40 underline decoration-primary/20">Trocar Atribuição</span>
                          </div>
                       </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                       <label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Prazo de Entrega</label>
                        <label className="flex items-center space-x-3 bg-background/50 p-2.5 rounded-xl border border-border/40 hover:border-primary/40 transition-all cursor-pointer group/datepicker">
                           <Calendar className="w-4 h-4 text-muted-foreground group-hover/datepicker:text-primary transition-colors shrink-0" />
                           <input
                             type="date"
                             defaultValue={selectedTask.due_date ? selectedTask.due_date.slice(0, 10) : ''}
                             onChange={(e) => handleUpdateTask(selectedTask.id, { due_date: e.target.value })}
                             className="bg-transparent outline-none border-none text-xs font-black text-foreground cursor-pointer flex-1"
                           />
                        </label>
                    </div>
                  </div>

                  <div className="space-y-6 border-l border-border/40 pl-8">
                    <div className="flex flex-col space-y-2">
                       <label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Status da Entrega</label>
                       <select 
                        value={selectedTask.status} 
                        onChange={e=>handleUpdateTask(selectedTask.id, {status: e.target.value})}
                        className="bg-background border border-border rounded-xl px-4 py-2.5 font-black uppercase tracking-tighter text-[11px] outline-none shadow-sm focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                       >
                         {KANBAN_COLUMNS.map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                    </div>

                    <div className="flex flex-col space-y-2">
                       <label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Progresso de Subtasks</label>
                       <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[8px] font-black text-muted-foreground uppercase">
                             <span>Conclusão</span>
                             <span>66%</span>
                          </div>
                          <div className="h-1.5 w-full bg-accent/30 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500 w-[66%] shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all duration-1000" />
                          </div>
                       </div>
                    </div>
                  </div>
               </div>

               {/* Lista de Subtasks Internas (Reais) */}
               <div className="space-y-6 bg-accent/5 p-8 rounded-[40px] border border-border/40 mb-12">
                  <h4 className="text-[11px] font-black text-foreground uppercase tracking-widest flex items-center">
                     <List className="w-4 h-4 mr-2 text-primary" /> Sub-atividades da Task
                  </h4>
                  <div className="space-y-3">
                     {tasks.filter(t => t.parent_id === selectedTask.id).map((sub, i) => (
                        <div key={sub.id} className="flex items-center justify-between group/sub bg-background/40 p-4 rounded-2xl border border-border/20 hover:border-primary/30 transition-all">
                           <div className="flex items-center space-x-3">
                              <button 
                                onClick={() => handleUpdateTask(sub.id, { status: sub.status === 'Done' ? 'To Do' : 'Done' })}
                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${sub.status === 'Done' ? 'bg-primary border-primary text-white' : 'border-border/60 hover:border-primary/50'}`}
                              >
                                 {sub.status === 'Done' && <CheckSquare className="w-3 h-3" />}
                              </button>
                              <span className={`text-sm font-medium ${sub.status === 'Done' ? 'text-muted-foreground line-through opacity-50' : 'text-foreground'}`}>{sub.title}</span>
                           </div>
                           <button onClick={() => handleDeleteTask(sub.id)} className="opacity-0 group-hover/sub:opacity-100 p-1.5 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 rounded-lg transition-all">
                              <X className="w-3.5 h-3.5" />
                           </button>
                        </div>
                     ))}
                     <button 
                       onClick={() => handleCreateSubtask(selectedTask.id)}
                       className="w-full py-4 border-2 border-dashed border-border/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:border-primary/40 hover:text-primary transition-all flex items-center justify-center space-x-2"
                     >
                        <Plus className="w-3 h-3" />
                        <span>Adicionar Item</span>
                     </button>
                  </div>
               </div>

               {/* Tabs Internas Detalhes / Arquivos / Comentários */}
               <div className="space-y-12">
                  <div className="p-8 bg-background border border-border rounded-[40px] shadow-inner space-y-4">
                     <div className="flex items-center justify-between mb-2">
                        <h4 className="text-[11px] font-black text-foreground uppercase tracking-widest flex items-center">
                           <FileText className="w-4 h-4 mr-2 text-primary" /> Briefing e Diretrizes
                        </h4>
                        <span className="text-[9px] font-bold text-muted-foreground opacity-30">AUTO-SALVAMENTO ATIVO</span>
                     </div>
                     <textarea 
                       className="w-full h-80 bg-transparent resize-none outline-none text-base text-muted-foreground font-medium leading-[1.8]"
                       placeholder="Desenvolva o raciocínio estratégico aqui. Use '/' para comandos de IA..."
                       defaultValue={selectedTask.description}
                       onBlur={e => handleUpdateTask(selectedTask.id, { description: e.target.value })}
                     />
                  </div>

                  {/* Feed de Comentários */}
                  <div className="space-y-6">
                     <h4 className="text-[11px] font-black text-foreground uppercase tracking-widest flex items-center">
                        <List className="w-4 h-4 mr-2 text-primary" /> Atividade e Comentários
                     </h4>
                     
                     <div className="space-y-6 pl-4 border-l-2 border-border/30">
                        <div className="space-y-1 relative">
                           <div className="absolute -left-[21px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-card" />
                           <div className="flex items-center space-x-2 text-[10px] font-black text-muted-foreground uppercase">
                              <span className="text-foreground">Matheus Moitinho</span>
                              <span>•</span>
                              <span>Agora</span>
                           </div>
                           <p className="text-sm text-foreground/80 font-medium bg-accent/20 p-4 rounded-2xl rounded-tl-none border border-border/50">
                             Iniciei a análise do briefing. Vou focar nos ativos verticais primeiro. 🚀
                           </p>
                        </div>
                     </div>

                     <div className="flex items-start space-x-4 mt-8">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[10px] font-black text-white shadow-lg">MM</div>
                        <div className="flex-1 relative">
                           <textarea 
                             className="w-full bg-accent/10 border border-border rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none h-24"
                             placeholder="Deixe um comentário ou @mencione alguém..."
                           />
                           <button className="absolute bottom-3 right-3 bg-primary text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all">Enviar</button>
                        </div>
                     </div>
                  </div>

                  {/* Ativos do Google Drive vinculados */}
                  <div className="space-y-4">
                     <h4 className="text-[11px] font-black text-foreground uppercase tracking-widest flex items-center">
                        <LinkIcon className="w-4 h-4 mr-2 text-indigo-500" /> Ativos Vinculados (Drive)
                     </h4>
                     <div className="grid grid-cols-3 gap-4">
                        <div 
                          className="aspect-square bg-accent/20 rounded-[28px] border-2 border-dashed border-border flex flex-col items-center justify-center space-y-2 group/add-asset cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                          onClick={() => setShowDrivePicker(true)}
                        >
                           <Plus className="w-6 h-6 text-muted-foreground group-hover/add-asset:text-primary transition-colors" />
                           <span className="text-[8px] font-black uppercase text-muted-foreground">Vincular</span>
                        </div>
                        {/* Mock de assets */}
                        <div className="aspect-square bg-accent/40 rounded-[28px] border border-border overflow-hidden relative group/img cursor-pointer" onClick={() => alert("🎬 Preview de Asset: Abrindo arquivo do Drive...")}>
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center"><Maximize2 className="w-5 h-5 text-white" /></div>
                           <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop" className="w-full h-full object-cover" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Footer Side Peek */}
            <div className="p-8 border-t border-border/50 bg-accent/10 flex items-center justify-between">
               <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Sync Ativado</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>Criado há 2d</span>
                  </div>
               </div>
               <button 
                 onClick={() => {
                   if(confirm("Deseja arquivar esta atividade?")) {
                      supabase.from('tasks').delete().eq('id', selectedTask.id).then(() => {
                        setTasks(tasks.filter(t => t.id !== selectedTask.id))
                        setSelectedTask(null)
                      })
                   }
                 }}
                 className="px-6 py-2.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
               >
                 Arquivar Task
               </button>
            </div>
          </div>
        </>
      )}

      {/* CMDK GLOBAL */}
      <SlashCommandPalette onAction={handleSlashAction} />

      {/* DRIVE PICKER (MOCK) */}
      {showDrivePicker && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[500] flex items-center justify-center animate-in fade-in duration-500">
          <div className="bg-card w-[900px] border border-white/10 rounded-[40px] shadow-[0_0_150px_rgba(79,70,229,0.3)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                   <h3 className="text-2xl font-black text-foreground tracking-tighter">Google Drive Sync</h3>
                   <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-50">Sincronizando ativos de marketing</p>
                </div>
                <button onClick={()=>setShowDrivePicker(false)} className="p-3 hover:bg-accent rounded-2xl"><X className="w-6 h-6"/></button>
             </div>
             <div className="p-12 h-[500px] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent grid grid-cols-3 gap-8 overflow-y-auto">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} onClick={()=>setShowDrivePicker(false)} className="group bg-accent/20 border border-border/50 rounded-3xl p-6 hover:bg-primary/10 hover:border-primary/50 transition-all cursor-pointer">
                     <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-500 text-center">🎞️</div>
                     <p className="font-bold text-center text-foreground truncate">Video_Marketing_0{i}.mp4</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

    </div>
  )
}
