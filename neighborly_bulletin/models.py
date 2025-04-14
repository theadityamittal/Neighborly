from django.db import models
from django.utils import timezone
import uuid

class BulletinPost(models.Model):
    post_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    content = models.TextField()
    post_type = models.CharField(max_length=100)
    visibility = models.CharField(max_length=50)  # e.g., "public", "private", etc.
    tags = models.CharField(max_length=255, blank=True)  # comma-separated tags
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title