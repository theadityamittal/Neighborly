from django.db import models
from django.utils import timezone
import os
import uuid
from django.contrib.auth.models import User
from django.conf import settings

def bulletin_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    return os.path.join("bulletin/uploads/", filename)

class BulletinItem(models.Model):
    post_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bulletin_posts") 
    #user_id = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    content = models.TextField()
    post_type = models.CharField(max_length=100)
    visibility = models.CharField(max_length=10, default='public')  # public, neighborhood, private (=invite only)
    tags = models.JSONField(default=list, blank=True)
    image = models.ImageField(upload_to=bulletin_image_upload_path, null=True, blank=True)
    date_posted = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(null=True, blank=True, default=timezone.now)
    # Location related
    location = models.CharField(max_length=255)
    street_address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    zip_code = models.CharField(max_length=20, blank=True, null=True)
    neighborhood = models.CharField(max_length=100, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)

    
    def get_image_url(self, obj):
        if obj.image:
            return f"{settings.AWS_S3_BASE_URL}{obj.image}"
        return None