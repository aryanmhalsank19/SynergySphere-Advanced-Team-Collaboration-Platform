import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Calendar,
  MessageSquare,
  Paperclip,
  AlertCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Task } from '@/types';
import { cn } from '@/lib/utils';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskUpdate: (taskId: number, updates: Partial<Task>) => void;
  onTaskCreate: (columnId: string) => void;
  onTaskClick: (task: Task) => void;
}

const columns = [
  { id: 'todo', title: 'To Do', status: 'todo' as const },
  { id: 'in_progress', title: 'In Progress', status: 'in_progress' as const },
  { id: 'done', title: 'Done', status: 'done' as const },
];

const priorityColors = {
  low: 'bg-green-100 text-green-700 border-green-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  urgent: 'bg-red-100 text-red-700 border-red-200'
};

const statusIcons = {
  todo: Clock,
  in_progress: AlertCircle,
  done: CheckCircle2,
  blocked: AlertCircle
};

export function KanbanBoard({ tasks, onTaskUpdate, onTaskCreate, onTaskClick }: KanbanBoardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const getTasksByStatus = (status: string) => {
    return tasks
      .filter(task => task.status === status)
      .sort((a, b) => a.order - b.order);
  };

  const handleDragEnd = (result: any) => {
    setIsDragging(false);
    
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId as Task['status'];

    // Update task status
    onTaskUpdate(taskId, { status: newStatus });
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const formatDueDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: `${Math.abs(diffDays)} days overdue`, color: 'text-red-600' };
    if (diffDays === 0) return { text: 'Due today', color: 'text-orange-600' };
    if (diffDays === 1) return { text: 'Due tomorrow', color: 'text-yellow-600' };
    return { text: `Due in ${diffDays} days`, color: 'text-muted-foreground' };
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.status);
          const StatusIcon = statusIcons[column.status];
          
          return (
            <div key={column.id} className="flex flex-col">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 p-3 bg-surface-elevated rounded-xl">
                <div className="flex items-center gap-2">
                  <StatusIcon className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold text-foreground">{column.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {columnTasks.length}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTaskCreate(column.status)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Column Content */}
              <Droppable droppableId={column.status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "flex-1 space-y-3 p-2 rounded-xl transition-all duration-200 min-h-[200px]",
                      snapshot.isDraggingOver && "bg-primary/5 border-2 border-primary/20 border-dashed"
                    )}
                  >
                    {columnTasks.map((task, index) => {
                      const dueDate = formatDueDate(task.due_date);
                      
                      return (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={cn(
                                "cursor-pointer border-border/50 hover:shadow-lg transition-all duration-200",
                                snapshot.isDragging && "rotate-2 shadow-xl scale-105"
                              )}
                              onClick={() => onTaskClick(task)}
                            >
                              <CardContent className="p-4">
                                {/* Priority Badge */}
                                <div className="flex items-start justify-between mb-3">
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-xs font-medium border",
                                      priorityColors[task.priority]
                                    )}
                                  >
                                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                  </Badge>
                                  {task.comments && task.comments.length > 0 && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <MessageSquare className="h-3 w-3" />
                                      {task.comments.length}
                                    </div>
                                  )}
                                </div>

                                {/* Task Title */}
                                <h4 className="font-medium text-foreground mb-2 line-clamp-2">
                                  {task.title}
                                </h4>

                                {/* Task Description */}
                                {task.description && (
                                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                    {task.description}
                                  </p>
                                )}

                                {/* Task Meta */}
                                <div className="space-y-2">
                                  {/* Due Date */}
                                  {dueDate && (
                                    <div className={cn("flex items-center gap-1 text-xs", dueDate.color)}>
                                      <Calendar className="h-3 w-3" />
                                      {dueDate.text}
                                    </div>
                                  )}

                                  {/* Assignee */}
                                  {task.assignee && (
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                          <AvatarFallback className="text-xs">
                                            {task.assignee.avatar}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs text-muted-foreground">
                                          {task.assignee.full_name}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}

                    {/* Empty State */}
                    {columnTasks.length === 0 && !isDragging && (
                      <div className="text-center py-8 text-muted-foreground">
                        <div className="text-sm">No tasks in {column.title.toLowerCase()}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onTaskCreate(column.status)}
                          className="mt-2 text-xs"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add task
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}