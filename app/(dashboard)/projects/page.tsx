import { supabase } from "@/lib/supabase"
import ProjectsClient from "./ProjectsClient"

export const revalidate = 0; // Disable static rendering

export default async function ProjectsPage() {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading projects:', error);
  }

  return (
    <ProjectsClient initialProjects={projects || []} />
  )
}
