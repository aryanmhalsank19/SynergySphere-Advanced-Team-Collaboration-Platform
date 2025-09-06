from django.contrib import admin
from .models import Project, ProjectMember, Task, Comment, Notification, ActivityLog, TaskWatcher, TaskStatusHistory, Attachment

admin.site.register([Project, ProjectMember, Task, TaskWatcher, TaskStatusHistory, Comment, Notification, ActivityLog, Attachment])
