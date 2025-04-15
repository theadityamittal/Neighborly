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

        # Build signup URL
        signup_url = f"/api/services/{service.service_id}/signup/"
        print(signup_url) 

        # Prepare signup data
        signup_data = {
            "start_date": "2025-04-25",
            "end_date": "2025-04-26",
            "messages": "Excited to help!",
            "price": "0"
        }

        # Send POST with auth
        response = self.client.post(
            signup_url,
            data=signup_data,
            content_type="application/json",
            HTTP_AUTHORIZATION=f"Bearer {token}"
        )

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ServiceSignUp.objects.count(), 1)
        self.assertEqual(ServiceSignUp.objects.first().messages, "Excited to help!")

    # def test_grab_service_data_test(self):
    #     access_token = self.authenticate_user()

    #     response = self.client.get(
    #         self.grab_service_data,
    #         HTTP_AUTHORIZATION=f'Bearer {access_token}'
    #     )

    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
