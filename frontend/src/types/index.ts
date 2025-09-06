export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  avatar?: string;
  created_at: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  owner_id: number;
  is_archived: boolean;
  created_at: string;
  members: ProjectMember[];
  tasks: Task[];
}

export interface ProjectMember {
  id: number;
  user_id: number;
  project_id: number;
  role: 'admin' | 'member' | 'viewer';
  user: User;
}

export interface Task {
  id: number;
  project_id: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id?: number;
  assignee?: User;
  due_date?: string;
  order: number;
  created_at: string;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  project_id: number;
  task_id?: number;
  author_id: number;
  author: User;
  body: string;
  parent_id?: number;
  created_at: string;
  replies?: Comment[];
}

export interface Notification {
  id: number;
  user_id: number;
  type: 'task_assigned' | 'task_updated' | 'comment_added' | 'deadline_soon' | 'project_invite';
  project_id: number;
  task_id?: number;
  is_read: boolean;
  created_at: string;
  message: string;
  project?: Project;
  task?: Task;
}

export interface WorkloadData {
  user_id: number;
  user_name: string;
  task_count: number;
  completed_tasks: number;
  overdue_tasks: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}