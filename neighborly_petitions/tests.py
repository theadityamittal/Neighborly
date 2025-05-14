from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from .models import Petition, PetitionSignature
from django.contrib.auth import get_user_model


class PetitionTests(APITestCase):

    def setUp(self):
        self.register_url = reverse("register")
        self.grab_petition_data = reverse("grabPetitionData")
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

    def test_grab_petition_data_test(self):
        access = self.authenticate_user()

        response = self.client.get(
            self.grab_petition_data, HTTP_AUTHORIZATION=f"Bearer {access}"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_petitions(self):
        access = self.authenticate_user()

        # Get the authenticated user from DB
        User = get_user_model()
        user = User.objects.get(email=self.user_data["email"])

        # Create a petition
        petition = Petition.objects.create(
            title="Save the Rainforest",
            description="Protecting rainforests around the world.",
            organizer_id=str(user.user_id),
            target=1000,
        )

        # Sign the petition with user_id matching request.user.id
        PetitionSignature.objects.create(
            petition=petition,
            user_id=str(user.user_id),  # THIS matches what your view saves
        )

        # Now test get_my_petitions
        response = self.client.get(
            reverse("getPetitions"), HTTP_AUTHORIZATION=f"Bearer {access}"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Save the Rainforest")
