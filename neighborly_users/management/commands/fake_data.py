from django.core.management.base import BaseCommand
from neighborly_users.models import CustomUser
from neighborly_services.models import ServiceItem
from neighborly_petitions.models import Petition
from neighborly_events.models import Event
from neighborly_tools.models import Tool, BorrowRequest
from datetime import date, time, timedelta


class Command(BaseCommand):
    help = "Populate the database with fake data"
    CustomUser.objects.filter(email="bobbybill@example.com").delete()

    def handle(self, *args, **options):
        # Create a user
        user = CustomUser.objects.create_user(
            email="bobbybill@example.com",
            name="Bobby Bill",
            phone_number="8888888888",
            address="123 Main Street",
            neighborhood="Downtown",
            account_type="resident",
            password="Something",
        )

        # Create a service
        ServiceItem.objects.create(
            title="Neighborhood Lawn Mowing",
            description="Affordable lawn mowing services for local residents.",
            service_provider=user.user_id.int >> 64,
            location="Downtown",
            available=True,
            earliest_availability=date.today(),
        )

        # Create a petition (now with new fields)
        Petition.objects.create(
            title="Install More Street Lights",
            description="Petition to install more street lights in the community.",
            organizer_id=str(user.user_id),
            visibility=True,
            tags=["safety", "infrastructure"],
            target=200,
            location="Downtown",
            provider=user.name,
            voting_ends_at=date.today() + timedelta(days=30),
            hero_image="https://source.unsplash.com/featured/?streetlights,city",
        )

        # Create an event
        Event.objects.create(
            event_name="Neighborhood Watch Meeting",
            organizer_name=user.name,
            organizer_id=str(user.user_id),
            description=("Monthly meeting to discuss safety and incidents "
                         "in the neighborhood."),
            location="Community Center",
            date=date.today(),
            time=time(hour=18, minute=30),
            visibility="public",
            tags=["safety", "community"],
            recurring=True,
            max_attendees=30,
        )
        # Create a tool
        tool = Tool.objects.create(
            owner_id=str(user.user_id),
            name="Cordless Drill",
            description="A reliable cordless drill, great for household fixes.",
            condition="Used",
            availability=True,
        )

        # Create a borrow request
        BorrowRequest.objects.create(
            tool=tool,
            user_id=str(user.user_id),
            borrow_date=date.today(),
            return_date=date.today() + timedelta(days=3),
        )

        self.stdout.write(self.style.SUCCESS("Fake Data Inserted"))
