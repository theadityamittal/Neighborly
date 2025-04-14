from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import CustomUser

class AuthenticationTests(APITestCase):
    
    def setUp(self):
        self.register_url = reverse('register') 
        self.login_url = reverse('token_obtain_pair')
        self.token_refresh_url = reverse('token_refresh') 

        self.user_data = {
            "name": "Steve Harvey",
            "email": "steveharvey@example.com",
            "phone_number": "1234567890",
            "address": "123 Street, City",
            "neighborhood": "Brooklyn",
            "account_type": "customer",
            "password": "password123"
        }

    def test_user_registration(self):
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "User created successfully")
        self.assertTrue(CustomUser.objects.filter(email=self.user_data["email"]).exists())

    def test_user_login(self):
        self.client.post(self.register_url, self.user_data, format='json')
        response = self.client.post(self.login_url, {
            "email": self.user_data["email"],
            "password": self.user_data["password"]
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.token = response.data["access"]
        self.refresh_token = response.data["refresh"]

    def test_user_information(self):
        self.client.post(self.register_url, self.user_data, format='json')
        login_response = self.client.post(self.login_url, {
            "email": self.user_data["email"],
            "password": self.user_data["password"]
        }, format='json')

        access_token = login_response.data.get("access")
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = self.client.get(reverse('user_detail'), format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.user_data["email"])
    
    def test_user_update(self):
        self.client.post(self.register_url, self.user_data, format='json')
        login_response = self.client.post(self.login_url, {
            "email": self.user_data["email"],
            "password": self.user_data["password"]
        }, format='json')

        access_token = login_response.data.get("access")
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        updated_data = {
            "name": "James Bond",
            "phone_number": "0955554321"
        }
        response = self.client.patch(reverse('update_user'), updated_data, format='json')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response_information = self.client.get(reverse('user_detail'), format='json')
        print(response_information.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "User updated successfully")
        self.assertEqual(response_information.data["name"], updated_data["name"])

    def test_refresh_token(self):
        self.client.post(self.register_url, self.user_data, format='json')
        login_response = self.client.post(self.login_url, {
            "email": self.user_data["email"],
            "password": self.user_data["password"]
        }, format='json')

        refresh_token = login_response.data.get("refresh")
        response = self.client.post(self.token_refresh_url, {
            "refresh": refresh_token
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)