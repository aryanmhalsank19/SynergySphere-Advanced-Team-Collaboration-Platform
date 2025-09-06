import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Users,
  MoreVertical,
  Archive
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockProjects } from '@/data/mockData';

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && !project.is_archived) ||
                         (filterStatus === 'archived' && project.is_archived);
    
    return matchesSearch && matchesFilter;
  });

  const getProjectProgress = (project: any) => {
    const projectTasks = project.tasks || [];
    if (projectTasks.length === 0) return 0;
    const completed = projectTasks.filter((t: any) => t.status === 'done').length;
    return Math.round((completed / projectTasks.length) * 100);
  };

  const getProjectStatus = (project: any) => {
    const progress = getProjectProgress(project);
    if (progress === 100) return { label: 'Completed', variant: 'default' as const, color: 'bg-success' };
    if (progress > 0) return { label: 'In Progress', variant: 'secondary' as const, color: 'bg-primary' };
    return { label: 'Not Started', variant: 'outline' as const, color: 'bg-muted-foreground' };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your team projects in one place.
          </p>
        </div>
        <Button asChild className="flex-shrink-0">
          <Link to="/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('active')}
          >
            Active
          </Button>
          <Button
            variant={filterStatus === 'archived' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('archived')}
          >
            Archived
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => {
          const progress = getProjectProgress(project);
          const status = getProjectStatus(project);
          const taskCount = project.tasks?.length || 0;
          const completedTasks = project.tasks?.filter(t => t.status === 'done').length || 0;
          
          return (
            <Card key={project.id} className="border-border/50 hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${status.color}`} />
                      <Badge variant={status.variant} className="text-xs">
                        {status.label}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      <Link to={`/projects/${project.id}`}>
                        {project.name}
                      </Link>
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/projects/${project.id}`}>View Project</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/projects/${project.id}/settings`}>Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Archive className="mr-2 h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{completedTasks} of {taskCount} tasks completed</span>
                  </div>
                </div>

                {/* Team and Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div className="flex -space-x-2">
                      {project.members.slice(0, 4).map((member) => (
                        <Avatar key={member.id} className="h-7 w-7 border-2 border-background">
                          <AvatarFallback className="text-xs">
                            {member.user.avatar}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {project.members.length > 4 && (
                        <div className="h-7 w-7 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">
                            +{project.members.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Action Button */}
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/projects/${project.id}`}>
                    View Project
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <div className="mb-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No projects found
              </h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? `No projects match "${searchQuery}". Try adjusting your search.`
                  : 'Get started by creating your first project.'
                }
              </p>
            </div>
            
            {!searchQuery && (
              <Button asChild>
                <Link to="/projects/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Project
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}