from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
import os
import uuid

def documents_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    return os.path.join("documents/uploads/", filename)


def validate_file_extension(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf']
    if not ext.lower() in valid_extensions:
        raise ValidationError('Unsupported file extension.')


class UsersDocuments(models.Model):
    ud_id = models.AutoField(primary_key=True)
    user_id = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    file = models.FileField(upload_to=documents_image_upload_path, validators=[validate_file_extension], null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
