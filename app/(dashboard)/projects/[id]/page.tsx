import { supabase } from "@/lib/supabase"
import CreativeRoom from "./CreativeRoom"
import { notFound } from "next/navigation"

export const revalidate = 0;

export default async function ProjectRoomPage({ params }: { params: { id: string } }) {
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !project) {
    notFound();
  }

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', params.id);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]"> 
      <div className="mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Creative Room: {project.name}</h2>
        {project.description && <p className="text-muted-foreground text-sm mt-1">{project.description}</p>}
      </div>
      
      {/* Container principal ocupando o espaço restante para o Tldraw */}
      <div className="flex-1 relative border rounded-xl overflow-hidden bg-background shadow-sm">
        <CreativeRoom projectId={project.id} initialTasks={tasks || []} />
      </div>
    </div>
  )
}
