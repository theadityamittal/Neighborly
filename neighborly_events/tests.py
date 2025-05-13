from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from neighborly_events.models import Event

User = get_user_model()


class GrabEventsByOrganizerTests(APITestCase):

    def setUp(self):
        # Create a user
        self.user = User.objects.create_user(
            name="Test User",
            email="testuser@example.com",
            phone_number="1234567890",
            address="123 Test St",
            neighborhood="Test Neighborhood",
            account_type="customer",
            city="Test City",
            zip_code="12345",
            password="testpassword",
        )
        self.event = Event.objects.create(
            event_name="Test Event",
            organizer_name=self.user.name,
            organizer_id=str(self.user.user_id),
            description="This is a test event.",
            location="Test Location",
            date="2024-05-01",
            time="14:00:00",
            visibility="public",
            tags=["test", "event"],
        )

        # Login to get the access token
        login_url = reverse("token_obtain_pair")
        response = self.client.post(
            login_url,
            {"email": "testuser@example.com", "password": "testpassword"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.token = response.data["access"]

    def test_grab_events_by_organizer(self):
        url = f"/events/grabEventsData/organizer/{self.user.user_id}"

        response = self.client.get(url, HTTP_AUTHORIZATION=f"Bearer {self.token}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("events", response.data)
        self.assertEqual(len(response.data["events"]), 1)

        event_data = response.data["events"][0]
        self.assertEqual(event_data["event_name"], "Test Event")
        self.assertEqual(event_data["location"], "Test Location")
