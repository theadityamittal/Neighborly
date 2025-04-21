from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth import get_user_model
from .models import UsersDocuments
from PIL import Image
import io

# Create your tests here.
class DocumentTests(APITestCase):
    
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
            "password": "password123",
        }
        self.staff_user = get_user_model().objects.create_superuser(
            email="admin@example.com",
            name="Admin User",
            phone_number="9876543210",
            address="456 Admin Street, City",
            neighborhood="Manhattan",
            account_type="admin",
            password="adminpassword"
        )
        
    
    def generate_test_image(self):
        image = Image.new("RGB", (100, 100), color="red")
        image_file = io.BytesIO()
        image.save(image_file, format="JPEG")
        image_file.seek(0)
        return SimpleUploadedFile(
            name="test_document.jpg",
            content=image_file.read(),
            content_type="image/jpeg"
        )

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
    
    def test_user_can_make_document_request(self):
        token = self.authenticate_user()
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        url = reverse('user_detail')
        response = self.client.get(url, format="json")
        user_id = response.data["user_id"]

        payload = {
            "user_id": user_id,
            "description": "Verification document for user.",
            "file": self.generate_test_image(),
        }

        url = reverse('VerificationDocument')
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        response = self.client.post(url, data=payload, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UsersDocuments.objects.count(), 1)

        document = UsersDocuments.objects.first()
        self.assertEqual(document.user_id, user_id)
        self.assertEqual(document.description, payload["description"])
        self.assertIsNotNone(document.file)

        print("\n√ test_user_can_make_document_request passed!")

    def test_staff_can_update_document_request(self):
        # authenticate new user
        token = self.authenticate_user()
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        # grab user_id and verified status for new user
        url = reverse('user_detail')
        response = self.client.get(url, format="json")
        user_id = response.data["user_id"]
        verified = response.data["verified"]
        self.assertFalse(verified)
        # setup payload and create document object
        payload = {
            "user_id": user_id,
            "description": "Verification document for user.",
            "file": self.generate_test_image(),
        }
        url = reverse('VerificationDocument')
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        response = self.client.post(url, data=payload, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UsersDocuments.objects.count(), 1)
        document = UsersDocuments.objects.first()
        self.assertEqual(document.user_id, payload["user_id"])
        self.assertEqual(document.description, payload["description"])
        self.assertIsNotNone(document.file)

        # login as staff user
        login_response = self.client.post(self.login_url, {
            "email": "admin@example.com",
            "password": "adminpassword"
        }, format='json')
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", login_response.data)
        token = login_response.data["access_token"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        # staff user can update users account to approve (verified=True)
        url = reverse('VerificationDocument')
        response = self.client.patch(url, data={"user_id": user_id}, format="json")
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # relog in as the new user
        login_response = self.client.post(self.login_url, {
            "email": self.user_data["email"],
            "password": self.user_data["password"]
        }, format='json')

        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", login_response.data)
        token = login_response.data["access_token"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        url = reverse('user_detail')
        response = self.client.get(url, format="json")
        user_id2 = response.data["user_id"]
        verified = response.data["verified"]
        self.assertEqual(user_id, user_id2)
        self.assertTrue(verified)

        print("\n√ test_staff_can_update_document_request passed!")