from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status

from neighborly_services.models import ServiceItem, ServiceSignUp

class ServiceTests(APITestCase):
    
    def setUp(self):
        self.register_url = reverse('register')
        self.login_url = reverse('token_obtain_pair')

        self.user_data = {
            "name": "Steve Harvey",
            "email": "steveharvey@example.com",
            "phone_number": "1234567890",
            "address": "123 Street, City",
            "neighborhood": "Brooklyn",
            "account_type": "customer",
            "password": "password123"
        }

    def authenticate_user(self):
        register_response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)

        login_response = self.client.post(self.login_url, {
            "email": self.user_data["email"],
            "password": self.user_data["password"]
        }, format='json')

        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", login_response.data)
        return login_response.data["access_token"]
    
    def test_user_can_signup_for_service(self):
        # Authenticate and get token
        token = self.authenticate_user()

        # Create a service item
        service = ServiceItem.objects.create(
            title="Neighborhood Clean-Up",
            description="Help clean the park.",
            service_provider=1,
            location="Brooklyn",
            available=True
        )
        service.save()

        # Use the GET API to fetch the service and verify it's accessible
        get_url = f"/api/services/{service.service_id}/"
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        get_response = self.client.get(get_url)

        # Assert the service is returned correctly from the API
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)
        self.assertEqual(get_response.data["service_id"], service.service_id)
        self.assertEqual(get_response.data["title"], "Neighborhood Clean-Up")
        print("\n√ create service passed!")

        '''==============Signup for the service=============='''
        # Build signup URL
        signup_url = f"/api/services/{service.service_id}/signup/"

        # Prepare signup data
        signup_data = {
            "start_date": "2025-04-25",
            "end_date": "2025-04-26",
            "messages": "Excited to help!",
            "price": 0,
            "user_id": "1"
        }

        # Send POST with auth
        response = self.client.post(
            signup_url,
            data=signup_data,
            format='json',
            # content_type="application/json",
            HTTP_AUTHORIZATION=f"Bearer {token}"
        )
        
        # Assertions
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ServiceSignUp.objects.count(), 1)
        self.assertEqual(ServiceSignUp.objects.first().messages, "Excited to help!")
        print("\n√ signup service passed!")

    def test_service_signup_status_patch(self):
        token = self.authenticate_user()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        # Create a service
        service = ServiceItem.objects.create(
            title="Garden Help",
            description="Help plant vegetables.",
            service_provider=1,
            location="Brooklyn",
            available=True
        )

        # Create a signup
        signup = ServiceSignUp.objects.create(
            service=service,
            user_id="1",
            start_date="2025-04-25",
            end_date="2025-04-26",
            messages="I'd love to help!",
            price=0,
            status="pending"
        )

        # Build PATCH URL
        patch_url = f"/api/services/signup/{signup.signup_id}/"

        # Send PATCH
        response = self.client.patch(
            patch_url,
            data={"status": "accepted"},
            format="json"
        )

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print("\n√ test_service_signup_status_patch passed!")
    
    def test_patch_signup_status_without_blocking_dates(self):
        token = self.authenticate_user()
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        # Create service
        service = ServiceItem.objects.create(
            title="Bike Repair",
            description="Fix my bike",
            service_provider=1,  # or self.user.id if you store it
            location="Brooklyn",
            latitude=40.6782,
            longitude=-73.9442,
            closestAvailability=None,
            unavailable_dates=[],
            available=True
        )

        # Create signup
        signup = ServiceSignUp.objects.create(
            service=service,
            user_id=1,
            start_date="2025-05-01",
            end_date="2025-05-03",
            messages="I'll bring tools!",
            price=0,
            status="pending"
        )


        # Send PATCH request to accept the signup
        patch_url = f"/api/services/signup/{signup.signup_id}/"
        response = self.client.patch(patch_url, data={"status": "accepted"}, format="json")

        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Signup status updated to 'accepted'.")

        # Refresh objects from DB
        signup.refresh_from_db()
        service.refresh_from_db()

        # Ensure status changed
        self.assertEqual(signup.status, "accepted")

        # Ensure unavailable_dates did NOT change
        self.assertEqual(service.unavailable_dates, [])
        self.assertIsNone(service.closestAvailability)

        print("\n√ test_patch_signup_status_without_blocking_dates passed!")

    def test_get_service_by_id(self):
        token = self.authenticate_user()
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        service = ServiceItem.objects.create(
            title="Grocery Delivery",
            description="Help deliver groceries to seniors.",
            service_provider=1,
            location="Brooklyn",
            latitude=40.6782,
            longitude=-73.9442,
            available=True
        )

        url = f"/api/services/{service.service_id}/"
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], service.title)
        self.assertEqual(response.data["service_id"], service.service_id)
        print("\n√ test_get_service_by_id passed!")

    def test_get_invalid_service_returns_404(self):
        token = self.authenticate_user()
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        url = "/api/services/invalid-id/"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        print("\n√ test_get_invalid_service_returns_404 passed!")

    def test_get_service_requires_authentication(self):
        service = ServiceItem.objects.create(
            title="Dog Walking",
            description="Walk dogs in the neighborhood.",
            service_provider=1,
            location="Brooklyn",
            latitude=40.6782,
            longitude=-73.9442,
            available=True
        )

        url = f"/api/services/{service.service_id}/"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        print("\n√ test_get_service_requires_authentication passed!")
    