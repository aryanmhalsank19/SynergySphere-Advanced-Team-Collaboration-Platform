import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Users, 
  Plus, 
  Settings,
  BarChart3,
  Activity,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { KanbanBoard } from '@/components/project/KanbanBoard';
import { mockProjects, mockTasks, mockUsers, mockComments, weeklyProgressData } from '@/data/mockData';
import { Task, Project, Comment } from '@/types';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    // Find project and tasks
    const foundProject = mockProjects.find(p => p.id === parseInt(id || ''));
    if (foundProject) {
      setProject(foundProject);
      const projectTasks = mockTasks.filter(t => t.project_id === foundProject.id);
      setTasks(projectTasks);
    }
  }, [id]);

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Project not found</p>
        <Link to="/projects" className="text-primary hover:underline">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  const handleTaskUpdate = (taskId: number, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const handleTaskCreate = (status: string) => {
    // In a real app, this would open a modal or form
    console.log('Create task in column:', status);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    // In a real app, this would open a task modal
    console.log('Open task:', task);
  };

  const getTaskStatusData = () => {
    const statusCounts = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'To Do', value: statusCounts.todo || 0, color: '#6B7280' },
      { name: 'In Progress', value: statusCounts.in_progress || 0, color: '#3B82F6' },
      { name: 'Done', value: statusCounts.done || 0, color: '#10B981' },
      { name: 'Blocked', value: statusCounts.blocked || 0, color: '#EF4444' }
    ];
  };

  const getRecentActivity = () => {
    return [
      {
        id: 1,
        type: 'task_created',
        message: 'Created task "Setup project infrastructure"',
        user: mockUsers[1],
        timestamp: '2 hours ago'
      },
      {
        id: 2,
        type: 'comment_added',
        message: 'Commented on "Design user authentication flow"',
        user: mockUsers[2],
        timestamp: '4 hours ago'
      },
      {
        id: 3,
        type: 'task_completed',
        message: 'Completed task "Setup CI/CD pipeline"',
        user: mockUsers[1],
        timestamp: '1 day ago'
      }
    ];
  };

  const progress = tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) : 0;
  const chartConfig = {
    todo: { label: "To Do", color: "#6B7280" },
    progress: { label: "In Progress", color: "#3B82F6" },
    done: { label: "Done", color: "#10B981" },
    blocked: { label: "Blocked", color: "#EF4444" }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
            <p className="text-muted-foreground mt-1">{project.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{tasks.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{tasks.filter(t => t.status === 'done').length}</p>
              </div>
              <div className="text-success">
                <Badge variant="secondary" className="bg-success/10 text-success">
                  {progress}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Team Size</p>
                <p className="text-2xl font-bold">{project.members.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Comments</p>
                <p className="text-2xl font-bold">{mockComments.filter(c => c.project_id === project.id).length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {project.members.map((member) => (
              <div key={member.id} className="flex items-center gap-3 p-3 bg-surface-elevated rounded-xl">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{member.user.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{member.user.full_name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="p-3 h-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="board" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="board">
          <KanbanBoard
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskCreate={handleTaskCreate}
            onTaskClick={handleTaskClick}
          />
        </TabsContent>

        <TabsContent value="activity">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest updates and changes in this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getRecentActivity().map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-surface-elevated rounded-xl">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{activity.user.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{activity.user.full_name}</span>{' '}
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Task Distribution */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Task Distribution</CardTitle>
                <CardDescription>Current status of all tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getTaskStatusData()}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                      >
                        {getTaskStatusData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Weekly Progress */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Weekly Progress</CardTitle>
                <CardDescription>Completed vs planned tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyProgressData}>
                      <XAxis dataKey="week" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="completed" fill="#10B981" name="Completed" />
                      <Bar dataKey="planned" fill="#3B82F6" name="Planned" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}