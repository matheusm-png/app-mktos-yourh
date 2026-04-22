-- Create Enum for Task Status
CREATE TYPE task_status AS ENUM ('To Do', 'Doing', 'Approval', 'Done');
CREATE TYPE campaign_status AS ENUM ('Draft', 'Active', 'Paused');

-- Projects Table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#4F46E5', -- default primary color
  drive_folder_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks Table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES tasks(id) ON DELETE CASCADE, -- Suporte a Subtasks
  title TEXT NOT NULL,
  description TEXT, -- Briefing da task
  status task_status DEFAULT 'To Do',
  priority TEXT,
  assigned_to UUID, 
  due_date TIMESTAMP WITH TIME ZONE,
  estimated_hours NUMERIC(5,2) DEFAULT 0,
  canvas_position JSONB DEFAULT '{"x": 0, "y": 0}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task Comments Table
CREATE TABLE task_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  author_id UUID,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assets Table
CREATE TABLE assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  google_drive_url TEXT,
  thumbnail_url TEXT,
  version INTEGER DEFAULT 1,
  file_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Traffic Campaigns Table
CREATE TABLE traffic_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
  platform TEXT,
  daily_budget NUMERIC(10,2),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  status campaign_status DEFAULT 'Draft',
  landing_page_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) - Basic setup assuming usage via auth
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_campaigns ENABLE ROW LEVEL SECURITY;

-- Creating open policies for everything since this is an internal tool (Can be restricted later)
CREATE POLICY "Allow all access to authenticated users on projects" ON projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to authenticated users on tasks" ON tasks FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to authenticated users on assets" ON assets FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to authenticated users on traffic_campaigns" ON traffic_campaigns FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to authenticated users on task_comments" ON task_comments FOR ALL TO authenticated USING (true);
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
