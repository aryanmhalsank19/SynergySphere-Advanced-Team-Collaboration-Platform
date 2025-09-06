from rest_framework import viewsets, mixins, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from .models import Project, ProjectMember, Task, Comment, Notification, ActivityLog, TaskStatusHistory, TaskWatcher
from .serializers import (
    ProjectSerializer, ProjectMemberSerializer, TaskSerializer,
    CommentSerializer, NotificationSerializer, ActivitySerializer
)
from .permissions import IsProjectMember

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().select_related("owner")
    serializer_class = ProjectSerializer
    permission_classes = [IsProjectMember]

    def get_queryset(self):
        u = self.request.user
        return Project.objects.filter(Q(owner=u) | Q(memberships__user=u)).distinct()

    def perform_create(self, serializer):
        self.check_permissions(self.request)  # auth check
        project = serializer.save()
        ActivityLog.objects.create(project=project, actor=self.request.user,
                                   verb="created_project", target_type="project", target_id=project.id)

    @action(detail=True, methods=["post"])
    def add_member(self, request, pk=None):
        project = self.get_object()
        role = request.data.get("role", "member")
        user_id = request.data.get("user_id")
        pm, created = ProjectMember.objects.get_or_create(project=project, user_id=user_id, defaults={"role": role})
        if not created:
            pm.role = role; pm.save()
        Notification.objects.create(user_id=user_id, type="project_invite", project=project)
        ActivityLog.objects.create(project=project, actor=request.user, verb="added_member", target_type="project", target_id=project.id, meta={"user_id": user_id, "role": role})
        return Response(ProjectMemberSerializer(pm).data)

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsProjectMember]

    def get_queryset(self):
        u = self.request.user
        project_id = self.request.query_params.get("project")
        qs = Task.objects.select_related("project","assignee","reporter")
        qs = qs.filter(Q(project__owner=u) | Q(project__memberships__user=u)).distinct()
        if project_id: qs = qs.filter(project_id=project_id)
        status_ = self.request.query_params.get("status")
        if status_: qs = qs.filter(status=status_)
        return qs

    def perform_update(self, serializer):
        old = Task.objects.get(pk=self.get_object().pk)
        task = serializer.save()
        if old.status != task.status:
            TaskStatusHistory.objects.create(task=task, old_status=old.status, new_status=task.status, changed_by=self.request.user)
        ActivityLog.objects.create(project=task.project, actor=self.request.user, verb="updated_task",
                                   target_type="task", target_id=task.id, meta={"changes":"status/fields updated"})

    @action(detail=True, methods=["post"])
    def watch(self, request, pk=None):
        t = self.get_object()
        TaskWatcher.objects.get_or_create(task=t, user=request.user)
        return Response({"ok": True})

    @action(detail=False, methods=["get"])
    def workload(self, request):
        """Simple heuristic: count open tasks per assignee for a project."""
        project_id = request.query_params.get("project")
        qs = self.get_queryset().filter(project_id=project_id, status__in=["todo","in_progress","blocked"])
        data = qs.values("assignee").annotate(open_tasks=Count("id")).order_by("-open_tasks")
        return Response(list(data))

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsProjectMember]
    def get_queryset(self):
        u = self.request.user
        qs = Comment.objects.select_related("project","task","author")
        return qs.filter(Q(project__owner=u) | Q(project__memberships__user=u)).distinct()

class NotificationViewSet(mixins.ListModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    serializer_class = NotificationSerializer
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=False, methods=["post"])
    def mark_all_read(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({"ok": True})

class ActivityViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = ActivitySerializer
    def get_queryset(self):
        project_id = self.request.query_params.get("project")
        return ActivityLog.objects.filter(project_id=project_id).select_related("actor").order_by("-created_at")
