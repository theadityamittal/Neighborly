from django.db import models
import os
import uuid


def event_image_upload_path(instance, filename):
    ext = filename.split(".")[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    return os.path.join("events/uploads/", filename)


class Event(models.Model):
    event_id = models.AutoField(primary_key=True)
    event_name = models.CharField(max_length=255)
    organizer_name = models.CharField(max_length=255)
    organizer_id = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    date = models.DateField()
    time = models.TimeField()
    visibility = models.CharField(max_length=255)
    tags = models.JSONField(default=list, blank=True)
    recurring = models.BooleanField(default=False)
    max_attendees = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to=event_image_upload_path, null=True, blank=True)


class EventSignUp(models.Model):
    signup_id = models.AutoField(primary_key=True)
<<<<<<< HEAD
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="eventsignup")
=======
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name="eventsignup"
    )
>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf
    user_id = models.CharField(max_length=255)
    signed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.event_name
