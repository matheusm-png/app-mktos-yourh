import Link from 'next/link';
import { Briefcase, LayoutDashboard, Settings } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card">
        <div className="p-6">
          <h2 className="text-lg font-bold tracking-tight text-primary">Marketing OS</h2>
        </div>
        <nav className="space-y-1 px-3">
          <Link href="/projects" className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link href="/projects" className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium bg-accent text-accent-foreground">
            <Briefcase className="h-4 w-4" />
            <span>Projetos</span>
          </Link>
          <Link href="/settings" className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
            <Settings className="h-4 w-4" />
            <span>Configurações</span>
          </Link>
        </nav>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <header className="flex h-16 items-center border-b border-border bg-card px-6">
          <h1 className="text-xl font-semibold">Workspace</h1>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
