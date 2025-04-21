from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import UsersDocuments
from PIL import Image
import io

# Create your tests here.
class DocumentTests(APITestCase):
    
    def setUp(self):
        self.register_url = reverse('register')
        # self.grab_service_data = reverse('grabServiceData')
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
    
    def generate_test_image(self):
        """Generate a valid in-memory image for testing."""
        image = Image.new("RGB", (100, 100), color="red")  # Create a red 100x100 image
        image_file = io.BytesIO()
        image.save(image_file, format="JPEG")
        image_file.seek(0)  # Reset file pointer to the beginning
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
        payload = {
            "user_id": "12345",
            "description": "Verification document for user.",
            "file": self.generate_test_image(),
        }

        url = reverse('VerificationDocument')
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        response = self.client.post(url, data=payload, format="multipart")
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UsersDocuments.objects.count(), 1)

        document = UsersDocuments.objects.first()
        self.assertEqual(document.user_id, payload["user_id"])
        self.assertEqual(document.description, payload["description"])
        self.assertIsNotNone(document.file)

        print("\n√ test_user_can_make_document_request passed!")