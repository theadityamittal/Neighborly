from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import ServiceItem, ServiceSignUp

User = get_user_model()


class ServiceTests(APITestCase):

    def setUp(self):
        self.register_url = reverse("register")
        self.login_url = reverse("token_obtain_pair")

        self.user_data = {
            "name": "Steve Harvey",
            "email": "steveharvey@example.com",
            "phone_number": "1234567890",
            "address": "123 Street, City",
            "city": "Test City",
            "zip_code": "12345",
            "latitude": 40.7128,
            "longitude": -74.0060,
            "neighborhood": "Brooklyn",
            "account_type": "customer",
            "password": "password123",
        }

        self.token = self.authenticate_user()
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")
        self.user_id = User.objects.get(email=self.user_data["email"]).user_id
        self.id = User.objects.get(email=self.user_data["email"]).id

    def authenticate_user(self):
        register_response = self.client.post(
            self.register_url, self.user_data, format="json"
        )
        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)

        login_response = self.client.post(
            self.login_url,
            {"email": self.user_data["email"], "password": self.user_data["password"]},
            format="json",
        )

        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn("access", login_response.data)
        return login_response.data["access"]

    """==============Creation of service=============="""

    def test_user_can_create_service_item(self):
        payload = {
            "title": "Pet Sitting",
            "description": "Need someone to feed my cat while I’m away.",
            "location": "Queens",
            "available": True,
        }

        url = "/services/"
        response = self.client.post(url, data=payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ServiceItem.objects.count(), 1)

        service = ServiceItem.objects.first()
        self.assertEqual(service.title, "Pet Sitting")
        self.assertEqual(service.location, "Queens")
        self.assertEqual(service.service_provider, str(self.user_id))

        print("\n√ test_user_can_create_service_item passed!")

    """==============Signup for the service=============="""

    def test_user_can_signup_for_service(self):
        # Create a service item
        service = ServiceItem.objects.create(
            title="Neighborhood Clean-Up",
            description="Help clean the park.",
            service_provider=self.user_id,
            location="Brooklyn",
            available=True,
        )
        service.save()

        # Use the GET API to fetch the service and verify it's accessible
        get_url = f"/services/{service.service_id}/"
        get_response = self.client.get(get_url)

        # Assert the service is returned correctly from the API
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)
        self.assertEqual(get_response.data["service_id"], service.service_id)
        self.assertEqual(get_response.data["title"], "Neighborhood Clean-Up")
        print("\n√ create service passed!")

        # Build signup URL
        signup_url = f"/services/{service.service_id}/signup/"

        # Prepare signup data
        signup_data = {
            "start_date": "2025-04-25",
            "end_date": "2025-04-26",
            "messages": "Excited to help!",
            "price": 0,
            "user_id": str(self.user_id),
        }

        # Send POST with auth
        response = self.client.post(signup_url, data=signup_data, format="json")

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ServiceSignUp.objects.count(), 1)
        self.assertEqual(ServiceSignUp.objects.first().messages, "Excited to help!")
        print("\n√ signup service passed!")

    """==============Update Signup Details (approve request)=============="""

    def test_service_signup_status_patch(self):
        # Create a service
        service = ServiceItem.objects.create(
            title="Garden Help",
            description="Help plant vegetables.",
            service_provider=self.user_id,
            location="Brooklyn",
            available=True,
        )

        # Create a signup
        signup = ServiceSignUp.objects.create(
            service=service,
            user_id=self.user_id,
            start_date="2025-04-25",
            end_date="2025-04-26",
            messages="I'd love to help!",
            price=0,
            status="pending",
        )

        # Build PATCH URL
        patch_url = f"/services/signup/{signup.signup_id}/"

        # Send PATCH
        response = self.client.patch(
            patch_url, data={"status": "accepted"}, format="json"
        )

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print("\n√ test_service_signup_status_patch passed!")

    """=== Update Signup Details (approve request) - check dates ==="""

    def test_patch_signup_status_without_blocking_dates(self):
        # Create service
        service = ServiceItem.objects.create(
            title="Bike Repair",
            description="Fix my bike",
            service_provider=self.user_id,
            location="Brooklyn",
            latitude=40.6782,
            longitude=-73.9442,
            closestAvailability=None,
            unavailable_dates=[],
            available=True,
        )

        # Create signup
        signup = ServiceSignUp.objects.create(
            service=service,
            user_id=self.user_id,
            start_date="2025-05-01",
            end_date="2025-05-03",
            messages="I'll bring tools!",
            price=0,
            status="pending",
        )

        # Send PATCH request to accept the signup
        patch_url = f"/services/signup/{signup.signup_id}/"
        response = self.client.patch(
            patch_url, data={"status": "accepted"}, format="json"
        )

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data["message"], "Signup status updated to 'accepted'."
        )

        # Refresh objects from DB
        signup.refresh_from_db()
        service.refresh_from_db()

        # Ensure status changed
        self.assertEqual(signup.status, "accepted")

        # Ensure unavailable_dates did NOT change
        self.assertEqual(service.unavailable_dates, [])
        self.assertIsNone(service.closestAvailability)

        print("\n√ test_patch_signup_status_without_blocking_dates passed!")

    """==============Get Service Details=============="""

    def test_get_service_by_id(self):
        service = ServiceItem.objects.create(
            title="Grocery Delivery",
            description="Help deliver groceries to seniors.",
            service_provider=self.user_id,
            location="Brooklyn",
            latitude=40.6782,
            longitude=-73.9442,
            available=True,
        )

        url = f"/services/{service.service_id}/"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], service.title)
        self.assertEqual(response.data["service_id"], service.service_id)
        print("\n√ test_get_service_by_id passed!")

    """==============Get Service Details - invalid case=============="""

    def test_get_invalid_service_returns_404(self):
        url = "/services/invalid-id/"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        print("\n√ test_get_invalid_service_returns_404 passed!")

    """==============Get Service Details - invalid case=============="""

    def test_get_service_requires_authentication(self):
        self.client.credentials()  # clear credentials
        response = self.client.get("/services/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        print("\n√ test_get_service_requires_authentication passed!")

    """==============Filter Services by Fields=============="""

    def test_filter_services_by_city_and_availability(self):
        # Create sample services
        ServiceItem.objects.create(
            title="Yoga Class",
            description="Morning yoga in Central Park",
            service_provider=self.user_id,
            location="New York",
            city="NY",
            available=True,
        )

        ServiceItem.objects.create(
            title="Cooking Workshop",
            description="Learn to cook Italian dishes",
            service_provider=self.user_id,
            location="Brooklyn",
            city="NY",
            available=False,
        )

        ServiceItem.objects.create(
            title="Dog Walking",
            description="Evening dog walks",
            service_provider=self.user_id,
            location="San Francisco",
            city="San Francisco",
        )

        # Filter by city=New York & available=true
        response = self.client.get("/services/?city=NY&title=Yoga")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Should return only the Yoga Class
        results = response.data
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["title"], "Yoga Class")
        self.assertEqual(results[0]["city"], "NY")

        print("\n√ test_filter_services_by_city_and_availability passed!")


"""==============Get Services By User=============="""


def test_get_services_by_user(self):
    # Create two services for the user
    service1 = ServiceItem.objects.create(
        title="Neighborhood Cleanup",
        description="Cleaning up the local park.",
        service_provider=self.user_id,
        location="Brooklyn",
        available=True,
    )
    service2 = ServiceItem.objects.create(
        title="Pet Sitting",
        description="Taking care of pets while the owner is away.",
        service_provider=self.user_id,
        location="Queens",
        available=True,
    )

    # Ensure that the services were created
    self.assertEqual(ServiceItem.objects.count(), 2)

    # Build URL to get services by the user
    url = f"/services/user/{self.user_id}/"

    # Send GET request to get services by the user
    response = self.client.get(url)

    # Assertions
    self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Check if the returned services match the ones created
    services = response.data.get("services", [])
    self.assertEqual(len(services), 2)

    # Check that the titles of the returned services are correct
    titles = [service["title"] for service in services]
    self.assertIn(service1.title, titles)
    self.assertIn(service2.title, titles)

    print("\n√ test_get_services_by_user passed!")
