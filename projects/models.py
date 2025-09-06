from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class TimeStamped(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True

class Project(TimeStamped):
    name = models.CharField(max_length=140, db_index=True)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.PROTECT, related_name="owned_projects")
    is_archived = models.BooleanField(default=False)

    class Meta:
        unique_together = [("owner", "name")]
        indexes = [models.Index(fields=["name"]), models.Index(fields=["owner"])]

    def __str__(self): return self.name

class ProjectMember(models.Model):
    ROLE_CHOICES = [("admin", "Admin"), ("member", "Member"), ("viewer", "Viewer")]
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="memberships")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="project_memberships")
    role = models.CharField(max_length=12, choices=ROLE_CHOICES, default="member")
    joined_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = [("project", "user")]
        indexes = [models.Index(fields=["project", "role"])]

class Task(TimeStamped):
    STATUS = [("todo","To Do"), ("in_progress","In Progress"), ("done","Done"), ("blocked","Blocked")]
    PRIORITY = [("low","Low"), ("medium","Medium"), ("high","High"), ("urgent","Urgent")]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tasks")
    title = models.CharField(max_length=180, db_index=True)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default="todo", db_index=True)
    priority = models.CharField(max_length=12, choices=PRIORITY, default="medium", db_index=True)
    assignee = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="assigned_tasks")
    reporter = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="reported_tasks")
    due_date = models.DateField(null=True, blank=True, db_index=True)
    order = models.FloatField(default=0.0)  # for kanban ordering

    class Meta:
        indexes = [
            models.Index(fields=["project", "status"]),
            models.Index(fields=["assignee", "status"]),
            models.Index(fields=["project", "due_date"]),
        ]

    def __str__(self): return f"{self.project.name} • {self.title}"

class TaskWatcher(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="watchers")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="watching_tasks")
    class Meta:
        unique_together = [("task", "user")]

class TaskStatusHistory(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="status_history")
    old_status = models.CharField(max_length=20, choices=Task.STATUS)
    new_status = models.CharField(max_length=20, choices=Task.STATUS)
    changed_by = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name="status_changes")
    changed_at = models.DateTimeField(auto_now_add=True)

class Comment(TimeStamped):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="comments")
    task = models.ForeignKey(Task, null=True, blank=True, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    parent = models.ForeignKey("self", null=True, blank=True, on_delete=models.CASCADE, related_name="replies")
    body = models.TextField()

class Notification(models.Model):
    TYPE = [
        ("task_assigned","Task Assigned"),
        ("task_updated","Task Updated"),
        ("comment_added","Comment Added"),
        ("deadline_soon","Deadline Soon"),
        ("project_invite","Project Invite"),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    type = models.CharField(max_length=20, choices=TYPE)
    project = models.ForeignKey(Project, null=True, blank=True, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, null=True, blank=True, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, null=True, blank=True, on_delete=models.CASCADE)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["user","is_read","created_at"])]
        ordering = ["-created_at"]

class ActivityLog(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="activities")
    actor = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    verb = models.CharField(max_length=40)
    target_type = models.CharField(max_length=20)  # project|task|comment
    target_id = models.IntegerField()
    meta = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

def attachment_path(instance, filename):
    base = "project" if instance.project_id else "task" if instance.task_id else "comment"
    rid = instance.project_id or instance.task_id or instance.comment_id
    return f"attachments/{base}/{rid}/{filename}"

class Attachment(models.Model):
    file = models.FileField(upload_to=attachment_path)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, null=True, blank=True, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, null=True, blank=True, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, null=True, blank=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if not (self.project_id or self.task_id or self.comment_id):
            from django.core.exceptions import ValidationError
            raise ValidationError("Attachment must relate to a project, task, or comment.")
