'use client'

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ListTodo, 
  Flame, 
  Target, 
  Zap, 
  Trophy,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  X,
  Minus,
  CheckSquare,
  Plus,
  ArrowRight,
  Trash2,
  List
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

const MEMBER_DATA: Record<string, { role: string, icon: string, color: string, name: string, motto: string }> = {
  'caio': { 
    name: 'Caio', 
    role: 'Head de Marketing', 
    icon: '🎯', 
    color: 'from-orange-500 to-rose-600',
    motto: "Estratégia sem execução é alucinação. Vamos bater o ROI."
  },
  'matheus': { 
    name: 'Matheus', 
    role: 'Gestor de Tráfego', 
    icon: '🚀', 
    color: 'from-blue-500 to-indigo-600',
    motto: "Otimizando cada centavo. Escala com inteligência."
  },
  'juan': { 
    name: 'Juan', 
    role: 'Videomaker / Designer', 
    icon: '🎬', 
    color: 'from-purple-500 to-fuchsia-600',
    motto: "Impacto visual que converte. O frame perfeito importa."
  },
  'raquel': { 
    name: 'Raquel', 
    role: 'Designer', 
    icon: '🎨', 
    color: 'from-rose-400 to-pink-600',
    motto: "Estética aliada à performance. Design que vende."
  },
}

export default function MemberHomePage() {
  const params = useParams()
  const memberKey = (params.member as string || '').toLowerCase()
  const member = MEMBER_DATA[memberKey] || { 
    name: params.member as string, 
    role: 'Membro do Time', 
    icon: '👤', 
    color: 'from-gray-500 to-gray-700',
    motto: "Foco na entrega e consistência."
  }
  
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<any>(null)

  useEffect(() => {
    async function loadTasks() {
      // Carrega todas as tasks vinculadas aos projetos do MarkOS
      const { data } = await supabase.from('tasks').select('*, projects(name)')
      if (data) {
        setTasks(data) 
      }
      setLoading(false)
    }
    loadTasks()
  }, [memberKey])

  async function handleUpdateTask(taskId: string, updates: any) {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t))
    if (selectedTask?.id === taskId) {
      setSelectedTask((prev: any) => ({ ...prev, ...updates }))
    }
    await supabase.from('tasks').update(updates).eq('id', taskId)
  }

  async function handleCreateSubtask(parentId: string) {
    const title = prompt("Título da sub-etapa:")
    if (!title) return

    const newId = crypto.randomUUID()
    const { data: inserted, error } = await supabase.from('tasks').insert([{
      id: newId,
      project_id: selectedTask.project_id,
      parent_id: parentId,
      title,
      status: 'To Do',
      priority: 'Média'
    }]).select().single()

    if (error) {
      alert(`Erro: ${error.message}`)
      return
    }

    if (inserted) {
      setTasks(prev => [...prev, inserted])
    }
  }

  async function handleDeleteTask(taskId: string) {
    if (!confirm("Excluir esta atividade?")) return
    setTasks(prev => prev.filter(t => t.id !== taskId))
    if (selectedTask?.id === taskId) setSelectedTask(null)
    await supabase.from('tasks').delete().eq('id', taskId)
  }

  const sections = [
    { id: 'day', label: 'Hoje', icon: Zap, bg: 'bg-amber-500/10', text: 'text-amber-500' },
    { id: 'week', label: 'Esta Semana', icon: Calendar, bg: 'bg-primary/10', text: 'text-primary' },
    { id: 'month', label: 'Este Mês', icon: Target, bg: 'bg-indigo-500/10', text: 'text-indigo-500' }
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center text-primary font-black animate-pulse">CARREGANDO DASHBOARD...</div>

  return (
    <>
    <div className="max-w-screen-2xl mx-auto space-y-16 pb-32">
      
      {/* Profile Header */}
      <div className="relative group">
        {/* Camadas de Luz Atmosféricas Fixas (Suave/Equilibrado) */}
        <div className={`absolute -inset-[100px] md:-inset-[300px] bg-gradient-to-r ${member.color} opacity-[0.4] blur-[300px] rounded-full z-0`} />
        <div className={`absolute -top-[300px] left-1/2 -translate-x-1/2 w-[160%] h-[800px] bg-gradient-to-b ${member.color} opacity-[0.15] blur-[300px] rounded-full z-0`} />
        
        <div className="relative z-10 bg-card/40 backdrop-blur-[60px] border border-white/20 rounded-[60px] p-12 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)]">
           {/* Camada Interna de Brilho Extra */}
           <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-10 mix-blend-overlay`} />
           <div className={`absolute -right-20 -top-20 w-[400px] h-[400px] bg-gradient-to-br ${member.color} opacity-10 blur-[80px] rounded-full`} />
           
           <div className="flex flex-col lg:flex-row items-center gap-12 relative">
             <div className="relative">
               <div className={`w-40 h-40 rounded-[48px] bg-gradient-to-br ${member.color} flex items-center justify-center text-6xl shadow-2xl transition-transform duration-500 cursor-pointer`}>
                 {member.icon}
               </div>
               <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-8 h-8 rounded-full border-4 border-black animate-pulse" />
             </div>

             <div className="flex-1 text-center lg:text-left space-y-4">
               <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <h1 className="text-6xl font-black tracking-tighter text-foreground leading-none">
                    Fala, <span className={`bg-gradient-to-r ${member.color} bg-clip-text text-transparent`}>{member.name}</span>!
                  </h1>
                  <span className="px-4 py-1.5 rounded-2xl bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-[0.3em] text-white/50 backdrop-blur-md">
                    MARKOS_v2.0
                  </span>
               </div>
               <p className="text-2xl font-bold text-muted-foreground/80 tracking-tight">{member.role}</p>
               <p className="text-lg font-medium italic text-primary/90 bg-white/5 border border-white/5 px-6 py-2 rounded-2xl inline-block mt-4">
                 "{member.motto}"
               </p>
             </div>

             <div className="w-full lg:w-auto">
               <div className="bg-white/5 border border-white/10 p-8 rounded-[48px] backdrop-blur-2xl text-center">
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground">Deep Work Phase</p>
                  <div className="flex items-center justify-center space-x-3 mt-2">
                     <Flame className="w-8 h-8 text-orange-500 fill-orange-500" />
                     <p className="text-5xl font-black text-foreground">{memberKey === 'caio' ? '12' : '08'} Dias</p>
                  </div>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
         {[
           { label: 'Tasks Concluídas', value: '42', icon: CheckCircle2, color: 'text-emerald-500' },
           { label: 'Foco do Momento', value: memberKey === 'caio' ? 'Growth' : 'Design System', icon: TrendingUp, color: 'text-primary' },
           { label: 'Produtividade XP', value: '850', icon: Trophy, color: 'text-amber-500' },
         ].map((stat, i) => (
           <div key={i} className="bg-card/20 backdrop-blur-sm border border-border/40 p-10 rounded-[50px] transition-all hover:border-primary/40">
              <div className="flex items-center justify-between">
                 <div className={`p-4 rounded-3xl bg-accent/30 ${stat.color}`}>
                    <stat.icon className="w-8 h-8" />
                 </div>
              </div>
              <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-8 opacity-50">{stat.label}</h3>
              <p className="text-5xl font-black text-foreground mt-2 tracking-tighter">{stat.value}</p>
           </div>
         ))}
      </div>

      {/* Work Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {sections.map((section) => (
           <div key={section.id} className="flex flex-col space-y-8">
              <div className="flex items-center justify-between px-4">
                 <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 flex items-center justify-center rounded-[20px] ${section.bg} ${section.text}`}>
                       <section.icon className="w-6 h-6" />
                    </div>
                    <div>
                       <h2 className="text-2xl font-black tracking-tighter text-foreground uppercase">{section.label}</h2>
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Sprint Semanal</p>
                    </div>
                 </div>
                 <div className="px-3 py-1 bg-white/5 rounded-xl border border-white/5 text-[11px] font-black text-muted-foreground/40">
                   {section.id === 'day' ? '04' : section.id === 'week' ? '12' : '24'}
                 </div>
              </div>

              <div className="space-y-6">
                 {(section.id === 'day' ? tasks.filter(t => !t.parent_id).slice(0, 4) : tasks.filter(t => !t.parent_id).slice(4, 9)).map((task, i) => (
                    <div 
                      key={i} 
                      onClick={() => setSelectedTask(task)}
                      className="group relative bg-card/40 backdrop-blur-md border border-border/40 rounded-[40px] p-8 hover:border-primary/40 hover:bg-card/60 transition-all duration-500 cursor-pointer overflow-hidden shadow-sm hover:shadow-2xl translate-y-0 hover:-translate-y-2"
                    >
                       {/* Priority Indicator Line */}
                       <div className={`absolute top-0 left-0 bottom-0 w-1 ${task.priority === 'Alta' ? 'bg-rose-500 glow-rose shadow-[0_0_20px_rgba(244,63,94,0.5)]' : 'bg-primary/20'}`} />
                       
                       <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center space-x-3">
                             <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                {task.projects?.name || 'Geral'}
                             </div>
                             {task.priority === 'Alta' && (
                               <span className="flex items-center text-[9px] font-black text-rose-500 uppercase tracking-widest animate-pulse">
                                 <AlertCircle className="w-3 h-3 mr-1" /> Urgente
                               </span>
                             )}
                          </div>
                          <div className="w-10 h-10 rounded-full border border-white/5 bg-accent/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <TrendingUp className="w-4 h-4 text-primary" />
                          </div>
                       </div>
                       
                       <h4 className="text-xl font-bold text-foreground leading-[1.2] group-hover:text-primary transition-colors pr-8">
                          {task.title}
                       </h4>

                       <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                          <div className="flex items-center space-x-2">
                             <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                <Clock className="w-3 h-3 text-primary" />
                             </div>
                             <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                                {section.id === 'day' ? 'Hoje 16:30' : 'Data Sugerida'}
                             </span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground/40 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                       </div>
                    </div>
                 ))}

                 <button className="w-full h-24 border-2 border-dashed border-border/20 rounded-[40px] text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/20 hover:border-primary/40 hover:text-primary transition-all flex items-center justify-center space-x-4">
                    <Zap className="w-4 h-4" />
                    <span>Nova Demanda</span>
                 </button>
              </div>
           </div>
         ))}
      </div>

      {/* Floating Gamification Bar */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-max max-w-[95vw]">
         <div className="bg-black/80 backdrop-blur-[40px] border border-white/10 px-10 py-5 rounded-[40px] shadow-2xl flex items-center gap-10">
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-xl shadow-orange-500/20">
                  <Trophy className="w-7 h-7 text-white" />
               </div>
               <div>
                 <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] mb-2 text-white/40">
                    <span>Produtividade Semanal</span>
                    <span className="text-amber-500 ml-8">85% COMPLETE</span>
                 </div>
                 <div className="h-2.5 w-64 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 w-[85%]" />
                 </div>
               </div>
            </div>
            
            <div className="h-10 w-px bg-white/10" />
            
            <div className="flex flex-col items-center">
               <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Global Rank</span>
               <p className="text-2xl font-black text-white tracking-tighter">#01</p>
            </div>
         </div>
      </div>
    </div>

      {/* Side Peek: Detalhes da Task (Copiado da lógica principal) */}
      {selectedTask && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[150] animate-in fade-in duration-500"
            onClick={() => setSelectedTask(null)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-[600px] bg-card border-l border-border/40 z-[200] shadow-[-20px_0_100px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-500 flex flex-col">
            <div className="p-8 border-b border-border/20 flex items-center justify-between bg-accent/5">
              <div className="flex items-center space-x-4">
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedTask.status === 'Done' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-primary/20 text-primary'}`}>
                  {selectedTask.status}
                </div>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{selectedTask.projects?.name}</span>
              </div>
              <button 
                onClick={() => setSelectedTask(null)}
                className="p-3 rounded-full hover:bg-accent/40 text-muted-foreground transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-12 space-y-12">
               <div>
                  <h2 className="text-4xl font-black text-foreground tracking-tight leading-none mb-6">{selectedTask.title}</h2>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center text-xs font-bold text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2 text-primary" /> Entrega: {selectedTask.due_date ? new Date(selectedTask.due_date).toLocaleDateString() : 'A definir'}
                    </div>
                    <div className="flex items-center text-xs font-bold text-muted-foreground">
                      <Zap className="w-4 h-4 mr-2 text-amber-500" /> Prioridade: {selectedTask.priority}
                    </div>
                  </div>
               </div>

               {/* Briefing Section */}
               <div className="space-y-6 bg-accent/5 p-8 rounded-[40px] border border-border/40">
                  <h4 className="text-[11px] font-black text-foreground uppercase tracking-[0.2em] flex items-center">
                     <Target className="w-4 h-4 mr-2 text-primary" /> Descrição / Briefing
                  </h4>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                     {selectedTask.description || "Nenhuma descrição detalhada fornecida para esta demanda estratégica."}
                  </div>
               </div>

               {/* Checklist de Sub-etapas Reais */}
               <div className="space-y-6">
                  <h4 className="text-[11px] font-black text-foreground uppercase tracking-[0.2em] flex items-center">
                     <List className="w-4 h-4 mr-2 text-primary" /> Check-list de Execução
                  </h4>
                  <div className="space-y-3">
                     {tasks.filter(t => t.parent_id === selectedTask.id).map((sub, i) => (
                        <div key={sub.id} className="flex items-center justify-between group/sub bg-accent/10 p-4 rounded-3xl border border-border/20 hover:border-primary/30 transition-all">
                           <div className="flex items-center space-x-4">
                              <button 
                                onClick={() => handleUpdateTask(sub.id, { status: sub.status === 'Done' ? 'To Do' : 'Done' })}
                                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${sub.status === 'Done' ? 'bg-primary border-primary text-white' : 'border-border/60'}`}
                              >
                                 {sub.status === 'Done' && <CheckSquare className="w-4 h-4" />}
                              </button>
                              <span className={`text-sm font-bold ${sub.status === 'Done' ? 'text-muted-foreground line-through opacity-40' : 'text-foreground'}`}>{sub.title}</span>
                           </div>
                           <button onClick={() => handleDeleteTask(sub.id)} className="opacity-0 group-hover/sub:opacity-100 p-2 text-muted-foreground hover:text-rose-500 transition-all">
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     ))}
                     <button 
                       onClick={() => handleCreateSubtask(selectedTask.id)}
                       className="w-full py-4 border-2 border-dashed border-border/20 rounded-3xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:border-primary/40 hover:text-primary transition-all flex items-center justify-center space-x-2"
                     >
                        <Plus className="w-3 h-3" />
                        <span>Adicionar Item de Controle</span>
                     </button>
                  </div>
               </div>

               {/* Ações Rápidas */}
               <div className="pt-12 border-t border-border/20 grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleUpdateTask(selectedTask.id, { status: 'Done' })}
                    className="py-4 bg-primary text-white rounded-3xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20"
                  >
                    Marcar como Concluído
                  </button>
                  <button 
                    onClick={() => handleDeleteTask(selectedTask.id)}
                    className="py-4 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                  >
                    Excluir Demanda
                  </button>
               </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
