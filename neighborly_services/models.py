from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
# from utils.availability import get_earliest_availability

class ServiceItem(models.Model):
    service_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    service_provider = models.IntegerField()
    location = models.CharField(max_length=255)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    date_posted = models.DateTimeField(auto_now_add=True)
    available = models.BooleanField(default=True)
    waitlist = models.JSONField(default=list, blank=True)
    closestAvailability = models.DateField(null=True, blank=True)
    unavailable_dates = models.JSONField(default=list, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    quota = models.IntegerField(default=0, blank=True)
    visibility = models.CharField(max_length=10, default='public')  # public, neighborhood, private (=invite only)
    #view_type = models.CharField(max_length=50, default="card")
    tags = models.JSONField(default=list, blank=True)
    images = models.JSONField(default=list, blank=True)


    def __str__(self):
        return self.title

class ServiceSignUp(models.Model):
    signup_id = models.AutoField(primary_key=True)
    service = models.ForeignKey(ServiceItem, on_delete=models.CASCADE)
    user_id = models.CharField(max_length=255,null=True, blank=True) #models.ForeignKey(User, on_delete=models.CASCADE) 
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    messages = models.TextField(null=True, blank=True)
    price = models.CharField(max_length=50, blank=True) 
    status = models.CharField(max_length=10, default='pending')
    signed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Service ID {self.signup_id}"