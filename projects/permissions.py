from rest_framework import permissions
from .models import ProjectMember, Project

class IsProjectMember(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        project = obj if isinstance(obj, Project) else getattr(obj, "project", None)
        if not project: return False
        return ProjectMember.objects.filter(project=project, user=request.user).exists()

    def has_permission(self, request, view):
        return request.user.is_authenticated
