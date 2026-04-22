'use client'

import Link from 'next/link'
import { 
  TrendingUp, 
  Users, 
  Target, 
  Rocket, 
  Plus, 
  ArrowUpRight, 
  Clock, 
  AlertCircle,
  FileText,
  MousePointer2,
  PieChart
} from "lucide-react"

export default function OverviewPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header com Boas-vindas e Ações Rápidas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-foreground">Welcome back, Moitinho 👋</h2>
          <p className="text-muted-foreground mt-1 font-medium italic">"Seu ROAS médio subiu 12% nos últimos 7 dias. O time está entregando."</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/campaigns" className="flex items-center space-x-2 bg-accent/40 border border-border px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all">
             <Target className="w-4 h-4" /> <span>Gerar UTM</span>
          </Link>
          <Link href="/projects" className="flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all">
             <Plus className="w-4 h-4" /> <span>Novo Projeto</span>
          </Link>
        </div>
      </div>

      {/* Grid de Métricas Principais (Os "3 números" agora contextuais) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Investimento Mensal', value: 'R$ 14.500', trend: '+R$ 2.400', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Campanhas Ativas', value: '12', trend: '2 novas', icon: Target, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Projetos em Andamento', value: '4', trend: '80% on time', icon: Rocket, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Membros Ativos', value: '8', trend: 'Online agora', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' }
        ].map((m, i) => (
          <div key={i} className="group border border-border bg-card p-6 rounded-[32px] shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 relative overflow-hidden">
            <div className={`absolute -right-4 -top-4 w-20 h-20 opacity-5 group-hover:scale-150 transition-transform duration-700`}>
              <m.icon className="w-full h-full" />
            </div>
            <div className="flex items-center justify-between mb-4">
               <div className={`p-2.5 rounded-xl ${m.bg} ${m.color}`}>
                 <m.icon className="w-5 h-5" />
               </div>
               <span className={`text-[10px] font-black uppercase tracking-tighter ${m.color}`}>{m.trend}</span>
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{m.label}</h3>
            <p className="text-3xl font-black text-foreground mt-2">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Gráfico de Tendência (O diferencial temporal do auditor) */}
        <div className="lg:col-span-2 bg-card border border-border rounded-[40px] p-8 shadow-sm flex flex-col relative overflow-hidden group">
           <div className="flex items-center justify-between mb-10">
              <div>
                 <h3 className="text-xl font-black text-foreground tracking-tighter">Gasto Diário (Trend)</h3>
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Últimos 14 dias de operação</p>
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-tighter">
                 <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> Estável
              </div>
           </div>

           {/* Gráfico Visual (CSS-based) */}
           <div className="h-64 w-full mt-6 relative">
              <svg viewBox="0 0 400 150" className="w-full h-full drop-shadow-2xl">
                 <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                       <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    </linearGradient>
                 </defs>
                 <path 
                    d="M0 120 Q 50 80, 100 100 T 200 40 T 300 60 T 400 20 L 400 150 L 0 150 Z" 
                    fill="url(#chartGradient)" 
                    className="animate-in fade-in slide-in-from-bottom-10 duration-1000"
                 />
                 <path 
                    d="M0 120 Q 50 80, 100 100 T 200 40 T 300 60 T 400 20" 
                    fill="none" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    className="animate-in slide-in-from-left duration-700"
                 />
                 {/* Pontos de Dados */}
                 {[100, 200, 300, 400].map((x, i) => (
                    <circle key={i} cx={x-100} cy={i === 1 ? 100 : i === 2 ? 40 : 60} r="4" fill="hsl(var(--primary))" className="animate-pulse" />
                 ))}
              </svg>
              <div className="absolute top-0 left-0 text-[10px] font-black text-muted-foreground uppercase">R$ 5.000</div>
              <div className="absolute bottom-0 right-0 text-[10px] font-black text-muted-foreground uppercase">Hoje</div>
           </div>
           
           <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/50">
              <div className="flex items-center space-x-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                 <div className="flex items-center"><div className="w-2.5 h-2.5 rounded-full bg-primary mr-2" /><span>Meta Ads</span></div>
                 <div className="flex items-center"><div className="w-2.5 h-2.5 rounded-full bg-accent mr-2" /><span>Investimento</span></div>
              </div>
              <button 
                onClick={() => window.location.href='/campaigns'}
                className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
              >
                Ver relatório completo
              </button>
           </div>
        </div>

        {/* Seção "Hoje" (Focus Mode TDAH) */}
        <div className="bg-card border border-border rounded-[40px] p-8 shadow-sm flex flex-col">
           <h3 className="text-xl font-black text-foreground tracking-tighter mb-8 flex items-center">
              <Clock className="w-5 h-5 mr-3 text-rose-500" /> Prioridades de Hoje
           </h3>
           <div className="space-y-4">
              {[
                { task: 'Aprovar Criativo TikTok #12', p: 'Alta', time: '14h Deadline', color: 'bg-rose-500' },
                { task: 'Ajustar UTM Campanha Black', p: 'Média', time: '16h Deadline', color: 'bg-blue-500' },
                { task: 'Subir Budget Remarketing', p: 'Alta', time: 'Fazer agora', color: 'bg-rose-500' },
                { task: 'Briefing Landing Page B2B', p: 'Média', time: 'EOD', color: 'bg-zinc-500' },
              ].map((t, i) => (
                <div key={i} className="group p-4 rounded-2xl bg-accent/20 border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer">
                   <div className="flex items-center justify-between mb-1">
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-[0.1em] text-white ${t.color}`}>{t.p}</span>
                      <span className="text-[10px] font-black text-muted-foreground opacity-40">{t.time}</span>
                   </div>
                   <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{t.task}</p>
                </div>
              ))}
           </div>
           <button 
              onClick={() => window.location.href='/projects'}
              className="mt-8 w-full py-4 bg-accent/30 rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
           >
              Ver todas as tarefas
           </button>
        </div>

      </div>

      {/* Feed de Atividade Recente (O que o Monday e ClickUp fazem) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-card border border-border rounded-[40px] p-8 shadow-sm">
            <h3 className="text-xl font-black text-foreground tracking-tighter mb-8 flex items-center">
               <MousePointer2 className="w-5 h-5 mr-3 text-indigo-500" /> Feed de Atividade
            </h3>
            <div className="space-y-6">
               {[
                 { id: '1', user: 'MM', action: 'adicionou um asset', project: 'Black Friday 26', time: '10min atrás' },
                 { id: '2', user: 'AL', action: 'alterou status para Done', project: 'Lançamento Q4', time: '42min atrás' },
                 { id: '3', user: 'JP', action: 'comentou no briefing', project: 'Empresa X', time: '2h atrás' },
               ].map((a, i) => (
                 <Link href={`/projects/${a.id}`} key={i} className="flex items-center space-x-4 group/item hover:bg-primary/5 p-2 rounded-2xl transition-all">
                    <div className="w-10 h-10 rounded-full bg-accent border border-border flex items-center justify-center text-[10px] font-black uppercase tracking-tighter group-hover/item:bg-primary group-hover/item:text-white transition-all">{a.user}</div>
                    <div className="flex-1">
                       <p className="text-xs font-medium text-foreground">
                         <span className="font-black underline decoration-primary/30">{a.user}</span> {a.action} em <span className="font-black text-primary">{a.project}</span>
                       </p>
                       <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">{a.time}</p>
                    </div>
                 </Link>
               ))}
            </div>
         </div>

         <div className="bg-card border border-border rounded-[40px] p-8 shadow-sm flex flex-col justify-center items-center text-center space-y-4">
            <PieChart className="w-16 h-16 text-primary opacity-20" />
            <div>
               <h4 className="text-lg font-black text-foreground tracking-tighter">Insights do Marketing OS</h4>
               <p className="text-sm text-muted-foreground font-medium max-w-[280px]">Você concluiu 14% mais tarefas do que a média da semana passada. Mantenha o ritmo.</p>
            </div>
            <div className="flex items-center space-x-4">
               <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Deep Work Streak</span>
                  <span className="text-xl font-black text-orange-500">🔥 5 DIAS</span>
               </div>
               <button 
                 onClick={() => alert("📊 Hub de Performance: Este módulo exibirá o ROI comparativo por canal (em desenvolvimento).")}
                 className="bg-primary/10 text-primary px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all font-black"
               >
                 Ver Estatísticas
               </button>
            </div>
         </div>
      </div>

      {/* FOOTER DASHBOARD - WORKLOAD & CAPACITY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
         <div className="bg-card border border-border p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
            <h3 className="text-xl font-black text-foreground tracking-tighter mb-6">Workload Capacity</h3>
            <div className="space-y-6">
               {[
                  { name: 'Matheus M.', tasks: 8, load: 85, color: 'bg-primary' },
                  { name: 'Alice L.', tasks: 3, load: 40, color: 'bg-emerald-500' },
                  { name: 'João P.', tasks: 12, load: 110, color: 'bg-rose-500' },
               ].map((user) => (
                  <div key={user.name} className="space-y-2">
                     <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                        <span>{user.name}</span>
                        <span className={user.load > 100 ? 'text-rose-500' : 'text-muted-foreground'}>{user.tasks} Tasks ({user.load}%)</span>
                     </div>
                     <div className="h-2 w-full bg-accent/30 rounded-full overflow-hidden">
                        <div style={{ width: `${Math.min(user.load, 100)}%` }} className={`h-full ${user.color} transition-all duration-1000`} />
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="bg-card border border-border p-8 rounded-[40px] shadow-2xl flex flex-col justify-center items-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl">🎯</div>
            <h3 className="text-xl font-black text-foreground tracking-tighter">Foco Total (Sunsama Mode)</h3>
            <p className="text-sm text-muted-foreground max-w-xs">Arraste tarefas cruciais para cá para bloquear distrações e focar na entrega de hoje.</p>
            <button className="px-8 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">Iniciar Ritual Diário</button>
         </div>
      </div>

    </div>
  )
}
