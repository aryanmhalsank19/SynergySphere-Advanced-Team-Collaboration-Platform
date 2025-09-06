import { User, Project, Task, Comment, Notification, WorkloadData } from '@/types';

// Demo credentials shown in UI
export const DEMO_CREDENTIALS = {
  email: 'demo@synergysphere.com',
  password: 'demo123',
  note: 'Use these credentials to explore the platform'
};

export const mockUsers: User[] = [
  {
    id: 1,
    username: 'demo',
    email: 'demo@synergysphere.com',
    full_name: 'Demo User',
    avatar: '👤',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    username: 'sarah_chen',
    email: 'sarah.chen@company.com',
    full_name: 'Sarah Chen',
    avatar: '👩‍💼',
    created_at: '2024-01-10T09:00:00Z'
  },
  {
    id: 3,
    username: 'mike_torres',
    email: 'mike.torres@company.com',
    full_name: 'Mike Torres',
    avatar: '👨‍💻',
    created_at: '2024-01-12T11:30:00Z'
  },
  {
    id: 4,
    username: 'lisa_kim',
    email: 'lisa.kim@company.com',
    full_name: 'Lisa Kim',
    avatar: '👩‍🎨',
    created_at: '2024-01-08T14:15:00Z'
  },
  {
    id: 5,
    username: 'alex_rivera',
    email: 'alex.rivera@company.com',
    full_name: 'Alex Rivera',
    avatar: '👨‍🔬',
    created_at: '2024-01-20T08:45:00Z'
  }
];

export const mockTasks: Task[] = [
  {
    id: 1,
    project_id: 1,
    title: 'Setup project infrastructure',
    description: 'Configure CI/CD pipeline and development environment',
    status: 'done',
    priority: 'high',
    assignee_id: 2,
    assignee: mockUsers[1],
    due_date: '2024-02-15T17:00:00Z',
    order: 1,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    project_id: 1,
    title: 'Design user authentication flow',
    description: 'Create wireframes and user flow for login/register process',
    status: 'in_progress',
    priority: 'high',
    assignee_id: 3,
    assignee: mockUsers[2],
    due_date: '2024-02-20T17:00:00Z',
    order: 2,
    created_at: '2024-01-16T09:30:00Z'
  },
  {
    id: 3,
    project_id: 1,
    title: 'Implement dashboard analytics',
    description: 'Build interactive charts and metrics for project insights',
    status: 'todo',
    priority: 'medium',
    assignee_id: 4,
    assignee: mockUsers[3],
    due_date: '2024-02-25T17:00:00Z',
    order: 3,
    created_at: '2024-01-17T14:20:00Z'
  },
  {
    id: 4,
    project_id: 1,
    title: 'Setup team notification system',
    description: 'Configure real-time notifications for task updates',
    status: 'todo',
    priority: 'low',
    assignee_id: 5,
    assignee: mockUsers[4],
    due_date: '2024-03-01T17:00:00Z',
    order: 4,
    created_at: '2024-01-18T11:10:00Z'
  },
  {
    id: 5,
    project_id: 2,
    title: 'Market research analysis',
    description: 'Conduct competitive analysis and user interviews',
    status: 'in_progress',
    priority: 'urgent',
    assignee_id: 2,
    assignee: mockUsers[1],
    due_date: '2024-02-18T17:00:00Z',
    order: 1,
    created_at: '2024-01-19T13:45:00Z'
  },
  {
    id: 6,
    project_id: 2,
    title: 'Product roadmap planning',
    description: 'Define quarterly milestones and feature priorities',
    status: 'todo',
    priority: 'high',
    assignee_id: 3,
    assignee: mockUsers[2],
    due_date: '2024-02-22T17:00:00Z',
    order: 2,
    created_at: '2024-01-20T15:30:00Z'
  }
];

export const mockProjects: Project[] = [
  {
    id: 1,
    name: 'SynergySphere Platform',
    description: 'Next-generation team collaboration platform with AI-powered insights',
    owner_id: 1,
    is_archived: false,
    created_at: '2024-01-15T10:00:00Z',
    members: [
      { id: 1, user_id: 1, project_id: 1, role: 'admin', user: mockUsers[0] },
      { id: 2, user_id: 2, project_id: 1, role: 'member', user: mockUsers[1] },
      { id: 3, user_id: 3, project_id: 1, role: 'member', user: mockUsers[2] },
      { id: 4, user_id: 4, project_id: 1, role: 'member', user: mockUsers[3] },
      { id: 5, user_id: 5, project_id: 1, role: 'viewer', user: mockUsers[4] }
    ],
    tasks: mockTasks.filter(t => t.project_id === 1)
  },
  {
    id: 2,
    name: 'Mobile App Launch',
    description: 'Strategic launch campaign for our new mobile application',
    owner_id: 2,
    is_archived: false,
    created_at: '2024-01-18T09:00:00Z',
    members: [
      { id: 6, user_id: 2, project_id: 2, role: 'admin', user: mockUsers[1] },
      { id: 7, user_id: 3, project_id: 2, role: 'member', user: mockUsers[2] },
      { id: 8, user_id: 4, project_id: 2, role: 'member', user: mockUsers[3] }
    ],
    tasks: mockTasks.filter(t => t.project_id === 2)
  },
  {
    id: 3,
    name: 'Q1 Marketing Campaign',
    description: 'Comprehensive marketing strategy for first quarter growth',
    owner_id: 3,
    is_archived: false,
    created_at: '2024-01-20T11:00:00Z',
    members: [
      { id: 9, user_id: 3, project_id: 3, role: 'admin', user: mockUsers[2] },
      { id: 10, user_id: 4, project_id: 3, role: 'member', user: mockUsers[3] },
      { id: 11, user_id: 5, project_id: 3, role: 'member', user: mockUsers[4] }
    ],
    tasks: []
  }
];

export const mockComments: Comment[] = [
  {
    id: 1,
    project_id: 1,
    task_id: 1,
    author_id: 2,
    author: mockUsers[1],
    body: 'Great work on setting up the CI/CD pipeline! The deployment process is now much smoother.',
    parent_id: undefined,
    created_at: '2024-01-22T10:30:00Z'
  },
  {
    id: 2,
    project_id: 1,
    task_id: 2,
    author_id: 1,
    author: mockUsers[0],
    body: 'The authentication flow looks good. Should we add social login options?',
    parent_id: undefined,
    created_at: '2024-01-23T14:15:00Z'
  },
  {
    id: 3,
    project_id: 1,
    task_id: 2,
    author_id: 3,
    author: mockUsers[2],
    body: 'I think social login would be a great addition. Let me research the best providers.',
    parent_id: 2,
    created_at: '2024-01-23T15:20:00Z'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 1,
    user_id: 1,
    type: 'task_assigned',
    project_id: 1,
    task_id: 3,
    is_read: false,
    created_at: '2024-01-24T09:00:00Z',
    message: 'You have been assigned to "Implement dashboard analytics"',
    project: mockProjects[0],
    task: mockTasks[2]
  },
  {
    id: 2,
    user_id: 1,
    type: 'comment_added',
    project_id: 1,
    task_id: 2,
    is_read: false,
    created_at: '2024-01-23T15:20:00Z',
    message: 'Mike Torres commented on "Design user authentication flow"',
    project: mockProjects[0],
    task: mockTasks[1]
  },
  {
    id: 3,
    user_id: 1,
    type: 'deadline_soon',
    project_id: 1,
    task_id: 1,
    is_read: true,
    created_at: '2024-01-22T08:00:00Z',
    message: 'Task "Setup project infrastructure" is due in 2 days',
    project: mockProjects[0],
    task: mockTasks[0]
  }
];

export const mockWorkloadData: WorkloadData[] = [
  {
    user_id: 1,
    user_name: 'Demo User',
    task_count: 5,
    completed_tasks: 2,
    overdue_tasks: 0
  },
  {
    user_id: 2,
    user_name: 'Sarah Chen',
    task_count: 4,
    completed_tasks: 3,
    overdue_tasks: 1
  },
  {
    user_id: 3,
    user_name: 'Mike Torres',
    task_count: 3,
    completed_tasks: 1,
    overdue_tasks: 0
  },
  {
    user_id: 4,
    user_name: 'Lisa Kim',
    task_count: 2,
    completed_tasks: 0,
    overdue_tasks: 0
  },
  {
    user_id: 5,
    user_name: 'Alex Rivera',
    task_count: 1,
    completed_tasks: 0,
    overdue_tasks: 0
  }
];

// Chart data for analytics
export const taskStatusData = [
  { name: 'To Do', value: 4, color: '#6B7280' },
  { name: 'In Progress', value: 2, color: '#3B82F6' },
  { name: 'Done', value: 1, color: '#10B981' },
  { name: 'Blocked', value: 0, color: '#EF4444' }
];

export const workloadChartData = mockWorkloadData.map(user => ({
  name: user.user_name.split(' ')[0],
  active: user.task_count - user.completed_tasks,
  completed: user.completed_tasks,
  overdue: user.overdue_tasks
}));

export const weeklyProgressData = [
  { week: 'Week 1', completed: 2, planned: 5 },
  { week: 'Week 2', completed: 4, planned: 6 },
  { week: 'Week 3', completed: 3, planned: 4 },
  { week: 'Week 4', completed: 6, planned: 7 }
];