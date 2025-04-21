from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
import os
import uuid

def documents_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    return os.path.join("documents/uploads/", filename)


class UsersDocuments(models.Model):
    ud_id = models.AutoField(primary_key=True)
    user_id = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    file = models.ImageField(upload_to=documents_image_upload_path, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
