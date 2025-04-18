import json
from django.db.models.signals import post_save
from django.dispatch import receiver
from datetime import date
from .models import ServiceSignUp, ServiceItem
from utils.availability import get_earliest_availability
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=ServiceSignUp)
def update_service_availability_on_signup(sender, instance, created, **kwargs):
    if not created:
        return

    service = instance.service
    today_str = date.today().isoformat()

    # Normalize unavailable_dates to a Python list
    ud = service.unavailable_dates
    if not isinstance(ud, list):
        try:
            ud = json.loads(ud)
            if not isinstance(ud, list):
                ud = []
        except Exception as e:
            logger.warning("Failed to decode unavailable_dates for service %s: %s", service.id, str(e))
            ud = []
    # Now safely append
    if today_str not in ud:
        ud.append(today_str)
        service.unavailable_dates = ud
        service.earliest_availability = get_earliest_availability(ud)
        service.save()
