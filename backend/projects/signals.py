from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Task, Comment, Project, ActivityLog, Notification

@receiver(post_save, sender=Task)
def task_saved(sender, instance, created, **kwargs):
    """Create activity log when task is created or updated"""
    verb = 'created' if created else 'updated'
    ActivityLog.objects.create(
        project=instance.project,
        actor=instance.reporter if created else instance.reporter,  # Could be updated by different user
        verb=verb,
        target_type='task',
        target_id=str(instance.id),
        meta={
            'task_title': instance.title,
            'status': instance.status,
            'priority': instance.priority,
            'assignee': str(instance.assignee.id) if instance.assignee else None
        }
    )

@receiver(post_save, sender=Comment)
def comment_created(sender, instance, created, **kwargs):
    """Create activity log when comment is created"""
    if created:
        ActivityLog.objects.create(
            project=instance.project,
            actor=instance.author,
            verb='commented',
            target_type='comment',
            target_id=str(instance.id),
            meta={
                'comment_body': instance.body[:100],
                'task_id': str(instance.task.id) if instance.task else None,
                'task_title': instance.task.title if instance.task else None
            }
        )

@receiver(post_save, sender=Project)
def project_created(sender, instance, created, **kwargs):
    """Create activity log when project is created"""
    if created:
        ActivityLog.objects.create(
            project=instance,
            actor=instance.owner,
            verb='created',
            target_type='project',
            target_id=str(instance.id),
            meta={
                'project_name': instance.name,
                'project_description': instance.description[:100]
            }
        )