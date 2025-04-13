from django.db.models.signals import post_save
from django.dispatch import receiver
from datetime import date
from .models import ServiceSignUp, ServiceItem
from utils.availability import get_earliest_availability

@receiver(post_save, sender=ServiceSignUp)
def update_service_availability_on_signup(sender, instance, created, **kwargs):
    if created:
        service = instance.service_id
        today_str = date.today().isoformat()

        # Make sure unavailable_dates is a list
        if service.unavailable_dates is None:
            service.unavailable_dates = []

        if today_str not in service.unavailable_dates:
            service.unavailable_dates.append(today_str)
            service.earliest_availability = get_earliest_availability(service.unavailable_dates)
            service.save()