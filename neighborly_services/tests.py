from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status

from neighborly_services.models import ServiceItem, ServiceSignUp

class ServiceTests(APITestCase):
    
    def setUp(self):
        self.register_url = reverse('register')
        self.grab_service_data = reverse('grabServiceData')
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
        self.assertIn("access", login_response.data)
        return login_response.data["access"]
    
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
            "price": "0",
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
            price="0",
            status="pending"
        )

        # Build PATCH URL
        patch_url = f"/api/services/signup/{signup.signup_id}/status/"

        # Send PATCH
        response = self.client.patch(
            patch_url,
            data={"status": "accepted"},
            format="json"
        )

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print("\n√ test_service_signup_status_patch passed!")

    