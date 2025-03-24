from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField


class ServiceItem(models.Model):
    service_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    service_provider = models.IntegerField()
    location = models.CharField(max_length=255)
    date_posted = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class ServiceStatus(models.Model):
    status_id = models.AutoField(primary_key=True)
    service_id = models.IntegerField()
    available = models.BooleanField(default=True)
    current_user = models.IntegerField(null=True, blank=True)
    waitlist = ArrayField(models.IntegerField(), blank=True, default=list)
    earliest_availability = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Service ID {self.service_id}"