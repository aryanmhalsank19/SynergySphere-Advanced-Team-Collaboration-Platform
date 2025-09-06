from rest_framework import permissions
from .models import ProjectMember

class IsProjectMember(permissions.BasePermission):
    """
    Custom permission to only allow members of a project to access it.
    """
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
            
        project_id = None
        
        # Try to get project_id from different sources
        if hasattr(view, 'get_object'):
            try:
                obj = view.get_object()
                if hasattr(obj, 'project'):
                    project_id = obj.project.id
                elif hasattr(obj, 'id'):
                    project_id = obj.id
            except:
                pass
        
        if not project_id:
            project_id = request.query_params.get('project') or request.data.get('project_id')
        
        if not project_id:
            return True  # Let the view handle this
            
        return ProjectMember.objects.filter(
            project_id=project_id,
            user=request.user
        ).exists()

class IsProjectAdmin(permissions.BasePermission):
    """
    Custom permission to only allow project admins.
    """
    
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
            
        project = obj if hasattr(obj, 'members') else obj.project
        
        return ProjectMember.objects.filter(
            project=project,
            user=request.user,
            role='admin'
        ).exists()