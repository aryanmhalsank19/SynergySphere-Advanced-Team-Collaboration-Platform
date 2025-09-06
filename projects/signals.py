from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Task, Comment, Notification

@receiver(post_save, sender=Task)
def notify_task_events(sender, instance: Task, created, **kwargs):
    if created and instance.assignee_id:
        Notification.objects.create(user_id=instance.assignee_id, type="task_assigned", project=instance.project, task=instance)
    elif not created:
        # simple: notify assignee on updates
        if instance.assignee_id:
            Notification.objects.create(user_id=instance.assignee_id, type="task_updated", project=instance.project, task=instance)

@receiver(post_save, sender=Comment)
def notify_comment(sender, instance: Comment, created, **kwargs):
    if created:
        # notify task assignee (or project owner) except author
        if instance.task and instance.task.assignee_id and instance.task.assignee_id != instance.author_id:
            Notification.objects.create(user_id=instance.task.assignee_id, type="comment_added", project=instance.project, task=instance.task, comment=instance)
