from django.core.management.base import BaseCommand
from neighborly_users.models import CustomUser
from neighborly_services.models import ServiceItem, ServiceSignUp
from neighborly_petitions.models import Petition, PetitionSignature
from neighborly_events.models import Event, EventSignUp
from datetime import date, time

class Command(BaseCommand):
    help = 'Populate the database with fake data'

    def handle(self, *args, **options):
        user = CustomUser.objects.create_user(
            email="bobbybill@example.com",
            name="Bobby Bill",
            phone_number="8888888888",
            address="123 Main Street",
            neighborhood="Downtown",
            account_type="resident",
            password="Something"
        )

        service = ServiceItem.objects.create(
            title="Neighborhood Lawn Mowing",
            description="Affordable lawn mowing services for local residents.",
            service_provider=user.user_id.int >> 64,
            location="Downtown",
            available=True,
            earliest_availability=date.today()
        )

        # --- Create a petition ---
        petition = Petition.objects.create(
            title="Install More Street Lights",
            description="Petition to install more street lights in the community.",
            organizer_id=str(user.user_id),
            visibility=True,
            tags=["safety", "infrastructure"],
            target=200
        )

        event = Event.objects.create(
            event_name="Neighborhood Watch Meeting",
            organizer_name=user.name,
            organizer_id=str(user.user_id),
            description="Monthly meeting to discuss safety and incidents in the neighborhood.",
            location="Community Center",
            date=date.today(),
            time=time(hour=18, minute=30),
            visibility="public",
            tags=["safety", "community"],
            recurring=True,
            max_attendees=30
        )

        self.stdout.write(self.style.SUCCESS("Fake Data Inserted"))
