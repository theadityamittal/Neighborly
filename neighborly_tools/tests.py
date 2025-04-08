from django.test import TestCase
from .models import Tool, BorrowRequest
from django.utils import timezone
from rest_framework.test import APITestCase
from rest_framework import status 
from django.contrib.auth.models import User  
from rest_framework.test import APIClient

class ToolModelTest(TestCase):
    def setUp(self):
        self.tool = Tool.objects.create(
            owner_id="user123",
            name="Drill Machine",
            description="A powerful drill",
            condition="New",
            availability=True
        )

    def test_tool_creation(self):
        self.assertEqual(self.tool.name, "Drill Machine")
        self.assertTrue(self.tool.availability)

class BorrowRequestModelTest(TestCase):
    def setUp(self):
        self.tool = Tool.objects.create(
            owner_id="user123",
            name="Hammer",
            description="Heavy hammer",
            condition="Used",
            availability=True
        )
        self.borrow_request = BorrowRequest.objects.create(
            tool=self.tool,
            user_id="user456",
            borrow_date=timezone.now().date(),
            return_date=timezone.now().date()
        )

    def test_borrow_request_creation(self):
        self.assertEqual(self.borrow_request.tool.name, "Hammer")

class ToolTests(APITestCase):
    def setUp(self):
        # Create a user and log in
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client = APIClient()
        self.client.login(username='testuser', password='testpass')

        Tool.objects.create(name="Hammer", condition="New", owner_id="user1", description="A sturdy hammer", availability=True)
        Tool.objects.create(name="Electric Drill", condition="Used", owner_id="user2", description="A cordless drill", availability=True)
        Tool.objects.create(name="Screwdriver", condition="New", owner_id="user3", description="A manual screwdriver", availability=True)

    def test_tool_list(self):
        # Test if the endpoint returns the list of tools
        response = self.client.get('/tools/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)  # We created three tools in setup

    def test_filter_tool_by_condition(self):
        # Test filtering tools by condition
        response = self.client.get('/tools/?search=New')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Two tools with 'New' condition

    def test_filter_tool_by_name(self):
        # Test filtering tools by name
        response = self.client.get('/tools/?search=Drill')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Only one tool with name 'Electric Drill'

    def test_filter_tool_by_condition_and_name(self):
        # Test filtering by both condition and name
        response = self.client.get('/tools/?search=Drill&condition=Used')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # One 'Used' tool with name containing 'Drill'