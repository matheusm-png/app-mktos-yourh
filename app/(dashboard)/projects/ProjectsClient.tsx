'use client'

import Link from 'next/link'
import { useState, useEffect, useOptimistic, useTransition, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  Clock, 
  ChevronRight, 
  LayoutGrid, 
  List, 
  Navigation, 
  Calendar as CalendarIcon, 
  Sparkles,
  Search,
  Filter,
  MoreHorizontal,
  Target,
  X,
  CheckCircle2,
  CheckSquare,
  List as ListIcon,
  Calendar
} from 'lucide-react'
import CreativeRoom from './[id]/CreativeRoom'

type Project = {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  drive_folder_id: string | null;
  created_at: string;
  stats?: {
    total: number;
    done: number;
    percent: number;
  }
}

type Task = {
  id: string;
  project_id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string | null;
  parent_id: string | null;
  project_name?: string;
  category?: string;
}

export default function ProjectsClient() {
  const [activeView, setActiveView] = useState<'grid' | 'table' | 'kanban' | 'canvas' | 'calendar'>('grid')
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  
  // Estados de Busca e Filtro
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string | 'all'>('all')

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      const { data: projectsData } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
      const { data: tasksData } = await supabase.from('tasks').select('*').order('created_at', { ascending: true })
      
      if (projectsData) {
        setProjects(projectsData.map(p => {
          const projectTasks = tasksData?.filter(t => t.project_id === p.id) || []
          const total = projectTasks.length
          const done = projectTasks.filter(t => t.status === 'Done').length
          return { ...p, stats: { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 } }
        }))
        
        if (tasksData) {
          setTasks(tasksData.map(t => ({
            ...t,
            project_name: projectsData.find(p => p.id === t.project_id)?.name || 'Projeto Desconhecido',
            category: t.parent_id ? (tasksData.find(p => p.id === t.parent_id)?.parent_id ? 'DETALHAMENTO' : 'SUB-ETAPA') : 'PRODUÇÃO CRIATIVA'
          })))
        }
      }
      setIsLoading(false)
    }
    loadData()
  }, [])

  // Lógica de Filtragem Dinâmica
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.project_name?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || t.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [tasks, searchQuery, filterStatus])

  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [projects, searchQuery])

  const handleUpdateTask = async (taskId: string, updates: any) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t))
    if (selectedTask?.id === taskId) setSelectedTask({ ...selectedTask, ...updates })
    await supabase.from('tasks').update(updates).eq('id', taskId)
  }

  const renderTaskTreeRow = (task: Task, level: number = 0) => {
    // Se estivermos filtrando ou buscando, não mostramos a árvore original, pois o pai pode ser escondido
    // No modo busca/filtro, mostramos uma lista flat. No modo normal, mostramos árvore.
    const isSearching = searchQuery.length > 0 || filterStatus !== 'all'
    const children = isSearching ? [] : tasks.filter(t => t.parent_id === task.id)
    const isDone = task.status === 'Done'

    return (
      <>
        <tr key={task.id} onClick={() => setSelectedTask(task)} className="group hover:bg-primary/5 transition-all cursor-pointer border-b border-border/10">
          <td className="px-6 py-5">
            <div className="flex items-center" style={{ paddingLeft: isSearching ? '0' : `${level * 40}px` }}>
              <div className="relative flex items-center">
                 {level > 0 && !isSearching && (
                   <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-px bg-border/40" />
                 )}
                 <div className={`w-2 h-2 rounded-full mr-3 shrink-0 ${isDone ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-primary shadow-[0_0_8px_rgba(79,70,229,0.5)]'}`} />
              </div>
              <div className="flex flex-col">
                <span className={`text-sm font-black tracking-tight ${isDone ? 'text-muted-foreground line-through opacity-40' : 'text-foreground'}`}>
                  {task.title}
                </span>
                <span className="text-[8px] font-black text-muted-foreground/50 uppercase tracking-widest mt-1">
                  {task.category || 'PRODUÇÃO CRIATIVA'} {isSearching && <span className="text-primary/40 ml-2">[{task.project_name}]</span>}
                </span>
              </div>
            </div>
          </td>
          <td className="px-6 py-5">
            <div className="flex items-center space-x-2.5">
               <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/40 to-primary/80 flex items-center justify-center text-[10px] font-black text-white border border-white/20 shadow-lg">MM</div>
               <span className="text-[10px] font-black text-muted-foreground uppercase opacity-70">MOITINHO</span>
            </div>
          </td>
          <td className="px-6 py-5">
            <div className={`inline-flex items-center justify-center min-w-[100px] h-8 rounded-xl border font-black text-[10px] uppercase tracking-tighter
              ${isDone ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 
                task.status === 'Doing' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 
                'bg-accent/40 border-border/40 text-muted-foreground opacity-60'}`}>
              {task.status || 'TO DO'}
            </div>
          </td>
          <td className="px-6 py-5">
             <div className="flex items-center text-[10px] font-black text-muted-foreground/60 space-x-2">
                <Calendar className="w-3.5 h-3.5" />
                <span className="uppercase">{task.due_date ? new Date(task.due_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : 'dd/mm'}</span>
             </div>
          </td>
          <td className="px-6 py-5 text-right">
             <div className="inline-flex items-center justify-center w-12 h-8 bg-accent/30 rounded-lg border border-border/40 text-[9px] font-black text-muted-foreground group-hover:bg-primary/20 transition-all">MP4</div>
          </td>
        </tr>
        {children.map(child => renderTaskTreeRow(child, level + 1))}
      </>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 relative">
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-foreground flex items-center">
              Strategic Control <Sparkles className="ml-3 text-primary w-8 h-8 opacity-40 shadow-primary" />
            </h2>
            <p className="text-muted-foreground mt-1 font-medium italic opacity-50 tracking-tight">Vigilância total sobre todos os ecossistemas de produção.</p>
          </div>
          <button className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition-all">
            <Plus className="w-4 h-4" /> <span>Novo Projeto Ativo</span>
          </button>
        </div>

        <div className="flex items-center space-x-1 border-b border-border/40 pb-px">
          {[
            { id: 'grid', label: 'Ecosystems', icon: LayoutGrid },
            { id: 'table', label: 'Global Timeline', icon: List },
            { id: 'kanban', label: 'Visual Flow', icon: Target },
            { id: 'canvas', label: 'Strategic Map', icon: Navigation },
            { id: 'calendar', label: 'Master Agenda', icon: CalendarIcon },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveView(tab.id as any)} className={`flex items-center space-x-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative group ${activeView === tab.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              <tab.icon className={`w-3.5 h-3.5 ${activeView === tab.id ? 'stroke-[3]' : 'opacity-40'}`} />
              <span>{tab.label}</span>
              {activeView === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-4px_15px_rgba(79,70,229,0.6)]" />}
            </button>
          ))}
          <div className="flex-1" />
          
          {/* BARRA DE PESQUISA E FILTRO FUNCIONAL */}
          <div className="flex items-center space-x-4 pr-4">
             <div className="relative group">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${searchQuery ? 'text-primary' : 'text-muted-foreground/30'}`} />
                <input 
                  type="text"
                  placeholder="Pesquisar em tudo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-accent/20 border border-border/20 rounded-xl pl-9 pr-4 py-2 text-[10px] font-black uppercase tracking-widest w-48 focus:w-64 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:opacity-20"
                />
             </div>
             
             <div className="relative flex items-center space-x-2 bg-accent/20 border border-border/20 rounded-xl px-3 py-2">
                <Filter className={`w-3.5 h-3.5 ${filterStatus !== 'all' ? 'text-primary' : 'text-muted-foreground/30'}`} />
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 cursor-pointer"
                >
                  <option value="all">TODOS</option>
                  <option value="To Do">TO DO</option>
                  <option value="Doing">DOING</option>
                  <option value="Approval">APPROVAL</option>
                  <option value="Done">DONE</option>
                </select>
             </div>
          </div>
        </div>
      </div>

      <div className="pb-40 min-h-[70vh]">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
             <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
             <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Sincronizando Multiverso...</span>
          </div>
        ) : (
          <>
            {activeView === 'grid' && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-700">
                {filteredProjects.map(p => (
                  <Link key={p.id} href={`/projects/${p.id}`} className="group rounded-[32px] border border-border/60 bg-card/60 backdrop-blur-md overflow-hidden hover:shadow-2xl hover:border-primary/30 transition-all duration-500 flex flex-col relative overflow-hidden">
                    <div className="h-28 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${p.color}dd, ${p.color}44)` }}>
                       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                       <div className="absolute bottom-4 left-6 text-white text-xl font-black">{p.name}</div>
                    </div>
                    <div className="p-6 space-y-4">
                       <p className="text-xs text-muted-foreground italic h-8 line-clamp-2">"{p.description || 'Ecossistema de alta performance.'}"</p>
                       <div className="h-1 w-full bg-accent rounded-full overflow-hidden">
                          <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${p.stats?.percent}%`, backgroundColor: p.color || '#4f46e5' }} />
                       </div>
                    </div>
                  </Link>
                ))}
                {filteredProjects.length === 0 && <div className="col-span-full py-20 text-center text-muted-foreground/30 font-black uppercase tracking-[0.2em]">Nenhum ecossistema encontrado.</div>}
              </div>
            )}

            {activeView === 'table' && (
              <div className="bg-card/40 backdrop-blur-3xl border border-border/40 rounded-[32px] overflow-hidden shadow-2xl relative">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/20 bg-accent/20">
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Atividade / Fase</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Dono</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Progresso</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Deadline</th>
                      <th className="px-6 py-4 text-right text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Preview</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/5">
                    {searchQuery || filterStatus !== 'all' 
                      ? filteredTasks.map(t => renderTaskTreeRow(t))
                      : tasks.filter(t => !t.parent_id).map(rootTask => renderTaskTreeRow(rootTask))
                    }
                  </tbody>
                </table>
              </div>
            )}

            {activeView === 'kanban' && <div className="flex space-x-6 overflow-x-auto pb-8">{['To Do', 'Doing', 'Approval', 'Done'].map(c => (
              <div key={c} className="w-80 flex flex-col space-y-4 shrink-0">
                <div className="flex items-center justify-between px-4 h-12 bg-accent/20 rounded-2xl border border-border/40 font-black text-[10px] text-muted-foreground uppercase tracking-widest">
                  <span>{c}</span>
                  <span className="opacity-40">{filteredTasks.filter(t => t.status === c).length}</span>
                </div>
                <div className="space-y-4">
                  {filteredTasks.filter(t => t.status === c).map(t => (
                    <div key={t.id} onClick={() => setSelectedTask(t)} className="bg-card/60 backdrop-blur-md p-5 rounded-2xl border border-border/40 hover:border-primary/40 hover:shadow-2xl transition-all cursor-pointer group">
                       <span className="text-[8px] font-black text-primary/60 mb-2 block uppercase tracking-tighter">{t.project_name}</span>
                       <h5 className="font-bold text-sm text-foreground mb-4">{t.title}</h5>
                       <div className="flex items-center justify-between pt-3 border-t border-border/10">
                          <div className="w-5 h-5 rounded-full bg-primary/20 border border-border/40 text-[7px] font-black flex items-center justify-center">MM</div>
                          <span className="text-[9px] font-black uppercase text-muted-foreground opacity-40">{t.priority}</span>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}</div>}

            {activeView === 'canvas' && <div className="h-[75vh] border border-border/40 rounded-[40px] overflow-hidden bg-card/10 backdrop-blur-xl relative"><CreativeRoom projectId="global" tasks={filteredTasks} /></div>}
            {activeView === 'calendar' && (
              <div className="bg-card/40 border border-border/40 rounded-[40px] p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-700 text-center">
                 <h3 className="text-3xl font-black text-foreground tracking-tighter capitalize mb-12">Agenda Consolidada</h3>
                 <div className="grid grid-cols-7 gap-4">
                    {Array.from({ length: 35 }).map((_, i) => {
                      const dayNum = i - 2 
                      const dayTasks = filteredTasks.filter(t => t.due_date && new Date(t.due_date).getDate() === dayNum)
                      return (
                        <div key={i} className={`min-h-[150px] p-4 rounded-3xl border transition-all ${dayNum <= 0 || dayNum > 30 ? 'opacity-5 border-transparent' : 'bg-accent/10 border-border/20'}`}>
                          <span className="text-[10px] font-black text-muted-foreground/60">{dayNum > 0 && dayNum <= 30 ? dayNum : ''}</span>
                          <div className="mt-4 space-y-1.5">
                            {dayTasks.map(t => (
                              <div key={t.id} onClick={() => setSelectedTask(t)} className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-[8px] font-black text-primary uppercase truncate cursor-pointer hover:bg-primary/20 transition-all font-black">
                                {t.title}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                 </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Global Side Peek Drawer */}
      {selectedTask && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setSelectedTask(null)} />
          <div className="relative w-full max-w-2xl bg-card/95 backdrop-blur-3xl border-l border-white/10 h-full shadow-2xl animate-in slide-in-from-right duration-700 p-12 overflow-y-auto">
             <div className="flex items-center justify-between mb-16">
                <div className="flex items-center space-x-3 text-[10px] font-black text-primary bg-primary/10 px-4 py-2 rounded-2xl border border-primary/30 uppercase tracking-[0.2em]">
                   <Target className="w-4 h-4" />
                   <span>{selectedTask.project_name}</span>
                </div>
                <button onClick={() => setSelectedTask(null)} className="w-12 h-12 flex items-center justify-center hover:bg-accent rounded-full transition-all text-muted-foreground"><X className="w-8 h-8" /></button>
             </div>
             <input 
               className="text-5xl font-black bg-transparent border-none outline-none text-foreground w-full mb-10 hover:bg-accent/30 rounded-2xl p-4 transition-all"
               value={selectedTask.title}
               onChange={e => handleUpdateTask(selectedTask.id, { title: e.target.value })}
             />
             <div className="grid grid-cols-2 gap-16 mb-16 border-y border-white/5 py-12">
                <div className="space-y-8">
                   <div className="flex flex-col space-y-3">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Status</label>
                      <select value={selectedTask.status} onChange={e => handleUpdateTask(selectedTask.id, { status: e.target.value })} className="bg-accent/10 border border-white/10 rounded-2xl px-5 py-4 font-black text-xs uppercase tracking-tighter cursor-pointer">
                         {['To Do', 'Doing', 'Approval', 'Done'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                   </div>
                </div>
                <div className="space-y-8 border-l border-white/5 pl-12">
                   <Link href={`/projects/${selectedTask.project_id}`} className="inline-flex items-center justify-center h-12 w-full bg-primary/10 border border-primary/30 rounded-2xl text-[10px] font-black text-primary uppercase tracking-[0.24em] hover:bg-primary hover:text-white transition-all shadow-lg active:scale-95">
                      Abrir Projeto <ChevronRight className="ml-2 w-4 h-4" />
                   </Link>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
