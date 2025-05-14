from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import CustomUser
from PIL import Image
import io
from django.core.files.uploadedfile import SimpleUploadedFile
from moto import mock_aws
import boto3
from django.test import override_settings


class AuthenticationTests(APITestCase):

    def setUp(self):
<<<<<<< HEAD
        self.register_url = reverse('register')
        self.login_url = reverse('token_obtain_pair')
        self.token_refresh_url = reverse('token_refresh')
=======
        self.register_url = reverse("register")
        self.login_url = reverse("token_obtain_pair")
        self.token_refresh_url = reverse("token_refresh")
>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf

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
<<<<<<< HEAD
        self.client.post(self.register_url, self.user_data, format='json')
        # Login
        response = self.client.post(self.login_url, {
            "email": self.user_data["email"],
            "password": self.user_data["password"]
        }, format='json')
=======
        self.client.post(self.register_url, self.user_data, format="json")
        # Login
        response = self.client.post(
            self.login_url,
            {"email": self.user_data["email"], "password": self.user_data["password"]},
            format="json",
        )
>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.access = response.data["access"]
        self.refresh = response.data["refresh"]

    def test_user_information(self):
        # Register and login
<<<<<<< HEAD
        self.client.post(self.register_url, self.user_data, format='json')
        login_response = self.client.post(self.login_url, {
            "email": self.user_data["email"],
            "password": self.user_data["password"]
        }, format='json')

        access = login_response.data.get("access")
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + access)
        response = self.client.get(reverse('user_detail'), format='json')
=======
        self.client.post(self.register_url, self.user_data, format="json")
        login_response = self.client.post(
            self.login_url,
            {"email": self.user_data["email"], "password": self.user_data["password"]},
            format="json",
        )

        access = login_response.data.get("access")
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + access)
        response = self.client.get(reverse("user_detail"), format="json")
>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.user_data["email"])
        self.assertEqual(response.data["city"], self.user_data["city"])
        self.assertEqual(response.data["zip_code"], self.user_data["zip_code"])
<<<<<<< HEAD

    def test_user_update(self):
        # Register
        self.client.post(self.register_url, self.user_data, format='json')
        
        user = CustomUser.objects.get(email=self.user_data["email"])
        user.verified = True
        user.save()

        # Login
        login_response = self.client.post(self.login_url, {
            "email": self.user_data["email"],
            "password": self.user_data["password"]
        }, format='json')

        # Set token
        access = login_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + access)
=======

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
>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf
        updated_data = {
            "name": "James Bond",
            "phone_number": "0955554321",
            "city": "Gotham",
        }

<<<<<<< HEAD
        response = self.client.patch('/auth/update/', updated_data, format='json')
        
        # Verify update response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "User updated successfully")

        # Fetch updated info
        response_information = self.client.get(reverse('user_detail'), format='json')
        self.assertEqual(response_information.data["name"], updated_data["name"])
        self.assertEqual(response_information.data["city"], updated_data["city"])

    def test_refresh(self):
        self.client.post(self.register_url, self.user_data, format='json')
        login_response = self.client.post(self.login_url, {
            "email": self.user_data["email"],
            "password": self.user_data["password"]
        }, format='json')

        refresh = login_response.data.get("refresh")
        response = self.client.post(self.token_refresh_url, {
            "refresh": refresh
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
=======
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

    @override_settings(
        DEFAULT_FILE_STORAGE="storages.backends.s3boto3.S3Boto3Storage",
        AWS_STORAGE_BUCKET_NAME="test-bucket",
        AWS_ACCESS_KEY_ID="testing",
        AWS_SECRET_ACCESS_KEY="testing",
        AWS_S3_REGION_NAME="us-east-1",
    )
    @mock_aws
    def test_user_icon_upload(self):
        """Test user can upload icon"""
        # Create mock S3 bucket
        s3 = boto3.client("s3", region_name="us-east-1")
        s3.create_bucket(Bucket="test-bucket")

        # Register the user
        register_response = self.client.post(
            self.register_url, self.user_data, format="json"
        )
        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)

        # Set user as verified
        user = CustomUser.objects.get(email=self.user_data["email"])
        user.verified = True
        user.save()

        # Login
        login_response = self.client.post(
            self.login_url,
            {"email": self.user_data["email"], "password": self.user_data["password"]},
            format="json",
        )

        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn("access", login_response.data)
        access = login_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")

        image = Image.new("RGB", (100, 100), color="red")
        image_file = io.BytesIO()
        image.save(image_file, format="JPEG")
        image_file.seek(0)

        test_image = SimpleUploadedFile(
            name="test_icon.jpg", content=image_file.read(), content_type="image/jpeg"
        )

        # Update user with icon
        response = self.client.patch(
            "/auth/update/", data={"icon": test_image}, format="multipart"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "User updated successfully")

        # Verify icon was saved
        user.refresh_from_db()
        self.assertIsNotNone(user.icon)
        self.assertTrue(user.icon.name.startswith("users/"))

        print("\n✓ test_user_icon_upload passed!")
>>>>>>> 2853bf3805e39ed850dac0c989affcba4e0192cf
