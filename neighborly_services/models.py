from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
from utils.availability import get_earliest_availability

class ServiceItem(models.Model):
    service_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    service_provider = models.IntegerField()
    location = models.CharField(max_length=255)
    date_posted = models.DateTimeField(auto_now_add=True)
    available = models.BooleanField(default=True)
    waitlist = models.JSONField(default=list, blank=True)
    earliest_availability = models.DateField(null=True, blank=True)
    unavailable_dates = models.JSONField(default=list, blank=True)
    price = models.CharField(max_length=50, blank=True)  # or use DecimalField for calculations
    view_type = models.CharField(max_length=50, default="card")
    tabs = models.JSONField(default=list, blank=True)
    images = models.JSONField(default=list, blank=True)

    def update_availability(self):
        self.earliest_availability = get_earliest_availability(self.unavailable_dates)
        self.save()

    def __str__(self):
        return self.title

class ServiceSignUp(models.Model):
    signup_id = models.AutoField(primary_key=True)
    service = models.ForeignKey(ServiceItem, on_delete=models.CASCADE)
    user_id = models.CharField(max_length=255,null=True, blank=True) #models.ForeignKey(User, on_delete=models.CASCADE)  # use ForeignKey instead of CharField
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    messages = models.TextField(null=True, blank=True)
    price = models.CharField(max_length=50, blank=True) 
    status = models.CharField(max_length=10, default='pending')
    signed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Service ID {self.service}"