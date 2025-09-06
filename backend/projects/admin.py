from django.contrib import admin
from .models import Project, ProjectMember, Task, Comment, Notification, ActivityLog

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'members_count', 'is_archived', 'created_at']
    list_filter = ['is_archived', 'created_at']
    search_fields = ['name', 'description', 'owner__email']
    readonly_fields = ['id', 'created_at', 'updated_at']

@admin.register(ProjectMember)
class ProjectMemberAdmin(admin.ModelAdmin):
    list_display = ['project', 'user', 'role', 'joined_at']
    list_filter = ['role', 'joined_at']
    search_fields = ['project__name', 'user__email']

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'assignee', 'status', 'priority', 'due_date', 'created_at']
    list_filter = ['status', 'priority', 'created_at']
    search_fields = ['title', 'description', 'project__name', 'assignee__email']
    readonly_fields = ['id', 'created_at', 'updated_at']

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['project', 'task', 'author', 'created_at']
    list_filter = ['created_at']
    search_fields = ['body', 'author__email', 'project__name']
    readonly_fields = ['id', 'created_at', 'updated_at']

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'type', 'project', 'is_read', 'created_at']
    list_filter = ['type', 'is_read', 'created_at']
    search_fields = ['user__email', 'message', 'project__name']

@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ['project', 'actor', 'verb', 'target_type', 'created_at']
    list_filter = ['verb', 'target_type', 'created_at']
    search_fields = ['actor__email', 'project__name']