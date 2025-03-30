from django.test import TestCase
from rest_framework.test import APITestCase

# Create your tests here.
class ServiceTests(APITestCase):
    
    def setUp(self):
        self.grab_service_data = reverse('grabServiceData') 

        self.user_data = {
            "name": "Steve Harvey",
            "email": "steveharvey@example.com",
            "phone_number": "1234567890",
            "address": "123 Street, City",
            "neighborhood": "Brooklyn",
            "account_type": "customer",
            "password": "password123"
        }

    # def test_grab_services(self):
    #     self.client.post(self.register_url, self.user_data, format='json')
    #     login_response = self.client.post(self.login_url, {
    #         "email": self.user_data["email"],
    #         "password": self.user_data["password"]
    #     }, format='json')

    #     refresh_token = login_response.data.get("refresh")
    #     response = self.client.post(self.token_refresh_url, {
    #         "refresh": refresh_token
    #     }, format='json')
    #     print(response.data)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertIn("access", response.data)

    #     response = self.client.post(self.register_url, self.user_data, format='json')
    #     print(response.data)
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     self.assertEqual(response.data["message"], "User created successfully")
    #     self.assertTrue(CustomUser.objects.filter(email=self.user_data["email"]).exists())