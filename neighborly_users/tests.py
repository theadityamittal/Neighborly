from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import CustomUser


class AuthenticationTests(APITestCase):

    def setUp(self):
        self.register_url = reverse("register")
        self.login_url = reverse("token_obtain_pair")
        self.token_refresh_url = reverse("token_refresh")

        self.user_data = {
            "name": "Steve Harvey",
            "email": "steveharvey@example.com",
            "phone_number": "1234567890",
            "address": "123 Street, Main",
            "city": "Metropolis",
            "neighborhood": "Brooklyn",
            "zip_code": "10001",
            "latitude": 40.7128,
            "longitude": -74.0060,
            "account_type": "customer",
            "password": "password123",
        }

    def test_user_registration(self):
        response = self.client.post(self.register_url, self.user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "User created successfully")
        self.assertTrue(
            CustomUser.objects.filter(email=self.user_data["email"]).exists()
        )

    def test_user_login(self):
        # Register first
        self.client.post(self.register_url, self.user_data, format="json")
        # Login
        response = self.client.post(
            self.login_url,
            {"email": self.user_data["email"], "password": self.user_data["password"]},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.access = response.data["access"]
        self.refresh = response.data["refresh"]

    def test_user_information(self):
        # Register and login
        self.client.post(self.register_url, self.user_data, format="json")
        login_response = self.client.post(
            self.login_url,
            {"email": self.user_data["email"], "password": self.user_data["password"]},
            format="json",
        )

        access = login_response.data.get("access")
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + access)
        response = self.client.get(reverse("user_detail"), format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.user_data["email"])
        self.assertEqual(response.data["city"], self.user_data["city"])
        self.assertEqual(response.data["zip_code"], self.user_data["zip_code"])

    def test_user_update(self):
        # Register
        self.client.post(self.register_url, self.user_data, format="json")

        user = CustomUser.objects.get(email=self.user_data["email"])
        user.verified = True
        user.save()

        # Login
        login_response = self.client.post(
            self.login_url,
            {"email": self.user_data["email"], "password": self.user_data["password"]},
            format="json",
        )

        # Set token
        access = login_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + access)
        updated_data = {
            "name": "James Bond",
            "phone_number": "0955554321",
            "city": "Gotham",
        }

        response = self.client.patch("/auth/update/", updated_data, format="json")

        # Verify update response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "User updated successfully")

        # Fetch updated info
        response_information = self.client.get(reverse("user_detail"), format="json")
        self.assertEqual(response_information.data["name"], updated_data["name"])
        self.assertEqual(response_information.data["city"], updated_data["city"])

    def test_refresh(self):
        self.client.post(self.register_url, self.user_data, format="json")
        login_response = self.client.post(
            self.login_url,
            {"email": self.user_data["email"], "password": self.user_data["password"]},
            format="json",
        )

        refresh = login_response.data.get("refresh")
        response = self.client.post(
            self.token_refresh_url, {"refresh": refresh}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
