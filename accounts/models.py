from django.contrib.auth.models import AbstractUser
from django.db import models

def avatar_path(instance, filename):
    return f"avatars/{instance.id}/{filename}"

class User(AbstractUser):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=160, db_index=True, blank=True)
    avatar = models.ImageField(upload_to=avatar_path, blank=True, null=True)

    REQUIRED_FIELDS = ["email"]

    def __str__(self):
        return self.full_name or self.username
