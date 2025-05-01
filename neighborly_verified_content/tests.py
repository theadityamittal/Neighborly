from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth import get_user_model
from .models import UsersDocuments
from PIL import Image
import io
from moto import mock_aws
import boto3
from django.test.utils import override_settings

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
            "city": 'Test City',
            "zip_code": "12345",
            "latitude": 40.7128,
            "longitude": -74.0060,
            "neighborhood": "Brooklyn",
            "account_type": "customer",
            "password": "password123",
            "verified": True
        }
        self.staff_user = get_user_model().objects.create_superuser(
            email="admin@example.com",
            name="Admin User",
            phone_number="9876543210",
            address="456 Admin Street, City",
            city="Admin City",
            zip_code="54321",
            latitude=40.7128,
            longitude=-74.0060,
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
        self.assertIn("access", login_response.data)
        return login_response.data["access"]

    @override_settings(
        DEFAULT_FILE_STORAGE='storages.backends.s3boto3.S3Boto3Storage',
        AWS_STORAGE_BUCKET_NAME='test-bucket',
        AWS_ACCESS_KEY_ID='testing',
        AWS_SECRET_ACCESS_KEY='testing',
        AWS_S3_REGION_NAME='us-east-1',
    )
    
    @mock_aws
    def test_user_can_make_document_request(self):

        s3 = boto3.client("s3", region_name="us-east-1")
        s3.create_bucket(Bucket="test-bucket")

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

    @override_settings(
        DEFAULT_FILE_STORAGE='storages.backends.s3boto3.S3Boto3Storage',
        AWS_STORAGE_BUCKET_NAME='test-bucket',
        AWS_ACCESS_KEY_ID='testing',
        AWS_SECRET_ACCESS_KEY='testing',
        AWS_S3_REGION_NAME='us-east-1',
    )
    @mock_aws
    def test_staff_can_update_document_request(self):


        s3 = boto3.client("s3", region_name="us-east-1")
        s3.create_bucket(Bucket="test-bucket")
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
        self.assertIn("access", login_response.data)
        token = login_response.data["access"]
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
        self.assertIn("access", login_response.data)
        token = login_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        url = reverse('user_detail')
        response = self.client.get(url, format="json")
        user_id2 = response.data["user_id"]
        verified = response.data["verified"]
        self.assertEqual(user_id, user_id2)
        self.assertTrue(verified)

        print("\n√ test_staff_can_update_document_request passed!")