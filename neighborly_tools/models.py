from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField


class ToolItem(models.Model):
    tool_id = models.AutoField(primary_key=True)
    owner_id = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    description = models.TextField()
    condition = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    date_posted = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class ToolStatus(models.Model):
    status_id = models.AutoField(primary_key=True)
    tool_id = models.IntegerField()
    available = models.BooleanField(default=True)
    current_user = models.IntegerField(null=True, blank=True)
    waitlist = ArrayField(models.IntegerField(), blank=True, default=list)
    earliest_availability = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Service ID {self.tool_id_id}"
