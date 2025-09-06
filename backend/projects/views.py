from rest_framework import generics, viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, NotFound
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from django.contrib.auth import get_user_model
from .models import Project, ProjectMember, Task, Comment, Notification, ActivityLog
from .serializers import (
    ProjectListSerializer, ProjectDetailSerializer, ProjectCreateSerializer,
    TaskListSerializer, TaskCreateUpdateSerializer, CommentSerializer,
    NotificationSerializer, ActivityLogSerializer, ProjectMemberSerializer,
    WorkloadSerializer, UserBasicSerializer
)
from .permissions import IsProjectMember, IsProjectAdmin

User = get_user_model()

class ProjectViewSet(viewsets.ModelViewSet):
    """ViewSet for managing projects"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ProjectCreateSerializer
        elif self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectListSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Project.objects.filter(
            Q(owner=user) | Q(members__user=user)
        ).distinct().select_related('owner').prefetch_related('members__user')
        
        # Filter by mine parameter
        if self.request.query_params.get('mine') == 'true':
            queryset = queryset.filter(owner=user)
            
        return queryset
    
    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsProjectAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        """Add a member to the project"""
        project = self.get_object()
        
        # Check if user is admin
        if not ProjectMember.objects.filter(project=project, user=request.user, role='admin').exists():
            raise PermissionDenied("Only admins can add members")
        
        serializer = ProjectMemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            user = User.objects.get(id=serializer.validated_data['user_id'])
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        member, created = ProjectMember.objects.get_or_create(
            project=project,
            user=user,
            defaults={'role': serializer.validated_data.get('role', 'member')}
        )
        
        if not created:
            return Response({'error': 'User is already a member'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create notification
        Notification.objects.create(
            user=user,
            type='project_invite',
            project=project,
            message=f'You were added to project "{project.name}"'
        )
        
        return Response(ProjectMemberSerializer(member).data, status=status.HTTP_201_CREATED)

class TaskViewSet(viewsets.ModelViewSet):
    """ViewSet for managing tasks"""
    permission_classes = [permissions.IsAuthenticated, IsProjectMember]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return TaskCreateUpdateSerializer
        return TaskListSerializer
    
    def get_queryset(self):
        project_id = self.request.query_params.get('project')
        if not project_id:
            return Task.objects.none()
            
        return Task.objects.filter(project_id=project_id).select_related(
            'assignee', 'reporter', 'project'
        ).order_by('order', '-created_at')
    
    def perform_create(self, serializer):
        project_id = self.request.data.get('project_id')
        if not project_id:
            raise serializers.ValidationError("project_id is required")
            
        project = get_object_or_404(Project, id=project_id)
        
        # Check if user is project member
        if not ProjectMember.objects.filter(project=project, user=self.request.user).exists():
            raise PermissionDenied("You must be a project member")
        
        assignee_id = serializer.validated_data.get('assignee_id')
        assignee = None
        if assignee_id:
            assignee = get_object_or_404(User, id=assignee_id)
        
        task = serializer.save(
            project=project,
            reporter=self.request.user,
            assignee=assignee
        )
        
        # Create notification for assignee
        if assignee and assignee != self.request.user:
            Notification.objects.create(
                user=assignee,
                type='task_assigned',
                project=project,
                task=task,
                message=f'You were assigned task "{task.title}" in project "{project.name}"'
            )
    
    def perform_update(self, serializer):
        task = self.get_object()
        old_assignee = task.assignee
        old_status = task.status
        
        assignee_id = serializer.validated_data.get('assignee_id')
        new_assignee = None
        if assignee_id:
            new_assignee = get_object_or_404(User, id=assignee_id)
            
        task = serializer.save(assignee=new_assignee)
        
        # Create notifications
        if new_assignee and new_assignee != old_assignee and new_assignee != self.request.user:
            Notification.objects.create(
                user=new_assignee,
                type='task_assigned',
                project=task.project,
                task=task,
                message=f'You were assigned task "{task.title}" in project "{task.project.name}"'
            )
        
        # Notify about status change
        if task.status != old_status and task.assignee and task.assignee != self.request.user:
            Notification.objects.create(
                user=task.assignee,
                type='task_updated',
                project=task.project,
                task=task,
                message=f'Task "{task.title}" status changed to {task.get_status_display()}'
            )
    
    @action(detail=False, methods=['get'])
    def workload(self, request):
        """Get workload information for project members"""
        project_id = request.query_params.get('project')
        if not project_id:
            return Response({'error': 'project parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get open tasks count per assignee
        workload_data = Task.objects.filter(
            project_id=project_id,
            status__in=['todo', 'in_progress', 'blocked']
        ).values('assignee').annotate(
            open_tasks=Count('id')
        ).exclude(assignee__isnull=True)
        
        # Get user data
        result = []
        for item in workload_data:
            user = User.objects.get(id=item['assignee'])
            result.append({
                'assignee': UserBasicSerializer(user).data,
                'assignee_id': str(user.id),
                'open_tasks': item['open_tasks']
            })
        
        return Response(result)

class CommentViewSet(viewsets.ModelViewSet):
    """ViewSet for managing comments"""
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated, IsProjectMember]
    
    def get_queryset(self):
        project_id = self.request.query_params.get('project')
        task_id = self.request.query_params.get('task')
        
        queryset = Comment.objects.select_related('author', 'project', 'task').prefetch_related('replies')
        
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        if task_id:
            queryset = queryset.filter(task_id=task_id)
            
        # Only get top-level comments (replies are included via serializer)
        return queryset.filter(parent__isnull=True).order_by('-created_at')
    
    def perform_create(self, serializer):
        project_id = self.request.data.get('project_id')
        task_id = self.request.data.get('task_id')
        
        if not project_id:
            raise serializers.ValidationError("project_id is required")
            
        project = get_object_or_404(Project, id=project_id)
        task = None
        if task_id:
            task = get_object_or_404(Task, id=task_id, project=project)
        
        comment = serializer.save(
            author=self.request.user,
            project=project,
            task=task
        )
        
        # Create notification for task assignee
        if task and task.assignee and task.assignee != self.request.user:
            Notification.objects.create(
                user=task.assignee,
                type='comment_added',
                project=project,
                task=task,
                comment=comment,
                message=f'New comment on task "{task.title}" by {self.request.user.display_name}'
            )

class NotificationViewSet(viewsets.ModelViewSet):
    """ViewSet for managing notifications"""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(
            user=self.request.user
        ).select_related('project', 'task').order_by('-created_at')
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read"""
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'message': 'All notifications marked as read'})

class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for project activity logs"""
    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated, IsProjectMember]
    
    def get_queryset(self):
        project_id = self.request.query_params.get('project')
        if not project_id:
            return ActivityLog.objects.none()
            
        return ActivityLog.objects.filter(
            project_id=project_id
        ).select_related('actor', 'project').order_by('-created_at')