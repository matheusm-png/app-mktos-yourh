'use client'

import { useState, useOptimistic, useTransition } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus } from 'lucide-react'

type Project = {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  drive_folder_id: string | null;
  created_at: string;
}

export default function ProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [isPending, startTransition] = useTransition()
  const [optimisticProjects, addOptimisticProject] = useOptimistic(
    projects,
    (state, newProject: Project) => [newProject, ...state]
  )

  const [isCreating, setIsCreating] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDesc, setNewProjectDesc] = useState('')

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault()
    if (!newProjectName.trim()) return

    const tempId = crypto.randomUUID()
    const newProject = {
      id: tempId,
      name: newProjectName,
      description: newProjectDesc,
      color: '#4F46E5',
      drive_folder_id: null,
      created_at: new Date().toISOString()
    }

    // Atualização otimista da UI (instantâneo!)
    startTransition(() => {
      addOptimisticProject(newProject)
    })

    setNewProjectName('')
    setNewProjectDesc('')
    setIsCreating(false)

    // Persistindo na base de dados
    const { data, error } = await supabase
      .from('projects')
      .insert([
        { name: newProject.name, description: newProject.description, color: newProject.color }
      ])
      .select()
      .single()

    if (error) {
      console.error(error)
      alert("Houve um erro ao criar o projeto.")
      // Idealmente reverter state aqui caso falhe, 
      // mas para mantermos mais simples para demonstração
    } else if (data) {
      setProjects((current) => [data, ...current])
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Projetos</h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-9 px-4 py-2 text-sm font-medium hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Projeto
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateProject} className="mb-8 p-4 border rounded-xl bg-card">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome do Projeto</label>
              <input 
                autoFocus
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-ring focus:outline-none" 
                placeholder="Ex: Campanha Black Friday" 
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descrição (opcional)</label>
              <input 
                value={newProjectDesc}
                onChange={e => setNewProjectDesc(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-ring focus:outline-none" 
                placeholder="Breve resumo..." 
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button 
                type="button" 
                onClick={() => setIsCreating(false)}
                className="rounded-md border border-input h-9 px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="rounded-md bg-primary text-primary-foreground h-9 px-4 py-2 text-sm font-medium hover:bg-primary/90"
              >
                Salvar
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {optimisticProjects.map(project => (
          <div key={project.id} className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col justify-between">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold leading-none tracking-tight">{project.name}</h3>
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: project.color || '#4F46E5'}} />
              </div>
              {project.description && (
                <p className="text-sm text-muted-foreground mt-2">{project.description}</p>
              )}
            </div>
            <div className="p-6 pt-0 mt-auto">
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 w-full transition-colors">
                Abrir Creative Room
              </button>
            </div>
          </div>
        ))}

        {optimisticProjects.length === 0 && !isCreating && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-xl">
            Nenhum projeto encontrado. Crie o seu primeiro!
          </div>
        )}
      </div>
    </div>
  )
}
