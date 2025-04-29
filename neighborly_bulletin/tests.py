from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from .models import BulletinPost

class BulletinPostTests(APITestCase):
    def setUp(self):
        # Create a test user
        User = get_user_model()
        self.user = User.objects.create_user(
            email='testuser@example.com',
            name='Test User',
            phone_number='1234567890',
            address='123 Test St',
            neighborhood='Test Neighborhood',
            account_type='regular',
            password='testpass'
        )

        self.post_data = {
            "user_id": str(self.user.user_id),
            "title": "Test Post",
            "content": "This is a test bulletin post.",
            "post_type": "announcement",
            "visibility": "public",
            "tags": "test,bulletin"
        }

    def test_create_bulletin_post_authenticated(self):
        self.client.force_authenticate(user=self.user)
        self.client.login(email='testuser@example.com', password='testpass')
        response = self.client.post('/bulletin/', self.post_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(BulletinPost.objects.count(), 1)

    def test_create_bulletin_post_unauthenticated(self):
        response = self.client.post('/bulletin/', self.post_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)  

    def test_list_bulletin_posts(self):
        BulletinPost.objects.create(**self.post_data)
        response = self.client.get('/bulletin/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_bulletin_post_detail(self):
        post = BulletinPost.objects.create(**self.post_data)
        response = self.client.get(f'/bulletin/{post.post_id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], "Test Post")