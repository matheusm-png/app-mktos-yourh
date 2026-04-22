'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  Settings, 
  Megaphone, 
  ChevronDown, 
  Plus, 
  Search,
  Zap,
  Globe,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/overview', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/projects', label: 'Projetos', icon: Briefcase },
    { href: '/campaigns', label: 'Tráfego', icon: Megaphone },
    { href: '/settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      
      {/* Sidebar - Design Elite / Glassmorphism Sidebar */}
      <aside className="w-72 border-r border-border/40 bg-card/10 backdrop-blur-3xl flex flex-col relative overflow-hidden transition-all duration-500">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
        
        <div className="p-8 flex items-center justify-between relative">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 bg-primary/20 border border-primary/40 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20">
                <Zap className="h-5 w-5 text-primary" />
             </div>
             <h2 className="text-xl font-black tracking-tight text-foreground uppercase tracking-widest">MarkOS</h2>
          </div>
        </div>

        <div className="px-6 mb-10 relative">
          <button onClick={() => alert("🔍 Global Search: Pesquise em tudo (Projects, tasks, Assets...)")} className="w-full flex items-center space-x-3 bg-accent/20 border border-border/50 rounded-2xl px-4 py-3 text-xs font-bold text-muted-foreground/60 hover:bg-accent/40 transition-all">
             <Search className="w-4 h-4" />
             <span>Pesquisa Rápida</span>
             <span className="ml-auto text-[8px] border border-border px-1.5 py-0.5 rounded uppercase">⌘K</span>
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-4 relative">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center group space-x-4 rounded-[20px] px-4 py-4 text-xs font-black uppercase tracking-[0.1em] transition-all relative
                  ${isActive 
                    ? 'bg-primary text-white shadow-2xl shadow-primary/30 active:scale-95' 
                    : 'text-muted-foreground/40 hover:bg-accent/30 hover:text-foreground'}`}
              >
                <item.icon className={`h-5 w-5 transition-transform duration-500 ${isActive ? 'stroke-[2.5]' : 'group-hover:scale-110'}`} />
                <span>{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]" />}
              </Link>
            );
          })}

          <div className="pt-10">
             <p className="px-4 text-[10px] font-black uppercase opacity-20 tracking-[0.3em] mb-4">TIME</p>
             <div className="space-y-1">
                {[
                  { name: 'Caio', role: 'Head de MKT', label: 'Caio', color: 'bg-orange-500' },
                  { name: 'Matheus', role: 'Gestor', label: 'Matheus', color: 'bg-blue-500' },
                  { name: 'Juan', role: 'Creative', label: 'Juan', color: 'bg-purple-500' },
                  { name: 'Raquel', role: 'Designer', label: 'Raquel', color: 'bg-rose-500' },
                ].map((member) => {
                  const isActive = pathname === `/home/${member.name.toLowerCase()}`;
                  return (
                    <Link 
                      key={member.name} 
                      href={`/home/${member.name.toLowerCase()}`} 
                      className={cn(
                        "flex items-center space-x-4 rounded-[20px] px-4 py-3 text-xs font-black uppercase tracking-[0.1em] transition-all relative group overflow-hidden",
                        isActive 
                          ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_20px_hsl(var(--primary)/0.2)] ring-1 ring-primary/20" 
                          : "text-muted-foreground/40 hover:bg-accent/30 hover:text-foreground"
                      )}
                    >
                       {/* Efeito de Iluminação Lateral para Item Ativo */}
                       {isActive && (
                         <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_12px_hsl(var(--primary)/0.8)]" />
                       )}

                       <div className={cn(
                         "w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black text-white shadow-2xl group-hover:scale-110 transition-transform",
                         member.color,
                         isActive && "ring-2 ring-primary/40 ring-offset-2 ring-offset-background"
                       )}>
                          {member.name.slice(0, 2).toUpperCase()}
                       </div>
                       <div className="flex flex-col">
                          <span className={cn(
                            "transition-colors",
                            isActive ? 'text-primary' : 'group-hover:text-foreground'
                          )}>{member.name}</span>
                          <span className="text-[8px] opacity-40 lowercase tracking-widest">{member.role}</span>
                       </div>

                       {/* Glow Background Interno para o Ativo */}
                       {isActive && (
                         <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                       )}
                    </Link>
                  )
                })}
             </div>
          </div>

          <div className="pt-10">
             <p className="px-4 text-[10px] font-black uppercase opacity-20 tracking-[0.3em] mb-4">Space</p>
             <div className="space-y-1">
                <button onClick={() => window.location.href='/projects'} className="w-full flex items-center space-x-4 rounded-[20px] px-4 py-3 text-xs font-black uppercase tracking-[0.1em] text-muted-foreground/40 hover:bg-accent/30 hover:text-foreground transition-all">
                   <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                   <span>Moitinho Work</span>
                   <ChevronDown className="ml-auto w-3 h-3 opacity-20" />
                </button>
             </div>
          </div>
        </nav>

        <div className="p-8 mt-auto border-t border-border/20 relative">
           <div className="flex items-center space-x-4 group cursor-pointer">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white font-black text-xs shadow-xl shadow-primary/20 ring-2 ring-transparent group-hover:ring-primary/40 transition-all">
                MM
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-foreground">M. Moitinho</span>
                <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Admin Global</span>
              </div>
              <Settings onClick={(e) => { e.stopPropagation(); window.location.href='/settings' }} className="ml-auto w-4 h-4 text-muted-foreground opacity-20 hover:opacity-100 transition-opacity" />
           </div>
        </div>
      </aside>
      
      {/* Main content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent">
        
        {/* Header - Minimalista / Floating Vibe */}
        <header className="flex h-20 items-center justify-between px-12 border-b border-border/20 bg-card/5 backdrop-blur-md z-40">
          <div className="flex items-center space-x-4">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <h1 className="text-xs font-black uppercase tracking-[0.3em] text-foreground/80 opacity-50 underline decoration-primary/30 underline-offset-8">Operações Globais</h1>
          </div>
          
          <div className="flex items-center space-x-6">
             <div className="flex items-center space-x-1 px-3 py-1.5 bg-accent/20 rounded-xl border border-border/50">
                <Globe className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">LATAM-SAO</span>
             </div>
             <button onClick={() => alert("🔔 Notificações: Sem alertas críticos no momento.")} className="p-2.5 rounded-2xl bg-accent/20 border border-border/50 text-muted-foreground/60 hover:text-primary transition-all relative">
                <Bell className="w-4 h-4" />
                <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-background" />
             </button>
             <div className="w-px h-8 bg-border/20 mx-2" />
             <button onClick={() => window.location.href='/projects'} className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all hover:scale-[1.05] active:scale-95">
               Ativar Unidade
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
